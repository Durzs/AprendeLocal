/**
 * Pedirle al modelo una ruta para esta escuela, y recibirla con huecos.
 *
 * Las cuatro rutas escritas a mano sirven mientras el lugar se parezca al que
 * tenían en la cabeza quienes las escribieron. Esto arma una para el lugar y
 * los objetivos que el docente acaba de describir.
 *
 * Lo que vuelve no está terminado, y no lo está a propósito: cuatro campos
 * llegan vacíos porque son los que el modelo no puede saber. Ahí es donde el
 * docente escribe, y hasta que no escriba, la ruta no se da por lista.
 */

import { supabase } from "../../../shared/lib/supabaseClient";
import { buscarOA } from "./oa";
import type { Expedicion } from "./expedicion";

/** Un tramo de la ruta: qué pasa esa semana. */
export type FaseIA = { semana: number; titulo: string; que_ocurre: string };

/** Qué hace cada curso, y con qué objetivos. */
export type CursoIA = {
  nivel: string;
  postura: "explorar" | "actuar";
  papel: string;
  codigos: string[];
};

/** La ruta como vuelve del modelo, huecos incluidos. */
export type RutaIA = {
  titulo: string;
  pregunta_guia: string;
  producto_que: string;
  semanas: number;
  fases: FaseIA[];
  por_curso: CursoIA[];
  materiales: string[];
  pregunta_a_la_comunidad: string;
  mapuzugun: { termino: string; castellano: string }[];

  /* ── Los cuatro que llena el docente ────────────────────────────────── */
  producto_para_quien: string;
  preguntar_a: string;
  punto_de_salida: string;
  que_cuidar: string;
};

/**
 * Los cuatro huecos, con lo que hay que decirle al docente en cada uno.
 *
 * El texto no está en la pantalla sino aquí, junto a la clave, para que no se
 * pueda agregar un hueco sin decir qué se pide en él.
 */
export const HUECOS: {
  clave: keyof RutaIA;
  etiqueta: string;
  porque: string;
  ejemplo: string;
}[] = [
  {
    clave: "producto_para_quien",
    etiqueta: "A quién le entregan el trabajo",
    porque:
      "Sin alguien de afuera esperándolo, el informe se queda en la mochila y la ruta fue una actividad larga. Tiene que ser una persona u organización que exista.",
    ejemplo: "Al comité de agua, en la reunión del 14",
  },
  {
    clave: "preguntar_a",
    etiqueta: "A quién de la comunidad le preguntan",
    porque:
      "El lugar tiene memoria y esa memoria está en personas. Escribe quién, con nombre si lo sabes.",
    ejemplo: "A don Manuel, que araba ahí antes de que se secara",
  },
  {
    clave: "punto_de_salida",
    etiqueta: "Dónde se para el curso",
    porque:
      "El punto exacto y cómo se llega. Es lo que va en la hoja de terreno y en la carta a las familias.",
    ejemplo: "En el vado, bajando por el potrero del fondo. Veinte minutos a pie.",
  },
  {
    clave: "que_cuidar",
    etiqueta: "Qué hay que cuidar ahí",
    porque:
      "Esto no lo puede saber nadie que no haya estado. Es lo único de la ruta que, si falta, alguien se puede lastimar.",
    ejemplo: "La barranca del lado norte está floja. Nadie cruza solo.",
  },
];

export type Resultado =
  | { estado: "ok"; ruta: RutaIA }
  | { estado: "sin_clave"; mensaje: string }
  | { estado: "error"; mensaje: string };

/** Lo que le falta a una ruta para poder darse por lista. */
export function huecosPendientes(r: RutaIA | null): typeof HUECOS {
  if (!r) return HUECOS;
  return HUECOS.filter((h) => !String(r[h.clave] ?? "").trim());
}

/**
 * Le pide una ruta al modelo con lo que el docente escribió.
 *
 * Los objetivos van con su texto completo y no solo con el código: el modelo
 * no tiene las Bases Curriculares, y «OA15_CN_6» a secas no le dice nada.
 */
export async function generar(e: Expedicion): Promise<Resultado> {
  const objetivos = e.oa
    .map((c) => buscarOA(c))
    .filter(Boolean)
    .map((o) => ({ codigo: o!.codigo, nivel: o!.nivel, texto: o!.texto }));

  if (objetivos.length === 0) {
    return {
      estado: "error",
      mensaje: "Marca al menos un objetivo de aprendizaje en la primera lámina.",
    };
  }

  try {
    const { data, error } = await supabase.functions.invoke("generar-ruta", {
      body: {
        objetivos,
        cursos: e.cursos,
        semanas: e.semanas,
        entorno: e.entorno,
        ubicacion: e.ubicacion,
        fenomeno: e.fenomeno,
        indagacion: e.indagacion,
        producto: e.producto,
        tematicas: e.tematicas,
        preguntaGuia: e.preguntaGuia,
        evaluacion: e.evaluacion,
      },
    });

    if (error) {
      // `invoke` no distingue un 503 por falta de clave de una caída de red, y
      // esos dos casos se le cuentan al docente de manera muy distinta.
      const cuerpo = await leerErrorDeFuncion(error);
      if (cuerpo?.error === "sin_clave") {
        return { estado: "sin_clave", mensaje: cuerpo.mensaje };
      }
      return {
        estado: "error",
        mensaje:
          cuerpo?.mensaje ??
          "No se pudo armar la ruta. Puede que no haya señal. Sigue con una de las escritas.",
      };
    }

    if (!data?.ruta) {
      return { estado: "error", mensaje: "La respuesta vino vacía." };
    }

    return { estado: "ok", ruta: normalizar(data.ruta) };
  } catch {
    return {
      estado: "error",
      mensaje: "No se pudo armar la ruta. Puede que no haya señal.",
    };
  }
}

/** Saca el cuerpo del error de una función, si lo trae. */
async function leerErrorDeFuncion(error: unknown): Promise<Record<string, any> | null> {
  const contexto = (error as { context?: Response })?.context;
  if (!contexto || typeof contexto.json !== "function") return null;
  try {
    return await contexto.json();
  } catch {
    return null;
  }
}

/**
 * Deja la ruta con la forma que espera la pantalla.
 *
 * Lo que vuelve de un modelo puede traer una clave de menos o una lista donde
 * se esperaba un texto. Aquí se rellena con vacíos en vez de dejar que la
 * pantalla reviente al leer `fases.map`.
 */
function normalizar(r: any): RutaIA {
  const lista = (v: unknown) => (Array.isArray(v) ? v : []);
  const texto = (v: unknown) => (typeof v === "string" ? v : "");

  return {
    titulo: texto(r.titulo),
    pregunta_guia: texto(r.pregunta_guia),
    producto_que: texto(r.producto_que),
    semanas: Number(r.semanas) || lista(r.fases).length || 3,
    fases: lista(r.fases).map((f: any, i: number) => ({
      semana: Number(f?.semana) || i + 1,
      titulo: texto(f?.titulo),
      que_ocurre: texto(f?.que_ocurre),
    })),
    por_curso: lista(r.por_curso).map((c: any) => ({
      nivel: texto(c?.nivel),
      postura: c?.postura === "actuar" ? "actuar" : "explorar",
      papel: texto(c?.papel),
      codigos: lista(c?.codigos).map(texto).filter(Boolean),
    })),
    materiales: lista(r.materiales).map(texto).filter(Boolean),
    pregunta_a_la_comunidad: texto(r.pregunta_a_la_comunidad),
    mapuzugun: lista(r.mapuzugun)
      .map((m: any) => ({ termino: texto(m?.termino), castellano: texto(m?.castellano) }))
      .filter((m) => m.termino),
    producto_para_quien: texto(r.producto_para_quien),
    preguntar_a: texto(r.preguntar_a),
    punto_de_salida: texto(r.punto_de_salida),
    que_cuidar: texto(r.que_cuidar),
  };
}
