import { useTranslation } from "react-i18next";
import type { HeroSectionProps } from "../types";

export default function HeroSection({
  onStart,
  onExplore,
}: HeroSectionProps) {
  const { t } = useTranslation();

  return (
    <section className="relative text-center py-20 px-6">
      <div className="max-w-5xl mx-auto rounded-3xl bg-white/35 backdrop-blur border border-white/40 shadow p-10 md:p-14">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white drop-shadow">
          {t("home.hero.title")}
        </h1>

        <p className="max-w-3xl mx-auto text-base md:text-lg text-white/85 mb-10">
          {t("home.hero.subtitle")}
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            aria-label={t("home.hero.ctaStartAria")}
            className="bg-white text-blue-700 px-6 py-3 rounded-lg font-semibold shadow hover:bg-white/90 transition"
            onClick={onStart}
          >
            {t("home.hero.ctaStart")}
          </button>

          <button
            aria-label={t("home.hero.ctaExploreAria")}
            className="bg-white/25 text-blue-700 px-6 py-3 rounded-lg font-semibold backdrop-blur border border-white/40 hover:bg-white/30 transition"
            onClick={onExplore}
          >
            {t("home.hero.ctaExplore")}
          </button>
        </div>
      </div>
    </section>
  );
}