/**
 * Paso dos: las preguntas, escritas entre los dos.
 *
 * Esta es la lámina que decide si la ruta sirve. Una ruta con una buena
 * pregunta aguanta tres semanas; una con una pregunta que se contesta con sí o
 * no se acaba el martes.
 *
 * El sistema propone y el docente corrige. No al revés: las propuestas están
 * armadas con plantillas y se nota, y por eso aparecen marcadas como borrador.
 * En el momento en que él toca el texto, la pregunta pasa a ser suya y deja de
 * llevar esa marca. Ese cambio de etiqueta es la co-construcción: se ve quién
 * escribió qué, y lo que llega a la ruta lleva las palabras de la escuela.
 */

import { useMemo, useState } from "react";

import { Hoja, Parrafo } from "./Campos";
import type { Expedicion } from "./expedicion";
import { FAMILIAS, desdePropuesta, propia, proponer, reparos } from "./preguntas";

export default function Paso2({
  e,
  onCambio,
}: {
  e: Expedicion;
  onCambio: (e: Expedicion) => void;
}) {
  const propuestas = useMemo(() => proponer(e), [e]);
  const [nueva, setNueva] = useState("");

  /** Las preguntas que ya están en la expedición, por id. */
  const puestas = new Map(e.preguntas.map((p) => [p.id, p]));

  function alternar(id: string) {
    const ya = puestas.get(id);
    if (ya) {
      onCambio({ ...e, preguntas: e.preguntas.filter((p) => p.id !== id) });
      return;
    }
    const prop = propuestas.find((p) => p.id === id);
    if (!prop) return;
    onCambio({
      ...e,
      preguntas: [...e.preguntas, { ...desdePropuesta(prop), elegida: true }],
    });
  }

  /** Al tocar el texto la pregunta pasa a ser del docente. */
  function reescribir(id: string, texto: string) {
    onCambio({
      ...e,
      preguntas: e.preguntas.map((p) =>
        p.id === id ? { ...p, texto, origen: "docente" as const } : p
      ),
    });
  }

  function agregar() {
    const t = nueva.trim();
    if (!t) return;
    onCambio({ ...e, preguntas: [...e.preguntas, propia(t)] });
    setNueva("");
  }

  function alCentro(texto: string) {
    onCambio({ ...e, preguntaGuia: texto });
  }

  const elegidas = e.preguntas.filter((p) => p.elegida);

  return (
    <div className="space-y-4">
      {/* ── La pregunta que queda al centro ──────────────────────────── */}
      <Hoja titulo="La que va al centro" orden={4}>
        <p className="mb-3.5 text-sm leading-relaxed text-[var(--crema)]/70">
          De todas, una queda escrita en el pizarrón las tres semanas. Elígela
          abajo o escríbela aquí directamente.
        </p>
        <Parrafo
          value={e.preguntaGuia}
          onChange={(ev) => alCentro(ev.target.value)}
          placeholder="¿Le alcanza el agua de nuestro estero para la escuela y las casas de alrededor, todo el año?"
          className=""
        />
        <Reparos texto={e.preguntaGuia} />
      </Hoja>

      {/* ── Las propuestas, por familia ──────────────────────────────── */}
      {FAMILIAS.map((f, i) => {
        const suyas = propuestas.filter((p) => p.familia === f.id);
        return (
          <Hoja key={f.id} titulo={f.titulo} orden={5 + i}>
            <p className="mb-4 max-w-2xl text-sm leading-relaxed text-[var(--crema)]/60">
              {f.porque}
            </p>
            <ul className="space-y-2.5">
              {suyas.map((p) => {
                const puesta = puestas.get(p.id);
                return (
                  <li key={p.id}>
                    <div
                      className={[
                        "rounded-xl border p-3.5 transition",
                        puesta
                          ? "border-[var(--tierra-600)]/60 bg-[var(--tierra-600)]/[0.08]"
                          : "border-[var(--crema)]/14 hover:border-[var(--crema)]/30",
                      ].join(" ")}
                    >
                      <div className="flex items-start gap-3">
                        <button
                          type="button"
                          onClick={() => alternar(p.id)}
                          aria-pressed={!!puesta}
                          aria-label={puesta ? "Quitar esta pregunta" : "Usar esta pregunta"}
                          className={[
                            "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border text-xs font-bold transition",
                            puesta
                              ? "border-[var(--tierra-600)] bg-[var(--tierra-600)] text-[#1e2a24]"
                              : "border-[var(--crema)]/30 text-transparent hover:border-[var(--crema)]/60",
                          ].join(" ")}
                        >
                          ✓
                        </button>

                        <div className="min-w-0 flex-1">
                          {puesta ? (
                            <>
                              <textarea
                                value={puesta.texto}
                                onChange={(ev) => reescribir(p.id, ev.target.value)}
                                rows={2}
                                className="w-full resize-y rounded-lg border border-transparent bg-transparent text-[15px] leading-relaxed text-[var(--crema-clara)] outline-none transition focus:border-[var(--crema)]/25 focus:bg-[var(--crema)]/[0.05] focus:px-3 focus:py-2"
                              />
                              <div className="mt-1.5 flex flex-wrap items-center gap-3">
                                <Marca origen={puesta.origen} />
                                <button
                                  type="button"
                                  onClick={() => alCentro(puesta.texto)}
                                  className="rotulo text-[var(--tierra-600)] underline underline-offset-4 transition hover:text-[var(--tierra-500)]"
                                >
                                  Poner al centro
                                </button>
                              </div>
                            </>
                          ) : (
                            <button
                              type="button"
                              onClick={() => alternar(p.id)}
                              className="block w-full text-left text-[15px] leading-relaxed text-[var(--crema)]/70 transition hover:text-[var(--crema)]"
                            >
                              {p.texto}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </Hoja>
        );
      })}

      {/* ── Las del docente ──────────────────────────────────────────── */}
      <Hoja titulo="Las tuyas" orden={8}>
        <p className="mb-3.5 max-w-2xl text-sm leading-relaxed text-[var(--crema)]/60">
          Lo de arriba son borradores armados con lo que escribiste. Lo que
          sabes tú del lugar no está ahí. Escríbelo.
        </p>

        {e.preguntas.filter((p) => p.origen === "docente" && p.id.startsWith("docente-")).length >
          0 && (
          <ul className="mb-4 space-y-2.5">
            {e.preguntas
              .filter((p) => p.id.startsWith("docente-"))
              .map((p) => (
                <li
                  key={p.id}
                  className="flex items-start gap-3 rounded-xl border border-[var(--tierra-600)]/60 bg-[var(--tierra-600)]/[0.08] p-3.5"
                >
                  <div className="min-w-0 flex-1">
                    <textarea
                      value={p.texto}
                      onChange={(ev) => reescribir(p.id, ev.target.value)}
                      rows={2}
                      className="w-full resize-y rounded-lg border border-transparent bg-transparent text-[15px] leading-relaxed text-[var(--crema-clara)] outline-none transition focus:border-[var(--crema)]/25 focus:bg-[var(--crema)]/[0.05] focus:px-3 focus:py-2"
                    />
                    <div className="mt-1.5 flex flex-wrap items-center gap-3">
                      <Marca origen="docente" />
                      <button
                        type="button"
                        onClick={() => alCentro(p.texto)}
                        className="rotulo text-[var(--tierra-600)] underline underline-offset-4 transition hover:text-[var(--tierra-500)]"
                      >
                        Poner al centro
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          onCambio({ ...e, preguntas: e.preguntas.filter((x) => x.id !== p.id) })
                        }
                        className="rotulo text-[var(--crema)]/40 underline underline-offset-4 transition hover:text-[var(--crema)]/75"
                      >
                        Quitar
                      </button>
                    </div>
                  </div>
                </li>
              ))}
          </ul>
        )}

        <div className="flex flex-col gap-2.5 sm:flex-row">
          <Parrafo
            value={nueva}
            onChange={(ev) => setNueva(ev.target.value)}
            placeholder="¿Por qué el pozo de la escuela se seca antes que el de la casa de al lado?"
            rows={2}
          />
          <button
            type="button"
            onClick={agregar}
            disabled={!nueva.trim()}
            className="shrink-0 self-start rounded-full border border-[var(--crema)]/25 px-5 py-2.5 text-sm font-medium text-[var(--crema)]/85 transition hover:border-[var(--crema)]/55 hover:text-[var(--crema)] disabled:cursor-not-allowed disabled:opacity-30"
          >
            Agregar
          </button>
        </div>
        <Reparos texto={nueva} />
      </Hoja>

      {elegidas.length > 0 && (
        <p className="px-1 rotulo text-[var(--crema)]/40">
          {elegidas.length} pregunta{elegidas.length === 1 ? "" : "s"} en la ruta ·{" "}
          {elegidas.filter((p) => p.origen === "docente").length} escrita
          {elegidas.filter((p) => p.origen === "docente").length === 1 ? "" : "s"} por ti
        </p>
      )}
    </div>
  );
}

/** De quién es la frase que se está leyendo. */
function Marca({ origen }: { origen: "propuesta" | "docente" }) {
  return (
    <span
      className={[
        "rounded px-1.5 py-0.5 rotulo",
        origen === "docente"
          ? "bg-[var(--crema)]/15 text-[var(--crema)]/80"
          : "bg-transparent text-[var(--crema)]/40 ring-1 ring-inset ring-[var(--crema)]/20",
      ].join(" ")}
    >
      {origen === "docente" ? "tuya" : "borrador"}
    </span>
  );
}

/** Lo que le falta a una pregunta para aguantar tres semanas. */
function Reparos({ texto }: { texto: string }) {
  const dichos = texto.trim() ? reparos(texto) : [];
  if (!dichos.length) return null;
  return (
    <ul className="mt-2.5 space-y-1">
      {dichos.map((d) => (
        <li key={d} className="text-xs leading-snug text-[var(--tierra-300)]">
          {d}
        </li>
      ))}
    </ul>
  );
}
