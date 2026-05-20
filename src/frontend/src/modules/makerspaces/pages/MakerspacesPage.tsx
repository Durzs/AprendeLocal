import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

import { pickLang } from "../utils";
import type { Makerspace, Particle } from "../types";

export default function MakerspacesPage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.resolvedLanguage || "pt";

  const [activeTab, setActiveTab] = useState("locais");

  const makerspaces = useMemo<Makerspace[]>(
    () => [
      {
        id: 1,
        name: {
          pt: "Centro de Inovação – Inova USP",
          en: "Innovation Center – Inova USP",
          es: "Centro de Innovación – Inova USP",
        },
        rating: 4.7,
        description: {
          pt: "Espaço de inovação e fabricação digital da Universidade de São Paulo com equipamentos como impressoras 3D, CNC e corte a laser para criação e prototipagem.",
          en: "Innovation and digital fabrication space at the University of São Paulo, with equipment such as 3D printers, CNC and laser cutting for creation and prototyping.",
          es: "Espacio de innovación y fabricación digital de la Universidad de São Paulo con equipos como impresoras 3D, CNC y corte láser para creación y prototipado.",
        },
        location: {
          pt: "Cidade Universitária – São Paulo, SP",
          en: "Cidade Universitária – São Paulo, SP",
          es: "Cidade Universitária – São Paulo, SP",
        },
        hours: {
          pt: "Seg–Sex: 08h–22h (aproximado, sujeito a confirmação)",
          en: "Mon–Fri: 08:00–22:00 (approx., subject to confirmation)",
          es: "Lun–Vie: 08:00–22:00 (aprox., sujeto a confirmación)",
        },
        image: "https://images.unsplash.com/photo-1518770660439-4636190af475",
      },
      {
        id: 2,
        name: {
          pt: "Maker Space Rio",
          en: "Maker Space Rio",
          es: "Maker Space Rio",
        },
        rating: 4.6,
        description: {
          pt: "Centro de inovação com foco em robótica e IoT",
          en: "Innovation center focused on robotics and IoT",
          es: "Centro de innovación enfocado en robótica e IoT",
        },
        location: {
          pt: "Rio de Janeiro, RJ",
          en: "Rio de Janeiro, RJ",
          es: "Río de Janeiro, RJ",
        },
        hours: {
          pt: "Ter–Sáb: 10h–19h",
          en: "Tue–Sat: 10:00–19:00",
          es: "Mar–Sáb: 10:00–19:00",
        },
        image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45",
      },
    ],
    []
  );

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
        <motion.div
          initial={{ y: -25, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.45 }}
          className="mb-6"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow mb-2">
            {t("makerspaces.title")}
          </h1>
          <p className="text-white/80 max-w-2xl">{t("makerspaces.subtitle")}</p>
        </motion.div>

        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setActiveTab("locais")}
            className={`px-4 py-2 rounded-full font-medium transition ${
              activeTab === "locais"
                ? "bg-white/80 text-slate-900 shadow backdrop-blur"
                : "bg-white/30 text-white hover:bg-white/40 backdrop-blur"
            }`}
          >
            {t("makerspaces.tabs.locals")}
          </button>
        </div>

        {activeTab === "locais" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-10"
          >
            {makerspaces.map((space) => (
              <div
                key={space.id}
                className="rounded-2xl overflow-hidden bg-white/85 backdrop-blur border border-white/40 shadow hover:shadow-lg transition"
              >
                <img
                  src={space.image}
                  alt={pickLang(space.name, lang)}
                  className="h-48 w-full object-cover"
                />

                <div className="p-5 space-y-3">
                  <div className="flex justify-between items-start gap-4">
                    <h3 className="font-semibold text-lg text-slate-900">
                      {pickLang(space.name, lang)}
                    </h3>
                    <span className="text-sm bg-green-100 text-green-700 px-2 py-1 rounded-full whitespace-nowrap">
                      ⭐ {space.rating}
                    </span>
                  </div>

                  <p className="text-slate-700 text-sm">
                    {pickLang(space.description, lang)}
                  </p>

                  <div className="text-sm text-slate-600 space-y-1">
                    <div>📍 {pickLang(space.location, lang)}</div>
                    <div>🕒 {pickLang(space.hours, lang)}</div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {activeTab === "mapa" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35 }}
            className="w-full h-96 rounded-2xl bg-white/60 backdrop-blur border border-white/40 flex items-center justify-center shadow"
          >
            <p className="text-slate-800">{t("makerspaces.map.placeholder")}</p>
          </motion.div>
        )}

        <motion.div
          initial={{ y: 25, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.45 }}
          className="mt-10 rounded-3xl bg-white/35 backdrop-blur border border-white/40 p-8 md:p-10 shadow"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white drop-shadow mb-3 text-center">
            {t("makerspaces.cta.title")}
          </h2>

          <p className="max-w-2xl mx-auto mb-6 text-lg text-white/85 text-center">
            {t("makerspaces.cta.subtitle")}
          </p>

          <div className="flex justify-center" />
        </motion.div>
      </div>

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