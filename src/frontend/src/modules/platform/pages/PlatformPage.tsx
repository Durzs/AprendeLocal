import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Search,
  ArrowRight,
  BookOpen,
  Map,
} from "lucide-react";

import { supabase } from "../../../shared/lib/supabaseClient";
import { CURSOS_DEMO, modoDemo } from "../../../shared/lib/demo";
import { pickLang } from "../../../shared/i18n/pickLang";
import MapaLugares from "../../biodiversidad/MapaLugares";

import type { Course } from "../../courses/types";

/* ─── Tab type ─── */
type Tab = "courses" | "map";
const TABS: { key: Tab; icon: typeof BookOpen }[] = [
  { key: "courses", icon: BookOpen },
  { key: "map", icon: Map },
];

/* ─────────────────────────────────────────────── */
export default function PlatformPage() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const lang = (i18n.resolvedLanguage || "pt").split("-")[0];
  const [searchParams, setSearchParams] = useSearchParams();

  const initialTab = (searchParams.get("tab") as Tab) || "courses";
  const [activeTab, setActiveTab] = useState<Tab>(initialTab);

  const switchTab = (tab: Tab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  /* ── User Teacher profile state ── */

  /* ── COURSES state ── */
  const [busca, setBusca] = useState("");
  const [cursos, setCursos] = useState<Course[]>([]);
  const [matriculadosIds, setMatriculadosIds] = useState<Set<string | number>>(new Set());
  const [concluidosIds, setConcluidosIds] = useState<Set<string | number>>(new Set());
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [erroCourses, setErroCourses] = useState("");

  /* ── MAP state ── */

  /* ── Load courses ── */
  useEffect(() => {
    let alive = true;
    async function load() {
      setLoadingCourses(true);
      setErroCourses("");

      // En demostración se puebla el catálogo sin sesión: si no, la comprobación
      // de usuario corta antes de pedir nada y la pestaña queda vacía en local.
      if (modoDemo()) {
        if (!alive) return;
        setCursos(CURSOS_DEMO);
        setLoadingCourses(false);
        return;
      }

      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;
      if (!user) { setLoadingCourses(false); return; }

      const [progressRes, coursesRes, enrollRes] = await Promise.all([
        supabase.from("course_progress").select("course_id, completed_at").eq("user_id", user.id),
        supabase.from("courses").select("id, titulo, descricao, categoria, nivel, badge, url_img").order("id"),
        supabase.from("enrollments").select("course_id").eq("user_id", user.id),
      ]);

      if (!alive) return;

      if (progressRes.error) setErroCourses(progressRes.error.message);
      else setConcluidosIds(new Set((progressRes.data ?? []).filter((p) => p.completed_at).map((p) => p.course_id)));

      if (coursesRes.error) { setErroCourses(coursesRes.error.message); setCursos([]); }
      else setCursos((coursesRes.data as Course[]) ?? []);

      if (enrollRes.error) setErroCourses(enrollRes.error.message);
      else setMatriculadosIds(new Set((enrollRes.data ?? []).map((e) => e.course_id)));

      setLoadingCourses(false);
    }
    load();
    return () => { alive = false; };
  }, []);

  /* ── derived ── */
  const normalize = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

  const cursosFiltrados = useMemo(() => {
    return cursos.filter((curso) => {
      const words = normalize(busca).split(" ").filter(Boolean);
      const text = normalize(`${pickLang(curso.titulo, lang)} ${pickLang(curso.descricao, lang)} ${pickLang(curso.categoria, lang)}`);
      return words.every((w) => text.includes(w));
    });
  }, [cursos, busca, lang]);

  async function iniciarCurso(courseId: string | number) {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) { navigate("/entrar"); return; }
    if (!matriculadosIds.has(courseId)) {
      await supabase.from("enrollments").insert([{ user_id: userData.user.id, course_id: courseId }]);
      setMatriculadosIds((prev) => new Set([...prev, courseId]));
    }
    navigate(`/cursos/${courseId}`);
  }

  /* ════════════════════════════════════════════════════ */
  return (
    <main className="min-h-screen bg-white text-[#111217]">
      {/* ── Header ── */}
      <section className="bg-[#f7f8fb] pb-6 pt-28 md:pt-32">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-semibold tracking-[-0.04em] text-[#111217] sm:text-4xl">
            {t("platform.title")}
          </h1>
          <p className="mt-2 max-w-2xl text-base text-slate-500">
            {t("platform.subtitle")}
          </p>

          {/* Entrada del docente */}
          <Link
            to="/rutas"
            className="mt-6 flex flex-col gap-3 rounded-2xl border border-emerald-600/30 bg-emerald-50/60 p-5 transition hover:border-emerald-600/60 hover:bg-emerald-50 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="rotulo text-emerald-700">
                {t("platform.teacherEntry.eyebrow")}
              </p>
              <p className="mt-1 text-lg font-semibold tracking-tight text-slate-950">
                {t("platform.teacherEntry.title")}
              </p>
              <p className="mt-1 max-w-xl text-sm text-slate-600">
                {t("platform.teacherEntry.body")}
              </p>
            </div>
            <span className="shrink-0 rounded-full bg-[#111217] px-5 py-2.5 text-center text-sm font-semibold text-white">
              {t("platform.teacherEntry.cta")}
            </span>
          </Link>

          {/* Tabs */}
          <div className="mt-6 flex flex-wrap gap-2">
            {TABS.map(({ key, icon: Icon }) => (
              <button
                key={key}
                onClick={() => switchTab(key)}
                className={[
                  "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition",
                  activeTab === key
                    ? "bg-[#111217] text-white shadow-sm"
                    : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
                ].join(" ")}
              >
                <Icon className="h-4 w-4" />
                {t(`platform.tabs.${key}`)}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Content ── */}
      <section className="py-10 md:py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

          {/* ╔═══════════════ TAB: COURSES ═══════════════╗ */}
          {activeTab === "courses" && (
            <>
              {/* Search */}
              <div className="relative mb-8 max-w-xl">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder={t("courses.searchPlaceholder")}
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="w-full rounded-full border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-400 focus:ring-1 focus:ring-slate-400"
                />
              </div>

              {erroCourses && (
                <div className="mb-8 rounded-2xl border border-red-200 bg-red-50 px-6 py-4 text-sm text-red-600">{erroCourses}</div>
              )}

              {loadingCourses ? (
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
                    const categoria = pickLang(curso.categoria, lang);
                    const nivel = pickLang(curso.nivel, lang);

                    return (
                      <article
                        key={curso.id}
                        className="flex flex-col justify-between overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-950/10"
                      >
                        <div className="space-y-4">
                          {curso.url_img && (
                            <img
                              src={curso.url_img}
                              alt={titulo}
                              className="h-40 w-full rounded-2xl object-cover"
                            />
                          )}
                          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                            {categoria && <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">{categoria}</span>}
                            {nivel && <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">{nivel}</span>}
                            {concluido && <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">{t("courses.statusCompleted")}</span>}
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold tracking-tight text-slate-950">{titulo}</h3>
                            <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-600">{descricao}</p>
                          </div>
                        </div>

                        <div className="mt-6 border-t border-slate-100 pt-4">
                          <button
                            onClick={() => iniciarCurso(curso.id)}
                            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#111217] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                          >
                            {concluido ? t("courses.reviewAction") : matriculado ? t("courses.continueAction") : t("courses.startAction")}
                            <ArrowRight className="h-4 w-4" />
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {/* ╔═══════════════ TAB: MAP ═══════════════╗ */}
          {activeTab === "map" && <MapaLugares />}

        </div>
      </section>
    </main>
  );
}
