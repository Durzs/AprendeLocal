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
import {
  HUECOS,
  generar,
  huecosPendientes,
  type FaseIA,
  type RutaIA,
} from "./generar";
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
      <Hoja titulo="Armar la ruta de tu escuela" orden={3}>
        <p className="mb-4 max-w-2xl text-[15px] leading-relaxed text-[var(--crema)]/82">
          La ruta es el plan de clases del proyecto: qué se hace en cada
          sesión, en qué orden y con qué. Se arma con la problemática que
          elegiste, las asignaturas desde las que entras, los objetivos que
          marcaste y el lugar que quedó ubicado en el mapa. Es lo único de esta
          lámina que se fabrica para tu escuela y no sirve para ninguna otra.
        </p>
        <p className="mb-4 max-w-2xl text-[15px] leading-relaxed text-[var(--crema)]/72">
          La ruta llega con algunas partes en blanco, a propósito. Son las
          decisiones que dependen de cosas que pasan en tu escuela y que
          nosotros no tenemos cómo saber, así que en vez de rellenarlas a ojo
          quedan marcadas para que las completes tú.
        </p>

        {/* Sin sesión se dice aquí y no después de pulsar. Que el docente
            escriba media lámina y recién entonces le pidan entrar es hacerle
            perder el trabajo o hacerle abrir otra pestaña a mitad de camino. */}
        {user ? (
          <button
            type="button"
            onClick={pedir}
            disabled={pidiendo || e.oa.length === 0}
            className="rounded-full bg-[var(--tierra-600)] px-6 py-2.5 text-sm font-semibold text-[#1e2a24] transition hover:bg-[#d97038] disabled:cursor-not-allowed disabled:bg-[var(--crema)]/15 disabled:text-[var(--crema)]/40"
          >
            {pidiendo ? "Armando…" : "Armar mi ruta"}
          </button>
        ) : (
          <div className="rounded-xl border border-[var(--crema)]/20 bg-[var(--crema)]/[0.04] p-4">
            <p className="text-sm leading-relaxed text-[var(--crema)]/80">
              Armar la ruta con el modelo pide entrar con cuenta, porque cada
              una nos cuesta. Lo que estuviste haciendo no se pierde: queda guardado
              en este computador y sigue aquí cuando vuelvas.
            </p>
            <div className="mt-3.5 flex flex-wrap items-center gap-4">
              <Link
                to="/entrar"
                className="rounded-full bg-[var(--tierra-600)] px-6 py-2.5 text-sm font-semibold text-[#1e2a24] transition hover:bg-[#d97038]"
              >
                Entrar
              </Link>
              <Link
                to="/cadastrar"
                className="rotulo text-[var(--crema)]/60 underline underline-offset-4 transition hover:text-[var(--crema)]"
              >
                Crear una cuenta
              </Link>
            </div>
            <p className="mt-3.5 border-t border-[var(--crema)]/12 pt-3 text-xs leading-relaxed text-[var(--crema)]/50">
              El método, las láminas y los documentos para imprimir siguen
              funcionando sin cuenta y sin señal. Lo único detrás de la puerta
              es lo que cuesta plata.
            </p>
          </div>
        )}

        {user && e.oa.length === 0 && (
          <p className="mt-2.5 text-xs text-[var(--tierra-300)]">
            Antes marca al menos un objetivo en la primera lámina.
          </p>
        )}
        {pidiendo && (
          <div className="mt-4 h-0.5 w-32 overflow-hidden rounded-full bg-[var(--crema)]/15">
            <div className="animar-esperando h-full w-1/4 rounded-full bg-[var(--tierra-600)]" />
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
        <div className="animar-hoja animar-hoja-2 rounded-2xl border border-[var(--tierra-300)]/45 bg-[var(--tierra-300)]/[0.09] p-5">
          <p className="rotulo text-[var(--tierra-300)]">
            Faltan {faltan.length} de 4
          </p>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--crema)]/85">
            La ruta está armada. Faltan cuatro cosas que solo sabes tú, más
            abajo.
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

        <p className="mt-4 text-sm text-[var(--crema)]/70">
          Todo esto se puede reescribir.
        </p>
      </Hoja>

      {/* ── Los cuatro huecos ───────────────────────────────────────────── */}
      <Hoja titulo="Lo que pones tú" orden={4}>
        <p className="mb-4 max-w-2xl text-[15px] leading-relaxed text-[var(--crema)]/78">
          Van vacías a propósito: rellenarlas por ti sería inventarlas.
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
                    ? "border-[var(--tierra-300)]/45 bg-[var(--tierra-300)]/[0.05]"
                    : "border-[var(--tierra-600)]/45 bg-[var(--tierra-600)]/[0.06]"
                }`}
              >
                <label className="block">
                  <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="rotulo text-[var(--crema)]/75">
                      {h.etiqueta}
                    </span>
                    {vacio ? (
                      <span className="rounded bg-[var(--tierra-300)]/25 px-1.5 py-0.5 rotulo text-[var(--tierra-300)]">
                        falta
                      </span>
                    ) : (
                      <span className="rounded bg-[var(--crema)]/15 px-1.5 py-0.5 rotulo text-[var(--crema)]/80">
                        tuyo
                      </span>
                    )}
                  </span>
                  <span className="mt-1.5 block text-xs leading-relaxed text-[var(--crema)]/55">
                    {h.porque}
                  </span>
                  <textarea
                    value={valor}
                    onChange={(ev) => set(h.clave, ev.target.value)}
                    rows={2}
                    placeholder={h.ejemplo}
                    className="mt-2.5 w-full resize-y rounded-lg border border-[var(--crema)]/20 bg-[var(--crema)]/[0.045] px-3.5 py-2.5 text-[15px] leading-relaxed text-[var(--crema-clara)] outline-none transition placeholder:text-[var(--crema)]/25 focus:border-[var(--tierra-600)] focus:bg-[var(--crema)]/[0.08]"
                  />
                </label>
              </div>
            );
          })}
        </div>
      </Hoja>

      {/* ── Las semanas, como línea y no como lista ─────────────────────
          Eran ocho recuadros apilados, cada uno con dos campos de texto: media
          pantalla de prosa para algo que en realidad es una secuencia. Puesto
          en línea se ve de un vistazo dónde está la salida, cuánto falta para
          la entrega y qué tramo quedó demasiado cargado. El detalle sigue ahí,
          pero se abre al tocar la semana, no antes. */}
      <Hoja titulo="Semana por semana" orden={5}>
        <LineaDeTiempo
          fases={ruta.fases}
          onCambio={(fases) => set("fases", fases)}
        />
      </Hoja>

      {/* ── Cada curso ──────────────────────────────────────────────────── */}
      {ruta.por_curso.length > 0 && (
        <Hoja titulo="Qué hace cada curso" orden={6}>
          <ul className="space-y-2.5">
            {ruta.por_curso.map((c, i) => (
              <li key={i} className="flex flex-wrap items-baseline gap-x-3 gap-y-1.5">
                <span className="rounded bg-[var(--crema)]/15 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-[var(--crema-clara)]">
                  {c.nivel}
                </span>
                <span className="rotulo text-[var(--tierra-600)]">
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
                  <span className="font-mono text-[10px] text-[var(--crema)]/40">
                    {c.codigos.map((k) => k.replace(/_[A-Z]+_/, "·")).join(" ")}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </Hoja>
      )}

      {/* ── Material y comunidad ────────────────────────────────────────── */}
      <Hoja titulo="Lo que hace falta" orden={7}>
        {ruta.materiales.length > 0 && (
          <>
            <p className="rotulo text-[var(--crema)]/55">
              Material
            </p>
            <ul className="mt-2.5 flex flex-wrap gap-2">
              {ruta.materiales.map((m) => (
                <li
                  key={m}
                  className="rounded-full border border-[var(--crema)]/18 px-3 py-1 text-xs text-[var(--crema)]/75"
                >
                  {m}
                </li>
              ))}
            </ul>
          </>
        )}

        {ruta.pregunta_a_la_comunidad && (
          <div className="mt-5 border-t border-[var(--crema)]/12 pt-4">
            <p className="rotulo text-[var(--crema)]/55">
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
          <div className="mt-5 border-t border-[var(--crema)]/12 pt-4">
            <p className="rotulo text-[var(--crema)]/55">
              El lugar en mapuzugun
            </p>
            <ul className="mt-2.5 flex flex-wrap gap-x-5 gap-y-2">
              {ruta.mapuzugun.map((m) => (
                <li key={m.termino} className="text-sm">
                  <span className="font-semibold text-[var(--crema-clara)]">{m.termino}</span>
                  <span className="text-[var(--crema)]/60"> · {m.castellano}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs leading-relaxed text-[var(--tierra-300)]">
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
          className="rotulo text-[var(--crema)]/55 underline underline-offset-4 transition hover:text-[var(--crema)] disabled:opacity-40"
        >
          {pidiendo ? "Armando…" : "Armar otra"}
        </button>
        <button
          type="button"
          onClick={() => onCambio({ ...e, rutaIA: null })}
          className="rotulo text-[var(--crema)]/40 underline underline-offset-4 transition hover:text-[var(--crema)]/75"
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
        <span className="mb-1.5 block rotulo text-[var(--crema)]/60">
          {etiqueta}
        </span>
      )}
      <textarea
        value={valor}
        onChange={(ev) => onCambio(ev.target.value)}
        rows={filas}
        className={[
          "w-full resize-y rounded-lg border border-transparent bg-transparent leading-relaxed outline-none transition",
          "focus:border-[var(--crema)]/25 focus:bg-[var(--crema)]/[0.05] focus:px-3 focus:py-2",
          grande ? "text-lg font-semibold text-[var(--crema-clara)]" : "text-[15px]",
          tenue ? "text-[var(--crema)]/70" : "text-[var(--crema-clara)]",
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
          ? "border-[var(--tierra-300)]/40 bg-[var(--tierra-300)]/[0.07] text-[var(--tierra-300)]"
          : "border-[var(--crema)]/20 bg-[var(--crema)]/[0.05] text-[var(--crema)]/75"
      }`}
    >
      {aviso.texto}
    </p>
  );
}

/**
 * La ruta como una línea, no como una pila de recuadros.
 *
 * QUÉ CAMBIA AL DIBUJARLA
 *
 * Una secuencia de ocho semanas en forma de lista obliga a leerla entera para
 * saber dónde está la salida a terreno. Dibujada, eso se ve sin leer: la
 * salida es un punto en la línea, y se ve cuántas semanas quedan después para
 * ordenar lo que se trajo y construir la entrega. Casi todos los problemas de
 * una planificación se ven ahí, en la forma, antes que en el texto.
 *
 * El detalle de cada semana no desaparece: se abre al tocarla. Y sigue siendo
 * editable, porque lo que quede escrito es lo que sale impreso.
 *
 * En pantalla angosta la línea se vuelve vertical, que es lo que cabe.
 */
function LineaDeTiempo({
  fases,
  onCambio,
}: {
  fases: FaseIA[];
  onCambio: (fases: FaseIA[]) => void;
}) {
  const [abierta, ponerAbierta] = useState<number | null>(null);

  if (fases.length === 0) return null;

  return (
    <div>
      <ol className="flex flex-col gap-1.5 sm:flex-row sm:items-stretch sm:gap-0">
        {fases.map((f, i) => {
          const activa = abierta === i;
          return (
            <li key={i} className="min-w-0 flex-1">
              <button
                type="button"
                onClick={() => ponerAbierta(activa ? null : i)}
                aria-expanded={activa}
                className="group flex w-full items-center gap-2.5 text-left sm:block"
              >
                {/* El riel. En horizontal la línea une los puntos; en vertical
                    se apoya en el orden de la lista y no hace falta. */}
                <span className="relative flex shrink-0 items-center sm:block sm:h-6">
                  <span
                    aria-hidden
                    className={`hidden sm:block absolute top-1/2 h-px w-full -translate-y-1/2 ${
                      i === 0 ? "left-1/2 w-1/2" : ""
                    } ${i === fases.length - 1 ? "w-1/2" : ""} bg-[var(--crema)]/20`}
                  />
                  <span
                    className={`relative flex h-6 w-6 items-center justify-center rounded-full border font-mono text-[11px] transition sm:mx-auto ${
                      activa
                        ? "border-[var(--tierra-600)] bg-[var(--tierra-600)] text-[#1e2a24]"
                        : "border-[var(--crema)]/35 bg-[var(--fondo)] text-[var(--crema)]/75 group-hover:border-[var(--crema)]/60"
                    }`}
                  >
                    {f.semana}
                  </span>
                </span>
                <span
                  className={`block min-w-0 text-[15px] leading-snug sm:mt-2 sm:px-1.5 sm:text-sm ${
                    activa ? "text-[var(--tierra-300)]" : "text-[var(--crema-clara)]"
                  }`}
                >
                  {f.titulo}
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      {abierta !== null && fases[abierta] && (
        <div className="mt-4 space-y-2 rounded-xl border border-[var(--crema)]/14 p-4">
          <p className="rotulo text-[var(--tierra-600)]">
            Semana {fases[abierta].semana}
          </p>
          <Linea
            etiqueta=""
            valor={fases[abierta].titulo}
            onCambio={(v) =>
              onCambio(fases.map((x, j) => (j === abierta ? { ...x, titulo: v } : x)))
            }
          />
          <Linea
            etiqueta=""
            valor={fases[abierta].que_ocurre}
            onCambio={(v) =>
              onCambio(
                fases.map((x, j) => (j === abierta ? { ...x, que_ocurre: v } : x))
              )
            }
            filas={3}
            tenue
          />
        </div>
      )}

      <p className="mt-3 text-sm text-[var(--crema)]/70">
        Toca una semana para ver y cambiar lo que pasa en ella.
      </p>
    </div>
  );
}
