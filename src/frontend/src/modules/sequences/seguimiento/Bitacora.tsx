/**
 * Por dónde va el proyecto: la hoja a la que se vuelve cada semana.
 *
 * QUÉ CONTESTA
 *
 * Un proyecto de este tipo dura entre tres clases y un semestre, y entre una
 * clase y la siguiente pasan siete días y otras cuatro asignaturas. Cuando el
 * docente vuelve a abrir el cuaderno, lo que necesita saber no es qué dice el
 * método, que ya lo sabe: es en qué etapa está, si esa etapa se puede dar por
 * terminada, y qué se le está quedando atrás.
 *
 * CÓMO ESTÁ ARMADA
 *
 * Arriba, el riel de las seis etapas. Es la forma que tienen los recorridos de
 * varios pasos en casi todas partes, y se usa aquí porque el método es
 * literalmente eso: seis pasos en un orden. Se ve de un vistazo cuáles están
 * cerradas, cuál está abierta y cuántas quedan, y se salta a cualquiera con un
 * clic, porque en multigrado los mayores pueden ir en la cinco mientras los
 * menores todavía ordenan lo que trajeron.
 *
 * Debajo, una sola etapa abierta a la vez. Las seis desplegadas son la pared
 * de texto que este cuaderno lleva tres versiones quitando; y además la
 * pregunta de un martes cualquiera es sobre una etapa, no sobre las seis.
 *
 * LO QUE HAY DENTRO DE CADA UNA
 *
 * Tres cosas iguales en las seis y una distinta. Iguales: las condiciones de
 * término, que vienen de la propia etapa y se marcan a mano; el cierre escrito,
 * que es de a uno y en el cuaderno de cada estudiante; y cómo se cae esta
 * etapa, que aparece solo mientras está abierta, que es cuando sirve.
 *
 * La distinta es el instrumento, y está en §Instrumentos.tsx.
 *
 * EL TONO
 *
 * Nada de esto obliga a nada. Se abre y se cierra a mano, se puede reabrir sin
 * explicar por qué y las fechas se corrigen. Una etapa que lleva un mes abierta
 * porque llovió tres martes seguidos no es un incumplimiento.
 */

import { useState } from "react";

import { Hoja, Parrafo } from "../crear/Campos";
import type { Expedicion } from "../crear/expedicion";
import type { EstadoNube } from "../crear/nube";
import { ETAPAS } from "../metodo/etapas";
import {
  InstrumentoAnalisis,
  InstrumentoAula,
  InstrumentoDifusion,
  InstrumentoProblematica,
  InstrumentoPropuesta,
  InstrumentoTerreno,
} from "./Instrumentos";
import {
  abrir,
  alternarListo,
  avisos,
  cerrar,
  cerradas,
  diasAbierta,
  etapaEnCurso,
  hojaDe,
  ponerHoja,
  reabrir,
  type Bitacora as Hojas,
  type EstadoEtapa,
} from "./bitacora";

const ALCANCE: Record<string, string> = {
  inmediato: "En la sala",
  intermedio: "En el vecindario",
  amplio: "Fuera de la escuela",
};

/**
 * El instrumento que le toca a cada etapa. Viven en §Instrumentos.tsx y el
 * reparto está aquí, que es el único sitio que necesita saberlo.
 */
const INSTRUMENTOS: Record<
  string,
  (p: {
    e: Expedicion;
    b: Hojas;
    onCambio: (b: Hojas) => void;
  }) => React.ReactNode
> = {
  problematica: InstrumentoProblematica,
  aula: InstrumentoAula,
  terreno: InstrumentoTerreno,
  analisis: InstrumentoAnalisis,
  propuesta: InstrumentoPropuesta,
  difusion: InstrumentoDifusion,
};

/** El nombre corto que cabe en el riel. El largo no cabe en seis columnas. */
const CORTO: Record<string, string> = {
  problematica: "Problemática",
  aula: "Aula",
  terreno: "Terreno",
  analisis: "Análisis",
  propuesta: "Propuesta",
  difusion: "Difusión",
};

/** Una fecha corta, dicha como se dice en voz alta. */
function enPalabras(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("es-CL", { day: "numeric", month: "long" });
}

export default function Bitacora({
  e,
  hojas,
  onCambio,
  estado,
  orden = 7,
}: {
  e: Expedicion;
  hojas: Hojas;
  onCambio: (b: Hojas) => void;
  estado: EstadoNube;
  orden?: number;
}) {
  const enCurso = etapaEnCurso(hojas);
  const [abierta, ponerAbierta] = useState<string>(enCurso?.id ?? ETAPAS[0].id);

  const listos = cerradas(hojas);
  const lista = avisos(e, hojas);
  const etapa = ETAPAS.find((x) => x.id === abierta) ?? ETAPAS[0];
  const n = ETAPAS.findIndex((x) => x.id === etapa.id) + 1;

  return (
    <Hoja titulo="Por dónde va el proyecto" orden={orden}>
      <p className="max-w-2xl text-[15px] leading-relaxed text-[var(--crema)]/82">
        {listos === 0
          ? "El proyecto está armado y todavía no empieza en la sala. Abre la primera etapa el día que se dé."
          : listos === ETAPAS.length
            ? "Las seis etapas cerradas. Lo que queda está todo escrito aquí abajo."
            : `Van ${listos} de ${ETAPAS.length} etapas cerradas.`}
      </p>

      {/* ── Lo que conviene mirar ──────────────────────────────────────── */}
      {lista.length > 0 && (
        <ul className="mt-4 space-y-2">
          {lista.map((a) => (
            <li key={a.id}>
              <button
                type="button"
                onClick={() => ponerAbierta(a.etapa)}
                className={`flex w-full gap-3 rounded-xl border px-4 py-3 text-left text-sm leading-relaxed transition ${
                  a.tono === "aviso"
                    ? "border-[var(--tierra-300)]/35 bg-[var(--tierra-300)]/[0.06] text-[var(--tierra-300)] hover:border-[var(--tierra-300)]/60"
                    : "border-[var(--crema)]/14 text-[var(--crema)]/78 hover:border-[var(--crema)]/32"
                }`}
              >
                <span aria-hidden className="shrink-0 opacity-60">
                  {a.tono === "aviso" ? "!" : "·"}
                </span>
                <span className="min-w-0 flex-1">{a.texto}</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* ── El riel de las seis ────────────────────────────────────────── */}
      {/* Se desliza a lo ancho en pantalla chica: seis columnas en un teléfono
          dejan cada nombre en cuatro renglones de dos letras. */}
      <ol className="mt-6 -mx-6 flex snap-x gap-2 overflow-x-auto px-6 pb-2">
        {ETAPAS.map((x, i) => (
          <li key={x.id} className="min-w-[8.5rem] flex-1 snap-start">
            <PasoDelRiel
              n={i + 1}
              nombre={CORTO[x.id] ?? x.nombre}
              estado={hojaDe(hojas, x.id).estado}
              puesta={x.id === abierta}
              onClick={() => ponerAbierta(x.id)}
            />
          </li>
        ))}
      </ol>

      {/* ── La etapa abierta ───────────────────────────────────────────── */}
      <div className="mt-6 rounded-2xl border border-[var(--crema)]/14 p-5">
        <Cabecera
          n={n}
          nombre={etapa.nombre}
          alcance={ALCANCE[etapa.alcance] ?? ""}
          hoja={hojaDe(hojas, etapa.id)}
          onAbrir={() => onCambio(abrir(hojas, etapa.id))}
          onCerrar={() => onCambio(cerrar(hojas, etapa.id))}
          onReabrir={() => onCambio(reabrir(hojas, etapa.id))}
          onFecha={(campo, valor) => onCambio(ponerHoja(hojas, etapa.id, { [campo]: valor }))}
        />

        <p className="mt-4 text-[15px] leading-relaxed text-[var(--crema)]/82">
          {etapa.queOcurre}
        </p>

        {/* El instrumento propio de esta etapa. */}
        <div className="mt-6 border-t border-[var(--crema)]/12 pt-6">
          {INSTRUMENTOS[etapa.id]?.({ e, b: hojas, onCambio })}
        </div>

        {/* ── Las condiciones de término ──────────────────────────────── */}
        <div className="mt-6 border-t border-[var(--crema)]/12 pt-6">
          <p className="rotulo text-[var(--tierra-600)]">Se puede cerrar cuando</p>
          <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-[var(--crema)]/70">
            Las trae la etapa. Marcarlas es del docente y no las revisa nadie
            más: sirven para no cerrar por calendario lo que todavía no ocurrió.
          </p>
          <ul className="mt-3 space-y-2">
            {etapa.estaListoCuando.map((c, i) => {
              const puesta = hojaDe(hojas, etapa.id).listo.includes(i);
              return (
                <li key={c}>
                  <button
                    type="button"
                    onClick={() => onCambio(alternarListo(hojas, etapa.id, i))}
                    aria-pressed={puesta}
                    className="flex w-full min-h-11 items-start gap-3 rounded-xl px-3 py-2 text-left transition hover:bg-[var(--crema)]/[0.05]"
                  >
                    <span
                      aria-hidden
                      className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border text-[11px] transition ${
                        puesta
                          ? "border-transparent bg-[var(--tierra-600)] text-[#1e2a24]"
                          : "border-[var(--crema)]/30 text-transparent"
                      }`}
                    >
                      ✓
                    </span>
                    <span
                      className={`text-[15px] leading-relaxed ${
                        puesta ? "text-[var(--crema)]/55" : "text-[var(--crema-clara)]"
                      }`}
                    >
                      {c}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* ── El cierre escrito ───────────────────────────────────────── */}
        <CierreEscrito
          e={e}
          preguntas={etapa.cierre.preguntas}
          queMirar={etapa.cierre.queMirar}
          hoja={hojaDe(hojas, etapa.id)}
          onCambio={(cambio) => onCambio(ponerHoja(hojas, etapa.id, cambio))}
        />

        {/* Cómo se cae esta etapa, mientras está abierta y no antes. Leído seis
            veces seguidas es una lista de miedos; leído el martes en que la
            etapa está pasando es lo único que un docente que lo hace por
            primera vez no puede anticipar solo. */}
        {hojaDe(hojas, etapa.id).estado === "abierta" && (
          <p className="mt-6 rounded-xl border border-[var(--tierra-300)]/30 bg-[var(--tierra-300)]/[0.06] px-4 py-3 text-[15px] leading-relaxed text-[var(--tierra-300)]">
            <span className="font-medium">Se cae cuando:</span> {etapa.seCaeCuando}
          </p>
        )}

        {/* ── Lo que el docente quiera anotar ─────────────────────────── */}
        <label className="mt-6 block border-t border-[var(--crema)]/12 pt-6">
          <span className="rotulo block text-[var(--tierra-600)]">
            Tu nota de esta etapa
          </span>
          <span className="mt-1.5 mb-2 block text-sm leading-relaxed text-[var(--crema)]/70">
            Lo que no cabe en ninguna casilla. Es lo que se agradece tener
            escrito cuando, al final, hay que redactar el informe.
          </span>
          <Parrafo
            value={hojaDe(hojas, etapa.id).nota}
            onChange={(ev) => onCambio(ponerHoja(hojas, etapa.id, { nota: ev.target.value }))}
            placeholder="Los de quinto se quedaron atrás con la escala. Repetirlo con el vaso de tierra."
          />
        </label>
      </div>

      <EstadoGuardado estado={estado} />
    </Hoja>
  );
}

/* ── El riel ───────────────────────────────────────────────────────────── */

function PasoDelRiel({
  n,
  nombre,
  estado,
  puesta,
  onClick,
}: {
  n: number;
  nombre: string;
  estado: EstadoEtapa;
  puesta: boolean;
  onClick: () => void;
}) {
  const cerrada = estado === "cerrada";
  const enCurso = estado === "abierta";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={puesta ? "step" : undefined}
      className={`flex h-full w-full flex-col gap-2 rounded-xl border px-3 py-3 text-left transition ${
        puesta
          ? "border-[var(--crema)]/40 bg-[var(--crema)]/[0.07]"
          : "border-[var(--crema)]/12 hover:border-[var(--crema)]/28"
      }`}
    >
      {/* La barra dice el estado por color y por relleno, no solo por color:
          quien no distingue el terracota del crema ve igual cuál está llena. */}
      <span
        aria-hidden
        className={`block h-1 w-full rounded-full ${
          cerrada
            ? "bg-[var(--tierra-600)]"
            : enCurso
              ? "bg-[var(--tierra-600)]/40"
              : "bg-[var(--crema)]/12"
        }`}
      />
      <span className="flex items-baseline gap-2">
        <span className="cifra text-xs text-[var(--crema)]/40">
          {String(n).padStart(2, "0")}
        </span>
        <span
          className={`text-sm leading-snug ${
            puesta ? "text-[var(--crema-clara)]" : "text-[var(--crema)]/78"
          }`}
        >
          {nombre}
        </span>
      </span>
      <span className="rotulo text-[var(--crema)]/45">
        {cerrada ? "Cerrada" : enCurso ? "Abierta" : "Sin abrir"}
      </span>
    </button>
  );
}

/* ── La cabecera de la etapa abierta ───────────────────────────────────── */

function Cabecera({
  n,
  nombre,
  alcance,
  hoja,
  onAbrir,
  onCerrar,
  onReabrir,
  onFecha,
}: {
  n: number;
  nombre: string;
  alcance: string;
  hoja: ReturnType<typeof hojaDe>;
  onAbrir: () => void;
  onCerrar: () => void;
  onReabrir: () => void;
  onFecha: (campo: "abierta" | "cerrada", valor: string) => void;
}) {
  const dias = diasAbierta(hoja);

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <span className="rotulo text-[var(--crema)]/45">
          Etapa {String(n).padStart(2, "0")}
        </span>
        {alcance && <span className="rotulo text-[var(--crema)]/45">{alcance}</span>}
      </div>

      <h3 className="mt-2 text-xl leading-snug text-[var(--crema-clara)]">{nombre}</h3>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        {hoja.estado === "sin_abrir" && (
          <button
            type="button"
            onClick={onAbrir}
            className="min-h-11 rounded-full border border-[var(--tierra-600)] bg-[var(--tierra-600)] px-5 text-sm font-semibold text-[#1e2a24] transition hover:bg-[var(--tierra-500)]"
          >
            Abrir esta etapa
          </button>
        )}

        {hoja.estado === "abierta" && (
          <>
            <button
              type="button"
              onClick={onCerrar}
              className="min-h-11 rounded-full border border-[var(--tierra-600)] px-5 text-sm font-medium text-[var(--tierra-300)] transition hover:bg-[var(--tierra-600)]/15"
            >
              Darla por cerrada
            </button>
            <span className="text-sm text-[var(--crema)]/60">
              Abierta {dias === 0 ? "hoy" : `hace ${dias} día${dias === 1 ? "" : "s"}`}.
            </span>
          </>
        )}

        {hoja.estado === "cerrada" && (
          <>
            <span className="rotulo rounded-full border border-[var(--tierra-600)]/45 bg-[var(--tierra-600)]/10 px-3 py-1.5 text-[var(--tierra-300)]">
              Cerrada
            </span>
            <button
              type="button"
              onClick={onReabrir}
              className="min-h-11 text-sm text-[var(--crema)]/60 underline underline-offset-4 transition hover:text-[var(--crema-clara)]"
            >
              Volver a abrirla
            </button>
          </>
        )}
      </div>

      {/* Las fechas se corrigen. Se marca el día que uno se acuerda de marcar,
          y casi nunca es el día en que pasó. */}
      {hoja.estado !== "sin_abrir" && (
        <div className="mt-4 flex flex-wrap gap-4">
          <label className="flex items-center gap-2 text-sm text-[var(--crema)]/60">
            <span>Se abrió el</span>
            <input
              type="date"
              value={hoja.abierta ?? ""}
              onChange={(ev) => onFecha("abierta", ev.target.value)}
              className="rounded-lg border border-[var(--crema)]/20 bg-transparent px-2.5 py-1.5 text-[var(--crema-clara)] [color-scheme:dark]"
            />
          </label>
          {hoja.estado === "cerrada" && (
            <label className="flex items-center gap-2 text-sm text-[var(--crema)]/60">
              <span>Se cerró el</span>
              <input
                type="date"
                value={hoja.cerrada ?? ""}
                onChange={(ev) => onFecha("cerrada", ev.target.value)}
                className="rounded-lg border border-[var(--crema)]/20 bg-transparent px-2.5 py-1.5 text-[var(--crema-clara)] [color-scheme:dark]"
              />
            </label>
          )}
          {hoja.estado === "cerrada" && hoja.abierta && hoja.cerrada && (
            <span className="self-center text-sm text-[var(--crema)]/45">
              {enPalabras(hoja.abierta)} al {enPalabras(hoja.cerrada)}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

/* ── El cierre escrito ─────────────────────────────────────────────────── */

/**
 * Cuántos entregaron las tres preguntas del cierre.
 *
 * Es la parte de la bitácora que menos parece seguimiento y más lo es. En una
 * entrevista de validación quedó pedido que el cierre de cada etapa fuera por
 * escrito, de a uno y en cada fase: en grupo contesta el que siempre contesta,
 * y justamente el estudiante que se está quedando atrás es el que no levanta
 * la mano. Contar cuántos entregaron, etapa por etapa, es el aviso temprano
 * que se echaba de menos: quien no entiende qué está haciendo aparece aquí, en
 * la semana dos, y no al final cuando ya no queda nada que corregir.
 *
 * El contador va con botones de más y menos además del campo: el docente lo
 * llena con las hojas en la mano, contando, y en esa situación apuntarle a un
 * campo numérico del computador de la escuela es más lento que apretar dos
 * veces.
 */
function CierreEscrito({
  e,
  preguntas,
  queMirar,
  hoja,
  onCambio,
}: {
  e: Expedicion;
  preguntas: string[];
  queMirar: string;
  hoja: ReturnType<typeof hojaDe>;
  onCambio: (cambio: { entregaron?: number | null; faltan?: string }) => void;
}) {
  const total = e.estudiantes;
  const cuantos = hoja.entregaron ?? 0;
  const mover = (d: number) =>
    onCambio({ entregaron: Math.max(0, Math.min(total ?? 999, cuantos + d)) });

  return (
    <div className="mt-6 border-t border-[var(--crema)]/12 pt-6">
      <p className="rotulo text-[var(--tierra-600)]">El cierre, cada uno en su cuaderno</p>
      <ul className="mt-2.5 space-y-1.5">
        {preguntas.map((q) => (
          <li key={q} className="text-[15px] leading-relaxed text-[var(--crema-clara)]">
            {q}
          </li>
        ))}
      </ul>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--crema)]/70">
        <span className="text-[var(--crema-clara)]">Qué mirar:</span> {queMirar}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => mover(-1)}
            className="grid h-11 w-11 place-items-center rounded-full border border-[var(--crema)]/20 text-lg text-[var(--crema)]/80 transition hover:border-[var(--crema)]/45"
          >
            <span aria-hidden>−</span>
            <span className="sr-only">Uno menos</span>
          </button>
          <input
            type="number"
            min={0}
            max={total ?? 200}
            value={hoja.entregaron ?? ""}
            onChange={(ev) =>
              onCambio({ entregaron: ev.target.value ? Number(ev.target.value) : null })
            }
            aria-label="Cuántos entregaron el cierre"
            className="w-20 rounded-lg border border-[var(--crema)]/20 bg-[var(--crema)]/[0.045] px-3 py-2.5 text-center text-[15px] text-[var(--crema-clara)] outline-none focus:border-[var(--tierra-600)]"
          />
          <button
            type="button"
            onClick={() => mover(1)}
            className="grid h-11 w-11 place-items-center rounded-full border border-[var(--crema)]/20 text-lg text-[var(--crema)]/80 transition hover:border-[var(--crema)]/45"
          >
            <span aria-hidden>+</span>
            <span className="sr-only">Uno más</span>
          </button>
          <span className="ml-1 text-sm text-[var(--crema)]/70">
            {total ? `de ${total} entregaron` : "entregaron"}
          </span>
        </div>

        {/* La barra de cuántos van. Con el curso a la vista, seis de catorce se
            ve antes de leer el número. */}
        {total ? (
          <div
            className="h-2 min-w-[8rem] flex-1 overflow-hidden rounded-full bg-[var(--crema)]/10"
            role="img"
            aria-label={`${cuantos} de ${total}.`}
          >
            <span
              className="block h-full rounded-full bg-[var(--tierra-600)] transition-all duration-500"
              style={{ width: `${Math.min(100, (cuantos / total) * 100)}%` }}
            />
          </div>
        ) : null}
      </div>

      {total !== null && cuantos > 0 && cuantos < total && (
        <label className="mt-4 block">
          <span className="rotulo block text-[var(--crema)]/70">Quiénes faltan</span>
          <span className="mt-1.5 mb-2 block text-sm leading-relaxed text-[var(--crema)]/70">
            Con nombre. Suelen ser los mismos de la etapa anterior, y esa
            repetición es el dato.
          </span>
          <Parrafo
            value={hoja.faltan}
            onChange={(ev) => onCambio({ faltan: ev.target.value })}
            placeholder="Nombres, o la fila del fondo."
          />
        </label>
      )}
    </div>
  );
}

/* ── Dónde quedó guardado ──────────────────────────────────────────────── */

/**
 * La misma advertencia que usa el resto del cuaderno, y por el mismo motivo:
 * la pregunta que el docente se hace, «¿esto se pierde si cierro?», no aparece
 * solo cuando hay un error. Los dos casos malos no son el mismo: sin red se
 * arregla solo, y sin tabla hay que cargar un SQL en el proyecto.
 */
function EstadoGuardado({ estado }: { estado: EstadoNube }) {
  const texto: Record<EstadoNube, string> = {
    sin_cuenta:
      "Guardado en este computador. Entra con tu cuenta y queda también ahí, para abrirlo desde otro equipo.",
    guardando: "Guardando en tu cuenta…",
    guardado: "Guardado en tu cuenta. Lo puedes abrir desde otro computador.",
    sin_conexion:
      "Guardado en este computador. No se pudo llegar a tu cuenta: cuando vuelva la señal se sube solo.",
    sin_tabla:
      "Guardado en este computador. El respaldo en la cuenta todavía no está activado en el servidor.",
  };

  return (
    <p
      className={`mt-5 border-t border-[var(--crema)]/12 pt-4 text-xs leading-relaxed ${
        estado === "sin_conexion" || estado === "sin_tabla"
          ? "text-[var(--tierra-300)]"
          : "text-[var(--crema)]/45"
      }`}
    >
      {texto[estado]}
    </p>
  );
}
