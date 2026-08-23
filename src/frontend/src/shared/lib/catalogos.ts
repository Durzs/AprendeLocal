/**
 * Catálogos leídos directamente de Supabase.
 *
 * Antes venían de la API FastAPI, que exigía desplegar un servicio aparte en
 * Railway con su propio dominio y su configuración de CORS. Pero estas tablas
 * ya tienen políticas públicas de lectura, así que el navegador puede
 * consultarlas sin intermediario: menos infraestructura, menos configuración
 * que se olvida, y un servicio menos que pueda estar caído.
 *
 * Solo se piden las columnas que la pantalla usa. En particular no se pide
 * `location`, que es geometría de PostGIS y llegaría en un formato que aquí no
 * hace falta interpretar.
 */

import { supabase } from "./supabaseClient";
import type {
  CurriculumObjective,
  POIFeature,
  RespuestaSecuencia,
} from "../../types";

export async function leerObjetivos(): Promise<CurriculumObjective[]> {
  const { data, error } = await supabase
    .from("curriculum_objectives")
    .select("id, code, subject, level, axis, oa_number, description, keywords")
    .order("code");

  if (error) throw new Error(error.message);

  return (data ?? []).map((o) => ({ ...o, project_count: 0 }) as CurriculumObjective);
}

export async function leerPuntos(): Promise<POIFeature[]> {
  const { data, error } = await supabase
    .from("points_of_interest")
    .select("id, name, commune, ecosystem_type")
    .order("commune")
    .order("name");

  if (error) throw new Error(error.message);

  // Se conserva la forma GeoJSON que el resto del código ya espera, aunque
  // aquí la geometría no se use.
  return (data ?? []).map(
    (p) =>
      ({
        type: "Feature",
        geometry: { type: "Point", coordinates: [0, 0] },
        properties: {
          id: p.id,
          name: p.name,
          commune: p.commune,
          ecosystem_type: p.ecosystem_type,
        },
      }) as unknown as POIFeature
  );
}

/**
 * Genera la secuencia llamando a la Edge Function de Supabase.
 *
 * Reemplaza al endpoint `POST /sequences` de la API FastAPI. La clave de
 * Anthropic vive como secreto del proyecto y nunca llega al navegador, que era
 * la única razón por la que hacía falta un servicio aparte.
 */
export async function generarSecuencia(params: {
  /** Uno por curso de la sala. En un aula de curso único, uno solo. */
  objectiveCodes: string[];
  pointId: string;
  sesiones?: number;
  notasDocente?: string;
}): Promise<RespuestaSecuencia> {
  const { data, error } = await supabase.functions.invoke("generar-secuencia", {
    body: {
      objective_codes: params.objectiveCodes,
      // Se sigue mandando el campo antiguo: si el navegador del docente tiene
      // cacheada una versión previa de la función, con esto no se rompe.
      objective_code: params.objectiveCodes[0],
      point_id: params.pointId,
      sesiones: params.sesiones ?? 4,
      notas_docente: params.notasDocente ?? "",
    },
  });

  if (error) {
    // La función responde con un motivo legible —falta la clave, no existe el
    // objetivo, el modelo devolvió algo inservible—. Se prefiere ese mensaje
    // al genérico del cliente.
    let motivo = error.message;
    const respuesta = (error as { context?: Response }).context;
    const estado = respuesta?.status;

    if (respuesta && typeof respuesta.json === "function") {
      try {
        const cuerpo = await respuesta.json();
        if (cuerpo?.error) motivo = String(cuerpo.error);
      } catch {
        /* la respuesta no traía JSON */
      }
    }

    // La función existe en el repositorio pero puede no estar desplegada en el
    // proyecto: es un paso manual que no deja rastro en el código, y el
    // mensaje que llegaba entonces —«Failed to send a request to the Edge
    // Function»— apuntaba a un problema de red y escondía la causa. Se nombra.
    const noDesplegada =
      estado === 404 ||
      /failed to send a request|failed to fetch|not found/i.test(error.message);

    if (noDesplegada) {
      throw new Error(
        "El generador de secuencias no está disponible: la función " +
          "«generar-secuencia» no responde en este proyecto de Supabase. " +
          "Suele significar que no se ha desplegado (ver docs/DEPLOY.md)."
      );
    }

    throw new Error(motivo);
  }

  return data as RespuestaSecuencia;
}
