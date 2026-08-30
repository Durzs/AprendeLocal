/**
 * Qué vive aquí, para un punto del mapa.
 *
 * Muestra las especies observadas y registradas en el territorio (iNaturalist y GBIF),
 * cruzadas con la base de datos de especies nativas e introducidas del bosque templado
 * de La Araucanía con fotografías representativas, nombres en Mapuzugun y notas docentes.
 */

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { consultarTodo, type Avistamiento, type Combinado } from "./fuentes";
import { reconocer, type Estado, type Origen } from "./nativas";

const RADIOS = [5, 10, 25] as const;

const COLOR_ESTADO: Record<Estado, string> = {
  en_peligro: "bg-red-100 text-red-900 border border-red-200",
  vulnerable: "bg-amber-100 text-amber-900 border border-amber-200",
  casi_amenazada: "bg-slate-200 text-slate-700 border border-slate-300",
};

const ICONO_GRUPO: Record<string, string> = {
  arbol: "🌲 Árbol",
  planta: "🌿 Planta",
  ave: "🦅 Ave",
  mamifero: "🦊 Mamífero",
  anfibio: "🐸 Anfibio",
  pez: "🐟 Pez",
  hongo: "🍄 Hongo",
};

function clave(lat: number, lng: number, radio: number, idioma: string) {
  return `aprendelocal:bio:${lat.toFixed(2)},${lng.toFixed(2)},${radio},${idioma}`;
}

function leerCache(k: string): Combinado | null {
  try {
    const crudo = localStorage.getItem(k);
    if (!crudo) return null;
    const d = JSON.parse(crudo);
    return Array.isArray(d?.avistamientos) ? d : null;
  } catch {
    return null;
  }
}

function guardarCache(k: string, c: Combinado): void {
  try {
    localStorage.setItem(k, JSON.stringify(c));
  } catch {
    /* Sin sitio se sigue: vive en memoria hasta recargar. */
  }
}

function TarjetaEspecie({ a, origen }: { a: Avistamiento; origen: Origen }) {
  const { t } = useTranslation();
  const nativa = origen.tipo === "nativa" ? origen.ficha : null;
  const intro = origen.tipo === "introducida" ? origen.ficha : null;
  const [imgError, setImgError] = useState(false);

  const foto = (!imgError && (a.fotoUrl || nativa?.fotoUrl || intro?.fotoUrl)) || null;

  return (
    <li
      className={[
        "group relative flex flex-col sm:flex-row gap-3.5 rounded-2xl border p-3.5 transition duration-200 hover:shadow-md",
        nativa ? "border-emerald-200 bg-emerald-50/40 hover:bg-emerald-50/70" : "",
        intro ? "border-red-200 bg-red-50/40 hover:bg-red-50/70" : "",
        origen.tipo === "desconocido" ? "border-slate-200 bg-white hover:bg-slate-50" : "",
      ].join(" ")}
    >
      {/* Fotografía de la especie */}
      <div className="relative h-32 w-full sm:h-24 sm:w-24 shrink-0 overflow-hidden rounded-xl bg-slate-100 border border-slate-200/80 shadow-inner flex items-center justify-center">
        {foto ? (
          <img
            src={foto}
            alt={nativa?.comun || intro?.comun || a.comun || a.cientifico}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="flex flex-col items-center justify-center p-2 text-center text-slate-400">
            <span className="text-2xl">
              {nativa ? (ICONO_GRUPO[nativa.grupo]?.split(" ")[0] || "🌿") : intro ? "⚠️" : "🔍"}
            </span>
            <span className="text-[10px] font-mono text-slate-400 mt-1">
              {nativa?.grupo || "especie"}
            </span>
          </div>
        )}

        {nativa?.grupo && (
          <span className="absolute bottom-1 left-1 rounded bg-black/70 backdrop-blur-xs px-1.5 py-0.5 text-[9px] font-medium text-white shadow-xs">
            {ICONO_GRUPO[nativa.grupo] || nativa.grupo}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col justify-between">
        <div>
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <a
              href={a.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-base font-bold text-slate-950 hover:underline hover:text-emerald-800"
            >
              {nativa?.comun || intro?.comun || a.comun || a.cientifico}
            </a>

            {nativa?.mapuzugun && (
              <span
                className="rounded-md bg-slate-900 px-2 py-0.5 font-mono text-[11px] font-semibold text-white shadow-xs"
                title="Nombre en Mapuzugun"
              >
                {nativa.mapuzugun}
              </span>
            )}

            {nativa?.estado && (
              <span
                className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${COLOR_ESTADO[nativa.estado]}`}
              >
                {t(`bio.estado.${nativa.estado}`)}
              </span>
            )}

            {intro && (
              <span className="rounded-full bg-red-600 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-xs">
                {t("bio.introduced")}
              </span>
            )}

            <span className="ml-auto font-mono text-[11px] text-slate-500 bg-white/90 border border-slate-200/80 rounded-full px-2.5 py-0.5 shadow-2xs">
              {t("bio.records", { count: a.registros })}
            </span>
          </div>

          <p className="mt-0.5 text-xs italic text-slate-500 font-serif">{a.cientifico}</p>

          {(nativa || intro) && (
            <p className="mt-2 text-xs leading-relaxed text-slate-700 bg-white/70 rounded-lg p-2 border border-slate-100 shadow-2xs">
              💡 {nativa?.porQue ?? intro?.porQue}
            </p>
          )}
        </div>
      </div>
    </li>
  );
}

export default function PanelBiodiversidad({
  lat,
  lng,
  nombreDelLugar,
}: {
  lat: number;
  lng: number;
  nombreDelLugar: string;
}) {
  const { t, i18n } = useTranslation();
  const idioma = (i18n.resolvedLanguage ?? "es").slice(0, 2);
  const [radio, setRadio] = useState<number>(10);
  const [datos, setDatos] = useState<Combinado | null>(() =>
    leerCache(clave(lat, lng, 10, idioma))
  );
  const [cargando, setCargando] = useState(false);
  const [aviso, setAviso] = useState<string | null>(null);

  function cambiarRadio(r: number) {
    setRadio(r);
    setAviso(null);
    setDatos(leerCache(clave(lat, lng, r, idioma)));
  }

  async function buscar() {
    setAviso(null);
    setCargando(true);
    const c = await consultarTodo(lat, lng, radio, idioma);
    setCargando(false);

    if (c.avistamientos.length === 0) {
      setDatos(null);
      setAviso(
        c.fallos.length === 2
          ? t("bio.bothFailed")
          : t("bio.empty", { km: radio })
      );
      return;
    }
    guardarCache(clave(lat, lng, radio, idioma), c);
    setDatos(c);
    if (c.fallos.length > 0) {
      setAviso(t("bio.partial", { fuente: c.fallos.map((f) => f.fuente).join(", ") }));
    }
  }

  // Clasificación de especies
  const clasificados = (datos?.avistamientos ?? []).map((a) => ({
    a,
    origen: reconocer(a.cientifico),
  }));
  const nativas = clasificados.filter((c) => c.origen.tipo === "nativa");
  const introducidas = clasificados.filter((c) => c.origen.tipo === "introducida");
  const resto = clasificados.filter((c) => c.origen.tipo === "desconocido");

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-900">
            🔍 {t("bio.title")}
          </span>
          <h3 className="mt-1 text-lg font-bold text-slate-950">{nombreDelLugar}</h3>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Radio:</span>
          {RADIOS.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => cambiarRadio(r)}
              aria-pressed={radio === r}
              className={[
                "rounded-full border px-3 py-1 text-xs font-semibold transition",
                radio === r
                  ? "border-slate-900 bg-[#0a0047] text-white shadow-xs"
                  : "border-slate-200 text-slate-600 hover:bg-slate-50",
              ].join(" ")}
            >
              {r} km
            </button>
          ))}
          <button
            type="button"
            onClick={buscar}
            disabled={cargando}
            className="rounded-full bg-[#0a0047] px-4 py-1.5 text-xs font-bold text-white transition hover:bg-[#120078] hover:shadow-md disabled:opacity-60"
          >
            {cargando ? t("bio.searching") : datos ? t("bio.searchAgain") : t("bio.search")}
          </button>
        </div>
      </div>

      {cargando && (
        <div className="mt-4 space-y-2">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div className="animar-esperando h-full w-1/3 rounded-full bg-[#0a0047]" />
          </div>
          <p className="text-center text-xs text-slate-500 font-medium">{t("bio.searching")} en iNaturalist & GBIF...</p>
        </div>
      )}

      {aviso && (
        <p className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {aviso}
        </p>
      )}

      {datos && (
        <div className="mt-6 space-y-6">
          {nativas.length > 0 && (
            <section>
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                  {t("bio.nativeHere", { count: nativas.length })}
                </p>
                <span className="text-[11px] text-slate-500">Fotografías e información pedagógica</span>
              </div>
              <ul className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                {nativas.map((c) => (
                  <TarjetaEspecie
                    key={c.a.cientifico}
                    a={c.a}
                    origen={c.origen}
                  />
                ))}
              </ul>
            </section>
          )}

          {introducidas.length > 0 && (
            <section className="pt-2">
              <p className="text-xs font-bold uppercase tracking-wider text-red-800 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-red-500"></span>
                {t("bio.notFromHere", { count: introducidas.length })}
              </p>
              <ul className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                {introducidas.map((c) => (
                  <TarjetaEspecie key={c.a.cientifico} a={c.a} origen={c.origen} />
                ))}
              </ul>
            </section>
          )}

          {resto.length > 0 && (
            <section className="pt-2 border-t border-slate-100">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {t("bio.notInOurList", { count: resto.length })}
              </p>
              <p className="mt-1 text-xs text-slate-500">{t("bio.notInOurListHelp")}</p>
              <ul className="mt-3 grid gap-x-4 gap-y-2 sm:grid-cols-2 md:grid-cols-3">
                {resto.slice(0, 18).map((c) => (
                  <li key={c.a.cientifico} className="text-xs p-2 rounded-lg bg-slate-50 border border-slate-100">
                    <a
                      href={c.a.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline flex flex-col"
                    >
                      <span className="font-semibold text-slate-800">{c.a.comun || c.a.cientifico}</span>
                      {c.a.comun && (
                        <span className="italic text-slate-500 text-[11px] font-serif">{c.a.cientifico}</span>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <div className="border-t border-slate-100 pt-4 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
            <span>{t("bio.sources")} · {t("bio.savedOffline")}</span>
            <span className="text-amber-800 font-medium">{t("bio.notice")}</span>
          </div>
        </div>
      )}
    </div>
  );
}
