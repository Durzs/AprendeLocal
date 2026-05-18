import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import { useEffect } from "react";
import L from "leaflet";
import type { POIFeature, School } from "../types";

import "leaflet/dist/leaflet.css";

const ARAUCANIA_CENTER: [number, number] = [-38.7, -71.5];
const INITIAL_ZOOM = 9;

const ICON_COLORS: Record<string, string> = {
  natural: "#22c55e",
  geological: "#ef4444",
  hydrological: "#3b82f6",
  cultural: "#a855f7",
};

function createIcon(type: string) {
  const color = ICON_COLORS[type] || "#6b7280";
  return L.divIcon({
    className: "custom-marker",
    html: `<div style="
      background: ${color};
      width: 28px;
      height: 28px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
    "></div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
}

const schoolIcon = L.divIcon({
  className: "school-marker",
  html: `<div style="
    background: #f59e0b;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: 3px solid white;
    box-shadow: 0 2px 8px rgba(0,0,0,0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
  ">🏫</div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 18],
});

interface Props {
  points: POIFeature[];
  onSelectPoint: (point: POIFeature) => void;
  selectedId: string | null;
  center?: [number, number];    // [lon, lat] de la escuela
  schoolMarker?: School;        // Para mostrar la escuela en el mapa
}

export default function MapView({
  points,
  onSelectPoint,
  selectedId,
  center,
  schoolMarker,
}: Props) {
  // Centro del mapa: si hay escuela, usar sus coordenadas
  const mapCenter: [number, number] = center
    ? [center[1], center[0]] // [lat, lon]
    : ARAUCANIA_CENTER;

  const zoom = center ? 11 : INITIAL_ZOOM;

  return (
    <MapContainer
      center={mapCenter}
      zoom={zoom}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Marcador de la escuela */}
      {schoolMarker && (
        <>
          <Marker
            position={[schoolMarker.coordinates[1], schoolMarker.coordinates[0]]}
            icon={schoolIcon}
            zIndexOffset={1000}
          >
            <Popup>
              <strong>🏫 {schoolMarker.name}</strong>
              <br />
              {schoolMarker.commune}
              {schoolMarker.student_count && (
                <>
                  <br />
                  {schoolMarker.student_count} estudiantes
                </>
              )}
            </Popup>
          </Marker>
          {/* Círculo de radio de búsqueda */}
          <Circle
            center={[schoolMarker.coordinates[1], schoolMarker.coordinates[0]]}
            radius={20000}
            pathOptions={{
              color: "#f59e0b",
              fillColor: "#f59e0b",
              fillOpacity: 0.05,
              weight: 1,
              dashArray: "6 4",
            }}
          />
        </>
      )}

      {/* POIs */}
      {points.map((poi) => {
        const [lon, lat] = poi.geometry.coordinates;
        return (
          <Marker
            key={poi.properties.id}
            position={[lat, lon]}
            icon={createIcon(poi.properties.type)}
            eventHandlers={{
              click: () => onSelectPoint(poi),
            }}
          >
            <Popup>
              <strong>{poi.properties.name}</strong>
              <br />
              {poi.properties.commune}
            </Popup>
          </Marker>
        );
      })}

      {selectedId && <FlyToSelected points={points} selectedId={selectedId} />}
      {center && <RecenterMap center={center} />}
    </MapContainer>
  );
}

function FlyToSelected({
  points,
  selectedId,
}: {
  points: POIFeature[];
  selectedId: string;
}) {
  const map = useMap();
  const point = points.find((p) => p.properties.id === selectedId);
  if (point) {
    const [lon, lat] = point.geometry.coordinates;
    map.flyTo([lat, lon], 12, { duration: 1 });
  }
  return null;
}

function RecenterMap({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView([center[1], center[0]], 11, { animate: true });
  }, [center[0], center[1]]);
  return null;
}
