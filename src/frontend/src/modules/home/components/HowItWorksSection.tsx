import { useTranslation } from "react-i18next";

export default function HowItWorksSection() {
  const { t } = useTranslation();

  const steps = [
    {
      number: "01",
      title: "Diagnostica el Entorno",
      desc: "Identifica desafíos socioambientales locales: cuencas hídricas, calidad de suelo, clima o gestión de residuos.",
      color: "bg-blue-100 text-blue-900",
    },
    {
      number: "02",
      title: "Planifica la Unidad",
      desc: "Genera objetivos de aprendizaje, cronograma clase a clase, preguntas guía y criterios de evaluación oficial.",
      color: "bg-blue-100 text-blue-900",
    },
    {
      number: "03",
      title: "Implementa Guías Maker",
      desc: "Aplica estaciones de medición, sensores accesibles y actividades prácticas paso a paso con tus alumnos.",
      color: "bg-orange-100 text-[#f97316]",
    },
    {
      number: "04",
      title: "Evalúa Competencias",
      desc: "Mide pensamiento crítico, resolución de problemas y conciencia territorial con rúbricas formativas integradas.",
      color: "bg-orange-100 text-[#f97316]",
    },
  ];

  return (
    <section id="como-funciona" className="py-20 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto">
        
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-[#f97316] bg-orange-50 px-3.5 py-1 rounded-full border border-orange-200">
            {t("home.howItWorks.badge", "Ciclo de Trabajo en Aula")}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-[-0.055em] text-[#111217] mt-3 mb-4 leading-[0.95]">
            {t("home.howItWorks.title", "¿Cómo funciona AprendeLocal para el docente?")}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            {t("home.howItWorks.subtitle", "Un proceso paso a paso para planificar y facilitar ciencia territorial en tu escuela:")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => (
            <div key={step.number} className="bg-[#fdfcf9] rounded-2xl p-6 border border-slate-200 relative shadow-sm hover:shadow-md transition">
              <div className={`w-10 h-10 rounded-full ${step.color} font-extrabold flex items-center justify-center mb-4 text-sm`}>
                {step.number}
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-2">{step.title}</h4>
              <p className="text-xs text-slate-600 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
