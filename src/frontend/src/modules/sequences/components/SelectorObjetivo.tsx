/**
 * Elegir el objetivo que toca esta semana.
 *
 * Antes eran 62 opciones en un desplegable plano, ordenadas por código. Un
 * docente no busca «OA02_CN_5»: busca lo que le toca en 6º, o busca «agua».
 * Así que se filtra por curso —que es como está organizado su horario— y se
 * busca por palabras.
 */

import { useMemo, useState } from "react";
import type { CurriculumObjective } from "../../../types";

/** `6to_basico` → `6º`. El dato viene con la forma de la base, no de la sala. */
export function nivelCorto(level: string): string {
  const n = /^(\d)/.exec(level.replace(/^(\d)(to|mo|vo|er|ro)?/, "$1"));
  return n ? `${n[1]}º` : level;
}

function normalizar(s: string): string {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

type Props = {
  objetivos: CurriculumObjective[];
  valor: string;
  onElegir: (code: string) => void;
  cargando: boolean;
};

export default function SelectorObjetivo({ objetivos, valor, onElegir, cargando }: Props) {
  const [busqueda, setBusqueda] = useState("");
  const [nivel, setNivel] = useState<string>("");

  const niveles = useMemo(
    () => [...new Set(objetivos.map((o) => o.level))].sort(),
    [objetivos]
  );

  const filtrados = useMemo(() => {
    const q = normalizar(busqueda).split(/\s+/).filter(Boolean);
    return objetivos.filter((o) => {
      if (nivel && o.level !== nivel) return false;
      if (q.length === 0) return true;
      const texto = normalizar(
        `${o.code} ${o.description} ${(o.keywords ?? []).join(" ")}`
      );
      return q.every((w) => texto.includes(w));
    });
  }, [objetivos, busqueda, nivel]);

  const elegido = objetivos.find((o) => o.code === valor);

  // Una vez elegido se colapsa: ocupar media pantalla con una lista ya resuelta
  // es cargarle al docente algo que ya decidió.
  if (elegido) {
    return (
      <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 shrink-0 rounded bg-slate-900 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-white">
            {nivelCorto(elegido.level)}
          </span>
          <p className="min-w-0 flex-1 text-sm text-slate-800">{elegido.description}</p>
          <button
            type="button"
            onClick={() => onElegir("")}
            className="shrink-0 rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            Cambiar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex flex-wrap gap-1.5">
          {niveles.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setNivel(nivel === n ? "" : n)}
              className={[
                "rounded-full border px-3 py-1 text-xs font-semibold transition",
                nivel === n
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-300 text-slate-600 hover:bg-slate-50",
              ].join(" ")}
            >
              {nivelCorto(n)}
            </button>
          ))}
        </div>
        <input
          type="search"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar: agua, volcanes, erosión…"
          disabled={cargando}
          className="min-w-0 flex-1 rounded-full border border-slate-200 px-4 py-1.5 text-sm outline-none focus:border-slate-400"
        />
      </div>

      <ul className="mt-3 max-h-72 divide-y divide-slate-100 overflow-y-auto rounded-xl border border-slate-200">
        {cargando && <li className="px-4 py-3 text-sm text-slate-500">Cargando…</li>}
        {!cargando && filtrados.length === 0 && (
          <li className="px-4 py-3 text-sm text-slate-500">
            Ningún objetivo coincide con esa búsqueda.
          </li>
        )}
        {filtrados.map((o) => (
          <li key={o.code}>
            <button
              type="button"
              onClick={() => onElegir(o.code)}
              className="flex w-full items-start gap-3 px-4 py-2.5 text-left hover:bg-slate-50"
            >
              <span className="mt-0.5 shrink-0 rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-slate-600">
                {nivelCorto(o.level)}
              </span>
              <span className="min-w-0 text-sm text-slate-800">{o.description}</span>
            </button>
          </li>
        ))}
      </ul>
      <p className="mt-1.5 text-xs text-slate-400">
        {filtrados.length} de {objetivos.length} objetivos
      </p>
    </div>
  );
}
