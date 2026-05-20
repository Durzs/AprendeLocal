import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

import { supabase } from "../../../shared/lib/supabaseClient";
import { normalize, pickLang } from "../utils";
import type { Course, Particle } from "../types";

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

  const particles = useMemo<Particle[]>(() => {
    const w = typeof window !== "undefined" ? window.innerWidth : 1200;
    const h = typeof window !== "undefined" ? window.innerHeight : 800;

    return [...Array(20)].map(() => ({
      x: Math.random() * w,
      y: Math.random() * h,
      scale: Math.random() * 0.5 + 0.5,
      dy: Math.random() * -100 - 50,
      dx: Math.random() * 100 - 50,
      duration: Math.random() * 10 + 10,
    }));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8">
        <motion.div
          initial={{ y: -25, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.45 }}
          className="mb-6"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow mb-2">
            {t("courses.title")}
          </h1>
          <p className="text-white/80 max-w-2xl">{t("courses.subtitle")}</p>
        </motion.div>

        {erro ? (
          <div className="mb-6 p-4 rounded-2xl bg-red-50/90 text-red-700 border border-red-200 shadow">
            {erro}
          </div>
        ) : null}

        <input
          type="text"
          placeholder={t("courses.searchPlaceholder")}
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="w-full mb-8 px-4 py-3 rounded-2xl bg-white/70 backdrop-blur border border-white/40 shadow focus:outline-none"
        />

        {loading ? (
          <p className="text-white/80">{t("courses.loading")}</p>
        ) : cursosFiltrados.length === 0 ? (
          <p className="text-white/80">{t("courses.noneFound")}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-10">
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
                <div
                  key={curso.id}
                  className="rounded-2xl overflow-hidden bg-white/85 backdrop-blur border border-white/40 shadow hover:shadow-lg transition"
                >
                  <img
                    src={curso.url_img}
                    alt={t("courses.courseImageAlt", { title: titulo || "—" })}
                    className="h-44 w-full object-cover"
                  />

                  <div className="p-6 space-y-3">
                    <div className="flex justify-between items-start gap-4">
                      <div className="min-w-0">
                        <h2 className="font-semibold text-lg text-black truncate">{titulo}</h2>
                        <div className="mt-1 flex flex-wrap gap-2">
                          <span className="text-xs bg-blue-100 text-blue-900 px-2 py-1 rounded-full">{categoria}</span>
                          <span className="text-xs bg-slate-100 text-slate-900 px-2 py-1 rounded-full">{nivel}</span>
                          <span className="text-xs bg-green-300 text-slate-900 px-2 py-1 rounded-full">{badge}</span>
                        </div>
                      </div>

                      <span className="text-xs px-2 py-1 rounded-full whitespace-nowrap bg-white/70 text-slate-800">
                        {statusTexto}
                      </span>
                    </div>

                    <p className="text-slate-700 text-sm line-clamp-3">{descricao}</p>

                    <button
                      onClick={() => iniciarOuContinuar(curso.id)}
                      className="w-full mt-2 font-semibold px-4 py-3 rounded-xl shadow bg-blue-700 text-white hover:opacity-90 transition"
                    >
                      {buttonText}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {particles.map((p, i) => (
          <motion.div
            key={i}
            initial={{ x: p.x, y: p.y, scale: p.scale }}
            animate={{ y: [null, p.dy], x: [null, p.dx] }}
            transition={{ duration: p.duration, repeat: Infinity, repeatType: "reverse" }}
            className="absolute w-2 h-2 bg-blue-300 rounded-full opacity-30"
          />
        ))}
      </div>
    </div>
  );
}