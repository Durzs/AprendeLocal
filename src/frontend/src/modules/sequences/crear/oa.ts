/**
 * Los Objetivos de Aprendizaje, para elegirlos de una lista y no escribirlos.
 *
 * Antes el campo era un cuadro de texto vacío: el docente tenía que acordarse
 * del código o ir a buscar el programa en otra pestaña. Con la lista, marca lo
 * que va a pasar y sigue. Es la diferencia entre recordar y reconocer, y para
 * eso último no hace falta tener el programa al lado.
 *
 * Los sesenta y dos son de las Bases Curriculares del MINEDUC para Ciencias
 * Naturales de 5º a 8º básico. Salen del mismo archivo que siembra la tabla
 * `curriculum_objectives` en la base (infra/curriculum_tables.sql), extraídos
 * a este módulo para que el desplegable funcione sin señal: en una escuela
 * rural el internet es lo primero que falta, y elegir un OA no puede depender
 * de que la base responda.
 *
 * Solo hay Ciencias Naturales. Cuando entren Matemática o Historia, se
 * agregan aquí con su asignatura y la lista los agrupa sola.
 */

/** Los cuatro cursos que atiende hoy la plataforma. */
export type NivelOA = "5to_basico" | "6to_basico" | "7mo_basico" | "8vo_basico";

export type OA = {
  /** El código con que aparece en el programa, por ejemplo OA12_CN_5. */
  codigo: string;
  nivel: NivelOA;
  eje: string;
  /** El número dentro del nivel, que es como los nombra un docente: «el OA 12». */
  n: number;
  texto: string;
  /** Para buscar por palabra suelta sin acordarse del código. */
  claves: string[];
};

/** Nombre legible de cada eje, para agrupar la lista. */
export const EJES: Record<string, string> = {
  "ciencias_vida": "Ciencias de la vida",
  "biologia": "Biología",
  "ciencias_fisicas": "Ciencias físicas y químicas",
  "fisica": "Física",
  "quimica": "Química",
  "ciencias_tierra": "Ciencias de la Tierra y el Universo"
};

/** `5to_basico` → `5º`. */
export const CURSO_CORTO: Record<NivelOA, string> = {
  "5to_basico": "5º",
  "6to_basico": "6º",
  "7mo_basico": "7º",
  "8vo_basico": "8º"
};

export const OBJETIVOS: OA[] = [
  {
    codigo: "OA01_CN_5",
    nivel: "5to_basico",
    eje: "ciencias_vida",
    n: 1,
    texto:
      "Reconocer y explicar que los seres vivos están formados por una o más células y que estas se organizan en tejidos, órganos y sistemas.",
    claves: ["células", "tejidos", "órganos", "sistemas", "seres vivos", "biología"],
  },
  {
    codigo: "OA02_CN_5",
    nivel: "5to_basico",
    eje: "ciencias_vida",
    n: 2,
    texto:
      "Identificar y describir por medio de modelos las estructuras básicas del sistema digestivo y sus funciones en la digestión, la absorción de alimentos y la eliminación de desechos.",
    claves: ["sistema digestivo", "digestión", "absorción", "alimentos", "nutrición"],
  },
  {
    codigo: "OA03_CN_5",
    nivel: "5to_basico",
    eje: "ciencias_vida",
    n: 3,
    texto:
      "Explicar por medio de modelos la respiración (inspiración-espiración-intercambio de oxígeno y dióxido de carbono), identificando las estructuras básicas del sistema respiratorio.",
    claves: ["respiración", "oxígeno", "pulmones", "sistema respiratorio"],
  },
  {
    codigo: "OA04_CN_5",
    nivel: "5to_basico",
    eje: "ciencias_vida",
    n: 4,
    texto:
      "Explicar la función de transporte del sistema circulatorio (sustancias alimenticias, oxígeno y dióxido de carbono), identificando sus estructuras básicas (corazón, vasos sanguíneos y sangre).",
    claves: ["sistema circulatorio", "corazón", "sangre", "transporte"],
  },
  {
    codigo: "OA05_CN_5",
    nivel: "5to_basico",
    eje: "ciencias_vida",
    n: 5,
    texto:
      "Analizar el consumo de alimento diario (variedad, tamaño y frecuencia de porciones) reconociendo los alimentos para el crecimiento, la reparación, el desarrollo y el movimiento del cuerpo.",
    claves: ["alimentación", "nutrición", "salud", "dieta"],
  },
  {
    codigo: "OA06_CN_5",
    nivel: "5to_basico",
    eje: "ciencias_vida",
    n: 6,
    texto:
      "Investigar en diversas fuentes y comunicar los efectos nocivos que produce el cigarrillo (humo del tabaco) en los sistemas respiratorio y circulatorio.",
    claves: ["tabaco", "cigarrillo", "salud", "prevención"],
  },
  {
    codigo: "OA07_CN_5",
    nivel: "5to_basico",
    eje: "ciencias_vida",
    n: 7,
    texto:
      "Investigar e identificar algunos microorganismos beneficiosos y dañinos para la salud (bacterias, virus y hongos), y proponer medidas de cuidado e higiene del cuerpo.",
    claves: ["microorganismos", "bacterias", "virus", "hongos", "higiene", "salud"],
  },
  {
    codigo: "OA08_CN_5",
    nivel: "5to_basico",
    eje: "ciencias_fisicas",
    n: 8,
    texto:
      "Reconocer los cambios que experimenta la energía eléctrica al pasar de una forma a otra e investigar los principales aportes de científicos en su estudio a lo largo del tiempo.",
    claves: ["energía eléctrica", "transformación", "electricidad"],
  },
  {
    codigo: "OA09_CN_5",
    nivel: "5to_basico",
    eje: "ciencias_fisicas",
    n: 9,
    texto:
      "Construir un circuito eléctrico simple (cable, ampolleta, interruptor y pila), usarlo para resolver problemas cotidianos y explicar su funcionamiento.",
    claves: ["circuito eléctrico", "electricidad", "tecnología"],
  },
  {
    codigo: "OA10_CN_5",
    nivel: "5to_basico",
    eje: "ciencias_fisicas",
    n: 10,
    texto:
      "Observar y distinguir, por medio de la investigación experimental, los materiales conductores y aisladores de electricidad, relacionándolos con la manipulación segura de artefactos tecnológicos.",
    claves: ["conductores", "aisladores", "electricidad", "seguridad", "materiales"],
  },
  {
    codigo: "OA11_CN_5",
    nivel: "5to_basico",
    eje: "ciencias_fisicas",
    n: 11,
    texto:
      "Explicar la importancia de la energía eléctrica en la vida cotidiana y proponer medidas para promover su ahorro y uso responsable.",
    claves: ["energía", "ahorro", "sustentabilidad", "electricidad"],
  },
  {
    codigo: "OA12_CN_5",
    nivel: "5to_basico",
    eje: "ciencias_tierra",
    n: 12,
    texto:
      "Describir la distribución del agua dulce y salada en la Tierra, considerando océanos, glaciares, ríos y lagos, aguas subterráneas, nubes, vapor de agua, etc. y comparar sus volúmenes.",
    claves: ["agua", "océanos", "glaciares", "ríos", "lagos", "hidrología"],
  },
  {
    codigo: "OA13_CN_5",
    nivel: "5to_basico",
    eje: "ciencias_tierra",
    n: 13,
    texto:
      "Analizar y describir las características de los océanos y lagos: variación de temperatura, luminosidad y presión en relación con la profundidad; diversidad de flora y fauna; movimiento de las aguas.",
    claves: ["océanos", "lagos", "temperatura", "biodiversidad", "corrientes", "ecosistemas acuáticos"],
  },
  {
    codigo: "OA14_CN_5",
    nivel: "5to_basico",
    eje: "ciencias_tierra",
    n: 14,
    texto:
      "Investigar y explicar efectos positivos y negativos de la actividad humana en los océanos, lagos, ríos, glaciares, entre otros, proponiendo acciones de protección de las reservas hídricas en Chile.",
    claves: ["contaminación", "agua", "conservación", "actividad humana", "protección", "Chile"],
  },
  {
    codigo: "OA01_CN_6",
    nivel: "6to_basico",
    eje: "ciencias_vida",
    n: 1,
    texto:
      "Explicar, a partir de una investigación experimental, los requerimientos de agua, dióxido de carbono y energía lumínica para la producción de azúcar y liberación de oxígeno en la fotosíntesis.",
    claves: ["fotosíntesis", "plantas", "energía", "oxígeno", "CO2", "ecología"],
  },
  {
    codigo: "OA02_CN_6",
    nivel: "6to_basico",
    eje: "ciencias_vida",
    n: 2,
    texto:
      "Representar, por medio de modelos, la transferencia de energía y materia desde los organismos fotosintéticos a otros seres vivos por medio de cadenas y redes alimentarias.",
    claves: ["cadenas alimentarias", "redes alimentarias", "energía", "ecosistema", "ecología"],
  },
  {
    codigo: "OA03_CN_6",
    nivel: "6to_basico",
    eje: "ciencias_vida",
    n: 3,
    texto:
      "Analizar los efectos de la actividad humana sobre las redes alimentarias.",
    claves: ["actividad humana", "redes alimentarias", "impacto ambiental", "ecología", "conservación"],
  },
  {
    codigo: "OA04_CN_6",
    nivel: "6to_basico",
    eje: "ciencias_vida",
    n: 4,
    texto:
      "Identificar y describir las funciones de las principales estructuras del sistema reproductor humano femenino y masculino.",
    claves: ["sistema reproductor", "pubertad", "sexualidad"],
  },
  {
    codigo: "OA05_CN_6",
    nivel: "6to_basico",
    eje: "ciencias_vida",
    n: 5,
    texto:
      "Describir y comparar los cambios que se producen en la pubertad en mujeres y hombres.",
    claves: ["pubertad", "cambios físicos", "desarrollo"],
  },
  {
    codigo: "OA06_CN_6",
    nivel: "6to_basico",
    eje: "ciencias_vida",
    n: 6,
    texto:
      "Reconocer los beneficios de realizar actividad física en forma regular y de cuidar la higiene corporal en el período de la pubertad.",
    claves: ["actividad física", "higiene", "salud", "pubertad"],
  },
  {
    codigo: "OA07_CN_6",
    nivel: "6to_basico",
    eje: "ciencias_vida",
    n: 7,
    texto:
      "Investigar y comunicar los efectos nocivos de algunas drogas para la salud, proponiendo conductas de protección.",
    claves: ["drogas", "prevención", "salud"],
  },
  {
    codigo: "OA08_CN_6",
    nivel: "6to_basico",
    eje: "ciencias_fisicas",
    n: 8,
    texto:
      "Explicar que la energía es necesaria para que los objetos cambien y los seres vivos realicen sus procesos vitales.",
    claves: ["energía", "cambio", "procesos vitales"],
  },
  {
    codigo: "OA09_CN_6",
    nivel: "6to_basico",
    eje: "ciencias_fisicas",
    n: 9,
    texto:
      "Investigar en forma experimental la transformación de la energía de una forma a otra.",
    claves: ["transformación energía", "experimentación", "física"],
  },
  {
    codigo: "OA10_CN_6",
    nivel: "6to_basico",
    eje: "ciencias_fisicas",
    n: 10,
    texto:
      "Demostrar, por medio de la investigación experimental, que el calor fluye de un objeto caliente a uno frío hasta que ambos alcanzan la misma temperatura.",
    claves: ["calor", "temperatura", "transferencia", "equilibrio térmico"],
  },
  {
    codigo: "OA11_CN_6",
    nivel: "6to_basico",
    eje: "ciencias_fisicas",
    n: 11,
    texto:
      "Clasificar los recursos naturales energéticos en no renovables y renovables y proponer medidas para el uso responsable.",
    claves: ["recursos naturales", "energía renovable", "sustentabilidad", "medio ambiente"],
  },
  {
    codigo: "OA12_CN_6",
    nivel: "6to_basico",
    eje: "ciencias_fisicas",
    n: 12,
    texto:
      "Explicar, a partir de modelos, que la materia está formada por partículas en movimiento en sus estados sólido, líquido y gaseoso.",
    claves: ["materia", "partículas", "estados", "sólido", "líquido", "gaseoso"],
  },
  {
    codigo: "OA13_CN_6",
    nivel: "6to_basico",
    eje: "ciencias_fisicas",
    n: 13,
    texto:
      "Demostrar, mediante la investigación experimental, los cambios de estado de la materia.",
    claves: ["cambios estado", "materia", "experimentación"],
  },
  {
    codigo: "OA14_CN_6",
    nivel: "6to_basico",
    eje: "ciencias_fisicas",
    n: 14,
    texto:
      "Diferenciar entre calor y temperatura, considerando que el calor es una forma de energía.",
    claves: ["calor", "temperatura", "energía"],
  },
  {
    codigo: "OA15_CN_6",
    nivel: "6to_basico",
    eje: "ciencias_fisicas",
    n: 15,
    texto:
      "Medir e interpretar la información obtenida al calentar y enfriar el agua.",
    claves: ["medición", "agua", "temperatura", "datos"],
  },
  {
    codigo: "OA16_CN_6",
    nivel: "6to_basico",
    eje: "ciencias_tierra",
    n: 16,
    texto:
      "Describir las características de las capas de la Tierra (atmósfera, litósfera e hidrósfera) que posibilitan el desarrollo de la vida.",
    claves: ["capas Tierra", "atmósfera", "litósfera", "hidrósfera", "geología"],
  },
  {
    codigo: "OA17_CN_6",
    nivel: "6to_basico",
    eje: "ciencias_tierra",
    n: 17,
    texto:
      "Investigar experimentalmente la formación del suelo, sus propiedades y la importancia de protegerlo de la contaminación.",
    claves: ["suelo", "formación", "contaminación", "protección", "geología"],
  },
  {
    codigo: "OA18_CN_6",
    nivel: "6to_basico",
    eje: "ciencias_tierra",
    n: 18,
    texto:
      "Explicar las consecuencias de la erosión sobre la superficie de la Tierra, identificando los agentes que la provocan.",
    claves: ["erosión", "superficie", "agentes", "geología", "cambio climático"],
  },
  {
    codigo: "OA01_CN_7",
    nivel: "7mo_basico",
    eje: "biologia",
    n: 1,
    texto:
      "Explicar los aspectos biológicos, afectivos y sociales que se integran en la sexualidad, considerando los cambios físicos durante la pubertad, la relación afectiva y el respeto mutuo.",
    claves: ["sexualidad", "pubertad", "afectividad"],
  },
  {
    codigo: "OA02_CN_7",
    nivel: "7mo_basico",
    eje: "biologia",
    n: 2,
    texto:
      "Explicar la formación de un nuevo individuo, considerando el ciclo menstrual, la participación de espermatozoides y ovocitos, métodos de control de natalidad, y la paternidad responsable.",
    claves: ["reproducción", "ciclo menstrual", "natalidad"],
  },
  {
    codigo: "OA03_CN_7",
    nivel: "7mo_basico",
    eje: "biologia",
    n: 3,
    texto:
      "Describir, por medio de la investigación, las características de infecciones de transmisión sexual (ITS), considerando mecanismos de transmisión, prevención, síntomas y consecuencias.",
    claves: ["ITS", "prevención", "salud sexual"],
  },
  {
    codigo: "OA04_CN_7",
    nivel: "7mo_basico",
    eje: "biologia",
    n: 4,
    texto:
      "Desarrollar modelos que expliquen las barreras defensivas del cuerpo humano, considerando agentes patógenos, vacunas, alergias y enfermedades autoinmunes.",
    claves: ["sistema inmune", "vacunas", "patógenos", "defensas", "salud"],
  },
  {
    codigo: "OA05_CN_7",
    nivel: "7mo_basico",
    eje: "biologia",
    n: 5,
    texto:
      "Comparar, usando modelos, microorganismos como virus, bacterias y hongos, en relación con características estructurales, características de seres vivos y efectos sobre la salud.",
    claves: ["microorganismos", "virus", "bacterias", "hongos", "salud"],
  },
  {
    codigo: "OA06_CN_7",
    nivel: "7mo_basico",
    eje: "biologia",
    n: 6,
    texto:
      "Investigar y explicar el rol de microorganismos (bacterias y hongos) en la biotecnología: descontaminación ambiental, producción de alimentos y fármacos, obtención de cobre, generación de metano.",
    claves: ["biotecnología", "microorganismos", "descontaminación", "cobre", "fermentación"],
  },
  {
    codigo: "OA07_CN_7",
    nivel: "7mo_basico",
    eje: "fisica",
    n: 7,
    texto:
      "Planificar y conducir una investigación experimental para proveer evidencias que expliquen los efectos de las fuerzas gravitacional, de roce y elástica en situaciones cotidianas.",
    claves: ["fuerzas", "gravedad", "roce", "elasticidad", "experimentación"],
  },
  {
    codigo: "OA08_CN_7",
    nivel: "7mo_basico",
    eje: "fisica",
    n: 8,
    texto:
      "Explorar y describir cualitativamente la presión, considerando sus efectos en sólidos, líquidos y gases.",
    claves: ["presión", "sólidos", "líquidos", "gases", "hidráulica"],
  },
  {
    codigo: "OA09_CN_7",
    nivel: "7mo_basico",
    eje: "fisica",
    n: 9,
    texto:
      "Explicar, con el modelo de la tectónica de placas, los patrones de distribución de la actividad geológica (volcanes y sismos), los tipos de interacción entre placas y la deriva continental.",
    claves: ["tectónica", "placas", "volcanes", "sismos", "geología", "vulcanología"],
  },
  {
    codigo: "OA10_CN_7",
    nivel: "7mo_basico",
    eje: "fisica",
    n: 10,
    texto:
      "Explicar, sobre la base de evidencias y por medio de modelos, la actividad volcánica y sus consecuencias en la naturaleza y la sociedad.",
    claves: ["volcanes", "vulcanología", "erupciones", "riesgos naturales", "geología"],
  },
  {
    codigo: "OA11_CN_7",
    nivel: "7mo_basico",
    eje: "fisica",
    n: 11,
    texto:
      "Crear modelos que expliquen el ciclo de las rocas, la formación y modificación de las rocas ígneas, metamórficas y sedimentarias, en función de la temperatura, la presión y la erosión.",
    claves: ["rocas", "ciclo rocas", "ígneas", "metamórficas", "sedimentarias", "geología"],
  },
  {
    codigo: "OA12_CN_7",
    nivel: "7mo_basico",
    eje: "fisica",
    n: 12,
    texto:
      "Demostrar, por medio de modelos, que el clima en la Tierra es dinámico y se produce por la interacción de múltiples variables: presión, temperatura, humedad, circulación atmosférica y del agua.",
    claves: ["clima", "atmósfera", "temperatura", "humedad", "cambio climático", "meteorología"],
  },
  {
    codigo: "OA13_CN_7",
    nivel: "7mo_basico",
    eje: "quimica",
    n: 13,
    texto:
      "Investigar experimentalmente y explicar el comportamiento de gases ideales en situaciones cotidianas, considerando factores como presión, volumen y temperatura, las leyes que los modelan y la teoría cinético-molecular.",
    claves: ["gases", "presión", "volumen", "temperatura", "cinético-molecular"],
  },
  {
    codigo: "OA14_CN_7",
    nivel: "7mo_basico",
    eje: "quimica",
    n: 14,
    texto:
      "Investigar experimentalmente y explicar la clasificación de la materia en sustancias puras y mezclas (homogéneas y heterogéneas), los procedimientos de separación de mezclas, considerando su aplicación industrial.",
    claves: ["materia", "mezclas", "sustancias puras", "separación", "industria", "minería"],
  },
  {
    codigo: "OA15_CN_7",
    nivel: "7mo_basico",
    eje: "quimica",
    n: 15,
    texto:
      "Investigar experimentalmente los cambios de la materia y argumentar con evidencia empírica que estos pueden ser físicos o químicos.",
    claves: ["cambios materia", "físicos", "químicos", "experimentación"],
  },
  {
    codigo: "OA01_CN_8",
    nivel: "8vo_basico",
    eje: "biologia",
    n: 1,
    texto:
      "Explicar que los modelos de la célula han evolucionado sobre la base de evidencias, y crear modelos para explicar la relación entre la función y las estructuras celulares.",
    claves: ["célula", "modelos", "estructuras celulares", "evolución conocimiento"],
  },
  {
    codigo: "OA02_CN_8",
    nivel: "8vo_basico",
    eje: "biologia",
    n: 2,
    texto:
      "Desarrollar modelos que expliquen la relación entre la función de una célula y sus partes (núcleo, citoplasma, membrana, organelos), distinguiendo células eucariotas y procariotas.",
    claves: ["célula", "núcleo", "membrana", "organelos", "eucariota", "procariota"],
  },
  {
    codigo: "OA03_CN_8",
    nivel: "8vo_basico",
    eje: "biologia",
    n: 3,
    texto:
      "Explicar, por medio de la experimentación, los mecanismos de intercambio de partículas entre la célula y su ambiente por difusión y osmosis.",
    claves: ["difusión", "osmosis", "célula", "membrana", "experimentación"],
  },
  {
    codigo: "OA04_CN_8",
    nivel: "8vo_basico",
    eje: "biologia",
    n: 4,
    texto:
      "Crear modelos que expliquen que las plantas tienen estructuras especializadas para responder a estímulos del medioambiente.",
    claves: ["plantas", "estímulos", "tropismos", "adaptación", "medio ambiente"],
  },
  {
    codigo: "OA05_CN_8",
    nivel: "8vo_basico",
    eje: "biologia",
    n: 5,
    texto:
      "Explicar, basándose en evidencias, la interacción de sistemas del cuerpo humano, organizados por estructuras especializadas que contribuyen a las funciones de nutrición.",
    claves: ["sistemas", "cuerpo humano", "nutrición", "digestión", "circulación"],
  },
  {
    codigo: "OA06_CN_8",
    nivel: "8vo_basico",
    eje: "biologia",
    n: 6,
    texto:
      "Investigar experimentalmente y explicar las características de los nutrientes (carbohidratos, proteínas, grasas) en los alimentos y sus efectos para la salud humana.",
    claves: ["nutrientes", "carbohidratos", "proteínas", "grasas", "alimentación", "salud"],
  },
  {
    codigo: "OA07_CN_8",
    nivel: "8vo_basico",
    eje: "biologia",
    n: 7,
    texto:
      "Analizar y evaluar los factores que contribuyen a mantener un cuerpo saludable, proponiendo un plan que integre alimentación balanceada, ejercicio y evitar sustancias nocivas.",
    claves: ["salud", "alimentación", "ejercicio", "bienestar", "prevención"],
  },
  {
    codigo: "OA08_CN_8",
    nivel: "8vo_basico",
    eje: "fisica",
    n: 8,
    texto:
      "Analizar las fuerzas eléctricas, considerando los tipos de electricidad, los métodos de electrización y la planificación de investigaciones experimentales.",
    claves: ["electricidad", "fuerzas eléctricas", "electrización", "cargas"],
  },
  {
    codigo: "OA09_CN_8",
    nivel: "8vo_basico",
    eje: "fisica",
    n: 9,
    texto:
      "Investigar las formas de producir electricidad, comparando las ventajas y desventajas de distintas fuentes: pilas, paneles fotovoltaicos y generadores.",
    claves: ["generación eléctrica", "pilas", "paneles solares", "energía renovable"],
  },
  {
    codigo: "OA10_CN_8",
    nivel: "8vo_basico",
    eje: "fisica",
    n: 10,
    texto:
      "Analizar un circuito eléctrico domiciliario y comparar los circuitos en serie y en paralelo en relación con la intensidad de corriente y el voltaje.",
    claves: ["circuitos", "serie", "paralelo", "corriente", "voltaje"],
  },
  {
    codigo: "OA11_CN_8",
    nivel: "8vo_basico",
    eje: "fisica",
    n: 11,
    texto:
      "Desarrollar modelos que expliquen que el calor es una forma de transferencia de energía térmica entre dos cuerpos que están a diferentes temperaturas.",
    claves: ["calor", "energía térmica", "transferencia", "temperatura"],
  },
  {
    codigo: "OA12_CN_8",
    nivel: "8vo_basico",
    eje: "quimica",
    n: 12,
    texto:
      "Investigar y analizar cómo ha evolucionado el conocimiento de la constitución de la materia, considerando los modelos atómicos de Dalton, Thomson, Rutherford y Bohr.",
    claves: ["átomo", "modelos atómicos", "Dalton", "Thomson", "Rutherford", "Bohr"],
  },
  {
    codigo: "OA13_CN_8",
    nivel: "8vo_basico",
    eje: "quimica",
    n: 13,
    texto:
      "Desarrollar modelos que expliquen la constitución atómica de la materia, incluyendo protones, neutrones y electrones.",
    claves: ["átomo", "protones", "neutrones", "electrones", "materia"],
  },
  {
    codigo: "OA14_CN_8",
    nivel: "8vo_basico",
    eje: "quimica",
    n: 14,
    texto:
      "Usar la tabla periódica como un modelo para predecir las propiedades relativas de los elementos químicos.",
    claves: ["tabla periódica", "elementos", "propiedades químicas"],
  },
  {
    codigo: "OA15_CN_8",
    nivel: "8vo_basico",
    eje: "quimica",
    n: 15,
    texto:
      "Investigar y explicar que existen algunos elementos químicos frecuentes en la Tierra que son esenciales para la vida (C, H, O, N).",
    claves: ["elementos", "carbono", "hidrógeno", "oxígeno", "nitrógeno", "vida"],
  },
];

/** Índice por código, para no recorrer la lista en cada búsqueda. */
const PORCODIGO = new Map(OBJETIVOS.map((o) => [o.codigo, o]));

export function buscarOA(codigo: string): OA | undefined {
  return PORCODIGO.get(codigo);
}

/** Los de un curso, en el orden en que vienen en el programa. */
export function objetivosDe(nivel: NivelOA): OA[] {
  return OBJETIVOS.filter((o) => o.nivel === nivel).sort((a, b) => a.n - b.n);
}

/**
 * Filtra por lo que el docente escribió en la caja de búsqueda.
 *
 * Busca en el código, en el texto y en las palabras clave, sin tildes y sin
 * mayúsculas: quien escribe «celulas» con prisa tiene que encontrar «células».
 */
export function filtrarOA(lista: OA[], consulta: string): OA[] {
  const q = normalizar(consulta.trim());
  if (!q) return lista;
  const partes = q.split(/\s+/);
  return lista.filter((o) => {
    const heno = normalizar(`${o.codigo} ${o.n} ${o.texto} ${o.claves.join(" ")}`);
    return partes.every((p) => heno.includes(p));
  });
}

function normalizar(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}
