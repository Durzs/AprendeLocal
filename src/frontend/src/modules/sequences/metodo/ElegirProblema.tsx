import { useState } from "react";

import { Hoja, Parrafo, Texto } from "../crear/Campos";
import type { ActividadPropia, Expedicion } from "../crear/expedicion";
import {
  ASIGNATURAS,
  FAMILIAS_PROBLEMA,
  PROBLEMAS,
  QUE_SACAN_DE_LA_NOTICIA,
  angulosDe,
  nombreAsignatura,
  problemaPorId,
  type Angulo,
  type Problema,
} from "./problemas";
import SelectorOA from "../crear/SelectorOA";
import {
  NOMBRE_ASIGNATURA_OA,
  buscarOA,
  type AsignaturaOA,
  type NivelOA,
} from "../crear/oa";

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

  // La actividad enfocada puede ser una escrita por el docente. Las del
  // catálogo se identifican por su asignatura y las propias por su id, así que
  // se busca en las dos listas con el mismo dato.
  const propiaActiva =
    e.actividadesPropias.find((a) => a.id === enfocada) ?? null;
  const propiasVisibles = e.actividadesPropias.filter(
    (a) => !e.asignaturas.length || e.asignaturas.includes(a.asignatura)
  );

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
    ...new Set(
      propiaActiva
        ? propiaActiva.oa
        : activa
          ? activa.oaQueAbre
          : [
              ...angulos.flatMap((a) => a.oaQueAbre),
              ...propiasVisibles.flatMap((a) => a.oa),
            ]
    ),
  ].filter((cod) => {
    const oa = buscarOA(cod);
    return oa && (niveles.size === 0 || niveles.has(oa.nivel));
  });

  return (
    <Hoja titulo="La problemática y su anclaje curricular" orden={orden}>
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
          onCambio={onCambio}
          elegido={elegido}
          angulos={angulos}
          enfocada={enfocada}
          ponerEnfocada={ponerEnfocada}
        />

        <ColumnaObjetivos
          e={e}
          set={set}
          hayProblema={Boolean(
            elegido || e.problemaPropioNombre.trim() || e.problemaPropio.trim()
          )}
          codigos={codigos}
          actividad={activa}
          nombrePropia={propiaActiva ? nombreAsignatura(propiaActiva.asignatura) : null}
          verTodos={verTodos}
          ponerVerTodos={ponerVerTodos}
        />
      </div>

      {elegido && !proponiendo && (
        <Noticias e={e} onCambio={onCambio} problema={elegido} />
      )}

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
  const [familiaAbierta, ponerFamiliaAbierta] = useState<string | null>(null);

  return (
    <Columna
      n={1}
      titulo="La problemática local"
      bajada="Algo que está ocurriendo y de lo que ya se escribió."
    >
      {/* Agrupadas en cuatro familias. Diez botones seguidos son diez cosas
          que hay que leer enteras para elegir una, y a la décima ya nadie está
          leyendo. Cuatro se abarcan de una mirada, y la familia se abre sola
          cuando ya hay una problemática elegida dentro. */}
      <ul className="space-y-2">
        {FAMILIAS_PROBLEMA.map((f) => {
          const suyas = PROBLEMAS.filter((p) => p.familia === f.id);
          const tieneLaElegida = suyas.some(
            (p) => p.id === e.problemaId && !proponiendo
          );
          const abierta = familiaAbierta === f.id || tieneLaElegida;
          return (
            <li key={f.id} className="overflow-hidden rounded-lg border border-[var(--crema)]/12">
              <button
                type="button"
                onClick={() => ponerFamiliaAbierta(abierta ? null : f.id)}
                aria-expanded={abierta}
                className="flex min-h-11 w-full items-baseline gap-2.5 px-3.5 py-2.5 text-left transition hover:bg-[var(--crema)]/[0.04]"
              >
                <span className="min-w-0 flex-1">
                  <span
                    className={`block text-[15px] leading-snug ${
                      tieneLaElegida
                        ? "text-[var(--tierra-300)]"
                        : "text-[var(--crema-clara)]"
                    }`}
                  >
                    {f.nombre}
                  </span>
                  {!abierta && (
                    <span className="mt-1 block text-sm leading-relaxed text-[var(--crema)]/70">
                      {f.deQueVa}
                    </span>
                  )}
                </span>
                <span aria-hidden className="shrink-0 text-[var(--crema)]/40">
                  {abierta ? "\u2212" : "+"}
                </span>
              </button>

              {abierta && (
                <ul className="border-t border-[var(--crema)]/10 p-2">
                  {suyas.map((p) => {
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
                          className={`min-h-11 w-full rounded-lg border px-3 py-2 text-left text-[15px] leading-snug transition ${
                            activo
                              ? "border-[var(--tierra-600)] bg-[var(--tierra-600)]/[0.12] text-[var(--tierra-300)]"
                              : "border-transparent text-[var(--crema-clara)] hover:border-[var(--crema)]/25"
                          }`}
                        >
                          {p.nombre}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
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
          {/* El nombre va aparte de la descripción porque es lo que después
              encabeza la hoja que firma la dirección, los dos permisos y la
              ruta. Con un solo cuadro de texto acababa encabezando el papeleo
              un párrafo entero. */}
          <label className="block">
            <span className="text-sm text-[var(--crema)]/75">
              Cómo se llama, en pocas palabras
            </span>
            <Texto
              value={e.problemaPropioNombre}
              onChange={(ev) => set("problemaPropioNombre", ev.target.value)}
              placeholder="Polvo de la planta de áridos"
            />
          </label>

          <label className="mt-3 block">
            <span className="text-sm text-[var(--crema)]/75">Qué está pasando</span>
            <Parrafo
              value={e.problemaPropio}
              onChange={(ev) => set("problemaPropio", ev.target.value)}
              placeholder="La planta de áridos levanta polvo todo el verano y las casas de al lado no pueden abrir las ventanas."
              rows={3}
            />
          </label>

          <p className="mt-2.5 text-sm leading-relaxed text-[var(--crema)]/72">
            Las actividades y los objetivos los escribes tú en las columnas de
            al lado, con el mismo catálogo de objetivos que usan las demás.
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
  onCambio,
  elegido,
  angulos,
  enfocada,
  ponerEnfocada,
}: {
  e: Expedicion;
  set: <K extends keyof Expedicion>(k: K, v: Expedicion[K]) => void;
  onCambio: (e: Expedicion) => void;
  elegido: Problema | null;
  angulos: Angulo[];
  enfocada: string | null;
  ponerEnfocada: (v: string | null) => void;
}) {
  const hayProblema = Boolean(elegido || e.problemaPropio.trim() || e.problemaPropioNombre.trim());
  const [editando, ponerEditando] = useState<string | null>(null);

  /**
   * Guarda la actividad, y sus objetivos con ella.
   *
   * Esto último faltaba, y era el peor desajuste del cuaderno. El docente
   * escribía su actividad, marcaba ahí los objetivos que cubre, guardaba, y el
   * resto de la aplicación seguía diciendo que no tenía ninguno: el contador
   * del escritorio, los indicadores, la hoja que firma la dirección y los dos
   * permisos de la salida leen `e.oa`, y los de la actividad se quedaban
   * dentro de ella. Para que aparecieran había que volver a elegirlos uno por
   * uno en la columna de la derecha, cosa que nadie podía adivinar.
   *
   * Se unen y no se reemplazan: puede haber objetivos marcados que no vienen
   * de ninguna actividad propia, y guardar una no es motivo para borrárselos.
   */
  function guardar(a: ActividadPropia) {
    const existe = e.actividadesPropias.some((x) => x.id === a.id);
    onCambio({
      ...e,
      actividadesPropias: existe
        ? e.actividadesPropias.map((x) => (x.id === a.id ? a : x))
        : [...e.actividadesPropias, a],
      oa: [...new Set([...e.oa, ...a.oa])],
    });
  }

  function borrar(id: string) {
    onCambio({
      ...e,
      actividadesPropias: e.actividadesPropias.filter((x) => x.id !== id),
    });
    if (enfocada === id) ponerEnfocada(null);
    if (editando === id) ponerEditando(null);
  }

  /** Copia una actividad del catálogo a las propias, para poder ajustarla. */
  function ajustar(a: Angulo) {
    const id = `propia-${Date.now()}`;
    guardar({
      id,
      asignatura: a.asignatura,
      enfoque: a.enfoque,
      queInvestigan: a.queInvestigan,
      conceptos: [...a.conceptosClave],
      oa: [...a.oaQueAbre],
    });
    ponerEditando(id);
    ponerEnfocada(id);
  }

  if (!hayProblema) {
    return (
      <Columna
        n={2}
        titulo="Actividades por asignatura"
        bajada="La misma problemática abre trabajos distintos según desde dónde se entre."
      >
        <p className="text-[15px] leading-relaxed text-[var(--crema)]/72">
          Elige una problemática en la columna de la izquierda y aquí aparecen
          las actividades sugeridas para cada asignatura.
        </p>
      </Columna>
    );
  }

  return (
    <Columna
      n={2}
      titulo="Actividades por asignatura"
      bajada="Elige una actividad y a la derecha quedan sus objetivos de aprendizaje."
    >
      {/* El filtro de asignaturas va aquí, pegado a lo que filtra, y no suelto
          arriba como estaba: así se entiende que lo que hace es recortar esta
          columna. */}
      <ul className="mb-3.5 flex flex-wrap gap-1.5">
        {ASIGNATURAS.map((a) => {
          const marcada = e.asignaturas.includes(a.id);
          const hayAngulo =
            elegido?.angulos.some((x) => x.asignatura === a.id) ?? false;
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

      {/* Primero las propias: si el docente escribió una, es la que le importa. */}
      {e.actividadesPropias.length > 0 && (
        <ul className="mb-3 space-y-2.5">
          {e.actividadesPropias
            .filter(
              (a) => !e.asignaturas.length || e.asignaturas.includes(a.asignatura)
            )
            .map((a) =>
              editando === a.id ? (
                <li key={a.id}>
                  <FormularioActividad
                    inicial={a}
                    cursos={e.cursos}
                    onGuardar={(v) => {
                      guardar(v);
                      ponerEditando(null);
                    }}
                    onCancelar={() => ponerEditando(null)}
                    onBorrar={() => borrar(a.id)}
                  />
                </li>
              ) : (
                <li key={a.id}>
                  <div
                    className={`rounded-lg border px-3.5 py-3 transition ${
                      enfocada === a.id
                        ? "border-[var(--tierra-600)] bg-[var(--tierra-600)]/[0.1]"
                        : "border-[var(--crema)]/12"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => ponerEnfocada(enfocada === a.id ? null : a.id)}
                      aria-pressed={enfocada === a.id}
                      className="w-full text-left"
                    >
                      <span className="rotulo block text-[var(--crema)]/72">
                        {nombreAsignatura(a.asignatura)} · tuya
                      </span>
                      <span
                        className={`mt-1.5 block text-[15px] leading-snug ${
                          enfocada === a.id
                            ? "text-[var(--tierra-300)]"
                            : "text-[var(--crema-clara)]"
                        }`}
                      >
                        {a.enfoque || "Sin título todavía"}
                      </span>
                      {a.queInvestigan && (
                        <span className="mt-2 block text-sm leading-relaxed text-[var(--crema)]/78">
                          {a.queInvestigan}
                        </span>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => ponerEditando(a.id)}
                      className="mt-2 min-h-11 text-sm text-[var(--crema)]/75 underline decoration-[var(--crema)]/30 underline-offset-4 hover:text-[var(--crema-clara)]"
                    >
                      Editar
                    </button>
                  </div>
                </li>
              )
            )}
        </ul>
      )}

      {/* Las del catálogo. Cada una se puede copiar a las propias para
          ajustarla, que es la manera de editarlas sin tocar el catálogo ni
          perder lo que proponía. */}
      <ul className="space-y-2.5">
        {angulos.map((a) => {
          const activa = enfocada === a.asignatura;
          return (
            <li key={a.asignatura}>
              <div
                className={`rounded-lg border transition ${
                  activa
                    ? "border-[var(--tierra-600)] bg-[var(--tierra-600)]/[0.1]"
                    : "border-[var(--crema)]/12 hover:border-[var(--crema)]/30"
                }`}
              >
                <button
                  type="button"
                  onClick={() => ponerEnfocada(activa ? null : a.asignatura)}
                  aria-pressed={activa}
                  className="w-full px-3.5 py-3 text-left"
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
                {activa && (
                  <button
                    type="button"
                    onClick={() => ajustar(a)}
                    className="mb-3 ml-3.5 min-h-11 text-sm text-[var(--crema)]/75 underline decoration-[var(--crema)]/30 underline-offset-4 hover:text-[var(--crema-clara)]"
                  >
                    Ajustar esta actividad
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      {editando === "nueva" ? (
        <div className="mt-3">
          <FormularioActividad
            inicial={{
              id: `propia-${Date.now()}`,
              asignatura: e.asignaturas[0] ?? "biologia",
              enfoque: "",
              queInvestigan: "",
              conceptos: [],
              oa: [],
            }}
            cursos={e.cursos}
            onGuardar={(v) => {
              guardar(v);
              ponerEditando(null);
              ponerEnfocada(v.id);
            }}
            onCancelar={() => ponerEditando(null)}
          />
        </div>
      ) : (
        <button
          type="button"
          onClick={() => ponerEditando("nueva")}
          className="mt-3 min-h-11 w-full rounded-lg border border-dashed border-[var(--crema)]/25 px-3.5 text-sm text-[var(--crema)]/85 transition hover:border-[var(--crema)]/45"
        >
          Escribir una actividad mía
        </button>
      )}
    </Columna>
  );
}

/**
 * El formulario de una actividad escrita por el docente.
 *
 * Pide lo mismo que tiene una del catálogo y en el mismo orden, para que una
 * actividad propia llegue a la hoja de dirección igual de completa que una
 * propuesta: qué se persigue, qué averiguan, qué contenidos hacen falta y qué
 * objetivos cubre.
 *
 * Los objetivos se eligen del mismo catálogo de 353 y no se escriben a mano,
 * por lo mismo que en el resto de la aplicación: un código tecleado a ojo
 * acaba impreso en un papel que se firma.
 */
function FormularioActividad({
  inicial,
  cursos,
  onGuardar,
  onCancelar,
  onBorrar,
}: {
  inicial: ActividadPropia;
  cursos: string[];
  onGuardar: (a: ActividadPropia) => void;
  onCancelar: () => void;
  onBorrar?: () => void;
}) {
  const [a, ponerA] = useState<ActividadPropia>(inicial);
  const [conceptos, ponerConceptos] = useState(inicial.conceptos.join(", "));

  const listo = a.enfoque.trim().length > 0;

  return (
    <div className="space-y-3 rounded-lg border border-[var(--tierra-600)]/50 bg-[var(--tierra-600)]/[0.06] p-3.5">
      <label className="block">
        <span className="text-sm text-[var(--crema)]/75">Asignatura</span>
        <select
          value={a.asignatura}
          onChange={(ev) => ponerA({ ...a, asignatura: ev.target.value })}
          className="mt-1.5 min-h-11 w-full rounded-lg border border-[var(--crema)]/20 bg-[var(--fondo)] px-3 py-2.5 text-[15px] text-[var(--crema-clara)]"
        >
          {ASIGNATURAS.map((x) => (
            <option key={x.id} value={x.id}>
              {x.nombre}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="text-sm text-[var(--crema)]/75">
          Qué se persigue, en una frase
        </span>
        <Texto
          value={a.enfoque}
          onChange={(ev) => ponerA({ ...a, enfoque: ev.target.value })}
          placeholder="Medición del polvo depositado en las ventanas"
        />
      </label>

      <label className="block">
        <span className="text-sm text-[var(--crema)]/75">Qué averiguan</span>
        <Parrafo
          value={a.queInvestigan}
          onChange={(ev) => ponerA({ ...a, queInvestigan: ev.target.value })}
          placeholder="Cuánto polvo se deposita en una semana, a tres distancias distintas de la planta."
          rows={2}
        />
      </label>

      <label className="block">
        <span className="text-sm text-[var(--crema)]/75">
          Contenidos, separados por coma
        </span>
        <Texto
          value={conceptos}
          onChange={(ev) => ponerConceptos(ev.target.value)}
          placeholder="material particulado, muestra, promedio"
        />
      </label>

      <div>
        <span className="text-sm text-[var(--crema)]/75">
          Objetivos de Aprendizaje que cubre
        </span>
        <div className="mt-1.5">
          <SelectorOA
            cursos={cursos}
            elegidos={a.oa}
            onElegir={(v) => ponerA({ ...a, oa: v })}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          disabled={!listo}
          onClick={() =>
            onGuardar({
              ...a,
              conceptos: conceptos
                .split(",")
                .map((c: string) => c.trim())
                .filter(Boolean),
            })
          }
          className="min-h-11 rounded-full bg-[var(--tierra-600)] px-5 text-sm font-medium text-[#1e2a24] transition hover:brightness-110 disabled:opacity-50"
        >
          Guardar
        </button>
        <button
          type="button"
          onClick={onCancelar}
          className="min-h-11 text-sm text-[var(--crema)]/75 hover:text-[var(--crema-clara)]"
        >
          Cancelar
        </button>
        {onBorrar && (
          <button
            type="button"
            onClick={onBorrar}
            className="ml-auto min-h-11 text-sm text-[var(--crema)]/70 hover:text-[var(--tierra-300)]"
          >
            Borrar
          </button>
        )}
      </div>
    </div>
  );
}

/* ── 3 · Los Objetivos de Aprendizaje ───────────────────────────────────── */

function ColumnaObjetivos({
  e,
  set,
  hayProblema,
  codigos,
  actividad,
  nombrePropia,
  verTodos,
  ponerVerTodos,
}: {
  e: Expedicion;
  set: <K extends keyof Expedicion>(k: K, v: Expedicion[K]) => void;
  hayProblema: boolean;
  codigos: string[];
  actividad: Angulo | null;
  /** Si lo enfocado es una actividad del docente, su asignatura. */
  nombrePropia: string | null;
  verTodos: boolean;
  ponerVerTodos: (v: boolean) => void;
}) {
  /**
   * Los sugeridos que todavía no están marcados. Son los que pueblan el
   * desplegable; los marcados salen de él y pasan a la lista de abajo, para
   * que no aparezcan en los dos sitios a la vez.
   */
  const porMarcar = codigos.filter((c) => !e.oa.includes(c));

  /**
   * Los sugeridos repartidos por asignatura, en el orden del catálogo.
   *
   * Una actividad puede abrir objetivos de tres asignaturas a la vez: la de
   * matemática que mide el consumo abre los de datos, pero también los de
   * ciencias sobre el agua. En una lista plana no se distingue cuál es de
   * cuál, y el desplegable los separa.
   */
  const porAsignatura = (() => {
    const grupos = new Map<AsignaturaOA, string[]>();
    for (const cod of porMarcar) {
      const oa = buscarOA(cod);
      if (!oa) continue;
      const lista = grupos.get(oa.asignatura) ?? [];
      lista.push(cod);
      grupos.set(oa.asignatura, lista);
    }
    return [...grupos.entries()].sort((a, b) =>
      NOMBRE_ASIGNATURA_OA[a[0]].localeCompare(NOMBRE_ASIGNATURA_OA[b[0]])
    );
  })();

  return (
    <Columna
      n={3}
      titulo="Objetivos de Aprendizaje"
      bajada={
        nombrePropia
          ? `Los que marcaste en tu actividad de ${nombrePropia.toLowerCase()}.`
          : actividad
            ? `Los que cubre la actividad de ${nombreAsignatura(actividad.asignatura).toLowerCase()}.`
            : "Primero la actividad y después el objetivo, que es como se planifica de verdad."
      }
    >
      {!hayProblema ? (
        <p className="text-[15px] leading-relaxed text-[var(--crema)]/72">
          Aquí aparecen los Objetivos de Aprendizaje que cubre cada actividad,
          para marcarlos sin salir de esta pantalla.
        </p>
      ) : (
        <>
          {/* El desplegable en vez de la pila de tarjetas. Eran hasta cinco
              recuadros con el texto completo del objetivo, que en una columna
              estrecha son dos pantallas de lectura para elegir uno. */}
          {porMarcar.length > 0 ? (
            <label className="block">
              <span className="text-sm text-[var(--crema)]/75">
                {actividad
                  ? "Sugeridos para esta actividad"
                  : "Sugeridos para las actividades a la vista"}
              </span>
              <select
                value=""
                onChange={(ev) => {
                  if (!ev.target.value) return;
                  set("oa", [...e.oa, ev.target.value]);
                }}
                className="mt-2 min-h-11 w-full rounded-lg border border-[var(--crema)]/20 bg-[var(--fondo)] px-3 py-2.5 text-[15px] text-[var(--crema-clara)]"
              >
                <option value="">
                  Elegir uno de los {porMarcar.length}…
                </option>
                {/* Agrupados por asignatura. Una actividad puede abrir
                    objetivos de tres asignaturas a la vez, y en una lista
                    plana no se distingue cuál es de cuál. */}
                {porAsignatura.map(([asig, cods]) => (
                  <optgroup key={asig} label={NOMBRE_ASIGNATURA_OA[asig]}>
                    {cods.map((cod) => {
                      const oa = buscarOA(cod);
                      return (
                        <option key={cod} value={cod}>
                          {cod} · {recortar(oa?.texto ?? "", 85)}
                        </option>
                      );
                    })}
                  </optgroup>
                ))}
              </select>
            </label>
          ) : (
            <p className="text-[15px] leading-relaxed text-[var(--crema)]/72">
              {codigos.length
                ? "Ya marcaste todos los sugeridos para esto."
                : nombrePropia
                  ? "Tu actividad todavía no tiene objetivos. Búscalos abajo y quedan guardados en ella."
                  : "Las actividades a la vista son de asignaturas o cursos sin objetivos cargados. Búscalos abajo o escríbelos en la planificación."}
            </p>
          )}

          {/* Lo marcado, con su texto completo: aquí sí hace falta leerlo
              entero, porque es lo que va a la hoja que firma la dirección. */}
          {e.oa.length > 0 && (
            <ul className="mt-3.5 space-y-2">
              {e.oa.map((cod) => {
                const oa = buscarOA(cod);
                return (
                  <li
                    key={cod}
                    className="rounded-lg border border-[var(--tierra-600)]/50 bg-[var(--tierra-600)]/[0.1] px-3.5 py-2.5"
                  >
                    <div className="flex items-baseline gap-2">
                      <span className="font-mono text-xs text-[var(--tierra-300)]">
                        {cod}
                      </span>
                      <button
                        type="button"
                        onClick={() => set("oa", e.oa.filter((x) => x !== cod))}
                        className="ml-auto min-h-11 shrink-0 px-1 text-sm text-[var(--crema)]/70 hover:text-[var(--tierra-300)]"
                      >
                        Quitar
                      </button>
                    </div>
                    <p className="text-[15px] leading-relaxed text-[var(--crema)]/85">
                      {oa?.texto ?? cod}
                    </p>
                  </li>
                );
              })}
            </ul>
          )}
        </>
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
        {verTodos ? "Cerrar el buscador" : "Buscar entre todos los objetivos"}
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
    </Columna>
  );
}

/** El texto del objetivo, cortado para que quepa en una línea del desplegable. */
function recortar(texto: string, largo: number): string {
  return texto.length <= largo ? texto : `${texto.slice(0, largo - 1).trimEnd()}…`;
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
