import { useTranslation } from "react-i18next";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const current = (i18n.resolvedLanguage || "pt").split("-")[0];

  function changeLanguage(lang: string) {
    i18n.changeLanguage(lang);
  }

  return (
    <select
      value={current}
      onChange={(e) => changeLanguage(e.target.value)}
      className="rounded-xl border border-white/20 bg-white/70 px-3 py-2 text-sm text-slate-700 shadow-sm outline-none"
      aria-label="Language selector"
    >
      <option value="pt">PT</option>
      <option value="en">EN</option>
      <option value="es">ES</option>
    </select>
  );
}