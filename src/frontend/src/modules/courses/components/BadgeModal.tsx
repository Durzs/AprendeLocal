import { Trophy, Sparkles, X, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";

type BadgeModalProps = {
  open: boolean;
  badgeCourseName: string;
  onClose: () => void;
  onContinue: () => void;
};

export function BadgeModal({ open, badgeCourseName, onClose, onContinue }: BadgeModalProps) {
  const { t } = useTranslation();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 text-slate-400 transition hover:text-slate-600"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="text-center">
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="h-28 w-28 animate-pulse text-amber-100" />
            </div>
            <div className="relative flex items-center justify-center">
              <div className="flex h-28 w-28 items-center justify-center rounded-full bg-[#111217] shadow-lg">
                <Trophy className="h-14 w-14 text-amber-400" />
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
            {t("courseLocal.congrats")}
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            {t("courseLocal.completedSuccess")}
          </p>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-[#f7f8fb] p-5">
            <div className="text-xs font-medium uppercase tracking-wider text-slate-400">
              {t("courseLocal.badgeEarned")}
            </div>
            <div className="mt-1 text-lg font-semibold text-slate-950">
              {badgeCourseName}
            </div>
          </div>

          <div className="mt-5 space-y-2 text-sm text-slate-500">
            <div className="flex items-center justify-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span>{t("courseLocal.allModulesCompleted")}</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span>{t("courseLocal.exercisesCompleted")}</span>
            </div>
          </div>

          <button
            onClick={onContinue}
            className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#111217] px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            {t("courseLocal.continueLearning")}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
