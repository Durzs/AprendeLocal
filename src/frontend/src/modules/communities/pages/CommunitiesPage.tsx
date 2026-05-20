import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Search, UserPlus, UserMinus, X } from "lucide-react";
import { useTranslation } from "react-i18next";

import { supabase } from "../../../shared/lib/supabaseClient";
import { pickLang } from "../utils";
import type { Community, Particle } from "../types";

// ─── helpers ────────────────────────────────────────────────────────────────

function normalize(text = ""): string {
  return String(text)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

// ─── sub-components ─────────────────────────────────────────────────────────

type CommunityCardProps = {
  community: Community;
  isMember: boolean;
  lang: string;
  onJoin: (id: string | number) => void;
  onLeave: (id: string | number) => void;
  loadingId: string | number | null;
};

function CommunityCard({
  community,
  isMember,
  lang,
  onJoin,
  onLeave,
  loadingId,
}: CommunityCardProps) {
  const { t } = useTranslation();
  const isLoading = loadingId === community.id;

  const name = pickLang(community.name, lang) || t("communities.dash");
  const description =
    pickLang(community.description, lang) || t("communities.noDescription");
  const membersText = t("communities.members", {
    count: community.members_count ?? 0,
  });

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl overflow-hidden bg-white/85 backdrop-blur border border-white/40 shadow hover:shadow-lg transition-shadow"
    >
      <div className="h-32 w-full bg-gradient-to-br from-blue-400 to-blue-700 relative overflow-hidden">
        {community.image_url ? (
          <img
            src={community.image_url}
            alt={t("communities.imageAlt", { name })}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center opacity-30">
            <Users className="w-16 h-16 text-white" />
          </div>
        )}

        {isMember && (
          <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow">
            {t("communities.memberBadge")}
          </div>
        )}
      </div>

      <div className="p-5 space-y-3">
        <div>
          <h3 className="font-semibold text-lg text-slate-900 truncate">{name}</h3>
          <p className="text-slate-700 text-sm line-clamp-2 mt-1">{description}</p>
        </div>

        <div className="flex items-center justify-between gap-3">
          <span className="text-xs text-slate-500 flex items-center gap-1">
            <Users className="w-3 h-3" />
            {membersText}
          </span>

          <button
            type="button"
            onClick={() => (isMember ? onLeave(community.id) : onJoin(community.id))}
            disabled={isLoading}
            className={[
              "flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-xl transition disabled:opacity-50",
              isMember
                ? "bg-slate-100 text-slate-700 hover:bg-red-50 hover:text-red-600 border border-slate-200"
                : "bg-blue-700 text-white hover:opacity-90 shadow",
            ].join(" ")}
          >
            {isLoading ? (
              <span>{t("communities.loading")}</span>
            ) : isMember ? (
              <>
                <UserMinus className="w-4 h-4" />
                {t("communities.leave")}
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                {t("communities.joinAction")}
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── main page ───────────────────────────────────────────────────────────────

export default function CommunitiesPage() {
  const { t, i18n } = useTranslation();
  const lang = (i18n.resolvedLanguage || "pt").split("-")[0];

  const [tab, setTab] = useState<"all" | "mine">("all");
  const [busca, setBusca] = useState("");
  const [communities, setCommunities] = useState<Community[]>([]);
  const [memberIds, setMemberIds] = useState<Set<string | number>>(new Set());
  const [loadingId, setLoadingId] = useState<string | number | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [userId, setUserId] = useState<string | null>(null);

  // ── load all data ──────────────────────────────────────────────────────────

  const loadData = useCallback(async () => {
    setLoading(true);
    setErro("");

    try {
      const { data: userData, error: userErr } = await supabase.auth.getUser();
      const user = userData?.user;
      if (userErr || !user) {
        setErro(t("communities.loadError"));
        return;
      }
      setUserId(user.id);

      const [commsResp, membersResp] = await Promise.all([
        supabase
          .from("communities_with_counts")
          .select("*")
          .order("created_at", { ascending: false }),
        supabase
          .from("community_members")
          .select("community_id")
          .eq("user_id", user.id),
      ]);

      if (commsResp.error) throw commsResp.error;
      if (membersResp.error) throw membersResp.error;

      setCommunities((commsResp.data as Community[]) ?? []);
      setMemberIds(
        new Set((membersResp.data ?? []).map((m) => m.community_id))
      );
    } catch (e: any) {
      setErro(e?.message || t("communities.loadError"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ── join / leave ───────────────────────────────────────────────────────────

  async function handleJoin(communityId: string | number) {
    if (!userId) return;
    setLoadingId(communityId);
    try {
      const { error } = await supabase
        .from("community_members")
        .insert({ user_id: userId, community_id: communityId });
      if (error && error.code !== "23505") throw error;
      setMemberIds((prev) => new Set([...prev, communityId]));
      setCommunities((prev) =>
        prev.map((c) =>
          c.id === communityId
            ? { ...c, members_count: (c.members_count ?? 0) + 1 }
            : c
        )
      );
    } catch (e: any) {
      setErro(e?.message || t("communities.loadError"));
    } finally {
      setLoadingId(null);
    }
  }

  async function handleLeave(communityId: string | number) {
    if (!userId) return;
    setLoadingId(communityId);
    try {
      const { error } = await supabase
        .from("community_members")
        .delete()
        .eq("user_id", userId)
        .eq("community_id", communityId);
      if (error) throw error;
      setMemberIds((prev) => {
        const next = new Set(prev);
        next.delete(communityId);
        return next;
      });
      setCommunities((prev) =>
        prev.map((c) =>
          c.id === communityId
            ? { ...c, members_count: Math.max(0, (c.members_count ?? 1) - 1) }
            : c
        )
      );
    } catch (e: any) {
      setErro(e?.message || t("communities.loadError"));
    } finally {
      setLoadingId(null);
    }
  }

  // ── filtering ──────────────────────────────────────────────────────────────

  const filtered = useMemo(() => {
    let list = tab === "mine"
      ? communities.filter((c) => memberIds.has(c.id))
      : communities;

    if (busca.trim()) {
      const q = normalize(busca);
      list = list.filter((c) => {
        const text = `${pickLang(c.name, lang)} ${pickLang(c.description, lang)}`;
        return normalize(text).includes(q);
      });
    }
    return list;
  }, [communities, memberIds, tab, busca, lang]);

  // ── particles ─────────────────────────────────────────────────────────────

  const particles = useMemo<Particle[]>(() => {
    if (typeof window === "undefined") return [];
    return [...Array(20)].map(() => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      scale: Math.random() * 0.5 + 0.5,
      dy: Math.random() * -100 - 50,
      dx: Math.random() * 100 - 50,
      duration: Math.random() * 10 + 10,
    }));
  }, []);

  // ── render ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-600 to-blue-300 dark:from-blue-950 dark:via-blue-600 dark:to-blue-300 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 relative z-10">

        {/* header */}
        <motion.div
          initial={{ y: -25, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.45 }}
          className="mb-6"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow mb-2">
            {t("communities.pageTitle")}
          </h1>
          <p className="text-white/80 max-w-2xl">{t("communities.pageSubtitle")}</p>
        </motion.div>

        {/* error */}
        {erro && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 flex items-center justify-between gap-3 p-4 rounded-2xl bg-red-50/90 text-red-700 border border-red-200 shadow"
          >
            <span>{erro}</span>
            <button onClick={() => setErro("")} className="shrink-0">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        {/* tabs + search */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="flex gap-2">
            {(["all", "mine"] as const).map((t_) => (
              <button
                key={t_}
                onClick={() => setTab(t_)}
                className={[
                  "px-4 py-2 rounded-full font-medium transition",
                  tab === t_
                    ? "bg-white/80 text-slate-900 shadow backdrop-blur"
                    : "bg-white/30 text-white hover:bg-white/40 backdrop-blur",
                ].join(" ")}
              >
                {t_ === "all"
                  ? t("communities.tabAll")
                  : t("communities.tabMine")}
              </button>
            ))}
          </div>

          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder={t("communities.searchPlaceholder")}
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-2xl bg-white/70 backdrop-blur border border-white/40 shadow focus:outline-none text-sm"
            />
          </div>
        </div>

        {/* content */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-10">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="rounded-2xl bg-white/20 animate-pulse h-64"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Users className="w-16 h-16 text-white/40 mx-auto mb-4" />
            <p className="text-white/80 text-lg">
              {tab === "mine"
                ? t("communities.empty")
                : t("communities.noneFound")}
            </p>
          </motion.div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-10"
          >
            <AnimatePresence>
              {filtered.map((community) => (
                <CommunityCard
                  key={community.id}
                  community={community}
                  isMember={memberIds.has(community.id)}
                  lang={lang}
                  onJoin={handleJoin}
                  onLeave={handleLeave}
                  loadingId={loadingId}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {particles.map((p, i) => (
          <motion.div
            key={i}
            initial={{ x: p.x, y: p.y, scale: p.scale }}
            animate={{ y: [null, p.dy], x: [null, p.dx] }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            className="absolute w-2 h-2 bg-blue-300 dark:bg-white rounded-full opacity-30"
          />
        ))}
      </div>
    </div>
  );
}