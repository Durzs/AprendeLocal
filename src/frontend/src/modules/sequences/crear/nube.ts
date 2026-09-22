import { supabase } from "../../../shared/lib/supabaseClient";
import type { Expedicion } from "./expedicion";
import { VACIA } from "./expedicion";
import { normalizarAvance, type Avance } from "./avance";

/**
 * La expedición, también en la cuenta.
 *
 * Hasta aquí lo que el docente escribía vivía en `localStorage` y en ninguna
 * otra parte. La interfaz lo decía —«queda guardada en este computador, no en
 * tu cuenta»— y decirlo estaba bien, pero era la falla de fondo: el nombre del
 * estero, la pregunta que le costó una tarde, a quién se le entrega el
 * trabajo. Eso es lo único que la plataforma no puede volver a generar, y era
 * justo lo que no se guardaba en ningún servidor.
 *
 * CÓMO SE REPARTEN LOS DOS SITIOS
 *
 * `localStorage` sigue siendo el que manda mientras se escribe. Es instantáneo,
 * funciona sin señal y funciona sin cuenta, y las tres cosas importan en una
 * escuela rural: armar una ruta sin registrarse tiene que seguir siendo
 * posible, porque el primer día nadie se registra.
 *
 * Supabase es el respaldo. Cuando hay sesión iniciada, lo que se escribe sube;
 * cuando se abre el cuaderno en otro computador, baja. Si no hay red, si la
 * tabla todavía no existe en el proyecto, o si la petición falla por lo que
 * sea, no pasa nada visible: se sigue trabajando en local y el estado queda
 * en «sin guardar en la cuenta», que la pantalla puede mostrar. Lo que no se
 * hace es bloquear el cuaderno esperando a un servidor.
 *
 * El SQL de la tabla está en infra/expediciones.sql.
 */

/** Qué está pasando con el respaldo, para que la pantalla pueda decirlo. */
export type EstadoNube =
  | "sin_cuenta"   // no hay sesión: solo local, y está bien
  | "guardando"
  | "guardado"
  | "sin_conexion" // se intentó y no se pudo; lo local sigue intacto
  | "sin_tabla";   // la tabla no está cargada en el proyecto todavía

/** Lo que se guarda y se recupera junto. */
export type Respaldo = {
  id: string | null;
  expedicion: Expedicion;
  avance: Avance;
  actualizada: string | null;
};

/**
 * Postgres devuelve `42P01` cuando la tabla no existe. Distinguirlo de un
 * fallo de red importa: uno se arregla cargando un SQL y el otro esperando,
 * y decirle al docente «sin conexión» cuando en realidad falta desplegar es
 * mandarlo a reiniciar el módem por nada.
 */
function esTablaQueFalta(error: { code?: string; message?: string } | null): boolean {
  if (!error) return false;
  return error.code === "42P01" || /relation .* does not exist/i.test(error.message ?? "");
}

/** Un título con el que reconocerla en una lista, sin abrir el JSON. */
function tituloDe(e: Expedicion): string {
  return (
    e.problemaPropioNombre ||
    e.preguntaGuia ||
    e.ubicacion ||
    "Una ruta sin nombre todavía"
  ).slice(0, 300);
}

/** Si hay alguien con sesión iniciada ahora mismo. */
async function docenteActual(): Promise<string | null> {
  try {
    const { data } = await supabase.auth.getUser();
    return data.user?.id ?? null;
  } catch {
    return null;
  }
}

/**
 * Sube la expedición. Devuelve el id con que quedó guardada, o null.
 *
 * Se le pasa el id que ya tenía, si lo tenía, para actualizar en vez de crear
 * una fila nueva cada vez que se escribe una letra.
 */
export async function subir(
  e: Expedicion,
  avance: Avance,
  id: string | null
): Promise<{ estado: EstadoNube; id: string | null }> {
  const docente = await docenteActual();
  if (!docente) return { estado: "sin_cuenta", id: null };

  const fila = { docente, titulo: tituloDe(e), datos: e, avance };

  try {
    if (id) {
      const { error } = await supabase.from("expediciones").update(fila).eq("id", id);
      if (error) throw error;
      return { estado: "guardado", id };
    }
    const { data, error } = await supabase
      .from("expediciones")
      .insert(fila)
      .select("id")
      .single();
    if (error) throw error;
    return { estado: "guardado", id: data?.id ?? null };
  } catch (error) {
    const e2 = error as { code?: string; message?: string };
    return { estado: esTablaQueFalta(e2) ? "sin_tabla" : "sin_conexion", id };
  }
}

/**
 * Baja la última expedición del docente.
 *
 * «La última» es la que tocó más recientemente. Mientras solo se lleva una a
 * la vez, eso es lo mismo que «la suya»; el día que se lleven varias, esta
 * función se vuelve `listar()` y el cuaderno pregunta cuál.
 */
export async function bajarUltima(): Promise<Respaldo | null> {
  const docente = await docenteActual();
  if (!docente) return null;

  try {
    const { data, error } = await supabase
      .from("expediciones")
      .select("id, datos, avance, actualizada_en")
      .eq("docente", docente)
      .order("actualizada_en", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    if (!data) return null;

    return {
      id: data.id,
      // Se mezcla contra VACIA por lo mismo que en `localStorage`: una fila
      // guardada antes de que existiera un campo no debe dejarlo en undefined.
      expedicion: { ...VACIA, ...(data.datos as Partial<Expedicion>) },
      avance: normalizarAvance(data.avance),
      actualizada: data.actualizada_en ?? null,
    };
  } catch {
    return null;
  }
}

/**
 * Cuál de las dos versiones gana cuando hay una en cada sitio.
 *
 * Pasa de verdad: el docente escribió en el computador de la escuela sin
 * cerrar sesión, y en su casa abre el cuaderno con algo viejo en el
 * navegador. Gana la del servidor solo si es posterior, y para eso hace falta
 * saber cuándo se tocó la local. Si la local no tiene marca de tiempo —las
 * guardadas antes de que existiera esto no la tienen— se prefiere la local,
 * que es la que la persona está viendo: pisarle lo que tiene en pantalla con
 * algo que bajó de la red sería la peor sorpresa posible.
 */
export function masReciente(
  local: { expedicion: Expedicion; avance: Avance; tocada: string | null },
  remoto: Respaldo | null
): { expedicion: Expedicion; avance: Avance; id: string | null; vieneDeLaNube: boolean } {
  if (!remoto) {
    return { ...local, id: null, vieneDeLaNube: false };
  }
  const hayAlgoLocal = Boolean(
    local.expedicion.oa.length ||
      local.expedicion.ubicacion.trim() ||
      local.expedicion.preguntaGuia.trim() ||
      local.expedicion.problemaId
  );
  if (!hayAlgoLocal) {
    return { ...remoto, vieneDeLaNube: true };
  }
  if (!local.tocada || !remoto.actualizada) {
    return { ...local, id: remoto.id, vieneDeLaNube: false };
  }
  const gana = new Date(remoto.actualizada) > new Date(local.tocada);
  return gana
    ? { ...remoto, vieneDeLaNube: true }
    : { ...local, id: remoto.id, vieneDeLaNube: false };
}
