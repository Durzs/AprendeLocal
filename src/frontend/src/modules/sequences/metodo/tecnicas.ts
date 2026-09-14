/**
 * Las técnicas de terreno, y cómo se ensayan en la sala antes de salir.
 *
 * POR QUÉ ESTO TIENE QUE EXISTIR
 *
 * Una salida se arruina de dos maneras y las dos ocurren antes de salir. La
 * primera es que el curso llegue sin saber usar lo que va a usar: quince
 * personas aprendiendo a leer una tira de pH en la orilla de un río, con
 * viento, es una hora perdida y un dato inservible. La segunda es que nadie
 * haya pensado en los resguardos, y entonces la salida se suspende en la
 * puerta o, peor, no se suspende.
 *
 * Las dos se arreglan igual: ensayando la técnica en la sala, con el material
 * de verdad, sobre algo que no importe. Se practica la pauta de entrevista
 * entre ellos antes de sentarse con una persona mayor. Se mide el pH del agua
 * de la llave antes de medir el del río. Se llena una bitácora mirando el
 * patio antes de llenarla en el bosque.
 *
 * QUÉ TRAE CADA UNA
 *
 * `queSeEnsaya` es lo que pasa en la sala y es la parte que no suele estar
 * escrita en ninguna parte. `seguridad` y `etica` van separadas a propósito:
 * la primera es lo que puede lastimar a alguien y la segunda lo que puede
 * dañar a alguien, que no es lo mismo y se olvida distinto. Y `seCaeCuando`
 * dice cómo falla esa técnica en concreto, porque cada una falla a su manera y
 * siempre igual.
 *
 * Estas técnicas son de uso general: sirven para un río contaminado, para un
 * bosque que retrocede y para un oficio que se está perdiendo. Por eso están
 * aquí y no dentro de una ruta.
 */

import type { Registro } from "../../../types";

export type Tecnica = {
  id: string;
  nombre: string;
  queEs: string;
  /** Qué se hace en la sala para practicarla, sobre algo que no importe. */
  queSeEnsaya: string;
  /** Todo se consigue en la escuela o en una casa. */
  materiales: string[];
  /** Lo que puede lastimar a alguien. */
  seguridad: string[];
  /** Lo que puede dañar a alguien, que no es lo mismo. */
  etica: string[];
  /** Cómo falla esta técnica. Siempre falla igual. */
  seCaeCuando: string;
  /** Qué clase de trabajo de terreno es. */
  registros: Registro[];
};

export const TECNICAS: Tecnica[] = [
  {
    id: "bitacora",
    nombre: "Bitácora de campo",
    queEs:
      "El cuaderno donde se anota en el momento, no después. Fecha, hora, lugar, quién anota, y lo que se ve tal como se ve, separado de lo que uno cree que significa.",
    queSeEnsaya:
      "Quince minutos en el patio llenando una bitácora de algo cualquiera: el recreo, un árbol, la entrada de la escuela. Después se leen dos en voz alta y el curso decide cuál permitiría a otra persona reconstruir lo que pasó. Casi siempre gana la que separa lo visto de lo interpretado.",
    materiales: ["cuaderno", "lápiz de mina", "una tabla o carpeta dura para escribir de pie"],
    seguridad: ["Nadie anota caminando por el borde de un cauce o de un corte"],
    etica: [
      "Lo que diga una persona se anota como lo dijo, no arreglado",
      "Si alguien pide que algo no se anote, no se anota",
    ],
    seCaeCuando:
      "Se llena al volver, de memoria. En el camino de regreso se pierde la mitad y lo que queda se acomoda a lo que uno esperaba encontrar.",
    registros: ["describir", "dibujar"],
  },
  {
    id: "pauta_observacion",
    nombre: "Pauta de observación",
    queEs:
      "Una lista corta de qué mirar, decidida antes de llegar, para que todos los grupos miren lo mismo y los datos se puedan juntar.",
    queSeEnsaya:
      "Se arma la pauta entre todos y se prueba en el patio. El curso descubre solo el problema de siempre: dos personas marcan distinto la misma cosa porque la casilla dice «mucha basura» en vez de «más de diez envases». Se corrige ahí y no en el terreno.",
    materiales: ["la pauta impresa, una por grupo", "lápiz"],
    seguridad: ["Se mira desde donde se pueda estar parado con las dos manos libres"],
    etica: ["No se observa el interior de casas ni a personas que no saben que están siendo observadas"],
    seCaeCuando:
      "Las casillas admiten interpretación. Si dos personas pueden marcar distinto lo mismo, la pauta no sirve para juntar nada y es mejor saberlo en la sala.",
    registros: ["describir", "contar"],
  },
  {
    id: "entrevista",
    nombre: "Pauta de entrevista",
    queEs:
      "Tres o cuatro preguntas escritas por los estudiantes para alguien que sabe algo que ellos no. Abiertas, sobre lo que esa persona vivió, no sobre lo que opina en general.",
    queSeEnsaya:
      "Se entrevistan entre ellos con las preguntas puestas, en parejas, delante del curso. Se nota al instante cuál pregunta se contesta con un sí y cuál abre diez minutos. Se reparte además quién pregunta y quién anota, y no son la misma persona.",
    materiales: ["las preguntas escritas", "cuaderno", "grabadora o teléfono, si la persona autoriza"],
    seguridad: ["Se entrevista de a dos, nunca alguien solo", "En un lugar a la vista, no dentro de una casa sin un adulto de la escuela"],
    etica: [
      "Se dice antes para qué es y dónde va a aparecer",
      "Para grabar se pide permiso en voz alta y queda grabado el permiso",
      "Se le muestra a la persona lo que quedó escrito antes de publicarlo",
      "Si prefiere que su nombre no salga, no sale",
    ],
    seCaeCuando:
      "Las preguntas se hacen sobre la marcha. Sin pauta el invitado habla veinte minutos de lo que quiere, el curso escucha, y no queda anotado nada que se pueda usar.",
    registros: ["preguntar"],
  },
  {
    id: "encuesta",
    nombre: "Encuesta a vecinos",
    queEs:
      "Las mismas pocas preguntas hechas a muchas personas, para poder contar respuestas en vez de citarlas. Cerradas y cortas: tres preguntas contestadas por cuarenta personas valen más que doce por cinco.",
    queSeEnsaya:
      "Se aplica el borrador entre ellos y se cuenta cuánto demora. Si pasa de dos minutos, se recorta. También se decide a quién se le va a preguntar y a quién no, que es lo que después permite decir qué representa y qué no.",
    materiales: ["la hoja impresa, varias copias", "lápiz", "un tablero para apoyar"],
    seguridad: ["Siempre de a dos y en lugares públicos", "Nunca se entra a un domicilio"],
    etica: [
      "Se identifica de qué escuela son y para qué es, antes de la primera pregunta",
      "Se acepta un no sin insistir",
      "No se piden datos personales que no hagan falta",
    ],
    seCaeCuando:
      "Se pregunta solo a quien pasa por la plaza un domingo. La muestra queda torcida y el resultado no se puede defender: conviene decidir antes a quién falta y salir a buscarlo.",
    registros: ["preguntar", "contar"],
  },
  {
    id: "muestreo_agua",
    nombre: "Muestreo de agua",
    queEs:
      "Tomar el dato del agua en varios puntos del mismo cauce, siempre igual: pH, turbidez y temperatura, a la misma hora y con el mismo procedimiento, para que los puntos se puedan comparar entre sí.",
    queSeEnsaya:
      "Se mide el agua de la llave de la escuela, la de un charco y la de un vaso con tierra revuelta. Tres aguas distintas dan tres lecturas distintas y ahí se aprende a leer la escala de color sin apuro. Se practica además tomar la muestra sin meter los dedos, que es el error que arruina el dato.",
    materiales: [
      "tiras de pH",
      "frascos limpios con tapa, uno por punto",
      "un termómetro",
      "etiquetas o cinta de papel para rotular",
      "guantes",
    ],
    seguridad: [
      "Nadie entra al agua por sobre la rodilla",
      "Nadie se acerca solo a la orilla",
      "Si llovió fuerte los días antes, la salida se suspende",
      "Después de tocar agua sospechosa, nadie se lleva las manos a la cara y se lavan al terminar",
    ],
    etica: [
      "Si el cauce pasa por un predio, se pide permiso para entrar",
      "Un resultado malo no se publica como acusación a una persona: se informa dónde se midió y qué dio",
    ],
    seCaeCuando:
      "Se mide a distintas horas o con distinto procedimiento en cada punto. Entonces las diferencias entre puntos pueden ser de la hora y no del agua, y no hay manera de saberlo después.",
    registros: ["medir", "recoger"],
  },
  {
    id: "cuadrante",
    nombre: "Cuadrante o parcela",
    queEs:
      "Un cuadrado marcado en el suelo dentro del cual se cuenta y se anota todo. Permite comparar sitios distintos y volver al mismo sitio el año siguiente.",
    queSeEnsaya:
      "Se marca un metro cuadrado en el patio y se cuenta todo lo que hay dentro. Salen dos descubrimientos: que hay mucho más de lo que parecía, y que dos grupos cuentan distinto lo mismo hasta que acuerdan qué cuenta como qué.",
    materiales: ["cordel de cuatro metros", "cuatro estacas", "huincha", "lupa"],
    seguridad: ["Se levanta una piedra a la vez y se mira antes de meter la mano"],
    etica: [
      "Todo lo que se levanta se devuelve a su sitio",
      "Nada se lleva vivo a la sala",
    ],
    seCaeCuando:
      "Se elige el cuadrado donde se ve más bonito. Eso tuerce todo, y conviene decidir dónde va antes de mirar qué hay.",
    registros: ["contar", "mapear", "dejar_hecho"],
  },
  {
    id: "muestra_suelo",
    nombre: "Toma de muestras de suelo",
    queEs:
      "Una bolsa por capa o por sitio, rotulada con de dónde salió y a qué profundidad. Lo que se hace después con ella ocurre en la sala.",
    queSeEnsaya:
      "Se toman dos muestras del patio, una de superficie y otra de un palmo abajo, y se rotulan. Después se abren y se comparan al tacto y al olor. El ensayo sirve sobre todo para lo que parece trivial y arruina el día: si las bolsas se mezclan, se perdió la salida.",
    materiales: ["bolsas resellables", "una pala pequeña", "cinta de papel y lápiz permanente", "guantes"],
    seguridad: [
      "Nadie se pone al pie de un corte: se desprende tierra",
      "No se excava en cortes más altos que una persona",
    ],
    etica: ["Si el terreno tiene dueño, se pide: una bolsa de tierra es poca cosa y pedirla es la diferencia"],
    seCaeCuando:
      "Se rotula después. Cinco bolsas iguales sin etiqueta son cinco bolsas de tierra y nada más.",
    registros: ["recoger", "describir"],
  },
  {
    id: "foto_punto_fijo",
    nombre: "Fotografía desde un punto fijo",
    queEs:
      "La misma foto, desde el mismo sitio, con algo que dé la escala. Repetida en el tiempo es la prueba más difícil de discutir que un curso puede conseguir.",
    queSeEnsaya:
      "Se elige un punto del patio, se marca en el suelo, y se fotografía. Al día siguiente se intenta repetir la foto exacta. Nunca sale igual a la primera, y de ahí sale la regla: hay que anotar desde dónde, a qué altura y hacia dónde.",
    materiales: ["un teléfono", "algo que dé la escala: una regla, una mochila, una persona", "una estaca o marca para el punto"],
    seguridad: ["No se retrocede mirando por la pantalla"],
    etica: [
      "No se fotografía a personas sin permiso, y menos a menores de otra escuela",
      "Si sale la casa de alguien identificable, se pregunta antes de publicarla",
    ],
    seCaeCuando:
      "No queda anotado desde dónde se tomó. Un año después nadie puede repetirla y la serie se corta.",
    registros: ["comparar", "describir"],
  },
  {
    id: "mapa_a_mano",
    nombre: "Mapa dibujado a mano",
    queEs:
      "El sitio visto desde arriba, dibujado en el momento, sin escala pero con todo en su lugar: qué está al lado de qué, por dónde se entra, dónde está cada cosa que importa.",
    queSeEnsaya:
      "Cada uno dibuja de memoria el patio de la escuela. Después salen a mirarlo y corrigen. La distancia entre los dos dibujos es la lección: lo que uno cree que sabe de un sitio que ve todos los días.",
    materiales: ["hoja grande", "lápiz", "lápices de color para distinguir"],
    seguridad: ["Se dibuja detenido, no caminando"],
    etica: ["Si el mapa va a mostrar propiedad de alguien, se le avisa"],
    seCaeCuando:
      "Se intenta hacer a escala. Con regla y proporción el dibujo se vuelve lento y malo; lo que importa aquí es la posición relativa, y la medición va por otro lado.",
    registros: ["mapear", "dibujar"],
  },
  {
    id: "medicion_dimensiones",
    nombre: "Medición de dimensiones",
    queEs:
      "Largo, ancho, hondo, grosor, con huincha o vara, en varios puntos y no en uno, porque nada en la naturaleza es parejo.",
    queSeEnsaya:
      "Se mide algo del patio tres veces, por tres grupos distintos, y se comparan los tres resultados. Nunca coinciden, y esa es la clase: de ahí sale por qué se mide en varios puntos y qué se hace con el que se sale de todos.",
    materiales: ["huincha de cinco metros", "una vara marcada cada diez centímetros", "cuaderno"],
    seguridad: ["Nadie mide dentro de un cauce con corriente", "La vara no se apoya en el borde de un corte"],
    etica: ["Si hay que entrar a un terreno para medir, se pide"],
    seCaeCuando:
      "Se mide una sola vez y se da por bueno. Un número solo no dice si está bien: recién dice algo cuando hay otro al lado.",
    registros: ["medir"],
  },
];

export function tecnicaPorId(id: string): Tecnica | undefined {
  return TECNICAS.find((t) => t.id === id);
}

/**
 * Lo que el curso tiene que llevarse de estas clases, antes de salir.
 *
 * Son cuatro y las cuatro se comprueban antes de subir a la micro. Las dos
 * primeras son de contenido y las dos últimas de oficio, y las de oficio son
 * las que se saltan: se supone que ya saben usar un cuaderno, y no saben, como
 * no sabía nadie la primera vez.
 */
export const ANTES_DE_SALIR: { titulo: string; queEs: string; seNotaEn: string }[] = [
  {
    titulo: "Conectan la noticia con lo que están viendo en clase",
    queEs:
      "Relacionan los hechos y las cifras de la problemática con los conceptos y principios que se están pasando.",
    seNotaEn:
      "usan una palabra del programa para explicar algo de la nota, sin que se la pidas.",
  },
  {
    titulo: "Explican los conceptos, no los repiten",
    queEs:
      "Dicen qué significa cada concepto clave y por qué hace falta para entender las causas o las consecuencias del problema de aquí.",
    seNotaEn:
      "pueden explicárselo a alguien que no estuvo, con sus palabras y sin leer.",
  },
  {
    titulo: "Saben usar lo que van a usar",
    queEs:
      "Describen los pasos, los instrumentos y la técnica con la que van a levantar el dato, y la han practicado al menos una vez.",
    seNotaEn:
      "pueden decir en qué orden se hace y qué se anota primero, sin mirar la hoja.",
  },
  {
    titulo: "Saben qué se puede y qué no en terreno",
    queEs:
      "Reconocen los resguardos, lo que hay que pedir antes y lo que no se hace, tanto con el lugar como con las personas.",
    seNotaEn:
      "alguien del curso puede decir qué haría si una persona dice que no quiere ser entrevistada.",
  },
];
