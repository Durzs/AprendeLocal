import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Trees, Droplets, Sun, Sprout, Leaf, Zap, MapPin } from "lucide-react";

export default function CountrySection() {
  const { t } = useTranslation();
  const [selectedCountry, setSelectedCountry] = useState<"chile" | "brasil">("chile");

  return (
    <section id="territorios" className="bg-slate-50/70 py-20 md:py-28 border-y border-slate-200/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 text-blue-900 text-xs font-bold uppercase tracking-widest px-3.5 py-1 border border-blue-200">
            <MapPin className="w-3.5 h-3.5 text-orange-500" />
            {t("home.country.badge", "Territorios en Acción")}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-[-0.055em] text-[#111217] mt-4 mb-3 leading-[0.95]">
            {t("home.country.title", "Oportunidades STEM contextualizadas")}
          </h2>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            {t(
              "home.country.subtitle",
              "Elige un país para explorar los desafíos ambientales, biomas y proyectos diseñados específicamente para su realidad territorial:"
            )}
          </p>

          {/* Selector de País (Pills interactivos con Azul y Naranja) */}
          <div className="inline-flex p-1.5 bg-white rounded-full border border-slate-200 shadow-sm mt-8 gap-2">
            <button
              onClick={() => setSelectedCountry("chile")}
              className={[
                "flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-sm transition cursor-pointer",
                selectedCountry === "chile"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                  : "text-slate-600 hover:text-slate-900",
              ].join(" ")}
            >
              <span className="text-lg">🇨🇱</span>
              <span>Chile (Araucanía & Sur)</span>
            </button>
            <button
              onClick={() => setSelectedCountry("brasil")}
              className={[
                "flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-sm transition cursor-pointer",
                selectedCountry === "brasil"
                  ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                  : "text-slate-600 hover:text-slate-900",
              ].join(" ")}
            >
              <span className="text-lg">🇧🇷</span>
              <span>Brasil (Biomas & Comunidades)</span>
            </button>
          </div>
        </div>

        {/* ─── PANEL CHILE ─── */}
        {selectedCountry === "chile" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 transition-all duration-300">
            {/* Card 1: Bosque Templado */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition group">
              <div className="h-48 rounded-xl overflow-hidden mb-5 relative bg-slate-100">
                <img
                  src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80"
                  alt="Bosque Araucarias"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <span className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                  Bosque Templado Valdiviano
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-2">
                <Trees className="w-4 h-4" /> Biodiversidad & Conservación
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Monitoreo de Araucarias y Ecosistema Nativo
              </h3>
              <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                Estudio de la microfauna, hongos micorrícicos y salud de especies milenarias ante el cambio climático.
              </p>
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500">
                <span>📍 Curarrehue, Lonquimay</span>
                <span className="text-emerald-600 font-bold">14 Proyectos</span>
              </div>
            </div>

            {/* Card 2: Gestión Hídrica */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition group">
              <div className="h-48 rounded-xl overflow-hidden mb-5 relative bg-slate-100">
                <img
                  src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"
                  alt="Ríos y Cuencas del Sur"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <span className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                  Cuencas & Humedales
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-blue-700 uppercase tracking-wider mb-2">
                <Droplets className="w-4 h-4" /> Gestión de Recursos Hídricos
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Sensores IoT para Calidad y Caudal de Agua
              </h3>
              <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                Prototipos de bajo costo para monitorear turbidez, pH y abastecimiento en escuelas rurales aisladas.
              </p>
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500">
                <span>📍 Río Trancura y Toltén</span>
                <span className="text-blue-600 font-bold">18 Proyectos</span>
              </div>
            </div>

            {/* Card 3: Patrimonio Mapuche */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition group">
              <div className="h-48 rounded-xl overflow-hidden mb-5 relative bg-slate-100">
                <img
                  src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80"
                  alt="Agricultura Sostenible"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <span className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                  Saberes Tradicionales
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-wider mb-2">
                <Sun className="w-4 h-4" /> Agricultura & Etnobotánica
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Huertos Escolares y Plantas Medicinales
              </h3>
              <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                Integración de botánica científica con el saber ancestral del Lawen y soberanía alimentaria comunitaria.
              </p>
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500">
                <span>📍 Melipeuco y Galvarino</span>
                <span className="text-amber-600 font-bold">11 Proyectos</span>
              </div>
            </div>
          </div>
        )}

        {/* ─── PANEL BRASIL ─── */}
        {selectedCountry === "brasil" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 transition-all duration-300">
            {/* Card 1: Cerrado */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition group">
              <div className="h-48 rounded-xl overflow-hidden mb-5 relative bg-slate-100">
                <img
                  src="https://images.unsplash.com/photo-1619856699906-09e1f58c98b1?auto=format&fit=crop&w=800&q=80"
                  alt="Cerrado Brasileiro"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <span className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                  Bioma Cerrado
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-2">
                <Sprout className="w-4 h-4" /> Manejo de Solo e Água
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Conservação de Nascentes e Solo do Cerrado
              </h3>
              <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                Projetos maker para contenção hídrica, estudo das raízes profundas e recuperação de áreas degradadas.
              </p>
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500">
                <span>📍 Região Centro-Oeste</span>
                <span className="text-emerald-600 font-bold">16 Projetos</span>
              </div>
            </div>

            {/* Card 2: Mata Atlântica */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition group">
              <div className="h-48 rounded-xl overflow-hidden mb-5 relative bg-slate-100">
                <img
                  src="https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=800&q=80"
                  alt="Mata Atlantica"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <span className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                  Mata Atlântica
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-teal-700 uppercase tracking-wider mb-2">
                <Leaf className="w-4 h-4" /> Corredores Ecológicos
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Monitoramento de Polinizadores e Agrofloresta
              </h3>
              <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                Sensores acústicos e ciência cidadã para catalogar abelhas nativas sem ferrão (meliponíneos).
              </p>
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500">
                <span>📍 Vale do Ribeira & Sul</span>
                <span className="text-teal-600 font-bold">22 Projetos</span>
              </div>
            </div>

            {/* Card 3: Amazônia */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition group">
              <div className="h-48 rounded-xl overflow-hidden mb-5 relative bg-slate-100">
                <img
                  src="https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80"
                  alt="Amazonia"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <span className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                  Comunidades Ribeirinhas
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-wider mb-2">
                <Zap className="w-4 h-4" /> Energia & Bioeconomia
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Soluções Solares e Cadeias de Frutos Nativos
              </h3>
              <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                Secadores solares e termometria digital para processamento sustentável de açaí, cacau e castanha.
              </p>
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500">
                <span>📍 Escolas Ribeirinhas do Pará</span>
                <span className="text-amber-600 font-bold">19 Projetos</span>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
