export { pickLang } from "../../shared/i18n/pickLang";

export function normalize(text = ""): string {
  return String(text)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}
