/**
 * Las rutas: clases ya escritas, listas para usar el lunes.
 *
 * Por qué existen. Generar una secuencia distinta cada vez que un profesor
 * abre la aplicación es caro, es lento, falla, y sobre todo es absurdo: la
 * clase de «el agua del estero» para 5º, 6º y 7º es la misma en las nueve
 * escuelas del piloto. Se escribe una vez, se revisa con un docente, y queda
 * disponible. El generador se reserva para lo que de verdad es distinto.
 *
 * Por qué son cuatro, y por qué estas cuatro. No se eligieron por tema
 * bonito. Se midieron los 62 objetivos del currículo contra los 132 lugares
 * cargados: solo 22 tienen anclaje territorial real, y esos 22 se agrupan en
 * exactamente cuatro temas. Cada ruta declara abajo qué objetivos cubre y de
 * qué curso, con el código del programa.
 *
 * Estas rutas viajan dentro de la aplicación, no en la base de datos. Así
 * abren sin señal, sin sesión y sin esperar, que son las tres condiciones de
 * una escuela rural. Cuando haya que editarlas desde el navegador se moverán,
 * pero eso es un problema que todavía no tenemos.
 *
 * AVISO. Estas cuatro están escritas con el currículo y el territorio
 * delante, pero NO las ha revisado todavía un docente de aula. Hasta que eso
 * pase son un borrador bueno, no material probado.
 */

import type { Secuencia } from "../../../types";
import type { Grupo } from "./inaturalist";

/**
 * La postura desde la que trabaja cada curso.
 *
 * Sobel observa que la relación con el lugar cambia con la edad, y que
 * saltarse ese orden es lo que produce niños angustiados por problemas
 * planetarios que no pueden tocar. Entre los 8 y los 11 toca EXPLORAR: mapear,
 * recorrer, averiguar cómo funciona esto de aquí. Entre los 12 y los 15 toca
 * ACTUAR: un problema real de la comunidad, y algo que entregar.
 *
 * Una sala multigrado de 5º a 8º tiene las dos edades sentadas a la vez, y eso
 * deja de ser un estorbo para volverse la mejor razón para juntarlos: los
 * pequeños levantan los datos del lugar y los grandes los usan para sostener
 * algo delante de un adulto. Cada uno en su postura, y dependiendo del otro.
 */
export type Postura = "explorar" | "actuar";

/** Una semana de la ruta, para verla como recorrido y no como lista. */
export type Fase = {
  semana: number;
  titulo: string;
  queOcurre: string;
};

export type Ruta = {
  id: string;
  titulo: string;
  /** De qué va, en una frase, para elegir sin abrirla. */
  gancho: string;
  /** Qué tipo de lugar hace falta. No un lugar concreto: cada escuela tiene el suyo. */
  lugar: string;
  semanas: number;
  /**
   * La pregunta que sostiene la ruta entera.
   *
   * Del PBL: una pregunta abierta, real, sin respuesta en el libro, y que a
   * alguien del pueblo le importe de verdad. No es el objetivo de aprendizaje
   * disfrazado de pregunta.
   */
  preguntaGuia: string;
  /**
   * Lo que el curso entrega, y a quién.
   *
   * Es la pieza que separa un proyecto de una actividad larga: hay una
   * audiencia real esperando algo. Sin destinatario, el trabajo termina en el
   * cuaderno y la nota, y el lugar vuelve a ser decorado.
   */
  producto: { que: string; paraQuien: string };
  /** El recorrido semana a semana. */
  fases: Fase[];
  /** Un objetivo por curso, con la postura que le toca por edad. */
  cubre: { nivel: string; codigos: string[]; postura: Postura; papel: string }[];
  /**
   * El lugar nombrado en mapuzugun, además de en castellano.
   *
   * Esto no es un adorno bilingüe ni una traducción de la interfaz. En una
   * escuela de La Araucanía el estero tiene dos nombres, y el que usa la
   * comunidad suele decir más del sitio que el del mapa: «menoko» no es «un
   * humedal», es un ojo de agua con dueño y con reglas. Que la hoja de terreno
   * lleve los dos nombres es lo que separa la educación intercultural de la
   * decoración con motivos.
   *
   * Los términos se escriben en grafemario Azümchefe, que es el que el
   * MINEDUC usa en Educación Intercultural Bilingüe. Van marcados como SIN
   * VALIDAR hasta que los revise un hablante: escribir mal una lengua en
   * proceso de revitalización no es un detalle menor, y preferimos decir que
   * no estamos seguros antes que imprimirlo con aplomo.
   */
  mapuzugun?: { termino: string; castellano: string; nota?: string }[];
  /**
   * Lo que la comunidad sabe de este lugar, y que la ruta puede recoger.
   *
   * Va aparte del contenido científico a propósito: no es una versión
   * folclórica de lo mismo, es otra fuente de conocimiento sobre el mismo
   * sitio. Y no se usa sin permiso: quien lo tiene es la comunidad, no la
   * escuela ni nosotros.
   */
  kimun?: { pregunta: string; aQuien: string };
  /**
   * Qué grupos de seres vivos le interesan a esta ruta.
   *
   * Solo lo declaran las rutas a las que de verdad les aporta. Al suelo y al
   * calor no les sirve saber qué pájaros hay cerca, y ofrecerlo ahí sería
   * ruido con aspecto de función.
   */
  naturaleza?: { grupos: Grupo[]; para: string };
  secuencia: Secuencia;
};

/** `5to_basico` → `5º`, para las tarjetas del listado. */
export function cursoCorto(nivel: string): string {
  const n = /^(\d)/.exec(nivel);
  return n ? `${n[1]}º` : nivel;
}

// ───────────────────────────────────────────────────────────────────────────
// 1. EL AGUA QUE PASA POR LA ESCUELA
//    5º OA12-14 · 6º OA01, OA15 · 7º OA12
// ───────────────────────────────────────────────────────────────────────────

const AGUA: Secuencia = {
  titulo: "El agua que pasa por la escuela",
  objetivo_codigo: "OA12_CN_5",
  objetivo_descripcion:
    "Describir la distribución del agua dulce y salada en la Tierra y comparar sus volúmenes.",
  sesiones: 5,
  sintesis_docente:
    "El curso se divide entre los que creen que el estero alcanza y los que creen que no. Salen a buscar el único número que puede darle la razón a alguien, y escriben lo que encontraron para el comité de agua.",
  desacuerdo: {
    sobre_que:
      "¿Le alcanza el agua de este estero a la escuela y a las casas de alrededor durante todo el año? Que levanten la mano los que dicen que sí y los que dicen que no. Va a haber de los dos, y ninguno de los dos tiene todavía cómo probarlo.",
    como_se_ve:
      "Los que dicen que sí a un lado de la sala, los que dicen que no al otro, los que no se deciden al medio. Cada lado manda a uno a decir en qué se basa. Anota las dos razones en la pizarra tal como las dicen, sin arreglárselas, y tapa esa parte de la pizarra hasta la clase de la vuelta.",
    quien_lo_zanja:
      "Ninguno de los dos lados puede ganar discutiendo, y eso es lo que conviene dejar dicho antes de salir: para zanjarlo hace falta un número que nadie tiene y que solo se consigue metiéndose al estero. Ese es el motivo de la salida. No que toque salida.",
  },
  instruccion_explicita: {
    duracion_min: 20,
    que_hacen_los_estudiantes:
      "Antes de que expliques nada: cada uno dibuja de memoria el estero que cruza todos los días, visto desde arriba, y marca con una cruz dónde cree que va más hondo. Cinco minutos, sin borrar. Ese dibujo es el que van a llevar al terreno para ver en qué le achuntaron.",
    notas_para_el_docente: [
      "Dibuja el estero visto desde arriba y marca el ancho. Después de lado, y marca lo hondo que es.",
      "El agua que pasa depende de tres cosas: cuán ancho, cuán hondo y cuán rápido. Las tres juntas, no una.",
      "Un estero ancho pero de un dedo de hondo lleva menos agua que uno angosto y profundo. Diles esto antes de que lo pregunten.",
      "Medimos en tres puntos y sacamos el promedio porque el estero no es parejo en ninguna parte.",
    ],
    conceptos_clave: ["ancho", "profundidad", "velocidad", "promedio"],
    errores_frecuentes: [
      "creer que más ancho es siempre más agua",
      "medir una sola vez y darlo por bueno",
    ],
    comprobacion: {
      pregunta:
        "Dos esteros, los dos con el agua corriendo igual de rápido. Uno mide 4 metros de ancho y el agua llega al tobillo. El otro mide 1 metro de ancho y llega a la rodilla. ¿Cuál lleva más agua? Responden todos a la vez con los dedos: uno el ancho, dos el angosto, tres los dos iguales.",
      respuestas: [
        {
          dice: "Dos dedos: el angosto",
          significa:
            "Está multiplicando ancho por hondo, que es lo que había que entender. 1 × 0,5 le gana a 4 × 0,1.",
        },
        {
          dice: "Un dedo: el ancho",
          significa:
            "Se quedó con el ancho y soltó lo hondo. Es la respuesta más repetida del curso y no es motivo de alarma: es justamente la que veníamos a buscar.",
        },
        {
          dice: "Tres dedos: los dos iguales",
          significa:
            "Sabe que hay dos medidas pero cree que una compensa a la otra siempre. Está a un paso: le falta hacer la multiplicación con los números delante.",
        },
      ],
      si_falla:
        "Si más de un cuarto del curso levanta un dedo, no pases a los ejercicios. Dibuja los dos cortes de agua en la pizarra, uno al lado del otro, cuadriculados, y que cuenten los cuadritos en voz alta. Se ve, y con verlo basta.",
    },
  },
  ejemplo_resuelto: {
    situacion: "El estero de al lado de la escuela, en el vado donde cruzan.",
    pasos: [
      {
        paso: 1,
        accion: "Medir el ancho con la huincha en tres puntos separados diez pasos.",
        razonamiento: "El estero se ensancha y se angosta. Una sola medida engaña.",
        resultado: "2,1 m · 2,6 m · 2,5 m. Sumo y divido por tres: 2,4 m.",
      },
      {
        paso: 2,
        accion: "Meter la vara en cinco puntos a lo ancho y anotar hasta dónde se moja.",
        razonamiento: "El fondo tampoco es plano: en la orilla es bajo y al medio hondo.",
        resultado: "0,2 · 0,4 · 0,5 · 0,4 · 0,25 m. Promedio: 0,35 m.",
      },
      {
        paso: 3,
        accion: "Multiplicar ancho por profundidad.",
        razonamiento: "Eso da el tamaño del hueco por el que pasa el agua.",
        resultado: "2,4 × 0,35 = 0,84 metros cuadrados.",
      },
      {
        paso: 4,
        accion: "Tirar un palito y cronometrar cuánto tarda en recorrer cinco metros.",
        razonamiento: "El palito viaja a la velocidad del agua. Es el cronómetro más barato que existe.",
        resultado: "14 segundos para 5 m. 5 ÷ 14 = 0,35 metros por segundo.",
      },
      {
        paso: 5,
        accion: "Multiplicar el hueco por la velocidad.",
        razonamiento: "Cuánta agua pasa = qué tan grande es el hueco × qué tan rápido va.",
        resultado: "0,84 × 0,35 = 0,29 metros cúbicos por segundo.",
      },
    ],
    respuesta:
      "Por el estero pasan 290 litros cada segundo. Un bidón de 20 litros se llenaría en menos de un pestañeo.",
  },
  practica_guiada: {
    como_trabajan:
      "El primero lo haces tú en la pizarra con todos mirando y copiando. El segundo lo hacen en parejas, en el cuaderno, mientras tú pasas banco por banco.",
    ejercicios: [
      {
        enunciado:
          "Un estero mide 3 m de ancho y 0,4 m de hondo, y el palito recorre 5 m en 33 segundos. ¿Cuánta agua pasa?",
        apoyo: "La fórmula queda escrita en la pizarra: ancho × hondo × velocidad.",
        respuesta_esperada: "0,18 metros cúbicos por segundo, o sea 180 litros.",
      },
      {
        enunciado:
          "Si el estero se pone el doble de ancho pero el agua va a la mitad de rápido, ¿pasa más agua, menos, o la misma?",
        apoyo: "Prueba con números: 2×2 y 4×1 dan lo mismo.",
        respuesta_esperada: "La misma. Uno compensa al otro.",
      },
    ],
  },
  practica_autonoma: {
    como_trabajan:
      "Cada uno solo, en su cuaderno, sin hablar. El que termina revisa el del compañero de al lado y le marca dónde se equivocó, sin borrárselo.",
    ejercicios: [
      {
        enunciado:
          "En la escuela hay 40 personas y cada una gasta 20 litros al día. ¿Cuánta agua gasta la escuela en una semana?",
        respuesta_esperada: "40 × 20 × 7 = 5.600 litros.",
      },
      {
        enunciado:
          "Con los 290 litros por segundo del ejemplo, ¿cuántos segundos tarda el estero en llevar esa misma cantidad?",
        respuesta_esperada: "Unos 19 segundos. Ahí se entiende el tamaño del estero.",
      },
    ],
  },
  salida_terreno: {
    duracion_min: 90,
    preparacion: [
      "huincha de 5 m",
      "una vara con marcas cada 10 cm",
      "reloj con segundero",
      "cuaderno y lápiz",
      "botas",
    ],
    protocolo: [
      {
        campo: "ancho_cauce_m",
        etiqueta: "Ancho del estero",
        instruccion: "Con la huincha, de orilla a orilla, en tres puntos separados diez pasos. Anota los tres.",
        unidad: "m",
        tipo: "numero",
      },
      {
        campo: "profundidad_media_m",
        etiqueta: "Qué tan hondo",
        instruccion: "Con la vara, en cinco puntos a lo ancho. Anota los cinco.",
        unidad: "m",
        tipo: "numero",
      },
      {
        campo: "tiempo_palito_s",
        etiqueta: "Tiempo del palito",
        instruccion: "Suelta un palito y toma el tiempo que tarda en recorrer 5 metros. Tres veces.",
        unidad: "s",
        tipo: "numero",
      },
      {
        campo: "estado_del_agua",
        etiqueta: "Cómo se ve el agua",
        instruccion: "Escribe si está clara o turbia, si hay basura, si huele.",
        tipo: "texto",
      },
    ],
    seguridad: [
      "Nadie entra al agua por sobre la rodilla",
      "Nadie se acerca solo a la orilla",
      "Si llovió los tres días antes, la salida se suspende",
    ],
    lo_que_eligen: {
      que_eligen:
        "Dónde se mide. El estero tiene cien metros a la vista y los tres puntos los eligen ellos, no tú. Cada grupo marca los suyos antes de sacar la huincha.",
      en_que_cambia:
        "Cambia el número, y bastante: medir en el ensanche o en el angosto da caudales distintos. Que a dos grupos les dé distinto no es un error del que haya que salvarlos, es el dato con el que después discuten cuál de los dos representa mejor al estero.",
      como_lo_defienden:
        "Antes de medir, cada grupo dice en voz alta por qué ahí. Después, con los números sobre la mesa, el curso decide con cuáles se queda para el informe. Esa decisión se escribe en el informe con el nombre de quienes la tomaron.",
    },
  },
  vuelta_del_terreno: {
    como_empieza:
      "Antes de que nadie saque una calculadora: cada uno saca el dibujo que hizo el primer día y le pasa por encima, con otro color, el estero como resultó ser. La cruz de dónde creían que iba más hondo queda dibujada al lado de donde estaba de verdad.",
    que_comparan:
      "La cruz contra el punto hondo, y el ancho que habían dibujado contra el que dio la huincha. Pregunta quién le achuntó a la cruz: suelen ser dos o tres de veinte, y que sean tan pocos es lo que hace que nadie quede en falta. Ahí recién sirve la cuenta, porque ahora es la cuenta de algo que les importa.",
    si_no_calza:
      "Si a un grupo le sale un caudal diez veces mayor o menor que al resto, el estero no cambió en veinte metros: fue el palito, que se quedó pegado en la orilla o pilló el chorro del medio. Se suelta tres veces y se toma el del medio, no el promedio.",
    con_la_comunidad:
      "Al lado de sus números va lo que contó la persona mayor a la que preguntaron: hasta dónde llegaba el estero cuando era niña, y en qué mes bajaba. Es el único dato de hace cuarenta años que van a tener, y es el que convierte una medición de un martes en algo que vale la pena llevarle al comité de agua.",
  },
  borrador_y_critica: {
    primera_version:
      "La plana del informe se escribe en la clase, no en la casa, y queda fea a propósito: los números, una frase de qué significan, y la respuesta a si alcanza o no. Media hora y se acabó.",
    como_se_critica:
      "Se intercambian los informes entre grupos. Cada lector escribe tres cosas y solo tres: una que se entiende bien, una que no se entiende, y una pregunta que el comité de agua va a hacer y que el informe no contesta. Nada de «está bonito» ni «le falta color»: si un comentario no se puede arreglar, no sirve.",
    que_mejora:
      "La segunda versión se nota en algo concreto: contesta la pregunta que el otro grupo dijo que no contestaba. Se guardan las dos y se entregan las dos, porque la distancia entre una y otra es la mitad de lo que aprendieron.",
  },
  recuperacion_espaciada: [
    {
      semanas_despues: 1,
      pregunta:
        "Su grupo midió {dato_del_estudiante} m de ancho. Si el estero se pusiera la mitad de hondo, ¿cuánta agua pasaría?",
      respuesta_esperada: "La mitad. Depende de su propia medición.",
    },
    {
      semanas_despues: 3,
      pregunta: "¿Por qué medimos el ancho en tres puntos y no en uno?",
      respuesta_esperada: "Porque el estero no es parejo y una sola medida engaña.",
    },
    {
      semanas_despues: 6,
      pregunta:
        "Con el agua que midieron, ¿le alcanzaría al estero para abastecer la escuela una semana?",
      respuesta_esperada: "Sí, de sobra. Lo interesante es que calculen cuánto de sobra.",
    },
  ],
  materiales: ["huincha", "vara marcada", "reloj", "cuaderno", "palitos"],
  requiere_consulta: false,
  niveles: ["5to_basico", "6to_basico", "7mo_basico"],
  por_nivel: [
    {
      nivel: "5to_basico",
      objetivo_codigo: "OA12_CN_5",
      objetivo_descripcion: "Distribución del agua dulce y salada en la Tierra.",
      practica_guiada: {
        ejercicios: [
          {
            enunciado:
              "Con el ancho y lo hondo que midió 7º, calcula cuánta agua pasa por el estero en un minuto.",
            apoyo: "Multiplica el resultado por segundo por 60.",
            respuesta_esperada: "Cerca de 17.000 litros por minuto.",
          },
        ],
      },
      practica_autonoma: {
        ejercicios: [
          {
            enunciado: "Dibuja de dónde viene y adónde va el agua del estero. Ponle los nombres que sepas.",
            respuesta_esperada: "Debe aparecer la cordillera arriba y el río grande abajo.",
          },
        ],
      },
      mientras_esperan:
        "Con el cuaderno cerrado dibujan el estero de memoria con las tres medidas puestas. Recién cuando terminan abren y comprueban: lo que se les había olvidado lo agregan con rojo. La corrección la hacen ellos y no necesitan preguntarte nada.",
      rol_en_terreno:
        "Marcan con estacas el tramo de 5 metros y sueltan el palito. Toman el tiempo tres veces.",
    },
    {
      nivel: "6to_basico",
      objetivo_codigo: "OA01_CN_6",
      objetivo_descripcion: "Requerimientos de los seres vivos: agua, luz y minerales.",
      practica_guiada: {
        ejercicios: [
          {
            enunciado:
              "Con lo que vieron en la orilla, haz una lista de qué seres vivos dependen de este estero y para qué.",
            apoyo: "Piensa en tres grupos: los que viven dentro, los que beben, y los que crecen al lado.",
            respuesta_esperada: "Al menos seis, repartidos en los tres grupos.",
          },
        ],
      },
      practica_autonoma: {
        ejercicios: [
          {
            enunciado: "¿Qué pasaría con esa lista si el estero se secara medio verano?",
            respuesta_esperada: "Que los del agua se van o mueren; los de la orilla aguantan más.",
          },
        ],
      },
      mientras_esperan:
        "Reparten en tres columnas lo que recogieron: los que viven dentro del agua, los que vienen a beber, los que crecen en la orilla. Lo que no sepan dónde poner va a una cuarta columna, y esa es la única que te preguntan al final.",
      rol_en_terreno:
        "Levantan tres piedras del fondo y anotan qué encuentran debajo. Las devuelven a su sitio.",
    },
    {
      nivel: "7mo_basico",
      objetivo_codigo: "OA12_CN_7",
      objetivo_descripcion: "El clima en la Tierra es dinámico y se explica por varios factores.",
      practica_guiada: {
        ejercicios: [
          {
            enunciado:
              "Con las lluvias del mes anotadas en la pizarra, explica por qué el estero lleva hoy más o menos agua que en enero.",
            apoyo: "Compara el mes más lluvioso con el más seco.",
            respuesta_esperada: "Debe aparecer la relación entre lluvia y caudal, con retraso de días.",
          },
        ],
      },
      practica_autonoma: {
        ejercicios: [
          {
            enunciado:
              "Si en la cordillera nieva menos cada año, ¿qué le pasa a este estero en verano? Explica el camino completo.",
            respuesta_esperada: "Menos nieve, menos deshielo, menos agua justo cuando más falta.",
          },
        ],
      },
      mientras_esperan:
        "Pasan a limpio la tabla de medidas del curso completo y sacan los promedios con la calculadora. Es lo que el resto necesita para su ejercicio.",
      rol_en_terreno:
        "Miden ancho y profundidad en los tres puntos y le entregan los números a 5º. Sin esos datos 5º no puede trabajar.",
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────
// 2. QUIÉN SE COME A QUIÉN
//    5º OA01 · 6º OA02, OA03 · 7º OA05 · 8º OA04
// ───────────────────────────────────────────────────────────────────────────

const REDES: Secuencia = {
  titulo: "Quién se come a quién en el bosque de al lado",
  objetivo_codigo: "OA02_CN_6",
  objetivo_descripcion:
    "Representar por medio de modelos la transferencia de energía y materia entre seres vivos.",
  sesiones: 5,
  sintesis_docente:
    "Discuten de cuál ser vivo del bosque se podría prescindir, y salen a levantar piedras a ver quién tenía razón. Con lo que encuentran arman un mural que primero se critican entre ellos y después rehacen.",
  desacuerdo: {
    sobre_que:
      "Escribe tres candidatos en la pizarra: el árbol grande, el pájaro que se oye, los bichos de debajo de las piedras. Si desapareciera uno solo y el bosque siguiera igual, ¿cuál sería? Cada uno elige uno.",
    como_se_ve:
      "Escriben su elección en un papelito y los pegan en la pizarra en tres columnas. La columna de los bichos suele ser la más votada, y ahí está la discusión: quien los eligió tiene que decir por qué, y nadie tiene todavía con qué probarle que se equivoca.",
    quien_lo_zanja:
      "No se zanja hablando, porque la parte del bosque que decide esto no se ve desde aquí: está debajo de las piedras y dentro de la hojarasca. Se zanja cuando levanten las piedras y cuenten cuántas flechas de la red pasan por ahí.",
  },
  instruccion_explicita: {
    duracion_min: 20,
    que_hacen_los_estudiantes:
      "Antes de que expliques nada: cada uno escribe tres seres vivos del bosque de al lado y les pone flechas de quién se come a quién, como le parezca. Sin ayuda y sin borrar. Después les das la regla —la flecha apunta a quien come— y corrigen su propio dibujo, que es donde se entiende.",
    notas_para_el_docente: [
      "Todo empieza en las plantas, porque son las únicas que fabrican su comida con luz.",
      "Dibuja tres cajas en la pizarra: plantas, los que comen plantas, los que comen animales. Una flecha de cada una a la siguiente.",
      "La flecha significa «la energía pasa para allá». Por eso apunta hacia el que come.",
      "En cada paso se pierde energía. Por eso hay muchas plantas, menos conejos, y muy pocos zorros.",
    ],
    conceptos_clave: ["plantas", "quién come a quién", "energía que se pierde"],
    errores_frecuentes: [
      "poner la flecha al revés",
      "creer que el zorro está arriba porque es más grande, y no porque come",
    ],
    comprobacion: {
      pregunta:
        "En la pizarra, tres palabras: hierba, conejo, zorro. Una sola pregunta y la escriben todos a la vez en un papelito: entre el conejo y el zorro, ¿hacia dónde va la flecha? A, del conejo al zorro. B, del zorro al conejo. Y abajo, en tres palabras, por qué.",
      respuestas: [
        {
          dice: "A, y escribe algo parecido a «porque la energía pasa para allá»",
          significa: "Entendió lo que la flecha significa, no solo cómo se dibuja.",
        },
        {
          dice: "B, del zorro al conejo",
          significa:
            "Está dibujando la flecha como quien apunta con el dedo a su presa. Hay que atajarlo aquí: si sale de esta clase con la flecha al revés, toda la red que arme después queda del revés.",
        },
        {
          dice: "A, pero deja el «por qué» en blanco",
          significa:
            "Copió la forma del esquema sin la idea de dentro. Se sostiene hasta la primera red que arme solo, y ahí se cae.",
        },
      ],
      si_falla:
        "Si falla más de un cuarto, olvídate de la red y quédate en un solo par: la hierba y el conejo. Pregunta en voz alta quién se queda con lo que la hierba tenía guardado. La flecha sale sola de esa respuesta y ya no hay que memorizarla.",
    },
  },
  ejemplo_resuelto: {
    situacion: "Un metro cuadrado del bosque de al lado de la escuela.",
    pasos: [
      {
        paso: 1,
        accion: "Anotar todo lo vivo que hay en ese metro cuadrado.",
        razonamiento: "Sin la lista no hay red que armar. Se empieza por lo que se ve.",
        resultado: "Hojarasca, helechos, un renoval de roble, babosas, hormigas, una araña, un zorzal.",
      },
      {
        paso: 2,
        accion: "Separar en tres grupos: los que fabrican, los que comen plantas, los que comen animales.",
        razonamiento: "Los tres grupos son los tres pisos de la red.",
        resultado: "Fabrican: roble y helechos. Comen plantas: babosas. Comen animales: araña y zorzal.",
      },
      {
        paso: 3,
        accion: "Dibujar una flecha desde cada uno hacia quien se lo come.",
        razonamiento: "La flecha es el camino de la energía.",
        resultado: "Helecho → babosa → zorzal. Hojarasca → hormiga → araña → zorzal.",
      },
      {
        paso: 4,
        accion: "Contar cuántos hay de cada uno.",
        razonamiento: "Los números explican por qué la red tiene esa forma de pirámide.",
        resultado: "Cientos de hojas, doce hormigas, dos babosas, una araña, un zorzal cada tanto.",
      },
    ],
    respuesta:
      "El zorzal necesita todo ese metro cuadrado para comer. Por eso hay uno, y no diez.",
  },
  practica_guiada: {
    como_trabajan:
      "La primera la armas tú en la pizarra pidiéndoles a ellos las flechas de a uno. La segunda, en parejas y en el cuaderno.",
    ejercicios: [
      {
        enunciado:
          "Con esta lista —maqui, zorzal, oruga, chucao— dibuja las flechas en el orden correcto.",
        apoyo: "Pregúntate para cada par: ¿quién se come a quién?",
        respuesta_esperada: "Maqui → oruga → chucao. El zorzal también come maqui.",
      },
      {
        enunciado: "Si desaparecieran todas las orugas, ¿a quién le pasaría algo primero?",
        apoyo: "Sigue las flechas hacia arriba.",
        respuesta_esperada: "Al chucao, que se queda sin comida.",
      },
    ],
  },
  practica_autonoma: {
    como_trabajan:
      "Solos, en el cuaderno. Tienen que dibujar, no escribir. El que termina levanta la mano y espera sin hablar.",
    ejercicios: [
      {
        enunciado: "Dibuja la red del pedazo de bosque que te tocó, con todo lo que anotaste.",
        respuesta_esperada: "Al menos tres pisos y cinco flechas.",
      },
      {
        enunciado: "Marca con una X qué desaparecería si se talara ese pedazo.",
        respuesta_esperada: "Casi todo. Lo interesante es que expliquen por dónde empieza.",
      },
    ],
  },
  salida_terreno: {
    duracion_min: 90,
    preparacion: [
      "un cordel de 4 m para marcar el metro cuadrado",
      "lupa",
      "cuaderno y lápiz",
      "un frasco con tapa perforada",
    ],
    protocolo: [
      {
        campo: "especies_vegetales",
        etiqueta: "Plantas que hay",
        instruccion: "Anota todas las plantas distintas dentro del cuadrado. Si no sabes el nombre, dibújala.",
        tipo: "texto",
      },
      {
        campo: "animales_encontrados",
        etiqueta: "Animales que aparecen",
        instruccion: "Levanta tres piedras y remueve la hojarasca. Anota qué sale y devuélvelo a su sitio.",
        tipo: "texto",
      },
      {
        campo: "cuantos_de_cada_uno",
        etiqueta: "Cuántos hay",
        instruccion: "Cuenta cuántos hay de los tres más repetidos.",
        unidad: "unidades",
        tipo: "numero",
      },
      {
        campo: "hojarasca_cm",
        etiqueta: "Grosor de la hojarasca",
        instruccion: "Mide con la regla cuántos centímetros de hojas muertas hay sobre el suelo.",
        unidad: "cm",
        tipo: "numero",
      },
    ],
    seguridad: [
      "Todo lo que se levanta se devuelve a su sitio",
      "Nada se lleva vivo a la sala",
      "Nadie se sale del sector marcado",
    ],
    lo_que_eligen: {
      que_eligen:
        "Dónde ponen su metro cuadrado. No se lo marques tú: cada grupo elige su pedazo de bosque y dice antes por qué ese.",
      en_que_cambia:
        "Cambia todo. Un cuadrado a pleno sol y otro bajo el árbol grande, a diez pasos uno del otro, dan listas distintas. Pídeles a propósito que no elijan todos el mismo tipo de sitio: el curso necesita los dos para tener algo que comparar.",
      como_lo_defienden:
        "Al volver, cada grupo sostiene que su cuadrado representa bien al bosque y el resto le busca el punto flojo. De esa discusión sale qué va al mural y qué se anota aparte como caso raro.",
    },
  },
  vuelta_del_terreno: {
    como_empieza:
      "Cada uno saca el papel del primer día, con sus tres seres vivos y sus flechas puestas a ojo, y lo deja al lado de la lista de lo que de verdad apareció bajo las piedras.",
    que_comparan:
      "Cuántos de los que habían escrito estaban ahí, y sobre todo qué apareció que nadie había puesto. La sorpresa suele ser la misma en todos los cursos: habían escrito animales grandes, y el bosque que hay es de bichos de un centímetro y hojas podridas. Esa lista de lo que nadie había nombrado es la que se lleva al mural.",
    si_no_calza:
      "Si un grupo no encontró casi nada, no borres su cuadrado: anótalo. Un metro cuadrado con cuatro bichos y otro con cuarenta, a diez pasos de distancia, es el mejor dato del día, y la pregunta de por qué se contesta mirando la sombra y el grosor de la hojarasca que ellos mismos midieron.",
    con_la_comunidad:
      "Si alguien de la comunidad les contó qué plantas de ese monte se usan y en qué época se recogen, esas plantas entran al mural con ese dato al lado. No como adorno: una planta que se recoge en marzo y no en agosto está diciendo algo del año del bosque que las flechas no muestran.",
  },
  borrador_y_critica: {
    primera_version:
      "El mural se arma primero en borrador: las piezas sueltas sobre la mesa y las flechas a lápiz. Nada pegado todavía, porque todo se va a mover.",
    como_se_critica:
      "Recorren el mural de otro grupo con una sola tarea: encontrar una flecha que no se sostenga y poder decir por qué. No se borra nada. El que encuentra una le pone encima un papelito con la objeción escrita, y esa flecha se discute con quien la puso.",
    que_mejora:
      "La segunda versión tiene menos flechas que la primera y todas defendibles. Que sobrevivan menos es la señal de que la crítica funcionó: díselos antes, o lo van a leer como que les fue mal.",
  },
  recuperacion_espaciada: [
    {
      semanas_despues: 1,
      pregunta:
        "Su grupo contó {dato_del_estudiante} bichos bajo las piedras. ¿Por qué había más ahí que a pleno sol?",
      respuesta_esperada: "Humedad y refugio. Debe salir de lo que ellos vieron.",
    },
    {
      semanas_despues: 3,
      pregunta: "¿Por qué las flechas apuntan hacia el que come y no al revés?",
      respuesta_esperada: "Porque marcan hacia dónde va la energía.",
    },
  ],
  materiales: ["cordel", "lupa", "cuaderno", "regla"],
  requiere_consulta: false,
  niveles: ["5to_basico", "6to_basico", "7mo_basico", "8vo_basico"],
  por_nivel: [
    {
      nivel: "5to_basico",
      objetivo_codigo: "OA01_CN_5",
      objetivo_descripcion: "Los seres vivos están formados por células organizadas en tejidos y órganos.",
      practica_guiada: {
        ejercicios: [
          {
            enunciado: "Elige tres seres vivos de la lista y di de qué está hecho cada uno por dentro.",
            apoyo: "Todos están hechos de lo mismo, aunque por fuera no lo parezcan.",
            respuesta_esperada: "Los tres, de células.",
          },
        ],
      },
      practica_autonoma: {
        ejercicios: [
          {
            enunciado: "Dibuja una hoja del bosque mirada con lupa, con todo el detalle que alcances.",
            respuesta_esperada: "Deben aparecer las nervaduras.",
          },
        ],
      },
      mientras_esperan:
        "Pegan las hojas que recogieron y al lado de cada una escriben de dónde salió y qué se la estaba comiendo, si se nota. Los mordiscos y los agujeros son el dato: el que encuentre una hoja entera, sin ni un mordisco, la marca con un círculo, porque son pocas y eso ya dice algo.",
      rol_en_terreno: "Marcan el metro cuadrado con el cordel y cuentan las plantas de dentro.",
    },
    {
      nivel: "6to_basico",
      objetivo_codigo: "OA03_CN_6",
      objetivo_descripcion: "Efectos de la actividad humana sobre las redes alimentarias.",
      practica_guiada: {
        ejercicios: [
          {
            enunciado: "Con la red que armaron, marca qué flechas se cortan si entra ganado a ese bosque.",
            apoyo: "Empieza por lo que el ganado se come o pisa.",
            respuesta_esperada: "Se cortan las de abajo, y por eso caen todas las de arriba.",
          },
        ],
      },
      practica_autonoma: {
        ejercicios: [
          {
            enunciado: "Escribe tres cosas que se podrían hacer para que esa red no se corte.",
            respuesta_esperada: "Cercar, no talar, dejar la hojarasca.",
          },
        ],
      },
      mientras_esperan:
        "Arman la red completa del curso en una hoja grande, entre varios y sin ti. Antes de pegarla revisan flecha por flecha que cada una salga de algo que se come y llegue a algo que come. La que no cumpla se borra, aunque la haya puesto un compañero.",
      rol_en_terreno: "Levantan las piedras y anotan los animales, con la lupa.",
    },
    {
      nivel: "7mo_basico",
      objetivo_codigo: "OA05_CN_7",
      objetivo_descripcion: "Comparar microorganismos: virus, bacterias y hongos.",
      practica_guiada: {
        ejercicios: [
          {
            enunciado: "¿Quién se come las hojas muertas de la hojarasca? No es ningún animal de la lista.",
            apoyo: "Mira el color y el olor de las hojas de más abajo.",
            respuesta_esperada: "Hongos y bacterias. Son los que devuelven todo al suelo.",
          },
        ],
      },
      practica_autonoma: {
        ejercicios: [
          {
            enunciado: "Explica qué pasaría en el bosque si los hongos dejaran de trabajar un año.",
            respuesta_esperada: "Las hojas se acumularían y el suelo no recibiría nada.",
          },
        ],
      },
      mientras_esperan:
        "Miden con la regla el grosor de la hojarasca en los cinco puntos y sacan el promedio. Es el dato que 8º necesita.",
      rol_en_terreno: "Cavan un hoyo pequeño y anotan cuántos centímetros de hojas muertas hay.",
    },
    {
      nivel: "8vo_basico",
      objetivo_codigo: "OA04_CN_8",
      objetivo_descripcion: "Las plantas tienen estructuras especializadas para sus funciones.",
      practica_guiada: {
        ejercicios: [
          {
            enunciado: "De las plantas de la lista, di qué parte usa cada una para tomar el agua y cuál para la luz.",
            apoyo: "Compara un helecho de sombra con un arbusto de claro.",
            respuesta_esperada: "Raíz para el agua, hoja para la luz. La forma cambia según dónde vive.",
          },
        ],
      },
      practica_autonoma: {
        ejercicios: [
          {
            enunciado: "¿Por qué las hojas del sotobosque son más grandes que las de arriba?",
            respuesta_esperada: "Para atrapar la poca luz que llega abajo.",
          },
        ],
      },
      mientras_esperan:
        "Comparan dos hojas, una de sol y otra de sombra, y escriben cinco diferencias. Con la lupa y sin hablar.",
      rol_en_terreno: "Recogen una hoja de sol y una de sombra de la misma especie, para comparar en la sala.",
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────
// 3. EL SUELO QUE PISAMOS
//    6º OA16-18 · 7º OA09-11
// ───────────────────────────────────────────────────────────────────────────

const SUELO: Secuencia = {
  titulo: "El suelo que pisamos viene de un volcán",
  objetivo_codigo: "OA17_CN_6",
  objetivo_descripcion:
    "Investigar experimentalmente la formación del suelo, sus propiedades y su importancia.",
  sesiones: 5,
  sintesis_docente:
    "Proponen explicaciones de por qué esta tierra se seca en enero, y todas suenan razonables. Salen a traer tierra de un corte de camino para separar cuál era, y escriben una ficha que corrige quien cultiva.",
  desacuerdo: {
    sobre_que:
      "¿Por qué esta tierra se nos seca en enero si en invierno llueve tanto? Deja que propongan y anota todo lo que digan: el sol, el viento, que en verano no llueve, que la tierra es mala. Todas suenan razonables.",
    como_se_ve:
      "Cada explicación queda en la pizarra con el nombre de quien la propuso al lado. Después cada uno hace una raya en la que le parece más probable, y quedan dos o tres peleando. Que la de alguien tenga pocas rayas no la descarta: eso hay que decirlo.",
    quien_lo_zanja:
      "Ninguna se descarta por votación, y conviene ser explícito en eso. Lo que las separa es un experimento con dos tarros y medio litro de agua, y para hacerlo hace falta traer tierra de verdad de un corte. A eso van.",
  },
  instruccion_explicita: {
    duracion_min: 20,
    que_hacen_los_estudiantes:
      "Antes de que expliques nada: cada uno dibuja qué cree que hay bajo sus pies si se cavara un metro, en capas, y le pone los nombres que se le ocurran. Casi todos dibujan una sola cosa parda. Guardan el dibujo: en el corte de camino van a ver cuántas capas había de verdad.",
    notas_para_el_docente: [
      "El suelo no es una sola cosa: son capas, y cada una tardó cientos de años en formarse.",
      "Dibuja el corte de lado: encima las hojas muertas, debajo la tierra oscura, más abajo la ceniza clara, y al fondo la roca.",
      "Esta zona tiene trumao: ceniza de volcán. Es liviana, negra, y el agua se le escapa.",
      "Por eso aquí se riega más que en otras partes aunque llueva mucho. Ellos ya lo saben, solo no saben por qué.",
    ],
    conceptos_clave: ["capas", "ceniza volcánica", "trumao", "retención de agua"],
    errores_frecuentes: [
      "creer que el suelo es solo tierra suelta",
      "pensar que si llueve mucho el suelo siempre está húmedo",
    ],
    comprobacion: {
      pregunta:
        "Dos tarros iguales, con tierra distinta. A los dos les echo medio litro. Por abajo del primero salen 100 mililitros y por abajo del segundo salen 400. ¿Cuál de las dos tierras le conviene a la papa? Responden todos a la vez con la mano: arriba el primero, abajo el segundo.",
      respuestas: [
        {
          dice: "El primero",
          significa: "Entendió que la tierra que sirve es la que se queda con el agua.",
        },
        {
          dice: "El segundo, «porque tiene más agua»",
          significa:
            "Está leyendo «salió más agua» como «tenía más agua». Es exactamente la confusión que veníamos a buscar.",
        },
        {
          dice: "El segundo, «porque así no se ahoga la papa»",
          significa:
            "No es un error de lectura: es otra idea, y tiene razón en ella. El exceso de agua pudre la raíz. Dale la razón en eso antes de corregirle lo otro, o dejará de responder.",
        },
      ],
      si_falla:
        "Si falla más de un cuarto, no lo expliques otra vez: haz el tarro delante de ellos y pon los dos vasos de lo que salió uno junto al otro, sin decir nada. El vaso más lleno es el de la tierra que no se quedó con nada.",
    },
  },
  ejemplo_resuelto: {
    situacion: "El corte de tierra que dejó la máquina al abrir el camino junto a la escuela.",
    pasos: [
      {
        paso: 1,
        accion: "Medir con la huincha cada capa de arriba abajo.",
        razonamiento: "El grosor dice cuánto tiempo tardó en formarse cada una.",
        resultado: "Hojas 4 cm · tierra oscura 22 cm · ceniza clara 60 cm · roca al fondo.",
      },
      {
        paso: 2,
        accion: "Tomar un puñado de cada capa y apretarlo en la mano.",
        razonamiento: "Lo que se deshace tiene poca arcilla; lo que queda pegado tiene más.",
        resultado: "La oscura queda hecha bola. La ceniza se deshace sola.",
      },
      {
        paso: 3,
        accion: "Poner un puñado de cada una en un tarro con agujeros y echarle medio litro de agua.",
        razonamiento: "Lo que sale por abajo es lo que el suelo no fue capaz de retener.",
        resultado: "De la oscura salieron 150 ml. De la ceniza, 380 ml.",
      },
      {
        paso: 4,
        accion: "Restar para saber cuánta agua se quedó en cada una.",
        razonamiento: "Esa es la que le queda a la planta.",
        resultado: "Oscura: 350 ml retenidos. Ceniza: 120 ml. Casi tres veces menos.",
      },
    ],
    respuesta:
      "La ceniza volcánica deja escapar el agua. Por eso aquí la papa se riega en enero aunque el invierno haya sido lluvioso.",
  },
  practica_guiada: {
    como_trabajan:
      "El experimento del tarro lo haces tú adelante, con dos alumnos ayudando y el resto anotando lo que sale. Los cálculos, en parejas.",
    ejercicios: [
      {
        enunciado:
          "Si a un tarro le echas 500 ml y salen 380, ¿cuánta agua retuvo? ¿Qué porcentaje del total?",
        apoyo: "Resta primero, después divide por 500.",
        respuesta_esperada: "120 ml. Un 24%.",
      },
      {
        enunciado: "¿Cuál de las dos capas te conviene tener arriba si vas a sembrar? ¿Por qué?",
        apoyo: "Piensa en qué necesita la raíz.",
        respuesta_esperada: "La oscura, porque guarda el agua.",
      },
    ],
  },
  practica_autonoma: {
    como_trabajan:
      "Solos, en el cuaderno. Primero el dibujo con las medidas, después las respuestas. Sin conversar.",
    ejercicios: [
      {
        enunciado: "Dibuja el corte que vieron, con las capas a escala y sus centímetros anotados.",
        respuesta_esperada: "Cuatro capas, en proporción, con los números.",
      },
      {
        enunciado: "La capa oscura tardó unos 500 años en formarse. Si se pierde por erosión en un invierno, ¿cuánto costará recuperarla?",
        respuesta_esperada: "Otros 500 años. Ese es el punto.",
      },
    ],
  },
  salida_terreno: {
    duracion_min: 90,
    preparacion: [
      "huincha de 5 m",
      "una pala pequeña",
      "tarros con agujeros en el fondo",
      "una botella con medio litro de agua marcado",
      "bolsas para las muestras",
    ],
    protocolo: [
      {
        campo: "espesor_capas_cm",
        etiqueta: "Grosor de cada capa",
        instruccion: "Mide de arriba abajo cada capa que se distinga por el color. Anótalas en orden.",
        unidad: "cm",
        tipo: "numero",
      },
      {
        campo: "color_de_capas",
        etiqueta: "Color de cada capa",
        instruccion: "Escribe el color de cada una: negra, café, gris clara, amarilla.",
        tipo: "texto",
      },
      {
        campo: "agua_escurrida_ml",
        etiqueta: "Agua que se escapó",
        instruccion: "Echa medio litro en el tarro y mide cuánta agua sale por abajo.",
        unidad: "ml",
        tipo: "numero",
      },
      {
        campo: "senales_de_erosion",
        etiqueta: "Señales de erosión",
        instruccion: "Anota si hay cárcavas, raíces al aire o tierra arrastrada al pie del corte.",
        tipo: "texto",
      },
    ],
    seguridad: [
      "Nadie se pone debajo del corte: se desprende tierra",
      "Se trabaja de lado, nunca al pie",
      "No se excava en cortes más altos que una persona",
    ],
    lo_que_eligen: {
      que_eligen:
        "Qué cuenta como una capa distinta. El corte no viene con líneas dibujadas: dónde termina una y empieza la otra lo deciden ellos, mirando el color y metiendo el dedo.",
      en_que_cambia:
        "Dos grupos pueden contar tres capas y cinco en el mismo corte, y los dos pueden tener razón. Ahí está la conversación que importa: qué tiene que cambiar para que sea otra capa, el color, lo que se deshace en la mano, o las dos cosas a la vez.",
      como_lo_defienden:
        "Cada grupo clava palitos en sus límites y el resto va a mirar. Antes de escribir la ficha se llega a un acuerdo de curso y el acuerdo se anota con esas palabras: «para nosotros una capa nueva empieza cuando…». Eso es lo que hace que los números de dos grupos se puedan sumar.",
    },
  },
  vuelta_del_terreno: {
    como_empieza:
      "Cada uno saca el dibujo del primer día —el de qué creía que había bajo sus pies— y dibuja al lado el corte como era. Casi todos habían dibujado una sola cosa parda.",
    que_comparan:
      "Cuántas capas habían puesto y cuántas había. Y el orden: la que ellos dejaban arriba contra la que estaba arriba de verdad. Recién después salen los mililitros del tarro, que es lo que explica por qué el suelo se seca en enero aunque llueva todo el invierno.",
    si_no_calza:
      "Si dos grupos miden la misma capa con veinte centímetros de diferencia, mira dónde midió cada uno: en un corte de camino la capa oscura se adelgaza hacia arriba de la ladera. No es un error de nadie, es el dato de que la tierra se está yendo cuesta abajo, y esa es justamente la pregunta de 6º.",
    con_la_comunidad:
      "Al lado de sus mililitros va lo que dijeron las familias que siembran cerca: qué prende aquí y qué no prende nunca. Llevan décadas sabiendo el resultado del experimento del tarro sin haberlo hecho, y que los dos datos digan lo mismo es lo que hace que la ficha le sirva a alguien.",
  },
  borrador_y_critica: {
    primera_version:
      "La ficha se escribe primero como la escribirían para ellos mismos: capas, centímetros, cuánta agua se escapó. Alguien de afuera no la entendería, y da lo mismo, para eso es el borrador.",
    como_se_critica:
      "La lee quien de verdad va a usarla: el que cuida la huerta de la escuela, o un apoderado que siembre. Una sola pregunta para quien la lee, y hecha delante del curso: «¿con esto sabrías qué sembrar y cuándo regar?». Lo que conteste se anota tal cual, aunque incomode.",
    que_mejora:
      "La segunda versión convierte los números en decisiones: no «retiene 120 mililitros» sino «esta tierra aguanta tres días sin riego en enero». Es el mismo dato dicho de manera que le sirva a quien lo pidió, y esa traducción es el trabajo.",
  },
  recuperacion_espaciada: [
    {
      semanas_despues: 1,
      pregunta:
        "Su capa oscura medía {dato_del_estudiante} cm. A un centímetro cada veinte años, ¿cuántos años tiene?",
      respuesta_esperada: "Depende de su medida. Suele dar varios siglos.",
    },
    {
      semanas_despues: 3,
      pregunta: "¿Por qué el agua se escapa más rápido de la ceniza que de la tierra oscura?",
      respuesta_esperada: "Porque la ceniza es más gruesa y suelta, y deja pasar el agua entre sus granos.",
    },
  ],
  materiales: ["huincha", "pala", "tarros perforados", "botella medida", "bolsas"],
  requiere_consulta: false,
  niveles: ["6to_basico", "7mo_basico"],
  por_nivel: [
    {
      nivel: "6to_basico",
      objetivo_codigo: "OA18_CN_6",
      objetivo_descripcion: "Consecuencias de la erosión sobre la superficie de la Tierra.",
      practica_guiada: {
        ejercicios: [
          {
            enunciado:
              "Con las señales que anotaron, ordena de menos a más grave lo que le está pasando a ese corte.",
            apoyo: "Una raíz al aire es más grave que una piedra suelta.",
            respuesta_esperada: "Debe quedar arriba la pérdida de la capa oscura.",
          },
        ],
      },
      practica_autonoma: {
        ejercicios: [
          {
            enunciado: "Dibuja qué tendría que haber en ese corte para que no se siguiera cayendo.",
            respuesta_esperada: "Plantas, raíces, cobertura. No cemento.",
          },
        ],
      },
      mientras_esperan:
        "Dibujan el corte a escala —un centímetro del cuaderno por cada diez del terreno— y lo pintan con el color real de cada capa. La escala es el trabajo, no el color: si la ceniza no les queda casi tres veces más gruesa que la capa oscura, el dibujo está malo y se nota sin que nadie se lo diga.",
      rol_en_terreno: "Miden el grosor de cada capa con la huincha y anotan los colores.",
    },
    {
      nivel: "7mo_basico",
      objetivo_codigo: "OA10_CN_7",
      objetivo_descripcion: "La actividad volcánica y sus consecuencias en la naturaleza y la sociedad.",
      practica_guiada: {
        ejercicios: [
          {
            enunciado:
              "La capa de ceniza que midió 6º tiene 60 cm. ¿De cuántas erupciones puede venir? Explica cómo lo sabes.",
            apoyo: "Busca si dentro de la ceniza hay líneas de distinto color.",
            respuesta_esperada: "De varias: cada línea distinta es una caída de ceniza.",
          },
        ],
      },
      practica_autonoma: {
        ejercicios: [
          {
            enunciado: "Explica por qué la gente sigue viviendo cerca de un volcán activo.",
            respuesta_esperada: "Porque la ceniza hace suelos fértiles. El riesgo viene con el beneficio.",
          },
        ],
      },
      mientras_esperan:
        "Separan lo que trajeron en dos montones: lo que se deshace entre los dedos y lo que queda hecho bola. Después cuentan cuántos de cada montón salieron de la capa de ceniza. Ese número es el que explica por qué el agua se escapa, y lo sacan ellos solos en la mesa del fondo.",
      rol_en_terreno:
        "Hacen el experimento del tarro con las dos muestras y le pasan los mililitros a 6º.",
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────
// 4. DÓNDE SE VA EL CALOR
//    5º OA13 · 6º OA10, OA14, OA15 · 7º OA12 · 8º OA11
//    Única ruta que no necesita salir del recinto: la escuela es el terreno.
// ───────────────────────────────────────────────────────────────────────────

const CALOR: Secuencia = {
  titulo: "Dónde se va el calor de la sala",
  objetivo_codigo: "OA14_CN_6",
  objetivo_descripcion:
    "Diferenciar entre calor y temperatura, considerando que el calor es una forma de energía.",
  sesiones: 5,
  sintesis_docente:
    "Cada uno apuesta por dónde se escapa el calor de su sala, y casi todos dicen la puerta. Una semana de termómetro les da la razón a unos pocos, y con eso arman lo que van a llevarle a la dirección. La escuela es el terreno: no hay que salir.",
  desacuerdo: {
    sobre_que:
      "¿Por dónde se nos escapa el calor de esta sala? Todos tienen una opinión y casi todos van a decir la puerta, porque es donde se siente la corriente.",
    como_se_ve:
      "Dibuja el plano de la sala grande en la pizarra y que cada uno pase a poner una flecha donde cree. Van a quedar racimos de flechas en la puerta y casi ninguna en la ventana. Esa pizarra se copia en una hoja y no se borra en toda la ruta.",
    quien_lo_zanja:
      "Lo que se siente y lo que se mide no son lo mismo, y esa es exactamente la pelea. Ninguno puede ganarla argumentando: solo el termómetro puesto una semana, siempre a la misma hora, puede darle la razón a alguien.",
  },
  instruccion_explicita: {
    duracion_min: 20,
    que_hacen_los_estudiantes:
      "Antes de que expliques nada: cada uno dibuja la sala por dentro y marca con flechas por dónde cree que se escapa el calor. Sin ponerse de acuerdo. Después arman la tabla de horas que van a llenar toda la semana, y al final compararán las flechas con lo que midieron.",
    notas_para_el_docente: [
      "Temperatura es qué tan caliente está algo. Calor es la energía que se pasa de lo caliente a lo frío.",
      "El calor siempre va en la misma dirección: de lo caliente a lo frío. Nunca al revés.",
      "Por eso la sala se enfría de noche: el calor se va afuera, no es que entre el frío.",
      "Pon la mano en el vidrio y después en la pared de madera. Distinta temperatura, misma sala: por ahí se escapa.",
    ],
    conceptos_clave: ["temperatura", "calor", "de caliente a frío"],
    errores_frecuentes: [
      "decir que «entra el frío»",
      "confundir que algo se sienta frío con que esté más frío",
    ],
    comprobacion: {
      pregunta:
        "Es de noche, la sala está a 12 grados y afuera hay 4. ¿Qué está pasando en la ventana? Responden todos a la vez con los dedos: uno, entra frío; dos, sale calor; tres, las dos cosas.",
      respuestas: [
        {
          dice: "Dos dedos: sale calor",
          significa: "Es la respuesta, y la única. Lo que se mueve es el calor y va hacia afuera.",
        },
        {
          dice: "Un dedo: entra frío",
          significa:
            "Es como se habla en la casa y además coincide con lo que se siente en la piel. Contra eso no gana una frase dicha una vez: gana la mano puesta en el vidrio.",
        },
        {
          dice: "Tres dedos: las dos cosas",
          significa:
            "Está negociando entre lo que acaba de oír y lo que siempre ha dicho. Este es el que hay que atender: ya sabe la respuesta correcta, pero todavía no ha soltado la suya.",
        },
      ],
      si_falla:
        "Si falla más de un cuarto —y va a fallar— no lo repitas. Pon la mano de uno en el vidrio y pregúntale qué se enfría, si su mano o el vidrio. El calor va de su mano al vidrio, y eso se entiende con la mano puesta, no escuchándolo.",
    },
  },
  ejemplo_resuelto: {
    situacion: "La sala de clases, un martes de julio.",
    pasos: [
      {
        paso: 1,
        accion: "Medir la temperatura al llegar, al recreo, después de almuerzo y al salir.",
        razonamiento: "Una sola medida no dice nada. La curva del día sí.",
        resultado: "8:30 → 9 °C · 10:30 → 13 °C · 14:00 → 16 °C · 16:30 → 12 °C.",
      },
      {
        paso: 2,
        accion: "Medir en el mismo momento junto al vidrio, junto a la pared y al centro.",
        razonamiento: "Si hay diferencias dentro de una misma sala, por ahí se está yendo la energía.",
        resultado: "Al centro 16 °C · junto a la pared 15 °C · junto al vidrio 11 °C.",
      },
      {
        paso: 3,
        accion: "Restar para ver dónde está la diferencia grande.",
        razonamiento: "La diferencia mayor marca el punto de escape.",
        resultado: "Centro menos vidrio: 5 grados. Centro menos pared: 1 grado.",
      },
      {
        paso: 4,
        accion: "Comparar con la temperatura de afuera.",
        razonamiento: "Cuanto mayor la diferencia con afuera, más rápido se escapa el calor.",
        resultado: "Afuera 6 °C. El vidrio está a mitad de camino entre la sala y la calle.",
      },
    ],
    respuesta:
      "El calor se escapa cinco veces más rápido por la ventana que por la pared de madera. Y la ventana es una décima parte de la sala.",
  },
  practica_guiada: {
    como_trabajan:
      "La tabla del día la llenas tú en la pizarra con los datos que ellos cantan en voz alta. El gráfico, en parejas y en el cuaderno cuadriculado.",
    ejercicios: [
      {
        enunciado: "Con los cuatro datos del día, dibuja el gráfico de la temperatura hora por hora.",
        apoyo: "Horas abajo, grados a la izquierda. Un punto por medida y después únelos.",
        respuesta_esperada: "Sube hasta las 14:00 y baja.",
      },
      {
        enunciado: "¿A qué hora la sala pierde calor más rápido? ¿Cómo lo sabes por el gráfico?",
        apoyo: "Busca dónde la línea baja más empinada.",
        respuesta_esperada: "Al final de la tarde, donde el tramo cae más rápido.",
      },
    ],
  },
  practica_autonoma: {
    como_trabajan:
      "Cada uno con su cuaderno cuadriculado, solo. Regla obligatoria. El que termina el gráfico empieza las preguntas sin avisar.",
    ejercicios: [
      {
        enunciado: "Dibuja el plano de la sala y marca con color los tres puntos donde midieron, con su temperatura.",
        respuesta_esperada: "Debe verse frío en la ventana y templado al centro.",
      },
      {
        enunciado: "Propón dos cosas que se podrían hacer en la sala para que no se escape el calor, y explica por qué funcionarían.",
        respuesta_esperada: "Tapar rendijas, cortina gruesa. Debe aparecer la idea de poner una barrera.",
      },
    ],
  },
  salida_terreno: {
    duracion_min: 60,
    preparacion: [
      "dos termómetros",
      "cuaderno cuadriculado",
      "regla",
      "un reloj",
      "una vela o un papelito para ver por dónde entra el aire",
    ],
    protocolo: [
      {
        campo: "temperatura_centro_c",
        etiqueta: "Temperatura al centro",
        instruccion: "Al centro de la sala, a la altura de la mesa. Cuatro veces al día, siempre a la misma hora.",
        unidad: "°C",
        tipo: "numero",
      },
      {
        campo: "temperatura_ventana_c",
        etiqueta: "Temperatura junto a la ventana",
        instruccion: "A un palmo del vidrio, sin que le dé el sol directo. A la misma hora que la del centro.",
        unidad: "°C",
        tipo: "numero",
      },
      {
        campo: "temperatura_exterior_c",
        etiqueta: "Temperatura afuera",
        instruccion: "A la sombra, fuera de la sala. A la misma hora.",
        unidad: "°C",
        tipo: "numero",
      },
      {
        campo: "por_donde_entra_aire",
        etiqueta: "Por dónde entra el aire",
        instruccion: "Pasa el papelito por los bordes de puertas y ventanas y anota dónde se mueve.",
        tipo: "texto",
      },
    ],
    seguridad: [
      "Los termómetros no se dejan al alcance de los más chicos",
      "Si se usa vela, la sostiene el profesor",
    ],
    lo_que_eligen: {
      que_eligen:
        "Dónde poner los termómetros, cuántos días y a qué horas. Hay dos o tres termómetros y veinte sitios candidatos: elegir no es opcional.",
      en_que_cambia:
        "Si eligen mal —con el sol dando en el vidrio, o a distinta hora cada día— los números no van a servir y van a tener que repetir la semana. Vale la pena dejarlos equivocarse en algo pequeño: una medición inservible enseña más sobre medir que tres que salieron bien.",
      como_lo_defienden:
        "La regla la escriben ellos y queda pegada en la pared: dónde, a qué hora, quién. El que mide tiene que poder repetir mañana exactamente lo mismo, y el resto del curso se lo puede exigir.",
    },
  },
  vuelta_del_terreno: {
    como_empieza:
      "Cada uno saca el plano del primer día, con sus flechas de por dónde creía que se escapaba el calor, y le escribe encima los grados que midieron en cada punto.",
    que_comparan:
      "Las flechas contra las diferencias de temperatura. Casi todos habían puesto flechas en la puerta, porque ahí se siente la corriente; el hoyo grande casi siempre está en la ventana, que nadie marcó porque el vidrio no sopla. Ese desajuste es el que hace que la palabra «calor» les cambie de significado.",
    si_no_calza:
      "Si la ventana marcó lo mismo que el centro, mira a qué hora midieron: con el sol dando en el vidrio el termómetro está contando otra cosa. Se repite a primera hora, antes de que le llegue el sol.",
    con_la_comunidad:
      "Junto a esto va lo que les contaron de la ruka: por qué el fogón iba al centro y no contra la pared. Es la misma idea que van a poner en el informe para la dirección, resuelta mucho antes y sin termómetro.",
  },
  borrador_y_critica: {
    primera_version:
      "El plano con los escapes marcados y los grados que se pierden, hecho a mano y sin pasar a limpio, más una frase de qué habría que arreglar primero y por qué eso y no otra cosa.",
    como_se_critica:
      "Antes de ir a la dirección se lo presentan al otro curso, que tiene un solo trabajo: hacer las preguntas incómodas. «¿Cómo saben que es la ventana y no la puerta?» «¿Y si ese día estaba nublado?» Cada pregunta que no sepan contestar se anota en una lista a la vista de todos.",
    que_mejora:
      "La segunda versión contesta esa lista, o dice con todas sus letras qué no pueden saber con lo que midieron. Un informe que reconoce su propio límite es mucho más difícil de desarmar, y eso es justo lo que necesitan cuando lo lleven a la dirección.",
  },
  recuperacion_espaciada: [
    {
      semanas_despues: 1,
      pregunta:
        "Su sala marcó {dato_del_estudiante} °C junto al vidrio. ¿Cuántos grados de diferencia había con el centro?",
      respuesta_esperada: "Depende de su medición. Lo que importa es que la diferencia exista.",
    },
    {
      semanas_despues: 3,
      pregunta: "¿Por qué está mal decir que «entra el frío» por la ventana?",
      respuesta_esperada: "Porque lo que se mueve es el calor, y se va hacia afuera.",
    },
    {
      semanas_despues: 6,
      pregunta: "Si taparan las rendijas, ¿cambiaría la temperatura del centro o la de la ventana?",
      respuesta_esperada: "Las dos, pero se nota primero en la ventana.",
    },
  ],
  materiales: ["termómetro", "cuaderno cuadriculado", "regla", "reloj"],
  requiere_consulta: false,
  niveles: ["5to_basico", "6to_basico", "7mo_basico", "8vo_basico"],
  por_nivel: [
    {
      nivel: "5to_basico",
      objetivo_codigo: "OA13_CN_5",
      objetivo_descripcion: "Características de los océanos y lagos: variación de temperatura.",
      practica_guiada: {
        ejercicios: [
          {
            enunciado: "Ordena de menor a mayor las temperaturas que midió el curso y di cuál es la del medio.",
            apoyo: "Escríbelas todas en fila primero.",
            respuesta_esperada: "La lista ordenada y el valor central.",
          },
        ],
      },
      practica_autonoma: {
        ejercicios: [
          {
            enunciado: "Dibuja un termómetro y marca en él las cuatro temperaturas del día.",
            respuesta_esperada: "Las cuatro marcas en el orden correcto.",
          },
        ],
      },
      mientras_esperan:
        "Con el cuaderno cerrado escriben las cuatro temperaturas del día en el orden en que las tomaron. Recién después abren y ven cuáles acertaron. Al final pintan de rojo la más alta y de azul la más baja: así ven la forma del día sin necesitar todavía un gráfico.",
      rol_en_terreno: "Leen el termómetro del centro de la sala y cantan el número en voz alta.",
    },
    {
      nivel: "6to_basico",
      objetivo_codigo: "OA15_CN_6",
      objetivo_descripcion: "Medir e interpretar la información obtenida al calentar y enfriar el agua.",
      practica_guiada: {
        ejercicios: [
          {
            enunciado:
              "Pon un tarro de agua al sol y otro a la sombra. Mide cada diez minutos durante media hora y anota.",
            apoyo: "Los dos tarros iguales y con la misma cantidad de agua, o no vale.",
            respuesta_esperada: "El del sol sube más rápido. Debe quedar la tabla.",
          },
        ],
      },
      practica_autonoma: {
        ejercicios: [
          {
            enunciado: "Dibuja las dos curvas en el mismo gráfico y explica por qué se separan.",
            respuesta_esperada: "El sol entrega energía; a la sombra no llega.",
          },
        ],
      },
      mientras_esperan:
        "Vigilan los dos tarros y anotan la temperatura cada diez minutos, por turnos. Se organizan solos con el reloj.",
      rol_en_terreno: "Miden la temperatura junto a la ventana y afuera, a la misma hora que 5º.",
    },
    {
      nivel: "7mo_basico",
      objetivo_codigo: "OA12_CN_7",
      objetivo_descripcion: "El clima en la Tierra es dinámico y se explica por varios factores.",
      practica_guiada: {
        ejercicios: [
          {
            enunciado:
              "Con las temperaturas de afuera de toda la semana, calcula la máxima, la mínima y el promedio.",
            apoyo: "Suma todas y divide por cuántas son.",
            respuesta_esperada: "Los tres números, con su unidad.",
          },
        ],
      },
      practica_autonoma: {
        ejercicios: [
          {
            enunciado: "¿Por qué la diferencia entre el día y la noche es mayor cuando el cielo está despejado?",
            respuesta_esperada: "Sin nubes que retengan, el calor se escapa hacia arriba.",
          },
        ],
      },
      mientras_esperan:
        "Ordenan la planilla de la semana completa y sacan los promedios con la calculadora. Si un número se sale de todos los demás no lo borran: lo encierran en un círculo y al final te dicen cuál era, y entre los dos se decide si entra al promedio o no.",
      rol_en_terreno: "Llevan el registro de la semana y anotan si el cielo está despejado o nublado.",
    },
    {
      nivel: "8vo_basico",
      objetivo_codigo: "OA11_CN_8",
      objetivo_descripcion: "El calor es una forma de transferencia de energía.",
      practica_guiada: {
        ejercicios: [
          {
            enunciado:
              "Con los promedios de 7º, calcula cuántos grados pierde la sala por hora después de las 14:00.",
            apoyo: "Divide la caída total por las horas que pasaron.",
            respuesta_esperada: "Un número de grados por hora, con su unidad.",
          },
        ],
      },
      practica_autonoma: {
        ejercicios: [
          {
            enunciado:
              "Explica por dónde se va esa energía y por qué la ventana pesa más que la pared aunque sea más pequeña.",
            respuesta_esperada: "El vidrio conduce mucho mejor que la madera.",
          },
        ],
      },
      mientras_esperan:
        "Recorren la sala con el papelito buscando por dónde entra aire y dibujan el plano marcando cada rendija.",
      rol_en_terreno: "Buscan las rendijas con el papelito y hacen el plano de escapes de la sala.",
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────

export const RUTAS: Ruta[] = [
  {
    id: "agua",
    titulo: AGUA.titulo,
    gancho: "Miden cuánta agua lleva el estero de al lado y la comparan con lo que gasta la escuela.",
    lugar: "Un estero, una vertiente o un río al que se pueda llegar caminando.",
    semanas: 3,
    preguntaGuia:
      "¿Le alcanza el agua de nuestro estero para la escuela y las casas de alrededor, todo el año?",
    producto: {
      que: "Un informe de una plana con el caudal que midieron, comparado con lo que gasta la escuela en una semana.",
      paraQuien: "El comité de agua potable rural, o la directiva de la junta de vecinos.",
    },
    fases: [
      {
        semana: 1,
        titulo: "La sala se divide, y aprenden a medir",
        queOcurre:
          "El curso se parte entre los que dicen que el estero alcanza y los que dicen que no, y queda claro que eso no se gana discutiendo. Recién ahí explicas cómo se mide, muestras el ejemplo resuelto y practican.",
      },
      {
        semana: 2,
        titulo: "Salen a buscar el número que falta",
        queOcurre:
          "Llegan sabiendo qué mirar, y eligen ellos en qué tres puntos medir. Cada curso levanta su parte y se la pasa al que la necesita.",
      },
      {
        semana: 3,
        titulo: "Comparan, escriben y rehacen",
        queOcurre:
          "Destapan la pizarra del primer día y ven quién tenía razón. Sacan la cuenta, escriben una primera plana, se la critican entre grupos, y entregan la segunda versión junto con la primera.",
      },
    ],
    cubre: [
      {
        nivel: "5to_basico",
        codigos: ["OA12_CN_5", "OA13_CN_5", "OA14_CN_5"],
        postura: "explorar",
        papel: "Dibujan el mapa del estero y toman el tiempo del flotador.",
      },
      {
        nivel: "6to_basico",
        codigos: ["OA01_CN_6", "OA15_CN_6"],
        postura: "explorar",
        papel: "Anotan quién vive del estero y qué encuentran bajo las piedras.",
      },
      {
        nivel: "7mo_basico",
        codigos: ["OA12_CN_7"],
        postura: "actuar",
        papel: "Miden ancho y hondo, sacan la cuenta y escriben el informe que se entrega.",
      },
    ],
    mapuzugun: [
      { termino: "ko", castellano: "agua" },
      { termino: "lewfü", castellano: "río" },
      { termino: "witrunko", castellano: "agua que corre", nota: "estero, agua en movimiento" },
      { termino: "menoko", castellano: "ojo de agua", nota: "vertiente o humedal; sitio con dueño y con reglas" },
      { termino: "trayenko", castellano: "salto de agua" },
    ],
    kimun: {
      pregunta: "¿Hasta dónde llegaba el estero cuando usted era niño, y en qué mes bajaba?",
      aQuien: "Una persona mayor de la comunidad, o el educador tradicional de la escuela.",
    },
    naturaleza: {
      grupos: ["Amphibia", "Actinopterygii", "Insecta", "Plantae"],
      para: "Lo que vive en el agua y en la orilla, para saber a quién le importa este estero además de a ustedes.",
    },
    secuencia: AGUA,
  },
  {
    id: "redes",
    titulo: REDES.titulo,
    gancho: "Arman la red alimentaria de un metro cuadrado de bosque con los bichos que ellos levantan.",
    lugar: "Un bosque nativo, un renoval o un matorral. Basta un metro cuadrado.",
    semanas: 3,
    preguntaGuia:
      "¿Qué se lleva por delante nuestro bosque si desaparece un solo ser vivo de los que hay ahí?",
    producto: {
      que: "Un mural con la red alimentaria del bosque de al lado, dibujada con los seres vivos que ellos mismos encontraron.",
      paraQuien: "Las familias, en una tarde en la escuela donde el curso lo explica.",
    },
    fases: [
      {
        semana: 1,
        titulo: "Discuten de qué se puede prescindir",
        queOcurre:
          "Votan de cuál ser vivo creen que el bosque podría prescindir, y no hay cómo probarlo desde la sala. Después explicas la regla de las flechas, muestras el ejemplo, y lo primero que corrigen es su propio papel.",
      },
      {
        semana: 2,
        titulo: "Salen a levantar su metro cuadrado",
        queOcurre:
          "Cada grupo elige su pedazo de bosque y defiende por qué ese. Levantan piedras, cuentan y devuelven todo a su sitio.",
      },
      {
        semana: 3,
        titulo: "Arman el mural, se lo critican y lo rehacen",
        queOcurre:
          "Comparan lo que imaginaban con lo que apareció. Montan la red a lápiz, cada grupo le busca las flechas flojas al de al lado, y la versión que se pega es la segunda.",
      },
    ],
    cubre: [
      {
        nivel: "5to_basico",
        codigos: ["OA01_CN_5"],
        postura: "explorar",
        papel: "Marcan el metro cuadrado y cuentan las plantas de dentro.",
      },
      {
        nivel: "6to_basico",
        codigos: ["OA02_CN_6", "OA03_CN_6"],
        postura: "explorar",
        papel: "Levantan las piedras con la lupa y anotan lo que sale.",
      },
      {
        nivel: "7mo_basico",
        codigos: ["OA05_CN_7"],
        postura: "actuar",
        papel: "Miden la hojarasca y explican quién devuelve todo al suelo.",
      },
      {
        nivel: "8vo_basico",
        codigos: ["OA04_CN_8"],
        postura: "actuar",
        papel: "Comparan hojas de sol y de sombra, y dirigen el montaje del mural.",
      },
    ],
    mapuzugun: [
      { termino: "mawiza", castellano: "bosque, montaña con monte" },
      { termino: "anümka", castellano: "planta, árbol plantado" },
      { termino: "koyam", castellano: "roble" },
      { termino: "üñüm", castellano: "pájaro" },
      { termino: "lawen", castellano: "planta que cura", nota: "el uso medicinal es conocimiento de la comunidad" },
    ],
    kimun: {
      pregunta: "¿Qué plantas de este monte se usan, para qué, y en qué época se recogen?",
      aQuien: "La lawentuchefe de la comunidad, si la hay, o el educador tradicional.",
    },
    naturaleza: {
      grupos: ["Plantae", "Insecta", "Aves", "Fungi", "Mollusca"],
      para: "Las piezas de la red alimentaria que ya se han registrado por aquí, con su nombre.",
    },
    secuencia: REDES,
  },
  {
    id: "suelo",
    titulo: SUELO.titulo,
    gancho: "Leen las capas de un corte de camino y descubren por qué esta tierra no retiene el agua.",
    lugar: "Un corte de camino, una barranca o una zanja donde se vean las capas del suelo.",
    semanas: 3,
    preguntaGuia:
      "¿Por qué esta tierra se nos seca en enero, si en invierno llueve tanto?",
    producto: {
      que: "Una ficha del suelo de la escuela: qué capas tiene, cuánta agua retiene y qué conviene sembrar.",
      paraQuien: "Quien cultiva la huerta de la escuela y las familias que siembran cerca.",
    },
    fases: [
      {
        semana: 1,
        titulo: "Salen explicaciones que no se pueden separar",
        queOcurre:
          "Proponen por qué la tierra se seca en enero y todas las explicaciones suenan razonables. Después explicas las capas, muestras el ejemplo con las medidas tomadas, y practican los cálculos.",
      },
      {
        semana: 2,
        titulo: "Salen a traer la tierra",
        queOcurre:
          "Deciden ellos dónde empieza y termina cada capa, y lo defienden con palitos clavados. Toman muestras y hacen el experimento del tarro con agua.",
      },
      {
        semana: 3,
        titulo: "Escriben la ficha y se la corrigen",
        queOcurre:
          "Ven cuál de las explicaciones del primer día sobrevivió. Escriben la ficha, se la da a leer a quien cultiva, y la segunda versión traduce los mililitros a cuándo hay que regar.",
      },
    ],
    cubre: [
      {
        nivel: "6to_basico",
        codigos: ["OA16_CN_6", "OA17_CN_6", "OA18_CN_6"],
        postura: "explorar",
        papel: "Miden y dibujan las capas con sus colores reales.",
      },
      {
        nivel: "7mo_basico",
        codigos: ["OA09_CN_7", "OA10_CN_7", "OA11_CN_7"],
        postura: "actuar",
        papel: "Hacen el experimento del agua y escriben la ficha que se entrega.",
      },
    ],
    mapuzugun: [
      { termino: "mapu", castellano: "tierra, suelo, territorio" },
      { termino: "kura", castellano: "piedra" },
      { termino: "rag", castellano: "greda, arcilla" },
      { termino: "trufken", castellano: "ceniza" },
      { termino: "degiñ", castellano: "volcán" },
    ],
    kimun: {
      pregunta: "¿Qué se siembra aquí y qué no prende nunca? ¿Desde cuándo se sabe eso?",
      aQuien: "Las familias que siembran cerca de la escuela.",
    },
    secuencia: SUELO,
  },
  {
    id: "calor",
    titulo: CALOR.titulo,
    gancho: "Miden su propia sala durante una semana y encuentran por dónde se les escapa el calor.",
    lugar: "La sala de clases. Esta ruta no necesita salir del recinto.",
    semanas: 4,
    preguntaGuia:
      "¿Por dónde se nos escapa el calor de la sala, y cuánto frío pasamos por eso?",
    producto: {
      que: "El plano de la sala con los escapes marcados y los grados que se pierden, más lo que costaría taparlos.",
      paraQuien: "La dirección de la escuela, para pedirlo al sostenedor con datos y no con quejas.",
    },
    fases: [
      {
        semana: 1,
        titulo: "Apuestan por dónde se escapa",
        queOcurre:
          "Cada uno pone su flecha en el plano de la pizarra y casi todas caen en la puerta. Esa pizarra no se borra. Después explicas tú, muestras la curva del día resuelta, y practican leyendo el termómetro.",
      },
      {
        semana: 2,
        titulo: "Miden la sala una semana entera",
        queOcurre:
          "Ellos deciden dónde van los termómetros y a qué horas, y escriben la regla en la pared. Cuatro veces al día, siempre igual. Sin salir del recinto.",
      },
      {
        semana: 3,
        titulo: "Ven quién tenía razón",
        queOcurre:
          "Ponen las flechas del primer día al lado de los grados medidos, y casi nadie había marcado la ventana. Con el papelito recorren puertas y ventanas y marcan cada rendija.",
      },
      {
        semana: 4,
        titulo: "Se lo critican y lo presentan",
        queOcurre:
          "El otro curso les hace las preguntas incómodas y anotan las que no saben contestar. La versión que llega a la dirección contesta esa lista. Con números, no con quejas.",
      },
    ],
    cubre: [
      {
        nivel: "5to_basico",
        codigos: ["OA13_CN_5"],
        postura: "explorar",
        papel: "Leen el termómetro del centro y cantan el número.",
      },
      {
        nivel: "6to_basico",
        codigos: ["OA10_CN_6", "OA14_CN_6", "OA15_CN_6"],
        postura: "explorar",
        papel: "Miden en la ventana y afuera, y llevan los dos tarros al sol y a la sombra.",
      },
      {
        nivel: "7mo_basico",
        codigos: ["OA12_CN_7"],
        postura: "actuar",
        papel: "Llevan la planilla de la semana y sacan los promedios.",
      },
      {
        nivel: "8vo_basico",
        codigos: ["OA11_CN_8"],
        postura: "actuar",
        papel: "Buscan las rendijas, hacen el plano de escapes y lo presentan.",
      },
    ],
    mapuzugun: [
      { termino: "kütral", castellano: "fuego" },
      { termino: "antü", castellano: "sol, día" },
      { termino: "wütre", castellano: "frío" },
      { termino: "aref", castellano: "calor" },
      { termino: "kürüf", castellano: "viento" },
    ],
    kimun: {
      pregunta: "¿Cómo se orientaba antes una ruka para que no entrara el viento, y por qué el fogón iba al centro?",
      aQuien: "El educador tradicional, o una persona mayor de la comunidad.",
    },
    secuencia: CALOR,
  },
];

export function rutaPorId(id: string): Ruta | undefined {
  return RUTAS.find((r) => r.id === id);
}
