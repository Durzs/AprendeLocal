import Header from "./Header";
import Footer from "./Footer";
import { Outlet, useLocation } from "react-router-dom";

export default function Layout() {
  const location = useLocation();

  const hideHeaderPages = ["/entrar", "/cadastrar"];
  const hideHeader = hideHeaderPages.includes(location.pathname);

  return (
    <div className="min-h-screen bg-white text-[#111217]">
      {/* Salto al contenido.
          Quien navega con teclado tenía que pasar por el logotipo, los cinco
          enlaces del menú, el selector de idioma y dos botones antes de llegar
          al texto, en cada página. Este enlace es invisible hasta que recibe
          el foco, que es la primera parada del tabulador. */}
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-[#0a0047] focus:px-5 focus:py-3 focus:text-sm focus:font-bold focus:text-white"
      >
        Saltar al contenido
      </a>

      {!hideHeader && <Header />}
      <div id="contenido">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
