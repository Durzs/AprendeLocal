/**
 * Nombres de campo legibles para la hoja de terreno.
 *
 * El modelo devuelve los campos del protocolo con nombre de variable
 * —`ancho_cauce_m`, `profundidad_media_m`—, que es cómodo si esos datos van a
 * una tabla, pero esa hoja la lee el curso con la libreta en la mano junto al
 * estero. Ahí `ancho_cauce_m` no dice más que «Ancho cauce»; dice lo mismo
 * peor.
 *
 * Se deriva el nombre visible en lugar de pedírselo al modelo: así también
 * mejoran las secuencias ya generadas, sin volver a generarlas.
 */

/**
 * Sufijos de unidad que se retiran del nombre: la unidad ya tiene su propia
 * columna y repetirla es ruido.
 */
const UNIDADES = new Set([
  "m", "cm", "mm", "km", "m2", "m3", "ha",
  "l", "ml", "kg", "g",
  "s", "seg", "min", "h",
  "c", "celsius", "pct", "porcentaje",
]);

/** Formas que no se escriben con mayúscula inicial aunque abran el nombre. */
const CANONICO: Record<string, string> = {
  ph: "pH",
  co2: "CO₂",
  o2: "O₂",
  ppm: "ppm",
};

function esUnidadFinal(parte: string, unidad?: string): boolean {
  const p = parte.toLowerCase();
  if (UNIDADES.has(p)) return true;
  // También cuando coincide con la unidad que el propio campo declara, aunque
  // no esté en la lista: `caudal_m3s` con unidad «m3s».
  return Boolean(unidad && p === unidad.trim().toLowerCase());
}

/** Respeta las mayúsculas que el modelo puso a propósito («Trancura»). */
function normalizar(parte: string): string {
  return CANONICO[parte.toLowerCase()] ?? parte;
}

function componer(partes: string[], original: string): string {
  if (partes.length === 0) return original;

  const palabras = partes.map(normalizar);
  const primera = palabras[0];
  if (!(primera.toLowerCase() in CANONICO) && primera === primera.toLowerCase()) {
    palabras[0] = primera.charAt(0).toUpperCase() + primera.slice(1);
  }

  return palabras.join(" ");
}

/**
 * Cualquier identificador de la base en palabras:
 * `bosque_templado_valdiviano` → «Bosque templado valdiviano».
 */
export function enPalabras(valor: string): string {
  return componer(valor.trim().split(/[_\s-]+/).filter(Boolean), valor);
}

/** Igual, pero retirando la unidad que el nombre del campo arrastra al final. */
export function nombreLegible(campo: string, unidad?: string): string {
  const partes = campo.trim().split(/[_\s-]+/).filter(Boolean);

  // Nunca se deja el nombre vacío: si el campo es solo la unidad, se conserva.
  if (partes.length > 1 && esUnidadFinal(partes[partes.length - 1], unidad)) {
    partes.pop();
  }

  return componer(partes, campo);
}
