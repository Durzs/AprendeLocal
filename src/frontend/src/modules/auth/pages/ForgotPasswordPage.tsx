/**
 * Solicitud del enlace para recuperar la contraseña.
 *
 * El registro ya remitía aquí ("Inicia sesión o recupera tu contraseña"), pero
 * la pantalla no existía: quien olvidaba la clave se quedaba sin salida.
 */

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Mail } from "lucide-react";
import { enviarEnlaceDeRecuperacion } from "../../../shared/lib/confirmacion";
import logo from "../../../assets/images/logo.png";

export default function ForgotPasswordPage() {
  const { t } = useTranslation();

  const [email, setEmail] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (enviando) return;

    const correo = email.trim();
    if (!correo) {
      setError(t("forgot.validation.required"));
      return;
    }

    setEnviando(true);
    setError(null);

    const { error: fallo } = await enviarEnlaceDeRecuperacion(correo);
    setEnviando(false);

    // Solo se informa de fallos del propio envío (por ejemplo, límite de
    // peticiones). Que la cuenta exista o no nunca se revela.
    if (fallo) {
      setError(t("forgot.error", { motivo: fallo.message }));
      return;
    }

    setEnviado(true);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f7f8fb] px-4 py-10">
      <div className="w-full max-w-md">
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

        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm md:p-10">
          {enviado ? (
            <>
              <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
                {t("forgot.sentTitle")}
              </h1>
              <p role="status" className="mt-3 text-sm text-slate-600">
                {t("forgot.sentBody", { email: email.trim() })}
              </p>
              <p className="mt-4 text-sm text-slate-500">{t("forgot.sentHint")}</p>
              <Link
                to="/entrar"
                className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-[#111217] px-6 py-3.5 text-sm font-semibold text-white"
              >
                {t("forgot.backToLogin")}
              </Link>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
                {t("forgot.title")}
              </h1>
              <p className="mt-2 text-sm text-slate-500">{t("forgot.subtitle")}</p>

              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <div>
                  <label
                    htmlFor="correo-recuperacion"
                    className="mb-1.5 block text-sm font-medium text-slate-700"
                  >
                    {t("login.email")}
                  </label>
                  <input
                    id="correo-recuperacion"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t("login.emailPlaceholder")}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-1 focus:ring-slate-400"
                  />
                </div>

                {error && (
                  <p
                    role="alert"
                    className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
                  >
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={enviando}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#111217] px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60"
                >
                  <Mail className="h-4 w-4" />
                  {enviando ? t("forgot.sending") : t("forgot.submit")}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-slate-500">
                <Link to="/entrar" className="font-semibold text-slate-950 hover:underline">
                  {t("forgot.backToLogin")}
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
