import React, { useMemo, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { supabase } from "../../../shared/lib/supabaseClient";

type Particle = {
  x: number;
  y: number;
  scale: number;
  dx: number;
  dy: number;
  duration: number;
};

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  // Si el usuario fue redirigido desde una ruta protegida, volver allá después del login
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || "/";

  const emailRef = useRef<HTMLInputElement>(null);
  const senhaRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);

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
        alert(error.message);
        return;
      }

      localStorage.setItem("token", data.session.access_token);
      navigate(from, { replace: true });
    } catch (err: any) {
      alert(err?.message || "Erro");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-600 to-blue-300 relative overflow-hidden">
      <div className="max-w-md mx-auto px-4 py-16 relative z-10">
        <motion.div
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="rounded-3xl bg-white/85 backdrop-blur border border-white/40 shadow p-6 md:p-8"
        >
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            {t("login.title")}
          </h1>

          <p className="text-slate-600 mb-6">{t("login.subtitle")}</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {t("login.email")}
              </label>
              <input
                ref={emailRef}
                type="email"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none"
                placeholder={t("login.emailPlaceholder")}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {t("login.password")}
              </label>
              <input
                ref={senhaRef}
                type="password"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none"
                placeholder={t("login.passwordPlaceholder")}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-blue-600 text-white py-3 font-medium hover:bg-blue-700 transition disabled:opacity-60"
            >
              {loading ? t("login.loading") : t("login.submit")}
            </button>
          </form>
        </motion.div>
      </div>

      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {particles.map((p, i) => (
          <motion.div
            key={i}
            initial={{ x: p.x, y: p.y, scale: p.scale }}
            animate={{ y: [null, p.dy], x: [null, p.dx] }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            className="absolute w-2 h-2 bg-blue-300 rounded-full opacity-30"
          />
        ))}
      </div>
    </div>
  );
}