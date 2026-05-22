import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-7xl font-black text-indigo-600">404</p>

      <h1 className="mt-4 text-2xl font-bold text-slate-900">
        {t("notFound.title", "Page not found")}
      </h1>

      <p className="mt-2 max-w-md text-slate-500">
        {t(
          "notFound.description",
          "The page you are looking for does not exist or has been moved."
        )}
      </p>

      <Link
        to="/"
        className="mt-8 rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-indigo-700"
      >
        {t("notFound.backHome", "Back to home")}
      </Link>
    </main>
  );
}
