/**
 * De dónde sale el proyecto: una problemática del lugar, entrada por la prensa.
 *
 * POR QUÉ SE EMPIEZA AQUÍ Y NO POR EL LUGAR
 *
 * La primera lámina pedía al docente que escribiera en cuadros de texto la
 * asignatura, las temáticas, el fenómeno local, qué se podría averiguar y el
 * producto final. Cinco campos en blanco delante de alguien que abrió la
 * aplicación para que le ayudaran a pensar. Eso no es recoger información: es
 * pedirle el trabajo hecho y después devolvérselo ordenado.
 *
 * Ahora se empieza por una problemática que ya está ocurriendo y de la que ya
 * se ha escrito. Eso cambia tres cosas de golpe: el curso entra por algo real
 * y fechado en vez de por un tema, el docente elige en vez de redactar, y la
 * noticia da lo que ningún cuadro de texto da, que es un punto de partida
 * común para veinte personas que todavía no saben nada del asunto.
 *
 * LO QUE NO HAY AQUÍ, Y POR QUÉ
 *
 * No hay titulares escritos. Un titular con su medio y su fecha es un registro,
 * y un registro inventado sigue pareciendo verdadero después de que alguien lo
 * cite: si esta lista trajera notas de prensa redactadas por una máquina,
 * terminarían en la pizarra de una escuela como si fueran ciertas.
 *
 * Lo que sí trae cada problemática es `comoSeBuscan`: con qué palabras
 * buscarla, en qué clase de medio aparece y qué nota sirve de verdad. Las
 * noticias las pega el docente, o las carga la plataforma desde una fuente
 * real. Hasta que eso pase, la pantalla lo dice en vez de disimularlo.
 *
 * LOS ÁNGULOS
 *
 * Una misma problemática abre trabajos distintos según desde qué asignatura se
 * entre, y ese es el punto entero: el río contaminado es biología si se mira
 * qué se murió, química si se miden los niveles, e historia si se reconstruye
 * para qué servía ese río hace cincuenta años. Los tres son el mismo río y
 * ninguno es el mismo proyecto.
 */

/** Las asignaturas desde las que se puede entrar. */
export type Asignatura =
  | "biologia"
  | "quimica"
  | "fisica"
  | "matematica"
  | "lenguaje"
  | "historia"
  | "artes"
  | "tecnologia";

export const ASIGNATURAS: { id: Asignatura; nombre: string }[] = [
  { id: "biologia", nombre: "Biología" },
  { id: "quimica", nombre: "Química" },
  { id: "fisica", nombre: "Física" },
  { id: "matematica", nombre: "Matemática" },
  { id: "lenguaje", nombre: "Lenguaje" },
  { id: "historia", nombre: "Historia y Geografía" },
  { id: "artes", nombre: "Artes Visuales" },
  { id: "tecnologia", nombre: "Tecnología" },
];

/**
 * Una nota de prensa sobre la problemática.
 *
 * Se guarda con medio y fecha porque sin eso no se puede analizar: media clase
 * del momento 01 consiste en preguntar de cuándo es, quién lo escribió y a
 * quién le convenía escribirlo.
 */
export type Noticia = {
  titular: string;
  medio: string;
  /** Cuándo se publicó. Con mes basta, y el mes importa. */
  fecha: string;
  url?: string;
  /** Qué aporta esta nota que las otras no. */
  queAporta?: string;
};

/** El mismo problema, mirado desde una asignatura. */
export type Angulo = {
  asignatura: Asignatura;
  /** Qué se persigue desde aquí, en una frase. */
  enfoque: string;
  /** Qué averiguan concretamente. */
  queInvestigan: string;
  /** Qué clase de hallazgo sale de este ángulo y no de los otros. */
  queSaleDeAqui: string;
};

export type Problema = {
  id: string;
  nombre: string;
  queEs: string;
  /** Dónde se da. No todas las escuelas lo tienen delante. */
  dondeAparece: string;
  /** Cómo encontrar las notas de prensa de ESTA zona. */
  comoSeBuscan: {
    terminos: string[];
    donde: string;
    queNotaSirve: string;
  };
  angulos: Angulo[];
};

export const PROBLEMAS: Problema[] = [
  {
    id: "rio_contaminado",
    nombre: "Un río o estero contaminado",
    queEs:
      "El agua que pasa cerca de la escuela cambió: cambió de color, de olor, de lo que vive dentro, o de lo que se puede hacer con ella. Puede venir de arriba, de un desagüe, de la agricultura o de la basura.",
    dondeAparece:
      "Escuelas con un río, un estero o un canal a distancia de caminata, que es la mayoría del país rural.",
    comoSeBuscan: {
      terminos: [
        "contaminación río + nombre de la comuna",
        "denuncia riles + nombre del río",
        "mortandad de peces + región",
        "sumario sanitario agua + comuna",
      ],
      donde:
        "Diarios regionales y radios locales, que es donde estas cosas se publican; también actas del concejo municipal y resoluciones de la superintendencia, que son públicas y nadie lee.",
      queNotaSirve:
        "La que trae una fecha, un lugar preciso y alguien diciendo algo. Una nota general sobre contaminación no sirve: el curso tiene que poder ir al punto del que habla.",
    },
    angulos: [
      {
        asignatura: "biologia",
        enfoque: "Disminuir el impacto en la flora y la fauna del lugar.",
        queInvestigan:
          "Qué vive todavía en el agua y en la orilla, y qué había antes que ya no se ve. Se comparan tramos: arriba del punto sospechoso y abajo.",
        queSaleDeAqui:
          "Una lista de lo que falta. Es el dato que más convence y el único que no se consigue con instrumentos: hay que saber qué buscar y preguntarle a quien lleva años mirando.",
      },
      {
        asignatura: "quimica",
        enfoque:
          "Detectar los niveles de pH para encontrar las zonas más contaminadas e intervenir.",
        queInvestigan:
          "pH, turbidez y temperatura en varios puntos del mismo cauce, siempre a la misma hora, para que se puedan comparar entre sí.",
        queSaleDeAqui:
          "Un mapa del cauce con los puntos marcados. Sirve para señalar dónde entra el problema, que es distinto de decir que el río está sucio.",
      },
      {
        asignatura: "historia",
        enfoque:
          "Revisar cómo el río ha ayudado a las comunidades en los últimos años, y digitalizar ese proceso.",
        queInvestigan:
          "Para qué se usaba el río, quién vivía de él, en qué década dejó de usarse y por qué. Se hace con entrevistas y con fotos familiares, que es el archivo que existe.",
        queSaleDeAqui:
          "La línea de tiempo del río contada por quienes estaban. Es lo único que explica por qué a la gente del pueblo le importa, y sin eso el proyecto es un informe técnico.",
      },
      {
        asignatura: "matematica",
        enfoque: "Ordenar lo medido para que diga algo.",
        queInvestigan:
          "Promedios, diferencias entre puntos, cómo cambia a lo largo de las semanas. Y cuál medición se sale de todas las demás, que es la pregunta interesante.",
        queSaleDeAqui:
          "Los gráficos con los que se defiende el hallazgo. Sin esto los números son una lista y no un argumento.",
      },
      {
        asignatura: "lenguaje",
        enfoque: "Escribir para que alguien de afuera lo entienda y actúe.",
        queInvestigan:
          "Cómo está contada la problemática en la prensa: qué se dice, qué se omite, a quién se cita. Y cómo se escribe una nota propia que no se pueda desarmar.",
        queSaleDeAqui:
          "El texto que va a leer el municipio o el vecindario. Es la pieza de la que depende que todo lo demás sirva de algo.",
      },
    ],
  },
  {
    id: "falta_agua",
    nombre: "El agua que no alcanza",
    queEs:
      "Pozos que bajan, vertientes que se secan antes que otros años, camiones aljibe que llegan dos veces por semana. No es solo que llueva menos: es cómo se reparte lo que hay.",
    dondeAparece:
      "Zonas con decreto de escasez hídrica, secano costero, valles con riego por turnos, y cualquier escuela que dependa de un pozo.",
    comoSeBuscan: {
      terminos: [
        "decreto escasez hídrica + comuna",
        "camiones aljibe + provincia",
        "APR comité agua potable rural + localidad",
        "derechos de agua + cuenca",
      ],
      donde:
        "Prensa regional, boletines de la dirección general de aguas y las actas del comité de agua potable rural, que suele tener los datos más útiles y nunca aparecen en ninguna nota.",
      queNotaSirve:
        "La que dé una cifra: cuántas casas, cuántos litros, desde qué mes. Las notas de opinión sobre la sequía no dan por dónde empezar.",
    },
    angulos: [
      {
        asignatura: "matematica",
        enfoque: "Saber cuánta agua hay y cuánta se usa.",
        queInvestigan:
          "El consumo real de la escuela o de una casa durante una semana, contra lo que entra. Se cuenta con lo que hay: el contador, los estanques, los viajes del camión.",
        queSaleDeAqui:
          "La diferencia entre lo que se cree que se gasta y lo que se gasta. Nunca coinciden, y esa brecha es el proyecto.",
      },
      {
        asignatura: "biologia",
        enfoque: "Qué aguanta y qué no con menos agua.",
        queInvestigan:
          "Qué plantas del lugar siguen ahí después de varios años secos y cuáles desaparecieron de las huertas. Se pregunta a quien siembra.",
        queSaleDeAqui:
          "Una lista de lo que conviene sembrar aquí ahora, que es un consejo que alguien va a usar.",
      },
      {
        asignatura: "historia",
        enfoque: "Cómo se repartía el agua antes, y quién decidía.",
        queInvestigan:
          "Turnos de riego, acuerdos entre vecinos, en qué momento cambió la cosa. Es un asunto de reglas, no solo de lluvia.",
        queSaleDeAqui:
          "Entender que la escasez tiene tanto de reparto como de clima, que es la parte que la prensa casi nunca cuenta.",
      },
      {
        asignatura: "tecnologia",
        enfoque: "Construir algo que ahorre agua de verdad.",
        queInvestigan:
          "Riego por goteo casero, recolección de lluvia, acolchado. Se prueba y se mide si sirvió.",
        queSaleDeAqui:
          "Una cosa instalada y funcionando, más el dato de cuánta agua ahorró. Sin el dato es una maqueta.",
      },
    ],
  },
  {
    id: "basura",
    nombre: "Microbasurales y basura que no se retira",
    queEs:
      "Sitios donde la basura se acumula porque el camión no llega, porque no hay dónde dejarla, o porque siempre se ha dejado ahí. Suelen estar en las salidas del pueblo y al lado de los cauces.",
    dondeAparece:
      "Casi cualquier localidad. Es la problemática más fácil de encontrar y la más fácil de tratar mal, porque se presta para la campaña de afiches sin averiguar nada.",
    comoSeBuscan: {
      terminos: [
        "microbasural + comuna",
        "retiro de residuos + localidad",
        "vertedero ilegal + provincia",
        "plan de manejo de residuos municipal",
      ],
      donde:
        "Prensa local y, sobre todo, actas del concejo municipal: ahí está qué se ha pedido, qué se aprobó y con qué presupuesto.",
      queNotaSirve:
        "La que diga dónde y desde cuándo. Si no se puede ir a ver el sitio, no sirve.",
    },
    angulos: [
      {
        asignatura: "matematica",
        enfoque: "Cuánta basura hay, de qué tipo y de dónde viene.",
        queInvestigan:
          "Se cuenta y se clasifica una muestra: qué proporción es envase, orgánico, escombro. El escombro cambia el diagnóstico porque no lo deja una persona a pie.",
        queSaleDeAqui:
          "Saber si el microbasural es doméstico o es de camioneta, que lleva a soluciones opuestas.",
      },
      {
        asignatura: "biologia",
        enfoque: "Qué le hace al suelo y al agua de al lado.",
        queInvestigan:
          "Qué crece y qué no crece alrededor, adónde escurre cuando llueve, qué animales llegan.",
        queSaleDeAqui:
          "La conexión entre el sitio y algo que a la gente sí le importa, que casi siempre es el agua o los perros.",
      },
      {
        asignatura: "historia",
        enfoque: "Desde cuándo se deja basura ahí y por qué ahí.",
        queInvestigan:
          "Se pregunta a los vecinos más antiguos. Los microbasurales suelen estar donde antes hubo otra cosa: un pozo, un camino, un botadero autorizado.",
        queSaleDeAqui:
          "La razón real, que casi nunca es que la gente sea desordenada.",
      },
      {
        asignatura: "artes",
        enfoque: "Hacer visible lo que se volvió invisible.",
        queInvestigan:
          "Fotografía del mismo punto en distintos momentos, o registro de lo que se encuentra tratado como catálogo.",
        queSaleDeAqui:
          "Una pieza que obliga a mirar un sitio por el que todos pasan sin verlo.",
      },
    ],
  },
  {
    id: "aire_lena",
    nombre: "El humo de la leña y el frío en las casas",
    queEs:
      "En invierno el aire del pueblo se pone denso y las casas siguen frías. Las dos cosas son el mismo problema: se quema mucho porque la casa no retiene el calor.",
    dondeAparece:
      "Todo el centro y sur del país. Hay comunas con planes de descontaminación y otras sin ninguna medición.",
    comoSeBuscan: {
      terminos: [
        "plan de descontaminación + comuna",
        "calidad del aire material particulado + ciudad",
        "preemergencia ambiental + región",
        "subsidio acondicionamiento térmico + comuna",
      ],
      donde:
        "Prensa regional en invierno, y las estaciones de monitoreo públicas, que publican datos por hora y casi nadie los mira.",
      queNotaSirve:
        "La que traiga una medición con fecha y hora. Con eso el curso puede comparar su propio día con el registro oficial.",
    },
    angulos: [
      {
        asignatura: "fisica",
        enfoque: "Por dónde se escapa el calor de una casa o de la sala.",
        queInvestigan:
          "Temperatura en varios puntos a la misma hora durante una semana, y dónde está la diferencia grande.",
        queSaleDeAqui:
          "El punto de fuga, que casi nunca es donde la gente cree. Eso permite pedir algo concreto en vez de quejarse.",
      },
      {
        asignatura: "quimica",
        enfoque: "Qué se quema y qué sale de eso.",
        queInvestigan:
          "Qué leña se usa, cuán húmeda está, y qué diferencia hace la humedad en cuánto humo sale.",
        queSaleDeAqui:
          "Una recomendación que se puede seguir esta semana, no el año que viene.",
      },
      {
        asignatura: "matematica",
        enfoque: "Cuánto se gasta en calefacción y cuánto se podría no gastar.",
        queInvestigan:
          "Metros de leña por invierno por casa, precio, y qué pasaría tapando las filtraciones.",
        queSaleDeAqui:
          "Una cifra en pesos, que es la que hace que alguien actúe.",
      },
      {
        asignatura: "historia",
        enfoque: "Cómo se calentaban las casas antes de que hubiera estufas.",
        queInvestigan:
          "Orientación de las casas antiguas, dónde iba el fuego, qué materiales se usaban.",
        queSaleDeAqui:
          "Soluciones que ya se probaron aquí durante generaciones y que la construcción actual olvidó.",
      },
    ],
  },
  {
    id: "suelo_erosion",
    nombre: "La tierra que se va",
    queEs:
      "Cárcavas que crecen, raíces al aire, tierra arrastrada al pie de los cortes. Se pierde en un invierno lo que tardó siglos en formarse, y se nota primero en lo que deja de prender.",
    dondeAparece:
      "Laderas, secano, terrenos después de un incendio o de una tala, y cualquier corte de camino reciente.",
    comoSeBuscan: {
      terminos: [
        "erosión suelo + región",
        "recuperación de suelos degradados SIRSD + comuna",
        "deslizamiento camino + localidad",
        "incendio forestal + sector",
      ],
      donde:
        "Prensa regional después de cada temporal, y los programas de recuperación de suelos del agro, que publican qué predios están degradados.",
      queNotaSirve:
        "La que muestre un antes y un después, o un lugar al que se pueda llegar caminando.",
    },
    angulos: [
      {
        asignatura: "biologia",
        enfoque: "Qué sostiene la tierra y qué la suelta.",
        queInvestigan:
          "Qué crece en la parte que aguanta y qué falta donde se cae. Se comparan dos pedazos a pocos metros.",
        queSaleDeAqui:
          "Qué plantar, y dónde, para que agarre. Se puede hacer el mismo día.",
      },
      {
        asignatura: "quimica",
        enfoque: "Qué tiene esta tierra y qué retiene.",
        queInvestigan:
          "Cuánta agua se queda en cada capa, qué se deshace en la mano, qué color tiene.",
        queSaleDeAqui:
          "Por qué esta tierra se seca aunque llueva, que es la pregunta que todos los que siembran se hacen.",
      },
      {
        asignatura: "matematica",
        enfoque: "Cuánto se está yendo y en cuánto tiempo.",
        queInvestigan:
          "Grosor de las capas, avance de una cárcava medido entre dos visitas, superficie afectada.",
        queSaleDeAqui:
          "Una tasa: centímetros por año. Es lo que convierte un paisaje feo en un problema con plazo.",
      },
      {
        asignatura: "tecnologia",
        enfoque: "Frenarlo con lo que hay.",
        queInvestigan:
          "Barreras vivas, zanjas de infiltración, cobertura. Se instala y se vuelve a medir.",
        queSaleDeAqui:
          "Una obra pequeña que se puede mostrar, y el dato de si funcionó.",
      },
    ],
  },
  {
    id: "memoria_oficios",
    nombre: "Lo que se está dejando de saber",
    queEs:
      "Oficios, cultivos, palabras, recetas y maneras de hacer que sabe la generación mayor del pueblo y que no está pasando a la siguiente. No es nostalgia: es conocimiento que funciona y que se va a perder este año o el próximo.",
    dondeAparece:
      "En todas partes, y es la problemática que mejor funciona donde no hay un conflicto ambiental evidente.",
    comoSeBuscan: {
      terminos: [
        "patrimonio cultural inmaterial + comuna",
        "oficios tradicionales + región",
        "tesoros humanos vivos",
        "despoblamiento rural + provincia",
      ],
      donde:
        "Prensa local en fiestas y aniversarios, registros municipales de cultura, y sobre todo lo que sepa el educador tradicional o la biblioteca pública.",
      queNotaSirve:
        "Cualquiera que nombre a una persona que todavía está viva y se pueda entrevistar.",
    },
    angulos: [
      {
        asignatura: "historia",
        enfoque: "Registrar antes de que no se pueda.",
        queInvestigan:
          "Entrevistas grabadas con quienes saben, con las preguntas preparadas por los estudiantes. Se ordena por tema y por fecha.",
        queSaleDeAqui:
          "Un archivo que antes no existía y que va a quedar cuando el curso ya no esté.",
      },
      {
        asignatura: "lenguaje",
        enfoque: "Cómo se dice aquí lo que en otras partes se dice de otro modo.",
        queInvestigan:
          "Las palabras propias del lugar y del oficio: cómo se llama cada herramienta, cada parte, cada momento del año.",
        queSaleDeAqui:
          "Un glosario del lugar. Es el trabajo más barato de hacer y el que más dura.",
      },
      {
        asignatura: "artes",
        enfoque: "Mostrar el oficio, no describirlo.",
        queInvestigan:
          "Registro visual del proceso completo, paso a paso, con las manos de quien lo hace.",
        queSaleDeAqui:
          "Algo que permite aprender el oficio mirando, que es como se aprendió siempre.",
      },
      {
        asignatura: "biologia",
        enfoque: "Qué sabe de los seres vivos quien trabaja con ellos.",
        queInvestigan:
          "Qué plantas se usan y para qué, en qué época se recogen, qué señales se miran para decidir cuándo sembrar.",
        queSaleDeAqui:
          "Conocimiento comprobable que suele coincidir con lo que dice el libro, dicho en otras palabras y con más detalle local.",
      },
    ],
  },
];

export function problemaPorId(id: string): Problema | undefined {
  return PROBLEMAS.find((p) => p.id === id);
}

export function nombreAsignatura(id: string): string {
  return ASIGNATURAS.find((a) => a.id === id)?.nombre ?? id;
}

/**
 * Los ángulos de un problema que caen dentro de las asignaturas marcadas.
 *
 * Sin filtro los devuelve todos: un docente que todavía no ha elegido
 * asignatura está mirando para decidir, y esconderle opciones ahí es lo peor
 * que se puede hacer.
 */
export function angulosDe(problema: Problema, asignaturas: string[]): Angulo[] {
  if (!asignaturas.length) return problema.angulos;
  const filtrados = problema.angulos.filter((a) => asignaturas.includes(a.asignatura));
  return filtrados.length ? filtrados : problema.angulos;
}

/**
 * Lo que el curso tiene que sacar en limpio de la primera clase.
 *
 * No son objetivos del programa: son las tres cosas que tienen que haber
 * ocurrido antes de seguir, y por eso están escritas como lo que se ve, no
 * como lo que se espera. La tercera es la que decide si hay proyecto: sin
 * preguntas propias lo que sigue es una tarea sobre una noticia.
 */
export const QUE_SACAN_DE_LA_NOTICIA: {
  titulo: string;
  queEs: string;
  seNotaEn: string;
}[] = [
  {
    titulo: "Entienden de qué se trata",
    queEs:
      "Separan de la nota quiénes están metidos, qué la causó, qué consecuencias tiene, dónde ocurre y desde cuándo.",
    seNotaEn:
      "pueden contestar «¿de cuándo es esto y dónde queda?» sin volver a leer, y notan si la nota no lo dice.",
  },
  {
    titulo: "La conectan con lo suyo",
    queEs:
      "Explican con sus palabras en qué les toca a ellos o a su comunidad, sea de manera directa o de rebote.",
    seNotaEn:
      "aparece un lugar concreto de aquí en lo que dicen, no «el medio ambiente». Si nadie logra conectarlo, esta problemática no es la de esta escuela.",
  },
  {
    titulo: "Se hacen preguntas propias",
    queEs:
      "Formulan preguntas o dudas que muestran que quieren averiguar algo, y que la nota no contesta.",
    seNotaEn:
      "las preguntas son sobre aquí y no sobre la noticia. Esta es la que decide si hay proyecto: sin preguntas propias, lo que sigue es una tarea de comprensión de lectura.",
  },
];
