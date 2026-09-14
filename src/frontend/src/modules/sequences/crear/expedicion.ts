/**
 * La expedición: lo que el docente va escribiendo mientras arma su ruta.
 *
 * Antes «crear una ruta» era un formulario largo que se enviaba a un modelo y
 * devolvía un texto. Ahora es un recorrido por diapositivas, y esto es lo que
 * el recorrido acumula. Cada diapositiva lee y escribe aquí, así que el
 * docente puede ir y volver sin perder lo escrito.
 *
 * Se guarda en el navegador después de cada cambio. En una escuela rural la
 * luz se corta y la sesión se cierra sola; que el trabajo de veinte minutos
 * dependa de que nada de eso pase es pedir demasiado.
 */

import type { RutaIA } from "./generar";

const LLAVE = "aprendelocal:expedicion";

/** Cómo el curso va a mostrar lo que aprendió. */
export type Evaluacion =
  | "cuaderno"
  | "presentacion"
  | "producto"
  | "rubrica"
  | "observacion";

/** Dónde queda la escuela, en términos de lo que se puede caminar. */
export type Entorno = "rio" | "bosque" | "campo" | "costa" | "cordillera" | "pueblo";

export type PreguntaOrigen = "propuesta" | "docente";

/** Una pregunta candidata a sostener la ruta. */
export type Pregunta = {
  id: string;
  texto: string;
  /** `propuesta` la escribió el sistema; `docente` la escribió o reescribió él. */
  origen: PreguntaOrigen;
  elegida: boolean;
};

export type Expedicion = {
  /* ── Paso 1, lo que pide el programa ─────────────────────────────────── */
  docente: string;
  cursos: string[];
  estudiantes: number | null;
  semanas: number | null;
  temasObligatorios: string;
  /**
   * Los códigos que marcó en la lista: «OA12_CN_5». Es la parte sugerida.
   * De aquí sale la ruta que se le arma, así que no es un dato de adorno.
   */
  oa: string[];
  /** Lo que él agrega con sus palabras. Es la parte que pone la escuela. */
  objetivos: string;
  evaluacion: Evaluacion[];

  /* ── Paso 1, la problemática ─────────────────────────────────────────── */
  /**
   * De dónde arranca el proyecto.
   *
   * Antes esta parte eran cinco cuadros de texto en blanco —asignatura,
   * temáticas, fenómeno local, qué se podría averiguar, producto final— puestos
   * delante de alguien que abrió la aplicación justamente para que le ayudaran
   * a pensar. Eso no es recoger información: es pedirle el trabajo hecho.
   *
   * Ahora elige una problemática que ya está ocurriendo y de la que ya se
   * escribió, o propone la suya. Lo demás sale de ahí.
   */
  problemaId: string | null;
  /** Cuando ninguna de las del catálogo es la suya. */
  problemaPropio: string;
  /** Las notas de prensa de su zona, pegadas por él. */
  noticias: { titular: string; url: string }[];
  /** Desde qué asignaturas se entra. Abre ángulos distintos del mismo problema. */
  asignaturas: string[];
  entorno: Entorno | null;
  ubicacion: string;
  /**
   * Cómo se ve la problemática aquí, en una frase.
   *
   * Es lo único que sobrevive de los cinco cuadros, porque es lo único que la
   * plataforma no puede saber: la problemática la elige de una lista, pero
   * cómo se manifiesta en ESTE sitio solo lo sabe quien está ahí.
   */
  fenomeno: string;

  /* ── Paso 2, las preguntas ───────────────────────────────────────────── */
  preguntas: Pregunta[];
  /** La que quedó al centro. Es la que el curso repite tres semanas. */
  preguntaGuia: string;

  /* ── Paso 3, la ruta y el curso ──────────────────────────────────────── */
  /**
   * La ruta armada para esta escuela, con los huecos que el docente llena.
   * Cuando está puesta, manda sobre `rutaId`: la escrita pasa a ser el plan B.
   */
  rutaIA: RutaIA | null;
  rutaId: string | null;

  /* ── Paso 3, lo que decide el curso ──────────────────────────────────── */
  /**
   * Qué van a construir, y para quién exactamente.
   *
   * Antes el producto venía puesto por la ruta escrita —«un informe de una
   * plana»— y esa es la decisión que más le importa a un curso: con el formato
   * decidido de antemano no hay proyecto, hay tarea larga. Se guarda vacío y
   * se llena después de volver del terreno, porque hasta que no sepan qué
   * encontraron no pueden saber qué hacer con ello.
   */
  formato: string | null;
  /** A quién le sirve. Con nombre: «la comunidad» no es un destinatario. */
  destinatario: string;
};

export const VACIA: Expedicion = {
  docente: "",
  cursos: [],
  estudiantes: null,
  semanas: null,
  temasObligatorios: "",
  oa: [],
  objetivos: "",
  evaluacion: [],
  problemaId: null,
  problemaPropio: "",
  noticias: [],
  asignaturas: [],
  entorno: null,
  ubicacion: "",
  fenomeno: "",
  preguntas: [],
  preguntaGuia: "",
  rutaIA: null,
  rutaId: null,
  formato: null,
  destinatario: "",
};

/**
 * Lee lo guardado.
 *
 * En una ventana privada `localStorage` no falla al leer: lanza. Por eso todo
 * va envuelto, y si algo sale mal se empieza en blanco en vez de dejar la
 * página muerta.
 */
export function leer(): Expedicion {
  try {
    const crudo = localStorage.getItem(LLAVE);
    if (!crudo) return { ...VACIA };
    const guardado = JSON.parse(crudo) as Partial<Expedicion>;
    // Se mezcla contra VACIA para que una versión vieja del objeto, guardada
    // antes de que existiera un campo, no deje ese campo en undefined.
    return { ...VACIA, ...guardado };
  } catch {
    return { ...VACIA };
  }
}

export function guardar(e: Expedicion): void {
  try {
    localStorage.setItem(LLAVE, JSON.stringify(e));
  } catch {
    /* Sin espacio o sin permiso. La expedición sigue en memoria. */
  }
}

export function borrar(): void {
  try {
    localStorage.removeItem(LLAVE);
  } catch {
    /* Da igual: si no se pudo borrar, la próxima escritura la reemplaza. */
  }
}


/** Cuánto lleva llenado el paso 1, para mostrarlo sin obligar a nada. */
export function completitudPaso1(e: Expedicion): number {
  const campos = [
    e.docente,
    e.cursos.length ? "x" : "",
    e.estudiantes ? "x" : "",
    e.semanas ? "x" : "",
    e.oa.length ? "x" : "",
    e.evaluacion.length ? "x" : "",
    e.problemaId || e.problemaPropio,
    e.asignaturas.length ? "x" : "",
    e.entorno ?? "",
    e.ubicacion,
    e.fenomeno,
  ];
  const llenos = campos.filter((c) => String(c).trim().length > 0).length;
  return Math.round((llenos / campos.length) * 100);
}
