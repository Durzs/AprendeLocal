import { User, Cake, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";

type UserInfoCardProps = {
  name: string;
  age: string | number;
  avatarUrl?: string;
  locationLoading?: boolean;
  locationText?: string;
  cepText?: string;
  bairroText?: string;
};

export function UserInfoCard({
  name,
  age,
  avatarUrl = "",
  locationLoading = false,
  locationText = "",
  cepText = "",
  bairroText = "",
}: UserInfoCardProps) {
  const { t } = useTranslation();

  const isNotInformed =
    age === null || age === undefined || age === "" ||
    (typeof age === "string" && age.trim().length === 0);

  const idadeText = isNotInformed
    ? t("profileCard.notInformed")
    : `${age} ${t("profileCard.yearsSuffix")}`;

  const cidadeText = locationLoading
    ? t("profileCard.loading")
    : locationText || t("profileCard.notInformed");

  const cepFinal = cepText || t("profileCard.notInformed");
  const altAvatar = name || t("profileCard.notInformed");

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-4">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={altAvatar}
            className="h-16 w-16 rounded-full border-2 border-slate-100 object-cover"
          />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
            <User className="h-7 w-7 text-slate-400" />
          </div>
        )}

        <div className="min-w-0 flex-1">
          <h2 className="text-xl font-semibold text-slate-950">
            {name || t("profileCard.notInformed")}
          </h2>

          <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
            <span className="flex items-center gap-1.5">
              <Cake className="h-3.5 w-3.5" />
              {idadeText}
            </span>

            <span className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" />
              {cidadeText}
              <span className="text-slate-400">
                · {t("profileCard.cepLabel")}: {cepFinal}
                {bairroText ? ` · ${bairroText}` : ""}
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
