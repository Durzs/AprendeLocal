import type { OA } from "./oa";

/**
 * Los Objetivos de Aprendizaje de Tecnología, 5º a 8º básico.
 *
 * LA ASIGNATURA QUE MÁS FALTA HACE
 *
 * En una entrevista, una profesora que hace tecnología sin haberla estudiado
 * contó que el material que consiguió era un libro de 1996 comprado en una
 * feria, con fotos de computadores con Photoshop. Dijo también que casi nadie
 * enseña tecnología habiéndola estudiado: es la asignatura que le cae al profe
 * de historia o al de música, y para la que no hay material ministerial.
 *
 * Y sin embargo sus objetivos son los que mejor describen lo que hace este
 * método. El de 7º pide identificar necesidades del entorno cercano que
 * impliquen soluciones de reparación, adaptación o mejora. El de 8º pide
 * identificar oportunidades o necesidades locales que impliquen crear un
 * producto tecnológico. Los dos piden después comunicarlo considerando el
 * objetivo, la audiencia y aspectos éticos. Eso es, palabra por palabra, la
 * etapa de propuestas y la de difusión.
 *
 * El texto sale de las Bases Curriculares del MINEDUC, leídas de
 * curriculumnacional.cl. Ninguno se escribió de memoria.
 */
export const TECNOLOGIA: OA[] = [
  /* ── 5º básico ─────────────────────────────────────────────── */
  {
    codigo: "OA01_TE_5",
    nivel: "5to_basico",
    asignatura: "tecnologia",
    eje: "disenar",
    n: 1,
    texto:
      "Crear diseños de objetos o sistemas tecnológicos para resolver problemas o aprovechar oportunidades, representando sus ideas a través de dibujos a mano alzada, dibujo técnico o usando tecnologías de la información.",
    claves: ["crear", "diseños", "objetos", "sistemas", "tecnológicos"],
  },
  {
    codigo: "OA02_TE_5",
    nivel: "5to_basico",
    asignatura: "tecnologia",
    eje: "disenar",
    n: 2,
    texto:
      "Planificar la elaboración de objetos tecnológicos, incorporando la secuencia de acciones, materiales, herramientas, técnicas y medidas de seguridad necesarias, discutiendo las implicancias ambientales y sociales de los recursos utilizados.",
    claves: ["planificar", "elaboración", "objetos", "tecnológicos", "incorporando"],
  },
  {
    codigo: "OA03_TE_5",
    nivel: "5to_basico",
    asignatura: "tecnologia",
    eje: "disenar",
    n: 3,
    texto:
      "Elaborar un producto tecnológico para resolver problemas y aprovechar oportunidades, seleccionando y demostrando dominio en el uso de técnicas y herramientas para medir, marcar, cortar, unir, pegar, mezclar, lijar, serrar, perforar y pintar.",
    claves: ["elaborar", "producto", "tecnológico", "resolver", "problemas"],
  },
  {
    codigo: "OA04_TE_5",
    nivel: "5to_basico",
    asignatura: "tecnologia",
    eje: "disenar",
    n: 4,
    texto:
      "Probar y evaluar la calidad de los trabajos propios o de otros, aplicando criterios de funcionamiento, técnicos, medioambientales, estéticos y de seguridad, y dialogando sobre sus resultados e ideas de mejoramiento.",
    claves: ["probar", "evaluar", "calidad", "trabajos", "propios"],
  },
  {
    codigo: "OA05_TE_5",
    nivel: "5to_basico",
    asignatura: "tecnologia",
    eje: "tic",
    n: 5,
    texto:
      "Usar software para organizar y comunicar los resultados de investigaciones e intercambiar ideas, mediante programas de presentación y hojas de cálculo para elaborar tablas y gráficos de barra y línea.",
    claves: ["usar", "software", "organizar", "comunicar", "resultados"],
  },
  {
    codigo: "OA06_TE_5",
    nivel: "5to_basico",
    asignatura: "tecnologia",
    eje: "tic",
    n: 6,
    texto:
      "Usar procesador de textos para crear, editar, dar formato, incorporar elementos de diseño y guardar un documento.",
    claves: ["usar", "procesador", "textos", "crear", "editar"],
  },
  {
    codigo: "OA07_TE_5",
    nivel: "5to_basico",
    asignatura: "tecnologia",
    eje: "tic",
    n: 7,
    texto:
      "Usar internet y comunicación en línea para compartir información de diferente carácter con otras personas, considerando la seguridad de la fuente y las normas de privacidad.",
    claves: ["usar", "internet", "comunicación", "línea", "compartir"],
  },
  /* ── 6º básico ─────────────────────────────────────────────── */
  {
    codigo: "OA01_TE_6",
    nivel: "6to_basico",
    asignatura: "tecnologia",
    eje: "disenar",
    n: 1,
    texto:
      "Crear diseños de objetos y sistemas tecnológicos para resolver problemas o aprovechar oportunidades, representando sus ideas mediante dibujos o tecnologías de la información.",
    claves: ["crear", "diseños", "objetos", "sistemas", "tecnológicos"],
  },
  {
    codigo: "OA02_TE_6",
    nivel: "6to_basico",
    asignatura: "tecnologia",
    eje: "disenar",
    n: 2,
    texto:
      "Planificar la elaboración de objetos o servicios tecnológicos, incorporando la secuencia de acciones, tiempos, costos y recursos necesarios, considerando implicancias ambientales y sociales.",
    claves: ["planificar", "elaboración", "objetos", "servicios", "tecnológicos"],
  },
  {
    codigo: "OA03_TE_6",
    nivel: "6to_basico",
    asignatura: "tecnologia",
    eje: "disenar",
    n: 3,
    texto:
      "Elaborar un producto tecnológico para resolver problemas y aprovechar oportunidades, mediante técnicas y herramientas específicas y con diversos materiales.",
    claves: ["elaborar", "producto", "tecnológico", "resolver", "problemas"],
  },
  {
    codigo: "OA04_TE_6",
    nivel: "6to_basico",
    asignatura: "tecnologia",
    eje: "disenar",
    n: 4,
    texto:
      "Probar y evaluar la calidad de los trabajos, aplicando criterios de funcionamiento, técnicos, medioambientales, estéticos y de seguridad.",
    claves: ["probar", "evaluar", "calidad", "trabajos", "aplicando"],
  },
  {
    codigo: "OA05_TE_6",
    nivel: "6to_basico",
    asignatura: "tecnologia",
    eje: "tic",
    n: 5,
    texto:
      "Usar software para organizar y comunicar los resultados de investigaciones, mediante programas de presentación y hojas de cálculo.",
    claves: ["usar", "software", "organizar", "comunicar", "resultados"],
  },
  {
    codigo: "OA06_TE_6",
    nivel: "6to_basico",
    asignatura: "tecnologia",
    eje: "tic",
    n: 6,
    texto:
      "Usar procesador de textos para crear, editar, dar formato, incorporar elementos de diseño, revisar y guardar documentos.",
    claves: ["usar", "procesador", "textos", "crear", "editar"],
  },
  {
    codigo: "OA07_TE_6",
    nivel: "6to_basico",
    asignatura: "tecnologia",
    eje: "tic",
    n: 7,
    texto:
      "Usar internet y comunicación en línea para compartir y publicar información, considerando seguridad y privacidad.",
    claves: ["usar", "internet", "comunicación", "línea", "compartir"],
  },
  /* ── 7º básico ─────────────────────────────────────────────── */
  {
    codigo: "OA01_TE_7",
    nivel: "7mo_basico",
    asignatura: "tecnologia",
    eje: "disenar",
    n: 1,
    texto:
      "Identificar necesidades personales o grupales del entorno cercano que impliquen soluciones de reparación, adaptación o mejora, reflexionando acerca de sus posibles aportes.",
    claves: ["identificar", "necesidades", "personales", "grupales", "entorno"],
  },
  {
    codigo: "OA02_TE_7",
    nivel: "7mo_basico",
    asignatura: "tecnologia",
    eje: "disenar",
    n: 2,
    texto:
      "Diseñar e implementar soluciones que respondan a las necesidades de reparación, adaptación o mejora de objetos o entornos, haciendo uso eficiente de recursos materiales, energéticos y digitales.",
    claves: ["diseñar", "implementar", "soluciones", "respondan", "necesidades"],
  },
  {
    codigo: "OA03_TE_7",
    nivel: "7mo_basico",
    asignatura: "tecnologia",
    eje: "disenar",
    n: 3,
    texto:
      "Evaluar soluciones implementadas como respuesta a las necesidades de reparación, adaptación o mejora de objetos o entornos, aplicando criterios propios y técnicos.",
    claves: ["evaluar", "soluciones", "implementadas", "respuesta", "necesidades"],
  },
  {
    codigo: "OA04_TE_7",
    nivel: "7mo_basico",
    asignatura: "tecnologia",
    eje: "tic",
    n: 4,
    texto:
      "Comunicar el diseño, la planificación u otros procesos de la resolución de necesidades de reparación, adaptación o mejora de objetos o entornos, utilizando herramientas digitales, considerando el objetivo, la audiencia y aspectos éticos.",
    claves: ["comunicar", "diseño", "planificación", "otros", "procesos"],
  },
  {
    codigo: "OA05_TE_7",
    nivel: "7mo_basico",
    asignatura: "tecnologia",
    eje: "tecnologia_sociedad",
    n: 5,
    texto:
      "Contrastar soluciones tecnológicas existentes de reparación, adaptación o mejora, identificando las necesidades a las que respondieron y el contexto en que fueron desarrolladas.",
    claves: ["contrastar", "soluciones", "tecnológicas", "existentes", "reparación"],
  },
  {
    codigo: "OA06_TE_7",
    nivel: "7mo_basico",
    asignatura: "tecnologia",
    eje: "tecnologia_sociedad",
    n: 6,
    texto:
      "Caracterizar algunos de los efectos que han tenido las soluciones tecnológicas existentes de reparación, adaptación o mejora, considerando aspectos sociales y ambientales.",
    claves: ["caracterizar", "algunos", "efectos", "tenido", "soluciones"],
  },
  /* ── 8º básico ─────────────────────────────────────────────── */
  {
    codigo: "OA01_TE_8",
    nivel: "8vo_basico",
    asignatura: "tecnologia",
    eje: "disenar",
    n: 1,
    texto:
      "Identificar oportunidades o necesidades personales, grupales o locales que impliquen la creación de un producto tecnológico, reflexionando acerca de sus posibles aportes.",
    claves: ["identificar", "oportunidades", "necesidades", "personales", "grupales"],
  },
  {
    codigo: "OA02_TE_8",
    nivel: "8vo_basico",
    asignatura: "tecnologia",
    eje: "disenar",
    n: 2,
    texto:
      "Diseñar y crear un producto tecnológico que atienda a la oportunidad o necesidad establecida, respetando criterios de eficiencia y sustentabilidad, y utilizando herramientas digitales en distintas etapas del proceso.",
    claves: ["diseñar", "crear", "producto", "tecnológico", "atienda"],
  },
  {
    codigo: "OA03_TE_8",
    nivel: "8vo_basico",
    asignatura: "tecnologia",
    eje: "disenar",
    n: 3,
    texto:
      "Evaluar el producto tecnológico creado, aplicando criterios propios y técnicos, y proponer mejoras asociadas tanto a los procesos como al producto final.",
    claves: ["evaluar", "producto", "tecnológico", "creado", "aplicando"],
  },
  {
    codigo: "OA04_TE_8",
    nivel: "8vo_basico",
    asignatura: "tecnologia",
    eje: "tic",
    n: 4,
    texto:
      "Comunicar el diseño, la planificación u otros procesos de la creación de productos tecnológicos, utilizando herramientas digitales, considerando diferentes tipos de objetivos y audiencias, y teniendo en cuenta aspectos éticos.",
    claves: ["comunicar", "diseño", "planificación", "otros", "procesos"],
  },
  {
    codigo: "OA05_TE_8",
    nivel: "8vo_basico",
    asignatura: "tecnologia",
    eje: "tecnologia_sociedad",
    n: 5,
    texto:
      "Examinar soluciones tecnológicas existentes que respondan a las oportunidades o necesidades establecidas, considerando los destinatarios y aspectos técnicos y funcionales.",
    claves: ["examinar", "soluciones", "tecnológicas", "existentes", "respondan"],
  },
  {
    codigo: "OA06_TE_8",
    nivel: "8vo_basico",
    asignatura: "tecnologia",
    eje: "tecnologia_sociedad",
    n: 6,
    texto:
      "Establecer impactos positivos o negativos de las soluciones tecnológicas analizadas, considerando aspectos éticos, ambientales y sociales.",
    claves: ["establecer", "impactos", "positivos", "negativos", "soluciones"],
  },
];
