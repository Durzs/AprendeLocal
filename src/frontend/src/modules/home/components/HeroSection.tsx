import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { ArrowRight, MapPin, BookOpen, Wrench, Mail, UserPlus, Compass } from "lucide-react";
import homeBg from "../../../assets/images/home-bg.png";

interface HeroSectionProps {
  onStart: () => void;
  onExplore: () => void;
}

const STEP_ICONS = [MapPin, BookOpen, Wrench] as const;
const STEP_COLORS = [
  { accent: "bg-emerald-500", iconBg: "bg-emerald-50", iconText: "text-emerald-600", iconRing: "ring-emerald-100", pill: "bg-emerald-100 text-emerald-700", num: "bg-emerald-50 text-emerald-600", connector: "bg-emerald-400" },
  { accent: "bg-blue-500", iconBg: "bg-blue-50", iconText: "text-blue-600", iconRing: "ring-blue-100", pill: "bg-blue-100 text-blue-700", num: "bg-blue-50 text-blue-600", connector: "bg-blue-400" },
  { accent: "bg-amber-500", iconBg: "bg-amber-50", iconText: "text-amber-600", iconRing: "ring-amber-100", pill: "bg-amber-100 text-amber-700", num: "bg-amber-50 text-amber-600", connector: "bg-amber-400" },
];

const CYCLE_MS = 5000;

export default function HeroSection({ onStart, onExplore }: HeroSectionProps) {
  const { t } = useTranslation();
  const fullTitle = t("home.hero.title", "Tu territorio es tu mejor laboratorio STEM");
  const [displayedText, setDisplayedText] = useState("");
  const [activeStep, setActiveStep] = useState(0);
  const [animKey, setAnimKey] = useState(0);

  // Typewriter effect
  useEffect(() => {
    setDisplayedText("");
    let index = 0;
    const interval = window.setInterval(() => {
      setDisplayedText(fullTitle.slice(0, index + 1));
      index += 1;
      if (index >= fullTitle.length) window.clearInterval(interval);
    }, 45);
    return () => window.clearInterval(interval);
  }, [fullTitle]);

  const goToStep = useCallback((i: number) => {
    setActiveStep(i);
    setAnimKey((k) => k + 1);
  }, []);

  // Auto-cycle steps
  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveStep((prev) => {
        const next = (prev + 1) % 3;
        setAnimKey((k) => k + 1);
        return next;
      });
    }, CYCLE_MS);
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
          <Compass className="h-4 w-4 text-emerald-600" />
          {t("home.hero.steps.explore.label", "Explora")} · {t("home.hero.steps.learn.label", "Aprende")} · {t("home.hero.steps.create.label", "Crea")}
        </div>

        {/* Title */}
        <h1 className="mx-auto max-w-5xl text-3xl font-semibold leading-[0.92] tracking-[-0.07em] text-[#111217] sm:text-5xl md:text-7xl lg:text-8xl">
          {displayedText}
          <span className="ml-1 inline-block animate-pulse text-emerald-500">|</span>
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mt-8 max-w-2xl text-base leading-8 text-slate-500 md:text-lg">
          {t("home.hero.subtitle", "Descubre cómo los ríos, bosques y comunidades de tu entorno se convierten en proyectos de ciencia, tecnología e ingeniería. Aprende creando soluciones reales para tu territorio.")}
        </p>

        {/* CTA buttons (Sin referencias a makerspaces) */}
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            onClick={onStart}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#111217] px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-950/10 transition hover:-translate-y-0.5 hover:shadow-xl cursor-pointer"
          >
            <Compass className="h-4 w-4 text-emerald-400" />
            {t("home.hero.ctaStart", "Comenzar en mi Territorio")}
          </button>

          <button
            onClick={onExplore}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-7 py-3.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg cursor-pointer"
          >
            {t("home.hero.ctaExplore", "Conoce cómo funciona")}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {/* Contact / signup line */}
        <div className="mt-6 flex flex-col items-center gap-2 sm:flex-row sm:justify-center sm:gap-4">
          <span className="text-sm text-slate-400">{t("home.hero.contactLine", "¿Quieres llevar AprendeLocal a tu escuela o comunidad?")}</span>
          <div className="flex items-center gap-3">
            <a
              href="/registro"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600 transition hover:text-emerald-700"
            >
              <UserPlus className="h-3.5 w-3.5" />
              {t("home.hero.ctaSignup", "Crear cuenta gratis")}
            </a>
            <span className="text-slate-200">|</span>
            <a
              href="#contacto"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 transition hover:text-slate-700"
            >
              <Mail className="h-3.5 w-3.5" />
              {t("home.hero.ctaContact", "Contáctanos")}
            </a>
          </div>
        </div>

        {/* ── Animated steps — how it works ── */}
        <div className="mx-auto mt-16 max-w-4xl md:mt-20">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {steps.map((key, i) => {
              const Icon = STEP_ICONS[i];
              const colors = STEP_COLORS[i];
              const isActive = activeStep === i;

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => goToStep(i)}
                  className={[
                    "group relative cursor-pointer rounded-[1.5rem] border p-6 text-left transition-all duration-500",
                    isActive
                      ? "border-slate-200 bg-white shadow-xl shadow-slate-950/[0.06] scale-[1.02]"
                      : "border-transparent bg-white/50 hover:border-slate-200 hover:bg-white hover:shadow-md",
                  ].join(" ")}
                >
                  {/* Accent top bar */}
                  <div
                    className={[
                      "absolute inset-x-6 top-0 h-[3px] rounded-b-full transition-all duration-500",
                      isActive ? `${colors.accent} opacity-100` : "bg-slate-200 opacity-0 group-hover:opacity-40",
                    ].join(" ")}
                  />

                  {/* Icon */}
                  <div
                    className={[
                      "mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl ring-4 transition-all duration-500",
                      isActive ? `${colors.iconBg} ${colors.iconText} ${colors.iconRing}` : "bg-slate-50 text-slate-400 ring-slate-50",
                    ].join(" ")}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  {/* Step number + label pill */}
                  <div className="mb-3 flex items-center gap-2">
                    <span
                      className={[
                        "inline-flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold transition-colors duration-500",
                        isActive ? `${colors.num}` : "bg-slate-100 text-slate-300",
                      ].join(" ")}
                    >
                      {i + 1}
                    </span>
                    <span
                      className={[
                        "rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider transition-all duration-500",
                        isActive ? colors.pill : "bg-transparent text-slate-300",
                      ].join(" ")}
                    >
                      {t(`home.hero.steps.${key}.label`)}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="mb-1.5 text-base font-semibold text-slate-950">
                    {t(`home.hero.steps.${key}.title`)}
                  </h3>

                  {/* Description */}
                  <p
                    className={[
                      "text-sm leading-relaxed transition-colors duration-500",
                      isActive ? "text-slate-600" : "text-slate-400",
                    ].join(" ")}
                  >
                    {t(`home.hero.steps.${key}.desc`)}
                  </p>

                  {/* Progress bar */}
                  <div
                    className={[
                      "mt-5 h-1 overflow-hidden rounded-full bg-slate-100 transition-opacity duration-300",
                      isActive ? "opacity-100" : "opacity-0",
                    ].join(" ")}
                  >
                    <div
                      key={animKey}
                      className={`h-full rounded-full ${colors.accent}`}
                      style={{
                        animation: isActive ? `heroProgress ${CYCLE_MS}ms linear forwards` : "none",
                        width: isActive ? undefined : "0%",
                      }}
                    />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Connector line (desktop) */}
          <div className="mt-8 hidden items-center justify-center gap-0 md:flex">
            {steps.map((_, i) => (
              <div key={i} className="flex items-center">
                <div
                  className={[
                    "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all duration-500",
                    activeStep >= i
                      ? `${STEP_COLORS[i].num}`
                      : "bg-slate-100 text-slate-300",
                  ].join(" ")}
                >
                  {i + 1}
                </div>
                {i < 2 && (
                  <div className="relative h-0.5 w-24 bg-slate-100 lg:w-32">
                    <div
                      className={[
                        "absolute inset-y-0 left-0 rounded-full transition-all duration-700",
                        activeStep > i ? `${STEP_COLORS[i].connector} w-full` : "w-0",
                      ].join(" ")}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes heroProgress {
          from { width: 0%; }
          to   { width: 100%; }
        }
      `}</style>
    </section>
  );
}
