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
  total: number;
  titulo: string;
  subtitulo?: string;
  /** Quién ejecuta esta etapa. Hace visible que la plataforma no enseña. */
  actor: "docente" | "plataforma" | "estudiantes";
  destacada?: boolean;
  children: ReactNode;
};

const ETIQUETA_ACTOR: Record<Props["actor"], string> = {
  docente: "Lo conduce el docente",
  plataforma: "Lo prepara la plataforma",
  estudiantes: "Lo hacen los estudiantes",
};

export default function EtapaSecuencia({
  numero,
  total,
  titulo,
  subtitulo,
  actor,
  destacada = false,
  children,
}: Props) {
  // La guía va del 100 % en la primera etapa a un mínimo en la última.
  const guia = Math.round(100 - ((numero - 1) / Math.max(total - 1, 1)) * 82);

  return (
    <section
      className={[
        "break-inside-avoid rounded-2xl border bg-white p-5 md:p-6",
        destacada ? "border-emerald-300 ring-1 ring-emerald-200" : "border-slate-200",
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

      <div className="mt-3 flex items-center gap-2" aria-hidden="true">
        <div className="h-1 flex-1 overflow-hidden rounded-full bg-slate-100">
          <div
            className={destacada ? "h-1 bg-emerald-500" : "h-1 bg-slate-400"}
            style={{ width: `${guia}%` }}
          />
        </div>
        <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
          guía {guia}%
        </span>
      </div>

      <div className="mt-4 space-y-3 text-sm leading-relaxed text-slate-700">
        {children}
      </div>
    </section>
  );
}
