import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import { useTx } from "../../../shared/tx";

// Las palabras que se escriben y se borran en el titulo.
const ACCIONES = {
  es: ["Identificar", "Monitorear", "Descubrir", "Contribuir", "Aprender"],
  pt: ["Identificar", "Monitorar", "Descobrir", "Contribuir", "Aprender"],
};

export default function PillarsSection() {
  const { t } = useTranslation();
  const tx = useTx();
  const actions = ACCIONES[tx.idioma];

  // Quien pidio menos movimiento ve la primera palabra quieta.
  const [quieto] = useState(
    () => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false
  );
  const [currentActionIndex, setCurrentActionIndex] = useState(0);
  const [typedAction, setTypedAction] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (quieto) return;
    const fullWord = actions[currentActionIndex];
    let timer: number | undefined;

    if (!isDeleting && typedAction.length < fullWord.length) {
      // Typing
      timer = window.setTimeout(() => {
        setTypedAction(fullWord.slice(0, typedAction.length + 1));
      }, 90);
    } else if (!isDeleting && typedAction.length === fullWord.length) {
      // Pause at full word
      timer = window.setTimeout(() => setIsDeleting(true), 1800);
    } else if (isDeleting && typedAction.length > 0) {
      // Deleting
      timer = window.setTimeout(() => {
        setTypedAction(fullWord.slice(0, typedAction.length - 1));
      }, 50);
    } else if (isDeleting && typedAction.length === 0) {
      // Next word, after a breath with the line empty
      timer = window.setTimeout(() => {
        setIsDeleting(false);
        setCurrentActionIndex((prev) => (prev + 1) % actions.length);
      }, 200);
    }

    return () => window.clearTimeout(timer);
  }, [quieto, typedAction, isDeleting, currentActionIndex, actions]);

  const pillars = [
    {
      id: "identify",
      title: t("home.pillars.identify.title", "Identificar"),
      desc: t(
        "home.pillars.identify.desc",
        "ecosistemas, flora, fauna, cuencas y problemáticas locales"
      ),
      floatClass: "animate-float-slow-1",
      hoverColor: "group-hover:text-blue-600",
      icon: (
        <svg
          className="w-28 h-28 sm:w-32 sm:h-32"
          viewBox="0 0 100 100"
          fill="none"
        >
          {/* Corner scan brackets in Vivid Blue */}
          <path
            d="M22 35V24H35"
            stroke="#2563eb"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M65 24H78V35"
            stroke="#2563eb"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M22 65V76H35"
            stroke="#2563eb"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M65 76H78V65"
            stroke="#2563eb"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Central Leaf in Cobalt and Sky */}
          <path
            d="M50 32C38 32 34 46 36 64C54 66 68 62 68 50C68 38 58 32 50 32Z"
            fill="#1d4ed8"
            stroke="#1e40af"
            strokeWidth="2"
          />
          <path
            d="M36 64C48 54 56 46 64 36"
            stroke="#93c5fd"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        </svg>
      ),
    },
    {
      id: "track",
      title: t("home.pillars.track.title", "Monitorear"),
      desc: t(
        "home.pillars.track.desc",
        "variables ambientales y clima de tu territorio"
      ),
      floatClass: "animate-float-slow-2",
      hoverColor: "group-hover:text-orange-600",
      icon: (
        <svg
          className="w-28 h-28 sm:w-32 sm:h-32"
          viewBox="0 0 100 100"
          fill="none"
        >
          {/* Mushroom in Vivid Orange */}
          <path d="M30 36C30 25 46 25 46 36H30Z" fill="#f97316" />
          <path d="M36 36V46H40V36" fill="#fb923c" />
          {/* Sensor Bug in Cobalt Navy */}
          <ellipse cx="50" cy="68" rx="8" ry="11" fill="#1e3a8a" />
          <circle cx="50" cy="54" r="5" fill="#1e40af" />
          <path
            d="M42 63H34M58 63H66M42 72H35M58 72H65"
            stroke="#1e3a8a"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Bird in Deep Indigo */}
          <path
            d="M62 30C66 26 74 27 76 34C70 36 64 42 60 40C60 36 60 32 62 30Z"
            fill="#312e81"
          />
          {/* Electric Amber Badges */}
          <circle cx="58" cy="24" r="5.5" fill="#f59e0b" />
          <path
            d="M56 24L57.5 25.5L60.5 22.5"
            stroke="white"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <circle cx="68" cy="74" r="5.5" fill="#f59e0b" />
          <path
            d="M66 74L67.5 75.5L70.5 72.5"
            stroke="white"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      ),
    },
    {
      id: "discover",
      title: t("home.pillars.discover.title", "Descubrir"),
      desc: t(
        "home.pillars.discover.desc",
        "saberes ancestrales y naturaleza a tu alrededor"
      ),
      floatClass: "animate-float-slow-3",
      hoverColor: "group-hover:text-blue-600",
      icon: (
        <svg
          className="w-28 h-28 sm:w-32 sm:h-32"
          viewBox="0 0 100 100"
          fill="none"
        >
          {/* Binoculars in Royal Blue */}
          <circle
            cx="34"
            cy="50"
            r="18"
            fill="#3b82f6"
            stroke="#1d4ed8"
            strokeWidth="3.5"
          />
          <circle
            cx="66"
            cy="50"
            r="18"
            fill="#3b82f6"
            stroke="#1d4ed8"
            strokeWidth="3.5"
          />
          <rect x="44" y="46" width="12" height="8" rx="2" fill="#1e3a8a" />
          {/* Inside lens icons */}
          <circle cx="34" cy="50" r="4" fill="#1e3a8a" />
          <path
            d="M34 42V40M34 60V58M26 50H24M44 50H42"
            stroke="#1e3a8a"
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
      id: "contribute",
      title: t("home.pillars.contribute.title", "Contribuir"),
      desc: t(
        "home.pillars.contribute.desc",
        "a la ciencia del territorio con lo que observan y miden"
      ),
      floatClass: "animate-float-slow-4",
      hoverColor: "group-hover:text-orange-600",
      icon: (
        <svg
          className="w-28 h-28 sm:w-32 sm:h-32"
          viewBox="0 0 100 100"
          fill="none"
        >
          {/* Globe */}
          <circle cx="50" cy="54" r="24" fill="#1e293b" />
          <path
            d="M36 46C40 44 45 48 48 44C52 40 56 42 60 46C64 50 68 52 64 58C60 64 52 68 46 68C40 68 34 62 36 54Z"
            fill="#64748b"
          />
          {/* Pin Marker in Strong Orange */}
          <path
            d="M58 16C52 16 48 20.5 48 26C48 33.5 58 43 58 43C58 43 68 33.5 68 26C68 20.5 64 16 58 16Z"
            fill="#f97316"
          />
          <circle cx="58" cy="25" r="3" fill="white" />
        </svg>
      ),
    },
    {
      id: "learn",
      title: t("home.pillars.learn.title", "Aprender"),
      desc: t(
        "home.pillars.learn.desc",
        "en comunidad con profesores y escuelas rurales"
      ),
      floatClass: "animate-float-slow-5",
      hoverColor: "group-hover:text-blue-600",
      icon: (
        <svg
          className="w-28 h-28 sm:w-32 sm:h-32"
          viewBox="0 0 100 100"
          fill="none"
        >
          {/* Speech Bubble 1 in Royal Blue */}
          <path
            d="M22 36C22 26 36 26 48 26C60 26 68 32 68 40C68 48 58 52 48 52C44 52 40 54 34 57C36 53 36 51 34 50C26 48 22 42 22 36Z"
            fill="#93c5fd"
            stroke="#1d4ed8"
            strokeWidth="2.5"
          />
          <path
            d="M38 38C44 34 52 34 56 38C52 42 44 42 38 38Z"
            fill="#1e40af"
          />
          {/* Speech Bubble 2 in Electric Orange */}
          <path
            d="M52 56C52 49 61 49 70 49C79 49 84 54 84 60C84 66 77 69 70 69C67 69 64 71 60 73C61 70 61 68 60 67C55 66 52 62 52 56Z"
            fill="#fdba74"
            stroke="#ea580c"
            strokeWidth="2.5"
          />
          <circle cx="68" cy="59" r="3" fill="#c2410c" />
        </svg>
      ),
    },
  ];

  return (
    <section id="habilidades" className="bg-[#f8faff] py-16 sm:py-24 border-y border-blue-900/5 overflow-hidden">
      <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Dynamic Title */}
        <div className="mb-14 sm:mb-18">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-[-0.055em] text-[#111217] leading-[1.05]">
            {/* Un lector de pantalla leeria la palabra a medio escribir; se
                le da la frase entera y la animacion queda solo a la vista. */}
            <span className="sr-only">
              {tx(
                "Con AprendeLocal, puedes identificar, monitorear, descubrir, contribuir y aprender.",
                "Com o AprendeLocal, você pode identificar, monitorar, descobrir, contribuir e aprender."
              )}
            </span>
            <span aria-hidden>
              {tx("Con AprendeLocal, puedes:", "Com o AprendeLocal, você pode:")}{" "}
              <span className="text-blue-600 inline-block min-w-[170px] text-left">
                {quieto ? actions[0] : typedAction}
                {!quieto && (
                  <span className="ml-0.5 inline-block animate-pulse text-orange-500">|</span>
                )}
              </span>
            </span>
          </h2>
        </div>

        {/* 5 Floating Illustrated Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-6 items-start">
          {pillars.map((pillar) => (
            <div
              key={pillar.id}
              className="group flex flex-col items-center text-center p-3 rounded-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer"
            >
              {/* Floating icon wrapper with custom slow keyframe */}
              <div className={`mb-4 flex h-32 w-32 sm:h-36 sm:w-36 items-center justify-center transition-transform duration-300 group-hover:scale-110 ${pillar.floatClass}`}>
                {pillar.icon}
              </div>
              <h3 className={`mb-2 text-xl font-bold text-[#111217] ${pillar.hoverColor} transition`}>
                {pillar.title}
              </h3>
              <p className="max-w-[220px] text-sm leading-relaxed text-slate-600">
                {pillar.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
