import { useState, useEffect, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { ArrowRight, Mail, UserPlus, Compass } from "lucide-react";
import homeBg from "../../../assets/images/home-bg.png";

interface HeroSectionProps {
  onStart: () => void;
  onExplore: () => void;
}

const CYCLE_MS = 4500;

export default function HeroSection({ onStart, onExplore }: HeroSectionProps) {
  const { t } = useTranslation();
  const fullTitle = t("home.hero.title", "Tu territorio es tu mejor laboratorio STEM");
  const [displayedText, setDisplayedText] = useState("");
  const [activeStep, setActiveStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Scroll scale state (efecto de crecimiento estilo Antigravity)
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollScale, setScrollScale] = useState(0.92);
  const [scrollOpacity, setScrollOpacity] = useState(0.85);

  const stepStartTimeRef = useRef<number>(Date.now());
  const reqAnimRef = useRef<number | null>(null);

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

  // Scroll listener for dynamic expansion scale
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const progressRatio = Math.min(
        Math.max((windowHeight - rect.top) / (windowHeight * 0.7), 0),
        1
      );
      setScrollScale(0.92 + progressRatio * 0.08);
      setScrollOpacity(0.85 + progressRatio * 0.15);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Jump to specific step
  const goToStep = useCallback((i: number) => {
    setActiveStep(i);
    setProgress(0);
    stepStartTimeRef.current = Date.now();
  }, []);

  // Continuous animation loop
  useEffect(() => {
    stepStartTimeRef.current = Date.now();

    const updateLoop = () => {
      if (!isPaused) {
        const elapsed = Date.now() - stepStartTimeRef.current;
        const currentProgress = Math.min((elapsed / CYCLE_MS) * 100, 100);
        setProgress(currentProgress);

        if (elapsed >= CYCLE_MS) {
          setActiveStep((prev) => (prev + 1) % 3);
          stepStartTimeRef.current = Date.now();
          setProgress(0);
        }
      } else {
        stepStartTimeRef.current = Date.now() - (progress / 100) * CYCLE_MS;
      }

      reqAnimRef.current = requestAnimationFrame(updateLoop);
    };

    reqAnimRef.current = requestAnimationFrame(updateLoop);

    return () => {
      if (reqAnimRef.current) cancelAnimationFrame(reqAnimRef.current);
    };
  }, [isPaused, progress]);

  // Data for the 3 steps with iNaturalist-styled illustrated SVGs
  const steps = [
    {
      id: "explore",
      num: 1,
      label: t("home.hero.steps.explore.label", "Explora"),
      title: t("home.hero.steps.explore.title", "Conoce tu territorio"),
      desc: t(
        "home.hero.steps.explore.desc",
        "Identifica ecosistemas, cuencas hídricas y biodiversidad local como punto de partida."
      ),
      summary: "Fase 1: Mapeo y exploración del ecosistema territorial",
      icon: (
        <svg
          className="w-12 h-12 text-emerald-800"
          viewBox="0 0 100 100"
          fill="none"
          stroke="currentColor"
        >
          <path
            d="M22 35V24H35"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M65 24H78V35"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M22 65V76H35"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M65 76H78V65"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M50 32C38 32 34 46 36 64C54 66 68 62 68 50C68 38 58 32 50 32Z"
            fill="#2d6a4f"
            stroke="#1b4332"
            strokeWidth="2"
          />
          <path
            d="M36 64C48 54 56 46 64 36"
            stroke="#d8f3dc"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      ),
    },
    {
      id: "learn",
      num: 2,
      label: t("home.hero.steps.learn.label", "Aprende"),
      title: t("home.hero.steps.learn.title", "Conecta con STEM"),
      desc: t(
        "home.hero.steps.learn.desc",
        "Cursos y herramientas que unen ciencia y sensores con los problemas reales de tu entorno."
      ),
      summary: "Fase 2: Conexión de hipótesis con sensores y metodología STEM",
      icon: (
        <svg className="w-12 h-12" viewBox="0 0 100 100" fill="none">
          <circle
            cx="34"
            cy="50"
            r="17"
            fill="#52b788"
            stroke="#1b4332"
            strokeWidth="3.5"
          />
          <circle
            cx="66"
            cy="50"
            r="17"
            fill="#52b788"
            stroke="#1b4332"
            strokeWidth="3.5"
          />
          <rect x="44" y="46" width="12" height="8" rx="2" fill="#1b4332" />
          <circle cx="34" cy="50" r="4" fill="#1b4332" />
          <path
            d="M34 42V40M34 60V58M26 50H24M44 50H42"
            stroke="#1b4332"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M66 44L68 47L72 47L69 50L70 54L66 52L62 54L63 50L60 47L64 47Z"
            fill="#d8f3dc"
          />
        </svg>
      ),
    },
    {
      id: "create",
      num: 3,
      label: t("home.hero.steps.create.label", "Crea"),
      title: t("home.hero.steps.create.title", "Construye soluciones"),
      desc: t(
        "home.hero.steps.create.desc",
        "Diseña proyectos y prototipos reales que impacten positivamente a tu comunidad."
      ),
      summary: "Fase 3: Construcción de prototipos y divulgación comunitaria",
      icon: (
        <svg className="w-12 h-12" viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="54" r="22" fill="#334155" />
          <path
            d="M36 46C40 44 45 48 48 44C52 40 56 42 60 46C64 50 68 52 64 58C60 64 52 68 46 68C40 68 34 62 36 54Z"
            fill="#94a3b8"
          />
          <path
            d="M58 16C52 16 48 20.5 48 26C48 33.5 58 43 58 43C58 43 68 33.5 68 26C68 20.5 64 16 58 16Z"
            fill="#16a34a"
          />
          <circle cx="58" cy="25" r="3" fill="white" />
        </svg>
      ),
    },
  ];

  // Calculate dynamic path progress width
  const pathWidthPercent = activeStep === 0 ? 0 : activeStep === 1 ? 50 : 100;

  return (
    <section className="relative isolate overflow-hidden px-4 sm:px-6 lg:px-8 pb-16 pt-20 text-center sm:pb-20 sm:pt-24 md:pb-28 md:pt-32">
      {/* Background with constellation line art */}
      <div
        className="absolute inset-0 -z-20 bg-no-repeat"
        style={{
          backgroundImage: `url(${homeBg})`,
          backgroundSize: "100%",
          backgroundPosition: "center top",
        }}
      />

      <div className="mx-auto max-w-7xl">
        {/* Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/95 px-4 py-2 text-sm font-medium text-slate-600 shadow-sm">
          <Compass className="h-4 w-4 text-emerald-600" />
          {steps.map((s) => s.label).join(" · ")}
        </div>

        {/* Title */}
        <h1 className="mx-auto max-w-5xl text-3xl font-semibold leading-[0.92] tracking-[-0.07em] text-[#111217] sm:text-5xl md:text-7xl lg:text-8xl">
          {displayedText}
          <span className="ml-1 inline-block animate-pulse text-emerald-500">|</span>
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mt-8 max-w-3xl text-base leading-8 text-slate-500 md:text-lg">
          {t(
            "home.hero.subtitle",
            "Descubre cómo los ríos, bosques y comunidades de tu entorno se convierten en proyectos de ciencia, tecnología e ingeniería. Aprende creando soluciones reales para tu territorio."
          )}
        </p>

        {/* CTA buttons */}
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            onClick={onStart}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#111217] px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-slate-950/10 transition hover:-translate-y-0.5 hover:shadow-xl cursor-pointer"
          >
            <Compass className="h-4 w-4 text-emerald-400" />
            {t("home.hero.ctaStart", "Comenzar en mi Territorio")}
          </button>

          <button
            onClick={onExplore}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-8 py-4 text-sm font-semibold text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg cursor-pointer"
          >
            {t("home.hero.ctaExplore", "Conoce cómo funciona")}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {/* Contact / signup line */}
        <div className="mt-6 flex flex-col items-center gap-2 sm:flex-row sm:justify-center sm:gap-4">
          <span className="text-sm text-slate-400">
            {t("home.hero.contactLine", "¿Quieres llevar AprendeLocal a tu escuela o comunidad?")}
          </span>
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

        {/* ========================================================================= */}
        {/* RUTA TERRITORIAL CONECTADA (CON EFECTO DE CRECIMIENTO SCROLL-DRIVEN)      */}
        {/* ========================================================================= */}
        <div
          ref={containerRef}
          className="mx-auto mt-16 max-w-5xl md:mt-24 text-left transition-all duration-300 ease-out will-change-transform"
          style={{
            transform: `scale(${scrollScale})`,
            opacity: scrollOpacity,
          }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="relative rounded-[2.5rem] border border-slate-200/90 bg-white/95 p-6 sm:p-12 shadow-2xl shadow-slate-950/8 backdrop-blur-md">
            
            <div className="relative">
              {/* Connecting background pathway */}
              <div className="hidden md:block absolute top-[44px] left-[15%] right-[15%] h-1.5 bg-slate-100 -translate-y-1/2 z-0 rounded-full" />

              {/* Dynamic filled pathway */}
              <div className="hidden md:block absolute top-[44px] left-[15%] right-[15%] h-1.5 -translate-y-1/2 z-0 rounded-full overflow-hidden pointer-events-none">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${pathWidthPercent}%` }}
                />
              </div>

              {/* 3 Step Nodes */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                {steps.map((step, idx) => {
                  const isActive = activeStep === idx;
                  const isDone = idx < activeStep;

                  return (
                    <button
                      key={step.id}
                      type="button"
                      onClick={() => goToStep(idx)}
                      className={[
                        "group flex flex-col items-center text-center cursor-pointer p-4 rounded-3xl transition-all duration-500",
                        isActive
                          ? "bg-white shadow-lg shadow-emerald-950/5 scale-105 opacity-100 ring-1 ring-slate-200"
                          : "bg-white/40 hover:bg-white hover:opacity-100 opacity-60",
                      ].join(" ")}
                    >
                      {/* Illustrated Circular Node */}
                      <div
                        className={[
                          "w-20 h-20 rounded-3xl flex items-center justify-center mb-4 transform transition-all duration-500",
                          isActive
                            ? "bg-emerald-50 border-2 border-emerald-500 text-emerald-800 shadow-md animate-node-pulse"
                            : "bg-slate-50 border-2 border-slate-200 text-slate-400 shadow-sm",
                        ].join(" ")}
                      >
                        {step.icon}
                      </div>

                      {/* Step Pill */}
                      <div
                        className={[
                          "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 transition",
                          isActive
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-slate-100 text-slate-500",
                        ].join(" ")}
                      >
                        <span
                          className={[
                            "w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-black",
                            isActive
                              ? "bg-emerald-700 text-white"
                              : "bg-slate-300 text-slate-700",
                          ].join(" ")}
                        >
                          {step.num}
                        </span>
                        <span>{step.label}</span>
                      </div>

                      {/* Title */}
                      <h3
                        className={[
                          "text-base font-bold mb-1.5 transition",
                          isActive ? "text-slate-900" : "text-slate-700",
                        ].join(" ")}
                      >
                        {step.title}
                      </h3>

                      {/* Description */}
                      <p
                        className={[
                          "text-xs sm:text-sm leading-relaxed max-w-xs transition",
                          isActive ? "text-slate-600" : "text-slate-400",
                        ].join(" ")}
                      >
                        {step.desc}
                      </p>

                      {/* Individual Timer Bar */}
                      <div className="w-20 h-1 bg-slate-100 rounded-full mt-4 overflow-hidden">
                        <div
                          className="h-full bg-emerald-600 rounded-full transition-all duration-100"
                          style={{
                            width: isActive ? `${progress}%` : isDone ? "100%" : "0%",
                          }}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom summary bar */}
            <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-medium text-slate-500">
              <div className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{steps[activeStep].summary}</span>
              </div>
              <div className="text-emerald-700 font-bold text-[11px] uppercase tracking-wider">
                Ruta Continua AprendeLocal
              </div>
            </div>

          </div>
        </div>

      </div>

      <style>{`
        @keyframes nodePulse {
          0% {
            box-shadow: 0 0 0 0 rgba(22, 163, 74, 0.4);
          }
          70% {
            box-shadow: 0 0 0 14px rgba(22, 163, 74, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(22, 163, 74, 0);
          }
        }
        .animate-node-pulse {
          animation: nodePulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </section>
  );
}
