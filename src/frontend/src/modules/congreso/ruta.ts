/**
 * La ruta armada en el demo: cómo viaja en un enlace, cómo pasa al cuaderno y
 * cómo se manda por correo.
 *
 * EN UN ENLACE
 *
 * `/congreso?p=rio_contaminado&a=biologia,quimica&l=temuco`. Es lo que lleva
 * el código QR de la tablet y el botón del correo: quien lo abre en su
 * teléfono ve su ruta armada, sin cuenta y sin volver a elegir nada.
 *
 * AL CUADERNO
 *
 * Si la persona sigue en el cuaderno, la problemática y las asignaturas quedan
 * puestas, que es por donde el cuaderno empieza. Solo si ese navegador no
 * tiene ya un cuaderno empezado: el demo no pisa el trabajo de nadie.
 *
 * POR CORREO
 *
 * Lo manda la función `enviar-ruta`, que le pone el número: uno por persona,
 * que es el que participa en el sorteo del cierre (ver `HAY_SORTEO`). Si en el stand no
 * hay señal, el pedido queda en una fila en la tablet y sale solo cuando
 * vuelve. Ver §supabase/functions/enviar-ruta/index.ts.
 */

import { supabase } from "../../shared/lib/supabaseClient";
import { guardar, leer } from "../sequences/crear/expedicion";
import type { Problema } from "../sequences/metodo/problemas";
import type { Idioma } from "../../shared/tx";

/**
 * Si el demo está en un evento con sorteo al cierre.
 *
 * Cambia el texto de la pantalla final y del correo: el número pasa a ser el
 * número del sorteo. Después del congreso se pone en `false` y el número
 * queda solo como número de la ruta.
 */
export const HAY_SORTEO = true;

export type Armada = {
  problemaId: string;
  asignaturas: string[];
  /** El id de un lugar de ejemplo, o null si se usó la ubicación propia. */
  lugar: string | null;
};

/**
 * `edicion` va en el enlace porque el teléfono que lo abre puede estar en
 * otro idioma que la tablet, y sin ella buscaría la problemática brasileña en
 * el catálogo chileno. Ver `porDireccion` en §shared/sede.ts.
 */
export function aEnlace(r: Armada, sede: string, base = window.location.origin): string {
  const q = new URLSearchParams({ edicion: sede, p: r.problemaId, a: r.asignaturas.join(",") });
  if (r.lugar) q.set("l", r.lugar);
  return `${base}/congreso?${q}`;
}

/** Lee la ruta de la dirección. Lo que no calce con el catálogo se descarta. */
export function deEnlace(
  q: URLSearchParams,
  problemas: Problema[],
  lugares: { id: string }[]
): Armada | null {
  const p = problemas.find((x) => x.id === q.get("p"));
  if (!p) return null;
  const posibles = new Set<string>(p.angulos.map((a) => a.asignatura));
  const asignaturas = (q.get("a") ?? "").split(",").filter((a) => posibles.has(a)).slice(0, 3);
  if (!asignaturas.length) return null;
  const l = q.get("l");
  return { problemaId: p.id, asignaturas, lugar: lugares.some((x) => x.id === l) ? l : null };
}

/**
 * Deja la ruta puesta en el cuaderno de este navegador.
 *
 * Devuelve si la puso. Si ya había un cuaderno empezado no lo toca, y quien
 * llama abre el cuaderno como estaba.
 */
export function sembrarCuaderno(r: Armada): boolean {
  const actual = leer();
  const empezado = actual.problemaId || actual.problemaPropioNombre.trim() || actual.asignaturas.length;
  if (empezado) return false;
  guardar({ ...actual, problemaId: r.problemaId, asignaturas: r.asignaturas });
  return true;
}

/* ── El correo ───────────────────────────────────────────────────────────── */

export type Pedido = Armada & {
  correo: string;
  idioma: Idioma;
  /** El campo trampa. Una persona lo deja vacío. */
  sitio_web: string;
};

export type Respuesta =
  /** `repetido`: ese correo ya tenía número y lo conserva. */
  | { estado: "ok"; numero: number; enviado: boolean; repetido: boolean }
  | { estado: "fila" }
  | { estado: "error"; motivo: "correo" | "limite" | "otro" };

const FILA = "aprendelocal:congreso:fila";

function leerFila(): Pedido[] {
  try {
    const d = JSON.parse(localStorage.getItem(FILA) ?? "[]");
    return Array.isArray(d) ? d : [];
  } catch {
    return [];
  }
}

function escribirFila(f: Pedido[]): void {
  try {
    if (f.length) localStorage.setItem(FILA, JSON.stringify(f));
    else localStorage.removeItem(FILA);
  } catch {
    /* Sin permiso: el pedido se pierde con la pestaña. Se avisa en pantalla. */
  }
}

export function enFila(): number {
  return leerFila().length;
}

type Crudo = { tipo: "ok"; numero: number; enviado: boolean; repetido: boolean } | { tipo: "red" } | { tipo: "rechazo"; motivo: string };

async function llamar(p: Pedido): Promise<Crudo> {
  if (!navigator.onLine) return { tipo: "red" };
  const { data, error } = await supabase.functions.invoke("enviar-ruta", {
    body: {
      correo: p.correo,
      acepta: true,
      problema: p.problemaId,
      asignaturas: p.asignaturas,
      lugar: p.lugar,
      idioma: p.idioma,
      evento: "congreso",
      sorteo: HAY_SORTEO,
      sitio_web: p.sitio_web,
    },
  });
  if (!error) {
    return typeof data?.numero === "number"
      ? { tipo: "ok", numero: data.numero, enviado: Boolean(data.enviado), repetido: Boolean(data.repetido) }
      : { tipo: "rechazo", motivo: "otro" };
  }
  const respuesta = (error as { context?: Response }).context;
  // Sin respuesta HTTP es la red; 5xx, la función caída; 404, la función
  // todavía sin desplegar. En los tres casos el pedido se guarda y se
  // reintenta: la persona ya se fue del stand y no va a volver a escribirlo.
  if (!respuesta || typeof respuesta.status !== "number" || respuesta.status >= 500 || respuesta.status === 404) {
    return { tipo: "red" };
  }
  let motivo = "otro";
  try {
    motivo = String((await respuesta.json())?.error ?? "otro");
  } catch {
    /* sin JSON */
  }
  return { tipo: "rechazo", motivo };
}

export async function enviarRuta(p: Pedido): Promise<Respuesta> {
  let r: Crudo;
  try {
    r = await llamar(p);
  } catch {
    r = { tipo: "red" };
  }
  if (r.tipo === "ok") return { estado: "ok", numero: r.numero, enviado: r.enviado, repetido: r.repetido };
  if (r.tipo === "red") {
    escribirFila([...leerFila(), p]);
    return { estado: "fila" };
  }
  return { estado: "error", motivo: r.motivo === "correo" || r.motivo === "limite" ? r.motivo : "otro" };
}

/**
 * Intenta mandar lo que quedó en la fila. Lo que la función rechaza por
 * inválido se descarta: reintentarlo para siempre no lo va a arreglar.
 */
export async function vaciarFila(): Promise<number> {
  const fila = leerFila();
  if (!fila.length || !navigator.onLine) return 0;
  const quedan: Pedido[] = [];
  let enviados = 0;
  for (const p of fila) {
    let r: Crudo;
    try {
      r = await llamar(p);
    } catch {
      r = { tipo: "red" };
    }
    if (r.tipo === "red") quedan.push(p);
    else if (r.tipo === "ok") enviados++;
  }
  escribirFila(quedan);
  return enviados;
}
