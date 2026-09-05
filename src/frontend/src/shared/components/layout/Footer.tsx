import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import AprendeLocalLogo, { TINTA } from "../ui/AprendeLocalLogo";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-slate-100 bg-white px-4 py-10 text-slate-600">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-start">
          <div>
            <AprendeLocalLogo className="h-7 w-auto" color={TINTA} />
            <p className="mt-2.5 text-sm text-slate-500">{t("footer.tagline")}</p>
          </div>

          <nav className="flex flex-wrap gap-x-5 gap-y-3 text-sm font-medium">
            <Link to="/instructor/login" className="text-slate-600 transition hover:text-slate-950">
              {t("footer.links.instructorAccess")}
            </Link>
            <a href="#" className="text-slate-600 transition hover:text-slate-950">
              {t("footer.links.team")}
            </a>
            <a href="#" className="text-slate-600 transition hover:text-slate-950">
              {t("footer.links.partners")}
            </a>
            <a href="#" className="text-slate-600 transition hover:text-slate-950">
              {t("footer.links.faq")}
            </a>
            <a href="#" className="text-slate-600 transition hover:text-slate-950">
              {t("footer.links.contact")}
            </a>
            <a href="#" className="text-slate-600 transition hover:text-slate-950">
              {t("footer.links.terms")}
            </a>
          </nav>
        </div>

        <div className="mt-8 text-xs text-slate-400">
          {t("footer.copyright")}
        </div>
      </div>
    </footer>
  );
}
