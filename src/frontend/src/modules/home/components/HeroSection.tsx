import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

interface HeroSectionProps {
  onStart: () => void;
  onExplore: () => void;
}

/**
 * La entrada.
 *
 * LO QUE SE TOMA DE SUTÉRA
 *
 * Diego mandó sutera.ch de referencia. Lo que hace ese sitio, y que aquí
 * sirve, son tres cosas: entra sobre un fondo oscuro parejo en vez de sobre
 * blanco; anota cada pieza con un rótulo diminuto en mayúscula, como una
 * lámina de instrumento; y abre desarmando su propio nombre —«su (underneath)
 * + tera (earth)»— para decir de qué trata antes de explicar nada.
 *
 * Ese último recurso le calza a AprendeLocal mejor que a ningún otro nombre,
 * porque las dos mitades son literalmente las dos entradas del formulario:
 * `aprende` es lo que pide el programa y `local` es lo que hay detrás de la
 * escuela. La portada lo dice, y tres pantallas más abajo la sección del
 * territorio hace lo mismo con `ko`. Es el mismo gesto dos veces, a propósito.
 *
 * LO QUE SE FUE, Y POR QUÉ
 *
 * El fondo era una ilustración de banco: un cohete, un microscopio, un átomo,
 * un notebook y las banderas de México, Perú, Colombia, Brasil, Argentina y
 * Chile en línea azul clara. Tres problemas, y ninguno de estilo. Habla de una
 * presencia en seis países que no existe: el piloto es Temuco. No tiene nada
 * que ver con una escuela rural de La Araucanía, que es de lo que trata todo
 * lo que viene debajo. Y su azul (#a8c0ee) era uno más de los que peleaban
 * entre sí. En su lugar van curvas de nivel, que es lo que se mira antes de
 * salir a terreno.
 */
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
      className="grano relative isolate flex min-h-[calc(100vh-4rem)] flex-col justify-center overflow-hidden px-4 py-16 text-left sm:px-6 sm:py-20 lg:px-8"
      style={{ backgroundColor: "var(--tinta-950)" }}
    >
      <Curvas />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col">
        {/* ── Franja de anotación ──────────────────────────────────────────
            La misma que abre la sección del territorio. Que las dos empiecen
            igual es lo que hace que se lean como un solo documento. */}
        <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 border-b border-white/12 pb-4">
          <span className="rotulo text-[var(--tierra-300)]">
            Escuelas rurales multigrado
          </span>
          <span className="rotulo text-white/40">
            La Araucanía · Temuco 38.7°S 72.6°O
          </span>
        </div>

        {/* ── El nombre, desarmado ─────────────────────────────────────────
            Las dos mitades son las dos preguntas del formulario. */}
        <ul className="mt-10 grid max-w-3xl gap-x-10 gap-y-4 sm:grid-cols-2">
          <li className="animar-hoja animar-hoja-1 flex items-baseline gap-3">
            <span className="nombre text-[var(--crema-clara)]">aprende</span>
            <span className="glosa text-white/45">lo que pide el programa</span>
          </li>
          <li className="animar-hoja animar-hoja-2 flex items-baseline gap-3">
            <span className="nombre text-[var(--crema-clara)]">local</span>
            <span className="glosa text-white/45">lo que hay detrás de la escuela</span>
          </li>
        </ul>

        {/* ── El titular ───────────────────────────────────────────────────
            El titulo completo va en el DOM para quien lo lee con lector de
            pantalla o buscador; lo que se escribe letra a letra es la copia
            visible, que por eso queda oculta a la lectura. */}
        <h1 className="display mt-8 max-w-5xl text-[2.6rem] text-white sm:text-6xl md:text-7xl lg:text-[5.5rem]">
          <span className="sr-only">{fullText}</span>
          <span aria-hidden>
            {displayedText}
            {escribiendo && (
              <span className="ml-1 inline-block animate-pulse text-[var(--tierra-500)]">|</span>
            )}
          </span>
        </h1>

        <p className="mt-7 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">
          {t(
            "home.hero.subtitle",
            "Diseña, planifica e implementa experiencias científicas conectadas a los ríos, cuencas, agricultura y biodiversidad de tu escuela rural, con alineación curricular inmediata."
          )}
        </p>

        {/* ── Los dos botones ──────────────────────────────────────────────
            Un solo acento. El principal era índigo sobre blanco; aquí el
            fondo ya es índigo, así que el que lleva a alguna parte es el
            terracota del logotipo y el otro se sostiene con una línea. */}
        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            onClick={onStart}
            className="group inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-[var(--tierra-600)] px-8 py-4 text-sm font-bold text-white transition hover:bg-[var(--tierra-500)] sm:w-auto cursor-pointer"
          >
            {t("home.hero.ctaStart", "Comenzar a Planificar")}
            <span aria-hidden className="transition-transform group-hover:translate-x-1">
              →
            </span>
          </button>

          <button
            onClick={onExplore}
            className="inline-flex w-full items-center justify-center gap-2.5 rounded-full border border-white/25 px-8 py-4 text-sm font-medium text-white/85 transition hover:border-white/50 hover:text-white sm:w-auto cursor-pointer"
          >
            {t("home.hero.ctaExplore", "Conoce cómo funciona")}
            <span aria-hidden>↓</span>
          </button>
        </div>

        {/* ── Tres cosas que ya son verdad ─────────────────────────────────
            Ninguna es una cifra de vitrina: los sesenta y dos objetivos son
            los de Ciencias Naturales de 5º a 8º que están en la lista, las
            tres semanas son las que dura la ruta que arma, y lo de imprimir
            es lo que hace la aplicación sin señal. */}
        <dl className="mt-14 grid gap-px overflow-hidden border-t border-white/12 pt-8 sm:grid-cols-3 sm:gap-10">
          {[
            ["62", "objetivos de aprendizaje, de 5º a 8º"],
            ["3", "semanas de clases, con sus documentos"],
            ["0", "barras de señal hacen falta para imprimirla"],
          ].map(([cifra, glosa], i) => (
            <div key={cifra} className={`animar-hoja animar-hoja-${i + 3} flex items-baseline gap-3`}>
              <dt className="cifra text-3xl font-semibold text-[var(--tierra-300)] sm:text-4xl">
                {cifra}
              </dt>
              <dd className="text-sm leading-snug text-white/55">{glosa}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

/**
 * Curvas de nivel.
 *
 * Es lo que se mira antes de salir a terreno, y es la forma del triángulo del
 * logotipo repetida hacia afuera. Va detrás de todo, casi apagada: tiene que
 * dar profundidad al fondo sin competir con una sola palabra.
 */
function Curvas() {
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute -right-24 top-1/2 -z-10 h-[130%] w-[85%] -translate-y-1/2 opacity-[0.22] sm:-right-10"
      viewBox="0 0 600 600"
      fill="none"
    >
      <g stroke="var(--tinta-400)" strokeWidth="1" strokeLinejoin="round">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => {
          // Cada curva es la misma cumbre un poco más abajo y un poco más
          // ancha, que es como se ve un cerro en una carta topográfica.
          const medio = 46 + i * 62;
          const cima = 190 + i * 16;
          const pie = 560;
          const hombro = cima + (pie - cima) * 0.42;
          return (
            <path
              key={i}
              d={`M ${300 - medio} ${pie}
                  C ${300 - medio * 0.62} ${hombro} ${300 - medio * 0.34} ${cima + 18} ${300} ${cima}
                  C ${300 + medio * 0.34} ${cima + 18} ${300 + medio * 0.62} ${hombro} ${300 + medio} ${pie}`}
              opacity={0.9 - i * 0.085}
            />
          );
        })}
      </g>
      {/* La cumbre, que es la marca. */}
      <path d="M 300 190 L 346 560 L 254 560 Z" fill="var(--tierra-600)" opacity="0.22" />
    </svg>
  );
}
