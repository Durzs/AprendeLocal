import { useState, useEffect } from "react";
import { Compass, ArrowDown } from "lucide-react";
import { useTranslation } from "react-i18next";
// El PNG original pesaba 1,55 MB: mas que todo el JavaScript comprimido del
// sitio, para una ilustracion de linea que se muestra al 40% de opacidad
// detras del titular. En una escuela rural con datos moviles ese archivo era
// el presupuesto entero de la visita, y cargaba antes de que se viera nada.
// El mismo dibujo en webp a 2000 px pesa 64 KB, un 96% menos.
import homeBg from "../../../assets/images/home-bg.webp";

interface HeroSectionProps {
  onStart: () => void;
  onExplore: () => void;
}

export default function HeroSection({ onStart, onExplore }: HeroSectionProps) {
  const { t } = useTranslation();

  // El titulo se escribe letra por letra.
  const fullText = t("home.hero.title", "Tu territorio es tu mejor laboratorio STEM");
  // El contador va pegado al texto que estaba escribiendo. Al cambiar de
  // idioma el titulo cambia entero y tiene que volver a escribirse desde cero:
  // sin esto, si el nuevo era mas corto que el anterior el contador ya lo
  // pasaba y en pantalla quedaba el titulo viejo para siempre. Antes se
  // reiniciaba con un efecto, que pintaba una vez el titulo a medias.
  const [escrito, setEscrito] = useState({ de: fullText, letras: 0 });

  // Quien pidio menos movimiento en su sistema ve el titulo completo de una.
  const [quieto] = useState(
    () => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false
  );

  const letras = quieto ? fullText.length : escrito.de === fullText ? escrito.letras : 0;

  useEffect(() => {
    if (letras >= fullText.length) return;
    const t = setTimeout(() => setEscrito({ de: fullText, letras: letras + 1 }), 35);
    return () => clearTimeout(t);
  }, [letras, fullText]);

  const displayedText = fullText.slice(0, letras);
  const escribiendo = letras < fullText.length;

  return (
    <section id="hero" className="relative isolate overflow-hidden px-4 sm:px-6 lg:px-8 py-16 sm:py-24 md:py-28 min-h-[calc(100vh-4rem)] flex flex-col justify-center text-center bg-white border-b border-slate-100">
      {/* Background with constellation line art */}
      <div
        className="absolute inset-0 -z-20 bg-no-repeat opacity-40 pointer-events-none"
        style={{
          backgroundImage: `url(${homeBg})`,
          backgroundSize: "100%",
          backgroundPosition: "center top",
        }}
      />

      <div className="mx-auto max-w-7xl w-full flex flex-col items-center justify-center">
        {/* Title */}
        {/* El titulo completo va en el DOM para quien lo lee con lector de
            pantalla o buscador; lo que se escribe letra a letra es la copia
            visible, que por eso queda oculta a la lectura. */}
        <h1 className="mx-auto max-w-6xl text-3xl font-semibold leading-[0.92] tracking-[-0.07em] text-[#111217] sm:text-5xl md:text-7xl lg:text-8xl">
          <span className="sr-only">{fullText}</span>
          <span aria-hidden>
            {displayedText}
            {escribiendo && (
              <span className="ml-1 inline-block animate-pulse text-[#f97316]">|</span>
            )}
          </span>
        </h1>

        {/* Subtitle with Teacher focus */}
        <p className="mx-auto mt-6 max-w-4xl text-base leading-relaxed text-slate-600 sm:text-lg">
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
