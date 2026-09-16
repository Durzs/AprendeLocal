/**
 * El calendario del proyecto: las clases, una por una.
 *
 * QUÉ CAMBIÓ
 *
 * Las clases venían de la ruta que armaba el modelo, así que un docente sin
 * cuenta, sin señal o sin ganas de esperar a un servidor no tenía calendario.
 * Ahora las escribe él, que además es el único que sabe si el 18 de septiembre
 * le parte la unidad en dos o si el martes de junio se va a perder por lluvia.
 *
 * Escribirlas cuesta más que recibirlas hechas, y a cambio el calendario dice
 * la verdad. Un plan de diez semanas generado por un modelo que no conoce el
 * colegio se corrige entero la primera semana, y corregir diez títulos ajenos
 * es más trabajo que escribir seis propios.
 *
 * QUÉ LLEVA ESTA HOJA Y QUÉ LLEVA LA DE AL LADO
 *
 * Esta contesta qué toca el martes. La bitácora de más arriba lleva las seis
 * etapas del método y contesta en qué parte del proyecto está el curso. Una
 * etapa puede ocupar tres clases o media, así que ninguna se deduce de la
 * otra.
 *
 * Llega plegada porque es una lista de casillas: se abre, se marca una y se
 * cierra. La bitácora llega abierta porque hay algo que leer en ella.
 *
 * MARCAR Y DESMARCAR
 *
 * Las dos cosas cuestan un clic y ninguna pide explicaciones. Una clase que no
 * se dio porque llovió y no se pudo salir no es un incumplimiento: es un
 * martes de invierno en La Araucanía. La fecha se guarda y se corrige, porque
 * «la salida fue el 12» es exactamente el dato que falta cuando, un mes
 * después, hay que escribir el informe y ya nadie se acuerda.
 */

import { Hoja, Texto } from "../crear/Campos";
import type { Expedicion } from "../crear/expedicion";
import {
  agregarSemana,
  alternar,
  corregirFecha,
  estaHecha,
  hoy,
  quitarSemana,
  renombrarSemana,
  type Avance,
} from "../crear/avance";
import type { EstadoNube } from "../crear/nube";

export default function Calendario({
  e,
  avance,
  onExpedicion,
  onAvance,
  orden = 8,
}: {
  e: Expedicion;
  avance: Avance;
  onExpedicion: (e: Expedicion) => void;
  onAvance: (a: Avance) => void;
  estado?: EstadoNube;
  orden?: number;
}) {
  const semanas = e.semanas;
  const hechas = semanas.filter((s) => estaHecha(avance, s.id)).length;
  const siguiente = semanas.find((s) => !estaHecha(avance, s.id));

  return (
    <Hoja
      titulo="El calendario de las clases"
      orden={orden}
      resumen={
        semanas.length === 0
          ? "Todavía sin clases anotadas. Se escriben aquí, una por una."
          : hechas === 0
            ? `${semanas.length} clases, ninguna dada todavía.`
            : `Van ${hechas} de ${semanas.length}${
                siguiente ? `. Sigue: ${siguiente.titulo || "sin título"}` : ""
              }.`
      }
    >
      <p className="mb-5 max-w-2xl text-[15px] leading-relaxed text-[var(--crema)]/82">
        Una fila por clase, con el título que le pongas tú. Se marcan a medida
        que se dan y se desmarcan igual de fácil.
        {e.sesiones ? ` Dijiste que tenías ${e.sesiones} clases o más.` : ""}
      </p>

      {semanas.length === 0 ? (
        <p className="text-sm leading-relaxed text-[var(--crema)]/55">
          Todavía no hay ninguna anotada.
        </p>
      ) : (
        <ol className="space-y-2.5">
          {semanas.map((s, i) => {
            const hecha = estaHecha(avance, s.id);
            const marca = avance.hechas.find((h) => h.semana === s.id);
            const esSiguiente = siguiente?.id === s.id;

            return (
              <li
                key={s.id}
                className={`flex flex-wrap items-center gap-x-3 gap-y-2 rounded-xl border px-3.5 py-3 transition ${
                  hecha
                    ? "border-[var(--crema)]/20 bg-[var(--crema)]/[0.06]"
                    : esSiguiente
                      ? "border-[var(--tierra-300)]/40 bg-[var(--tierra-300)]/[0.06]"
                      : "border-[var(--crema)]/12"
                }`}
              >
                <button
                  type="button"
                  onClick={() => onAvance(alternar(avance, s.id))}
                  aria-pressed={hecha}
                  className="grid h-11 w-11 shrink-0 place-items-center"
                >
                  <span
                    aria-hidden
                    className={`grid h-6 w-6 place-items-center rounded-full border text-xs transition ${
                      hecha
                        ? "border-transparent bg-[var(--crema-clara)] text-[#1e2a24]"
                        : "border-[var(--crema)]/35 text-transparent"
                    }`}
                  >
                    ✓
                  </span>
                  <span className="sr-only">
                    {hecha ? "Desmarcar" : "Marcar"} la clase {i + 1}
                  </span>
                </button>

                <span className="cifra shrink-0 text-xs text-[var(--crema)]/40">
                  {String(i + 1).padStart(2, "0")}
                  {esSiguiente && !hecha ? " · la que viene" : ""}
                </span>

                <label className="min-w-[12rem] flex-1">
                  <span className="sr-only">Título de la clase {i + 1}</span>
                  <Texto
                    value={s.titulo}
                    onChange={(ev) =>
                      onExpedicion(renombrarSemana(e, s.id, ev.target.value))
                    }
                    placeholder="Salida al estero, tres puntos"
                  />
                </label>

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
                        onAvance(corregirFecha(avance, s.id, ev.target.value))
                      }
                      className="rounded-lg border border-[var(--crema)]/20 bg-transparent px-2.5 py-1.5 text-[var(--crema-clara)] [color-scheme:dark]"
                    />
                  </label>
                )}

                <button
                  type="button"
                  onClick={() => {
                    onExpedicion(quitarSemana(e, s.id));
                    if (hecha) onAvance(alternar(avance, s.id));
                  }}
                  className="min-h-11 shrink-0 px-2 text-lg leading-none text-[var(--crema)]/35 transition hover:text-[var(--tierra-300)]"
                  title={`Quitar la clase ${i + 1}`}
                >
                  <span aria-hidden>×</span>
                  <span className="sr-only">Quitar la clase {i + 1}</span>
                </button>
              </li>
            );
          })}
        </ol>
      )}

      <button
        type="button"
        onClick={() => onExpedicion(agregarSemana(e))}
        className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-full border border-[var(--crema)]/20 px-4 text-sm text-[var(--crema)]/85 transition hover:border-[var(--crema)]/45 hover:text-[var(--crema-clara)]"
      >
        <span aria-hidden>+</span>
        {semanas.length === 0 ? "Anotar la primera clase" : "Anotar otra clase"}
      </button>
    </Hoja>
  );
}
