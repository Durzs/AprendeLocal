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
  if (typeof valor !== "string") return null;

  const hex = valor.trim();
  // Cabecera mínima: 1 byte de orden + 4 de tipo + 16 de las dos coordenadas.
  if (hex.length < 42 || !/^[0-9a-fA-F]+$/.test(hex)) return null;

  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }

  const vista = new DataView(bytes.buffer);
  const pequeno = bytes[0] === 1;

  const tipo = vista.getUint32(1, pequeno);
  // Solo se entienden puntos. Una línea o un polígono aquí es un dato que no
  // esperábamos, y adivinar su centro sería inventar.
  if ((tipo & 0xff) !== 1) return null;

  const traeSrid = (tipo & 0x20000000) !== 0;
  const inicio = traeSrid ? 9 : 5;
  if (bytes.length < inicio + 16) return null;

  const lng = vista.getFloat64(inicio, pequeno);
  const lat = vista.getFloat64(inicio + 8, pequeno);

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  // Fuera de rango significa que se leyó mal, casi siempre por haber invertido
  // el orden de los bytes. Mejor descartarlo que poner un punto en el mar.
  if (Math.abs(lat) > 90 || Math.abs(lng) > 180) return null;

  return { lat, lng };
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
