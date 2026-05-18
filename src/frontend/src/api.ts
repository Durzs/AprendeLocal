import type {
  GeoJSONResponse,
  GenerateResponse,
  STEMProject,
  CurriculumObjective,
  CurriculumLevel,
  School,
  NearbyResponse,
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
  count: number = 1
): Promise<GenerateResponse> {
  const res = await fetch(`${API_URL}/generate-project`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ point_id: pointId, level, count }),
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
