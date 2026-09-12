import { useTranslation } from "react-i18next";
import { Mail, MapPin, Linkedin } from "lucide-react";
import AprendeLocalLogo from "../ui/AprendeLocalLogo";

/**
 * La página de LinkedIn.
 *
 * Diego pasó la dirección del panel de administración
 * (`/company/144983955/admin/dashboard/`). Esa no sirve aquí: a quien no sea
 * administrador de la página le devuelve un error o lo manda a su propio
 * inicio. La que va en un sitio público es la de la página en sí, sin
 * `/admin/`.
 *
 * Cuando LinkedIn tenga asignado el nombre corto —algo como
 * `/company/aprendelocal`— conviene cambiarlo aquí: se lee mejor y sobrevive
 * si el identificador numérico cambia.
 */
const LINKEDIN = "https://www.linkedin.com/company/144983955/";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-blue-950/80 bg-[#0a0047] px-4 py-12 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          {/* Logo & Tagline */}
          <div className="space-y-3">
            <AprendeLocalLogo className="h-8 w-auto" color="#ffffff" />
            <p className="text-sm text-slate-300 max-w-md">
              {t("footer.tagline", "Educación STEM contextualizada para docentes, escuelas y comunidades rurales.")}
            </p>
          </div>

          {/* Información de Contacto */}
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-10 text-sm">
            <div className="flex items-center gap-2.5">
              <Mail className="h-4 w-4 text-[#f97316]" />
              <a
                href="mailto:aprendelocal@gmail.com"
                className="text-white hover:text-orange-400 font-medium transition"
              >
                aprendelocal@gmail.com
              </a>
            </div>

            <div className="flex items-center gap-2.5 text-slate-300">
              <MapPin className="h-4 w-4 text-blue-400" />
              <span>La Araucanía, Chile</span>
            </div>

            <a
              href={LINKEDIN}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-2.5 font-medium text-white transition hover:text-orange-400"
            >
              <Linkedin className="h-4 w-4 text-[#f97316]" />
              LinkedIn
              <span className="sr-only">(se abre en una pestaña nueva)</span>
            </a>
          </div>
        </div>

        {/* Divider & Copyright */}
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div>
            © {new Date().getFullYear()} AprendeLocal. Todos los derechos reservados.
          </div>
          <div className="text-slate-400">
            Educación STEM Territorial
          </div>
        </div>
      </div>
    </footer>
  );
}
