export type TranslatedField =
  | string
  | null
  | undefined
  | Record<string, string | undefined>;

export function pickLang(
  value: TranslatedField,
  lang = "pt",
  fallback = "pt"
): string {
  if (!value) return "";
  if (typeof value === "string") return value;

  return value[lang] ?? value[fallback] ?? value.pt ?? value.en ?? value.es ?? "";
}
