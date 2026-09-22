import { useEffect, useState } from "react";
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { aQueDistancia, metrosEntre, type Coordenada, type Lugar } from "./lugar";
import { useTx } from "../../../shared/tx";

/**
 * El mapa de verdad.
 *
 * POR QUÉ NO BASTABA CON LA LISTA
 *
 * Antes esto era una lista de sitios con su distancia, y la única manera de
 * centrarla era dar permiso de ubicación. En una entrevista de validación eso
 * falló en directo: la profesora quiso buscar su colegio, no la dejó, y su
 * conclusión fue que debería ser más como un mapa, uno donde se puedan buscar
 * ubicaciones, porque al decir «usar la ubicación de la escuela» no se abre una
 * barra para buscarla sino que se pide la posición exacta del que está mirando.
 *
 * Y el que está mirando casi nunca está en la escuela. Se planifica en la casa,
 * un domingo por la noche, a treinta kilómetros. Pedir el GPS en ese momento
 * devuelve el living.
 *
 * QUÉ RESUELVE VERLO
 *
 * Una lista dice «Estero Trailelfu, 12 min caminando». El mapa dice de qué lado
 * queda, si hay que cruzar la carretera y si el camino rodea el cerro. Eso es
 * justo lo que decide si un curso de veinte puede ir, y no está en ninguna
 * lista.
 *
 * Además se puede tocar cualquier punto, tenga nombre o no. La mitad de los
 * sitios a los que va una escuela rural no están cargados en ningún mapa: el
 * vertedero de la curva, el pozo del vecino, la parte del estero donde se puede
 * bajar. Se toca, se le pregunta al mapa cómo se llama eso, y si no tiene
 * nombre se le pone el que usa la gente de ahí.
 *
 * LOS MOSAICOS
 *
 * De OpenStreetMap, que es gratis y no pide clave, y a cambio pide que se le
 * atribuya, cosa que se hace abajo a la derecha. Si no cargan, que en una
 * escuela rural pasa, queda el cuadro vacío y todo lo demás sigue funcionando:
 * la lista, la búsqueda por nombre y el campo escrito a mano.
 */

/**
 * Los puntos, dibujados a mano.
 *
 * Leaflet trae sus propios iconos como imágenes y con un empaquetador moderno
 * las rutas se rompen, que es el error más viejo de esta biblioteca. Un círculo
 * en HTML no se rompe, pesa menos y se puede pintar con los colores de la
 * aplicación, incluido el modo claro.
 */
function punto(elegido: boolean): L.DivIcon {
  const color = elegido ? "var(--tierra-600)" : "var(--crema-clara)";
  const borde = elegido ? "var(--tierra-300)" : "var(--fondo)";
  const lado = elegido ? 22 : 16;
  return L.divIcon({
    className: "",
    html: `<span style="
      display:block;width:${lado}px;height:${lado}px;border-radius:9999px;
      background:${color};border:3px solid ${borde};
      box-shadow:0 1px 6px rgba(0,0,0,.45)"></span>`,
    iconSize: [lado, lado],
    iconAnchor: [lado / 2, lado / 2],
  });
}

/** Mueve el mapa cuando cambia el centro, sin volver a montarlo. */
function Centrar({ centro }: { centro: Coordenada }) {
  const mapa = useMap();
  useEffect(() => {
    mapa.setView([centro.lat, centro.lng], mapa.getZoom(), { animate: true });
  }, [centro.lat, centro.lng, mapa]);
  return null;
}

/** Escucha los toques en cualquier parte del mapa. */
function Toques({ onTocar }: { onTocar: (c: Coordenada) => void }) {
  useMapEvents({
    click: (ev) => onTocar({ lat: ev.latlng.lat, lng: ev.latlng.lng }),
  });
  return null;
}

export function Mapa({
  centro,
  lugares,
  elegido,
  onElegirLugar,
  onTocarPunto,
  buscando,
}: {
  centro: Coordenada;
  lugares: Lugar[];
  /** El nombre del sitio ya elegido, para pintarlo distinto. */
  elegido: string;
  onElegirLugar: (l: Lugar) => void;
  onTocarPunto: (c: Coordenada) => void;
  /** Mientras se le pregunta al mapa cómo se llama el punto tocado. */
  buscando: boolean;
}) {
  const [tocado, ponerTocado] = useState<Coordenada | null>(null);
  const tx = useTx();

  return (
    <div className="mt-4">
      <div className="relative h-80 overflow-hidden rounded-xl border border-[var(--crema)]/18 sm:h-96">
        <MapContainer
          center={[centro.lat, centro.lng]}
          zoom={14}
          scrollWheelZoom={false}
          className="h-full w-full"
        >
          <TileLayer
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            maxZoom={19}
          />
          <Centrar centro={centro} />
          <Toques
            onTocar={(c) => {
              ponerTocado(c);
              onTocarPunto(c);
            }}
          />

          {lugares.map((l) => (
            <Marker
              key={`${l.nombre}-${l.lat}`}
              position={[l.lat, l.lng]}
              icon={punto(elegido === l.nombre)}
              eventHandlers={{ click: () => onElegirLugar(l) }}
              title={`${l.nombre} · ${aQueDistancia(metrosEntre(centro, l), tx.idioma)}`}
            />
          ))}

          {tocado && (
            <Marker position={[tocado.lat, tocado.lng]} icon={punto(true)} />
          )}
        </MapContainer>

        {buscando && (
          <p className="absolute left-3 top-3 z-[1000] rounded-full bg-[var(--fondo)]/90 px-3.5 py-1.5 text-sm text-[var(--crema-clara)]">
            {tx("Viendo qué hay ahí…", "Vendo o que há ali…")}
          </p>
        )}
      </div>

      <p className="mt-2 text-sm leading-relaxed text-[var(--crema)]/70">
        {tx(
          "Los puntos son los sitios que el mapa tiene con nombre. Si el lugar al que iría el curso no está, tócalo igual: se toma esa coordenada y el nombre lo pones tú abajo.",
          "Os pontos são os lugares que o mapa tem com nome. Se o lugar aonde a turma iria não está, toque nele assim mesmo: a coordenada fica marcada e o nome você escreve abaixo."
        )}
      </p>
    </div>
  );
}
