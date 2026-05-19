/**
 * teacherStorage.ts — Almacenamiento local del docente (sin auth)
 *
 * ¿Cómo funciona?
 * ───────────────
 * Como no tenemos login/registro aún, usamos localStorage del navegador
 * para recordar qué proyectos eligió este docente. Es como un "carrito"
 * que persiste entre sesiones.
 *
 * Cuando agreguemos autenticación más adelante, migraremos estos datos
 * a la base de datos.
 */

/** Genera o recupera un ID único para este docente (persistido en localStorage) */
export function getTeacherId(): string {
  const key = "aprendelocal_teacher_id";
  let id = localStorage.getItem(key);
  if (!id) {
    // crypto.randomUUID() funciona en todos los navegadores modernos
    id = crypto.randomUUID();
    localStorage.setItem(key, id);
  }
  return id;
}

/** Retorna los IDs de proyectos que el docente ha guardado */
export function getSavedProjectIds(): string[] {
  const raw = localStorage.getItem("aprendelocal_projects");
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

/** Guarda un proyecto en la lista del docente */
export function saveProjectId(id: string): void {
  const ids = getSavedProjectIds();
  if (!ids.includes(id)) {
    ids.push(id);
    localStorage.setItem("aprendelocal_projects", JSON.stringify(ids));
  }
}

/** Quita un proyecto de la lista del docente */
export function removeProjectId(id: string): void {
  const ids = getSavedProjectIds().filter((x) => x !== id);
  localStorage.setItem("aprendelocal_projects", JSON.stringify(ids));
}
