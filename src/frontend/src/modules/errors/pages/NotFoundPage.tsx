import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft } from "lucide-react";

export default function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center bg-slate-50 px-4 text-center">
      <p className="text-8xl font-black text-slate-200">404</p>

      <h1 className="mt-6 text-2xl font-semibold tracking-tight text-texto">
        {t("notFound.title", "Page not found")}
      </h1>

      <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-500">
        {t("notFound.description", "The page you are looking for does not exist or has been moved.")}
      </p>

      <Link
        to="/"
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-tinta-950 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
      >
        <ArrowLeft className="h-4 w-4" />
        {t("notFound.backHome", "Back to home")}
      </Link>
    </main>
  );
}
