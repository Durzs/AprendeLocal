/**
 * El método: seis etapas que sirven para cualquier proyecto.
 *
 * QUÉ CAMBIÓ Y POR QUÉ
 *
 * Antes esto eran diez momentos. Estaban bien vistos y eran demasiados: un
 * docente que abre esto el domingo por la noche no puede sostener diez cosas
 * en la cabeza, y en la práctica varios de los diez ocurrían en la misma clase.
 * Se plegaron a cinco, que se leen de una vez y corresponden cada una a algo
 * que pasa en un bloque real del calendario.
 *
 * Después entró una sexta, y no por simetría. En una entrevista de validación
 * quedó señalado que entre recolectar los datos y ponerse a crear propuestas
 * falta un paso: procesar las conclusiones. Sin él, el curso vuelve del
 * terreno y propone soluciones apoyadas en lo que ya pensaba antes de salir,
 * con lo que todo el trabajo de terreno queda de adorno. Esa es la etapa
 * «Ordenar lo que se trajo», y es donde el dato se convierte en un hallazgo
 * que se puede defender.
 *
 * EL CIERRE DE CADA ETAPA
 *
 * Todas terminan con tres preguntas que cada estudiante contesta en su
 * cuaderno. También salió de esa entrevista: la metacognición tiene que ser
 * formal y constante, en cada fase, y no una actividad del final. Individual y
 * no en grupo, porque en grupo contesta el que siempre contesta.
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
  /**
   * El cierre de la etapa, por escrito y de a uno.
   *
   * Lo pidió un docente en una entrevista de validación y su punto era que la
   * metacognición no puede ser una actividad del final: tiene que ser formal y
   * constante, en cada fase, con bitácora o cuestionario individual.
   *
   * Individual y no en grupo, y esa es la parte que importa. En grupo contesta
   * el que siempre contesta, y justamente el estudiante que se está quedando
   * atrás es el que no levanta la mano. Tres preguntas escritas al cierre de
   * cada etapa son también el sistema de alerta temprana que en otra entrevista
   * se echó de menos: quien no entiende qué está haciendo se detecta aquí, en
   * la semana dos, y no al final cuando ya no hay nada que corregir.
   */
  cierre: {
    /** Las preguntas que cada estudiante contesta en su cuaderno. */
    preguntas: string[];
    /** Qué mira el docente en esas respuestas, y qué le dice cada cosa. */
    queMirar: string;
  };
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
          "Formula preguntas o reflexiones propias que muestran interés y que la noticia no contesta. No sale de pedirlas: sale de mostrar dos o tres preguntas hechas, desarmarlas delante del curso para ver de qué están hechas, y corregir las primeras que escriban. Pedir preguntas complejas en la primera sesión, sin ese trabajo previo, devuelve preguntas de una línea que nadie va a querer investigar.",
        seNotaEn:
          "las preguntas son sobre aquí y no sobre la noticia. Esta es la que decide si hay proyecto: sin preguntas propias, lo que sigue es comprensión de lectura.",
      },
    ],
    preguntasQueAbren: [
      "Esta pregunta que traigo yo, ¿de qué está hecha? ¿Qué la hace difícil de contestar de una vez?",
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
    cierre: {
      preguntas: [
        "¿Qué de esto pasa cerca de donde yo vivo? Escribe un lugar concreto.",
        "¿Qué es lo que todavía no entiendo de este problema?",
        "¿Qué me gustaría averiguar que hoy no sé?",
      ],
      queMirar:
        "La primera dice si el problema aterrizó o quedó en abstracto: quien escribe «el medio ambiente» todavía no lo conectó. La segunda es la más útil de las tres, porque el que no pregunta nada suele ser el que no entendió nada.",
    },
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
    cierre: {
      preguntas: [
        "Explica con tus palabras uno de los conceptos que pasamos, sin mirar el cuaderno.",
        "¿Qué parte de la técnica no me queda clara?",
        "¿Para qué sirve lo que vamos a ir a hacer?",
      ],
      queMirar:
        "Si la tercera se contesta con «porque la profe dijo», el proyecto todavía no es de ellos. La segunda evita que alguien llegue al terreno sin saber qué hacer, que es cuando la salida se pierde para esa persona.",
    },
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
    cierre: {
      preguntas: [
        "¿Qué vi que no esperaba ver?",
        "¿Qué me costó hacer y por qué?",
        "¿Qué parte del trabajo hice yo?",
      ],
      queMirar:
        "La tercera es incómoda a propósito y es la que detecta al que quedó fuera del grupo. Contestada en el cuaderno y no en voz alta, se contesta de verdad.",
    },
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
    id: "analisis",
    nombre: "Ordenar lo que se trajo",
    queOcurre:
      "El curso vuelve del terreno con registros sueltos y todavía no tiene un hallazgo: tiene material. Aquí se ordena, se cruza con lo que ya sabían, y se decide qué es lo que de verdad encontraron. Es la etapa donde el dato se convierte en algo que se puede decir en voz alta y defender.",
    alcance: "inmediato",
    decide: "estudiantes",
    aprendizajes: [
      {
        nombre: "Tratamiento de datos",
        queEs:
          "Ordenar lo recogido de manera que se pueda comparar: la misma unidad, la misma escala, los puntos en el mismo orden. Es trabajo de matemática y casi siempre se lo salta.",
        seNotaEn:
          "la tabla o el gráfico permite comparar dos cosas, y pueden decir por qué pusieron eso en el eje y no otra cosa.",
      },
      {
        nombre: "Distinción entre dato y conclusión",
        queEs:
          "Saber dónde termina lo que midieron y dónde empieza lo que interpretan. Las dos cosas valen; confundirlas es lo que hace que una conclusión no se pueda defender.",
        seNotaEn:
          "pueden separar en dos columnas qué vieron y qué creen que significa, y notan cuando un compañero pasa de una a otra sin avisar.",
      },
      {
        nombre: "Contraste con lo que suponían",
        queEs:
          "Volver a lo que escribieron antes de salir y ver qué se sostuvo y qué no. Lo que no calza es lo más valioso y es lo primero que se tiende a borrar.",
        seNotaEn:
          "pueden nombrar una cosa concreta en la que se equivocaron, sin que suene a que estuvo mal hacer el proyecto.",
      },
      {
        nombre: "Formulación del hallazgo",
        queEs:
          "Dejar escrita en una frase la cosa que el curso puede afirmar, con su dato detrás. Esa frase es lo que después sostiene la propuesta.",
        seNotaEn:
          "la frase cabe en un renglón, nombra un lugar y trae un número o una observación que la respalda.",
      },
    ],
    preguntasQueAbren: [
      "¿Qué encontramos que no esperábamos?",
      "De todo esto, ¿qué es lo que podemos afirmar y qué es lo que estamos suponiendo?",
      "Si alguien no nos cree, ¿qué le mostramos?",
      "¿Qué nos falta para poder decirlo? ¿Se puede conseguir?",
      "¿Hay un dato que no calza con los demás? ¿Lo medimos mal o es que ahí pasa algo?",
    ],
    estaListoCuando: [
      "Existe una frase escrita que dice qué encontraron, y cabe en un renglón",
      "Esa frase tiene detrás un dato que se puede mostrar",
      "Se revisó lo que habían supuesto antes de salir y se dijo en qué se equivocaron",
      "Lo que no calza quedó anotado como pregunta abierta y no borrado",
    ],
    seCaeCuando:
      "Se vuelve del terreno y se pasa directo a proponer soluciones. Entonces la propuesta no se apoya en lo que encontraron sino en lo que ya pensaban antes de salir, y todo el trabajo de terreno queda de adorno. Es el salto más común y el más caro.",
    cierre: {
      preguntas: [
        "¿En qué me equivocaba antes de salir?",
        "¿Qué dato me convenció y por qué ese y no otro?",
        "¿Qué le diría a alguien que no nos cree?",
      ],
      queMirar:
        "La primera es el corazón de la etapa: quien no puede nombrar nada en lo que se equivocó, probablemente no miró sus propios datos. La tercera ensaya la defensa del hallazgo antes de que haga falta.",
    },
    ejemplos: [
      {
        proyecto: "Un río que se ve sucio",
        asiSeVe:
          "Ponen los tres puntos en una tabla y descubren que el más turbio no es el más contaminado. La frase que queda escrita es que el problema entra después del pueblo y no antes, que es lo contrario de lo que creía media sala.",
      },
      {
        proyecto: "El desierto que florece",
        asiSeVe:
          "Cruzan las dos laderas y las once especies con lo que contaron los abuelos. La frase que queda es que hay más variedad de la que esperaban pero faltan dos de las que se nombraban antes, y eso abre la pregunta de desde cuándo.",
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
    cierre: {
      preguntas: [
        "¿A quién le sirve esto que estamos haciendo? Nómbralo.",
        "¿Qué parte de nuestra propuesta creo que no va a funcionar?",
        "¿Qué necesito aprender para hacer bien mi parte?",
      ],
      queMirar:
        "La segunda vale más que cualquier entusiasmo: un curso que puede nombrar la parte débil de su propia propuesta la va a arreglar. La tercera dice qué falta enseñar todavía, y a tiempo.",
    },
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
    cierre: {
      preguntas: [
        "¿Qué cambió en cómo miro este lugar?",
        "¿Qué haría distinto si empezáramos de nuevo?",
        "¿Qué parte del problema sigue ahí después de todo esto?",
      ],
      queMirar:
        "La tercera se pregunta a propósito y no es derrotista: un proyecto que dice haber resuelto un problema territorial está mintiendo, y reconocer lo que queda en pie es parte del aprendizaje cívico.",
    },
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
