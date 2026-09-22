/**
 * El mensaje de un error, venga de donde venga.
 *
 * Lo que lanza Supabase no siempre es un `Error`: los errores de la base
 * llegan como objetos con `message` y nada más. Preguntar `instanceof Error`
 * los dejaría fuera y la persona vería el texto genérico en vez del motivo.
 */
export function mensajeDe(e: unknown, respaldo: string): string {
  if (e && typeof e === "object" && "message" in e) {
    const m = (e as { message?: unknown }).message;
    if (typeof m === "string" && m.trim()) return m;
  }
  return respaldo;
}
