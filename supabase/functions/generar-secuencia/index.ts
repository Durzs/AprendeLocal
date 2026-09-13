/**
 * Generación de secuencias de enseñanza — Edge Function.
 *
 * Sustituye al endpoint `POST /sequences` de la API FastAPI. Era lo único que
 * de verdad necesitaba un servidor: la clave de Anthropic no puede viajar al
 * navegador. Todo lo demás —objetivos, puntos, progreso— lo sirve Supabase
 * directamente con sus políticas de lectura, así que con esto desaparece la
 * necesidad de desplegar y mantener un servicio aparte.
 *
 * Se consulta la base con el token de quien llama, no con la clave de
 * servicio: así siguen aplicándose las políticas RLS en lugar de saltárselas,
 * que era el problema de la API anterior.
 */

import { createClient } from "jsr:@supabase/supabase-js@2";

/**
 * Modelos por orden de preferencia.
 *
 * La lista anterior —claude-3-*, claude-2.1, claude-instant— estaba entera
 * descatalogada, y ese fue el origen de casi todo lo demás: las llamadas
 * fallaban, y para que algo volviera se añadieron reparador de JSON y relleno
 * de estructura. Con un modelo vigente esas muletas dejan de hacer falta.
 *
 * Sonnet primero por equilibrio entre calidad y latencia; Haiku como
 * alternativa rápida si Sonnet no estuviera disponible.
 */
const MODELOS_CANDIDATOS = [
  Deno.env.get("ANTHROPIC_MODEL"),
  "claude-sonnet-5",
  "claude-haiku-4-5-20251001",
  "claude-opus-5",
].filter(Boolean) as string[];

/**
 * Seis etapas con el ejemplo resuelto paso a paso no caben en 4096 tokens: la
 * respuesta se truncaba siempre. El tamaño lo controlan las cotas por lista
 * del prompt; esto es holgura para que no se corte a mitad del JSON.
 */
const MAX_TOKENS = 16000;

/**
 * Por debajo del límite del entorno, para poder responder con un motivo en vez
 * de que la ejecución muera sin dejar respuesta.
 */
const TIEMPO_MAXIMO_MS = 110_000;

const ETAPAS = [
  "instruccion_explicita",
  "ejemplo_resuelto",
  "practica_guiada",
  "practica_autonoma",
  "salida_terreno",
  "recuperacion_espaciada",
] as const;

/**
 * Idiomas en los que la función sabe hablarle al docente.
 *
 * Los mismos tres de la interfaz. Cualquier otro valor cae en español: el
 * piloto es en La Araucanía y ante la duda vale más el idioma de la sala.
 */
type Idioma = "es" | "en" | "pt";

function idiomaValido(valor: unknown): Idioma {
  const corto = String(valor ?? "").slice(0, 2).toLowerCase();
  return corto === "en" || corto === "pt" ? corto : "es";
}

/**
 * Lo que el modelo tiene que escribir en el idioma del docente.
 *
 * Las CLAVES del JSON siguen en español pase lo que pase: son el contrato con
 * la pantalla, y traducirlas la rompería en cuanto alguien cambiara de idioma.
 * Lo que cambia es el texto que se lee, no la estructura que lo sostiene.
 */
const INSTRUCCION_IDIOMA: Record<Idioma, string> = {
  es: "",
  en:
    "IDIOMA DE SALIDA: escribe TODO el texto legible (titulo, sintesis_docente, notas, " +
    "enunciados, instrucciones, preguntas, materiales, roles, etiqueta) en INGLÉS. Las claves del " +
    "JSON y los valores de 'tipo' se quedan EXACTAMENTE como están, en español. Los " +
    "nombres propios del territorio (Estero Trancura, Curarrehue, Lago Colico) no se traducen.",
  pt:
    "IDIOMA DE SALIDA: escribe TODO el texto legible (titulo, sintesis_docente, notas, " +
    "enunciados, instrucciones, preguntas, materiales, roles, etiqueta) en PORTUGUÉS DE BRASIL. Las " +
    "claves del JSON y los valores de 'tipo' se quedan EXACTAMENTE como están, en español. " +
    "Los nombres propios del territorio (Estero Trancura, Curarrehue, Lago Colico) no se traducen.",
};

const NOMBRE_VISIBLE: Record<Idioma, Record<string, string>> = {
  es: {
    instruccion_explicita: "lo que explicas tú en la clase 1",
    ejemplo_resuelto: "el ejemplo que muestras en la clase 1",
    practica_guiada: "los ejercicios que resuelven contigo",
    practica_autonoma: "los ejercicios que resuelven solos",
    salida_terreno: "la salida a medir",
    recuperacion_espaciada: "las preguntas de las semanas siguientes",
  },
  en: {
    instruccion_explicita: "what you explain in lesson 1",
    ejemplo_resuelto: "the example you show in lesson 1",
    practica_guiada: "the exercises they solve with you",
    practica_autonoma: "the exercises they solve alone",
    salida_terreno: "the fieldwork",
    recuperacion_espaciada: "the questions for the following weeks",
  },
  pt: {
    instruccion_explicita: "o que você explica na aula 1",
    ejemplo_resuelto: "o exemplo que você mostra na aula 1",
    practica_guiada: "os exercícios que resolvem com você",
    practica_autonoma: "os exercícios que resolvem sozinhos",
    salida_terreno: "a saída a campo",
    recuperacion_espaciada: "as perguntas das semanas seguintes",
  },
};

/**
 * Los avisos de validación, en el mismo idioma que la secuencia.
 *
 * Van juntos porque se leen juntos: una clase en inglés con las advertencias
 * en español es exactamente la mitad del trabajo, y es la mitad que se nota.
 */
const AVISOS: Record<Idioma, Record<string, (x?: string) => string>> = {
  es: {
    falta: (x) => `Falta ${x}`,
    sinPasos: () => "El ejemplo no trae los pasos resueltos",
    unPasoSinPorque: (x) => `En el ejemplo, el paso ${x} no explica por qué se hace así`,
    variosPasosSinPorque: (x) => `En el ejemplo, los pasos ${x} no explican por qué se hacen así`,
    sinResultado: () => "El ejemplo no termina en un resultado",
    sinMediciones: () => "La salida no dice qué hay que medir",
    medicionSinNombre: () => "Una de las mediciones no tiene nombre",
    medicionSinUnidad: (x) => `La medición «${x}» no dice en qué unidad anotarla`,
    sinReparto: () => "La secuencia no reparte el trabajo entre los cursos de la sala",
    sinActividad: (x) => `Sin actividad propia para ${x}`,
    cursoSinEjercicios: (x) => `El curso ${x} no tiene ejercicios`,
    pocaRecuperacion: () => "Hay que volver a preguntar al menos en dos momentos distintos",
    sinComprobacion: () =>
      "No trae la pregunta con la que sabrías quién entendió antes de soltarlos a practicar",
    sinVuelta: () =>
      "No dice qué pasa en la clase después de la salida, cuando comparan lo que midieron con lo que creían",
    sinDesacuerdo: () =>
      "No trae la pregunta que divide al curso y que da el motivo de salir. Sin ella la salida es confirmar lo que ya dijiste",
    sinRedComunitaria: () =>
      "Nadie del lugar entra con preguntas preparadas por los estudiantes: la visita se va a convertir en una charla",
    sinTransferencia: () =>
      "No hay una tarea final sobre otro lugar, así que no habrá manera de saber si entendieron la idea o se aprendieron este caso",
    sinEleccion: () =>
      "En la salida no queda nada en manos de ellos: van a llenar casillas que decidió otro",
    sinSegundaVersion: () =>
      "El trabajo se entrega en primera versión, sin que nadie se lo critique ni lo rehagan",
    relleno: (x) =>
      `${x}: el generador no lo devolvió. Lo que aparece es un texto de relleno, no una clase: escríbelo tú o vuelve a generar.`,
  },
  en: {
    falta: (x) => `Missing: ${x}`,
    sinPasos: () => "The example has no worked steps",
    unPasoSinPorque: (x) => `In the example, step ${x} does not explain why it is done that way`,
    variosPasosSinPorque: (x) =>
      `In the example, steps ${x} do not explain why they are done that way`,
    sinResultado: () => "The example does not end in a result",
    sinMediciones: () => "The fieldwork does not say what to measure",
    medicionSinNombre: () => "One of the measurements has no name",
    medicionSinUnidad: (x) => `The measurement “${x}” does not say which unit to record it in`,
    sinReparto: () => "The sequence does not divide the work between the grades in the room",
    sinActividad: (x) => `No work of their own for ${x}`,
    cursoSinEjercicios: (x) => `Grade ${x} has no exercises`,
    pocaRecuperacion: () => "You need to ask again at two separate moments at least",
    sinComprobacion: () =>
      "There is no question to tell you who understood before you let them practise",
    sinVuelta: () =>
      "It does not say what happens in the lesson after the fieldwork, when they compare what they measured with what they believed",
    sinDesacuerdo: () =>
      "There is no question that splits the class and gives them a reason to go out. Without it, the fieldwork only confirms what you already told them",
    sinRedComunitaria: () =>
      "Nobody from the area takes part with questions the students prepared: the visit will turn into a talk",
    sinTransferencia: () =>
      "There is no closing task about a different place, so there is no way to tell whether they grasped the idea or just memorised this case",
    sinEleccion: () =>
      "Nothing in the fieldwork is left to them: they will be filling in boxes somebody else decided",
    sinSegundaVersion: () =>
      "The work is handed over in its first version, with nobody critiquing it and nothing redone",
    relleno: (x) =>
      `${x}: the generator did not return it. What you see is filler text, not a lesson: write it yourself or generate again.`,
  },
  pt: {
    falta: (x) => `Falta ${x}`,
    sinPasos: () => "O exemplo não traz os passos resolvidos",
    unPasoSinPorque: (x) => `No exemplo, o passo ${x} não explica por que é feito assim`,
    variosPasosSinPorque: (x) =>
      `No exemplo, os passos ${x} não explicam por que são feitos assim`,
    sinResultado: () => "O exemplo não termina em um resultado",
    sinMediciones: () => "A saída não diz o que medir",
    medicionSinNombre: () => "Uma das medições não tem nome",
    medicionSinUnidad: (x) => `A medição «${x}» não diz em que unidade anotar`,
    sinReparto: () => "A sequência não divide o trabalho entre os anos da turma",
    sinActividad: (x) => `Sem atividade própria para ${x}`,
    cursoSinEjercicios: (x) => `O ano ${x} não tem exercícios`,
    pocaRecuperacion: () => "É preciso perguntar de novo em pelo menos dois momentos distintos",
    sinComprobacion: () =>
      "Não traz a pergunta com que você saberia quem entendeu antes de soltá-los para praticar",
    sinVuelta: () =>
      "Não diz o que acontece na aula depois da saída, quando comparam o que mediram com o que achavam",
    sinDesacuerdo: () =>
      "Não traz a pergunta que divide a turma e dá o motivo de sair. Sem ela a saída só confirma o que você já disse",
    sinRedComunitaria: () =>
      "Ninguém do lugar entra com perguntas preparadas pelos estudantes: a visita vai virar uma palestra",
    sinTransferencia: () =>
      "Não há uma tarefa final sobre outro lugar, então não dá para saber se entenderam a ideia ou decoraram este caso",
    sinEleccion: () =>
      "Na saída não sobra nada nas mãos deles: vão preencher casinhas que outra pessoa decidiu",
    sinSegundaVersion: () =>
      "O trabalho é entregue na primeira versão, sem que ninguém o critique nem o refaça",
    relleno: (x) =>
      `${x}: o gerador não devolveu. O que aparece é texto de preenchimento, não uma aula: escreva você ou gere de novo.`,
  },
};

const SYSTEM_PROMPT =
  `Escribes la clase del lunes para un profesor de escuela rural en La Araucanía. Muchos tienen la sala llena de cursos distintos a la vez: 5º, 6º y 7º sentados juntos, y un solo profesor.

Escribes PARA ÉL. No para una revista de educación, no para su jefe técnico, no para justificar el método. Él va a leer esto de pie, cinco minutos antes de entrar.

CÓMO SE ESCRIBE
Está PROHIBIDO usar estas palabras, y cualquier otra del mismo estilo: instrucción explícita, práctica guiada, práctica autónoma, recuperación espaciada, carga cognitiva, andamiaje, metacognición, aprendizaje significativo, competencia, transferencia, indagación, constructivismo, protocolo, insumo, dispositivo pedagógico, objetivo transversal.
Si necesitas decir eso, dilo en palabras normales: «lo explicas tú», «lo resuelven contigo», «lo resuelven solos», «se lo vuelves a preguntar en tres semanas».
Frases cortas. Tuteo. Verbos concretos: mide, anota, reparte, pega, sale, cuenta. Nada de «se sugiere que el estudiante logre»: escribe «que midan el ancho con la huincha».

QUÉ TIENE QUE QUEDAR CLARO
Un profesor no necesita saber por qué funciona. Necesita saber QUÉ PASA EN LA SALA: quién hace qué, dónde, con qué, y qué hacen los demás mientras tanto. Eso es lo que más falta hace y lo que peor se suele escribir.

Reglas que no puedes romper:

0. LA CLASE ARRANCA CON UNA PREGUNTA QUE PARTE AL CURSO EN DOS, y esa pregunta es la razón de salir. Escribe "desacuerdo": una pregunta sobre ESE lugar que no tenga respuesta en el libro, que los divida de verdad —van a quedar dos bandos y los dos con argumentos— y que NO se pueda ganar conversando. Di dónde se para cada uno, qué queda anotado en la pizarra, y por qué hace falta un dato de afuera para zanjarlo. Si la pregunta se contesta razonando desde la sala, no sirve: cámbiala.
   Esto es lo que separa un proyecto de una tarea larga. Sin ello el curso ejecuta un procedimiento que escribió otro para confirmar lo que el profesor ya dijo, y eso no es medir, es copiar con instrumentos.
1. EL LUGAR ES DE DONDE SALEN LOS NÚMEROS. El estero, el suelo o el bosque son el material del ejemplo y de los ejercicios. No son una excursión con nombre bonito.
2. EL EJEMPLO VA RESUELTO ENTERO. Paso a paso, con los números puestos y explicados, listo para copiar en la pizarra. Es lo más importante de todo: si el profesor tiene que inventarlo él, no le sirvió de nada.
3. SALEN A TERRENO DESPUÉS DE PRACTICAR, nunca antes. Llegan sabiendo qué mirar.
3c. DE DENTRO HACIA AFUERA, EN TRES ANILLOS. La primera semana NO sale del recinto: el patio, el baño, la propia sala. Ahí se observa, se cuenta y se arriesga una idea, y sale barato porque no hace falta permiso, ni transporte, ni que el día esté bueno. La segunda es el vecindario: la salida y la gente del lugar. La tercera no se camina, se piensa: de qué es caso particular esto, qué pasa cuenca arriba y cuenca abajo. Saltarse el primer anillo es lo que convierte el terreno en una excursión, porque quien no ha mirado nunca su patio con atención no tiene con qué comparar cuando llega al río.
3b. LA CLASE EMPIEZA CON ELLOS JUGÁNDOSELA, NO COPIANDO. Antes de que el profesor explique nada, cada estudiante deja por escrito o dibujado qué cree que va a encontrar, en cinco minutos y sin borrar. Ese papel se guarda y se saca al volver del terreno. Nunca escribas que copian del pizarrón: copiar los tiene ocupados y no los tiene pensando, y además deja intacta la idea equivocada con la que llegaron, que es justo la que la salida tiene que desarmar.
4. DI SIEMPRE QUÉ HACEN LOS ESTUDIANTES. En cada momento de la clase: si están sentados escuchando, si copian, si trabajan en parejas, si uno lee en voz alta. Y con qué: cuaderno, hoja, pizarra, huincha.
5. MATERIALES QUE HAY DE VERDAD: cuaderno, lápiz, huincha, lupa, termómetro, botellas recicladas, tarros, cordel, agua del estero. Nada que haya que comprar.
6. LO QUE MIDEN EN TERRENO SON COSAS CONCRETAS, con su unidad. En cada campo, "campo" es el identificador y va SIEMPRE en español con guiones bajos (ancho_cauce_m); "etiqueta" es el nombre que el curso lee en la hoja, en el idioma de salida.
7. AL VOLVER A PREGUNTAR, USA LO QUE ELLOS MISMOS MIDIERON, con marcadores {dato_del_estudiante}.
8. CULTURA MAPUCHE: solo si viene al caso, como conocimiento y nunca de adorno. Si la incluyes, marca requiere_consulta.
9. SALA MULTIGRADO. Con más de un objetivo son cursos distintos en la MISMA sala con UN profesor. No escribas varias clases en paralelo: escribe UNA. Lo que explicas y la salida son iguales para todos; lo que cambia por curso son los ejercicios y qué mide cada uno, y eso va en "por_nivel".
   Y lo más importante: el profesor solo puede estar en un puesto a la vez. En cada curso escribe "mientras_esperan": qué hace ese curso, callado y sin ti, mientras estás sentado con otro. Tiene que ser algo que puedan hacer solos y que dure. Si no lo dices, la clase se cae.
   En terreno, reparte el trabajo para que los cursos se necesiten: el mayor toma la medida que el menor necesita para su ejercicio.
   "mientras_esperan" NO es tenerlos entretenidos: nada de pasar a limpio, copiar en bonito ni decorar con colores. Tiene que ser trabajo que deje algo, y que ellos mismos puedan comprobar sin ti: escribir de memoria con el cuaderno cerrado y recién después abrir para ver qué faltaba; repartir en columnas lo que trajeron; sacar un promedio que otro curso necesita.
10. ANTES DE SOLTARLOS A PRACTICAR, EL PROFESOR TIENE QUE SABER QUIÉN ENTENDIÓ. Escribe "comprobacion": UNA pregunta que contesten TODOS a la vez —con los dedos, con un papelito, escribiendo una letra—, nunca «¿se entendió?» ni levantando la mano el que quiera. Elígela de manera que cada respuesta equivocada delate una confusión DISTINTA, y di en "significa" qué está pensando el que la da. En "si_falla", qué hacer si falla más de un cuarto del curso: no repetir lo mismo más fuerte, sino una cosa concreta y distinta.
11. LA CLASE DE VUELTA DEL TERRENO ES OBLIGATORIA. Escribe "vuelta_del_terreno": lo primero que pasa al entrar es que cada uno saca el papel del primer día y lo pone al lado de lo que midió. Primero la comparación, después los cálculos. Y di qué hacer con el dato raro: casi nunca es que el lugar sea raro, casi siempre es cómo se midió.
12. ALGO TIENE QUE QUEDAR EN SUS MANOS. Escribe "lo_que_eligen": qué decide el curso y no el profesor —dónde medir, qué cuenta como qué, cuándo—, qué cambia en el resultado según lo que elijan, y cómo lo defienden delante del resto. La prueba es la del medio: si da lo mismo lo que elijan, no están eligiendo, están obedeciendo con más pasos, y hay que buscar otra cosa. Que a dos grupos les dé distinto no es un problema que haya que evitar: es la conversación.
13. EL TRABAJO SE ENTREGA EN SEGUNDA VERSIÓN, NUNCA EN PRIMERA. Escribe "borrador_y_critica": una primera versión hecha rápido y fea a propósito, una ronda de crítica con REGLAS (poco, concreto, y nada que no se pueda arreglar; nunca «está bonito»), y en qué se nota mirándolas que la segunda es mejor. Quien critica puede ser el otro grupo, el otro curso, o la persona que va a usar el trabajo. La distancia entre las dos versiones es la mitad de lo que aprenden.
14. LO QUE SABE LA COMUNIDAD ENTRA COMO DATO, NO COMO SALUDO. Si alguien del pueblo contó algo del lugar, eso se pone al lado de lo que midieron y se mira si dicen lo mismo. Una persona mayor que se acuerda de hasta dónde llegaba el agua está aportando la única medición de hace cuarenta años que van a tener.
15. EL QUE INVESTIGA ES EL ESTUDIANTE, NO EL INVITADO QUE HABLA. Escribe "red_comunitaria": a QUIÉN exactamente —el del comité de agua, la que atiende la posta, el que saca leña, quien siembra al lado—, qué sabe esa persona que no está en ningún libro, y LAS PREGUNTAS QUE LE HACEN ELLOS, redactadas como las diría alguien de doce años. Di qué curso pregunta y cómo se prepara, porque «que pregunten» sin más significa que preguntan los mismos tres de siempre. Agrega qué hay que pedir antes (permisos, avisos, lo que se firma) y qué se le devuelve después a quien contestó: trabajar con una comunidad y sacarle material se diferencian justo en eso.
16. AL FINAL, EL MISMO PROBLEMA EN UN LUGAR DONDE NO ESTUVIERON. Escribe "transferencia": un sitio distinto de verdad —otra zona, otro clima, otro paisaje—, qué se les pide ahí, qué tiene que aparecer en la respuesta para darla por buena, y cuál es la respuesta que parece buena y no lo es, que casi siempre es repetir su propio caso con otras palabras. Un curso puede contestar todas las preguntas de repaso y seguir sin entender nada: se sabe su caso de memoria. Esto es lo único que los separa.

LARGO. Sé breve, que esto se imprime:
- lo que explicas: 3 o 4 frases
- pasos del ejemplo: 3 a 5, con el número puesto
- ejercicios contigo: 2 o 3, cortos
- ejercicios solos: 2 o 3, cortos
- qué miden en terreno: 2 a 4 cosas, con unidad
- la pregunta que los divide: 2 o 3 frases
- la pregunta de comprobar: 1, con 3 respuestas posibles
- lo que eligen ellos: 3 frases
- la segunda versión: 3 frases
- quién del lugar entra: 1 o 2 personas, con 3 preguntas cada una
- el mismo problema en otro sitio: 4 frases
- la vuelta del terreno: 3 o 4 frases
- volver a preguntar: 2 preguntas cortas
- por curso: 1 o 2 ejercicios contigo y 1 solo

Responde ÚNICAMENTE con el objeto JSON (sin texto introductorio ni explicaciones):
{"titulo":"","objetivo_codigo":"","sesiones":5,"sintesis_docente":"","desacuerdo":{"sobre_que":"","como_se_ve":"","quien_lo_zanja":""},"instruccion_explicita":{"duracion_min":20,"que_hacen_los_estudiantes":"","notas_para_el_docente":[],"conceptos_clave":[],"errores_frecuentes":[],"comprobacion":{"pregunta":"","respuestas":[{"dice":"","significa":""}],"si_falla":""}},"ejemplo_resuelto":{"situacion":"","pasos":[{"paso":1,"accion":"","razonamiento":"","resultado":""}],"respuesta":""},"practica_guiada":{"como_trabajan":"","ejercicios":[{"enunciado":"","apoyo":"","respuesta_esperada":""}]},"practica_autonoma":{"como_trabajan":"","ejercicios":[{"enunciado":"","respuesta_esperada":""}]},"salida_terreno":{"duracion_min":90,"preparacion":[],"protocolo":[{"campo":"","etiqueta":"","instruccion":"","unidad":"","tipo":"numero"}],"seguridad":[],"lo_que_eligen":{"que_eligen":"","en_que_cambia":"","como_lo_defienden":""}},"vuelta_del_terreno":{"como_empieza":"","que_comparan":"","si_no_calza":"","con_la_comunidad":""},"borrador_y_critica":{"primera_version":"","como_se_critica":"","que_mejora":""},"red_comunitaria":{"actores":[{"quien":"","por_que":"","que_le_preguntan":[],"quien_pregunta":""}],"permisos":[],"devolucion":""},"transferencia":{"escenario_nuevo":"","que_se_les_pide":"","que_muestra_que_lo_entendieron":"","que_no_cuenta":""},"recuperacion_espaciada":[{"semanas_despues":1,"pregunta":"","respuesta_esperada":""}],"materiales":[],"requiere_consulta":false}

Qué va en los campos nuevos:
- "que_hacen_los_estudiantes": lo que hace el curso ANTES de que tú expliques, y que se guarda para el final. Ejemplo: «Antes de que expliques nada: cada uno dibuja de memoria el estero que cruza todos los días y marca con una cruz dónde cree que va más hondo. Cinco minutos, sin borrar. Ese dibujo lo llevan al terreno para ver en qué le achuntaron.»
- "como_trabajan": cómo se organiza la sala en ese rato. Ejemplo: «En parejas, en el puesto. Tú vas pasando banco por banco.»
- "comprobacion": la pregunta que contestan todos a la vez. En "dice" va la respuesta tal como la darían ellos; en "significa", qué está pensando quien la da, incluida la correcta. Pon primero la correcta y después las equivocadas, que son las que traen la información.
- "vuelta_del_terreno": la clase siguiente a la salida. "como_empieza" es lo primero que ocurre al entrar, antes de cualquier cálculo. "que_comparan" es qué papel se pone al lado de qué dato. "si_no_calza" es qué hacer con la medición rara. "con_la_comunidad" solo si alguien del pueblo aportó algo que se pueda poner al lado de lo que midieron; si no, déjalo vacío.

Con más de un objetivo, añade además la clave "por_nivel", con una entrada por curso:
"por_nivel":[{"nivel":"","objetivo_codigo":"","practica_guiada":{"ejercicios":[{"enunciado":"","apoyo":"","respuesta_esperada":""}]},"practica_autonoma":{"ejercicios":[{"enunciado":"","respuesta_esperada":""}]},"mientras_esperan":"","rol_en_terreno":""}]`;

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function responder(cuerpo: unknown, status = 200): Response {
  if (status === 204 || cuerpo === null) {
    return new Response(null, {
      status,
      headers: CORS,
    });
  }
  return new Response(JSON.stringify(cuerpo), {
    status,
    headers: { ...CORS, "Content-Type": "application/json" },
  });
}

/**
 * Parser y reparador de JSON ultra robusto.
 * Tolera bloques de código, texto exterior y respuestas truncadas cerrando llaves abiertas.
 * Si todo falla, devuelve un objeto seguro para que asegurarEstructura() genere la secuencia completa.
 */
function parsear(texto: string): Record<string, unknown> {
  if (!texto || typeof texto !== "string" || !texto.trim()) {
    return {};
  }

  let limpio = texto.trim();

  // Quitar markdown ```json ... ```
  if (limpio.includes("```")) {
    limpio = limpio.replace(/```(?:json)?/gi, "").replace(/```/g, "").trim();
  }

  // Extraer desde el primer '{'
  const primerBrace = limpio.indexOf("{");
  if (primerBrace !== -1) {
    limpio = limpio.slice(primerBrace);
  } else {
    return {};
  }

  // 1. Intento de parseo directo
  try {
    const datos = JSON.parse(limpio);
    if (typeof datos === "object" && datos !== null && !Array.isArray(datos)) {
      return datos as Record<string, unknown>;
    }
  } catch {}

  // 2. Si falló, intentar extraer hasta el último '}'
  const ultimoBrace = limpio.lastIndexOf("}");
  if (ultimoBrace !== -1 && ultimoBrace > 0) {
    try {
      const subLimpio = limpio.slice(0, ultimoBrace + 1);
      const datos = JSON.parse(subLimpio);
      if (typeof datos === "object" && datos !== null && !Array.isArray(datos)) {
        return datos as Record<string, unknown>;
      }
    } catch {}
  }

  // 3. Auto-reparador de JSON truncado / abierto
  let s = limpio;
  s = s.replace(/:\s*$/, ': ""');
  s = s.replace(/,\s*$/, "");

  let enString = false;
  let escapado = false;
  const pila: string[] = [];

  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (escapado) {
      escapado = false;
      continue;
    }
    if (c === "\\") {
      escapado = true;
      continue;
    }
    if (c === '"') {
      enString = !enString;
      continue;
    }
    if (!enString) {
      if (c === "{" || c === "[") {
        pila.push(c);
      } else if (c === "}" && pila[pila.length - 1] === "{") {
        pila.pop();
      } else if (c === "]" && pila[pila.length - 1] === "[") {
        pila.pop();
      }
    }
  }

  // Cerrar string abierto
  if (enString) {
    s += '"';
  }
  s = s.replace(/:\s*$/, ': ""');
  s = s.replace(/,\s*$/, "");

  // Cerrar todas las estructuras pendientes en orden inverso
  while (pila.length > 0) {
    const abierto = pila.pop();
    if (abierto === "{") s += "}";
    if (abierto === "[") s += "]";
  }

  try {
    const datosReparados = JSON.parse(s);
    if (typeof datosReparados === "object" && datosReparados !== null && !Array.isArray(datosReparados)) {
      return datosReparados as Record<string, unknown>;
    }
  } catch {}

  // Fallback seguro si no se pudo reconstruir
  return {};
}

/**
 * Asegura que todas las etapas y campos mínimos requeridos existan en la secuencia.
 */
/**
 * Completa lo que el modelo no devolvió, para que la pantalla no se rompa.
 *
 * Lo que rellena NO es una clase: son marcadores de posición genéricos. Antes
 * viajaban con el mismo sello de «generado» que el resto, así que el docente
 * los habría descubierto delante del curso. Ahora se anota qué se rellenó y se
 * devuelve al frontend, que ya sabe mostrar esa lista como algo a revisar.
 *
 * Devuelve las etapas sustituidas por relleno.
 */
function asegurarEstructura(s: Record<string, any>, codigos: string[], objetivos: any[], poi: any): string[] {
  const rellenadas: string[] = [];
  s.titulo = s.titulo || `Secuencia de Enseñanza: ${poi?.name || "Territorio Local"}`;
  s.sesiones = s.sesiones || 2;
  s.sintesis_docente = s.sintesis_docente || "Secuencia de enseñanza territorial adaptada para el aula.";

  if (!s.instruccion_explicita || typeof s.instruccion_explicita !== "object") {
    rellenadas.push("instruccion_explicita");
    s.instruccion_explicita = {
      duracion_min: 20,
      notas_para_el_docente: ["Explicar el concepto central anclado al lugar."],
      conceptos_clave: ["Observación", "Medición"],
      errores_frecuentes: ["Confundir estimación con medición directa."],
    };
  }

  if (
    !s.ejemplo_resuelto ||
    typeof s.ejemplo_resuelto !== "object" ||
    !Array.isArray(s.ejemplo_resuelto.pasos) ||
    s.ejemplo_resuelto.pasos.length === 0
  ) {
    rellenadas.push("ejemplo_resuelto");
    s.ejemplo_resuelto = {
      situacion: `En ${poi?.name || "el lugar"}.`,
      pasos: [
        { paso: 1, accion: "Aquí va el ejemplo resuelto, con los números puestos.", razonamiento: "Esto no se generó.", resultado: "Escríbelo tú o vuelve a generar." },
      ],
      respuesta: "Sin ejemplo. Esta parte hay que escribirla.",
    };
  }

  if (!s.practica_guiada || typeof s.practica_guiada !== "object") {
    rellenadas.push("practica_guiada");
    s.practica_guiada = {
      como_trabajan: "Sin escribir. Esta parte no se generó.",
      ejercicios: [{ enunciado: "Aquí van los ejercicios que resuelven contigo. Escríbelos tú o vuelve a generar.", apoyo: "", respuesta_esperada: "" }],
    };
  }

  if (!s.practica_autonoma || typeof s.practica_autonoma !== "object") {
    rellenadas.push("practica_autonoma");
    s.practica_autonoma = {
      como_trabajan: "Sin escribir. Esta parte no se generó.",
      ejercicios: [{ enunciado: "Aquí van los ejercicios que resuelven solos. Escríbelos tú o vuelve a generar.", respuesta_esperada: "" }],
    };
  }

  if (!s.salida_terreno || typeof s.salida_terreno !== "object") {
    rellenadas.push("salida_terreno");
    s.salida_terreno = {
      duracion_min: 90,
      preparacion: ["Cuaderno y lápiz."],
      protocolo: [{ campo: "sin_definir", etiqueta: "Sin definir", instruccion: "Aquí va qué miden. Escríbelo tú o vuelve a generar.", tipo: "texto" }],
      seguridad: ["Nadie se aleja del grupo."],
    };
  }

  if (!Array.isArray(s.recuperacion_espaciada) || s.recuperacion_espaciada.length === 0) {
    rellenadas.push("recuperacion_espaciada");
    s.recuperacion_espaciada = [
      { semanas_despues: 1, pregunta: "¿Qué midieron en la salida?", respuesta_esperada: "" },
      { semanas_despues: 3, pregunta: "Aquí va la segunda pregunta. Escríbela tú o vuelve a generar.", respuesta_esperada: "" },
    ];
  }

  if (!Array.isArray(s.materiales) || s.materiales.length === 0) {
    s.materiales = ["Cuaderno", "Lápiz", "Huincha", "Lupa"];
  }

  if (codigos.length > 1 && (!Array.isArray(s.por_nivel) || s.por_nivel.length === 0)) {
    rellenadas.push("por_nivel");
    s.por_nivel = objetivos.map((o: any) => ({
      nivel: o.level || "Básico",
      objetivo_codigo: o.code,
      practica_guiada: { ejercicios: [{ enunciado: `Sin ejercicios para ${o.level || o.code}. Escríbelos tú o vuelve a generar.`, apoyo: "", respuesta_esperada: "" }] },
      practica_autonoma: { ejercicios: [{ enunciado: `Sin ejercicios para ${o.level || o.code}.`, respuesta_esperada: "" }] },
      mientras_esperan: "",
      rol_en_terreno: "",
    }));
  }

  return rellenadas;
}

function legible(campo: string): string {
  const partes = String(campo).trim().split(/[_\s-]+/).filter(Boolean);
  if (partes.length === 0) return campo;
  if (partes.length > 1 && /^(m|cm|mm|km|m2|m3|ha|l|ml|kg|g|s|seg|min|h|c|pct)$/i.test(partes[partes.length - 1])) {
    partes.pop();
  }
  const texto = partes.join(" ");
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

function validar(s: Record<string, any>, idioma: Idioma): string[] {
  const problemas: string[] = [];
  const avisa = AVISOS[idioma];
  const nombre = NOMBRE_VISIBLE[idioma];

  for (const etapa of ETAPAS) {
    if (!(etapa in s)) problemas.push(avisa.falta(nombre[etapa]));
  }

  const pasos = s.ejemplo_resuelto?.pasos ?? [];
  if (pasos.length === 0) {
    problemas.push(avisa.sinPasos());
  } else {
    const sinPorque = pasos
      .map((p: any, i: number) => (String(p?.razonamiento ?? "").trim() ? null : p?.paso ?? i + 1))
      .filter((x: unknown) => x !== null);
    if (sinPorque.length > 0) {
      // Singular y plural son frases distintas, no una frase con una pieza
      // intercambiable: en otros idiomas cambia más que la palabra «paso».
      problemas.push(
        sinPorque.length > 1
          ? avisa.variosPasosSinPorque(sinPorque.join(", "))
          : avisa.unPasoSinPorque(String(sinPorque[0])),
      );
    }
  }
  if (!String(s.ejemplo_resuelto?.respuesta ?? "").trim()) {
    problemas.push(avisa.sinResultado());
  }

  const protocolo = s.salida_terreno?.protocolo ?? [];
  if (protocolo.length === 0) problemas.push(avisa.sinMediciones());
  for (const campo of protocolo) {
    if (!String(campo?.campo ?? "").trim()) problemas.push(avisa.medicionSinNombre());
    if (campo?.tipo === "numero" && !String(campo?.unidad ?? "").trim()) {
      // Se nombra la medición como la lee el curso en la hoja, no como se
      // llama por dentro: el aviso es para el docente, no para la base.
      const visible = String(campo?.etiqueta ?? "").trim() || legible(campo?.campo ?? "?");
      problemas.push(avisa.medicionSinUnidad(visible));
    }
  }

  if (Array.isArray(s.__codigos_pedidos) && s.__codigos_pedidos.length > 1) {
    const bloques = Array.isArray(s.por_nivel) ? s.por_nivel : [];
    if (bloques.length === 0) {
      problemas.push(avisa.sinReparto());
    } else {
      const cubiertos = new Set(bloques.map((b: any) => b?.objetivo_codigo));
      const sinTrabajo = s.__codigos_pedidos.filter((c: string) => !cubiertos.has(c));
      if (sinTrabajo.length > 0) {
        problemas.push(avisa.sinActividad(sinTrabajo.join(", ")));
      }
      for (const b of bloques) {
        const guiada = b?.practica_guiada?.ejercicios?.length ?? 0;
        const autonoma = b?.practica_autonoma?.ejercicios?.length ?? 0;
        if (guiada + autonoma === 0) {
          problemas.push(
            avisa.cursoSinEjercicios(String(b?.nivel ?? b?.objetivo_codigo ?? "?")),
          );
        }
      }
    }
  }

  const recuperacion = s.recuperacion_espaciada ?? [];
  if (recuperacion.length < 2) {
    problemas.push(avisa.pocaRecuperacion());
  }

  // Sin la pregunta de comprobar, el docente entra a la práctica sin saber
  // quién entendió, y con cuatro cursos eso no se recupera después. Con una
  // sola respuesta posible tampoco sirve: si todos los que fallan fallan
  // igual, la pregunta no distingue nada.
  const comprobacion = s.instruccion_explicita?.comprobacion;
  if (!comprobacion?.pregunta || (comprobacion.respuestas?.length ?? 0) < 2) {
    problemas.push(avisa.sinComprobacion());
  }

  // Sin la clase de vuelta, la salida queda en paseo con planilla.
  if (!s.vuelta_del_terreno?.que_comparan) {
    problemas.push(avisa.sinVuelta());
  }

  // Las tres que separan un proyecto de una tarea larga: una pregunta que de
  // verdad divida, algo que decidan ellos, y una segunda versión. Si falta
  // cualquiera de las tres, lo que queda es un procedimiento bien escrito.
  if (!s.desacuerdo?.sobre_que) {
    problemas.push(avisa.sinDesacuerdo());
  }
  if (!s.salida_terreno?.lo_que_eligen?.que_eligen) {
    problemas.push(avisa.sinEleccion());
  }
  if (!s.borrador_y_critica?.como_se_critica) {
    problemas.push(avisa.sinSegundaVersion());
  }

  // Sin preguntas preparadas por ellos, la visita se vuelve una charla en la
  // que el invitado habla veinte minutos y el curso escucha.
  const actores = s.red_comunitaria?.actores ?? [];
  if (!actores.some((a: any) => (a?.que_le_preguntan?.length ?? 0) > 0)) {
    problemas.push(avisa.sinRedComunitaria());
  }

  // Un curso puede contestar todo el repaso y saberse solo su caso.
  if (!s.transferencia?.escenario_nuevo) {
    problemas.push(avisa.sinTransferencia());
  }

  return problemas;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS, status: 200 });
  }
  if (req.method !== "POST") return responder({ error: "Método no permitido" }, 405);

  const claveAnthropic = Deno.env.get("ANTHROPIC_API_KEY");
  if (!claveAnthropic) {
    return responder(
      {
        error:
          "Falta configurar ANTHROPIC_API_KEY en los secretos del proyecto. " +
          "Sin ella no se puede generar la secuencia.",
      },
      503,
    );
  }

  let cuerpo: {
    objective_code?: string;
    objective_codes?: string[];
    point_id?: string;
    sesiones?: number;
    notas_docente?: string;
    /** El idioma de la interfaz, para que la clase salga en el mismo. */
    idioma?: string;
  };
  try {
    cuerpo = await req.json();
  } catch {
    return responder({ error: "El cuerpo de la petición no es JSON válido" }, 400);
  }

  const { objective_code, objective_codes, point_id, sesiones = 2, notas_docente = "" } = cuerpo;
  const idioma = idiomaValido(cuerpo.idioma);

  const codigos = (objective_codes?.length ? objective_codes : objective_code ? [objective_code] : [])
    .map((c) => String(c).trim())
    .filter(Boolean);

  if (codigos.length === 0 || !point_id) {
    return responder({ error: "Faltan los objetivos y el point_id" }, 400);
  }

  const MAX_OBJETIVOS = 5;
  if (codigos.length > MAX_OBJETIVOS) {
    return responder(
      { error: `Son demasiados objetivos para una sola secuencia (máximo ${MAX_OBJETIVOS}).` },
      400,
    );
  }

  const autorizacion = req.headers.get("Authorization") ?? "";
  const esJwt = /^Bearer\s+[\w-]+\.[\w-]+\.[\w-]+$/.test(autorizacion);

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    esJwt ? { global: { headers: { Authorization: autorizacion } } } : undefined,
  );

  const [oaRes, poiRes] = await Promise.all([
    supabase.from("curriculum_objectives").select("*").in("code", codigos),
    supabase.from("points_of_interest").select("*").eq("id", point_id).maybeSingle(),
  ]);

  const falloLectura = oaRes.error ?? poiRes.error;
  if (falloLectura) {
    return responder(
      { error: `No se pudo leer el catálogo: ${falloLectura.message}` },
      502,
    );
  }

  const encontrados = oaRes.data ?? [];
  const poi = poiRes.data;

  const faltantes = codigos.filter((c) => !encontrados.some((o: any) => o.code === c));
  if (faltantes.length > 0) {
    return responder(
      { error: `No ${faltantes.length > 1 ? "existen los objetivos" : "existe el objetivo"} ${faltantes.join(", ")}` },
      404,
    );
  }
  if (!poi) return responder({ error: "No existe ese punto de interés" }, 404);

  const objetivos = codigos.map((c) => encontrados.find((o: any) => o.code === c));
  const oa = objetivos[0];
  const multigrado = objetivos.length > 1;

  const prompt = [
    multigrado
      ? `AULA MULTIGRADO: ${objetivos.length} cursos en la misma sala, con un solo docente.`
      : "",
    ...objetivos.map((o: any) =>
      [
        `OBJETIVO DE APRENDIZAJE (${o.code}): ${o.description}`,
        o.subject ? `  Asignatura: ${o.subject}` : "",
        o.level ? `  Nivel: ${o.level}` : "",
      ]
        .filter(Boolean)
        .join("\n"),
    ),
    "",
    "LUGAR DONDE SE ANCLA LA ENSEÑANZA",
    `Nombre: ${poi.name}`,
    `Comuna: ${poi.commune}`,
    `Ecosistema: ${poi.ecosystem_type ?? "desconocido"}`,
    `Descripción: ${poi.description ?? ""}`,
    poi.threats?.length ? `Amenazas locales: ${poi.threats.join(", ")}` : "",
    poi.heritage_type ? `Patrimonio: ${poi.heritage_type}` : "",
    "",
    `Sesiones disponibles: ${sesiones}`,
    notas_docente ? `Notas del docente: ${notas_docente}` : "",
    "",
    "Escribe la clase entera. El ejemplo tiene que ir resuelto de principio a fin, con los números de este lugar, listo para copiar en la pizarra.",
    multigrado
      ? "Es UNA sola clase para todos los cursos juntos. Devuelve 'por_nivel' con una entrada por cada curso listado. Sé sintético y conciso."
      : "",
    // Al final del todo, que es donde más peso tiene: el idioma es lo primero
    // que se nota si sale mal y lo último que el modelo debe olvidar.
    INSTRUCCION_IDIOMA[idioma],
  ]
    .filter(Boolean)
    .join("\n");

  const reloj = AbortSignal.timeout(TIEMPO_MAXIMO_MS);

  let respuestaIA: Response | null = null;
  let modeloElegido = "";
  let ultimoDetalleError = "";

  for (const mod of MODELOS_CANDIDATOS) {
    try {
      const resp = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        signal: reloj,
        headers: {
          "content-type": "application/json",
          "x-api-key": claveAnthropic,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: mod,
          max_tokens: MAX_TOKENS,
          system: [{ type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } }],
          messages: [{ role: "user", content: prompt }],
        }),
      });

      if (resp.ok) {
        respuestaIA = resp;
        modeloElegido = mod;
        break;
      } else {
        const detalle = await resp.text();
        ultimoDetalleError = detalle;
        if (resp.status === 401 || resp.status === 403) {
          return responder({ error: `Clave de Anthropic no autorizada: ${detalle.slice(0, 300)}` }, 502);
        }
      }
    } catch (e) {
      const porTiempo = e instanceof DOMException && e.name === "TimeoutError";
      if (porTiempo) {
        return responder({ error: "La secuencia tardó demasiado en generarse y se cortó. Vuelve a intentarlo." }, 504);
      }
      ultimoDetalleError = String(e);
    }
  }

  // Ningún modelo respondió. Sin esta comprobación el fallo era mudo: el texto
  // quedaba vacío, el relleno completaba la secuencia entera y la función
  // devolvía 200 con una clase que nadie escribió.
  if (!respuestaIA) {
    return responder(
      {
        error:
          "Ningún modelo respondió. Ocurre cuando el identificador de modelo ya " +
          "no existe o la cuenta no tiene acceso a él. " +
          `Detalle: ${ultimoDetalleError.slice(0, 300) || "sin detalle"}`,
      },
      502,
    );
  }

  let textoGenerado = "";
  let motivoDeCorte = "";
  let tiposDeBloque: string[] = [];

  try {
    const datos = await respuestaIA.json();
    motivoDeCorte = String(datos?.stop_reason ?? "");
    const bloques = Array.isArray(datos?.content) ? datos.content : [];
    tiposDeBloque = bloques.map((b: any) => String(b?.type ?? "?"));

    // Se juntan TODOS los bloques de texto. Leer solo `content[0].text` daba
    // cadena vacía en cuanto el primer bloque no era de texto, y esa cadena
    // vacía viajaba sin ruido hasta convertirse en una secuencia de relleno.
    textoGenerado = bloques
      .filter((b: any) => b?.type === "text" && typeof b?.text === "string")
      .map((b: any) => b.text)
      .join("");
  } catch (e) {
    return responder(
      { error: `No se pudo leer la respuesta del generador: ${String(e).slice(0, 200)}` },
      502,
    );
  }

  // La respuesta llegó vacía. Antes esto era indistinguible de un éxito y
  // terminaba en una clase inventada; ahora se dice, con lo que hace falta
  // para saber por qué.
  if (!textoGenerado.trim()) {
    return responder(
      {
        error:
          `El generador (${modeloElegido}) respondió sin texto. ` +
          `Motivo de corte: ${motivoDeCorte || "desconocido"}. ` +
          `Bloques recibidos: ${tiposDeBloque.join(", ") || "ninguno"}.`,
      },
      502,
    );
  }

  let secuencia = parsear(textoGenerado);

  // Se cortó por longitud y no quedó nada aprovechable. Distinguirlo importa:
  // la salida es acotar la secuencia, no reintentar lo mismo.
  if (motivoDeCorte === "max_tokens" && Object.keys(secuencia).length === 0) {
    return responder(
      {
        error:
          "La secuencia salió demasiado larga y quedó incompleta. Con varios " +
          "cursos a la vez es lo que suele pasar: prueba con menos objetivos.",
      },
      502,
    );
  }

  // Completa lo que falte para que la pantalla no se rompa, y anota qué tuvo
  // que inventar: eso no es material de clase y el docente debe saberlo.
  const rellenadas = asegurarEstructura(secuencia, codigos, objetivos, poi);

  secuencia.procedencia = {
    de_datos: {
      punto: poi.name,
      comuna: poi.commune,
      ecosistema: poi.ecosystem_type ?? "",
      objetivo: codigos.join(", "),
    },
    generado_por_modelo: [...ETAPAS],
    modelo: modeloElegido || "anthropic-claude",
  };
  secuencia.objetivo_descripcion = oa.description;
  secuencia.niveles = objetivos.map((o: any) => o.level).filter(Boolean);

  if (Array.isArray(secuencia.por_nivel)) {
    for (const bloque of secuencia.por_nivel) {
      const suyo = objetivos.find((o: any) => o.code === bloque?.objetivo_codigo);
      if (suyo) {
        bloque.objetivo_descripcion = suyo.description;
        bloque.nivel = bloque.nivel || suyo.level;
      }
    }
  }

  secuencia.__codigos_pedidos = codigos;
  const problemas = validar(secuencia, idioma);
  delete secuencia.__codigos_pedidos;

  // Lo que hubo que rellenar encabeza la lista: no es material de clase, y el
  // docente tiene que verlo antes que cualquier otra observación.
  for (const etapa of rellenadas.reverse()) {
    problemas.unshift(
      AVISOS[idioma].relleno(NOMBRE_VISIBLE[idioma][etapa] ?? etapa),
    );
  }

  return responder({
    secuencia,
    resumen: {
      titulo: secuencia.titulo ?? "",
      pasos_del_ejemplo: secuencia.ejemplo_resuelto?.pasos?.length ?? 0,
      campos_de_terreno: secuencia.salida_terreno?.protocolo?.length ?? 0,
      momentos_de_recuperacion: secuencia.recuperacion_espaciada?.length ?? 0,
    },
    problemas,
    utilizable: problemas.length === 0,
  });
});
