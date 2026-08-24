import { useTranslation } from "react-i18next";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const current = (i18n.resolvedLanguage || "es").split("-")[0];

  function changeLanguage(lang: string) {
    i18n.changeLanguage(lang);
  }

  return (
    <select
      value={current}
      onChange={(e) => changeLanguage(e.target.value)}
      className="rounded-xl border border-white/20 bg-white/10 text-white px-3 py-1.5 text-xs sm:text-sm font-semibold shadow-sm outline-none cursor-pointer transition hover:bg-white/20"
      aria-label="Language selector"
    >
      <option value="es" className="bg-[#0a0047] text-white">ES</option>
      <option value="pt" className="bg-[#0a0047] text-white">PT</option>
      <option value="en" className="bg-[#0a0047] text-white">EN</option>
    </select>
  );
}
