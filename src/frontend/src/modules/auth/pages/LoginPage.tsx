import React, { useRef, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LogIn } from "lucide-react";
import { supabase } from "../../../shared/lib/supabaseClient";
import logo from "../../../assets/images/logo.png";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || "/";

  const emailRef = useRef<HTMLInputElement>(null);
  const senhaRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);

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
        // "Email not confirmed" es el error más frecuente justo después de
        // registrarse, y por sí solo no dice qué hacer.
        const sinConfirmar = /confirm/i.test(error.message);
        alert(
          sinConfirmar ? `${error.message}\n\n${t("login.notConfirmed")}` : error.message
        );
        return;
      }

      // La sesión sólo falta si Supabase exige un segundo paso; leerla sin
      // comprobar reventaba con un TypeError en lugar de explicar el motivo.
      if (!data.session) {
        alert(t("login.notConfirmed"));
        return;
      }

      navigate(from, { replace: true });
    } catch (err: any) {
      alert(err?.message || "Erro");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f7f8fb] px-4">
      <div className="w-full max-w-md">
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

        {/* Card */}
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm md:p-10">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
            {t("login.title")}
          </h1>
          <p className="mt-2 text-sm text-slate-500">{t("login.subtitle")}</p>

          <form onSubmit={handleLogin} className="mt-8 space-y-5">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                {t("login.email")}
              </label>
              <input
                ref={emailRef}
                type="email"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-1 focus:ring-slate-400"
                placeholder={t("login.emailPlaceholder")}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                {t("login.password")}
              </label>
              <input
                ref={senhaRef}
                type="password"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-1 focus:ring-slate-400"
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
