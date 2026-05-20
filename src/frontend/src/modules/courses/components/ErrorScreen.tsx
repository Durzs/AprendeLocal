import { useTranslation } from "react-i18next";

type ErrorScreenProps = {
  erro: string;
  onBack: () => void;
};

export function ErrorScreen({ erro, onBack }: ErrorScreenProps) {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-700 to-blue-400 p-6 text-white">
      <div className="max-w-6xl mx-auto">
        <div className="rounded-2xl bg-white/10 border border-white/15 p-6">
          <div className="text-xl font-semibold mb-2">
            {t("courseLocal.errorTitle")}
          </div>

          <div className="text-white/85">{erro}</div>

          <button
            className="mt-4 rounded-xl bg-white/15 hover:bg-white/20 border border-white/20 px-4 py-2 transition"
            onClick={onBack}
          >
            {t("courseLocal.back")}
          </button>
        </div>
      </div>
    </div>
  );
}