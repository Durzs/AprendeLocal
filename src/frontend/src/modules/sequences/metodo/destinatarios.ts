import type { Idioma } from "../../../shared/tx";
import { FAMILIAS_PT, RASGOS_PT } from "./destinatarios.pt";

/**
 * A quién le llega lo que el curso construye.
 *
 * POR QUÉ ESTO DEJÓ DE SER UNA CAJA DE TEXTO
 *
 * Era un campo vacío que decía «a quién le sirve, con nombre», con la
 * advertencia de que la comunidad no es un nombre. La advertencia estaba bien
 * y no servía de nada, porque el problema no es que no sepan que hay que
 * concretar: es que no saben cómo.
 *
 * Lo dijo una profesora que lleva tres años pidiendo exactamente esto en
 * tecnología: cuando pregunta quién es el usuario, le contestan «para todos»,
 * «cualquier persona», «la comunidad». Y su diagnóstico fue el que importa:
 * con una barra de texto se escribe «la comunidad», y lo que hace falta son
 * criterios, opciones para elegir, no un hueco.
 *
 * Así que hay cinco familias de destinatario y cada una trae ejemplos con
 * nombre. No para elegir uno de la lista y seguir, sino para reconocer de qué
 * clase es el suyo y bajarlo a un nombre propio.
 *
 * Y DESPUÉS EL FORMATO, NO ANTES
 *
 * La otra mitad de lo mismo. Antes se elegía el formato y el destinatario casi
 * a la vez, y las preguntas de la sala ya hablaban de «la campaña» cuando
 * nadie había decidido todavía que fuera una campaña.
 *
 * Va al revés: primero a quién, después qué. El argumento es de ella y es
 * bueno: una campaña en redes sociales funciona si son adolescentes con
 * teléfono, y no funciona con una comunidad rural de pescadores donde no llega
 * el wifi, por buena que sea la campaña. Por eso cada familia dice qué
 * formatos le llegan y cuáles no, y el que no llega queda marcado en pantalla
 * en vez de desaparecer: descartar con argumento enseña más que no ver la
 * opción.
 */

/** Las cinco clases de destinatario que aparecen una y otra vez. */
export type Familia = {
  id: string;
  nombre: string;
  /** Quién es, dicho de manera que se pueda reconocer al de uno. */
  quienEs: string;
  /** Nombres propios de verdad, del mundo rural chileno. */
  ejemplos: string[];
  /** Qué hace que esta gente se detenga a mirar algo. */
  queLesMueve: string;
  /** Ids de `FORMATOS` que llegan a esta gente. */
  llegan: string[];
  /** Ids de `FORMATOS` que no le llegan, y por qué. */
  noLlegan: { formato: string; porQue: string }[];
};

export const FAMILIAS: Familia[] = [
  {
    id: "causan",
    nombre: "Quien está causando el problema",
    quienEs:
      "La persona, la empresa o el servicio de cuya actividad sale el problema. Es el destinatario más incómodo y el que más cambia las cosas si contesta.",
    ejemplos: [
      "El dueño del predio que riega con el agua del estero",
      "La empresa sanitaria que opera la planta",
      "El camión que descarga escombro en la quebrada",
      "El municipio, cuando el problema es un servicio que no pasa",
    ],
    queLesMueve:
      "Que el dato esté bien tomado y que haya alguien más mirando. A un particular le mueve el trato directo; a una empresa o a un servicio, que la cosa quede por escrito y con copia.",
    llegan: ["informe", "mural", "video"],
    noLlegan: [
      {
        formato: "campana_redes",
        porQue:
          "Una campaña en redes se lee como denuncia pública y cierra la conversación antes de empezarla. Sirve después, si no contestan.",
      },
    ],
  },
  {
    id: "afectados",
    nombre: "Quien está sufriendo el problema",
    quienEs:
      "Los que ya viven con esto encima y muchas veces ya lo sabían. No hay que convencerlos de que existe: hay que darles algo que puedan usar.",
    ejemplos: [
      "Las familias que se abastecen del pozo",
      "Los pescadores o recolectores de la caleta",
      "Los vecinos de la calle donde se junta la basura",
      "Los usuarios del comité de agua potable rural",
    ],
    queLesMueve:
      "Que les sirva para algo concreto: saber a quién reclamar, qué hacer mientras tanto, o tener el papel que antes no tenían.",
    llegan: ["guia", "taller", "radio", "intervencion"],
    noLlegan: [
      {
        formato: "informe",
        porQue:
          "Un informe se le entrega a quien decide, no a quien padece. A esta gente le llega algo que se lleva en la mano y se usa.",
      },
    ],
  },
  {
    id: "decide",
    nombre: "Quien puede decidir que cambie",
    quienEs:
      "La autoridad o la organización que tiene la atribución de hacer algo. Es poca gente y se les habla distinto: con cifras, corto y por conducto.",
    ejemplos: [
      "El concejo municipal o un concejal",
      "La dirección de obras o la de medio ambiente del municipio",
      "La seremi de Salud o de Medio Ambiente",
      "La directiva de la junta de vecinos o del comité de agua",
    ],
    queLesMueve:
      "Una cifra que no tenían, tomada en un lugar que pueden ubicar, y una petición de una sola cosa. Dos peticiones ya es ninguna.",
    llegan: ["informe", "coleccion"],
    noLlegan: [
      {
        formato: "mural",
        porQue:
          "Un mural no entra a una oficina ni queda en acta. Sirve para que la presión exista alrededor, no para que la decisión se tome.",
      },
    ],
  },
  {
    id: "comunidad",
    nombre: "La gente del pueblo que todavía no lo mira",
    quienEs:
      "Los que pasan por al lado del problema todos los días sin registrarlo. No son víctimas ni culpables: son los que tendrían que estar mirando y no miran.",
    ejemplos: [
      "Quien pasa por la plaza un día de feria",
      "Los que esperan en el consultorio o en el paradero",
      "Los socios de la junta de vecinos en su reunión mensual",
      "Los que escuchan la radio local en la mañana",
    ],
    queLesMueve:
      "Encontrárselo sin haberlo buscado, en un sitio por el que ya iban a pasar. A esta gente no se la convoca: se la intercepta.",
    llegan: ["exposicion", "mural", "radio", "intervencion"],
    noLlegan: [
      {
        formato: "informe",
        porQue:
          "Nadie que va a comprar a la feria se detiene a leer un informe. Lo que funciona aquí se ve de lejos y se entiende de paso.",
      },
    ],
  },
  {
    id: "otros_cursos",
    nombre: "Otros cursos y las familias de la escuela",
    quienEs:
      "El destinatario más cercano y el más subestimado. Tiene la ventaja de que se puede ensayar con él y de que la entrega ocurre seguro.",
    ejemplos: [
      "Los cursos de abajo, en una hora de clase cedida",
      "Las familias, en la reunión de apoderados",
      "La escuela vecina, si hay cómo juntarse",
      "Los profesores de otras asignaturas, en el consejo",
    ],
    queLesMueve:
      "Que se los expliquen personas de su edad o sus propios hijos. Es el único destinatario que pregunta de vuelta, y eso vale más que el alcance.",
    llegan: ["taller", "exposicion", "coleccion", "video"],
    noLlegan: [
      {
        formato: "campana_redes",
        porQue:
          "Para gente que se ve todos los días en el patio, una campaña en redes es el camino largo hacia una conversación que se puede tener de frente.",
      },
    ],
  },
];

/** Las familias en el idioma que toca. El portugués está en §destinatarios.pt.ts. */
export function familiasEn(idioma: Idioma): Familia[] {
  return idioma === "pt" ? FAMILIAS_PT : FAMILIAS;
}

export function familiaPorId(id: string, idioma: Idioma = "es"): Familia | undefined {
  return familiasEn(idioma).find((f) => f.id === id);
}

/**
 * Lo que hay que saber del destinatario antes de decidir el formato.
 *
 * Son tres y no más, y son los tres que ella nombró: la edad, dónde están, y
 * qué necesidad tienen en común. Con esos tres contestados, la elección del
 * formato deja de ser cuestión de gusto: si la respuesta a la segunda es «no
 * hay señal en el sector», la campaña en redes se cae sola y el curso puede
 * decir por qué.
 */
export const RASGOS: { id: keyof Rasgos; pregunta: string; ayuda: string; ejemplo: string }[] = [
  {
    id: "edad",
    pregunta: "¿Qué edad tienen?",
    ayuda:
      "Cambia el formato entero. Lo que detiene a alguien de quince años no detiene a alguien de setenta.",
    ejemplo: "Entre 40 y 70, la mayoría sobre 50",
  },
  {
    id: "donde",
    pregunta: "¿Dónde están y qué miran en el día?",
    ayuda:
      "Aquí es donde se cae la mitad de las ideas. Si en el sector no hay señal, no hay campaña en redes que llegue.",
    ejemplo: "En el sector alto, sin señal en las casas; escuchan la radio local",
  },
  {
    id: "necesidad",
    pregunta: "¿Qué necesitan que hoy no tienen?",
    ayuda:
      "Lo que el curso les puede dar y nadie más les está dando. Si la respuesta es «que se enteren», todavía falta pensarlo.",
    ejemplo: "Saber si el agua del pozo se puede tomar y a quién preguntarle",
  },
];

export function rasgosEn(idioma: Idioma) {
  return idioma === "pt" ? RASGOS_PT : RASGOS;
}

export type Rasgos = {
  edad: string;
  donde: string;
  necesidad: string;
};

export const RASGOS_VACIOS: Rasgos = { edad: "", donde: "", necesidad: "" };
