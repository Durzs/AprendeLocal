import { User, Cake, MapPin, School, BookOpen, ShieldCheck } from "lucide-react";
import { useTranslation } from "react-i18next";

type UserInfoCardProps = {
  name: string;
  age: string | number;
  avatarUrl?: string;
  role?: string | null;
  schoolName?: string | null;
  schoolCommune?: string | null;
  subject?: string | null;
  onEditSchool?: () => void;
};

export function UserInfoCard({
  name,
  age,
  avatarUrl = "",
  role,
  schoolName,
  schoolCommune,
  subject,
  onEditSchool,
}: UserInfoCardProps) {
  const { t } = useTranslation();

  const isNotInformed =
    age === null || age === undefined || age === "" ||
    (typeof age === "string" && age.trim().length === 0);

  const idadeText = isNotInformed
    ? t("profileCard.notInformed")
    : `${age} ${t("profileCard.yearsSuffix")}`;

  const altAvatar = name || t("profileCard.notInformed");

  const isAdmin = role === "admin";
  const isTeacher = role === "profesor" || (!role && !isAdmin);
  const regionText = schoolCommune ? `${schoolCommune}, La Araucanía` : "La Araucanía, Chile";

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
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
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-semibold text-slate-950">
              {name || t("profileCard.notInformed")}
            </h2>

            {/* Badge de Rol */}
            {isAdmin ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-semibold text-purple-800">
                <ShieldCheck className="h-3.5 w-3.5" />
                👑 Administrador
              </span>
            ) : isTeacher ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
                👩‍🏫 Docente / Profesor
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800">
                🧑‍🎓 Estudiante
              </span>
            )}
          </div>

          <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
            <span className="flex items-center gap-1.5">
              <Cake className="h-3.5 w-3.5" />
              {idadeText}
            </span>

            <span className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" />
              {regionText}
            </span>
          </div>

          {/* Información de Escuela Asignada para Docentes o Admin */}
          {(isTeacher || isAdmin) && (
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-slate-50 p-2.5 border border-slate-200/80 text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <School className="h-4 w-4 shrink-0 text-emerald-600" />
                <span className="text-slate-600">{isAdmin ? "Escuela activa:" : "Escuela:"}</span>
                <span className="font-semibold text-slate-900 truncate">
                  {schoolName || (isAdmin ? "Todas las escuelas (Acceso total)" : "Sin escuela asignada")}
                </span>
                {schoolCommune && (
                  <span className="rounded-md bg-white px-2 py-0.5 text-slate-600 border border-slate-200 text-[11px]">
                    📍 {schoolCommune}
                  </span>
                )}
                {subject && (
                  <span className="flex items-center gap-1 text-slate-500 text-[11px]">
                    <BookOpen className="h-3 w-3" />
                    {subject}
                  </span>
                )}
              </div>

              {onEditSchool && (
                <button
                  type="button"
                  onClick={onEditSchool}
                  className="shrink-0 font-medium text-emerald-700 hover:text-emerald-800 underline underline-offset-2 text-xs"
                >
                  {schoolName ? "Cambiar escuela" : "Seleccionar escuela"}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
