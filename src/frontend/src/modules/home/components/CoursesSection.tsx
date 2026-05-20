import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { CoursesSectionProps } from "../types";
import CourseCard from "./CourseCard";

export default function CoursesSection({
  courses,
  loading,
  error,
}: CoursesSectionProps) {
  const { t } = useTranslation();

  return (
    <section className="py-12 md:py-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-5xl font-bold text-white drop-shadow">
            {t("home.courses.title")}
          </h2>
          <p className="text-white/80 mt-2">{t("home.courses.subtitle")}</p>
        </div>

        {loading ? (
          <div className="text-center text-white/80">
            {t("home.courses.loading")}
          </div>
        ) : error ? (
          <div className="text-center text-red-100 bg-red-500/20 border border-red-200/30 rounded-xl p-4">
            {t("home.courses.errorPrefix")} {error}
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center text-white/80">
            {t("home.courses.empty")}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}

        <div className="mt-10 text-center">
          <Link
            to="/cursos"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="inline-block bg-white/25 text-black px-6 py-3 rounded-lg font-semibold backdrop-blur border border-white/40 hover:bg-white/30 transition"
          >
            {t("home.courses.allCourses")}
          </Link>
        </div>
      </div>
    </section>
  );
}