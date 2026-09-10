import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation, Link, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LogIn } from "lucide-react";
import { supabase } from "../../../shared/lib/supabaseClient";
import AprendeLocalLogo, { TINTA } from "../../../shared/components/ui/AprendeLocalLogo";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || "/";

  const emailRef = useRef<HTMLInputElement>(null);
  const senhaRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);

  // Auto-cargar email si viene por query param (ej: /entrar?email=docente@escuela.cl)
  useEffect(() => {
    const qEmail = searchParams.get("email");
    if (qEmail && emailRef.current) {
      emailRef.current.value = qEmail;
      if (senhaRef.current) {
        senhaRef.current.focus();
      }
    }
  }, [searchParams]);

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

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                {t("login.email")}
              </label>
              <input
                ref={emailRef}
                type="email"
                required
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
                required
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-1 focus:ring-slate-400"
                placeholder={t("login.passwordPlaceholder")}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#111217] px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60 cursor-pointer"
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
