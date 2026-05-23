import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus } from "lucide-react";
import { supabase } from "../../../shared/lib/supabaseClient";
import { useTranslation } from "react-i18next";
import logo from "../../../assets/images/logo.png";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const nomeRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const senhaRef = useRef<HTMLInputElement>(null);
  const cepRef = useRef<HTMLInputElement>(null);

  const [idade, setIdade] = useState(18);
  const [loading, setLoading] = useState(false);

  async function handleCadastro(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;

    const nome = nomeRef.current?.value?.trim();
    const email = emailRef.current?.value?.trim();
    const senha = senhaRef.current?.value;
    const cep = cepRef.current?.value?.trim();

    if (!nome || !email || !senha) {
      alert(t("register.validation.required"));
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password: senha,
        options: {
          data: { nome, cep, idade: String(idade) },
        },
      });

      if (error) {
        alert(error.message);
        return;
      }

      const userId = data?.user?.id;

      if (userId) {
        await supabase.from("profiles").upsert(
          { id: userId, nome, cep, idade },
          { onConflict: "id" }
        );
      }

      alert(t("register.success"));
      navigate("/entrar");
    } catch (err: any) {
      alert(err?.message || t("register.error"));
    } finally {
      setLoading(false);
    }
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
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  {t("register.fields.age")}:{" "}
                  <span className="font-semibold text-slate-950">{idade}</span>
                </label>
                <input
                  type="range"
                  min={1}
                  max={100}
                  value={idade}
                  onChange={(e) => setIdade(Number(e.target.value))}
                  className="w-full accent-slate-950"
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
