import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import { useEffect } from "react";
import L from "leaflet";
import type { POIFeature, School } from "../types";

import "leaflet/dist/leaflet.css";

const ARAUCANIA_CENTER: [number, number] = [-38.7, -71.5];
const INITIAL_ZOOM = 8;

const ICON_COLORS: Record<string, string> = {
  natural: "#10b981",
  geological: "#ef4444",
  hydrological: "#0284c7",
  cultural: "#8b5cf6",
};

function createIcon(type: string, isSelected = false) {
  const color = ICON_COLORS[type] || "#0a0047";
  const size = isSelected ? 34 : 26;
  const border = isSelected ? "3px solid #0a0047" : "2.5px solid white";

  return L.divIcon({
    className: "custom-marker",
    html: `<div style="
      background: ${color};
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      border: ${border};
      box-shadow: 0 3px 8px rgba(0,0,0,0.35);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 13px;
      font-weight: bold;
      transition: all 0.2s ease;
    ">📍</div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

const schoolIcon = L.divIcon({
  className: "school-marker",
  html: `<div style="
    background: #f59e0b;
    width: 34px;
    height: 34px;
    border-radius: 50%;
    border: 3px solid white;
    box-shadow: 0 2px 8px rgba(0,0,0,0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
  ">🏫</div>`,
  iconSize: [34, 34],
  iconAnchor: [17, 17],
});

interface Props {
  points: POIFeature[];
  onSelectPoint: (point: POIFeature) => void;
  selectedId: string | null;
  center?: [number, number];    // [lon, lat]
  schoolMarker?: School;
}

function InvalidateSize() {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 150);
    return () => clearTimeout(timer);
  }, [map]);
  return null;
}

export default function MapView({
  points,
  onSelectPoint,
  selectedId,
  center,
  schoolMarker,
}: Props) {
  const mapCenter: [number, number] = center
    ? [center[1], center[0]] // [lat, lon]
    : ARAUCANIA_CENTER;

  const zoom = center ? 10 : INITIAL_ZOOM;

  return (
    <div className="relative w-full h-full min-h-[480px]">
      <MapContainer
        center={mapCenter}
        zoom={zoom}
        style={{ height: "100%", width: "100%", minHeight: "480px" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <InvalidateSize />

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

        {/* Puntos territoriales */}
        {points.map((poi) => {
          const [lon, lat] = poi.geometry.coordinates;
          const isSelected = selectedId === String(poi.properties.id);

          return (
            <Marker
              key={poi.properties.id}
              position={[lat, lon]}
              icon={createIcon(poi.properties.type, isSelected)}
              zIndexOffset={isSelected ? 500 : 100}
              eventHandlers={{
                click: () => onSelectPoint(poi),
              }}
            >
              <Popup>
                <div className="p-1">
                  <strong className="text-sm font-bold text-slate-900 block">{poi.properties.name}</strong>
                  <span className="text-xs text-slate-600">📍 {poi.properties.commune}</span>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {selectedId && <FlyToSelected points={points} selectedId={selectedId} />}
        {center && <RecenterMap center={center} />}
      </MapContainer>
    </div>
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
  const point = points.find((p) => String(p.properties.id) === selectedId);
  if (point) {
    const [lon, lat] = point.geometry.coordinates;
    map.flyTo([lat, lon], 11, { duration: 1 });
  }
  return null;
}

function RecenterMap({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView([center[1], center[0]], 10, { animate: true });
  }, [center[0], center[1]]);
  return null;
}
