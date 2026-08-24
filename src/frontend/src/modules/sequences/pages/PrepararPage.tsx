/**
 * Preparar una unidad — pantalla del docente.
 *
 * La diferencia de fondo con la plataforma actual está en la puerta de
 * entrada: aquí el objetivo de aprendizaje manda y el lugar se elige para
 * servirlo. En el mapa se empezaba al revés, y esa inversión es la que
 * arrastra al resto del diseño.
 *
 * Hay dos puertas para llegar a ese par, porque los docentes llegan de dos
 * maneras: quien sabe qué le toca esta semana entra por el objetivo, y quien
 * ya sabe adónde puede llevar al curso entra por el lugar. Cambia el orden en
 * que se pregunta, no la regla: el emparejamiento se calcula y se muestra en
 * los dos sentidos, y sigue siendo el objetivo el que justifica la salida.
 *
 * La secuencia se muestra completa y editable mentalmente por el docente antes
 * de llevarla al aula: por eso los problemas de validación se enseñan en lugar
 * de ocultarse, y por eso la página se puede imprimir.
 */

import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  generarSecuencia,
  leerObjetivos,
  leerPuntos,
} from "../../../shared/lib/catalogos";
import type {
  CurriculumObjective,
  POIFeature,
  RespuestaSecuencia,
  Secuencia,
} from "../../../types";
import EtapaSecuencia from "../components/EtapaSecuencia";
import RielEtapas, { type ResumenEtapa } from "../components/RielEtapas";
import SelectorObjetivo, { nivelCorto } from "../components/SelectorObjetivo";
import SelectorLugar from "../components/SelectorLugar";
import { enPalabras, nombreLegible } from "../lib/etiquetas";
import {
  OBJETIVOS_DEMO,
  PUNTOS_DEMO,
  secuenciaDemo,
  esperar,
  modoDemo,
} from "../../../shared/lib/demo";

/** Distintivo que separa el dato real del texto generado por el modelo. */
function Procedencia({ tipo }: { tipo: "dato" | "generado" }) {
  const { t } = useTranslation();
  const esDato = tipo === "dato";
  return (
    <span
      className={[
        "ml-2 rounded border px-1.5 py-0.5 align-middle font-mono text-[10px] uppercase tracking-wider",
        esDato
          ? "border-slate-300 bg-slate-50 text-slate-600"
          : "border-amber-300 bg-amber-50 text-amber-800",
      ].join(" ")}
      title={
        esDato
          ? t("preparar.provenanceDataTitle")
          : t("preparar.provenanceGeneratedTitle")
      }
    >
      {esDato ? t("preparar.provenanceData") : t("preparar.provenanceGenerated")}
    </span>
  );
}

/**
 * Lo que le toca a cada curso cuando la sala es multigrado.
 *
 * Va dentro de la etapa correspondiente y no en una sección aparte: el docente
 * lee la clase en orden, y separar «lo de 5º» de «lo de 7º» en dos bloques
 * lejanos le obliga a reconstruir mentalmente lo que pasa a la misma hora.
 */
function PorNivel({
  bloques,
  campo,
}: {
  bloques: NonNullable<Secuencia["por_nivel"]>;
  campo: "practica_guiada" | "practica_autonoma";
}) {
  const { t } = useTranslation();
  const conTrabajo = bloques.filter((b) => (b[campo]?.ejercicios?.length ?? 0) > 0);
  if (conTrabajo.length === 0) return null;

  return (
    <div className="mt-4 space-y-3 border-t border-slate-200 pt-4">
      {conTrabajo.map((b) => (
        <div key={`${b.nivel}-${b.objetivo_codigo}`}>
          <p className="flex items-baseline gap-2 text-sm font-semibold text-slate-800">
            <span className="rounded bg-slate-900 px-1.5 py-0.5 font-mono text-[10px] text-white">
              {nivelCorto(b.nivel, t("preparar.gradeBadge"))}
            </span>
            {b.objetivo_descripcion ? (
              <span className="font-normal text-slate-500">{b.objetivo_descripcion}</span>
            ) : null}
          </p>
          <ol className="mt-1.5 list-decimal space-y-1.5 pl-5 text-sm">
            {/* Los dos tipos de ejercicio comparten enunciado; solo el guiado
                trae apoyo, y leerlo así evita duplicar este bloque. */}
            {((b[campo]?.ejercicios ?? []) as { enunciado: string; apoyo?: string }[]).map(
              (e, i) => (
                <li key={i}>
                  {e.enunciado}
                  {e.apoyo ? (
                    <span className="block text-slate-500">
                      {t("preparar.support")} {e.apoyo}
                    </span>
                  ) : null}
                </li>
              )
            )}
          </ol>
        </div>
      ))}
    </div>
  );
}

export default function PrepararPage() {
  const { t, i18n } = useTranslation();
  const [objetivos, setObjetivos] = useState<CurriculumObjective[]>([]);
  const [puntos, setPuntos] = useState<POIFeature[]>([]);
  const [cargandoCatalogos, setCargandoCatalogos] = useState(true);
  const [errorCatalogos, setErrorCatalogos] = useState<string | null>(null);

  const [objetivoCodes, setObjetivoCodes] = useState<string[]>([]);
  const [pointId, setPointId] = useState("");
  const [entrada, setEntrada] = useState<"objetivo" | "lugar">("objetivo");
  const [sesiones, setSesiones] = useState(4);
  const [notas, setNotas] = useState("");

  const [etapaActiva, setEtapaActiva] = useState(1);
  const [formAbierto, setFormAbierto] = useState(true);
  const [generando, setGenerando] = useState(false);
  const [resultado, setResultado] = useState<RespuestaSecuencia | null>(null);
  const [errorGeneracion, setErrorGeneracion] = useState<string | null>(null);

  useEffect(() => {
    let vigente = true;
    (async () => {
      try {
        if (modoDemo()) {
          if (!vigente) return;
          setObjetivos(OBJETIVOS_DEMO);
          setPuntos(PUNTOS_DEMO);
          return;
        }
        // Directo a Supabase: estas tablas tienen lectura pública y no
        // necesitan la API intermedia.
        const [oas, puntos] = await Promise.all([leerObjetivos(), leerPuntos()]);
        if (!vigente) return;
        setObjetivos(oas);
        setPuntos(puntos);
      } catch (err: unknown) {
        if (!vigente) return;
        // Sin VITE_API_URL las rutas quedan relativas y esto falla en silencio
        // en producción. Se nombra el motivo probable en vez de dejar la
        // pantalla vacía.
        setErrorCatalogos(
          err instanceof Error ? err.message : t("preparar.catalogErrorTitle")
        );
      } finally {
        if (vigente) setCargandoCatalogos(false);
      }
    })();
    return () => {
      vigente = false;
    };
  }, []);

  const objetivosElegidos = useMemo(
    () =>
      objetivoCodes
        .map((c) => objetivos.find((o) => o.code === c))
        .filter((o): o is NonNullable<typeof o> => Boolean(o)),
    [objetivos, objetivoCodes]
  );

  const lugarElegido = useMemo(
    () => puntos.find((p) => String(p.properties.id) === pointId),
    [puntos, pointId]
  );

  const listo = objetivoCodes.length > 0 && Boolean(pointId) && !generando;

  async function handleGenerar() {
    if (!listo) return;
    setGenerando(true);
    setErrorGeneracion(null);
    setResultado(null);
    try {
      if (modoDemo()) {
        await esperar(900); // la generación real tampoco es instantánea
        setResultado(secuenciaDemo(i18n.resolvedLanguage ?? i18n.language));
        setFormAbierto(false);
        setEtapaActiva(1);
        return;
      }
      const r = await generarSecuencia({
        objectiveCodes: objetivoCodes,
        pointId,
        sesiones,
        notasDocente: notas,
        // La clase se escribe en el idioma en el que se está mirando.
        idioma: i18n.resolvedLanguage ?? i18n.language,
      });
      setResultado(r);
      setFormAbierto(false);
      setEtapaActiva(1);
    } catch (err: unknown) {
      setErrorGeneracion(
        err instanceof Error ? err.message : t("preparar.generateError")
      );
    } finally {
      setGenerando(false);
    }
  }

  const s: Secuencia | undefined = resultado?.secuencia;

  // El riel muestra cuántas piezas trae cada etapa, para que el docente juzgue
  // el conjunto antes de leerlo entero.
  const etapas: ResumenEtapa[] = [
    { numero: 1, momento: t("preparar.stages.class1"), titulo: t("preparar.stages.explain"),
      unidad: "points", piezas: s?.instruccion_explicita?.notas_para_el_docente?.length },
    { numero: 2, momento: t("preparar.stages.class1"), titulo: t("preparar.stages.example"),
      unidad: "steps", piezas: s?.ejemplo_resuelto?.pasos?.length },
    { numero: 3, momento: t("preparar.stages.class2"), titulo: t("preparar.stages.guided"),
      unidad: "exercises", piezas: s?.practica_guiada?.ejercicios?.length },
    { numero: 4, momento: t("preparar.stages.class2"), titulo: t("preparar.stages.independent"),
      unidad: "exercises", piezas: s?.practica_autonoma?.ejercicios?.length },
    { numero: 5, momento: t("preparar.stages.class3"), titulo: t("preparar.stages.field"),
      unidad: "measurements", piezas: s?.salida_terreno?.protocolo?.length },
    { numero: 6, momento: t("preparar.stages.reviewWeeks"), titulo: t("preparar.stages.review"),
      unidad: "questions", piezas: s?.recuperacion_espaciada?.length },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <header className="print:hidden">
        <p className="font-mono text-xs uppercase tracking-widest text-slate-500">
          {t("preparar.eyebrow")}
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
          {entrada === "objetivo"
            ? t("preparar.titleByObjective")
            : t("preparar.titleByPlace")}
        </h1>
        <p className="mt-3 max-w-2xl text-slate-600">
          {entrada === "objetivo"
            ? t("preparar.leadByObjective")
            : t("preparar.leadByPlace")}{" "}
          {t("preparar.leadCommon")}
        </p>
      </header>

      {modoDemo() && (
        <p className="mt-6 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <strong>{t("preparar.demoTitle")}</strong> {t("preparar.demoBody")}
        </p>
      )}

      {/* Barra compacta: sustituye al formulario una vez hay resultado */}
      {resultado && !formAbierto && (
        <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm print:hidden">
          <span className="font-mono text-xs text-slate-500">{objetivoCodes.join(", ")}</span>
          <span className="text-slate-300">·</span>
          <span className="text-slate-700">
            {puntos.find((p) => String(p.properties.id) === pointId)?.properties.name}
          </span>
          <span className="text-slate-300">·</span>
          <span className="text-slate-600">
            {t("preparar.sessionsCount", { count: sesiones })}
          </span>
          <button
            type="button"
            onClick={() => setFormAbierto(true)}
            className="ml-auto rounded-full border border-slate-300 px-4 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            {t("preparar.change")}
          </button>
        </div>
      )}

      {/* ── Formulario ── */}
      <div
        className={[
          "mt-8 space-y-5 rounded-2xl border border-slate-200 bg-white p-6 print:hidden",
          resultado && !formAbierto ? "hidden" : "",
        ].join(" ")}
      >
        {errorCatalogos && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          >
            <p className="font-semibold">{t("preparar.catalogErrorTitle")}</p>
            <p className="mt-1">{t("preparar.catalogErrorBody")}</p>
            {/* Salida inmediata: quien solo quiere ver la pantalla no debería
                quedarse ante un muro sin siguiente paso. */}
            <p className="mt-2.5">
              <a href="?demo=1" className="font-semibold underline underline-offset-2">
                {t("preparar.catalogErrorDemoLink")}
              </a>
            </p>
            {/* El detalle técnico queda, pero en segundo plano: lo necesita quien
                mantiene el sitio, no quien va a dar la clase. */}
            <p className="mt-2.5 text-xs opacity-70">
              {t("preparar.detail", { detail: errorCatalogos })}
            </p>
          </div>
        )}

        {/* Dos puertas al mismo par. Cambiar de puerta descarta lo elegido:
            arrastrarlo dejaría en pantalla una elección hecha bajo otra
            pregunta. */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-slate-500">{t("preparar.startFrom")}</span>
          {(
            [
              ["objetivo", "preparar.startFromObjective"],
              ["lugar", "preparar.startFromPlace"],
            ] as const
          ).map(([clave, etiqueta]) => (
            <button
              key={clave}
              type="button"
              onClick={() => {
                if (entrada === clave) return;
                setEntrada(clave);
                setObjetivoCodes([]);
                setPointId("");
              }}
              aria-pressed={entrada === clave}
              className={[
                "rounded-full border px-3.5 py-1.5 text-xs font-semibold transition",
                entrada === clave
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-300 text-slate-600 hover:bg-slate-50",
              ].join(" ")}
            >
              {t(etiqueta)}
            </button>
          ))}
        </div>

        <div>
          <p className="mb-2 flex items-baseline gap-2 text-sm font-medium text-slate-700">
            <span className="rounded-full bg-slate-900 px-1.5 text-[10px] font-bold text-white">
              1
            </span>
            {entrada === "objetivo"
              ? t("preparar.step1ByObjective")
              : t("preparar.step1ByPlace")}
          </p>
          {entrada === "objetivo" ? (
            <SelectorObjetivo
              objetivos={objetivos}
              valores={objetivoCodes}
              onCambiar={(codes) => {
                setObjetivoCodes(codes);
                // El lugar se eligió para servir a otros objetivos: si cambian,
                // la elección anterior deja de tener fundamento.
                setPointId("");
              }}
              cargando={cargandoCatalogos}
            />
          ) : (
            // Sin objetivo aún, el selector muestra los lugares sin juzgarlos:
            // no hay contra qué.
            <SelectorLugar
              objetivos={[]}
              lugares={puntos}
              valor={pointId}
              onElegir={(id) => {
                setPointId(id);
                setObjetivoCodes([]);
              }}
            />
          )}
        </div>

        {/* El segundo paso siempre se juzga contra el primero: el objetivo
            filtra lugares, y el lugar ordena objetivos por lo que sostiene. */}
        {entrada === "objetivo" && objetivoCodes.length > 0 && (
          <div>
            <p className="mb-2 flex items-baseline gap-2 text-sm font-medium text-slate-700">
              <span className="rounded-full bg-slate-900 px-1.5 text-[10px] font-bold text-white">
                2
              </span>
              {t("preparar.step2Place")}
            </p>
            <SelectorLugar
              objetivos={objetivosElegidos}
              lugares={puntos}
              valor={pointId}
              onElegir={setPointId}
            />
          </div>
        )}

        {entrada === "lugar" && pointId && (
          <div>
            <p className="mb-2 flex items-baseline gap-2 text-sm font-medium text-slate-700">
              <span className="rounded-full bg-slate-900 px-1.5 text-[10px] font-bold text-white">
                2
              </span>
              {t("preparar.step2Objective")}
            </p>
            <SelectorObjetivo
              objetivos={objetivos}
              valores={objetivoCodes}
              onCambiar={setObjetivoCodes}
              cargando={cargandoCatalogos}
              lugar={lugarElegido}
            />
          </div>
        )}

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="sesiones"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              {t("preparar.sessionsLabel")}
            </label>
            <input
              id="sesiones"
              type="number"
              min={2}
              max={12}
              value={sesiones}
              onChange={(e) => setSesiones(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400"
            />
          </div>
          <div>
            <label
              htmlFor="notas"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              {t("preparar.notesLabel")}
            </label>
            <input
              id="notas"
              type="text"
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              placeholder={t("preparar.notesPlaceholder")}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={handleGenerar}
          disabled={!listo}
          className="w-full rounded-full bg-[#111217] px-6 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg disabled:translate-y-0 disabled:opacity-60 disabled:shadow-none"
        >
          {generando ? t("preparar.generating") : t("preparar.generate")}
        </button>

        {errorGeneracion && (
          <p
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          >
            {errorGeneracion}
          </p>
        )}
      </div>

      {/* ── Secuencia ── */}
      {s && (
        <article className="mt-8">
          <header className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
              {s.titulo}
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              {objetivoCodes.join(', ') || s.objetivo_codigo}
              <Procedencia tipo="dato" /> · {s.objetivo_descripcion}
            </p>
            {s.sintesis_docente && (
              <p className="mt-3 text-slate-700">
                {s.sintesis_docente}
                <Procedencia tipo="generado" />
              </p>
            )}

            {s.procedencia && (
              <p className="mt-4 font-mono text-[11px] text-slate-500">
                {t("preparar.provenanceLine", {
                  place: s.procedencia.de_datos.punto,
                  commune: s.procedencia.de_datos.comuna,
                  ecosystem: enPalabras(s.procedencia.de_datos.ecosistema ?? ""),
                  model: s.procedencia.modelo,
                })}
              </p>
            )}

            <div className="mt-5 flex flex-wrap gap-3 print:hidden">
              <button
                type="button"
                onClick={() => window.print()}
                className="rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50"
              >
                {t("preparar.print")}
              </button>
            </div>
          </header>

          {/* Los problemas se muestran: el docente edita antes de usar. */}
          {resultado && resultado.problemas.length > 0 && (
            <div
              role="alert"
              className="rounded-2xl border border-amber-300 bg-amber-50 p-5 text-sm text-amber-900"
            >
              <p className="font-semibold">{t("preparar.issuesTitle")}</p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                {resultado.problemas.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
          )}

          {s.requiere_consulta && (
            <div className="rounded-2xl border border-amber-300 bg-amber-50 p-5 text-sm text-amber-900">
              {t("preparar.consultationBody")}{" "}
              <strong>{t("preparar.consultationStrong")}</strong>{" "}
              {t("preparar.consultationTail")}
            </div>
          )}

          <div className="mt-6 grid gap-8 lg:grid-cols-[15rem_minmax(0,1fr)]">
            <RielEtapas etapas={etapas} activa={etapaActiva} onCambiar={setEtapaActiva} />

            <div className="min-w-0 space-y-4 print:space-y-0">
          <EtapaSecuencia
            activa={etapaActiva === 1}
            titulo={t("preparar.stages.explain")}
            subtitulo={
              s.instruccion_explicita?.duracion_min
                ? t("preparar.minutes", {
                    count: s.instruccion_explicita.duracion_min,
                  })
                : undefined
            }
            actor="docente"
          >
            <ul className="list-disc space-y-1 pl-5">
              {(s.instruccion_explicita?.notas_para_el_docente ?? []).map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
            {(s.instruccion_explicita?.errores_frecuentes ?? []).length > 0 && (
              <p className="text-slate-600">
                <strong>{t("preparar.commonMistakes")}</strong>{" "}
                {s.instruccion_explicita?.errores_frecuentes?.join("; ")}
              </p>
            )}
          </EtapaSecuencia>

          <EtapaSecuencia
            activa={etapaActiva === 2}
            titulo={t("preparar.stages.example")}
            subtitulo={s.ejemplo_resuelto?.situacion}
            actor="plataforma"
            destacada
          >
            <ol className="space-y-3">
              {(s.ejemplo_resuelto?.pasos ?? []).map((p) => (
                <li key={p.paso} className="rounded-xl bg-slate-50 p-3">
                  <p className="font-medium text-slate-900">
                    {p.paso}. {p.accion}
                  </p>
                  <p className="mt-1 text-slate-600">
                    <em>{t("preparar.why")}</em> {p.razonamiento}
                  </p>
                  <p className="mt-1 text-slate-800">
                    <em>{t("preparar.result")}</em> {p.resultado}
                  </p>
                </li>
              ))}
            </ol>
            {s.ejemplo_resuelto?.respuesta && (
              <p className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-emerald-900">
                {s.ejemplo_resuelto.respuesta}
              </p>
            )}
          </EtapaSecuencia>

          <EtapaSecuencia
            activa={etapaActiva === 3}
            titulo={t("preparar.stages.guided")}
            subtitulo={s.practica_guiada?.instrucciones_docente}
            actor="docente"
          >
            <ol className="list-decimal space-y-2 pl-5">
              {(s.practica_guiada?.ejercicios ?? []).map((e, i) => (
                <li key={i}>
                  {e.enunciado}
                  {e.apoyo && (
                    <span className="block text-slate-500">
                      {t("preparar.support")} {e.apoyo}
                    </span>
                  )}
                </li>
              ))}
            </ol>
            {s.por_nivel && <PorNivel bloques={s.por_nivel} campo="practica_guiada" />}
          </EtapaSecuencia>

          <EtapaSecuencia
            activa={etapaActiva === 4}
            titulo={t("preparar.stages.independent")}
            actor="estudiantes"
          >
            <ol className="list-decimal space-y-2 pl-5">
              {(s.practica_autonoma?.ejercicios ?? []).map((e, i) => (
                <li key={i}>{e.enunciado}</li>
              ))}
            </ol>
            {s.por_nivel && <PorNivel bloques={s.por_nivel} campo="practica_autonoma" />}
          </EtapaSecuencia>

          <EtapaSecuencia
            activa={etapaActiva === 5}
            titulo={t("preparar.stages.field")}
            subtitulo={t("preparar.stages.fieldSubtitle")}
            actor="estudiantes"
            destacada
          >
            {(s.salida_terreno?.preparacion ?? []).length > 0 && (
              <p>
                <strong>{t("preparar.bring")}</strong>{" "}
                {s.salida_terreno?.preparacion?.join(", ")}
              </p>
            )}

            {/* Con varios cursos en una salida, lo que decide si es manejable
                no es el protocolo sino quién hace qué. Va antes de la tabla:
                es lo primero que el docente necesita resolver. */}
            {(s.por_nivel ?? []).some((b) => b.rol_en_terreno) && (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {t("preparar.whoDoesWhat")}
                </p>
                <ul className="mt-2 space-y-1.5 text-sm">
                  {(s.por_nivel ?? [])
                    .filter((b) => b.rol_en_terreno)
                    .map((b) => (
                      <li key={`rol-${b.nivel}-${b.objetivo_codigo}`} className="flex gap-2">
                        <span className="mt-0.5 h-fit shrink-0 rounded bg-slate-900 px-1.5 py-0.5 font-mono text-[10px] text-white">
                          {nivelCorto(b.nivel, t("preparar.gradeBadge"))}
                        </span>
                        <span className="text-slate-800">{b.rol_en_terreno}</span>
                      </li>
                    ))}
                </ul>
              </div>
            )}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[420px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 font-mono text-[11px] uppercase tracking-wider text-slate-500">
                    <th className="py-2 pr-3">{t("preparar.colWhat")}</th>
                    <th className="py-2 pr-3">{t("preparar.colHow")}</th>
                    <th className="py-2">{t("preparar.colUnit")}</th>
                  </tr>
                </thead>
                <tbody>
                  {(s.salida_terreno?.protocolo ?? []).map((c) => (
                    <tr key={c.campo} className="border-b border-slate-100 align-top">
                      {/* El nombre técnico queda en el title por si hay que
                          cruzar estos datos con los que quedan guardados. */}
                      <td className="py-2 pr-3 font-medium text-slate-900" title={c.campo}>
                        {/* El nombre derivado sale del identificador, que es
                            español siempre. Si el generador mandó etiqueta, se
                            prefiere: es la que está en el idioma del docente. */}
                        {c.etiqueta?.trim() || nombreLegible(c.campo, c.unidad)}
                      </td>
                      <td className="py-2 pr-3">{c.instruccion}</td>
                      <td className="py-2 font-mono text-xs">{c.unidad ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {(s.salida_terreno?.seguridad ?? []).length > 0 && (
              <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-amber-900">
                <strong>{t("preparar.safety")}</strong>{" "}
                {s.salida_terreno?.seguridad?.join(" · ")}
              </p>
            )}
          </EtapaSecuencia>

          <EtapaSecuencia
            activa={etapaActiva === 6}
            titulo={t("preparar.stages.review")}
            subtitulo={t("preparar.stages.reviewSubtitle")}
            actor="estudiantes"
          >
            <ul className="space-y-2">
              {(s.recuperacion_espaciada ?? []).map((m) => (
                <li key={m.semanas_despues} className="rounded-xl bg-slate-50 p-3">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-slate-500">
                    {t("preparar.weeksLater", { count: m.semanas_despues })}
                  </span>
                  <p className="mt-1 text-slate-800">{m.pregunta}</p>
                </li>
              ))}
            </ul>
          </EtapaSecuencia>

              {/* Avance secuencial, para quien prefiere recorrerla en orden */}
              <div className="flex items-center justify-between gap-3 print:hidden">
                <button
                  type="button"
                  onClick={() => setEtapaActiva((n) => Math.max(1, n - 1))}
                  disabled={etapaActiva === 1}
                  className="rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-40"
                >
                  {t("preparar.prev")}
                </button>
                <span className="font-mono text-xs text-slate-400">
                  {t("preparar.stepOf", {
                    current: etapaActiva,
                    total: etapas.length,
                  })}
                </span>
                <button
                  type="button"
                  onClick={() => setEtapaActiva((n) => Math.min(etapas.length, n + 1))}
                  disabled={etapaActiva === etapas.length}
                  className="rounded-full bg-[#111217] px-5 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-40"
                >
                  {t("preparar.next")}
                </button>
              </div>
            </div>
          </div>

          <p className="pt-6 text-sm text-slate-500">
            {t("preparar.footerBefore")} <Procedencia tipo="generado" />{" "}
            {t("preparar.footerAfter")}
          </p>
        </article>
      )}
    </div>
  );
}
