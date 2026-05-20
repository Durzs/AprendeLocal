import { useTranslation } from "react-i18next";
import type { CallToActionProps } from "../types";

export default function CallToAction({ onStart }: CallToActionProps) {
  const { t } = useTranslation();

  return (
    <section className="py-12 md:py-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="rounded-3xl bg-white/35 backdrop-blur border border-white/40 p-10 md:p-12 shadow text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white drop-shadow mb-4">
            {t("home.cta.title")}
          </h2>

          <p className="max-w-2xl mx-auto mb-8 text-white/85 text-lg">
            {t("home.cta.subtitle")}
          </p>

          <button
            aria-label={t("home.cta.buttonAria")}
            className="bg-white text-blue-700 font-semibold px-6 py-3 rounded-lg shadow hover:bg-white/90 transition"
            onClick={onStart}
          >
            {t("home.cta.button")}
          </button>
        </div>
      </div>
    </section>
  );
}