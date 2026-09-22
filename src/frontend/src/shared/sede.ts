/**
 * La sede: qué edición de la plataforma le toca a cada cuenta.
 *
 * QUÉ DECIDE Y QUÉ NO
 *
 * No es la nacionalidad de la persona. Es de qué país es la escuela donde va a
 * sacar a su curso, que es lo que manda sobre todo lo demás: el currículum que
 * tiene que cubrir, las problemáticas que le sirven, las especies que va a
 * encontrar y los papeles que le pide su ministerio. Un docente chileno de
 * intercambio en Río trabaja con la edición brasileña.
 *
 * POR QUÉ NO BASTABA EL IDIOMA
 *
 * La plataforma ya tenía conmutador de idioma y las tres traducciones de la
 * interfaz. Eso mueve 685 cadenas: los botones, los menús, los mensajes de
 * error. Lo que no mueve son las 9.431 líneas del cuaderno, que están escritas
 * en español y en chileno: los Objetivos de Aprendizaje de las Bases
 * Curriculares, once problemáticas con sus noticias, las especies nativas con
 * su nombre en mapuzugun y los dos formularios de la Superintendencia de
 * Educación. Poner esa pantalla en portugués deja a un docente carioca con una
 * interfaz traducida y un contenido que no es el suyo, que es peor que dejarla
 * en español, porque parece que le sirve.
 *
 * Por eso la sede es un campo aparte del idioma. Hoy decide el idioma; cuando
 * exista el corpus brasileño, decidirá de cuál de los dos se lee.
 *
 * DÓNDE VIVE
 *
 * En `profiles.sede` y, copiada, en los metadatos de auth. Lo segundo no es
 * duplicación por comodidad: el idioma de la interfaz se decide al cargar la
 * página, y los metadatos vienen dentro de la sesión, mientras que `profiles`
 * pide una consulta. Leerla de la base significaría pintar la pantalla en
 * español y cambiarla a portugués medio segundo después, delante de la
 * persona. Ver la migración 0007.
 */

/** Las ediciones que existen. */
export type Sede = "cl" | "br";

export const SEDES: Record<Sede, {
  nombre: string;
  /** El idioma con el que entra una cuenta de esta sede. */
  idioma: string;
  /** Dónde está el piloto, para decirlo en pantalla sin inventar alcance. */
  donde: string;
  /** Si su corpus de contenido ya existe. */
  conCorpus: boolean;
}> = {
  cl: {
    nombre: "Chile",
    idioma: "es",
    donde: "La Araucanía",
    conCorpus: true,
  },
  br: {
    nombre: "Brasil",
    idioma: "pt",
    donde: "Rio de Janeiro",
    // Todavía no. Mientras sea `false`, la pantalla lo dice en vez de servir
    // el contenido chileno como si fuera el suyo.
    conCorpus: false,
  },
};

export const SEDE_POR_DEFECTO: Sede = "cl";

/** Si un valor cualquiera es una sede conocida. */
export function esSede(v: unknown): v is Sede {
  return v === "cl" || v === "br";
}

/**
 * La sede de quien tiene la sesión abierta.
 *
 * Se lee de los metadatos del usuario, que llegan dentro de la sesión. Una
 * cuenta sin sede declarada es chilena, que es lo que había antes de que este
 * campo existiera.
 */
export function sedeDe(metadatos: unknown): Sede {
  const m = metadatos as { sede?: unknown } | null | undefined;
  return esSede(m?.sede) ? m.sede : SEDE_POR_DEFECTO;
}

/* ── El idioma, y quién manda sobre él ─────────────────────────────────── */

/**
 * La llave que marca que el idioma lo eligió la persona a mano.
 *
 * Hacen falta dos llaves y no una. `app:lang` guarda el idioma efectivo y lo
 * escribe también el detector al arrancar, así que su presencia no distingue
 * «lo elegí yo» de «se puso solo». Sin esa distinción, entrar con una cuenta
 * brasileña desde un navegador que ya había visitado la portada en español
 * dejaría la sesión en español para siempre; o, al revés, forzar el idioma de
 * la sede en cada entrada le pisaría la elección a quien sí la hizo.
 */
const LLAVE_ELEGIDO = "app:lang:elegido";

/** Marca que el idioma actual es una decisión de la persona. Lo llama el conmutador. */
export function recordarIdiomaElegido(): void {
  try {
    localStorage.setItem(LLAVE_ELEGIDO, "1");
  } catch {
    /* Ventana privada. Se pierde la preferencia, no la sesión. */
  }
}

function eligioIdioma(): boolean {
  try {
    return localStorage.getItem(LLAVE_ELEGIDO) === "1";
  } catch {
    return false;
  }
}

/**
 * Qué idioma corresponde al entrar, o `null` si no hay que tocar nada.
 *
 * Devuelve `null` cuando la persona ya eligió idioma a mano: esa decisión es
 * suya y no la revierte una sesión nueva.
 */
export function idiomaAlEntrar(sede: Sede, idiomaActual: string): string | null {
  if (eligioIdioma()) return null;
  const debido = SEDES[sede].idioma;
  return idiomaActual.split("-")[0] === debido ? null : debido;
}
