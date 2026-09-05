import { useTranslation } from "react-i18next";

export default function HowItWorksSection() {
  const { t } = useTranslation();

  /**
   * Los cuatro pasos son los que la aplicación hace de verdad.
   *
   * Antes describían otro producto: «diagnostica el entorno», «genera
   * objetivos y cronograma», «implementa guías maker con sensores», «evalúa
   * con rúbricas integradas». Nada de eso existe. Lo que existe son cuatro
   * rutas ya escritas que se ajustan a la escuela y se imprimen, y prometer
   * en la portada un flujo que el docente no encuentra al entrar es la manera
   * más rápida de perderlo en la primera visita.
   */
  const steps = [
    {
      number: "01",
      title: t("home.howItWorks.s1t", "Elige una ruta"),
      desc: t(
        "home.howItWorks.s1d",
        "Cuatro clases ya escritas, cada una con su pregunta y los objetivos del programa que cubre. Sin configurar nada ni esperar a que se genere."
      ),
      color: "bg-blue-100 text-blue-900",
    },
    {
      number: "02",
      title: t("home.howItWorks.s2t", "Ajústala a tu escuela"),
      desc: t(
        "home.howItWorks.s2d",
        "Dices qué cursos tienes en la sala y cómo se llama tu estero. La clase se recorta a esos cursos y el lugar toma su nombre."
      ),
      color: "bg-blue-100 text-blue-900",
    },
    {
      number: "03",
      title: t("home.howItWorks.s3t", "Imprime lo que se lleva"),
      desc: t(
        "home.howItWorks.s3d",
        "Hoja de terreno por curso con la tabla en blanco, guía del estudiante, carta a la familia con la autorización, y la hoja del producto."
      ),
      color: "bg-orange-100 text-[#f97316]",
    },
    {
      number: "04",
      title: t("home.howItWorks.s4t", "Salen a medir y lo entregan"),
      desc: t(
        "home.howItWorks.s4d",
        "El curso levanta sus propios datos y entrega el resultado a alguien de la comunidad: el comité de agua, las familias, la dirección."
      ),
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
