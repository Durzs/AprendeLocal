import { useTranslation } from "react-i18next";
import MapaLugares from "../../biodiversidad/MapaLugares";

export default function MapExplorerSection() {
  const { t } = useTranslation();

  return (
    <section id="mapa" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-[-0.055em] text-[#111217] mb-3 leading-[0.95]">
            {t("home.map.title", "¿Qué vive en tu territorio?")}
          </h2>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            {t(
              "home.map.subtitle",
              "Elige un lugar del territorio y descubre qué especies se han registrado ahí, con ciencia ciudadana y nombres en Mapuzugun."
            )}
          </p>
        </div>

        <MapaLugares hideHeader={true} />
      </div>
    </section>
  );
}
