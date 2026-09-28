import { lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../../shared/contexts/AuthContext";
import Cargando from "../../../shared/components/ui/Cargando";
import { useTx } from "../../../shared/tx";
import HeroSection from "../components/HeroSection";
import MethodologySection from "../components/MethodologySection";
import HowItWorksSection from "../components/HowItWorksSection";
import PillarsSection from "../components/PillarsSection";
import ProjectsSection from "../components/ProjectsSection";
import TerritorioSection from "../components/TerritorioSection";
import ContactSection from "../components/ContactSection";
import CallToAction from "../components/CallToAction";

/*
 * El escritorio llega en su propio bloque. Trae el catálogo de rutas escritas,
 * la bitácora y las etapas, y quien ve la portada —que es quien todavía no
 * tiene cuenta, en una conexión que no conocemos— no necesita nada de eso.
 */
const EscritorioPage = lazy(() => import("./EscritorioPage"));

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
  const tx = useTx();
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
   * La portada, otra vez completa.
   *
   * Estuvo recortada a cinco secciones: los pilares se habían mudado a
   * /metodologia y el banco de rutas a /rutas. Diego pidió sacar esas dos
   * subpáginas y devolver su contenido aquí, así que la portada vuelve a la
   * forma que tenía antes del recorte, con el territorio metido donde estaba
   * la rejilla de funciones.
   *
   * Menos «Explora tu territorio», que se fue por repetida: decía «descubre
   * qué especies se han registrado ahí, con nombres en mapuzugun» dos
   * pantallas debajo de la sección del territorio, que enseña exactamente eso
   * con las fichas de las doce especies. El mapa en sí no se pierde: sigue
   * dentro de la plataforma, que es donde se usa para trabajar.
   */
  if (loading) {
    return (
      <main className="grid min-h-screen place-items-center bg-white">
        <div className="h-0.5 w-32 overflow-hidden rounded-full bg-slate-200">
          <div className="animar-esperando h-full w-1/4 rounded-full bg-[var(--tinta-600)]" />
        </div>
        <span className="sr-only">
          {tx("Comprobando si tienes la sesión iniciada", "Verificando se você está conectado")}
        </span>
      </main>
    );
  }

  if (user) {
    return (
      <Suspense fallback={<Cargando />}>
        <EscritorioPage />
      </Suspense>
    );
  }

  return (
    <main className="min-h-screen bg-white text-texto">
      <HeroSection onStart={goStart} onExplore={goExplore} />

      {/* Qué es esto */}
      <MethodologySection />

      {/* Cómo funciona, con los dibujos que cambian al bajar */}
      <HowItWorksSection />

      {/* Los pilares, que estaban en /metodologia */}
      <PillarsSection />

      {/* Cómo se arma una ruta, en tres pasos */}
      <ProjectsSection />

      {/* El territorio: la metodología como etapas del viaje, y lo que vive
          ahí con su nombre en mapuzugun. Reemplaza a la rejilla de seis
          tarjetas con enlaces, que era un índice del sitio disfrazado de
          sección: explicaba la aplicación y no decía nada del lugar. */}
      <TerritorioSection />

      {/* La puerta para una escuela que quiere entrar */}
      <ContactSection />

      <CallToAction onStart={goStart} />
    </main>
  );
}
