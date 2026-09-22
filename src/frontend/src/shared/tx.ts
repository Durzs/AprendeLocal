/**
 * Los textos del cuaderno, en los dos idiomas de las dos ediciones.
 *
 * POR QUÉ NO VAN EN `common.json`
 *
 * La interfaz general —cabecera, portada, cuenta— vive en `common.json`, en
 * tres idiomas, con una llave por frase. El cuaderno es otra cosa: son miles
 * de frases largas, casi todas únicas, escritas para explicarle algo a un
 * docente. Con llaves, cada frase queda en un archivo y su traducción en
 * otro, lejos del componente que la usa, y quien corrige el español no ve que
 * el portugués dice otra cosa.
 *
 * Aquí las dos van juntas, en el mismo sitio del código:
 *
 *     tx("Guardado en este computador", "Salvo neste computador")
 *
 * Quien toca una ve la otra. Y el portugués no es una traducción palabra por
 * palabra: está escrito para un docente de Río, con «córrego» donde el
 * chileno dice «estero» y «responsáveis» donde dice «apoderados».
 *
 * EL INGLÉS
 *
 * El cuaderno no está en inglés. Quien tiene la interfaz en inglés lo ve en
 * el idioma de su edición, que es el del contenido que va a encontrar dentro.
 */

import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { SEDES, useSede, type Sede } from "./sede";

export type Idioma = "es" | "pt";

/** Un texto en los dos idiomas. Para los catálogos, que no son componentes. */
export type Bi<T = string> = { es: T; pt: T };

/** El idioma en que se muestra el contenido, dado el de la interfaz. */
export function idiomaDeContenido(interfaz: string | undefined, sede: Sede): Idioma {
  const base = (interfaz ?? "").split("-")[0];
  if (base === "pt" || base === "es") return base;
  return SEDES[sede].idioma;
}

/** Elige el texto que toca, fuera de un componente. */
export function en<T>(b: Bi<T>, idioma: Idioma): T {
  return b[idioma];
}

export type Tx = {
  <T>(es: T, pt: T): T;
  /** Lo mismo, para un texto que viene de un catálogo. */
  de: <T>(b: Bi<T>) => T;
  idioma: Idioma;
};

/** El idioma del contenido, y que el componente se repinte si cambia. */
export function useIdioma(): Idioma {
  const { i18n } = useTranslation();
  const sede = useSede();
  return idiomaDeContenido(i18n.resolvedLanguage, sede);
}

/**
 * `tx(español, portugués)`.
 *
 * Devuelve el que toca según el idioma activo. Sirve también para trozos de
 * JSX: `tx(<>Con <b>negrita</b></>, <>Com <b>negrito</b></>)`.
 */
export function useTx(): Tx {
  const idioma = useIdioma();
  return useMemo(() => {
    const tx = (<T,>(es: T, pt: T): T => (idioma === "pt" ? pt : es)) as Tx;
    tx.de = <T,>(b: Bi<T>) => b[idioma];
    tx.idioma = idioma;
    return tx;
  }, [idioma]);
}
