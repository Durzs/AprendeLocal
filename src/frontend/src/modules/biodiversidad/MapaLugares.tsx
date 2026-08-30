/**
 * «Qué vive aquí»: elegir un lugar y preguntar por él.
 *
 * Esto reemplaza al mapa anterior, y el cambio de fondo no es de aspecto sino
 * de qué manda. Antes había que elegir primero una ESCUELA, y solo entonces
 * aparecían los lugares de alrededor. Eso tenía dos problemas, uno de diseño y
 * uno que directamente rompía la pantalla:
 *
 * · De diseño: la pregunta «qué vive aquí» es sobre un LUGAR. Obligar a pasar
 *   por una escuela era pedirle al docente un dato que no hace falta para
 *   contestarla, y dejaba fuera a cualquiera que quisiera mirar un estero sin
 *   tener escuela asignada.
 *
 * · Roto: las escuelas venían de la API de FastAPI, que ya no responde. Había
 *   un respaldo a Supabase, pero pedía las columnas sin `location`, así que
 *   las escuelas llegaban sin coordenadas y todo lo que las tocaba fallaba. Y
 *   fallaba en silencio: la lista salía vacía, sin decir por qué, y desde ahí
 *   no se podía llegar a ninguna parte.
 *
 * Ahora los lugares se leen de Supabase con su geometría, igual que hace el
 * resto de la aplicación, y si la lectura falla se dice.
 */

import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { leerLugares, type Lugar } from "../../shared/lib/catalogos";
import { esSugerido, juntarConSugeridos, LUGARES_SUGERIDOS } from "./sugeridos";
import { enPalabras } from "../sequences/lib/etiquetas";
import PanelBiodiversidad from "./PanelBiodiversidad";
import MapView from "../../components/MapView";
import type { POIFeature } from "../../types";

function normalizar(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

export default function MapaLugares() {
  const { t } = useTranslation();
  const [lugares, setLugares] = useState<Lugar[]>(LUGARES_SUGERIDOS);
  const [cargando, setCargando] = useState(true);
  const [aviso, setAviso] = useState<string | null>(null);
  /** Cuántos de los que se ven vienen dentro de la aplicación y no de la base. */
  const [sugeridos, setSugeridos] = useState(LUGARES_SUGERIDOS.length);

  const [busqueda, setBusqueda] = useState("");
  const [comuna, setComuna] = useState<string | null>(null);
  const [elegido, setElegido] = useState<Lugar | null>(null);

  useEffect(() => {
    let vigente = true;
    leerLugares()
      .then(({ lugares: deLaBase, filas }) => {
        if (!vigente) return;
        const { lugares: todos, sugeridosUsados } = juntarConSugeridos(deLaBase);
        setLugares(todos);
        setSugeridos(sugeridosUsados);

        // Los dos motivos por los que la base puede no aportar nada tienen
        // arreglos distintos, así que se distinguen en vez de dejarlo en un
        // «no devolvió ningún lugar» que obliga a adivinar.
        if (deLaBase.length === 0) {
          setAviso(filas > 0 ? t("bio.noGeometry", { filas }) : t("bio.emptyTable"));
        }
      })
      .catch((e: unknown) => {
        if (!vigente) return;
        setAviso(
          t("bio.loadFailed", {
            detail: e instanceof Error ? e.message : String(e),
          })
        );
      })
      .finally(() => vigente && setCargando(false));
    return () => {
      vigente = false;
    };
  }, [t]);

  const comunas = useMemo(
    () => [...new Set(lugares.map((l) => l.comuna))].filter(Boolean).sort(),
    [lugares]
  );

  const filtrados = useMemo(() => {
    const q = normalizar(busqueda).split(/\s+/).filter(Boolean);
    return lugares.filter((l) => {
      if (comuna && l.comuna !== comuna) return false;
      if (q.length === 0) return true;
      const texto = normalizar(`${l.nombre} ${l.comuna} ${l.ecosistema}`);
      return q.every((w) => texto.includes(w));
    });
  }, [lugares, busqueda, comuna]);

  /** El mapa espera GeoJSON; los lugares ya traen coordenadas de verdad. */
  const paraMapa: POIFeature[] = useMemo(
    () =>
      filtrados.map(
        (l) =>
          ({
            type: "Feature",
            geometry: { type: "Point", coordinates: [l.punto.lng, l.punto.lat] },
            properties: {
              id: l.id,
              name: l.nombre,
              commune: l.comuna,
              ecosystem_type: l.ecosistema,
            },
          }) as unknown as POIFeature
      ),
    [filtrados]
  );

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      <div className="w-full shrink-0 lg:w-96">
        <h2 className="text-lg font-semibold text-slate-950">{t("bio.pickPlace")}</h2>
        <p className="mt-1 text-sm text-slate-600">{t("bio.pickPlaceLead")}</p>

        <input
          type="search"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder={t("bio.searchPlace")}
          className="mt-3 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-slate-400 focus:ring-1 focus:ring-slate-400"
        />

        <div className="mt-3 flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setComuna(null)}
            className={[
              "rounded-full px-3 py-1 text-xs font-semibold transition",
              !comuna ? "bg-[#111217] text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200",
            ].join(" ")}
          >
            {t("bio.allCommunes")} ({lugares.length})
          </button>
          {comunas.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setComuna(comuna === c ? null : c)}
              className={[
                "rounded-full px-3 py-1 text-xs font-semibold transition",
                comuna === c
                  ? "bg-[#111217] text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200",
              ].join(" ")}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Lo que pase con la base se cuenta, pero ya no deja la pantalla
            muerta: los cuatro sugeridos siguen ahí y se puede trabajar. */}
        {aviso && (
          <p
            role="status"
            className="mt-4 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900"
          >
            {aviso}{" "}
            {sugeridos > 0 && <strong>{t("bio.usingSuggested", { count: sugeridos })}</strong>}
          </p>
        )}

        {cargando && (
          <p className="mt-3 text-xs text-slate-400">{t("bio.loading")}</p>
        )}

        <ul className="mt-4 max-h-[45vh] space-y-1.5 overflow-y-auto pr-1">
            {filtrados.map((l, i) => {
              const activo = elegido?.id === l.id;
              return (
                <li
                  key={l.id}
                  className={i < 4 ? `animar-asoma animar-asoma-${i + 1}` : undefined}
                >
                  <button
                    type="button"
                    onClick={() => setElegido(l)}
                    aria-pressed={activo}
                    className={[
                      "w-full rounded-xl border px-3.5 py-2.5 text-left transition",
                      activo
                        ? "border-slate-900 bg-slate-50 ring-1 ring-slate-900"
                        : "border-slate-200 bg-white hover:border-slate-400",
                    ].join(" ")}
                  >
                    <p className="flex items-baseline gap-2 text-sm font-semibold text-slate-900">
                      {l.nombre}
                      {/* Se dice cuál viaja con la aplicación. Un docente que
                          no encuentra su estero merece saber si es que la base
                          no cargó o es que ese lugar no está cargado. */}
                      {esSugerido(l.id) && (
                        <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                          {t("bio.suggested")}
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-slate-500">
                      {l.comuna}
                      {l.ecosistema ? ` · ${enPalabras(l.ecosistema)}` : ""}
                    </p>
                  </button>
                </li>
              );
            })}
          {filtrados.length === 0 && (
            <li className="py-6 text-center text-sm text-slate-400">
              {t("bio.noMatch")}
            </li>
          )}
        </ul>

        {elegido && (
          <div className="mt-4 animar-asoma">
            <PanelBiodiversidad
              key={elegido.id}
              lat={elegido.punto.lat}
              lng={elegido.punto.lng}
              nombreDelLugar={`${elegido.nombre} · ${elegido.comuna}`}
            />
          </div>
        )}
      </div>

      <div
        className="flex-1 overflow-hidden rounded-[2rem] border border-slate-200 shadow-sm"
        style={{ minHeight: 500 }}
      >
        <MapView
          points={paraMapa}
          onSelectPoint={(p) => {
            const l = lugares.find((x) => x.id === String(p.properties.id));
            if (l) setElegido(l);
          }}
          selectedId={elegido?.id ?? null}
          center={elegido ? [elegido.punto.lng, elegido.punto.lat] : undefined}
        />
      </div>
    </div>
  );
}
