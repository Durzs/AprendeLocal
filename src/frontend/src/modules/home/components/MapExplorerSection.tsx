import MapaLugares from "../../biodiversidad/MapaLugares";

export default function MapExplorerSection() {
  return (
    <section id="mapa" className="py-20 px-3 sm:px-6 lg:px-10 bg-white border-b border-slate-100">
      <div className="max-w-[1400px] mx-auto w-full">
        <MapaLugares />
      </div>
    </section>
  );
}
