import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Search, ArrowRight } from "lucide-react";

import { supabase } from "../../../shared/lib/supabaseClient";
import { normalize, pickLang } from "../utils";
import type { Course } from "../types";

export default function CoursesCatalogPage() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const lang = (i18n.resolvedLanguage || "pt").split("-")[0];

  const [busca, setBusca] = useState("");
  const [cursos, setCursos] = useState<Course[]>([]);
  const [matriculadosIds, setMatriculadosIds] = useState<Set<string | number>>(new Set());
  const [concluidosIds, setConcluidosIds] = useState<Set<string | number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    let alive = true;

    async function carregarTudo() {
      setLoading(true);
      setErro("");

      const { data: userData, error: userErr } = await supabase.auth.getUser();
      const user = userData?.user;

      if (userErr || !user) {
        navigate("/entrar");
        return;
      }

      const { data: progressData, error: progressErr } = await supabase
        .from("course_progress")
        .select("course_id, completed_at")
        .eq("user_id", user.id);

      if (!alive) return;

      if (progressErr) {
        setErro(progressErr.message);
        setConcluidosIds(new Set());
      } else {
        setConcluidosIds(
          new Set((progressData ?? []).filter((p) => p.completed_at).map((p) => p.course_id))
        );
      }

      const { data: coursesData, error: coursesErr } = await supabase
        .from("courses")
        .select("id, titulo, descricao, categoria, nivel, badge, url_img")
        .order("id", { ascending: true });

      if (!alive) return;

      if (coursesErr) {
        setErro(coursesErr.message);
        setCursos([]);
        setLoading(false);
        return;
      }

      setCursos((coursesData as Course[]) ?? []);

      const { data: enrollData, error: enrollErr } = await supabase
        .from("enrollments")
        .select("course_id")
        .eq("user_id", user.id);

      if (!alive) return;

      if (enrollErr) {
        setErro(enrollErr.message);
        setMatriculadosIds(new Set());
        setLoading(false);
        return;
      }

      setMatriculadosIds(new Set((enrollData ?? []).map((e) => e.course_id)));
      setLoading(false);
    }

    carregarTudo();

    return () => {
      alive = false;
    };
  }, [navigate]);

  async function iniciarOuContinuar(courseId: string | number) {
    setErro("");

    const { data: userData, error: userErr } = await supabase.auth.getUser();
    const user = userData?.user;

    if (userErr || !user) {
      navigate("/entrar");
      return;
    }

    const jaMatriculado = matriculadosIds.has(courseId);

    if (!jaMatriculado) {
      const { error } = await supabase
        .from("enrollments")
        .insert([{ user_id: user.id, course_id: courseId }]);

      if (error) {
        setErro(error.message);
        return;
      }

      setMatriculadosIds((prev) => new Set([...prev, courseId]));
    }

    navigate(`/cursos/${courseId}`);
  }

  const cursosFiltrados = useMemo(() => {
    return cursos.filter((curso) => {
      const palavrasBusca = normalize(busca).split(" ").filter(Boolean);
      const textoCurso = `${pickLang(curso.titulo, lang)} ${pickLang(curso.descricao, lang)} ${pickLang(curso.categoria, lang)}`;
      const textoNormalizado = normalize(textoCurso);
      return palavrasBusca.every((palavra) => textoNormalizado.includes(palavra));
    });
  }, [cursos, busca, lang]);

  return (
    <main className="min-h-screen bg-white text-[#111217]">
      {/* Header section */}
      <section className="bg-[#f7f8fb] pb-12 pt-28 md:pt-32">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-semibold tracking-[-0.04em] text-[#111217] sm:text-4xl md:text-5xl">
            {t("courses.title")}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-500">
            {t("courses.subtitle")}
          </p>

          {/* Search bar */}
          <div className="relative mt-8 max-w-xl">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={t("courses.searchPlaceholder")}
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full rounded-full border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-400 focus:ring-1 focus:ring-slate-400"
            />
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {erro && (
            <div className="mb-8 rounded-2xl border border-red-200 bg-red-50 px-6 py-4 text-sm text-red-600">
              {erro}
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-80 animate-pulse rounded-[2rem] border border-slate-200 bg-slate-50" />
              ))}
            </div>
          ) : cursosFiltrados.length === 0 ? (
            <p className="py-16 text-center text-slate-500">{t("courses.noneFound")}</p>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {cursosFiltrados.map((curso) => {
                const concluido = concluidosIds.has(curso.id);
                const matriculado = matriculadosIds.has(curso.id);

                const titulo = pickLang(curso.titulo, lang);
                const descricao = pickLang(curso.descricao, lang);
                const categoria = pickLang(curso.categoria, lang) || t("courses.tags.noCategory");
                const nivel = pickLang(curso.nivel, lang) || t("courses.tags.noLevel");
                const badge = pickLang(curso.badge, lang) || t("courses.tags.noBadge");

                const statusTexto = concluido
                  ? t("courses.status.completed")
                  : matriculado
                  ? t("courses.status.enrolled")
                  : t("courses.status.new");

                const buttonText = concluido
                  ? t("courses.buttons.review")
                  : matriculado
                  ? t("courses.buttons.continue")
                  : t("courses.buttons.start");

                return (
                  <article
                    key={curso.id}
                    className="group overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-950/10"
                  >
                    {curso.url_img ? (
                      <img
                        src={curso.url_img}
                        alt={t("courses.courseImageAlt", { title: titulo || "—" })}
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
                          {categoria}
                        </span>
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">
                          {nivel}
                        </span>
                        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                          {badge}
                        </span>
                        <span className="ml-auto rounded-full bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-500">
                          {statusTexto}
                        </span>
                      </div>

                      <h2 className="mb-2 text-lg font-semibold leading-snug text-slate-950">
                        {titulo}
                      </h2>

                      <p className="line-clamp-2 text-sm leading-relaxed text-slate-600">
                        {descricao}
                      </p>

                      <button
                        onClick={() => iniciarOuContinuar(curso.id)}
                        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#111217] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
                      >
                        {buttonText}
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
