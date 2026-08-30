/**
 * Qué vive aquí, para un punto del mapa.
 *
 * Esto es lo que el mapa era y no hacía. Antes mostraba nuestros propios
 * puntos —un estero, un bosque, una cancha de palín— con la descripción que
 * alguien les escribió. Útil para elegir adónde ir, y nada más: seguía siendo
 * un catálogo nuestro hablando de sí mismo.
 *
 * Ahora, elegido el punto, se pregunta a quien sabe. iNaturalist dice qué se
 * ha visto; GBIF, qué está registrado en colecciones. Y encima de las dos se
 * cruza nuestra lista de especies del bosque templado, que es la que añade lo
 * que ninguna API entrega junto: si es nativa, cómo se llama en mapuzugun, y
 * por qué le importaría a un curso de 6º.
 *
 * El orden de la lista no es alfabético ni por abundancia: primero lo nativo,
 * después lo introducido, y al final lo que no reconocemos. Un docente que
 * mira treinta nombres necesita que los primeros sean los que puede enseñar.
 */

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { consultarTodo, type Avistamiento, type Combinado } from "./fuentes";
import { reconocer, type Estado, type Origen } from "./nativas";

const RADIOS = [5, 10, 25] as const;

const COLOR_ESTADO: Record<Estado, string> = {
  en_peligro: "bg-red-100 text-red-900",
  vulnerable: "bg-amber-100 text-amber-900",
  casi_amenazada: "bg-slate-200 text-slate-700",
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

function Fila({ a, origen }: { a: Avistamiento; origen: Origen }) {
  const { t } = useTranslation();
  const nativa = origen.tipo === "nativa" ? origen.ficha : null;
  const intro = origen.tipo === "introducida" ? origen.ficha : null;

  return (
    <li
      className={[
        "rounded-xl border px-3.5 py-2.5",
        nativa ? "border-emerald-200 bg-emerald-50/50" : "",
        intro ? "border-red-200 bg-red-50/50" : "",
        origen.tipo === "desconocido" ? "border-slate-200" : "",
      ].join(" ")}
    >
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <a
          href={a.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-semibold text-slate-950 hover:underline"
        >
          {nativa?.comun || intro?.comun || a.comun || a.cientifico}
        </a>

        {nativa?.mapuzugun && (
          <span className="rounded bg-slate-900 px-1.5 py-0.5 font-mono text-[10px] text-white">
            {nativa.mapuzugun}
          </span>
        )}

        {nativa?.estado && (
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${COLOR_ESTADO[nativa.estado]}`}
          >
            {t(`bio.estado.${nativa.estado}`)}
          </span>
        )}

        {intro && (
          <span className="rounded-full bg-red-600 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
            {t("bio.introduced")}
          </span>
        )}

        <span className="ml-auto font-mono text-[11px] text-slate-400">
          {t("bio.records", { count: a.registros })}
        </span>
      </div>

      <p className="mt-0.5 text-xs italic text-slate-500">{a.cientifico}</p>

      {/* Lo que hace que esto sea enseñable y no una lista de nombres. */}
      {(nativa || intro) && (
        <p className="mt-1.5 text-sm text-slate-700">{nativa?.porQue ?? intro?.porQue}</p>
      )}
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
    // Cada radio tiene su propia respuesta guardada; si ya se consultó, se ve
    // sin volver a pedir nada.
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
    // Media respuesta se usa, pero se dice que es media.
    if (c.fallos.length > 0) {
      setAviso(t("bio.partial", { fuente: c.fallos.map((f) => f.fuente).join(", ") }));
    }
  }

  // Nativo primero, introducido después, lo demás al final.
  const clasificados = (datos?.avistamientos ?? []).map((a) => ({
    a,
    origen: reconocer(a.cientifico),
  }));
  const nativas = clasificados.filter((c) => c.origen.tipo === "nativa");
  const introducidas = clasificados.filter((c) => c.origen.tipo === "introducida");
  const resto = clasificados.filter((c) => c.origen.tipo === "desconocido");

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <p className="font-mono text-[11px] uppercase tracking-widest text-slate-500">
        {t("bio.title")}
      </p>
      <p className="mt-1 text-sm font-semibold text-slate-900">{nombreDelLugar}</p>

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        {RADIOS.map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => cambiarRadio(r)}
            aria-pressed={radio === r}
            className={[
              "rounded-full border px-3 py-1 text-xs font-semibold transition",
              radio === r
                ? "border-slate-900 bg-slate-900 text-white"
                : "border-slate-300 text-slate-600 hover:bg-slate-50",
            ].join(" ")}
          >
            {r} km
          </button>
        ))}
        <button
          type="button"
          onClick={buscar}
          disabled={cargando}
          className="ml-auto rounded-full bg-[#111217] px-4 py-1.5 text-xs font-semibold text-white transition hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-60"
        >
          {cargando ? t("bio.searching") : datos ? t("bio.searchAgain") : t("bio.search")}
        </button>
      </div>

      {cargando && (
        <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-slate-200">
          <div className="animar-esperando h-full w-1/4 rounded-full bg-slate-900" />
        </div>
      )}

      {aviso && (
        <p className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-2.5 text-sm text-amber-900">
          {aviso}
        </p>
      )}

      {datos && (
        <div className="mt-4 space-y-4">
          {nativas.length > 0 && (
            <section>
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800">
                {t("bio.nativeHere", { count: nativas.length })}
              </p>
              <ul className="mt-2 space-y-2">
                {nativas.slice(0, 20).map((c, i) => (
                  <li
                    key={c.a.cientifico}
                    className={`animar-asoma animar-asoma-${Math.min(i + 1, 4)}`}
                  >
                    <Fila a={c.a} origen={c.origen} />
                  </li>
                ))}
              </ul>
            </section>
          )}

          {introducidas.length > 0 && (
            <section>
              <p className="text-xs font-semibold uppercase tracking-wide text-red-800">
                {t("bio.notFromHere", { count: introducidas.length })}
              </p>
              <ul className="mt-2 space-y-2">
                {introducidas.map((c) => (
                  <Fila key={c.a.cientifico} a={c.a} origen={c.origen} />
                ))}
              </ul>
            </section>
          )}

          {resto.length > 0 && (
            <section>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                {t("bio.notInOurList", { count: resto.length })}
              </p>
              <p className="mt-1 text-xs text-slate-500">{t("bio.notInOurListHelp")}</p>
              <ul className="mt-2 grid gap-x-4 gap-y-1 sm:grid-cols-2">
                {resto.slice(0, 24).map((c) => (
                  <li key={c.a.cientifico} className="text-xs">
                    <a
                      href={c.a.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      <span className="text-slate-800">{c.a.comun || c.a.cientifico}</span>
                      {c.a.comun && (
                        <span className="italic text-slate-500"> · {c.a.cientifico}</span>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <p className="border-t border-slate-100 pt-3 text-xs text-slate-500">
            {t("bio.sources")} · {t("bio.savedOffline")}
          </p>
          <p className="text-xs text-amber-800">{t("bio.notice")}</p>
        </div>
      )}
    </div>
  );
}
