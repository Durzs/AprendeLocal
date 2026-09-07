import { useTranslation } from "react-i18next";
import { BookOpen, Binoculars, Award } from "lucide-react";

export default function TeacherTrainingSection() {
  const { t } = useTranslation();

  const courses = [
    {
      badge: "Metodología",
      badgeColor: "bg-blue-100 text-blue-900",
      title: "Fundamentos de Place-Based Learning (PBL)",
      desc: "Aprende a transformar problemáticas territoriales en unidades de indagación científica motivantes para tus estudiantes.",
      modules: "⏱️ 4 micro-módulos",
      resources: "📄 Plantillas listas",
      icon: BookOpen,
      iconColor: "text-blue-600 bg-blue-50",
    },
    {
      // Aquí decía «Integra Arduino, micro:bit y estaciones ambientales».
      // Se sacó: ninguna de las cuatro rutas pide una placa, y prometerle
      // electrónica a una escuela rural que no la tiene es prometer de más.
      badge: "Terreno",
      badgeColor: "bg-orange-100 text-orange-950",
      title: "Salir a mirar y volver con datos",
      desc: "Cómo se prepara la salida, qué se anota en terreno y cómo se reconoce lo que vive alrededor con iNaturalist y GBIF.",
      modules: "⏱️ 5 micro-módulos",
      resources: "🛠️ Hojas de terreno",
      icon: Binoculars,
      iconColor: "text-[#f97316] bg-orange-50",
    },
    {
      badge: "Evaluación",
      badgeColor: "bg-emerald-100 text-emerald-900",
      title: "Rúbricas y Evaluación por Competencias",
      desc: "Evalúa pensamiento crítico, colaboración y resolución de problemas según los estándares curriculares.",
      modules: "⏱️ 3 micro-módulos",
      resources: "📊 Rúbricas editables",
      icon: Award,
      iconColor: "text-emerald-600 bg-emerald-50",
    },
  ];

  return (
    <section id="formacion" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#f8fafc]">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-800 bg-amber-100 px-3.5 py-1 rounded-full border border-amber-200">
            {t("home.training.badge", "Desarrollo Profesional Docente")}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-[-0.055em] text-[#111217] mt-3 mb-3 leading-[0.95]">
            {t("home.training.title", "Micro-capacitaciones para profesores")}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            {t("home.training.subtitle", "Cursos prácticos para llevar la ciencia al lugar donde está la escuela:")}
          </p>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {courses.map((course, idx) => {
            const Icon = course.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${course.badgeColor}`}>
                      {course.badge}
                    </span>
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${course.iconColor}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mt-2 mb-2">
                    {course.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-6">
                    {course.desc}
                  </p>
                </div>
                <div className="flex items-center justify-between border-t border-slate-100 pt-4 text-xs font-semibold text-slate-500">
                  <span>{course.modules}</span>
                  <span>{course.resources}</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
