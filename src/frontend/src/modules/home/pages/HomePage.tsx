import HeroSection from "../components/HeroSection";
import CountrySection from "../components/CountrySection";
import PillarsSection from "../components/PillarsSection";
import PlaceBasedLearningSection from "../components/PlaceBasedLearningSection";
import ContactSection from "../components/ContactSection";
import CallToAction from "../components/CallToAction";

export default function HomePage() {
  const goStart = () => {
    const el = document.getElementById("territorios");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const goExplore = () => {
    const el = document.getElementById("pilares");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <main className="min-h-screen bg-white text-[#111217]">
      {/* 1. Hero Principal Preservado (Sin Makerspaces) */}
      <HeroSection onStart={goStart} onExplore={goExplore} />

      {/* 2. Oportunidades STEM contextualizadas (Selector Chile / Brasil) */}
      <CountrySection />

      {/* 3. Pilares Fundamentales estilo iNaturalist */}
      <div id="pilares">
        <PillarsSection />
      </div>

      {/* 4. El poder del aprendizaje basado en el lugar */}
      <PlaceBasedLearningSection />

      {/* 5. Contacto & Alianzas para Escuelas y Docentes */}
      <ContactSection />

      {/* 6. Call to Action final */}
      <CallToAction onStart={goStart} />
    </main>
  );
}
