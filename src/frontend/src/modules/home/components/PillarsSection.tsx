import { useTranslation } from "react-i18next";

export default function PillarsSection() {
  const { t } = useTranslation();

  const pillars = [
    {
      id: "identify",
      title: t("home.pillars.identify.title", "Identificar"),
      desc: t(
        "home.pillars.identify.desc",
        "ecosistemas, flora, fauna, cuencas y problemáticas locales"
      ),
      icon: (
        <svg
          className="w-28 h-28 sm:w-32 sm:h-32 text-emerald-800"
          viewBox="0 0 100 100"
          fill="none"
          stroke="currentColor"
        >
          {/* Corner scan brackets */}
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
          {/* Central Leaf */}
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
      id: "track",
      title: t("home.pillars.track.title", "Monitorear"),
      desc: t(
        "home.pillars.track.desc",
        "variables ambientales y clima de tu territorio"
      ),
      icon: (
        <svg
          className="w-28 h-28 sm:w-32 sm:h-32 text-emerald-800"
          viewBox="0 0 100 100"
          fill="none"
          stroke="currentColor"
        >
          {/* Mushroom */}
          <path d="M30 36C30 25 46 25 46 36H30Z" fill="#52b788" />
          <path d="M36 36V46H40V36" fill="#74c69d" />
          {/* Bug */}
          <ellipse cx="50" cy="68" rx="8" ry="11" fill="#40916c" />
          <circle cx="50" cy="54" r="5" fill="#2d6a4f" />
          <path
            d="M42 63H34M58 63H66M42 72H35M58 72H65"
            stroke="#2d6a4f"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Bird */}
          <path
            d="M62 30C66 26 74 27 76 34C70 36 64 42 60 40C60 36 60 32 62 30Z"
            fill="#1b4332"
          />
          {/* Green Checkmarks */}
          <circle cx="58" cy="24" r="5.5" fill="#22c55e" />
          <path
            d="M56 24L57.5 25.5L60.5 22.5"
            stroke="white"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <circle cx="68" cy="74" r="5.5" fill="#22c55e" />
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
      icon: (
        <svg
          className="w-28 h-28 sm:w-32 sm:h-32 text-emerald-800"
          viewBox="0 0 100 100"
          fill="none"
        >
          {/* Binoculars */}
          <circle
            cx="34"
            cy="50"
            r="18"
            fill="#52b788"
            stroke="#1b4332"
            strokeWidth="3.5"
          />
          <circle
            cx="66"
            cy="50"
            r="18"
            fill="#52b788"
            stroke="#1b4332"
            strokeWidth="3.5"
          />
          <rect x="44" y="46" width="12" height="8" rx="2" fill="#1b4332" />
          {/* Inside lens icons */}
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
      id: "contribute",
      title: t("home.pillars.contribute.title", "Contribuir"),
      desc: t(
        "home.pillars.contribute.desc",
        "a la ciencia comunitaria con soluciones maker"
      ),
      icon: (
        <svg
          className="w-28 h-28 sm:w-32 sm:h-32"
          viewBox="0 0 100 100"
          fill="none"
        >
          {/* Globe */}
          <circle cx="50" cy="54" r="24" fill="#334155" />
          <path
            d="M36 46C40 44 45 48 48 44C52 40 56 42 60 46C64 50 68 52 64 58C60 64 52 68 46 68C40 68 34 62 36 54Z"
            fill="#94a3b8"
          />
          {/* Pin Marker */}
          <path
            d="M58 16C52 16 48 20.5 48 26C48 33.5 58 43 58 43C58 43 68 33.5 68 26C68 20.5 64 16 58 16Z"
            fill="#16a34a"
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
      icon: (
        <svg
          className="w-28 h-28 sm:w-32 sm:h-32 text-emerald-800"
          viewBox="0 0 100 100"
          fill="none"
        >
          {/* Speech Bubble 1 */}
          <path
            d="M22 36C22 26 36 26 48 26C60 26 68 32 68 40C68 48 58 52 48 52C44 52 40 54 34 57C36 53 36 51 34 50C26 48 22 42 22 36Z"
            fill="#a7f3d0"
            stroke="#15803d"
            strokeWidth="2.5"
          />
          <path
            d="M38 38C44 34 52 34 56 38C52 42 44 42 38 38Z"
            fill="#047857"
          />
          {/* Speech Bubble 2 */}
          <path
            d="M52 56C52 49 61 49 70 49C79 49 84 54 84 60C84 66 77 69 70 69C67 69 64 71 60 73C61 70 61 68 60 67C55 66 52 62 52 56Z"
            fill="#86efac"
            stroke="#15803d"
            strokeWidth="2.5"
          />
          <circle cx="68" cy="59" r="3" fill="#047857" />
        </svg>
      ),
    },
  ];

  return (
    <section className="bg-[#f1f6ed] py-14 sm:py-20 border-y border-emerald-900/5">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-[-0.055em] text-[#111217] mb-12 sm:mb-16 leading-[0.95]">
          {t("home.pillars.title", "Con AprendeLocal, puedes:")}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-6 items-start">
          {pillars.map((pillar) => (
            <div
              key={pillar.id}
              className="group flex flex-col items-center text-center p-2 rounded-2xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="mb-4 flex h-32 w-32 sm:h-36 sm:w-36 items-center justify-center transition-transform duration-300 group-hover:scale-105">
                {pillar.icon}
              </div>
              <h3 className="mb-2 text-xl font-bold text-[#111217]">
                {pillar.title}
              </h3>
              <p className="max-w-[220px] text-sm leading-relaxed text-slate-700">
                {pillar.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
