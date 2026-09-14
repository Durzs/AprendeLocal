import { useState } from "react";

import { Campo, Hoja, Texto } from "../crear/Campos";
import type { Entorno as EntornoExpedicion, Expedicion } from "../crear/expedicion";
import {
  EJEMPLO_ARAUCANIA,
  aQueDistancia,
  comunaDe,
  lugaresCerca,
  metrosEntre,
  ubicarse,
  type Coordenada,
  type Donde,
  type Lugar,
} from "./lugar";

/**
 * Dónde queda la escuela, resuelto solo.
 *
 * Antes esto eran dos campos: marcar un entorno de seis y escribir a mano cómo
 * se llama el lugar. El nombre lo tecleaba alguien que ya lo sabía, así que no
 * aportaba nada; y escrito a mano, «el estero» de una escuela y «el estero» de
 * la de al lado son cadenas distintas que el sistema no puede cruzar.
 *
 * Ahora se pide la coordenada al navegador, se pregunta a OpenStreetMap qué
 * hay alrededor, y el docente elige de una lista de sitios que existen. La
 * comuna y la región salen solas y ya no se preguntan.
 *
 * Hay un botón de ejemplo con un punto real de La Araucanía porque esto no se
 * puede mostrar sin permiso de ubicación, y quien evalúa la aplicación desde
 * una oficina necesita ver lo mismo que verá un profesor allá. No trae
 * resultados escritos: hace la consulta de verdad.
 */

const ETIQUETA_ENTORNO: Record<string, string> = {
  rio: "Río o estero",
  bosque: "Bosque",
  campo: "Campo o huerta",
  costa: "Costa o lago",
  cordillera: "Cerro o volcán",
  pueblo: "Pueblo o camino",
};

type Estado = "quieto" | "buscando" | "listo" | "falla";

export function DondeQueda({
  e,
  onCambio,
  orden = 4,
}: {
  e: Expedicion;
  onCambio: (e: Expedicion) => void;
  orden?: number;
}) {
  const [estado, ponerEstado] = useState<Estado>("quieto");
  const [motivo, ponerMotivo] = useState("");
  const [centro, ponerCentro] = useState<Coordenada | null>(null);
  const [donde, ponerDonde] = useState<Donde | null>(null);
  const [lugares, ponerLugares] = useState<Lugar[]>([]);

  async function buscar(desde: "aqui" | "ejemplo") {
    ponerEstado("buscando");
    ponerMotivo("");
    try {
      const c =
        desde === "ejemplo"
          ? { lat: EJEMPLO_ARAUCANIA.lat, lng: EJEMPLO_ARAUCANIA.lng }
          : await ubicarse();
      ponerCentro(c);

      // La comuna primero: es lo que se muestra aunque la lista de sitios
      // venga vacía, y es lo que dejó de preguntarse.
      const d = await comunaDe(c).catch(() => null);
      if (d) ponerDonde(d);

      const l = await lugaresCerca(c);
      const ordenados = l
        .map((x) => ({ x, m: metrosEntre(c, x) }))
        .sort((a, b) => a.m - b.m)
        .map(({ x }) => x);
      ponerLugares(ordenados);
      ponerEstado(ordenados.length || d ? "listo" : "falla");
      if (!ordenados.length && !d) ponerMotivo("nada_cerca");
    } catch (err) {
      ponerEstado("falla");
      ponerMotivo((err as Error).message || "sin_senal");
    }
  }

  function elegir(l: Lugar) {
    const mismo = e.ubicacion === l.nombre;
    onCambio({
      ...e,
      ubicacion: mismo ? "" : l.nombre,
      entorno: mismo ? e.entorno : (l.entorno as EntornoExpedicion),
    });
  }

  return (
    <Hoja titulo="Dónde queda la escuela" orden={orden}>
      <p className="mb-5 max-w-2xl text-[15px] leading-relaxed text-[var(--crema)]/82">
        Esto se resuelve solo. Con la ubicación se saca la comuna y qué hay
        alrededor, y tú eliges el sitio al que de verdad pueden ir caminando.
      </p>

      <div className="flex flex-wrap gap-2.5">
        <button
          type="button"
          onClick={() => buscar("aqui")}
          disabled={estado === "buscando"}
          className="min-h-11 rounded-full bg-[var(--tierra-600)] px-5 text-sm font-medium text-[#1e2a24] transition hover:brightness-110 disabled:opacity-50"
        >
          {estado === "buscando" ? "Buscando…" : "Usar la ubicación de la escuela"}
        </button>
        <button
          type="button"
          onClick={() => buscar("ejemplo")}
          disabled={estado === "buscando"}
          className="min-h-11 rounded-full border border-[var(--crema)]/25 px-5 text-sm text-[var(--crema-clara)] transition hover:bg-[var(--crema)]/10 disabled:opacity-50"
        >
          Ver un ejemplo de La Araucanía
        </button>
      </div>

      {estado === "falla" && <PorQueFallo motivo={motivo} />}

      {donde && (
        <p className="mt-5 text-[15px] leading-relaxed text-[var(--crema-clara)]">
          {[donde.localidad, donde.comuna, donde.region].filter(Boolean).join(" · ")}
          {centro && (
            <span className="ml-2 text-sm text-[var(--crema)]/70">
              {centro.lat.toFixed(4)}, {centro.lng.toFixed(4)}
            </span>
          )}
        </p>
      )}

      {lugares.length > 0 && centro && (
        <div className="mt-5">
          <p className="rotulo text-[var(--crema)]/75">
            Qué hay alrededor. Elige a cuál pueden ir
          </p>
          <ul className="mt-2.5 space-y-2">
            {lugares.map((l) => {
              const elegido = e.ubicacion === l.nombre;
              return (
                <li key={`${l.nombre}-${l.lat}`}>
                  <button
                    type="button"
                    onClick={() => elegir(l)}
                    aria-pressed={elegido}
                    className={`flex min-h-11 w-full flex-wrap items-baseline gap-x-3 gap-y-1 rounded-xl border px-4 py-3 text-left transition ${
                      elegido
                        ? "border-[var(--tierra-600)] bg-[var(--tierra-600)]/[0.1]"
                        : "border-[var(--crema)]/14 hover:border-[var(--crema)]/30"
                    }`}
                  >
                    <span
                      className={`text-base ${
                        elegido ? "text-[var(--tierra-300)]" : "text-[var(--crema-clara)]"
                      }`}
                    >
                      {l.nombre}
                    </span>
                    <span className="text-sm text-[var(--crema)]/70">
                      {ETIQUETA_ENTORNO[l.entorno]} · {aQueDistancia(metrosEntre(centro, l))}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
          <p className="mt-3 text-sm leading-relaxed text-[var(--crema)]/70">
            Los nombres salen de OpenStreetMap, así que son los que están en el
            mapa y no siempre los que usa la gente de ahí. Si en tu sector se
            llama de otro modo, cámbialo abajo: manda el nombre de la gente.
          </p>
        </div>
      )}

      {/* Escrito a mano, siempre. Es lo que queda cuando no hay señal, que en
          una escuela rural pasa seguido, y es lo que permite corregir el
          nombre del mapa por el del sector. */}
      <Campo
        etiqueta="Cómo se llama, si lo quieres escribir tú"
        ayuda="El nombre que usa la gente de ahí. Si ya elegiste uno arriba, aquí lo puedes corregir."
        ancho="entera"
      >
        <Texto
          value={e.ubicacion}
          onChange={(ev) => onCambio({ ...e, ubicacion: ev.target.value })}
          placeholder="El estero Trailelfu, detrás de la cancha"
        />
      </Campo>
    </Hoja>
  );
}

/**
 * Por qué no salió.
 *
 * Se distingue el permiso de la falta de señal porque se arreglan distinto:
 * uno se resuelve en el navegador y el otro esperando. Decir «no se pudo» para
 * los dos manda a alguien a reiniciar el módem cuando lo que pasa es que dijo
 * que no a una ventana.
 */
function PorQueFallo({ motivo }: { motivo: string }) {
  const texto: Record<string, string> = {
    sin_permiso:
      "El navegador no dio permiso para la ubicación. Se puede activar en el candado de la barra de direcciones, o escribir el lugar más abajo.",
    sin_soporte:
      "Este navegador no entrega la ubicación. Escribe el nombre del lugar más abajo: la ruta funciona igual.",
    sin_senal:
      "No se pudo llegar al mapa. Puede ser la señal: se vuelve a intentar más tarde, y mientras tanto el nombre se puede escribir a mano.",
    nada_cerca:
      "No hay sitios con nombre cargados en el mapa alrededor de esta escuela. Pasa en zonas donde el mapa está poco trabajado, y no quiere decir que no haya nada: escríbelo tú.",
  };
  return (
    <p className="mt-4 rounded-xl border border-[var(--tierra-300)]/35 bg-[var(--tierra-300)]/[0.07] px-4 py-3 text-[15px] leading-relaxed text-[var(--tierra-300)]">
      {texto[motivo] ?? texto.sin_senal}
    </p>
  );
}
