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

    // como detectar / salvar preferência
    detection: {
      order: ["localStorage", "navigator"],
      lookupLocalStorage: "app:lang",
      caches: ["localStorage"]
    }
  });

export default i18n;