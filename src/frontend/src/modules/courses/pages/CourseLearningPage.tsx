import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ChevronDown, ChevronRight, CheckCircle2, Lock, Circle, ArrowLeft } from "lucide-react";

import { supabase } from "../../../shared/lib/supabaseClient";
import { pickLang } from "../utils";
import {
  sortByOrder,
  fetchCourseStateFromSupabase,
  completeMaterialFromSupabase,
} from "../services/courseProgress";
import { BadgeModal } from "../components/BadgeModal";
import type { Course, TranslatedField } from "../types";
import GeminiAIChat from "../../ai/components/GeminiAIChat";

type ModuleItem = {
  id: string | number;
  course_id: string | number;
  title: TranslatedField;
  description?: TranslatedField;
  order_index?: number | null;
};

type MaterialItem = {
  id: string | number;
  module_id: string | number;
  title: TranslatedField;
  content: TranslatedField;
  type?: string;
  order_index?: number | null;
  module_title?: TranslatedField;
};

type CoursePointer = {
  id: string | number;
  user_id: string;
  course_id: string | number;
  current_module_id: string | number | null;
  current_material_id: string | number | null;
  updated_at?: string | null;
  completed_at?: string | null;
};

function resolveCourse(course: Course | null, lang: string) {
  if (!course) return null;
  return {
    ...course,
    titulo: pickLang(course.titulo, lang),
    descricao: pickLang(course.descricao, lang),
    categoria: pickLang(course.categoria, lang),
    nivel: pickLang(course.nivel, lang),
  };
}

function resolveModule(mod: ModuleItem, lang: string) {
  return { ...mod, title: pickLang(mod.title, lang) };
}

function resolveMaterial(mat: MaterialItem, lang: string) {
  return { ...mat, title: pickLang(mat.title, lang), content: pickLang(mat.content, lang) };
}

export default function CourseLearningPage() {
  const navigate = useNavigate();
  const { cursoId } = useParams();
  const courseId = Number(cursoId || 1);

  const { t, i18n } = useTranslation();
  const lang = (i18n.resolvedLanguage || "pt").split("-")[0];

  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<ModuleItem[]>([]);
  const [materialsByModule, setMaterialsByModule] = useState<Record<string, MaterialItem[]>>({});
  const [pointer, setPointer] = useState<CoursePointer | null>(null);

  const [completedIds, setCompletedIds] = useState<Array<string | number>>([]);
  const [unlockedIds, setUnlockedIds] = useState<Array<string | number>>([]);

  const [completedCount, setCompletedCount] = useState(0);
  const [totalMaterials, setTotalMaterials] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);

  const [currentMaterial, setCurrentMaterial] = useState<MaterialItem | null>(null);
  const [isCourseCompleted, setIsCourseCompleted] = useState(false);

  const [openModuleId, setOpenModuleId] = useState<string | null>(null);
  const [openMaterialId, setOpenMaterialId] = useState<string | null>(null);

  const [showBadgeModal, setShowBadgeModal] = useState(false);
  const [badgeCourseName, setBadgeCourseName] = useState("");

  const completedSet = useMemo(() => new Set(completedIds.map(String)), [completedIds]);
  const unlockedSet = useMemo(() => new Set(unlockedIds.map(String)), [unlockedIds]);

  const courseView = useMemo(() => resolveCourse(course, lang), [course, lang]);
  const modulesView = useMemo(() => (modules || []).map((m) => resolveModule(m, lang)), [modules, lang]);

  const materialsByModuleView = useMemo(() => {
    const out: Record<string, MaterialItem[]> = {};
    for (const [modId, list] of Object.entries(materialsByModule || {})) {
      out[String(modId)] = (list || []).map((mat) => resolveMaterial(mat, lang));
    }
    return out;
  }, [materialsByModule, lang]);

  const currentMaterialView = useMemo(() => {
    if (!currentMaterial) return null;
    return {
      ...currentMaterial,
      module_title: pickLang(currentMaterial.module_title, lang),
      title: pickLang(currentMaterial.title, lang),
    };
  }, [currentMaterial, lang]);

  const orderedAllMaterials = useMemo(() => {
    if (!modulesView?.length) return [];
    const all: Array<MaterialItem & { module_id: string; module_title: string }> = [];
    for (const m of [...modulesView].sort(sortByOrder)) {
      const list = (materialsByModuleView[String(m.id)] || []).slice().sort(sortByOrder);
      for (const it of list) {
        all.push({ ...it, module_id: String(m.id), module_title: String(m.title || "") });
      }
    }
    return all;
  }, [modulesView, materialsByModuleView]);

  useEffect(() => {
    if (!loading && currentMaterialView) {
      setOpenModuleId(String(currentMaterialView.module_id));
      setOpenMaterialId(String(currentMaterialView.id));
    }
  }, [loading, currentMaterialView]);

  async function fetchState() {
    const data = await fetchCourseStateFromSupabase(courseId);
    setCourse((data.course as Course) || null);
    setModules((data.modules as ModuleItem[]) || []);
    setMaterialsByModule((data.materialsByModule as Record<string, MaterialItem[]>) || {});
    setPointer((data.pointer as CoursePointer) || null);
    setCompletedIds(data.completedMaterialIds || []);
    setUnlockedIds(data.unlockedMaterialIds || []);
    setCompletedCount(data.completedCount || 0);
    setTotalMaterials(data.totalMaterials || 0);
    setProgressPercent(data.progressPercent || 0);
    setCurrentMaterial((data.currentMaterial as MaterialItem) || null);
    setIsCourseCompleted(Boolean(data.isCourseCompleted));
    return data;
  }

  useEffect(() => {
    let alive = true;
    async function load() {
      setLoading(true);
      setErro("");
      try {
        const { data: sData } = await supabase.auth.getSession();
        if (!sData?.session?.access_token) { navigate("/entrar"); return; }
        if (!alive) return;
        await fetchState();
      } catch (e: any) {
        if (!alive) return;
        const msg = e?.message || t("coursePage.errors.loadCourseState");
        if (String(msg).toLowerCase().includes("token")) { navigate("/entrar"); return; }
        setErro(msg);
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    }
    load();
    return () => { alive = false; };
  }, [courseId, navigate, t]);

  function openMaterial(moduleId: string | number, materialId: string | number) {
    if (!unlockedSet.has(String(materialId))) return;
    setOpenModuleId(String(moduleId));
    setOpenMaterialId(String(materialId));
  }

  async function markCompleted() {
    if (!openMaterialId) return;
    setErro("");
    try {
      await completeMaterialFromSupabase(courseId, openMaterialId);
      const data = await fetchState();
      if (data?.isCourseCompleted) {
        const name = pickLang((data?.course as Course)?.titulo, lang) || pickLang(course?.titulo, lang) || t("coursePage.courseCompletedFallback");
        setBadgeCourseName(name);
        setShowBadgeModal(true);
      }
    } catch (e: any) {
      setErro(e?.message || t("coursePage.errors.completeMaterial"));
    }
  }

  const openMaterialObj = useMemo(() => {
    if (!openMaterialId) return null;
    return orderedAllMaterials.find((m) => String(m.id) === String(openMaterialId)) || null;
  }, [openMaterialId, orderedAllMaterials]);

  const openMaterialFull = useMemo(() => {
    if (!openMaterialObj) return null;
    const list = materialsByModuleView[String(openMaterialObj.module_id)] || [];
    return list.find((x) => String(x.id) === String(openMaterialObj.id)) || null;
  }, [openMaterialObj, materialsByModuleView]);

  // Loading state
  if (loading) {
    return (
      <main className="min-h-screen bg-[#f7f8fb] pt-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-32 rounded-[2rem] border border-slate-200 bg-white" />
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              <div className="h-96 rounded-[2rem] border border-slate-200 bg-white lg:col-span-4" />
              <div className="h-96 rounded-[2rem] border border-slate-200 bg-white lg:col-span-8" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Error state
  if (erro) {
    return (
      <main className="min-h-screen bg-[#f7f8fb] pt-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-[2rem] border border-red-200 bg-red-50 p-8">
            <h2 className="text-xl font-semibold text-red-800">{t("courseLocal.errorTitle")}</h2>
            <p className="mt-2 text-sm text-red-600">{erro}</p>
            <button
              onClick={() => navigate(-1)}
              className="mt-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              <ArrowLeft className="h-4 w-4" />
              {t("courseLocal.back")}
            </button>
          </div>
        </div>
      </main>
    );
  }

  // Not found state
  if (!courseView) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-[#f7f8fb] px-4 text-center">
        <p className="text-6xl font-black text-slate-300">404</p>
        <p className="mt-4 text-lg text-slate-500">{t("courseLocal.notFound")}</p>
        <button
          onClick={() => navigate("/cursos")}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#111217] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
        >
          {t("coursePage.buttons.backToCourses")}
        </button>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f8fb] pb-16 pt-24 text-[#111217]">
      <div className="mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">
        {/* Course header */}
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                  {courseView.categoria}
                </span>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">
                  {courseView.nivel}
                </span>
              </div>
              <h1 className="text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">
                {courseView.titulo}
              </h1>
              {courseView.descricao && (
                <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-500">
                  {courseView.descricao}
                </p>
              )}
            </div>

            <div className="min-w-[240px]">
              <div className="mb-2 flex items-center justify-between text-sm text-slate-500">
                <span>{t("coursePage.progress.title")}</span>
                <span className="font-semibold text-slate-950">
                  {completedCount}/{totalMaterials} · {progressPercent}%
                </span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-[#111217] transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="mt-2 text-xs text-slate-400">
                {isCourseCompleted
                  ? t("coursePage.progress.courseCompleted")
                  : currentMaterialView
                  ? t("coursePage.progress.current", {
                      module: currentMaterialView.module_title,
                      title: currentMaterialView.title,
                    })
                  : t("coursePage.progress.loading")}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Sidebar */}
          <aside className="lg:col-span-4">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="mb-4 text-base font-semibold text-slate-950">
                {t("coursePage.sidebar.content")}
              </h3>

              {!modulesView.length ? (
                <p className="text-sm text-slate-500">{t("coursePage.sidebar.noModules")}</p>
              ) : (
                <div className="space-y-2">
                  {modulesView.slice().sort(sortByOrder).map((mod) => {
                    const modId = String(mod.id);
                    const mats = (materialsByModuleView[modId] || []).slice().sort(sortByOrder);
                    const isOpen = String(openModuleId) === modId;
                    const modDone = mats.filter((x) => completedSet.has(String(x.id))).length;

                    return (
                      <div key={modId} className="overflow-hidden rounded-2xl border border-slate-100">
                        <button
                          className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition hover:bg-slate-50"
                          onClick={() => setOpenModuleId(isOpen ? null : modId)}
                        >
                          <div className="min-w-0">
                            <div className="text-sm font-medium text-slate-900">{mod.title}</div>
                            <div className="text-xs text-slate-400">
                              {t("coursePage.sidebar.doneOfTotal", { done: modDone, total: mats.length })}
                            </div>
                          </div>
                          {isOpen ? (
                            <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />
                          ) : (
                            <ChevronRight className="h-4 w-4 shrink-0 text-slate-400" />
                          )}
                        </button>

                        {isOpen && (
                          <div className="space-y-1 px-3 pb-3">
                            {!mats.length ? (
                              <p className="px-2 py-2 text-xs text-slate-400">
                                {t("coursePage.sidebar.noMaterials")}
                              </p>
                            ) : (
                              mats.map((mat) => {
                                const matId = String(mat.id);
                                const done = completedSet.has(matId);
                                const unlocked = unlockedSet.has(matId);
                                const active = String(openMaterialId) === matId;

                                return (
                                  <button
                                    key={matId}
                                    onClick={() => openMaterial(modId, matId)}
                                    disabled={!unlocked}
                                    className={[
                                      "flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm transition",
                                      active
                                        ? "border border-slate-200 bg-slate-50 font-medium text-slate-950"
                                        : "text-slate-600 hover:bg-slate-50",
                                      !unlocked && "cursor-not-allowed opacity-40",
                                    ].join(" ")}
                                  >
                                    {done ? (
                                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                                    ) : unlocked ? (
                                      <Circle className="h-4 w-4 shrink-0 text-slate-300" />
                                    ) : (
                                      <Lock className="h-3.5 w-3.5 shrink-0 text-slate-300" />
                                    )}
                                    <span className="truncate">{String(mat.title || "")}</span>
                                  </button>
                                );
                              })
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </aside>

          {/* Main content */}
          <section className="lg:col-span-8">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
              {!openMaterialFull ? (
                <p className="py-12 text-center text-slate-400">
                  {t("coursePage.main.selectMaterial")}
                </p>
              ) : (
                <div className="space-y-6">
                  {isCourseCompleted && (
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                      <h3 className="text-lg font-semibold text-emerald-800">
                        {t("coursePage.main.courseCompletedTitle")}
                      </h3>
                      <p className="mt-1 text-sm text-emerald-600">
                        {t("coursePage.main.courseCompletedDesc")}
                      </p>
                      <button
                        className="mt-3 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
                        onClick={() => navigate("/cursos")}
                      >
                        {t("coursePage.buttons.backToCourses")}
                      </button>
                    </div>
                  )}

                  {/* Material header */}
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                      {openMaterialObj?.module_title}
                    </p>
                    <h2 className="mt-1 text-xl font-semibold text-slate-950 md:text-2xl">
                      {String(openMaterialFull.title || "")}
                    </h2>
                    <div className="mt-1 flex items-center gap-3 text-xs text-slate-400">
                      <span>
                        {t("coursePage.main.type")}:{" "}
                        {openMaterialFull.type && openMaterialFull.type !== "EMPTY"
                          ? openMaterialFull.type
                          : t("coursePage.materialType.default")}
                      </span>
                      <span>·</span>
                      <span>
                        {completedSet.has(String(openMaterialFull.id))
                          ? t("coursePage.materialStatus.done")
                          : t("coursePage.materialStatus.inProgress")}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div
                    className="
                      prose prose-slate max-w-none
                      rounded-2xl border border-slate-100 bg-[#f7f8fb] p-6
                      prose-headings:text-slate-950 prose-headings:font-semibold
                      prose-p:leading-8 prose-p:text-slate-600
                      prose-li:leading-8 prose-li:text-slate-600
                      prose-strong:text-slate-900
                      prose-img:rounded-2xl
                      prose-blockquote:border-slate-300
                    "
                    dangerouslySetInnerHTML={{
                      __html: openMaterialFull.content || `<p>${t("coursePage.main.emptyContent")}</p>`,
                    }}
                  />

                  <GeminiAIChat
                    moduleTitle={String(openMaterialObj?.module_title || "")}
                    title={String(openMaterialFull.title || "")}
                    content={String(openMaterialFull.content || "")}
                  />

                  {/* Actions */}
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <button
                      className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
                      onClick={() => navigate(-1)}
                    >
                      <ArrowLeft className="h-4 w-4" />
                      {t("coursePage.buttons.back")}
                    </button>

                    <button
                      className={[
                        "inline-flex items-center justify-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold shadow-sm transition",
                        completedSet.has(String(openMaterialFull.id)) || isCourseCompleted
                          ? "cursor-not-allowed border border-slate-200 bg-slate-50 text-slate-400"
                          : "bg-[#111217] text-white hover:-translate-y-0.5 hover:shadow-lg",
                      ].join(" ")}
                      onClick={markCompleted}
                      disabled={completedSet.has(String(openMaterialFull.id)) || isCourseCompleted}
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      {isCourseCompleted
                        ? t("coursePage.buttons.courseCompleted")
                        : t("coursePage.buttons.markCompleted")}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>

      <BadgeModal
        open={showBadgeModal}
        badgeCourseName={badgeCourseName}
        onClose={() => setShowBadgeModal(false)}
        onContinue={() => {
          setShowBadgeModal(false);
          navigate("/cursos");
        }}
      />
    </main>
  );
}
