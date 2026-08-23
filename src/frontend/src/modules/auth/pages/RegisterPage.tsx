import React, { useEffect, useRef, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus, Sparkles, KeyRound, CheckCircle2, AlertCircle } from "lucide-react";
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

  // Escuelas y validación por código
  const [schools, setSchools] = useState<School[]>([]);
  const [schoolCodeInput, setSchoolCodeInput] = useState<string>("");
  const [validatedSchool, setValidatedSchool] = useState<School | null>(null);
  const [validatedProject, setValidatedProject] = useState<{
    id: string;
    code: string;
    title: string;
    school_id?: string;
  } | null>(null);
  const [codeError, setCodeError] = useState<string>("");
  const [showCodeHelp, setShowCodeHelp] = useState<boolean>(false);
  const [subject, setSubject] = useState<string>("");

  // Se guarda como texto para que el campo pueda quedar vacío mientras se
  // escribe; se valida y convierte al enviar.
  const [idade, setIdade] = useState("14");
  const [loading, setLoading] = useState(false);
  const [aviso, setAviso] = useState<{ tipo: "error" | "info"; texto: string } | null>(
    null
  );
  // Correo a la espera de confirmación, para poder reenviar el enlace sin
  // obligar a rellenar el formulario otra vez.
  const [emailPendiente, setEmailPendiente] = useState<string | null>(null);
  const [reenviando, setReenviando] = useState(false);

  // Cargar lista de escuelas para validación de códigos
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

  // Función para validar el código de la escuela o proyecto
  const handleValidateCode = async (inputVal?: string) => {
    const code = (inputVal !== undefined ? inputVal : schoolCodeInput).trim().toUpperCase();
    if (!code) {
      setValidatedSchool(null);
      setValidatedProject(null);
      setCodeError(
        role === "profesor"
          ? "Ingresa el código o RBD de tu escuela."
          : "Ingresa el código de tu escuela o el código de tu profesor/a."
      );
      return;
    }

    // 1. Buscar coincidencia en escuelas (RBD o formato ESC-[RBD])
    const matchSchool = schools.find((s) => {
      const rbdStr = String(s.rbd).toUpperCase();
      const escCode = `ESC-${rbdStr}`;
      return (
        code === rbdStr ||
        code === escCode ||
        (s as any).access_code?.toUpperCase() === code
      );
    });

    if (matchSchool) {
      setValidatedSchool(matchSchool);
      setValidatedProject(null);
      setCodeError("");
      return;
    }

    // 2. Si es estudiante, buscar si es un código de proyecto generado por un profesor
    if (role === "estudiante") {
      try {
        const { data: shareData, error } = await supabase
          .from("project_share_codes")
          .select("id, code, project_id, school_id, stem_projects(title)")
          .eq("code", code)
          .maybeSingle();

        if (!error && shareData) {
          setValidatedProject({
            id: shareData.id,
            code: shareData.code,
            title: (shareData.stem_projects as any)?.title || "Proyecto STEM Asignado",
            school_id: shareData.school_id,
          });

          if (shareData.school_id) {
            const sch = schools.find((s) => s.id === shareData.school_id);
            if (sch) setValidatedSchool(sch);
          }
          setCodeError("");
          return;
        }
      } catch (err) {
        console.warn("Error buscando código de proyecto:", err);
      }
    }

    setValidatedSchool(null);
    setValidatedProject(null);
    setCodeError(
      role === "profesor"
        ? "Código no válido. Ingresa el código oficial o RBD de tu escuela rural."
        : "Código no válido. Ingresa el código de tu escuela rural o el código que te dio tu profesor/a."
    );
  };

  // Escuelas destacadas para ayuda de prueba en el piloto
  const pilotSampleCodes = useMemo(() => {
    return schools.slice(0, 6).map((s) => ({
      name: s.name,
      commune: s.commune,
      rbd: s.rbd,
      code: `ESC-${s.rbd}`,
    }));
  }, [schools]);

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

    // Obligatorio para ambos roles: deben haber validado un código
    if (!validatedSchool && !validatedProject) {
      setAviso({
        tipo: "error",
        texto:
          role === "profesor"
            ? "Debes ingresar y validar el código o RBD de tu escuela rural para registrarte."
            : "Debes ingresar y validar el código de tu escuela o el código de proyecto de tu profesor/a para registrarte.",
      });
      return;
    }

    // Supabase rechaza contraseñas de menos de seis caracteres.
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
        school_id: validatedSchool?.id || null,
        project_code: validatedProject?.code || null,
        subject: role === "profesor" ? subject.trim() || null : null,
      };

      const { data, error } = await supabase.auth.signUp({
        email,
        password: senha,
        options: {
          data: metadata,
          emailRedirectTo: urlDeRetorno(),
        },
      });

      if (error) {
        setAviso({ tipo: "error", texto: error.message });
        return;
      }

      if (data.user && data.user.identities && data.user.identities.length === 0) {
        setAviso({ tipo: "error", texto: t("register.emailTaken") });
        return;
      }

      if (!data.session) {
        setEmailPendiente(email);
        setAviso({ tipo: "info", texto: t("register.confirmEmail", { email }) });
        return;
      }

      const { error: perfilError } = await supabase
        .from("profiles")
        .upsert(
          {
            id: data.session.user.id,
            nome,
            idade: edad,
            role,
            school_id: validatedSchool?.id || null,
            subject: role === "profesor" ? subject.trim() || null : null,
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

      navigate(role === "profesor" ? "/plataforma?tab=map" : "/plataforma", { replace: true });
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
                  onClick={() => {
                    setRole("profesor");
                    setValidatedSchool(null);
                    setValidatedProject(null);
                    setSchoolCodeInput("");
                    setCodeError("");
                    setIdade("28");
                  }}
                  className={`flex flex-col items-center justify-center rounded-2xl border-2 p-3 text-center transition ${
                    role === "profesor"
                      ? "border-emerald-600 bg-emerald-50 text-emerald-950 shadow-sm"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                  }`}
                >
                  <span className="text-2xl">👩‍🏫</span>
                  <span className="mt-1 text-sm font-semibold">Soy Profesor/a</span>
                  <span className="text-[11px] text-slate-500">Código de escuela</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setRole("estudiante");
                    setValidatedSchool(null);
                    setValidatedProject(null);
                    setSchoolCodeInput("");
                    setCodeError("");
                    setIdade("14");
                  }}
                  className={`flex flex-col items-center justify-center rounded-2xl border-2 p-3 text-center transition ${
                    role === "estudiante"
                      ? "border-emerald-600 bg-emerald-50 text-emerald-950 shadow-sm"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                  }`}
                >
                  <span className="text-2xl">🧑‍🎓</span>
                  <span className="mt-1 text-sm font-semibold">Soy Estudiante</span>
                  <span className="text-[11px] text-slate-500">Código de clase/escuela</span>
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
              {/* Sección de Validación de Código (Obligatorio para Profesores y Estudiantes) */}
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4">
                <div className="flex items-center gap-2 text-emerald-900 font-semibold text-sm mb-1.5">
                  <KeyRound className="h-4 w-4 text-emerald-600" />
                  <span>
                    {role === "profesor"
                      ? "Código de Acceso de tu Escuela"
                      : "Código de Escuela o de tu Profesor/a"}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mb-3">
                  {role === "profesor"
                    ? "Ingresa el código oficial o RBD de tu escuela rural (ej: 4205 o ESC-4205) para activar tu acceso docente."
                    : "Ingresa el código de tu escuela rural (ej: ESC-4205 o 4205) o el código que te dio tu profesor/a para unirte."}
                </p>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder={role === "profesor" ? "Ej: ESC-4205 o 4205" : "Ej: ESC-4205 o código de clase"}
                    value={schoolCodeInput}
                    onChange={(e) => {
                      setSchoolCodeInput(e.target.value);
                      if (codeError) setCodeError("");
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleValidateCode();
                      }
                    }}
                    className="flex-1 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 outline-none uppercase font-mono tracking-wider focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                  />
                  <button
                    type="button"
                    onClick={() => handleValidateCode()}
                    className="rounded-xl bg-emerald-700 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-emerald-800 transition"
                  >
                    Validar
                  </button>
                </div>

                {codeError && (
                  <div className="mt-2 flex items-center gap-1.5 text-xs text-red-600">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    <span>{codeError}</span>
                  </div>
                )}

                {/* Confirmación de escuela validada */}
                {validatedSchool && (
                  <div className="mt-3 flex items-start gap-2.5 rounded-xl border border-emerald-300 bg-white p-3 shadow-sm">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div className="min-w-0 flex-1 text-xs">
                      <div className="font-semibold text-slate-900 text-sm">
                        {validatedSchool.name}
                      </div>
                      <div className="text-slate-500 mt-0.5">
                        📍 {validatedSchool.commune} · RBD: <span className="font-mono font-medium text-slate-700">{validatedSchool.rbd}</span>
                      </div>
                      <div className="mt-1 inline-block rounded-full bg-emerald-100 px-2 py-0.5 font-medium text-emerald-800 text-[10px]">
                        ✓ {role === "profesor" ? "Escuela Asignada al Docente" : "Escuela del Estudiante"}
                      </div>
                    </div>
                  </div>
                )}

                {/* Confirmación de proyecto validado para estudiantes */}
                {validatedProject && (
                  <div className="mt-3 flex items-start gap-2.5 rounded-xl border border-blue-300 bg-white p-3 shadow-sm">
                    <CheckCircle2 className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                    <div className="min-w-0 flex-1 text-xs">
                      <div className="font-semibold text-slate-900 text-sm">
                        {validatedProject.title}
                      </div>
                      <div className="text-slate-500 mt-0.5">
                        Código de clase: <span className="font-mono font-bold text-blue-800">{validatedProject.code}</span>
                      </div>
                      <div className="mt-1 inline-block rounded-full bg-blue-100 px-2 py-0.5 font-medium text-blue-800 text-[10px]">
                        ✓ Proyecto de Profesor Conectado
                      </div>
                    </div>
                  </div>
                )}

                {/* Ayuda de códigos piloto */}
                <div className="mt-2 text-right">
                  <button
                    type="button"
                    onClick={() => setShowCodeHelp(!showCodeHelp)}
                    className="text-[11px] text-emerald-800 hover:text-emerald-950 underline underline-offset-2"
                  >
                    {showCodeHelp ? "Ocultar códigos piloto" : "¿No sabes el código? Ver códigos piloto"}
                  </button>
                </div>

                {showCodeHelp && (
                  <div className="mt-2 rounded-xl bg-white p-2.5 border border-emerald-200 text-[11px] space-y-1.5 max-h-36 overflow-y-auto">
                    <p className="font-semibold text-slate-700">Códigos de escuelas piloto en La Araucanía:</p>
                    {pilotSampleCodes.map((c) => (
                      <button
                        key={c.rbd}
                        type="button"
                        onClick={() => {
                          setSchoolCodeInput(c.code);
                          handleValidateCode(c.code);
                        }}
                        className="flex w-full items-center justify-between p-1 rounded hover:bg-emerald-50 text-left transition"
                      >
                        <span className="truncate text-slate-800">{c.name} ({c.commune})</span>
                        <span className="font-mono font-semibold text-emerald-700 shrink-0 ml-2">{c.code}</span>
                      </button>
                    ))}
                  </div>
                )}

                {role === "profesor" && (
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
                )}
              </div>

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
                ? "Conecta tu escuela rural con el territorio de La Araucanía"
                : "Aprende ciencia y tecnología con tu escuela"}
            </h1>

            <p className="mt-5 text-base leading-relaxed text-slate-400">
              {role === "profesor"
                ? "Como docente registrado con el código de tu escuela, accederás directamente a los puntos de interés patrimoniales, biológicos y geológicos de tu territorio escolar."
                : "Ingresa el código de tu escuela o el código que te compartió tu profesor/a para comenzar tus proyectos y actividades."}
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
