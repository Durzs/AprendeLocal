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

const LLAVE = "aprendelocal:expedicion";

/**
 * Una clase del plan, con el título que le puso el docente.
 *
 * Antes las semanas venían de la ruta que armaba el modelo, así que un docente
 * sin cuenta o sin señal no tenía calendario. Ahora las escribe él, que además
 * es quien sabe si el 18 de septiembre le parte la unidad en dos.
 */
export type Semana = { id: string; titulo: string };

/*
 * Aquí estaban `Evaluacion`, `temasObligatorios` y `objetivos`. Los tres eran
 * campos del formulario largo que el cuaderno reemplazó: ninguna pantalla los
 * pedía ya, y `evaluacion` seguía contando para el porcentaje de avance, con
 * lo que un cuaderno con todo lleno se quedaba en 90% para siempre sin decir
 * qué faltaba. Cómo se evalúa se decide ahora con los indicadores y el formato
 * del producto, que sí se piden.
 */

/** Dónde queda la escuela, en términos de lo que se puede caminar. */
export type Entorno = "rio" | "bosque" | "campo" | "costa" | "cordillera" | "pueblo";

/*
 * Aquí estaban `Pregunta` y `PreguntaOrigen`, las candidatas que el sistema
 * proponía para que el docente las corrigiera. La lámina que las mostraba se
 * retiró y el arreglo se quedó guardándose vacío en cada expedición, sin que
 * nadie lo escribiera ni lo leyera. La pregunta que sí importa es una sola y
 * es `preguntaGuia`.
 */

/** Una actividad escrita por el docente, con sus objetivos. */
export type ActividadPropia = {
  /** Para poder editarla y borrarla sin depender de su posición. */
  id: string;
  asignatura: string;
  /** Qué se persigue, en una frase. Es lo que se lee en la columna. */
  enfoque: string;
  /** Qué averiguan concretamente. */
  queInvestigan: string;
  /** Los términos del programa que hacen falta. */
  conceptos: string[];
  /** Los objetivos que esta actividad abre, elegidos del catálogo. */
  oa: string[];
};

export type Expedicion = {
  /* ── Paso 1, lo que pide el programa ─────────────────────────────────── */
  docente: string;
  cursos: string[];
  estudiantes: number | null;
  /**
   * Cuántas clases dura, no cuántas semanas.
   *
   * Decía «semanas» y eso engaña en casi todas las asignaturas. Una profesora
   * de artes y tecnología lo dijo así en una entrevista: un proyecto de tres
   * semanas, en un ramo que se ve una vez por semana, son tres clases. Con
   * «tres semanas» en la cabeza uno planifica para nueve horas y tiene tres.
   *
   * Por eso se piden las dos cosas: cuántas clases y cuánto dura cada una. Con
   * eso se sabe el tiempo real, que es lo único que importa para decidir si un
   * proyecto cabe.
   */
  sesiones: number | null;
  /** Minutos de cada clase. 45 y 90 son los dos casos de siempre. */
  duracionSesion: number | null;
  /**
   * Los códigos que quedaron marcados: «OA12_CN_5».
   *
   * Se marcan en la segunda lámina, dentro de la problemática, y de dos
   * maneras: eligiéndolos en la tercera columna, o marcándolos dentro de una
   * actividad propia, que al guardarse los suma aquí. Este es el único sitio
   * del que leen los indicadores, la hoja que firma la dirección y los dos
   * permisos de la salida, así que un objetivo que no llegue aquí es un
   * objetivo que el docente marcó y no existe para el resto del cuaderno.
   */
  oa: string[];

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
  /**
   * Cuando ninguna de las del catálogo es la suya.
   *
   * Va con nombre aparte de la descripción porque el nombre es lo que después
   * encabeza la hoja que firma la dirección, los dos permisos de la salida y
   * la ruta. Antes era un solo cuadro de texto y ahí terminaba encabezando el
   * papeleo un párrafo entero.
   */
  problemaPropioNombre: string;
  problemaPropio: string;
  /**
   * Las actividades que escribe el docente, por asignatura.
   *
   * Existen por lo mismo que la problemática propia: el catálogo no puede
   * tener todos los casos, y quien tiene uno que no está no debería quedarse
   * con las dos columnas de al lado vacías. Cada una lleva sus objetivos, que
   * se eligen de los mismos 353, así que una actividad escrita a mano llega a
   * la hoja de dirección igual de completa que una del catálogo.
   *
   * También sirven para ajustar una del catálogo: se copia a esta lista con
   * sus datos puestos y desde ahí se edita, sin tocar el catálogo.
   */
  actividadesPropias: ActividadPropia[];
  /** Las notas de prensa de su zona, pegadas por él. */
  noticias: { titular: string; url: string }[];
  /** Desde qué asignaturas se entra. Abre ángulos distintos del mismo problema. */
  asignaturas: string[];

  /* ── Paso 2, lo que se enseña antes de salir ─────────────────────────── */
  /** Los términos del programa que va a pasar. Se proponen y él los corrige. */
  conceptos: string[];
  /**
   * Las técnicas de terreno que se ensayan en la sala antes de salir.
   *
   * Es la parte que más se salta, porque se supone que un curso ya sabe usar
   * un cuaderno o leer una tira de pH. No lo sabe, y aprenderlo en la orilla
   * de un río con viento es una hora perdida y un dato inservible.
   */
  tecnicas: string[];
  entorno: Entorno | null;
  ubicacion: string;

  /**
   * La pregunta que sostiene el proyecto y que el curso repite hasta el final.
   *
   * Se escribe en la etapa 1 de la bitácora, que es donde ocurre: sale de leer
   * la problemática con el curso, no de escribirla un domingo.
   *
   * Aquí al lado había un `preguntas: Pregunta[]`, con las candidatas que el
   * sistema proponía y el docente corregía. Esa lámina se retiró y el arreglo
   * se quedó: nadie lo escribía y nadie lo leía. Peor le fue a esta, que se
   * leía en ocho sitios y no se escribía en ninguno, así que el escritorio
   * decía «Falta la pregunta» para siempre y no había dónde ponerla.
   */
  preguntaGuia: string;

  /* ── Paso 2, lo que solo sabe quien ha estado ahí ────────────────────── */
  /**
   * A quién de la comunidad le preguntan, con nombre si se sabe.
   *
   * Estos tres venían como huecos dentro de la ruta que armaba el modelo, y
   * eran la única parte de esa ruta que no se podía generar: son justamente lo
   * que el modelo no puede saber. Al sacar la ruta armada se quedaron, porque
   * son ellos los que valían, y pasaron a ser campos del cuaderno como
   * cualquier otro. Los tres salen impresos en los papeles de la salida.
   */
  preguntarA: string;
  /** El punto exacto donde se para el curso, y cómo se llega. */
  puntoDeSalida: string;
  /** Qué hay que cuidar ahí. Es lo único que, si falta, alguien se lastima. */
  queCuidar: string;

  /* ── Paso 3, el plan de clases ───────────────────────────────────────── */
  /** Las clases del plan, en orden, tituladas por el docente. */
  semanas: Semana[];

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
  /**
   * De qué clase es ese destinatario: quien causa, quien sufre, quien decide,
   * el pueblo o la propia escuela. Se pregunta antes del nombre porque nadie
   * escribe un nombre concreto en una caja vacía, y sí lo escribe cuando ya
   * reconoció de qué clase es el suyo.
   */
  familiaDestinatario: string | null;
  /**
   * Qué se mira en la sala para saber si cada objetivo ocurrió, por código.
   *
   * Lo pidieron dos docentes por separado: un objetivo del programa no se
   * puede observar, y sin traducirlo a algo que se vea no hay con qué evaluar.
   * No son los indicadores oficiales del programa de estudio y se dice en
   * pantalla, porque esta hoja se copia en documentos que se firman.
   */
  indicadores: Record<string, string[]>;
  /** Edad, dónde están y qué necesitan. De aquí sale si el formato les llega. */
  rasgosDestinatario: { edad: string; donde: string; necesidad: string };
};

export const VACIA: Expedicion = {
  docente: "",
  cursos: [],
  estudiantes: null,
  sesiones: null,
  duracionSesion: null,
  oa: [],
  problemaId: null,
  problemaPropioNombre: "",
  problemaPropio: "",
  actividadesPropias: [],
  noticias: [],
  asignaturas: [],
  conceptos: [],
  tecnicas: [],
  entorno: null,
  ubicacion: "",
  preguntaGuia: "",
  preguntarA: "",
  puntoDeSalida: "",
  queCuidar: "",
  semanas: [],
  formato: null,
  destinatario: "",
  familiaDestinatario: null,
  indicadores: {},
  rasgosDestinatario: { edad: "", donde: "", necesidad: "" },
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


/**
 * Cuánto lleva llenado el cuaderno, para mostrarlo sin obligar a nada.
 *
 * DOS COSAS QUE ESTABAN MAL
 *
 * Se llamaba `completitudPaso1` y contaba campos de las dos primeras láminas,
 * así que en pantalla decía «va un 60% del primer paso» contando cosas que no
 * están en el primer paso. De ahí salía el mensaje que mandaba a marcar los
 * objetivos «en la primera lámina» cuando los objetivos se marcan en la
 * segunda.
 *
 * Y contaba `evaluacion`, que ningún campo del cuaderno escribe desde hace
 * varias versiones. El resultado era que un cuaderno con absolutamente todo
 * lleno se quedaba en 90% para siempre, sin decir qué faltaba, porque lo que
 * faltaba no se podía llenar.
 *
 * Se cuenta lo que el cuaderno pide de verdad, en el orden en que lo pide.
 */
export function completitud(e: Expedicion): number {
  const campos = [
    /* Lámina 1 */
    e.docente,
    e.cursos.length ? "x" : "",
    e.estudiantes ? "x" : "",
    e.sesiones ? "x" : "",
    e.duracionSesion ? "x" : "",
    /* Lámina 2 */
    e.ubicacion,
    e.entorno ?? "",
    e.problemaId || e.problemaPropioNombre || e.problemaPropio,
    e.asignaturas.length ? "x" : "",
    e.oa.length ? "x" : "",
    e.tecnicas.length ? "x" : "",
    e.puntoDeSalida,
    e.queCuidar,
    /* Lámina 3 */
    e.destinatario,
    e.formato ?? "",
  ];
  const llenos = campos.filter((c) => String(c).trim().length > 0).length;
  return Math.round((llenos / campos.length) * 100);
}
