import { useState, useEffect } from "react";
import MapView from "./MapView";
import PointPanel from "./PointPanel";
import type { School, NearbyPOI, POIFeature } from "../types";
import { fetchNearbyPOIs } from "../api";

interface Props {
  school: School;
  onChangeSchool: () => void;
}

export default function SchoolDashboard({ school, onChangeSchool }: Props) {
  const [pois, setPois] = useState<NearbyPOI[]>([]);
  const [radius, setRadius] = useState(20);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<POIFeature | null>(null);

  useEffect(() => {
    setLoading(true);
    setSelected(null);
    fetchNearbyPOIs(school.id, radius)
      .then((data) => setPois(data.pois))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [school.id, radius]);

  // Convertir NearbyPOI[] a POIFeature[] para el MapView
  const poiFeatures: POIFeature[] = pois.map((poi) => ({
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: poi.coordinates,
    },
    properties: {
      id: poi.id,
      name: poi.name,
      type: poi.type,
      ecosystem: poi.ecosystem,
      commune: poi.commune,
      description: poi.description,
      stem_areas: poi.stem_areas,
      heritage_type: poi.heritage_type,
      threats: poi.threats,
    },
  }));

  return (
    <div className="school-dashboard">
      {/* Barra superior con info de la escuela */}
      <div className="dashboard-topbar">
        <div className="dashboard-school-info">
          <span className="dashboard-school-icon">🏫</span>
          <div>
            <h2>{school.name}</h2>
            <span className="dashboard-school-commune">{school.commune}</span>
          </div>
        </div>

        <div className="dashboard-controls">
          <label className="radius-control">
            <span className="radius-label">Radio:</span>
            <input
              type="range"
              min={5}
              max={50}
              step={5}
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
              className="radius-slider"
            />
            <span className="radius-value">{radius} km</span>
          </label>
          <button className="btn-change-school" onClick={onChangeSchool}>
            Cambiar escuela
          </button>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="dashboard-content">
        <div className={`map-container ${selected ? "with-panel" : ""}`}>
          {loading ? (
            <div className="loading">Buscando recursos cercanos...</div>
          ) : (
            <MapView
              points={poiFeatures}
              onSelectPoint={setSelected}
              selectedId={selected?.properties.id || null}
              center={school.coordinates}
              schoolMarker={school}
            />
          )}
        </div>

        <PointPanel
          point={selected}
          onClose={() => setSelected(null)}
        />
      </div>

      {/* Footer con stats */}
      <div className="dashboard-footer">
        <span>
          {pois.length} recursos educativos en {radius} km · {school.commune}
        </span>
        {pois.length > 0 && (
          <span className="dashboard-nearest">
            Más cercano: {pois[0]?.name} ({pois[0]?.distance_km} km)
          </span>
        )}
      </div>
    </div>
  );
}
