/**
 * La ruta como camino, no como lista.
 *
 * Es uno de los motivos que Sobel identifica en cómo los niños se relacionan
 * con un lugar: mapas y senderos. Aquí sirve para lo mismo que le sirve al
 * curso, que es ver de un golpe dónde empieza esto, dónde termina y en qué
 * parte estamos hoy. Tres semanas escritas como tres párrafos son tres
 * párrafos; escritas como camino son un plan.
 *
 * Se dibuja con CSS y no con SVG a propósito: en el móvil el camino se pone
 * vertical, y un trazado vectorial habría que rehacerlo entero para eso.
 */

import type { Fase } from "./catalogo";

export default function Recorrido({
  fases,
  activa,
  onElegir,
}: {
  fases: Fase[];
  /** La semana abierta. */
  activa: number;
  onElegir: (semana: number) => void;
}) {
  return (
    <ol className="mt-6 flex flex-col gap-0 sm:flex-row sm:gap-0">
      {fases.map((f, i) => {
        const esActiva = f.semana === activa;
        const anterior = f.semana < activa;

        return (
          <li
            key={f.semana}
            className={`animar-asoma animar-asoma-${Math.min(i + 1, 4)} relative flex flex-1 gap-3 sm:block`}
          >
            {/* El tramo que une esta parada con la anterior. En el móvil baja
                por la izquierda; en pantalla ancha cruza por detrás del punto. */}
            {i > 0 && (
              <span
                aria-hidden
                className={[
                  "absolute left-[11px] top-0 h-4 w-0.5 sm:left-0 sm:top-[11px] sm:h-0.5 sm:w-full",
                  anterior || esActiva ? "bg-tinta-950" : "bg-slate-200",
                  "transition-colors duration-500",
                ].join(" ")}
              />
            )}

            <button
              type="button"
              onClick={() => onElegir(f.semana)}
              aria-current={esActiva ? "step" : undefined}
              className="group relative z-10 flex flex-1 gap-3 pb-5 text-left sm:block sm:pb-0 sm:pr-4"
            >
              <span
                aria-hidden
                className={[
                  "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 font-mono text-[11px] font-bold transition-all duration-300",
                  esActiva
                    ? "scale-110 border-slate-900 bg-tinta-950 text-white"
                    : anterior
                      ? "border-slate-900 bg-white text-slate-900"
                      : "border-slate-300 bg-white text-slate-400 group-hover:border-slate-500",
                ].join(" ")}
              >
                {f.semana}
              </span>

              <span className="block sm:mt-2.5">
                <span
                  className={[
                    "block text-sm font-semibold transition-colors",
                    esActiva ? "text-texto" : "text-slate-600",
                  ].join(" ")}
                >
                  {f.titulo}
                </span>
                {/* El detalle solo en la parada abierta: seis párrafos a la vez
                    vuelven a ser la lista que el camino venía a evitar. */}
                {esActiva && (
                  <span className="animar-asoma mt-1 block text-sm text-slate-600">
                    {f.queOcurre}
                  </span>
                )}
              </span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}
