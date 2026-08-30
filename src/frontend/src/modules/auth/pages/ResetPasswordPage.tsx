/**
 * Pantalla que recibe el enlace de recuperación y fija la contraseña nueva.
 *
 * El enlace deja los tokens en el fragmento de la URL, igual que el de
 * confirmación, así que se espera a que el cliente los canjee por una sesión
 * antes de permitir el cambio. Sin esa espera el formulario aparecía y
 * `updateUser` fallaba por falta de sesión.
 */

import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { KeyRound } from "lucide-react";
import { supabase } from "../../../shared/lib/supabaseClient";
import {
  leerErrorDeRetorno,
  limpiarUrl,
  traeCredenciales,
} from "../../../shared/lib/confirmacion";
import logo from "../../../assets/images/logo.png";

const LARGO_MINIMO = 6;

type Estado =
  | { fase: "verificando" }
  | { fase: "listo" }
  | { fase: "guardado" }
  | { fase: "error"; mensaje: string };

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [estado, setEstado] = useState<Estado>({ fase: "verificando" });
  const [clave, setClave] = useState("");
  const [repetida, setRepetida] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [errorForm, setErrorForm] = useState<string | null>(null);
  const yaProcesado = useRef(false);

  useEffect(() => {
    // StrictMode monta dos veces en desarrollo; sin esto la URL se limpiaría
    // antes de la segunda pasada y el enlace parecería inválido.
    if (yaProcesado.current) return;
    yaProcesado.current = true;

    let vigente = true;
    let cancelarEscucha: (() => void) | undefined;

    async function procesar() {
      const href = window.location.href;
      const fallo = leerErrorDeRetorno(href);

      if (fallo) {
        limpiarUrl();
        if (!vigente) return;
        setEstado({ fase: "error", mensaje: fallo.descripcion });
        return;
      }

      const { data } = await supabase.auth.getSession();
      if (data.session) {
        limpiarUrl();
        if (!vigente) return;
        setEstado({ fase: "listo" });
        return;
      }

      if (!traeCredenciales(href)) {
        if (!vigente) return;
        setEstado({ fase: "error", mensaje: t("reset.noCredentials") });
        return;
      }

      const { data: escucha } = supabase.auth.onAuthStateChange((_evento, sesion) => {
        if (!sesion || !vigente) return;
        limpiarUrl();
        setEstado({ fase: "listo" });
      });
      cancelarEscucha = () => escucha.subscription.unsubscribe();

      // Si en unos segundos no llegó ninguna sesión, el enlace no sirvió.
      setTimeout(() => {
        if (!vigente) return;
        setEstado((previo) =>
          previo.fase === "verificando"
            ? { fase: "error", mensaje: t("reset.timeout") }
            : previo
        );
      }, 8000);
    }

    procesar();

    return () => {
      vigente = false;
      cancelarEscucha?.();
    };
  }, [t]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (guardando) return;

    if (clave.length < LARGO_MINIMO) {
      setErrorForm(t("register.validation.passwordLength"));
      return;
    }
    if (clave !== repetida) {
      setErrorForm(t("reset.validation.mismatch"));
      return;
    }

    setGuardando(true);
    setErrorForm(null);

    const { error } = await supabase.auth.updateUser({ password: clave });
    setGuardando(false);

    if (error) {
      setErrorForm(t("reset.error", { motivo: error.message }));
      return;
    }

    setEstado({ fase: "guardado" });
    setTimeout(() => navigate("/", { replace: true }), 1800);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f7f8fb] px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center">
          <Link to="/">
            <img
              src={logo}
              alt="AprendeLocal"
              className="h-16 w-16 rounded-2xl border border-slate-200 object-cover shadow-sm transition hover:scale-105"
            />
          </Link>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm md:p-10">
          {estado.fase === "verificando" && (
            <>
              <h1 className="text-xl font-semibold tracking-tight text-slate-950">
                {t("reset.verifying")}
              </h1>
              <p className="mt-3 text-sm text-slate-500">{t("auth.callback.wait")}</p>
            </>
          )}

          {estado.fase === "error" && (
            <>
              <h1 className="text-xl font-semibold tracking-tight text-slate-950">
                {t("reset.failed")}
              </h1>
              <p
                role="alert"
                className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
              >
                {estado.mensaje}
              </p>
              <Link
                to="/recuperar"
                className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-[#111217] px-6 py-3.5 text-sm font-semibold text-white"
              >
                {t("reset.askAgain")}
              </Link>
            </>
          )}

          {estado.fase === "guardado" && (
            <>
              <h1 className="text-xl font-semibold tracking-tight text-emerald-700">
                {t("reset.savedTitle")}
              </h1>
              <p className="mt-3 text-sm text-slate-500">{t("reset.savedBody")}</p>
            </>
          )}

          {estado.fase === "listo" && (
            <>
              <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
                {t("reset.title")}
              </h1>
              <p className="mt-2 text-sm text-slate-500">{t("reset.subtitle")}</p>

              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <div>
                  <label
                    htmlFor="clave-nueva"
                    className="mb-1.5 block text-sm font-medium text-slate-700"
                  >
                    {t("reset.newPassword")}
                  </label>
                  <input
                    id="clave-nueva"
                    type="password"
                    autoComplete="new-password"
                    value={clave}
                    onChange={(e) => setClave(e.target.value)}
                    placeholder={t("login.passwordPlaceholder")}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-1 focus:ring-slate-400"
                  />
                </div>

                <div>
                  <label
                    htmlFor="clave-repetida"
                    className="mb-1.5 block text-sm font-medium text-slate-700"
                  >
                    {t("reset.repeatPassword")}
                  </label>
                  <input
                    id="clave-repetida"
                    type="password"
                    autoComplete="new-password"
                    value={repetida}
                    onChange={(e) => setRepetida(e.target.value)}
                    placeholder={t("login.passwordPlaceholder")}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-1 focus:ring-slate-400"
                  />
                </div>

                {errorForm && (
                  <p
                    role="alert"
                    className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
                  >
                    {errorForm}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={guardando}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#111217] px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60"
                >
                  <KeyRound className="h-4 w-4" />
                  {guardando ? t("reset.saving") : t("reset.submit")}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
