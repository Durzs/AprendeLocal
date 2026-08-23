import { useState } from "react";
import type { FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { Mail, MapPin, Github, Send, CheckCircle2 } from "lucide-react";

export default function ContactSection() {
  const { t } = useTranslation();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    message: "",
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="contacto" className="relative overflow-hidden bg-slate-900 py-20 md:py-28 text-white">
      {/* Background glow accents */}
      <div className="pointer-events-none absolute right-0 top-0 h-96 w-96 rounded-full bg-emerald-600/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-96 w-96 rounded-full bg-teal-600/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          {/* Left information */}
          <div className="space-y-6 lg:col-span-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-300">
              <Mail className="h-3.5 w-3.5" />
              {t("home.contact.badge", "Contacto & Alianzas")}
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-[-0.04em] text-white leading-tight">
              {t(
                "home.contact.title",
                "¿Quieres llevar AprendeLocal a tu escuela o comunidad?"
              )}
            </h2>

            <p className="text-base leading-relaxed text-slate-300">
              {t(
                "home.contact.subtitle",
                "Acompañamos a docentes, directivos y comunidades con herramientas pedagógicas abiertas, guías maker y acompañamiento en proyectos de ciencia territorial."
              )}
            </p>

            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-700 bg-slate-800 text-emerald-400">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-400">Correo directo</div>
                  <a
                    href="mailto:contacto@aprendelocal.cl"
                    className="font-semibold text-white transition hover:text-emerald-400"
                  >
                    contacto@aprendelocal.cl
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-700 bg-slate-800 text-emerald-400">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-400">Zona piloto</div>
                  <div className="font-semibold text-white">
                    Temuco · La Araucanía, Chile
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-700 bg-slate-800 text-emerald-400">
                  <Github className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-400">Código Abierto</div>
                  <a
                    href="https://github.com/Durzs/AprendeLocal"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-white transition hover:text-emerald-400"
                  >
                    github.com/Durzs/AprendeLocal
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right form card */}
          <div className="rounded-[2.5rem] border border-slate-700/80 bg-slate-800/90 p-8 shadow-2xl backdrop-blur-sm lg:col-span-6">
            {submitted ? (
              <div className="py-12 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {t("home.contact.successTitle", "¡Mensaje recibido!")}
                </h3>
                <p className="text-slate-300 text-sm">
                  {t(
                    "home.contact.successMessage",
                    "Gracias por contactarnos. Nos comunicaremos contigo a la brevedad para coordinar la vinculación."
                  )}
                </p>
              </div>
            ) : (
              <>
                <h3 className="mb-2 text-xl font-bold text-white">
                  {t("home.contact.formTitle", "Envíanos un mensaje")}
                </h3>
                <p className="mb-6 text-sm text-slate-400">
                  {t(
                    "home.contact.formSubtitle",
                    "Completa el formulario y nos contactaremos contigo."
                  )}
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-slate-300">
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
                        className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-slate-300">
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
                        className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-300">
                      {t("home.contact.role", "Rol / Institución")}
                    </label>
                    <input
                      type="text"
                      value={formData.role}
                      onChange={(e) =>
                        setFormData({ ...formData, role: e.target.value })
                      }
                      placeholder="Ej: Docente Rural, Directivo, Investigador"
                      className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-300">
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
                      className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 font-bold text-white shadow-lg shadow-emerald-600/30 transition hover:bg-emerald-500 hover:-translate-y-0.5"
                  >
                    <Send className="h-4 w-4" />
                    <span>{t("home.contact.send", "Enviar Mensaje")}</span>
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
