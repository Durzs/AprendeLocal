import HeroSection from "../components/HeroSection";
import MethodologySection from "../components/MethodologySection";
import HowItWorksSection from "../components/HowItWorksSection";
import PillarsSection from "../components/PillarsSection";
import ProjectsSection from "../components/ProjectsSection";
import TeacherTrainingSection from "../components/TeacherTrainingSection";
import MapExplorerSection from "../components/MapExplorerSection";
import ContactSection from "../components/ContactSection";
import CallToAction from "../components/CallToAction";

export default function HomePage() {
  const goStart = () => {
    const el = document.getElementById("metodologia");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

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

      {/* 2. Metodología & Ruta Territorial (3 Etapas Unificadas Foco Docente) */}
      <MethodologySection />

      {/* 3. ¿Cómo funciona? (Ciclo Pedagógico en 4 Pasos) */}
      <HowItWorksSection />

      {/* 4. Pilares Fundamentales & Habilidades STEM */}
      <PillarsSection />

      {/* 5. Banco de Proyectos & Rutas de Aprendizaje */}
      <ProjectsSection />

      {/* 6. Formación y Acompañamiento Docente */}
      <TeacherTrainingSection />

      {/* 7. Explorador Territorial «¿Qué vive aquí?» */}
      <MapExplorerSection />

      {/* 8. Contacto y Alianzas */}
      <ContactSection />

      {/* 9. Llamado a la Acción Final */}
      <CallToAction onStart={goStart} />
    </main>
  );
}
