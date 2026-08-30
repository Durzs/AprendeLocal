/**
 * Sacar latitud y longitud de lo que devuelve la base.
 *
 * Por qué hace falta esto. La columna `location` de `points_of_interest` es
 * `GEOMETRY(Point, 4326)`, y PostgREST —que es lo que hay debajo del cliente
 * de Supabase— no la entrega como un par de números: la entrega como una
 * cadena hexadecimal en formato EWKB, que es el binario de PostGIS escrito en
 * hexadecimal.
 *
 * Hasta ahora nadie la leía. Las coordenadas venían de la API de FastAPI, que
 * hacía la consulta espacial en el servidor, y cuando esa API dejó de
 * responder el mapa se quedó sin un solo punto real: `leerPuntos` devolvía
 * `[0, 0]` a propósito porque la pantalla que la usaba no necesitaba
 * geometría. El mapa sí, y ahí se rompía.
 *
 * Decodificarlo aquí evita tener que tocar la base de datos. La alternativa
 * —una vista con ST_X y ST_Y, o columnas generadas— es más limpia, pero
 * obliga a ejecutar SQL en producción, y esto funciona hoy sin que nadie
 * tenga que hacer nada.
 *
 * El formato, para quien venga después:
 *
 *   byte 0        01 si los números van en little endian, 00 si big endian
 *   bytes 1..4    el tipo. 1 es punto. El bit 0x20000000 dice que trae SRID
 *   bytes 5..8    el SRID, solo si ese bit estaba puesto (4326 para lat/lng)
 *   luego         dos float64: primero X, que es la LONGITUD, después Y
 *
 * El orden importa y se confunde con facilidad: en EWKB va longitud antes que
 * latitud, al revés de como se dicen en voz alta.
 */

export type Punto = { lat: number; lng: number };

/**
 * Devuelve null en vez de lanzar. Un punto que no se puede leer es un punto
 * que no se dibuja, y eso es preferible a una pantalla en blanco: en una
 * tabla de ciento treinta lugares basta uno mal guardado para tumbar el mapa
 * entero si esto lanzara.
 */
export function decodificarPunto(valor: unknown): Punto | null {
  if (!valor) return null;

  // 1. Objeto GeoJSON { type: "Point", coordinates: [lng, lat] } o { lat, lng }
  if (typeof valor === "object" && valor !== null) {
    const obj = valor as Record<string, unknown>;
    if (Array.isArray(obj.coordinates) && obj.coordinates.length >= 2) {
      const lng = Number(obj.coordinates[0]);
      const lat = Number(obj.coordinates[1]);
      if (
        Number.isFinite(lat) &&
        Number.isFinite(lng) &&
        Math.abs(lat) <= 90 &&
        Math.abs(lng) <= 180
      ) {
        return { lat, lng };
      }
    }
    if (typeof obj.lat === "number" && typeof obj.lng === "number") {
      if (Math.abs(obj.lat) <= 90 && Math.abs(obj.lng) <= 180) {
        return { lat: obj.lat, lng: obj.lng };
      }
    }
    if (typeof obj.latitude === "number" && typeof obj.longitude === "number") {
      if (Math.abs(obj.latitude) <= 90 && Math.abs(obj.longitude) <= 180) {
        return { lat: obj.latitude, lng: obj.longitude };
      }
    }
  }

  // 2. String GeoJSON o EWKB
  if (typeof valor === "string") {
    const hex = valor.trim();

    // String JSON serializado
    if (hex.startsWith("{")) {
      try {
        const parsed = JSON.parse(hex);
        return decodificarPunto(parsed);
      } catch {
        /* no era json valido */
      }
    }

    // Cabecera mínima EWKB: 1 byte de orden + 4 de tipo + 16 de las dos coordenadas.
    if (hex.length >= 42 && /^[0-9a-fA-F]+$/.test(hex)) {
      const bytes = new Uint8Array(hex.length / 2);
      for (let i = 0; i < bytes.length; i++) {
        bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
      }

      const vista = new DataView(bytes.buffer);
      const pequeno = bytes[0] === 1;

      const tipo = vista.getUint32(1, pequeno);
      if ((tipo & 0xff) === 1) {
        const traeSrid = (tipo & 0x20000000) !== 0;
        const inicio = traeSrid ? 9 : 5;
        if (bytes.length >= inicio + 16) {
          const lng = vista.getFloat64(inicio, pequeno);
          const lat = vista.getFloat64(inicio + 8, pequeno);

          if (
            Number.isFinite(lat) &&
            Number.isFinite(lng) &&
            Math.abs(lat) <= 90 &&
            Math.abs(lng) <= 180
          ) {
            return { lat, lng };
          }
        }
      }
    }
  }

  return null;
}

/** Distancia en kilómetros entre dos puntos, por la fórmula del semiverseno. */
export function distanciaKm(a: Punto, b: Punto): number {
  const R = 6371;
  const rad = (g: number) => (g * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}
