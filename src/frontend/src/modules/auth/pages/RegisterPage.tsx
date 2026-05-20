import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "../../../shared/lib/supabaseClient";
import { useTranslation } from "react-i18next";

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
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-600 to-blue-300 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-10 min-h-screen flex items-center">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <div className="rounded-3xl bg-white/85 backdrop-blur border border-white/40 shadow p-8 md:p-10">
            <div className="space-y-2 text-center">
              <h2 className="text-3xl font-bold text-slate-900">
                {t("register.title")}
              </h2>
              <p className="text-slate-600">{t("register.subtitle")}</p>
            </div>

            <form className="space-y-6 mt-8" onSubmit={handleCadastro}>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  {t("register.fields.name")}
                </label>
                <input
                  ref={nomeRef}
                  type="text"
                  placeholder={t("register.placeholders.name")}
                  className="w-full px-5 py-3 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  {t("register.fields.email")}
                </label>
                <input
                  ref={emailRef}
                  type="email"
                  placeholder={t("register.placeholders.email")}
                  className="w-full px-5 py-3 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  {t("register.fields.password")}
                </label>
                <input
                  ref={senhaRef}
                  type="password"
                  placeholder={t("register.placeholders.password")}
                  className="w-full px-5 py-3 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  {t("register.fields.cep")}
                </label>
                <input
                  ref={cepRef}
                  type="text"
                  placeholder={t("register.placeholders.cep")}
                  className="w-full px-5 py-3 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  {t("register.fields.age")}:{" "}
                  <span className="font-semibold text-blue-700">{idade}</span>
                </label>
                <input
                  type="range"
                  min={1}
                  max={100}
                  value={idade}
                  onChange={(e) => setIdade(Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>

              <button
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold"
              >
                {loading ? t("register.button.loading") : t("register.button.register")}
              </button>
            </form>

            <div className="text-center mt-6">
              <Link to="/entrar" className="text-sm text-slate-600">
                {t("register.loginText")}{" "}
                <span className="font-semibold text-blue-700 hover:underline">
                  {t("register.loginAction")}
                </span>
              </Link>
            </div>
          </div>

          <div className="rounded-3xl bg-white/25 backdrop-blur border border-white/40 shadow relative p-10 text-white text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl font-extrabold">
              {t("register.heroTitle")}
            </h1>

            <p className="mt-5 text-lg text-white/85">
              {t("register.heroSubtitle")}
            </p>

            <div className="mt-8">
              <Link to="/">
                <button className="px-6 py-3 rounded-lg font-semibold shadow bg-white text-blue-700">
                  {t("register.backHome")}
                </button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}