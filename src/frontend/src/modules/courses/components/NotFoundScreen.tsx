import { useTranslation } from "react-i18next";

export function NotFoundScreen() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-700 to-blue-400 p-6 text-white">
      <div className="max-w-6xl mx-auto">
        <div className="rounded-2xl bg-white/10 border border-white/15 p-6">
          {t("courseLocal.notFound")}
        </div>
      </div>
    </div>
  );
}