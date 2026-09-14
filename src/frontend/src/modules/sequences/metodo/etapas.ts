/**
 * El método: cinco etapas que sirven para cualquier proyecto.
 *
 * QUÉ CAMBIÓ Y POR QUÉ
 *
 * Antes esto eran diez momentos. Estaban bien vistos y eran demasiados: un
 * docente que abre esto el domingo por la noche no puede sostener diez cosas
 * en la cabeza, y en la práctica varios de los diez ocurrían en la misma clase.
 * Cinco etapas se leen de una vez y cada una corresponde a algo que pasa en un
 * bloque real del calendario.
 *
 * Los diez no se perdieron: se plegaron. Mirar el sitio y que aparezca la
 * pregunta que divide son la primera etapa; salir, preguntarle a quien sabe y
 * volver a comparar son la tercera; decidir qué se construye y rehacerlo son la
 * cuarta; entregarlo y mirar atrás son la quinta.
 *
 * CÓMO ESTÁ ESCRITA CADA UNA
 *
 * `queOcurre` dice qué pasa, en la lengua con que se lo contarías a un colega.
 * `aprendizajes` es lo que el curso tiene que llevarse, nombrado, que es lo que
 * se pide para el papeleo y lo que permite evaluar sin inventar una rúbrica.
 * Y después van las tres cosas que no suelen estar escritas en ninguna parte:
 * qué pregunta el docente para abrir, cómo sabe que ya puede seguir, y de qué
 * manera se cae esa etapa, que es siempre la misma.
 *
 * QUIÉN DECIDE
 *
 * Es el campo que convierte esto en un método y no en una receta larga. La
 * segunda etapa la decide el profesor entero y no se vota: mandar a un curso a
 * averiguar algo sin haberle enseñado a usar lo que va a usar no es dejarlos
 * crear, es dejarlos solos. Las tres últimas son de ellos, y ahí el docente
 * tiene que aguantarse las ganas.
 */

import type { Alcance } from "../../../types";

/** Quién toma las decisiones de esta etapa. */
export type Decide = "docente" | "estudiantes" | "ambos";

/** Algo que el curso se lleva, con nombre y con cómo se comprueba. */
export type Aprendizaje = {
  /** El nombre con que aparece en el papeleo. */
  nombre: string;
  queEs: string;
  /** Cómo se ve que ocurrió, mirando a la sala. */
  seNotaEn: string;
};

/** La misma etapa, en dos proyectos que no se parecen. */
export type Instancia = { proyecto: string; asiSeVe: string };

export type Etapa = {
  id: string;
  nombre: string;
  /** Qué pasa, contado como se lo contarías a un colega. */
  queOcurre: string;
  alcance: Alcance;
  decide: Decide;
  aprendizajes: Aprendizaje[];
  /** Lo que el docente pregunta. Funcionan en cualquier proyecto. */
  preguntasQueAbren: string[];
  /** Cómo sabe que ya puede pasar a la siguiente. */
  estaListoCuando: string[];
  /** La manera típica en que esta etapa se cae. Siempre es la misma. */
  seCaeCuando: string;
  ejemplos: Instancia[];
};

export const ETAPAS: Etapa[] = [
  {
    id: "problematica",
    nombre: "Presentación de la problemática",
    queOcurre:
      "Se elige una de las problemáticas que trae la plataforma, con las noticias y los estudios que la sostienen, o el docente propone la suya. El curso las lee, las desarma, y de ahí sale una pregunta que los divide y que no se puede ganar conversando.",
    alcance: "inmediato",
    decide: "ambos",
    aprendizajes: [
      {
        nombre: "Análisis contextual",
        queEs:
          "Identifica los elementos clave de la problemática: quiénes están metidos, qué la causó, qué consecuencias tiene, dónde ocurre y desde cuándo.",
        seNotaEn:
          "pueden contestar de cuándo es y dónde queda sin volver a leer, y notan cuando la nota no lo dice.",
      },
      {
        nombre: "Comprensión crítica",
        queEs:
          "Explica con sus propias palabras cómo eso les toca a ellos o a su comunidad, de manera directa o de rebote.",
        seNotaEn:
          "aparece un lugar concreto de aquí en lo que dicen, no «el medio ambiente». Si nadie logra conectarlo, esta problemática no es la de esta escuela.",
      },
      {
        nombre: "Apropiación del problema",
        queEs:
          "Formula preguntas o reflexiones propias que muestran interés y que la noticia no contesta.",
        seNotaEn:
          "las preguntas son sobre aquí y no sobre la noticia. Esta es la que decide si hay proyecto: sin preguntas propias, lo que sigue es comprensión de lectura.",
      },
    ],
    preguntasQueAbren: [
      "¿De cuándo es esto, quién lo escribió y a quién le convenía escribirlo?",
      "¿Esto nos pasa a nosotros? ¿Dónde exactamente?",
      "¿Quién cree que sí y quién cree que no? Párense de este lado y de este otro",
      "¿Qué tendríamos que ver para saber cuál de los dos tiene razón?",
    ],
    estaListoCuando: [
      "Hay dos bandos y los dos tienen un argumento, no una corazonada",
      "Tú tampoco sabes la respuesta con seguridad",
      "Las razones de cada lado quedaron escritas en la pizarra, y esa parte se tapa hasta la etapa 3",
    ],
    seCaeCuando:
      "Se empieza por el tema en vez de por el caso. En cuanto dices «hoy vamos a ver contaminación» el curso deja de leer y empieza a adivinar qué respuesta quieres.",
    ejemplos: [
      {
        proyecto: "Un río que se ve sucio",
        asiSeVe:
          "Leen la multa de la sanitaria y la denuncia por los basurales. La pregunta que los divide: ¿está contaminado, o solo turbio porque arrastra tierra? La mitad se baña ahí en enero.",
      },
      {
        proyecto: "El desierto que florece",
        asiSeVe:
          "Leen lo que se ha publicado sobre los años de floración. La pregunta: ¿salen las mismas flores todos los años? Los abuelos dicen que antes había más y otras, y nadie tiene cómo probarlo.",
      },
    ],
  },
  {
    id: "aula",
    nombre: "Enseñanza en aula",
    queOcurre:
      "Una o dos clases con los conceptos del programa que hacen falta para entender la problemática, y el ensayo en la sala de la técnica con la que van a levantar el dato, practicada sobre algo que no importe.",
    alcance: "inmediato",
    decide: "docente",
    aprendizajes: [
      {
        nombre: "Conexión local y curricular",
        queEs:
          "Relaciona los hechos y las cifras de la problemática con los conceptos y principios que se están pasando en clase.",
        seNotaEn:
          "usan una palabra del programa para explicar algo de la nota, sin que se la pidas.",
      },
      {
        nombre: "Comprensión conceptual",
        queEs:
          "Explica los conceptos clave del objetivo de aprendizaje y por qué hacen falta para entender las causas o las consecuencias del problema de aquí.",
        seNotaEn:
          "pueden explicárselo a alguien que no estuvo, con sus palabras y sin leer.",
      },
      {
        nombre: "Apropiación de la técnica",
        queEs:
          "Identifica y describe los pasos, los instrumentos y la técnica con que va a levantar el dato: bitácora, pauta de entrevista, instrumento de medición, reglas de muestreo.",
        seNotaEn:
          "pueden decir en qué orden se hace y qué se anota primero, sin mirar la hoja.",
      },
      {
        nombre: "Preparación para el terreno",
        queEs:
          "Reconoce los resguardos, lo que hay que pedir antes y lo que no se hace, tanto con el lugar como con las personas.",
        seNotaEn:
          "alguien del curso puede decir qué haría si una persona no quiere ser entrevistada.",
      },
    ],
    preguntasQueAbren: [
      "¿Qué palabras del programa hacen falta para entender esto, y cuáles no vienen al caso?",
      "¿Con qué van a levantar el dato, y dónde lo pueden practicar sin que importe?",
      "¿Cuál es el error que van a cometer si no se los digo antes?",
      "¿Qué hay que pedir, avisar o firmar antes de que salgamos?",
      "¿Cómo sabré, antes de subir a la micro, quién entendió y quién no?",
    ],
    estaListoCuando: [
      "Ensayaron la técnica al menos una vez, con el material de verdad",
      "Pueden explicar los conceptos a alguien que no estuvo",
      "Está resuelto el permiso, el transporte y qué se hace si llueve",
      "Hiciste una pregunta que contestaron todos a la vez y sabes quién falló",
    ],
    seCaeCuando:
      "Se enseñan los conceptos y se salta el ensayo de la técnica, porque se supone que ya saben usar un cuaderno. No lo saben, y quince personas aprendiendo a leer una tira de pH en la orilla con viento son una hora perdida y un dato inservible.",
    ejemplos: [
      {
        proyecto: "Un río que se ve sucio",
        asiSeVe:
          "Conceptos: pH, turbidez, bioindicador. Se ensaya midiendo el agua de la llave, la de un charco y la de un vaso con tierra revuelta: tres aguas dan tres lecturas y ahí se aprende a leer la escala sin apuro.",
      },
      {
        proyecto: "El desierto que florece",
        asiSeVe:
          "Conceptos: fenología, especie nativa, clasificación. Se ensaya describiendo una planta del patio para que otro grupo la encuentre solo con esa descripción. Cuando no la encuentran, se entiende qué faltaba.",
      },
    ],
  },
  {
    id: "terreno",
    nombre: "Indagación en el terreno",
    queOcurre:
      "Salen al territorio a levantar datos, tomar muestras, entrevistar, mapear o revisar documentos antiguos. Al volver, lo que trajeron se pone al lado de lo que creían el primer día, y los conceptos de la clase sirven para leerlo.",
    alcance: "intermedio",
    decide: "estudiantes",
    aprendizajes: [
      {
        nombre: "Aplicación de la técnica",
        queEs:
          "Aplica en terreno las técnicas de recolección que ensayó: entrevistas, cartografía, bitácora, muestreo.",
        seNotaEn:
          "vuelven con el registro completo y legible, no con apuntes que hay que descifrar entre todos.",
      },
      {
        nombre: "Integración de conceptos",
        queEs:
          "Usa los conceptos del programa —de ciencias, de historia, de matemática— para analizar lo que recolectó, no solo para nombrarlo.",
        seNotaEn:
          "explican un dato raro con una idea de la clase, en vez de borrarlo por raro.",
      },
      {
        nombre: "Trabajo en equipo y en un espacio de otros",
        queEs:
          "Colabora con responsabilidad respetando las dinámicas del espacio público y de la comunidad que los recibe.",
        seNotaEn:
          "el sitio queda igual o mejor de como estaba, y nadie tuvo que pedirles que bajaran la voz dos veces.",
      },
    ],
    preguntasQueAbren: [
      "¿Dónde exactamente hay que ir, y por qué ahí y no veinte metros más allá?",
      "Si dos grupos eligen distinto y les da distinto, ¿cuál vale?",
      "¿Quién sabe de esto algo que nosotros no podamos averiguar?",
      "¿Qué dejamos hecho antes de irnos?",
      "Al volver: ¿quién cambió de bando, y por qué?",
    ],
    estaListoCuando: [
      "Cada grupo puede defender dónde eligió trabajar",
      "Hay al menos cuatro maneras distintas de trabajar y no todas son medir",
      "Alguien del lugar entró con preguntas que prepararon ellos",
      "Se destapó lo que había quedado escrito el primer día y se comparó",
      "Lo que no calza se discutió en vez de borrarse",
    ],
    seCaeCuando:
      "Se llega con la planilla de casillas puestas y el sitio marcado, y al volver se pasa directo a calcular. Entonces los datos son del lugar pero la idea con la que llegaron sigue entera, y la salida fue un paseo con planilla.",
    ejemplos: [
      {
        proyecto: "Un río que se ve sucio",
        asiSeVe:
          "Tres puntos elegidos por ellos: antes del pueblo, en el pueblo y después. Miden, huelen, fotografían, siguen un desagüe hasta donde nace y le preguntan a quien pesca. El punto más turbio dio buen pH: media sala tenía razón por el motivo equivocado.",
      },
      {
        proyecto: "El desierto que florece",
        asiSeVe:
          "Dos laderas, una al sol y otra a la sombra. Cuentan, fotografían, recogen una muestra por especie y marcan las parcelas para volver. Once especies donde esperaban cuatro, y dos de las que describieron los abuelos no aparecieron.",
      },
    ],
  },
  {
    id: "propuesta",
    nombre: "Creación de propuestas y acción comunitaria",
    queOcurre:
      "Con lo que encontraron, el curso diseña algo que se pueda hacer aquí: una campaña, un modelo, una restauración, una propuesta a la municipalidad. Se hace una primera versión, se la critican entre ellos, y se rehace.",
    alcance: "amplio",
    decide: "estudiantes",
    aprendizajes: [
      {
        nombre: "Diseño de una solución viable",
        queEs:
          "Diseña soluciones, modelos o artefactos que se puedan hacer de verdad con las condiciones de esta localidad.",
        seNotaEn:
          "pueden decir qué materiales hacen falta y de dónde salen. Si depende de algo que hay que comprar en la ciudad, todavía no es viable.",
      },
      {
        nombre: "Compromiso ciudadano",
        queEs:
          "Implementa o formaliza la propuesta, en vez de dejarla dibujada.",
        seNotaEn:
          "hay algo instalado, enviado o firmado, con fecha, y alguien de fuera de la escuela lo recibió.",
      },
      {
        nombre: "Uso de lo que hay",
        queEs:
          "Adapta los recursos disponibles en el entorno para responder a la problemática.",
        seNotaEn:
          "la solución usa lo que sobra en el pueblo, no lo que aparece en el catálogo de un proveedor.",
      },
    ],
    preguntasQueAbren: [
      "De todo lo que encontramos, ¿qué necesita saber alguien de afuera?",
      "¿A quién le cambia algo esto? Nómbralo: la comunidad no es un nombre",
      "¿Qué formato le llega de verdad a esa persona, y cuál la haría pasar de largo?",
      "¿Alcanzamos a terminarlo bien con lo que queda de tiempo?",
      "Si esto lo ve quien tiene que verlo, ¿qué es lo primero que no va a entender?",
    ],
    estaListoCuando: [
      "Hay un destinatario con nombre",
      "El formato lo eligieron ellos y pueden decir por qué ese y no otro",
      "Hubo una primera versión hecha rápido, y fea, que nadie entregó",
      "Se puede señalar con el dedo qué cambió entre una versión y la otra",
    ],
    seCaeCuando:
      "El producto viene decidido de antes. Con el formato puesto por el docente esto se convierte en una tarea larga, y lo que se les ocurra a los estudiantes no tiene por dónde entrar.",
    ejemplos: [
      {
        proyecto: "Un río que se ve sucio",
        asiSeVe:
          "Descartan el informe porque en su pueblo nadie lee informes. Campaña en redes: video en la orilla con los dos frascos y una pregunta al municipio. El otro curso les pregunta cómo saben que es el desagüe y no la lluvia, y la segunda versión lo contesta.",
      },
      {
        proyecto: "El desierto que florece",
        asiSeVe:
          "Exposición en la plaza, una ficha por flor con el nombre local, el científico y por qué aguanta años bajo tierra. Una persona mayor corrige dos nombres cambiados y las fichas se rehacen.",
      },
    ],
  },
  {
    id: "difusion",
    nombre: "Difusión y reflexión",
    queOcurre:
      "Presentan lo que encontraron y lo que hicieron ante gente de verdad: vecinos, autoridades, quien sepa del tema. Después, y esto no se salta, miran atrás: en qué cambió lo que pensaban del lugar y de su propio papel en él.",
    alcance: "amplio",
    decide: "estudiantes",
    aprendizajes: [
      {
        nombre: "Comunicación ante una audiencia real",
        queEs:
          "Comunica con claridad los hallazgos y la propuesta ante autoridades, vecinos o pares que no tenían obligación de escuchar.",
        seNotaEn:
          "habla más de uno, no solo el que habla siempre, y contestan la pregunta difícil sin mirarte a ti.",
      },
      {
        nombre: "Evaluación del propio papel",
        queEs:
          "Evalúa con criterio qué pudo hacer y qué no dentro de su territorio, sin inflarlo ni minimizarlo.",
        seNotaEn:
          "pueden decir qué parte del problema queda en pie después de todo esto, sin que suene a derrota.",
      },
      {
        nombre: "Cambio en la mirada",
        queEs:
          "Reflexiona sobre cómo cambió lo que veía, lo que valoraba y lo que sentía por su entorno después del proyecto.",
        seNotaEn:
          "nombran algo del lugar que antes no miraban. La frase que aparece siempre es alguna versión de «yo pasaba por ahí todos los días».",
      },
    ],
    preguntasQueAbren: [
      "¿Cuándo y dónde exactamente, y quién avisa?",
      "¿Quién habla, y qué hace el resto mientras tanto?",
      "Si les preguntan algo que no sabemos, ¿qué contestamos?",
      "¿Qué sabes ahora de este lugar que no sabías en marzo?",
      "¿Qué parte de esto queda para el curso del año que viene?",
    ],
    estaListoCuando: [
      "Hay fecha, lugar y alguien de fuera esperando",
      "Está repartido quién hace qué",
      "Ensayaron la pregunta incómoda",
      "Cada uno escribió qué cambió en lo que pensaba, y se leyó en voz alta",
    ],
    seCaeCuando:
      "Se entrega a la profesora y se cierra sin mirar atrás. Sin nadie de afuera, todo lo anterior fue un simulacro; y sin el rato de reflexión, el curso hizo el trabajo y no se enteró de lo que le pasó haciéndolo.",
    ejemplos: [
      {
        proyecto: "Un río que se ve sucio",
        asiSeVe:
          "Publican desde la cuenta de la escuela y ofician al municipio. Anotan si contestan y qué contestan. Al cerrar, escriben qué harían distinto si el río empeora el próximo verano.",
      },
      {
        proyecto: "El desierto que florece",
        asiSeVe:
          "Montan la exposición un domingo de feria, cada uno junto a sus fichas. Al cerrar, comparan la lista que dibujaron en agosto con la de septiembre, y con lo que creían que era «un desierto».",
      },
    ],
  },
];

export function etapaPorId(id: string): Etapa | undefined {
  return ETAPAS.find((x) => x.id === id);
}

/**
 * Cuántas etapas deciden los estudiantes.
 *
 * Se muestra en pantalla y no es un adorno: es la respuesta a si este método
 * deja lugar a lo que se les ocurra a ellos o solo lo dice.
 */
export const DE_LOS_ESTUDIANTES = ETAPAS.filter((x) => x.decide === "estudiantes").length;
