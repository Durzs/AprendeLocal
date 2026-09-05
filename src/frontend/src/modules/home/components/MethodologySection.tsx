import { MapPin, FileCheck, HandHeart } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function MethodologySection() {
  const { t } = useTranslation();

  return (
    <section id="metodologia" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#f8fafc]">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-900 bg-blue-100 px-3.5 py-1 rounded-full border border-blue-200">
            {t("home.methodology.badge", "Metodología Place-Based Learning (PBL) & STEM")}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-[-0.055em] text-[#111217] mt-3 mb-4 leading-[0.95]">
            {t("home.methodology.title", "Una ruta pedagógica en 3 etapas continuas")}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            {t(
              "home.methodology.subtitle",
              "Diseñado para que docentes de ciencias y tecnología transformen los desafíos de su entorno en experiencias de aprendizaje aplicadas:"
            )}
          </p>
        </div>

        {/* Contenedor Unificado de 3 Bloques Integrados */}
        <div className="rounded-3xl bg-[#0f172a] p-6 sm:p-10 border border-slate-800 text-white shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Etapa 1: Explora tu Entorno */}
            <div className="bg-white rounded-2xl p-7 text-slate-900 border-t-4 border-blue-600 shadow-lg flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="w-9 h-9 rounded-xl bg-blue-100 text-blue-900 font-extrabold text-sm flex items-center justify-center">01</span>
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full">
                    Fase 1 · Diagnóstico
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">
                  Explora el Territorio
                </h3>
                <div className="text-xs font-bold text-blue-600 uppercase tracking-wide mb-3">
                  Conexión Territorial Real
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Identifica problemáticas ambientales y comunitarias cercanas (cuencas hídricas, agricultura, biodiversidad o microclima) y conviértelas en el eje de indagación científica de tus estudiantes.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-slate-500">
                <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Salidas a terreno y preguntas guía</span>
              </div>
            </div>

            {/* Etapa 2: Planifica con Datos */}
            <div className="bg-white rounded-2xl p-7 text-slate-900 border-t-4 border-[#0a0047] shadow-lg flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="w-9 h-9 rounded-xl bg-slate-100 text-slate-900 font-extrabold text-sm flex items-center justify-center">02</span>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full">
                    Fase 2 · Planificación
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">
                  Planifica con Datos
                </h3>
                <div className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-3">
                  Curriculum Ágil & Rúbricas
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Genera unidades didácticas en minutos alineadas a los Objetivos de Aprendizaje (OA) oficiales, con cronograma clase a clase, mediciones científicas y criterios de evaluación formativa.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-slate-500">
                <FileCheck className="w-4 h-4 text-[#0a0047] shrink-0" />
                <span>Alineación curricular y rúbricas</span>
              </div>
            </div>

            {/* Etapa 3.
                Antes decía «Crea Soluciones Maker», y prometía guiar la
                construcción de prototipos con Arduino y micro:bit. La
                plataforma no hace eso: sus rutas se resuelven con huincha,
                vara, termómetro y tarros, que es lo que hay en una escuela
                rural. La tercera fase que las rutas SÍ tienen es la que
                cierra el proyecto: entregarle el resultado a alguien de la
                comunidad, que es lo que separa un proyecto de una actividad
                larga. */}
            <div className="bg-white rounded-2xl p-7 text-slate-900 border-t-4 border-[#f97316] shadow-lg flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="w-9 h-9 rounded-xl bg-orange-100 text-[#f97316] font-extrabold text-sm flex items-center justify-center">03</span>
                  <span className="text-xs font-bold uppercase tracking-wider text-orange-700 bg-orange-50 px-2.5 py-1 rounded-full">
                    {t("home.methodology.p3badge", "Fase 3 · Entrega")}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">
                  {t("home.methodology.p3title", "Entregan a la comunidad")}
                </h3>
                <div className="text-xs font-bold text-orange-600 uppercase tracking-wide mb-3">
                  {t("home.methodology.p3kicker", "Con material que ya está en la escuela")}
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {t(
                    "home.methodology.p3body",
                    "El curso sale a medir con huincha, vara y termómetro, saca sus propios números y se los entrega a alguien de verdad: el comité de agua, la dirección o las familias. Los datos tienen que estar bien porque alguien los va a usar, no porque los revise el profesor."
                  )}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-slate-500">
                <HandHeart className="w-4 h-4 text-[#f97316] shrink-0" aria-hidden />
                <span>{t("home.methodology.p3foot", "Un destinatario real esperando el resultado")}</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
