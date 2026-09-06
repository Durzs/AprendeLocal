/**
 * Las preguntas que sostienen una ruta, y de dónde salen.
 *
 * Esto no es un generador. El sistema no sabe cómo se llama el estero de esa
 * escuela ni qué le preocupa a esa comunidad; el docente sí. Lo que hace es
 * poner sobre la mesa las preguntas que la educación basada en el lugar hace
 * siempre, ya rellenas con lo que él escribió en el paso anterior, para que
 * las corrija. Corregir una frase concreta es mucho más fácil que escribir una
 * desde cero delante de una hoja en blanco.
 *
 * Las cuatro familias vienen de Sobel. En «Beyond Ecophobia» separa dos
 * momentos: entre los ocho y los once años el trabajo es explorar y conocer el
 * lugar; entre los doce y los quince aparece la acción social, hacer algo por
 * él. Una pregunta que le pide a un niño de nueve años que arregle la
 * contaminación del río le pide angustia, no ciencia. Una que le pide a uno de
 * catorce que solo dibuje el río lo deja corto. Por eso las preguntas salen
 * ordenadas por lo que el curso puede efectivamente hacer.
 */

import type { Entorno, Expedicion, Pregunta } from "./expedicion";

/** Lo que el docente escribió, ya limpio y con un respaldo si dejó el campo vacío. */
type Piezas = {
  lugar: string;
  fenomeno: string;
  producto: string;
  aQuien: string;
};

/**
 * Los nombres por entorno son un respaldo, no una suposición.
 *
 * Si el docente escribió «el estero Trailelfu», eso es lo que aparece en la
 * pregunta. Si no escribió nada todavía, la pregunta usa una palabra genérica
 * y se lee igual de bien, en vez de mostrar un hueco.
 */
const LUGAR_POR_ENTORNO: Record<Entorno, string> = {
  rio: "el río",
  bosque: "el bosque",
  campo: "el campo de al lado",
  costa: "la orilla",
  cordillera: "el cerro",
  pueblo: "el pueblo",
};

/**
 * Deja un campo en condiciones de ir dentro de una frase.
 *
 * Lo que el docente escribe no viene con forma de fragmento: escribe «El
 * estero Trailelfu, detrás de la cancha» y al meterlo tal cual sale «¿Qué se ve
 * en El estero Trailelfu, detrás de la cancha que no se vea…?», con la
 * mayúscula en medio y una aposición que descuadra la pregunta. Aquí se corta
 * por la primera coma, se baja la mayúscula del artículo y se quita el punto
 * final. La mayúscula solo baja si la primera palabra es artículo: «Trailelfu»
 * tiene que seguir con la suya.
 */
const ARTICULOS = ["el", "la", "los", "las", "un", "una", "unos", "unas"];

function fragmento(texto: string): string {
  let t = texto.trim().replace(/[.;]+$/, "");
  const coma = t.indexOf(",");
  if (coma > 8) t = t.slice(0, coma);
  const primera = t.split(/\s+/)[0] ?? "";
  if (ARTICULOS.includes(primera.toLowerCase())) {
    t = primera.toLowerCase() + t.slice(primera.length);
  }
  return t;
}

/**
 * Un fenómeno suele venir escrito como oración completa, no como sintagma.
 * Meterlo dentro de «¿Cuánto es X?» produce un engendro; por eso las preguntas
 * que lo usan lo ponen delante, como lo que él dijo, y preguntan después.
 */
function oracion(texto: string): string {
  const t = texto.trim().replace(/\s+/g, " ");
  if (!t) return "";
  return /[.!?]$/.test(t) ? t : `${t}.`;
}

function piezas(e: Expedicion): Piezas {
  const lugar = e.ubicacion.trim()
    ? fragmento(e.ubicacion)
    : (e.entorno ? LUGAR_POR_ENTORNO[e.entorno] : "") || "el lugar donde está la escuela";
  return {
    lugar,
    fenomeno: e.fenomeno.trim(),
    producto: e.producto.trim() ? fragmento(e.producto) : "lo que hagan",
    aQuien: "la comunidad",
  };
}

/** Las cuatro familias, en el orden en que Sobel las pondría. */
export type Familia = "mirar" | "medir" | "preguntar" | "devolver";

export const FAMILIAS: { id: Familia; titulo: string; porque: string }[] = [
  {
    id: "mirar",
    titulo: "Mirar de cerca",
    porque:
      "Antes de explicar nada hay que haber estado ahí. Esta pregunta se responde con los ojos y el cuaderno.",
  },
  {
    id: "medir",
    titulo: "Medir y comparar",
    porque:
      "Aquí entra la ciencia del programa: una cantidad, una diferencia, un número que antes no existía.",
  },
  {
    id: "preguntar",
    titulo: "Preguntar a quien sabe",
    porque:
      "El lugar tiene memoria y esa memoria está en personas, no en internet. Esta pregunta se le hace a alguien.",
  },
  {
    id: "devolver",
    titulo: "Devolver algo",
    porque:
      "Lo que el curso averiguó le sirve a alguien de afuera. Sin destinatario real, el trabajo termina en la mochila.",
  },
];

/** Una propuesta: la pregunta, de qué familia es y por qué está ahí. */
export type Propuesta = {
  id: string;
  familia: Familia;
  texto: string;
};

/**
 * Arma las propuestas con lo que el docente escribió.
 *
 * Son plantillas, y se nota: por eso la diapositiva las presenta como
 * borradores para reescribir y no como el resultado. La que quede escrita con
 * las palabras del docente siempre va a ser mejor que la que salga de aquí.
 */
export function proponer(e: Expedicion): Propuesta[] {
  const p = piezas(e);
  // Cuando el docente contó el fenómeno, las preguntas de medir lo ponen
  // delante como oración suya y preguntan después. Cuando no lo contó, se
  // arreglan sin él en vez de dejar un hueco.
  const dijo = p.fenomeno ? `${oracion(p.fenomeno)} ` : "";

  return [
    {
      id: "mirar-1",
      familia: "mirar",
      texto: `¿Qué se ve en ${p.lugar} que no se vea desde la sala?`,
    },
    {
      id: "mirar-2",
      familia: "mirar",
      texto: `¿En qué cambia ${p.lugar} entre la mañana y la tarde?`,
    },
    {
      id: "medir-1",
      familia: "medir",
      texto: p.fenomeno
        ? `${dijo}¿Cuánto es, y con qué se puede comparar?`
        : `¿Qué se puede medir en ${p.lugar} que nadie haya medido?`,
    },
    {
      id: "medir-2",
      familia: "medir",
      texto: p.fenomeno
        ? `${dijo}¿Alcanza para lo que la escuela necesita?`
        : `¿Cuánto cambia ${p.lugar} de una estación a otra?`,
    },
    {
      id: "preguntar-1",
      familia: "preguntar",
      texto: `¿Cómo era ${p.lugar} cuando nuestros abuelos tenían nuestra edad?`,
    },
    {
      id: "preguntar-2",
      familia: "preguntar",
      texto: p.fenomeno
        ? `${dijo}¿Quién de por aquí lo ha visto pasar antes, y qué nos puede contar?`
        : `¿Quién de por aquí conoce ${p.lugar} mejor que nadie?`,
    },
    {
      id: "devolver-1",
      familia: "devolver",
      texto: `¿A quién le sirve saber esto, y cómo se lo entregamos?`,
    },
    {
      id: "devolver-2",
      familia: "devolver",
      texto: `¿Qué cambiaría en ${p.lugar} si ${p.aQuien} supiera lo que averiguamos?`,
    },
  ];
}

/** Convierte una propuesta en una pregunta de la expedición, sin elegirla aún. */
export function desdePropuesta(p: Propuesta): Pregunta {
  return { id: p.id, texto: p.texto, origen: "propuesta", elegida: false };
}

/** Una pregunta escrita a mano por el docente. */
export function propia(texto: string): Pregunta {
  return {
    id: `docente-${Date.now().toString(36)}`,
    texto,
    origen: "docente",
    elegida: true,
  };
}

/**
 * Si una pregunta sirve para sostener tres semanas de trabajo.
 *
 * No es corrección de estilo: es lo único que separa una pregunta que abre
 * trabajo de una que se contesta con sí o no y deja al curso sin nada que
 * hacer el martes siguiente.
 */
export function reparos(texto: string): string[] {
  const t = texto.trim();
  const dichos: string[] = [];
  if (t.length < 12) return ["Está muy corta para saber qué pide."];

  const primera = t.replace(/^[¿¡\s]+/, "").split(/\s+/)[0]?.toLowerCase() ?? "";
  const cerradas = ["es", "son", "está", "estan", "están", "hay", "tiene", "tienen", "puede", "pueden"];
  if (cerradas.includes(primera)) {
    dichos.push("Se contesta con sí o no. Prueba con «cuánto», «cómo» o «por qué».");
  }
  if (!/\?/.test(t)) {
    dichos.push("Le falta el signo de cierre, y con él se pierde que es una pregunta.");
  }
  if (t.split(/\s+/).length > 28) {
    dichos.push("Es larga. Si no se puede repetir de memoria, el curso no la va a repetir.");
  }
  return dichos;
}
