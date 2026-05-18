import { useState, useEffect } from "react";
import MapView from "./components/MapView";
import PointPanel from "./components/PointPanel";
import { fetchPoints } from "./api";
import type { POIFeature } from "./types";
import "./App.css";

export default function App() {
  const [points, setPoints] = useState<POIFeature[]>([]);
  const [selected, setSelected] = useState<POIFeature | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPoints()
      .then((data) => {
        setPoints(data.features);
        setLoading(false);
      })
      .catch((err) => {
        setError("No se pudo conectar con la API");
        setLoading(false);
        console.error(err);
      });
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <h1>AprendeLocal</h1>
        <span className="app-subtitle">Araucania</span>
      </header>

      <div className="app-content">
        <div className={`map-container ${selected ? "with-panel" : ""}`}>
          {loading ? (
            <div className="loading">Cargando mapa...</div>
          ) : error ? (
            <div className="error">{error}</div>
          ) : (
            <MapView
              points={points}
              onSelectPoint={setSelected}
              selectedId={selected?.properties.id || null}
            />
          )}
        </div>

        <PointPanel point={selected} onClose={() => setSelected(null)} />
      </div>

      <div className="app-footer">
        <span>
          {points.length} puntos de interes ·{" "}
          {new Set(points.map((p) => p.properties.commune)).size} comunas
        </span>
      </div>
    </div>
  );
}
