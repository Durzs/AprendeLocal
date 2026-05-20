import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Clock, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { Progress } from "../../../shared/components/ui/Progress";
import { supabase } from "../../../shared/lib/supabaseClient";
import { pickLang } from "../utils";

type ActiveCoursesProps = {
  userId?: string | null;
};

type ActiveCourseItem = {
  id: string;
  title: string;
  description: string;
  progress: number;
  timeRemaining: string;
  icon: string;
};

export function ActiveCourses({ userId: userIdProp = null }: ActiveCoursesProps) {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const lang = (i18n.resolvedLanguage || "pt").split("-")[0];

  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [activeCourses, setActiveCourses] = useState<ActiveCourseItem[]>([]);

  useEffect(() => {
    let alive = true;

    async function carregar() {
      setLoading(true);
      setErro("");

      try {
        let userId = userIdProp;

        if (!userId) {
          const { data: userData, error: userErr } = await supabase.auth.getUser();
          if (userErr) throw userErr;
          userId = userData?.user?.id ?? null;
        }

        if (!userId) {
          if (!alive) return;
          setActiveCourses([]);
          return;
        }

        const { data: enrolls, error: enrollErr } = await supabase
          .from("enrollments")
          .select("course_id")
          .eq("user_id", userId);

        if (enrollErr) throw enrollErr;

        const courseIds = Array.from(
          new Set((enrolls || []).map((r) => r.course_id).filter(Boolean))
        );

        if (!courseIds.length) {
          if (!alive) return;
          setActiveCourses([]);
          return;
        }

        const { data: coursesData, error: coursesErr } = await supabase
          .from("courses")
          .select("id,titulo,descricao")
          .in("id", courseIds)
          .order("id", { ascending: true });

        if (coursesErr) throw coursesErr;

        const noTitleFallback = t("activeCourses.noTitle");

        const cursos: ActiveCourseItem[] = (coursesData || []).map((c) => ({
          id: String(c.id),
          title: pickLang(c.titulo, lang) || noTitleFallback,
          description: pickLang(c.descricao, lang) || "",
          progress: 0,
          timeRemaining: "—",
          icon: "📘",
        }));

        if (!alive) return;
        setActiveCourses(cursos);
      } catch (e: any) {
        if (!alive) return;
        setErro(e?.message || t("activeCourses.loadingError"));
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    }

    carregar();

    return () => {
      alive = false;
    };
  }, [userIdProp, lang, t]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-3xl bg-white/85 backdrop-blur border border-white/40 shadow p-6"
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-700" />
          <h3 className="text-lg font-bold text-blue-950">
            {t("activeCourses.title")}
          </h3>
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-700">
          <TrendingUp className="w-4 h-4" />
          <span>{t("activeCourses.subtitle")}</span>
        </div>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-3">
          <div className="h-14 rounded-2xl bg-black/5" />
          <div className="h-14 rounded-2xl bg-black/5" />
        </div>
      ) : erro ? (
        <div className="text-sm text-red-600">{erro}</div>
      ) : activeCourses.length === 0 ? (
        <div className="text-sm text-gray-700">{t("activeCourses.empty")}</div>
      ) : (
        <>
          <div className="grid gap-3">
            {activeCourses.map((course) => (
              <motion.button
                type="button"
                key={course.id}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full text-left rounded-2xl border border-black/10 bg-white shadow-sm hover:shadow transition p-4"
                onClick={() => navigate(`/cursos/${course.id}`)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center text-xl">
                      {course.icon}
                    </div>

                    <div>
                      <div className="font-semibold text-blue-950">{course.title}</div>
                      <div className="text-xs text-gray-700 line-clamp-2">
                        {course.description}
                      </div>

                      <div className="mt-2 flex items-center gap-2 text-xs text-gray-700">
                        <Clock className="w-4 h-4" />
                        <span>{course.timeRemaining}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-gray-700 font-medium">
                    {course.progress}%
                  </div>
                </div>

                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs text-gray-700 mb-1 w-full">
                    <span>{t("activeCourses.progressLabel")}</span>
                    <span className="font-bold">{course.progress}%</span>
                  </div>

                  <Progress value={course.progress} className="h-2 w-full" />
                </div>
              </motion.button>
            ))}
          </div>

          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="w-full mt-4 py-3 rounded-xl font-semibold bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:opacity-95 transition"
            onClick={() => navigate("/cursos")}
          >
            {t("activeCourses.viewAll")}
          </motion.button>
        </>
      )}
    </motion.div>
  );
}