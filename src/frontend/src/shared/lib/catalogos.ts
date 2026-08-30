/**
 * Catálogos leídos directamente de Supabase.
 *
 * Antes venían de la API FastAPI, que exigía desplegar un servicio aparte en
 * Railway con su propio dominio y su configuración de CORS. Pero estas tablas
 * ya tienen políticas públicas de lectura, así que el navegador puede
 * consultarlas sin intermediario: menos infraestructura, menos configuración
 * que se olvida, y un servicio menos que pueda estar caído.
 *
 * Solo se piden las columnas que cada pantalla usa. `location` es geometría de
 * PostGIS y llega en hexadecimal, así que solo la pide quien va a dibujar un
 * mapa: `leerLugares`. Quien únicamente necesita nombres usa `leerPuntos`, que
 * es más barata.
 */

import { supabase } from "./supabaseClient";
import { decodificarPunto, type Punto } from "./geometria";

/** Lo leído, y cuántas filas trajo la base aunque no se pudieran usar. */
export type LecturaLugares = { lugares: Lugar[]; filas: number };

/** Un lugar del territorio, ya listo para pintarse en un mapa. */
export type Lugar = {
  id: string;
  nombre: string;
  comuna: string;
  tipo: string;
  ecosistema: string;
  descripcion: string;
  patrimonio: string;
  amenazas: string[];
  punto: Punto;
};
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

/**
 * Los lugares CON sus coordenadas de verdad.
 *
 * `leerPuntos`, más abajo, devuelve `[0, 0]` a propósito: la pantalla que la
 * usa elige un lugar por su nombre y nunca lo dibuja. El mapa sí lo dibuja, y
 * con ceros acababa poniendo los ciento treinta puntos frente a la costa de
 * África.
 *
 * Las coordenadas viven en `location`, que PostgREST entrega como hexadecimal
 * de PostGIS. Un lugar cuya geometría no se pueda leer se descarta en vez de
 * romper la pantalla: vale más un mapa con ciento veintinueve puntos que una
 * excepción con ciento treinta.
 */
export async function leerLugares(): Promise<LecturaLugares> {
  const { data, error } = await supabase
    .from("points_of_interest")
    .select(
      "id, name, type, commune, ecosystem_type, description, stem_areas, heritage_type, threats, location"
    )
    .order("commune")
    .order("name");

  if (error) throw new Error(error.message);

  const filas = data ?? [];
  const salida: Lugar[] = [];
  for (const fila of filas) {
    const p = fila as Record<string, unknown>;
    const punto = decodificarPunto(p.location);
    if (!punto) continue;
    salida.push({
      id: String(p.id),
      nombre: String(p.name ?? ""),
      comuna: String(p.commune ?? ""),
      tipo: String(p.type ?? ""),
      ecosistema: String(p.ecosystem_type ?? ""),
      descripcion: String(p.description ?? ""),
      patrimonio: String(p.heritage_type ?? ""),
      amenazas: Array.isArray(p.threats) ? (p.threats as string[]) : [],
      punto,
    });
  }

  // La diferencia importa para poder arreglarlo: una tabla vacía se puebla
  // con el seed; una tabla con filas cuya geometría no se lee es un problema
  // de permisos o de formato de la columna. Antes las dos salían con el mismo
  // mensaje y había que adivinar cuál era.
  return { lugares: salida, filas: filas.length };
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
  /**
   * Idioma en el que se quiere la clase.
   *
   * Traducir el armazón de la pantalla y dejar la secuencia en español deja el
   * trabajo a medias justo en la parte que se lee: la clase es el producto.
   */
  idioma?: string;
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
      // Una función aún sin desplegar ignora este campo y responde en español,
      // que es el comportamiento de siempre: no rompe nada.
      idioma: params.idioma ?? "es",
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
