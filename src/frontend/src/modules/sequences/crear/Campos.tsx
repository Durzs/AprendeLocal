/**
 * Los controles del cuaderno.
 *
 * Van aparte porque las tres diapositivas usan los mismos y porque el
 * formulario oscuro necesita su propio contraste: los campos del resto de la
 * aplicación son grises sobre blanco y aquí desaparecerían.
 *
 * Todos llevan etiqueta visible y asociada. Un `placeholder` que hace de
 * etiqueta se borra apenas la persona escribe, y entonces el campo queda sin
 * nombre justo cuando hay que revisarlo.
 */

import { useState, type ReactNode } from "react";

export function Campo({
  etiqueta,
  ayuda,
  children,
  ancho = "media",
}: {
  etiqueta: string;
  ayuda?: string;
  children: ReactNode;
  ancho?: "media" | "entera";
}) {
  return (
    <label className={`block ${ancho === "entera" ? "sm:col-span-2" : ""}`}>
      <span className="mb-1.5 block rotulo text-[var(--crema)]/60">
        {etiqueta}
      </span>
      {children}
      {ayuda && <span className="mt-1.5 block text-xs text-[var(--crema)]/45">{ayuda}</span>}
    </label>
  );
}

const PIEL =
  "w-full rounded-lg border border-[var(--crema)]/20 bg-[var(--crema)]/[0.045] px-3.5 py-2.5 text-[15px] text-[var(--crema-clara)] outline-none transition placeholder:text-[var(--crema)]/30 focus:border-[var(--tierra-600)] focus:bg-[var(--crema)]/[0.08]";

export function Texto(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={PIEL} />;
}

export function Parrafo(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${PIEL} min-h-[92px] resize-y leading-relaxed`} />;
}

/**
 * Un grupo de opciones que se marcan y desmarcan.
 *
 * Son botones y no casillas a propósito: en el computador de una escuela la
 * casilla nativa mide doce píxeles y hay que apuntarle. Un botón del alto de
 * un dedo se acierta a la primera.
 */
export function Fichas<T extends string>({
  etiqueta,
  ayuda,
  opciones,
  elegidas,
  onElegir,
  unica = false,
}: {
  etiqueta: string;
  ayuda?: string;
  opciones: { valor: T; titulo: string }[];
  elegidas: T[];
  onElegir: (v: T[]) => void;
  unica?: boolean;
}) {
  function alternar(v: T) {
    if (unica) {
      onElegir(elegidas[0] === v ? [] : [v]);
      return;
    }
    onElegir(elegidas.includes(v) ? elegidas.filter((x) => x !== v) : [...elegidas, v]);
  }

  return (
    <fieldset className="sm:col-span-2">
      <legend className="mb-2 rotulo text-[var(--crema)]/60">
        {etiqueta}
      </legend>
      <div className="flex flex-wrap gap-2">
        {opciones.map((o) => {
          const puesta = elegidas.includes(o.valor);
          return (
            <button
              key={o.valor}
              type="button"
              onClick={() => alternar(o.valor)}
              aria-pressed={puesta}
              className={[
                "rounded-full border px-4 py-2 text-sm transition",
                puesta
                  ? "border-[var(--tierra-600)] bg-[var(--tierra-600)] font-semibold text-[#1e2a24]"
                  : "border-[var(--crema)]/22 text-[var(--crema)]/80 hover:border-[var(--crema)]/45 hover:text-[var(--crema)]",
              ].join(" ")}
            >
              {o.titulo}
            </button>
          );
        })}
      </div>
      {ayuda && <p className="mt-2 text-xs text-[var(--crema)]/45">{ayuda}</p>}
    </fieldset>
  );
}

/**
 * Una tarjeta de papel sobre el verde, para agrupar sin encerrar.
 *
 * `orden` la hace asomar después de las anteriores. Al llegar a una lámina
 * nueva hay entre tres y seis hojas, y aparecerlas todas juntas es una pared;
 * escalonadas se leen como una lista en orden. Pasada la octava entran sin
 * retraso, que es mejor que hacer esperar a nadie.
 */
/**
 * Una lámina del cuaderno.
 *
 * PLEGADA, CUANDO ES MATERIAL DE CONSULTA
 *
 * La tercera lámina llegó a medir siete mil setecientos píxeles: siete
 * secciones largas, una debajo de otra, casi todas con texto que se lee una
 * vez y después solo se consulta. El método se lee antes de empezar el
 * proyecto, no cada vez que se abre la aplicación; los dos permisos de la
 * salida son formularios que se imprimen, no algo que haya que releer.
 *
 * Con `resumen` la lámina llega cerrada, mostrando una línea que dice qué hay
 * dentro. Lo que se trabaja cada semana sigue abierto; lo que se consulta, se
 * abre cuando hace falta.
 */
export function Hoja({
  children,
  titulo,
  orden,
  resumen,
}: {
  children: ReactNode;
  titulo?: string;
  orden?: number;
  /** Si viene, la lámina llega plegada y esto es lo que se ve cerrada. */
  resumen?: string;
}) {
  const retraso = orden && orden <= 8 ? ` animar-hoja-${orden}` : "";
  const [abierta, ponerAbierta] = useState(!resumen);

  return (
    <section
      className={`animar-hoja${retraso} rounded-2xl border border-[var(--crema)]/14 bg-[var(--crema)]/[0.035] p-6`}
    >
      {titulo && !resumen && (
        <h2 className="mb-5 rotulo text-[var(--tierra-600)]">{titulo}</h2>
      )}

      {titulo && resumen && (
        <button
          type="button"
          onClick={() => ponerAbierta(!abierta)}
          aria-expanded={abierta}
          className="-m-1 flex w-full items-baseline gap-3 p-1 text-left"
        >
          <span className="min-w-0 flex-1">
            <span className="rotulo block text-[var(--tierra-600)]">{titulo}</span>
            {!abierta && (
              <span className="mt-1.5 block text-[15px] leading-relaxed text-[var(--crema)]/75">
                {resumen}
              </span>
            )}
          </span>
          <span aria-hidden className="shrink-0 text-[var(--crema)]/40">
            {abierta ? "\u2212" : "+"}
          </span>
        </button>
      )}

      {abierta && <div className={resumen ? "mt-5" : ""}>{children}</div>}
    </section>
  );
}
