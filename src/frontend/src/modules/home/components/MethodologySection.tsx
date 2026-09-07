import { Trees, Atom, Compass, Users2 } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function MethodologySection() {
  const { t } = useTranslation();

  const visualPillars = [
    {
      icon: Trees,
      label: "Tu lugar",
      bgIcon: "bg-emerald-100 text-emerald-700",
      border: "hover:border-emerald-300",
    },
    {
      icon: Atom,
      label: "El programa",
      bgIcon: "bg-blue-100 text-blue-700",
      border: "hover:border-blue-300",
    },
    {
      icon: Compass,
      label: "Clases escritas",
      bgIcon: "bg-orange-100 text-[#ea580c]",
      border: "hover:border-orange-300",
    },
    {
      icon: Users2,
      label: "Alguien lo recibe",
      bgIcon: "bg-indigo-100 text-[#0a0047]",
      border: "hover:border-indigo-300",
    },
  ];

  return (
    <section id="metodologia" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-[#f8fafc] border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto w-full">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          
          {/* LADO IZQUIERDO: 50% - TÍTULO Y DESCRIPCIÓN CONTINUA */}
          <div className="space-y-6 text-left">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-[-0.055em] text-[#111217] leading-[0.95]">
              {t("home.whatIs.title", "¿Qué es AprendeLocal?")}
            </h2>

            <p className="text-slate-700 text-base sm:text-lg leading-relaxed font-normal">
              {t(
                "home.whatIs.p1",
                "AprendeLocal arma la clase de ciencias con el lugar donde está tu escuela. Dices qué objetivos te toca pasar y qué hay a distancia de caminata, y sale un proyecto de tres semanas: qué hace cada curso, qué se mide en terreno y qué entregan al final."
              )}
            </p>

            <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
              {t(
                "home.whatIs.p2",
                "Una parte la propone el sistema y la otra la escribes tú. El nombre del estero, a quién se le entrega el trabajo, a quién de la comunidad se le pregunta: eso no lo sabe nadie más, y va vacío hasta que lo pongas."
              )}
            </p>

            <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
              {t(
                "home.whatIs.p3",
                "Todo se imprime. En una escuela sin señal la clase igual sale."
              )}
            </p>
          </div>

          {/* LADO DERECHO: 50% - ICONOS GRANDES DISTRIBUIDOS CON ETIQUETAS CORTAS */}
          <div className="grid grid-cols-2 gap-4 sm:gap-6">
            {visualPillars.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className={`bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 ${item.border}`}
                >
                  <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center mb-4 shadow-inner ${item.bgIcon}`}>
                    <Icon className="w-8 h-8 sm:w-10 sm:h-10" />
                  </div>
                  <span className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
