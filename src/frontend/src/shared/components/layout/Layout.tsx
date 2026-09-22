import { useEffect } from "react";
import { Outlet, useMatches } from "react-router-dom";

import Header from "./Header";
import Footer from "./Footer";

/** Lo que una ruta puede declarar sobre sí misma en `handle`. */
type Manejo = {
  /** El nombre de la pantalla, para la pestaña y el lector de pantalla. */
  titulo?: string;
  /** Las pantallas de trabajo no llevan pie. */
  sinPie?: boolean;
};

const NOMBRE = "AprendeLocal";

export default function Layout() {
  const coincidencias = useMatches();
  const manejo = (coincidencias.at(-1)?.handle ?? {}) as Manejo;

  /*
   * El título de la pestaña.
   *
   * La pantalla primero y la marca después: con varias pestañas abiertas se
   * lee el comienzo, y «AprendeLocal · …» repetido en cinco pestañas no deja
   * ver cuál es cuál. La portada conserva su título largo, que es el que
   * indexan los buscadores.
   */
  useEffect(() => {
    document.title = manejo.titulo
      ? `${manejo.titulo} · ${NOMBRE}`
      : `${NOMBRE} · Ciencias con el lugar donde está tu escuela`;
  }, [manejo.titulo]);

  return (
    <div className="flex min-h-screen flex-col bg-white text-[#111217]">
      {/* Salto al contenido.
          Quien navega con teclado tenía que pasar por el logotipo, los
          enlaces del menú, el selector de idioma y dos botones antes de llegar
          al texto, en cada página. Este enlace es invisible hasta que recibe
          el foco, que es la primera parada del tabulador. */}
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-[#0a0047] focus:px-5 focus:py-3 focus:text-sm focus:font-bold focus:text-white"
      >
        Saltar al contenido
      </a>

      {/* La cabecera va en todas las pantallas. El inicio de sesión y el
          registro la escondían, y dejaban a la persona sin logo que llevara
          al inicio ni otra salida que el botón de atrás del navegador. */}
      <Header />

      <div id="contenido" className="flex flex-1 flex-col">
        <Outlet />
      </div>

      {!manejo.sinPie && <Footer />}
    </div>
  );
}
