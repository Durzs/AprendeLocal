/**
 * La ruta armada para esta escuela, y lo que el docente le tiene que poner.
 *
 * Todo lo que se ve aquí se puede reescribir: el título, la pregunta, lo que
 * pasa cada semana, lo que hace cada curso. Nada viene cerrado.
 *
 * Pero hay cuatro campos que llegan vacíos y que no se pueden dejar así. No es
 * un requisito de formulario: son los cuatro que el modelo no puede saber, y
 * donde una invención cuesta caro. A quién se le entrega el trabajo, a quién
 * se le pregunta, dónde se para el curso y qué hay que cuidar en ese lugar.
 * Mientras falten, la ruta se ve con una franja que dice cuántos faltan.
 *
 * Esa es la co-construcción de verdad: no que el docente *pueda* editar, sino
 * que la ruta no exista completa hasta que ponga lo suyo.
 */

import { useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../../../shared/contexts/AuthContext";
import { Hoja } from "./Campos";
import { HUECOS, generar, huecosPendientes, type RutaIA } from "./generar";
import type { Expedicion } from "./expedicion";

export default function RutaGenerada({
  e,
  onCambio,
}: {
  e: Expedicion;
  onCambio: (e: Expedicion) => void;
}) {
  const { user } = useAuth();
  const [pidiendo, setPidiendo] = useState(false);
  const [aviso, setAviso] = useState<{ tono: "malo" | "neutro"; texto: string } | null>(null);

  const ruta = e.rutaIA;
  const faltan = huecosPendientes(ruta);

  function set(campo: keyof RutaIA, valor: unknown) {
    if (!ruta) return;
    onCambio({ ...e, rutaIA: { ...ruta, [campo]: valor } as RutaIA });
  }

  async function pedir() {
    setPidiendo(true);
    setAviso(null);
    const r = await generar(e);
    setPidiendo(false);
    if (r.estado === "ok") {
      onCambio({ ...e, rutaIA: r.ruta });
      return;
    }
    const suave = r.estado === "sin_clave" || r.estado === "sin_sesion" || r.estado === "tope";
    setAviso({ tono: suave ? "neutro" : "malo", texto: r.mensaje });
  }

  /* ── Todavía no hay ruta armada ──────────────────────────────────────── */
  if (!ruta) {
    return (
      <Hoja titulo="Armar una para tu escuela" orden={3}>
        <p className="mb-4 max-w-2xl text-sm leading-relaxed text-[#e4ded2]/70">
          Las rutas escritas sirven mientras el lugar se parezca al que tenían
          en la cabeza quienes las escribieron. Esto arma una con tus objetivos
          y con el estero, el cerro o el camino que describiste.
        </p>
        <p className="mb-4 max-w-2xl text-sm leading-relaxed text-[#e4ded2]/55">
          Vuelve a medio hacer, y es a propósito: cuatro cosas de tu escuela no
          las puede saber y te las va a preguntar.
        </p>

        {/* Sin sesión se dice aquí y no después de pulsar. Que el docente
            escriba media lámina y recién entonces le pidan entrar es hacerle
            perder el trabajo o hacerle abrir otra pestaña a mitad de camino. */}
        {user ? (
          <button
            type="button"
            onClick={pedir}
            disabled={pidiendo || e.oa.length === 0}
            className="rounded-full bg-[#c9612a] px-6 py-2.5 text-sm font-semibold text-[#1e2a24] transition hover:bg-[#d97038] disabled:cursor-not-allowed disabled:bg-[#e4ded2]/15 disabled:text-[#e4ded2]/40"
          >
            {pidiendo ? "Armando…" : "Armar mi ruta"}
          </button>
        ) : (
          <div className="rounded-xl border border-[#e4ded2]/20 bg-[#e4ded2]/[0.04] p-4">
            <p className="text-sm leading-relaxed text-[#e4ded2]/80">
              Armar una con el modelo pide entrar con cuenta, porque cada una
              nos cuesta. Lo que estuviste haciendo no se pierde: queda guardado
              en este computador y sigue aquí cuando vuelvas.
            </p>
            <div className="mt-3.5 flex flex-wrap items-center gap-4">
              <Link
                to="/entrar"
                className="rounded-full bg-[#c9612a] px-6 py-2.5 text-sm font-semibold text-[#1e2a24] transition hover:bg-[#d97038]"
              >
                Entrar
              </Link>
              <Link
                to="/cadastrar"
                className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#e4ded2]/60 underline underline-offset-4 transition hover:text-[#e4ded2]"
              >
                Crear una cuenta
              </Link>
            </div>
            <p className="mt-3.5 border-t border-[#e4ded2]/12 pt-3 text-xs leading-relaxed text-[#e4ded2]/50">
              Las cuatro rutas escritas, las láminas y los documentos para
              imprimir siguen funcionando sin cuenta y sin señal. Lo único
              detrás de la puerta es lo que cuesta plata.
            </p>
          </div>
        )}

        {user && e.oa.length === 0 && (
          <p className="mt-2.5 text-xs text-[#e0a678]">
            Antes marca al menos un objetivo en la primera lámina.
          </p>
        )}
        {pidiendo && (
          <div className="mt-4 h-0.5 w-32 overflow-hidden rounded-full bg-[#e4ded2]/15">
            <div className="animar-esperando h-full w-1/4 rounded-full bg-[#c9612a]" />
          </div>
        )}
        <Aviso aviso={aviso} />
      </Hoja>
    );
  }

  /* ── La ruta armada, entera editable ─────────────────────────────────── */
  return (
    <>
      {faltan.length > 0 && (
        <div className="animar-hoja animar-hoja-2 rounded-2xl border border-[#e0a678]/45 bg-[#e0a678]/[0.09] p-5">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#e0a678]">
            Faltan {faltan.length} de 4
          </p>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#e4ded2]/85">
            La ruta está armada, pero le falta lo que solo sabes tú. Son cuatro
            cosas y están más abajo: sin ellas el curso sale a terreno sin saber
            dónde para ni a quién le entrega lo que haga.
          </p>
        </div>
      )}

      <Hoja titulo="La ruta" orden={3}>
        <Linea
          etiqueta="Título"
          valor={ruta.titulo}
          onCambio={(v) => set("titulo", v)}
          grande
        />
        <div className="mt-4">
          <Linea
            etiqueta="La pregunta que la sostiene"
            valor={ruta.pregunta_guia}
            onCambio={(v) => set("pregunta_guia", v)}
            filas={2}
          />
        </div>
        <div className="mt-4">
          <Linea
            etiqueta="Qué entregan"
            valor={ruta.producto_que}
            onCambio={(v) => set("producto_que", v)}
            filas={2}
          />
        </div>

        <p className="mt-4 border-t border-[#e4ded2]/12 pt-3 text-xs text-[#e4ded2]/45">
          Todo esto se puede reescribir. Lo que quede aquí es lo que sale
          impreso.
        </p>
      </Hoja>

      {/* ── Los cuatro huecos ───────────────────────────────────────────── */}
      <Hoja titulo="Lo que pones tú" orden={4}>
        <p className="mb-5 max-w-2xl text-sm leading-relaxed text-[#e4ded2]/60">
          Cuatro cosas de tu escuela que nadie más sabe. Van vacías a propósito:
          rellenarlas por ti sería inventarlas.
        </p>

        <div className="space-y-4">
          {HUECOS.map((h) => {
            const valor = String(ruta[h.clave] ?? "");
            const vacio = !valor.trim();
            return (
              <div
                key={h.clave}
                className={`rounded-xl border p-4 transition ${
                  vacio
                    ? "border-[#e0a678]/45 bg-[#e0a678]/[0.05]"
                    : "border-[#c9612a]/45 bg-[#c9612a]/[0.06]"
                }`}
              >
                <label className="block">
                  <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#e4ded2]/75">
                      {h.etiqueta}
                    </span>
                    {vacio ? (
                      <span className="rounded bg-[#e0a678]/25 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.1em] text-[#e0a678]">
                        falta
                      </span>
                    ) : (
                      <span className="rounded bg-[#e4ded2]/15 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.1em] text-[#e4ded2]/80">
                        tuyo
                      </span>
                    )}
                  </span>
                  <span className="mt-1.5 block text-xs leading-relaxed text-[#e4ded2]/55">
                    {h.porque}
                  </span>
                  <textarea
                    value={valor}
                    onChange={(ev) => set(h.clave, ev.target.value)}
                    rows={2}
                    placeholder={h.ejemplo}
                    className="mt-2.5 w-full resize-y rounded-lg border border-[#e4ded2]/20 bg-[#e4ded2]/[0.045] px-3.5 py-2.5 text-[15px] leading-relaxed text-[#f3efe7] outline-none transition placeholder:text-[#e4ded2]/25 focus:border-[#c9612a] focus:bg-[#e4ded2]/[0.08]"
                  />
                </label>
              </div>
            );
          })}
        </div>
      </Hoja>

      {/* ── Las semanas ─────────────────────────────────────────────────── */}
      <Hoja titulo="Semana por semana" orden={5}>
        <ol className="space-y-3">
          {ruta.fases.map((f, i) => (
            <li key={i} className="flex gap-4 rounded-xl border border-[#e4ded2]/12 p-4">
              <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#c9612a]/50 font-mono text-xs text-[#c9612a]">
                {f.semana}
              </span>
              <div className="min-w-0 flex-1 space-y-2">
                <Linea
                  etiqueta=""
                  valor={f.titulo}
                  onCambio={(v) =>
                    set(
                      "fases",
                      ruta.fases.map((x, j) => (j === i ? { ...x, titulo: v } : x))
                    )
                  }
                />
                <Linea
                  etiqueta=""
                  valor={f.que_ocurre}
                  onCambio={(v) =>
                    set(
                      "fases",
                      ruta.fases.map((x, j) => (j === i ? { ...x, que_ocurre: v } : x))
                    )
                  }
                  filas={2}
                  tenue
                />
              </div>
            </li>
          ))}
        </ol>
      </Hoja>

      {/* ── Cada curso ──────────────────────────────────────────────────── */}
      {ruta.por_curso.length > 0 && (
        <Hoja titulo="Qué hace cada curso" orden={6}>
          <ul className="space-y-2.5">
            {ruta.por_curso.map((c, i) => (
              <li key={i} className="flex flex-wrap items-baseline gap-x-3 gap-y-1.5">
                <span className="rounded bg-[#e4ded2]/15 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-[#f3efe7]">
                  {c.nivel}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#c9612a]">
                  {c.postura}
                </span>
                <span className="min-w-0 flex-1">
                  <Linea
                    etiqueta=""
                    valor={c.papel}
                    onCambio={(v) =>
                      set(
                        "por_curso",
                        ruta.por_curso.map((x, j) => (j === i ? { ...x, papel: v } : x))
                      )
                    }
                  />
                </span>
                {c.codigos.length > 0 && (
                  <span className="font-mono text-[10px] text-[#e4ded2]/40">
                    {c.codigos.map((k) => k.replace(/_CN_/, "·")).join(" ")}
                  </span>
                )}
              </li>
            ))}
          </ul>
          <p className="mt-3.5 border-t border-[#e4ded2]/12 pt-3 text-xs leading-relaxed text-[#e4ded2]/45">
            Los menores conocen el lugar; los mayores sacan cuentas con lo que
            los menores levantaron. Cada uno lo suyo y se necesitan.
          </p>
        </Hoja>
      )}

      {/* ── Material y comunidad ────────────────────────────────────────── */}
      <Hoja titulo="Lo que hace falta" orden={7}>
        {ruta.materiales.length > 0 && (
          <>
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#e4ded2]/55">
              Material
            </p>
            <ul className="mt-2.5 flex flex-wrap gap-2">
              {ruta.materiales.map((m) => (
                <li
                  key={m}
                  className="rounded-full border border-[#e4ded2]/18 px-3 py-1 text-xs text-[#e4ded2]/75"
                >
                  {m}
                </li>
              ))}
            </ul>
          </>
        )}

        {ruta.pregunta_a_la_comunidad && (
          <div className="mt-5 border-t border-[#e4ded2]/12 pt-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#e4ded2]/55">
              Lo que se le pregunta a la comunidad
            </p>
            <div className="mt-2">
              <Linea
                etiqueta=""
                valor={ruta.pregunta_a_la_comunidad}
                onCambio={(v) => set("pregunta_a_la_comunidad", v)}
                filas={2}
              />
            </div>
          </div>
        )}

        {ruta.mapuzugun.length > 0 && (
          <div className="mt-5 border-t border-[#e4ded2]/12 pt-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#e4ded2]/55">
              El lugar en mapuzugun
            </p>
            <ul className="mt-2.5 flex flex-wrap gap-x-5 gap-y-2">
              {ruta.mapuzugun.map((m) => (
                <li key={m.termino} className="text-sm">
                  <span className="font-semibold text-[#f3efe7]">{m.termino}</span>
                  <span className="text-[#e4ded2]/60"> · {m.castellano}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs leading-relaxed text-[#e0a678]">
              Estas palabras las propuso el modelo y no las ha revisado un
              hablante. Antes de imprimirlas, pregúntale al educador tradicional
              de tu escuela.
            </p>
          </div>
        )}
      </Hoja>

      <div className="flex flex-wrap items-center gap-4 px-1">
        <button
          type="button"
          onClick={pedir}
          disabled={pidiendo}
          className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#e4ded2]/55 underline underline-offset-4 transition hover:text-[#e4ded2] disabled:opacity-40"
        >
          {pidiendo ? "Armando…" : "Armar otra"}
        </button>
        <button
          type="button"
          onClick={() => onCambio({ ...e, rutaIA: null })}
          className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#e4ded2]/40 underline underline-offset-4 transition hover:text-[#e4ded2]/75"
        >
          Descartarla y usar una escrita
        </button>
      </div>
      <Aviso aviso={aviso} />
    </>
  );
}

/** Un campo que se ve como texto hasta que lo tocas. */
function Linea({
  etiqueta,
  valor,
  onCambio,
  filas = 1,
  grande = false,
  tenue = false,
}: {
  etiqueta: string;
  valor: string;
  onCambio: (v: string) => void;
  filas?: number;
  grande?: boolean;
  tenue?: boolean;
}) {
  return (
    <label className="block">
      {etiqueta && (
        <span className="mb-1.5 block font-mono text-[11px] uppercase tracking-[0.14em] text-[#e4ded2]/60">
          {etiqueta}
        </span>
      )}
      <textarea
        value={valor}
        onChange={(ev) => onCambio(ev.target.value)}
        rows={filas}
        className={[
          "w-full resize-y rounded-lg border border-transparent bg-transparent leading-relaxed outline-none transition",
          "focus:border-[#e4ded2]/25 focus:bg-[#e4ded2]/[0.05] focus:px-3 focus:py-2",
          grande ? "text-lg font-semibold text-[#f3efe7]" : "text-[15px]",
          tenue ? "text-[#e4ded2]/70" : "text-[#f3efe7]",
        ].join(" ")}
      />
    </label>
  );
}

function Aviso({ aviso }: { aviso: { tono: "malo" | "neutro"; texto: string } | null }) {
  if (!aviso) return null;
  return (
    <p
      className={`mt-4 rounded-lg border px-3.5 py-2.5 text-sm leading-relaxed ${
        aviso.tono === "malo"
          ? "border-[#e0a678]/40 bg-[#e0a678]/[0.07] text-[#e0a678]"
          : "border-[#e4ded2]/20 bg-[#e4ded2]/[0.05] text-[#e4ded2]/75"
      }`}
    >
      {aviso.texto}
    </p>
  );
}
