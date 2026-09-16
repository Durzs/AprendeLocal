import type { Expedicion } from "./expedicion";
import type { RutaIA } from "./generar";
import { RUTAS } from "../rutas/catalogo";
import { BITACORA_VACIA, type Bitacora } from "../seguimiento/bitacora";

/**
 * Por dónde va la ruta en la sala.
 *
 * Hasta aquí el cuaderno terminaba cuando la ruta quedaba armada, y esa era
 * la mitad del trabajo. Una ruta de tres semanas se da en tres semanas: el
 * docente sale a terreno el martes, vuelve con datos, la semana siguiente
 * arma el producto. Entre una sesión y otra pasan siete días y otras cuatro
 * asignaturas. Cuando vuelve a abrir la plataforma, lo primero que necesita
 * saber no es qué dice la ruta: es dónde la dejó.
 *
 * LO QUE ESTO NO ES
 *
 * No es un porcentaje de cumplimiento ni un panel para que alguien de arriba
 * mire cuánto avanzó cada escuela. Es una marca que el docente se pone a sí
 * mismo, y por eso se puede desmarcar sin explicar por qué. Una semana que no
 * se dio porque llovió y no se pudo salir no es un incumplimiento: es un
 * martes de invierno en La Araucanía.
 *
 * Por lo mismo cada marca guarda la fecha. No para auditar, sino porque «la
 * salida fue el 12» es exactamente el dato que el docente necesita cuando
 * escribe el informe al final y ya no se acuerda.
 */

/** Una semana dada, con el día en que ocurrió. */
export type SemanaHecha = {
  /** El número de semana tal como viene en la ruta. */
  semana: number;
  /** Cuándo se dio, en formato ISO corto: «2026-09-15». */
  fecha: string;
  /** Lo que el docente quiera dejar anotado. Casi siempre queda vacío. */
  nota: string;
};

export type Avance = {
  hechas: SemanaHecha[];
  /**
   * Por dónde va el método, etapa por etapa.
   *
   * Vive dentro del avance y no en su propia llave porque se guarda, se sube y
   * se baja junto con lo demás: una sola columna, una sola sincronización, un
   * solo sitio donde mirar cuando algo no cuadre. Lo que hay dentro está en
   * §seguimiento/bitacora.ts.
   *
   * Las semanas de arriba y las etapas de aquí no son lo mismo, y por eso
   * conviven. Las semanas son el calendario y las trae la ruta armada; las
   * etapas son el método y valen igual con ruta o sin ella. Una etapa puede
   * ocupar tres semanas o media clase.
   */
  bitacora: Bitacora;
  /** Cuándo se tocó el seguimiento por última vez. */
  ultimoToque: string | null;
};

export const AVANCE_VACIO: Avance = {
  hechas: [],
  bitacora: BITACORA_VACIA,
  ultimoToque: null,
};

/**
 * Un avance guardado, con los campos que le falten puestos.
 *
 * Todo lo que se lee de `localStorage` o de la cuenta pasa por aquí. Un avance
 * escrito antes de que existiera la bitácora vuelve sin ese campo, y la
 * pantalla que lo recibe haría `bitacora[etapa]` sobre `undefined`. Mezclar
 * contra el vacío en un solo sitio evita tener que acordarse de hacerlo en los
 * tres que leen.
 */
export function normalizarAvance(crudo: unknown): Avance {
  if (!crudo || typeof crudo !== "object") return { ...AVANCE_VACIO };
  const a = crudo as Partial<Avance>;
  return {
    ...AVANCE_VACIO,
    ...a,
    hechas: Array.isArray(a.hechas) ? a.hechas : [],
    bitacora: a.bitacora && typeof a.bitacora === "object" ? a.bitacora : {},
  };
}

/** El día de hoy, en el formato corto que guardamos. */
export function hoy(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Las semanas que tiene la ruta que el docente está siguiendo.
 *
 * Puede venir de dos sitios y hay que mirar los dos en el orden correcto: si
 * hay una ruta armada con el modelo, esa manda; si no, la escrita que quedó
 * designada. Es la misma regla que usa la última lámina, y si cambiara en un
 * sitio y no en el otro el seguimiento marcaría semanas que no existen.
 */
export function semanasDe(e: Expedicion): { semana: number; titulo: string }[] {
  if (e.rutaIA) {
    return (e.rutaIA as RutaIA).fases.map((f) => ({
      semana: f.semana,
      titulo: f.titulo,
    }));
  }
  const escrita = e.rutaId ? RUTAS.find((r) => r.id === e.rutaId) : null;
  if (escrita) {
    return escrita.fases.map((f) => ({ semana: f.semana, titulo: f.titulo }));
  }
  return [];
}

/** Si esa semana ya está marcada. */
export function estaHecha(a: Avance, semana: number): boolean {
  return a.hechas.some((h) => h.semana === semana);
}

/** Marca o desmarca. Devuelve un avance nuevo, sin tocar el que entró. */
export function alternar(a: Avance, semana: number, fecha = hoy()): Avance {
  const ya = estaHecha(a, semana);
  return {
    ...a,
    hechas: ya
      ? a.hechas.filter((h) => h.semana !== semana)
      : [...a.hechas, { semana, fecha, nota: "" }].sort((x, y) => x.semana - y.semana),
    ultimoToque: new Date().toISOString(),
  };
}

/** Cambia la fecha de una semana ya marcada, para cuando se dio otro día. */
export function corregirFecha(a: Avance, semana: number, fecha: string): Avance {
  return {
    ...a,
    hechas: a.hechas.map((h) => (h.semana === semana ? { ...h, fecha } : h)),
    ultimoToque: new Date().toISOString(),
  };
}

/**
 * Qué decir del avance, en una línea.
 *
 * Se usa en el escritorio, que es donde el docente aterriza el lunes. No
 * devuelve un porcentaje: devuelve qué toca ahora, que es lo que resuelve el
 * minuto que tiene antes de entrar a la sala.
 */
export function resumen(e: Expedicion, a: Avance): string | null {
  const semanas = semanasDe(e);
  if (!semanas.length) return null;

  const hechas = semanas.filter((s) => estaHecha(a, s.semana)).length;
  if (hechas === 0) return `Sin empezar en la sala. Son ${semanas.length} semanas.`;
  if (hechas === semanas.length) return "Se dio entera. Queda el informe.";

  const siguiente = semanas.find((s) => !estaHecha(a, s.semana));
  return siguiente
    ? `Van ${hechas} de ${semanas.length}. Sigue: ${siguiente.titulo}`
    : `Van ${hechas} de ${semanas.length}.`;
}
