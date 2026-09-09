import { useState } from "react";
import type { FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { Mail, MapPin, Send, CheckCircle2, Loader2 } from "lucide-react";

import { supabase } from "../../../shared/lib/supabaseClient";

/** A donde llegan los mensajes que escribe la gente en este formulario. */
const CORREO = "contacto@aprendelocal.cl";

/**
 * El formulario de contacto.
 *
 * Antes decia «¡Mensaje recibido! Nos comunicaremos contigo a la brevedad» y
 * no enviaba nada: el submit solo cambiaba una variable de la pantalla. Una
 * escuela que escribia quedaba esperando una respuesta que no podia llegar,
 * porque el mensaje no salia del navegador.
 *
 * Ahora se guarda en la tabla `contactos`. Si esa tabla todavia no existe en
 * el proyecto, o el envio falla por lo que sea, se abre el correo del
 * computador con el mensaje ya escrito y se muestra la direccion para
 * copiarla. Lo que no vuelve a pasar es dar las gracias por un mensaje que
 * nadie recibio.
 *
 * El SQL de la tabla esta en infra/contactos.sql.
 */
type Estado = "escribiendo" | "enviando" | "guardado" | "por_correo";

export default function ContactSection() {
  const { t } = useTranslation();
  const [estado, setEstado] = useState<Estado>("escribiendo");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    message: "",
  });

  /** Arma el correo de respaldo con lo que la persona ya escribio. */
  function abrirCorreo() {
    const asunto = `AprendeLocal · ${formData.name || "mensaje desde el sitio"}`;
    const cuerpo = [
      `Nombre: ${formData.name}`,
      `Correo: ${formData.email}`,
      formData.role ? `Rol: ${formData.role}` : "",
      "",
      formData.message,
    ]
      .filter(Boolean)
      .join("\n");
    window.location.href = `mailto:${CORREO}?subject=${encodeURIComponent(
      asunto
    )}&body=${encodeURIComponent(cuerpo)}`;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setEstado("enviando");

    try {
      const { error } = await supabase.from("contactos").insert({
        nombre: formData.name,
        correo: formData.email,
        rol: formData.role || null,
        mensaje: formData.message,
      });
      if (error) throw error;
      setEstado("guardado");
      return;
    } catch {
      // Sin tabla o sin red, el mensaje sigue saliendo: por el correo de quien
      // escribe, que es el camino que no depende de nosotros.
      setEstado("por_correo");
      abrirCorreo();
    }
  };

  const enviado = estado === "guardado" || estado === "por_correo";

  return (
    <section id="contacto" className="relative overflow-hidden bg-white py-20 text-[#111217] md:py-28">
      {/* Background glow accents */}
      <div className="pointer-events-none absolute right-0 top-0 h-96 w-96 rounded-full bg-[var(--tinta-100)] blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-96 w-96 rounded-full bg-orange-50 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8">
        {/* La franja de anotación que abre las otras cuatro secciones. */}
        <div className="mb-12 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 border-b border-slate-200 pb-4">
          <span className="rotulo text-orange-700">Contacto</span>
          <span className="rotulo text-slate-400">{CORREO}</span>
        </div>

        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          {/* Left information */}
          <div className="space-y-6 lg:col-span-6">
            <h2 className="display text-3xl sm:text-4xl md:text-5xl text-[#111217]">
              {t(
                "home.contact.title",
                "¿Quieres llevar AprendeLocal a tu escuela o comunidad?"
              )}
            </h2>

            <p className="text-base leading-relaxed text-slate-600">
              {t(
                "home.contact.subtitle",
                "Acompañamos a docentes, directivos y comunidades con clases ya escritas, documentos para imprimir y salidas a terreno alrededor de la escuela."
              )}
            </p>

            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-orange-200 bg-orange-50 text-orange-700">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <div className="rotulo text-slate-500">Correo directo</div>
                  <a
                    href="mailto:contacto@aprendelocal.cl"
                    className="font-semibold text-slate-900 transition hover:text-orange-700"
                  >
                    contacto@aprendelocal.cl
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <div className="rotulo text-slate-500">Zona piloto</div>
                  <div className="font-semibold text-slate-900">
                    Temuco · La Araucanía, Chile
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right form card */}
          <div className="rounded-[2.5rem] border border-slate-200 bg-[var(--tinta-50)] p-8 shadow-sm lg:col-span-6">
            {enviado ? (
              <div className="py-12 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                {estado === "guardado" ? (
                  <>
                    <h3 className="mb-2 text-xl font-bold text-slate-900">
                      {t("home.contact.successTitle", "Mensaje recibido")}
                    </h3>
                    <p className="text-sm text-slate-600">
                      {t(
                        "home.contact.successMessage",
                        "Lo tenemos. Te respondemos a este mismo correo."
                      )}
                    </p>
                  </>
                ) : (
                  <>
                    <h3 className="mb-2 text-xl font-bold text-slate-900">
                      {t("home.contact.mailTitle", "Te abrimos el correo")}
                    </h3>
                    <p className="text-sm text-slate-600">
                      {t(
                        "home.contact.mailBody",
                        "El mensaje quedó escrito en tu programa de correo y falta que le des a enviar. Si no se abrió, escríbenos a:"
                      )}
                    </p>
                    <a
                      href={`mailto:${CORREO}`}
                      className="mt-3 inline-block font-semibold text-orange-700 underline underline-offset-4"
                    >
                      {CORREO}
                    </a>
                  </>
                )}
              </div>
            ) : (
              <>
                <h3 className="mb-2 text-xl font-bold text-slate-900">
                  {t("home.contact.formTitle", "Envíanos un mensaje")}
                </h3>
                <p className="mb-6 text-sm text-slate-500">
                  {t(
                    "home.contact.formSubtitle",
                    "Completa el formulario y nos contactaremos contigo."
                  )}
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="rotulo mb-2 block text-slate-500">
                        {t("home.contact.name", "Nombre")}
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder="Tu nombre"
                        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:border-[var(--tinta-600)] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="rotulo mb-2 block text-slate-500">
                        {t("home.contact.email", "Correo electrónico")}
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        placeholder="tu@escuela.org"
                        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:border-[var(--tinta-600)] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="rotulo mb-2 block text-slate-500">
                      {t("home.contact.role", "Rol / Institución")}
                    </label>
                    <input
                      type="text"
                      value={formData.role}
                      onChange={(e) =>
                        setFormData({ ...formData, role: e.target.value })
                      }
                      placeholder="Ej: Docente Rural, Directivo, Investigador"
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:border-[var(--tinta-600)] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="rotulo mb-2 block text-slate-500">
                      {t("home.contact.message", "Mensaje o Territorio de Interés")}
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      placeholder="Cuéntanos sobre tu escuela o qué proyecto STEM te gustaría impulsar..."
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:border-[var(--tinta-600)] focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={estado === "enviando"}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0a0047] hover:bg-[#140066] border border-blue-900/50 px-6 py-3.5 font-bold text-white shadow-lg shadow-[#0a0047]/50 transition hover:-translate-y-0.5 cursor-pointer disabled:cursor-wait disabled:opacity-70 disabled:hover:translate-y-0"
                  >
                    {estado === "enviando" ? (
                      <Loader2 className="h-4 w-4 animate-spin text-amber-300" />
                    ) : (
                      <Send className="h-4 w-4 text-amber-300" />
                    )}
                    <span>
                      {estado === "enviando"
                        ? t("home.contact.sending", "Enviando…")
                        : t("home.contact.send", "Enviar Mensaje")}
                    </span>
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
