export interface POIProperties {
  id: string;
  name: string;
  type: string;
  ecosystem: string | null;
  commune: string;
  description: string | null;
  stem_areas: string[];
  heritage_type: string | null;
  threats: string[];
}

export interface POIFeature {
  type: "Feature";
  geometry: {
    type: "Point";
    coordinates: [number, number];
  };
  properties: POIProperties;
}

export interface GeoJSONResponse {
  type: "FeatureCollection";
  features: POIFeature[];
}

// Proyecto STEM generado por Claude
export interface STEMProject {
  id?: string;
  title: string;
  stem_areas: string[];
  level: string;
  duration: string;
  local_connection: string;
  objectives: string[];
  materials: string[];
  steps: string[];
  expected_outcomes: string[];
  curriculum_alignment: string[];
  point_of_interest_id?: string;
  generated_by?: string;
  validated?: boolean;
  created_at?: string;
}

export interface GenerateResponse {
  projects: STEMProject[];
  source: "generated" | "cache";
  message: string;
}

// Objetivo de Aprendizaje del currículo chileno
export interface CurriculumObjective {
  id: string;
  code: string;
  subject: string;
  level: string;
  axis: string;
  oa_number: number;
  description: string;
  keywords: string[];
  project_count: number;
}

export interface CurriculumLevel {
  level: string;
  total_oa: number;
}

// Escuela rural
export interface School {
  id: string;
  rbd: number;
  name: string;
  commune: string;
  address: string | null;
  coordinates: [number, number];
  dependency: string | null;
  rural: boolean;
  levels: string[];
  student_count: number | null;
}

// POI cercano con distancia
export interface NearbyPOI {
  id: string;
  name: string;
  type: string;
  ecosystem: string | null;
  commune: string;
  description: string | null;
  stem_areas: string[];
  heritage_type: string | null;
  threats: string[];
  distance_km: number;
  coordinates: [number, number];
}

export interface NearbyResponse {
  school: {
    id: string;
    name: string;
    commune: string;
    coordinates: [number, number];
  };
  radius_km: number;
  pois: NearbyPOI[];
}

// ── Fase 2: Detalle expandido de un proyecto ──

/** Una sesión de clase dentro de la planificación del proyecto */
export interface SessionPlan {
  session_number: number;
  title: string;
  duration_minutes: number;
  objective: string;
  activities: string[];
  materials: string[];
  location: "aula" | "terreno" | "mixto";
}

/** Guía para el docente: qué preparar, cómo guiar cada sesión */
export interface TeacherGuide {
  preparation: string[];
  key_questions: string[];
  differentiation: string[];
  safety_notes: string[];
  assessment_tips: string[];
}

/** Ficha de trabajo para el estudiante (una por sesión) */
export interface StudentWorksheet {
  session_number: number;
  title: string;
  instructions: string;
  activities: { description: string; type: "observacion" | "registro" | "analisis" | "creacion" }[];
  reflection_questions: string[];
}

/** Rúbrica de evaluación con criterios y niveles de logro */
export interface EvaluationRubric {
  criteria: {
    name: string;
    levels: { label: string; description: string; points: number }[];
  }[];
  total_points: number;
}

/** Todo el contenido expandido de un proyecto (generado por Claude on-demand) */
export interface ProjectDetail {
  sessions: SessionPlan[];
  teacher_guide: TeacherGuide;
  worksheets: StudentWorksheet[];
  rubric: EvaluationRubric;
}

// ── Fase 3: Roles, códigos compartidos, progreso de estudiantes ──

/** Rol del usuario: profesor o estudiante */
export type UserRole = "profesor" | "estudiante";

/** Código que el profesor comparte con estudiantes para unirse a un proyecto */
export interface ShareCode {
  id: string;
  project_id: string;
  code: string;
  teacher_id: string;
  school_id: string;
  active: boolean;
  created_at: string;
}

/** Sesión de un estudiante (identidad sin auth) */
export interface StudentSession {
  id: string;
  local_id: string;
  display_name: string;
  school_id: string | null;
  created_at: string;
}

/** Inscripción de un estudiante en un proyecto */
export interface StudentEnrollment {
  id: string;
  student_id: string;
  project_id: string;
  share_code_id: string | null;
  enrolled_at: string;
  // Campos extras que vienen en joins
  project_title?: string;
  school_name?: string;
}

/** Progreso de una actividad individual */
export interface ActivityProgress {
  session_number: number;
  activity_index: number;
  completed: boolean;
  completed_at: string | null;
}

/** Nota de campo escrita por un estudiante */
export interface FieldNote {
  id: string;
  session_number: number;
  note_text: string;
  created_at: string;
}

/** Pregunta de quiz generada por IA */
export interface QuizQuestion {
  question: string;
  options: string[];
  correct_index: number;
}

/** Resultado de un quiz */
export interface QuizResult {
  id: string;
  session_number: number;
  questions: QuizQuestion[];
  answers: number[];
  score: number;
  submitted_at: string;
}

/** Progreso de un estudiante visto por el profesor */
export interface StudentProgressSummary {
  student_name: string;
  student_id: string;
  enrollment_id: string;
  total_activities: number;
  completed_activities: number;
  completion_pct: number;
  field_notes_count: number;
  quiz_scores: number[];
}

// ── Secuencias de enseñanza ──────────────────────────────────────────
// Las seis etapas van en orden de guía decreciente: la salida a terreno
// ocurre en la quinta, no en la primera.

export interface PasoResuelto {
  paso: number;
  accion: string;
  razonamiento: string;
  resultado: string;
}

/**
 * Qué hacen afuera, que no es siempre medir.
 *
 * Este tipo no existía, y su ausencia se notaba: el protocolo solo sabía de
 * `numero` y de `texto`, la tabla de terreno tenía una columna titulada «cómo
 * se mide», y las cuatro rutas escritas salieron en consecuencia —diez de
 * dieciséis tareas eran un número con unidad y las otras seis eran «anota».
 * Con ese vocabulario no se puede escribir una salida que no sea una toma de
 * datos, por buena voluntad que le ponga quien la escriba.
 *
 * Medir está bien y no se va: un número zanja discusiones que las palabras no
 * zanjan, y hay objetivos del programa que lo piden. Lo que estaba mal era que
 * fuera lo único.
 *
 * `dejar_hecho` es el que más falta hacía. En las cuatro rutas el lugar
 * quedaba exactamente igual después de la visita: el curso iba, anotaba y se
 * volvía. Un sitio que no cambió en nada no da para volver, y la diferencia
 * entre visitar un lugar y tener uno es justamente esa.
 */
export type Registro =
  | "medir"       // un número con su unidad
  | "contar"      // cuántos hay
  | "describir"   // en palabras: color, olor, textura, qué se oye
  | "dibujar"     // el dibujo es el dato, no la ilustración de otro dato
  | "mapear"      // dónde está cada cosa respecto de las demás
  | "recoger"     // una muestra que se lleva y vuelve
  | "preguntar"   // a quien está ahí y sabe
  | "seguir"      // ir detrás de algo hasta donde llega
  | "comparar"    // con otra época, otra estación u otro sitio
  | "dejar_hecho"; // el lugar queda distinto de como estaba

export interface CampoProtocolo {
  /**
   * Identificador estable del dato. Se queda siempre en español, en cualquier
   * idioma: con él se cruzan las mediciones que los cursos van guardando, y
   * si cambiara de nombre al cambiar de idioma dejarían de cruzarse.
   */
  campo: string;
  /**
   * El nombre que se lee en la hoja de terreno, en el idioma del docente.
   * Puede no venir: entonces se deriva de `campo`, como se hacía antes.
   */
  etiqueta?: string;
  instruccion: string;
  unidad?: string;
  tipo?: string;
  /**
   * Qué clase de trabajo es este. Ausente en las secuencias generadas antes
   * de que existiera: entonces se deduce de si pide unidad o no, que es
   * exactamente la pobreza que este campo viene a arreglar.
   */
  registro?: Registro;
}

export interface MomentoRecuperacion {
  semanas_despues: number;
  pregunta: string;
  respuesta_esperada: string;
}

/**
 * La pregunta que se hace antes de seguir, y lo que revela cada respuesta.
 *
 * La secuencia avisaba de los errores frecuentes, que está bien, pero se los
 * decía al docente y ahí terminaba: nada le permitía averiguar cuáles de sus
 * estudiantes lo tenían. En una sala con cuatro cursos eso no es un detalle
 * fino, es lo único que impide pasar veinte minutos sentado con 7º mientras 5º
 * practica con una idea equivocada y la deja bien aprendida.
 *
 * Por eso la pregunta se elige de manera que las respuestas equivocadas sean
 * distintas entre sí: si todos los que fallan fallan igual, no se sabe nada; si
 * cada error apunta a una confusión distinta, la respuesta dice qué hay que
 * volver a explicar. Responden todos a la vez —dedos, papelito, pizarra
 * pequeña— porque preguntar «¿se entendió?» y mirar quién levanta la mano
 * devuelve siempre el mismo puñado de manos.
 */
export interface Comprobacion {
  pregunta: string;
  /** Cada respuesta que suele aparecer, y qué está pensando quien la da. */
  respuestas: { dice: string; significa: string }[];
  /** Qué hacer si falla más de la cuarta parte del curso. */
  si_falla: string;
}

/**
 * Hasta dónde llega el curso en cada tramo de la ruta.
 *
 * Las rutas empezaban en el estero, en el bosque o en el corte de camino, o
 * sea saltándose el sitio donde el curso está parado. Y ese salto se paga: un
 * niño que no ha mirado nunca el patio de su escuela con atención no tiene con
 * qué comparar cuando llega a la cuenca.
 *
 * Los tres tramos van de dentro hacia afuera y cada uno necesita al anterior:
 *
 *   inmediato  · la sala y el patio. Observar, inventariar, arriesgar una
 *                idea. No hace falta permiso, ni transporte, ni un día bueno.
 *   intermedio · el vecindario y la comunidad. Aquí está la salida y aquí
 *                está la gente del lugar, que es la parte que no se puede
 *                hacer desde el patio.
 *   amplio     · la cuenca, la biorregión, y de qué es caso particular esto.
 *                Se llega pensando, no caminando.
 */
export type Alcance = "inmediato" | "intermedio" | "amplio";

/**
 * Una persona del lugar que sabe algo que la escuela no sabe.
 *
 * La versión anterior era una pregunta suelta dirigida a «una persona mayor de
 * la comunidad», y eso en la práctica termina en una charla improvisada donde
 * el invitado habla veinte minutos y el curso escucha. Que el estudiante
 * investigue y no reciba exige tres cosas que hay que dejar escritas: a quién
 * exactamente, qué sabe esa persona que nadie más sabe, y qué le van a
 * preguntar ellos.
 *
 * Las preguntas las hacen los estudiantes, no el profesor. Por eso van
 * redactadas como se dicen, y por eso se dice qué curso pregunta: en una sala
 * multigrado, «que pregunten» sin más significa que preguntan los mismos tres
 * de siempre.
 */
export interface ActorLocal {
  quien: string;
  /** Qué sabe de este lugar que no está en ningún libro ni en internet. */
  por_que: string;
  /** Las preguntas que hacen ellos, tal como se dicen. */
  que_le_preguntan: string[];
  /** Qué curso pregunta, y cómo se prepara antes. */
  quien_pregunta: string;
}

/**
 * Cómo se organiza la participación de la gente del lugar.
 *
 * Aparte de los actores va lo aburrido y necesario: a quién se le pide
 * permiso, y qué pasa con lo que la comunidad entrega. Eso no es burocracia,
 * es la diferencia entre trabajar con una comunidad y extraerle material.
 */
export interface RedComunitaria {
  actores: ActorLocal[];
  /** Qué hay que pedir antes, y a quién. Incluye lo que se firma. */
  permisos: string[];
  /** Qué pasa después con lo que contaron: dónde queda y quién lo tiene. */
  devolucion: string;
}

/**
 * La prueba de si de verdad lo entendieron: el mismo concepto, otro sitio.
 *
 * Las preguntas de las semanas siguientes usan el número que midió su propio
 * grupo, y eso está bien para que no se olvide. Pero un curso puede contestar
 * todas esas y seguir sin entender nada: sabe su caso de memoria.
 *
 * Lo que separa saber el caso de entender la idea es poder usarla donde no se
 * estuvo. Por eso el escenario es otro lugar, elegido a propósito para que no
 * se parezca al suyo, y por eso se dice qué NO cuenta como respuesta: repetir
 * lo de su escuela con otras palabras.
 */
export interface Transferencia {
  /** Un lugar donde no estuvieron, descrito en cuatro líneas. */
  escenario_nuevo: string;
  que_se_les_pide: string;
  /** Qué tiene que aparecer en la respuesta para darla por buena. */
  que_muestra_que_lo_entendieron: string;
  /** La respuesta que parece buena y no lo es. */
  que_no_cuenta: string;
}

/**
 * El rato en que la sala se parte en dos y no puede resolverlo hablando.
 *
 * Es lo que faltaba para que salir a medir signifique algo. Tal como estaban
 * escritas, las rutas hacían que el curso ejecutara un protocolo que había
 * escrito otro, para confirmar una relación que el profesor ya había
 * enunciado. Medir así no construye nada: comprueba. Y el estudiante lo sabe,
 * por eso mide sin interés.
 *
 * La diferencia la hace tener antes una pregunta de verdad abierta que divida
 * al curso, con los dos bandos a la vista y sin manera de ganar discutiendo.
 * Entonces el número deja de ser una tarea y pasa a ser lo único que puede
 * zanjar la discusión: se sale a buscarlo porque hace falta, no porque toca
 * salida.
 *
 * Y la discusión es entre ellos. Hasta aquí todo el tráfico iba del estudiante
 * a la realidad o del estudiante al profesor; nada iba de un estudiante a
 * otro, que es donde de verdad se construye.
 */
export interface Desacuerdo {
  /** La pregunta que parte al curso. No tiene respuesta en el libro. */
  sobre_que: string;
  /** Cómo se hace visible en la sala: dónde se para cada uno, qué se anota. */
  como_se_ve: string;
  /** Por qué no se puede zanjar conversando, y qué haría falta. */
  quien_lo_zanja: string;
}

/**
 * Lo que eligen ellos, y que el profesor no elige por ellos.
 *
 * Una salida con el sitio marcado, los puntos elegidos y las casillas
 * impresas es una tarea de llenar formularios al aire libre. Para que sea
 * trabajo de verdad tiene que haber algo en sus manos cuya elección cambie el
 * resultado, y que después tengan que defender delante del resto.
 *
 * La prueba de si una elección es real es `en_que_cambia`: si da lo mismo lo
 * que elijan, no están eligiendo, están obedeciendo con más pasos.
 */
export interface LoQueEligen {
  que_eligen: string;
  /** Qué cambia en el resultado según lo que elijan. Si no cambia nada, no es elección. */
  en_que_cambia: string;
  /** Cómo lo defienden delante del curso. */
  como_lo_defienden: string;
}

/**
 * Primera versión, críticas con reglas, segunda versión.
 *
 * Era la ausencia más grande. El trabajo salía en un solo borrador y se
 * entregaba, y un trabajo que no se rehace no se aprende a hacer: la
 * diferencia entre la primera versión y la segunda es la mitad de lo que el
 * curso se lleva.
 *
 * La crítica lleva reglas porque sin ellas se convierte en «está bonito» o en
 * una pelea. Se pide poco y concreto, y lo que no se puede arreglar no se
 * dice.
 */
export interface BorradorYCritica {
  primera_version: string;
  como_se_critica: string;
  /** En qué se nota, mirándolas, que la segunda es mejor que la primera. */
  que_mejora: string;
}

/**
 * La clase de vuelta del terreno.
 *
 * Faltaba, y era la que sostiene todo lo demás. Las rutas empiezan pidiendo a
 * cada estudiante que se juegue una predicción en el cuaderno, salen a medir, y
 * después pasaban directo a calcular. Sin el momento en que cada uno pone su
 * predicción al lado de lo que midió, la salida queda como un paseo con
 * planilla: los datos son del lugar, pero la idea con que llegaron sigue
 * intacta, y la corrección la tendría que anunciar el profesor, que es
 * exactamente lo que no funciona.
 *
 * Aquí el que desmiente es el dato propio, y desmiente a casi todo el curso a
 * la vez, que es lo que lo vuelve soportable.
 */
export interface VueltaDelTerreno {
  /** Lo primero que ocurre al entrar, antes de cualquier cálculo. */
  como_empieza: string;
  /** Qué se pone al lado de qué. */
  que_comparan: string;
  /** Cuando el dato no se parece a nada: casi siempre es la medición. */
  si_no_calza: string;
  /** Lo que sabe la comunidad, puesto junto a lo que midieron. */
  con_la_comunidad?: string;
}

/** Lo que hace un curso concreto dentro de una secuencia compartida. */
export interface NivelDiferenciado {
  nivel: string;
  objetivo_codigo: string;
  objetivo_descripcion?: string;
  practica_guiada?: {
    ejercicios?: { enunciado: string; apoyo?: string; respuesta_esperada?: string }[];
  };
  practica_autonoma?: {
    ejercicios?: { enunciado: string; respuesta_esperada?: string }[];
  };
  /**
   * Qué hace este curso, callado y sin el docente, mientras él está sentado
   * con otro.
   *
   * Es el dato que sostiene toda la clase multigrado y el que faltaba. La
   * secuencia decía qué practica cada curso, pero no que el profesor solo
   * puede estar en un puesto a la vez: sin esto, tres de los cuatro cursos
   * quedan sin instrucciones justo cuando nadie los está mirando.
   */
  mientras_esperan?: string;
  /** Qué mide o registra este curso durante la salida común. */
  rol_en_terreno?: string;
}

export interface Secuencia {
  titulo: string;
  objetivo_codigo: string;
  objetivo_descripcion?: string;
  sesiones?: number;
  sintesis_docente?: string;
  /** Lo primero de la clase 1: la pregunta que divide al curso. */
  desacuerdo?: Desacuerdo;
  instruccion_explicita?: {
    duracion_min?: number;
    /** Qué hace el curso mientras el docente explica: sentados, copiando… */
    que_hacen_los_estudiantes?: string;
    notas_para_el_docente?: string[];
    conceptos_clave?: string[];
    errores_frecuentes?: string[];
    /** Cómo saber quién entendió, antes de soltarlos a practicar. */
    comprobacion?: Comprobacion;
  };
  ejemplo_resuelto?: {
    situacion?: string;
    pasos?: PasoResuelto[];
    respuesta?: string;
  };
  practica_guiada?: {
    /** Cómo se organiza la sala en ese rato: solos, en parejas, dónde. */
    como_trabajan?: string;
    instrucciones_docente?: string;
    ejercicios?: { enunciado: string; apoyo?: string; respuesta_esperada?: string }[];
  };
  practica_autonoma?: {
    como_trabajan?: string;
    ejercicios?: { enunciado: string; respuesta_esperada?: string }[];
  };
  salida_terreno?: {
    duracion_min?: number;
    preparacion?: string[];
    protocolo?: CampoProtocolo[];
    seguridad?: string[];
    /** Lo que queda en sus manos. Sin esto la salida es llenar casillas al aire libre. */
    lo_que_eligen?: LoQueEligen;
  };
  /** La clase siguiente a la salida: el dato propio contra lo que creían. */
  vuelta_del_terreno?: VueltaDelTerreno;
  /** Antes de entregar: una versión, las críticas del curso, y otra versión. */
  borrador_y_critica?: BorradorYCritica;
  /** Quién del lugar participa, qué le preguntan ellos, y qué se le devuelve. */
  red_comunitaria?: RedComunitaria;
  /** El mismo concepto en un lugar donde no estuvieron. */
  transferencia?: Transferencia;
  recuperacion_espaciada?: MomentoRecuperacion[];
  materiales?: string[];
  requiere_consulta?: boolean;
  /** Cursos que atiende esta secuencia. Uno solo en un aula de curso único. */
  niveles?: string[];
  /**
   * Qué hace cada curso cuando la sala es multigrado.
   *
   * La explicación, el ejemplo y la salida son comunes: un docente solo no
   * puede dar tres clases ni organizar tres terrenos a la vez. Lo que se
   * diferencia es la práctica y el rol de cada curso durante la salida.
   * Ausente cuando se eligió un único objetivo.
   */
  por_nivel?: NivelDiferenciado[];
  procedencia?: {
    de_datos: Record<string, string>;
    generado_por_modelo: string[];
    modelo: string;
  };
}

export interface RespuestaSecuencia {
  secuencia: Secuencia;
  resumen: Record<string, unknown>;
  /** Lo que le falta a la secuencia. Se muestra al docente, no se oculta. */
  problemas: string[];
  utilizable: boolean;
}
