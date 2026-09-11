import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import ptCommon from "./locales/pt/common.json";
import enCommon from "./locales/en/common.json";
import esCommon from "./locales/es/common.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      pt: { common: ptCommon },
      en: { common: enCommon },
      es: { common: esCommon }
    },
    // Español: el piloto es en La Araucanía. Con «pt» de respaldo, un
    // computador de escuela mal configurado servía la plataforma en portugués
    // a un docente chileno, que es el peor primer contacto posible.
    fallbackLng: "es",
    supportedLngs: ["pt", "en", "es"],
    defaultNS: "common",
    interpolation: { escapeValue: false },

    /*
     * El idioma sale de lo que la persona eligió, y de nada más.
     *
     * Antes la lista era ["localStorage", "navigator"]. El navegador decidía
     * cuando no había elección guardada, y ahí aparecía el peor defecto del
     * sitio: un visitante con Chrome en inglés —lo normal en un computador
     * institucional— recibía la portada a medio traducir. El titular en
     * inglés, «¿Qué es AprendeLocal?» en español, los pilares otra vez en
     * inglés y la sección del territorio entera en español. No es que
     * faltaran unas cadenas: `TerritorioSection` y `EtapasSobel` no pasaron
     * nunca por i18n y no tienen una sola llamada a `t()`.
     *
     * Quitando "navigator", quien llega sin haber elegido ve el sitio en
     * español, que es el único idioma completo. El conmutador sigue estando
     * para quien quiera cambiarlo, y esa sí es una decisión suya.
     *
     * Esto tapa el síntoma, no la causa. La causa es que hay tres idiomas
     * declarados y uno solo mantenido, y se arregla de una de dos maneras:
     * traduciendo lo que falta con una comprobación en el build que impida
     * que vuelva a desincronizarse, o dejando solo español y quitando el
     * conmutador. Las dos son decisión de Diego.
     */
    detection: {
      order: ["localStorage"],
      lookupLocalStorage: "app:lang",
      caches: ["localStorage"]
    }
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
    document.documentElement.lang = idioma;
  }
}

sincronizarLang(i18n.resolvedLanguage ?? "es");
i18n.on("languageChanged", sincronizarLang);

export default i18n;