/**
 * Con qué se mira cada objetivo en la sala.
 *
 * POR QUÉ NO SON LOS DEL MINISTERIO
 *
 * Se intentó traerlos. Los indicadores oficiales no están en las Bases
 * Curriculares ni en las fichas por objetivo del sitio del currículum: viven
 * dentro de los Programas de Estudio, que son documentos aparte y que hay que
 * descargar en PDF. Una profesora entrevistada los describió como imposibles de
 * encontrar, y tenía razón.
 *
 * Y cuando tuvo uno delante, tampoco le servía. Leyó en voz alta un indicador
 * de tecnología y su conclusión fue que jamás evaluaría nada con eso. Están
 * escritos para describir un currículum, no para mirar a veinte personas un
 * jueves a las diez.
 *
 * QUÉ SON ESTOS, ENTONCES
 *
 * Tres por objetivo, escritos para poder mirarlos. Cada uno dice una cosa que
 * se ve o se oye en la sala, no una capacidad abstracta. Si un indicador no se
 * puede comprobar mirando lo que el curso hace o entrega, está mal escrito y
 * hay que cambiarlo.
 *
 * Están para marcar, editar y completar, no para acatar. El docente los
 * corrige, que es mucho más rápido que escribirlos de cero, y esa es toda la
 * ayuda que esto pretende dar.
 *
 * SE DICE EN PANTALLA QUE NO SON LOS OFICIALES
 *
 * Arriba y no en letra chica, porque alguien va a copiar esta hoja en un
 * documento que se firma y tiene que saber qué está copiando. Si el
 * establecimiento pide los del programa, estos van además y no en lugar de
 * aquellos.
 *
 * SOLO ESTÁN LOS QUE EL CATÁLOGO USA
 *
 * Los noventa y tres objetivos que alguna actividad de alguna problemática
 * abre. Los otros doscientos sesenta se pueden marcar igual y el docente
 * escribe sus indicadores a mano; ofrecer trescientos cincuenta y tres juegos
 * de indicadores escritos de una sentada habría dado trescientos cincuenta y
 * tres juegos malos.
 */
export const INDICADORES: Record<string, string[]> = {
  /* ── Artes Visuales ──────────────────────────────────────────────────── */
  OA01_AR_5: [
    "Su trabajo muestra un lugar concreto del sector y no un paisaje genérico: se puede reconocer dónde es.",
    "Puede decir qué de lo que observó afuera terminó en su trabajo y qué decidió dejar fuera.",
    "Usa al menos una referencia visual del entorno cultural del lugar y explica de dónde la sacó.",
  ],
  OA01_AR_6: [
    "Ubica su trabajo en un punto del pueblo por el que pasa gente, y puede decir por qué ese punto y no otro.",
    "Menciona al menos una obra en espacio público, mural o escultura, que le sirvió de referencia.",
    "Su propuesta considera que va a ser vista de paso y no de frente: el tamaño y el contraste lo reflejan.",
  ],
  OA01_AR_8: [
    "Su trabajo parte de algo que observó en la relación entre la gente del lugar y su entorno, y lo puede nombrar.",
    "Distingue lo que su trabajo muestra de lo que su trabajo opina, y sabe cuál de los dos quiso hacer.",
    "Puede explicar por qué eligió ese material y no otro para hablar de ese problema.",
  ],
  OA03_AR_6: [
    "Aplica un procedimiento completo, de principio a fin, sin abandonarlo a mitad por dificultad técnica.",
    "Sabe decir qué hace bien y qué hace mal ese procedimiento para lo que quiere mostrar.",
    "Su resultado se sostiene físicamente en el sitio donde va a estar, y lo probó antes de instalarlo.",
  ],
  OA03_AR_7: [
    "Toma más imágenes de las que usa, y puede explicar por qué descartó las que descartó.",
    "Edita con una intención dicha en voz alta, no por probar filtros: sabe qué quiere que se note.",
    "Reconoce cuándo una edición cambió lo que la imagen afirma, y decide si eso es honesto o no.",
  ],
  OA03_AR_8: [
    "Su instalación usa el espacio y no solo está puesta ahí: la altura, la distancia y el recorrido están decididos.",
    "Puede explicar qué le pasa a quien la recorre, y lo comprobó con alguien que no es del curso.",
    "Prevé qué pasa con la instalación cuando llueve, hace viento o alguien la toca.",
  ],
  OA04_AR_8: [
    "Al mirar una obra nombra el contexto en que se hizo, y no solo lo que aparece en ella.",
    "Distingue el material del significado: puede decir qué aporta el material a lo que la obra dice.",
    "Formula una interpretación propia y la sostiene señalando algo concreto de la obra.",
  ],
  OA05_AR_6: [
    "Al comentar el trabajo de un compañero señala algo concreto, no «me gusta» ni «está bueno».",
    "Nombra a la vez una fortaleza y algo que cambiaría, y dice cómo lo cambiaría.",
    "Recibe una crítica y hace una segunda versión en la que se ve qué tomó de ella.",
  ],
  OA06_AR_7: [
    "Puede describir tres cosas del sitio donde se va a mostrar: por dónde entra la gente, cuánta luz hay y cuánto se detiene.",
    "Elige la altura y la distancia del montaje pensando en quién va a mirar, y lo dice.",
    "Anticipa un problema del sitio, como el sol de frente o el viento, y propone cómo resolverlo.",
  ],
  OA06_AR_8: [
    "Compara dos sitios posibles para mostrar y elige uno con un argumento sobre el público de cada uno.",
    "Puede decir qué le aporta a la comunidad que esto se muestre ahí y no dentro de la escuela.",
    "Después de mostrarlo, sabe decir quién llegó de verdad y en qué se equivocó al prever el público.",
  ],

  /* ── Ciencias Naturales ──────────────────────────────────────────────── */
  OA01_CN_5: [
    "Puede explicar con sus palabras que un ser vivo del lugar está formado por células, sin recitar la definición.",
    "Relaciona una estructura que observó con la función que cumple en el organismo.",
    "Usa un dibujo o un modelo para explicarlo, y el dibujo tiene rótulos que él puso.",
  ],
  OA01_CN_6: [
    "Puede nombrar lo que una planta necesita para producir azúcar y liberar oxígeno, sin leerlo.",
    "Diseña o sigue un montaje experimental en el que cambia una sola cosa por vez.",
    "Distingue lo que midió de lo que concluyó, y dice cuál de las dos cosas podría estar equivocada.",
  ],
  OA02_CN_6: [
    "Dibuja una cadena alimentaria con seres vivos del lugar y no con los del libro.",
    "Puede decir qué pasa aguas arriba en esa cadena si desaparece un eslabón del medio.",
    "Distingue una cadena de una red, y sabe por qué la red describe mejor lo que hay afuera.",
  ],
  OA03_CN_6: [
    "Nombra una actividad humana concreta del sector y el efecto que tiene sobre una red alimentaria.",
    "Distingue el efecto directo del indirecto, y da un ejemplo de cada uno.",
    "Al proponer una medida, puede decir sobre qué parte de la red actúa.",
  ],
  OA04_CN_8: [
    "Puede señalar en una planta del lugar una estructura que responde a algo del medio y decir a qué responde.",
    "Su modelo explica un comportamiento observado, no solo describe la planta.",
    "Reconoce que una respuesta de la planta tarda, y dice cuánto según lo que observó.",
  ],
  OA05_CN_7: [
    "Distingue virus, bacteria y hongo por alguna característica estructural y no solo por el nombre.",
    "Puede nombrar un caso del lugar donde un microorganismo afecta la salud o el agua.",
    "Reconoce que hay microorganismos que no hacen daño, y da un ejemplo.",
  ],
  OA11_CN_8: [
    "Distingue calor de temperatura al explicar por qué una sala se enfría, sin confundir los términos.",
    "Puede predecir en qué sentido va a fluir el calor entre dos cosas, y acierta.",
    "Su modelo explica una medición que tomó, no un caso del libro.",
  ],
  OA12_CN_5: [
    "Puede decir, con un orden de magnitud, cuánta del agua de la Tierra es dulce y accesible.",
    "Ubica el agua del sector en ese cuadro: de dónde viene y a qué parte del ciclo pertenece.",
    "Compara dos volúmenes y dice cuál es mayor sin necesitar la cifra exacta.",
  ],
  OA12_CN_7: [
    "Nombra al menos tres variables del clima y puede decir cómo se relacionan dos de ellas.",
    "Distingue el tiempo de un día del clima del lugar, con un ejemplo propio.",
    "Su modelo explica algo que pasó aquí, como un año seco o una helada fuera de época.",
  ],
  OA13_CN_5: [
    "Puede decir qué cambia con la profundidad en un cuerpo de agua y en qué sentido cambia.",
    "Relaciona esa variación con qué seres vivos hay a cada profundidad.",
    "Al medir en terreno, anota la profundidad junto al dato y no el dato solo.",
  ],
  OA14_CN_6: [
    "Usa calor y temperatura sin intercambiarlos al explicar una medición que tomó.",
    "Puede explicar por qué dos cosas a la misma temperatura no dan la misma sensación.",
    "Predice si algo se va a calentar o enfriar y dice de dónde sale o adónde va esa energía.",
  ],
  OA14_CN_7: [
    "Distingue una sustancia pura de una mezcla mirando una muestra que trajo del terreno.",
    "Elige un procedimiento de separación y puede decir en qué propiedad se apoya.",
    "Reconoce que una mezcla puede parecer homogénea y no serlo, y dice cómo lo comprobaría.",
  ],
  OA15_CN_6: [
    "Toma la temperatura a intervalos regulares y anota la hora junto a cada dato.",
    "Su gráfico muestra el cambio en el tiempo y puede señalar dónde algo se detuvo.",
    "Distingue el dato raro del error de medición, y dice cómo lo distinguió.",
  ],
  OA16_CN_6: [
    "Puede nombrar las tres capas y decir qué aporta cada una a que haya vida aquí.",
    "Ubica algo del sector en la capa que le corresponde.",
    "Explica qué pasaría con la vida del lugar si una de esas capas cambiara.",
  ],
  OA17_CN_6: [
    "Puede describir de qué está hecho el suelo de su sector, habiendo mirado una muestra.",
    "Nombra una propiedad del suelo que midió y dice para qué sirve saberla.",
    "Relaciona una práctica concreta del sector con el estado del suelo que observó.",
  ],
  OA18_CN_6: [
    "Identifica en terreno una señal de erosión y puede decir qué agente la produjo.",
    "Distingue erosión de otras causas de pérdida de suelo, con un argumento de lo que vio.",
    "Propone una medida y puede decir sobre qué agente actúa.",
  ],

  /* ── Matemática ──────────────────────────────────────────────────────── */
  OA03_MA_6: [
    "Escribe una razón entre dos cantidades que él mismo midió, y dice qué compara con qué.",
    "Reconoce que la razón no cambia si las dos cantidades crecen igual, y lo comprueba con sus datos.",
    "Traduce una razón al lenguaje corriente: «por cada tres de esto hay uno de aquello».",
  ],
  OA04_MA_6: [
    "Calcula un porcentaje de un dato que levantó en terreno y dice sobre qué total lo calculó.",
    "Distingue el porcentaje de la cantidad: sabe que el 40 por ciento de dos grupos distintos no es lo mismo.",
    "Representa el porcentaje de alguna manera visual y la elige a propósito.",
  ],
  OA05_MA_8: [
    "Calcula una variación porcentual entre dos mediciones propias y dice si subió o bajó.",
    "Reconoce que una bajada del 20 por ciento no se deshace con una subida del 20 por ciento.",
    "Puede decir qué significa esa variación para el lugar, no solo cuánto da.",
  ],
  OA07_MA_8: [
    "Reconoce en sus propios datos si el cambio es parejo o no, y lo justifica mirando la tabla.",
    "Puede decir qué representa la pendiente en el caso que está estudiando, con sus unidades.",
    "Usa la función para predecir un valor y después comprueba si acertó.",
  ],
  OA08_MA_7: [
    "Distingue en un caso del proyecto si dos cantidades van en proporción directa o inversa.",
    "Construye la tabla de valores antes de calcular, y la usa para explicar.",
    "Reconoce un caso que parece proporcional y no lo es, y dice por qué.",
  ],
  OA08_MA_8: [
    "Traduce una situación del proyecto a una ecuación, y dice qué representa cada término.",
    "Resuelve y después vuelve a la situación para comprobar si el resultado tiene sentido.",
    "Reconoce cuándo la ecuación no sirve para modelar eso, y lo dice.",
  ],
  OA09_MA_6: [
    "Encuentra la regla que relaciona las dos columnas de una tabla de datos propios.",
    "Usa esa regla para completar un valor que falta y comprueba con otro dato.",
    "Reconoce cuándo una tabla no tiene una regla y dice que no la tiene, en vez de inventarla.",
  ],
  OA15_MA_7: [
    "Explica por qué su muestra representa al sector, o reconoce por qué no lo representa.",
    "Estima el porcentaje de la población a partir de la muestra y lo escribe como estimación.",
    "Sabe que una muestra más grande da una estimación más confiable, y puede decir por qué.",
  ],
  OA16_MA_7: [
    "Construye una tabla de frecuencias con sus datos y distingue la absoluta de la relativa.",
    "Elige un tipo de gráfico y puede decir por qué ese y no otro para esos datos.",
    "Su gráfico tiene los ejes rotulados y las unidades puestas, sin que se lo pidan.",
  ],
  OA16_MA_8: [
    "Mira dos gráficos de los mismos datos y dice cuál muestra mejor lo que quiere mostrar.",
    "Detecta un gráfico que engaña, como un eje cortado, y explica en qué engaña.",
    "Al hacer su propio gráfico, decide si cortar el eje es honesto en ese caso.",
  ],
  OA17_MA_7: [
    "Calcula promedio, mediana y rango de sus datos y dice cuál describe mejor el conjunto.",
    "Detecta un dato atípico y decide si lo deja o lo saca, con un argumento.",
    "Explica por qué el promedio puede mentir cuando hay un dato muy alejado.",
  ],
  OA19_MA_6: [
    "Calcula un volumen de algo real del proyecto y expresa el resultado con su unidad.",
    "Convierte entre unidades de volumen cuando hace falta, sin equivocar el factor.",
    "Estima antes de calcular y compara su estimación con el resultado.",
  ],
  OA22_MA_5: [
    "Calcula el área de una figura regular del terreno y muestra cómo llegó al resultado.",
    "Estima el área de una figura irregular descomponiéndola, y dice cuánto puede errar.",
    "Expresa el resultado con la unidad correspondiente y con una precisión razonable.",
  ],
  OA22_MA_6: [
    "Pone los datos de dos grupos en el mismo tipo de diagrama para poder compararlos.",
    "Dice una diferencia entre los dos grupos que se ve en el diagrama y no en la tabla.",
    "Reconoce que dos muestras pequeñas pueden diferir por azar, y lo menciona.",
  ],
  OA23_MA_5: [
    "Calcula el promedio de sus mediciones y dice qué representa ese número en el terreno.",
    "Reconoce que el promedio solo no dice cuánto varían los datos.",
    "Interpreta el promedio en contexto: dice si es mucho o poco y comparado con qué.",
  ],
  OA26_MA_5: [
    "Lee un gráfico ajeno y extrae de él un dato concreto sin equivocarse de eje.",
    "Completa una tabla con sus propias mediciones, con encabezados y unidades.",
    "Elige entre barras y líneas según si los datos son categorías o van en el tiempo.",
  ],

  /* ── Tecnología ──────────────────────────────────────────────────────── */
  OA01_TE_7: [
    "Nombra una necesidad concreta del entorno cercano, con quién la tiene y desde cuándo.",
    "Distingue la necesidad de la solución que se le ocurrió, y no las confunde al explicarla.",
    "Puede decir qué cambiaría para esa persona si la necesidad se resolviera.",
  ],
  OA01_TE_8: [
    "Formula la oportunidad en términos de alguien concreto y no de «la gente».",
    "Justifica por qué hace falta un producto nuevo y no basta con uno que ya existe.",
    "Reconoce si lo que propone está al alcance del curso, con lo que hay y el tiempo que queda.",
  ],
  OA02_TE_5: [
    "Su plan tiene los pasos en orden y se puede seguir sin preguntarle a él.",
    "La lista de materiales dice cantidades y de dónde salen, no solo qué se necesita.",
    "Incluye las medidas de seguridad de las herramientas que va a usar, antes de usarlas.",
  ],
  OA02_TE_6: [
    "Su plan asigna un tiempo a cada paso y la suma cabe en las clases que hay.",
    "Estima el costo con precios reales y dice de dónde sacó los precios.",
    "Menciona una implicancia ambiental o social de los materiales que eligió.",
  ],
  OA02_TE_7: [
    "Su diseño responde a la necesidad que nombró antes, y se puede ver la relación.",
    "Usa material que ya existe en el lugar en vez de material que hay que comprar afuera.",
    "Lo que construye funciona, aunque sea mal, y puede decir en qué falla.",
  ],
  OA02_TE_8: [
    "El producto atiende la oportunidad que planteó, y se puede comprobar que la atiende.",
    "Puede decir en qué es eficiente y en qué no, sin defenderlo de oficio.",
    "Usó alguna herramienta digital en el proceso y sabe decir para qué le sirvió.",
  ],
  OA03_TE_5: [
    "Usa la herramienta con la técnica correcta y sin dañarse ni dañar el material.",
    "Lo que entrega está terminado: sin bordes sueltos ni partes a medio hacer.",
    "Cuando algo le sale mal, lo rehace en vez de disimularlo.",
  ],
  OA03_TE_8: [
    "Aplica criterios que fijó antes, y no los cambia después para que el resultado apruebe.",
    "Nombra una mejora concreta del producto y otra del proceso, distinguiéndolas.",
    "Acepta un resultado desfavorable de la evaluación sin justificarlo.",
  ],
  OA04_TE_6: [
    "Prueba el trabajo con alguien que no lo hizo, y anota lo que esa persona dice.",
    "Evalúa contra criterios escritos y no contra su impresión.",
    "Puede decir qué criterio no cumple y qué haría en una segunda versión.",
  ],
  OA04_TE_7: [
    "Ajusta cómo lo cuenta según a quién se lo cuenta, y lo puede explicar.",
    "Lo que comunica incluye el proceso y no solo el resultado terminado.",
    "Menciona un aspecto ético: permisos, crédito a quien ayudó, o qué decidió no publicar.",
  ],
  OA04_TE_8: [
    "Prepara dos versiones para dos audiencias distintas y sabe qué cambió entre ellas.",
    "Usa una herramienta digital adecuada al mensaje y no la primera que sabe usar.",
    "Pide permiso antes de publicar imágenes o voces de personas del lugar.",
  ],
  OA05_TE_5: [
    "Organiza sus datos en una planilla con encabezados y sin celdas sueltas.",
    "Hace un gráfico desde sus propios datos y puede explicar qué muestra.",
    "Arma una presentación donde cada lámina tiene una idea y no un párrafo.",
  ],
  OA05_TE_7: [
    "Encuentra una solución que ya existe para un problema parecido y la describe.",
    "Dice a qué necesidad respondía esa solución y en qué contexto se hizo.",
    "Compara esa solución con la suya y nombra una diferencia que importa.",
  ],
  OA06_TE_7: [
    "Nombra un efecto social y un efecto ambiental de una solución existente.",
    "Reconoce que una solución puede resolver una cosa y empeorar otra, con un ejemplo.",
    "Distingue el efecto buscado del efecto no previsto.",
  ],
  OA06_TE_8: [
    "Nombra un impacto positivo y uno negativo de la misma solución, sin quedarse en uno.",
    "Considera a quién beneficia y a quién perjudica, con nombres o grupos concretos.",
    "Menciona un aspecto ético que no es ambiental ni económico.",
  ],
  OA07_TE_5: [
    "Comprueba de dónde viene una información antes de usarla, y dice cómo lo comprobó.",
    "Reconoce qué datos personales no se publican, y por qué.",
    "Pide permiso antes de compartir algo de otra persona.",
  ],
  OA07_TE_6: [
    "Publica algo con un propósito dicho y no por publicar.",
    "Ajusta la privacidad de lo que publica a propósito, sabiendo quién puede verlo.",
    "Reconoce que lo publicado es difícil de retirar, y lo tiene en cuenta antes.",
  ],

  /* ── Historia, Geografía y Ciencias Sociales ─────────────────────────── */
  OA10_HI_5: [
    "Ubica en un mapa un recurso natural del sector y dice si es renovable o no.",
    "Explica qué significa cuidarlo en concreto, con una práctica del lugar.",
    "Distingue que un recurso renovable también se puede agotar si se usa más rápido de lo que se repone.",
  ],
  OA11_HI_5: [
    "Nombra un trabajo del sector que le agrega valor a un recurso natural, con nombre de quién lo hace.",
    "Distingue el recurso del producto que sale de él.",
    "Puede decir qué pasaría con ese trabajo si el recurso se acabara.",
  ],
  OA12_HI_6: [
    "Describe el ambiente natural de su sector con al menos tres criterios físicos.",
    "Nombra una oportunidad y una dificultad que ese ambiente le da a quien vive ahí.",
    "Da un ejemplo concreto de cómo la gente del lugar superó una de esas dificultades.",
  ],
  OA13_HI_5: [
    "Puede decir que un derecho no depende de quién sea la persona, y dar un ejemplo del lugar.",
    "Reconoce una situación del entorno donde un derecho no se está respetando.",
    "Distingue lo que es un derecho de lo que es un favor o una ayuda.",
  ],
  OA13_HI_6: [
    "Describe su localidad con rasgos físicos, humanos y económicos, sin mezclarlos.",
    "Usa un dato de fuente, como el censo, y dice de dónde lo sacó.",
    "Explica una relación entre dos de esos rasgos, no solo los enumera.",
  ],
  OA14_HI_6: [
    "Nombra un desastre natural que afectó a la región y dice cuándo fue.",
    "Distingue el fenómeno natural del desastre, y explica qué lo convierte en desastre.",
    "Puede decir qué cambió en el lugar después de eso.",
  ],
  OA15_HI_6: [
    "Nombra qué órgano del Estado decide sobre el asunto que están trabajando.",
    "Distingue un cargo de elección popular de uno designado, con un ejemplo de su comuna.",
    "Puede describir una manera concreta de participar que esté a su alcance.",
  ],
  OA17_HI_6: [
    "Reconoce que el derecho de una persona obliga a otras, incluido el Estado.",
    "Da un ejemplo del sector donde el respeto de un derecho depende de una institución.",
    "Puede citar un artículo o una idea de un texto de derechos, y dice de cuál.",
  ],
  OA18_HI_5: [
    "Su proyecto atiende un problema real de la comunidad y puede nombrar a quién afecta.",
    "Tiene un plan con pasos y un presupuesto con cifras, aunque sean estimadas.",
    "Al terminar, puede decir qué parte del plan se cumplió y qué parte no.",
  ],
  OA19_HI_5: [
    "Nombra una organización real del sector y dice qué problema resuelve.",
    "Explica cómo se organiza esa gente: quién decide, cada cuánto se juntan.",
    "Puede decir qué logra un grupo organizado que no logra una persona sola.",
  ],
  OA19_HI_6: [
    "Propone una forma concreta de proteger un derecho que vio vulnerado en el sector.",
    "Fundamenta la propuesta con algo más que su opinión.",
    "Reconoce una dificultad de su propia propuesta.",
  ],
  OA19_HI_7: [
    "Nombra un aporte concreto de otra cultura a la vida del lugar donde vive.",
    "Distingue reconocer la diversidad de solo tolerarla.",
    "Puede explicar qué se pierde cuando una cultura deja de transmitirse.",
  ],
  OA20_HI_7: [
    "Describe una situación de conflicto entre culturas sin reducirla a buenos y malos.",
    "Nombra una estrategia de resolución pacífica y dice en qué caso podría servir.",
    "En un debate en la sala, escucha el argumento contrario y lo puede repetir bien antes de responder.",
  ],
  OA21_HI_7: [
    "Nombra una forma en que la gente del lugar se adaptó a su medio.",
    "Identifica un factor que explica por qué se asentaron ahí y no en otra parte.",
    "Reconoce una fragilidad del medio frente a lo que la gente hace.",
  ],
  OA21_HI_8: [
    "Usa un índice demográfico del censo de su comuna y dice qué mide.",
    "Relaciona el aislamiento del sector con un efecto concreto en salud, trabajo o educación.",
    "Distingue el dato de la explicación, y sabe cuál de los dos le falta.",
  ],
  OA22_HI_5: [
    "Lee una noticia entera antes de opinar sobre ella.",
    "Puede decir de qué medio es, de cuándo, y quién la escribió.",
    "Su opinión menciona algo que dice la noticia y no solo lo que él ya pensaba.",
  ],
  OA22_HI_7: [
    "Nombra un impacto concreto de la acción humana sobre el medio en su sector.",
    "Nombra también una forma en que el medio afecta a la población de ahí.",
    "Evalúa una medida diciendo qué mejora y qué no resuelve.",
  ],
  OA22_HI_8: [
    "Usa el concepto de desarrollo para comparar dos zonas y no solo para describir una.",
    "Nombra una ventaja comparativa real de su región.",
    "Distingue crecimiento de desarrollo sustentable, con un ejemplo.",
  ],
  OA23_HI_6: [
    "Participa en el proyecto con una tarea asignada que cumple en el plazo.",
    "El proyecto tiene un plan y un presupuesto escritos antes de empezar.",
    "Puede decir qué aportó su parte al resultado del conjunto.",
  ],
  OA23_HI_7: [
    "Investiga una problemática ambiental usando al menos dos fuentes distintas.",
    "Baja el fenómeno global a lo que se ve en su sector, con un dato propio.",
    "Evalúa el impacto local sin exagerarlo ni minimizarlo, y sostiene la medida con evidencia.",
  ],
  OA26_HI_6: [
    "Se informa en más de una fuente antes de formarse una opinión.",
    "Distingue una noticia de una columna de opinión en el material que trae.",
    "Su opinión cambia o se matiza cuando aparece un dato nuevo, y lo reconoce.",
  ],

  /* ── Lenguaje ────────────────────────────────────────────────────────── */
  OA07_LE_6: [
    "Puede decir quién escribió un texto y qué podría ganar con que se le crea.",
    "Distingue en la nota los hechos de las opiniones, señalándolos.",
    "Detecta qué información falta en el texto para poder juzgarlo.",
  ],
  OA12_LE_7: [
    "Escribe un texto propio donde se reconoce una voz y no un resumen de lo leído.",
    "Elige el género a propósito y puede decir por qué ese y no otro.",
    "Revisa y entrega una segunda versión distinta de la primera.",
  ],
  OA13_LE_5: [
    "Escribe con frecuencia y no solo cuando se lo piden evaluado.",
    "Sus textos tienen una idea propia, no solo lo que se espera que diga.",
    "Puede leer en voz alta lo que escribió y sostenerlo delante del curso.",
  ],
  OA13_LE_7: [
    "Su texto explica un tema y se entiende sin que él esté al lado explicando.",
    "Organiza la información en un orden que puede justificar.",
    "Usa un dato de la investigación y dice de dónde lo sacó.",
  ],
  OA14_LE_7: [
    "Su texto tiene un destinatario nombrado y una petición clara.",
    "Sostiene la postura con al menos un dato y no solo con adjetivos.",
    "Anticipa una objeción del destinatario y la responde.",
  ],
  OA14_LE_8: [
    "Su texto explicativo distingue lo que se sabe de lo que se supone.",
    "Define los términos que su lector no tiene por qué conocer.",
    "El cierre dice algo que no estaba al principio.",
  ],
  OA15_LE_5: [
    "Su artículo informativo responde qué, quién, dónde y cuándo.",
    "Separa la información de su opinión, y sabe en qué parte está cada una.",
    "Usa una fuente y la nombra.",
  ],
  OA15_LE_8: [
    "Ajusta el tono al destinatario real, y puede decir qué habría cambiado con otro.",
    "Usa un recurso persuasivo a propósito y sabe nombrarlo.",
    "Reconoce cuándo un argumento suyo es débil y lo reemplaza.",
  ],
  OA22_LE_7: [
    "Habla mirando al público y no al papel durante la mayor parte de la exposición.",
    "Explica un término difícil sin que se lo pidan, porque prevé que no lo conocen.",
    "Responde una pregunta del público sin buscar al profesor con la mirada.",
  ],
  OA24_LE_7: [
    "Formula la pregunta de investigación antes de buscar, y la escribe.",
    "Usa más de una fuente y puede decir en qué se contradicen.",
    "Distingue lo que encontró de lo que concluyó.",
  ],
  OA25_LE_5: [
    "Comenta una obra señalando algo concreto de ella y no solo si le gustó.",
    "Relaciona lo que vio con algo del lugar donde vive.",
    "Escucha el comentario de un compañero y lo retoma en el suyo.",
  ],
  OA26_LE_8: [
    "Toma notas mientras escucha y esas notas le sirven después.",
    "Su síntesis conserva las ideas principales y deja fuera los detalles.",
    "Ordena la información de una manera que puede justificar.",
  ],
  OA30_LE_6: [
    "Usa en clase una palabra nueva que salió de lo que leyó o escuchó, y bien.",
    "Puede explicar qué significa esa palabra con sus propias palabras.",
    "Corrige a un compañero, o se deja corregir, cuando la palabra se usa mal.",
  ],
};

/** Los indicadores escritos para un objetivo, si los hay. */
export function indicadoresDe(codigo: string): string[] {
  return INDICADORES[codigo] ?? [];
}
