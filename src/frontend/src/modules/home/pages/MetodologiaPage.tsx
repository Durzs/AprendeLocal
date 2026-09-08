import { useNavigate } from "react-router-dom";

import PillarsSection from "../components/PillarsSection";
import TeacherTrainingSection from "../components/TeacherTrainingSection";
import CallToAction from "../components/CallToAction";

/**
 * La metodología, con lo que se sacó de la portada.
 *
 * Estas secciones estaban todas en el inicio y lo volvían un folleto de ocho
 * pantallas: un docente bajaba tres veces leyendo variaciones del mismo
 * párrafo. Pero no sobraban, sobraba tenerlas ahí. Quien quiere saber en qué
 * se apoya esto y qué formación hay entra a leerlo; quien solo quiere armar su
 * clase no tropieza con ello camino al botón.
 */
export default function MetodologiaPage() {
  const navegar = useNavigate();

  return (
    <main className="min-h-screen bg-white text-[#111217]">
      <header className="border-b border-slate-100 bg-[var(--tinta-50)] px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="rotulo text-slate-500">
            En qué se apoya
          </p>
          <h1 className="mt-3 text-3xl font-semibold leading-[0.95] tracking-[-0.055em] text-[#111217] sm:text-4xl md:text-5xl">
            La metodología, y qué aprende quien la usa
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">
            Lo que sostiene las rutas y lo que ofrecemos para acompañar a quien
            las lleva a su sala.
          </p>
        </div>
      </header>

      <PillarsSection />
      <TeacherTrainingSection />
      <CallToAction onStart={() => navegar("/crear")} />
    </main>
  );
}
