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
 * DE DÓNDE SALEN LAS NOTICIAS
 *
 * Cada problemática viene con `respaldo`: notas y estudios REALES, con su
 * medio, su fecha y su enlace, comprobados uno por uno antes de escribirlos
 * aquí. Ninguno está redactado por una máquina y ninguno se puede agregar sin
 * haberlo abierto: un titular con su medio y su fecha es un registro, y un
 * registro inventado sigue pareciendo verdadero después de que alguien lo cite,
 * hasta terminar en la pizarra de una sala como si fuera cierto.
 *
 * Ese respaldo es nacional y sirve para plantear el asunto, no para cerrarlo.
 * La nota que de verdad mueve a un curso es la de su propia comuna, y esa no la
 * tenemos: por eso cada problemática trae además `comoSeBuscan`, con qué
 * palabras buscarla y qué nota sirve, y la pantalla deja pegar las de su zona.
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
  /**
   * Cuándo se publicó, si se pudo comprobar.
   *
   * Va opcional a propósito: es preferible una fuente sin fecha a una fecha
   * puesta a ojo. Media clase del momento 01 consiste en preguntar de cuándo
   * es esto, y una fecha inventada arruina justamente esa conversación.
   */
  fecha?: string;
  url?: string;
  /** Qué trae esta fuente, con sus cifras tal como las da. */
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
  /**
   * Los términos del programa que hacen falta para entender esto.
   *
   * Van aquí y no en un cuadro de texto porque dependen del problema Y de la
   * asignatura: «bioindicador» hace falta para mirar un río desde biología y
   * no hace ninguna falta para mirarlo desde historia. Se proponen para que el
   * docente los corrija, que es más fácil que escribirlos de cero.
   */
  conceptosClave: string[];
  /** Las técnicas de terreno que este ángulo necesita ensayar antes de salir. */
  tecnicas: string[];
  /**
   * Los objetivos del programa que esta actividad abre.
   *
   * Va en este sentido y no en el contrario, y eso salió de una entrevista: un
   * docente no parte del objetivo y busca actividad, parte de algo que quiere
   * hacer y después busca dónde encaja. «Medir cuánta agua gasta la escuela»
   * ya implica diferencia, suma y resta; el objetivo se reconoce, no se elige
   * primero.
   *
   * Hay códigos de Ciencias Naturales y de Matemática, que son las dos
   * asignaturas cargadas. Matemática entró después de una entrevista en la que
   * quedó a la vista el peor caso posible: la plataforma proponía una actividad
   * de matemática y acto seguido avisaba de que sus objetivos no estaban.
   *
   * Los ángulos de Historia, Lenguaje, Artes y Tecnología van vacíos a
   * propósito, y se avisa en pantalla. Decirlo vale más que inventar un código
   * que no existe: esto se imprime en la hoja que se lleva a la dirección.
   */
  oaQueAbre: string[];
};

export type Problema = {
  id: string;
  nombre: string;
  queEs: string;
  /** Dónde se da. No todas las escuelas lo tienen delante. */
  dondeAparece: string;
  /**
   * Las fuentes reales que sostienen que esto es un problema y no un tema.
   *
   * Se abren y se leen: son el material del que el curso saca quiénes están
   * metidos, qué lo causó, dónde ocurre y desde cuándo.
   */
  respaldo: Noticia[];
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
    respaldo: [
      {
        titular:
          "Multan a sanitaria por contaminación de río en La Araucanía: empresa suma infracciones en cuatro regiones",
        medio: "El Desconcierto",
        fecha: "8 de septiembre de 2026",
        url: "https://eldesconcierto.cl/medio-ambiente/multan-sanitaria-contaminacion-rio-la-araucania-empresa-suma-infracciones-cuatro-regiones-n5462066",
        queAporta:
          "La Superintendencia del Medio Ambiente multó con 669 millones de pesos a Aguas de San Isidro por verter aguas servidas al río Huichahue y a canales de regadío. La planta trata las aguas de 1.055 casas. Los vecinos habían reportado olores, problemas de salud y plagas.",
      },
      {
        titular:
          "Presentan denuncia en Contraloría por deterioro de humedales ubicados en río Cautín debido a basurales",
        medio: "BioBioChile",
        fecha: "14 de octubre de 2024",
        url: "https://www.biobiochile.cl/noticias/nacional/region-de-la-araucania/2024/10/14/presentan-denuncia-en-contraloria-por-deterioro-de-humedales-ubicados-en-rio-cautin-debido-a-basurales.shtml",
        queAporta:
          "La Corporación por el Rescate del Río Cautín y dirigentes vecinales denuncian basurales y descargas de aguas servidas en los humedales de Antumalen, Amanecer y Labranza. Sirve para ver quién denuncia y ante quién, que es la otra mitad del asunto.",
      },
    ],
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
        "Prioriza noticias que traigan fecha, lugar preciso y una cita de alguien. Una nota general sobre contaminación no sirve: el curso tiene que poder ir al punto del que habla la noticia.",
    },
    angulos: [
      {
        asignatura: "biologia",
        enfoque: "Disminuir el impacto en la flora y la fauna del lugar.",
        queInvestigan:
          "Qué vive todavía en el agua y en la orilla, y qué había antes que ya no se ve. Se comparan tramos: arriba del punto sospechoso y abajo.",
        queSaleDeAqui:
          "Una lista de lo que falta. Es el dato que más convence y el único que no se consigue con instrumentos: hay que saber qué buscar y preguntarle a quien lleva años mirando.",
        conceptosClave: ["ecosistema", "bioindicador", "cadena alimentaria", "especie nativa e introducida"],
        tecnicas: ["cuadrante", "bitacora", "foto_punto_fijo"],
        oaQueAbre: ["OA01_CN_6", "OA02_CN_6", "OA03_CN_6"],
      },
      {
        asignatura: "quimica",
        enfoque:
          "Detectar los niveles de pH para encontrar las zonas más contaminadas e intervenir.",
        queInvestigan:
          "pH, turbidez y temperatura en varios puntos del mismo cauce, siempre a la misma hora, para que se puedan comparar entre sí.",
        queSaleDeAqui:
          "Un mapa del cauce con los puntos marcados. Sirve para señalar dónde entra el problema, que es distinto de decir que el río está sucio.",
        conceptosClave: ["pH", "escala logarítmica", "turbidez", "disolución", "contaminante"],
        tecnicas: ["muestreo_agua", "bitacora"],
        oaQueAbre: ["OA12_CN_5", "OA14_CN_7"],
      },
      {
        asignatura: "historia",
        enfoque:
          "Revisar cómo el río ha ayudado a las comunidades en los últimos años, y digitalizar ese proceso.",
        queInvestigan:
          "Para qué se usaba el río, quién vivía de él, en qué década dejó de usarse y por qué. Se hace con entrevistas y con fotos familiares, que es el archivo que existe.",
        queSaleDeAqui:
          "La línea de tiempo del río contada por quienes estaban. Es lo único que explica por qué a la gente del pueblo le importa, y sin eso el proyecto es un informe técnico.",
        conceptosClave: ["fuente oral", "memoria colectiva", "uso del territorio", "línea de tiempo"],
        tecnicas: ["entrevista", "foto_punto_fijo"],
        oaQueAbre: [],
      },
      {
        asignatura: "matematica",
        enfoque: "Ordenar lo medido para que diga algo.",
        queInvestigan:
          "Promedios, diferencias entre puntos, cómo cambia a lo largo de las semanas. Y cuál medición se sale de todas las demás, que es la pregunta interesante.",
        queSaleDeAqui:
          "Los gráficos con los que se defiende el hallazgo. Sin esto los números son una lista y no un argumento.",
        conceptosClave: ["promedio", "mediana", "dato atípico", "variable y escala", "gráfico de barras y de líneas"],
        tecnicas: ["medicion_dimensiones", "bitacora"],
        oaQueAbre: ["OA23_MA_5", "OA26_MA_5", "OA17_MA_7", "OA16_MA_8"],
      },
      {
        asignatura: "lenguaje",
        enfoque: "Escribir para que alguien de afuera lo entienda y actúe.",
        queInvestigan:
          "Cómo está contada la problemática en la prensa: qué se dice, qué se omite, a quién se cita. Y cómo se escribe una nota propia que no se pueda desarmar.",
        queSaleDeAqui:
          "El texto que va a leer el municipio o el vecindario. Es la pieza de la que depende que todo lo demás sirva de algo.",
        conceptosClave: ["hecho y opinión", "fuente", "propósito del texto", "destinatario"],
        tecnicas: ["entrevista", "encuesta"],
        oaQueAbre: [],
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
    respaldo: [
      {
        titular: "Sequía histórica: 53% de comunas están bajo decreto de escasez hídrica",
        medio: "La Tercera",
        url: "https://www.latercera.com/nacional/noticia/sequia-historica-53-de-comunas-estan-bajo-decreto-de-escasez-hidrica/R5MKC2IXNRBATAIYWJXW75BW3Y/",
        queAporta:
          "Más de la mitad de las comunas del país declaradas en escasez. Sirve para que el curso averigüe si la suya está en esa lista, que es lo primero que hay que saber.",
      },
      {
        titular: "Camiones aljibe como sustentadores de un sistema que debe repensarse",
        medio: "Centro de Ciencia del Clima y la Resiliencia (CR2)",
        fecha: "julio de 2025",
        url: "https://www.cr2.cl/wp-content/uploads/2025/07/Policy-brief-25-Camiones-aljibe.pdf",
        queAporta:
          "Sostiene que el camión aljibe se normalizó como respuesta a algo que se sigue tratando como pasajero, y que eso reproduce la desigualdad en el acceso al agua. Es el documento que convierte la sequía en una pregunta sobre reparto y no solo sobre lluvia.",
      },
      {
        titular:
          "Comunidades de Chiloé comienzan a recibir agua en camiones aljibes por escasez hídrica",
        medio: "BioBioChile",
        fecha: "5 de enero de 2026",
        url: "https://www.biobiochile.cl/noticias/nacional/region-de-los-lagos/2026/01/05/comunidades-de-chiloe-comienzan-a-recibir-agua-en-camiones-aljibes-por-escasez-hidrica.shtml",
        queAporta:
          "Pasa en Chiloé, que es de los sitios más lluviosos del país. Sirve para desarmar la idea de que esto es cosa del norte.",
      },
    ],
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
        "Prioriza noticias que entreguen cifras: cuántas casas, cuántos litros, desde qué mes. Las columnas de opinión sobre la sequía no dan por dónde empezar.",
    },
    angulos: [
      {
        asignatura: "matematica",
        enfoque: "Saber cuánta agua hay y cuánta se usa.",
        queInvestigan:
          "El consumo real de la escuela o de una casa durante una semana, contra lo que entra. Se cuenta con lo que hay: el contador, los estanques, los viajes del camión.",
        queSaleDeAqui:
          "La diferencia entre lo que se cree que se gasta y lo que se gasta. Nunca coinciden, y esa brecha es el proyecto.",
        conceptosClave: ["volumen y litro", "consumo por persona", "proporción", "estimación"],
        tecnicas: ["medicion_dimensiones", "bitacora"],
        oaQueAbre: ["OA12_CN_5", "OA19_MA_6", "OA03_MA_6", "OA08_MA_7"],
      },
      {
        asignatura: "biologia",
        enfoque: "Qué aguanta y qué no con menos agua.",
        queInvestigan:
          "Qué plantas del lugar siguen ahí después de varios años secos y cuáles desaparecieron de las huertas. Se pregunta a quien siembra.",
        queSaleDeAqui:
          "Una lista de lo que conviene sembrar aquí ahora, que es un consejo que alguien va a usar.",
        conceptosClave: ["requerimientos de los seres vivos", "tolerancia a la sequía", "raíz y absorción"],
        tecnicas: ["cuadrante", "entrevista"],
        oaQueAbre: ["OA01_CN_6", "OA04_CN_8"],
      },
      {
        asignatura: "historia",
        enfoque: "Cómo se repartía el agua antes, y quién decidía.",
        queInvestigan:
          "Turnos de riego, acuerdos entre vecinos, en qué momento cambió la cosa. Es un asunto de reglas, no solo de lluvia.",
        queSaleDeAqui:
          "Entender que la escasez tiene tanto de reparto como de clima, que es la parte que la prensa casi nunca cuenta.",
        conceptosClave: ["derechos de agua", "turnos de riego", "organización comunitaria", "bien común"],
        tecnicas: ["entrevista", "encuesta"],
        oaQueAbre: [],
      },
      {
        asignatura: "tecnologia",
        enfoque: "Construir algo que ahorre agua de verdad.",
        queInvestigan:
          "Riego por goteo casero, recolección de lluvia, acolchado. Se prueba y se mide si sirvió.",
        queSaleDeAqui:
          "Una cosa instalada y funcionando, más el dato de cuánta agua ahorró. Sin el dato es una maqueta.",
        conceptosClave: ["prototipo", "variable a controlar", "eficiencia", "prueba y error"],
        tecnicas: ["medicion_dimensiones", "foto_punto_fijo"],
        oaQueAbre: [],
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
    respaldo: [
      {
        titular:
          "Presentan denuncia en Contraloría por deterioro de humedales ubicados en río Cautín debido a basurales",
        medio: "BioBioChile",
        fecha: "14 de octubre de 2024",
        url: "https://www.biobiochile.cl/noticias/nacional/region-de-la-araucania/2024/10/14/presentan-denuncia-en-contraloria-por-deterioro-de-humedales-ubicados-en-rio-cautin-debido-a-basurales.shtml",
        queAporta:
          "Basurales en los humedales de Antumalen, Amanecer y Labranza, con denuncias también desde Vilcún, Lautaro y Nueva Imperial. Muestra el microbasural como lo que casi siempre es: un problema que termina en el agua.",
      },
    ],
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
        "Prioriza noticias que digan dónde queda el sitio y desde cuándo está así. Si el curso no puede ir a verlo, esa noticia no sirve.",
    },
    angulos: [
      {
        asignatura: "matematica",
        enfoque: "Cuánta basura hay, de qué tipo y de dónde viene.",
        queInvestigan:
          "Se cuenta y se clasifica una muestra: qué proporción es envase, orgánico, escombro. El escombro cambia el diagnóstico porque no lo deja una persona a pie.",
        queSaleDeAqui:
          "Saber si el microbasural es doméstico o es de camioneta, que lleva a soluciones opuestas.",
        conceptosClave: ["muestra y población", "porcentaje", "clasificación", "volumen estimado"],
        tecnicas: ["cuadrante", "pauta_observacion"],
        oaQueAbre: ["OA04_MA_6", "OA15_MA_7", "OA16_MA_7"],
      },
      {
        asignatura: "biologia",
        enfoque: "Qué le hace al suelo y al agua de al lado.",
        queInvestigan:
          "Qué crece y qué no crece alrededor, adónde escurre cuando llueve, qué animales llegan.",
        queSaleDeAqui:
          "La conexión entre el sitio y algo que a la gente sí le importa, que casi siempre es el agua o los perros.",
        conceptosClave: ["lixiviado", "escorrentía", "descomposición", "vector de enfermedad"],
        tecnicas: ["pauta_observacion", "muestra_suelo"],
        oaQueAbre: ["OA03_CN_6", "OA05_CN_7"],
      },
      {
        asignatura: "historia",
        enfoque: "Desde cuándo se deja basura ahí y por qué ahí.",
        queInvestigan:
          "Se pregunta a los vecinos más antiguos. Los microbasurales suelen estar donde antes hubo otra cosa: un pozo, un camino, un botadero autorizado.",
        queSaleDeAqui:
          "La razón real, que casi nunca es que la gente sea desordenada.",
        conceptosClave: ["uso histórico del suelo", "gestión municipal", "responsabilidad pública"],
        tecnicas: ["entrevista", "foto_punto_fijo"],
        oaQueAbre: [],
      },
      {
        asignatura: "artes",
        enfoque: "Hacer visible lo que se volvió invisible.",
        queInvestigan:
          "Fotografía del mismo punto en distintos momentos, o registro de lo que se encuentra tratado como catálogo.",
        queSaleDeAqui:
          "Una pieza que obliga a mirar un sitio por el que todos pasan sin verlo.",
        conceptosClave: ["encuadre", "serie fotográfica", "punto de vista", "catálogo visual"],
        tecnicas: ["foto_punto_fijo", "mapa_a_mano"],
        oaQueAbre: [],
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
    respaldo: [
      {
        titular:
          "Contaminación del aire por la quema de leña y pellets: un «ecocidio» escondido en Chile",
        medio: "CIPER Chile",
        fecha: "22 de diciembre de 2024",
        url: "https://www.ciperchile.cl/2024/12/22/contaminacion-del-aire-por-la-quema-de-lena-y-pellets-un-ecocidio-escondido-en-chile/",
        queAporta:
          "Que la leña húmeda explica más del 80% del material particulado fino en la zona centro-sur, y que se le atribuyen unas 3.500 muertes prematuras al año. Es la cifra que cambia la conversación de incomodidad a salud.",
      },
      {
        titular:
          "Chillán y Chillán Viejo registran la primera preemergencia de calidad del aire del periodo 2026",
        medio: "Ministerio del Medio Ambiente",
        url: "https://mma.gob.cl/chillan-y-chillan-viejo-registran-la-primera-preemergencia-de-calidad-del-aire-del-periodo-gec-2026/",
        queAporta:
          "Un episodio concreto con fecha. Las estaciones de monitoreo publican datos por hora, así que el curso puede comparar su propia semana con el registro oficial.",
      },
    ],
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
        "Prioriza noticias que traigan una medición con fecha y hora. Con ese dato el curso puede comparar su propio día con el registro oficial.",
    },
    angulos: [
      {
        asignatura: "fisica",
        enfoque: "Por dónde se escapa el calor de una casa o de la sala.",
        queInvestigan:
          "Temperatura en varios puntos a la misma hora durante una semana, y dónde está la diferencia grande.",
        queSaleDeAqui:
          "El punto de fuga, que casi nunca es donde la gente cree. Eso permite pedir algo concreto en vez de quejarse.",
        conceptosClave: ["calor y temperatura", "conducción", "aislación", "transferencia de energía"],
        tecnicas: ["medicion_dimensiones", "bitacora"],
        oaQueAbre: ["OA13_CN_5", "OA14_CN_6", "OA11_CN_8"],
      },
      {
        asignatura: "quimica",
        enfoque: "Qué se quema y qué sale de eso.",
        queInvestigan:
          "Qué leña se usa, cuán húmeda está, y qué diferencia hace la humedad en cuánto humo sale.",
        queSaleDeAqui:
          "Una recomendación que se puede seguir esta semana, no el año que viene.",
        conceptosClave: ["combustión", "material particulado", "humedad de la madera", "producto de reacción"],
        tecnicas: ["bitacora", "pauta_observacion"],
        oaQueAbre: ["OA15_CN_6"],
      },
      {
        asignatura: "matematica",
        enfoque: "Cuánto se gasta en calefacción y cuánto se podría no gastar.",
        queInvestigan:
          "Metros de leña por invierno por casa, precio, y qué pasaría tapando las filtraciones.",
        queSaleDeAqui:
          "Una cifra en pesos, que es la que hace que alguien actúe.",
        conceptosClave: ["promedio", "costo unitario", "proyección", "comparación de series"],
        tecnicas: ["encuesta", "medicion_dimensiones"],
        oaQueAbre: ["OA12_CN_7", "OA23_MA_5", "OA05_MA_8", "OA08_MA_8"],
      },
      {
        asignatura: "historia",
        enfoque: "Cómo se calentaban las casas antes de que hubiera estufas.",
        queInvestigan:
          "Orientación de las casas antiguas, dónde iba el fuego, qué materiales se usaban.",
        queSaleDeAqui:
          "Soluciones que ya se probaron aquí durante generaciones y que la construcción actual olvidó.",
        conceptosClave: ["arquitectura tradicional", "adaptación al clima", "saber técnico local"],
        tecnicas: ["entrevista", "mapa_a_mano"],
        oaQueAbre: [],
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
    respaldo: [
      {
        titular: "El 49% del suelo nacional presenta algún grado de erosión",
        medio: "CIREN",
        url: "https://www.ciren.cl/noticias/el-49-del-suelo-nacional-presenta-algun-grado-de-erosion/",
        queAporta:
          "Casi la mitad del territorio con algún grado de erosión, y entre Coquimbo y Los Lagos un 56% de los suelos degradados. CIREN publica además el inventario por comuna, así que se puede mirar la propia.",
      },
    ],
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
        "Prioriza noticias que muestren un antes y un después, o un lugar al que se pueda llegar caminando.",
    },
    angulos: [
      {
        asignatura: "biologia",
        enfoque: "Qué sostiene la tierra y qué la suelta.",
        queInvestigan:
          "Qué crece en la parte que aguanta y qué falta donde se cae. Se comparan dos pedazos a pocos metros.",
        queSaleDeAqui:
          "Qué plantar, y dónde, para que agarre. Se puede hacer el mismo día.",
        conceptosClave: ["cobertura vegetal", "sistema radicular", "sucesión"],
        tecnicas: ["cuadrante", "foto_punto_fijo"],
        oaQueAbre: ["OA18_CN_6", "OA04_CN_8"],
      },
      {
        asignatura: "quimica",
        enfoque: "Qué tiene esta tierra y qué retiene.",
        queInvestigan:
          "Cuánta agua se queda en cada capa, qué se deshace en la mano, qué color tiene.",
        queSaleDeAqui:
          "Por qué esta tierra se seca aunque llueva, que es la pregunta que todos los que siembran se hacen.",
        conceptosClave: ["textura del suelo", "retención de agua", "porosidad", "materia orgánica"],
        tecnicas: ["muestra_suelo", "medicion_dimensiones"],
        oaQueAbre: ["OA16_CN_6", "OA17_CN_6"],
      },
      {
        asignatura: "matematica",
        enfoque: "Cuánto se está yendo y en cuánto tiempo.",
        queInvestigan:
          "Grosor de las capas, avance de una cárcava medido entre dos visitas, superficie afectada.",
        queSaleDeAqui:
          "Una tasa: centímetros por año. Es lo que convierte un paisaje feo en un problema con plazo.",
        conceptosClave: ["tasa de cambio", "superficie", "escala temporal", "proporción"],
        tecnicas: ["medicion_dimensiones", "foto_punto_fijo"],
        oaQueAbre: ["OA22_MA_5", "OA08_MA_7", "OA07_MA_8"],
      },
      {
        asignatura: "tecnologia",
        enfoque: "Frenarlo con lo que hay.",
        queInvestigan:
          "Barreras vivas, zanjas de infiltración, cobertura. Se instala y se vuelve a medir.",
        queSaleDeAqui:
          "Una obra pequeña que se puede mostrar, y el dato de si funcionó.",
        conceptosClave: ["barrera viva", "infiltración", "diseño de una solución", "seguimiento"],
        tecnicas: ["foto_punto_fijo", "medicion_dimensiones"],
        oaQueAbre: [],
      },
    ],
  },
  {
    id: "bosque_que_retrocede",
    nombre: "El bosque nativo que retrocede",
    queEs:
      "Un bosque que ya no llega donde llegaba: tala, incendios, ganado que entra, o un clima que dejó de servirle. En algunas especies el retroceso ya está medido y proyectado, y eso permite trabajar con una fecha en la mano.",
    dondeAparece:
      "Desde el Maule al sur, y muy claramente en la cordillera de Nahuelbuta y en la araucanía andina. También en cualquier renoval cerca de una escuela.",
    respaldo: [
      {
        titular:
          "Estudio de la Universidad de Chile alerta que la amenaza a los bosques de araucaria ya se manifiesta y podría agravarse hacia 2060",
        medio: "Universidad de Chile",
        fecha: "2 de septiembre de 2026",
        url: "https://uchile.cl/noticias/244327/estudio-uchile-alerta-riesgo-critico-para-bosques-de-araucaria-hacia-2060",
        queAporta:
          "Los cuatro ecosistemas de araucaria del país podrían quedar en categoría crítica hacia 2060. Han perdido más del 74% de su extensión histórica, y los andinos más del 46% por deforestación. El de Nahuelbuta, en la costa, podría perder por completo sus condiciones viables. El estudio lo dirigió Alberto Alaniz, de la Universidad de Chile, con el laboratorio BIOMA de la Universidad de Santiago.",
      },
    ],
    comoSeBuscan: {
      terminos: [
        "bosque nativo tala + nombre de la comuna",
        "incendio forestal + sector",
        "araucaria daño + provincia",
        "plan de manejo forestal CONAF + localidad",
      ],
      donde:
        "Prensa regional después de cada temporada de incendios, y los estudios de universidades, que se publican con enlace abierto y casi nunca llegan a la escuela que tiene ese bosque al lado.",
      queNotaSirve:
        "Prioriza noticias o estudios que den una superficie, un porcentaje o un año. Con una cifra proyectada el curso puede preguntarse qué pasa con su propio bosque, que es una pregunta con fecha.",
    },
    angulos: [
      {
        asignatura: "biologia",
        enfoque: "Qué se está perdiendo aquí, y qué se está regenerando.",
        queInvestigan:
          "Qué hay en el pedazo de bosque de al lado: los árboles grandes, lo que está creciendo abajo, y si hay renovales de las especies que importan o solo de las que invaden.",
        queSaleDeAqui:
          "Saber si ese bosque se está reponiendo solo o no. Un bosque sin árboles jóvenes está muerto aunque los grandes sigan de pie, y eso se ve contando.",
        conceptosClave: ["regeneración natural", "renoval", "especie nativa e introducida", "dosel y sotobosque"],
        tecnicas: ["cuadrante", "bitacora"],
        oaQueAbre: ["OA01_CN_5", "OA02_CN_6", "OA04_CN_8"],
      },
      {
        asignatura: "historia",
        enfoque: "Hasta dónde llegaba el bosque, y quién se acuerda.",
        queInvestigan:
          "Dónde había monte hace cuarenta años, en qué década se cortó y para qué. Fotos familiares, escrituras, y lo que cuenten los mayores.",
        queSaleDeAqui:
          "El mapa de lo que había, que casi nunca existe en ninguna parte y que cambia la discusión de si esto siempre fue así.",
        conceptosClave: ["uso del territorio", "fuente oral", "cambio en el paisaje"],
        tecnicas: ["entrevista", "mapa_a_mano"],
        oaQueAbre: [],
      },
      {
        asignatura: "matematica",
        enfoque: "Cuánto queda y a qué ritmo se va.",
        queInvestigan:
          "Superficie del pedazo que tienen, cuántos árboles por área, y comparación entre imágenes satelitales de distintos años, que son públicas.",
        queSaleDeAqui:
          "Una cifra local puesta al lado de la nacional. Que el estudio diga 74% y aquí dé otra cosa es exactamente lo interesante.",
        conceptosClave: ["superficie", "densidad por área", "porcentaje de pérdida", "escala de un mapa"],
        tecnicas: ["cuadrante", "medicion_dimensiones"],
        oaQueAbre: ["OA22_MA_5", "OA04_MA_6", "OA05_MA_8"],
      },
      {
        asignatura: "tecnologia",
        enfoque: "Hacer algo que ayude a que vuelva.",
        queInvestigan:
          "Recolección de semillas, un vivero pequeño en la escuela, cercado de un pedazo para que no entre el ganado. Se planta y se vuelve a mirar.",
        queSaleDeAqui:
          "Árboles vivos, o el dato de por qué no prendieron. Las dos cosas sirven.",
        conceptosClave: ["germinación", "vivero", "sustrato", "seguimiento con fecha"],
        tecnicas: ["muestra_suelo", "foto_punto_fijo"],
        oaQueAbre: [],
      },
      {
        asignatura: "artes",
        enfoque: "Registrar lo que todavía está.",
        queInvestigan:
          "Dibujo o fotografía de los árboles grandes que quedan, uno por uno, con su ubicación.",
        queSaleDeAqui:
          "Un catastro que en diez años va a valer mucho más que ahora.",
        conceptosClave: ["dibujo de observación", "proporción", "registro con escala"],
        tecnicas: ["foto_punto_fijo", "bitacora"],
        oaQueAbre: [],
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
    // Esta es la única sin respaldo nacional, y no es un descuido: lo que se
    // está dejando de saber en un pueblo no sale en ningún estudio, se sabe
    // preguntando ahí. Decirlo vale más que llenar el hueco con una nota
    // genérica sobre patrimonio.
    respaldo: [],
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
        "Prioriza noticias que nombren a una persona que todavía esté viva y se pueda entrevistar.",
    },
    angulos: [
      {
        asignatura: "historia",
        enfoque: "Registrar antes de que no se pueda.",
        queInvestigan:
          "Entrevistas grabadas con quienes saben, con las preguntas preparadas por los estudiantes. Se ordena por tema y por fecha.",
        queSaleDeAqui:
          "Un archivo que antes no existía y que va a quedar cuando el curso ya no esté.",
        conceptosClave: ["fuente oral", "patrimonio inmaterial", "archivo", "testimonio"],
        tecnicas: ["entrevista", "foto_punto_fijo"],
        oaQueAbre: [],
      },
      {
        asignatura: "lenguaje",
        enfoque: "Cómo se dice aquí lo que en otras partes se dice de otro modo.",
        queInvestigan:
          "Las palabras propias del lugar y del oficio: cómo se llama cada herramienta, cada parte, cada momento del año.",
        queSaleDeAqui:
          "Un glosario del lugar. Es el trabajo más barato de hacer y el que más dura.",
        conceptosClave: ["registro y variedad lingüística", "campo semántico", "glosario", "transcripción"],
        tecnicas: ["entrevista", "bitacora"],
        oaQueAbre: [],
      },
      {
        asignatura: "artes",
        enfoque: "Mostrar el oficio, no describirlo.",
        queInvestigan:
          "Registro visual del proceso completo, paso a paso, con las manos de quien lo hace.",
        queSaleDeAqui:
          "Algo que permite aprender el oficio mirando, que es como se aprendió siempre.",
        conceptosClave: ["secuencia visual", "proceso", "encuadre del detalle"],
        tecnicas: ["foto_punto_fijo", "bitacora"],
        oaQueAbre: [],
      },
      {
        asignatura: "biologia",
        enfoque: "Qué sabe de los seres vivos quien trabaja con ellos.",
        queInvestigan:
          "Qué plantas se usan y para qué, en qué época se recogen, qué señales se miran para decidir cuándo sembrar.",
        queSaleDeAqui:
          "Conocimiento comprobable que suele coincidir con lo que dice el libro, dicho en otras palabras y con más detalle local.",
        conceptosClave: ["uso tradicional de especies", "fenología", "clasificación"],
        tecnicas: ["entrevista", "cuadrante"],
        oaQueAbre: ["OA01_CN_5"],
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
