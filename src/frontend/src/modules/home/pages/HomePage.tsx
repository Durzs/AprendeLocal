import { useNavigate } from "react-router-dom";

import HeroSection from "../components/HeroSection";
import MethodologySection from "../components/MethodologySection";
import HowItWorksSection from "../components/HowItWorksSection";
import PillarsSection from "../components/PillarsSection";
import ProjectsSection from "../components/ProjectsSection";
import MapExplorerSection from "../components/MapExplorerSection";
import ContactSection from "../components/ContactSection";
import CallToAction from "../components/CallToAction";

export default function HomePage() {
  const navigate = useNavigate();

  /**
   * El boton grande de la portada.
   *
   * Primero bajaba a la seccion de metodologia, o sea que el llamado principal
   * del sitio devolvia al visitante a leer mas portada. Despues llevaba a la
   * lista de cuatro rutas. Ahora lleva a armarla: la ruta sale de los
   * objetivos que el docente marca y del lugar que describe, no de escoger de
   * una vitrina. Es lo que promete el boton.
   */
  const goStart = () => navigate("/crear");

  const goExplore = () => {
    const el = document.getElementById("como-funciona");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <main className="min-h-screen bg-white text-[#111217]">
      {/* 1. Hero Principal */}
      <HeroSection onStart={goStart} onExplore={goExplore} />

      {/* 2. ¿Qué es AprendeLocal? */}
      <MethodologySection />

      {/* 3. ¿Cómo funciona? (Ciclo Pedagógico en 4 Pasos) */}
      <HowItWorksSection />

      {/* 4. Pilares Fundamentales & Habilidades STEM */}
      <PillarsSection />

      {/* 5. Banco de Proyectos & Rutas de Aprendizaje */}
      <ProjectsSection />

      {/* 6. Explorador Territorial «¿Qué vive aquí?» */}
      <MapExplorerSection />

      {/* 8. Contacto y Alianzas */}
      <ContactSection />

      {/* 9. Llamado a la Acción Final */}
      <CallToAction onStart={goStart} />
    </main>
  );
}
