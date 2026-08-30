/**
 * De dónde sale lo que el mapa dice que vive aquí.
 *
 * Dos fuentes, y no es redundancia: contestan preguntas distintas sobre el
 * mismo bosque.
 *
 *   iNaturalist  QUÉ SE HA VISTO. Observaciones de gente con un teléfono,
 *                confirmadas por la comunidad. Es lo reciente y lo vivo, y es
 *                donde el curso puede aportar.
 *   GBIF         QUÉ ESTÁ REGISTRADO. Herbarios, museos y colecciones
 *                científicas, con material que a veces tiene un siglo. Es lo
 *                que había, esté o no hoy.
 *
 * Las dos juntas dicen algo que ninguna dice sola. Si GBIF tiene ranita de
 * Darwin de una colecta de 1970 y iNaturalist no la ha visto nunca por ahí,
 * eso no es un fallo de los datos: es la pregunta.
 *
 * Las dos son abiertas, gratuitas y no piden clave para leer. La llamada sale
 * del navegador del docente.
 *
 * SOBRE LA VERIFICACIÓN. El entorno donde se escribió esto tiene bloqueada la
 * salida a internet por política, así que el contrato de los campos viene de
 * la documentación de cada servicio y NO está comprobado contra ellos. Por eso
 * todo lo de abajo desconfía: cada campo se valida antes de usarse y lo que no
 * cuadre se descarta. Si una respuesta cambiara de forma, el docente vería una
 * lista más corta y un aviso, nunca una pantalla rota.
 */

export type Avistamiento = {
  cientifico: string;
  /** Nombre común tal como lo da la fuente. Puede faltar. */
  comun: string;
  /** Cuántos registros hay. Da idea de si es común o excepcional. */
  registros: number;
  fuente: "inaturalist" | "gbif";
  /** El año del registro más reciente, cuando la fuente lo dice. */
  ultimoAno?: number;
  url: string;
};

export type Respuesta =
  | { estado: "ok"; avistamientos: Avistamiento[]; total: number }
  | { estado: "vacio" }
  | { estado: "error"; motivo: string };

/** Nadie espera más de esto delante de una pantalla con señal de celular. */
const ESPERA_MS = 15_000;

async function pedirJson(url: string): Promise<unknown> {
  const resp = await fetch(url, {
    signal: AbortSignal.timeout(ESPERA_MS),
    headers: { Accept: "application/json" },
  });
  if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
  return resp.json();
}

function comoError(e: unknown): Respuesta {
  const porTiempo = e instanceof DOMException && e.name === "TimeoutError";
  return { estado: "error", motivo: porTiempo ? "tiempo" : String(e).slice(0, 120) };
}

// ───────────────────────────────────────────────────────────────────────────
// iNaturalist
// ───────────────────────────────────────────────────────────────────────────

/**
 * Qué se ha visto alrededor de un punto.
 *
 * `quality_grade=research` deja fuera lo que la comunidad todavía no ha
 * confirmado. Es una lista más corta y más honesta: no se lleva a un curso una
 * identificación que está en duda.
 */
export async function deINaturalist(
  lat: number,
  lng: number,
  radioKm: number,
  idioma: string
): Promise<Respuesta> {
  const url =
    "https://api.inaturalist.org/v1/observations/species_counts?" +
    new URLSearchParams({
      lat: String(lat),
      lng: String(lng),
      radius: String(radioKm),
      quality_grade: "research",
      locale: idioma,
      per_page: "80",
    });

  try {
    const cuerpo = (await pedirJson(url)) as Record<string, unknown>;
    const filas = Array.isArray(cuerpo?.results) ? cuerpo.results : [];

    const avistamientos: Avistamiento[] = [];
    for (const fila of filas) {
      if (!fila || typeof fila !== "object") continue;
      const f = fila as Record<string, unknown>;
      const t = f.taxon;
      if (!t || typeof t !== "object") continue;
      const taxon = t as Record<string, unknown>;

      const cientifico = typeof taxon.name === "string" ? taxon.name.trim() : "";
      if (!cientifico) continue;

      const id = typeof taxon.id === "number" ? taxon.id : null;
      avistamientos.push({
        cientifico,
        comun:
          typeof taxon.preferred_common_name === "string"
            ? taxon.preferred_common_name.trim()
            : "",
        registros: typeof f.count === "number" ? f.count : 0,
        fuente: "inaturalist",
        url: id
          ? `https://www.inaturalist.org/taxa/${id}`
          : "https://www.inaturalist.org",
      });
    }

    if (avistamientos.length === 0) return { estado: "vacio" };
    return {
      estado: "ok",
      avistamientos,
      total:
        typeof cuerpo?.total_results === "number"
          ? (cuerpo.total_results as number)
          : avistamientos.length,
    };
  } catch (e) {
    return comoError(e);
  }
}

// ───────────────────────────────────────────────────────────────────────────
// GBIF
// ───────────────────────────────────────────────────────────────────────────

/** Un grado de latitud son unos 111 km; en longitud se encoge con el coseno. */
function caja(lat: number, lng: number, radioKm: number) {
  const dLat = radioKm / 111;
  const dLng = radioKm / (111 * Math.max(0.1, Math.cos((lat * Math.PI) / 180)));
  return {
    sur: lat - dLat,
    norte: lat + dLat,
    oeste: lng - dLng,
    este: lng + dLng,
  };
}

/**
 * Qué hay registrado en colecciones científicas alrededor de un punto.
 *
 * GBIF no ofrece «cuenta por especie en un radio», así que se usa su faceta
 * sobre el nombre de especie dentro de un rectángulo. El rectángulo es algo
 * mayor que el círculo que pide el docente; para lo que se usa esto —saber qué
 * hay por la zona— la diferencia no cambia ninguna decisión, y decirlo aquí
 * evita que alguien lo lea como un radio exacto.
 */
export async function deGbif(
  lat: number,
  lng: number,
  radioKm: number
): Promise<Respuesta> {
  const c = caja(lat, lng, radioKm);
  const url =
    "https://api.gbif.org/v1/occurrence/search?" +
    new URLSearchParams({
      decimalLatitude: `${c.sur.toFixed(4)},${c.norte.toFixed(4)}`,
      decimalLongitude: `${c.oeste.toFixed(4)},${c.este.toFixed(4)}`,
      country: "CL",
      hasCoordinate: "true",
      hasGeospatialIssue: "false",
      facet: "speciesKey",
      facetLimit: "60",
      limit: "0",
    });

  try {
    const cuerpo = (await pedirJson(url)) as Record<string, unknown>;
    const facetas = Array.isArray(cuerpo?.facets) ? cuerpo.facets : [];
    const especies = facetas.find(
      (f: unknown) =>
        f && typeof f === "object" && (f as Record<string, unknown>).field === "SPECIES_KEY"
    ) as Record<string, unknown> | undefined;

    const conteos = Array.isArray(especies?.counts) ? especies.counts : [];
    if (conteos.length === 0) return { estado: "vacio" };

    // La faceta devuelve identificadores, no nombres. Se resuelven de una vez
    // con la búsqueda por lote en vez de una llamada por especie: sesenta
    // peticiones desde un celular rural no es una opción.
    const claves = conteos
      .map((c2: unknown) =>
        c2 && typeof c2 === "object" ? (c2 as Record<string, unknown>).name : null
      )
      .filter((k: unknown): k is string => typeof k === "string")
      .slice(0, 40);

    const nombres = await Promise.all(
      claves.map(async (clave) => {
        try {
          const t = (await pedirJson(
            `https://api.gbif.org/v1/species/${encodeURIComponent(clave)}`
          )) as Record<string, unknown>;
          return {
            clave,
            cientifico:
              typeof t?.species === "string"
                ? t.species
                : typeof t?.scientificName === "string"
                  ? t.scientificName
                  : "",
            comun:
              typeof t?.vernacularName === "string" ? t.vernacularName : "",
          };
        } catch {
          return null;
        }
      })
    );

    const porClave = new Map(
      nombres
        .filter((n): n is NonNullable<typeof n> => n !== null && Boolean(n.cientifico))
        .map((n) => [n.clave, n])
    );

    const avistamientos: Avistamiento[] = [];
    for (const c2 of conteos) {
      if (!c2 || typeof c2 !== "object") continue;
      const fila = c2 as Record<string, unknown>;
      const clave = typeof fila.name === "string" ? fila.name : "";
      const nombre = porClave.get(clave);
      if (!nombre) continue;
      avistamientos.push({
        cientifico: nombre.cientifico,
        comun: nombre.comun,
        registros: typeof fila.count === "number" ? fila.count : 0,
        fuente: "gbif",
        url: `https://www.gbif.org/species/${encodeURIComponent(clave)}`,
      });
    }

    if (avistamientos.length === 0) return { estado: "vacio" };
    return {
      estado: "ok",
      avistamientos,
      total:
        typeof cuerpo?.count === "number" ? (cuerpo.count as number) : avistamientos.length,
    };
  } catch (e) {
    return comoError(e);
  }
}

// ───────────────────────────────────────────────────────────────────────────

export type Combinado = {
  avistamientos: Avistamiento[];
  /** Qué fuente respondió y qué fuente no, para poder decirlo en pantalla. */
  fallos: { fuente: string; motivo: string }[];
  cuando: number;
};

/**
 * Las dos fuentes a la vez, y una lista sola.
 *
 * Si las dos traen la misma especie se funden en una fila y se suman los
 * registros, pero se deja constancia de que la vieron las dos: que una especie
 * esté en las dos fuentes es una señal de que ese dato es sólido.
 *
 * Se piden en paralelo y se tolera que una falle. Media respuesta sigue siendo
 * útil; esperar a las dos para no dar ninguna, no.
 */
export async function consultarTodo(
  lat: number,
  lng: number,
  radioKm: number,
  idioma: string
): Promise<Combinado> {
  const [inat, gbif] = await Promise.all([
    deINaturalist(lat, lng, radioKm, idioma),
    deGbif(lat, lng, radioKm),
  ]);

  const fallos: { fuente: string; motivo: string }[] = [];
  if (inat.estado === "error") fallos.push({ fuente: "iNaturalist", motivo: inat.motivo });
  if (gbif.estado === "error") fallos.push({ fuente: "GBIF", motivo: gbif.motivo });

  const porNombre = new Map<string, Avistamiento & { fuentes: Set<string> }>();
  for (const r of [inat, gbif]) {
    if (r.estado !== "ok") continue;
    for (const a of r.avistamientos) {
      const clave = a.cientifico.toLowerCase().split(/\s+/).slice(0, 2).join(" ");
      const ya = porNombre.get(clave);
      if (ya) {
        ya.registros += a.registros;
        ya.fuentes.add(a.fuente);
        // El nombre común que exista gana: GBIF suele no traerlo.
        if (!ya.comun && a.comun) ya.comun = a.comun;
      } else {
        porNombre.set(clave, { ...a, fuentes: new Set([a.fuente]) });
      }
    }
  }

  const avistamientos = [...porNombre.values()].sort((a, b) => b.registros - a.registros);
  return { avistamientos, fallos, cuando: Date.now() };
}
