import { Hoja } from "./Campos";
import type { Expedicion } from "./expedicion";
import {
  alternar,
  corregirFecha,
  estaHecha,
  hoy,
  semanasDe,
  type Avance,
} from "./avance";
import type { EstadoNube } from "./nube";

/**
 * El calendario de la ruta, semana a semana.
 *
 * QUÉ LLEVA ESTA HOJA Y QUÉ LLEVA LA DE AL LADO
 *
 * Esta lleva las semanas que trae la ruta armada, que son el calendario, y
 * contesta qué toca el martes. La bitácora de más arriba lleva las seis etapas
 * del método y contesta en qué parte del proyecto está el curso. Una etapa
 * puede ocupar tres semanas o media clase, así que ninguna de las dos se puede
 * deducir de la otra.
 *
 * Esta llega plegada porque es una lista de casillas: se abre, se marca una y
 * se cierra. La bitácora llega abierta porque hay algo que leer en ella.
 *
 * Marcar una semana es un clic y desmarcarla también. No hay confirmación ni
 * hay que explicar por qué: una semana que no se dio porque llovió y no se
 * pudo salir no es un incumplimiento, es un martes de invierno en La
 * Araucanía.
 *
 * La fecha se guarda y se puede corregir. No es para auditar a nadie: es que
 * «la salida fue el 12» es exactamente el dato que falta cuando, un mes
 * después, hay que escribir el informe y ya nadie se acuerda.
 */
export default function Seguimiento({
  e,
  avance,
  onCambio,
  estado,
}: {
  e: Expedicion;
  avance: Avance;
  onCambio: (a: Avance) => void;
  estado: EstadoNube;
}) {
  const semanas = semanasDe(e);

  if (!semanas.length) {
    return (
      <Hoja
        titulo="El calendario de la ruta"
        orden={8}
        resumen="Las semanas aparecen cuando la ruta esté armada con el modelo."
      >
        <p className="text-sm leading-relaxed text-[var(--crema)]/60">
          Las semanas salen de la ruta armada. Ármala con el modelo aquí arriba
          y vuelve: aquí se van marcando a medida que se dan.
        </p>
      </Hoja>
    );
  }

  const hechas = semanas.filter((s) => estaHecha(avance, s.semana)).length;
  const siguiente = semanas.find((s) => !estaHecha(avance, s.semana));

  return (
    <Hoja
      titulo="El calendario de la ruta"
      orden={8}
      resumen={
        hechas === 0
          ? `${semanas.length} semanas, ninguna marcada todavía.`
          : `Van ${hechas} de ${semanas.length} semanas${
              siguiente ? `. Sigue: ${siguiente.titulo}` : ""
            }.`
      }
    >
      <p className="mb-5 text-sm leading-relaxed text-[var(--crema)]/70">
        {hechas === 0 ? (
          <>Todavía no empieza en la sala. Marca cada semana cuando se dé.</>
        ) : hechas === semanas.length ? (
          <>Se dio entera. Queda el informe.</>
        ) : (
          <>
            Van {hechas} de {semanas.length}.{" "}
            {siguiente && (
              <span className="text-[var(--crema-clara)]">
                Sigue: {siguiente.titulo}.
              </span>
            )}
          </>
        )}
      </p>

      <ul className="space-y-2.5">
        {semanas.map((s) => {
          const hecha = estaHecha(avance, s.semana);
          const marca = avance.hechas.find((h) => h.semana === s.semana);
          const esSiguiente = siguiente?.semana === s.semana;

          return (
            <li
              key={s.semana}
              className={`flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl border px-4 py-3 transition ${
                hecha
                  ? "border-[var(--crema)]/20 bg-[var(--crema)]/[0.06]"
                  : esSiguiente
                    ? "border-[var(--tierra-300)]/40 bg-[var(--tierra-300)]/[0.06]"
                    : "border-[var(--crema)]/12"
              }`}
            >
              <button
                type="button"
                onClick={() => onCambio(alternar(avance, s.semana))}
                aria-pressed={hecha}
                className="flex min-h-11 min-w-0 flex-1 items-center gap-3 text-left"
              >
                <span
                  aria-hidden
                  className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border text-xs transition ${
                    hecha
                      ? "border-transparent bg-[var(--crema-clara)] text-[#1e2a24]"
                      : "border-[var(--crema)]/35 text-transparent"
                  }`}
                >
                  ✓
                </span>
                <span className="min-w-0">
                  <span className="rotulo block text-[var(--crema)]/45">
                    Semana {String(s.semana).padStart(2, "0")}
                    {esSiguiente && !hecha ? " · la que viene" : ""}
                  </span>
                  <span
                    className={`mt-1 block text-[15px] leading-snug ${
                      hecha ? "text-[var(--crema)]/55 line-through" : "text-[var(--crema-clara)]"
                    }`}
                  >
                    {s.titulo}
                  </span>
                </span>
              </button>

              {/* La fecha solo aparece si ya se dio: antes no hay nada que
                  fechar, y un campo vacío pidiendo un día que no ha llegado
                  se lee como una tarea pendiente más. */}
              {hecha && (
                <label className="flex shrink-0 items-center gap-2 text-xs text-[var(--crema)]/55">
                  <span>Se dio el</span>
                  <input
                    type="date"
                    value={marca?.fecha ?? hoy()}
                    max={hoy()}
                    onChange={(ev) =>
                      onCambio(corregirFecha(avance, s.semana, ev.target.value))
                    }
                    className="rounded-lg border border-[var(--crema)]/20 bg-transparent px-2.5 py-1.5 text-[var(--crema-clara)] [color-scheme:dark]"
                  />
                </label>
              )}
            </li>
          );
        })}
      </ul>

      <EstadoGuardado estado={estado} />
    </Hoja>
  );
}

/**
 * Dónde quedó guardado esto.
 *
 * Se dice siempre, incluso cuando todo va bien, porque la pregunta que el
 * docente se hace —«¿esto se pierde si cierro?»— no aparece solo cuando hay
 * un error. Y los dos casos malos no son el mismo: sin red se arregla solo, y
 * sin tabla hay que cargar un SQL en el proyecto. Decir «sin conexión» cuando
 * falta desplegar es mandar a alguien a reiniciar el módem por nada.
 */
function EstadoGuardado({ estado }: { estado: EstadoNube }) {
  const texto: Record<EstadoNube, string> = {
    sin_cuenta:
      "Guardado en este computador. Entra con tu cuenta y queda también ahí, para abrirlo desde otro equipo.",
    guardando: "Guardando en tu cuenta…",
    guardado: "Guardado en tu cuenta. Lo puedes abrir desde otro computador.",
    sin_conexion:
      "Guardado en este computador. No se pudo llegar a tu cuenta: cuando vuelva la señal se sube solo.",
    sin_tabla:
      "Guardado en este computador. El respaldo en la cuenta todavía no está activado en el servidor.",
  };

  return (
    <p
      className={`mt-5 border-t border-[var(--crema)]/12 pt-4 text-xs leading-relaxed ${
        estado === "sin_conexion" || estado === "sin_tabla"
          ? "text-[var(--tierra-300)]"
          : "text-[var(--crema)]/45"
      }`}
    >
      {texto[estado]}
    </p>
  );
}
