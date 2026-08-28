/**
 * Las rutas: elegir entre cuatro y empezar.
 *
 * Es la pantalla opuesta a la de generar. Ahí el docente elige objetivos,
 * elige lugar, espera, y a veces recibe relleno. Aquí elige una de cuatro y ya
 * tiene la clase delante. Sin sesión, sin señal, sin esperar.
 *
 * Las cuatro tarjetas dicen desde fuera lo único que decide la elección: qué
 * cursos de su sala quedan cubiertos y qué lugar hace falta. Un profesor
 * multigrado no elige por tema, elige por a quién puede atender el martes.
 */

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { RUTAS, cursoCorto, type Ruta } from "../rutas/catalogo";
import VistaSecuencia from "../components/VistaSecuencia";

function Tarjeta({
  ruta,
  onAbrir,
  orden,
}: {
  ruta: Ruta;
  onAbrir: () => void;
  /** Posición en la rejilla, para que entren de una en una y no de golpe. */
  orden: number;
}) {
  const { t } = useTranslation();
  const cursos = ruta.cubre.map((c) => cursoCorto(c.nivel));
  const totalOA = ruta.cubre.reduce((n, c) => n + c.codigos.length, 0);

  return (
    <li className={`animar-asoma animar-asoma-${Math.min(orden, 4)}`}>
      <button
        type="button"
        onClick={onAbrir}
        className="flex h-full w-full flex-col rounded-2xl border border-slate-200 bg-white p-5 text-left transition hover:-translate-y-0.5 hover:border-slate-400 hover:shadow-lg"
      >
        <div className="flex flex-wrap items-center gap-1.5">
          {cursos.map((c) => (
            <span
              key={c}
              className="rounded bg-slate-900 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-white"
            >
              {c}
            </span>
          ))}
          <span className="ml-auto font-mono text-[11px] text-slate-400">
            {t("rutas.weeks", { count: ruta.semanas })}
          </span>
        </div>

        <h2 className="mt-3 text-lg font-semibold tracking-tight text-slate-950">
          {ruta.titulo}
        </h2>
        <p className="mt-1.5 flex-1 text-sm text-slate-600">{ruta.gancho}</p>

        <p className="mt-3 border-t border-slate-100 pt-3 text-xs text-slate-500">
          {ruta.lugar}
        </p>
        <p className="mt-1.5 font-mono text-[11px] text-slate-400">
          {t("rutas.objectives", { count: totalOA })}
        </p>
      </button>
    </li>
  );
}

export default function RutasPage() {
  const { t } = useTranslation();
  const [abierta, setAbierta] = useState<Ruta | null>(null);

  if (abierta) {
    return (
      <div className="animar-avanza mx-auto max-w-6xl px-4 py-10">
        <button
          type="button"
          onClick={() => setAbierta(null)}
          className="rounded-full border border-slate-300 px-4 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 print:hidden"
        >
          {t("rutas.back")}
        </button>

        {/* Una ruta no la escribió un modelo, así que no lleva ni el sello ni
            la advertencia de revisarla: eso sería mentir al revés. */}
        <VistaSecuencia
          key={abierta.id}
          secuencia={abierta.secuencia}
          codigos={abierta.cubre.flatMap((c) => c.codigos)}
          porModelo={false}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <header>
        <p className="font-mono text-xs uppercase tracking-widest text-slate-500">
          {t("rutas.eyebrow")}
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
          {t("rutas.title")}
        </h1>
        <p className="mt-3 max-w-2xl text-slate-600">{t("rutas.lead")}</p>
      </header>

      <ul className="mt-8 grid gap-4 sm:grid-cols-2">
        {RUTAS.map((r, i) => (
          <Tarjeta key={r.id} ruta={r} orden={i + 1} onAbrir={() => setAbierta(r)} />
        ))}
      </ul>

      {/* Estas cuatro no las ha revisado todavía un docente de aula. Decirlo
          aquí cuesta una línea; descubrirlo delante de un curso, una clase. */}
      <p className="mt-8 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        {t("rutas.draftNotice")}
      </p>
    </div>
  );
}
