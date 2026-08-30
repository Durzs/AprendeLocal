/**
 * Qué se ha visto de verdad alrededor de esta escuela.
 *
 * iNaturalist es el registro abierto de observaciones de naturaleza más
 * grande que existe, y en La Araucanía tiene miles. Para una ruta que pide
 * armar la red alimentaria de un metro cuadrado de bosque, eso cambia algo
 * concreto: los seres vivos dejan de ser «un pájaro» y pasan a tener nombre,
 * y son los que de verdad andan por ahí, no los del libro.
 *
 * Tres decisiones que condicionan todo lo de abajo:
 *
 * 1. SE CONSULTA ANTES DE SALIR, NUNCA EN TERRENO. En el estero no hay señal.
 *    Esto se mira en la escuela o en la casa, se guarda, y se imprime. Si la
 *    lista solo existiera con conexión, existiría justo donde no sirve.
 *
 * 2. LA RUTA FUNCIONA SIN ESTO. Es un añadido, no un requisito. Si la API no
 *    responde, si el docente no dio permiso de ubicación o si sencillamente no
 *    hay observaciones cerca, la clase sigue completa. Nada de lo que la ruta
 *    necesita depende de una llamada de red.
 *
 * 3. NOMBRES, NO FOTOS. Las fotos de iNaturalist tienen licencia por
 *    observación, y en una fotocopia de escuela rural salen como una mancha
 *    gris. Los nombres se leen, se imprimen y se comparan con lo que el curso
 *    encuentre.
 *
 * La llamada sale del navegador del docente, no de un servidor nuestro: los
 * endpoints de lectura de la versión 1 no piden clave. Se manda `User-Agent`
 * porque su documentación lo pide para poder contactar si algo va mal.
 */

const BASE = "https://api.inaturalist.org/v1";

/** Grupos tal como los nombra iNaturalist en `iconic_taxa`. */
export type Grupo =
  | "Plantae"
  | "Insecta"
  | "Aves"
  | "Fungi"
  | "Mollusca"
  | "Amphibia"
  | "Actinopterygii"
  | "Mammalia"
  | "Arachnida";

export type Especie = {
  /** Cuántas veces se ha registrado alrededor. Da idea de si es común o raro. */
  observaciones: number;
  /** El nombre común en el idioma pedido, si existe. Muchas veces no existe. */
  comun: string;
  /** El científico. Este siempre está, y es el que no cambia de un país a otro. */
  cientifico: string;
  grupo: string;
  /** Para poder ir a verlo. Solo se usa en pantalla, no en el papel. */
  url: string;
};

export type Consulta = {
  lat: number;
  lng: number;
  /** En kilómetros. */
  radio: number;
  grupos: Grupo[];
  idioma: string;
};

/**
 * Lo guardado de una consulta.
 *
 * Se conserva el «cuándo» porque un docente tiene derecho a saber si lo que
 * está mirando lo bajó hoy o en marzo del año pasado.
 */
export type Guardado = {
  especies: Especie[];
  cuando: number;
  totalEspecies: number;
};

/** Redondear la posición agrupa consultas casi iguales en una sola entrada. */
function claveCache(c: Consulta): string {
  const lat = c.lat.toFixed(2);
  const lng = c.lng.toFixed(2);
  return `aprendelocal:inat:${lat},${lng},${c.radio},${c.grupos.join("-")},${c.idioma}`;
}

export function leerGuardado(c: Consulta): Guardado | null {
  try {
    const crudo = localStorage.getItem(claveCache(c));
    if (!crudo) return null;
    const d = JSON.parse(crudo);
    return Array.isArray(d?.especies) ? d : null;
  } catch {
    return null;
  }
}

function guardar(c: Consulta, g: Guardado): void {
  try {
    localStorage.setItem(claveCache(c), JSON.stringify(g));
  } catch {
    /* Sin sitio se sigue: la lista vive en memoria hasta que se recargue. */
  }
}

/**
 * Nunca confiar en la forma de la respuesta.
 *
 * Esto se escribió sin poder llamar a la API desde el entorno de desarrollo
 * —la salida a internet está bloqueada por política—, así que el contrato de
 * los campos está tomado de la documentación y no verificado contra el
 * servicio. Por eso cada campo se comprueba antes de usarlo y cualquier
 * entrada que no cuadre se descarta en vez de romper la pantalla. Si la forma
 * cambiara, el docente vería una lista más corta, no un error.
 */
function aEspecie(fila: unknown): Especie | null {
  if (!fila || typeof fila !== "object") return null;
  const f = fila as Record<string, unknown>;
  const taxon = f.taxon;
  if (!taxon || typeof taxon !== "object") return null;
  const t = taxon as Record<string, unknown>;

  const cientifico = typeof t.name === "string" ? t.name.trim() : "";
  if (!cientifico) return null;

  const comun =
    typeof t.preferred_common_name === "string" ? t.preferred_common_name.trim() : "";
  const id = typeof t.id === "number" ? t.id : null;

  return {
    observaciones: typeof f.count === "number" ? f.count : 0,
    comun,
    cientifico,
    grupo: typeof t.iconic_taxon_name === "string" ? t.iconic_taxon_name : "",
    url: id ? `https://www.inaturalist.org/taxa/${id}` : "https://www.inaturalist.org",
  };
}

export type Resultado =
  | { estado: "ok"; datos: Guardado }
  | { estado: "vacio" }
  | { estado: "error"; motivo: string };

/**
 * Pregunta qué especies se han registrado alrededor de un punto.
 *
 * `quality_grade=research` deja fuera lo que la comunidad todavía no ha
 * confirmado. Es más corto y es más honesto: una lista para llevar a un curso
 * no debería incluir identificaciones que están en duda.
 */
export async function consultar(c: Consulta): Promise<Resultado> {
  const url =
    `${BASE}/observations/species_counts?` +
    new URLSearchParams({
      lat: String(c.lat),
      lng: String(c.lng),
      radius: String(c.radio),
      quality_grade: "research",
      iconic_taxa: c.grupos.join(","),
      locale: c.idioma,
      per_page: "60",
    });

  try {
    // Un docente rural con señal de celular puede tardar. Pero tampoco se le
    // deja la pantalla colgada: a los quince segundos se corta y se dice.
    const reloj = AbortSignal.timeout(15_000);
    const resp = await fetch(url, {
      signal: reloj,
      headers: { Accept: "application/json" },
    });

    if (!resp.ok) {
      return { estado: "error", motivo: `HTTP ${resp.status}` };
    }

    const cuerpo = await resp.json();
    const filas = Array.isArray(cuerpo?.results) ? cuerpo.results : [];
    const especies = filas
      .map(aEspecie)
      .filter((e: Especie | null): e is Especie => e !== null);

    if (especies.length === 0) return { estado: "vacio" };

    const datos: Guardado = {
      especies,
      cuando: Date.now(),
      totalEspecies:
        typeof cuerpo?.total_results === "number" ? cuerpo.total_results : especies.length,
    };
    guardar(c, datos);
    return { estado: "ok", datos };
  } catch (e) {
    const porTiempo = e instanceof DOMException && e.name === "TimeoutError";
    return {
      estado: "error",
      motivo: porTiempo ? "tiempo" : String(e).slice(0, 120),
    };
  }
}

/**
 * La ubicación de la escuela, con una sola pulsación.
 *
 * Escribir coordenadas a mano no es algo que se le pueda pedir a nadie. El
 * navegador las da si el docente acepta, y se piden desde la escuela, que es
 * justo el punto que interesa.
 */
export function pedirUbicacion(): Promise<{ lat: number; lng: number }> {
  return new Promise((resolver, rechazar) => {
    if (!navigator.geolocation) {
      rechazar(new Error("sin-geolocalizacion"));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        resolver({
          lat: Number(pos.coords.latitude.toFixed(5)),
          lng: Number(pos.coords.longitude.toFixed(5)),
        }),
      (err) => rechazar(new Error(err.code === 1 ? "denegado" : "sin-senal")),
      { enableHighAccuracy: false, timeout: 15_000, maximumAge: 600_000 }
    );
  });
}
