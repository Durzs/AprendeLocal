import { useTranslation } from "react-i18next";
import type { CourseCardProps } from "../types";
import { pickLang } from "../utils";

export default function CourseCard({ course }: CourseCardProps) {
  const { i18n, t } = useTranslation();
  const lang = (i18n.resolvedLanguage?.slice(0, 2) || "pt") as "pt" | "en" | "es";

  return (
    <div className="w-full bg-white/85 backdrop-blur border border-white/40 p-6 rounded-2xl shadow hover:shadow-lg transition">
      <h3 className="text-lg font-semibold text-slate-900 mb-2">
        {pickLang(course.titulo, lang)}
      </h3>

      <div className="text-sm text-slate-700 space-y-1">
        <p>
          <span className="font-semibold">{t("home.courses.category")}:</span>{" "}
          {pickLang(course.categoria, lang)}
        </p>

        <p>
          <span className="font-semibold">{t("home.courses.level")}:</span>{" "}
          {pickLang(course.nivel, lang)}
        </p>
      </div>
    </div>
  );
}