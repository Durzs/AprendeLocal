import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Sparkles, Send } from "lucide-react";

type GeminiAIChatProps = {
  title?: string;
  content?: string;
  moduleTitle?: string;
};

function stripHtml(html = "") {
  return String(html)
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
    .replace(/<\/(p|div|br|li|h1|h2|h3|h4|h5|h6)>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/ /g, " ")
    .replace(/\s+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

function truncate(str = "", max = 14000) {
  const s = String(str || "");
  return s.length > max ? `${s.slice(0, max)}…` : s;
}

export default function GeminiAIChat({
  title = "",
  content = "",
  moduleTitle = "",
}: GeminiAIChatProps) {
  const { t, i18n } = useTranslation();
  const lang = (i18n.resolvedLanguage || "pt").split("-")[0];

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  const model = useMemo(() => {
    if (!apiKey) return null;
    const genAI = new GoogleGenerativeAI(apiKey);
    return genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  }, [apiKey]);

  const canUseAI = Boolean(apiKey && model);

  const safeTextContent = useMemo(() => truncate(stripHtml(content), 14000), [content]);

  const prompt = useMemo(() => {
    const mTitle = moduleTitle || t("geminiChat.fallback.noModule");
    const matTitle = title || t("geminiChat.fallback.noTitle");

    return `
${t("geminiChat.prompt.role", { lang })}

${t("geminiChat.prompt.rulesTitle")}
1) ${t("geminiChat.prompt.rule1")}
2) ${t("geminiChat.prompt.rule2")}

${t("geminiChat.prompt.moduleTitle")}
${mTitle}

${t("geminiChat.prompt.materialTitle")}
${matTitle}

${t("geminiChat.prompt.materialBody")}
${safeTextContent || t("geminiChat.fallback.emptyContent")}
`.trim();
  }, [content, lang, moduleTitle, safeTextContent, t, title]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAnswer("");

    if (!canUseAI || !model) {
      setAnswer(t("geminiChat.errors.missingKey"));
      return;
    }

    const q = question.trim();
    if (!q) return;

    setLoading(true);

    try {
      const fullPrompt = `${prompt}\n\n${t("geminiChat.prompt.question")}\n${q}\n`;
      const result = await model.generateContent(fullPrompt);
      const text = result?.response?.text?.() ?? "";
      setAnswer(text || t("geminiChat.errors.emptyResponse"));
    } catch (error: any) {
      console.error("Gemini error:", error);
      setAnswer(error?.message || t("geminiChat.errors.generic"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-[#f7f8fb] p-6">
      <div className="mb-4 flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-slate-400" />
        <h3 className="text-base font-semibold text-slate-950">
          {t("geminiChat.ui.title")}
        </h3>
      </div>

      {!canUseAI && (
        <div className="mb-5 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-500">
          <div className="font-semibold text-slate-700">
            {t("geminiChat.ui.disabledTitle")}
          </div>
          <div className="mt-1">
            {t("geminiChat.ui.disabledDesc1")}{" "}
            <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-700">VITE_GEMINI_API_KEY</code>.{" "}
            {t("geminiChat.ui.disabledDesc2")}{" "}
            <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-700">.env</code>,{" "}
            {t("geminiChat.ui.disabledDesc3")}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder={t("geminiChat.ui.placeholder")}
          rows={3}
          className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-slate-400 focus:ring-1 focus:ring-slate-400"
        />

        <button
          type="submit"
          disabled={loading || !question.trim() || !canUseAI}
          className="inline-flex items-center gap-2 rounded-full bg-[#111217] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
          {loading ? t("geminiChat.ui.thinking") : t("geminiChat.ui.ask")}
        </button>
      </form>

      {answer && (
        <div className="mt-5 rounded-xl border border-slate-200 bg-white p-5">
          <h4 className="mb-2 text-sm font-semibold text-slate-950">
            {t("geminiChat.ui.answerTitle")}
          </h4>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-600">{answer}</p>
        </div>
      )}
    </div>
  );
}
