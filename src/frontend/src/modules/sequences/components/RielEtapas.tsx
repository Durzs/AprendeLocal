/**
 * Riel de navegación entre los momentos de la unidad.
 *
 * Antes mostraba la taxonomía del diseño instruccional —instrucción explícita,
 * práctica guiada, recuperación espaciada— con barras de porcentaje de guía.
 * Eso es vocabulario de justificación, no la lengua de trabajo de un docente,
 * y le cargaba con teoría que no necesita para dar la clase del lunes.
 *
 * Ahora se lee como su calendario: qué clase, y qué hace en ella. El orden
 * sigue siendo el que sostiene la evidencia; simplemente ya no se explica a
 * quien no lo pidió.
 */

export type ResumenEtapa = {
  numero: number;
  /** Cuándo ocurre: «Clase 1», «Semanas 1, 3 y 6»… */
  momento: string;
  /** Qué pasa, en voz de docente: «Explicas tú», «Salen a medir»… */
  titulo: string;
  /** Cuántas piezas trae, para juzgar el peso de un vistazo. */
  piezas?: number;
  /** Unidad de esas piezas: «pasos», «ejercicios», «mediciones»… */
  unidad?: string;
};

type Props = {
  etapas: ResumenEtapa[];
  activa: number;
  onCambiar: (numero: number) => void;
};

/** «1 ejercicios» chirría en una interfaz que quiere sonar a persona. */
function contar(n: number, plural: string): string {
  if (n !== 1) return `${n} ${plural}`;
  const singular = plural.endsWith("ones")
    ? plural.slice(0, -4) + "ón"
    : plural.endsWith("es")
      ? plural.slice(0, -2)
      : plural.replace(/s$/, "");
  return `${n} ${singular}`;
}

export default function RielEtapas({ etapas, activa, onCambiar }: Props) {
  return (
    <nav
      aria-label="Momentos de la unidad"
      // `min-w-0` es imprescindible: como hijo de una rejilla su ancho mínimo
      // es automático, y sin esto la fila de chips estira el contenedor y hace
      // que toda la página se desplace en horizontal en el móvil.
      className="min-w-0 max-w-full print:hidden lg:sticky lg:top-24"
    >
      <ol className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:gap-1 lg:overflow-visible lg:pb-0">
        {etapas.map((e, i) => {
          const esActiva = e.numero === activa;
          // Solo se repite la cabecera de momento cuando cambia, para que se
          // lea «Clase 1» una vez y no cuatro.
          const momentoNuevo = i === 0 || etapas[i - 1].momento !== e.momento;

          return (
            <li key={e.numero} className="shrink-0 lg:shrink">
              {momentoNuevo && (
                <p className="mb-1 mt-3 hidden font-mono text-[11px] uppercase tracking-widest text-slate-400 first:mt-0 lg:block">
                  {e.momento}
                </p>
              )}
              <button
                type="button"
                onClick={() => onCambiar(e.numero)}
                aria-current={esActiva ? "step" : undefined}
                className={[
                  "w-full rounded-xl border px-3 py-2.5 text-left transition",
                  esActiva
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-transparent text-slate-700 hover:border-slate-200 hover:bg-slate-50",
                ].join(" ")}
              >
                <span className="flex items-baseline gap-2">
                  <span className="whitespace-nowrap text-sm font-medium lg:whitespace-normal">
                    {e.titulo}
                  </span>
                  {typeof e.piezas === "number" && e.piezas > 0 && (
                    <span
                      className={[
                        "ml-auto hidden text-[11px] lg:inline",
                        esActiva ? "text-slate-400" : "text-slate-400",
                      ].join(" ")}
                    >
                      {contar(e.piezas, e.unidad ?? "")}
                    </span>
                  )}
                </span>
                <span className="text-[11px] text-slate-400 lg:hidden"> · {e.momento}</span>
              </button>
            </li>
          );
        })}
      </ol>

      <p className="mt-5 hidden text-[11px] leading-relaxed text-slate-400 lg:block">
        Salen a terreno después de practicar, no antes: así llegan sabiendo qué
        mirar.
      </p>
    </nav>
  );
}
