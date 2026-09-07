import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { School as SchoolIcon, X, Check, ArrowRight } from "lucide-react";

import { supabase } from "../../../shared/lib/supabaseClient";
import { UserInfoCard } from "../components/UserInfoCard";
import { BadgesSection } from "../components/BadgesSection";
import { CommunitiesSection } from "../components/CommunitiesSection";
import { ActiveCourses } from "../components/ActiveCourses";
import { pickLang } from "../utils";
import type { ProfileData } from "../types";
import type { School } from "../../../types";
import { fetchSchools } from "../../../api";

export default function ProfilePage() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const lang = (i18n.resolvedLanguage || "pt").split("-")[0];

  const msg = {
    profile: {
      title: t("profile.title"),
      subtitle: t("profile.subtitle"),
      loading: t("profile.loading"),
      userFallback: t("profile.userFallback"),
      notInformed: t("profile.notInformed"),
    },
  };

  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [userId, setUserId] = useState<string | null>(null);

  const [profile, setProfile] = useState<ProfileData>({
    name: "",
    age: null,
    avatarUrl: "",
    role: "profesor",
    school_id: null,
    school_name: null,
    school_commune: null,
    subject: null,
  });

  // Modal / selector de cambio de escuela
  const [schools, setSchools] = useState<School[]>([]);
  const [showSchoolModal, setShowSchoolModal] = useState(false);
  const [selectedModalSchoolId, setSelectedModalSchoolId] = useState<string>("");
  const [modalSchoolSearch, setModalSchoolSearch] = useState("");
  const [savingSchool, setSavingSchool] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadPerfil() {
      setLoading(true);
      setErro("");

      const { data: userData, error: userErr } = await supabase.auth.getUser();
      const user = userData?.user;
      if (userErr || !user) { navigate("/entrar"); return; }
      if (isMounted) setUserId(user.id);

      const { data: prof, error: profErr } = await supabase
        .from("profiles")
        .select("nome, idade, avatar_url, role, school_id, subject")
        .eq("id", user.id)
        .maybeSingle();

      if (!isMounted) return;

      const nomeMeta = user.user_metadata?.nome ?? "";
      const avatarMeta = user.user_metadata?.avatar_url ?? "";
      const roleMeta = user.user_metadata?.role ?? "profesor";
      const schoolIdMeta = user.user_metadata?.school_id ?? null;
      const subjectMeta = user.user_metadata?.subject ?? null;

      let schoolName: string | null = null;
      let schoolCommune: string | null = null;
      const targetSchoolId = prof?.school_id || schoolIdMeta;

      if (targetSchoolId) {
        const { data: schData } = await supabase
          .from("schools")
          .select("id, name, commune")
          .eq("id", targetSchoolId)
          .maybeSingle();
        if (schData) {
          schoolName = schData.name;
          schoolCommune = schData.commune;
        }
      }

      if (profErr) {
        setProfile({
          name: nomeMeta || user.email || msg.profile.userFallback,
          age: null,
          avatarUrl: avatarMeta || "",
          role: roleMeta,
          school_id: schoolIdMeta,
          school_name: schoolName,
          school_commune: schoolCommune,
          subject: subjectMeta,
        });
        setLoading(false);
        return;
      }

      if (!prof) {
        await supabase.from("profiles").insert([{
          id: user.id,
          nome: nomeMeta || (user.email ?? msg.profile.userFallback),
          avatar_url: avatarMeta || null,
          role: roleMeta,
          school_id: schoolIdMeta,
          subject: subjectMeta,
        }]);
        setProfile({
          name: nomeMeta || user.email || msg.profile.userFallback,
          age: null,
          avatarUrl: avatarMeta || "",
          role: roleMeta,
          school_id: schoolIdMeta,
          school_name: schoolName,
          school_commune: schoolCommune,
          subject: subjectMeta,
        });
        setLoading(false);
        return;
      }

      setProfile({
        name: prof.nome || user.email || msg.profile.userFallback,
        age: prof.idade ?? null,
        avatarUrl: prof.avatar_url || "",
        role: prof.role || roleMeta,
        school_id: prof.school_id || schoolIdMeta,
        school_name: schoolName,
        school_commune: schoolCommune,
        subject: prof.subject || subjectMeta,
      });
      setLoading(false);
    }

    loadPerfil();
    return () => { isMounted = false; };
  }, [navigate, msg.profile.userFallback]);

  // Cargar catálogo de escuelas si se abre el modal
  const openSchoolModal = async () => {
    setSelectedModalSchoolId(profile.school_id || "");
    setShowSchoolModal(true);
    if (schools.length === 0) {
      try {
        const data = await fetchSchools();
        setSchools(data);
      } catch (err) {
        console.error("Error al cargar escuelas:", err);
      }
    }
  };

  const handleSaveSchool = async () => {
    if (!userId) return;
    setSavingSchool(true);
    try {
      const schObj = schools.find((s) => s.id === selectedModalSchoolId);
      const { error } = await supabase
        .from("profiles")
        .update({ school_id: selectedModalSchoolId || null })
        .eq("id", userId);

      if (error) throw error;

      setProfile((prev) => ({
        ...prev,
        school_id: selectedModalSchoolId || null,
        school_name: schObj?.name || null,
        school_commune: schObj?.commune || null,
      }));
      setShowSchoolModal(false);
    } catch (err: any) {
      alert("Error al guardar la escuela: " + (err?.message || ""));
    } finally {
      setSavingSchool(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f7f8fb] pt-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <p className="text-slate-500">{msg.profile.loading}</p>
        </div>
      </main>
    );
  }

  const nameText = pickLang(profile.name, lang) || msg.profile.userFallback;
  const avatarText = pickLang(profile.avatarUrl, lang) || "";
  const ageText = profile.age ?? msg.profile.notInformed;

  const filteredModalSchools = schools.filter((s) => {
    if (!modalSchoolSearch.trim()) return true;
    const q = modalSchoolSearch.toLowerCase();
    return s.name.toLowerCase().includes(q) || s.commune.toLowerCase().includes(q);
  });

  return (
    <main className="min-h-screen bg-white text-[#111217]">
      {/* Header */}
      <section className="bg-[#f7f8fb] pb-12 pt-28 md:pt-32">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-semibold tracking-[-0.04em] text-[#111217] sm:text-4xl md:text-5xl">
            {msg.profile.title}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-500">
            {msg.profile.subtitle}
          </p>

          {erro && (
            <div className="mt-6 max-w-2xl rounded-2xl border border-red-200 bg-red-50 px-6 py-4 text-sm text-red-600">
              {erro}
            </div>
          )}
        </div>
      </section>

      {/* Content */}
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <UserInfoCard
                name={nameText}
                age={ageText}
                avatarUrl={avatarText}
                role={profile.role}
                schoolName={profile.school_name}
                schoolCommune={profile.school_commune}
                subject={profile.subject}
                onEditSchool={openSchoolModal}
              />

              {/* Banner de acceso rápido a los lugares para proyectos de su escuela */}
              {profile.role === "profesor" && profile.school_id && (
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-[2rem] border border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 p-6 shadow-sm">
                  <div>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                      📍 Proyectos Geolocalizados
                    </span>
                    <h3 className="mt-2 text-lg font-semibold text-emerald-950">
                      Lugares STEM para {profile.school_name}
                    </h3>
                    <p className="mt-1 text-sm text-emerald-800/80">
                      Explora el mapa y descubre los puntos de interés patrimoniales, biológicos y geológicos en el territorio de tu escuela en {profile.school_commune}.
                    </p>
                  </div>
                  {/* Apuntaba a /plataforma?tab=map, que dejo de existir al
                      sacar las vistas antiguas y hoy redirige a la portada: el
                      boton prometia un mapa y devolvia al inicio. Lo que vive
                      alrededor de la escuela ahora se consulta al armar la
                      ruta, asi que lleva ahi. */}
                  <Link
                    to="/crear"
                    className="shrink-0 inline-flex items-center gap-2 rounded-full bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-emerald-800 transition"
                  >
                    Armar una ruta aquí
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              )}

              <BadgesSection />
              <CommunitiesSection />
            </div>

            {userId && (
              <div className="flex flex-col gap-6 lg:col-span-1">
                <ActiveCourses userId={userId} />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Modal para asignar o cambiar escuela */}
      {showSchoolModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <SchoolIcon className="h-5 w-5 text-emerald-600" />
                <h3 className="text-lg font-semibold text-slate-900">
                  Asignar Escuela Rural
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowSchoolModal(false)}
                className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="mt-3 text-xs text-slate-600">
              Selecciona tu escuela rural para que el sistema cargue automáticamente los lugares de aprendizaje geocontextualizados para tus estudiantes.
            </p>

            <div className="mt-4">
              <input
                type="text"
                placeholder="Buscar por nombre o comuna (ej: Lonquimay, Melipeuco)..."
                value={modalSchoolSearch}
                onChange={(e) => setModalSchoolSearch(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div className="mt-3 max-h-60 overflow-y-auto space-y-2 pr-1">
              {filteredModalSchools.length === 0 ? (
                <p className="py-6 text-center text-xs text-slate-500">
                  No se encontraron escuelas.
                </p>
              ) : (
                filteredModalSchools.map((sch) => (
                  <button
                    key={sch.id}
                    type="button"
                    onClick={() => setSelectedModalSchoolId(sch.id)}
                    className={`flex w-full items-center justify-between rounded-xl border p-3 text-left transition ${
                      selectedModalSchoolId === sch.id
                        ? "border-emerald-600 bg-emerald-50/80 text-emerald-950"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <div>
                      <div className="text-sm font-semibold">{sch.name}</div>
                      <div className="text-xs text-slate-500">
                        📍 {sch.commune} · RBD: {sch.rbd} {sch.dependency ? `· ${sch.dependency}` : ""}
                      </div>
                    </div>
                    {selectedModalSchoolId === sch.id && (
                      <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                    )}
                  </button>
                ))
              )}
            </div>

            <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={() => setShowSchoolModal(false)}
                className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSaveSchool}
                disabled={savingSchool}
                className="rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-emerald-700 disabled:opacity-60"
              >
                {savingSchool ? "Guardando..." : "Guardar Escuela"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
