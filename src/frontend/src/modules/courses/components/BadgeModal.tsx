import { Trophy, Sparkles, X } from "lucide-react";
import { useTranslation } from "react-i18next";

type BadgeModalProps = {
  open: boolean;
  badgeCourseName: string;
  onClose: () => void;
  onContinue: () => void;
};

export function BadgeModal({
  open,
  badgeCourseName,
  onClose,
  onContinue,
}: BadgeModalProps) {
  const { t } = useTranslation();

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center">
          <div className="mb-6 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="w-32 h-32 text-yellow-200 animate-pulse" />
            </div>
            <div className="relative flex items-center justify-center">
              <div className="w-32 h-32 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-xl">
                <Trophy className="w-16 h-16 text-white" />
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            {t("courseLocal.congrats")}
          </h2>

          <p className="text-gray-600 mb-6">
            {t("courseLocal.completedSuccess")}
          </p>

          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6 mb-6 border border-blue-200">
            <div className="text-sm text-gray-600 mb-1">
              {t("courseLocal.badgeEarned")}
            </div>
            <div className="text-xl font-bold text-gray-800">
              {badgeCourseName}
            </div>
          </div>

          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>{t("courseLocal.allModulesCompleted")}</span>
            </div>

            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>{t("courseLocal.exercisesCompleted")}</span>
            </div>
          </div>

          <button
            onClick={onContinue}
            className="mt-8 w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-semibold shadow-lg"
          >
            {t("courseLocal.continueLearning")}
          </button>
        </div>
      </div>
    </div>
  );
}