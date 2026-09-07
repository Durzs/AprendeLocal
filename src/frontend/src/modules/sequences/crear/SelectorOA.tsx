/**
 * Elegir los Objetivos de Aprendizaje de una lista, no escribirlos.
 *
 * El campo era un cuadro de texto vacío y decía «los códigos si los tienes a
 * mano». Eso obliga a acordarse del código o a ir a buscar el programa en otra
 * pestaña, que en un computador de escuela con una conexión mala es media
 * clase perdida. Aquí están los sesenta y dos de Ciencias Naturales de 5º a
 * 8º: se abre el curso, se marca lo que va a pasar y listo.
 *
 * La lista se despliega por curso y adentro se agrupa por eje, que es como
 * están en el programa. Solo aparecen los cursos que el docente dijo tener en
 * la sala, porque nadie necesita ver los OA de 8º si su sala llega a 6º.
 *
 * Cada objetivo dice si ya hay una ruta escrita que lo cubra. Eso no es
 * decoración: es lo que después decide qué ruta se le arma, así que conviene
 * que lo sepa mientras elige y no al final.
 */

import { useMemo, useState } from "react";

import { CURSO_CORTO, EJES, filtrarOA, objetivosDe, type NivelOA, type OA } from "./oa";

/** Los cursos de la sala, traducidos al nombre que usa el catálogo de OA. */
const NIVEL_DE_CURSO: Record<string, NivelOA> = {
  "5º": "5to_basico",
  "6º": "6to_basico",
  "7º": "7mo_basico",
  "8º": "8vo_basico",
};

export default function SelectorOA({
  cursos,
  elegidos,
  onElegir,
  conRuta,
}: {
  /** Los cursos que el docente marcó arriba: «5º», «6º»… */
  cursos: string[];
  /** Códigos ya marcados. */
  elegidos: string[];
  onElegir: (codigos: string[]) => void;
  /** Códigos que alguna ruta escrita ya cubre. */
  conRuta: Set<string>;
}) {
  const [busqueda, setBusqueda] = useState("");
  const [abierto, setAbierto] = useState<NivelOA | null>(null);

  // Sin cursos marcados se muestran los cuatro: es preferible a una pantalla
  // vacía que no explica qué falta.
  const niveles = useMemo<NivelOA[]>(() => {
    const suyos = cursos.map((c) => NIVEL_DE_CURSO[c]).filter(Boolean) as NivelOA[];
    return suyos.length ? suyos : (["5to_basico", "6to_basico", "7mo_basico", "8vo_basico"] as NivelOA[]);
  }, [cursos]);

  // Con una búsqueda escrita se abren todos los cursos: buscar y tener que
  // abrir carpetas para ver el resultado es buscar dos veces.
  const buscando = busqueda.trim().length > 0;

  function alternar(codigo: string) {
    onElegir(
      elegidos.includes(codigo)
        ? elegidos.filter((c) => c !== codigo)
        : [...elegidos, codigo]
    );
  }

  return (
    <div className="sm:col-span-2">
      <div className="mb-2 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#e4ded2]/60">
          Objetivos de aprendizaje
        </span>
        <span className="font-mono text-[11px] text-[#e4ded2]/40">
          {elegidos.length
            ? `${elegidos.length} marcado${elegidos.length === 1 ? "" : "s"}`
            : "ninguno todavía"}
        </span>
      </div>

      <input
        type="search"
        value={busqueda}
        onChange={(ev) => setBusqueda(ev.target.value)}
        placeholder="Busca por palabra: agua, suelo, energía, células…"
        className="w-full rounded-lg border border-[#e4ded2]/20 bg-[#e4ded2]/[0.045] px-3.5 py-2.5 text-[15px] text-[#f3efe7] outline-none transition placeholder:text-[#e4ded2]/30 focus:border-[#c9612a] focus:bg-[#e4ded2]/[0.08]"
      />

      {/* Lo marcado, siempre a la vista. Con la lista cerrada el docente tiene
          que abrirla para acordarse de qué eligió, y eso es justo lo que la
          lista venía a evitar. */}
      {elegidos.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-2">
          {elegidos.map((c) => (
            <li key={c}>
              <button
                type="button"
                onClick={() => alternar(c)}
                className="group inline-flex items-center gap-2 rounded-full bg-[#c9612a] px-3 py-1 font-mono text-[11px] font-semibold text-[#1e2a24] transition hover:bg-[#d97038]"
              >
                {c.replace(/_CN_/, " · ")}
                <span aria-hidden className="opacity-60 group-hover:opacity-100">
                  ×
                </span>
                <span className="sr-only">Quitar</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-3 space-y-2">
        {niveles.map((nivel) => {
          const todos = objetivosDe(nivel);
          const vistos = filtrarOA(todos, busqueda);
          const abiertoAhora = buscando || abierto === nivel;
          const marcadosAqui = todos.filter((o) => elegidos.includes(o.codigo)).length;

          if (buscando && vistos.length === 0) return null;

          return (
            <div
              key={nivel}
              className="overflow-hidden rounded-xl border border-[#e4ded2]/14"
            >
              <button
                type="button"
                onClick={() => setAbierto(abierto === nivel ? null : nivel)}
                aria-expanded={abiertoAhora}
                className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition hover:bg-[#e4ded2]/[0.04]"
              >
                <span className="flex items-baseline gap-3">
                  <span className="font-mono text-[13px] font-semibold text-[#f3efe7]">
                    {CURSO_CORTO[nivel]} básico
                  </span>
                  <span className="text-xs text-[#e4ded2]/45">
                    {vistos.length} objetivo{vistos.length === 1 ? "" : "s"}
                    {marcadosAqui > 0 ? ` · ${marcadosAqui} marcado${marcadosAqui === 1 ? "" : "s"}` : ""}
                  </span>
                </span>
                <span
                  aria-hidden
                  className={`text-[#c9612a] transition-transform duration-300 ${abiertoAhora ? "rotate-180" : ""}`}
                >
                  ▾
                </span>
              </button>

              {abiertoAhora && (
                <ul className="animar-hoja border-t border-[#e4ded2]/12">
                  {vistos.map((o, i) => (
                    <Objetivo
                      key={o.codigo}
                      oa={o}
                      marcado={elegidos.includes(o.codigo)}
                      tieneRuta={conRuta.has(o.codigo)}
                      primeroDelEje={i === 0 || vistos[i - 1]?.eje !== o.eje}
                      onAlternar={() => alternar(o.codigo)}
                    />
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>

      <p className="mt-2.5 text-xs leading-relaxed text-[#e4ded2]/45">
        Son los de Ciencias Naturales de las Bases Curriculares. Marca los que
        vas a pasar: de ahí sale la ruta que se te arma después.
      </p>
    </div>
  );
}

function Objetivo({
  oa,
  marcado,
  tieneRuta,
  primeroDelEje,
  onAlternar,
}: {
  oa: OA;
  marcado: boolean;
  tieneRuta: boolean;
  primeroDelEje: boolean;
  onAlternar: () => void;
}) {
  return (
    <li>
      {primeroDelEje && (
        <p className="border-t border-[#e4ded2]/8 bg-[#e4ded2]/[0.02] px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-[#e4ded2]/40 first:border-t-0">
          {EJES[oa.eje] ?? oa.eje}
        </p>
      )}
      <button
        type="button"
        onClick={onAlternar}
        aria-pressed={marcado}
        className={`flex w-full items-start gap-3 px-4 py-3 text-left transition ${
          marcado ? "bg-[#c9612a]/[0.1]" : "hover:bg-[#e4ded2]/[0.04]"
        }`}
      >
        <span
          aria-hidden
          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border text-[11px] font-bold transition ${
            marcado
              ? "border-[#c9612a] bg-[#c9612a] text-[#1e2a24]"
              : "border-[#e4ded2]/30 text-transparent"
          }`}
        >
          ✓
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
            <span className="font-mono text-[11px] font-semibold text-[#c9612a]">
              OA {oa.n}
            </span>
            {tieneRuta && (
              <span className="rounded bg-[#e4ded2]/12 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.1em] text-[#e4ded2]/70">
                hay ruta
              </span>
            )}
          </span>
          <span className="mt-1 block text-sm leading-relaxed text-[#e4ded2]/80">
            {oa.texto}
          </span>
        </span>
      </button>
    </li>
  );
}
