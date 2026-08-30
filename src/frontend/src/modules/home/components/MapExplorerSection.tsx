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
          <span className="text-xs font-bold uppercase tracking-widest text-blue-900 bg-blue-100 px-3.5 py-1 rounded-full border border-blue-200">
            {t("home.map.badge", "Explorador Territorial Interactivo")}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0a0047] tracking-tight mt-3 mb-3">
            {t("home.map.title", "¿Qué vive en tu territorio?")}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            {t("home.map.subtitle", "Explora especies, cuencas hídricas y proyectos activos en el mapa interactivo de tu región:")}
          </p>
        </div>

        {/* Mockup del Mapa Interactivo */}
        <div className="rounded-3xl overflow-hidden border border-slate-200 bg-white shadow-xl">
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between text-xs sm:text-sm font-semibold">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Mapa STEM en Vivo · Región de La Araucanía & Sur</span>
            </div>
            <div className="flex items-center gap-3 text-slate-300 hidden sm:flex">
              <span>24 Escuelas conectadas</span>
              <span>·</span>
              <span>180+ Puntos de datos</span>
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
              <h4 className="text-lg font-bold text-slate-900 mb-1">Explorador de Cuencas y Biodiversidad</h4>
              <p className="text-xs text-slate-600 leading-relaxed mb-5">
                Descubre puntos de muestreo de agua, sensores en escuelas y registros botánicos de tu comuna.
              </p>
              <button
                onClick={() => navigate("/plataforma?tab=map")}
                className="px-6 py-2.5 rounded-xl bg-[#0a0047] hover:bg-[#140066] text-white text-xs font-bold shadow-md shadow-[#0a0047]/20 transition cursor-pointer"
              >
                Abrir Mapa Completo
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
