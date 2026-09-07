import { MapPin, FileCheck2, Users2 } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function MethodologySection() {
  const { t } = useTranslation();

  return (
    <section id="metodologia" className="py-16 sm:py-20 px-3 sm:px-6 lg:px-10 bg-[#f8fafc] border-b border-slate-200/60">
      <div className="max-w-[1400px] mx-auto w-full">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* LADO IZQUIERDO: TÍTULO Y DESCRIPCIÓN CONTINUA (SIN RECUADROS SEPARADOS) */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-[-0.055em] text-[#111217] leading-[0.95]">
              {t("home.whatIs.title", "¿Qué es AprendeLocal?")}
            </h2>

            <p className="text-slate-700 text-base sm:text-lg leading-relaxed font-normal">
              {t(
                "home.whatIs.p1",
                "AprendeLocal es una plataforma y metodología pedagógica diseñada para que docentes y escuelas rurales transformen su propio territorio —sus ríos, bosques, cuencas y suelos— en un laboratorio vivo de aprendizaje científico y tecnológico."
              )}
            </p>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              {t(
                "home.whatIs.p2",
                "A través de secuencias didácticas completas y alineadas a los objetivos de aprendizaje oficiales, los estudiantes exploran problemas socioambientales reales, realizan mediciones en terreno con instrumentos accesibles y entregan sus resultados a la comunidad escolar, familias y comités locales."
              )}
            </p>

            {/* Puntos Clave de Valor */}
            <div className="pt-2 space-y-3.5 text-sm sm:text-base text-slate-800">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-slate-900">Ciencia contextualizada:</span>{" "}
                  <span className="text-slate-600">Aprender desde el río, bosque y biodiversidad de la propia comunidad escolar.</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-orange-100 text-[#ea580c] flex items-center justify-center shrink-0 mt-0.5">
                  <FileCheck2 className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-slate-900">Clases listas para el aula:</span>{" "}
                  <span className="text-slate-600">Secuencias didácticas clase a clase con preguntas de indagación y rúbricas.</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-indigo-100 text-[#0a0047] flex items-center justify-center shrink-0 mt-0.5">
                  <Users2 className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-slate-900">Impacto ciudadano real:</span>{" "}
                  <span className="text-slate-600">Los datos medidos se entregan formalmente a comités de agua (APR) y familias.</span>
                </div>
              </div>
            </div>

          </div>

          {/* LADO DERECHO: MODELO / ILUSTRACIÓN VISUAL DEL ECOSISTEMA APRENDELOCAL */}
          <div className="lg:col-span-5 flex justify-center items-center">
            <div className="w-full max-w-[460px] aspect-square rounded-3xl bg-gradient-to-br from-white to-slate-100 border border-slate-200/80 p-6 sm:p-8 shadow-xl relative overflow-hidden flex items-center justify-center group hover:shadow-2xl transition duration-500">
              
              {/* Iluminación de fondo */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-orange-200/30 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-200/30 rounded-full blur-3xl pointer-events-none" />

              {/* Gráfico Vectorial Isométrico del Territorio AprendeLocal */}
              <svg className="w-full h-full drop-shadow-xl transition-transform duration-500 group-hover:scale-105" viewBox="0 0 320 320" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Base Isométrica */}
                <polygon points="160,50 280,115 160,180 40,115" fill="#38bdf8" stroke="#0284c7" strokeWidth="2" />
                <polygon points="40,115 160,180 160,255 40,190" fill="#0369a1" />
                <polygon points="160,180 280,115 280,190 160,255" fill="#075985" />

                {/* Isla Superior Verde / Tierra */}
                <polygon points="160,70 255,120 160,170 65,120" fill="#34d399" stroke="#10b981" strokeWidth="2" />
                
                {/* Río que cruza la isla */}
                <polygon points="120,95 180,125 160,170 135,155" fill="#38bdf8" />
                <polygon points="135,155 160,170 160,255 135,240" fill="#0284c7" />

                {/* Árboles Nativos */}
                <g transform="translate(85, 80)">
                  <rect x="10" y="25" width="6" height="18" fill="#78350f" />
                  <polygon points="13,0 28,26 -2,26" fill="#059669" />
                  <polygon points="13,10 25,32 1,32" fill="#047857" />
                </g>

                <g transform="translate(200, 105)">
                  <rect x="8" y="20" width="5" height="15" fill="#78350f" />
                  <polygon points="10,0 22,22 -2,22" fill="#059669" />
                </g>

                {/* Escuela / Estación Científica */}
                <g transform="translate(155, 80)">
                  <polygon points="25,0 50,14 25,28 0,14" fill="#f97316" stroke="#ea580c" strokeWidth="1.5" />
                  <polygon points="0,14 25,28 25,50 0,36" fill="#c2410c" />
                  <polygon points="25,28 50,14 50,36 25,50" fill="#9a3412" />
                  <rect x="8" y="22" width="8" height="10" fill="#fef08a" />
                  {/* Antena */}
                  <line x1="25" y1="0" x2="25" y2="-18" stroke="#0a0047" strokeWidth="2.5" strokeLinecap="round" />
                  <circle cx="25" cy="-20" r="4" fill="#ef4444" />
                </g>

                {/* Sensor & Lupa Flotante */}
                <g transform="translate(90, 160)">
                  <rect x="0" y="0" width="46" height="34" rx="8" fill="#0a0047" stroke="#ffffff" strokeWidth="2.5" />
                  <text x="23" y="22" fill="#4ade80" fontFamily="monospace" fontSize="12" fontWeight="800" textAnchor="middle">pH 7.2</text>
                </g>

                {/* Lupa */}
                <g transform="translate(205, 175) rotate(-15)">
                  <circle cx="20" cy="20" r="16" stroke="#f97316" strokeWidth="4.5" fill="#ffffff" fillOpacity="0.8" />
                  <line x1="32" y1="32" x2="48" y2="48" stroke="#f97316" strokeWidth="5.5" strokeLinecap="round" />
                  <circle cx="20" cy="20" r="8" fill="#38bdf8" />
                </g>
              </svg>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
