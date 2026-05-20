import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { GoogleGenerativeAI } from "@google/generative-ai";

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
    .replace(/\u00a0/g, " ")
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

  const safeTextContent = useMemo(() => {
    return truncate(stripHtml(content), 14000);
  }, [content]);

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
    <div className="mt-8 rounded-3xl bg-black/20 backdrop-blur border border-white/30 p-8 md:p-10 shadow">
      <h3 className="text-center text-white text-2xl font-semibold mb-4">
        {t("geminiChat.ui.title")}
      </h3>

      {!canUseAI ? (
        <div className="mb-5 rounded-2xl border border-white/25 bg-white/10 p-4 text-white/85 text-sm">
          <div className="font-semibold mb-1">
            {t("geminiChat.ui.disabledTitle")}
          </div>
          <div>
            {t("geminiChat.ui.disabledDesc1")}{" "}
            <code className="text-white">VITE_GEMINI_API_KEY</code>.{" "}
            {t("geminiChat.ui.disabledDesc2")}{" "}
            <code className="text-white">.env</code>,{" "}
            {t("geminiChat.ui.disabledDesc3")}
          </div>
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="flex flex-col items-center">
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder={t("geminiChat.ui.placeholder")}
          rows={4}
          className="w-full p-2.5 rounded bg-white/10 border border-white/30 text-white placeholder-white/70 mb-4 focus:ring-2 focus:ring-white/50 focus:outline-none transition"
        />

        <button
          type="submit"
          disabled={loading || !question.trim() || !canUseAI}
          className="bg-white text-blue-700 font-semibold px-6 py-3 rounded-lg shadow hover:bg-white/90 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? t("geminiChat.ui.thinking") : t("geminiChat.ui.ask")}
        </button>
      </form>

      {answer ? (
        <div className="mt-5 p-4 border border-white/30 rounded bg-black/20">
          <h4 className="font-bold mb-2 text-white">
            {t("geminiChat.ui.answerTitle")}
          </h4>
          <p className="whitespace-pre-wrap text-white/90">{answer}</p>
        </div>
      ) : null}
    </div>
  );
}