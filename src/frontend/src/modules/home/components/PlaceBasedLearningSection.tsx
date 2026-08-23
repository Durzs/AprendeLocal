import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ChevronRight } from "lucide-react";

export default function PlaceBasedLearningSection() {
  const { t } = useTranslation();

  const stories = [
    {
      id: "species-threatened",
      title: t(
        "home.placeBased.story1.title",
        "Rescatando el saber de las especies amenazadas"
      ),
      description: t(
        "home.placeBased.story1.desc",
        "Estudiantes de Curarrehue utilizaron visión por computadora y sensores de humedad para registrar árboles milenarios y catalogar hongos medicinales locales."
      ),
      school: t(
        "home.placeBased.story1.school",
        "Escuela Rural San Gabriel"
      ),
      location: "Chile",
      image:
        "https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "irrigation-sensors",
      title: t(
        "home.placeBased.story2.title",
        "Riego automatizado contra la sequía estacional"
      ),
      description: t(
        "home.placeBased.story2.desc",
        "Diseño de estaciones meteorológicas y micro-riego solar para optimizar el agua en invernaderos escolares, aumentando el rendimiento en un 40%."
      ),
      school: t("home.placeBased.story2.school", "Liceo Lonquimay"),
      location: "Chile",
      image:
        "https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "water-protection",
      title: t(
        "home.placeBased.story3.title",
        "Protegiendo los ecosistemas y cuencas locales"
      ),
      description: t(
        "home.placeBased.story3.desc",
        "Comunidades educativas crearon boyas flotantes con microcontroladores para alertar a vecinos sobre cambios en la calidad del agua de los ríos."
      ),
      school: t("home.placeBased.story3.school", "Club Maker del Sur"),
      location: "Chile & Brasil",
      image:
        "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80",
    },
  ];

  return (
    <section className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-14 text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-semibold tracking-[-0.055em] text-[#111217] leading-[0.95] sm:text-4xl md:text-5xl">
            {t(
              "home.placeBased.title",
              "El poder del aprendizaje basado en el lugar"
            )}
          </h2>
          <p className="mt-5 text-base sm:text-lg leading-relaxed text-slate-600">
            {t(
              "home.placeBased.subtitle",
              "Historias reales de estudiantes y docentes que crearon ciencia y tecnología conectadas con su entorno:"
            )}
          </p>
        </div>

        {/* Story Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stories.map((story) => (
            <article
              key={story.id}
              className="flex flex-col overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl group"
            >
              {/* Photo with Overlay Title */}
              <div className="relative h-60 w-full overflow-hidden bg-slate-100">
                <img
                  src={story.image}
                  alt={story.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent p-5 flex items-end">
                  <h3 className="text-lg font-bold text-white leading-snug tracking-tight">
                    {story.title}
                  </h3>
                </div>
              </div>

              {/* Body */}
              <div className="flex flex-1 flex-col justify-between p-6">
                <p className="mb-6 text-sm leading-relaxed text-slate-600">
                  {story.description}
                </p>

                <div className="flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-500 font-medium">
                  <span>
                    Desarrollado por{" "}
                    <strong className="text-slate-800">{story.school}</strong>
                  </span>
                  <span className="font-semibold text-emerald-700">
                    📍 {story.location}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* CTA Button */}
        <div className="mt-14 text-center">
          <Link
            to="/plataforma"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#709c2a] px-8 py-3.5 text-base font-bold text-white shadow-md transition hover:bg-[#5e8522] hover:shadow-lg hover:-translate-y-0.5"
          >
            <span>{t("home.placeBased.cta", "Ver más proyectos e historias")}</span>
            <ChevronRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
