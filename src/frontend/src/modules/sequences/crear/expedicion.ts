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

  /* ── Paso 2, las preguntas ───────────────────────────────────────────── */
  preguntas: Pregunta[];
  /** La que quedó al centro. Es la que el curso repite tres semanas. */
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
  temasObligatorios: "",
  oa: [],
  objetivos: "",
  evaluacion: [],
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
  preguntas: [],
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


/** Cuánto lleva llenado el paso 1, para mostrarlo sin obligar a nada. */
export function completitudPaso1(e: Expedicion): number {
  const campos = [
    e.docente,
    e.cursos.length ? "x" : "",
    e.estudiantes ? "x" : "",
    e.sesiones ? "x" : "",
    e.oa.length ? "x" : "",
    e.evaluacion.length ? "x" : "",
    e.problemaId || e.problemaPropioNombre || e.problemaPropio,
    e.asignaturas.length ? "x" : "",
    e.entorno ?? "",
    e.ubicacion,
  ];
  const llenos = campos.filter((c) => String(c).trim().length > 0).length;
  return Math.round((llenos / campos.length) * 100);
}
