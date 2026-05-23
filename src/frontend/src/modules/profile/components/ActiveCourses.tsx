import { useEffect, useState } from "react";
import { BookOpen, Clock, TrendingUp, ArrowRight } from "lucide-react";
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
        if (!userId) { if (!alive) return; setActiveCourses([]); return; }

        const { data: enrolls, error: enrollErr } = await supabase
          .from("enrollments").select("course_id").eq("user_id", userId);
        if (enrollErr) throw enrollErr;

        const courseIds = Array.from(new Set((enrolls || []).map((r) => r.course_id).filter(Boolean)));
        if (!courseIds.length) { if (!alive) return; setActiveCourses([]); return; }

        const { data: coursesData, error: coursesErr } = await supabase
          .from("courses").select("id,titulo,descricao").in("id", courseIds).order("id", { ascending: true });
        if (coursesErr) throw coursesErr;

        const cursos: ActiveCourseItem[] = (coursesData || []).map((c) => ({
          id: String(c.id),
          title: pickLang(c.titulo, lang) || t("activeCourses.noTitle"),
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
    return () => { alive = false; };
  }, [userIdProp, lang, t]);

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-slate-400" />
          <h3 className="text-base font-semibold text-slate-950">{t("activeCourses.title")}</h3>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <TrendingUp className="h-3.5 w-3.5" />
          <span>{t("activeCourses.subtitle")}</span>
        </div>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-3">
          <div className="h-20 rounded-2xl bg-slate-50" />
          <div className="h-20 rounded-2xl bg-slate-50" />
        </div>
      ) : erro ? (
        <div className="text-sm text-red-500">{erro}</div>
      ) : activeCourses.length === 0 ? (
        <p className="text-sm text-slate-500">{t("activeCourses.empty")}</p>
      ) : (
        <>
          <div className="space-y-3">
            {activeCourses.map((course) => (
              <button
                type="button"
                key={course.id}
                className="w-full rounded-2xl border border-slate-100 bg-white p-4 text-left transition hover:border-slate-200 hover:shadow-sm"
                onClick={() => navigate(`/cursos/${course.id}`)}
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-lg">
                    {course.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold text-slate-950">{course.title}</div>
                    <div className="mt-0.5 line-clamp-1 text-xs text-slate-500">{course.description}</div>
                    <div className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-400">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{course.timeRemaining}</span>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-slate-400">{course.progress}%</span>
                </div>

                <div className="mt-3">
                  <div className="mb-1 flex items-center justify-between text-xs text-slate-400">
                    <span>{t("activeCourses.progressLabel")}</span>
                    <span className="font-semibold text-slate-600">{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} className="h-1.5 w-full" />
                </div>
              </button>
            ))}
          </div>

          <button
            type="button"
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#111217] py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
            onClick={() => navigate("/cursos")}
          >
            {t("activeCourses.viewAll")}
            <ArrowRight className="h-4 w-4" />
          </button>
        </>
      )}
    </div>
  );
}
