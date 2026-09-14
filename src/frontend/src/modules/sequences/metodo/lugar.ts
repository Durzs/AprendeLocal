/**
 * Dónde queda la escuela, sin que nadie lo escriba.
 *
 * POR QUÉ ESTO NO PUEDE SER UN CAMPO DE TEXTO
 *
 * La lámina pedía marcar un entorno de una lista de seis y después escribir
 * «cómo se llama ese lugar». Dos problemas. El primero es que el nombre lo
 * tiene que teclear alguien que ya lo sabe, o sea que no aporta nada y solo
 * quita tiempo. El segundo es más de fondo: escrito a mano, «el estero» de una
 * escuela y «el estero» de la de al lado son cadenas de texto distintas y el
 * sistema no puede saber que hablan del mismo cauce.
 *
 * Con la coordenada sí se puede. Se pregunta a OpenStreetMap qué hay
 * alrededor y el docente elige de una lista de sitios que existen, con su
 * nombre real.
 *
 * Y LA COORDENADA NO PUEDE VENIR SOLO DEL NAVEGADOR
 *
 * Esto se aprendió en una entrevista y era un error grueso. La primera versión
 * pedía la ubicación del navegador y nada más, o sea daba por hecho que el
 * docente planifica sentado en la escuela. No planifica ahí: planifica en su
 * casa, un domingo por la noche, a treinta kilómetros. Pedirle el GPS en ese
 * momento devuelve su living.
 *
 * Por eso lo primero es buscar la escuela por su nombre, que es lo que
 * cualquiera puede escribir desde donde esté. El GPS queda de atajo para quien
 * sí esté en la escuela.
 *
 * QUÉ PASA CUANDO NO HAY SEÑAL
 *
 * Pasa seguido y la aplicación tiene que seguir sirviendo. Todo lo de aquí
 * abajo puede fallar, y cuando falla queda el campo escrito a mano, que es lo
 * que había antes. Lo que no se hace es dejar la pantalla esperando ni fingir
 * que se encontró algo.
 *
 * DE DÓNDE SALEN LOS DATOS
 *
 * De Nominatim, el buscador de OpenStreetMap. Es gratis, no pide clave, y a
 * cambio pide dos cosas que se respetan aquí: identificarse en las peticiones
 * y no pasar de una por segundo. Por eso las búsquedas van en fila y no en
 * paralelo, aunque en paralelo serían más rápidas.
 */

/** Un sitio con nombre, encontrado cerca de la escuela. */
export type Lugar = {
  nombre: string;
  /** Cómo lo llama OpenStreetMap: river, stream, wood, peak… */
  tipo: string;
  /** A qué entorno de los seis corresponde, para marcarlo solo. */
  entorno: Entorno;
  lat: number;
  lng: number;
};

/** Los seis entornos de la lámina, repetidos aquí para no depender de ella. */
export type Entorno = "rio" | "bosque" | "campo" | "costa" | "cordillera" | "pueblo";

export type Coordenada = { lat: number; lng: number };

export type Donde = {
  localidad: string;
  comuna: string;
  region: string;
};

/**
 * Un punto real de La Araucanía, para ver cómo funciona esto sin dar permiso.
 *
 * Curarrehue, en la provincia de Cautín. Se eligió porque tiene lo que casi
 * toda escuela rural del sur tiene cerca —un río grande, varios esteros, monte
 * y volcán— y porque permite que quien está probando la aplicación desde una
 * oficina en Santiago vea exactamente lo que verá un profesor allá.
 *
 * No trae lugares escritos: al pulsarlo se hace la misma consulta de verdad
 * que se haría con la ubicación propia, y lo que aparece es lo que hay.
 */
export const EJEMPLO_ARAUCANIA: Coordenada & { nombre: string } = {
  lat: -39.3608,
  lng: -71.5892,
  nombre: "Curarrehue, La Araucanía",
};

/** Lo que puede salir mal, dicho de manera que se pueda mostrar. */
export type Falla = "sin_permiso" | "sin_soporte" | "sin_senal" | "nada_cerca";

const AGENTE = "AprendeLocal/1.0 (aprendelocal.com)";
const ESPERA_MS = 7_000;

/**
 * Cuánto puede durar la búsqueda entera, pase lo que pase.
 *
 * Ocho búsquedas en fila, cada una con su espera y su pausa de cortesía,
 * pueden sumar minuto y medio cuando la red va mal. Nadie mira un botón que
 * dice «buscando» durante minuto y medio: cierra la pestaña. Al cumplirse el
 * plazo se devuelve lo que haya llegado, que con dos o tres sitios ya sirve.
 */
const PLAZO_TOTAL_MS = 20_000;

/** Nominatim pide no pasar de una petición por segundo, y se respeta. */
const PAUSA_MS = 1100;
const dormir = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function traer(url: string): Promise<unknown> {
  const corte = new AbortController();
  const reloj = setTimeout(() => corte.abort(), ESPERA_MS);
  try {
    const r = await fetch(url, {
      signal: corte.signal,
      headers: { Accept: "application/json", "User-Agent": AGENTE },
    });
    if (!r.ok) throw new Error(String(r.status));
    return await r.json();
  } finally {
    clearTimeout(reloj);
  }
}

/** Una escuela encontrada por su nombre, con dónde queda. */
export type Escuela = {
  nombre: string;
  /** Comuna y región, para distinguir dos escuelas que se llaman igual. */
  donde: string;
  lat: number;
  lng: number;
};

/**
 * Busca una escuela por su nombre o su dirección.
 *
 * Es la puerta principal de esta lámina, no un extra: un docente planifica
 * desde su casa y el nombre de su escuela es lo único que puede escribir sin
 * estar ahí. Se limita a Chile porque hay escuelas con el mismo nombre en
 * media Hispanoamérica y el ruido no ayuda a nadie.
 */
export async function buscarEscuela(texto: string): Promise<Escuela[]> {
  const q = texto.trim();
  if (q.length < 3) return [];
  const url =
    `https://nominatim.openstreetmap.org/search?format=jsonv2` +
    `&q=${encodeURIComponent(q)}&countrycodes=cl&limit=6` +
    `&addressdetails=1&accept-language=es`;
  const filas = (await traer(url)) as {
    name?: string;
    display_name?: string;
    lat?: string;
    lon?: string;
    address?: Record<string, string>;
  }[];
  return filas.map((f) => {
    const a = f.address ?? {};
    return {
      nombre: (f.name ?? f.display_name ?? "").split(",")[0].trim(),
      donde: [a.town || a.village || a.city || a.hamlet, a.state]
        .filter(Boolean)
        .join(", "),
      lat: Number(f.lat),
      lng: Number(f.lon),
    };
  });
}

/** La coordenada del navegador. Falla rápido: nadie espera medio minuto. */
export function ubicarse(): Promise<Coordenada> {
  return new Promise((listo, falla) => {
    if (!navigator.geolocation) return falla(new Error("sin_soporte"));
    navigator.geolocation.getCurrentPosition(
      (p) => listo({ lat: p.coords.latitude, lng: p.coords.longitude }),
      (e) => falla(new Error(e.code === e.PERMISSION_DENIED ? "sin_permiso" : "sin_senal")),
      { enableHighAccuracy: false, timeout: ESPERA_MS, maximumAge: 600_000 }
    );
  });
}

/** Comuna y región a partir de la coordenada. Esto es lo que era automático. */
export async function comunaDe(c: Coordenada): Promise<Donde> {
  const url =
    `https://nominatim.openstreetmap.org/reverse?format=jsonv2` +
    `&lat=${c.lat}&lon=${c.lng}&zoom=12&accept-language=es`;
  const d = traerDireccion(await traer(url));
  return d;
}

function traerDireccion(crudo: unknown): Donde {
  const a = (crudo as { address?: Record<string, string> })?.address ?? {};
  return {
    localidad: a.village || a.town || a.hamlet || a.city || a.suburb || "",
    comuna: a.town || a.city || a.municipality || a.county || "",
    region: a.state || "",
  };
}

/**
 * Qué busca cada entorno, y con qué palabra.
 *
 * Se busca por palabra y no por etiqueta de OpenStreetMap porque los nombres
 * chilenos la llevan dentro: «Estero Huililco», «Cerro Ñielol», «Lago Colico».
 * Buscar «estero» en un recuadro alrededor de la escuela devuelve los esteros
 * de esa escuela, que es exactamente lo que hace falta.
 */
const BUSQUEDAS: { palabra: string; entorno: Entorno }[] = [
  { palabra: "río", entorno: "rio" },
  { palabra: "estero", entorno: "rio" },
  { palabra: "lago", entorno: "costa" },
  { palabra: "laguna", entorno: "costa" },
  { palabra: "cerro", entorno: "cordillera" },
  { palabra: "volcán", entorno: "cordillera" },
  { palabra: "reserva", entorno: "bosque" },
];

/** El recuadro alrededor de la escuela, en grados. Unos diez kilómetros. */
const RADIO = 0.09;

/**
 * Los sitios con nombre que hay alrededor.
 *
 * Devuelve lo que encuentre y no falla si alguna búsqueda se cae: con que
 * vuelvan dos o tres el docente ya tiene de dónde elegir, y exigir las ocho
 * haría que una sola consulta lenta dejara la lista vacía.
 */
export async function lugaresCerca(c: Coordenada): Promise<Lugar[]> {
  const caja = [c.lng - RADIO, c.lat + RADIO, c.lng + RADIO, c.lat - RADIO].join(",");
  const vistos = new Set<string>();
  const salida: Lugar[] = [];

  const hastaCuando = Date.now() + PLAZO_TOTAL_MS;

  for (const { palabra, entorno } of BUSQUEDAS) {
    // Se corta con lo que haya: más vale una lista corta a tiempo que una
    // completa que nadie esperó.
    if (Date.now() > hastaCuando) break;
    try {
      const url =
        `https://nominatim.openstreetmap.org/search?format=jsonv2` +
        `&q=${encodeURIComponent(palabra)}&viewbox=${caja}&bounded=1&limit=5` +
        `&accept-language=es`;
      const filas = (await traer(url)) as {
        name?: string;
        type?: string;
        lat?: string;
        lon?: string;
      }[];
      for (const f of filas) {
        const nombre = (f.name ?? "").trim();
        if (!nombre || vistos.has(nombre.toLowerCase())) continue;
        vistos.add(nombre.toLowerCase());
        salida.push({
          nombre,
          tipo: f.type ?? "",
          entorno,
          lat: Number(f.lat),
          lng: Number(f.lon),
        });
      }
    } catch {
      /* Una búsqueda que falla no tumba las demás. */
    }
    await dormir(PAUSA_MS);
  }

  return salida;
}

/**
 * A cuántos metros está un sitio de la escuela.
 *
 * Sirve para ordenar la lista por cercanía, que es el orden en que un docente
 * la quiere leer: lo que se alcanza caminando primero. La fórmula es la de la
 * esfera y sobra de sobra para diez kilómetros.
 */
export function metrosEntre(a: Coordenada, b: Coordenada): number {
  const R = 6_371_000;
  const rad = (g: number) => (g * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return Math.round(2 * R * Math.asin(Math.sqrt(h)));
}

/** «a 20 minutos caminando» dice más que «1,6 km» cuando hay que decidir. */
export function aQueDistancia(metros: number): string {
  if (metros < 400) return "al lado";
  const minutos = Math.round(metros / 80);
  if (minutos <= 25) return `${minutos} min caminando`;
  return `${(metros / 1000).toFixed(1)} km`;
}
