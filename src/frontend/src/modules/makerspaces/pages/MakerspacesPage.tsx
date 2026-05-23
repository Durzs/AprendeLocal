import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { MapPin, Clock, Star } from "lucide-react";

import { pickLang } from "../utils";
import type { Makerspace } from "../types";

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

  return (
    <main className="min-h-screen bg-white text-[#111217]">
      {/* Header */}
      <section className="bg-[#f7f8fb] pb-12 pt-28 md:pt-32">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-semibold tracking-[-0.04em] text-[#111217] sm:text-4xl md:text-5xl">
            {t("makerspaces.title")}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-500">
            {t("makerspaces.subtitle")}
          </p>

          {/* Tabs */}
          <div className="mt-8 flex gap-2">
            <button
              onClick={() => setActiveTab("locais")}
              className={[
                "rounded-full px-5 py-2.5 text-sm font-semibold transition",
                activeTab === "locais"
                  ? "bg-[#111217] text-white shadow-sm"
                  : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
              ].join(" ")}
            >
              {t("makerspaces.tabs.locals")}
            </button>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {activeTab === "locais" && (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {makerspaces.map((space) => (
                <article
                  key={space.id}
                  className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-950/10"
                >
                  <img
                    src={space.image}
                    alt={pickLang(space.name, lang)}
                    className="h-48 w-full object-cover"
                  />

                  <div className="p-6 space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="text-lg font-semibold text-slate-950">
                        {pickLang(space.name, lang)}
                      </h3>
                      <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 whitespace-nowrap">
                        <Star className="h-3 w-3" />
                        {space.rating}
                      </span>
                    </div>

                    <p className="text-sm leading-relaxed text-slate-600">
                      {pickLang(space.description, lang)}
                    </p>

                    <div className="space-y-1.5 text-sm text-slate-500">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5" />
                        {pickLang(space.location, lang)}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-3.5 w-3.5" />
                        {pickLang(space.hours, lang)}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {activeTab === "mapa" && (
            <div className="flex h-96 items-center justify-center rounded-[2rem] border border-slate-200 bg-slate-50">
              <p className="text-slate-500">{t("makerspaces.map.placeholder")}</p>
            </div>
          )}

          {/* CTA */}
          <div className="mt-16 rounded-[2rem] border border-slate-200 bg-[#111217] p-8 text-center shadow-sm md:p-12">
            <h2 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">
              {t("makerspaces.cta.title")}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-slate-400">
              {t("makerspaces.cta.subtitle")}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
