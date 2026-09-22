import { useEffect } from "react";
import { Navigate } from "react-router-dom";

import { elegirSede, type Sede } from "../sede";

/**
 * `/br` y `/cl`: fijan la edición y vuelven a la portada.
 *
 * Al cargar la página desde cero esto ya lo hizo §sede.ts leyendo la
 * dirección. Hace falta igual para cuando se llega aquí sin recargar, por un
 * enlace dentro del sitio.
 */
export default function EntrarEdicion({ sede }: { sede: Sede }) {
  useEffect(() => {
    elegirSede(sede);
  }, [sede]);
  return <Navigate to="/" replace />;
}
