/**
 * Qué vive alrededor de un punto, según iNaturalist, para el demo del congreso.
 *
 * El cuaderno ya consulta iNaturalist (§sequences/rutas/inaturalist.ts), pero
 * pide nombres y no fotos, porque su lista termina impresa en una fotocopia.
 * En un stand es al revés: la lista se mira en una pantalla, y lo que hace que
 * alguien se detenga es ver el pájaro que tiene en el patio de su escuela con
 * la foto que subió un vecino. Por eso aquí se piden las fotos, con su autoría
 * a la vista, que es lo que exige la licencia de cada una.
 *
 * SIN RED, IGUAL FUNCIONA
 *
 * El wifi de un congreso se cae justo cuando hay gente mirando. Tres capas:
 *
 * 1. Lo consultado se guarda en el navegador, y en modo kiosco se consultan
 *    todos los lugares de ejemplo apenas se abre la página, con señal.
 * 2. Si la consulta falla y no hay nada guardado, se muestran las especies
 *    nativas que el sitio ya trae escritas (§biodiversidad), diciendo que son
 *    esas y por qué.
 * 3. Nada del resto del demo depende de esta pantalla.
 */

import { NATIVAS, type Nativa } from "../biodiversidad/nativas";
import { NATIVAS_BR } from "../biodiversidad/nativas.br";
import { LUGARES, type Lugar } from "./lugares";
import type { Sede } from "../../shared/sede";
import type { Bi } from "../../shared/tx";

export { LUGARES, type Lugar };

/** El radio de la consulta, en kilómetros. Cabe una caminata de curso y algo más. */
export const RADIO_KM = 5;

export type Especie = {
  cientifico: string;
  comun: string;
  grupo: string;
  observaciones: number;
  foto?: string;
  /** Quién sacó la foto y con qué licencia, tal como lo da iNaturalist. */
  autoria?: string;
  url: string;
};

export type Resultado =
  | { fuente: "inaturalist"; especies: Especie[]; total: number; cuando: number }
  | { fuente: "respaldo"; especies: Especie[] };

const GRUPOS: Record<string, Bi & { color: string }> = {
  Plantae: { es: "Planta", pt: "Planta", color: "#56C02B" },
  Aves: { es: "Ave", pt: "Ave", color: "#26BDE2" },
  Insecta: { es: "Insecto", pt: "Inseto", color: "#FCC30B" },
  Fungi: { es: "Hongo", pt: "Fungo", color: "#BF8B2E" },
  Mammalia: { es: "Mamífero", pt: "Mamífero", color: "#FD6925" },
  Amphibia: { es: "Anfibio", pt: "Anfíbio", color: "#4C9F38" },
  Reptilia: { es: "Reptil", pt: "Réptil", color: "#3F7E44" },
  Actinopterygii: { es: "Pez", pt: "Peixe", color: "#0A97D9" },
  Mollusca: { es: "Molusco", pt: "Molusco", color: "#DD1367" },
  Arachnida: { es: "Arácnido", pt: "Aracnídeo", color: "#A21942" },
  Crustacea: { es: "Crustáceo", pt: "Crustáceo", color: "#FD9D24" },
};

export function grupoDe(g: string): Bi & { color: string } {
  return GRUPOS[g] ?? { es: "Ser vivo", pt: "Ser vivo", color: "#19486A" };
}

/* ── La consulta ─────────────────────────────────────────────────────────── */

const memoria = new Map<string, Resultado>();

function clave(l: Pick<Lugar, "lat" | "lng">, locale: string): string {
  return `aprendelocal:congreso:inat:${l.lat.toFixed(2)},${l.lng.toFixed(2)},${locale}`;
}

export function guardado(l: Pick<Lugar, "lat" | "lng">, locale: string): Resultado | null {
  const k = clave(l, locale);
  const m = memoria.get(k);
  if (m) return m;
  try {
    const crudo = localStorage.getItem(k);
    if (!crudo) return null;
    const d = JSON.parse(crudo);
    if (d?.fuente === "inaturalist" && Array.isArray(d.especies)) {
      memoria.set(k, d);
      return d;
    }
  } catch {
    /* Ventana privada o sin permiso: se consulta de nuevo. */
  }
  return null;
}

function recordar(l: Pick<Lugar, "lat" | "lng">, locale: string, r: Resultado): void {
  const k = clave(l, locale);
  memoria.set(k, r);
  try {
    localStorage.setItem(k, JSON.stringify(r));
  } catch {
    /* Sin sitio: vive en memoria mientras la pestaña esté abierta. */
  }
}

/**
 * Cada campo se comprueba antes de usarlo. Si iNaturalist cambia la forma de
 * la respuesta, la lista sale más corta, no rota.
 */
function aEspecie(fila: unknown): Especie | null {
  if (!fila || typeof fila !== "object") return null;
  const f = fila as Record<string, unknown>;
  const t = f.taxon as Record<string, unknown> | undefined;
  if (!t || typeof t !== "object") return null;
  const cientifico = typeof t.name === "string" ? t.name.trim() : "";
  // Una persona fotografiada en la plaza también es una observación.
  if (!cientifico || cientifico === "Homo sapiens") return null;
  const foto = t.default_photo as Record<string, unknown> | undefined;
  const urlFoto =
    foto && typeof foto.medium_url === "string"
      ? foto.medium_url
      : foto && typeof foto.square_url === "string"
        ? foto.square_url
        : undefined;
  return {
    cientifico,
    comun: typeof t.preferred_common_name === "string" ? t.preferred_common_name : "",
    grupo: typeof t.iconic_taxon_name === "string" ? t.iconic_taxon_name : "",
    observaciones: typeof f.count === "number" ? f.count : 0,
    foto: urlFoto,
    autoria: foto && typeof foto.attribution === "string" ? foto.attribution : undefined,
    url: typeof t.id === "number" ? `https://www.inaturalist.org/taxa/${t.id}` : "https://www.inaturalist.org",
  };
}

/**
 * Las especies más registradas alrededor de un punto.
 *
 * `quality_grade=research` deja solo lo que la comunidad ya confirmó: en un
 * stand de educación no queremos mostrar una identificación en duda como si
 * fuera un dato.
 */
export async function consultar(l: Pick<Lugar, "lat" | "lng">, locale: string, sede: Sede): Promise<Resultado> {
  const previo = guardado(l, locale);
  const url =
    "https://api.inaturalist.org/v1/observations/species_counts?" +
    new URLSearchParams({
      lat: String(l.lat),
      lng: String(l.lng),
      radius: String(RADIO_KM),
      quality_grade: "research",
      photos: "true",
      locale,
      per_page: "13",
    });
  try {
    const resp = await fetch(url, { signal: AbortSignal.timeout(8_000), headers: { Accept: "application/json" } });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const cuerpo = await resp.json();
    const filas: unknown[] = Array.isArray(cuerpo?.results) ? cuerpo.results : [];
    const especies = filas.map(aEspecie).filter((e): e is Especie => e !== null).slice(0, 12);
    if (!especies.length) throw new Error("vacio");
    const r: Resultado = {
      fuente: "inaturalist",
      especies,
      total: typeof cuerpo?.total_results === "number" ? cuerpo.total_results : especies.length,
      cuando: Date.now(),
    };
    recordar(l, locale, r);
    return r;
  } catch {
    return previo ?? respaldo(sede);
  }
}

const GRUPO_NATIVA: Record<Nativa["grupo"], string> = {
  arbol: "Plantae",
  planta: "Plantae",
  ave: "Aves",
  mamifero: "Mammalia",
  anfibio: "Amphibia",
  reptil: "Reptilia",
  crustaceo: "Crustacea",
  pez: "Actinopterygii",
  hongo: "Fungi",
};

/** Las nativas que el sitio ya trae, para cuando no hay red. */
export function respaldo(sede: Sede): Resultado {
  const lista = sede === "br" ? NATIVAS_BR : NATIVAS;
  return {
    fuente: "respaldo",
    especies: lista.slice(0, 12).map((n) => ({
      cientifico: n.cientifico,
      comun: n.comun,
      grupo: GRUPO_NATIVA[n.grupo],
      observaciones: 0,
      foto: n.fotoUrl,
      url: `https://www.inaturalist.org/search?q=${encodeURIComponent(n.cientifico)}`,
    })),
  };
}

/**
 * Deja guardados los lugares de ejemplo, uno tras otro.
 *
 * Solo en modo kiosco y solo los que falten: se hace al abrir la página, que
 * es cuando todavía hay señal, para que a media tarde el stand no dependa del
 * wifi del congreso.
 */
export async function precargar(sede: Sede, locale: string): Promise<void> {
  for (const l of LUGARES[sede]) {
    if (guardado(l, locale)) continue;
    await consultar(l, locale, sede);
  }
}
