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

export type Ruta = {
  id: string;
  titulo: string;
  /** De qué va, en una frase, para elegir sin abrirla. */
  gancho: string;
  /** Qué tipo de lugar hace falta. No un lugar concreto: cada escuela tiene el suyo. */
  lugar: string;
  semanas: number;
  /** Un código de objetivo por curso que la ruta atiende. */
  cubre: { nivel: string; codigos: string[] }[];
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
  sesiones: 4,
  sintesis_docente:
    "Miden cuánta agua lleva el estero que cruzan todos los días y la comparan con la que gasta la escuela en una semana. El número les sale a ellos.",
  instruccion_explicita: {
    duracion_min: 20,
    que_hacen_los_estudiantes:
      "Todos sentados, cuaderno abierto. Copian solo el dibujo del cauce visto desde arriba y las tres letras: ancho, hondo, rápido. Las frases no las copian.",
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
        "Pasan a limpio el dibujo del estero con las tres medidas anotadas y le ponen los nombres. Les toma toda la clase y no necesitan preguntarte nada.",
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
        "Ordenan por tamaño las hojas y bichos que recogieron y los pegan en el cuaderno con su nombre al lado. Trabajo de mesa, en silencio.",
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
  sesiones: 4,
  sintesis_docente:
    "Arman la red alimentaria de un pedazo de bosque que conocen, con los bichos que ellos mismos levantaron de debajo de las piedras y las hojas.",
  instruccion_explicita: {
    duracion_min: 20,
    que_hacen_los_estudiantes:
      "Sentados. Copian solo el esquema de las flechas que haces en la pizarra. Las flechas apuntan hacia quien come, no al revés: díselo dos veces.",
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
        "Pegan en el cuaderno las hojas que recogieron y escriben al lado de dónde salió cada una. Trabajo largo y callado.",
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
        "Pasan a limpio la red completa del curso en una hoja grande para pegarla en la pared. Entre varios y sin ti.",
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
  sesiones: 4,
  sintesis_docente:
    "Miran un corte de camino y leen ahí la historia del suelo: capas, ceniza volcánica, y por qué esta tierra retiene tan poca agua.",
  instruccion_explicita: {
    duracion_min: 20,
    que_hacen_los_estudiantes:
      "Sentados. Dibujan en el cuaderno el corte de tierra con sus capas, mirando la pizarra. Solo el dibujo, con los nombres de las capas.",
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
        "Pintan en el cuaderno el corte con los colores reales de cada capa, usando lápices de color. Les toma la clase entera.",
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
        "Clasifican las piedras que trajeron por textura y las pegan en una hoja con su nombre. En la mesa del fondo, sin ti.",
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
  sesiones: 4,
  sintesis_docente:
    "Miden la temperatura de su propia sala a lo largo del día y encuentran por dónde se les escapa el calor. La escuela es el terreno: no hay que salir.",
  instruccion_explicita: {
    duracion_min: 20,
    que_hacen_los_estudiantes:
      "Sentados. Copian del pizarrón la tabla de horas vacía, la que van a llenar los días siguientes. Solo la tabla.",
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
        "Copian la tabla del día en limpio y la decoran con los colores del frío y del calor. Trabajo tranquilo de toda la clase.",
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
        "Pasan a limpio la planilla de la semana completa y sacan los promedios con la calculadora. Es el dato que 8º necesita.",
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
    cubre: [
      { nivel: "5to_basico", codigos: ["OA12_CN_5", "OA13_CN_5", "OA14_CN_5"] },
      { nivel: "6to_basico", codigos: ["OA01_CN_6", "OA15_CN_6"] },
      { nivel: "7mo_basico", codigos: ["OA12_CN_7"] },
    ],
    secuencia: AGUA,
  },
  {
    id: "redes",
    titulo: REDES.titulo,
    gancho: "Arman la red alimentaria de un metro cuadrado de bosque con los bichos que ellos levantan.",
    lugar: "Un bosque nativo, un renoval o un matorral. Basta un metro cuadrado.",
    semanas: 3,
    cubre: [
      { nivel: "5to_basico", codigos: ["OA01_CN_5"] },
      { nivel: "6to_basico", codigos: ["OA02_CN_6", "OA03_CN_6"] },
      { nivel: "7mo_basico", codigos: ["OA05_CN_7"] },
      { nivel: "8vo_basico", codigos: ["OA04_CN_8"] },
    ],
    secuencia: REDES,
  },
  {
    id: "suelo",
    titulo: SUELO.titulo,
    gancho: "Leen las capas de un corte de camino y descubren por qué esta tierra no retiene el agua.",
    lugar: "Un corte de camino, una barranca o una zanja donde se vean las capas del suelo.",
    semanas: 3,
    cubre: [
      { nivel: "6to_basico", codigos: ["OA16_CN_6", "OA17_CN_6", "OA18_CN_6"] },
      { nivel: "7mo_basico", codigos: ["OA09_CN_7", "OA10_CN_7", "OA11_CN_7"] },
    ],
    secuencia: SUELO,
  },
  {
    id: "calor",
    titulo: CALOR.titulo,
    gancho: "Miden su propia sala durante una semana y encuentran por dónde se les escapa el calor.",
    lugar: "La sala de clases. Esta ruta no necesita salir del recinto.",
    semanas: 4,
    cubre: [
      { nivel: "5to_basico", codigos: ["OA13_CN_5"] },
      { nivel: "6to_basico", codigos: ["OA10_CN_6", "OA14_CN_6", "OA15_CN_6"] },
      { nivel: "7mo_basico", codigos: ["OA12_CN_7"] },
      { nivel: "8vo_basico", codigos: ["OA11_CN_8"] },
    ],
    secuencia: CALOR,
  },
];

export function rutaPorId(id: string): Ruta | undefined {
  return RUTAS.find((r) => r.id === id);
}
