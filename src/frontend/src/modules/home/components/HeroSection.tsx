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
    <section
      id="hero"
      className="relative isolate overflow-hidden px-4 sm:px-6 lg:px-8 py-16 sm:py-24 md:py-28 min-h-[calc(100vh-4rem)] flex flex-col justify-center text-center bg-[#0a0047]"
    >
      {/* El fondo va en el azul de la marca, el mismo de la barra de arriba.
          La ilustración está dibujada para eso: son líneas blancas sobre un
          fondo casi negro, y su color medio es (5, 5, 6). Puesta al 40 % de
          opacidad sobre blanco, que es como estaba, el navegador mezclaba y
          devolvía un gris de (155, 155, 155): el hero entero se veía gris y el
          título negro peleaba contra él. Sobre el azul se ve lo que la
          ilustración es, y a opacidad completa. */}
      <div
        className="absolute inset-0 -z-20 bg-no-repeat pointer-events-none"
        style={{
          backgroundImage: `url(${homeBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center top",
        }}
      />

      {/* Un velo sobre la ilustración, detrás del texto. Las líneas pasan por
          donde va el subtítulo y sin esto compiten con él; con el velo la
          ilustración sigue viéndose y el texto se lee encima. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(10,0,71,0.85)_0%,rgba(10,0,71,0.55)_45%,rgba(10,0,71,0.15)_75%)]"
      />

      <div className="mx-auto max-w-7xl w-full flex flex-col items-center justify-center">
        {/* Title */}
        {/* El titulo completo va en el DOM para quien lo lee con lector de
            pantalla o buscador; lo que se escribe letra a letra es la copia
            visible, que por eso queda oculta a la lectura. */}
        <h1 className="mx-auto max-w-6xl text-3xl font-semibold leading-[0.92] tracking-[-0.07em] text-white sm:text-5xl md:text-7xl lg:text-8xl">
          <span className="sr-only">{fullText}</span>
          <span aria-hidden>
            {displayedText}
            {escribiendo && (
              <span className="ml-1 inline-block animate-pulse text-[#f97316]">|</span>
            )}
          </span>
        </h1>

        {/* Subtitle with Teacher focus */}
        <p className="mx-auto mt-6 max-w-4xl text-base leading-relaxed text-white/80 sm:text-lg">
          {t(
            "home.hero.subtitle",
            "Diseña, planifica e implementa experiencias científicas conectadas a los ríos, cuencas, agricultura y biodiversidad de tu escuela rural, con alineación curricular inmediata."
          )}
        </p>

        {/* CTA buttons */}
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <button
            onClick={onStart}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#f97316] hover:bg-[#ea6a0c] px-8 py-4 text-sm font-bold text-white shadow-lg shadow-black/25 transition hover:-translate-y-0.5 hover:shadow-xl cursor-pointer"
          >
            <Compass className="h-4 w-4 text-white" />
            <span>{t("home.hero.ctaStart", "Comenzar a Planificar")}</span>
          </button>

          <button
            onClick={onExplore}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-white/25 bg-white/10 hover:bg-white/20 px-8 py-4 text-sm font-bold text-white backdrop-blur transition hover:-translate-y-0.5 cursor-pointer"
          >
            <span>{t("home.hero.ctaExplore", "Conoce cómo funciona")}</span>
            <ArrowDown className="h-4 w-4 text-[#f97316]" />
          </button>
        </div>
      </div>
    </section>
  );
}
