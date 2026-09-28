import { useState } from "react";

import { Hoja, Parrafo, Texto } from "../crear/Campos";
import type { ActividadPropia, Expedicion } from "../crear/expedicion";
import {
  angulosDe,
  nombreAsignatura,
  type Angulo,
  type Problema,
} from "./problemas";
import SelectorOA from "../crear/SelectorOA";
import { useContenido } from "../contenido";
import { buscarObjetivo } from "../contenido/curriculo";
import { useTx } from "../../../shared/tx";

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
  const tx = useTx();
  const c = useContenido();

  const set = <K extends keyof Expedicion>(k: K, v: Expedicion[K]) =>
    onCambio({ ...e, [k]: v });

  // Solo las de esta edición: un id guardado de la otra no se muestra.
  const elegido = (e.problemaId ? c.problemas.find((p) => p.id === e.problemaId) : null) ?? null;
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
  const niveles = new Set(e.cursos.filter((x) => c.cursos.includes(x)));
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
    const oa = buscarObjetivo(cod);
    return oa && (niveles.size === 0 || oa.cursos.some((x) => niveles.has(x)));
  });

  return (
    <Hoja
      titulo={tx("La problemática y su anclaje curricular", "A problemática e a sua ligação com o currículo")}
      orden={orden}
    >
      <p className="mb-5 max-w-3xl text-[15px] leading-relaxed text-[var(--crema)]/82">
        {tx(
          "Un proyecto empieza por algo que está pasando, no por un tema. Las tres columnas se leen de izquierda a derecha: el problema, lo que se puede hacer con él desde cada asignatura, y los objetivos del programa que esa actividad abre.",
          "Um projeto começa por algo que está acontecendo, não por um tema. As três colunas se leem da esquerda para a direita: o problema, o que dá para fazer com ele a partir de cada componente, e as habilidades da BNCC que essa atividade abre."
        )}
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
  const tx = useTx();
  const c = useContenido();

  return (
    <Columna
      n={1}
      titulo={tx("La problemática local", "A problemática local")}
      bajada={tx(
        "Algo que está ocurriendo y de lo que ya se escribió.",
        "Algo que está acontecendo e sobre o que já se escreveu."
      )}
    >
      {/* Agrupadas en cuatro familias. Diez botones seguidos son diez cosas
          que hay que leer enteras para elegir una, y a la décima ya nadie está
          leyendo. Cuatro se abarcan de una mirada, y la familia se abre sola
          cuando ya hay una problemática elegida dentro. */}
      <ul className="space-y-2">
        {c.familias.map((f) => {
          const suyas = c.problemas.filter((p) => p.familia === f.id);
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
            ? "border-[var(--acento)] bg-[var(--acento)] text-white"
            : "border-dashed border-[var(--crema)]/25 text-[var(--crema)]/85 hover:border-[var(--crema)]/45"
        }`}
      >
        {tx("Ninguna: la mía es otra", "Nenhuma: a minha é outra")}
      </button>

      {proponiendo && (
        <div className="mt-3">
          {/* El nombre va aparte de la descripción porque es lo que después
              encabeza la hoja que firma la dirección, los dos permisos y la
              ruta. Con un solo cuadro de texto acababa encabezando el papeleo
              un párrafo entero. */}
          <label className="block">
            <span className="text-sm text-[var(--crema)]/75">
              {tx("Cómo se llama, en pocas palabras", "Como se chama, em poucas palavras")}
            </span>
            <Texto
              value={e.problemaPropioNombre}
              onChange={(ev) => set("problemaPropioNombre", ev.target.value)}
              placeholder={tx("Polvo de la planta de áridos", "Poeira da obra da avenida")}
            />
          </label>

          <label className="mt-3 block">
            <span className="text-sm text-[var(--crema)]/75">
              {tx("Qué está pasando", "O que está acontecendo")}
            </span>
            <Parrafo
              value={e.problemaPropio}
              onChange={(ev) => set("problemaPropio", ev.target.value)}
              placeholder={tx(
                "La planta de áridos levanta polvo todo el verano y las casas de al lado no pueden abrir las ventanas.",
                "A obra levanta poeira o verão inteiro e as casas vizinhas não conseguem abrir as janelas."
              )}
              rows={3}
            />
          </label>

          <p className="mt-2.5 text-sm leading-relaxed text-[var(--crema)]/72">
            {tx(
              "Las actividades y los objetivos los escribes tú en las columnas de al lado, con el mismo catálogo de objetivos que usan las demás.",
              "As atividades e as habilidades você escreve nas colunas ao lado, com a mesma lista de habilidades que as outras usam."
            )}
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
                ? tx("1 noticia respalda este problema.", "1 fonte sustenta este problema.")
                : tx(
                    `${elegido.respaldo.length} noticias respaldan este problema.`,
                    `${elegido.respaldo.length} fontes sustentam este problema.`
                  )}{" "}
              {tx("Están más abajo, con su medio y su fecha.", "Estão mais abaixo, com o veículo e a data.")}
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
  const tx = useTx();
  const c = useContenido();
  const [editando, ponerEditando] = useState<string | null>(null);
  // El identificador de la actividad que se está escribiendo. Se saca al
  // tocar el botón y no al pintar el formulario, que se pinta muchas veces.
  const [idNueva, ponerIdNueva] = useState("");

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
        titulo={tx("Actividades por asignatura", "Atividades por componente")}
        bajada={tx(
          "La misma problemática abre trabajos distintos según desde dónde se entre.",
          "A mesma problemática abre trabalhos diferentes conforme por onde se entra."
        )}
      >
        <p className="text-[15px] leading-relaxed text-[var(--crema)]/72">
          {tx(
            "Elige una problemática en la columna de la izquierda y aquí aparecen las actividades sugeridas para cada asignatura.",
            "Escolha uma problemática na coluna da esquerda e aqui aparecem as atividades sugeridas para cada componente."
          )}
        </p>
      </Columna>
    );
  }

  return (
    <Columna
      n={2}
      titulo={tx("Actividades por asignatura", "Atividades por componente")}
      bajada={tx(
        "Elige una actividad y a la derecha quedan sus objetivos de aprendizaje.",
        "Escolha uma atividade e à direita ficam as habilidades que ela abre."
      )}
    >
      {/* El filtro de asignaturas va aquí, pegado a lo que filtra, y no suelto
          arriba como estaba: así se entiende que lo que hace es recortar esta
          columna. */}
      <ul className="mb-3.5 flex flex-wrap gap-1.5">
        {c.asignaturas.map((a) => {
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
                    ? "border-[var(--acento)] bg-[var(--acento)] text-white"
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
                        {nombreAsignatura(a.asignatura)} · {tx("tuya", "sua")}
                      </span>
                      <span
                        className={`mt-1.5 block text-[15px] leading-snug ${
                          enfocada === a.id
                            ? "text-[var(--tierra-300)]"
                            : "text-[var(--crema-clara)]"
                        }`}
                      >
                        {a.enfoque || tx("Sin título todavía", "Ainda sem título")}
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
                      {tx("Editar", "Editar")}
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
                          {tx("Contenidos", "Conteúdos")}: {a.conceptosClave.join(", ")}.
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
                    {tx("Ajustar esta actividad", "Ajustar esta atividade")}
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
              id: idNueva,
              asignatura: e.asignaturas[0] ?? c.asignaturas[0]?.id ?? "",
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
          onClick={() => {
            ponerIdNueva(`propia-${Date.now()}`);
            ponerEditando("nueva");
          }}
          className="mt-3 min-h-11 w-full rounded-lg border border-dashed border-[var(--crema)]/25 px-3.5 text-sm text-[var(--crema)]/85 transition hover:border-[var(--crema)]/45"
        >
          {tx("Escribir una actividad mía", "Escrever uma atividade minha")}
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
  const tx = useTx();
  const cont = useContenido();

  const listo = a.enfoque.trim().length > 0;

  return (
    <div className="space-y-3 rounded-lg border border-[var(--tierra-600)]/50 bg-[var(--tierra-600)]/[0.06] p-3.5">
      <label className="block">
        <span className="text-sm text-[var(--crema)]/75">{tx("Asignatura", "Componente")}</span>
        <select
          value={a.asignatura}
          onChange={(ev) => ponerA({ ...a, asignatura: ev.target.value })}
          className="mt-1.5 min-h-11 w-full rounded-lg border border-[var(--crema)]/20 bg-[var(--fondo)] px-3 py-2.5 text-[15px] text-[var(--crema-clara)]"
        >
          {cont.asignaturas.map((x) => (
            <option key={x.id} value={x.id}>
              {x.nombre}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="text-sm text-[var(--crema)]/75">
          {tx("Qué se persigue, en una frase", "O que se busca, numa frase")}
        </span>
        <Texto
          value={a.enfoque}
          onChange={(ev) => ponerA({ ...a, enfoque: ev.target.value })}
          placeholder={tx(
            "Medición del polvo depositado en las ventanas",
            "Medição da poeira acumulada nas janelas"
          )}
        />
      </label>

      <label className="block">
        <span className="text-sm text-[var(--crema)]/75">
          {tx("Qué averiguan", "O que investigam")}
        </span>
        <Parrafo
          value={a.queInvestigan}
          onChange={(ev) => ponerA({ ...a, queInvestigan: ev.target.value })}
          placeholder={tx(
            "Cuánto polvo se deposita en una semana, a tres distancias distintas de la planta.",
            "Quanta poeira se acumula em uma semana, a três distâncias diferentes da obra."
          )}
          rows={2}
        />
      </label>

      <label className="block">
        <span className="text-sm text-[var(--crema)]/75">
          {tx("Contenidos, separados por coma", "Conteúdos, separados por vírgula")}
        </span>
        <Texto
          value={conceptos}
          onChange={(ev) => ponerConceptos(ev.target.value)}
          placeholder={tx(
            "material particulado, muestra, promedio",
            "material particulado, amostra, média"
          )}
        />
      </label>

      <div>
        <span className="text-sm text-[var(--crema)]/75">
          {tx("Objetivos de Aprendizaje que cubre", "Habilidades que ela abre")}
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
          className="min-h-11 rounded-full bg-[var(--acento)] px-5 text-sm font-medium text-white transition hover:brightness-110 disabled:opacity-50"
        >
          {tx("Guardar", "Salvar")}
        </button>
        <button
          type="button"
          onClick={onCancelar}
          className="min-h-11 text-sm text-[var(--crema)]/75 hover:text-[var(--crema-clara)]"
        >
          {tx("Cancelar", "Cancelar")}
        </button>
        {onBorrar && (
          <button
            type="button"
            onClick={onBorrar}
            className="ml-auto min-h-11 text-sm text-[var(--crema)]/70 hover:text-[var(--tierra-300)]"
          >
            {tx("Borrar", "Apagar")}
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
  const tx = useTx();
  const cont = useContenido();
  const porMarcar = codigos.filter((x) => !e.oa.includes(x));

  /**
   * Los sugeridos repartidos por asignatura, en el orden del catálogo.
   *
   * Una actividad puede abrir objetivos de tres asignaturas a la vez: la de
   * matemática que mide el consumo abre los de datos, pero también los de
   * ciencias sobre el agua. En una lista plana no se distingue cuál es de
   * cuál, y el desplegable los separa.
   */
  const porAsignatura = (() => {
    const grupos = new Map<string, string[]>();
    for (const cod of porMarcar) {
      const oa = buscarObjetivo(cod);
      if (!oa) continue;
      const lista = grupos.get(oa.nombreAsignatura) ?? [];
      lista.push(cod);
      grupos.set(oa.nombreAsignatura, lista);
    }
    return [...grupos.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  })();

  return (
    <Columna
      n={3}
      titulo={cont.palabras.Objetivos}
      bajada={
        nombrePropia
          ? tx(
              `Los que marcaste en tu actividad de ${nombrePropia.toLowerCase()}.`,
              `As que você marcou na sua atividade de ${nombrePropia}.`
            )
          : actividad
            ? tx(
                `Los que cubre la actividad de ${nombreAsignatura(actividad.asignatura).toLowerCase()}.`,
                `As que a atividade de ${nombreAsignatura(actividad.asignatura)} abre.`
              )
            : tx(
                "Primero la actividad y después el objetivo, que es como se planifica de verdad.",
                "Primeiro a atividade e depois a habilidade, que é como se planeja de verdade."
              )
      }
    >
      {!hayProblema ? (
        <p className="text-[15px] leading-relaxed text-[var(--crema)]/72">
          {tx(
            "Aquí aparecen los Objetivos de Aprendizaje que cubre cada actividad, para marcarlos sin salir de esta pantalla.",
            "Aqui aparecem as habilidades que cada atividade abre, para marcá-las sem sair desta tela."
          )}
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
                  ? tx("Sugeridos para esta actividad", "Sugeridas para esta atividade")
                  : tx("Sugeridos para las actividades a la vista", "Sugeridas para as atividades à vista")}
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
                  {tx(`Elegir uno de los ${porMarcar.length}…`, `Escolher uma das ${porMarcar.length}…`)}
                </option>
                {/* Agrupados por asignatura. Una actividad puede abrir
                    objetivos de tres asignaturas a la vez, y en una lista
                    plana no se distingue cuál es de cuál. */}
                {porAsignatura.map(([asig, cods]) => (
                  <optgroup key={asig} label={asig}>
                    {cods.map((cod) => {
                      const oa = buscarObjetivo(cod);
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
                ? tx("Ya marcaste todos los sugeridos para esto.", "Você já marcou todas as sugeridas para isto.")
                : nombrePropia
                  ? tx(
                      "Tu actividad todavía no tiene objetivos. Búscalos abajo y quedan guardados en ella.",
                      "Sua atividade ainda não tem habilidades. Busque abaixo e elas ficam salvas nela."
                    )
                  : tx(
                      "Las actividades a la vista son de asignaturas o cursos sin objetivos cargados. Búscalos abajo o escríbelos en la planificación.",
                      "As atividades à vista são de componentes ou anos sem habilidades sugeridas. Busque abaixo ou anote no planejamento."
                    )}
            </p>
          )}

          {/* Lo marcado, con su texto completo: aquí sí hace falta leerlo
              entero, porque es lo que va a la hoja que firma la dirección. */}
          {e.oa.length > 0 && (
            <ul className="mt-3.5 space-y-2">
              {e.oa.map((cod) => {
                const oa = buscarObjetivo(cod);
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
                        {tx("Quitar", "Remover")}
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
        {verTodos
          ? tx("Cerrar el buscador", "Fechar a busca")
          : tx("Buscar entre todos los objetivos", "Buscar entre todas as habilidades")}
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
  problema: Problema;
}) {
  const [titular, ponerTitular] = useState("");
  const [url, ponerUrl] = useState("");
  const tx = useTx();
  const c = useContenido();

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
            {tx("Noticias nacionales sobre este problema", "Fontes sobre este problema")}
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-[var(--crema)]/75">
            {tx(
              "Las noticias de aquí arriba son de alcance nacional y sirven para plantear el asunto en la sala. Más abajo se pueden agregar noticias de tu comuna, que suelen enganchar más a un curso porque hablan de un lugar que conocen.",
              "Estas fontes servem para apresentar o assunto na sala. Mais abaixo dá para acrescentar notícias do seu bairro, que costumam envolver mais a turma porque falam de um lugar que eles conhecem."
            )}
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
          {tx(
            "Esta es la única sin fuentes nacionales, y no es un descuido: lo que se está dejando de saber en un pueblo no sale en ningún estudio, se sabe preguntando ahí.",
            "Esta não tem fontes publicadas, e não é descuido: há coisas que não saem em nenhum estudo e só se sabem perguntando no lugar."
          )}
        </p>
      )}

      <p className="mt-5 border-t border-[var(--crema)]/12 pt-4 rotulo text-[var(--crema)]/75">
        {tx("Noticias de tu comuna", "Notícias do seu bairro")}
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
                {tx("Quitar", "Remover")}
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
            placeholder={tx("El titular, tal como salió", "A manchete, como saiu")}
            aria-label={tx("Titular de la noticia", "Manchete da notícia")}
          />
          <Texto
            value={url}
            onChange={(ev) => ponerUrl(ev.target.value)}
            placeholder={tx("El enlace, si lo tienes", "O link, se tiver")}
            aria-label={tx("Enlace de la noticia", "Link da notícia")}
            type="url"
            inputMode="url"
          />
        </div>
        <button
          type="button"
          onClick={agregar}
          className="min-h-11 self-start rounded-full border border-[var(--crema)]/25 px-5 text-sm font-medium text-[var(--crema-clara)] transition hover:bg-[var(--crema)]/10"
        >
          {tx("Agregar", "Adicionar")}
        </button>
      </div>

      <div className="mt-4 border-t border-[var(--crema)]/12 pt-3.5">
        <p className="text-sm leading-relaxed text-[var(--crema)]/75">
          {tx(
            "Las noticias de cada comuna todavía no están cargadas en la plataforma, así que esas las agrega el docente.",
            "As notícias de cada bairro não estão na plataforma, então quem acrescenta é o professor."
          )}
        </p>
        <ConsejosDeBusqueda
          como={problema.comoSeBuscan}
          localidad={c.localidad}
          sitio={c.sitioEjemplo}
        />
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
  localidad,
  sitio,
}: {
  como: { terminos: string[]; donde: string; queNotaSirve: string };
  localidad: string;
  sitio: string;
}) {
  const [abierto, ponerAbierto] = useState(false);
  const tx = useTx();

  return (
    <div className="mt-3">
      <button
        type="button"
        onClick={() => ponerAbierto(!abierto)}
        aria-expanded={abierto}
        className="min-h-11 rounded-full border border-[var(--tierra-300)]/40 px-4 text-sm text-[var(--tierra-300)] transition hover:bg-[var(--tierra-300)]/[0.08]"
      >
        {abierto
          ? tx("Cerrar los consejos", "Fechar as dicas")
          : tx("Consejos para buscar noticias", "Dicas para buscar notícias")}
      </button>

      {abierto && (
        <div className="mt-3 rounded-xl border border-[var(--tierra-300)]/30 bg-[var(--tierra-300)]/[0.06] px-4 py-3.5 text-[var(--tierra-300)]">
          <p className="text-[15px] leading-relaxed">
            {tx(
              `Esto se busca en Google, no aquí arriba. Estos son ejemplos: cambia «${localidad}» por el nombre de la tuya.`,
              `Isto se busca no Google, não aqui em cima. São exemplos: troque «nome do ${localidad}» pelo nome do seu.`
            )}
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
            <span className="font-medium">{tx("Dónde buscar", "Onde buscar")}:</span> {como.donde}
          </p>
          <p className="mt-1.5 text-[15px] leading-relaxed">
            <span className="font-medium">{tx("Qué noticia sirve", "Que notícia serve")}:</span>{" "}
            {como.queNotaSirve}
          </p>

          {/* Los operadores los pidió ella y son lo que de verdad cambia una
              búsqueda. Van al final porque son para quien ya buscó una vez y
              se ahogó en resultados. */}
          <div className="mt-3.5 border-t border-[var(--tierra-300)]/25 pt-3">
            <p className="text-[15px] font-medium">
              {tx("Tres cosas que acotan mucho la búsqueda", "Três coisas que refinam muito a busca")}
            </p>
            <ul className="mt-2 space-y-2 text-[15px] leading-relaxed">
              <li>
                <span className="font-mono text-[13px]">
                  {tx('"entre comillas"', '"entre aspas"')}
                </span>{" "}
                {tx(
                  "busca esa frase exacta y no las palabras sueltas.",
                  "busca essa frase exata e não as palavras soltas."
                )}
              </li>
              <li>
                <span className="font-mono text-[13px]">{sitio}</span>{" "}
                {tx(
                  "busca solo dentro de ese sitio. Sirve para municipios, diarios regionales y servicios públicos.",
                  "busca só dentro desse site. Serve para a prefeitura, jornais locais e órgãos públicos."
                )}
              </li>
              <li>
                <span className="font-mono text-[13px]">{tx("-futbol", "-futebol")}</span>{" "}
                {tx(
                  "con guion delante saca del resultado las noticias que traen esa palabra. Útil cuando tu comuna se llama igual que otra cosa.",
                  "com o hífen na frente tira do resultado as notícias com essa palavra. Útil quando o seu bairro tem o nome de outra coisa."
                )}
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
  const tx = useTx();
  const c = useContenido();
  return (
    <div className="mt-6 border-t border-[var(--crema)]/12 pt-5">
      <p className="rotulo text-[var(--crema)]/75">
        {tx("Qué tiene que pasar en esa primera clase", "O que precisa acontecer nessa primeira aula")}
      </p>
      <ul className="mt-3 space-y-3">
        {c.queSacan.map((q) => (
          <li key={q.titulo}>
            <p className="text-[17px] leading-snug text-[var(--crema-clara)]">
              {q.titulo}
            </p>
            <p className="mt-1 text-[15px] leading-relaxed text-[var(--crema)]/82">
              {q.queEs}
            </p>
            <p className="mt-1 text-[15px] leading-relaxed text-[var(--crema)]/72">
              {tx("Se nota en que", "Nota-se quando")} {q.seNotaEn}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
