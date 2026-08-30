/**
 * «Qué vive aquí»: Explorador visual de biodiversidad territorial.
 *
 * Muestra los 4 lugares emblemáticos de La Araucanía con sus fichas fotográficas,
 * coordenadas reales en el mapa y galería de especies nativas e introducidas.
 */

import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { leerLugares, type Lugar } from "../../shared/lib/catalogos";
import { enPalabras } from "../sequences/lib/etiquetas";
import PanelBiodiversidad from "./PanelBiodiversidad";
import MapView from "../../components/MapView";
import type { POIFeature } from "../../types";

const FOTOS_DESTACADAS: Record<string, string> = {
  conguillio: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&auto=format&fit=crop&q=80",
  villarrica: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop&q=80",
  cautin: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80",
  malalcahuello: "https://images.unsplash.com/photo-1511497584788-87676104235f?w=800&auto=format&fit=crop&q=80",
};

const ICONOS_ECOSISTEMA: Record<string, string> = {
  bosque_araucaria: "🌲",
  bosque_templado: "🌳",
  humedal: "💧",
  rio: "🌊",
  volcan: "🌋",
  estepa_altoandina: "🏔️",
};

function normalizar(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

export default function MapaLugares() {
  const { t } = useTranslation();
  const [todosLosLugares, setTodosLosLugares] = useState<Lugar[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [elegido, setElegido] = useState<Lugar | null>(null);

  useEffect(() => {
    let vigente = true;
    leerLugares()
      .then((l) => {
        if (!vigente) return;
        setTodosLosLugares(l);
        if (l.length === 0) setError(t("bio.noPlaces"));
      })
      .catch((e: unknown) => {
        if (!vigente) return;
        setError(
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

  // Selección de los 4 lugares emblemáticos disponibles
  const cuatroLugares = useMemo(() => {
    if (todosLosLugares.length === 0) return [];

    const nombresClave = [
      "Conguillío",
      "Villarrica",
      "Cautín",
      "Nalcas",
    ];

    const seleccionados: Lugar[] = [];
    for (const clave of nombresClave) {
      const match = todosLosLugares.find((l) =>
        normalizar(l.nombre).includes(normalizar(clave))
      );
      if (match && !seleccionados.some((s) => s.id === match.id)) {
        seleccionados.push(match);
      }
    }

    // Completar hasta 4 si falta alguno
    for (const l of todosLosLugares) {
      if (seleccionados.length >= 4) break;
      if (!seleccionados.some((s) => s.id === l.id)) {
        seleccionados.push(l);
      }
    }

    return seleccionados.slice(0, 4);
  }, [todosLosLugares]);

  // Auto-seleccionar el primer lugar disponible
  useEffect(() => {
    if (cuatroLugares.length > 0 && !elegido) {
      setElegido(cuatroLugares[0]);
    }
  }, [cuatroLugares, elegido]);

  function obtenerFotoLugar(nombre: string): string {
    const n = normalizar(nombre);
    if (n.includes("conguillio")) return FOTOS_DESTACADAS.conguillio;
    if (n.includes("villarrica") || n.includes("rukapillan")) return FOTOS_DESTACADAS.villarrica;
    if (n.includes("cautin")) return FOTOS_DESTACADAS.cautin;
    if (n.includes("nalcas") || n.includes("malalcahuello")) return FOTOS_DESTACADAS.malalcahuello;
    return "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&auto=format&fit=crop&q=80";
  }

  /** El mapa dibuja los 4 puntos emblemáticos con coordenadas precisas */
  const paraMapa: POIFeature[] = useMemo(
    () =>
      cuatroLugares.map(
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
    [cuatroLugares]
  );

  return (
    <div className="space-y-8">
      {/* Cabecera explicativa */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-wider text-emerald-900">
            🗺️ Territorio & Especies
          </span>
          <h2 className="mt-2 text-2xl font-bold text-slate-950">
            {t("bio.pickPlace")}
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-slate-600">
            Explora 4 ecosistemas emblemáticos de La Araucanía para descubrir las especies nativas, sus nombres en Mapuzugun y su valor educativo en terreno.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium bg-slate-50 border border-slate-200/60 rounded-full px-3 py-1.5 self-start md:self-auto">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>4 Lugares disponibles activos</span>
        </div>
      </div>

      {error && (
        <p
          role="alert"
          className="rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900"
        >
          {error}
        </p>
      )}

      {/* Grid de las 4 Tarjetas de Lugares */}
      {cargando ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 py-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-44 rounded-2xl bg-slate-100 animate-pulse border border-slate-200"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cuatroLugares.map((l) => {
            const activo = elegido?.id === l.id;
            const foto = obtenerFotoLugar(l.nombre);
            const icono = ICONOS_ECOSISTEMA[l.ecosistema] || "📍";

            return (
              <button
                key={l.id}
                type="button"
                onClick={() => setElegido(l)}
                aria-pressed={activo}
                className={[
                  "group relative flex flex-col overflow-hidden rounded-2xl border text-left transition-all duration-300",
                  activo
                    ? "border-[#0a0047] bg-white ring-2 ring-[#0a0047] shadow-lg -translate-y-1"
                    : "border-slate-200 bg-white hover:border-slate-400 hover:shadow-md",
                ].join(" ")}
              >
                {/* Imagen del Lugar */}
                <div className="relative h-28 w-full overflow-hidden bg-slate-100">
                  <img
                    src={foto}
                    alt={l.nombre}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  <span className="absolute bottom-2 left-2 inline-flex items-center gap-1 rounded-md bg-black/60 backdrop-blur-xs px-2 py-0.5 text-[10px] font-semibold text-white">
                    <span>{icono}</span>
                    <span>{enPalabras(l.ecosistema)}</span>
                  </span>

                  {activo && (
                    <span className="absolute top-2 right-2 rounded-full bg-[#0a0047] text-white p-1 shadow-sm">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                  )}
                </div>

                {/* Contenido del Lugar */}
                <div className="p-3.5 flex flex-1 flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 group-hover:text-[#0a0047] transition leading-tight">
                      {l.nombre}
                    </h3>
                    <p className="mt-1 text-xs text-slate-500 font-medium">
                      📍 {l.comuna}
                    </p>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-[11px] font-semibold">
                    <span className={activo ? "text-[#0a0047]" : "text-slate-400 group-hover:text-slate-700"}>
                      {activo ? "Explorando especies" : "Ver qué vive aquí →"}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Mapa y Panel de Especies de la Zona */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Mapa Interactivo con los 4 puntos */}
        <div
          className="lg:col-span-5 overflow-hidden rounded-3xl border border-slate-200 shadow-sm sticky top-24"
          style={{ minHeight: 480 }}
        >
          <MapView
            points={paraMapa}
            onSelectPoint={(p) => {
              const l = cuatroLugares.find((x) => x.id === String(p.properties.id));
              if (l) setElegido(l);
            }}
            selectedId={elegido?.id ?? null}
            center={elegido ? [elegido.punto.lng, elegido.punto.lat] : undefined}
          />
        </div>

        {/* Panel Detallado de Especies con Fotos y Fichas */}
        <div className="lg:col-span-7">
          {elegido ? (
            <PanelBiodiversidad
              key={elegido.id}
              lat={elegido.punto.lat}
              lng={elegido.punto.lng}
              nombreDelLugar={`${elegido.nombre} · ${elegido.comuna}`}
            />
          ) : (
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 text-center text-slate-400">
              <p className="text-sm">Selecciona uno de los 4 lugares para ver qué vive ahí.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
