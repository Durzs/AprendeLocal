import { useState, useEffect, useRef } from "react";
import type { ComponentType } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  BookOpen,
  Warehouse,
  MapPin,
  ArrowRight,
  FlaskConical,
  Trees,
  Droplets,
  Sun,
  Sprout,
  Leaf,
  Zap,
} from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

/* ── tiny map helper ── */
function MiniMap({
  center,
  zoom,
  id,
}: {
  center: [number, number];
  zoom: number;
  id: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!ref.current || mapRef.current) return;

    const map = L.map(ref.current, {
      center,
      zoom,
      zoomControl: false,
      scrollWheelZoom: false,
      dragging: false,
      attributionControl: false,
      doubleClickZoom: false,
      touchZoom: false,
    });

    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
      { maxZoom: 19 }
    ).addTo(map);

    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [center, zoom]);

  return <div ref={ref} id={id} className="absolute inset-0 rounded-2xl" />;
}

/* ── feature pill ── */
function FeaturePill({
  icon: Icon,
  label,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm">
      <Icon className="h-3.5 w-3.5 text-emerald-600" />
      {label}
    </span>
  );
}

/* ── main section ── */
export default function CountrySection() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedCountry, setSelectedCountry] = useState<"chile" | "brasil">("chile");

  return (
    <section id="territorios" className="bg-[#fafbfd] py-20 md:py-28 border-t border-slate-200/60">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-emerald-800">
            <MapPin className="h-3.5 w-3.5" />
            {t("home.country.badge", "Territorios en Acción")}
          </span>
          <h2 className="mt-4 text-3xl font-semibold leading-[0.95] tracking-[-0.055em] text-[#111217] sm:text-4xl md:text-5xl">
            {t("home.country.title", "Oportunidades STEM contextualizadas")}
          </h2>
          <p className="mt-4 text-base sm:text-lg leading-relaxed text-slate-600">
            {t(
              "home.country.subtitle",
              "Elige un país para explorar los desafíos ambientales, biomas y proyectos diseñados para su realidad:"
            )}
          </p>

          {/* Selector de País (Pills interactivos) */}
          <div className="mt-8 inline-flex rounded-full border border-slate-200 bg-white p-1.5 shadow-sm">
            <button
              onClick={() => setSelectedCountry("chile")}
              className={[
                "flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-bold transition duration-200 cursor-pointer",
                selectedCountry === "chile"
                  ? "bg-[#111217] text-white shadow-md"
                  : "text-slate-600 hover:text-slate-900",
              ].join(" ")}
            >
              <span className="text-lg">🇨🇱</span>
              <span>Chile (La Araucanía & Sur)</span>
            </button>
            <button
              onClick={() => setSelectedCountry("brasil")}
              className={[
                "flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-bold transition duration-200 cursor-pointer",
                selectedCountry === "brasil"
                  ? "bg-[#111217] text-white shadow-md"
                  : "text-slate-600 hover:text-slate-900",
              ].join(" ")}
            >
              <span className="text-lg">🇧🇷</span>
              <span>Brasil (Biomas & Makers)</span>
            </button>
          </div>
        </div>

        {/* ─── TAB: CHILE ─── */}
        {selectedCountry === "chile" && (
          <div className="space-y-8 animate-fadeIn">
            {/* Top Map + Overview Card */}
            <div className="overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="relative h-64 lg:h-80 w-full overflow-hidden rounded-2xl bg-slate-100 lg:col-span-6">
                  <MiniMap center={[-38.75, -72.4]} zoom={8} id="map-chile" />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-5 z-10 flex items-center gap-3">
                    <span className="text-4xl">🇨🇱</span>
                    <div>
                      <h3 className="text-2xl font-bold text-white">Chile</h3>
                      <p className="text-xs font-semibold uppercase tracking-wider text-emerald-300">
                        La Araucanía · Zona Piloto
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col justify-between lg:col-span-6 space-y-5">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">
                      Laboratorio Territorial La Araucanía
                    </h3>
                    <p className="text-sm leading-relaxed text-slate-600">
                      {t(
                        "home.country.chile.description",
                        "Explora escuelas y genera proyectos STEM contextualizados con IA en la región de La Araucanía, integrando bosque nativo, cuencas y patrimonio cultural."
                      )}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <FeaturePill icon={BookOpen} label={t("home.country.tags.courses", "Cursos Adaptados")} />
                    <FeaturePill icon={FlaskConical} label={t("home.country.tags.stemPlatform", "Plataforma STEM")} />
                    <FeaturePill icon={MapPin} label={t("home.country.tags.schools", "Escuelas Rurales")} />
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => navigate("/plataforma")}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#111217] px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-950/10 transition hover:bg-black hover:-translate-y-0.5"
                    >
                      <span>{t("home.country.chile.cta", "Abrir Mapa y Proyectos de Chile")}</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 3 Regional Chile Challenge Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition">
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                  <Trees className="h-5 w-5" />
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-1.5">
                  Bosque Templado & Araucarias
                </h4>
                <p className="text-xs leading-relaxed text-slate-600 mb-4">
                  Monitoreo de especies milenarias, hongos micorrícicos y microclima ante el cambio global.
                </p>
                <div className="text-xs font-semibold text-emerald-700">
                  📍 Curarrehue · Lonquimay · Melipeuco
                </div>
              </div>

              <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition">
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                  <Droplets className="h-5 w-5" />
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-1.5">
                  Cuencas Hídricas & Humedales
                </h4>
                <p className="text-xs leading-relaxed text-slate-600 mb-4">
                  Sensores IoT de bajo costo para turbidez, pH y calidad de agua en escuelas rurales.
                </p>
                <div className="text-xs font-semibold text-blue-700">
                  📍 Cuenca del Trancura y Toltén
                </div>
              </div>

              <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition">
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                  <Sun className="h-5 w-5" />
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-1.5">
                  Patrimonio Mapuche & Lawen
                </h4>
                <p className="text-xs leading-relaxed text-slate-600 mb-4">
                  Etnobotánica escolar, huertos inteligentes y saberes ancestrales de soberanía alimentaria.
                </p>
                <div className="text-xs font-semibold text-amber-700">
                  📍 Galvarino · Padre Las Casas
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── TAB: BRASIL ─── */}
        {selectedCountry === "brasil" && (
          <div className="space-y-8 animate-fadeIn">
            {/* Top Map + Overview Card */}
            <div className="overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="relative h-64 lg:h-80 w-full overflow-hidden rounded-2xl bg-slate-100 lg:col-span-6">
                  <MiniMap center={[-23.55, -46.63]} zoom={7} id="map-brasil" />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-5 z-10 flex items-center gap-3">
                    <span className="text-4xl">🇧🇷</span>
                    <div>
                      <h3 className="text-2xl font-bold text-white">Brasil</h3>
                      <p className="text-xs font-semibold uppercase tracking-wider text-emerald-300">
                        São Paulo · Biomas & Makerspaces
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col justify-between lg:col-span-6 space-y-5">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">
                      Rede de Inovação Maker & Biomas
                    </h3>
                    <p className="text-sm leading-relaxed text-slate-600">
                      {t(
                        "home.country.brasil.description",
                        "Accede a cursos, makerspaces y una red de espacios maker para aplicar STEM en proyectos reales de regeneración socioambiental."
                      )}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <FeaturePill icon={BookOpen} label={t("home.country.tags.courses", "Cursos")} />
                    <FeaturePill icon={Warehouse} label={t("home.country.tags.makerspaces", "Makerspaces")} />
                    <FeaturePill icon={FlaskConical} label={t("home.country.tags.stemPlatform", "Plataforma STEM")} />
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => navigate("/makerspaces")}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#111217] px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-950/10 transition hover:bg-black hover:-translate-y-0.5"
                    >
                      <span>{t("home.country.brasil.cta", "Explorar Makerspaces de Brasil")}</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 3 Regional Brasil Challenge Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition">
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                  <Sprout className="h-5 w-5" />
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-1.5">
                  Cerrado & Conservação de Solo
                </h4>
                <p className="text-xs leading-relaxed text-slate-600 mb-4">
                  Projetos maker para contenção hídrica, estudo de raízes profundas e recuperação de áreas.
                </p>
                <div className="text-xs font-semibold text-emerald-700">
                  📍 Região Centro-Oeste
                </div>
              </div>

              <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition">
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                  <Leaf className="h-5 w-5" />
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-1.5">
                  Mata Atlântica & Abelhas Nativas
                </h4>
                <p className="text-xs leading-relaxed text-slate-600 mb-4">
                  Sensores acústicos para meliponíneos e corredores de polinização agroflorestal.
                </p>
                <div className="text-xs font-semibold text-teal-700">
                  📍 Vale do Ribeira & São Paulo
                </div>
              </div>

              <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition">
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                  <Zap className="h-5 w-5" />
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-1.5">
                  Amazônia & Bioeconomia Solar
                </h4>
                <p className="text-xs leading-relaxed text-slate-600 mb-4">
                  Secadores solares e termometria digital para processamento de frutos florestais.
                </p>
                <div className="text-xs font-semibold text-amber-700">
                  📍 Escolas Ribeirinhas do Pará
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
