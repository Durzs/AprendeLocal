import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { supabase } from "../../../shared/lib/supabaseClient";
import { UserInfoCard } from "../components/UserInfoCard";
import { BadgesSection } from "../components/BadgesSection";
import { CommunitiesSection } from "../components/CommunitiesSection";
import { ActiveCourses } from "../components/ActiveCourses";
import { pickLang, limparCep, formatarCep } from "../utils";
import type { CepLookupResult, ProfileData } from "../types";

export default function ProfilePage() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const lang = (i18n.resolvedLanguage || "pt").split("-")[0];

  const msg = {
    profile: {
      title: t("profile.title"),
      subtitle: t("profile.subtitle"),
      loading: t("profile.loading"),
      userFallback: t("profile.userFallback"),
      notInformed: t("profile.notInformed"),
      cepInvalid: t("profile.cepInvalid"),
      cepFetchFail: t("profile.cepFetchFail"),
      cepNotFound: t("profile.cepNotFound"),
    },
  };

  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [userId, setUserId] = useState<string | null>(null);

  const [profile, setProfile] = useState<ProfileData>({
    name: "",
    age: null,
    avatarUrl: "",
    cep: "",
  });

  const [locationLoading, setLocationLoading] = useState(false);
  const [locationText, setLocationText] = useState("");
  const [bairro, setBairro] = useState("");

  const buscarCidadeUFPorCep = useCallback(
    async (cep: string): Promise<CepLookupResult> => {
      const cepLimpo = limparCep(cep);
      if (cepLimpo.length !== 8) return { ok: false, error: msg.profile.cepInvalid, data: null };

      const cacheKey = `cep:${cepLimpo}`;
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        try { return { ok: true, error: null, data: JSON.parse(cached) }; } catch { localStorage.removeItem(cacheKey); }
      }

      const res = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      if (!res.ok) return { ok: false, error: msg.profile.cepFetchFail, data: null };

      const json = await res.json();
      if (json?.erro) return { ok: false, error: msg.profile.cepNotFound, data: null };

      const data = { cidade: json.localidade || "", uf: json.uf || "", bairro: json.bairro || "" };
      localStorage.setItem(cacheKey, JSON.stringify(data));
      return { ok: true, error: null, data };
    },
    [msg.profile.cepFetchFail, msg.profile.cepInvalid, msg.profile.cepNotFound]
  );

  useEffect(() => {
    let isMounted = true;

    async function loadPerfil() {
      setLoading(true);
      setErro("");

      const { data: userData, error: userErr } = await supabase.auth.getUser();
      const user = userData?.user;
      if (userErr || !user) { navigate("/entrar"); return; }
      if (isMounted) setUserId(user.id);

      const { data: prof, error: profErr } = await supabase
        .from("profiles")
        .select("nome, idade, avatar_url, cep")
        .eq("id", user.id)
        .maybeSingle();

      if (!isMounted) return;

      const nomeMeta = user.user_metadata?.nome ?? "";
      const avatarMeta = user.user_metadata?.avatar_url ?? "";

      if (profErr) {
        setProfile({ name: nomeMeta || user.email || msg.profile.userFallback, age: null, avatarUrl: avatarMeta || "", cep: "" });
        setLoading(false);
        return;
      }

      if (!prof) {
        await supabase.from("profiles").insert([{ id: user.id, nome: nomeMeta || (user.email ?? msg.profile.userFallback), avatar_url: avatarMeta || null, cep: null }]);
        setProfile({ name: nomeMeta || user.email || msg.profile.userFallback, age: null, avatarUrl: avatarMeta || "", cep: "" });
        setLoading(false);
        return;
      }

      setProfile({ name: prof.nome || user.email || msg.profile.userFallback, age: prof.idade ?? null, avatarUrl: prof.avatar_url || "", cep: prof.cep || "" });
      setLoading(false);
    }

    loadPerfil();
    return () => { isMounted = false; };
  }, [navigate, msg.profile.userFallback]);

  useEffect(() => {
    let alive = true;

    async function loadLocalizacao() {
      setLocationText("");
      setBairro("");
      const cepRaw = pickLang(profile.cep, lang);
      const cepLimpo = limparCep(cepRaw);
      if (!cepLimpo || cepLimpo.length !== 8) return;

      setLocationLoading(true);
      try {
        const result = await buscarCidadeUFPorCep(cepLimpo);
        if (!alive) return;
        if (result.ok) {
          const { cidade, uf, bairro } = result.data || {};
          setLocationText(cidade && uf ? `${cidade}/${uf}` : "");
          setBairro(bairro || "");
        }
      } catch {
        if (!alive) return;
      } finally {
        if (!alive) return;
        setLocationLoading(false);
      }
    }

    loadLocalizacao();
    return () => { alive = false; };
  }, [profile.cep, lang, buscarCidadeUFPorCep]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f7f8fb] pt-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <p className="text-slate-500">{msg.profile.loading}</p>
        </div>
      </main>
    );
  }

  const nameText = pickLang(profile.name, lang) || msg.profile.userFallback;
  const avatarText = pickLang(profile.avatarUrl, lang) || "";
  const cepTextRaw = pickLang(profile.cep, lang) || "";
  const cepText = formatarCep(cepTextRaw) || msg.profile.notInformed;
  const ageText = profile.age ?? msg.profile.notInformed;

  return (
    <main className="min-h-screen bg-white text-[#111217]">
      {/* Header */}
      <section className="bg-[#f7f8fb] pb-12 pt-28 md:pt-32">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-semibold tracking-[-0.04em] text-[#111217] sm:text-4xl md:text-5xl">
            {msg.profile.title}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-500">
            {msg.profile.subtitle}
          </p>

          {erro && (
            <div className="mt-6 max-w-2xl rounded-2xl border border-red-200 bg-red-50 px-6 py-4 text-sm text-red-600">
              {erro}
            </div>
          )}
        </div>
      </section>

      {/* Content */}
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <UserInfoCard
                name={nameText}
                age={ageText}
                avatarUrl={avatarText}
                locationLoading={locationLoading}
                locationText={locationText}
                cepText={cepText}
                bairroText={bairro}
              />
              <BadgesSection />
              <CommunitiesSection />
            </div>

            {userId && (
              <div className="flex flex-col gap-6 lg:col-span-1">
                <ActiveCourses userId={userId} />
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
