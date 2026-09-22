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

import { ASIGNATURAS_BR, PROBLEMAS_BR } from "./problemas.br";

/** Las asignaturas desde las que se puede entrar. */
export type Asignatura =
  | "biologia"
  | "quimica"
  | "fisica"
  | "matematica"
  | "lenguaje"
  | "historia"
  | "artes"
  | "tecnologia"
  // Los componentes de la BNCC que no tienen equivalente chileno con el
  // mismo nombre. Ver §problemas.br.ts.
  | "ciencias"
  | "geografia"
  | "lingua_portuguesa"
  | "arte";

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

/**
 * Las cuatro familias en que se agrupan las problemáticas.
 *
 * Diez problemáticas en una columna son diez botones que hay que leer enteros
 * para elegir uno, y a la décima ya nadie está leyendo. Cuatro familias se
 * abarcan de una mirada, y dentro de cada una hay dos o cuatro cosas.
 *
 * El agrupamiento no es temático sino de terreno: están juntas las que se
 * trabajan yendo al mismo sitio y con las mismas técnicas. Quien tiene un
 * estero cerca entra por «El agua» y ahí están las dos que le sirven; quien no
 * tiene nada de eso pero ve vaciarse el pueblo entra por la última.
 */
export type Familia = {
  id: string;
  nombre: string;
  /** Qué tienen en común, para reconocer la suya sin abrirla. */
  deQueVa: string;
};

export const FAMILIAS_PROBLEMA: Familia[] = [
  {
    id: "agua",
    nombre: "Agua y cauces",
    deQueVa: "Calidad y disponibilidad del agua. El terreno es el cauce, el pozo o el estanque.",
  },
  {
    id: "tierra",
    nombre: "Suelo y vegetación",
    deQueVa: "Erosión y cobertura vegetal. El terreno es una ladera, un corte de camino o un pedazo de monte.",
  },
  {
    id: "aire_residuos",
    nombre: "Aire y residuos",
    deQueVa: "Calidad del aire y manejo de residuos. El terreno es la sala, la calle y el sitio de acumulación.",
  },
  {
    id: "gente",
    nombre: "Población y cultura local",
    deQueVa: "Población, patrimonio cultural y acceso a servicios. Se trabaja preguntando, en las casas y el pueblo.",
  },
];

export function familiaProblemaPorId(id: string): Familia | undefined {
  return FAMILIAS_PROBLEMA.find((f) => f.id === id);
}

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
   * Ya no queda ninguno vacío. Las seis asignaturas tienen sus objetivos
   * cargados y cada ángulo apunta a los que abre de verdad, de 5º a 8º, para
   * que haya algo en cualquier sala; la columna filtra después por el curso
   * que el docente dijo tener.
   *
   * Hay una comprobación que corre en cada compilación y que falla si alguno
   * de estos códigos no existe en la base. Sin ella es cuestión de tiempo que
   * aparezca uno mal escrito, y un objetivo inventado acaba impreso en la hoja
   * que se lleva a la dirección.
   */
  oaQueAbre: string[];
};

export type Problema = {
  id: string;
  /** A cuál de las cuatro familias pertenece. */
  familia: string;
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
    familia: "agua",
    nombre: "Contaminación de un río o estero",
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
        oaQueAbre: ["OA01_CN_6", "OA02_CN_6", "OA03_CN_6", "OA14_CN_5"],
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
          "Usos históricos del río y su registro digital.",
        queInvestigan:
          "Para qué se usaba el río, quién vivía de él, en qué década dejó de usarse y por qué. Se hace con entrevistas y con fotos familiares, que es el archivo que existe.",
        queSaleDeAqui:
          "La línea de tiempo del río contada por quienes estaban. Es lo único que explica por qué a la gente del pueblo le importa, y sin eso el proyecto es un informe técnico.",
        conceptosClave: ["fuente oral", "memoria colectiva", "uso del territorio", "línea de tiempo"],
        tecnicas: ["entrevista", "foto_punto_fijo"],
        oaQueAbre: ["OA13_HI_6", "OA22_HI_7", "OA07_TE_5"],
      },
      {
        asignatura: "matematica",
        enfoque: "Tratamiento y presentación de los datos medidos.",
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
        enfoque: "Redacción de un texto para un destinatario externo.",
        queInvestigan:
          "Cómo está contada la problemática en la prensa: qué se dice, qué se omite, a quién se cita. Y cómo se escribe una nota propia que no se pueda desarmar.",
        queSaleDeAqui:
          "El texto que va a leer el municipio o el vecindario. Es la pieza de la que depende que todo lo demás sirva de algo.",
        conceptosClave: ["hecho y opinión", "fuente", "propósito del texto", "destinatario"],
        tecnicas: ["entrevista", "encuesta"],
        oaQueAbre: ["OA07_LE_6", "OA15_LE_5", "OA14_LE_7", "OA15_LE_8"],
      },
      {
        asignatura: "lenguaje",
        enfoque:
          "Lectura y evaluación de las fuentes sobre el caso.",
        queInvestigan:
          "Qué dicen las noticias y los informes sobre este cauce: quién los firma, de cuándo son, qué cifra da cada uno y en qué se contradicen.",
        queSaleDeAqui:
          "Una ficha por fuente con lo que aporta y lo que calla. Es el material con el que el curso decide qué puede afirmar y qué no.",
        conceptosClave: ["fuente primaria y secundaria", "sesgo", "cita", "síntesis", "vocabulario técnico"],
        tecnicas: ["bitacora"],
        oaQueAbre: ["OA01_LE_5", "OA01_LE_6", "OA01_LE_7", "OA01_LE_8", "OA02_LE_5", "OA02_LE_6", "OA06_LE_5", "OA06_LE_6", "OA07_LE_5", "OA07_LE_6", "OA08_LE_5", "OA08_LE_6", "OA09_LE_5", "OA09_LE_6", "OA10_LE_5", "OA10_LE_6", "OA10_LE_7", "OA11_LE_5", "OA11_LE_6", "OA11_LE_7", "OA11_LE_8", "OA12_LE_5", "OA12_LE_6", "OA12_LE_8", "OA24_LE_7", "OA25_LE_7", "OA25_LE_8", "OA26_LE_8"],
      },
      {
        asignatura: "matematica",
        enfoque:
          "Plano del cauce y cálculo de superficies.",
        queInvestigan:
          "El trazado del cauce en un plano a escala, con los puntos de muestreo ubicados, y la superficie de la ribera afectada.",
        queSaleDeAqui:
          "Un plano propio a escala con los puntos marcados. Sirve para mostrar dónde entra el problema, que es distinto de decir que el río está sucio.",
        conceptosClave: ["escala", "plano cartesiano", "área", "ángulo", "congruencia"],
        tecnicas: ["mapa_a_mano", "medicion_dimensiones"],
        oaQueAbre: ["OA10_MA_7", "OA11_MA_7", "OA11_MA_8", "OA12_MA_6", "OA12_MA_7", "OA12_MA_8", "OA13_MA_6", "OA13_MA_7", "OA13_MA_8", "OA14_MA_6", "OA14_MA_7", "OA14_MA_8", "OA15_MA_6", "OA16_MA_5", "OA16_MA_6", "OA17_MA_5", "OA17_MA_6", "OA18_MA_5", "OA22_MA_5"],
      },
      {
        asignatura: "artes",
        enfoque:
          "Registro visual del cauce y su deterioro.",
        queInvestigan:
          "Cómo se ve el cauce en los tres puntos, a la misma hora y con el mismo encuadre, repetido a lo largo de las semanas.",
        queSaleDeAqui:
          "Una serie que muestra la diferencia entre tramos sin necesidad de explicarla. Es lo que hace que alguien de fuera entienda de qué se habla.",
        conceptosClave: ["encuadre", "serie", "punto fijo", "luz", "montaje"],
        tecnicas: ["foto_punto_fijo", "bitacora"],
        oaQueAbre: ["OA01_AR_5", "OA01_AR_6", "OA01_AR_7", "OA01_AR_8", "OA02_AR_5", "OA02_AR_6", "OA02_AR_7", "OA02_AR_8", "OA03_AR_5", "OA03_AR_6", "OA03_AR_7", "OA03_AR_8", "OA04_AR_5", "OA04_AR_6", "OA04_AR_7", "OA04_AR_8", "OA05_AR_5", "OA05_AR_6", "OA05_AR_7", "OA05_AR_8"],
      },
    ],
  },
  {
    id: "falta_agua",
    familia: "agua",
    nombre: "Escasez de agua",
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
        enfoque: "Cálculo de la disponibilidad y el consumo de agua.",
        queInvestigan:
          "El consumo real de la escuela o de una casa durante una semana, contra lo que entra. Se cuenta con lo que hay: el contador, los estanques, los viajes del camión.",
        queSaleDeAqui:
          "La diferencia entre lo que se cree que se gasta y lo que se gasta. Nunca coinciden, y esa brecha es el proyecto.",
        conceptosClave: ["volumen y litro", "consumo por persona", "proporción", "estimación"],
        tecnicas: ["medicion_dimensiones", "bitacora"],
        oaQueAbre: ["OA12_CN_5", "OA19_MA_6", "OA03_MA_6", "OA08_MA_7", "OA02_MA_5", "OA03_MA_5", "OA04_MA_5"],
      },
      {
        asignatura: "biologia",
        enfoque: "Tolerancia de las especies a la falta de agua.",
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
        enfoque: "Historia del reparto del agua y de quién lo decidía.",
        queInvestigan:
          "Turnos de riego, acuerdos entre vecinos, en qué momento cambió la cosa. Es un asunto de reglas, no solo de lluvia.",
        queSaleDeAqui:
          "Entender que la escasez tiene tanto de reparto como de clima, que es la parte que la prensa casi nunca cuenta.",
        conceptosClave: ["derechos de agua", "turnos de riego", "organización comunitaria", "bien común"],
        tecnicas: ["entrevista", "encuesta"],
        oaQueAbre: ["OA19_HI_5", "OA15_HI_6", "OA21_HI_7"],
      },
      {
        asignatura: "tecnologia",
        enfoque: "Construcción de un dispositivo de ahorro de agua.",
        queInvestigan:
          "Riego por goteo casero, recolección de lluvia, acolchado. Se prueba y se mide si sirvió.",
        queSaleDeAqui:
          "Una cosa instalada y funcionando, más el dato de cuánta agua ahorró. Sin el dato es una maqueta.",
        conceptosClave: ["prototipo", "variable a controlar", "eficiencia", "prueba y error"],
        tecnicas: ["medicion_dimensiones", "foto_punto_fijo"],
        oaQueAbre: ["OA03_TE_5", "OA02_TE_7", "OA02_TE_8", "OA06_TE_8"],
      },
      {
        asignatura: "lenguaje",
        enfoque:
          "Redacción y edición del documento que se entrega.",
        queInvestigan:
          "Cómo se planifica, se escribe, se corrige y se edita un texto que va a leer alguien de fuera de la escuela.",
        queSaleDeAqui:
          "Un texto en su segunda versión, corregido por los compañeros antes de salir. La diferencia con una tarea es que este tiene destinatario y fecha de envío.",
        conceptosClave: ["propósito y destinatario", "planificación del texto", "revisión entre pares", "ortografía", "vocabulario preciso"],
        tecnicas: ["bitacora"],
        oaQueAbre: ["OA13_LE_7", "OA14_LE_8", "OA15_LE_5", "OA15_LE_6", "OA15_LE_7", "OA16_LE_8", "OA17_LE_5", "OA17_LE_6", "OA18_LE_5", "OA18_LE_6", "OA19_LE_5", "OA19_LE_6", "OA19_LE_7", "OA20_LE_8", "OA22_LE_5", "OA22_LE_6"],
      },
      {
        asignatura: "matematica",
        enfoque:
          "Proporciones y porcentajes del consumo.",
        queInvestigan:
          "Cuánto se consume por persona y por día, qué proporción del total se va en cada uso, y cuánto representaría el ahorro que se propone.",
        queSaleDeAqui:
          "Las cifras en proporción y no en bruto. Un porcentaje se discute en una reunión de vecinos; una lista de litros, no.",
        conceptosClave: ["razón", "porcentaje", "fracción y decimal", "proporcionalidad", "variación porcentual"],
        tecnicas: ["encuesta", "bitacora"],
        oaQueAbre: ["OA02_MA_7", "OA03_MA_6", "OA04_MA_6", "OA04_MA_7", "OA05_MA_6", "OA05_MA_8", "OA06_MA_6", "OA07_MA_5", "OA07_MA_6", "OA08_MA_5", "OA08_MA_6", "OA08_MA_7", "OA09_MA_5", "OA10_MA_5", "OA11_MA_5", "OA12_MA_5", "OA13_MA_5"],
      },
      {
        asignatura: "historia",
        enfoque:
          "Organización comunitaria y toma de decisiones sobre el agua.",
        queInvestigan:
          "Cómo se organiza hoy el comité de agua del sector, quién decide, cómo se elige, y en qué se parece o no a otras formas de decidir en común.",
        queSaleDeAqui:
          "El mapa de quién decide qué, con nombres. Es lo que permite que el curso sepa a quién dirigirse y por qué conducto.",
        conceptosClave: ["organización comunitaria", "participación ciudadana", "derechos y deberes", "representación", "bien común"],
        tecnicas: ["entrevista", "bitacora"],
        oaQueAbre: ["OA13_HI_5", "OA14_HI_5", "OA15_HI_5", "OA15_HI_6", "OA16_HI_5", "OA16_HI_6", "OA17_HI_5", "OA17_HI_6", "OA17_HI_7", "OA17_HI_8", "OA18_HI_5", "OA18_HI_6", "OA18_HI_7", "OA18_HI_8", "OA19_HI_5", "OA19_HI_6", "OA19_HI_7", "OA19_HI_8", "OA20_HI_5", "OA20_HI_6", "OA20_HI_7", "OA21_HI_5", "OA21_HI_6", "OA22_HI_5", "OA22_HI_6", "OA23_HI_6", "OA24_HI_6", "OA25_HI_6", "OA26_HI_6"],
      },
      {
        asignatura: "matematica",
        enfoque:
          "Probabilidad de un año seco según el registro histórico.",
        queInvestigan:
          "Cuántos de los últimos veinte años fueron secos según los registros de la estación más cercana, y con qué frecuencia se repiten. Se cuenta, no se estima a ojo.",
        queSaleDeAqui:
          "Una frecuencia con la que se puede decir cada cuánto pasa esto. Deja de ser un mal año y pasa a ser algo previsible, que es lo que permite planificar.",
        conceptosClave: ["frecuencia relativa", "probabilidad", "evento", "muestra aleatoria", "diagrama de tallo y hojas"],
        tecnicas: ["bitacora"],
        oaQueAbre: ["OA15_MA_8", "OA17_MA_8", "OA18_MA_7", "OA19_MA_7", "OA23_MA_6", "OA24_MA_5", "OA24_MA_6", "OA25_MA_5", "OA27_MA_5"],
      },
    ],
  },
  {
    id: "basura",
    familia: "aire_residuos",
    nombre: "Microbasurales y manejo de residuos",
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
        enfoque: "Caracterización y cuantificación de los residuos.",
        queInvestigan:
          "Se cuenta y se clasifica una muestra: qué proporción es envase, orgánico, escombro. El escombro cambia el diagnóstico porque no lo deja una persona a pie.",
        queSaleDeAqui:
          "Saber si el microbasural es doméstico o es de camioneta, que lleva a soluciones opuestas.",
        conceptosClave: ["muestra y población", "porcentaje", "clasificación", "volumen estimado"],
        tecnicas: ["cuadrante", "pauta_observacion"],
        oaQueAbre: ["OA04_MA_6", "OA15_MA_7", "OA16_MA_7", "OA01_MA_6"],
      },
      {
        asignatura: "biologia",
        enfoque: "Efectos de los residuos sobre el suelo y el agua cercana.",
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
        enfoque: "Origen histórico del microbasural y su localización.",
        queInvestigan:
          "Se pregunta a los vecinos más antiguos. Los microbasurales suelen estar donde antes hubo otra cosa: un pozo, un camino, un botadero autorizado.",
        queSaleDeAqui:
          "La razón real, que casi nunca es que la gente sea desordenada.",
        conceptosClave: ["uso histórico del suelo", "gestión municipal", "responsabilidad pública"],
        tecnicas: ["entrevista", "foto_punto_fijo"],
        oaQueAbre: ["OA18_HI_5", "OA13_HI_6", "OA22_HI_7"],
      },
      {
        asignatura: "artes",
        enfoque: "Representación visual de un problema normalizado.",
        queInvestigan:
          "Fotografía del mismo punto en distintos momentos, o registro de lo que se encuentra tratado como catálogo.",
        queSaleDeAqui:
          "Una pieza que obliga a mirar un sitio por el que todos pasan sin verlo.",
        conceptosClave: ["encuadre", "serie fotográfica", "punto de vista", "catálogo visual"],
        tecnicas: ["foto_punto_fijo", "mapa_a_mano"],
        oaQueAbre: ["OA01_AR_6", "OA01_AR_8", "OA03_AR_8"],
      },
      {
        asignatura: "lenguaje",
        enfoque:
          "Análisis de mensajes y campañas sobre residuos.",
        queInvestigan:
          "Qué campañas sobre basura existen, a quién le hablan y con qué recursos, y por qué las que hay no han funcionado aquí.",
        queSaleDeAqui:
          "Un análisis de lo que ya se intentó. Evita que el curso repita una campaña que el pueblo ya ignoró una vez.",
        conceptosClave: ["mensaje publicitario", "destinatario", "recurso persuasivo", "argumento", "contraargumento"],
        tecnicas: ["bitacora"],
        oaQueAbre: ["OA08_LE_7", "OA09_LE_7", "OA09_LE_8", "OA10_LE_8", "OA14_LE_7", "OA15_LE_8", "OA20_LE_7", "OA21_LE_7", "OA21_LE_8", "OA22_LE_7", "OA22_LE_8", "OA23_LE_7", "OA23_LE_8", "OA24_LE_5", "OA24_LE_6", "OA24_LE_8", "OA25_LE_6", "OA26_LE_5", "OA27_LE_5", "OA27_LE_6", "OA28_LE_5", "OA28_LE_6", "OA29_LE_5", "OA29_LE_6", "OA30_LE_5", "OA30_LE_6", "OA31_LE_6"],
      },
      {
        asignatura: "tecnologia",
        enfoque:
          "Diseño de una solución de manejo de residuos.",
        queInvestigan:
          "Qué hace falta en ese punto para que la basura deje de acumularse: un contenedor, una señal, un horario, un acuerdo, o las cuatro cosas.",
        queSaleDeAqui:
          "Algo construido e instalado, con su costo anotado y su evaluación después de dos semanas.",
        conceptosClave: ["necesidad y oportunidad", "materiales", "costo", "prototipo", "criterios de evaluación"],
        tecnicas: ["medicion_dimensiones", "bitacora"],
        oaQueAbre: ["OA01_TE_5", "OA01_TE_6", "OA01_TE_7", "OA01_TE_8", "OA02_TE_5", "OA02_TE_6", "OA02_TE_7", "OA02_TE_8", "OA03_TE_5", "OA03_TE_6", "OA03_TE_7", "OA03_TE_8", "OA04_TE_5", "OA04_TE_6", "OA05_TE_7", "OA05_TE_8", "OA06_TE_7", "OA06_TE_8"],
      },
    ],
  },
  {
    id: "aire_lena",
    familia: "aire_residuos",
    nombre: "Contaminación del aire por leña",
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
        enfoque: "Pérdidas de calor en una vivienda o en la sala.",
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
        enfoque: "Composición de la leña y productos de su combustión.",
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
        enfoque: "Costo de la calefacción y potencial de ahorro.",
        queInvestigan:
          "Metros de leña por invierno por casa, precio, y qué pasaría tapando las filtraciones.",
        queSaleDeAqui:
          "Una cifra en pesos, que es la que hace que alguien actúe.",
        conceptosClave: ["promedio", "costo unitario", "proyección", "comparación de series"],
        tecnicas: ["encuesta", "medicion_dimensiones"],
        oaQueAbre: ["OA12_CN_7", "OA23_MA_5", "OA05_MA_8", "OA08_MA_8", "OA03_MA_8"],
      },
      {
        asignatura: "historia",
        enfoque: "Historia de la calefacción doméstica en el sector.",
        queInvestigan:
          "Orientación de las casas antiguas, dónde iba el fuego, qué materiales se usaban.",
        queSaleDeAqui:
          "Soluciones que ya se probaron aquí durante generaciones y que la construcción actual olvidó.",
        conceptosClave: ["arquitectura tradicional", "adaptación al clima", "saber técnico local"],
        tecnicas: ["entrevista", "mapa_a_mano"],
        oaQueAbre: ["OA11_HI_5", "OA12_HI_6", "OA21_HI_7"],
      },
      {
        asignatura: "lenguaje",
        enfoque:
          "Exposición de los resultados ante la comunidad.",
        queInvestigan:
          "Cómo se explica una medición a gente que no estuvo: qué se dice primero, qué término hay que explicar y qué pregunta difícil va a venir.",
        queSaleDeAqui:
          "Una exposición ensayada donde habla más de uno. Se nota en que contestan la pregunta incómoda sin mirar al profesor.",
        conceptosClave: ["exposición oral", "audiencia", "progresión temática", "diálogo", "escucha activa"],
        tecnicas: ["bitacora"],
        oaQueAbre: ["OA20_LE_7", "OA21_LE_7", "OA21_LE_8", "OA22_LE_7", "OA22_LE_8", "OA23_LE_7", "OA23_LE_8", "OA24_LE_5", "OA24_LE_6", "OA24_LE_8", "OA26_LE_5", "OA27_LE_5", "OA27_LE_6", "OA28_LE_5", "OA28_LE_6", "OA29_LE_5", "OA29_LE_6", "OA30_LE_5", "OA30_LE_6", "OA31_LE_6"],
      },
      {
        asignatura: "fisica",
        enfoque:
          "Calor, temperatura y transferencia de energía en la vivienda.",
        queInvestigan:
          "Cuánto calor se pierde y por dónde, midiendo temperatura dentro y fuera a la misma hora, y qué cambia al tapar una filtración.",
        queSaleDeAqui:
          "Una medición antes y después de una intervención barata. Es la prueba de que se puede gastar menos leña sin pasar frío.",
        conceptosClave: ["calor y temperatura", "conducción", "aislación", "energía térmica", "transferencia"],
        tecnicas: ["bitacora", "medicion_dimensiones"],
        oaQueAbre: ["OA07_CN_7", "OA08_CN_5", "OA08_CN_7", "OA08_CN_8", "OA09_CN_5", "OA09_CN_8", "OA10_CN_5", "OA10_CN_8", "OA11_CN_5", "OA11_CN_8", "OA14_CN_6", "OA15_CN_6"],
      },
    ],
  },
  {
    id: "suelo_erosion",
    familia: "tierra",
    nombre: "Erosión del suelo",
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
        enfoque: "Papel de la vegetación en la retención del suelo.",
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
        enfoque: "Composición del suelo y su capacidad de retención.",
        queInvestigan:
          "Cuánta agua se queda en cada capa, qué se deshace en la mano, qué color tiene.",
        queSaleDeAqui:
          "Por qué esta tierra se seca aunque llueva, que es la pregunta que todos los que siembran se hacen.",
        conceptosClave: ["textura del suelo", "retención de agua", "porosidad", "materia orgánica"],
        tecnicas: ["muestra_suelo", "medicion_dimensiones"],
        oaQueAbre: ["OA16_CN_6", "OA17_CN_6", "OA11_CN_7"],
      },
      {
        asignatura: "matematica",
        enfoque: "Medición de la tasa de pérdida de suelo.",
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
        enfoque: "Obras de contención con materiales del lugar.",
        queInvestigan:
          "Barreras vivas, zanjas de infiltración, cobertura. Se instala y se vuelve a medir.",
        queSaleDeAqui:
          "Una obra pequeña que se puede mostrar, y el dato de si funcionó.",
        conceptosClave: ["barrera viva", "infiltración", "diseño de una solución", "seguimiento"],
        tecnicas: ["foto_punto_fijo", "medicion_dimensiones"],
        oaQueAbre: ["OA02_TE_5", "OA02_TE_7", "OA03_TE_8", "OA05_TE_7"],
      },
      {
        asignatura: "matematica",
        enfoque:
          "Geometría del terreno: pendiente, área y volumen.",
        queInvestigan:
          "La pendiente de la ladera, la superficie afectada y el volumen de tierra que se fue, medido entre dos visitas.",
        queSaleDeAqui:
          "Un número con unidad que se puede comparar con la próxima temporada. Sin eso, la erosión es una impresión.",
        conceptosClave: ["pendiente", "área", "volumen", "escala", "teorema de Pitágoras"],
        tecnicas: ["medicion_dimensiones", "mapa_a_mano"],
        oaQueAbre: ["OA01_MA_5", "OA01_MA_7", "OA01_MA_8", "OA02_MA_6", "OA02_MA_8", "OA03_MA_7", "OA04_MA_8", "OA05_MA_5", "OA05_MA_7", "OA06_MA_5", "OA10_MA_7", "OA11_MA_7", "OA11_MA_8", "OA12_MA_6", "OA12_MA_7", "OA12_MA_8", "OA13_MA_6", "OA13_MA_7", "OA13_MA_8", "OA14_MA_6", "OA14_MA_7", "OA14_MA_8", "OA15_MA_6", "OA16_MA_5", "OA16_MA_6", "OA17_MA_5", "OA17_MA_6", "OA18_MA_5", "OA18_MA_6", "OA19_MA_5", "OA19_MA_6", "OA20_MA_5", "OA20_MA_6", "OA21_MA_5", "OA21_MA_6", "OA22_MA_5"],
      },
      {
        asignatura: "historia",
        enfoque:
          "Geografía física del sector y usos del suelo.",
        queInvestigan:
          "Qué relieve, clima y vegetación tiene el sector, qué usos ha tenido el suelo y cómo esos usos explican lo que se ve hoy.",
        queSaleDeAqui:
          "La explicación de por qué pasa aquí y no dos cerros más allá. Es lo que distingue un diagnóstico de una queja.",
        conceptosClave: ["relieve", "clima", "uso de suelo", "recurso renovable", "desarrollo sostenible"],
        tecnicas: ["mapa_a_mano", "entrevista"],
        oaQueAbre: ["OA09_HI_5", "OA10_HI_5", "OA10_HI_6", "OA11_HI_5", "OA11_HI_6", "OA12_HI_5", "OA12_HI_6", "OA13_HI_6", "OA14_HI_6", "OA20_HI_8", "OA21_HI_7", "OA21_HI_8", "OA22_HI_7", "OA22_HI_8", "OA23_HI_7"],
      },
    ],
  },
  {
    id: "bosque_que_retrocede",
    familia: "tierra",
    nombre: "Pérdida de bosque nativo",
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
        enfoque: "Estado del bosque: pérdida y regeneración.",
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
        enfoque: "Extensión histórica del bosque según la memoria local.",
        queInvestigan:
          "Dónde había monte hace cuarenta años, en qué década se cortó y para qué. Fotos familiares, escrituras, y lo que cuenten los mayores.",
        queSaleDeAqui:
          "El mapa de lo que había, que casi nunca existe en ninguna parte y que cambia la discusión de si esto siempre fue así.",
        conceptosClave: ["uso del territorio", "fuente oral", "cambio en el paisaje"],
        tecnicas: ["entrevista", "mapa_a_mano"],
        oaQueAbre: ["OA10_HI_5", "OA14_HI_6", "OA21_HI_7"],
      },
      {
        asignatura: "matematica",
        enfoque: "Superficie de bosque restante y ritmo de pérdida.",
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
        enfoque: "Diseño de una intervención para favorecer la regeneración.",
        queInvestigan:
          "Recolección de semillas, un vivero pequeño en la escuela, cercado de un pedazo para que no entre el ganado. Se planta y se vuelve a mirar.",
        queSaleDeAqui:
          "Árboles vivos, o el dato de por qué no prendieron. Las dos cosas sirven.",
        conceptosClave: ["germinación", "vivero", "sustrato", "seguimiento con fecha"],
        tecnicas: ["muestra_suelo", "foto_punto_fijo"],
        oaQueAbre: ["OA01_TE_7", "OA02_TE_8", "OA04_TE_6"],
      },
      {
        asignatura: "artes",
        enfoque: "Registro visual del bosque y sus especies.",
        queInvestigan:
          "Dibujo o fotografía de los árboles grandes que quedan, uno por uno, con su ubicación.",
        queSaleDeAqui:
          "Un catastro que en diez años va a valer mucho más que ahora.",
        conceptosClave: ["dibujo de observación", "proporción", "registro con escala"],
        tecnicas: ["foto_punto_fijo", "bitacora"],
        oaQueAbre: ["OA01_AR_5", "OA03_AR_7", "OA01_AR_8"],
      },
      {
        asignatura: "lenguaje",
        enfoque:
          "Lectura de literatura y relatos sobre este territorio.",
        queInvestigan:
          "Qué se ha escrito sobre este paisaje: relatos, poemas, crónicas y mitos, y qué dicen que hoy ya no se ve.",
        queSaleDeAqui:
          "Un repertorio de textos del propio territorio. Cambia la conversación: el bosque deja de ser un recurso y pasa a ser un lugar con historia contada.",
        conceptosClave: ["narración", "poema", "relato mitológico", "interpretación", "contexto de producción"],
        tecnicas: ["bitacora"],
        oaQueAbre: ["OA02_LE_7", "OA02_LE_8", "OA03_LE_5", "OA03_LE_6", "OA03_LE_7", "OA03_LE_8", "OA04_LE_5", "OA04_LE_6", "OA04_LE_7", "OA04_LE_8", "OA05_LE_5", "OA05_LE_6", "OA05_LE_7", "OA05_LE_8", "OA06_LE_7", "OA06_LE_8", "OA07_LE_7", "OA07_LE_8", "OA08_LE_8", "OA12_LE_7", "OA13_LE_5", "OA13_LE_6", "OA13_LE_8", "OA14_LE_5", "OA14_LE_6", "OA16_LE_5", "OA16_LE_6", "OA16_LE_7", "OA17_LE_7", "OA17_LE_8", "OA18_LE_7", "OA18_LE_8", "OA19_LE_8", "OA20_LE_5", "OA20_LE_6", "OA21_LE_5", "OA21_LE_6", "OA23_LE_5", "OA23_LE_6", "OA26_LE_6"],
      },
    ],
  },
  {
    id: "memoria_oficios",
    familia: "gente",
    nombre: "Pérdida de oficios y saberes locales",
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
        enfoque: "Registro de oficios y saberes con sus portadores.",
        queInvestigan:
          "Entrevistas grabadas con quienes saben, con las preguntas preparadas por los estudiantes. Se ordena por tema y por fecha.",
        queSaleDeAqui:
          "Un archivo que antes no existía y que va a quedar cuando el curso ya no esté.",
        conceptosClave: ["fuente oral", "patrimonio inmaterial", "archivo", "testimonio"],
        tecnicas: ["entrevista", "foto_punto_fijo"],
        oaQueAbre: ["OA22_HI_5", "OA26_HI_6", "OA23_HI_7"],
      },
      {
        asignatura: "lenguaje",
        enfoque: "Variedades léxicas propias del sector.",
        queInvestigan:
          "Las palabras propias del lugar y del oficio: cómo se llama cada herramienta, cada parte, cada momento del año.",
        queSaleDeAqui:
          "Un glosario del lugar. Es el trabajo más barato de hacer y el que más dura.",
        conceptosClave: ["registro y variedad lingüística", "campo semántico", "glosario", "transcripción"],
        tecnicas: ["entrevista", "bitacora"],
        oaQueAbre: ["OA24_LE_7", "OA25_LE_5", "OA30_LE_6", "OA26_LE_8"],
      },
      {
        asignatura: "artes",
        enfoque: "Representación visual de un oficio en ejercicio.",
        queInvestigan:
          "Registro visual del proceso completo, paso a paso, con las manos de quien lo hace.",
        queSaleDeAqui:
          "Algo que permite aprender el oficio mirando, que es como se aprendió siempre.",
        conceptosClave: ["secuencia visual", "proceso", "encuadre del detalle"],
        tecnicas: ["foto_punto_fijo", "bitacora"],
        oaQueAbre: ["OA03_AR_6", "OA06_AR_7", "OA06_AR_8"],
      },
      {
        asignatura: "biologia",
        enfoque: "Conocimiento biológico asociado a un oficio local.",
        queInvestigan:
          "Qué plantas se usan y para qué, en qué época se recogen, qué señales se miran para decidir cuándo sembrar.",
        queSaleDeAqui:
          "Conocimiento comprobable que suele coincidir con lo que dice el libro, dicho en otras palabras y con más detalle local.",
        conceptosClave: ["uso tradicional de especies", "fenología", "clasificación"],
        tecnicas: ["entrevista", "cuadrante"],
        oaQueAbre: ["OA01_CN_5"],
      },
      {
        asignatura: "lenguaje",
        enfoque:
          "Exposición y diálogo con los portadores del oficio.",
        queInvestigan:
          "Cómo se conduce una conversación con alguien que sabe mucho más que uno: qué se pregunta, cuándo se calla y cómo se repregunta.",
        queSaleDeAqui:
          "Una entrevista que la persona entrevistada querría volver a dar. Es la condición para que abra la puerta una segunda vez.",
        conceptosClave: ["entrevista", "escucha activa", "turnos de habla", "registro formal e informal", "exposición"],
        tecnicas: ["entrevista", "bitacora"],
        oaQueAbre: ["OA20_LE_7", "OA21_LE_7", "OA21_LE_8", "OA22_LE_7", "OA22_LE_8", "OA23_LE_7", "OA23_LE_8", "OA24_LE_5", "OA24_LE_6", "OA24_LE_8", "OA26_LE_5", "OA27_LE_5", "OA27_LE_6", "OA28_LE_5", "OA28_LE_6", "OA29_LE_5", "OA29_LE_6", "OA30_LE_5", "OA30_LE_6", "OA31_LE_6"],
      },
      {
        asignatura: "tecnologia",
        enfoque:
          "Registro digital y resguardo del material.",
        queInvestigan:
          "Cómo se graba, se nombra, se guarda y se publica lo recogido para que se encuentre dentro de diez años.",
        queSaleDeAqui:
          "Un archivo ordenado con sus permisos escritos. La parte difícil no es grabar: es decidir quién puede usar eso después.",
        conceptosClave: ["formato", "metadatos", "respaldo", "privacidad", "licencia de uso"],
        tecnicas: ["bitacora"],
        oaQueAbre: ["OA04_TE_7", "OA04_TE_8", "OA05_TE_5", "OA05_TE_6", "OA06_TE_5", "OA06_TE_6", "OA07_TE_5", "OA07_TE_6"],
      },
    ],
  },
  {
    id: "lengua_que_se_calla",
    familia: "gente",
    nombre: "Pérdida de la lengua originaria",
    queEs:
      "En el sector hay personas mayores que hablan una lengua que los jóvenes ya no hablan. No se perdió sola: dejó de pasar de una generación a la siguiente, y con ella se van los nombres de los cerros, de las plantas y de las cosas que solo tienen nombre en esa lengua.",
    dondeAparece:
      "Escuelas con población mapuche, aymara, quechua o rapanui cerca, y también donde lo que se está perdiendo es una manera de hablar el castellano que solo existe en ese valle.",
    respaldo: [
      {
        titular: "Estudio confirma que la continuidad de la lengua mapuche está en riesgo",
        medio: "Diario Concepción",
        fecha: "2 de enero de 2025",
        url: "https://www.diarioconcepcion.cl/ciencia-y-sociedad/2025/01/02/estudio-confirma-que-la-continuidad-de-la-lengua-mapuche-esta-en-riesgo.html",
        queAporta:
          "El Instituto de Estudios Indígenas e Interculturales de la Universidad de La Frontera entrevistó a 440 personas de entre 15 y 81 años en Biobío, La Araucanía, Los Ríos y Los Lagos, por encargo del Ministerio de Desarrollo Social y Familia. Solo el 14 por ciento habla mapudungun con fluidez, con una edad promedio de 64 años, y el 85 por ciento de ellos vive en zonas rurales. El 79 por ciento lo aprendió en su casa y apenas el 4 por ciento en el sistema escolar.",
      },
    ],
    comoSeBuscan: {
      terminos: [
        "revitalización lengua + nombre de la comuna",
        "educadora tradicional + comuna",
        "programa intercultural bilingüe + comuna",
        "toponimia mapuche + nombre del sector",
      ],
      donde:
        "Diarios y radios regionales, los sitios de las municipalidades con programas interculturales, y los archivos de la CONADI y de las universidades del sur.",
      queNotaSirve:
        "Prioriza noticias que nombren a una persona del sector que todavía hable la lengua y a la que se pueda entrevistar. Un reportaje general sobre pérdida de lenguas no sirve: el curso necesita a alguien concreto que abra la puerta.",
    },
    angulos: [
      {
        asignatura: "lenguaje",
        enfoque: "Registro sonoro y transcripción del habla local.",
        queInvestigan:
          "Qué palabras usa la gente mayor del sector que los jóvenes ya no usan, para qué sirven y de dónde vienen. Se graba en audio, con permiso, y se transcribe.",
        queSaleDeAqui:
          "Un archivo sonoro que antes no existía, con la voz de personas del lugar. Es lo único de este proyecto que no se puede rehacer después: cuando la persona ya no está, no hay manera de volver a grabarla.",
        conceptosClave: ["registro oral", "transcripción", "préstamo lingüístico", "variedad y norma", "fuente primaria"],
        tecnicas: ["entrevista", "bitacora"],
        oaQueAbre: ["OA24_LE_7", "OA25_LE_5", "OA30_LE_6", "OA26_LE_8", "OA22_LE_7"],
      },
      {
        asignatura: "historia",
        enfoque: "Causas históricas de la pérdida de transmisión.",
        queInvestigan:
          "En qué década la gente del sector dejó de hablarla con sus hijos y por qué. Se pregunta a tres generaciones de la misma familia, que suelen contestar cosas distintas.",
        queSaleDeAqui:
          "Una línea de tiempo del sector con el momento del corte. Sirve para ver que no fue una pérdida natural sino una decisión tomada bajo presión, y eso cambia entera la conversación.",
        conceptosClave: ["memoria oral", "generación", "diversidad cultural", "derechos lingüísticos", "línea de tiempo"],
        tecnicas: ["entrevista", "bitacora"],
        oaQueAbre: ["OA19_HI_7", "OA20_HI_7", "OA17_HI_6", "OA19_HI_6", "OA13_HI_5"],
      },
      {
        asignatura: "matematica",
        enfoque: "Encuesta de hablantes por edad y sector.",
        queInvestigan:
          "Una encuesta corta en el sector: quién la entiende, quién la habla, quién la habla en su casa. Se cruza con la edad y se compara con las cifras del estudio nacional.",
        queSaleDeAqui:
          "El dato de su propio sector, que casi nunca existe. Permite decir si aquí está mejor o peor que el promedio del país, y esa comparación es lo que hace que alguien escuche.",
        conceptosClave: ["muestra y población", "frecuencia relativa", "porcentaje", "distribución por edad", "gráfico de barras"],
        tecnicas: ["encuesta", "bitacora"],
        oaQueAbre: ["OA15_MA_7", "OA16_MA_7", "OA22_MA_6", "OA23_MA_5", "OA26_MA_5"],
      },
      {
        asignatura: "artes",
        enfoque: "Intervención visual con la lengua en espacio público.",
        queInvestigan:
          "Cómo se ve una palabra que casi no se dice. Se prueba en distintos soportes y tamaños, en los sitios por donde la gente pasa todos los días.",
        queSaleDeAqui:
          "Algo instalado en el pueblo que obliga a leer en esa lengua a quien pasa. Una palabra pintada en grande en el paradero hace más por ella que un informe bien escrito.",
        conceptosClave: ["arte en el espacio público", "tipografía", "escala", "soporte", "montaje"],
        tecnicas: ["foto_punto_fijo", "mapa_a_mano", "medicion_dimensiones"],
        oaQueAbre: ["OA01_AR_6", "OA03_AR_6", "OA06_AR_7", "OA06_AR_8", "OA01_AR_8"],
      },
      {
        asignatura: "tecnologia",
        enfoque: "Archivo, resguardo y publicación del registro sonoro.",
        queInvestigan:
          "Cómo se guarda y se publica un archivo de audio para que dure y para que lo encuentre alguien que no sabe que existe. Incluye pedir permiso y decidir qué no se publica.",
        queSaleDeAqui:
          "Un archivo que sobrevive al curso. La parte difícil no es grabar: es decidir quién puede usar esas voces después y dejarlo escrito.",
        conceptosClave: ["formato de archivo", "respaldo", "metadatos", "consentimiento", "licencia de uso"],
        tecnicas: ["bitacora", "entrevista"],
        oaQueAbre: ["OA05_TE_5", "OA07_TE_5", "OA07_TE_6", "OA04_TE_7", "OA04_TE_8"],
      },
      {
        asignatura: "biologia",
        enfoque: "Nombres de especies locales en la lengua originaria.",
        queInvestigan:
          "Qué plantas y animales del sector nombra la gente mayor en su lengua, para qué se usaban, y cuáles de esos ya no se encuentran cerca.",
        queSaleDeAqui:
          "Una lista con dos columnas: el nombre en la lengua y el nombre científico, cuando lo hay. Las que no tienen nombre científico al lado son las más interesantes.",
        conceptosClave: ["especie nativa", "clasificación", "uso tradicional", "hábitat", "biodiversidad local"],
        tecnicas: ["entrevista", "cuadrante", "foto_punto_fijo"],
        oaQueAbre: ["OA02_CN_6", "OA03_CN_6", "OA01_CN_6"],
      },
      {
        asignatura: "lenguaje",
        enfoque:
          "Lectura de relatos y poesía en la lengua del lugar.",
        queInvestigan:
          "Qué relatos, cantos y poemas existen en esa lengua, qué cuentan y qué se pierde al traducirlos.",
        queSaleDeAqui:
          "Una selección leída y comentada. Es la manera de que la lengua deje de ser un objeto de estudio y vuelva a ser algo que se lee.",
        conceptosClave: ["relato mitológico", "poema", "traducción", "interpretación", "herencia cultural"],
        tecnicas: ["bitacora", "entrevista"],
        oaQueAbre: ["OA02_LE_7", "OA02_LE_8", "OA03_LE_5", "OA03_LE_6", "OA03_LE_7", "OA03_LE_8", "OA04_LE_5", "OA04_LE_6", "OA04_LE_7", "OA04_LE_8", "OA05_LE_5", "OA05_LE_6", "OA05_LE_7", "OA05_LE_8", "OA06_LE_7", "OA06_LE_8", "OA07_LE_7", "OA07_LE_8", "OA08_LE_8", "OA23_LE_5", "OA23_LE_6", "OA26_LE_6"],
      },
    ],
  },
  {
    id: "sin_conexion",
    familia: "gente",
    nombre: "Falta de conectividad digital",
    queEs:
      "En el sector no hay señal, o la hay a ratos y en un solo punto. Eso decide quién puede estudiar en la casa, quién puede pedir hora al consultorio y quién tiene que viajar para hacer un trámite que otros hacen desde el teléfono.",
    dondeAparece:
      "Buena parte del país rural, y de manera desigual dentro de la misma comuna: hay sectores con fibra y sectores a diez kilómetros donde hay que subir un cerro para mandar un mensaje.",
    respaldo: [
      {
        titular:
          "Gobierno lanza Plan Brecha Digital Cero con foco en zonas sin conectividad, robo de cables y trabajo con municipios",
        medio: "Subsecretaría de Telecomunicaciones",
        fecha: "17 de mayo de 2022",
        url: "https://www.subtel.gob.cl/gobierno-lanza-plan-brecha-digital-cero-con-foco-en-zonas-sin-conectividad-robo-de-cables-y-trabajo-con-municipios/",
        queAporta:
          "El plan del Estado para cerrar la brecha, con sus cifras: 10.086 colegios por conectar, 9.560 kilómetros de Fibra Óptica Nacional en 202 comunas y 366 localidades con internet de alta velocidad. Sirve para ver qué se prometió, cuándo, y con cuánta plata, que es contra lo que el curso puede contrastar lo que pasa en su sector.",
      },
      {
        titular: "Conectividad rural: ¿Vamos a seguir mirando para otro lado?",
        medio: "El Desconcierto",
        fecha: "24 de septiembre de 2025",
        url: "https://eldesconcierto.cl/2025/09/24/conectividad-rural-vamos-a-seguir-mirando-para-otro-lado",
        queAporta:
          "Es una columna de opinión, no una nota, y conviene decirlo en la sala. Aporta las cifras de la Subsecretaría de Telecomunicaciones que cita: la conexión fija llega al 70 por ciento en zonas urbanas y apenas supera el 30 por ciento en el mundo rural. Sirve además para trabajar la diferencia entre una noticia y una columna.",
      },
    ],
    comoSeBuscan: {
      terminos: [
        "sin señal + nombre de la localidad",
        "antena celular + comuna",
        "fibra óptica + comuna",
        "conectividad escuela rural + región",
      ],
      donde:
        "Diarios y radios regionales, actas del concejo municipal, y los informes de la Subsecretaría de Telecomunicaciones, que publica por comuna.",
      queNotaSirve:
        "Prioriza noticias que nombren una localidad concreta y una fecha comprometida. Una nota sobre la brecha digital en general no sirve: lo que mueve a alguien es que su sector aparezca con nombre en una lista de promesas.",
    },
    angulos: [
      {
        asignatura: "tecnologia",
        enfoque: "Levantamiento de un mapa de cobertura móvil.",
        queInvestigan:
          "Dónde hay señal, de qué compañía y con cuánta fuerza, medido en varios puntos del sector a la misma hora. Se anota lo que marca el teléfono, que es un instrumento que ya tienen.",
        queSaleDeAqui:
          "Un mapa del sector con la señal marcada punto por punto. No existe en ninguna parte: las coberturas que publican las compañías son modelos, no mediciones, y en un valle con cerros no se parecen.",
        conceptosClave: ["cobertura", "intensidad de señal", "punto de medición", "mapa temático", "fuente primaria"],
        tecnicas: ["mapa_a_mano", "bitacora", "foto_punto_fijo"],
        oaQueAbre: ["OA01_TE_7", "OA02_TE_7", "OA04_TE_7", "OA05_TE_5", "OA01_TE_8"],
      },
      {
        asignatura: "matematica",
        enfoque: "Medición del acceso a internet en el sector.",
        queInvestigan:
          "Una encuesta en el sector: quién tiene internet en la casa, quién solo con el teléfono, cuánto gasta al mes y qué dejó de hacer por no tener.",
        queSaleDeAqui:
          "El porcentaje del sector que está fuera, comparado con el 30 por ciento rural que da la cifra nacional. Si aquí es peor, eso es la noticia.",
        conceptosClave: ["muestra y población", "porcentaje", "frecuencia absoluta y relativa", "comparación con un referente", "gráfico circular"],
        tecnicas: ["encuesta", "bitacora"],
        oaQueAbre: ["OA15_MA_7", "OA16_MA_7", "OA04_MA_6", "OA05_MA_8", "OA26_MA_5"],
      },
      {
        asignatura: "historia",
        enfoque: "Institucionalidad responsable y vías de solicitud.",
        queInvestigan:
          "Qué organismo decide dónde va una antena, qué se prometió para este sector y en qué año, y por qué conducto se reclama. Se revisan actas del concejo municipal.",
        queSaleDeAqui:
          "El nombre y el cargo de quien puede firmar algo, y el camino exacto para llegarle. Es lo que convierte un reclamo en una gestión.",
        conceptosClave: ["aislamiento y conexión", "servicio público", "atribución", "participación ciudadana", "acta"],
        tecnicas: ["entrevista", "bitacora"],
        oaQueAbre: ["OA21_HI_8", "OA15_HI_6", "OA23_HI_6", "OA22_HI_7", "OA19_HI_5"],
      },
      {
        asignatura: "lenguaje",
        enfoque: "Redacción de una carta formal a la autoridad.",
        queInvestigan:
          "Cómo está escrita una carta que consigue respuesta: qué pide, en cuántas líneas, con qué dato adelante y a quién va dirigida por su nombre.",
        queSaleDeAqui:
          "Una carta enviada de verdad, con copia. La diferencia entre un texto de clase y este es que este tiene destinatario y fecha de envío.",
        conceptosClave: ["propósito comunicativo", "destinatario", "registro formal", "argumento y evidencia", "revisión entre pares"],
        tecnicas: ["bitacora"],
        oaQueAbre: ["OA14_LE_7", "OA15_LE_8", "OA13_LE_7", "OA07_LE_6", "OA15_LE_5"],
      },
      {
        asignatura: "artes",
        enfoque: "Serie fotográfica sobre el acceso a la señal.",
        queInvestigan:
          "Cómo se ve tener que subir un cerro para mandar un mensaje. Se fotografía a la misma hora, en los mismos puntos, a lo largo de varias semanas.",
        queSaleDeAqui:
          "Una serie de imágenes del mismo sitio que cuenta algo que una cifra no cuenta. Es el material con el que la gente de fuera entiende de qué se está hablando.",
        conceptosClave: ["serie fotográfica", "punto fijo", "encuadre", "luz", "montaje de una exposición"],
        tecnicas: ["foto_punto_fijo", "bitacora"],
        oaQueAbre: ["OA03_AR_7", "OA01_AR_8", "OA06_AR_7", "OA05_AR_6", "OA04_AR_8"],
      },
      {
        asignatura: "historia",
        enfoque:
          "Derechos, deberes y acceso a servicios.",
        queInvestigan:
          "Qué se considera un servicio al que todos tienen derecho, quién debe garantizarlo, y cómo se reclama cuando no llega.",
        queSaleDeAqui:
          "El argumento de por qué esto no es mala suerte sino un derecho no cumplido. Cambia el tono de la carta que se escribe después.",
        conceptosClave: ["derecho y deber", "Estado", "servicio público", "participación", "bien común"],
        tecnicas: ["entrevista", "bitacora"],
        oaQueAbre: ["OA13_HI_5", "OA14_HI_5", "OA15_HI_5", "OA15_HI_6", "OA16_HI_5", "OA16_HI_6", "OA17_HI_5", "OA17_HI_6", "OA17_HI_7", "OA17_HI_8", "OA18_HI_5", "OA18_HI_6", "OA18_HI_7", "OA18_HI_8", "OA19_HI_5", "OA19_HI_6", "OA19_HI_7", "OA19_HI_8", "OA20_HI_5", "OA20_HI_6", "OA20_HI_7", "OA21_HI_5", "OA21_HI_6", "OA22_HI_5", "OA22_HI_6", "OA23_HI_6", "OA24_HI_6", "OA25_HI_6", "OA26_HI_6"],
      },
      {
        asignatura: "matematica",
        enfoque:
          "Modelo del avance de la cobertura en el tiempo.",
        queInvestigan:
          "Cuánto ha avanzado la cobertura por año según las cifras oficiales, y en qué año llegaría aquí si sigue a ese ritmo.",
        queSaleDeAqui:
          "Una fecha estimada con su supuesto a la vista. Es la frase que hace que alguien conteste una carta.",
        conceptosClave: ["patrón", "tabla de valores", "ecuación lineal", "función", "proyección"],
        tecnicas: ["bitacora"],
        oaQueAbre: ["OA06_MA_7", "OA06_MA_8", "OA07_MA_7", "OA07_MA_8", "OA08_MA_8", "OA09_MA_6", "OA09_MA_7", "OA09_MA_8", "OA10_MA_6", "OA10_MA_8", "OA11_MA_6", "OA14_MA_5", "OA15_MA_5"],
      },
    ],
  },
  {
    id: "pueblo_que_se_vacia",
    familia: "gente",
    nombre: "Despoblamiento rural",
    queEs:
      "Cada año hay menos niños en la escuela, más casas cerradas y menos gente joven en el sector. Los que se van no se van por gusto: se van por agua, por trabajo, por salud o para seguir estudiando.",
    dondeAparece:
      "Comunas del interior de casi todo el país, y se nota antes que en ninguna otra parte en la matrícula de la escuela.",
    respaldo: [
      {
        titular: "Zonas rurales de la región en alerta por éxodo juvenil hacia las ciudades",
        medio: "Diario El Día",
        fecha: "10 de mayo de 2026",
        url: "https://www.diarioeldia.cl/noticias/2026/05/10/137178-zonas-rurales-de-la-region-en-alerta-por-exodo-juvenil-hacia-las-ciudades",
        queAporta:
          "Con datos del Censo 2024 en la región de Coquimbo: la población rural bajó del 18,8 al 17,7 por ciento mientras la urbana subió de 615.116 a 723.819 habitantes. Río Hurtado pasó de 4.700 a 4.300 habitantes. Las causas que dan los dirigentes y alcaldes entrevistados son la sequía, la falta de empleo y el acceso a salud y educación.",
      },
    ],
    comoSeBuscan: {
      terminos: [
        "censo 2024 + nombre de la comuna",
        "cierre de escuela rural + comuna",
        "matrícula escolar + comuna",
        "migración campo ciudad + región",
      ],
      donde:
        "Los resultados del Censo 2024 del Instituto Nacional de Estadísticas, que publica por comuna, y los diarios y radios regionales.",
      queNotaSirve:
        "Prioriza noticias que den una cifra de habitantes con dos años para comparar. Una nota sobre el envejecimiento del campo en general no sirve: hace falta el número de su comuna para que el curso pueda calcular.",
    },
    angulos: [
      {
        asignatura: "historia",
        enfoque: "Evolución de la población del sector según el censo.",
        queInvestigan:
          "Los datos del censo de la comuna en dos momentos, y qué pasó en medio. Se contrasta con lo que cuenta la gente del sector sobre quiénes se fueron y adónde.",
        queSaleDeAqui:
          "El movimiento de la población del sector con sus causas nombradas. Un dato del censo dice cuántos; solo la gente del lugar dice por qué.",
        conceptosClave: ["censo", "migración campo-ciudad", "índice demográfico", "envejecimiento", "aislamiento"],
        tecnicas: ["entrevista", "bitacora"],
        oaQueAbre: ["OA21_HI_8", "OA13_HI_6", "OA11_HI_5", "OA22_HI_8", "OA12_HI_6"],
      },
      {
        asignatura: "matematica",
        enfoque: "Serie histórica de la matrícula escolar.",
        queInvestigan:
          "Cuántos estudiantes tuvo la escuela cada año de la última década. Está en los libros de la dirección y casi nunca se ha mirado junto.",
        queSaleDeAqui:
          "Una serie de diez años con su tendencia. Permite decir en qué año cierra un curso si sigue así, que es una frase que se entiende sola.",
        conceptosClave: ["serie de tiempo", "tasa de cambio", "proyección", "promedio", "gráfico de línea"],
        tecnicas: ["bitacora"],
        oaQueAbre: ["OA26_MA_5", "OA23_MA_5", "OA09_MA_6", "OA07_MA_8", "OA08_MA_8"],
      },
      {
        asignatura: "lenguaje",
        enfoque: "Relatos de quienes migraron y quienes permanecieron.",
        queInvestigan:
          "Por qué se fue quien se fue y por qué se quedó quien se quedó. Se entrevista a personas de las dos clases, incluidas las que ya no viven aquí.",
        queSaleDeAqui:
          "Un conjunto de relatos en primera persona. Son lo único que puede acompañar a la cifra sin repetirla, y es lo que la gente de fuera recuerda.",
        conceptosClave: ["relato en primera persona", "entrevista", "crónica", "voz narrativa", "edición"],
        tecnicas: ["entrevista", "bitacora"],
        oaQueAbre: ["OA24_LE_7", "OA12_LE_7", "OA13_LE_5", "OA30_LE_6", "OA14_LE_8"],
      },
      {
        asignatura: "artes",
        enfoque: "Catastro visual de las viviendas desocupadas.",
        queInvestigan:
          "Cuántas casas del sector están cerradas y cómo se ven. Se recorre, se fotografía y se marca en un plano hecho a mano.",
        queSaleDeAqui:
          "Un plano del sector con las casas vacías marcadas, y las imágenes al lado. Puestos juntos, dicen algo que ninguno de los dos dice solo.",
        conceptosClave: ["registro fotográfico", "plano", "instalación", "espacio público", "montaje"],
        tecnicas: ["foto_punto_fijo", "mapa_a_mano", "bitacora"],
        oaQueAbre: ["OA01_AR_6", "OA03_AR_8", "OA01_AR_8", "OA06_AR_8", "OA05_AR_6"],
      },
      {
        asignatura: "tecnologia",
        enfoque: "Producto tecnológico para una necesidad de quienes permanecen.",
        queInvestigan:
          "Qué le falta a la gente que sigue viviendo aquí y que se podría construir o arreglar con lo que hay en el pueblo.",
        queSaleDeAqui:
          "Una cosa hecha y entregada, con su costo anotado. Es el ángulo que se niega a que el proyecto termine en un diagnóstico triste.",
        conceptosClave: ["necesidad y oportunidad", "materiales disponibles", "costo", "prototipo", "evaluación de la solución"],
        tecnicas: ["entrevista", "medicion_dimensiones", "bitacora"],
        oaQueAbre: ["OA01_TE_7", "OA02_TE_8", "OA03_TE_8", "OA02_TE_6", "OA06_TE_7"],
      },
      {
        asignatura: "lenguaje",
        enfoque:
          "Escritura creativa a partir de los relatos recogidos.",
        queInvestigan:
          "Cómo se convierte una entrevista en un texto que alguien quiera leer: qué se deja, qué se ordena y con qué voz se cuenta.",
        queSaleDeAqui:
          "Un conjunto de textos que no son ni informe ni ficción. Es lo que acompaña a la cifra sin repetirla.",
        conceptosClave: ["crónica", "voz narrativa", "estructura", "edición", "recursos del lenguaje"],
        tecnicas: ["entrevista", "bitacora"],
        oaQueAbre: ["OA12_LE_7", "OA13_LE_5", "OA13_LE_6", "OA13_LE_7", "OA13_LE_8", "OA14_LE_5", "OA14_LE_6", "OA14_LE_8", "OA15_LE_5", "OA15_LE_6", "OA15_LE_7", "OA16_LE_5", "OA16_LE_6", "OA16_LE_7", "OA16_LE_8", "OA17_LE_5", "OA17_LE_6", "OA17_LE_7", "OA17_LE_8", "OA18_LE_5", "OA18_LE_6", "OA18_LE_7", "OA18_LE_8", "OA19_LE_5", "OA19_LE_6", "OA19_LE_7", "OA19_LE_8", "OA20_LE_5", "OA20_LE_6", "OA20_LE_8", "OA21_LE_5", "OA21_LE_6", "OA22_LE_5", "OA22_LE_6"],
      },
      {
        asignatura: "historia",
        enfoque:
          "Formas de decidir en común, antes y ahora.",
        queInvestigan:
          "Cómo se han organizado las comunidades para decidir sobre lo que les pasa, desde las formas que estudia el programa hasta la junta de vecinos del sector.",
        queSaleDeAqui:
          "La comparación entre lo que se estudia y lo que existe en el pueblo. Es lo que hace que la unidad de ciudadanía deje de ser un tema de libro.",
        conceptosClave: ["ciudadanía", "democracia", "representación", "derechos humanos", "organización"],
        tecnicas: ["entrevista", "bitacora"],
        oaQueAbre: ["OA13_HI_5", "OA14_HI_5", "OA15_HI_5", "OA15_HI_6", "OA16_HI_5", "OA16_HI_6", "OA17_HI_5", "OA17_HI_6", "OA17_HI_7", "OA17_HI_8", "OA18_HI_5", "OA18_HI_6", "OA18_HI_7", "OA18_HI_8", "OA19_HI_5", "OA19_HI_6", "OA19_HI_7", "OA19_HI_8", "OA20_HI_5", "OA20_HI_6", "OA20_HI_7", "OA21_HI_5", "OA21_HI_6", "OA22_HI_5", "OA22_HI_6", "OA23_HI_6", "OA24_HI_6", "OA25_HI_6", "OA26_HI_6"],
      },
    ],
  },
  {
    id: "alimentacion_escolar",
    familia: "gente",
    nombre: "Alimentación escolar y producción local de alimentos",
    queEs:
      "Lo que el curso come todos los días en la escuela, de dónde viene, cuánto se bota y qué se podría producir a menos de un kilómetro. En el campo se da la paradoja de que se produce comida alrededor y lo que llega al plato viene de lejos.",
    dondeAparece:
      "Todas las escuelas con Programa de Alimentación Escolar, que en el sector rural son casi todas, y con terreno disponible aunque sea un pedazo de patio.",
    respaldo: [
      {
        titular:
          "Mapa Nutricional Junaeb registra leve alza en malnutrición por exceso y disminución de grupos con déficit alimentario",
        medio: "Ministerio de Educación",
        fecha: "3 de abril de 2025",
        url: "https://www.mineduc.cl/mapa-nutricional-junaeb-registra-leve-alza-en-malnutricion-por-exceso-y-disminucion-de-grupos-con-deficit-alimentario/",
        queAporta:
          "La malnutrición por exceso llegó al 50,9 por ciento de los estudiantes evaluados, con más de 700 mil respuestas del 73,9 por ciento de los establecimientos con financiamiento público. La cifra rural es más alta que la urbana: 55,9 contra 50,4 por ciento. Ese diferencial es el dato del que parte este proyecto, porque contradice lo que se supone del campo.",
      },
    ],
    comoSeBuscan: {
      terminos: [
        "Mapa Nutricional Junaeb + nombre de la región",
        "programa alimentación escolar + comuna",
        "huerto escolar + comuna",
        "agricultura familiar campesina + comuna",
      ],
      donde:
        "Los informes de Junaeb, que publica por región y por comuna, los diarios y radios regionales, y el municipio si tiene programa de huertos.",
      queNotaSirve:
        "Prioriza noticias o informes que den la cifra de su región o comuna. El dato nacional sirve para plantear el asunto, pero lo que mueve a un curso es ver su propia comuna en la tabla.",
    },
    angulos: [
      {
        asignatura: "biologia",
        enfoque:
          "Qué hace el cuerpo con lo que se come en la escuela.",
        queInvestigan:
          "Qué trae cada alimento de la minuta, por dónde pasa en el cuerpo y para qué sirve. Se sigue una ración real, la del martes, y no un ejemplo del libro.",
        queSaleDeAqui:
          "La minuta de la escuela explicada por dentro. Deja de ser lo que toca ese día y pasa a ser algo sobre lo que se puede opinar con argumento.",
        conceptosClave: ["nutriente", "sistema digestivo", "absorción", "porción", "gasto energético"],
        tecnicas: ["bitacora", "pauta_observacion"],
        oaQueAbre: ["OA01_CN_5", "OA01_CN_6", "OA01_CN_7", "OA01_CN_8", "OA02_CN_5", "OA02_CN_6", "OA02_CN_7", "OA02_CN_8", "OA03_CN_5", "OA03_CN_6", "OA03_CN_7", "OA03_CN_8", "OA04_CN_5", "OA04_CN_7", "OA04_CN_8", "OA05_CN_5", "OA05_CN_7", "OA05_CN_8", "OA06_CN_5", "OA06_CN_7", "OA06_CN_8", "OA07_CN_5", "OA07_CN_8"],
      },
      {
        asignatura: "matematica",
        enfoque:
          "Cuánto se sirve, cuánto se come y cuánto se bota.",
        queInvestigan:
          "El peso de lo que se sirve y el de lo que vuelve al carro, durante una semana, separado por preparación.",
        queSaleDeAqui:
          "El porcentaje de merma por plato. Es el dato que hace que la conversación con quien decide la minuta deje de ser una opinión sobre el gusto.",
        conceptosClave: ["masa", "porcentaje", "promedio", "frecuencia", "gráfico de barras"],
        tecnicas: ["medicion_dimensiones", "bitacora"],
        oaQueAbre: ["OA01_MA_5", "OA01_MA_7", "OA01_MA_8", "OA02_MA_6", "OA02_MA_7", "OA02_MA_8", "OA03_MA_6", "OA03_MA_7", "OA04_MA_6", "OA04_MA_7", "OA04_MA_8", "OA05_MA_5", "OA05_MA_6", "OA05_MA_7", "OA05_MA_8", "OA06_MA_5", "OA06_MA_6", "OA07_MA_5", "OA07_MA_6", "OA08_MA_5", "OA08_MA_6", "OA08_MA_7", "OA09_MA_5", "OA10_MA_5", "OA11_MA_5", "OA12_MA_5", "OA13_MA_5", "OA15_MA_7", "OA15_MA_8", "OA16_MA_7", "OA16_MA_8", "OA17_MA_7", "OA17_MA_8", "OA18_MA_6", "OA18_MA_7", "OA19_MA_5", "OA19_MA_6", "OA19_MA_7", "OA20_MA_5", "OA20_MA_6", "OA21_MA_5", "OA21_MA_6", "OA22_MA_6", "OA23_MA_5", "OA23_MA_6", "OA24_MA_5", "OA24_MA_6", "OA25_MA_5", "OA26_MA_5", "OA27_MA_5"],
      },
      {
        asignatura: "tecnologia",
        enfoque:
          "Diseño y construcción de un huerto en el terreno que hay.",
        queInvestigan:
          "Qué cabe en el espacio disponible, con qué materiales del lugar, con qué riego y en qué calendario de siembra según el clima del sector.",
        queSaleDeAqui:
          "Un huerto construido, con su plano, su presupuesto y su calendario. Es de los pocos productos de proyecto que sigue existiendo el año siguiente.",
        conceptosClave: ["necesidad", "planificación", "materiales", "costo", "evaluación de la solución"],
        tecnicas: ["medicion_dimensiones", "mapa_a_mano", "bitacora"],
        oaQueAbre: ["OA01_TE_5", "OA01_TE_6", "OA01_TE_7", "OA01_TE_8", "OA02_TE_5", "OA02_TE_6", "OA02_TE_7", "OA02_TE_8", "OA03_TE_5", "OA03_TE_6", "OA03_TE_7", "OA03_TE_8", "OA04_TE_5", "OA04_TE_6", "OA04_TE_7", "OA04_TE_8", "OA05_TE_5", "OA05_TE_6", "OA06_TE_5", "OA06_TE_6", "OA07_TE_5", "OA07_TE_6"],
      },
      {
        asignatura: "historia",
        enfoque:
          "De dónde viene lo que se come y qué se producía aquí antes.",
        queInvestigan:
          "Qué se cultivaba en el sector hace treinta años, qué se cultiva hoy, y de qué distancia viene lo que llega a la escuela.",
        queSaleDeAqui:
          "El contraste entre lo que el sector produce y lo que el sector come. Suele ser el hallazgo que más sorprende a los adultos.",
        conceptosClave: ["recurso natural", "actividad económica", "región", "desarrollo sustentable", "memoria oral"],
        tecnicas: ["entrevista", "bitacora"],
        oaQueAbre: ["OA09_HI_5", "OA10_HI_5", "OA10_HI_6", "OA11_HI_5", "OA11_HI_6", "OA12_HI_5", "OA12_HI_6", "OA13_HI_6", "OA14_HI_6", "OA20_HI_8", "OA21_HI_7", "OA21_HI_8", "OA22_HI_7", "OA22_HI_8", "OA23_HI_7"],
      },
      {
        asignatura: "lenguaje",
        enfoque:
          "Lectura de etiquetas, minutas y publicidad de alimentos.",
        queInvestigan:
          "Qué dice y qué omite una etiqueta, cómo está escrita la minuta oficial, y con qué recursos convence la publicidad de lo que se vende en el kiosco.",
        queSaleDeAqui:
          "La capacidad de leer un envase y saber qué está diciendo. Es de las cosas de este proyecto que más se usa fuera de la escuela.",
        conceptosClave: ["texto discontinuo", "mensaje publicitario", "sesgo", "vocabulario técnico", "síntesis"],
        tecnicas: ["bitacora"],
        oaQueAbre: ["OA01_LE_5", "OA01_LE_6", "OA01_LE_7", "OA01_LE_8", "OA02_LE_5", "OA02_LE_6", "OA06_LE_5", "OA06_LE_6", "OA07_LE_5", "OA07_LE_6", "OA08_LE_5", "OA08_LE_6", "OA08_LE_7", "OA09_LE_7", "OA09_LE_8", "OA10_LE_7", "OA10_LE_8", "OA11_LE_7", "OA11_LE_8", "OA12_LE_5", "OA12_LE_6", "OA12_LE_8", "OA14_LE_7", "OA15_LE_8", "OA25_LE_6"],
      },
      {
        asignatura: "artes",
        enfoque:
          "Registro visual de la minuta y del huerto.",
        queInvestigan:
          "Cómo se ve lo que se sirve, fotografiado igual todos los días, y cómo se ve el terreno del huerto antes y después.",
        queSaleDeAqui:
          "Una serie que muestra el cambio sin necesidad de explicarlo, y que sirve para la entrega a las familias.",
        conceptosClave: ["serie fotográfica", "encuadre", "punto fijo", "montaje", "público"],
        tecnicas: ["foto_punto_fijo", "bitacora"],
        oaQueAbre: ["OA01_AR_5", "OA01_AR_6", "OA01_AR_7", "OA01_AR_8", "OA02_AR_5", "OA02_AR_6", "OA02_AR_7", "OA02_AR_8", "OA03_AR_5", "OA03_AR_6", "OA03_AR_7", "OA03_AR_8", "OA04_AR_5", "OA04_AR_6", "OA04_AR_7", "OA04_AR_8", "OA05_AR_5", "OA05_AR_6", "OA05_AR_7", "OA05_AR_8", "OA06_AR_7", "OA06_AR_8"],
      },
    ],
  },
];

/**
 * Una problemática por su id, de cualquier edición.
 *
 * Las de Río llevan el prefijo `br_`, así que las dos listas no se pisan y
 * quien tiene guardado un id no necesita saber de qué país es.
 */
export function problemaPorId(id: string): Problema | undefined {
  return PROBLEMAS.find((p) => p.id === id) ?? PROBLEMAS_BR.find((p) => p.id === id);
}

export function nombreAsignatura(id: string): string {
  return (
    ASIGNATURAS.find((a) => a.id === id)?.nombre ??
    ASIGNATURAS_BR.find((a) => a.id === id)?.nombre ??
    id
  );
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
