/**
 * Elegir dónde anclar la enseñanza — pero solo entre los lugares que de verdad
 * sirven para el objetivo elegido.
 *
 * Este componente es el que impide construir «el sistema digestivo en la cancha
 * de palín». Los lugares llegan ordenados por afinidad y con el motivo a la
 * vista, los que no aportan quedan plegados, y cuando no aporta ninguno se dice
 * en vez de ofrecer cualquier cosa.
 */

import { useMemo, useState } from "react";
import type { CurriculumObjective, POIFeature } from "../../../types";
import { ordenarPorAfinidad, type Banda } from "../lib/afinidad";
import { enPalabras } from "../lib/etiquetas";

const ESTILO: Record<Banda, { borde: string; etiqueta: string; texto: string }> = {
  sirve: {
    borde: "border-emerald-300 bg-emerald-50/40",
    etiqueta: "bg-emerald-600 text-white",
    texto: "Sirve",
  },
  quizas: {
    borde: "border-slate-200",
    etiqueta: "bg-slate-200 text-slate-700",
    texto: "Puede servir",
  },
  no_aporta: {
    borde: "border-slate-200",
    etiqueta: "bg-slate-100 text-slate-500",
    texto: "Sin relación",
  },
};

type Props = {
  objetivo: CurriculumObjective | undefined;
  lugares: POIFeature[];
  valor: string;
  onElegir: (id: string) => void;
};

export default function SelectorLugar({ objetivo, lugares, valor, onElegir }: Props) {
  const [comuna, setComuna] = useState("");
  const [verTodos, setVerTodos] = useState(false);

  const comunas = useMemo(
    () => [...new Set(lugares.map((p) => String(p.properties.commune)))].sort(),
    [lugares]
  );

  const ordenados = useMemo(() => {
    const base = comuna
      ? lugares.filter((p) => String(p.properties.commune) === comuna)
      : lugares;
    return ordenarPorAfinidad(objetivo, base);
  }, [objetivo, lugares, comuna]);

  const utiles = ordenados.filter((r) => r.afinidad.banda !== "no_aporta");
  const resto = ordenados.filter((r) => r.afinidad.banda === "no_aporta");
  const elegido = ordenados.find((r) => String(r.lugar.properties.id) === valor);

  // Ningún lugar aporta. Decirlo es más honesto —y más útil— que ofrecer el
  // catálogo entero: hay objetivos que se enseñan mejor en el aula.
  const sinAnclaje = objetivo && utiles.length === 0;

  return (
    <div>
      <div className="flex flex-wrap gap-1.5">
        <button
          type="button"
          onClick={() => setComuna("")}
          className={[
            "rounded-full border px-3 py-1 text-xs font-semibold transition",
            comuna === ""
              ? "border-slate-900 bg-slate-900 text-white"
              : "border-slate-300 text-slate-600 hover:bg-slate-50",
          ].join(" ")}
        >
          Todas
        </button>
        {comunas.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setComuna(comuna === c ? "" : c)}
            className={[
              "rounded-full border px-3 py-1 text-xs font-semibold transition",
              comuna === c
                ? "border-slate-900 bg-slate-900 text-white"
                : "border-slate-300 text-slate-600 hover:bg-slate-50",
            ].join(" ")}
          >
            {c}
          </button>
        ))}
      </div>

      {sinAnclaje && (
        <div className="mt-3 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3.5 text-sm text-amber-900">
          <p className="font-semibold">Este objetivo no se ancla en un lugar</p>
          <p className="mt-1.5 leading-relaxed">
            Ninguno de los {ordenados.length} lugares
            {comuna ? ` de ${comuna}` : ""} aporta materia a este contenido. Se
            enseña mejor en el aula: llevar al curso a terreno le sumaría una
            salida que organizar, sin sumarle nada que aprender.
          </p>
          <p className="mt-2 text-xs opacity-80">
            Puedes elegir otro objetivo, o mirar otra comuna.
          </p>
        </div>
      )}

      <ul className="mt-3 space-y-2">
        {utiles.map(({ lugar, afinidad }) => {
          const id = String(lugar.properties.id);
          const pr = lugar.properties as unknown as Record<string, unknown>;
          const estilo = ESTILO[afinidad.banda];
          const activo = id === valor;

          return (
            <li key={id}>
              <button
                type="button"
                onClick={() => onElegir(id)}
                aria-pressed={activo}
                className={[
                  "w-full rounded-xl border px-4 py-3 text-left transition",
                  activo ? "border-slate-900 ring-1 ring-slate-900" : estilo.borde,
                  "hover:border-slate-400",
                ].join(" ")}
              >
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                  <span className="text-sm font-semibold text-slate-900">
                    {String(lugar.properties.name)}
                  </span>
                  <span className="text-xs text-slate-500">
                    {String(lugar.properties.commune)}
                  </span>
                  <span
                    className={`ml-auto rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${estilo.etiqueta}`}
                  >
                    {estilo.texto}
                  </span>
                </div>
                {afinidad.motivos.length > 0 && (
                  <p className="mt-1 text-xs text-slate-600">
                    Coincide en {afinidad.motivos.slice(0, 3).join(" · ")}
                  </p>
                )}
                {typeof pr.ecosystem === "string" && pr.ecosystem && (
                  <p className="mt-0.5 text-xs text-slate-400">
                    {enPalabras(pr.ecosystem)}
                  </p>
                )}
              </button>
            </li>
          );
        })}
      </ul>

      {resto.length > 0 && (
        <div className="mt-3">
          <button
            type="button"
            onClick={() => setVerTodos(!verTodos)}
            className="text-xs font-semibold text-slate-500 underline underline-offset-2 hover:text-slate-800"
          >
            {verTodos
              ? "Ocultar los que no se relacionan"
              : resto.length === 1
                ? "Ver el lugar que no se relaciona con este objetivo"
                : `Ver los ${resto.length} lugares que no se relacionan con este objetivo`}
          </button>

          {/* Se pueden elegir igualmente: la última palabra es del docente, que
              conoce su curso y su territorio mejor que este cálculo. */}
          {verTodos && (
            <ul className="mt-2 space-y-1">
              {resto.map(({ lugar }) => {
                const id = String(lugar.properties.id);
                return (
                  <li key={id}>
                    <button
                      type="button"
                      onClick={() => onElegir(id)}
                      className={[
                        "w-full rounded-lg px-3 py-1.5 text-left text-sm transition hover:bg-slate-50",
                        id === valor ? "bg-slate-100 font-semibold" : "text-slate-500",
                      ].join(" ")}
                    >
                      {String(lugar.properties.name)}
                      <span className="ml-2 text-xs text-slate-400">
                        {String(lugar.properties.commune)}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}

      {elegido && elegido.afinidad.banda === "no_aporta" && (
        <p className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-xs text-amber-900">
          Elegiste un lugar que no se relaciona con el objetivo. La secuencia se
          va a generar igual, pero el lugar será decorado: revísala con cuidado
          antes de llevarla al aula.
        </p>
      )}
    </div>
  );
}
