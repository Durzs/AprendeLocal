/**
 * Lo que se ha visto alrededor de esta escuela, según iNaturalist.
 *
 * Para qué sirve, en concreto: en la ruta de las redes alimentarias el curso
 * arma la red de un metro cuadrado de bosque. Sin esto, el docente pone
 * «un pájaro» y «un insecto» en la pizarra. Con esto pone chucao, monito del
 * monte y coigüe, que son los que de verdad andan por su camino.
 *
 * No se consulta solo. Hay un botón, y hay una razón: esto sale hacia un
 * servicio de fuera con la ubicación aproximada de una escuela, y eso no se
 * hace sin que alguien lo pida. Además, en una conexión de celular rural
 * cargar cosas que nadie pidió es gastarle los datos al docente.
 *
 * Una vez consultado queda guardado. Después ya se ve sin señal, que es como
 * se va a usar el resto del año.
 */

import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { Ruta } from "./catalogo";
import type { AjustesEscuela } from "./ajustes";
import {
  consultar,
  leerGuardado,
  pedirUbicacion,
  type Consulta,
  type Guardado,
} from "./inaturalist";

const RADIO_KM = 10;

export default function Naturaleza({
  ruta,
  escuela,
  onEscuela,
  onDatos,
}: {
  ruta: Ruta;
  escuela: AjustesEscuela;
  onEscuela: (a: AjustesEscuela) => void;
  /** Se avisa hacia arriba para que la lista pueda imprimirse. */
  onDatos: (g: Guardado | null) => void;
}) {
  const { t, i18n } = useTranslation();
  const idioma = (i18n.resolvedLanguage ?? "es").slice(0, 2);

  const consulta: Consulta | null =
    ruta.naturaleza && escuela.lat != null && escuela.lng != null
      ? {
          lat: escuela.lat,
          lng: escuela.lng,
          radio: RADIO_KM,
          grupos: ruta.naturaleza.grupos,
          idioma,
        }
      : null;

  const [datos, setDatos] = useState<Guardado | null>(() =>
    consulta ? leerGuardado(consulta) : null
  );
  const [cargando, setCargando] = useState(false);
  const [aviso, setAviso] = useState<string | null>(null);

  // Una ruta sin `naturaleza` no enseña nada de esto.
  if (!ruta.naturaleza) return null;

  function publicar(g: Guardado | null) {
    setDatos(g);
    onDatos(g);
  }

  async function ubicar() {
    setAviso(null);
    setCargando(true);
    try {
      const { lat, lng } = await pedirUbicacion();
      onEscuela({ ...escuela, lat, lng });
    } catch (e) {
      const motivo = e instanceof Error ? e.message : "sin-senal";
      setAviso(t(motivo === "denegado" ? "natura.denied" : "natura.noLocation"));
    } finally {
      setCargando(false);
    }
  }

  async function buscar() {
    if (!consulta) return;
    setAviso(null);
    setCargando(true);
    const r = await consultar(consulta);
    setCargando(false);
    if (r.estado === "ok") publicar(r.datos);
    else if (r.estado === "vacio") {
      publicar(null);
      setAviso(t("natura.empty", { km: RADIO_KM }));
    } else {
      // Que falle no es raro ni grave: hay que decirlo sin alarmar, porque la
      // clase no depende de esto.
      setAviso(
        t(r.motivo === "tiempo" ? "natura.timeout" : "natura.failed", {
          detail: r.motivo,
        })
      );
    }
  }

  return (
    <section className="mt-4 rounded-2xl border border-slate-200 bg-white p-6 print:hidden">
      <p className="rotulo text-slate-500">
        {t("natura.title")}
      </p>
      <p className="mt-1.5 text-sm text-slate-600">{ruta.naturaleza.para}</p>

      <div className="mt-4 flex flex-wrap items-center gap-2.5">
        {escuela.lat == null ? (
          <button
            type="button"
            onClick={ubicar}
            disabled={cargando}
            className="rounded-full bg-[#111217] px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg disabled:translate-y-0 disabled:opacity-60"
          >
            {cargando ? t("natura.locating") : t("natura.useMyLocation")}
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={buscar}
              disabled={cargando}
              className="rounded-full bg-[#111217] px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg disabled:translate-y-0 disabled:opacity-60"
            >
              {cargando
                ? t("natura.searching")
                : datos
                  ? t("natura.searchAgain")
                  : t("natura.search", { km: RADIO_KM })}
            </button>
            <button
              type="button"
              onClick={() => onEscuela({ ...escuela, lat: undefined, lng: undefined })}
              className="text-xs font-semibold text-slate-500 underline underline-offset-2 hover:text-slate-800"
            >
              {t("natura.changeLocation")}
            </button>
          </>
        )}
      </div>

      {cargando && (
        <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-slate-200">
          <div className="animar-esperando h-full w-1/4 rounded-full bg-slate-900" />
        </div>
      )}

      {aviso && (
        <p className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm text-amber-900">
          {aviso}
        </p>
      )}

      {datos && (
        <div className="mt-4">
          <p className="text-sm text-slate-700">
            {t("natura.found", { count: datos.especies.length, km: RADIO_KM })}
          </p>

          <ul className="mt-3 grid gap-x-6 gap-y-1.5 sm:grid-cols-2">
            {datos.especies.slice(0, 40).map((e, i) => (
              <li
                key={e.cientifico}
                className={`animar-asoma animar-asoma-${Math.min(i + 1, 4)} flex items-baseline gap-2 text-sm`}
              >
                <span className="w-8 shrink-0 text-right font-mono text-[11px] text-slate-400">
                  {e.observaciones}
                </span>
                <a
                  href={e.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-w-0 flex-1 hover:underline"
                >
                  <span className="text-slate-900">{e.comun || e.cientifico}</span>
                  {e.comun && (
                    <span className="text-slate-500 italic"> · {e.cientifico}</span>
                  )}
                </a>
              </li>
            ))}
          </ul>

          {/* La parte que convierte esto en ciencia y no en consulta: lo que el
              curso encuentre y no esté aquí, lo suben ellos. */}
          <p className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
            {t("natura.contribute")}
          </p>

          <p className="mt-3 border-t border-slate-100 pt-3 text-xs text-slate-500">
            {t("natura.source")}{" "}
            <a
              href="https://www.inaturalist.org"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2"
            >
              iNaturalist
            </a>
            {" · "}
            {t("natura.savedOffline")}
          </p>
        </div>
      )}
    </section>
  );
}
