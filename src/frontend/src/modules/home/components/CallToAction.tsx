import { useTranslation } from "react-i18next";

interface CallToActionProps {
  onStart: () => void;
}

export default function CallToAction({ onStart }: CallToActionProps) {
  const { t } = useTranslation();

  return (
    <section className="bg-white px-4 py-20 md:py-28 border-t border-slate-100">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="display text-3xl text-texto sm:text-4xl md:text-5xl [text-wrap:balance]">
          {t("home.cta.title", "¿Listo para transformar el aprendizaje en tu territorio?")}
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg leading-relaxed text-slate-600">
          {t(
            "home.cta.subtitle",
            "Únete a docentes, directivos y estudiantes aplicando STEM contextualizado en los desafíos de su entorno local."
          )}
        </p>
        <button
          onClick={onStart}
          className="mt-10 inline-flex items-center justify-center gap-2 rounded-full bg-tinta-950 hover:bg-tinta-800 px-9 py-4 text-sm font-bold text-white shadow-lg shadow-tinta-950/30 transition hover:-translate-y-0.5 hover:shadow-xl cursor-pointer"
        >
          {t("home.cta.button", "Comenzar en mi Territorio")}
        </button>
      </div>
    </section>
  );
}
