import type { OA } from "./oa";

/**
 * Los Objetivos de Aprendizaje de Matemática, 5º a 8º básico.
 *
 * POR QUÉ ESTABAN FALTANDO
 *
 * Salió en una entrevista de validación, probando la plataforma en vivo. Al
 * llegar a la columna de objetivos con la actividad de matemática elegida, no
 * había nada que marcar: la base solo traía los sesenta y dos de Ciencias
 * Naturales. La plataforma proponía una actividad de matemática y acto seguido
 * decía que sus objetivos no estaban cargados, que es la peor versión posible
 * de las dos cosas.
 *
 * Y matemática no es una asignatura cualquiera en este problema. En la misma
 * entrevista quedó dicho que matemática y lenguaje son las dos que viven más
 * tensionadas entre hacer proyectos y responder por resultados en pruebas
 * estandarizadas. Un proyecto que no puede mostrar qué objetivos de matemática
 * cubre es, justamente, el que no se autoriza.
 *
 * DE DÓNDE SALE EL TEXTO
 *
 * De las Bases Curriculares del MINEDUC, leídas de curriculumnacional.cl, una
 * por una. Se guarda el enunciado del objetivo, que es el texto que va antes
 * de los dos puntos y de la lista de indicaciones, igual que en los de
 * Ciencias Naturales que ya estaban.
 *
 * No se inventó ninguno ni se completó ninguno de memoria. Esto se imprime en
 * la hoja que se lleva a la dirección del colegio, así que un objetivo mal
 * citado no es un detalle: es un papel firmado con un dato falso.
 *
 * EL CÓDIGO
 *
 * El programa los llama «MA05 OA 01». Aquí se escriben `OA01_MA_5`, que es la
 * forma que ya usaban los de Ciencias Naturales, para que el buscador y el
 * índice por código funcionen sin un caso especial por asignatura.
 */
export const MATEMATICA: OA[] = [
  /* ── 5º básico ─────────────────────────────────────────────────────── */
  {
    codigo: "OA01_MA_5",
    nivel: "5to_basico",
    asignatura: "matematica",
    eje: "numeros",
    n: 1,
    texto:
      "Representar y describir números naturales de hasta más de 6 dígitos y menores que 1 000 millones.",
    claves: ["números naturales", "valor posicional", "millones"],
  },
  {
    codigo: "OA02_MA_5",
    nivel: "5to_basico",
    asignatura: "matematica",
    eje: "numeros",
    n: 2,
    texto: "Aplicar estrategias de cálculo mental para la multiplicación.",
    claves: ["cálculo mental", "multiplicación"],
  },
  {
    codigo: "OA03_MA_5",
    nivel: "5to_basico",
    asignatura: "matematica",
    eje: "numeros",
    n: 3,
    texto:
      "Demostrar que comprenden la multiplicación de números naturales de dos dígitos por números naturales de dos dígitos.",
    claves: ["multiplicación", "números naturales"],
  },
  {
    codigo: "OA04_MA_5",
    nivel: "5to_basico",
    asignatura: "matematica",
    eje: "numeros",
    n: 4,
    texto:
      "Demostrar que comprenden la división con dividendos de tres dígitos y divisores de un dígito.",
    claves: ["división", "dividendo", "divisor"],
  },
  {
    codigo: "OA05_MA_5",
    nivel: "5to_basico",
    asignatura: "matematica",
    eje: "numeros",
    n: 5,
    texto:
      "Realizar cálculos que involucren las cuatro operaciones, aplicando las reglas relativas a paréntesis y la prevalencia de la multiplicación y la división por sobre la adición y la sustracción cuando corresponda.",
    claves: ["operaciones combinadas", "paréntesis", "prioridad"],
  },
  {
    codigo: "OA06_MA_5",
    nivel: "5to_basico",
    asignatura: "matematica",
    eje: "numeros",
    n: 6,
    texto:
      "Resolver problemas rutinarios y no rutinarios que involucren las cuatro operaciones.",
    claves: ["resolución de problemas", "cuatro operaciones"],
  },
  {
    codigo: "OA07_MA_5",
    nivel: "5to_basico",
    asignatura: "matematica",
    eje: "numeros",
    n: 7,
    texto: "Demostrar que comprenden las fracciones propias.",
    claves: ["fracciones propias"],
  },
  {
    codigo: "OA08_MA_5",
    nivel: "5to_basico",
    asignatura: "matematica",
    eje: "numeros",
    n: 8,
    texto: "Demostrar que comprenden las fracciones impropias de uso común.",
    claves: ["fracciones impropias"],
  },
  {
    codigo: "OA09_MA_5",
    nivel: "5to_basico",
    asignatura: "matematica",
    eje: "numeros",
    n: 9,
    texto:
      "Resolver adiciones y sustracciones con fracciones propias con denominadores menores o iguales a 12.",
    claves: ["fracciones", "adición", "sustracción"],
  },
  {
    codigo: "OA10_MA_5",
    nivel: "5to_basico",
    asignatura: "matematica",
    eje: "numeros",
    n: 10,
    texto:
      "Determinar el decimal que corresponde a fracciones con denominador 2, 4, 5 y 10.",
    claves: ["decimales", "fracciones", "equivalencia"],
  },
  {
    codigo: "OA11_MA_5",
    nivel: "5to_basico",
    asignatura: "matematica",
    eje: "numeros",
    n: 11,
    texto: "Comparar y ordenar decimales hasta la milésima.",
    claves: ["decimales", "comparar", "ordenar"],
  },
  {
    codigo: "OA12_MA_5",
    nivel: "5to_basico",
    asignatura: "matematica",
    eje: "numeros",
    n: 12,
    texto:
      "Resolver adiciones y sustracciones de decimales, empleando el valor posicional hasta la milésima.",
    claves: ["decimales", "valor posicional"],
  },
  {
    codigo: "OA13_MA_5",
    nivel: "5to_basico",
    asignatura: "matematica",
    eje: "numeros",
    n: 13,
    texto:
      "Resolver problemas, aplicando adiciones y sustracciones de fracciones propias o decimales hasta la milésima.",
    claves: ["problemas", "fracciones", "decimales"],
  },
  {
    codigo: "OA14_MA_5",
    nivel: "5to_basico",
    asignatura: "matematica",
    eje: "patrones_algebra",
    n: 14,
    texto:
      "Descubrir alguna regla que explique una sucesión dada y que permita hacer predicciones.",
    claves: ["patrones", "sucesión", "regla", "predicción"],
  },
  {
    codigo: "OA15_MA_5",
    nivel: "5to_basico",
    asignatura: "matematica",
    eje: "patrones_algebra",
    n: 15,
    texto:
      "Resolver problemas, usando ecuaciones e inecuaciones de un paso, que involucren adiciones y sustracciones.",
    claves: ["ecuaciones", "inecuaciones"],
  },
  {
    codigo: "OA16_MA_5",
    nivel: "5to_basico",
    asignatura: "matematica",
    eje: "geometria",
    n: 16,
    texto:
      "Identificar y dibujar puntos en el primer cuadrante del plano cartesiano, dadas sus coordenadas en números naturales.",
    claves: ["plano cartesiano", "coordenadas", "puntos"],
  },
  {
    codigo: "OA17_MA_5",
    nivel: "5to_basico",
    asignatura: "matematica",
    eje: "geometria",
    n: 17,
    texto:
      "Describir y dar ejemplos de aristas y caras de figuras 3D y lados de figuras 2D.",
    claves: ["figuras 3D", "figuras 2D", "aristas", "caras"],
  },
  {
    codigo: "OA18_MA_5",
    nivel: "5to_basico",
    asignatura: "matematica",
    eje: "geometria",
    n: 18,
    texto:
      "Demostrar que comprenden el concepto de congruencia, usando la traslación, la reflexión y la rotación.",
    claves: ["congruencia", "traslación", "reflexión", "rotación"],
  },
  {
    codigo: "OA19_MA_5",
    nivel: "5to_basico",
    asignatura: "matematica",
    eje: "medicion",
    n: 19,
    texto:
      "Medir longitudes con unidades estandarizadas (m, cm, mm) en el contexto de la resolución de problemas.",
    claves: ["longitud", "medir", "metro", "centímetro"],
  },
  {
    codigo: "OA20_MA_5",
    nivel: "5to_basico",
    asignatura: "matematica",
    eje: "medicion",
    n: 20,
    texto:
      "Realizar transformaciones entre unidades de medidas de longitud: km a m, m a cm, cm a mm y viceversa.",
    claves: ["unidades", "conversión", "longitud"],
  },
  {
    codigo: "OA21_MA_5",
    nivel: "5to_basico",
    asignatura: "matematica",
    eje: "medicion",
    n: 21,
    texto:
      "Diseñar y construir diferentes rectángulos, dados el perímetro, el área o ambos.",
    claves: ["perímetro", "área", "rectángulo"],
  },
  {
    codigo: "OA22_MA_5",
    nivel: "5to_basico",
    asignatura: "matematica",
    eje: "medicion",
    n: 22,
    texto:
      "Calcular áreas de triángulos, de paralelogramos y de trapecios, y estimar áreas de figuras irregulares.",
    claves: ["área", "triángulo", "figuras irregulares", "estimar"],
  },
  {
    codigo: "OA23_MA_5",
    nivel: "5to_basico",
    asignatura: "matematica",
    eje: "datos_probabilidades",
    n: 23,
    texto: "Calcular el promedio de datos e interpretarlo en su contexto.",
    claves: ["promedio", "datos", "interpretar"],
  },
  {
    codigo: "OA24_MA_5",
    nivel: "5to_basico",
    asignatura: "matematica",
    eje: "datos_probabilidades",
    n: 24,
    texto:
      "Describir la posibilidad de ocurrencia de un evento en base a un experimento aleatorio.",
    claves: ["probabilidad", "evento", "azar"],
  },
  {
    codigo: "OA25_MA_5",
    nivel: "5to_basico",
    asignatura: "matematica",
    eje: "datos_probabilidades",
    n: 25,
    texto: "Comparar probabilidades de distintos eventos sin calcularlas.",
    claves: ["probabilidad", "comparar"],
  },
  {
    codigo: "OA26_MA_5",
    nivel: "5to_basico",
    asignatura: "matematica",
    eje: "datos_probabilidades",
    n: 26,
    texto:
      "Leer, interpretar y completar tablas, gráficos de barra simple y gráficos de línea.",
    claves: ["tablas", "gráfico de barras", "gráfico de línea"],
  },
  {
    codigo: "OA27_MA_5",
    nivel: "5to_basico",
    asignatura: "matematica",
    eje: "datos_probabilidades",
    n: 27,
    texto:
      "Utilizar diagramas de tallo y hojas para representar datos provenientes de muestras aleatorias.",
    claves: ["tallo y hojas", "muestra", "datos"],
  },

  /* ── 6º básico ─────────────────────────────────────────────────────── */
  {
    codigo: "OA01_MA_6",
    nivel: "6to_basico",
    asignatura: "matematica",
    eje: "numeros",
    n: 1,
    texto: "Demostrar que comprenden los factores y múltiplos.",
    claves: ["factores", "múltiplos"],
  },
  {
    codigo: "OA02_MA_6",
    nivel: "6to_basico",
    asignatura: "matematica",
    eje: "numeros",
    n: 2,
    texto:
      "Realizar cálculos que involucren las cuatro operaciones en el contexto de la resolución de problemas.",
    claves: ["cuatro operaciones", "problemas"],
  },
  {
    codigo: "OA03_MA_6",
    nivel: "6to_basico",
    asignatura: "matematica",
    eje: "numeros",
    n: 3,
    texto:
      "Demostrar que comprenden el concepto de razón de manera concreta, pictórica y simbólica.",
    claves: ["razón", "proporción"],
  },
  {
    codigo: "OA04_MA_6",
    nivel: "6to_basico",
    asignatura: "matematica",
    eje: "numeros",
    n: 4,
    texto:
      "Demostrar que comprenden el concepto de porcentaje de manera concreta, pictórica y simbólica.",
    claves: ["porcentaje"],
  },
  {
    codigo: "OA05_MA_6",
    nivel: "6to_basico",
    asignatura: "matematica",
    eje: "numeros",
    n: 5,
    texto: "Demostrar que comprenden las fracciones y números mixtos.",
    claves: ["fracciones", "números mixtos"],
  },
  {
    codigo: "OA06_MA_6",
    nivel: "6to_basico",
    asignatura: "matematica",
    eje: "numeros",
    n: 6,
    texto:
      "Resolver adiciones y sustracciones de fracciones propias e impropias y números mixtos.",
    claves: ["fracciones", "adición", "sustracción"],
  },
  {
    codigo: "OA07_MA_6",
    nivel: "6to_basico",
    asignatura: "matematica",
    eje: "numeros",
    n: 7,
    texto:
      "Demostrar que comprenden la multiplicación y la división de decimales por números naturales.",
    claves: ["decimales", "multiplicación", "división"],
  },
  {
    codigo: "OA08_MA_6",
    nivel: "6to_basico",
    asignatura: "matematica",
    eje: "numeros",
    n: 8,
    texto:
      "Resolver problemas rutinarios y no rutinarios que involucren adiciones y sustracciones.",
    claves: ["problemas", "adición", "sustracción"],
  },
  {
    codigo: "OA09_MA_6",
    nivel: "6to_basico",
    asignatura: "matematica",
    eje: "patrones_algebra",
    n: 9,
    texto:
      "Demostrar que comprenden la relación entre los valores de una tabla y aplicarla en la resolución de problemas sencillos.",
    claves: ["tabla de valores", "relación", "patrones"],
  },
  {
    codigo: "OA10_MA_6",
    nivel: "6to_basico",
    asignatura: "matematica",
    eje: "patrones_algebra",
    n: 10,
    texto:
      "Representar generalizaciones de relaciones entre números naturales, usando expresiones con letras y ecuaciones.",
    claves: ["generalizar", "lenguaje algebraico", "ecuaciones"],
  },
  {
    codigo: "OA11_MA_6",
    nivel: "6to_basico",
    asignatura: "matematica",
    eje: "patrones_algebra",
    n: 11,
    texto: "Resolver ecuaciones de primer grado con una incógnita.",
    claves: ["ecuaciones", "incógnita"],
  },
  {
    codigo: "OA12_MA_6",
    nivel: "6to_basico",
    asignatura: "matematica",
    eje: "geometria",
    n: 12,
    texto:
      "Construir y comparar triángulos de acuerdo a la medida de sus lados y/o sus ángulos.",
    claves: ["triángulos", "lados", "ángulos"],
  },
  {
    codigo: "OA13_MA_6",
    nivel: "6to_basico",
    asignatura: "matematica",
    eje: "geometria",
    n: 13,
    texto:
      "Demostrar que comprenden el concepto de área de una superficie en cubos y paralelepípedos.",
    claves: ["área", "cubo", "paralelepípedo"],
  },
  {
    codigo: "OA14_MA_6",
    nivel: "6to_basico",
    asignatura: "matematica",
    eje: "geometria",
    n: 14,
    texto:
      "Realizar teselados de figuras 2D usando traslaciones, reflexiones y rotaciones.",
    claves: ["teselado", "traslación", "reflexión", "rotación"],
  },
  {
    codigo: "OA15_MA_6",
    nivel: "6to_basico",
    asignatura: "matematica",
    eje: "geometria",
    n: 15,
    texto:
      "Construir ángulos agudos, obtusos, rectos, extendidos y completos con instrumentos geométricos.",
    claves: ["ángulos", "transportador", "instrumentos"],
  },
  {
    codigo: "OA16_MA_6",
    nivel: "6to_basico",
    asignatura: "matematica",
    eje: "geometria",
    n: 16,
    texto:
      "Identificar los ángulos que se forman entre dos rectas que se cortan.",
    claves: ["ángulos opuestos", "rectas"],
  },
  {
    codigo: "OA17_MA_6",
    nivel: "6to_basico",
    asignatura: "matematica",
    eje: "geometria",
    n: 17,
    texto:
      "Demostrar de manera concreta, pictórica y simbólica que la suma de los ángulos interiores de un triángulo es 180º y de un cuadrilátero es 360º.",
    claves: ["ángulos interiores", "triángulo", "cuadrilátero"],
  },
  {
    codigo: "OA18_MA_6",
    nivel: "6to_basico",
    asignatura: "matematica",
    eje: "medicion",
    n: 18,
    texto:
      "Calcular la superficie de cubos y paralelepípedos expresando el resultado en cm² y m².",
    claves: ["superficie", "cubo", "paralelepípedo"],
  },
  {
    codigo: "OA19_MA_6",
    nivel: "6to_basico",
    asignatura: "matematica",
    eje: "medicion",
    n: 19,
    texto:
      "Calcular el volumen de cubos y paralelepípedos, expresando el resultado en cm³, m³ y mm³.",
    claves: ["volumen", "cubo", "paralelepípedo"],
  },
  {
    codigo: "OA20_MA_6",
    nivel: "6to_basico",
    asignatura: "matematica",
    eje: "medicion",
    n: 20,
    texto:
      "Estimar y medir ángulos usando el transportador, expresando las mediciones en grados.",
    claves: ["ángulos", "transportador", "grados"],
  },
  {
    codigo: "OA21_MA_6",
    nivel: "6to_basico",
    asignatura: "matematica",
    eje: "medicion",
    n: 21,
    texto:
      "Calcular ángulos en rectas paralelas cortadas por una transversal y en triángulos.",
    claves: ["ángulos", "rectas paralelas", "transversal"],
  },
  {
    codigo: "OA22_MA_6",
    nivel: "6to_basico",
    asignatura: "matematica",
    eje: "datos_probabilidades",
    n: 22,
    texto:
      "Comparar distribuciones de dos grupos, provenientes de muestras aleatorias, usando diagramas de puntos y de tallo y hojas.",
    claves: ["distribuciones", "muestras", "tallo y hojas"],
  },
  {
    codigo: "OA23_MA_6",
    nivel: "6to_basico",
    asignatura: "matematica",
    eje: "datos_probabilidades",
    n: 23,
    texto:
      "Conjeturar acerca de la tendencia de resultados obtenidos en repeticiones de un mismo experimento con dados, monedas u otros, de manera manual y/o usando software educativo.",
    claves: ["tendencia", "experimento", "azar", "conjeturar"],
  },
  {
    codigo: "OA24_MA_6",
    nivel: "6to_basico",
    asignatura: "matematica",
    eje: "datos_probabilidades",
    n: 24,
    texto:
      "Leer e interpretar gráficos de barra doble y circulares y comunicar sus conclusiones.",
    claves: ["gráfico de barras", "gráfico circular", "conclusiones"],
  },

  /* ── 7º básico ─────────────────────────────────────────────────────── */
  {
    codigo: "OA01_MA_7",
    nivel: "7mo_basico",
    asignatura: "matematica",
    eje: "numeros",
    n: 1,
    texto: "Mostrar que comprenden la adición y la sustracción de números enteros.",
    claves: ["números enteros", "recta numérica", "adición", "sustracción"],
  },
  {
    codigo: "OA02_MA_7",
    nivel: "7mo_basico",
    asignatura: "matematica",
    eje: "numeros",
    n: 2,
    texto:
      "Explicar la multiplicación y la división de fracciones positivas.",
    claves: ["fracciones", "multiplicación", "división"],
  },
  {
    codigo: "OA03_MA_7",
    nivel: "7mo_basico",
    asignatura: "matematica",
    eje: "numeros",
    n: 3,
    texto:
      "Resolver problemas que involucren la multiplicación y la división de fracciones y de decimales positivos de manera concreta, pictórica y simbólica (de forma manual y/o con software educativo).",
    claves: ["fracciones", "decimales", "problemas"],
  },
  {
    codigo: "OA04_MA_7",
    nivel: "7mo_basico",
    asignatura: "matematica",
    eje: "numeros",
    n: 4,
    texto: "Mostrar que comprenden el concepto de porcentaje.",
    claves: ["porcentaje"],
  },
  {
    codigo: "OA05_MA_7",
    nivel: "7mo_basico",
    asignatura: "matematica",
    eje: "numeros",
    n: 5,
    texto: "Utilizar potencias de base 10 con exponente natural.",
    claves: ["potencias", "notación científica", "exponente"],
  },
  {
    codigo: "OA06_MA_7",
    nivel: "7mo_basico",
    asignatura: "matematica",
    eje: "algebra_funciones",
    n: 6,
    texto:
      "Utilizar el lenguaje algebraico para generalizar relaciones entre números, para establecer y formular reglas y propiedades y construir ecuaciones.",
    claves: ["lenguaje algebraico", "generalizar", "ecuaciones"],
  },
  {
    codigo: "OA07_MA_7",
    nivel: "7mo_basico",
    asignatura: "matematica",
    eje: "algebra_funciones",
    n: 7,
    texto:
      "Reducir expresiones algebraicas, reuniendo términos semejantes para obtener expresiones de la forma ax + by + cz.",
    claves: ["expresiones algebraicas", "términos semejantes"],
  },
  {
    codigo: "OA08_MA_7",
    nivel: "7mo_basico",
    asignatura: "matematica",
    eje: "algebra_funciones",
    n: 8,
    texto: "Mostrar que comprenden las proporciones directas e inversas.",
    claves: ["proporción directa", "proporción inversa", "tabla de valores"],
  },
  {
    codigo: "OA09_MA_7",
    nivel: "7mo_basico",
    asignatura: "matematica",
    eje: "algebra_funciones",
    n: 9,
    texto:
      "Modelar y resolver problemas diversos que involucren ecuaciones e inecuaciones lineales de la forma ax = b; x/a = b; ax < b; ax > b; x/a < b; x/a > b.",
    claves: ["ecuaciones", "inecuaciones", "modelar"],
  },
  {
    codigo: "OA10_MA_7",
    nivel: "7mo_basico",
    asignatura: "matematica",
    eje: "geometria",
    n: 10,
    texto:
      "Descubrir relaciones que involucran ángulos exteriores o interiores de diferentes polígonos.",
    claves: ["ángulos", "polígonos"],
  },
  {
    codigo: "OA11_MA_7",
    nivel: "7mo_basico",
    asignatura: "matematica",
    eje: "geometria",
    n: 11,
    texto: "Mostrar que comprenden el círculo.",
    claves: ["círculo", "radio", "diámetro", "perímetro", "área"],
  },
  {
    codigo: "OA12_MA_7",
    nivel: "7mo_basico",
    asignatura: "matematica",
    eje: "geometria",
    n: 12,
    texto:
      "Construir objetos geométricos de manera manual y/o con software educativo.",
    claves: ["construcción", "bisectriz", "altura", "congruencia"],
  },
  {
    codigo: "OA13_MA_7",
    nivel: "7mo_basico",
    asignatura: "matematica",
    eje: "geometria",
    n: 13,
    texto:
      "Desarrollar y aplicar la fórmula del área de triángulos, paralelogramos y trapecios.",
    claves: ["área", "triángulo", "paralelogramo", "trapecio"],
  },
  {
    codigo: "OA14_MA_7",
    nivel: "7mo_basico",
    asignatura: "matematica",
    eje: "geometria",
    n: 14,
    texto:
      "Identificar puntos en el plano cartesiano, usando pares ordenados y vectores de forma concreta (juegos) y pictórica.",
    claves: ["plano cartesiano", "pares ordenados", "vectores"],
  },
  {
    codigo: "OA15_MA_7",
    nivel: "7mo_basico",
    asignatura: "matematica",
    eje: "probabilidad_estadistica",
    n: 15,
    texto:
      "Estimar el porcentaje de ciertas características de una población desconocida por medio del muestreo.",
    claves: ["muestreo", "población", "estimar", "porcentaje"],
  },
  {
    codigo: "OA16_MA_7",
    nivel: "7mo_basico",
    asignatura: "matematica",
    eje: "probabilidad_estadistica",
    n: 16,
    texto:
      "Representar datos obtenidos en una muestra mediante tablas de frecuencias absolutas y relativas, utilizando gráficos apropiados, de manera manual y/o con software educativo.",
    claves: ["frecuencia absoluta", "frecuencia relativa", "tablas", "gráficos"],
  },
  {
    codigo: "OA17_MA_7",
    nivel: "7mo_basico",
    asignatura: "matematica",
    eje: "probabilidad_estadistica",
    n: 17,
    texto: "Mostrar que comprenden las medidas de tendencia central y el rango.",
    claves: ["promedio", "mediana", "moda", "rango", "dato atípico"],
  },
  {
    codigo: "OA18_MA_7",
    nivel: "7mo_basico",
    asignatura: "matematica",
    eje: "probabilidad_estadistica",
    n: 18,
    texto:
      "Explicar las probabilidades de eventos obtenidos por medio de experimentos de manera manual y/o con software educativo.",
    claves: ["probabilidad", "frecuencia relativa", "experimento"],
  },
  {
    codigo: "OA19_MA_7",
    nivel: "7mo_basico",
    asignatura: "matematica",
    eje: "probabilidad_estadistica",
    n: 19,
    texto:
      "Comparar las frecuencias relativas de un evento obtenidas al repetirlo un número creciente de veces, de manera manual y/o con software educativo, con su probabilidad teórica.",
    claves: ["frecuencia relativa", "probabilidad teórica", "diagrama de árbol"],
  },

  /* ── 8º básico ─────────────────────────────────────────────────────── */
  {
    codigo: "OA01_MA_8",
    nivel: "8vo_basico",
    asignatura: "matematica",
    eje: "numeros",
    n: 1,
    texto:
      "Mostrar que comprenden la multiplicación y la división de números enteros.",
    claves: ["números enteros", "multiplicación", "división"],
  },
  {
    codigo: "OA02_MA_8",
    nivel: "8vo_basico",
    asignatura: "matematica",
    eje: "numeros",
    n: 2,
    texto:
      "Utilizar las operaciones de multiplicación y división con los números racionales.",
    claves: ["números racionales", "multiplicación", "división"],
  },
  {
    codigo: "OA03_MA_8",
    nivel: "8vo_basico",
    asignatura: "matematica",
    eje: "numeros",
    n: 3,
    texto:
      "Explicar la multiplicación, la división y el proceso de formar potencias de potencias.",
    claves: ["potencias", "multiplicación", "división"],
  },
  {
    codigo: "OA04_MA_8",
    nivel: "8vo_basico",
    asignatura: "matematica",
    eje: "numeros",
    n: 4,
    texto: "Mostrar que comprenden las raíces cuadradas de números naturales.",
    claves: ["raíz cuadrada", "números naturales"],
  },
  {
    codigo: "OA05_MA_8",
    nivel: "8vo_basico",
    asignatura: "matematica",
    eje: "numeros",
    n: 5,
    texto:
      "Resolver problemas que involucran variaciones porcentuales en contextos diversos.",
    claves: ["variación porcentual", "porcentaje", "problemas"],
  },
  {
    codigo: "OA06_MA_8",
    nivel: "8vo_basico",
    asignatura: "matematica",
    eje: "algebra_funciones",
    n: 6,
    texto: "Mostrar que comprenden las operaciones de expresiones algebraicas.",
    claves: ["expresiones algebraicas", "operaciones"],
  },
  {
    codigo: "OA07_MA_8",
    nivel: "8vo_basico",
    asignatura: "matematica",
    eje: "algebra_funciones",
    n: 7,
    texto:
      "Mostrar que comprenden la noción de función por medio de un cambio lineal.",
    claves: ["función", "cambio lineal"],
  },
  {
    codigo: "OA08_MA_8",
    nivel: "8vo_basico",
    asignatura: "matematica",
    eje: "algebra_funciones",
    n: 8,
    texto:
      "Modelar situaciones de la vida diaria y de otras asignaturas, usando ecuaciones lineales.",
    claves: ["modelar", "ecuaciones lineales", "vida diaria"],
  },
  {
    codigo: "OA09_MA_8",
    nivel: "8vo_basico",
    asignatura: "matematica",
    eje: "algebra_funciones",
    n: 9,
    texto:
      "Resolver inecuaciones lineales con coeficientes racionales en el contexto de la resolución de problemas.",
    claves: ["inecuaciones", "coeficientes racionales"],
  },
  {
    codigo: "OA10_MA_8",
    nivel: "8vo_basico",
    asignatura: "matematica",
    eje: "algebra_funciones",
    n: 10,
    texto: "Mostrar que comprenden la función afín.",
    claves: ["función afín", "pendiente"],
  },
  {
    codigo: "OA11_MA_8",
    nivel: "8vo_basico",
    asignatura: "matematica",
    eje: "geometria",
    n: 11,
    texto:
      "Desarrollar las fórmulas para encontrar el área de superficies y el volumen de prismas.",
    claves: ["área", "volumen", "prisma"],
  },
  {
    codigo: "OA12_MA_8",
    nivel: "8vo_basico",
    asignatura: "matematica",
    eje: "geometria",
    n: 12,
    texto:
      "Explicar, de manera concreta, pictórica y simbólica, la validez del teorema de Pitágoras.",
    claves: ["teorema de Pitágoras", "triángulo rectángulo"],
  },
  {
    codigo: "OA13_MA_8",
    nivel: "8vo_basico",
    asignatura: "matematica",
    eje: "geometria",
    n: 13,
    texto: "Describir la posición y el movimiento de figuras 2D.",
    claves: ["posición", "movimiento", "figuras 2D"],
  },
  {
    codigo: "OA14_MA_8",
    nivel: "8vo_basico",
    asignatura: "matematica",
    eje: "geometria",
    n: 14,
    texto:
      "Componer rotaciones, traslaciones y reflexiones en el plano cartesiano y en el espacio.",
    claves: ["rotación", "traslación", "reflexión", "plano cartesiano"],
  },
  {
    codigo: "OA15_MA_8",
    nivel: "8vo_basico",
    asignatura: "matematica",
    eje: "probabilidad_estadistica",
    n: 15,
    texto:
      "Mostrar que comprenden las medidas de posición, percentiles y cuartiles.",
    claves: ["percentiles", "cuartiles", "medidas de posición"],
  },
  {
    codigo: "OA16_MA_8",
    nivel: "8vo_basico",
    asignatura: "matematica",
    eje: "probabilidad_estadistica",
    n: 16,
    texto: "Evaluar la forma en que los datos están presentados.",
    claves: ["gráficos", "manipulación de gráficos", "diagrama de cajón"],
  },
  {
    codigo: "OA17_MA_8",
    nivel: "8vo_basico",
    asignatura: "matematica",
    eje: "probabilidad_estadistica",
    n: 17,
    texto: "Explicar el principio combinatorio multiplicativo.",
    claves: ["combinatoria", "principio multiplicativo"],
  },
];
