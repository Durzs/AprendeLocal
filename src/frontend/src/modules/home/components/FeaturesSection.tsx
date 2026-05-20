import { useTranslation } from "react-i18next";

type FeatureItem = {
  icon: string;
  title: string;
  description: string;
};

export default function FeaturesSection() {
  const { t } = useTranslation();

  const features: FeatureItem[] = [
    {
      icon: "📚",
      title: t("home.features.items.adaptive.title"),
      description: t("home.features.items.adaptive.description"),
    },
    {
      icon: "🕹️",
      title: t("home.features.items.gamified.title"),
      description: t("home.features.items.gamified.description"),
    },
    {
      icon: "🔬",
      title: t("home.features.items.theoryPractice.title"),
      description: t("home.features.items.theoryPractice.description"),
    },
    {
      icon: "🧰",
      title: t("home.features.items.makerspaces.title"),
      description: t("home.features.items.makerspaces.description"),
    },
  ];

  return (
    <section className="py-12 md:py-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-5xl font-bold text-white drop-shadow mb-3">
            {t("home.features.title")}
          </h2>
          <p className="text-white/80 max-w-2xl mx-auto">
            {t("home.features.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="bg-white/85 backdrop-blur border border-white/40 p-6 rounded-2xl shadow hover:shadow-lg transition"
            >
              <div className="mb-3 text-4xl" aria-hidden="true">
                {feature.icon}
              </div>

              <h3 className="text-lg font-semibold mb-2 text-slate-900">
                {feature.title}
              </h3>

              <p className="text-sm text-slate-700">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}