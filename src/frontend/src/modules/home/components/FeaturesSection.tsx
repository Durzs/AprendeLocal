import { useTranslation } from "react-i18next";
import { BookOpen, Gamepad2, Microscope, Warehouse } from "lucide-react";

const COUNTRY_FLAGS = [
  "AR", "BO", "BR", "CL", "CO", "CR", "CU", "DO",
  "EC", "SV", "GT", "HN", "MX", "NI", "PA", "PY",
  "PE", "PR", "UY", "VE",
];

const FLAG_EMOJI: Record<string, string> = {
  AR: "\u{1F1E6}\u{1F1F7}", BO: "\u{1F1E7}\u{1F1F4}", BR: "\u{1F1E7}\u{1F1F7}",
  CL: "\u{1F1E8}\u{1F1F1}", CO: "\u{1F1E8}\u{1F1F4}", CR: "\u{1F1E8}\u{1F1F7}",
  CU: "\u{1F1E8}\u{1F1FA}", DO: "\u{1F1E9}\u{1F1F4}", EC: "\u{1F1EA}\u{1F1E8}",
  SV: "\u{1F1F8}\u{1F1FB}", GT: "\u{1F1EC}\u{1F1F9}", HN: "\u{1F1ED}\u{1F1F3}",
  MX: "\u{1F1F2}\u{1F1FD}", NI: "\u{1F1F3}\u{1F1EE}", PA: "\u{1F1F5}\u{1F1E6}",
  PY: "\u{1F1F5}\u{1F1FE}", PE: "\u{1F1F5}\u{1F1EA}", PR: "\u{1F1F5}\u{1F1F7}",
  UY: "\u{1F1FA}\u{1F1FE}", VE: "\u{1F1FB}\u{1F1EA}",
};

const FEATURES = [
  { icon: BookOpen, key: "adaptive" },
  { icon: Gamepad2, key: "gamification" },
  { icon: Microscope, key: "theoryPractice" },
  { icon: Warehouse, key: "makerspaces" },
] as const;

export default function FeaturesSection() {
  const { t } = useTranslation();

  return (
    <section className="border-y border-slate-100 bg-white py-20 md:py-28">
      {/* Country flags carousel */}
      <div className="mb-16 w-full overflow-hidden py-2">
        <div className="flex w-max gap-3 px-4 md:gap-5">
          {COUNTRY_FLAGS.map((code) => (
            <div
              key={code}
              className="grid h-16 w-16 shrink-0 place-items-center rounded-full border border-slate-200 bg-slate-50 text-3xl shadow-sm md:h-20 md:w-20 md:text-4xl"
            >
              <span>{FLAG_EMOJI[code] || code}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Features content */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 max-w-4xl">
          <h2 className="text-4xl font-semibold leading-[0.95] tracking-[-0.055em] text-[#111217] md:text-6xl">
            {t("home.features.title")}
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 md:text-xl">
            {t("home.features.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ icon: Icon, key }) => (
            <div
              key={key}
              className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-950/5"
            >
              <div className="mb-8 grid h-14 w-14 place-items-center rounded-full bg-slate-50 text-slate-950 ring-1 ring-slate-200">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-xl font-semibold tracking-tight text-slate-950">
                {t(`home.features.items.${key}.title`)}
              </h3>
              <p className="text-sm leading-7 text-slate-600">
                {t(`home.features.items.${key}.description`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
