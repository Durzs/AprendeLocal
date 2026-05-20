/**
 * studentStorage.ts — Almacenamiento local del estudiante (sin auth)
 *
 * REFINAMIENTO: Soporte multi-perfil para tablets compartidas.
 * En escuelas rurales, 4-6 alumnos comparten una tablet.
 * Ahora guardamos una lista de perfiles y un perfil activo,
 * con pantalla "¿Quién eres?" al inicio.
 */

const PROFILES_KEY = "aprendelocal_student_profiles";
const ACTIVE_PROFILE_KEY = "aprendelocal_active_student";
const ENROLLED_KEY = "aprendelocal_enrolled_projects";

/** Un perfil de estudiante guardado en el dispositivo */
export interface StudentProfile {
  id: string;
  name: string;
  createdAt: string;
}

// ── Multi-perfil ──

/** Devuelve todos los perfiles guardados en este dispositivo */
export function getAllProfiles(): StudentProfile[] {
  const raw = localStorage.getItem(PROFILES_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

/** Guarda la lista de perfiles */
function saveProfiles(profiles: StudentProfile[]): void {
  localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
}

/** Crea un nuevo perfil y lo activa */
export function createProfile(name: string): StudentProfile {
  const profile: StudentProfile = {
    id: crypto.randomUUID(),
    name,
    createdAt: new Date().toISOString(),
  };
  const profiles = getAllProfiles();
  profiles.push(profile);
  saveProfiles(profiles);
  setActiveProfile(profile.id);
  return profile;
}

/** Activa un perfil existente */
export function setActiveProfile(profileId: string): void {
  localStorage.setItem(ACTIVE_PROFILE_KEY, profileId);
}

/** Devuelve el perfil activo, o null si no hay ninguno seleccionado */
export function getActiveProfile(): StudentProfile | null {
  const activeId = localStorage.getItem(ACTIVE_PROFILE_KEY);
  if (!activeId) return null;
  const profiles = getAllProfiles();
  return profiles.find((p) => p.id === activeId) || null;
}

/** Elimina un perfil del dispositivo */
export function removeProfile(profileId: string): void {
  const profiles = getAllProfiles().filter((p) => p.id !== profileId);
  saveProfiles(profiles);
  // Si era el activo, desactivar
  const activeId = localStorage.getItem(ACTIVE_PROFILE_KEY);
  if (activeId === profileId) {
    localStorage.removeItem(ACTIVE_PROFILE_KEY);
  }
}

/** Cierra la sesión del perfil activo (no lo borra, solo desactiva) */
export function logoutActiveProfile(): void {
  localStorage.removeItem(ACTIVE_PROFILE_KEY);
}

// ── Compatibilidad con código existente ──

/** Genera o recupera un ID único para el estudiante activo */
export function getStudentId(): string {
  const active = getActiveProfile();
  if (active) return active.id;
  // Fallback: generar uno temporal
  let id = localStorage.getItem("aprendelocal_student_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("aprendelocal_student_id", id);
  }
  return id;
}

/** Retorna el nombre del estudiante activo (null si no hay perfil) */
export function getStudentName(): string | null {
  const active = getActiveProfile();
  return active?.name || null;
}

/** Guarda el nombre del estudiante (crea perfil si no existe) */
export function setStudentName(name: string): void {
  const active = getActiveProfile();
  if (active) {
    // Actualizar nombre del perfil activo
    const profiles = getAllProfiles();
    const idx = profiles.findIndex((p) => p.id === active.id);
    if (idx >= 0) {
      profiles[idx].name = name;
      saveProfiles(profiles);
    }
  } else {
    // Crear nuevo perfil
    createProfile(name);
  }
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
