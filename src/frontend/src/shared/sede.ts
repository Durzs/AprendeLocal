/**
 * La sede: qué edición de la plataforma le toca a cada persona.
 *
 * QUÉ DECIDE Y QUÉ NO
 *
 * No es la nacionalidad de la persona. Es de qué país es la escuela donde va a
 * sacar a su curso, que es lo que manda sobre todo lo demás: el currículum que
 * tiene que cubrir, las problemáticas que le sirven, las especies que va a
 * encontrar y los papeles que le pide su escuela. Un docente chileno de
 * intercambio en Río trabaja con la edición brasileña.
 *
 * DÓNDE ESTÁ CADA DIFERENCIA
 *
 * Todo lo que cambia de un país a otro cuelga de una de dos tablas, y de
 * ninguna otra parte:
 *
 *   - `SEDES`, aquí abajo: lo que necesita cualquier página (idioma, región,
 *     dónde se centra el mapa). Es chica y se carga siempre.
 *   - `CONTENIDOS`, en §modules/sequences/contenido: lo del cuaderno
 *     (currículum, cursos, problemáticas, papeles de la salida). Es grande y
 *     solo baja con el cuaderno.
 *
 * Agregar un país es agregar una entrada a cada tabla. TypeScript se niega a
 * compilar si falta una pieza, así que no se puede olvidar ninguna.
 *
 * CÓMO SE DECIDE LA SEDE
 *
 * Con cuenta, manda la cuenta: está en `profiles.sede` y, copiada, en los
 * metadatos de auth, que llegan con la sesión. Sin cuenta, en este orden:
 *
 *   1. La dirección. `/br` y `/cl` fijan la edición y vuelven al inicio. Es
 *      el enlace que Thais puede mandar por WhatsApp a sus colegas.
 *   2. Lo que la persona eligió antes en este navegador.
 *   3. El idioma del navegador: quien lo tiene en portugués ve la edición
 *      brasileña sin tener que buscarla.
 *   4. Chile, que es donde está el piloto.
 *
 * LA SEDE Y EL IDIOMA
 *
 * Cada sede trae su idioma, y la interfaz lo sigue mientras la persona no
 * haya elegido otro a mano. Además del de la sede se ofrece inglés para quien
 * mira el proyecto desde fuera; no se ofrece el español en la edición
 * brasileña ni al revés, porque un docente carioca con el cuaderno en español
 * no tiene nada que ganar y sí mucho que confundir.
 */

import { useSyncExternalStore } from "react";

/** Las ediciones que existen. */
export type Sede = "cl" | "br";

export type DatosSede = {
  /** Cómo se llama el país en su propio idioma. */
  nombre: string;
  /** El idioma de la interfaz y del contenido. */
  idioma: "es" | "pt";
  /** Para `Intl` y para el `lang` del documento. */
  locale: string;
  /** Dónde está el piloto, para decirlo en pantalla sin inventar alcance. */
  donde: string;
  /** Lo mismo, con la ciudad: va en el contacto y en el pie. */
  zona: string;
  /** Código ISO del país, para acotar la búsqueda de escuelas en el mapa. */
  pais: string;
  /**
   * Dónde se centra el mapa antes de que el docente busque su escuela:
   * [latitud, longitud, zoom].
   */
  centro: [number, number, number];
};

export const SEDES: Record<Sede, DatosSede> = {
  cl: {
    nombre: "Chile",
    idioma: "es",
    locale: "es-CL",
    donde: "La Araucanía, Chile",
    zona: "Temuco · La Araucanía, Chile",
    pais: "cl",
    centro: [-38.74, -72.6, 8],
  },
  br: {
    nombre: "Brasil",
    idioma: "pt",
    locale: "pt-BR",
    donde: "Rio de Janeiro, Brasil",
    zona: "Rio de Janeiro · RJ, Brasil",
    pais: "br",
    centro: [-22.91, -43.35, 10],
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

/* ── La sede activa ─────────────────────────────────────────────────────── */

const LLAVE_SEDE = "aprendelocal:edicion";

function leerGuardada(): Sede | null {
  try {
    const v = localStorage.getItem(LLAVE_SEDE);
    return esSede(v) ? v : null;
  } catch {
    return null;
  }
}

function guardar(s: Sede): void {
  try {
    localStorage.setItem(LLAVE_SEDE, s);
  } catch {
    /* Ventana privada: la elección dura lo que dure la pestaña. */
  }
}

/** Lo que dice el navegador, cuando no hay nada más. */
function porNavegador(): Sede | null {
  if (typeof navigator === "undefined") return null;
  const idiomas = navigator.languages?.length ? navigator.languages : [navigator.language];
  return idiomas.some((l) => l?.toLowerCase().startsWith("pt")) ? "br" : null;
}

/** La que manda la dirección, si la dirección manda alguna. */
function porDireccion(): Sede | null {
  if (typeof location === "undefined") return null;
  const primera = location.pathname.split("/")[1];
  if (esSede(primera)) return primera;
  const q = new URLSearchParams(location.search).get("edicion");
  return esSede(q) ? q : null;
}

/**
 * La sede con que arranca la página, antes de saber si hay sesión.
 *
 * La de la cuenta se guarda también aquí al entrar, así que en el mismo
 * computador la segunda visita ya arranca en la sede correcta y no hay que
 * esperar a la sesión para pintar en el idioma bueno.
 */
function inicial(): Sede {
  const d = porDireccion();
  if (d) {
    guardar(d);
    return d;
  }
  return leerGuardada() ?? porNavegador() ?? SEDE_POR_DEFECTO;
}

let actual: Sede = inicial();
/** Si la sede la fija una cuenta y no se puede cambiar desde el selector. */
let deCuenta = false;
const oyentes = new Set<() => void>();

function avisar() {
  for (const o of oyentes) o();
}

function suscribir(o: () => void) {
  oyentes.add(o);
  return () => {
    oyentes.delete(o);
  };
}

/** La sede activa, para leerla fuera de React (el guardado del cuaderno). */
export function sedeActual(): Sede {
  return actual;
}

/** Si la sede viene de la cuenta y el selector solo puede mostrarla. */
export function sedeFijadaPorCuenta(): boolean {
  return deCuenta;
}

/**
 * Cambia la edición de quien está mirando sin cuenta.
 *
 * Con sesión no hace nada: la sede de una cuenta decide qué currículum y qué
 * papeles se guardan en ella, y eso no se cambia desde un menú.
 */
export function elegirSede(s: Sede): void {
  if (deCuenta || s === actual) return;
  actual = s;
  guardar(s);
  avisar();
}

/**
 * La sede de la cuenta que acaba de entrar, o `null` al salir.
 *
 * Al salir se vuelve a lo que había en el navegador, que después de haber
 * entrado es la misma sede de la cuenta: quien cierra sesión en Río sigue
 * viendo la portada brasileña.
 */
export function fijarSedeDeCuenta(s: Sede | null): void {
  const antes = actual;
  const antesCuenta = deCuenta;
  if (s) {
    deCuenta = true;
    actual = s;
    guardar(s);
  } else {
    deCuenta = false;
    actual = leerGuardada() ?? actual;
  }
  if (antes !== actual || antesCuenta !== deCuenta) avisar();
}

/** La sede activa, y que el componente se repinte cuando cambie. */
export function useSede(): Sede {
  return useSyncExternalStore(suscribir, sedeActual, sedeActual);
}

/** Si el selector de edición puede cambiarla. */
export function useSedeFijada(): boolean {
  return useSyncExternalStore(suscribir, sedeFijadaPorCuenta, sedeFijadaPorCuenta);
}

/** Para quien necesita enterarse de un cambio sin ser un componente. */
export const suscribirSede = suscribir;

/**
 * La llave de `localStorage` de algo que es de una edición.
 *
 * Un proyecto chileno y uno carioca en el mismo computador —el de Diego, por
 * ejemplo, probando las dos— no pueden pisarse: los objetivos de uno no
 * existen en el currículum del otro. Chile conserva las llaves de siempre,
 * para que nadie pierda lo que ya tenía guardado.
 */
export function llaveDeSede(base: string, s: Sede = actual): string {
  return s === "cl" ? base : base.replace(/^aprendelocal:/, `aprendelocal:${s}:`);
}

/* ── El idioma, y quién manda sobre él ─────────────────────────────────── */

/**
 * La llave que marca que el idioma lo eligió la persona a mano.
 *
 * Hacen falta dos llaves y no una. `app:lang` guarda el idioma efectivo y lo
 * escribe también el detector al arrancar, así que su presencia no distingue
 * «lo elegí yo» de «se puso solo». Sin esa distinción, entrar con una cuenta
 * brasileña desde un navegador que ya había visitado la portada en español
 * dejaría la sesión en español para siempre.
 *
 * Solo queda puesta cuando la persona elige inglés. Elegir el idioma de la
 * sede es volver a lo normal, y entonces la marca se borra.
 */
const LLAVE_ELEGIDO = "app:lang:elegido";

/** Marca, o desmarca, que el idioma actual es una decisión de la persona. */
export function recordarIdiomaElegido(elegido = true): void {
  try {
    if (elegido) localStorage.setItem(LLAVE_ELEGIDO, "1");
    else localStorage.removeItem(LLAVE_ELEGIDO);
  } catch {
    /* Ventana privada. Se pierde la preferencia, no la sesión. */
  }
}

export function eligioIdioma(): boolean {
  try {
    return localStorage.getItem(LLAVE_ELEGIDO) === "1";
  } catch {
    return false;
  }
}

/** Los idiomas que se ofrecen en una sede: el suyo y el inglés. */
export function idiomasDe(s: Sede): string[] {
  return [SEDES[s].idioma, "en"];
}

/**
 * Qué idioma corresponde, o `null` si no hay que tocar nada.
 *
 * Devuelve `null` cuando la persona eligió idioma a mano y ese idioma se
 * ofrece en su sede: esa decisión es suya. Si tiene puesto uno que su sede
 * no ofrece —el español, en una cuenta brasileña— se corrige.
 */
export function idiomaDebido(s: Sede, idiomaActual: string): string | null {
  const base = (idiomaActual || "").split("-")[0];
  if (eligioIdioma() && idiomasDe(s).includes(base)) return null;
  const debido = SEDES[s].idioma;
  return base === debido ? null : debido;
}
