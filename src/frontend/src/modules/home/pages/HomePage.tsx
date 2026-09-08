import { useNavigate } from "react-router-dom";

import { useAuth } from "../../../shared/contexts/AuthContext";
import HeroSection from "../components/HeroSection";
import MethodologySection from "../components/MethodologySection";
import HowItWorksSection from "../components/HowItWorksSection";
import TerritorioSection from "../components/TerritorioSection";
import ContactSection from "../components/ContactSection";
import EscritorioPage from "./EscritorioPage";

/**
 * El inicio, que no es el mismo para todos.
 *
 * La portada le habla a alguien que no sabe qué es esto: explica la idea,
 * enseña los dibujos, invita a escribir. A un docente que ya tiene cuenta y
 * abrió el sitio un lunes a las siete de la mañana eso le sobra entero; él
 * viene a seguir con la ruta que dejó a medias. Son dos personas distintas y
 * hasta ahora recibían la misma pantalla.
 *
 * Mientras se comprueba la sesión no se enseña ninguna de las dos. Adivinar y
 * corregir después hace que la página parpadee de una a otra, y ese parpadeo
 * se lee como que algo falló.
 */
export default function HomePage() {
  const { user, loading } = useAuth();
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
   * Quedan cinco. La entrada, qué es esto, cómo funciona con los dibujos, el
   * territorio, y cómo escribirnos. Los pilares y la formación se fueron a
   * /metodologia y el banco de rutas a /rutas: no se borraron, se mudaron.
   */
  if (loading) {
    return (
      <main className="grid min-h-screen place-items-center bg-white">
        <div className="h-0.5 w-32 overflow-hidden rounded-full bg-slate-200">
          <div className="animar-esperando h-full w-1/4 rounded-full bg-[var(--tinta-600)]" />
        </div>
        <span className="sr-only">Comprobando si tienes la sesión iniciada</span>
      </main>
    );
  }

  if (user) return <EscritorioPage />;

  return (
    <main className="min-h-screen bg-white text-[#111217]">
      <HeroSection onStart={goStart} onExplore={goExplore} />

      {/* Qué es esto */}
      <MethodologySection />

      {/* Cómo funciona, con los dibujos que cambian al bajar */}
      <HowItWorksSection />

      {/* El territorio: la metodología como etapas del viaje, y lo que vive
          ahí con su nombre en mapuzugun. Reemplaza a la rejilla de seis
          tarjetas con enlaces, que era un índice del sitio disfrazado de
          sección: explicaba la aplicación y no decía nada del lugar. */}
      <TerritorioSection />

      {/* La única puerta que queda para una escuela que quiere entrar */}
      <ContactSection />
    </main>
  );
}
