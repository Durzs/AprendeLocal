import { useState } from "react";

import { Hoja, Texto } from "../crear/Campos";
import type { Entorno as EntornoExpedicion, Expedicion } from "../crear/expedicion";
import {
  aQueDistancia,
  buscarSitio,
  comunaDe,
  lugaresCerca,
  metrosEntre,
  queHayEn,
  ubicarse,
  type Coordenada,
  type Donde,
  type Escuela,
  type Lugar,
} from "./lugar";
import { Mapa } from "./Mapa";
import { useContenido } from "../contenido";
import { useTx } from "../../../shared/tx";

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

const ETIQUETA_ENTORNO: Record<string, { es: string; pt: string }> = {
  rio: { es: "Río o estero", pt: "Rio, córrego ou canal" },
  bosque: { es: "Bosque", pt: "Mata ou parque" },
  campo: { es: "Campo o huerta", pt: "Horta ou terreno" },
  costa: { es: "Costa o lago", pt: "Praia ou lagoa" },
  cordillera: { es: "Cerro o volcán", pt: "Morro ou encosta" },
  pueblo: { es: "Pueblo o camino", pt: "Rua ou praça" },
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
  const [texto, ponerTexto] = useState("");
  const [escuelas, ponerEscuelas] = useState<Escuela[]>([]);
  const [buscandoEscuela, ponerBuscandoEscuela] = useState(false);
  const [motivo, ponerMotivo] = useState("");
  const [centro, ponerCentro] = useState<Coordenada | null>(null);
  const [donde, ponerDonde] = useState<Donde | null>(null);
  const [lugares, ponerLugares] = useState<Lugar[]>([]);
  const [nombrando, ponerNombrando] = useState(false);
  const tx = useTx();
  const { geo } = useContenido();

  /**
   * Buscar por nombre: la escuela, el pueblo o el sitio mismo.
   *
   * Va primero porque es lo único que se puede hacer desde la casa un domingo
   * por la noche, que es cuando se planifica de verdad. Y no se limita a
   * escuelas: en una entrevista se pidió poder buscar ubicaciones sin más, que
   * es lo que uno espera de un mapa.
   */
  async function buscarPorNombre() {
    if (texto.trim().length < 3) return;
    ponerBuscandoEscuela(true);
    ponerMotivo("");
    try {
      const r = await buscarSitio(texto, geo);
      ponerEscuelas(r);
      if (!r.length) ponerMotivo("nada_cerca");
    } catch {
      ponerMotivo("sin_senal");
    } finally {
      ponerBuscandoEscuela(false);
    }
  }

  async function buscar(desde: "aqui" | "ejemplo" | Coordenada) {
    ponerEstado("buscando");
    ponerMotivo("");
    try {
      const c =
        typeof desde !== "string"
          ? desde
          : desde === "ejemplo"
            ? { lat: geo.ejemplo.lat, lng: geo.ejemplo.lng }
            : await ubicarse();
      ponerCentro(c);

      // La comuna primero: es lo que se muestra aunque la lista de sitios
      // venga vacía, y es lo que dejó de preguntarse.
      const d = await comunaDe(c, geo).catch(() => null);
      if (d) ponerDonde(d);

      const l = await lugaresCerca(c, geo);
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

  /**
   * Tocar un punto del mapa que no es ninguno de los de la lista.
   *
   * La mitad de los sitios a los que va una escuela rural no están cargados en
   * ningún mapa. Se toma la coordenada, se le pregunta al mapa cómo se llama
   * eso, y si no tiene nombre el campo queda para que lo escriba quien sabe.
   */
  async function tocarPunto(c: Coordenada) {
    ponerNombrando(true);
    try {
      const nombre = await queHayEn(c, geo);
      if (nombre) onCambio({ ...e, ubicacion: nombre });
    } catch {
      /* Sin señal se queda la coordenada marcada y el nombre lo pone él. */
    } finally {
      ponerNombrando(false);
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
    <Hoja titulo={tx("Dónde queda la escuela", "Onde fica a escola")} orden={orden}>
      <p className="mb-4 max-w-2xl text-[15px] leading-relaxed text-[var(--crema)]/82">
        {tx(
          "Busca la escuela por su nombre y elige en el mapa a qué sitio puede ir el curso caminando.",
          "Busque a escola pelo nome e escolha no mapa a que lugar a turma pode ir a pé."
        )}
      </p>

      <div className="grid gap-2.5 sm:grid-cols-[1fr_auto]">
        <Texto
          value={texto}
          onChange={(ev) => ponerTexto(ev.target.value)}
          onKeyDown={(ev) => {
            if (ev.key === "Enter") {
              ev.preventDefault();
              void buscarPorNombre();
            }
          }}
          placeholder={tx("Escuela Antu Mawida, Curarrehue", "Escola Municipal, Tijuca")}
          aria-label={tx("Nombre de la escuela y comuna", "Nome da escola e bairro")}
        />
        <button
          type="button"
          onClick={() => void buscarPorNombre()}
          disabled={buscandoEscuela || texto.trim().length < 3}
          className="min-h-11 self-start rounded-full bg-[var(--acento)] px-5 text-sm font-medium text-white transition hover:brightness-110 disabled:opacity-50"
        >
          {buscandoEscuela ? tx("Buscando…", "Buscando…") : tx("Buscar", "Buscar")}
        </button>
      </div>

      {escuelas.length > 0 && (
        <ul className="mt-2.5 space-y-1.5">
          {escuelas.map((x) => (
            <li key={`${x.nombre}-${x.lat}`}>
              <button
                type="button"
                onClick={() => {
                  ponerEscuelas([]);
                  ponerTexto(x.nombre);
                  void buscar({ lat: x.lat, lng: x.lng });
                }}
                className="min-h-11 w-full rounded-lg border border-[var(--crema)]/14 px-3.5 py-2.5 text-left transition hover:border-[var(--crema)]/35"
              >
                <span className="block text-[15px] text-[var(--crema-clara)]">{x.nombre}</span>
                {x.donde && (
                  <span className="mt-0.5 block text-sm text-[var(--crema)]/70">{x.donde}</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Los dos atajos van en letra chica y no como botones grandes: el que
          planifica desde su casa no los necesita, y el que sí está en la
          escuela los encuentra igual. */}
      <p className="mt-2.5 text-sm text-[var(--crema)]/70">
        {estado === "buscando" ? tx("Buscando… ", "Buscando… ") : ""}
        <button
          type="button"
          onClick={() => buscar("aqui")}
          disabled={estado === "buscando"}
          className="underline decoration-[var(--crema)]/30 underline-offset-4 hover:text-[var(--crema-clara)] disabled:opacity-50"
        >
          {tx("Estoy en la escuela", "Estou na escola")}
        </button>
        {" · "}
        <button
          type="button"
          onClick={() => buscar("ejemplo")}
          disabled={estado === "buscando"}
          className="underline decoration-[var(--crema)]/30 underline-offset-4 hover:text-[var(--crema-clara)] disabled:opacity-50"
        >
          {tx("Ver un ejemplo de La Araucanía", "Ver um exemplo no Rio")}
        </button>
      </p>

      {estado === "falla" && <PorQueFallo motivo={motivo} />}

      {/* El mapa y los lugares, uno al lado del otro. Separados obligaban a
          subir y bajar para cruzar «cuál es» con «dónde queda», que son la
          misma pregunta. */}
      {centro && (
        <div className="mt-4 grid gap-4 lg:grid-cols-[1.3fr_1fr]">
          <div className="min-w-0">
            <Mapa
              centro={centro}
              lugares={lugares}
              elegido={e.ubicacion}
              onElegirLugar={elegir}
              onTocarPunto={(c) => void tocarPunto(c)}
              buscando={nombrando}
            />
          </div>

          <div className="min-w-0">
            {donde && (
              <p className="text-[15px] leading-snug text-[var(--crema-clara)]">
                {[donde.localidad, donde.comuna, donde.region]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            )}

            <p className="rotulo mt-3 text-[var(--crema)]/75">
              {lugares.length
                ? tx("Adónde pueden ir", "Aonde podem ir")
                : tx("Sin sitios con nombre cerca", "Sem lugares com nome por perto")}
            </p>

            <ul className="mt-2 space-y-1.5">
              {lugares.map((l) => {
                const elegidoEste = e.ubicacion === l.nombre;
                return (
                  <li key={`${l.nombre}-${l.lat}`}>
                    <button
                      type="button"
                      onClick={() => elegir(l)}
                      aria-pressed={elegidoEste}
                      className={`min-h-11 w-full rounded-lg border px-3.5 py-2.5 text-left transition ${
                        elegidoEste
                          ? "border-[var(--tierra-600)] bg-[var(--tierra-600)]/[0.1]"
                          : "border-[var(--crema)]/14 hover:border-[var(--crema)]/30"
                      }`}
                    >
                      <span
                        className={`block text-[15px] leading-snug ${
                          elegidoEste
                            ? "text-[var(--tierra-300)]"
                            : "text-[var(--crema-clara)]"
                        }`}
                      >
                        {l.nombre}
                      </span>
                      <span className="mt-0.5 block text-sm text-[var(--crema)]/70">
                        {tx.de(ETIQUETA_ENTORNO[l.entorno])} ·{" "}
                        {aQueDistancia(metrosEntre(centro, l), tx.idioma)}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>

            {/* Escrito a mano, siempre. Es lo que queda cuando no hay señal, y
                lo que permite cambiar el nombre del mapa por el del sector. */}
            <label className="mt-3 block">
              <span className="text-sm text-[var(--crema)]/75">
                {tx(
                  "O escríbelo tú, con el nombre que usa la gente de ahí",
                  "Ou escreva você, com o nome que o pessoal de lá usa"
                )}
              </span>
              <Texto
                value={e.ubicacion}
                onChange={(ev) => onCambio({ ...e, ubicacion: ev.target.value })}
                placeholder={tx(
                  "El estero Trailelfu, detrás de la cancha",
                  "O valão atrás da quadra, perto da ponte"
                )}
              />
            </label>
          </div>
        </div>
      )}

      {/* Sin centro todavía no hay mapa, pero el campo a mano tiene que estar:
          es lo único que funciona sin señal. */}
      {!centro && (
        <label className="mt-4 block max-w-xl">
          <span className="text-sm text-[var(--crema)]/75">
            {tx(
              "O escribe el lugar a mano, si no hay señal para el mapa",
              "Ou escreva o lugar à mão, se não houver sinal para o mapa"
            )}
          </span>
          <Texto
            value={e.ubicacion}
            onChange={(ev) => onCambio({ ...e, ubicacion: ev.target.value })}
            placeholder={tx(
              "El estero Trailelfu, detrás de la cancha",
              "O valão atrás da quadra, perto da ponte"
            )}
          />
        </label>
      )}
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
  const tx = useTx();
  const texto: Record<string, string> = tx(
    {
      sin_permiso:
        "El navegador no dio permiso para la ubicación. Se puede activar en el candado de la barra de direcciones, o escribir el lugar más abajo.",
      sin_soporte:
        "Este navegador no entrega la ubicación. Escribe el nombre del lugar más abajo: la ruta funciona igual.",
      sin_senal:
        "No se pudo llegar al mapa. Puede ser la señal: se vuelve a intentar más tarde, y mientras tanto el nombre se puede escribir a mano.",
      nada_cerca:
        "No hay sitios con nombre cargados en el mapa alrededor de esta escuela. Pasa en zonas donde el mapa está poco trabajado, y no quiere decir que no haya nada: escríbelo tú.",
    },
    {
      sin_permiso:
        "O navegador não deu permissão para a localização. Dá para ativar no cadeado da barra de endereço, ou escrever o lugar mais abaixo.",
      sin_soporte:
        "Este navegador não fornece a localização. Escreva o nome do lugar mais abaixo: a rota funciona igual.",
      sin_senal:
        "Não foi possível chegar ao mapa. Pode ser o sinal: tente de novo mais tarde, e enquanto isso o nome pode ser escrito à mão.",
      nada_cerca:
        "Não há lugares com nome no mapa ao redor desta escola. Acontece onde o mapa foi pouco trabalhado, e não quer dizer que não haja nada: escreva você.",
    }
  );
  return (
    <p className="mt-4 rounded-xl border border-[var(--tierra-300)]/35 bg-[var(--tierra-300)]/[0.07] px-4 py-3 text-[15px] leading-relaxed text-[var(--tierra-300)]">
      {texto[motivo] ?? texto.sin_senal}
    </p>
  );
}
