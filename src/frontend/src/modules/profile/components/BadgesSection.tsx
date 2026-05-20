import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Star } from "lucide-react";
import { useTranslation } from "react-i18next";

import { supabase } from "../../../shared/lib/supabaseClient";

type Badge = {
  id: string | number;
  name: string | null;
  description?: string | null;
  image_url: string | null;
};

export function BadgesSection() {
  const { t } = useTranslation();

  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [badges, setBadges] = useState<Badge[]>([]);
  const [earnedIds, setEarnedIds] = useState<Set<string | number>>(new Set());

  const BADGE_BUCKET = "badge";

  const normalizeStoragePath = (value: string | null) => {
    if (!value) return null;
    if (value.startsWith("http")) return value;

    const prefix = `buckets/${BADGE_BUCKET}/`;
    if (value.startsWith(prefix)) return value.replace(prefix, "");

    const prefix2 = `${BADGE_BUCKET}/`;
    if (value.startsWith(prefix2)) return value.replace(prefix2, "");

    return value;
  };

  const getBadgeImageUrl = (imageUrl: string | null) => {
    if (!imageUrl) return null;
    if (imageUrl.startsWith("http")) return imageUrl;

    const cleanPath = normalizeStoragePath(imageUrl);
    if (!cleanPath) return null;

    const { data } = supabase.storage.from(BADGE_BUCKET).getPublicUrl(cleanPath);
    return data?.publicUrl ?? null;
  };

  useEffect(() => {
    let mounted = true;

    async function carregarBadges() {
      setLoading(true);
      setErro("");

      const { data: userData, error: userErr } = await supabase.auth.getUser();
      const user = userData?.user;

      if (!mounted) return;

      if (userErr || !user) {
        setBadges([]);
        setEarnedIds(new Set());
        setLoading(false);
        return;
      }

      const { data: badgesData, error: badgesErr } = await supabase
        .from("badges")
        .select("id, name, description, image_url")
        .order("id", { ascending: true });

      if (!mounted) return;

      if (badgesErr) {
        setErro(badgesErr.message);
        setBadges([]);
        setEarnedIds(new Set());
        setLoading(false);
        return;
      }

      const { data: earnedData, error: earnedErr } = await supabase
        .from("user_badges")
        .select("badge_id")
        .eq("user_id", user.id);

      if (!mounted) return;

      if (earnedErr) {
        setErro(earnedErr.message);
        setBadges((badgesData as Badge[]) ?? []);
        setEarnedIds(new Set());
        setLoading(false);
        return;
      }

      const earnedSet = new Set((earnedData ?? []).map((x) => x.badge_id));

      setBadges((badgesData as Badge[]) ?? []);
      setEarnedIds(earnedSet);
      setLoading(false);
    }

    carregarBadges();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white dark:bg-gray-300 rounded-3xl p-6 shadow-lg"
    >
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="w-6 h-6 text-blue-800" />
        <h3 className="text-xl font-bold text-gray-800 dark:text-black">
          {t("badges.title")}
        </h3>
      </div>

      {erro ? (
        <div className="mb-4 p-3 rounded bg-red-50 text-red-700 border border-red-200">
          {erro}
        </div>
      ) : null}

      {loading ? (
        <p className="text-sm text-gray-600">{t("badges.loading")}</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {badges.map((badge, index) => {
            const active = earnedIds.has(badge.id);
            const imgSrc = getBadgeImageUrl(badge.image_url);
            const badgeName = badge?.name || "";
            const altPrefix = t("badges.imageAltPrefix");
            const fallbackName = t("badges.fallbackName");

            return (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: active ? 1.1 : 1.05, y: -5 }}
                className="relative group"
              >
                <div
                  className={[
                    "relative rounded-2xl p-4 flex flex-col items-center gap-2 cursor-pointer transition-all",
                    active
                      ? "bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg"
                      : "bg-gray-200 dark:bg-gray-800 opacity-40",
                  ].join(" ")}
                >
                  {active && (
                    <motion.div
                      animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
                      transition={{
                        repeat: Infinity,
                        duration: 2,
                        delay: index * 0.1,
                      }}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center"
                    >
                      <Star className="w-3 h-3 text-white fill-current" />
                    </motion.div>
                  )}

                  {imgSrc ? (
                    <img
                      src={imgSrc}
                      alt={`${altPrefix} ${badgeName || fallbackName}`}
                      className={[
                        "w-40 h-24 object-cover rounded-xl",
                        active ? "" : "grayscale opacity-60",
                      ].join(" ")}
                      loading="lazy"
                    />
                  ) : (
                    <div className={active ? "text-white" : "text-gray-400"}>
                      <Trophy className="w-10 h-10" />
                    </div>
                  )}

                  {!active && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-4xl opacity-20" aria-hidden="true">
                        🔒
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}