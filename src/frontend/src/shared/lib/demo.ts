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
export const SECUENCIA_DEMO: RespuestaSecuencia = {
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
      modelo: "claude-sonnet-5 (demostración)",
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
