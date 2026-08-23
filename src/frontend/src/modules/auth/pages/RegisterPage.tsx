import React, { useEffect, useRef, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus, School as SchoolIcon, Sparkles } from "lucide-react";
import { supabase, urlDeRetorno } from "../../../shared/lib/supabaseClient";
import { reenviarConfirmacion } from "../../../shared/lib/confirmacion";
import { useTranslation } from "react-i18next";
import { fetchSchools } from "../../../api";
import type { School } from "../../../types";
import logo from "../../../assets/images/logo.png";

// La plataforma la usan estudiantes de enseñanza básica y media y sus
// docentes; fuera de este rango el dato no es plausible.
const EDAD_MIN = 5;
const EDAD_MAX = 99;

export default function RegisterPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const nomeRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const senhaRef = useRef<HTMLInputElement>(null);

  // Rol del usuario: 'profesor' o 'estudiante'
  const [role, setRole] = useState<"profesor" | "estudiante">("profesor");

  // Escuelas para docentes
  const [schools, setSchools] = useState<School[]>([]);
  const [selectedSchoolId, setSelectedSchoolId] = useState<string>("");
  const [schoolSearch, setSchoolSearch] = useState<string>("");
  const [selectedCommune, setSelectedCommune] = useState<string>("");
  const [subject, setSubject] = useState<string>("");

  // Se guarda como texto para que el campo pueda quedar vacío mientras se
  // escribe; se valida y convierte al enviar.
  const [idade, setIdade] = useState("25");
  const [loading, setLoading] = useState(false);
  const [aviso, setAviso] = useState<{ tipo: "error" | "info"; texto: string } | null>(
    null
  );
  // Correo a la espera de confirmación, para poder reenviar el enlace sin
  // obligar a rellenar el formulario otra vez.
  const [emailPendiente, setEmailPendiente] = useState<string | null>(null);
  const [reenviando, setReenviando] = useState(false);

  // Cargar lista de escuelas para el selector de docentes
  useEffect(() => {
    fetchSchools()
      .then((data) => {
        setSchools(data);
      })
      .catch((err) => {
        console.warn("No se pudieron cargar escuelas vía API, intentando Supabase...", err);
        supabase
          .from("schools")
          .select("id, rbd, name, commune, dependency, rural")
          .order("commune")
          .order("name")
          .then(({ data: sbSchools, error }) => {
            if (!error && sbSchools) {
              setSchools(sbSchools as unknown as School[]);
            }
          });
      });
  }, []);

  // Comunas únicas disponibles
  const communes = useMemo(() => {
    return [...new Set(schools.map((s) => s.commune))].filter(Boolean).sort();
  }, [schools]);

  // Escuelas filtradas para selección
  const filteredSchools = useMemo(() => {
    let list = schools;
    if (selectedCommune) {
      list = list.filter((s) => s.commune === selectedCommune);
    }
    if (schoolSearch.trim()) {
      const q = schoolSearch.toLowerCase();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.commune.toLowerCase().includes(q)
      );
    }
    return list;
  }, [schools, selectedCommune, schoolSearch]);

  const selectedSchoolObj = useMemo(() => {
    return schools.find((s) => s.id === selectedSchoolId);
  }, [schools, selectedSchoolId]);

  async function handleCadastro(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;

    const nome = nomeRef.current?.value?.trim();
    const email = emailRef.current?.value?.trim();
    const senha = senhaRef.current?.value;

    setAviso(null);
    setEmailPendiente(null);

    if (!nome || !email || !senha) {
      setAviso({ tipo: "error", texto: t("register.validation.required") });
      return;
    }

    // Supabase rechaza contraseñas de menos de seis caracteres. Avisar aquí
    // ahorra el viaje al servidor y un mensaje de error en inglés.
    if (senha.length < 6) {
      setAviso({ tipo: "error", texto: t("register.validation.passwordLength") });
      return;
    }

    const edad = Number(idade);

    if (!Number.isInteger(edad) || edad < EDAD_MIN || edad > EDAD_MAX) {
      setAviso({
        tipo: "error",
        texto: t("register.validation.ageRange", { min: EDAD_MIN, max: EDAD_MAX }),
      });
      return;
    }

    setLoading(true);

    try {
      const metadata = {
        nome,
        idade: String(edad),
        role,
        school_id: selectedSchoolId || null,
        subject: subject.trim() || null,
      };

      const { data, error } = await supabase.auth.signUp({
        email,
        password: senha,
        options: {
          data: metadata,
          // Sin esto el enlace vuelve al Site URL configurado en Supabase,
          // que es justo el ajuste que suele quedar apuntando a localhost.
          emailRedirectTo: urlDeRetorno(),
        },
      });

      if (error) {
        setAviso({ tipo: "error", texto: error.message });
        return;
      }

      // Con un correo ya registrado, Supabase devuelve un éxito falso —para no
      // revelar qué direcciones existen— y lo delata dejando `identities` vacío.
      if (data.user && data.user.identities && data.user.identities.length === 0) {
        setAviso({ tipo: "error", texto: t("register.emailTaken") });
        return;
      }

      // Sin sesión, la cuenta existe pero todavía no sirve: falta confirmar el
      // correo. Mandar al login aquí es lo que hacía parecer que el registro
      // funcionaba, cuando en realidad dejaba al usuario sin poder entrar.
      if (!data.session) {
        setEmailPendiente(email);
        setAviso({ tipo: "info", texto: t("register.confirmEmail", { email }) });
        return;
      }

      // Solo con sesión activa el JWT permite escribir el perfil bajo RLS. Si el
      // disparador de base de datos está instalado, la fila ya existe y esto se
      // limita a completarla con rol y escuela.
      const { error: perfilError } = await supabase
        .from("profiles")
        .upsert(
          {
            id: data.session.user.id,
            nome,
            idade: edad,
            role,
            school_id: selectedSchoolId || null,
            subject: subject.trim() || null,
          },
          { onConflict: "id" }
        );

      if (perfilError) {
        console.error("No se pudo guardar el perfil:", perfilError);
        setAviso({
          tipo: "info",
          texto: t("register.profileWarning", { motivo: perfilError.message }),
        });
        return;
      }

      navigate("/plataforma?tab=map", { replace: true });
    } catch (err: any) {
      setAviso({ tipo: "error", texto: err?.message || t("register.error") });
    } finally {
      setLoading(false);
    }
  }

  async function handleReenviar() {
    if (!emailPendiente || reenviando) return;
    setReenviando(true);
    const { error } = await reenviarConfirmacion(emailPendiente);
    setReenviando(false);
    setAviso({
      tipo: error ? "error" : "info",
      texto: error
        ? t("register.resendError", { motivo: error.message })
        : t("register.resendOk", { email: emailPendiente }),
    });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f7f8fb] px-4 py-10">
      <div className="w-full max-w-5xl">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center">
          <Link to="/">
            <img
              src={logo}
              alt="AprendeLocal"
              className="h-12 w-12 rounded-full border border-slate-200 object-cover"
            />
          </Link>
          <span className="mt-3 text-lg font-semibold tracking-tight text-slate-950">
            AprendeLocal
          </span>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Form card */}
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm md:p-10">
            <div className="text-center">
              <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
                {t("register.title")}
              </h2>
              <p className="mt-2 text-sm text-slate-500">{t("register.subtitle")}</p>
            </div>

            {/* Selector de Rol */}
            <div className="mt-6">
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Selecciona tu tipo de cuenta
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole("profesor")}
                  className={`flex flex-col items-center justify-center rounded-2xl border-2 p-3 text-center transition ${
                    role === "profesor"
                      ? "border-emerald-600 bg-emerald-50 text-emerald-950 shadow-sm"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                  }`}
                >
                  <span className="text-2xl">👩‍🏫</span>
                  <span className="mt-1 text-sm font-semibold">Soy Profesor/a</span>
                  <span className="text-[11px] text-slate-500">Proyectos para mi escuela</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole("estudiante")}
                  className={`flex flex-col items-center justify-center rounded-2xl border-2 p-3 text-center transition ${
                    role === "estudiante"
                      ? "border-emerald-600 bg-emerald-50 text-emerald-950 shadow-sm"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                  }`}
                >
                  <span className="text-2xl">🧑‍🎓</span>
                  <span className="mt-1 text-sm font-semibold">Soy Estudiante</span>
                  <span className="text-[11px] text-slate-500">Aprender y explorar</span>
                </button>
              </div>
            </div>

            {aviso && (
              <div
                role="alert"
                aria-live="polite"
                className={
                  aviso.tipo === "error"
                    ? "mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
                    : "mt-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900"
                }
              >
                {aviso.texto}
                {emailPendiente && (
                  <button
                    type="button"
                    onClick={handleReenviar}
                    disabled={reenviando}
                    className="mt-3 block font-semibold underline underline-offset-2 disabled:opacity-60"
                  >
                    {reenviando ? t("register.resending") : t("register.resend")}
                  </button>
                )}
              </div>
            )}

            <form className="mt-6 space-y-4" onSubmit={handleCadastro}>
              {/* Sección exclusiva para profesores: selección de escuela rural */}
              {role === "profesor" && (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4">
                  <div className="flex items-center gap-2 text-emerald-900 font-semibold text-sm mb-2">
                    <SchoolIcon className="h-4 w-4 text-emerald-600" />
                    <span>Escuela Rural Asignada</span>
                  </div>
                  <p className="text-xs text-slate-600 mb-3">
                    La plataforma cargará automáticamente los lugares patrimoniales, naturales y proyectos STEM cercanos a tu escuela.
                  </p>

                  {/* Filtro por comuna */}
                  {communes.length > 0 && (
                    <div className="mb-2">
                      <select
                        value={selectedCommune}
                        onChange={(e) => setSelectedCommune(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 outline-none focus:border-emerald-500"
                      >
                        <option value="">Todas las comunas ({schools.length} escuelas)</option>
                        {communes.map((c) => (
                          <option key={c} value={c}>
                            {c} ({schools.filter((s) => s.commune === c).length})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Buscador de escuela */}
                  <div className="mb-2">
                    <input
                      type="text"
                      placeholder="Buscar por nombre de escuela..."
                      value={schoolSearch}
                      onChange={(e) => setSchoolSearch(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 outline-none focus:border-emerald-500"
                    />
                  </div>

                  {/* Selector de escuela */}
                  <div>
                    <select
                      value={selectedSchoolId}
                      onChange={(e) => setSelectedSchoolId(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 font-medium"
                    >
                      <option value="">-- Elige tu escuela rural --</option>
                      {filteredSchools.map((sch) => (
                        <option key={sch.id} value={sch.id}>
                          {sch.name} · {sch.commune} {sch.dependency ? `(${sch.dependency})` : ""}
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedSchoolObj && (
                    <div className="mt-2.5 flex items-center justify-between rounded-xl bg-white p-2.5 border border-emerald-100 text-xs">
                      <div>
                        <span className="font-semibold text-slate-900">{selectedSchoolObj.name}</span>
                        <div className="text-slate-500">📍 {selectedSchoolObj.commune} · RBD: {selectedSchoolObj.rbd}</div>
                      </div>
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 font-medium text-emerald-800 text-[10px]">
                        Rural Activo
                      </span>
                    </div>
                  )}

                  <div className="mt-3">
                    <label className="mb-1 block text-xs font-medium text-slate-700">
                      Asignatura / Especialidad (Opcional)
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: Ciencias Naturales, Matemáticas, Multidisciplinario"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 outline-none focus:border-slate-400"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  {t("register.fields.name")}
                </label>
                <input
                  ref={nomeRef}
                  type="text"
                  placeholder={t("register.placeholders.name")}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-1 focus:ring-slate-400"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  {t("register.fields.email")}
                </label>
                <input
                  ref={emailRef}
                  type="email"
                  placeholder={t("register.placeholders.email")}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-1 focus:ring-slate-400"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  {t("register.fields.password")}
                </label>
                <input
                  ref={senhaRef}
                  type="password"
                  placeholder={t("register.placeholders.password")}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-1 focus:ring-slate-400"
                />
              </div>

              <div>
                <label
                  htmlFor="idade"
                  className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                  {t("register.fields.age")}
                </label>
                <input
                  id="idade"
                  type="number"
                  inputMode="numeric"
                  min={EDAD_MIN}
                  max={EDAD_MAX}
                  step={1}
                  value={idade}
                  onChange={(e) => setIdade(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-1 focus:ring-slate-400"
                />
              </div>

              <button
                disabled={loading}
                className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#111217] px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60"
              >
                <UserPlus className="h-4 w-4" />
                {loading ? t("register.button.loading") : t("register.button.register")}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              {t("register.loginText")}{" "}
              <Link to="/entrar" className="font-semibold text-slate-950 hover:underline">
                {t("register.loginAction")}
              </Link>
            </p>
          </div>

          {/* Hero side */}
          <div className="flex flex-col items-center justify-center rounded-[2rem] border border-slate-200 bg-[#111217] p-10 text-center lg:text-left">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
              <Sparkles className="h-3.5 w-3.5" />
              Educación STEM Geolocalizada
            </div>

            <h1 className="text-3xl font-semibold leading-tight tracking-tight text-white md:text-4xl">
              {role === "profesor"
                ? "Conecta tu escuela rural con el patrimonio de La Araucanía"
                : t("register.heroTitle")}
            </h1>

            <p className="mt-5 text-base leading-relaxed text-slate-400">
              {role === "profesor"
                ? "Como docente, podrás vincular tus objetivos de aprendizaje con parques nacionales, volcanes, reservas naturales y el patrimonio local para crear proyectos contextualizados."
                : t("register.heroSubtitle")}
            </p>

            <div className="mt-8">
              <Link
                to="/"
                className="inline-flex items-center gap-2 rounded-full border border-slate-600 bg-white px-6 py-3 text-sm font-semibold text-slate-950 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                {t("register.backHome")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
