import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  BookOpen,
  Warehouse,
  MapPin,
  ArrowRight,
  FlaskConical,
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
  }, []);

  return <div ref={ref} id={id} className="absolute inset-0 rounded-2xl" />;
}

/* ── feature pill ── */
function FeaturePill({
  icon: Icon,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm">
      <Icon className="h-3.5 w-3.5" />
      {label}
    </span>
  );
}

/* ── main section ── */
export default function CountrySection() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <section className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 max-w-4xl md:mb-16">
          <h2 className="text-4xl font-semibold leading-[0.95] tracking-[-0.055em] text-[#111217] md:text-6xl">
            {t("home.country.title")}
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 md:text-xl">
            {t("home.country.subtitle")}
          </p>
        </div>

        {/* Two cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* ─── Chile ─── */}
          <div className="group flex flex-col overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-950/5">
            {/* Map preview */}
            <div className="relative h-48 w-full overflow-hidden bg-slate-100 sm:h-56">
              <MiniMap center={[-38.75, -72.4]} zoom={8} id="map-chile" />
              {/* Overlay gradient */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white/80 via-transparent to-transparent" />
              {/* Flag + country */}
              <div className="absolute bottom-4 left-5 z-10 flex items-center gap-3">
                <span className="text-4xl">🇨🇱</span>
                <h3 className="text-2xl font-bold text-[#111217]">Chile</h3>
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col p-6 pt-5">
              <p className="mb-1 text-sm font-semibold uppercase tracking-wide text-slate-400">
                La Araucanía
              </p>
              <p className="mb-5 text-sm leading-6 text-slate-600">
                {t("home.country.chile.description")}
              </p>

              {/* Feature pills */}
              <div className="mb-6 flex flex-wrap gap-2">
                <FeaturePill icon={BookOpen} label={t("home.country.tags.courses")} />
                <FeaturePill icon={FlaskConical} label={t("home.country.tags.stemPlatform")} />
                <FeaturePill icon={MapPin} label={t("home.country.tags.schools")} />
              </div>

              {/* Coming soon badge for makerspaces */}
              <div className="mb-6 inline-flex w-fit items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700">
                <Warehouse className="h-3.5 w-3.5" />
                {t("home.country.chile.makerspacesSoon")}
              </div>

              <div className="mt-auto">
                <button
                  onClick={() => navigate("/plataforma")}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#111217] px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-950/10 transition hover:bg-black"
                >
                  {t("home.country.chile.cta")}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* ─── Brasil ─── */}
          <div className="group flex flex-col overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-950/5">
            {/* Map preview */}
            <div className="relative h-48 w-full overflow-hidden bg-slate-100 sm:h-56">
              <MiniMap center={[-23.55, -46.63]} zoom={7} id="map-brasil" />
              {/* Overlay gradient */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white/80 via-transparent to-transparent" />
              {/* Flag + country */}
              <div className="absolute bottom-4 left-5 z-10 flex items-center gap-3">
                <span className="text-4xl">🇧🇷</span>
                <h3 className="text-2xl font-bold text-[#111217]">Brasil</h3>
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col p-6 pt-5">
              <p className="mb-1 text-sm font-semibold uppercase tracking-wide text-slate-400">
                São Paulo
              </p>
              <p className="mb-5 text-sm leading-6 text-slate-600">
                {t("home.country.brasil.description")}
              </p>

              {/* Feature pills */}
              <div className="mb-6 flex flex-wrap gap-2">
                <FeaturePill icon={BookOpen} label={t("home.country.tags.courses")} />
                <FeaturePill icon={FlaskConical} label={t("home.country.tags.stemPlatform")} />
                <FeaturePill icon={MapPin} label={t("home.country.tags.schools")} />
                <FeaturePill icon={Warehouse} label={t("home.country.tags.makerspaces")} />
              </div>

              <div className="mt-auto">
                <button
                  onClick={() => navigate("/makerspaces")}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#111217] px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-950/10 transition hover:bg-black"
                >
                  {t("home.country.brasil.cta")}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
