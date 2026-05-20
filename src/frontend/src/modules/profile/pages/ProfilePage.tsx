import React, { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { supabase } from "../../../shared/lib/supabaseClient";
import { UserInfoCard } from "../components/UserInfoCard";
import { BadgesSection } from "../components/BadgesSection";
import { CommunitiesSection } from "../components/CommunitiesSection";
import { ActiveCourses } from "../components/ActiveCourses";
import { pickLang, limparCep, formatarCep } from "../utils";
import type { CepLookupResult, Particle, ProfileData } from "../types";





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
            if (cepLimpo.length !== 8) {
                return { ok: false, error: msg.profile.cepInvalid, data: null };
            }

            const cacheKey = `cep:${cepLimpo}`;
            const cached = localStorage.getItem(cacheKey);
            if (cached) {
                try {
                    return { ok: true, error: null, data: JSON.parse(cached) };
                } catch {
                    localStorage.removeItem(cacheKey);
                }
            }

            const res = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
            if (!res.ok) {
                return { ok: false, error: msg.profile.cepFetchFail, data: null };
            }

            const json = await res.json();
            if (json?.erro) {
                return { ok: false, error: msg.profile.cepNotFound, data: null };
            }

            const data = {
                cidade: json.localidade || "",
                uf: json.uf || "",
                bairro: json.bairro || "",
            };

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

            if (userErr || !user) {
                navigate("/entrar");
                return;
            }

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
                setProfile({
                    name: nomeMeta || user.email || msg.profile.userFallback,
                    age: null,
                    avatarUrl: avatarMeta || "",
                    cep: "",
                });
                setLoading(false);
                return;
            }

            if (!prof) {
                await supabase.from("profiles").insert([
                    {
                        id: user.id,
                        nome: nomeMeta || (user.email ?? msg.profile.userFallback),
                        avatar_url: avatarMeta || null,
                        cep: null,
                    },
                ]);

                setProfile({
                    name: nomeMeta || user.email || msg.profile.userFallback,
                    age: null,
                    avatarUrl: avatarMeta || "",
                    cep: "",
                });

                setLoading(false);
                return;
            }

            setProfile({
                name: prof.nome || user.email || msg.profile.userFallback,
                age: prof.idade ?? null,
                avatarUrl: prof.avatar_url || "",
                cep: prof.cep || "",
            });

            setLoading(false);
        }

        loadPerfil();

        return () => {
            isMounted = false;
        };
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
                } else {
                    setLocationText("");
                    setBairro("");
                }
            } catch {
                if (!alive) return;
                setLocationText("");
                setBairro("");
            } finally {
                if (!alive) return;
                setLocationLoading(false);
            }
        }

        loadLocalizacao();

        return () => {
            alive = false;
        };
    }, [profile.cep, lang, buscarCidadeUFPorCep]);

    // ✅ IGUAL ao Makerspaces: partículas estáveis
    const particles = useMemo<Particle[]>(() => {
        return [...Array(20)].map(() => ({
            x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1200),
            y: Math.random() * (typeof window !== "undefined" ? window.innerHeight : 800),
            scale: Math.random() * 0.5 + 0.5,
            dy: Math.random() * -100 - 50,
            dx: Math.random() * 100 - 50,
            duration: Math.random() * 10 + 10,
        }));
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-600 to-blue-300 relative overflow-hidden">
                <div className="max-w-6xl mx-auto px-4 md:px-6 py-8">
                    <p className="text-white/85">{msg.profile.loading}</p>
                </div>

                {/* partículas no fundo (igual ao padrão) */}
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

    const nameText = pickLang(profile.name, lang) || msg.profile.userFallback;
    const avatarText = pickLang(profile.avatarUrl, lang) || "";
    const cepTextRaw = pickLang(profile.cep, lang) || "";
    const cepText = formatarCep(cepTextRaw) || msg.profile.notInformed;
    const ageText = profile.age ?? msg.profile.notInformed;

    return (
        <div
            className="
        min-h-screen
        bg-gradient-to-br
        from-blue-950 via-blue-600 to-blue-300
        dark:from-blue-950 dark:via-blue-600 dark:to-blue-300
        relative overflow-hidden
      "
        >
            <div className="max-w-6xl mx-auto px-4 md:px-6 py-8">
                {/* ✅ HEADER IGUAL ao Makerspaces */}
                <motion.div
                    initial={{ y: -25, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.45 }}
                    className="mb-6"
                >
                    <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow mb-2">
                        {msg.profile.title}
                    </h1>
                    <p className="text-white/80 max-w-2xl">
                        {msg.profile.subtitle}
                    </p>

                    {erro ? (
                        <div className="mt-4 max-w-2xl p-3 rounded bg-red-50 text-red-700 border border-red-200">
                            {erro}
                        </div>
                    ) : null}
                </motion.div>

                {/* ✅ CONTEÚDO em grid (mantém tua estrutura, só encaixado no padrão visual) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-10">
                    <div className="lg:col-span-2 space-y-6">
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
                        <div className="lg:col-span-1 flex flex-col gap-6">
                            <ActiveCourses userId={userId} />
                        </div>
                    )}
                </div>
            </div>

            {/* ✅ IGUAL ao Makerspaces: partículas no fundo */}
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