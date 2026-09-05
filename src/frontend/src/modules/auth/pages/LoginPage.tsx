import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation, Link, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LogIn, ShieldCheck, Mail, Send, CheckCircle2 } from "lucide-react";
import { supabase, urlDeRetorno } from "../../../shared/lib/supabaseClient";
import AprendeLocalLogo, { TINTA } from "../../../shared/components/ui/AprendeLocalLogo";

const ADMIN_EMAIL = "durzs@uc.cl";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || "/";

  const emailRef = useRef<HTMLInputElement>(null);
  const senhaRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [magicLoading, setMagicLoading] = useState(false);
  const [msgInfo, setMsgInfo] = useState<string | null>(null);

  // Auto-cargar email si viene por query param (ej: /entrar?email=durzs@uc.cl o /admin)
  useEffect(() => {
    const qEmail = searchParams.get("email") || (searchParams.get("admin") ? ADMIN_EMAIL : "");
    if (qEmail && emailRef.current) {
      emailRef.current.value = qEmail;
      if (senhaRef.current) {
        senhaRef.current.focus();
      }
    }
  }, [searchParams]);

  // Acceso directo con Magic Link al correo de Administrador
  async function handleSendMagicLink(emailTarget = ADMIN_EMAIL) {
    if (magicLoading) return;
    setMagicLoading(true);
    setMsgInfo(null);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: emailTarget,
        options: {
          emailRedirectTo: urlDeRetorno(),
        },
      });

      if (error) {
        alert("Error al enviar enlace de acceso: " + error.message);
        return;
      }

      setMsgInfo(`¡Enlace de acceso directo enviado a ${emailTarget}! Revisa tu bandeja de entrada.`);
    } catch (err: any) {
      alert("Error: " + (err?.message || ""));
    } finally {
      setMagicLoading(false);
    }
  }

  // Prellenar datos de admin
  function handleSelectAdmin() {
    if (emailRef.current) {
      emailRef.current.value = ADMIN_EMAIL;
      senhaRef.current?.focus();
    }
  }

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;

    const email = emailRef.current?.value?.trim();
    const senha = senhaRef.current?.value;

    if (!email || !senha) {
      alert(t("login.validation.required"));
      return;
    }

    setLoading(true);
    setMsgInfo(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: senha,
      });

      if (error) {
        const sinConfirmar = /confirm/i.test(error.message);
        alert(
          sinConfirmar ? `${error.message}\n\n${t("login.notConfirmed")}` : error.message
        );
        return;
      }

      if (!data.session) {
        alert(t("login.notConfirmed"));
        return;
      }

      navigate(from, { replace: true });
    } catch (err: any) {
      alert(err?.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f7f8fb] px-4 py-10">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center">
          <Link to="/">
            <AprendeLocalLogo
              variante="apilado"
              className="h-16 w-auto transition-transform hover:scale-105"
              color={TINTA}
            />
          </Link>
        </div>

        {/* Card */}
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm md:p-10">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
            {t("login.title")}
          </h1>
          <p className="mt-2 text-sm text-slate-500">{t("login.subtitle")}</p>

          {/* Tarjeta de Acceso Rápido Administrador */}
          <div className="mt-6 rounded-2xl border border-purple-200 bg-purple-50/70 p-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-purple-950">
                <ShieldCheck className="h-4 w-4 text-purple-700" />
                <span>Acceso Administrador</span>
              </div>
              <span className="rounded-full bg-purple-200/80 px-2 py-0.5 text-[10px] font-bold text-purple-800">
                ADMIN
              </span>
            </div>

            <div className="mt-2 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={handleSelectAdmin}
                className="flex items-center gap-1.5 text-xs font-medium text-purple-900 hover:underline truncate"
              >
                <Mail className="h-3.5 w-3.5 shrink-0 text-purple-600" />
                <span className="truncate">{ADMIN_EMAIL}</span>
              </button>

              <button
                type="button"
                disabled={magicLoading}
                onClick={() => handleSendMagicLink(ADMIN_EMAIL)}
                className="shrink-0 inline-flex items-center gap-1 rounded-xl bg-purple-700 px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm hover:bg-purple-800 transition disabled:opacity-60"
              >
                <Send className="h-3 w-3" />
                {magicLoading ? "Enviando..." : "Magic Link"}
              </button>
            </div>
          </div>

          {msgInfo && (
            <div className="mt-4 flex items-start gap-2 rounded-xl bg-emerald-50 p-3 text-xs text-emerald-800 border border-emerald-200">
              <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-emerald-600" />
              <span>{msgInfo}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                {t("login.email")}
              </label>
              <input
                ref={emailRef}
                type="email"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-1 focus:ring-slate-400"
                placeholder={t("login.emailPlaceholder")}
              />
            </div>

            <div>
              <div className="mb-1.5 flex items-baseline justify-between gap-3">
                <label className="block text-sm font-medium text-slate-700">
                  {t("login.password")}
                </label>
                <Link
                  to="/recuperar"
                  className="text-xs font-medium text-slate-500 transition hover:text-slate-950 hover:underline"
                >
                  {t("login.forgot")}
                </Link>
              </div>
              <input
                ref={senhaRef}
                type="password"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-1 focus:ring-slate-400"
                placeholder={t("login.passwordPlaceholder")}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#111217] px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60"
            >
              <LogIn className="h-4 w-4" />
              {loading ? t("login.loading") : t("login.submit")}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            {t("register.loginText", "Don't have an account?")}{" "}
            <Link
              to="/cadastrar"
              className="font-semibold text-slate-950 hover:underline"
            >
              {t("register.button.register", "Register")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
