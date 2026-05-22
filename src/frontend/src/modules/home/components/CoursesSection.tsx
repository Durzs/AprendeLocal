import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight } from "lucide-react";
import type { Course } from "../types";
import { pickLang } from "../utils";

interface CoursesSectionProps {
  courses: Course[];
  loading: boolean;
  error: string;
}

export default function CoursesSection({ courses, loading, error }: CoursesSectionProps) {
  const { t, i18n } = useTranslation();
  const lang = (i18n.resolvedLanguage?.slice(0, 2) || "pt") as "pt" | "en" | "es";

  return (
    <section className="bg-[#f7f8fb] py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 flex flex-col justify-between gap-6 md:mb-16 md:flex-row md:items-end">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-semibold tracking-[-0.055em] text-[#111217] leading-[0.95] sm:text-4xl md:text-6xl">
              {t("home.courses.title")}
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 md:text-xl">
              {t("home.courses.subtitle")}
            </p>
          </div>

          <Link
            to="/cursos"
            className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-950 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-950/5"
          >
            {t("home.courses.viewAll")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Course cards */}
        {loading ? (
          <p className="text-center text-slate-500">{t("home.courses.loading")}</p>
        ) : error ? (
          <p className="rounded-2xl bg-red-50 px-6 py-4 text-center text-sm text-red-600">
            {error}
          </p>
        ) : courses.length === 0 ? (
          <p className="text-center text-slate-500">{t("home.courses.empty")}</p>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {courses.map((course) => (
              <article
                key={course.id}
                className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-950/10"
              >
                {course.url_img ? (
                  <img
                    src={course.url_img}
                    alt={pickLang(course.titulo, lang)}
                    className="h-44 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-44 items-center justify-center bg-slate-100 text-slate-400">
                    <span className="text-4xl">📚</span>
                  </div>
                )}
                <div className="p-5">
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                      {pickLang(course.categoria, lang) || "STEM"}
                    </span>
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">
                      {pickLang(course.nivel, lang) || "Media"}
                    </span>
                  </div>
                  <h3 className="mb-2 text-lg font-semibold leading-snug text-slate-950">
                    {pickLang(course.titulo, lang)}
                  </h3>
                  {course.descricao && (
                    <p className="line-clamp-2 text-sm leading-relaxed text-slate-600">
                      {pickLang(course.descricao, lang)}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
