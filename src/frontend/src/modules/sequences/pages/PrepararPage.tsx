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
import SelectorObjetivo from "../components/SelectorObjetivo";
import SelectorLugar from "../components/SelectorLugar";
import VistaSecuencia from "../components/VistaSecuencia";
import {
  OBJETIVOS_DEMO,
  PUNTOS_DEMO,
  secuenciaDemo,
  esperar,
  modoDemo,
} from "../../../shared/lib/demo";

/**
 * La espera de la generación.
 *
 * Escribir la clase tarda cerca de medio minuto. Hasta ahora, en ese medio
 * minuto la pantalla no hacía absolutamente nada: el botón cambiaba de texto y
 * ya. Para alguien que no da por hecho que un sitio web esté «pensando», una
 * pantalla quieta significa que se colgó, y lo que se hace entonces es cerrar.
 *
 * La barra no finge saber cuánto falta —no hay manera de saberlo, es una sola
 * llamada— así que recorre y vuelve, que es lo honesto. Lo que sí se puede
 * decir es cuánto suele tardar, y avisar cuando se está pasando de eso.
 */
function Esperando() {
  const { t } = useTranslation();
  const [segundos, setSegundos] = useState(0);

  useEffect(() => {
    const reloj = setInterval(() => setSegundos((n) => n + 1), 1000);
    return () => clearInterval(reloj);
  }, []);

  return (
    <div
      role="status"
      aria-live="polite"
      className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5"
    >
      <div className="h-1 w-full overflow-hidden rounded-full bg-slate-200">
        <div className="animar-esperando h-full w-1/4 rounded-full bg-slate-900" />
      </div>
      <p className="mt-2.5 text-sm text-slate-700">
        {segundos < 25 ? t("preparar.waitNormal") : t("preparar.waitLong")}
      </p>
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
    } catch (err: unknown) {
      setErrorGeneracion(
        err instanceof Error ? err.message : t("preparar.generateError")
      );
    } finally {
      setGenerando(false);
    }
  }

  const s: Secuencia | undefined = resultado?.secuencia;


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

        {generando && <Esperando />}

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
        <VistaSecuencia
          secuencia={s}
          problemas={resultado?.problemas ?? []}
          codigos={objetivoCodes}
        />
      )}
    </div>
  );
}
