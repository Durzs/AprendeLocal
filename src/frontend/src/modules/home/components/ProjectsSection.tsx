import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { RUTAS, cursoCorto } from "../../sequences/rutas/catalogo";

/**
 * Las rutas, en la portada.
 *
 * Antes esta sección listaba cuatro proyectos escritos a mano aquí mismo
 * —sensores de turbidez, huertos con Arduino, estación meteorológica— bajo el
 * título «experiencias listas para llevar a cabo». No existían en ninguna
 * parte de la aplicación, y pedían material que una escuela rural no tiene.
 *
 * Ahora lee del mismo catálogo que sirve `/rutas`. Eso arregla dos cosas a la
 * vez: lo que la portada promete es exactamente lo que el docente encuentra al
 * entrar, y cuando una ruta cambie no habrá que acordarse de venir a cambiarla
 * aquí también.
 *
 * Lo primero de cada tarjeta es la pregunta que sostiene la ruta, no su
 * título: es lo que decide si a un docente le interesa, y es lo que va a
 * repetir durante tres semanas.
 */

/** Un color por ruta, para que las cuatro se distingan de un vistazo. */
const COLORES: Record<string, { etiqueta: string; curso: string }> = {
  agua: { etiqueta: "bg-blue-100 text-blue-900", curso: "text-blue-700 bg-blue-50" },
  redes: { etiqueta: "bg-emerald-100 text-emerald-900", curso: "text-emerald-700 bg-emerald-50" },
  suelo: { etiqueta: "bg-orange-100 text-orange-950", curso: "text-orange-800 bg-orange-50" },
  calor: { etiqueta: "bg-indigo-100 text-indigo-900", curso: "text-indigo-800 bg-indigo-50" },
};

/** Una ruta nueva sin color asignado se ve igual de bien, solo que en gris. */
const POR_DEFECTO = { etiqueta: "bg-slate-100 text-slate-900", curso: "text-slate-700 bg-slate-50" };

export default function ProjectsSection() {
  const { t } = useTranslation();
  const [selectedCountry, setSelectedCountry] = useState<"chile" | "brasil">("chile");

  return (
    <section id="proyectos" className="py-20 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-900 bg-blue-100 px-3.5 py-1 rounded-full border border-blue-200">
            {t("home.projects.badge", "Banco de Rutas de Aprendizaje")}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-[-0.055em] text-[#111217] mt-3 mb-3 leading-[0.95]">
            {t("home.projects.title", "Rutas diseñadas para docentes y escuelas")}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            {t(
              "home.projects.subtitle",
              "Clases ya escritas, con los objetivos del programa y una salida a terreno. Se ajustan a tu escuela y se imprimen:"
            )}
          </p>

          {/* Country Selector */}
          <div className="inline-flex p-1.5 bg-[#f8fafc] rounded-full border border-slate-200 shadow-sm mt-6 gap-2">
            <button
              onClick={() => setSelectedCountry("chile")}
              aria-pressed={selectedCountry === "chile"}
              className={[
                "flex items-center gap-2 px-6 py-2 rounded-full font-bold text-sm transition cursor-pointer",
                selectedCountry === "chile"
                  ? "bg-[#0a0047] text-white shadow-md shadow-[#0a0047]/25"
                  : "text-slate-600 hover:text-slate-900",
              ].join(" ")}
            >
              <span className="text-base" aria-hidden>🇨🇱</span>
              <span>{t("home.projects.chileTab", "Chile (La Araucanía & Sur)")}</span>
            </button>
            <button
              onClick={() => setSelectedCountry("brasil")}
              aria-pressed={selectedCountry === "brasil"}
              className={[
                "flex items-center gap-2 px-5 py-2 rounded-full font-semibold text-sm transition cursor-pointer",
                selectedCountry === "brasil"
                  ? "bg-[#f97316] text-white shadow-md shadow-orange-500/20"
                  : "text-slate-400 hover:text-slate-600",
              ].join(" ")}
            >
              <span className="text-base" aria-hidden>🇧🇷</span>
              <span>{t("home.projects.brasilTab", "Brasil (Próximamente)")}</span>
            </button>
          </div>
        </div>

        {selectedCountry === "chile" ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {RUTAS.map((ruta) => {
                const color = COLORES[ruta.id] ?? POR_DEFECTO;
                const cursos = ruta.cubre.map((c) => cursoCorto(c.nivel));
                const totalOA = ruta.cubre.reduce((n, c) => n + c.codigos.length, 0);

                return (
                  <Link
                    key={ruta.id}
                    to="/rutas"
                    className="group bg-white rounded-3xl border border-slate-200 p-7 shadow-sm transition hover:-translate-y-1 hover:border-slate-300 hover:shadow-md flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-3 mb-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${color.etiqueta}`}>
                          {ruta.titulo}
                        </span>
                        <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">
                          {t("rutas.weeks", { count: ruta.semanas })}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-slate-900 mb-2 leading-snug">
                        {ruta.preguntaGuia}
                      </h3>
                      <p className="text-sm text-slate-600 leading-relaxed mb-4">
                        {ruta.gancho}
                      </p>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        <span className="font-semibold text-slate-700">
                          {t("rutas.deliverTo", "Se lo entregan a:")}
                        </span>{" "}
                        {ruta.producto.paraQuien}
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-4 mt-4 text-xs font-semibold text-slate-600">
                      <span>{t("rutas.objectives", { count: totalOA })}</span>
                      <span className="flex flex-wrap justify-end gap-1">
                        {cursos.map((c) => (
                          <span key={c} className={`px-2.5 py-1 rounded-md ${color.curso}`}>
                            {c}
                          </span>
                        ))}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>

            <div className="text-center mt-10">
              <Link
                to="/rutas"
                className="group inline-flex items-center gap-2 rounded-xl bg-[#0a0047] px-7 py-3 text-sm font-bold text-white shadow-md shadow-[#0a0047]/20 transition hover:bg-[#140066]"
              >
                {t("home.projects.cta", "Ver las cuatro rutas completas")}
                <span aria-hidden className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-16 bg-[#f8fafc] rounded-3xl border border-dashed border-slate-300 p-8">
            <span className="text-4xl mb-3 block" aria-hidden>🇧🇷</span>
            <h4 className="text-xl font-bold text-slate-800 mb-2">
              {t("home.projects.brasilTitle", "Rutas para Brasil en desarrollo")}
            </h4>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              {t(
                "home.projects.brasilBody",
                "Estamos adaptando las rutas de ciencia y monitoreo territorial para los biomas y escuelas de Brasil junto a redes de educadores locales."
              )}
            </p>
          </div>
        )}

      </div>
    </section>
  );
}
