import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Play, ArrowRight, MapPin, BookOpen, Wrench } from "lucide-react";
import homeBg from "../../../assets/images/home-bg.png";

interface HeroSectionProps {
  onStart: () => void;
  onExplore: () => void;
}

const STEP_ICONS = [MapPin, BookOpen, Wrench] as const;
const STEP_COLORS = [
  { bg: "bg-emerald-50", text: "text-emerald-600", ring: "ring-emerald-100", label: "bg-emerald-100 text-emerald-700" },
  { bg: "bg-blue-50", text: "text-blue-600", ring: "ring-blue-100", label: "bg-blue-100 text-blue-700" },
  { bg: "bg-amber-50", text: "text-amber-600", ring: "ring-amber-100", label: "bg-amber-100 text-amber-700" },
];

export default function HeroSection({ onStart, onExplore }: HeroSectionProps) {
  const { t } = useTranslation();
  const fullTitle = t("home.hero.title");
  const [displayedText, setDisplayedText] = useState("");
  const [activeStep, setActiveStep] = useState(0);

  // Typewriter effect
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
    return () => window.clearInterval(interval);
  }, [fullTitle]);

  // Auto-cycle steps
  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveStep((s) => (s + 1) % 3);
    }, 4000);
    return () => window.clearInterval(interval);
  }, []);

  const steps = ["explore", "learn", "create"] as const;

  return (
    <section className="relative isolate overflow-hidden px-4 pb-8 pt-20 text-center sm:pb-12 sm:pt-24 md:pb-16 md:pt-32">
      {/* Background */}
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
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/95 px-4 py-2 text-sm font-medium text-slate-600 shadow-sm">
          <MapPin className="h-4 w-4 text-emerald-600" />
          {t("home.hero.steps.explore.label")} · {t("home.hero.steps.learn.label")} · {t("home.hero.steps.create.label")}
        </div>

        {/* Title */}
        <h1 className="mx-auto max-w-5xl text-3xl font-semibold leading-[0.92] tracking-[-0.07em] text-[#111217] sm:text-5xl md:text-7xl lg:text-8xl">
          {displayedText}
          <span className="ml-1 inline-block animate-pulse text-emerald-500">|</span>
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mt-8 max-w-2xl text-base leading-8 text-slate-500 md:text-lg">
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

        {/* Animated steps — how it works */}
        <div className="mx-auto mt-16 max-w-4xl md:mt-20">
          {/* Step indicators */}
          <div className="mb-8 flex items-center justify-center gap-2">
            {steps.map((key, i) => (
              <button
                key={key}
                onClick={() => setActiveStep(i)}
                className={[
                  "rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-300",
                  activeStep === i
                    ? `${STEP_COLORS[i].label} shadow-sm`
                    : "bg-slate-100 text-slate-400 hover:text-slate-600",
                ].join(" ")}
              >
                {t(`home.hero.steps.${key}.label`)}
              </button>
            ))}
          </div>

          {/* Step cards */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {steps.map((key, i) => {
              const Icon = STEP_ICONS[i];
              const colors = STEP_COLORS[i];
              const isActive = activeStep === i;

              return (
                <div
                  key={key}
                  onClick={() => setActiveStep(i)}
                  className={[
                    "group cursor-pointer rounded-[1.5rem] border p-6 text-left transition-all duration-500",
                    isActive
                      ? `border-slate-200 bg-white shadow-lg shadow-slate-950/5 scale-[1.03]`
                      : "border-slate-100 bg-white/60 shadow-sm hover:border-slate-200 hover:bg-white",
                  ].join(" ")}
                >
                  {/* Icon */}
                  <div
                    className={[
                      "mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl ring-4 transition-all duration-500",
                      isActive ? `${colors.bg} ${colors.text} ${colors.ring}` : "bg-slate-50 text-slate-400 ring-slate-50",
                    ].join(" ")}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  {/* Step number */}
                  <span
                    className={[
                      "mb-2 inline-block text-xs font-bold uppercase tracking-widest transition-colors duration-500",
                      isActive ? colors.text : "text-slate-300",
                    ].join(" ")}
                  >
                    0{i + 1}
                  </span>

                  {/* Title */}
                  <h3 className="mb-1.5 text-base font-semibold text-slate-950">
                    {t(`home.hero.steps.${key}.title`)}
                  </h3>

                  {/* Description */}
                  <p
                    className={[
                      "text-sm leading-relaxed transition-all duration-500",
                      isActive ? "text-slate-600" : "text-slate-400",
                    ].join(" ")}
                  >
                    {t(`home.hero.steps.${key}.desc`)}
                  </p>

                  {/* Progress bar */}
                  <div className="mt-4 h-1 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={[
                        "h-full rounded-full transition-all duration-[4000ms] ease-linear",
                        isActive ? "w-full" : "w-0",
                        i === 0 ? "bg-emerald-400" : i === 1 ? "bg-blue-400" : "bg-amber-400",
                      ].join(" ")}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Connector line (desktop) */}
          <div className="mt-6 hidden items-center justify-center gap-0 md:flex">
            {steps.map((_, i) => (
              <div key={i} className="flex items-center">
                <div
                  className={[
                    "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all duration-500",
                    activeStep >= i
                      ? `${STEP_COLORS[i].bg} ${STEP_COLORS[i].text}`
                      : "bg-slate-100 text-slate-300",
                  ].join(" ")}
                >
                  {i + 1}
                </div>
                {i < 2 && (
                  <div className="h-0.5 w-24 lg:w-32">
                    <div
                      className={[
                        "h-full rounded-full transition-all duration-700",
                        activeStep > i ? "bg-slate-300" : "bg-slate-100",
                      ].join(" ")}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
