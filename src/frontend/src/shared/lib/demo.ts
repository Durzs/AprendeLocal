/**
 * Modo de demostración.
 *
 * Para ver `/preparar` funcionando hace falta la API de Railway con claves de
 * Supabase y Anthropic. Eso es demasiada fricción sólo para mirar cómo va
 * quedando la interfaz, así que en desarrollo se sirven datos de ejemplo.
 *
 * Dos reglas deliberadas:
 *
 * 1. Se activa solo con `npm run dev`, o poniendo VITE_DEMO=1 a propósito.
 *    En un build de producción normal está apagado.
 * 2. Nunca es un respaldo silencioso ante un fallo de la API. Si el modo está
 *    apagado y la API falla, se muestra el error: enmascararlo escondería
 *    justo los problemas que hay que ver.
 *
 * La pantalla avisa en todo momento de que los datos son de ejemplo.
 */

import type { CurriculumObjective, POIFeature, RespuestaSecuencia } from "../../types";
import type { Course } from "../../modules/courses/types";

export function modoDemo(): boolean {
  // Siempre en desarrollo, y en cualquier build si se compiló con VITE_DEMO=1.
  if (import.meta.env.DEV) return true;
  if (import.meta.env.VITE_DEMO === "1") return true;

  // Y a petición explícita en la URL: `?demo=1`. Existe para poder revisar la
  // interfaz en el sitio desplegado sin terminal, sin claves y sin backend.
  // Es opt-in —nadie llega aquí por accidente— y la pantalla avisa con un
  // rótulo permanente de que los datos son de ejemplo.
  if (typeof window !== "undefined") {
    return new URLSearchParams(window.location.search).has("demo");
  }

  return false;
}

export const OBJETIVOS_DEMO: CurriculumObjective[] = [
  {
    id: "demo-oa-1",
    code: "OA12_CN_5",
    subject: "ciencias_naturales",
    level: "5to_basico",
    axis: "ciencias_tierra",
    oa_number: 12,
    description:
      "Describir la distribución del agua dulce y salada en la Tierra, considerando océanos, glaciares, ríos y lagos, aguas subterráneas, nubes, vapor de agua, etc. y comparar sus volúmenes.",
    keywords: ["agua", "océanos", "glaciares", "ríos", "lagos", "hidrología"],
    project_count: 0,
  },
  {
    id: "demo-oa-2",
    code: "OA10_CN_7",
    subject: "ciencias_naturales",
    level: "7mo_basico",
    axis: "fisica",
    oa_number: 10,
    description:
      "Explicar, sobre la base de evidencias y por medio de modelos, la actividad volcánica y sus consecuencias en la naturaleza y la sociedad.",
    keywords: ["volcanes", "vulcanología", "erupciones", "riesgos naturales", "geología"],
    project_count: 0,
  },
  {
    id: "demo-oa-3",
    code: "OA03_CN_6",
    subject: "ciencias_naturales",
    level: "6to_basico",
    axis: "ciencias_vida",
    oa_number: 3,
    description: "Analizar los efectos de la actividad humana sobre las redes alimentarias.",
    keywords: [
      "actividad humana",
      "redes alimentarias",
      "impacto ambiental",
      "ecología",
      "conservación",
    ],
    project_count: 0,
  },
  {
    // A propósito: es el caso que enseña que la plataforma sabe decir que no.
    // Ningún lugar del catálogo aporta a esto, y la pantalla lo dice en vez de
    // ofrecer una cancha de palín para enseñar el aparato digestivo.
    id: "demo-oa-4",
    code: "OA02_CN_5",
    subject: "ciencias_naturales",
    level: "5to_basico",
    axis: "ciencias_vida",
    oa_number: 2,
    description:
      "Identificar y describir por medio de modelos las estructuras básicas del sistema digestivo y sus funciones en la digestión, la absorción de alimentos y la eliminación de desechos.",
    keywords: ["sistema digestivo", "digestión", "absorción", "alimentos", "nutrición"],
    project_count: 0,
  },
];

/**
 * Lugares de ejemplo. Son los datos reales de Cunco —con su ecosistema, sus
 * amenazas y sus áreas STEM— porque sin esos campos la afinidad no tiene de qué
 * agarrarse y la pantalla se revisaría en falso.
 */
function lugarDemo(
  id: string,
  name: string,
  commune: string,
  type: string,
  ecosystem: string,
  stem_areas: string[],
  threats: string[],
  description: string
): POIFeature {
  return {
    type: "Feature",
    geometry: { type: "Point", coordinates: [-72.0, -38.9] },
    properties: { id, name, commune, type, ecosystem, stem_areas, threats, description },
  } as unknown as POIFeature;
}

export const PUNTOS_DEMO: POIFeature[] = [
  lugarDemo("demo-poi-1", "Estero Mahuidanche", "Cunco", "hydrological", "fluvial",
    ["biologia", "quimica", "ecologia"], ["contaminacion_agricola"],
    "Estero de aguas limpias que baja de la cordillera. Presencia de fauna bentónica indicadora de calidad."),
  lugarDemo("demo-poi-2", "Lago Colico", "Cunco", "hydrological", "lacustre",
    ["biologia", "ecologia", "geologia"], ["eutrofizacion", "turismo_no_regulado"],
    "Lago precordillerano rodeado de bosque nativo. Importante para la comunidad mapuche local."),
  lugarDemo("demo-poi-3", "Bosque de Coigüe Mahuidanche", "Cunco", "natural", "bosque_nativo",
    ["biologia", "ecologia"], ["tala", "plantaciones_forestales"],
    "Bosque adulto de coigüe con sotobosque de helechos y nalcas. Presencia de monito del monte."),
  lugarDemo("demo-poi-4", "Suelo Volcánico Los Laureles", "Cunco", "geological", "volcanico",
    ["geologia", "quimica", "biologia"], ["erosion"],
    "Perfil de suelo trumaos (ceniza volcánica) visible en corte de camino. Ideal para estudiar edafología."),
  lugarDemo("demo-poi-5", "Volcán Villarrica (Rukapillán)", "Curarrehue", "geological", "zona_volcanica",
    ["geologia", "vulcanologia", "fisica", "cultura_mapuche"], ["erupciones", "deshielo_glaciar"],
    "Uno de los volcanes más activos de Sudamérica. Nombre mapuche: Rukapillán (casa del espíritu)."),
  lugarDemo("demo-poi-6", "Cancha de Palín Los Laureles", "Cunco", "cultural", "cultural_mapuche",
    ["historia", "matematica", "fisica"], ["perdida_tradiciones", "cambio_uso_suelo"],
    "Campo tradicional donde se juega palín (chueca mapuche). Espacio de encuentro comunitario."),
];

/**
 * Secuencia de ejemplo. Trae a propósito un problema de validación —un campo
 * numérico sin unidad— para que se vea cómo la pantalla avisa en lugar de
 * ocultarlo.
 */
const SECUENCIA_DEMO_ES: RespuestaSecuencia = {
  secuencia: {
    titulo: "El caudal del estero Trancura y el consumo de la escuela",
    objetivo_codigo: "OA12_CN_5",
    objetivo_descripcion:
      "Explicar el ciclo del agua y su relación con la disponibilidad hídrica local",
    sesiones: 4,
    sintesis_docente:
      "Los estudiantes calculan el caudal del estero que cruzan a diario y lo comparan con lo que consume la escuela en una semana.",
    instruccion_explicita: {
      duracion_min: 20,
      notas_para_el_docente: [
        "Definir caudal como el volumen de agua que pasa por un punto en un tiempo dado",
        "Mostrar en la pizarra la relación entre sección del cauce y velocidad del agua",
        "Aclarar por qué se promedian varias mediciones en vez de fiarse de una",
      ],
      conceptos_clave: ["caudal", "sección", "velocidad", "promedio"],
      errores_frecuentes: [
        "confundir caudal con profundidad",
        "creer que un río más ancho siempre lleva más agua",
      ],
    },
    ejemplo_resuelto: {
      situacion: "El estero Trancura a la altura del puente de Curarrehue",
      pasos: [
        {
          paso: 1,
          accion: "Medir el ancho del cauce en tres puntos separados 10 m",
          razonamiento:
            "El cauce no es parejo; promediar evita que una medición atípica sesgue el resultado",
          resultado: "2,1 m · 2,6 m · 2,5 m → 2,4 m de ancho medio",
        },
        {
          paso: 2,
          accion: "Medir la profundidad media y calcular la sección",
          razonamiento:
            "La sección es el área por la que pasa el agua: ancho por profundidad",
          resultado: "2,4 m × 0,35 m = 0,84 m²",
        },
        {
          paso: 3,
          accion: "Cronometrar un flotador a lo largo de 5 m y multiplicar",
          razonamiento:
            "El caudal es el volumen por unidad de tiempo, y sale de multiplicar la sección por la velocidad",
          resultado: "0,84 m² × 0,35 m/s = 0,29 m³/s",
        },
      ],
      respuesta:
        "El caudal aproximado del estero es de 0,29 m³/s, es decir unos 290 litros por segundo",
    },
    practica_guiada: {
      instrucciones_docente:
        "Resolver el primero en la pizarra junto al curso, y dejar el segundo para parejas",
      ejercicios: [
        {
          enunciado:
            "Un cauce mide 3 m de ancho, 0,4 m de profundidad y el agua avanza a 0,15 m/s. ¿Cuál es su caudal?",
          apoyo: "Se entrega la fórmula escrita en la pizarra",
          respuesta_esperada: "0,18 m³/s",
        },
        {
          enunciado:
            "Si el ancho se duplica pero la velocidad cae a la mitad, ¿cambia el caudal?",
          apoyo: "Recordar que ambos factores se multiplican",
          respuesta_esperada: "No cambia: los factores se compensan",
        },
      ],
    },
    practica_autonoma: {
      ejercicios: [
        {
          enunciado:
            "Calcula el caudal del brazo norte del estero con los datos de la tabla",
          respuesta_esperada: "0,11 m³/s",
        },
      ],
    },
    salida_terreno: {
      duracion_min: 90,
      preparacion: ["huincha de 5 m", "cronómetro", "cuaderno", "botas"],
      protocolo: [
        {
          campo: "ancho_cauce_m",
          instruccion: "Mide el ancho en 3 puntos separados 10 m y anota los tres",
          unidad: "m",
          tipo: "numero",
        },
        {
          campo: "profundidad_media_m",
          instruccion: "Mide la profundidad en 5 puntos a lo ancho y promedia",
          unidad: "m",
          tipo: "numero",
        },
        {
          campo: "tiempo_flotador_s",
          instruccion: "Cronometra un flotador recorriendo 5 m, tres veces",
          tipo: "numero",
        },
        {
          campo: "observaciones",
          instruccion: "Anota si hay basura, erosión de orillas o cambios de color",
          tipo: "texto",
        },
      ],
      seguridad: [
        "No entrar al agua por sobre la rodilla",
        "Nadie se acerca solo a la orilla",
      ],
    },
    recuperacion_espaciada: [
      {
        semanas_despues: 1,
        pregunta:
          "Tu grupo midió {dato_del_estudiante} m de ancho medio. Con una profundidad de 0,3 m y velocidad 0,3 m/s, ¿qué caudal resulta?",
        respuesta_esperada: "Depende de su medición; se revisa el procedimiento",
      },
      {
        semanas_despues: 3,
        pregunta:
          "¿Por qué medimos el ancho en tres puntos y no en uno solo? Explica con lo que viste en el estero.",
        respuesta_esperada: "Porque el cauce es irregular y una sola medida sesga",
      },
      {
        semanas_despues: 6,
        pregunta:
          "Con el caudal que midieron, ¿alcanzaría el estero para abastecer a la escuela una semana?",
        respuesta_esperada: "Comparar el caudal con el consumo estimado del establecimiento",
      },
    ],
    materiales: ["huincha", "cronómetro", "cuaderno"],
    requiere_consulta: false,
    // Caso multigrado: la explicación y la salida son comunes, y cada curso
    // recibe su práctica y su medición. El de 7º toma el dato que el de 5º
    // necesita, para que los cursos se necesiten en vez de estorbarse.
    niveles: ["5to_basico", "6to_basico", "7mo_basico"],
    por_nivel: [
      {
        nivel: "5to_basico",
        objetivo_codigo: "OA12_CN_5",
        objetivo_descripcion:
          "Describir la distribución del agua dulce y salada en la Tierra.",
        practica_guiada: {
          ejercicios: [
            {
              enunciado:
                "Con el ancho y la profundidad que midió 7º, calcula cuánta agua pasa por el estero en un minuto.",
              apoyo: "Usa la tabla de la pizarra: ancho × profundidad × velocidad.",
              respuesta_esperada: "Alrededor de 300 litros por minuto.",
            },
          ],
        },
        practica_autonoma: {
          ejercicios: [
            {
              enunciado:
                "Dibuja de dónde viene y hacia dónde va el agua del estero Mahuidanche.",
            },
          ],
        },
        rol_en_terreno: "Marca con estacas el tramo de 10 metros y cronometra el flotador.",
      },
      {
        nivel: "6to_basico",
        objetivo_codigo: "OA03_CN_6",
        objetivo_descripcion:
          "Analizar los efectos de la actividad humana sobre las redes alimentarias.",
        practica_guiada: {
          ejercicios: [
            {
              enunciado:
                "Con los organismos que anotó el curso, arma la red alimentaria del estero.",
              apoyo: "Empieza por las algas y sigue hacia arriba.",
              respuesta_esperada: "Red de al menos tres niveles.",
            },
          ],
        },
        practica_autonoma: {
          ejercicios: [
            {
              enunciado:
                "¿Qué pasaría con esa red si el agua bajara a la mitad del caudal que midieron?",
            },
          ],
        },
        rol_en_terreno:
          "Registra los seres vivos bajo tres piedras del tramo, sin sacarlos del agua.",
      },
      {
        nivel: "7mo_basico",
        objetivo_codigo: "OA10_CN_7",
        objetivo_descripcion:
          "Explicar la actividad volcánica y sus consecuencias en la naturaleza y la sociedad.",
        practica_guiada: {
          ejercicios: [
            {
              enunciado:
                "Clasifica los sedimentos del lecho y explica de qué erupción vienen.",
              apoyo: "Compara con las fotos de ceniza y escoria de la guía.",
              respuesta_esperada: "Predominio de material volcánico reciente.",
            },
          ],
        },
        practica_autonoma: {
          ejercicios: [
            {
              enunciado:
                "Explica por qué el suelo de esta zona retiene poca agua, usando lo que observaste.",
            },
          ],
        },
        rol_en_terreno:
          "Mide ancho y profundidad del estero en tres puntos y entrega los datos a 5º.",
      },
    ],
    procedencia: {
      de_datos: {
        punto: "Estero Trancura",
        comuna: "Curarrehue",
        ecosistema: "bosque_templado_valdiviano",
        objetivo: "OA12_CN_5",
      },
      generado_por_modelo: [
        "instruccion_explicita",
        "ejemplo_resuelto",
        "practica_guiada",
        "practica_autonoma",
        "salida_terreno",
        "recuperacion_espaciada",
      ],
      modelo: "claude-sonnet-5 (demo)",
    },
  },
  resumen: {},
  // A propósito: enseña cómo la pantalla avisa de lo que hay que revisar.
  problemas: ["La medición «Tiempo flotador» no dice en qué unidad anotarla"],
  utilizable: false,
};

/** Simula la latencia de la generación real, que no es instantánea. */
export function esperar(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Cursos de ejemplo para la plataforma.
 *
 * Sin sesión iniciada, PlatformPage ni siquiera pide los cursos —corta antes,
 * en la comprobación de usuario—, así que en local el catálogo salía vacío y
 * no había forma de revisar su maquetación.
 */
export const CURSOS_DEMO: Course[] = [
  {
    id: "demo-c1",
    titulo: "Agua y territorio: cuencas del Elqui al Toltén",
    descricao: "Medir, comparar y explicar el caudal de un cauce cercano a la escuela.",
    categoria: "Ciencias Naturales",
    nivel: "8º básico",
    badge: "Hidrología",
    url_img: "",
  },
  {
    id: "demo-c2",
    titulo: "Bosque valdiviano: quién vive aquí",
    descricao: "Inventario de especies del entorno y las amenazas que las afectan.",
    categoria: "Ciencias Naturales",
    nivel: "7º básico",
    badge: "Biodiversidad",
    url_img: "",
  },
  {
    id: "demo-c3",
    titulo: "Cielos del sur: observación sin telescopio",
    descricao: "Registro sistemático del cielo nocturno con instrumentos caseros.",
    categoria: "Física",
    nivel: "1º medio",
    badge: "Astronomía",
    url_img: "",
  },
  {
    id: "demo-c4",
    titulo: "Energía en la escuela rural",
    descricao: "Auditoría del consumo del establecimiento y propuestas de mejora.",
    categoria: "Tecnología",
    nivel: "8º básico",
    badge: "Energía",
    url_img: "",
  },
  {
    id: "demo-c5",
    titulo: "Suelos y erosión en laderas",
    descricao: "Medición de pendiente y cobertura vegetal en terreno cercano.",
    categoria: "Ciencias Naturales",
    nivel: "2º medio",
    badge: "Geología",
    url_img: "",
  },
  {
    id: "demo-c6",
    titulo: "Patrimonio vivo: memoria del lugar",
    descricao: "Entrevistas a la comunidad y registro de saberes locales.",
    categoria: "Historia",
    nivel: "7º básico",
    badge: "Patrimonio",
    url_img: "",
  },
];

/**
 * La misma clase, escrita en inglés y en portugués.
 *
 * No es un capricho de escaparate: en producción la Edge Function ya redacta
 * la secuencia en el idioma de la interfaz, así que si la demostración fuera
 * la única que sale siempre en español enseñaría algo que el producto no hace.
 *
 * Lo que NO se traduce, y es deliberado:
 *
 * - Los objetivos de aprendizaje. Son el texto oficial del currículum chileno
 *   y en producción llegan de la base tal cual. Traducirlos aquí enseñaría una
 *   pantalla que no existe.
 * - Los nombres del territorio (Estero Trancura, Curarrehue). Son topónimos.
 * - Las claves del JSON y los nombres de campo del protocolo, que son el
 *   contrato con el resto de la aplicación.
 */
const SECUENCIA_DEMO_EN: RespuestaSecuencia = {
  secuencia: {
    ...SECUENCIA_DEMO_ES.secuencia,
    titulo: "The flow of the Trancura stream and the school's water use",
    sintesis_docente:
      "Students work out the flow of the stream they cross every day and compare it with what the school uses in a week.",
    instruccion_explicita: {
      duracion_min: 20,
      notas_para_el_docente: [
        "Define flow as the volume of water passing a point in a given time",
        "Show on the board how the cross section of the channel relates to the speed of the water",
        "Explain why several measurements are averaged instead of trusting a single one",
      ],
      conceptos_clave: ["flow", "cross section", "speed", "average"],
      errores_frecuentes: [
        "confusing flow with depth",
        "believing a wider river always carries more water",
      ],
    },
    ejemplo_resuelto: {
      situacion: "The Trancura stream at the Curarrehue bridge",
      pasos: [
        {
          paso: 1,
          accion: "Measure the width of the channel at three points 10 m apart",
          razonamiento:
            "The channel is not even; averaging keeps one odd measurement from skewing the result",
          resultado: "2.1 m · 2.6 m · 2.5 m → 2.4 m average width",
        },
        {
          paso: 2,
          accion: "Measure the average depth and work out the cross section",
          razonamiento:
            "The cross section is the area the water passes through: width times depth",
          resultado: "2.4 m × 0.35 m = 0.84 m²",
        },
        {
          paso: 3,
          accion: "Time a float over 5 m and multiply",
          razonamiento:
            "Flow is volume per unit of time, and it comes from multiplying the cross section by the speed",
          resultado: "0.84 m² × 0.35 m/s = 0.29 m³/s",
        },
      ],
      respuesta:
        "The approximate flow of the stream is 0.29 m³/s, that is around 290 litres per second",
    },
    practica_guiada: {
      instrucciones_docente:
        "Solve the first one on the board with the class, and leave the second for pairs",
      ejercicios: [
        {
          enunciado:
            "A channel is 3 m wide and 0.4 m deep, and the water moves at 0.15 m/s. What is its flow?",
          apoyo: "The formula is written on the board",
          respuesta_esperada: "0.18 m³/s",
        },
        {
          enunciado:
            "If the width doubles but the speed halves, does the flow change?",
          apoyo: "Remember that the two factors multiply",
          respuesta_esperada: "It does not change: the factors cancel out",
        },
      ],
    },
    practica_autonoma: {
      ejercicios: [
        {
          enunciado:
            "Work out the flow of the northern arm of the stream using the data in the table",
          respuesta_esperada: "0.11 m³/s",
        },
      ],
    },
    salida_terreno: {
      duracion_min: 90,
      preparacion: ["5 m tape measure", "stopwatch", "notebook", "boots"],
      protocolo: [
        {
          campo: "ancho_cauce_m",
          etiqueta: "Channel width",
          instruccion: "Measure the width at 3 points 10 m apart and write down all three",
          unidad: "m",
          tipo: "numero",
        },
        {
          campo: "profundidad_media_m",
          etiqueta: "Average depth",
          instruccion: "Measure the depth at 5 points across the channel and average them",
          unidad: "m",
          tipo: "numero",
        },
        {
          campo: "tiempo_flotador_s",
          etiqueta: "Float time",
          instruccion: "Time a float travelling 5 m, three times",
          tipo: "numero",
        },
        {
          campo: "observaciones",
          etiqueta: "Observations",
          instruccion: "Note any litter, bank erosion or changes in colour",
          tipo: "texto",
        },
      ],
      seguridad: [
        "Do not go into water above the knee",
        "Nobody approaches the bank alone",
      ],
    },
    recuperacion_espaciada: [
      {
        semanas_despues: 1,
        pregunta:
          "Your group measured {dato_del_estudiante} m of average width. With a depth of 0.3 m and a speed of 0.3 m/s, what flow do you get?",
        respuesta_esperada: "Depends on their measurement; review the procedure",
      },
      {
        semanas_despues: 3,
        pregunta:
          "Why did we measure the width at three points and not just one? Explain using what you saw at the stream.",
        respuesta_esperada: "Because the channel is irregular and a single measurement skews it",
      },
      {
        semanas_despues: 6,
        pregunta:
          "With the flow you measured, would the stream be enough to supply the school for a week?",
        respuesta_esperada: "Compare the flow with the school's estimated use",
      },
    ],
    materiales: ["tape measure", "stopwatch", "notebook"],
    por_nivel: [
      {
        ...SECUENCIA_DEMO_ES.secuencia.por_nivel![0],
        practica_guiada: {
          ejercicios: [
            {
              enunciado:
                "Using the width and depth grade 7 measured, work out how much water passes through the stream in one minute.",
              apoyo: "Use the table on the board: width × depth × speed.",
              respuesta_esperada: "Around 300 litres per minute.",
            },
          ],
        },
        practica_autonoma: {
          ejercicios: [
            {
              enunciado:
                "Draw where the water of the Mahuidanche stream comes from and where it goes.",
            },
          ],
        },
        rol_en_terreno: "Stake out the 10 metre stretch and time the float.",
      },
      {
        ...SECUENCIA_DEMO_ES.secuencia.por_nivel![1],
        practica_guiada: {
          ejercicios: [
            {
              enunciado:
                "Using the organisms the class recorded, build the food web of the stream.",
              apoyo: "Start with the algae and work upwards.",
              respuesta_esperada: "A web with at least three levels.",
            },
          ],
        },
        practica_autonoma: {
          ejercicios: [
            {
              enunciado:
                "What would happen to that web if the water dropped to half the flow you measured?",
            },
          ],
        },
        rol_en_terreno:
          "Record the living things under three stones of the stretch, without taking them out of the water.",
      },
      {
        ...SECUENCIA_DEMO_ES.secuencia.por_nivel![2],
        practica_guiada: {
          ejercicios: [
            {
              enunciado:
                "Classify the sediments of the streambed and explain which eruption they come from.",
              apoyo: "Compare with the ash and scoria photographs in the guide.",
              respuesta_esperada: "Mostly recent volcanic material.",
            },
          ],
        },
        practica_autonoma: {
          ejercicios: [
            {
              enunciado:
                "Explain why the soil in this area holds little water, using what you observed.",
            },
          ],
        },
        rol_en_terreno:
          "Measure the width and depth of the stream at three points and hand the data to grade 5.",
      },
    ],
  },
  resumen: {},
  problemas: [
    "The measurement “Float time” does not say which unit to record it in",
  ],
  utilizable: false,
};

const SECUENCIA_DEMO_PT: RespuestaSecuencia = {
  secuencia: {
    ...SECUENCIA_DEMO_ES.secuencia,
    titulo: "A vazão do córrego Trancura e o consumo da escola",
    sintesis_docente:
      "Os estudantes calculam a vazão do córrego que atravessam todo dia e comparam com o que a escola consome em uma semana.",
    instruccion_explicita: {
      duracion_min: 20,
      notas_para_el_docente: [
        "Definir vazão como o volume de água que passa por um ponto em um tempo dado",
        "Mostrar no quadro a relação entre a seção do leito e a velocidade da água",
        "Esclarecer por que se faz a média de várias medições em vez de confiar em uma só",
      ],
      conceptos_clave: ["vazão", "seção", "velocidade", "média"],
      errores_frecuentes: [
        "confundir vazão com profundidade",
        "achar que um rio mais largo sempre leva mais água",
      ],
    },
    ejemplo_resuelto: {
      situacion: "O córrego Trancura na altura da ponte de Curarrehue",
      pasos: [
        {
          paso: 1,
          accion: "Medir a largura do leito em três pontos separados por 10 m",
          razonamiento:
            "O leito não é uniforme; a média evita que uma medição atípica distorça o resultado",
          resultado: "2,1 m · 2,6 m · 2,5 m → 2,4 m de largura média",
        },
        {
          paso: 2,
          accion: "Medir a profundidade média e calcular a seção",
          razonamiento:
            "A seção é a área pela qual a água passa: largura vezes profundidade",
          resultado: "2,4 m × 0,35 m = 0,84 m²",
        },
        {
          paso: 3,
          accion: "Cronometrar um flutuador ao longo de 5 m e multiplicar",
          razonamiento:
            "A vazão é o volume por unidade de tempo, e sai de multiplicar a seção pela velocidade",
          resultado: "0,84 m² × 0,35 m/s = 0,29 m³/s",
        },
      ],
      respuesta:
        "A vazão aproximada do córrego é de 0,29 m³/s, ou seja, uns 290 litros por segundo",
    },
    practica_guiada: {
      instrucciones_docente:
        "Resolver o primeiro no quadro junto com a turma, e deixar o segundo para duplas",
      ejercicios: [
        {
          enunciado:
            "Um leito mede 3 m de largura, 0,4 m de profundidade e a água avança a 0,15 m/s. Qual é a sua vazão?",
          apoyo: "A fórmula fica escrita no quadro",
          respuesta_esperada: "0,18 m³/s",
        },
        {
          enunciado:
            "Se a largura dobra mas a velocidade cai pela metade, a vazão muda?",
          apoyo: "Lembre que os dois fatores se multiplicam",
          respuesta_esperada: "Não muda: os fatores se compensam",
        },
      ],
    },
    practica_autonoma: {
      ejercicios: [
        {
          enunciado:
            "Calcule a vazão do braço norte do córrego com os dados da tabela",
          respuesta_esperada: "0,11 m³/s",
        },
      ],
    },
    salida_terreno: {
      duracion_min: 90,
      preparacion: ["trena de 5 m", "cronômetro", "caderno", "botas"],
      protocolo: [
        {
          campo: "ancho_cauce_m",
          etiqueta: "Largura do leito",
          instruccion: "Meça a largura em 3 pontos separados por 10 m e anote os três",
          unidad: "m",
          tipo: "numero",
        },
        {
          campo: "profundidad_media_m",
          etiqueta: "Profundidade média",
          instruccion: "Meça a profundidade em 5 pontos ao longo da largura e faça a média",
          unidad: "m",
          tipo: "numero",
        },
        {
          campo: "tiempo_flotador_s",
          etiqueta: "Tempo do flutuador",
          instruccion: "Cronometre um flutuador percorrendo 5 m, três vezes",
          tipo: "numero",
        },
        {
          campo: "observaciones",
          etiqueta: "Observações",
          instruccion: "Anote se há lixo, erosão das margens ou mudanças de cor",
          tipo: "texto",
        },
      ],
      seguridad: [
        "Não entrar na água acima do joelho",
        "Ninguém se aproxima sozinho da margem",
      ],
    },
    recuperacion_espaciada: [
      {
        semanas_despues: 1,
        pregunta:
          "Seu grupo mediu {dato_del_estudiante} m de largura média. Com uma profundidade de 0,3 m e velocidade de 0,3 m/s, que vazão resulta?",
        respuesta_esperada: "Depende da medição deles; revisa-se o procedimento",
      },
      {
        semanas_despues: 3,
        pregunta:
          "Por que medimos a largura em três pontos e não em um só? Explique com o que você viu no córrego.",
        respuesta_esperada: "Porque o leito é irregular e uma única medida distorce",
      },
      {
        semanas_despues: 6,
        pregunta:
          "Com a vazão que vocês mediram, o córrego daria para abastecer a escola por uma semana?",
        respuesta_esperada: "Comparar a vazão com o consumo estimado da escola",
      },
    ],
    materiales: ["trena", "cronômetro", "caderno"],
    por_nivel: [
      {
        ...SECUENCIA_DEMO_ES.secuencia.por_nivel![0],
        practica_guiada: {
          ejercicios: [
            {
              enunciado:
                "Com a largura e a profundidade que o 7º mediu, calcule quanta água passa pelo córrego em um minuto.",
              apoyo: "Use a tabela do quadro: largura × profundidade × velocidade.",
              respuesta_esperada: "Cerca de 300 litros por minuto.",
            },
          ],
        },
        practica_autonoma: {
          ejercicios: [
            {
              enunciado:
                "Desenhe de onde vem e para onde vai a água do córrego Mahuidanche.",
            },
          ],
        },
        rol_en_terreno: "Marca com estacas o trecho de 10 metros e cronometra o flutuador.",
      },
      {
        ...SECUENCIA_DEMO_ES.secuencia.por_nivel![1],
        practica_guiada: {
          ejercicios: [
            {
              enunciado:
                "Com os organismos que a turma anotou, monte a rede alimentar do córrego.",
              apoyo: "Comece pelas algas e siga para cima.",
              respuesta_esperada: "Rede de pelo menos três níveis.",
            },
          ],
        },
        practica_autonoma: {
          ejercicios: [
            {
              enunciado:
                "O que aconteceria com essa rede se a água caísse para metade da vazão que mediram?",
            },
          ],
        },
        rol_en_terreno:
          "Registra os seres vivos sob três pedras do trecho, sem tirá-los da água.",
      },
      {
        ...SECUENCIA_DEMO_ES.secuencia.por_nivel![2],
        practica_guiada: {
          ejercicios: [
            {
              enunciado:
                "Classifique os sedimentos do leito e explique de que erupção vêm.",
              apoyo: "Compare com as fotos de cinza e escória do guia.",
              respuesta_esperada: "Predomínio de material vulcânico recente.",
            },
          ],
        },
        practica_autonoma: {
          ejercicios: [
            {
              enunciado:
                "Explique por que o solo desta região retém pouca água, usando o que você observou.",
            },
          ],
        },
        rol_en_terreno:
          "Mede largura e profundidade do córrego em três pontos e entrega os dados ao 5º.",
      },
    ],
  },
  resumen: {},
  problemas: [
    "A medição «Tempo do flutuador» não diz em que unidade anotar",
  ],
  utilizable: false,
};

/**
 * La secuencia de ejemplo en el idioma que se esté mirando.
 *
 * Cualquier idioma que no sea inglés o portugués cae en español, igual que
 * hace la Edge Function: una sola regla para los dos caminos.
 */
export function secuenciaDemo(idioma?: string): RespuestaSecuencia {
  const corto = (idioma ?? "es").slice(0, 2).toLowerCase();
  if (corto === "en") return SECUENCIA_DEMO_EN;
  if (corto === "pt") return SECUENCIA_DEMO_PT;
  return SECUENCIA_DEMO_ES;
}
