import { useCallback, useEffect, useMemo, useState } from "react";
import { Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { supabase } from "../../../shared/lib/supabaseClient";
import { pickLang } from "../utils";
import { mensajeDe } from "../../../shared/lib/errores";

type CommunityItem = {
  id: string | number;
  name: string | Record<string, string> | null;
  description: string | Record<string, string> | null;
  image_url: string | null;
  members_count?: number | null;
};

export function CommunitiesSection() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const lang = (i18n.resolvedLanguage || "pt").split("-")[0];

  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [items, setItems] = useState<CommunityItem[]>([]);

  const loadMyCommunities = useCallback(async () => {
    setLoading(true);
    setErro("");
    try {
      const { data: userData, error: userErr } = await supabase.auth.getUser();
      const user = userData?.user;
      if (userErr || !user) { setItems([]); return; }

      const { data: memberships, error: memErr } = await supabase
        .from("community_members").select("community_id").eq("user_id", user.id);
      if (memErr) throw memErr;

      const ids = (memberships ?? []).map((m) => m.community_id).filter(Boolean);
      if (!ids.length) { setItems([]); return; }

      const { data: comms, error: commErr } = await supabase
        .from("communities_with_counts").select("*").in("id", ids).order("created_at", { ascending: false });
      if (commErr) throw commErr;

      setItems((comms as CommunityItem[]) ?? []);
    } catch (e) {
      setErro(mensajeDe(e, t("communities.loadError")));
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    let alive = true;
    async function safeLoad() { if (!alive) return; await loadMyCommunities(); }
    safeLoad();
    const { data: sub } = supabase.auth.onAuthStateChange(() => { safeLoad(); });
    return () => { alive = false; sub?.subscription?.unsubscribe?.(); };
  }, [loadMyCommunities]);

  const top3 = useMemo(() => items.slice(0, 3), [items]);

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-slate-400" />
          <h3 className="text-base font-semibold text-texto">{t("communities.title")}</h3>
        </div>

        <button
          type="button"
          onClick={() => navigate("/comunidades")}
          className="rounded-full bg-tinta-950 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
        >
          {t("communities.viewAll")}
        </button>
      </div>

      {erro && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          {erro}
        </div>
      )}

      {loading ? (
        <div className="animate-pulse space-y-3">
          <div className="h-16 rounded-2xl bg-slate-50" />
          <div className="h-16 rounded-2xl bg-slate-50" />
        </div>
      ) : top3.length === 0 ? (
        <div className="space-y-3">
          <p className="text-sm text-slate-500">{t("communities.empty")}</p>
          <button
            type="button"
            onClick={() => navigate("/comunidades")}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            {t("communities.join")}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {top3.map((c) => {
            const name = pickLang(c.name, lang) || t("communities.dash");
            const description = pickLang(c.description, lang) || t("communities.noDescription");
            const membersText = t("communities.members", { count: c.members_count ?? 0 });

            return (
              <div
                key={c.id}
                className="rounded-2xl border border-slate-100 bg-white p-4 transition hover:border-slate-200 hover:shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 overflow-hidden rounded-xl border border-slate-100 bg-slate-50">
                    {c.image_url ? (
                      <img
                        src={c.image_url}
                        alt={t("communities.imageAlt", { name })}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <Users className="h-4 w-4 text-slate-300" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-texto">{name}</p>
                    <p className="mt-0.5 line-clamp-2 text-xs text-slate-500">{description}</p>
                    <p className="mt-1.5 text-xs text-slate-400">{membersText}</p>
                  </div>
                </div>

                <button
                  type="button"
                  className="mt-3 w-full rounded-full border border-slate-200 bg-white py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                  onClick={() => navigate("/comunidades")}
                >
                  {t("communities.open")}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
