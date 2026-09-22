import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation, Link, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LogIn } from "lucide-react";
import { supabase } from "../../../shared/lib/supabaseClient";
import { mensajeDe } from "../../../shared/lib/errores";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || "/";

  const emailRef = useRef<HTMLInputElement>(null);
  const senhaRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  // Los errores iban en `alert()`: una ventana del navegador que tapa el
  // formulario, se lleva el foco y en inglés dice «Invalid login
  // credentials». Ahora se dicen debajo de los campos, en el idioma de la
  // página, y un lector de pantalla los anuncia al aparecer.
  const [error, setError] = useState("");

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
      setError(t("login.validation.required"));
      return;
    }

    setError("");
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: senha,
      });

      if (error) {
        if (/confirm/i.test(error.message)) setError(t("login.notConfirmed"));
        else if (/invalid login credentials/i.test(error.message))
          setError(t("login.wrongCredentials"));
        else setError(mensajeDe(error, t("login.error")));
        return;
      }

      if (!data.session) {
        setError(t("login.notConfirmed"));
        return;
      }

      navigate(from, { replace: true });
    } catch (err) {
      setError(mensajeDe(err, t("login.error")));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-1 items-center justify-center bg-[#f7f8fb] px-4 py-10">
      <div className="w-full max-w-md">
        {/* Aquí iba el logo, grande, encima de la tarjeta. Esta pantalla
            no tenía la cabecera del sitio y el logo era la única forma de
            volver al inicio. Ahora la cabecera está, y dos logos seguidos
            se leen como un error de maquetación. */}

        {/* Card */}
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm md:p-10">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
            {t("login.title")}
          </h1>
          <p className="mt-2 text-sm text-slate-500">{t("login.subtitle")}</p>

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label
                htmlFor="entrar-correo"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                {t("login.email")}
              </label>
              <input
                ref={emailRef}
                id="entrar-correo"
                name="email"
                type="email"
                autoComplete="email"
                inputMode="email"
                required
                aria-describedby={error ? "entrar-error" : undefined}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-1 focus:ring-slate-400"
                placeholder={t("login.emailPlaceholder")}
              />
            </div>

            <div>
              <div className="mb-1.5 flex items-baseline justify-between gap-3">
                <label
                  htmlFor="entrar-clave"
                  className="block text-sm font-medium text-slate-700"
                >
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
                id="entrar-clave"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                aria-describedby={error ? "entrar-error" : undefined}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-1 focus:ring-slate-400"
                placeholder={t("login.passwordPlaceholder")}
              />
            </div>

            {error ? (
              <p
                id="entrar-error"
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-relaxed text-red-800"
              >
                {error}
              </p>
            ) : null}

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
            {/* Usaba el texto de la pantalla de registro, «¿Ya tienes
                cuenta?», que aquí dice lo contrario de lo que pregunta. */}
            {t("login.noAccount")}{" "}
            <Link
              to="/cadastrar"
              className="font-semibold text-slate-950 hover:underline"
            >
              {t("login.createAccount")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
