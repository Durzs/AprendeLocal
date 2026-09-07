import { useNavigate } from "react-router-dom";
import { MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function MapExplorerSection() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <section id="mapa" className="py-20 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-[-0.055em] text-[#111217] mb-3 leading-[0.95]">
            {t("home.map.title", "¿Qué vive en tu territorio?")}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            {t(
              "home.map.subtitle",
              "Elige un lugar del territorio y pregunta qué se ha registrado ahí, con lo que sabe la ciencia ciudadana y lo que guardan las colecciones científicas:"
            )}
          </p>
        </div>

        {/* Mockup del Mapa Interactivo */}
        <div className="rounded-3xl overflow-hidden border border-slate-200 bg-white shadow-xl">
          {/* Aquí decía «24 Escuelas conectadas · 180+ Puntos de datos». No
              son ciertos: la tabla de lugares del proyecto está vacía, así que
              esos números no salían de ninguna parte. En una portada que leen
              escuelas y socios, un dato inventado cuesta más que un dato que
              falta, así que se dice lo que sí se puede sostener: de dónde
              vienen los datos. */}
          <div className="p-4 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm font-semibold">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" aria-hidden></span>
              <span>{t("home.map.bar", "Qué vive aquí · Región de La Araucanía")}</span>
            </div>
            <div className="hidden items-center gap-3 text-slate-300 sm:flex">
              <span>{t("home.map.sources", "Datos de iNaturalist y GBIF")}</span>
            </div>
          </div>
          
          <div className="relative h-96 bg-slate-100 flex items-center justify-center overflow-hidden">
            {/* Grid pattern */}
            <div className="absolute inset-0 opacity-30 bg-[radial-gradient(#2563eb_1px,transparent_1px)] [background-size:16px_16px]"></div>
            
            {/* Floating focal card */}
            <div className="relative z-10 flex flex-col items-center text-center p-6 sm:p-8 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200 shadow-2xl max-w-md mx-4">
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mb-3">
                <MapPin className="w-6 h-6 text-[#f97316]" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-1">
                {t("home.map.cardTitle", "Qué vive alrededor de tu escuela")}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed mb-5">
                {t(
                  "home.map.cardBody",
                  "Elige un lugar y mira qué especies se han registrado ahí: cuáles son nativas, cómo se llaman en mapuzugun y cuáles no son de acá."
                )}
              </p>
              <button
                onClick={() => navigate("/plataforma?tab=map")}
                className="px-6 py-2.5 rounded-xl bg-[#0a0047] hover:bg-[#140066] text-white text-xs font-bold shadow-md shadow-[#0a0047]/20 transition cursor-pointer"
              >
                {t("home.map.cta", "Abrir el mapa")}
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
