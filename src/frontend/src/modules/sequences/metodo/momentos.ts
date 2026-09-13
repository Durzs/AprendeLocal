/**
 * El método: diez momentos que sirven para cualquier proyecto.
 *
 * POR QUÉ ESTO EXISTE
 *
 * Lo que había eran cuatro rutas escritas de punta a cabo: el estero, el
 * bosque, el corte de camino y la sala. Estaban bien escritas y no sirven como
 * producto, porque un guión no guía: dicta. Un docente que va al río a medir
 * contaminación y cuyos estudiantes terminan armando una campaña en redes no
 * tiene dónde entrar en «El agua que pasa por la escuela», y una escuela del
 * norte que sale a catalogar el desierto florido para montar una exposición en
 * la plaza tampoco. Son proyectos distintos y el método es el mismo; lo que
 * estaba congelado era el contenido.
 *
 * Aquí abajo no hay contenido. Hay diez momentos descritos por lo que tiene
 * que estar pasando, no por la actividad que hay que hacer. Cada uno dice
 * quién decide —y esa es la parte que más importa—, qué preguntas abre el
 * docente, cómo se sabe que ya se puede seguir, y de qué manera se cae ese
 * momento cuando se cae, que suele ser siempre la misma.
 *
 * QUIÉN DECIDE
 *
 * Es el campo que convierte esto en un método y no en una receta larga. Hay
 * momentos que decide el docente porque son suyos: qué hay que saber hacer
 * antes de salir no se vota. Hay otros que son de los estudiantes y en los que
 * el docente tiene que aguantarse las ganas, sobre todo el séptimo, que es
 * donde deciden qué van a hacer con lo que encontraron. Ese momento no existía
 * en las rutas escritas: el producto venía puesto —«un informe de una plana»,
 * «un mural»— y con el producto puesto no hay proyecto, hay tarea larga.
 *
 * LOS EJEMPLOS
 *
 * Cada momento se muestra en dos proyectos que no se parecen en nada: un río
 * que se ve sucio y un desierto que florece. No están para copiarlos. Están
 * para que se vea que el momento es el mismo aunque todo lo demás cambie, y
 * para que quien lea reconozca el suyo, que no va a ser ninguno de los dos.
 */

import type { Alcance } from "../../../types";

/** Quién toma la decisión de este momento. */
export type Decide = "docente" | "estudiantes" | "ambos";

/** El mismo momento, en dos proyectos que no se parecen. */
export type Instancia = {
  /** El proyecto, en tres palabras. */
  proyecto: string;
  /** Cómo se ve este momento ahí dentro. */
  asiSeVe: string;
};

export type Momento = {
  id: string;
  /** Cómo se nombra en la sala, no en un paper. */
  nombre: string;
  /**
   * Qué tiene que estar pasando. Está escrito como estado y no como
   * actividad a propósito: «que el curso quede dividido» admite veinte
   * maneras de conseguirlo y «hagan una votación» admite una.
   */
  proposito: string;
  alcance: Alcance;
  decide: Decide;
  /** Lo que el docente pregunta. Funcionan en cualquier proyecto. */
  preguntasQueAbren: string[];
  /** Cómo sabe que ya puede pasar al siguiente. */
  estaListoCuando: string[];
  /** La manera típica en que este momento se cae. Siempre es la misma. */
  seCaeCuando: string;
  ejemplos: Instancia[];
};

export const MOMENTOS: Momento[] = [
  {
    id: "mirar",
    nombre: "Mirar lo que ya tenemos delante",
    proposito:
      "Que el curso haya observado con atención algo que tiene a mano, antes de que exista ninguna pregunta y antes de que tú digas nada. Sirve para dos cosas: para que después tengan con qué comparar, y para que la pregunta salga de algo visto y no de un tema.",
    alcance: "inmediato",
    decide: "ambos",
    preguntasQueAbren: [
      "¿Qué hay aquí que veamos todos los días y no hayamos mirado nunca?",
      "Si tuvieras que contarle esto a alguien que nunca ha venido, ¿qué le dirías primero?",
      "¿Qué es lo más raro que ves ahí?",
    ],
    estaListoCuando: [
      "Cada uno tiene algo anotado o dibujado que no tenía al empezar la clase",
      "Aparecieron al menos dos cosas que nadie del curso había notado antes",
      "No hiciste falta tú para que apareciera: salió de mirar",
    ],
    seCaeCuando:
      "Empiezas por el tema en vez de por el sitio. En cuanto dices «hoy vamos a ver contaminación» el curso deja de mirar y empieza a adivinar qué respuesta quieres.",
    ejemplos: [
      {
        proyecto: "Un río que se ve sucio",
        asiSeVe:
          "Quince minutos en la orilla más cercana, cada uno anotando lo que ve, huele y oye, sin la palabra contaminación escrita en ninguna parte.",
      },
      {
        proyecto: "El desierto que florece",
        asiSeVe:
          "Recorren el patio y el borde del camino y dibujan cada planta distinta que encuentran, aunque esté seca. La lista de agosto es la que van a comparar en septiembre.",
      },
    ],
  },
  {
    id: "pregunta",
    nombre: "La pregunta que parte al curso en dos",
    proposito:
      "Que haya una pregunta sobre este lugar que divida al curso de verdad, con gente convencida de cada lado, y que no se pueda ganar conversando. Es lo que convierte salir en una necesidad y no en una salida.",
    alcance: "inmediato",
    decide: "ambos",
    preguntasQueAbren: [
      "¿Quién cree que sí y quién cree que no? Párense de este lado y de este otro",
      "¿Qué tendríamos que ver para saber cuál de los dos tiene razón?",
      "¿Se puede contestar esto desde aquí sentados?",
    ],
    estaListoCuando: [
      "Hay dos bandos y los dos tienen un argumento, no una corazonada",
      "Tú tampoco sabes la respuesta con seguridad",
      "Todos pueden decir qué haría falta para zanjarla",
    ],
    seCaeCuando:
      "La pregunta tiene respuesta en el libro, o la respuesta es obvia y todos votan lo mismo. Si el curso no se divide, no era una pregunta: era un enunciado con signos de interrogación.",
    ejemplos: [
      {
        proyecto: "Un río que se ve sucio",
        asiSeVe:
          "«¿Está contaminado, o solo se ve turbio porque arrastra tierra?» La mitad ha oído en su casa que está malo y la otra mitad se baña ahí en enero.",
      },
      {
        proyecto: "El desierto que florece",
        asiSeVe:
          "«¿Salen las mismas flores todos los años?» Los que tienen abuelos dicen que antes había más y otras; nadie tiene cómo probarlo.",
      },
    ],
  },
  {
    id: "saber_hacer",
    nombre: "Lo que hay que saber hacer antes de salir",
    proposito:
      "Que lleguen al lugar sabiendo usar lo que van a usar. Esto lo decides tú y no se negocia: mandar a un curso a averiguar algo sin haberle enseñado cómo no es dejarlos crear, es dejarlos solos.",
    alcance: "inmediato",
    decide: "docente",
    preguntasQueAbren: [
      "¿Qué tienen que saber hacer allá que todavía no sepan?",
      "¿Cuál es el error que van a cometer si no se los digo antes?",
      "¿Cómo sabré, antes de salir, quién entendió y quién no?",
    ],
    estaListoCuando: [
      "Lo hiciste tú delante, entero y con los números o los pasos puestos",
      "Lo practicaron primero contigo y después solos",
      "Hiciste una pregunta que contestaron todos a la vez y sabes quién falló",
    ],
    seCaeCuando:
      "Lo saltas porque «van a aprender haciéndolo». Aprenden a hacerlo mal, y en terreno no hay tiempo de corregir a quince personas a la vez.",
    ejemplos: [
      {
        proyecto: "Un río que se ve sucio",
        asiSeVe:
          "Usar las tiras de pH y leer la escala de color; qué significa turbio y qué significa contaminado, que no son lo mismo; cómo se toma una muestra sin contaminarla con las manos.",
      },
      {
        proyecto: "El desierto que florece",
        asiSeVe:
          "Cómo se describe una flor para que otro la reconozca: cuántos pétalos, cómo salen las hojas, de qué color por debajo. Y cómo se fotografía con algo al lado que dé el tamaño.",
      },
    ],
  },
  {
    id: "salir",
    nombre: "Salir a buscar lo que falta",
    proposito:
      "Que vuelvan con algo que no tenían y que no se podía conseguir desde la escuela. Ellos deciden dónde y cómo, porque si lo decides tú están ejecutando tu plan y lo saben.",
    alcance: "intermedio",
    decide: "estudiantes",
    preguntasQueAbren: [
      "¿Dónde exactamente hay que ir, y por qué ahí y no veinte metros más allá?",
      "Si dos grupos eligen distinto y les da distinto, ¿cuál vale?",
      "¿Qué de todo esto no sirve de nada medirlo?",
    ],
    estaListoCuando: [
      "Cada grupo puede defender dónde eligió trabajar",
      "Hay al menos cuatro maneras distintas de trabajar y no todas son medir",
      "Está claro qué van a dejar hecho antes de irse",
    ],
    seCaeCuando:
      "Llevas la planilla con las casillas puestas y el sitio marcado. Entonces no salieron a averiguar nada: salieron a llenar un formulario al aire libre.",
    ejemplos: [
      {
        proyecto: "Un río que se ve sucio",
        asiSeVe:
          "Eligen tres puntos: antes del pueblo, en el pueblo y después. Miden pH y turbidez, pero también describen el olor, fotografían lo que llega a la orilla, siguen un desagüe hasta donde nace y le preguntan a quien pesca desde cuándo cambió.",
      },
      {
        proyecto: "El desierto que florece",
        asiSeVe:
          "Eligen dos laderas, una al sol y otra a la sombra. Cuentan y fotografían, describen olor y tamaño, recogen una muestra por especie, marcan las parcelas con piedras para volver el año siguiente.",
      },
    ],
  },
  {
    id: "preguntar",
    nombre: "Preguntarle a quien sabe de aquí",
    proposito:
      "Que entre al proyecto alguien del lugar con algo que no está en ningún libro, y que los que preguntan sean los estudiantes. La diferencia entre eso y una charla es que las preguntas estén escritas antes.",
    alcance: "intermedio",
    decide: "estudiantes",
    preguntasQueAbren: [
      "¿Quién sabe de esto algo que no podamos averiguar nosotros?",
      "¿Qué tres preguntas le harían, y quién las dice?",
      "¿Qué le vamos a devolver a esa persona cuando terminemos?",
    ],
    estaListoCuando: [
      "Las preguntas están escritas por ellos y ensayadas en voz alta",
      "Está claro quién pregunta y quién anota, y no son el mismo",
      "Se pidió permiso antes, y se sabe qué se hace con lo que cuenten",
    ],
    seCaeCuando:
      "Invitas a alguien a hablar veinte minutos. El curso escucha, nadie anota nada que sirva, y lo que sabe esa persona se pierde igual que si no hubiera venido.",
    ejemplos: [
      {
        proyecto: "Un río que se ve sucio",
        asiSeVe:
          "Al que pesca ahí desde hace treinta años: qué había antes, en qué año dejó de haberlo, qué cambió arriba. Es la única serie de datos larga que van a conseguir.",
      },
      {
        proyecto: "El desierto que florece",
        asiSeVe:
          "A las personas mayores del pueblo: cómo le llaman a cada flor, para qué se usaba, en qué años hubo florecimiento grande. Los nombres locales entran a la exposición junto al nombre científico.",
      },
    ],
  },
  {
    id: "volver",
    nombre: "Volver y ver quién tenía razón",
    proposito:
      "Que cada uno ponga lo que creía al lado de lo que encontró, antes de cualquier cálculo o conclusión. Quien desmiente tiene que ser el dato propio, no tú.",
    alcance: "inmediato",
    decide: "ambos",
    preguntasQueAbren: [
      "¿Quién cambió de bando, y por qué?",
      "¿Qué encontramos que nadie había puesto en la lista?",
      "¿Qué dato se sale de todos los demás, y qué hacemos con él?",
    ],
    estaListoCuando: [
      "Se destapó lo que había quedado escrito el primer día",
      "El curso puede decir qué parte de la pregunta quedó contestada y cuál no",
      "Lo que no calza se discutió en vez de borrarse",
    ],
    seCaeCuando:
      "Se pasa directo a calcular o a escribir. Entonces los datos son del lugar pero la idea con la que llegaron sigue entera, y la salida fue un paseo con planilla.",
    ejemplos: [
      {
        proyecto: "Un río que se ve sucio",
        asiSeVe:
          "Turbio y contaminado resultaron ser cosas distintas: el punto más turbio dio buen pH y el que se veía limpio dio mal. Media sala tenía razón por el motivo equivocado.",
      },
      {
        proyecto: "El desierto que florece",
        asiSeVe:
          "Contaron once especies donde esperaban cuatro, y dos de las que describieron los abuelos no aparecieron. Eso último es un hallazgo, no un fracaso.",
      },
    ],
  },
  {
    id: "decidir_producto",
    nombre: "Deciden qué van a hacer con esto",
    proposito:
      "Que el curso decida qué construye, para quién y en qué formato. Es el momento donde aparece lo que se les ocurre a ellos, y el único que no puedes tomar prestado de otra escuela: depende de lo que encontraron y de quién lo necesita aquí.",
    alcance: "amplio",
    decide: "estudiantes",
    preguntasQueAbren: [
      "De todo lo que encontramos, ¿qué es lo que alguien de afuera necesita saber?",
      "¿A quién le cambia algo esto? ¿Dónde está esa persona y qué mira?",
      "¿Qué formato le llega de verdad a esa persona, y cuál la haría pasar de largo?",
      "¿Qué sabemos hacer que no hayamos usado todavía?",
    ],
    estaListoCuando: [
      "Hay un destinatario con nombre, no «la comunidad»",
      "El formato lo eligieron ellos y pueden decir por qué ese y no otro",
      "Se puede decir en una frase qué tiene que entender quien lo reciba",
      "Cabe en el tiempo y con lo que hay: eligieron algo que de verdad pueden terminar",
    ],
    seCaeCuando:
      "El producto viene puesto de antes. Con el formato decidido por el docente el proyecto se convierte en una tarea larga, y lo que se les ocurra a los estudiantes no tiene por dónde entrar.",
    ejemplos: [
      {
        proyecto: "Un río que se ve sucio",
        asiSeVe:
          "Descartan el informe porque nadie del pueblo lee informes y arman una campaña en redes: video corto en la orilla con los dos frascos, las fotos del desagüe, y una pregunta al municipio que la gente pueda repetir.",
      },
      {
        proyecto: "El desierto que florece",
        asiSeVe:
          "Montan la exposición en la plaza, una ficha por flor con la foto, el nombre local y el científico, y por qué esa flor aguanta años bajo tierra esperando que llueva.",
      },
    ],
  },
  {
    id: "borrador",
    nombre: "Primera versión, críticas, segunda versión",
    proposito:
      "Que el trabajo se haga dos veces. La distancia entre la primera versión y la segunda es la mitad de lo que el curso se lleva, y no aparece si solo se hace una.",
    alcance: "amplio",
    decide: "estudiantes",
    preguntasQueAbren: [
      "Si esto lo ve quien tiene que verlo, ¿qué es lo primero que no va a entender?",
      "¿Qué parte no podrías defender si te la discuten?",
      "¿Qué le sobra? Casi siempre sobra más de lo que falta",
    ],
    estaListoCuando: [
      "Hubo una primera versión hecha rápido, y fea, que nadie entregó",
      "Las críticas son concretas y arreglables: nada de «está bonito»",
      "Se puede señalar con el dedo qué cambió entre una versión y otra",
    ],
    seCaeCuando:
      "La crítica se vuelve elogio o se vuelve pelea. Las dos cosas se evitan con una regla escrita: poco, concreto, y nada que no se pueda arreglar.",
    ejemplos: [
      {
        proyecto: "Un río que se ve sucio",
        asiSeVe:
          "El otro curso ve el video y hace las preguntas incómodas: cómo saben que es el desagüe y no la lluvia. La segunda versión dice qué saben y qué no, y por eso es más difícil de desarmar.",
      },
      {
        proyecto: "El desierto que florece",
        asiSeVe:
          "Una persona mayor lee las fichas y corrige dos nombres locales que estaban cambiados. Las fichas se rehacen: llevaban el nombre de otra flor.",
      },
    ],
  },
  {
    id: "entregar",
    nombre: "Entregarlo donde se vea",
    proposito:
      "Que llegue a alguien que no tenía obligación de mirarlo. Un trabajo que termina en el cuaderno y en la nota no cambia nada, y el curso lo sabe desde el primer día.",
    alcance: "amplio",
    decide: "estudiantes",
    preguntasQueAbren: [
      "¿Cuándo y dónde exactamente, y quién avisa?",
      "¿Quién habla, y qué hace el resto mientras tanto?",
      "Si les preguntan algo que no sabemos, ¿qué contestamos?",
    ],
    estaListoCuando: [
      "Hay fecha, lugar y alguien esperando",
      "Está repartido quién hace qué, y no habla solo el que habla siempre",
      "Ensayaron la pregunta difícil",
    ],
    seCaeCuando:
      "Se entrega a la profesora. Es lo cómodo y deshace el proyecto entero: sin nadie de afuera, todo lo anterior fue un simulacro.",
    ejemplos: [
      {
        proyecto: "Un río que se ve sucio",
        asiSeVe:
          "Publican desde la cuenta de la escuela, con permiso firmado, y le mandan el enlace al municipio por oficio. Anotan si contestan y qué contestan.",
      },
      {
        proyecto: "El desierto que florece",
        asiSeVe:
          "Montan la exposición un domingo de feria en la plaza. Cada estudiante se queda junto a sus fichas y le explica a quien pregunte.",
      },
    ],
  },
  {
    id: "otra_parte",
    nombre: "El mismo problema en otra parte",
    proposito:
      "Comprobar que entendieron la idea y no se aprendieron su caso. Es lo último y lo único que distingue una cosa de la otra.",
    alcance: "amplio",
    decide: "docente",
    preguntasQueAbren: [
      "En un lugar que no se parece a este, ¿qué de lo que aprendimos sigue sirviendo?",
      "¿Qué haríamos distinto allá, y por qué?",
      "¿Qué respuesta parecería buena y sería solo repetir lo nuestro?",
    ],
    estaListoCuando: [
      "El sitio nuevo no se parece al suyo: otro clima, otro paisaje, otra escala",
      "Está dicho qué tiene que aparecer en la respuesta para darla por buena",
      "Está dicho cuál es la respuesta que engaña",
    ],
    seCaeCuando:
      "El escenario nuevo se parece demasiado. Entonces contestan de memoria y pasan la prueba sin haber trasladado nada.",
    ejemplos: [
      {
        proyecto: "Un río que se ve sucio",
        asiSeVe:
          "Un canal de riego en el valle, sin caudal visible y con agua que se reparte por turnos. ¿Cómo averiguarían si está contaminado, si no pueden medir aguas arriba?",
      },
      {
        proyecto: "El desierto que florece",
        asiSeVe:
          "Un bosque del sur después de un incendio. ¿Qué esperarían ver el primer año y el tercero, y en qué se parece a lo que vieron ustedes?",
      },
    ],
  },
];

/** Los momentos de un anillo, para leerlos por dónde ocurren. */
export function momentosDe(alcance: Alcance): Momento[] {
  return MOMENTOS.filter((m) => m.alcance === alcance);
}

export function momentoPorId(id: string): Momento | undefined {
  return MOMENTOS.find((m) => m.id === id);
}

/**
 * Cuántos momentos son de los estudiantes.
 *
 * Se usa en pantalla y no es un adorno: es la respuesta a la pregunta de si
 * este método deja lugar a lo que se les ocurra a ellos o solo lo dice.
 */
export const DE_LOS_ESTUDIANTES = MOMENTOS.filter(
  (m) => m.decide === "estudiantes"
).length;
