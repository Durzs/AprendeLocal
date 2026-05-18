import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import type { POIFeature } from "../types";

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

interface Props {
  points: POIFeature[];
  onSelectPoint: (point: POIFeature) => void;
  selectedId: string | null;
}

export default function MapView({ points, onSelectPoint, selectedId }: Props) {
  return (
    <MapContainer
      center={ARAUCANIA_CENTER}
      zoom={INITIAL_ZOOM}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
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
