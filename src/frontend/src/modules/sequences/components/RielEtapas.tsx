/**
 * Riel de navegación entre etapas.
 *
 * Hace dos cosas a la vez, y por eso existe en lugar de unas pestañas
 * cualquiera: permite saltar de etapa sin recorrer seis tarjetas apiladas, y
 * dibuja el desvanecimiento de la guía. La barra de cada paso es más corta que
 * la del anterior, así que la pedagogía del diseño se lee en la navegación
 * misma en vez de quedar sepultada en el contenido.
 *
 * No aparece al imprimir: en papel se quiere la secuencia completa y seguida.
 */

export type ResumenEtapa = {
  numero: number;
  titulo: string;
  actor: "docente" | "plataforma" | "estudiantes";
  /** Cuántas piezas tiene: pasos, ejercicios, campos… */
  piezas?: number;
};

type Props = {
  etapas: ResumenEtapa[];
  activa: number;
  onCambiar: (numero: number) => void;
};

const COLOR_ACTOR: Record<ResumenEtapa["actor"], string> = {
  docente: "bg-slate-400",
  plataforma: "bg-emerald-500",
  estudiantes: "bg-sky-400",
};

export default function RielEtapas({ etapas, activa, onCambiar }: Props) {
  const total = etapas.length;

  return (
    <nav
      aria-label="Etapas de la secuencia"
      // `min-w-0` es imprescindible: como hijo de una rejilla su ancho mínimo
      // es automático, y sin esto la fila de chips estira el contenedor y hace
      // que toda la página se desplace en horizontal en el móvil.
      className="min-w-0 max-w-full print:hidden lg:sticky lg:top-24"
    >
      <p className="mb-3 hidden font-mono text-[11px] uppercase tracking-widest text-slate-400 lg:block">
        La guía se retira
      </p>

      <ol className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:gap-1 lg:overflow-visible lg:pb-0">
        {etapas.map((e) => {
          const esActiva = e.numero === activa;
          const guia = Math.round(100 - ((e.numero - 1) / Math.max(total - 1, 1)) * 82);

          return (
            <li key={e.numero} className="shrink-0 lg:shrink">
              <button
                type="button"
                onClick={() => onCambiar(e.numero)}
                aria-current={esActiva ? "step" : undefined}
                className={[
                  "w-full rounded-xl border px-3 py-2.5 text-left transition",
                  esActiva
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-transparent text-slate-600 hover:border-slate-200 hover:bg-slate-50",
                ].join(" ")}
              >
                <span className="flex items-baseline gap-2">
                  <span
                    className={[
                      "font-mono text-[11px]",
                      esActiva ? "text-slate-400" : "text-slate-400",
                    ].join(" ")}
                  >
                    {String(e.numero).padStart(2, "0")}
                  </span>
                  <span className="whitespace-nowrap text-sm font-medium lg:whitespace-normal">
                    {e.titulo}
                  </span>
                  {typeof e.piezas === "number" && e.piezas > 0 && (
                    <span
                      className={[
                        "ml-auto hidden font-mono text-[11px] lg:inline",
                        esActiva ? "text-slate-400" : "text-slate-400",
                      ].join(" ")}
                    >
                      {e.piezas}
                    </span>
                  )}
                </span>

                {/* La barra encoge etapa a etapa: es el desvanecimiento de la guía */}
                <span
                  aria-hidden="true"
                  className="mt-2 hidden h-1 w-full overflow-hidden rounded-full bg-slate-200/70 lg:block"
                >
                  <span
                    className={["block h-1 rounded-full", COLOR_ACTOR[e.actor]].join(" ")}
                    style={{ width: `${guia}%` }}
                  />
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      <p className="mt-4 hidden text-[11px] leading-relaxed text-slate-400 lg:block">
        La salida a terreno va en la quinta etapa, no en la primera: cuando la clase
        sale, ya sabe qué mirar.
      </p>
    </nav>
  );
}
