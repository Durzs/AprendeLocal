import { useEffect, useState } from "react";
import { Trophy, Star, Lock } from "lucide-react";
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
      if (userErr || !user) { setBadges([]); setEarnedIds(new Set()); setLoading(false); return; }

      const { data: badgesData, error: badgesErr } = await supabase
        .from("badges").select("id, name, description, image_url").order("id", { ascending: true });
      if (!mounted) return;
      if (badgesErr) { setErro(badgesErr.message); setBadges([]); setEarnedIds(new Set()); setLoading(false); return; }

      const { data: earnedData, error: earnedErr } = await supabase
        .from("user_badges").select("badge_id").eq("user_id", user.id);
      if (!mounted) return;
      if (earnedErr) { setErro(earnedErr.message); setBadges((badgesData as Badge[]) ?? []); setEarnedIds(new Set()); setLoading(false); return; }

      setBadges((badgesData as Badge[]) ?? []);
      setEarnedIds(new Set((earnedData ?? []).map((x) => x.badge_id)));
      setLoading(false);
    }

    carregarBadges();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-2">
        <Trophy className="h-5 w-5 text-slate-400" />
        <h3 className="text-base font-semibold text-slate-950">{t("badges.title")}</h3>
      </div>

      {erro && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          {erro}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl bg-slate-50" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {badges.map((badge) => {
            const active = earnedIds.has(badge.id);
            const imgSrc = getBadgeImageUrl(badge.image_url);
            const badgeName = badge?.name || "";
            const altPrefix = t("badges.imageAltPrefix");
            const fallbackName = t("badges.fallbackName");

            return (
              <div
                key={badge.id}
                className={[
                  "relative flex flex-col items-center gap-2 rounded-2xl border p-4 transition",
                  active
                    ? "border-slate-200 bg-white shadow-sm"
                    : "border-slate-100 bg-slate-50 opacity-50",
                ].join(" ")}
              >
                {active && (
                  <div className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-amber-400">
                    <Star className="h-2.5 w-2.5 text-white" fill="currentColor" />
                  </div>
                )}

                {imgSrc ? (
                  <img
                    src={imgSrc}
                    alt={`${altPrefix} ${badgeName || fallbackName}`}
                    className={["h-20 w-full rounded-xl object-cover", !active && "grayscale"].join(" ")}
                    loading="lazy"
                  />
                ) : (
                  <div className={active ? "text-slate-400" : "text-slate-300"}>
                    <Trophy className="h-10 w-10" />
                  </div>
                )}

                {!active && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Lock className="h-5 w-5 text-slate-300" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
