import type { OA } from "./oa";

/**
 * Los Objetivos de Aprendizaje de Artes Visuales, 5º a 8º básico.
 *
 * SON POCOS Y MUY ABIERTOS, Y ESO ES LO DIFÍCIL
 *
 * Una profesora de artes lo describió así en una entrevista: son objetivos
 * súper libres, casi nunca ligados a un contenido, y por eso ella los disecciona
 * a principio de año para sacar qué técnicas le piden y qué secuencia necesita
 * un curso para llegar ahí. Esa apertura es la razón por la que aquí se ofrecen
 * junto a la actividad concreta y no en una lista aparte: «crear trabajos
 * visuales» no le dice nada a nadie hasta que se sabe sobre qué.
 *
 * Y hay dos que caen justo donde termina este método. El de 8º pide crear a
 * partir de manifestaciones referidas a la relación entre personas, naturaleza
 * y medioambiente, que es el proyecto entero. Y el de difundir, en 7º y 8º,
 * pide apreciar y comparar espacios de difusión considerando montaje, público y
 * aporte a la comunidad: eso es exactamente montar la exposición en la plaza.
 *
 * El texto sale de las Bases Curriculares del MINEDUC, leídas de
 * curriculumnacional.cl. Ninguno se escribió de memoria.
 */
export const ARTES: OA[] = [
  /* ── 5º básico ─────────────────────────────────────────────── */
  {
    codigo: "OA01_AR_5",
    nivel: "5to_basico",
    asignatura: "artes",
    eje: "crear",
    n: 1,
    texto:
      "Crear trabajos de arte y diseños a partir de sus propias ideas y de la observación del entorno cultural (Chile, su paisaje y sus costumbres en el pasado y en el presente) y del entorno artístico.",
    claves: ["crear", "trabajos", "arte", "diseños", "partir"],
  },
  {
    codigo: "OA02_AR_5",
    nivel: "5to_basico",
    asignatura: "artes",
    eje: "crear",
    n: 2,
    texto:
      "Aplicar y combinar elementos del lenguaje visual en trabajos de arte y diseño con diferentes propósitos expresivos y creativos: color complementario, formas abiertas y cerradas, luz y sombra.",
    claves: ["aplicar", "combinar", "elementos", "lenguaje", "visual"],
  },
  {
    codigo: "OA03_AR_5",
    nivel: "5to_basico",
    asignatura: "artes",
    eje: "crear",
    n: 3,
    texto:
      "Crear trabajos de arte y diseños a partir de diferentes desafíos y temas del entorno cultural y artístico, demostrando dominio en el uso de materiales de modelado, de reciclaje, naturales, papeles, cartones, pinturas e imágenes digitales.",
    claves: ["crear", "trabajos", "arte", "diseños", "partir"],
  },
  {
    codigo: "OA04_AR_5",
    nivel: "5to_basico",
    asignatura: "artes",
    eje: "apreciar",
    n: 4,
    texto:
      "Analizar e interpretar obras de arte y diseño en relación con la aplicación del lenguaje visual, contextos, materiales y estilos.",
    claves: ["analizar", "interpretar", "obras", "arte", "diseño"],
  },
  {
    codigo: "OA05_AR_5",
    nivel: "5to_basico",
    asignatura: "artes",
    eje: "apreciar",
    n: 5,
    texto:
      "Describir y comparar trabajos de arte y diseño personales y de sus pares, considerando fortalezas y aspectos a mejorar, uso de materiales y procedimientos, y propósitos expresivos.",
    claves: ["describir", "comparar", "trabajos", "arte", "diseño"],
  },
  /* ── 6º básico ─────────────────────────────────────────────── */
  {
    codigo: "OA01_AR_6",
    nivel: "6to_basico",
    asignatura: "artes",
    eje: "crear",
    n: 1,
    texto:
      "Crear trabajos de arte y diseños a partir de sus propias ideas y de la observación del entorno cultural (el hombre contemporáneo y la ciudad) y del arte en el espacio público, como murales y esculturas.",
    claves: ["crear", "trabajos", "arte", "diseños", "partir"],
  },
  {
    codigo: "OA02_AR_6",
    nivel: "6to_basico",
    asignatura: "artes",
    eje: "crear",
    n: 2,
    texto:
      "Aplicar y combinar elementos del lenguaje visual en trabajos de arte y diseños con diferentes propósitos expresivos y creativos: color en gamas y contrastes, volumen lleno y vacío.",
    claves: ["aplicar", "combinar", "elementos", "lenguaje", "visual"],
  },
  {
    codigo: "OA03_AR_6",
    nivel: "6to_basico",
    asignatura: "artes",
    eje: "crear",
    n: 3,
    texto:
      "Crear trabajos de arte y diseños a partir de diferentes desafíos y temas del entorno cultural y artístico, demostrando dominio en procedimientos de pintura, grabado, escultura, instalación, técnicas mixtas, arte digital, fotografía, video y murales.",
    claves: ["crear", "trabajos", "arte", "diseños", "partir"],
  },
  {
    codigo: "OA04_AR_6",
    nivel: "6to_basico",
    asignatura: "artes",
    eje: "apreciar",
    n: 4,
    texto:
      "Analizar e interpretar obras de arte y objetos en relación con la aplicación del lenguaje visual, contextos, materiales y estilos.",
    claves: ["analizar", "interpretar", "obras", "arte", "objetos"],
  },
  {
    codigo: "OA05_AR_6",
    nivel: "6to_basico",
    asignatura: "artes",
    eje: "apreciar",
    n: 5,
    texto:
      "Evaluar críticamente trabajos de arte y diseños personales y de sus pares, considerando la expresión de emociones y problemáticas sociales, el uso de materiales y procedimientos y los propósitos expresivos.",
    claves: ["evaluar", "críticamente", "trabajos", "arte", "diseños"],
  },
  /* ── 7º básico ─────────────────────────────────────────────── */
  {
    codigo: "OA01_AR_7",
    nivel: "7mo_basico",
    asignatura: "artes",
    eje: "crear",
    n: 1,
    texto:
      "Crear trabajos visuales basados en las percepciones, sentimientos e ideas generadas a partir de la observación de manifestaciones estéticas referidas a diversidad cultural, género e íconos sociales, patrimoniales y contemporáneas.",
    claves: ["crear", "trabajos", "visuales", "basados", "percepciones"],
  },
  {
    codigo: "OA02_AR_7",
    nivel: "7mo_basico",
    asignatura: "artes",
    eje: "crear",
    n: 2,
    texto:
      "Crear trabajos visuales a partir de intereses personales, experimentando con materiales sustentables en dibujo, pintura y escultura.",
    claves: ["crear", "trabajos", "visuales", "partir", "intereses"],
  },
  {
    codigo: "OA03_AR_7",
    nivel: "7mo_basico",
    asignatura: "artes",
    eje: "crear",
    n: 3,
    texto:
      "Crear trabajos visuales a partir de la imaginación, experimentando con medios digitales de expresión contemporáneos como fotografía y edición de imágenes.",
    claves: ["crear", "trabajos", "visuales", "partir", "imaginación"],
  },
  {
    codigo: "OA04_AR_7",
    nivel: "7mo_basico",
    asignatura: "artes",
    eje: "apreciar",
    n: 4,
    texto:
      "Interpretar manifestaciones visuales patrimoniales y contemporáneas, atendiendo a criterios como características del medio de expresión, materialidad y lenguaje visual.",
    claves: ["interpretar", "manifestaciones", "visuales", "patrimoniales", "contemporáneas"],
  },
  {
    codigo: "OA05_AR_7",
    nivel: "7mo_basico",
    asignatura: "artes",
    eje: "apreciar",
    n: 5,
    texto:
      "Interpretar relaciones entre el propósito expresivo del trabajo artístico personal y de sus pares, y la utilización del lenguaje visual.",
    claves: ["interpretar", "relaciones", "propósito", "expresivo", "trabajo"],
  },
  {
    codigo: "OA06_AR_7",
    nivel: "7mo_basico",
    asignatura: "artes",
    eje: "difundir",
    n: 6,
    texto:
      "Caracterizar y apreciar espacios de difusión de las artes visuales contemplando medios de expresión presentes, espacio, montaje y público, entre otros.",
    claves: ["caracterizar", "apreciar", "espacios", "difusión", "artes"],
  },
  /* ── 8º básico ─────────────────────────────────────────────── */
  {
    codigo: "OA01_AR_8",
    nivel: "8vo_basico",
    asignatura: "artes",
    eje: "crear",
    n: 1,
    texto:
      "Crear trabajos visuales basados en la apreciación y el análisis de manifestaciones estéticas referidas a la relación entre personas, naturaleza y medioambiente, en diferentes contextos.",
    claves: ["crear", "trabajos", "visuales", "basados", "apreciación"],
  },
  {
    codigo: "OA02_AR_8",
    nivel: "8vo_basico",
    asignatura: "artes",
    eje: "crear",
    n: 2,
    texto:
      "Crear trabajos visuales a partir de diferentes desafíos creativos, experimentando con materiales sustentables en técnicas de impresión, papeles y textiles.",
    claves: ["crear", "trabajos", "visuales", "partir", "diferentes"],
  },
  {
    codigo: "OA03_AR_8",
    nivel: "8vo_basico",
    asignatura: "artes",
    eje: "crear",
    n: 3,
    texto:
      "Crear trabajos visuales a partir de diferentes desafíos creativos, usando medios de expresión contemporáneos como la instalación.",
    claves: ["crear", "trabajos", "visuales", "partir", "diferentes"],
  },
  {
    codigo: "OA04_AR_8",
    nivel: "8vo_basico",
    asignatura: "artes",
    eje: "apreciar",
    n: 4,
    texto:
      "Analizar manifestaciones visuales patrimoniales y contemporáneas, contemplando criterios como contexto, materialidad, lenguaje visual y propósito expresivo.",
    claves: ["analizar", "manifestaciones", "visuales", "patrimoniales", "contemporáneas"],
  },
  {
    codigo: "OA05_AR_8",
    nivel: "8vo_basico",
    asignatura: "artes",
    eje: "apreciar",
    n: 5,
    texto:
      "Evaluar trabajos visuales personales y de sus pares, considerando criterios como materialidad, lenguaje visual y propósito expresivo.",
    claves: ["evaluar", "trabajos", "visuales", "personales", "pares"],
  },
  {
    codigo: "OA06_AR_8",
    nivel: "8vo_basico",
    asignatura: "artes",
    eje: "difundir",
    n: 6,
    texto:
      "Comparar y valorar espacios de difusión de las artes visuales, considerando medios de expresión presentes, espacio, montaje, público y aporte a la comunidad.",
    claves: ["comparar", "valorar", "espacios", "difusión", "artes"],
  },
];
