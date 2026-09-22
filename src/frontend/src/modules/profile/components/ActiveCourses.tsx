import { useEffect, useState } from "react";
import { BookOpen, TrendingUp } from "lucide-react";
import { useTranslation } from "react-i18next";

import { supabase } from "../../../shared/lib/supabaseClient";
import { pickLang } from "../utils";
import { mensajeDe } from "../../../shared/lib/errores";

type ActiveCoursesProps = {
  userId?: string | null;
};

type ActiveCourseItem = {
  id: string;
  title: string;
  description: string;
};

export function ActiveCourses({ userId: userIdProp = null }: ActiveCoursesProps) {
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
        }));

        if (!alive) return;
        setActiveCourses(cursos);
      } catch (e) {
        if (!alive) return;
        setErro(mensajeDe(e, t("activeCourses.loadingError")));
      } finally {
        if (alive) setLoading(false);
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
        // Los cursos se retiraron del sitio: sus páginas rebotan al inicio.
        // Se dejan a la vista porque son de la persona, pero sin tarjetas que
        // se puedan tocar ni una barra de avance que siempre marcaba cero.
        <ul className="space-y-3">
          {activeCourses.map((course) => (
            <li
              key={course.id}
              className="flex items-start gap-3 rounded-2xl border border-slate-100 p-4"
            >
              <BookOpen aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold text-slate-950">{course.title}</div>
                {course.description ? (
                  <div className="mt-0.5 line-clamp-2 text-xs text-slate-500">{course.description}</div>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
