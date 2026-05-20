/**
 * studentStorage.ts — Almacenamiento local del estudiante (sin auth)
 *
 * ¿Cómo funciona?
 * ───────────────
 * Igual que teacherStorage.ts, pero para estudiantes. Usa localStorage
 * para guardar la identidad del alumno y los proyectos en los que
 * está inscrito (via códigos del profesor).
 *
 * Cuando agreguemos autenticación, migraremos estos datos a la BD.
 */

const STUDENT_ID_KEY = "aprendelocal_student_id";
const STUDENT_NAME_KEY = "aprendelocal_student_name";
const ENROLLED_KEY = "aprendelocal_enrolled_projects";

/** Genera o recupera un ID único para este estudiante */
export function getStudentId(): string {
  let id = localStorage.getItem(STUDENT_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(STUDENT_ID_KEY, id);
  }
  return id;
}

/** Retorna el nombre del estudiante (null si no se ha registrado) */
export function getStudentName(): string | null {
  return localStorage.getItem(STUDENT_NAME_KEY);
}

/** Guarda el nombre del estudiante */
export function setStudentName(name: string): void {
  localStorage.setItem(STUDENT_NAME_KEY, name);
}

/** Retorna los IDs de proyectos en los que el estudiante está inscrito */
export function getEnrolledProjectIds(): string[] {
  const raw = localStorage.getItem(ENROLLED_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

/** Agrega un proyecto a la lista de inscritos */
export function addEnrolledProjectId(id: string): void {
  const ids = getEnrolledProjectIds();
  if (!ids.includes(id)) {
    ids.push(id);
    localStorage.setItem(ENROLLED_KEY, JSON.stringify(ids));
  }
}

/** Retorna el rol guardado, o null si no se ha elegido */
export function getSavedRole(): "profesor" | "estudiante" | null {
  const role = localStorage.getItem("aprendelocal_role");
  if (role === "profesor" || role === "estudiante") return role;
  return null;
}

/** Guarda el rol elegido */
export function saveRole(role: "profesor" | "estudiante"): void {
  localStorage.setItem("aprendelocal_role", role);
}

/** Borra el rol (para "cerrar sesión") */
export function clearRole(): void {
  localStorage.removeItem("aprendelocal_role");
}
