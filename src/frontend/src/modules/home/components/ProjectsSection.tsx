import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function ProjectsSection() {
  const { t } = useTranslation();
  const [selectedCountry, setSelectedCountry] = useState<"chile" | "brasil">("chile");

  const chileProjects = [
    {
      category: "💧 Ecosistemas Hídricos",
      categoryColor: "bg-blue-100 text-blue-900",
      subject: "Ciencias Naturales & Química",
      title: "Monitoreo y Calidad de Agua en Cuencas de La Araucanía",
      desc: "Construcción de sensores de turbidez y pH para diagnosticar la salud de ríos y esteros cercanos a la escuela (Río Cautín e Imperial).",
      tool: "🛠️ Sensores & PBL",
      grade: "7° Básico a 2° Medio",
      gradeColor: "text-blue-700 bg-blue-50",
    },
    {
      category: "🌱 Agricultura & Suelo",
      categoryColor: "bg-emerald-100 text-emerald-900",
      subject: "Biología & Tecnología",
      title: "Huertos Inteligentes y Microclima Rural",
      desc: "Automatización de riego y registro de humedad y temperatura para optimizar cultivos e invernaderos comunitarios escolares.",
      tool: "🛠️ Arduino / micro:bit",
      grade: "5° a 8° Básico",
      gradeColor: "text-emerald-700 bg-emerald-50",
    },
    {
      category: "☀️ Clima & Radiación Solar",
      categoryColor: "bg-orange-100 text-orange-950",
      subject: "Física & Matemáticas",
      title: "Estación Meteorológica y Radiación UV",
      desc: "Registro de radiación UV y temperatura ambiente para generar alertas comunitarias y estudiar fenómenos de cambio climático.",
      tool: "🛠️ Análisis de Datos",
      grade: "Enseñanza Media",
      gradeColor: "text-orange-800 bg-orange-50",
    },
    {
      category: "🌲 Biodiversidad & Bosque Nativo",
      categoryColor: "bg-indigo-100 text-indigo-900",
      subject: "Ciencias para la Ciudadanía",
      title: "Registro de Biodiversidad y Bosque Nativo",
      desc: "Identificación de flora y fauna nativa mediante registros fotográficos, bioindicadores y bioacústica de bajo costo.",
      tool: "🛠️ Ciencia Ciudadana",
      grade: "Interdisciplinario",
      gradeColor: "text-indigo-800 bg-indigo-50",
    },
  ];

  return (
    <section id="proyectos" className="py-20 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-900 bg-blue-100 px-3.5 py-1 rounded-full border border-blue-200">
            {t("home.projects.badge", "Banco de Rutas de Aprendizaje")}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-[-0.055em] text-[#111217] mt-3 mb-3 leading-[0.95]">
            {t("home.projects.title", "Rutas diseñadas para docentes y escuelas")}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            {t("home.projects.subtitle", "Experiencias listas para llevar a cabo con objetivos alineados al currículum:")}
          </p>

          {/* Country Selector */}
          <div className="inline-flex p-1.5 bg-[#f8fafc] rounded-full border border-slate-200 shadow-sm mt-6 gap-2">
            <button
              onClick={() => setSelectedCountry("chile")}
              className={[
                "flex items-center gap-2 px-6 py-2 rounded-full font-bold text-sm transition cursor-pointer",
                selectedCountry === "chile"
                  ? "bg-[#0a0047] text-white shadow-md shadow-[#0a0047]/25"
                  : "text-slate-600 hover:text-slate-900",
              ].join(" ")}
            >
              <span className="text-base">🇨🇱</span>
              <span>Chile (La Araucanía & Sur)</span>
            </button>
            <button
              onClick={() => setSelectedCountry("brasil")}
              className={[
                "flex items-center gap-2 px-5 py-2 rounded-full font-semibold text-sm transition cursor-pointer",
                selectedCountry === "brasil"
                  ? "bg-[#f97316] text-white shadow-md shadow-orange-500/20"
                  : "text-slate-400 hover:text-slate-600",
              ].join(" ")}
            >
              <span className="text-base">🇧🇷</span>
              <span>Brasil (Próximamente)</span>
            </button>
          </div>
        </div>

        {/* Projects Grid */}
        {selectedCountry === "chile" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {chileProjects.map((project, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl border border-slate-200 p-7 shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${project.categoryColor}`}>
                      {project.category}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">{project.subject}</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    {project.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-4">
                    {project.desc}
                  </p>
                </div>
                <div className="flex items-center justify-between border-t border-slate-100 pt-4 text-xs font-semibold text-slate-600">
                  <span>{project.tool}</span>
                  <span className={`px-2.5 py-1 rounded-md ${project.gradeColor}`}>{project.grade}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-[#f8fafc] rounded-3xl border border-dashed border-slate-300 p-8">
            <span className="text-4xl mb-3 block">🇧🇷</span>
            <h4 className="text-xl font-bold text-slate-800 mb-2">Rutas para Brasil en Desarrollo</h4>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              Estamos adaptando las rutas de ciencia y monitoreo territorial para los biomas y escuelas de Brasil junto a redes de educadores locales.
            </p>
          </div>
        )}

      </div>
    </section>
  );
}
