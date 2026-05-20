export { pickLang } from "../../shared/i18n/pickLang";

export function limparCep(cep = ""): string {
  return String(cep).replace(/\D/g, "").slice(0, 8);
}

export function formatarCep(cep = ""): string {
  const c = limparCep(cep);
  if (c.length !== 8) return cep || "";
  return `${c.slice(0, 5)}-${c.slice(5)}`;
}
