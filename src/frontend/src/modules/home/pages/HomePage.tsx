import { useNavigate } from "react-router-dom";

import HeroSection from "../components/HeroSection";
import MethodologySection from "../components/MethodologySection";
import HowItWorksSection from "../components/HowItWorksSection";
import ContactSection from "../components/ContactSection";

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

  /*
   * La portada, con lo esencial.
   *
   * Tenía ocho secciones y tres de ellas contaban la misma cosa con palabras
   * distintas: cómo funciona, los pilares, el banco de rutas. Un docente que
   * baja tres pantallas leyendo variaciones del mismo párrafo no aprende más;
   * se cansa antes de llegar al botón.
   *
   * Quedan cuatro. La entrada, qué es esto, cómo funciona con los dibujos, y
   * cómo escribirnos. Fuera van los pilares, el banco de rutas —que repetía lo
   * que ya dicen los dibujos— el mapa, que hoy vive dentro de armar la ruta, y
   * el llamado final, que repetía el botón de arriba en una página que ya no
   * es larga.
   */
  return (
    <main className="min-h-screen bg-white text-[#111217]">
      <HeroSection onStart={goStart} onExplore={goExplore} />

      {/* Qué es esto */}
      <MethodologySection />

      {/* Cómo funciona, con los dibujos que cambian al bajar */}
      <HowItWorksSection />

      {/* La única puerta que queda para una escuela que quiere entrar */}
      <ContactSection />
    </main>
  );
}
