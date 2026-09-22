/**
 * Elegir los objetivos del currículum de una lista, no escribirlos.
 *
 * El campo era un cuadro de texto vacío y decía «los códigos si los tienes a
 * mano». Eso obliga a acordarse del código o a ir a buscar el programa en otra
 * pestaña, que en un computador de escuela con una conexión mala es media
 * clase perdida. Aquí están todos los de la edición: se abre el curso, se
 * marca lo que va a pasar y listo.
 *
 * En Chile son los Objetivos de Aprendizaje de las Bases Curriculares; en
 * Brasil, las habilidades de la BNCC. El selector no lo sabe: lee la lista de
 * `useContenido()` ya traducida a la forma común (§contenido/curriculo.ts).
 *
 * La lista se despliega por curso y adentro se agrupa por asignatura y eje (o
 * unidade temática), que es como están en el documento. Solo aparecen los
 * cursos que el docente dijo tener en la sala, porque nadie necesita ver los
 * de 8º si su sala llega a 6º.
 *
 * DÓNDE APARECE, Y POR QUÉ IMPORTA DÓNDE ESCRIBE
 *
 * En dos sitios de la misma lámina: en la tercera columna de la problemática,
 * donde escribe en `Expedicion.oa`, y dentro del formulario de una actividad
 * propia, donde escribe en la actividad. Lo segundo no llegaba a lo primero, y
 * el docente marcaba objetivos en su actividad que el resto del cuaderno no
 * veía; ahora la actividad los suma al guardarse. Ver `guardar` en
 * §ElegirProblema.tsx.
 */

import { useMemo, useState } from "react";

import { useTx } from "../../../shared/tx";
import { useContenido } from "../contenido";
import {
  buscarObjetivo,
  filtrarObjetivos,
  objetivosDelCurso,
  type Objetivo,
} from "../contenido/curriculo";

export default function SelectorOA({
  cursos,
  elegidos,
  onElegir,
}: {
  /** Los cursos que el docente marcó arriba: «5º», «6º»… */
  cursos: string[];
  /** Códigos ya marcados. */
  elegidos: string[];
  onElegir: (codigos: string[]) => void;
}) {
  const tx = useTx();
  const c = useContenido();
  const [busqueda, setBusqueda] = useState("");
  const [abierto, setAbierto] = useState<string | null>(null);

  // Sin cursos marcados se muestran todos los de la edición: es preferible a
  // una pantalla vacía que no explica qué falta.
  const niveles = useMemo<string[]>(() => {
    const suyos = cursos.filter((x) => c.cursos.includes(x));
    return suyos.length ? suyos : c.cursos;
  }, [cursos, c.cursos]);

  // Con una búsqueda escrita se abren todos los cursos: buscar y tener que
  // abrir carpetas para ver el resultado es buscar dos veces.
  const buscando = busqueda.trim().length > 0;

  function alternar(codigo: string) {
    onElegir(
      elegidos.includes(codigo)
        ? elegidos.filter((x) => x !== codigo)
        : [...elegidos, codigo]
    );
  }

  const plural = (n: number, uno: string, varios: string) => (n === 1 ? uno : varios);

  return (
    <div className="sm:col-span-2">
      <div className="mb-2 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <span className="rotulo text-[var(--crema)]/60">{c.palabras.Objetivos}</span>
        <span className="font-mono text-[11px] text-[var(--crema)]/40">
          {elegidos.length
            ? `${elegidos.length} ${tx(
                plural(elegidos.length, "marcado", "marcados"),
                plural(elegidos.length, "marcada", "marcadas")
              )}`
            : tx("ninguno todavía", "nenhuma ainda")}
        </span>
      </div>

      <input
        type="search"
        value={busqueda}
        onChange={(ev) => setBusqueda(ev.target.value)}
        placeholder={`${tx("Busca por palabra", "Busque por palavra")}: ${c.palabras.ejemploBusqueda}`}
        aria-label={tx("Buscar entre los objetivos", "Buscar entre as habilidades")}
        className="w-full rounded-lg border border-[var(--crema)]/20 bg-[var(--crema)]/[0.045] px-3.5 py-2.5 text-[15px] text-[var(--crema-clara)] outline-none transition placeholder:text-[var(--crema)]/30 focus:border-[var(--tierra-600)] focus:bg-[var(--crema)]/[0.08]"
      />

      {/* Lo marcado, siempre a la vista. Con la lista cerrada el docente tiene
          que abrirla para acordarse de qué eligió, y eso es justo lo que la
          lista venía a evitar. */}
      {elegidos.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-2">
          {elegidos.map((cod) => (
            <li key={cod}>
              <button
                type="button"
                onClick={() => alternar(cod)}
                title={buscarObjetivo(cod)?.texto}
                className="group inline-flex min-h-8 items-center gap-2 rounded-full bg-[var(--tierra-600)] px-3 py-1 font-mono text-[11px] font-semibold text-[#1e2a24] transition hover:bg-[#d97038]"
              >
                {cod.replace(/_[A-Z]+_/, " · ")}
                <span aria-hidden className="opacity-60 group-hover:opacity-100">
                  ×
                </span>
                <span className="sr-only">{tx("Quitar", "Remover")}</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-3 space-y-2">
        {niveles.map((nivel) => {
          const todos = objetivosDelCurso(c.objetivos, nivel);
          const vistos = filtrarObjetivos(todos, busqueda);
          const abiertoAhora = buscando || abierto === nivel;
          const marcadosAqui = todos.filter((o) => elegidos.includes(o.codigo)).length;

          if (buscando && vistos.length === 0) return null;

          return (
            <div
              key={nivel}
              className="overflow-hidden rounded-xl border border-[var(--crema)]/14"
            >
              <button
                type="button"
                onClick={() => setAbierto(abierto === nivel ? null : nivel)}
                aria-expanded={abiertoAhora}
                className="flex min-h-11 w-full items-center justify-between gap-3 px-4 py-3 text-left transition hover:bg-[var(--crema)]/[0.04]"
              >
                <span className="flex items-baseline gap-3">
                  <span className="font-mono text-[13px] font-semibold text-[var(--crema-clara)]">
                    {c.nombreCurso(nivel)}
                  </span>
                  <span className="text-xs text-[var(--crema)]/45">
                    {vistos.length}{" "}
                    {plural(vistos.length, c.palabras.objetivo, c.palabras.objetivos)}
                    {marcadosAqui > 0
                      ? ` · ${marcadosAqui} ${tx(
                          plural(marcadosAqui, "marcado", "marcados"),
                          plural(marcadosAqui, "marcada", "marcadas")
                        )}`
                      : ""}
                  </span>
                </span>
                <span
                  aria-hidden
                  className={`text-[var(--tierra-600)] transition-transform duration-300 ${abiertoAhora ? "rotate-180" : ""}`}
                >
                  ▾
                </span>
              </button>

              {abiertoAhora && (
                <ul className="animar-hoja border-t border-[var(--crema)]/12">
                  {vistos.map((o, i) => (
                    <FilaObjetivo
                      key={o.codigo}
                      o={o}
                      marcado={elegidos.includes(o.codigo)}
                      primeroDelGrupo={
                        i === 0 ||
                        vistos[i - 1]?.grupo !== o.grupo ||
                        vistos[i - 1]?.asignatura !== o.asignatura
                      }
                      onAlternar={() => alternar(o.codigo)}
                    />
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>

      <p className="mt-2.5 text-xs leading-relaxed text-[var(--crema)]/45">
        {tx(
          "Son los de las Bases Curriculares, en las seis asignaturas. Marca los que vas a pasar: de ahí salen los indicadores con que se evalúa y lo que se cita en la hoja que firma la dirección.",
          "São as habilidades da BNCC, dos seis componentes. Marque as que vai trabalhar: delas saem os indicadores de avaliação e o que se cita no documento que a direção assina."
        )}
      </p>
    </div>
  );
}

function FilaObjetivo({
  o,
  marcado,
  primeroDelGrupo,
  onAlternar,
}: {
  o: Objetivo;
  marcado: boolean;
  primeroDelGrupo: boolean;
  onAlternar: () => void;
}) {
  return (
    <li>
      {primeroDelGrupo && (
        <p className="border-t border-[var(--crema)]/8 bg-[var(--crema)]/[0.02] px-4 py-1.5 rotulo text-[var(--crema)]/40 first:border-t-0">
          {o.nombreAsignatura} · {o.grupo}
        </p>
      )}
      <button
        type="button"
        onClick={onAlternar}
        aria-pressed={marcado}
        className={`flex w-full items-start gap-3 px-4 py-3 text-left transition ${
          marcado ? "bg-[var(--tierra-600)]/[0.1]" : "hover:bg-[var(--crema)]/[0.04]"
        }`}
      >
        <span
          aria-hidden
          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border text-[11px] font-bold transition ${
            marcado
              ? "border-[var(--tierra-600)] bg-[var(--tierra-600)] text-[#1e2a24]"
              : "border-[var(--crema)]/30 text-transparent"
          }`}
        >
          ✓
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
            <span className="font-mono text-[11px] font-semibold text-[var(--tierra-600)]">
              {o.etiqueta}
            </span>
          </span>
          <span className="mt-1 block text-sm leading-relaxed text-[var(--crema)]/80">
            {o.texto}
          </span>
        </span>
      </button>
    </li>
  );
}
