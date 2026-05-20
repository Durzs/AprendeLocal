import type {
  GeoJSONResponse,
  GenerateResponse,
  STEMProject,
  CurriculumObjective,
  CurriculumLevel,
  School,
  NearbyResponse,
  ProjectDetail,
  ShareCode,
  StudentSession,
  StudentEnrollment,
  ActivityProgress,
  FieldNote,
  QuizQuestion,
  QuizResult,
  StudentProgressSummary,
} from "./types";

const API_URL = import.meta.env.VITE_API_URL || "";

export async function fetchPoints(params?: {
  commune?: string;
  ecosystem?: string;
}): Promise<GeoJSONResponse> {
  const queryParts: string[] = [];
  if (params?.commune) queryParts.push(`commune=${encodeURIComponent(params.commune)}`);
  if (params?.ecosystem) queryParts.push(`ecosystem=${encodeURIComponent(params.ecosystem)}`);

  const query = queryParts.length > 0 ? `?${queryParts.join("&")}` : "";
  const res = await fetch(`${API_URL}/points${query}`);
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

export async function fetchCommunes(): Promise<string[]> {
  const res = await fetch(`${API_URL}/communes`);
  if (!res.ok) throw new Error(`Error ${res.status}`);
  const data = await res.json();
  return data.communes;
}

export async function fetchProjectsForPoint(pointId: string): Promise<STEMProject[]> {
  const res = await fetch(`${API_URL}/points/${pointId}/projects`);
  if (!res.ok) throw new Error(`Error ${res.status}`);
  const data = await res.json();
  return data.projects;
}

export async function generateProject(
  pointId: string,
  level: string = "basica_segundo_ciclo",
  count: number = 1,
  oaDescriptions?: string[],
  duration?: string
): Promise<GenerateResponse> {
  const body: Record<string, unknown> = {
    point_id: pointId,
    level,
    count,
  };
  if (oaDescriptions && oaDescriptions.length > 0) {
    body.oa_descriptions = oaDescriptions;
  }
  if (duration) {
    body.duration = duration;
  }

  const res = await fetch(`${API_URL}/generate-project`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Error desconocido" }));
    throw new Error(err.detail || `Error ${res.status}`);
  }
  return res.json();
}

// ── Camino B: Currículo ──

export async function fetchCurriculumLevels(): Promise<CurriculumLevel[]> {
  const res = await fetch(`${API_URL}/curriculum/levels`);
  if (!res.ok) throw new Error(`Error ${res.status}`);
  const data = await res.json();
  return data.levels;
}

export async function fetchCurriculum(params?: {
  level?: string;
  subject?: string;
  axis?: string;
}): Promise<CurriculumObjective[]> {
  const queryParts: string[] = [];
  if (params?.level) queryParts.push(`level=${encodeURIComponent(params.level)}`);
  if (params?.subject) queryParts.push(`subject=${encodeURIComponent(params.subject)}`);
  if (params?.axis) queryParts.push(`axis=${encodeURIComponent(params.axis)}`);

  const query = queryParts.length > 0 ? `?${queryParts.join("&")}` : "";
  const res = await fetch(`${API_URL}/curriculum${query}`);
  if (!res.ok) throw new Error(`Error ${res.status}`);
  const data = await res.json();
  return data.objectives;
}

export async function fetchProjectsForObjective(
  objectiveCode: string
): Promise<{ objective: CurriculumObjective; projects: STEMProject[] }> {
  const res = await fetch(`${API_URL}/curriculum/${objectiveCode}/projects`);
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

// ── Escuelas ──

export async function fetchSchools(commune?: string): Promise<School[]> {
  const query = commune ? `?commune=${encodeURIComponent(commune)}` : "";
  const res = await fetch(`${API_URL}/schools${query}`);
  if (!res.ok) throw new Error(`Error ${res.status}`);
  const data = await res.json();
  return data.schools;
}

export async function fetchNearbyPOIs(
  schoolId: string,
  radiusKm: number = 20
): Promise<NearbyResponse> {
  const res = await fetch(
    `${API_URL}/schools/${schoolId}/nearby?radius_km=${radiusKm}`
  );
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

// ── Fase 2: Mis Proyectos ──

/** Obtiene varios proyectos por sus IDs (para el hub "Mis Proyectos") */
export async function fetchProjectsByIds(ids: string[]): Promise<STEMProject[]> {
  if (ids.length === 0) return [];
  const res = await fetch(`${API_URL}/projects/batch`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ project_ids: ids }),
  });
  if (!res.ok) throw new Error(`Error ${res.status}`);
  const data = await res.json();
  return data.projects;
}

/** Expande un proyecto: genera sesiones, guía docente, fichas y rúbrica con Claude */
export async function expandProject(projectId: string): Promise<ProjectDetail> {
  const res = await fetch(`${API_URL}/projects/${projectId}/expand`, {
    method: "POST",
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Error desconocido" }));
    throw new Error(err.detail || `Error ${res.status}`);
  }
  return res.json();
}

// ── Fase 3: Códigos, estudiantes, progreso ──

/** Profesor genera un código para compartir un proyecto */
export async function createShareCode(
  projectId: string,
  teacherId: string,
  schoolId: string
): Promise<ShareCode> {
  const res = await fetch(`${API_URL}/projects/${projectId}/share-code`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ teacher_id: teacherId, school_id: schoolId }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Error" }));
    throw new Error(err.detail || `Error ${res.status}`);
  }
  return res.json();
}

/** Busca un código compartido (devuelve proyecto + escuela) */
export async function lookupShareCode(
  code: string
): Promise<{ share_code: ShareCode; project: STEMProject; school_name: string }> {
  const res = await fetch(`${API_URL}/share-code/${code}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Código no válido" }));
    throw new Error(err.detail || `Error ${res.status}`);
  }
  return res.json();
}

/** Registra o actualiza la sesión de un estudiante */
export async function registerStudent(
  localId: string,
  displayName: string,
  schoolId?: string
): Promise<StudentSession> {
  const res = await fetch(`${API_URL}/students/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ local_id: localId, display_name: displayName, school_id: schoolId }),
  });
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

/** Inscribe a un estudiante en un proyecto via código */
export async function enrollStudent(
  studentId: string,
  shareCode: string
): Promise<StudentEnrollment> {
  const res = await fetch(`${API_URL}/students/${studentId}/enroll`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ share_code: shareCode }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Error al inscribirse" }));
    throw new Error(err.detail || `Error ${res.status}`);
  }
  return res.json();
}

/** Lista los proyectos en los que está inscrito un estudiante */
export async function fetchStudentProjects(
  studentId: string
): Promise<StudentEnrollment[]> {
  const res = await fetch(`${API_URL}/students/${studentId}/projects`);
  if (!res.ok) throw new Error(`Error ${res.status}`);
  const data = await res.json();
  // Backend returns {projects: [...]} with flattened project+enrollment data
  const projects = data.projects || [];
  return projects.map((p: Record<string, unknown>) => ({
    id: p.enrollment_id || p.id,
    student_id: studentId,
    project_id: p.id || p.project_id,
    share_code_id: null,
    enrolled_at: p.enrolled_at as string || "",
    project_title: p.title as string || "Proyecto",
    school_name: "",
  }));
}

/** Marca actividad como completada o no */
export async function updateProgress(
  enrollmentId: string,
  sessionNumber: number,
  activityIndex: number,
  completed: boolean
): Promise<ActivityProgress> {
  const res = await fetch(`${API_URL}/enrollments/${enrollmentId}/progress`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ session_number: sessionNumber, activity_index: activityIndex, completed }),
  });
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

/** Obtiene todo el progreso de un enrollment */
export async function fetchProgress(
  enrollmentId: string
): Promise<ActivityProgress[]> {
  const res = await fetch(`${API_URL}/enrollments/${enrollmentId}/progress`);
  if (!res.ok) throw new Error(`Error ${res.status}`);
  const data = await res.json();
  return data.progress;
}

/** Guarda una nota de campo */
export async function saveFieldNote(
  enrollmentId: string,
  sessionNumber: number,
  noteText: string
): Promise<FieldNote> {
  const res = await fetch(`${API_URL}/enrollments/${enrollmentId}/field-notes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ session_number: sessionNumber, note_text: noteText }),
  });
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

/** Obtiene notas de campo de un enrollment */
export async function fetchFieldNotes(
  enrollmentId: string
): Promise<FieldNote[]> {
  const res = await fetch(`${API_URL}/enrollments/${enrollmentId}/field-notes`);
  if (!res.ok) throw new Error(`Error ${res.status}`);
  const data = await res.json();
  return data.notes;
}

/** Envía respuestas de quiz */
export async function submitQuiz(
  enrollmentId: string,
  sessionNumber: number,
  questions: QuizQuestion[],
  answers: number[]
): Promise<QuizResult> {
  const res = await fetch(`${API_URL}/enrollments/${enrollmentId}/quiz`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ session_number: sessionNumber, questions, answers }),
  });
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

/** Genera quiz con IA para una sesión */
export async function generateQuiz(
  projectId: string,
  sessionNumber: number
): Promise<{ questions: QuizQuestion[] }> {
  const res = await fetch(
    `${API_URL}/projects/${projectId}/generate-quiz?session_number=${sessionNumber}`,
    { method: "POST" }
  );
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Error generando quiz" }));
    throw new Error(err.detail || `Error ${res.status}`);
  }
  return res.json();
}

/** Dashboard del profesor: progreso de todos los estudiantes */
export async function fetchStudentProgress(
  projectId: string
): Promise<StudentProgressSummary[]> {
  const res = await fetch(`${API_URL}/projects/${projectId}/student-progress`);
  if (!res.ok) throw new Error(`Error ${res.status}`);
  const data = await res.json();
  return data.students;
}
