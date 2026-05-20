import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { supabase } from "../../../shared/lib/supabaseClient";
import { pickLang } from "../utils";

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

      if (userErr || !user) {
        setItems([]);
        return;
      }

      const { data: memberships, error: memErr } = await supabase
        .from("community_members")
        .select("community_id")
        .eq("user_id", user.id);

      if (memErr) throw memErr;

      const ids = (memberships ?? []).map((m) => m.community_id).filter(Boolean);

      if (!ids.length) {
        setItems([]);
        return;
      }

      const { data: comms, error: commErr } = await supabase
        .from("communities_with_counts")
        .select("*")
        .in("id", ids)
        .order("created_at", { ascending: false });

      if (commErr) throw commErr;

      setItems((comms as CommunityItem[]) ?? []);
    } catch (e: any) {
      setErro(e?.message || t("communities.loadError"));
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    let alive = true;

    async function safeLoad() {
      if (!alive) return;
      await loadMyCommunities();
    }

    safeLoad();

    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      safeLoad();
    });

    return () => {
      alive = false;
      sub?.subscription?.unsubscribe?.();
    };
  }, [loadMyCommunities]);

  const top3 = useMemo(() => items.slice(0, 3), [items]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.25 }}
      className="bg-white dark:bg-gray-300 rounded-3xl p-6 shadow-lg"
    >
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <Users className="w-6 h-6 text-blue-800" />
          <h3 className="text-xl font-bold text-gray-800 dark:text-black">
            {t("communities.title")}
          </h3>
        </div>

        <button
          type="button"
          onClick={() => navigate("/comunidades")}
          className="rounded-2xl px-4 py-2 text-sm font-bold bg-blue-700 text-white hover:opacity-90 transition"
        >
          {t("communities.viewAll")}
        </button>
      </div>

      {erro ? (
        <div className="mb-4 rounded-xl bg-red-50 text-red-700 border border-red-200 p-3 text-sm">
          {erro}
        </div>
      ) : null}

      {loading ? (
        <div className="text-gray-600 dark:text-black">
          {t("communities.loading")}
        </div>
      ) : top3.length === 0 ? (
        <div className="flex flex-col gap-3">
          <p className="text-gray-600 dark:text-black">{t("communities.empty")}</p>
          <button
            type="button"
            onClick={() => navigate("/comunidades")}
            className="w-fit rounded-2xl px-4 py-2 text-sm font-bold bg-gray-900 text-white hover:opacity-90 transition"
          >
            {t("communities.join")}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {top3.map((c, idx) => {
            const dash = t("communities.dash");
            const name = pickLang(c.name, lang) || "";
            const description =
              pickLang(c.description, lang) || t("communities.noDescription");

            const membersText = t("communities.members", {
              count: c.members_count ?? 0,
            });

            const imageAlt = t("communities.imageAlt", {
              name: name || dash,
            });

            return (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.08 }}
                className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-2xl overflow-hidden border border-black/10 bg-black/5">
                    {c.image_url ? (
                      <img
                        src={c.image_url}
                        alt={imageAlt}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    ) : null}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-gray-900 truncate">
                      {name || dash}
                    </p>
                    <p className="text-xs text-gray-600 line-clamp-2 mt-1">
                      {description}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">{membersText}</p>
                  </div>
                </div>

                <button
                  type="button"
                  className="mt-4 w-full rounded-2xl px-4 py-2 text-sm font-bold bg-blue-700 text-white hover:opacity-90 transition"
                  onClick={() => navigate("/comunidades")}
                >
                  {t("communities.open")}
                </button>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}