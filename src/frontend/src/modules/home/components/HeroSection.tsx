import { useState, useEffect } from "react";
import { Compass, ArrowDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import homeBg from "../../../assets/images/home-bg.png";

interface HeroSectionProps {
  onStart: () => void;
  onExplore: () => void;
}

export default function HeroSection({ onStart, onExplore }: HeroSectionProps) {
  const { t } = useTranslation();

  // El titulo se escribe letra por letra.
  const fullText = t("home.hero.title", "Tu territorio es tu mejor laboratorio STEM");
  const [letras, setLetras] = useState(0);

  // Al cambiar de idioma el titulo cambia entero, asi que se vuelve a escribir
  // desde cero. Sin esto, si el titulo nuevo era mas corto que el anterior el
  // contador ya lo pasaba y en pantalla quedaba el titulo viejo para siempre.
  useEffect(() => {
    setLetras(0);
  }, [fullText]);

  useEffect(() => {
    // Quien pidio menos movimiento en su sistema ve el titulo completo de una.
    const quieto = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (quieto) {
      setLetras(fullText.length);
      return;
    }
    if (letras >= fullText.length) return;
    const t = setTimeout(() => setLetras((n) => n + 1), 35);
    return () => clearTimeout(t);
  }, [letras, fullText]);

  const displayedText = fullText.slice(0, letras);
  const escribiendo = letras < fullText.length;

  return (
    <section id="hero" className="relative isolate overflow-hidden px-4 sm:px-6 lg:px-8 pb-16 pt-12 text-center sm:pb-20 sm:pt-16 md:pb-24 md:pt-20 bg-white border-b border-slate-100">
      {/* Background with constellation line art */}
      <div
        className="absolute inset-0 -z-20 bg-no-repeat opacity-40 pointer-events-none"
        style={{
          backgroundImage: `url(${homeBg})`,
          backgroundSize: "100%",
          backgroundPosition: "center top",
        }}
      />

      <div className="mx-auto max-w-5xl">
        {/* Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-blue-50/90 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-900 shadow-sm animate-pulse-glow">
          <Compass className="h-4 w-4 text-[#f97316]" />
          <span>{t("home.hero.badge", "Educación STEM Basada en el Lugar · Foco Docente")}</span>
        </div>

        {/* Title */}
        {/* El titulo completo va en el DOM para quien lo lee con lector de
            pantalla o buscador; lo que se escribe letra a letra es la copia
            visible, que por eso queda oculta a la lectura. */}
        <h1 className="mx-auto max-w-5xl text-3xl font-semibold leading-[0.92] tracking-[-0.07em] text-[#111217] sm:text-5xl md:text-7xl lg:text-8xl">
          <span className="sr-only">{fullText}</span>
          <span aria-hidden>
            {displayedText}
            {escribiendo && (
              <span className="ml-1 inline-block animate-pulse text-[#f97316]">|</span>
            )}
          </span>
        </h1>

        {/* Subtitle with Teacher focus */}
        <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-slate-600 sm:text-lg">
          {t(
            "home.hero.subtitle",
            "Diseña, planifica e implementa experiencias científicas conectadas a los ríos, cuencas, agricultura y biodiversidad de tu escuela rural, con alineación curricular inmediata."
          )}
        </p>

        {/* CTA buttons */}
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <button
            onClick={onStart}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#0a0047] hover:bg-[#140066] px-8 py-4 text-sm font-bold text-white shadow-lg shadow-[#0a0047]/25 transition hover:-translate-y-0.5 hover:shadow-xl cursor-pointer"
          >
            <Compass className="h-4 w-4 text-amber-300" />
            <span>{t("home.hero.ctaStart", "Comenzar a Planificar")}</span>
          </button>

          <button
            onClick={onExplore}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white hover:bg-slate-50 px-8 py-4 text-sm font-bold text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md cursor-pointer"
          >
            <span>{t("home.hero.ctaExplore", "Conoce cómo funciona")}</span>
            <ArrowDown className="h-4 w-4 text-[#f97316]" />
          </button>
        </div>
      </div>
    </section>
  );
}
