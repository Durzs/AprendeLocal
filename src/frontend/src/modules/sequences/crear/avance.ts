import type { Expedicion, Semana } from "./expedicion";
import { BITACORA_VACIA, type Bitacora } from "../seguimiento/bitacora";

/**
 * Por dónde va el proyecto en la sala, en dos escalas.
 *
 * El cuaderno terminaba cuando la ruta quedaba armada, y esa era la mitad del
 * trabajo. Un proyecto de diez clases se da en diez clases: se sale a terreno
 * un martes, se vuelve con datos, la semana siguiente se arma el producto.
 * Entre una y otra pasan siete días y otras cuatro asignaturas. Cuando el
 * docente vuelve a abrir esto, lo primero que necesita saber no es qué dice la
 * ruta: es dónde la dejó.
 *
 * LAS DOS ESCALAS
 *
 * `hechas` son las clases dadas, que es el calendario y contesta qué toca el
 * martes. `bitacora` son las seis etapas del método, que contestan en qué parte
 * del proyecto está el curso. Una etapa puede ocupar tres clases o media, así
 * que ninguna se deduce de la otra.
 *
 * DE DÓNDE SALEN LAS CLASES
 *
 * Las escribe el docente, en `Expedicion.semanas`. Antes venían de la ruta que
 * armaba el modelo, y eso dejaba sin calendario a quien no tuviera cuenta o
 * señal. Aquí solo se guarda cuáles se dieron, referidas por el identificador
 * de cada una: así renombrar una clase o mover otra de sitio no descoloca las
 * marcas, cosa que sí pasaba cuando se guardaba el número de semana.
 *
 * LO QUE ESTO NO ES
 *
 * No es un porcentaje de cumplimiento ni un panel para que alguien de arriba
 * mire cuánto avanzó cada escuela. Es una marca que el docente se pone a sí
 * mismo, y por eso se puede desmarcar sin explicar por qué. Una clase que no se
 * dio porque llovió no es un incumplimiento: es un martes de invierno en La
 * Araucanía.
 *
 * Por lo mismo cada marca guarda la fecha. No para auditar, sino porque «la
 * salida fue el 12» es exactamente el dato que falta cuando, un mes después,
 * hay que escribir el informe y ya nadie se acuerda.
 */

/** Una clase dada, con el día en que ocurrió. */
export type SemanaHecha = {
  /** El identificador de la clase en `Expedicion.semanas`. */
  semana: string;
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
    // Las marcas del formato viejo guardaban el número de semana de una ruta
    // que ya no existe. Se descartan: una marca que no apunta a ninguna clase
    // no se puede mostrar ni quitar, y quedaría contando para siempre.
    hechas: Array.isArray(a.hechas)
      ? a.hechas.filter((h) => typeof h?.semana === "string")
      : [],
    bitacora: a.bitacora && typeof a.bitacora === "object" ? a.bitacora : {},
  };
}

/** El día de hoy, en el formato corto que guardamos. */
export function hoy(): string {
  return new Date().toISOString().slice(0, 10);
}

/* ── Las clases del plan: las escribe el docente ───────────────────────── */

/** Un identificador para una clase que el docente acaba de agregar. */
function nuevoId(): string {
  try {
    return crypto.randomUUID();
  } catch {
    return `c${Date.now()}${Math.random().toString(36).slice(2, 7)}`;
  }
}

/** Agrega una clase al final del plan. */
export function agregarSemana(e: Expedicion): Expedicion {
  const semanas = Array.isArray(e?.semanas) ? e.semanas : [];
  return { ...e, semanas: [...semanas, { id: nuevoId(), titulo: "" }] };
}

/** Le cambia el título a una clase. */
export function renombrarSemana(e: Expedicion, id: string, titulo: string): Expedicion {
  const semanas = Array.isArray(e?.semanas) ? e.semanas : [];
  return {
    ...e,
    semanas: semanas.map((s) => (s.id === id ? { ...s, titulo } : s)),
  };
}

/** Quita una clase del plan. Lo marcado se limpia aparte, en el avance. */
export function quitarSemana(e: Expedicion, id: string): Expedicion {
  const semanas = Array.isArray(e?.semanas) ? e.semanas : [];
  return { ...e, semanas: semanas.filter((s) => s.id !== id) };
}

/**
 * Las clases del plan.
 *
 * Existe para que las pantallas no lean el campo a pelo: el día que las clases
 * vengan de otro sitio, o se filtren, se cambia aquí y en ninguna otra parte.
 */
export function semanasDe(e: Expedicion): Semana[] {
  return Array.isArray(e?.semanas) ? e.semanas : [];
}

/** Si esa clase ya está marcada. */
export function estaHecha(a: Avance, semana: string): boolean {
  return a.hechas.some((h) => h.semana === semana);
}

/** Marca o desmarca. Devuelve un avance nuevo, sin tocar el que entró. */
export function alternar(a: Avance, semana: string, fecha = hoy()): Avance {
  const ya = estaHecha(a, semana);
  return {
    ...a,
    hechas: ya
      ? a.hechas.filter((h) => h.semana !== semana)
      : [...a.hechas, { semana, fecha, nota: "" }],
    ultimoToque: new Date().toISOString(),
  };
}

/** Cambia la fecha de una clase ya marcada, para cuando se dio otro día. */
export function corregirFecha(a: Avance, semana: string, fecha: string): Avance {
  return {
    ...a,
    hechas: a.hechas.map((h) => (h.semana === semana ? { ...h, fecha } : h)),
    ultimoToque: new Date().toISOString(),
  };
}

/**
 * Qué decir del calendario, en una línea.
 *
 * Se usa en el escritorio, que es donde el docente aterriza el lunes. No
 * devuelve un porcentaje: devuelve qué toca ahora, que es lo que resuelve el
 * minuto que tiene antes de entrar a la sala.
 */
export function resumen(e: Expedicion, a: Avance): string | null {
  const semanas = Array.isArray(e?.semanas) ? e.semanas : [];
  if (!semanas.length) return null;

  const hechas = semanas.filter((s) => estaHecha(a, s.id)).length;
  if (hechas === 0) return `Sin empezar en la sala. Son ${semanas.length} clases.`;
  if (hechas === semanas.length) return "Se dieron todas. Queda el informe.";

  const siguiente = semanas.find((s) => !estaHecha(a, s.id));
  return siguiente && siguiente.titulo.trim()
    ? `Van ${hechas} de ${semanas.length}. Sigue: ${siguiente.titulo}`
    : `Van ${hechas} de ${semanas.length}.`;
}
