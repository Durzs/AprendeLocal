/**
 * Los lugares de ejemplo del demo, aparte de la consulta a iNaturalist para
 * que el correo de la ruta (§supabase/functions/enviar-ruta) pueda nombrarlos
 * sin cargar las especies. Ver §catalogoCorreo.ts.
 */

import { EJEMPLO_ARAUCANIA, EJEMPLO_RIO } from "../sequences/metodo/lugar";
import type { Sede } from "../../shared/sede";

export type Lugar = {
  id: string;
  nombre: string;
  lat: number;
  lng: number;
};

/**
 * Los lugares de ejemplo de cada edición.
 *
 * Son puntos reales, con agua o monte cerca, para que la consulta devuelva
 * algo que se reconozca. El primero de cada lista es el mismo ejemplo que usa
 * el cuaderno, para que quien siga después en su cuenta vea lo mismo.
 */
export const LUGARES: Record<Sede, Lugar[]> = {
  cl: [
    { id: "curarrehue", nombre: EJEMPLO_ARAUCANIA.nombre, lat: EJEMPLO_ARAUCANIA.lat, lng: EJEMPLO_ARAUCANIA.lng },
    { id: "temuco", nombre: "Temuco, río Cautín", lat: -38.7359, lng: -72.5904 },
    { id: "valdivia", nombre: "Valdivia, humedales", lat: -39.8142, lng: -73.2459 },
    { id: "concepcion", nombre: "Concepción, río Biobío", lat: -36.8201, lng: -73.0444 },
    { id: "santiago", nombre: "Santiago, cerro San Cristóbal", lat: -33.4254, lng: -70.6331 },
    { id: "valparaiso", nombre: "Valparaíso", lat: -33.0472, lng: -71.6127 },
  ],
  br: [
    { id: "tijuca", nombre: EJEMPLO_RIO.nombre, lat: EJEMPLO_RIO.lat, lng: EJEMPLO_RIO.lng },
    { id: "botafogo", nombre: "Enseada de Botafogo, Baía de Guanabara", lat: -22.9469, lng: -43.1823 },
    { id: "guaratiba", nombre: "Manguezais de Guaratiba", lat: -23.01, lng: -43.58 },
    { id: "niteroi", nombre: "Niterói", lat: -22.8832, lng: -43.1034 },
  ],
};

