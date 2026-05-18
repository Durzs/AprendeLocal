import type { GeoJSONResponse, GenerateResponse, STEMProject } from "./types";

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
