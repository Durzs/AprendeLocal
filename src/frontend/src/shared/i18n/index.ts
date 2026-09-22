import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import ptCommon from "./locales/pt/common.json";
import enCommon from "./locales/en/common.json";
import esCommon from "./locales/es/common.json";
import { SEDES, idiomaDebido, sedeActual, suscribirSede } from "../sede";

const LLAVE_IDIOMA = "app:lang";

/*
 * El idioma sale de la edición, y de la persona si eligió otro.
 *
 * Antes el detector miraba solo lo guardado y caía en español. Eso tapaba un
 * defecto viejo —un Chrome en inglés recibía la portada a medio traducir—
 * pero dejaba a un docente carioca en español hasta que encontrara el
 * conmutador. Ahora cada edición trae su idioma (§sede.ts), y lo guardado solo
 * cuenta si la persona lo eligió a mano y su edición lo ofrece.
 */
function idiomaInicial(): string {
  const sede = sedeActual();
  let guardado: string | null = null;
  try {
    guardado = localStorage.getItem(LLAVE_IDIOMA);
  } catch {
    /* Ventana privada. */
  }
  if (guardado && idiomaDebido(sede, guardado) === null) return guardado;
  return SEDES[sede].idioma;
}

function guardarIdioma(idioma: string) {
  try {
    localStorage.setItem(LLAVE_IDIOMA, idioma);
  } catch {
    /* Ventana privada. */
  }
}

i18n.use(initReactI18next).init({
  resources: {
    pt: { common: ptCommon },
    en: { common: enCommon },
    es: { common: esCommon },
  },
  lng: idiomaInicial(),
  // Español: el piloto es en La Araucanía. Con «pt» de respaldo, un
  // computador de escuela mal configurado servía la plataforma en portugués
  // a un docente chileno, que es el peor primer contacto posible.
  fallbackLng: "es",
  supportedLngs: ["pt", "en", "es"],
  defaultNS: "common",
  interpolation: { escapeValue: false },
});

/*
 * El atributo `lang` del documento, al día.
 *
 * Estaba fijo en `es` dentro de index.html y no lo movía nadie. Un lector de
 * pantalla leía el texto en inglés con pronunciación española, y los
 * buscadores indexaban el idioma equivocado. Ahora sigue al idioma activo,
 * también cuando se cambia con el conmutador.
 */
function sincronizarLang(idioma: string) {
  if (typeof document !== "undefined" && idioma) {
    document.documentElement.lang = idioma === "pt" ? "pt-BR" : idioma;
  }
  guardarIdioma(idioma);
}

sincronizarLang(i18n.resolvedLanguage ?? "es");
i18n.on("languageChanged", sincronizarLang);

/*
 * Cuando cambia la edición, cambia el idioma.
 *
 * Pasa al elegir «Brasil» en el selector y al entrar con una cuenta de la
 * otra sede. `idiomaDebido` respeta el inglés si la persona lo eligió.
 */
suscribirSede(() => {
  const debido = idiomaDebido(sedeActual(), i18n.resolvedLanguage ?? "es");
  if (debido) i18n.changeLanguage(debido);
});

export default i18n;
