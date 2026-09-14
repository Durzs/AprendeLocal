import { useState } from "react";

import { Campo, Hoja, Parrafo, Texto } from "../crear/Campos";
import type { Expedicion } from "../crear/expedicion";
import {
  ASIGNATURAS,
  PROBLEMAS,
  QUE_SACAN_DE_LA_NOTICIA,
  angulosDe,
  nombreAsignatura,
  problemaPorId,
  type Angulo,
  type Problema,
} from "./problemas";
import SelectorOA from "../crear/SelectorOA";
import { buscarOA, type NivelOA } from "../crear/oa";

/** «7º» es lo que marca el docente; `7mo_basico` es como se llama en el catálogo. */
const NIVEL_DE_CURSO: Record<string, NivelOA> = {
  "5º": "5to_basico",
  "6º": "6to_basico",
  "7º": "7mo_basico",
  "8º": "8vo_basico",
};

/**
 * De dónde arranca el proyecto, en tres columnas.
 *
 * POR QUÉ TRES Y NO UNA LISTA LARGA
 *
 * Esto venía en vertical: primero se elegía la problemática, más abajo
 * aparecían las actividades por asignatura, y más abajo todavía los objetivos.
 * Tres cosas que se piensan juntas, puestas una debajo de otra, obligan a
 * subir y bajar para cruzarlas. En una entrevista de validación se dijo de dos
 * maneras distintas: que el objetivo y el tema tienen que verse a la vez para
 * poder emparejarlos, y que las actividades por asignatura se leían como una
 * lluvia de ideas porque no se veía de qué objetivo colgaban.
 *
 * Las tres columnas arreglan las dos cosas de una vez, porque la unión queda
 * dibujada: el problema a la izquierda, lo que se puede hacer con él en el
 * medio, y a la derecha los objetivos del programa que esa actividad abre. Se
 * lee de izquierda a derecha y esa dirección es el argumento.
 *
 * EL ORDEN IMPORTA
 *
 * Va del problema al objetivo y no al revés, que es como trabaja un docente de
 * verdad: no parte del objetivo buscando actividad, parte de algo que quiere
 * hacer y después reconoce dónde encaja. «Medir cuánta agua gasta la escuela»
 * ya implica diferencia, suma y resta; el objetivo se reconoce, no se elige
 * primero.
 *
 * Al elegir una actividad, la tercera columna se queda solo con los objetivos
 * de esa actividad. Es la manera de mostrar el vínculo sin dibujar flechas.
 */
export function ElegirProblema({
  e,
  onCambio,
  orden = 4,
}: {
  e: Expedicion;
  onCambio: (e: Expedicion) => void;
  orden?: number;
}) {
  const [proponiendo, ponerProponiendo] = useState(Boolean(e.problemaPropio));
  /** La actividad en la que está puesta la atención, para filtrar la tercera columna. */
  const [enfocada, ponerEnfocada] = useState<string | null>(null);
  const [verTodos, ponerVerTodos] = useState(false);

  const set = <K extends keyof Expedicion>(k: K, v: Expedicion[K]) =>
    onCambio({ ...e, [k]: v });

  const elegido = (e.problemaId ? problemaPorId(e.problemaId) : null) ?? null;
  const angulos = elegido ? angulosDe(elegido, e.asignaturas) : [];
  const activa = angulos.find((a) => a.asignatura === enfocada) ?? null;

  // Si hay una actividad enfocada manda ella; si no, se muestran los objetivos
  // de todas las actividades visibles, sin repetir.
  //
  // Se descarta el código que no está en la base. Un objetivo que no se puede
  // leer no sirve de nada y, peor, se veía como una tarjeta con el código
  // repetido dos veces, que parece un objetivo cargado cuando no lo hay.
  //
  // Y se descarta el que no sea de un curso de esta sala. Al entrar Matemática
  // los objetivos pasaron a cubrir de 5º a 8º, así que una actividad puede
  // abrir uno de 5º y otro de 8º a la vez; a quien tiene séptimo y octavo no
  // le sirve que le ofrezcan el de quinto. Sin cursos marcados se muestran
  // todos, que es mejor que una columna vacía sin explicación.
  const niveles = new Set(e.cursos.map((c) => NIVEL_DE_CURSO[c]).filter(Boolean));
  const codigos = [
    ...new Set((activa ? [activa] : angulos).flatMap((a) => a.oaQueAbre)),
  ].filter((cod) => {
    const oa = buscarOA(cod);
    return oa && (niveles.size === 0 || niveles.has(oa.nivel));
  });

  return (
    <Hoja titulo="De qué va a tratar" orden={orden}>
      <p className="mb-5 max-w-3xl text-[15px] leading-relaxed text-[var(--crema)]/82">
        Un proyecto empieza por algo que está pasando, no por un tema. Las tres
        columnas se leen de izquierda a derecha: el problema, lo que se puede
        hacer con él desde cada asignatura, y los objetivos del programa que esa
        actividad abre.
      </p>

      <div className="grid gap-4 lg:grid-cols-3">
        <ColumnaProblema
          e={e}
          onCambio={onCambio}
          proponiendo={proponiendo}
          ponerProponiendo={ponerProponiendo}
          set={set}
          elegido={elegido}
        />

        <ColumnaActividades
          e={e}
          set={set}
          elegido={elegido}
          angulos={angulos}
          enfocada={enfocada}
          ponerEnfocada={ponerEnfocada}
        />

        <ColumnaObjetivos
          e={e}
          set={set}
          hayProblema={Boolean(elegido)}
          codigos={codigos}
          actividad={activa}
          verTodos={verTodos}
          ponerVerTodos={ponerVerTodos}
        />
      </div>

      {elegido && !proponiendo && (
        <Noticias e={e} onCambio={onCambio} problema={elegido} />
      )}

      <Campo
        etiqueta="Cómo se ve eso aquí"
        ayuda="En una frase, lo que se nota en tu sitio y que en otra escuela no se notaría igual. Es lo único que no podemos saber nosotros."
        ancho="entera"
      >
        <Parrafo
          value={e.fenomeno}
          onChange={(ev) => set("fenomeno", ev.target.value)}
          placeholder="El estero baja tanto en verano que la bomba de la escuela se queda sin agua."
          rows={2}
        />
      </Campo>

      {(elegido || e.problemaPropio.trim()) && <QueSacanDeAhi />}
    </Hoja>
  );
}

/** El marco de cada columna, para que las tres se lean como una sola cosa. */
function Columna({
  n,
  titulo,
  bajada,
  children,
}: {
  n: number;
  titulo: string;
  bajada: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex min-w-0 flex-col rounded-xl border border-[var(--crema)]/14 p-4">
      <p className="rotulo text-[var(--tierra-600)]">
        {n} · {titulo}
      </p>
      <p className="mt-1.5 text-sm leading-relaxed text-[var(--crema)]/75">{bajada}</p>
      <div className="mt-3.5 min-w-0 flex-1">{children}</div>
    </section>
  );
}

/* ── 1 · La problemática ────────────────────────────────────────────────── */

function ColumnaProblema({
  e,
  onCambio,
  proponiendo,
  ponerProponiendo,
  set,
  elegido,
}: {
  e: Expedicion;
  onCambio: (e: Expedicion) => void;
  proponiendo: boolean;
  ponerProponiendo: (v: boolean) => void;
  set: <K extends keyof Expedicion>(k: K, v: Expedicion[K]) => void;
  elegido: Problema | null;
}) {
  return (
    <Columna
      n={1}
      titulo="La problemática local"
      bajada="Algo que está ocurriendo y de lo que ya se escribió."
    >
      <ul className="space-y-2">
        {PROBLEMAS.map((p) => {
          const activo = p.id === e.problemaId && !proponiendo;
          return (
            <li key={p.id}>
              <button
                type="button"
                onClick={() => {
                  ponerProponiendo(false);
                  onCambio({
                    ...e,
                    problemaId: activo ? null : p.id,
                    problemaPropio: "",
                  });
                }}
                aria-pressed={activo}
                className={`min-h-11 w-full rounded-lg border px-3.5 py-2.5 text-left text-[15px] leading-snug transition ${
                  activo
                    ? "border-[var(--tierra-600)] bg-[var(--tierra-600)]/[0.12] text-[var(--tierra-300)]"
                    : "border-[var(--crema)]/12 text-[var(--crema-clara)] hover:border-[var(--crema)]/30"
                }`}
              >
                {p.nombre}
              </button>
            </li>
          );
        })}
      </ul>

      <button
        type="button"
        onClick={() => {
          ponerProponiendo(true);
          set("problemaId", null);
        }}
        aria-pressed={proponiendo}
        className={`mt-2.5 min-h-11 w-full rounded-lg border px-3.5 text-sm transition ${
          proponiendo
            ? "border-[var(--tierra-600)] bg-[var(--tierra-600)] text-[#1e2a24]"
            : "border-dashed border-[var(--crema)]/25 text-[var(--crema)]/85 hover:border-[var(--crema)]/45"
        }`}
      >
        Ninguna: la mía es otra
      </button>

      {proponiendo && (
        <div className="mt-3">
          <Parrafo
            value={e.problemaPropio}
            onChange={(ev) => set("problemaPropio", ev.target.value)}
            placeholder="La planta de áridos levanta polvo todo el verano y las casas de al lado no pueden abrir las ventanas."
            rows={3}
          />
          <p className="mt-2 text-sm leading-relaxed text-[var(--crema)]/72">
            Al proponer una problemática propia, las dos columnas de al lado
            quedan en tus manos: no hay actividades ni objetivos escritos para
            algo que todavía no está en la lista.
          </p>
        </div>
      )}

      {elegido && !proponiendo && (
        <>
          <p className="mt-4 border-t border-[var(--crema)]/12 pt-3.5 text-[15px] leading-relaxed text-[var(--crema)]/85">
            {elegido.queEs}
          </p>
          <p className="mt-2.5 text-sm leading-relaxed text-[var(--crema)]/72">
            {elegido.dondeAparece}
          </p>
          {elegido.respaldo.length > 0 && (
            <p className="mt-2.5 text-sm leading-relaxed text-[var(--crema)]/72">
              {elegido.respaldo.length === 1
                ? "1 noticia nacional respalda este problema."
                : `${elegido.respaldo.length} noticias nacionales respaldan este problema.`}{" "}
              Están más abajo, con su medio y su fecha.
            </p>
          )}
        </>
      )}
    </Columna>
  );
}

/* ── 2 · Las actividades por asignatura ─────────────────────────────────── */

function ColumnaActividades({
  e,
  set,
  elegido,
  angulos,
  enfocada,
  ponerEnfocada,
}: {
  e: Expedicion;
  set: <K extends keyof Expedicion>(k: K, v: Expedicion[K]) => void;
  elegido: Problema | null;
  angulos: Angulo[];
  enfocada: string | null;
  ponerEnfocada: (v: string | null) => void;
}) {
  if (!elegido) {
    return (
      <Columna
        n={2}
        titulo="Actividades por asignatura"
        bajada="La misma problemática abre trabajos distintos según desde dónde se entre."
      >
        <p className="text-[15px] leading-relaxed text-[var(--crema)]/72">
          Elige una problemática en la columna de la izquierda y aquí aparecen
          las actividades que abre en cada asignatura.
        </p>
      </Columna>
    );
  }

  return (
    <Columna
      n={2}
      titulo="Actividades por asignatura"
      bajada="Elige una actividad y a la derecha quedan solo los objetivos que abre."
    >
      {/* El filtro de asignaturas va aquí, pegado a lo que filtra, y no suelto
          arriba como estaba: así se entiende que lo que hace es recortar esta
          columna. */}
      <ul className="mb-3.5 flex flex-wrap gap-1.5">
        {ASIGNATURAS.map((a) => {
          const marcada = e.asignaturas.includes(a.id);
          const hayAngulo = elegido.angulos.some((x) => x.asignatura === a.id);
          return (
            <li key={a.id}>
              <button
                type="button"
                onClick={() =>
                  set(
                    "asignaturas",
                    marcada
                      ? e.asignaturas.filter((x) => x !== a.id)
                      : [...e.asignaturas, a.id]
                  )
                }
                aria-pressed={marcada}
                className={`min-h-11 rounded-full border px-3 text-sm transition ${
                  marcada
                    ? "border-[var(--tierra-600)] bg-[var(--tierra-600)] text-[#1e2a24]"
                    : hayAngulo
                      ? "border-[var(--crema)]/18 text-[var(--crema)]/85 hover:border-[var(--crema)]/35"
                      : "border-[var(--crema)]/10 text-[var(--crema)]/40"
                }`}
              >
                {a.nombre}
              </button>
            </li>
          );
        })}
      </ul>

      <ul className="space-y-2.5">
        {angulos.map((a) => {
          const activa = enfocada === a.asignatura;
          return (
            <li key={a.asignatura}>
              <button
                type="button"
                onClick={() => ponerEnfocada(activa ? null : a.asignatura)}
                aria-pressed={activa}
                className={`w-full rounded-lg border px-3.5 py-3 text-left transition ${
                  activa
                    ? "border-[var(--tierra-600)] bg-[var(--tierra-600)]/[0.1]"
                    : "border-[var(--crema)]/12 hover:border-[var(--crema)]/30"
                }`}
              >
                <span className="rotulo block text-[var(--crema)]/72">
                  {nombreAsignatura(a.asignatura)}
                </span>
                <span
                  className={`mt-1.5 block text-[15px] leading-snug ${
                    activa ? "text-[var(--tierra-300)]" : "text-[var(--crema-clara)]"
                  }`}
                >
                  {a.enfoque}
                </span>
                <span className="mt-2 block text-sm leading-relaxed text-[var(--crema)]/78">
                  {a.queInvestigan}
                </span>
                {activa && (
                  <>
                    <span className="mt-2 block text-sm leading-relaxed text-[var(--crema)]/72">
                      {a.queSaleDeAqui}
                    </span>
                    {a.conceptosClave.length > 0 && (
                      <span className="mt-2.5 block text-sm leading-relaxed text-[var(--crema)]/72">
                        Contenidos: {a.conceptosClave.join(", ")}.
                      </span>
                    )}
                  </>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </Columna>
  );
}

/* ── 3 · Los objetivos que abre ─────────────────────────────────────────── */

function ColumnaObjetivos({
  e,
  set,
  hayProblema,
  codigos,
  actividad,
  verTodos,
  ponerVerTodos,
}: {
  e: Expedicion;
  set: <K extends keyof Expedicion>(k: K, v: Expedicion[K]) => void;
  hayProblema: boolean;
  codigos: string[];
  actividad: Angulo | null;
  verTodos: boolean;
  ponerVerTodos: (v: boolean) => void;
}) {
  return (
    <Columna
      n={3}
      titulo="Los objetivos que abre"
      bajada={
        actividad
          ? `Los que abre la actividad de ${nombreAsignatura(actividad.asignatura).toLowerCase()}.`
          : "Salen de la actividad, no al revés: primero qué se va a hacer, después dónde encaja."
      }
    >
      {!hayProblema ? (
        <p className="text-[15px] leading-relaxed text-[var(--crema)]/72">
          Aquí van a aparecer los objetivos del programa que abre cada
          actividad, para marcarlos sin salir de esta pantalla.
        </p>
      ) : codigos.length === 0 ? (
        <p className="text-[15px] leading-relaxed text-[var(--crema)]/78">
          Las actividades que tienes a la vista son de asignaturas cuyos
          objetivos todavía no están cargados: por ahora están los de Ciencias
          Naturales y los de Matemática, de 5º a 8º. Puedes buscarlos abajo o
          escribirlos tú en la planificación.
        </p>
      ) : (
        <ul className="space-y-2">
          {codigos.map((cod) => {
            const oa = buscarOA(cod);
            const marcado = e.oa.includes(cod);
            return (
              <li key={cod}>
                <button
                  type="button"
                  onClick={() =>
                    set(
                      "oa",
                      marcado ? e.oa.filter((x) => x !== cod) : [...e.oa, cod]
                    )
                  }
                  aria-pressed={marcado}
                  className={`w-full rounded-lg border px-3.5 py-2.5 text-left transition ${
                    marcado
                      ? "border-[var(--tierra-600)] bg-[var(--tierra-600)]/[0.12]"
                      : "border-[var(--crema)]/12 hover:border-[var(--crema)]/30"
                  }`}
                >
                  <span
                    className={`block font-mono text-xs ${
                      marcado ? "text-[var(--tierra-300)]" : "text-[var(--tierra-600)]"
                    }`}
                  >
                    {cod}
                    {marcado ? " · marcado" : ""}
                  </span>
                  <span className="mt-1.5 block text-[15px] leading-relaxed text-[var(--crema)]/85">
                    {oa?.texto}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {/* El buscador completo queda plegado: el que confía en la propuesta no
          lo abre, y el que tiene su objetivo decidido de antes lo abre y lo
          busca sin que nadie le haya puesto una lista delante. */}
      <button
        type="button"
        onClick={() => ponerVerTodos(!verTodos)}
        aria-expanded={verTodos}
        className="mt-3.5 min-h-11 text-sm text-[var(--crema)]/78 underline decoration-[var(--crema)]/30 underline-offset-4 hover:text-[var(--crema-clara)]"
      >
        {verTodos ? "Cerrar el buscador" : "Buscar otro objetivo del programa"}
      </button>

      {verTodos && (
        <div className="mt-3 border-t border-[var(--crema)]/12 pt-3.5">
          <SelectorOA
            cursos={e.cursos}
            elegidos={e.oa}
            onElegir={(v) => set("oa", v)}
          />
        </div>
      )}

      {e.oa.length > 0 && (
        <p className="mt-3.5 border-t border-[var(--crema)]/12 pt-3 text-sm leading-relaxed text-[var(--crema)]/78">
          {e.oa.length === 1
            ? "1 objetivo marcado para este proyecto."
            : `${e.oa.length} objetivos marcados para este proyecto.`}
        </p>
      )}
    </Columna>
  );
}

/**
 * Las notas de prensa, que las pone el docente.
 *
 * El catálogo no trae titulares escritos y eso es deliberado. Un titular con
 * su medio y su fecha es un registro; uno inventado sigue pareciendo
 * verdadero después de que alguien lo cite, y acabaría en la pizarra de una
 * escuela como si fuera cierto. Lo que sí se puede dar es con qué palabras
 * buscar, dónde, y qué nota sirve de verdad.
 */
function Noticias({
  e,
  onCambio,
  problema,
}: {
  e: Expedicion;
  onCambio: (e: Expedicion) => void;
  problema: NonNullable<ReturnType<typeof problemaPorId>>;
}) {
  const [titular, ponerTitular] = useState("");
  const [url, ponerUrl] = useState("");

  function agregar() {
    if (!titular.trim()) return;
    onCambio({
      ...e,
      noticias: [...e.noticias, { titular: titular.trim(), url: url.trim() }],
    });
    ponerTitular("");
    ponerUrl("");
  }

  return (
    <div className="mt-5 rounded-xl border border-[var(--crema)]/12 p-4">
      {/* Primero las fuentes comprobadas, que son las que sostienen que esto
          es un problema y no un tema. Después el hueco para las de su comuna,
          que son las que de verdad mueven a un curso y que no tenemos. */}
      {problema.respaldo.length > 0 ? (
        <>
          <p className="rotulo text-[var(--crema)]/75">
            Noticias nacionales sobre este problema
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-[var(--crema)]/75">
            Las noticias de aquí arriba son de alcance nacional y sirven para
            plantear el asunto en la sala. Más abajo se pueden agregar noticias
            de tu comuna, que suelen enganchar más a un curso porque hablan de
            un lugar que conocen.
          </p>
          <ul className="mt-3 space-y-3.5">
            {problema.respaldo.map((n) => (
              <li key={n.titular}>
                <p className="text-base leading-snug text-[var(--crema-clara)]">
                  {n.url ? (
                    <a
                      href={n.url}
                      target="_blank"
                      rel="noreferrer"
                      className="underline decoration-[var(--tierra-600)] underline-offset-4 hover:text-[var(--tierra-300)]"
                    >
                      {n.titular}
                    </a>
                  ) : (
                    n.titular
                  )}
                </p>
                <p className="mt-1 text-sm text-[var(--crema)]/70">
                  {n.medio}
                  {n.fecha ? ` · ${n.fecha}` : ""}
                </p>
                {n.queAporta && (
                  <p className="mt-1.5 text-[15px] leading-relaxed text-[var(--crema)]/82">
                    {n.queAporta}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p className="text-[15px] leading-relaxed text-[var(--crema)]/82">
          Esta es la única sin fuentes nacionales, y no es un descuido: lo que
          se está dejando de saber en un pueblo no sale en ningún estudio, se
          sabe preguntando ahí.
        </p>
      )}

      <p className="mt-5 border-t border-[var(--crema)]/12 pt-4 rotulo text-[var(--crema)]/75">
        Noticias de tu comuna
      </p>

      {e.noticias.length > 0 && (
        <ul className="mt-3 space-y-2">
          {e.noticias.map((n, i) => (
            <li key={`${n.titular}-${i}`} className="flex items-start gap-3">
              <span className="min-w-0 flex-1 text-[15px] leading-relaxed text-[var(--crema-clara)]">
                {n.titular}
                {n.url && (
                  <span className="mt-0.5 block truncate text-xs text-[var(--crema)]/70">
                    {n.url}
                  </span>
                )}
              </span>
              <button
                type="button"
                onClick={() =>
                  onCambio({ ...e, noticias: e.noticias.filter((_, j) => j !== i) })
                }
                className="min-h-11 shrink-0 px-2 text-sm text-[var(--crema)]/72 hover:text-[var(--tierra-300)]"
              >
                Quitar
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-3 grid gap-2.5 sm:grid-cols-[1fr_auto]">
        <div className="grid gap-2.5">
          <Texto
            value={titular}
            onChange={(ev) => ponerTitular(ev.target.value)}
            placeholder="El titular, tal como salió"
          />
          <Texto
            value={url}
            onChange={(ev) => ponerUrl(ev.target.value)}
            placeholder="El enlace, si lo tienes"
          />
        </div>
        <button
          type="button"
          onClick={agregar}
          className="min-h-11 self-start rounded-full border border-[var(--crema)]/25 px-5 text-sm font-medium text-[var(--crema-clara)] transition hover:bg-[var(--crema)]/10"
        >
          Agregar
        </button>
      </div>

      <div className="mt-4 border-t border-[var(--crema)]/12 pt-3.5">
        <p className="text-sm leading-relaxed text-[var(--crema)]/75">
          Las noticias de cada comuna todavía no están cargadas en la
          plataforma, así que esas las agrega el docente.
        </p>
        <ConsejosDeBusqueda como={problema.comoSeBuscan} />
      </div>
    </div>
  );
}

/**
 * Cómo encontrar las noticias de la propia comuna.
 *
 * ESTO ERA UN PÁRRAFO Y SE LEÍA COMO UNA ORDEN
 *
 * Estaba suelto debajo del campo, con los términos de búsqueda separados por
 * puntos: «contaminación río + comuna · denuncia riles + río · mortandad de
 * peces + región». En una entrevista de validación alguien lo leyó, copió la
 * fórmula entera con la palabra «comuna» dentro, y la pegó en el buscador de
 * arriba, que no es un buscador de internet sino el campo del titular.
 *
 * Fueron tres errores a la vez, y los tres estaban en el diseño. Los ejemplos
 * no se leían como ejemplos sino como un procedimiento obligatorio. Los puntos
 * separadores parecían parte de lo que hay que escribir. Y un bloque de texto
 * pegado a un campo de entrada invita a escribir ahí lo que dice el bloque.
 *
 * Ahora es un botón que abre los consejos, con el mismo formato de aviso que
 * ya se usaba para «se cae cuando». Eso también salió de ahí: que ese formato
 * rojizo funciona para marcar algo que aporta pero que no es un paso, y que
 * convenía repetirlo. Cada término va en su propia línea y en tipografía de
 * código, para que se vea que es algo que se teclea y no una frase que se lee.
 */
function ConsejosDeBusqueda({
  como,
}: {
  como: { terminos: string[]; donde: string; queNotaSirve: string };
}) {
  const [abierto, ponerAbierto] = useState(false);

  return (
    <div className="mt-3">
      <button
        type="button"
        onClick={() => ponerAbierto(!abierto)}
        aria-expanded={abierto}
        className="min-h-11 rounded-full border border-[var(--tierra-300)]/40 px-4 text-sm text-[var(--tierra-300)] transition hover:bg-[var(--tierra-300)]/[0.08]"
      >
        {abierto ? "Cerrar los consejos" : "Consejos para buscar noticias"}
      </button>

      {abierto && (
        <div className="mt-3 rounded-xl border border-[var(--tierra-300)]/30 bg-[var(--tierra-300)]/[0.06] px-4 py-3.5 text-[var(--tierra-300)]">
          <p className="text-[15px] leading-relaxed">
            Esto se busca en Google, no aquí arriba. Estos son ejemplos: cambia
            «comuna» por el nombre de la tuya.
          </p>

          <ul className="mt-3 space-y-1.5">
            {como.terminos.map((t) => (
              <li
                key={t}
                className="rounded-lg bg-[var(--tierra-300)]/[0.1] px-3 py-2 font-mono text-[13px] leading-relaxed"
              >
                {t}
              </li>
            ))}
          </ul>

          <p className="mt-3.5 text-[15px] leading-relaxed">
            <span className="font-medium">Dónde buscar:</span> {como.donde}
          </p>
          <p className="mt-1.5 text-[15px] leading-relaxed">
            <span className="font-medium">Qué noticia sirve:</span>{" "}
            {como.queNotaSirve}
          </p>

          {/* Los operadores los pidió ella y son lo que de verdad cambia una
              búsqueda. Van al final porque son para quien ya buscó una vez y
              se ahogó en resultados. */}
          <div className="mt-3.5 border-t border-[var(--tierra-300)]/25 pt-3">
            <p className="text-[15px] font-medium">
              Tres cosas que acotan mucho la búsqueda
            </p>
            <ul className="mt-2 space-y-2 text-[15px] leading-relaxed">
              <li>
                <span className="font-mono text-[13px]">"entre comillas"</span>{" "}
                busca esa frase exacta y no las palabras sueltas.
              </li>
              <li>
                <span className="font-mono text-[13px]">site:bcn.cl</span>{" "}
                busca solo dentro de ese sitio. Sirve para municipios, diarios
                regionales y servicios públicos.
              </li>
              <li>
                <span className="font-mono text-[13px]">-futbol</span> con guion
                delante saca del resultado las noticias que traen esa palabra.
                Útil cuando tu comuna se llama igual que otra cosa.
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

/** Lo que el curso tiene que sacar en limpio antes de seguir. */
function QueSacanDeAhi() {
  return (
    <div className="mt-6 border-t border-[var(--crema)]/12 pt-5">
      <p className="rotulo text-[var(--crema)]/75">
        Qué tiene que pasar en esa primera clase
      </p>
      <ul className="mt-3 space-y-3">
        {QUE_SACAN_DE_LA_NOTICIA.map((q) => (
          <li key={q.titulo}>
            <p className="text-[17px] leading-snug text-[var(--crema-clara)]">
              {q.titulo}
            </p>
            <p className="mt-1 text-[15px] leading-relaxed text-[var(--crema)]/82">
              {q.queEs}
            </p>
            <p className="mt-1 text-[15px] leading-relaxed text-[var(--crema)]/72">
              Se nota en que {q.seNotaEn}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
