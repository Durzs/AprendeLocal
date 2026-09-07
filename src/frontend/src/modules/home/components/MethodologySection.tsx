import { Trees, FileText, Users2, Compass } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function MethodologySection() {
  const { t } = useTranslation();

  return (
    <section id="metodologia" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#f8fafc]">
      <div className="max-w-7xl mx-auto">
        
        {/* Header sin mini-título */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-[-0.055em] text-[#111217] mt-3 mb-4 leading-[0.95]">
            {t("home.whatIs.title", "¿Qué es AprendeLocal?")}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            {t(
              "home.whatIs.subtitle",
              "Una plataforma y metodología de educación STEM contextualizada que permite a docentes y escuelas rurales convertir el entorno local en un laboratorio vivo de aprendizaje científico."
            )}
          </p>
        </div>

        {/* 3 Pilares Explicativos de AprendeLocal */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* 1. Territorio como Laboratorio */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm hover:shadow-md transition flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6">
                <Trees className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                {t("home.whatIs.p1Title", "El territorio como aula")}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {t(
                  "home.whatIs.p1Desc",
                  "Transforma los ríos, bosques, cuencas hídricas y suelos cercanos a tu escuela en el eje de indagación científica, fortaleciendo el sentido de pertenencia e identidad local."
                )}
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-blue-700">
              <Compass className="w-4 h-4" />
              <span>Salidas a terreno y preguntas de indagación</span>
            </div>
          </div>

          {/* 2. Currículum y Clases Listas */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm hover:shadow-md transition flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#f97316] flex items-center justify-center mb-6">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                {t("home.whatIs.p2Title", "Clases listas y alineadas")}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {t(
                  "home.whatIs.p2Desc",
                  "Secuencias didácticas completas alineadas a las bases curriculares oficiales, con guías paso a paso, hojas de registro y rúbricas formativas listas para aplicar sin horas extra de preparación."
                )}
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-orange-600">
              <Compass className="w-4 h-4" />
              <span>Alineación curricular y evaluación formativa</span>
            </div>
          </div>

          {/* 3. Impacto Real en la Comunidad */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm hover:shadow-md transition flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-[#0a0047] flex items-center justify-center mb-6">
                <Users2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                {t("home.whatIs.p3Title", "Impacto comunitario real")}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {t(
                  "home.whatIs.p3Desc",
                  "Los datos e informes recopilados por los estudiantes se entregan formalmente a comités de agua (APR), familias y escuelas para aportar a la toma de decisiones comunitarias."
                )}
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-slate-700">
              <Compass className="w-4 h-4" />
              <span>Ciencia ciudadana y vinculación comunitaria</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
