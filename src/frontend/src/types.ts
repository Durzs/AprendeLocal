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
