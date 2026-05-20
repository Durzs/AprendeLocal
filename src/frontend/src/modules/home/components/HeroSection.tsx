import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Play, ArrowRight, Sparkles } from "lucide-react";
import homeBg from "../../../assets/images/home-bg.png";

interface HeroSectionProps {
  onStart: () => void;
  onExplore: () => void;
}

export default function HeroSection({ onStart, onExplore }: HeroSectionProps) {
  const { t } = useTranslation();
  const fullTitle = t("home.hero.title");
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    setDisplayedText("");
    let index = 0;
    const interval = window.setInterval(() => {
      setDisplayedText(fullTitle.slice(0, index + 1));
      index += 1;
      if (index >= fullTitle.length) {
        window.clearInterval(interval);
      }
    }, 45);
    return () => {
      window.clearInterval(interval);
    };
  }, [fullTitle]);

  return (
    <section className="relative isolate min-h-[720px] overflow-hidden px-4 pb-20 pt-24 text-center md:min-h-[860px] md:pb-28 md:pt-32">
      {/* Background illustration */}
      <div
        className="absolute inset-0 -z-20 bg-no-repeat"
        style={{
          backgroundImage: `url(${homeBg})`,
          backgroundSize: "100%",
          backgroundPosition: "center top",
        }}
      />

      <div className="mx-auto max-w-6xl">
        {/* Badge */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/95 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm">
          <Sparkles className="h-4 w-4 text-blue-600" />
          AprendeLocal
        </div>

        {/* Title with typewriter effect */}
        <h1 className="mx-auto max-w-5xl text-5xl font-semibold leading-[0.92] tracking-[-0.07em] text-[#111217] md:text-7xl lg:text-8xl">
          {displayedText}
          <span className="ml-1 inline-block animate-pulse text-blue-600">|</span>
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mt-8 max-w-2xl text-base leading-8 text-slate-600 md:text-xl">
          {t("home.hero.subtitle")}
        </p>

        {/* CTA buttons */}
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            onClick={onStart}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#111217] px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-950/10 transition hover:-translate-y-0.5 hover:shadow-xl"
          >
            <Play className="h-4 w-4" fill="currentColor" />
            {t("home.hero.ctaStart")}
          </button>

          <button
            onClick={onExplore}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-7 py-3.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            {t("home.hero.ctaExplore")}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
