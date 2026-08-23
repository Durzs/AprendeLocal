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

  // Scroll scale state (efecto de crecimiento al hacer scroll)
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

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
      
      const rawProgress = (windowHeight - rect.top) / (windowHeight * 0.75);
      const clamped = Math.min(Math.max(rawProgress, 0), 1);
      setScrollProgress(clamped);
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

  // Continuous and unstoppable animation loop
  useEffect(() => {
    stepStartTimeRef.current = Date.now();

    const updateLoop = () => {
      const elapsed = Date.now() - stepStartTimeRef.current;
      const currentProgress = Math.min((elapsed / CYCLE_MS) * 100, 100);
      setProgress(currentProgress);

      if (elapsed >= CYCLE_MS) {
        setActiveStep((prev) => (prev + 1) % 3);
        stepStartTimeRef.current = Date.now();
        setProgress(0);
      }

      reqAnimRef.current = requestAnimationFrame(updateLoop);
    };

    reqAnimRef.current = requestAnimationFrame(updateLoop);

    return () => {
      if (reqAnimRef.current) cancelAnimationFrame(reqAnimRef.current);
    };
  }, []);

  // Data for the 3 steps with striking Blue & Orange illustrated styling
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
      activeBorder: "border-blue-600 ring-blue-500/30",
      activeBg: "bg-blue-50/80",
      activeBadge: "bg-blue-600 text-white",
      activePill: "bg-blue-100 text-blue-900 border-blue-200",
      barColor: "bg-blue-600",
      icon: (
        <svg
          className="w-12 h-12 text-blue-700"
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
            fill="#2563eb"
            stroke="#1d4ed8"
            strokeWidth="2"
          />
          <path
            d="M36 64C48 54 56 46 64 36"
            stroke="#dbeafe"
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
      activeBorder: "border-indigo-600 ring-indigo-500/30",
      activeBg: "bg-indigo-50/80",
      activeBadge: "bg-indigo-600 text-white",
      activePill: "bg-indigo-100 text-indigo-900 border-indigo-200",
      barColor: "bg-indigo-600",
      icon: (
        <svg className="w-12 h-12" viewBox="0 0 100 100" fill="none">
          <circle
            cx="34"
            cy="50"
            r="17"
            fill="#3b82f6"
            stroke="#1d4ed8"
            strokeWidth="3.5"
          />
          <circle
            cx="66"
            cy="50"
            r="17"
            fill="#3b82f6"
            stroke="#1d4ed8"
            strokeWidth="3.5"
          />
          <rect x="44" y="46" width="12" height="8" rx="2" fill="#1e1b4b" />
          <circle cx="34" cy="50" r="4" fill="#1e1b4b" />
          <path
            d="M34 42V40M34 60V58M26 50H24M44 50H42"
            stroke="#1e1b4b"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M66 44L68 47L72 47L69 50L70 54L66 52L62 54L63 50L60 47L64 47Z"
            fill="#fed7aa"
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
      activeBorder: "border-orange-500 ring-orange-500/30",
      activeBg: "bg-orange-50/80",
      activeBadge: "bg-orange-500 text-white",
      activePill: "bg-orange-100 text-orange-950 border-orange-200",
      barColor: "bg-orange-500",
      icon: (
        <svg className="w-12 h-12" viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="54" r="22" fill="#1e293b" />
          <path
            d="M36 46C40 44 45 48 48 44C52 40 56 42 60 46C64 50 68 52 64 58C60 64 52 68 46 68C40 68 34 62 36 54Z"
            fill="#94a3b8"
          />
          <path
            d="M58 16C52 16 48 20.5 48 26C48 33.5 58 43 58 43C58 43 68 33.5 68 26C68 20.5 64 16 58 16Z"
            fill="#f97316"
          />
          <circle cx="58" cy="25" r="3" fill="white" />
        </svg>
      ),
    },
  ];

  // Calculate dynamic path progress width
  const pathWidthPercent = activeStep === 0 ? 0 : activeStep === 1 ? 50 : 100;

  // Transform calculations for smooth scroll expansion
  const scale = 0.88 + scrollProgress * 0.12; // Scales from 0.88 up to 1.0
  const translateY = (1 - scrollProgress) * 30; // Floats up smoothly
  const opacity = 0.85 + scrollProgress * 0.15;

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
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-white/95 px-4 py-2 text-sm font-semibold text-blue-900 shadow-sm animate-pulse-glow">
          <Compass className="h-4 w-4 text-orange-500" />
          {steps.map((s) => s.label).join(" · ")}
        </div>

        {/* Title */}
        <h1 className="mx-auto max-w-5xl text-3xl font-semibold leading-[0.92] tracking-[-0.07em] text-[#111217] sm:text-5xl md:text-7xl lg:text-8xl">
          {displayedText}
          <span className="ml-1 inline-block animate-pulse text-orange-500">|</span>
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mt-8 max-w-3xl text-base leading-8 text-slate-600 md:text-lg">
          {t(
            "home.hero.subtitle",
            "Descubre cómo los ríos, bosques y comunidades de tu entorno se convierten en proyectos de ciencia, tecnología e ingeniería. Aprende creando soluciones reales para tu territorio."
          )}
        </p>

        {/* CTA buttons */}
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            onClick={onStart}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0a0047] hover:bg-[#140066] px-8 py-4 text-sm font-bold text-white shadow-lg shadow-[#0a0047]/30 transition hover:-translate-y-0.5 hover:shadow-xl cursor-pointer"
          >
            <Compass className="h-4 w-4 text-amber-300" />
            {t("home.hero.ctaStart", "Comenzar en mi Territorio")}
          </button>

          <button
            onClick={onExplore}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-8 py-4 text-sm font-bold text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg cursor-pointer"
          >
            {t("home.hero.ctaExplore", "Conoce cómo funciona")}
            <ArrowRight className="h-4 w-4 text-orange-500" />
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
              className="inline-flex items-center gap-1.5 text-sm font-bold text-orange-600 transition hover:text-orange-700"
            >
              <UserPlus className="h-3.5 w-3.5" />
              {t("home.hero.ctaSignup", "Crear cuenta gratis")}
            </a>
            <span className="text-slate-200">|</span>
            <a
              href="#contacto"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 transition hover:text-blue-600"
            >
              <Mail className="h-3.5 w-3.5" />
              {t("home.hero.ctaContact", "Contáctanos")}
            </a>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RUTA TERRITORIAL CONECTADA: MARCO OSCURO ELEGANTE + TARJETAS BLANCAS CLARAS*/}
        {/* ========================================================================= */}
        <div
          ref={containerRef}
          className="mx-auto mt-16 md:mt-24 text-left w-full max-w-[1360px] transition-all duration-500 ease-out will-change-transform"
          style={{
            transform: `scale(${scale}) translateY(${translateY}px)`,
            opacity: opacity,
          }}
        >
          {/* Marco Exterior Oscuro Elegante (#0f172a - Azul noche carbón) */}
          <div className="relative rounded-[2.5rem] border border-slate-800 bg-[#0f172a] p-6 sm:p-10 md:p-12 shadow-2xl shadow-slate-950/30">
            
            <div className="relative z-10">
              
              {/* Connecting background pathway */}
              <div className="hidden md:block absolute top-[44px] left-[15%] right-[15%] h-1.5 bg-slate-800 -translate-y-1/2 z-0 rounded-full" />

              {/* Dynamic filled pathway (Gradiente Azul Eléctrico a Naranja Vibrante) */}
              <div className="hidden md:block absolute top-[44px] left-[15%] right-[15%] h-1.5 -translate-y-1/2 z-0 rounded-full overflow-hidden pointer-events-none">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-orange-500 rounded-full transition-all duration-700 ease-out shadow-[0_0_10px_rgba(59,130,246,0.6)]"
                  style={{ width: `${pathWidthPercent}%` }}
                />
              </div>

              {/* 3 Step Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 relative z-10">
                {steps.map((step, idx) => {
                  const isActive = activeStep === idx;
                  const isDone = idx < activeStep;

                  return (
                    <button
                      key={step.id}
                      type="button"
                      onClick={() => goToStep(idx)}
                      className={[
                        "group flex flex-col items-center text-center cursor-pointer p-6 sm:p-7 rounded-[2rem] transition-all duration-500",
                        isActive
                          ? `bg-white text-slate-900 shadow-2xl shadow-black/40 scale-105 opacity-100 ring-2 ${step.activeBorder}`
                          : "bg-white/90 hover:bg-white text-slate-800 shadow-lg opacity-75 hover:opacity-100",
                      ].join(" ")}
                    >
                      {/* Illustrated Circular Node */}
                      <div
                        className={[
                          "w-20 h-20 rounded-3xl flex items-center justify-center mb-4 transform transition-all duration-500",
                          isActive
                            ? `${step.activeBg} border-2 ${step.activeBorder} shadow-md animate-node-pulse`
                            : "bg-slate-50 border-2 border-slate-200 text-slate-400 shadow-sm",
                        ].join(" ")}
                      >
                        {step.icon}
                      </div>

                      {/* Step Pill */}
                      <div
                        className={[
                          "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2.5 transition",
                          isActive
                            ? step.activePill
                            : "bg-slate-100 text-slate-600",
                        ].join(" ")}
                      >
                        <span
                          className={[
                            "w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-black",
                            isActive
                              ? step.activeBadge
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
                          "text-lg font-bold mb-2 transition",
                          isActive ? "text-slate-900" : "text-slate-800",
                        ].join(" ")}
                      >
                        {step.title}
                      </h3>

                      {/* Description */}
                      <p className="text-xs sm:text-sm leading-relaxed max-w-xs text-slate-600 transition">
                        {step.desc}
                      </p>

                      {/* Individual Timer Bar */}
                      <div className="w-20 h-1 bg-slate-100 rounded-full mt-4 overflow-hidden">
                        <div
                          className={`h-full ${step.barColor} rounded-full transition-all duration-100`}
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

          </div>
        </div>

      </div>

      <style>{`
        @keyframes nodePulseBlue {
          0% {
            box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.4);
          }
          70% {
            box-shadow: 0 0 0 14px rgba(37, 99, 235, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(37, 99, 235, 0);
          }
        }
        .animate-node-pulse {
          animation: nodePulseBlue 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </section>
  );
}
