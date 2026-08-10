import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus } from "lucide-react";
import { supabase, urlDeRetorno } from "../../../shared/lib/supabaseClient";
import { reenviarConfirmacion } from "../../../shared/lib/confirmacion";
import { useTranslation } from "react-i18next";
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
  const cepRef = useRef<HTMLInputElement>(null);

  // Se guarda como texto para que el campo pueda quedar vacío mientras se
  // escribe; se valida y convierte al enviar.
  const [idade, setIdade] = useState("18");
  const [loading, setLoading] = useState(false);
  const [aviso, setAviso] = useState<{ tipo: "error" | "info"; texto: string } | null>(
    null
  );
  // Correo a la espera de confirmación, para poder reenviar el enlace sin
  // obligar a rellenar el formulario otra vez.
  const [emailPendiente, setEmailPendiente] = useState<string | null>(null);
  const [reenviando, setReenviando] = useState(false);

  async function handleCadastro(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;

    const nome = nomeRef.current?.value?.trim();
    const email = emailRef.current?.value?.trim();
    const senha = senhaRef.current?.value;
    const cep = cepRef.current?.value?.trim();

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
      const { data, error } = await supabase.auth.signUp({
        email,
        password: senha,
        options: {
          data: { nome, cep, idade: String(edad) },
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
      // limita a completarla.
      const { error: perfilError } = await supabase
        .from("profiles")
        .upsert({ id: data.session.user.id, nome, cep, idade: edad }, { onConflict: "id" });

      if (perfilError) {
        // La cuenta ya está creada, así que no tiene sentido bloquear al
        // usuario. Pero tampoco callar el fallo, como se hacía antes.
        console.error("No se pudo guardar el perfil:", perfilError);
        setAviso({
          tipo: "info",
          texto: t("register.profileWarning", { motivo: perfilError.message }),
        });
        return;
      }

      navigate("/", { replace: true });
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

            <form className="mt-8 space-y-5" onSubmit={handleCadastro}>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  {t("register.fields.name")}
                </label>
                <input
                  ref={nomeRef}
                  type="text"
                  placeholder={t("register.placeholders.name")}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-1 focus:ring-slate-400"
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
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-1 focus:ring-slate-400"
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
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-1 focus:ring-slate-400"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  {t("register.fields.cep")}
                </label>
                <input
                  ref={cepRef}
                  type="text"
                  placeholder={t("register.placeholders.cep")}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-1 focus:ring-slate-400"
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
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-1 focus:ring-slate-400"
                />
              </div>

              <button
                disabled={loading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#111217] px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60"
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
            <h1 className="text-3xl font-semibold leading-tight tracking-tight text-white md:text-4xl">
              {t("register.heroTitle")}
            </h1>

            <p className="mt-5 text-base leading-relaxed text-slate-400">
              {t("register.heroSubtitle")}
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
