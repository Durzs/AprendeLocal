/**
 * Una etapa de la secuencia.
 *
 * El número y la barra de guía no son decoración: comunican el orden y el
 * desvanecimiento progresivo de la ayuda del docente, que es lo que sostiene
 * el diseño. Por eso la barra se estrecha etapa a etapa y la salida a terreno
 * aparece en la quinta posición, no en la primera.
 */

import type { ReactNode } from "react";

type Props = {
  numero: number;
  titulo: string;
  subtitulo?: string;
  /** Quién ejecuta esta etapa. Hace visible que la plataforma no enseña. */
  actor: "docente" | "plataforma" | "estudiantes";
  destacada?: boolean;
  /** Fuera de la etapa activa se oculta en pantalla, pero sigue en el DOM
   *  para que al imprimir salga la secuencia entera y seguida. */
  activa?: boolean;
  children: ReactNode;
};

const ETIQUETA_ACTOR: Record<Props["actor"], string> = {
  docente: "Lo conduce el docente",
  plataforma: "Lo prepara la plataforma",
  estudiantes: "Lo hacen los estudiantes",
};

export default function EtapaSecuencia({
  numero,
  titulo,
  subtitulo,
  actor,
  destacada = false,
  activa = true,
  children,
}: Props) {
  return (
    <section
      className={[
        "break-inside-avoid rounded-2xl border bg-white p-5 md:p-6",
        destacada ? "border-emerald-300 ring-1 ring-emerald-200" : "border-slate-200",
        activa ? "" : "hidden print:block print:mt-4",
      ].join(" ")}
    >
      <header className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="font-mono text-xs tracking-widest text-slate-400">
          {String(numero).padStart(2, "0")}
        </span>
        <h3 className="text-lg font-semibold tracking-tight text-slate-950">{titulo}</h3>
        <span className="ml-auto font-mono text-[11px] uppercase tracking-wider text-slate-500">
          {ETIQUETA_ACTOR[actor]}
        </span>
      </header>

      {subtitulo && <p className="mt-1 text-sm text-slate-500">{subtitulo}</p>}

      <div className="mt-4 space-y-3 text-sm leading-relaxed text-slate-700">
        {children}
      </div>
    </section>
  );
}
