/**
 * Pantalla que recibe al usuario de vuelta del enlace de confirmación.
 *
 * Antes no existía: Supabase devolvía a la portada y, si la verificación
 * fallaba, el error viajaba en la URL y nadie lo leía. El usuario veía la
 * página de inicio como si no hubiera pasado nada.
 */

import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { supabase } from "../../../shared/lib/supabaseClient";
import {
  leerErrorDeRetorno,
  limpiarUrl,
  reenviarConfirmacion,
  traeCredenciales,
} from "../../../shared/lib/confirmacion";

type Estado =
  | { fase: "verificando" }
  | { fase: "ok" }
  | { fase: "error"; mensaje: string; caducado: boolean };

export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [estado, setEstado] = useState<Estado>({ fase: "verificando" });
  const [email, setEmail] = useState("");
  const [reenviando, setReenviando] = useState(false);
  const [reenviado, setReenviado] = useState<string | null>(null);
  const yaProcesado = useRef(false);

  useEffect(() => {
    // StrictMode monta dos veces en desarrollo; sin esto la URL se limpiaría
    // antes de la segunda pasada y el retorno parecería inválido.
    if (yaProcesado.current) return;
    yaProcesado.current = true;

    let vigente = true;

    async function procesar() {
      const href = window.location.href;
      const fallo = leerErrorDeRetorno(href);

      if (fallo) {
        limpiarUrl();
        if (!vigente) return;
        setEstado({
          fase: "error",
          mensaje: fallo.descripcion,
          caducado: fallo.caducado,
        });
        return;
      }

      // El cliente canjea los tokens del fragmento al arrancar, pero no de
      // forma síncrona: se espera al evento en lugar de suponer que ya ocurrió.
      const { data } = await supabase.auth.getSession();

      if (data.session) {
        limpiarUrl();
        if (!vigente) return;
        setEstado({ fase: "ok" });
        setTimeout(() => vigente && navigate("/", { replace: true }), 1600);
        return;
      }

      if (!traeCredenciales(href)) {
        if (!vigente) return;
        setEstado({ fase: "error", mensaje: t("auth.callback.noCredentials"), caducado: false });
        return;
      }

      const { data: escucha } = supabase.auth.onAuthStateChange((_evento, sesion) => {
        if (!sesion || !vigente) return;
        limpiarUrl();
        setEstado({ fase: "ok" });
        setTimeout(() => vigente && navigate("/", { replace: true }), 1600);
      });

      // Si en unos segundos no llegó ninguna sesión, el enlace no sirvió.
      setTimeout(() => {
        if (!vigente) return;
        setEstado((previo) =>
          previo.fase === "verificando"
            ? { fase: "error", mensaje: t("auth.callback.timeout"), caducado: true }
            : previo
        );
      }, 8000);

      return () => escucha.subscription.unsubscribe();
    }

    procesar();

    return () => {
      vigente = false;
    };
  }, [navigate, t]);

  async function handleReenviar() {
    if (!email.trim() || reenviando) return;
    setReenviando(true);
    setReenviado(null);
    const { error } = await reenviarConfirmacion(email.trim());
    setReenviando(false);
    setReenviado(
      error ? t("auth.callback.resendError", { motivo: error.message }) : t("auth.callback.resendOk")
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f7f8fb] px-4 py-10">
      <div className="w-full max-w-md rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-sm md:p-10">
        {estado.fase === "verificando" && (
          <>
            <h1 className="text-xl font-semibold tracking-tight text-slate-950">
              {t("auth.callback.verifying")}
            </h1>
            <p className="mt-3 text-sm text-slate-500">{t("auth.callback.wait")}</p>
          </>
        )}

        {estado.fase === "ok" && (
          <>
            <h1 className="text-xl font-semibold tracking-tight text-emerald-700">
              {t("auth.callback.success")}
            </h1>
            <p className="mt-3 text-sm text-slate-500">{t("auth.callback.redirecting")}</p>
            <Link
              to="/"
              className="mt-6 inline-flex items-center justify-center rounded-full bg-[#111217] px-6 py-3 text-sm font-semibold text-white"
            >
              {t("auth.callback.enterNow")}
            </Link>
          </>
        )}

        {estado.fase === "error" && (
          <>
            <h1 className="text-xl font-semibold tracking-tight text-slate-950">
              {t("auth.callback.failed")}
            </h1>
            <p
              role="alert"
              className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
            >
              {estado.mensaje}
            </p>

            {estado.caducado && (
              <div className="mt-6 text-left">
                <label
                  htmlFor="reenvio"
                  className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                  {t("auth.callback.resendLabel")}
                </label>
                <input
                  id="reenvio"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("register.placeholders.email")}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-1 focus:ring-slate-400"
                />
                <button
                  type="button"
                  onClick={handleReenviar}
                  disabled={reenviando || !email.trim()}
                  className="mt-3 w-full rounded-full bg-[#111217] px-6 py-3 text-sm font-semibold text-white disabled:opacity-60"
                >
                  {reenviando ? t("auth.callback.resending") : t("auth.callback.resend")}
                </button>
                {reenviado && (
                  <p role="status" className="mt-3 text-sm text-slate-600">
                    {reenviado}
                  </p>
                )}
              </div>
            )}

            <Link
              to="/entrar"
              className="mt-6 inline-block text-sm font-semibold text-slate-950 hover:underline"
            >
              {t("auth.callback.backToLogin")}
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
