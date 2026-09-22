import type { Idioma } from "../../../shared/tx";
import { COMO_SE_ELIGE_PT, FORMATOS_PT } from "./formatos.pt";

/**
 * Maneras de entregar lo que encontraron. Las elige el curso.
 *
 * En las rutas escritas el producto venía puesto: «un informe de una plana»,
 * «un mural con la red alimentaria». Con el producto puesto no hay proyecto,
 * hay tarea larga, y el momento donde tendría que aparecer lo que se les
 * ocurre a los estudiantes simplemente no existía.
 *
 * Esto no es un menú del que haya que elegir una opción. Es una lista para
 * mirar cuando no se les ocurre nada, y sobre todo para poder descartar con
 * argumento: la pregunta útil no es «cuál es más bonito» sino «a quién le
 * llega de verdad». Un curso que descarta el informe porque en su pueblo nadie
 * lee informes está haciendo un razonamiento mejor que uno que elige el
 * formato que le gustó.
 *
 * Por eso cada formato dice `seCaeCuando`. Lo que casi nunca está escrito en
 * ninguna parte es cómo fracasa cada cosa, y es lo que un curso de doce años
 * no puede anticipar solo. Un video corto se cae por largo; una exposición se
 * cae porque nadie se queda al lado a explicarla; una campaña en redes se cae
 * el día tres, cuando ya nadie sube nada.
 *
 * Si el curso inventa uno que no está aquí, mejor. La lista no está para
 * cerrar.
 */

/** A cuánta gente llega de verdad, que no es lo mismo que a cuánta se dirige. */
export type Alcance = "pocos" | "el_pueblo" | "mas_alla";

export type Formato = {
  id: string;
  nombre: string;
  queEs: string;
  /** Quién lo recibe de verdad, y en qué momento de su día. */
  llegaA: string;
  alcance: Alcance;
  /** Lo que hay que tener para que funcione. Si falta, no se elige. */
  exige: string[];
  /** Cómo fracasa este formato. Siempre fracasa igual. */
  seCaeCuando: string;
  /** Para qué clase de hallazgo es bueno. */
  buenoPara: string;
};

export const FORMATOS: Formato[] = [
  {
    id: "campana_redes",
    nombre: "Campaña en redes sociales",
    queEs:
      "Una serie corta de publicaciones con una sola idea y una pieza distinta cada vez: la foto del antes y el después, el video de diez segundos, la cifra sola sobre fondo liso.",
    llegaA:
      "Gente del pueblo y de más allá, en el teléfono, mientras hace otra cosa. Se juega todo en los primeros tres segundos.",
    alcance: "mas_alla",
    exige: [
      "Una sola idea, repetida; dos ideas se anulan",
      "Al menos una imagen que no se pueda discutir: la foto del desagüe, los dos frascos al lado",
      "Un calendario de qué se sube cada día, hecho antes de empezar",
      "Permiso firmado de las familias para que salgan sus caras",
    ],
    seCaeCuando:
      "Se agota el día tres. Se arranca con todo y a la semana no queda nadie subiendo nada, porque no había nada preparado de antemano.",
    buenoPara:
      "Un hallazgo que se ve en una imagen y que le importa a mucha gente que no va a ir a ninguna reunión.",
  },
  {
    id: "exposicion",
    nombre: "Exposición en un sitio de paso",
    queEs:
      "Las piezas montadas donde la gente ya pasa: la plaza un día de feria, el pasillo de la posta, la sede vecinal. Una ficha por cosa, y el curso al lado.",
    llegaA:
      "Quien pasaba por ahí sin buscarlo, que es justamente el que nunca iría a la escuela a ver un trabajo.",
    alcance: "el_pueblo",
    exige: [
      "Que cada pieza se entienda sola, porque no todos van a preguntar",
      "Alguien del curso al lado en todo momento: sin eso son papeles pegados",
      "Permiso del lugar, y un plan de qué se hace si llueve o hay viento",
      "Un orden de recorrido: por dónde se empieza y por dónde se sale",
    ],
    seCaeCuando:
      "Se monta y se deja sola. Una exposición sin nadie que la explique dura lo que dura la curiosidad del primero que pasa.",
    buenoPara:
      "Muchas piezas parecidas que ganan al verse juntas: una colección, una serie, un catálogo de algo.",
  },
  {
    id: "informe",
    nombre: "Informe breve para quien decide",
    queEs:
      "Una o dos planas con lo que encontraron, lo que significa, y qué se pide. Nada más, y con fecha y firma.",
    llegaA:
      "Quien puede cambiar algo: la dirección, el municipio, el comité de agua. Una persona concreta, no una oficina.",
    alcance: "pocos",
    exige: [
      "Saber de antemano qué puede decidir esa persona y qué no",
      "Que el número esté arriba y la explicación abajo, no al revés",
      "Decir qué no saben, porque es lo primero que les van a discutir",
      "Un pedido concreto: qué quieren que pase, y para cuándo",
    ],
    seCaeCuando:
      "Se entrega y no se hace seguimiento. Un informe sin alguien que pregunte después qué pasó con él se archiva, y el curso aprende que escribir no sirve.",
    buenoPara:
      "Un hallazgo que obliga a alguien a tomar una decisión, y que se sostiene en números.",
  },
  {
    id: "guia",
    nombre: "Guía o cartilla para repartir",
    queEs:
      "Una hoja doblada que la gente se lleva: cómo reconocer algo, qué hacer, a quién llamar. Se imprime en la escuela y se reparte en la mano.",
    llegaA: "Quien la recibe y se la guarda, y la usa semanas después.",
    alcance: "el_pueblo",
    exige: [
      "Que sirva para hacer algo, no solo para saber algo",
      "Que quepa en un bolsillo y se entienda sin leerla entera",
      "Dibujos propios: las fotos de internet la vuelven un folleto cualquiera",
    ],
    seCaeCuando:
      "Se llena de información. Una cartilla con todo lo que aprendieron no la lee nadie; una con tres cosas que se pueden hacer se queda pegada en una cocina.",
    buenoPara:
      "Conocimiento que alguien va a necesitar cuando el curso ya no esté ahí para explicarlo.",
  },
  {
    id: "radio",
    nombre: "Cuña o programa en la radio local",
    queEs:
      "Dos o tres minutos grabados, o una conversación en vivo en la radio del pueblo.",
    llegaA:
      "La gente mayor y quien trabaja con la radio puesta: campo, taller, camioneta. Es el medio que más subestima la escuela y el que más llega en zonas rurales.",
    alcance: "el_pueblo",
    exige: [
      "Un guión escrito y cronometrado: en radio treinta segundos son largos",
      "Hablar de cosas que se puedan imaginar sin verlas",
      "Ensayar en voz alta hasta que no se lea como leído",
      "Acordar el día y la hora con la radio, por escrito",
    ],
    seCaeCuando:
      "Se lee un texto escrito para el papel. En radio se nota al instante y la gente cambia de emisora.",
    buenoPara:
      "Algo que se cuenta mejor de lo que se muestra: una historia, un testimonio, un antes y un después.",
  },
  {
    id: "mural",
    nombre: "Mural o cartel grande donde se pasa",
    queEs:
      "Una pieza grande y fija en un muro que la gente cruza todos los días: la escuela, la sede, el paradero.",
    llegaA: "Los mismos, muchas veces, durante meses.",
    alcance: "el_pueblo",
    exige: [
      "Que se lea de lejos: si hay que acercarse a leerlo, no es un mural",
      "Permiso del dueño del muro, y saber cuánto va a durar ahí",
      "Materiales que aguanten sol y lluvia si va afuera",
    ],
    seCaeCuando:
      "Se llena de texto pequeño. Un mural con párrafos es un afiche ampliado y nadie se detiene a leerlo.",
    buenoPara:
      "Una idea que gana viéndose entera y de golpe: un mapa, una red, un antes y un después.",
  },
  {
    id: "coleccion",
    nombre: "Colección catalogada",
    queEs:
      "Las muestras ordenadas, con su ficha cada una: herbario, muestrario de suelos, fichero de especies, archivo de fotos con fecha.",
    llegaA:
      "El curso que viene, y quien quiera consultarla después. Es el formato que dura más que todos los demás.",
    alcance: "pocos",
    exige: [
      "Un criterio de orden decidido por ellos, y escrito: por qué esto va aquí",
      "Que cada pieza tenga dónde y cuándo se recogió, o no vale nada",
      "Un sitio donde quedarse: una caja, un mueble, una carpeta con dueño",
    ],
    seCaeCuando:
      "Se guarda sin fichas. Una caja de plantas secas sin dónde ni cuándo es basura bonita, y en un año nadie sabrá qué era.",
    buenoPara:
      "Muchos ejemplares de lo mismo, cuando lo interesante es en qué se diferencian.",
  },
  {
    id: "video",
    nombre: "Video corto",
    queEs:
      "Dos o tres minutos grabados con teléfono, con lo que pasó en el lugar y la voz de ellos.",
    llegaA: "Quien lo vea entero, que van a ser menos de los que lo empiecen.",
    alcance: "mas_alla",
    exige: [
      "Una cosa que solo se entienda viéndola: si se puede contar, no hacía falta video",
      "Grabar en el sitio, no en la sala explicando el sitio",
      "Sonido: es lo que lo arruina, más que la imagen",
    ],
    seCaeCuando:
      "Dura ocho minutos. Todo lo que trabajaron entra y nadie lo termina de ver.",
    buenoPara:
      "Un proceso o un lugar que hay que ver moverse para entenderlo.",
  },
  {
    id: "taller",
    nombre: "Taller a otro curso o a las familias",
    queEs:
      "El curso enseña lo que aprendió, con una actividad que los otros hacen con las manos.",
    llegaA: "Pocos, pero de verdad: quien lo hace no lo olvida.",
    alcance: "pocos",
    exige: [
      "Que los otros hagan algo, no que escuchen",
      "Repartir quién explica qué, para que no hablen solo dos",
      "Haber previsto la pregunta que no van a saber contestar",
    ],
    seCaeCuando:
      "Se convierte en una exposición oral. Si los que vienen solo escuchan, se aburren y el curso se desanima delante de todos.",
    buenoPara:
      "Algo que se aprende haciéndolo, y que el curso ya sabe hacer bien.",
  },
  {
    id: "intervencion",
    nombre: "Arreglar o señalizar el lugar mismo",
    queEs:
      "Dejar algo hecho en el sitio: señalizarlo, limpiarlo, plantar, marcar puntos de medición, poner carteles con nombres.",
    llegaA: "Todo el que pase por ahí, sin que nadie tenga que convocarlo.",
    alcance: "el_pueblo",
    exige: [
      "Permiso de quien es dueño o responsable del lugar",
      "Que aguante: algo que se deshace con la primera lluvia es peor que nada",
      "Un compromiso de volver a mirarlo, con fecha",
    ],
    seCaeCuando:
      "Se hace y no se vuelve. La intervención se deteriora, queda peor que antes, y el curso siguiente hereda un fracaso visible.",
    buenoPara:
      "Un problema que se puede mejorar aunque sea un poco con lo que hay a mano.",
  },
];

/** Los formatos en el idioma que toca. El portugués está en §formatos.pt.ts. */
export function formatosEn(idioma: Idioma): Formato[] {
  return idioma === "pt" ? FORMATOS_PT : FORMATOS;
}

export function formatoPorId(id: string, idioma: Idioma = "es"): Formato | undefined {
  return formatosEn(idioma).find((f) => f.id === id);
}

export function comoSeEligeEn(idioma: Idioma): string[] {
  return idioma === "pt" ? COMO_SE_ELIGE_PT : COMO_SE_ELIGE;
}

/**
 * Las preguntas con que se elige, que importan más que la lista.
 *
 * Van aparte porque son lo que se hace en la sala. La lista de arriba se mira
 * treinta segundos; esto se discute media clase, y es la media clase donde el
 * curso decide qué va a construir.
 */
export const COMO_SE_ELIGE: string[] = [
  "¿A quién le cambia algo lo que encontramos? Nómbralo: la comunidad no es un nombre.",
  "¿Dónde está esa persona y qué mira en el día? Si no usa el teléfono, la campaña no le llega por bonita que sea.",
  "¿Qué formato la haría detenerse, y cuál la haría pasar de largo?",
  "¿Alcanzamos a terminarlo bien con lo que queda de tiempo? Vale más una cosa terminada que tres a medias.",
  "¿Qué sabemos hacer en este curso que no hayamos usado todavía?",
  "Si nos sale mal, ¿cómo va a ser ese fracaso? Elegir sabiendo eso es distinto de elegir a ciegas.",
];
