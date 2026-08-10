import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Search,
  ArrowRight,
  BookOpen,
  Map,
  Wrench,
  MapPin,
  Clock,
  Star,
  GraduationCap,
  ChevronRight,
} from "lucide-react";

import { supabase } from "../../../shared/lib/supabaseClient";
import { pickLang } from "../../../shared/i18n/pickLang";
import MapView from "../../../components/MapView";
import PointPanel from "../../../components/PointPanel";
import { fetchSchools, fetchNearbyPOIs } from "../../../api";

import type { Course } from "../../courses/types";
import type { School, NearbyPOI, POIFeature } from "../../../types";

/* ─── hardcoded makerspaces (same as MakerspacesPage) ─── */
const MAKERSPACES = [
  {
    id: 1,
    name: { pt: "Centro de Inovação – Inova USP", en: "Innovation Center – Inova USP", es: "Centro de Innovación – Inova USP" },
    rating: 4.7,
    description: {
      pt: "Espaço de inovação e fabricação digital da Universidade de São Paulo com equipamentos como impressoras 3D, CNC e corte a laser.",
      en: "Innovation and digital fabrication space at the University of São Paulo, with 3D printers, CNC and laser cutting.",
      es: "Espacio de innovación y fabricación digital de la Universidad de São Paulo con impresoras 3D, CNC y corte láser.",
    },
    location: { pt: "Cidade Universitária – São Paulo, SP", en: "Cidade Universitária – São Paulo, SP", es: "Cidade Universitária – São Paulo, SP" },
    hours: { pt: "Seg–Sex: 08h–22h", en: "Mon–Fri: 08:00–22:00", es: "Lun–Vie: 08:00–22:00" },
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475",
  },
  {
    id: 2,
    name: { pt: "Maker Space Rio", en: "Maker Space Rio", es: "Maker Space Rio" },
    rating: 4.6,
    description: { pt: "Centro de inovação com foco em robótica e IoT", en: "Innovation center focused on robotics and IoT", es: "Centro de innovación enfocado en robótica e IoT" },
    location: { pt: "Rio de Janeiro, RJ", en: "Rio de Janeiro, RJ", es: "Río de Janeiro, RJ" },
    hours: { pt: "Ter–Sáb: 10h–19h", en: "Tue–Sat: 10:00–19:00", es: "Mar–Sáb: 10:00–19:00" },
    image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45",
  },
];

/* ─── Tab type ─── */
type Tab = "courses" | "map" | "makerspaces";
const TABS: { key: Tab; icon: typeof BookOpen }[] = [
  { key: "courses", icon: BookOpen },
  { key: "map", icon: Map },
  { key: "makerspaces", icon: Wrench },
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

  /* ── COURSES state ── */
  const [busca, setBusca] = useState("");
  const [cursos, setCursos] = useState<Course[]>([]);
  const [matriculadosIds, setMatriculadosIds] = useState<Set<string | number>>(new Set());
  const [concluidosIds, setConcluidosIds] = useState<Set<string | number>>(new Set());
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [erroCourses, setErroCourses] = useState("");

  /* ── MAP state ── */
  const [schools, setSchools] = useState<School[]>([]);
  const [loadingSchools, setLoadingSchools] = useState(true);
  const [schoolSearch, setSchoolSearch] = useState("");
  const [selectedCommune, setSelectedCommune] = useState<string | null>(null);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [pois, setPois] = useState<NearbyPOI[]>([]);
  const [loadingPois, setLoadingPois] = useState(false);
  const [radius, setRadius] = useState(20);
  const [selectedPoi, setSelectedPoi] = useState<POIFeature | null>(null);

  /* ── Load courses ── */
  useEffect(() => {
    let alive = true;
    async function load() {
      setLoadingCourses(true);
      setErroCourses("");

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

  /* ── Load schools ── */
  useEffect(() => {
    fetchSchools()
      .then(setSchools)
      .catch(console.error)
      .finally(() => setLoadingSchools(false));
  }, []);

  /* ── Load POIs when school/radius changes ── */
  useEffect(() => {
    if (!selectedSchool) return;
    setLoadingPois(true);
    setSelectedPoi(null);
    fetchNearbyPOIs(selectedSchool.id, radius)
      .then((data) => setPois(data.pois))
      .catch(console.error)
      .finally(() => setLoadingPois(false));
  }, [selectedSchool?.id, radius]);

  /* ── derived ── */
  const communes = useMemo(() => [...new Set(schools.map((s) => s.commune))].sort(), [schools]);

  const filteredSchools = useMemo(() => {
    let result = schools;
    if (selectedCommune) result = result.filter((s) => s.commune === selectedCommune);
    if (schoolSearch.trim()) {
      const q = schoolSearch.toLowerCase();
      result = result.filter((s) => s.name.toLowerCase().includes(q) || s.commune.toLowerCase().includes(q));
    }
    return result;
  }, [schools, selectedCommune, schoolSearch]);

  const poiFeatures: POIFeature[] = useMemo(
    () => pois.map((poi) => ({
      type: "Feature" as const,
      geometry: { type: "Point" as const, coordinates: poi.coordinates },
      properties: { id: poi.id, name: poi.name, type: poi.type, ecosystem: poi.ecosystem, commune: poi.commune, description: poi.description, stem_areas: poi.stem_areas, heritage_type: poi.heritage_type, threats: poi.threats },
    })),
    [pois]
  );

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

  const TYPE_COLORS: Record<string, string> = { natural: "bg-emerald-500", geological: "bg-red-500", hydrological: "bg-blue-500", cultural: "bg-purple-500" };

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


          {/* Entrada del docente.
              El diseño instruccional baja el mapa de puerta principal a capa de
              consulta: quien enseña empieza por el objetivo de aprendizaje, no
              explorando. Por eso esto va sobre las pestañas y no dentro de una. */}
          <Link
            to="/preparar"
            className="mt-6 flex flex-col gap-3 rounded-2xl border border-emerald-600/30 bg-emerald-50/60 p-5 transition hover:border-emerald-600/60 hover:bg-emerald-50 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-mono text-[11px] uppercase tracking-widest text-emerald-700">
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
          <div className="mt-6 flex gap-2">
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
                    const categoria = pickLang(curso.categoria, lang) || t("courses.tags.noCategory");
                    const nivel = pickLang(curso.nivel, lang) || t("courses.tags.noLevel");

                    const statusText = concluido ? t("courses.status.completed") : matriculado ? t("courses.status.enrolled") : t("courses.status.new");
                    const btnText = concluido ? t("courses.buttons.review") : matriculado ? t("courses.buttons.continue") : t("courses.buttons.start");

                    return (
                      <article key={curso.id} className="group overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-950/10">
                        {curso.url_img ? (
                          <img src={curso.url_img} alt={titulo || ""} className="h-44 w-full object-cover" />
                        ) : (
                          <div className="flex h-44 items-center justify-center bg-slate-100 text-slate-400"><GraduationCap className="h-12 w-12" /></div>
                        )}
                        <div className="p-5">
                          <div className="mb-3 flex flex-wrap items-center gap-2">
                            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">{categoria}</span>
                            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">{nivel}</span>
                            <span className="ml-auto rounded-full bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-500">{statusText}</span>
                          </div>
                          <h2 className="mb-2 text-lg font-semibold leading-snug text-slate-950">{titulo}</h2>
                          <p className="line-clamp-2 text-sm leading-relaxed text-slate-600">{descricao}</p>
                          <button
                            onClick={() => iniciarCurso(curso.id)}
                            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#111217] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
                          >
                            {btnText}
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
          {activeTab === "map" && (
            <div className="flex flex-col gap-6 lg:flex-row">
              {/* Left panel — school selector OR POI panel */}
              <div className="w-full shrink-0 lg:w-80">
                {!selectedSchool ? (
                  /* ── School selector ── */
                  <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-slate-950">{t("platform.map.selectSchool")}</h2>

                    <div className="relative">
                      <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        placeholder={t("platform.map.searchSchool")}
                        value={schoolSearch}
                        onChange={(e) => setSchoolSearch(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-slate-400 focus:ring-1 focus:ring-slate-400"
                      />
                    </div>

                    {/* Commune chips */}
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        onClick={() => setSelectedCommune(null)}
                        className={["rounded-full px-3 py-1 text-xs font-medium transition", !selectedCommune ? "bg-[#111217] text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"].join(" ")}
                      >
                        {t("platform.map.allCommunes")} ({schools.length})
                      </button>
                      {communes.map((c) => (
                        <button
                          key={c}
                          onClick={() => setSelectedCommune(selectedCommune === c ? null : c)}
                          className={["rounded-full px-3 py-1 text-xs font-medium transition", selectedCommune === c ? "bg-[#111217] text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"].join(" ")}
                        >
                          {c}
                        </button>
                      ))}
                    </div>

                    {loadingSchools ? (
                      <p className="py-8 text-center text-sm text-slate-400">{t("platform.map.loading")}</p>
                    ) : filteredSchools.length === 0 ? (
                      <p className="py-8 text-center text-sm text-slate-400">{t("platform.map.noSchools")}</p>
                    ) : (
                      <div className="max-h-[60vh] space-y-2 overflow-y-auto pr-1">
                        {filteredSchools.map((school) => (
                          <button
                            key={school.id}
                            onClick={() => setSelectedSchool(school)}
                            className="flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 text-left transition hover:border-slate-300 hover:shadow-sm"
                          >
                            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-amber-50 text-lg">🏫</span>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-semibold text-slate-900">{school.name}</p>
                              <p className="text-xs text-slate-500">{school.commune}{school.student_count ? ` · ${school.student_count} est.` : ""}</p>
                            </div>
                            <ChevronRight className="h-4 w-4 shrink-0 text-slate-300" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  /* ── Selected school + POI panel ── */
                  <div className="space-y-4">
                    {/* School header */}
                    <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-3">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-amber-50 text-lg">🏫</span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-slate-900">{selectedSchool.name}</p>
                        <p className="text-xs text-slate-500">{selectedSchool.commune}</p>
                      </div>
                      <button
                        onClick={() => { setSelectedSchool(null); setPois([]); setSelectedPoi(null); }}
                        className="shrink-0 rounded-lg px-2 py-1 text-xs font-medium text-slate-500 transition hover:bg-slate-100"
                      >
                        ✕
                      </button>
                    </div>

                    {/* Radius slider */}
                    <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3">
                      <span className="text-xs font-medium text-slate-500">{t("platform.map.radius")}</span>
                      <input
                        type="range"
                        min={5}
                        max={50}
                        step={5}
                        value={radius}
                        onChange={(e) => setRadius(Number(e.target.value))}
                        className="flex-1 accent-slate-950"
                      />
                      <span className="w-12 text-right text-xs font-semibold text-slate-700">{radius} {t("platform.map.km")}</span>
                    </div>

                    {/* POI count */}
                    {loadingPois ? (
                      <p className="py-4 text-center text-sm text-slate-400">{t("platform.map.loadingPois")}</p>
                    ) : pois.length === 0 ? (
                      <p className="py-4 text-center text-sm text-slate-400">{t("platform.map.noPois")}</p>
                    ) : (
                      <p className="text-xs font-medium text-slate-500">
                        {t("platform.map.poisFound", { count: pois.length })}
                      </p>
                    )}

                    {/* POI list */}
                    <div className="max-h-[50vh] space-y-1.5 overflow-y-auto pr-1">
                      {pois.map((poi) => {
                        const dotColor = TYPE_COLORS[poi.type] || "bg-slate-400";
                        const isActive = selectedPoi?.properties.id === poi.id;
                        return (
                          <button
                            key={poi.id}
                            onClick={() => {
                              const feat: POIFeature = {
                                type: "Feature",
                                geometry: { type: "Point", coordinates: poi.coordinates },
                                properties: { id: poi.id, name: poi.name, type: poi.type, ecosystem: poi.ecosystem, commune: poi.commune, description: poi.description, stem_areas: poi.stem_areas, heritage_type: poi.heritage_type, threats: poi.threats },
                              };
                              setSelectedPoi(feat);
                            }}
                            className={[
                              "flex w-full items-center gap-2.5 rounded-xl border p-2.5 text-left transition",
                              isActive ? "border-slate-300 bg-slate-50 shadow-sm" : "border-transparent hover:border-slate-200 hover:bg-white",
                            ].join(" ")}
                          >
                            <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${dotColor}`} />
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-medium text-slate-900">{poi.name}</p>
                              <p className="text-xs text-slate-400">{t(`platform.map.poiTypes.${poi.type}`, poi.type)} · {poi.distance_km?.toFixed(1)} km</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* Point Panel for project generation */}
                    {selectedPoi && (
                      <div className="rounded-2xl border border-slate-200 bg-white">
                        <PointPanel point={selectedPoi} onClose={() => setSelectedPoi(null)} />
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Right — Map */}
              <div className="flex-1 overflow-hidden rounded-[2rem] border border-slate-200 shadow-sm" style={{ minHeight: 500 }}>
                <MapView
                  points={poiFeatures}
                  onSelectPoint={(poi) => setSelectedPoi(poi)}
                  selectedId={selectedPoi?.properties.id || null}
                  center={selectedSchool ? selectedSchool.coordinates : undefined}
                  schoolMarker={selectedSchool || undefined}
                />
              </div>
            </div>
          )}

          {/* ╔═══════════════ TAB: MAKERSPACES ═══════════════╗ */}
          {activeTab === "makerspaces" && (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {MAKERSPACES.map((space) => (
                <article
                  key={space.id}
                  className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-950/10"
                >
                  <img
                    src={space.image}
                    alt={pickLang(space.name, lang)}
                    className="h-48 w-full object-cover"
                  />
                  <div className="space-y-3 p-6">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="text-lg font-semibold text-slate-950">{pickLang(space.name, lang)}</h3>
                      <span className="flex items-center gap-1 whitespace-nowrap rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                        <Star className="h-3 w-3" />
                        {space.rating}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed text-slate-600">{pickLang(space.description, lang)}</p>
                    <div className="space-y-1.5 text-sm text-slate-500">
                      <div className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5" />{pickLang(space.location, lang)}</div>
                      <div className="flex items-center gap-2"><Clock className="h-3.5 w-3.5" />{pickLang(space.hours, lang)}</div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

        </div>
      </section>
    </main>
  );
}
