import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MapPin, ArrowRight, School } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

/* Escuelas de La Araucanía con coordenadas reales */
const SCHOOLS = [
  { id: 1, name: "Escuela Rural Maquehue", lat: -38.82, lng: -72.68, comuna: "Padre Las Casas" },
  { id: 2, name: "Liceo Bicentenario Araucanía", lat: -38.74, lng: -72.60, comuna: "Temuco" },
  { id: 3, name: "Escuela Ruka Kimche", lat: -38.90, lng: -72.40, comuna: "Freire" },
  { id: 4, name: "Escuela Rural Metrenco", lat: -38.78, lng: -72.63, comuna: "Padre Las Casas" },
  { id: 5, name: "Liceo Técnico Villarrica", lat: -39.27, lng: -72.22, comuna: "Villarrica" },
  { id: 6, name: "Escuela Los Boldos", lat: -38.47, lng: -72.35, comuna: "Victoria" },
  { id: 7, name: "Colegio Pumahue", lat: -38.73, lng: -72.59, comuna: "Temuco" },
  { id: 8, name: "Escuela Rural Cunco", lat: -38.93, lng: -72.03, comuna: "Cunco" },
];

export default function MapSection() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const [selectedSchool, setSelectedSchool] = useState<typeof SCHOOLS[0] | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const map = L.map(mapRef.current, {
      center: [-38.75, -72.4],
      zoom: 9,
      zoomControl: false,
      scrollWheelZoom: false,
      attributionControl: false,
    });

    L.control.zoom({ position: "bottomright" }).addTo(map);

    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      maxZoom: 19,
    }).addTo(map);

    /* Custom school icon */
    const schoolIcon = L.divIcon({
      html: `<div style="
        background: #111217;
        width: 36px; height: 36px;
        border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        border: 2px solid white;
      ">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="m4 6 8-4 8 4"/>
          <path d="m18 10 4 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-8l4-2"/>
          <path d="M14 22v-4a2 2 0 0 0-4 0v4"/>
          <path d="M18 5v17"/>
          <path d="M6 5v17"/>
          <circle cx="12" cy="9" r="2"/>
        </svg>
      </div>`,
      className: "",
      iconSize: [36, 36],
      iconAnchor: [18, 18],
    });

    SCHOOLS.forEach((school) => {
      const marker = L.marker([school.lat, school.lng], { icon: schoolIcon }).addTo(map);
      marker.on("click", () => {
        setSelectedSchool(school);
        map.flyTo([school.lat, school.lng], 12, { duration: 0.8 });
      });
    });

    mapInstance.current = map;

    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, []);

  return (
    <section className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 flex flex-col gap-6 md:mb-16 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-slate-600">
              <MapPin className="h-3.5 w-3.5" />
              {t("home.map.badge")}
            </div>
            <h2 className="text-4xl font-semibold tracking-[-0.055em] text-[#111217] leading-[0.95] md:text-6xl">
              {t("home.map.title")}
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 md:text-xl">
              {t("home.map.subtitle")}
            </p>
          </div>
          <button
            onClick={() => navigate("/plataforma")}
            className="inline-flex w-fit items-center gap-2 rounded-full bg-[#111217] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-950/10 transition hover:-translate-y-0.5 hover:shadow-xl"
          >
            {t("home.map.cta")}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {/* Map + Info card */}
        <div className="overflow-hidden rounded-[2rem] border border-slate-200 shadow-sm">
          <div className="relative h-[420px] md:h-[500px]">
            <div ref={mapRef} className="absolute inset-0" />

            {/* Selected school card */}
            {selectedSchool && (
              <div className="absolute bottom-4 left-4 right-4 z-[1000] rounded-2xl border border-slate-200 bg-white/95 p-5 shadow-lg backdrop-blur-xl sm:left-auto sm:right-4 sm:max-w-sm">
                <div className="mb-3 flex items-start gap-3">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-slate-950 text-white">
                    <School className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-950">{selectedSchool.name}</h3>
                    <p className="text-sm text-slate-500">{selectedSchool.comuna}, La Araucanía</p>
                  </div>
                </div>
                <button
                  onClick={() => navigate("/plataforma")}
                  className="w-full rounded-xl bg-[#111217] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-black"
                >
                  {t("home.map.explore")}
                </button>
              </div>
            )}
          </div>

          {/* Stats bar */}
          <div className="grid grid-cols-3 divide-x divide-slate-200 border-t border-slate-200 bg-slate-50">
            <div className="px-6 py-4 text-center">
              <p className="text-2xl font-semibold text-[#111217]">8</p>
              <p className="text-xs text-slate-500">{t("home.map.stats.schools")}</p>
            </div>
            <div className="px-6 py-4 text-center">
              <p className="text-2xl font-semibold text-[#111217]">32+</p>
              <p className="text-xs text-slate-500">{t("home.map.stats.pois")}</p>
            </div>
            <div className="px-6 py-4 text-center">
              <p className="text-2xl font-semibold text-[#111217]">100+</p>
              <p className="text-xs text-slate-500">{t("home.map.stats.projects")}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
