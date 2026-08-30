/**
 * Cuatro lugares que viajan dentro de la aplicación.
 *
 * Por qué existen. El mapa leía los lugares de la base, y en producción esa
 * consulta vuelve vacía: o la tabla no está poblada en ese proyecto, o su
 * columna de geometría no se puede leer. El resultado era una pantalla que
 * explicaba con mucha educación que no tenía nada que enseñar, que sigue
 * siendo una pantalla vacía.
 *
 * Estos cuatro arreglan eso de la única manera que funciona siempre: no
 * dependen de nada. Son el mismo camino que ya siguen las rutas, y por el
 * mismo motivo —abrir sin señal, sin sesión y sin esperar—, con una razón
 * extra: sin al menos un lugar, no hay nada que probar y el docente no llega
 * a ver para qué sirve la pantalla.
 *
 * De dónde salen las coordenadas. Del propio seed del repositorio
 * (`infra/pois_expansion.sql`), que trae 132 lugares reales de La Araucanía
 * con su punto. No están inventadas ni redondeadas: son las mismas que
 * tendría la base si estuviera cargada.
 *
 * Se eligieron cuatro, y estos cuatro, por dos criterios: que cada uno sirva
 * a una de las rutas escritas, y que estén en comunas distintas para que el
 * mapa no se abra sobre un solo punto.
 *
 * Cuando la base responda con sus lugares, estos no estorban: se funden por
 * nombre y los de la base mandan.
 */

import type { Lugar } from "../../shared/lib/catalogos";

/** Un lugar sugerido dice además a qué ruta sirve, que es lo que le da sentido. */
export type Sugerido = Lugar & { paraRuta: string };

export const LUGARES_SUGERIDOS: Sugerido[] = [
  {
    id: "sugerido-estero-mahuidanche",
    nombre: "Estero Mahuidanche",
    comuna: "Cunco",
    tipo: "hydrological",
    ecosistema: "fluvial",
    descripcion:
      "Estero de aguas limpias que baja de la cordillera. Presencia de fauna bentónica indicadora de calidad.",
    patrimonio: "natural",
    amenazas: ["contaminacion_agricola"],
    punto: { lat: -38.966, lng: -72.095 },
    paraRuta: "agua",
  },
  {
    id: "sugerido-bosque-coigue",
    nombre: "Bosque de Coigüe Mahuidanche",
    comuna: "Cunco",
    tipo: "natural",
    ecosistema: "bosque_nativo",
    descripcion:
      "Bosque adulto de coigüe con sotobosque de helechos y nalcas. Presencia de monito del monte.",
    patrimonio: "natural",
    amenazas: ["tala", "plantaciones_forestales"],
    punto: { lat: -38.975, lng: -72.105 },
    paraRuta: "redes",
  },
  {
    id: "sugerido-trumaos-curacautin",
    nombre: "Suelo Trumaos Curacautín",
    comuna: "Curacautín",
    tipo: "geological",
    ecosistema: "volcanico",
    descripcion:
      "Perfil de suelo de ceniza volcánica visible en corte de camino. Ideal para leer las capas.",
    patrimonio: "natural",
    amenazas: ["erosion"],
    punto: { lat: -38.431, lng: -71.893 },
    paraRuta: "suelo",
  },
  {
    id: "sugerido-vertiente-coigues",
    nombre: "Vertiente Los Coigües",
    comuna: "Melipeuco",
    tipo: "hydrological",
    ecosistema: "vertiente",
    descripcion:
      "Surgencia de agua subterránea rodeada de bosque nativo. Punto de agua para fauna silvestre.",
    patrimonio: "natural",
    amenazas: ["sequia"],
    punto: { lat: -38.802, lng: -71.747 },
    paraRuta: "agua",
  },
];

/**
 * Los de la base primero, los sugeridos para rellenar.
 *
 * Se compara por nombre normalizado y no por identificador: los sugeridos
 * llevan uno inventado, así que por id nunca coincidirían y el mismo estero
 * saldría dos veces en la lista.
 */
export function juntarConSugeridos(deLaBase: Lugar[]): {
  lugares: Lugar[];
  sugeridosUsados: number;
} {
  const clave = (n: string) =>
    n
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .trim();

  const yaEstan = new Set(deLaBase.map((l) => clave(l.nombre)));
  const faltan = LUGARES_SUGERIDOS.filter((s) => !yaEstan.has(clave(s.nombre)));

  return {
    lugares: [...deLaBase, ...faltan],
    sugeridosUsados: faltan.length,
  };
}

/** Para saber si un lugar de la lista viaja con la aplicación o vino de la base. */
export function esSugerido(id: string): boolean {
  return id.startsWith("sugerido-");
}
