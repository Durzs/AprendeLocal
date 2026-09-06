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

import type { ReactNode } from "react";

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
      <span className="mb-1.5 block font-mono text-[11px] uppercase tracking-[0.14em] text-[#e4ded2]/60">
        {etiqueta}
      </span>
      {children}
      {ayuda && <span className="mt-1.5 block text-xs text-[#e4ded2]/45">{ayuda}</span>}
    </label>
  );
}

const PIEL =
  "w-full rounded-lg border border-[#e4ded2]/20 bg-[#e4ded2]/[0.045] px-3.5 py-2.5 text-[15px] text-[#f3efe7] outline-none transition placeholder:text-[#e4ded2]/30 focus:border-[#c9612a] focus:bg-[#e4ded2]/[0.08]";

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
      <legend className="mb-2 font-mono text-[11px] uppercase tracking-[0.14em] text-[#e4ded2]/60">
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
                  ? "border-[#c9612a] bg-[#c9612a] font-semibold text-[#1e2a24]"
                  : "border-[#e4ded2]/22 text-[#e4ded2]/80 hover:border-[#e4ded2]/45 hover:text-[#e4ded2]",
              ].join(" ")}
            >
              {o.titulo}
            </button>
          );
        })}
      </div>
      {ayuda && <p className="mt-2 text-xs text-[#e4ded2]/45">{ayuda}</p>}
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
export function Hoja({
  children,
  titulo,
  orden,
}: {
  children: ReactNode;
  titulo?: string;
  orden?: number;
}) {
  const retraso = orden && orden <= 8 ? ` animar-hoja-${orden}` : "";
  return (
    <section
      className={`animar-hoja${retraso} rounded-2xl border border-[#e4ded2]/14 bg-[#e4ded2]/[0.035] p-6`}
    >
      {titulo && (
        <h2 className="mb-5 font-mono text-[11px] uppercase tracking-[0.18em] text-[#c9612a]">
          {titulo}
        </h2>
      )}
      {children}
    </section>
  );
}
