import { useCallback, useEffect, useMemo, useState } from "react";
import { Users, Search, UserPlus, UserMinus, X } from "lucide-react";
import { useTranslation } from "react-i18next";

import { supabase } from "../../../shared/lib/supabaseClient";
import { pickLang } from "../utils";
import type { Community } from "../types";
import { mensajeDe } from "../../../shared/lib/errores";

function normalize(text = ""): string {
  return String(text).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

type CommunityCardProps = {
  community: Community;
  isMember: boolean;
  lang: string;
  onJoin: (id: string | number) => void;
  onLeave: (id: string | number) => void;
  loadingId: string | number | null;
};

function CommunityCard({ community, isMember, lang, onJoin, onLeave, loadingId }: CommunityCardProps) {
  const { t } = useTranslation();
  const isLoading = loadingId === community.id;

  const name = pickLang(community.name, lang) || t("communities.dash");
  const description = pickLang(community.description, lang) || t("communities.noDescription");
  const membersText = t("communities.members", { count: community.members_count ?? 0 });

  return (
    <article className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-950/10">
      <div className="relative h-32 w-full overflow-hidden bg-slate-100">
        {community.image_url ? (
          <img
            src={community.image_url}
            alt={t("communities.imageAlt", { name })}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-slate-300">
            <Users className="h-12 w-12" />
          </div>
        )}
        {isMember && (
          <div className="absolute right-3 top-3 rounded-full bg-emerald-500 px-2.5 py-1 text-xs font-bold text-white shadow">
            {t("communities.memberBadge")}
          </div>
        )}
      </div>

      <div className="p-5 space-y-3">
        <div>
          <h3 className="text-lg font-semibold text-texto truncate">{name}</h3>
          <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-slate-600">{description}</p>
        </div>

        <div className="flex items-center justify-between gap-3">
          <span className="flex items-center gap-1.5 text-xs text-slate-400">
            <Users className="h-3.5 w-3.5" />
            {membersText}
          </span>

          <button
            type="button"
            onClick={() => (isMember ? onLeave(community.id) : onJoin(community.id))}
            disabled={isLoading}
            className={[
              "inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition disabled:opacity-50",
              isMember
                ? "border border-slate-200 bg-white text-slate-600 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                : "bg-tinta-950 text-white shadow-sm hover:-translate-y-0.5 hover:shadow-lg",
            ].join(" ")}
          >
            {isLoading ? (
              <span>{t("communities.loading")}</span>
            ) : isMember ? (
              <>
                <UserMinus className="h-4 w-4" />
                {t("communities.leave")}
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4" />
                {t("communities.joinAction")}
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}

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

  const loadData = useCallback(async () => {
    setLoading(true);
    setErro("");
    try {
      const { data: userData, error: userErr } = await supabase.auth.getUser();
      const user = userData?.user;
      if (userErr || !user) { setErro(t("communities.loadError")); return; }
      setUserId(user.id);

      const [commsResp, membersResp] = await Promise.all([
        supabase.from("communities_with_counts").select("*").order("created_at", { ascending: false }),
        supabase.from("community_members").select("community_id").eq("user_id", user.id),
      ]);

      if (commsResp.error) throw commsResp.error;
      if (membersResp.error) throw membersResp.error;

      setCommunities((commsResp.data as Community[]) ?? []);
      setMemberIds(new Set((membersResp.data ?? []).map((m) => m.community_id)));
    } catch (e) {
      setErro(mensajeDe(e, t("communities.loadError")));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => { loadData(); }, [loadData]);

  async function handleJoin(communityId: string | number) {
    if (!userId) return;
    setLoadingId(communityId);
    try {
      const { error } = await supabase.from("community_members").insert({ user_id: userId, community_id: communityId });
      if (error && error.code !== "23505") throw error;
      setMemberIds((prev) => new Set([...prev, communityId]));
      setCommunities((prev) => prev.map((c) => c.id === communityId ? { ...c, members_count: (c.members_count ?? 0) + 1 } : c));
    } catch (e) {
      setErro(mensajeDe(e, t("communities.loadError")));
    } finally {
      setLoadingId(null);
    }
  }

  async function handleLeave(communityId: string | number) {
    if (!userId) return;
    setLoadingId(communityId);
    try {
      const { error } = await supabase.from("community_members").delete().eq("user_id", userId).eq("community_id", communityId);
      if (error) throw error;
      setMemberIds((prev) => { const next = new Set(prev); next.delete(communityId); return next; });
      setCommunities((prev) => prev.map((c) => c.id === communityId ? { ...c, members_count: Math.max(0, (c.members_count ?? 1) - 1) } : c));
    } catch (e) {
      setErro(mensajeDe(e, t("communities.loadError")));
    } finally {
      setLoadingId(null);
    }
  }

  const filtered = useMemo(() => {
    let list = tab === "mine" ? communities.filter((c) => memberIds.has(c.id)) : communities;
    if (busca.trim()) {
      const q = normalize(busca);
      list = list.filter((c) => {
        const text = `${pickLang(c.name, lang)} ${pickLang(c.description, lang)}`;
        return normalize(text).includes(q);
      });
    }
    return list;
  }, [communities, memberIds, tab, busca, lang]);

  return (
    <main className="min-h-screen bg-white text-texto">
      {/* Header */}
      <section className="bg-slate-50 pb-12 pt-28 md:pt-32">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-semibold tracking-[-0.04em] text-texto sm:text-4xl md:text-5xl">
            {t("communities.pageTitle")}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-500">
            {t("communities.pageSubtitle")}
          </p>

          {/* Tabs + search */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <div className="flex gap-2">
              {(["all", "mine"] as const).map((t_) => (
                <button
                  key={t_}
                  onClick={() => setTab(t_)}
                  className={[
                    "rounded-full px-5 py-2.5 text-sm font-semibold transition",
                    tab === t_
                      ? "bg-tinta-950 text-white shadow-sm"
                      : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
                  ].join(" ")}
                >
                  {t_ === "all" ? t("communities.tabAll") : t("communities.tabMine")}
                </button>
              ))}
            </div>

            <div className="relative flex-1">
              <Search aria-hidden className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                aria-label={t("communities.searchLabel")}
                placeholder={t("communities.searchPlaceholder")}
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-full rounded-full border border-slate-200 bg-white py-2.5 pl-11 pr-4 text-sm shadow-sm outline-none transition focus:border-slate-400 focus:ring-1 focus:ring-slate-400"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {erro && (
            <div className="mb-8 flex items-center justify-between gap-3 rounded-2xl border border-red-200 bg-red-50 px-6 py-4 text-sm text-red-600">
              <span>{erro}</span>
              <button
                type="button"
                onClick={() => setErro("")}
                aria-label={t("communities.dismissError")}
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full hover:bg-red-100"
              >
                <X aria-hidden className="h-4 w-4" />
              </button>
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-72 animate-pulse rounded-[2rem] border border-slate-200 bg-slate-50" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center py-16">
              <Users className="h-16 w-16 text-slate-200" />
              <p className="mt-4 text-lg text-slate-500">
                {tab === "mine" ? t("communities.empty") : t("communities.noneFound")}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
