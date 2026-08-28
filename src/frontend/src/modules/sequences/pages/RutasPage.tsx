/**
 * Las rutas: elegir entre cuatro y empezar.
 *
 * Es la pantalla opuesta a la de generar. Ahí el docente elige objetivos,
 * elige lugar, espera, y a veces recibe relleno. Aquí elige una de cuatro y ya
 * tiene la clase delante. Sin sesión, sin señal, sin esperar.
 *
 * Lo que se enseña primero de cada ruta no es su contenido: es la pregunta que
 * la sostiene y a quién le entregan el resultado. Un proyecto sin destinatario
 * es una actividad larga, y el lugar vuelve a ser decorado. Con destinatario,
 * el curso tiene una razón para que los números estén bien que no es la nota.
 */

import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { RUTAS, cursoCorto, type Postura, type Ruta } from "../rutas/catalogo";
import Recorrido from "../rutas/Recorrido";
import Documentos from "../rutas/Documentos";
import Personalizar from "../rutas/Personalizar";
import {
  guardarEscuela,
  guardarRuta,
  leerEscuela,
  leerRuta,
  type AjustesEscuela,
  type AjustesRuta,
} from "../rutas/ajustes";
import VistaSecuencia from "../components/VistaSecuencia";

/** Las dos edades que conviven en la sala, dichas sin jerga de etapas. */
function Postura({ postura }: { postura: Postura }) {
  const { t } = useTranslation();
  const explora = postura === "explorar";
  return (
    <span
      className={[
        "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
        explora ? "bg-sky-100 text-sky-800" : "bg-emerald-100 text-emerald-900",
      ].join(" ")}
    >
      {t(explora ? "rutas.explore" : "rutas.act")}
    </span>
  );
}

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
        className="group flex h-full w-full flex-col rounded-2xl border border-slate-200 bg-white p-5 text-left transition duration-200 hover:-translate-y-1 hover:border-slate-400 hover:shadow-xl"
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

        {/* La pregunta va antes que el título: es lo que decide si a este
            curso le interesa, y lo que el docente repetirá tres semanas. */}
        <p className="mt-3 text-[15px] font-semibold leading-snug text-slate-950">
          {ruta.preguntaGuia}
        </p>
        <p className="mt-2 flex-1 text-sm text-slate-600">{ruta.gancho}</p>

        <p className="mt-3 border-t border-slate-100 pt-3 text-xs text-slate-500">
          <span className="font-semibold text-slate-700">{t("rutas.deliverTo")}</span>{" "}
          {ruta.producto.paraQuien}
        </p>
        <p className="mt-1.5 text-xs text-slate-500">{ruta.lugar}</p>
        <p className="mt-1.5 flex items-center gap-2 font-mono text-[11px] text-slate-400">
          {t("rutas.objectives", { count: totalOA })}
          <span className="ml-auto font-sans font-semibold text-slate-500 transition-transform duration-200 group-hover:translate-x-1">
            →
          </span>
        </p>
      </button>
    </li>
  );
}

function Detalle({ ruta, onVolver }: { ruta: Ruta; onVolver: () => void }) {
  const { t } = useTranslation();
  const [semana, setSemana] = useState(1);
  const [escuela, setEscuela] = useState<AjustesEscuela>(() => leerEscuela());
  const [ajustes, setAjustes] = useState<AjustesRuta>(() =>
    leerRuta(ruta.id, ruta.producto.paraQuien)
  );

  useEffect(() => guardarEscuela(escuela), [escuela]);
  useEffect(() => guardarRuta(ruta.id, ajustes), [ruta.id, ajustes]);

  /**
   * Los cursos que esta escuela tiene de verdad, dentro de los que la ruta
   * atiende. Sin ajustar nada se muestran todos: una ruta recién abierta
   * tiene que verse entera, no vacía.
   */
  const cursos = useMemo(() => {
    const dela = ruta.cubre.map((c) => c.nivel);
    return escuela.cursos.length
      ? dela.filter((n) => escuela.cursos.includes(n))
      : dela;
  }, [ruta, escuela.cursos]);

  const cubre = ruta.cubre.filter((c) => cursos.includes(c.nivel));

  // La secuencia se recorta a esos cursos. Imprimir la práctica de un curso
  // que no existe en la sala es lo que hace que el docente deje de fiarse.
  const secuencia = useMemo(
    () => ({
      ...ruta.secuencia,
      por_nivel: (ruta.secuencia.por_nivel ?? []).filter((b) =>
        cursos.includes(b.nivel)
      ),
    }),
    [ruta.secuencia, cursos]
  );

  return (
    <div className="animar-avanza mx-auto max-w-6xl px-4 py-10">
      <button
        type="button"
        onClick={onVolver}
        className="rounded-full border border-slate-300 px-4 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 print:hidden"
      >
        {t("rutas.back")}
      </button>

      <header className="mt-5 rounded-2xl border border-slate-200 bg-white p-6">
        <p className="font-mono text-xs uppercase tracking-widest text-slate-500">
          {t("rutas.drivingQuestion")}
        </p>
        <h1 className="mt-2 text-2xl font-semibold leading-snug tracking-tight text-slate-950">
          {ruta.preguntaGuia}
        </h1>

        <div className="mt-5 grid gap-4 border-t border-slate-100 pt-5 sm:grid-cols-2">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-widest text-slate-500">
              {t("rutas.whatTheyDeliver")}
            </p>
            <p className="mt-1.5 text-sm text-slate-800">{ruta.producto.que}</p>
          </div>
          <div>
            <p className="font-mono text-[11px] uppercase tracking-widest text-slate-500">
              {t("rutas.toWhom")}
            </p>
            <p className="mt-1.5 text-sm text-slate-800">{ruta.producto.paraQuien}</p>
          </div>
        </div>

        <Recorrido fases={ruta.fases} activa={semana} onElegir={setSemana} />
      </header>

      {/* Quién hace qué, por edad. En una sala de 5º a 8º conviven dos maneras
          distintas de relacionarse con el lugar, y eso deja de ser un estorbo
          cuando los pequeños levantan lo que los grandes necesitan. */}
      <section className="mt-4 rounded-2xl border border-slate-200 bg-white p-6">
        <p className="font-mono text-[11px] uppercase tracking-widest text-slate-500">
          {t("rutas.eachGrade")}
        </p>
        <ul className="mt-3 space-y-2.5">
          {cubre.map((c, i) => (
            <li
              key={c.nivel}
              className={`animar-asoma animar-asoma-${Math.min(i + 1, 4)} flex flex-wrap items-baseline gap-x-2.5 gap-y-1`}
            >
              <span className="rounded bg-slate-900 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-white">
                {cursoCorto(c.nivel)}
              </span>
              <Postura postura={c.postura} />
              <span className="min-w-0 flex-1 text-sm text-slate-800">{c.papel}</span>
              <span className="font-mono text-[10px] text-slate-400">
                {c.codigos.join(" · ")}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-3.5 border-t border-slate-100 pt-3 text-xs text-slate-500">
          {t("rutas.postureNote")}
        </p>
      </section>

      {/* El territorio nombrado en las dos lenguas. */}
      {ruta.mapuzugun?.length ? (
        <section className="mt-4 rounded-2xl border border-slate-200 bg-white p-6">
          <p className="font-mono text-[11px] uppercase tracking-widest text-slate-500">
            {t("rutas.inMapuzugun")}
          </p>
          <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
            {ruta.mapuzugun.map((m, i) => (
              <li
                key={m.termino}
                className={`animar-asoma animar-asoma-${Math.min(i + 1, 4)}`}
              >
                <span className="text-sm font-semibold text-slate-950">{m.termino}</span>
                <span className="text-sm text-slate-600"> · {m.castellano}</span>
                {m.nota ? (
                  <span className="block text-xs text-slate-500">{m.nota}</span>
                ) : null}
              </li>
            ))}
          </ul>

          {ruta.kimun ? (
            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-800">
                <span className="font-semibold">{t("rutas.askTheCommunity")}</span>{" "}
                {ruta.kimun.pregunta}
              </p>
              <p className="mt-1.5 text-xs text-slate-600">
                {t("rutas.askWho")} {ruta.kimun.aQuien}
              </p>
            </div>
          ) : null}

          <p className="mt-3.5 border-t border-slate-100 pt-3 text-xs text-amber-800">
            {t("rutas.mapuzugunNotice")}
          </p>
        </section>
      ) : null}

      <Personalizar
        ruta={ruta}
        escuela={escuela}
        onEscuela={setEscuela}
        ajustes={ajustes}
        onAjustes={setAjustes}
      />

      <Documentos ruta={ruta} secuencia={secuencia} escuela={escuela} ajustes={ajustes} />

      <VistaSecuencia
        key={ruta.id}
        secuencia={secuencia}
        codigos={cubre.flatMap((c) => c.codigos)}
        porModelo={false}
      />
    </div>
  );
}

export default function RutasPage() {
  const { t } = useTranslation();
  const [abierta, setAbierta] = useState<Ruta | null>(null);

  if (abierta) return <Detalle ruta={abierta} onVolver={() => setAbierta(null)} />;

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
