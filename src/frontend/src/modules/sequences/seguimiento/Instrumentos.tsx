/**
 * Un instrumento por etapa, y ninguno igual a otro.
 *
 * POR QUÉ NO SON SEIS VECES LA MISMA CASILLA
 *
 * Lo cómodo sería una lista de seis con un visto bueno al lado. Serviría para
 * saber cuántas van y para nada más, porque las seis etapas no terminan en la
 * misma clase de cosa. La primera termina con la sala partida en dos. La
 * tercera termina con gente que salió a un sitio y volvió con algo. La quinta
 * termina con una propuesta que se rehízo después de que la criticaran. Seguir
 * las tres con la misma casilla es decidir de antemano que no vale la pena
 * guardar en qué se diferencian.
 *
 * Cada instrumento toma prestada la forma que ya funciona para ese trabajo en
 * otras herramientas, y la trae con el vocabulario de la sala:
 *
 *   01 · La barra partida de una votación, para el curso dividido en dos.
 *   02 · La lista de comprobación previa, la de antes de despegar.
 *   03 · El registro de salida: fecha, puntos y lo que se trajo de cada uno.
 *   04 · La comparación de dos versiones, lado a lado: lo que creían y lo que
 *        encontraron. Con el sobre del primer día abriéndose aquí.
 *   05 · El historial de versiones, con el motivo de cada una.
 *   06 · El registro de a quién se le mandó algo y qué contestó.
 *
 * Todos escriben en `registro`, en §bitacora.ts, y ninguno escribe en el campo
 * de otro.
 */

import { Parrafo, Texto } from "../crear/Campos";
import type { Expedicion } from "../crear/expedicion";
import { formatoPorId } from "../metodo/formatos";
import { tecnicaPorId } from "../metodo/tecnicas";
import {
  agregarEntrega,
  agregarPunto,
  agregarVersion,
  cambiarEntrega,
  cambiarPunto,
  cambiarVersion,
  hojaDe,
  hoy,
  ponerRegistro,
  quitarEntrega,
  quitarPunto,
  quitarVersion,
  type Bitacora,
} from "./bitacora";

type Props = {
  e: Expedicion;
  b: Bitacora;
  onCambio: (b: Bitacora) => void;
  /**
   * Para lo poco que un instrumento escribe en la expedición y no en la
   * bitácora. Por ahora es solo la pregunta guía, que es del proyecto y no de
   * una etapa: sale en la 1 y se sigue leyendo en todas las demás.
   */
  onExpedicion: (e: Expedicion) => void;
};

/* ── Piezas compartidas ────────────────────────────────────────────────── */

function Rotulo({ children }: { children: React.ReactNode }) {
  return <p className="rotulo text-[var(--tierra-600)]">{children}</p>;
}

function Ayuda({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-[var(--crema)]/70">
      {children}
    </p>
  );
}

/** El botón de agregar una fila. Uno solo, para que las tres tablas coincidan. */
function Agregar({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-full border border-[var(--crema)]/20 px-4 text-sm text-[var(--crema)]/85 transition hover:border-[var(--crema)]/45 hover:text-[var(--crema-clara)]"
    >
      <span aria-hidden>+</span>
      {children}
    </button>
  );
}

/** Quitar una fila. Va sin confirmación: lo que se borra se vuelve a escribir. */
function Quitar({ onClick, que }: { onClick: () => void; que: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="min-h-11 shrink-0 px-2 text-lg leading-none text-[var(--crema)]/35 transition hover:text-[var(--tierra-300)]"
      title={`Quitar ${que}`}
    >
      <span aria-hidden>×</span>
      <span className="sr-only">Quitar {que}</span>
    </button>
  );
}

/**
 * Una ficha que se marca y se desmarca.
 *
 * Es un botón y no una casilla nativa por lo mismo que en el resto del
 * cuaderno: en el computador de una escuela la casilla mide doce píxeles y hay
 * que apuntarle. Un botón del alto de un dedo se acierta a la primera.
 */
function Marca({
  puesta,
  onClick,
  children,
}: {
  puesta: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={puesta}
      className={`flex min-h-11 items-center gap-2.5 rounded-full border px-4 text-sm transition ${
        puesta
          ? "border-[var(--tierra-600)] bg-[var(--tierra-600)]/15 text-[var(--tierra-300)]"
          : "border-[var(--crema)]/18 text-[var(--crema)]/80 hover:border-[var(--crema)]/40"
      }`}
    >
      <span
        aria-hidden
        className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border text-[11px] ${
          puesta
            ? "border-transparent bg-[var(--tierra-600)] text-[#1e2a24]"
            : "border-[var(--crema)]/30 text-transparent"
        }`}
      >
        ✓
      </span>
      {children}
    </button>
  );
}

/** Lo que se dice cuando el instrumento depende de algo que aún no está escrito. */
function Falta({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-xl border border-dashed border-[var(--crema)]/18 px-4 py-3 text-sm leading-relaxed text-[var(--crema)]/60">
      {children}
    </p>
  );
}

/* ── 01 · La problemática: el curso partido en dos ─────────────────────── */

/**
 * La barra de una votación, que aquí mide un desacuerdo.
 *
 * La etapa termina cuando hay dos bandos y los dos tienen un argumento. Eso no
 * se sabe con una casilla: se sabe escribiendo qué sostiene cada mitad y
 * cuántos hay en cada una. Con la barra al lado, un reparto de trece contra
 * uno se ve antes de leer nada, y trece contra uno suele querer decir que la
 * pregunta todavía se puede ganar conversando.
 *
 * Lo escrito aquí se guarda tapado hasta que el curso vuelve del terreno. Ahí
 * es donde sirve, y destaparlo antes convierte la salida en una confirmación
 * de lo que el curso ya pensaba. No se dice «hasta la etapa 4» en ninguna
 * parte: las etapas se han renumerado una vez y las frases con el número
 * dentro se quedaron mintiendo.
 */
export function InstrumentoProblematica({ e, b, onCambio, onExpedicion }: Props) {
  const r = hojaDe(b, "problematica").registro;
  const poner = (cambio: Partial<typeof r>) =>
    onCambio(ponerRegistro(b, "problematica", cambio));

  const a = r.cuantosA ?? 0;
  const c = r.cuantosB ?? 0;
  const total = a + c;
  const parejo = total > 0 && Math.abs(a - c) <= Math.max(2, Math.round(total * 0.25));

  return (
    <div>
      <Rotulo>La pregunta que los divide</Rotulo>
      <Ayuda>
        La que sale de leer la problemática con el curso, y la que van a
        repetir hasta el final. Debajo, qué sostiene cada mitad de la sala y
        cuántos hay en cada una: eso queda tapado hasta que vuelvan del
        terreno, que es donde se compara con lo que encontraron.
      </Ayuda>

      {/* La pregunta se escribe aquí y en ningún otro sitio.

          Hasta ahora se leía en ocho sitios —el escritorio, el título de la
          página del proyecto, esta misma tarjeta— y no había pantalla donde
          escribirla: se quedó sin dueño cuando se retiró la lámina de las
          preguntas propuestas. El escritorio decía «Falta la pregunta» para
          siempre y aquí salía un hueco donde debía ir lo que sostiene el
          proyecto entero.

          Va en la etapa 1 y no en el cuaderno porque es donde ocurre: la
          pregunta sale de leer la problemática con el curso, no de escribirla
          un domingo. Se puede cambiar después, que es lo que suele pasar la
          primera semana. */}
      <label className="mt-3 block">
        <span className="sr-only">La pregunta que sostiene el proyecto</span>
        <Texto
          value={e.preguntaGuia}
          onChange={(ev) => onExpedicion({ ...e, preguntaGuia: ev.target.value })}
          placeholder="¿Está contaminado el estero, o solo turbio porque arrastra tierra?"
        />
      </label>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Lado
          titulo="Los que creen que sí"
          razon={r.ladoA}
          cuantos={r.cuantosA}
          tope={e.estudiantes}
          onRazon={(v) => poner({ ladoA: v })}
          onCuantos={(v) => poner({ cuantosA: v })}
        />
        <Lado
          titulo="Los que creen que no"
          razon={r.ladoB}
          cuantos={r.cuantosB}
          tope={e.estudiantes}
          onRazon={(v) => poner({ ladoB: v })}
          onCuantos={(v) => poner({ cuantosB: v })}
        />
      </div>

      {/* La barra, con el reparto a la vista. Solo aparece cuando hay números
          que repartir: una barra al 0% ocupa el mismo sitio y no dice nada. */}
      {total > 0 && (
        <div className="mt-4">
          <div
            className="flex h-3 w-full overflow-hidden rounded-full bg-[var(--crema)]/10"
            role="img"
            aria-label={`${a} de un lado y ${c} del otro.`}
          >
            <span
              className="bg-[var(--tierra-600)] transition-all duration-500"
              style={{ width: `${(a / total) * 100}%` }}
            />
            <span
              className="bg-[var(--crema)]/45 transition-all duration-500"
              style={{ width: `${(c / total) * 100}%` }}
            />
          </div>
          <p className="mt-2.5 text-sm leading-relaxed text-[var(--crema)]/70">
            {a} contra {c}.{" "}
            {parejo ? (
              <span className="text-[var(--tierra-300)]">
                Repartido: hay algo que averiguar.
              </span>
            ) : (
              <span>
                Muy cargado a un lado. Cuando casi toda la sala cree lo mismo, la
                pregunta se puede ganar conversando y el terreno sobra; vale la
                pena buscar otra.
              </span>
            )}
          </p>
        </div>
      )}

      {/* El sobre. Cerrarlo no esconde nada al docente: dice en qué etapa se
          vuelve a abrir, que es lo que hace que valga la pena escribirlo. */}
      {(r.ladoA.trim() || r.ladoB.trim()) && (
        <p className="mt-4 rounded-xl border border-[var(--crema)]/14 px-4 py-3 text-sm leading-relaxed text-[var(--crema)]/70">
          {r.destapado
            ? "Ya se abrió con el curso."
            : "Guardado hasta la vuelta del terreno. Ahí se abre y se pone al lado de lo que encontraron."}
        </p>
      )}
    </div>
  );
}

/** Una de las dos mitades de la sala: su razón y cuántos son. */
function Lado({
  titulo,
  razon,
  cuantos,
  tope,
  onRazon,
  onCuantos,
}: {
  titulo: string;
  razon: string;
  cuantos: number | null;
  tope: number | null;
  onRazon: (v: string) => void;
  onCuantos: (v: number | null) => void;
}) {
  return (
    <div className="rounded-xl border border-[var(--crema)]/14 p-4">
      <label className="block">
        <span className="rotulo block text-[var(--crema)]/70">{titulo}</span>
        <Parrafo
          value={razon}
          onChange={(ev) => onRazon(ev.target.value)}
          placeholder="Su razón, con las palabras que usaron ellos."
        />
      </label>
      <label className="mt-3 flex items-center gap-3">
        <span className="text-sm text-[var(--crema)]/70">Cuántos</span>
        <input
          type="number"
          min={0}
          max={tope ?? 200}
          value={cuantos ?? ""}
          onChange={(ev) => onCuantos(ev.target.value ? Number(ev.target.value) : null)}
          className="w-20 rounded-lg border border-[var(--crema)]/20 bg-[var(--crema)]/[0.045] px-3 py-2 text-[15px] text-[var(--crema-clara)] outline-none focus:border-[var(--tierra-600)]"
        />
      </label>
    </div>
  );
}

/* ── 02 · El aula: la lista de antes de salir ──────────────────────────── */

/**
 * La lista de comprobación previa.
 *
 * Es la forma que usan las herramientas donde algo se rompe si se despega sin
 * revisar, y aquí es literal: la etapa 3 es salir a terreno, y salir sin haber
 * ensayado la técnica en la sala devuelve una hora perdida en la orilla de un
 * río con viento y un dato que no sirve. Es lo que más se salta, porque se
 * supone que un curso ya sabe usar un cuaderno o leer una tira de pH.
 *
 * Los conceptos y las técnicas no se escriben aquí: salen de lo que el docente
 * ya eligió en la segunda lámina. Volver a pedirlos sería pedir dos veces lo
 * mismo, y las dos listas se irían separando en cuanto cambiara una.
 */
export function InstrumentoAula({ e, b, onCambio }: Props) {
  const r = hojaDe(b, "aula").registro;
  const poner = (cambio: Partial<typeof r>) => onCambio(ponerRegistro(b, "aula", cambio));

  const alternar = (lista: string[], x: string) =>
    lista.includes(x) ? lista.filter((y) => y !== x) : [...lista, x];

  const listas = e.conceptos.length > 0 || e.tecnicas.length > 0;
  const tecnicasListas =
    e.tecnicas.length > 0 && e.tecnicas.every((t) => r.tecnicasEnsayadas.includes(t));

  if (!listas) {
    return (
      <Falta>
        Los conceptos y las técnicas salen de la segunda lámina del cuaderno.
        Cuando estén elegidos ahí, aparecen aquí para ir marcándolos a medida
        que se pasan.
      </Falta>
    );
  }

  return (
    <div className="space-y-5">
      {e.conceptos.length > 0 && (
        <div>
          <Rotulo>Conceptos pasados</Rotulo>
          <Ayuda>
            Los del programa que hacen falta para entender la problemática.
            Marca cada uno cuando se haya dado.
          </Ayuda>
          <ul className="mt-3 flex flex-wrap gap-2">
            {e.conceptos.map((c) => (
              <li key={c}>
                <Marca
                  puesta={r.conceptosVistos.includes(c)}
                  onClick={() => poner({ conceptosVistos: alternar(r.conceptosVistos, c) })}
                >
                  {c}
                </Marca>
              </li>
            ))}
          </ul>
        </div>
      )}

      {e.tecnicas.length > 0 && (
        <div>
          <Rotulo>Técnicas ensayadas en la sala</Rotulo>
          <Ayuda>
            Ensayadas sobre algo que no importe, antes de usarlas donde sí
            importa. Un vaso con tierra revuelta sirve igual que el río para
            aprender a leer la escala.
          </Ayuda>
          <ul className="mt-3 flex flex-wrap gap-2">
            {e.tecnicas.map((t) => (
              <li key={t}>
                <Marca
                  puesta={r.tecnicasEnsayadas.includes(t)}
                  onClick={() =>
                    poner({ tecnicasEnsayadas: alternar(r.tecnicasEnsayadas, t) })
                  }
                >
                  {tecnicaPorId(t)?.nombre ?? t}
                </Marca>
              </li>
            ))}
          </ul>

          {/* La puerta a la etapa 3, dicha y no cerrada. El docente decide
              cuándo sale su curso; lo que hace esto es que la decisión se tome
              sabiendo qué queda sin ensayar. */}
          <p
            className={`mt-4 rounded-xl border px-4 py-3 text-sm leading-relaxed ${
              tecnicasListas
                ? "border-[var(--tierra-600)]/35 bg-[var(--tierra-600)]/[0.08] text-[var(--tierra-300)]"
                : "border-[var(--crema)]/14 text-[var(--crema)]/70"
            }`}
          >
            {tecnicasListas
              ? "Todas ensayadas. El terreno puede abrirse."
              : (() => {
                  const faltan = e.tecnicas.filter(
                    (t) => !r.tecnicasEnsayadas.includes(t)
                  ).length;
                  return `${
                    faltan === 1 ? "Queda una técnica" : `Quedan ${faltan} técnicas`
                  } por ensayar. El terreno se puede abrir igual, y conviene saber con qué se sale.`;
                })()}
          </p>
        </div>
      )}
    </div>
  );
}

/* ── 03 · El terreno: el registro de la salida ─────────────────────────── */

/**
 * El registro de una salida: cuándo fue, dónde se paró y qué se trajo.
 *
 * La fecha se guarda porque «la salida fue el 12» es exactamente el dato que
 * falta cuando, un mes después, hay que escribir el informe y ya nadie se
 * acuerda. Y hay una casilla para el día que se corrió, porque en La Araucanía
 * la salida se suspende por lluvia y eso no es un incumplimiento: es un martes
 * de invierno, y queda escrito como lo que fue.
 *
 * Los puntos se agregan de a uno y con lo que salió de cada uno al lado. Tres
 * puntos con su hallazgo son la etapa 4 ya medio escrita; tres puntos sueltos
 * son una lista de lugares.
 */
export function InstrumentoTerreno({ e, b, onCambio }: Props) {
  const r = hojaDe(b, "terreno").registro;
  const poner = (cambio: Partial<typeof r>) =>
    onCambio(ponerRegistro(b, "terreno", cambio));

  const donde = e.puntoDeSalida.trim() || e.ubicacion.trim();

  return (
    <div>
      <Rotulo>La salida</Rotulo>
      {donde && (
        <Ayuda>
          El punto que escribiste en la ruta: {donde}
        </Ayuda>
      )}

      <div className="mt-3 flex flex-wrap items-end gap-4">
        <label className="block">
          <span className="rotulo block text-[var(--crema)]/70">Se salió el</span>
          <input
            type="date"
            value={r.salida ?? ""}
            max={hoy()}
            onChange={(ev) => poner({ salida: ev.target.value || null })}
            className="mt-2 min-h-11 rounded-lg border border-[var(--crema)]/20 bg-[var(--crema)]/[0.045] px-3.5 text-[15px] text-[var(--crema-clara)] outline-none [color-scheme:dark] focus:border-[var(--tierra-600)]"
          />
        </label>

        <label className="block min-w-[14rem] flex-1">
          <span className="rotulo block text-[var(--crema)]/70">
            Si se corrió de día, por qué
          </span>
          <Texto
            value={r.suspension}
            onChange={(ev) => poner({ suspension: ev.target.value })}
            placeholder="Llovió el martes. Se pasó al jueves."
          />
        </label>
      </div>

      <div className="mt-6">
        <Rotulo>Los puntos, y qué salió de cada uno</Rotulo>
        <Ayuda>
          Los elige el curso. Anotar al lado lo que trajeron de cada punto es lo
          que después permite compararlos, que es la etapa siguiente entera.
        </Ayuda>

        {r.puntos.length === 0 ? (
          <p className="mt-3 text-sm leading-relaxed text-[var(--crema)]/55">
            Todavía no hay puntos anotados.
          </p>
        ) : (
          <ul className="mt-3 space-y-2.5">
            {r.puntos.map((p, i) => (
              <li
                key={p.id}
                className="flex items-start gap-3 rounded-xl border border-[var(--crema)]/14 p-3.5"
              >
                <span
                  aria-hidden
                  className="cifra mt-2.5 shrink-0 text-xs text-[var(--crema)]/40"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="grid min-w-0 flex-1 gap-2.5 sm:grid-cols-2">
                  <label className="block">
                    <span className="sr-only">Dónde queda el punto {i + 1}</span>
                    <Texto
                      value={p.donde}
                      onChange={(ev) =>
                        onCambio(cambiarPunto(b, "terreno", p.id, { donde: ev.target.value }))
                      }
                      placeholder="Antes del pueblo, en el vado"
                    />
                  </label>
                  <label className="block">
                    <span className="sr-only">Qué se trajo del punto {i + 1}</span>
                    <Texto
                      value={p.que}
                      onChange={(ev) =>
                        onCambio(cambiarPunto(b, "terreno", p.id, { que: ev.target.value }))
                      }
                      placeholder="pH 7,2 y agua clara"
                    />
                  </label>
                </div>
                <Quitar
                  onClick={() => onCambio(quitarPunto(b, "terreno", p.id))}
                  que={`el punto ${i + 1}`}
                />
              </li>
            ))}
          </ul>
        )}

        <Agregar onClick={() => onCambio(agregarPunto(b, "terreno"))}>
          Anotar un punto
        </Agregar>
      </div>

      {/* Al volver. La etapa lo pide con estas palabras: «lo que trajeron se
          pone al lado de lo que creían el primer día». El botón está en las dos
          etapas que tocan ese momento, la vuelta del terreno y el análisis,
          porque en la sala es la misma clase partida por el timbre. */}
      <Sobre b={b} onCambio={onCambio} />
    </div>
  );
}

/**
 * El sobre del primer día: qué creía cada mitad de la sala antes de salir.
 *
 * Aparece en el terreno y en el análisis, que son los dos sitios donde se
 * abre, y en los dos hace lo mismo. Cerrado dice en qué momento se abre;
 * abierto muestra las dos razones tal como quedaron escritas.
 */
function Sobre({ b, onCambio }: { b: Bitacora; onCambio: (b: Bitacora) => void }) {
  const primera = hojaDe(b, "problematica").registro;
  const hay = Boolean(primera.ladoA.trim() || primera.ladoB.trim());
  if (!hay || primera.destapado) return null;

  return (
    <div className="mt-6 rounded-xl border border-[var(--tierra-600)]/35 bg-[var(--tierra-600)]/[0.06] p-4">
      <Rotulo>Al volver: el sobre del primer día</Rotulo>
      <Ayuda>
        Lo que creía cada mitad de la sala antes de salir quedó guardado y no se
        ha abierto. Ponerlo al lado de lo que trajeron es lo que hace que la
        salida haya servido para algo.
      </Ayuda>
      <button
        type="button"
        onClick={() => onCambio(ponerRegistro(b, "problematica", { destapado: true }))}
        className="mt-3 inline-flex min-h-11 items-center rounded-full border border-[var(--tierra-600)] bg-[var(--tierra-600)]/15 px-5 text-sm font-medium text-[var(--tierra-300)] transition hover:bg-[var(--tierra-600)]/25"
      >
        Abrirlo con el curso
      </button>
    </div>
  );
}

/* ── 04 · El análisis: lo que creían y lo que encontraron ──────────────── */

/**
 * La comparación de dos versiones, puestas lado a lado.
 *
 * Es la etapa que se agregó después de una entrevista de validación, y existe
 * porque sin ella el curso vuelve del terreno y propone soluciones apoyadas en
 * lo que ya pensaba antes de salir, con lo que todo el trabajo de terreno
 * queda de adorno.
 *
 * Por eso el instrumento no es un cuadro de texto: es el sobre del primer día
 * abriéndose al lado de lo que trajeron. A la izquierda lo que creía cada
 * mitad de la sala en la etapa 1, tal como quedó escrito; a la derecha la
 * frase que queda. Una sola frase, y por eso cuesta: si no se puede decir en
 * una, todavía hay material y no hay hallazgo.
 */
export function InstrumentoAnalisis({ b, onCambio }: Props) {
  const primera = hojaDe(b, "problematica").registro;
  const r = hojaDe(b, "analisis").registro;
  const poner = (cambio: Partial<typeof r>) =>
    onCambio(ponerRegistro(b, "analisis", cambio));

  const hayRazones = Boolean(primera.ladoA.trim() || primera.ladoB.trim());

  return (
    <div>
      <Rotulo>Lo que creían, y lo que encontraron</Rotulo>

      <div className="mt-3 grid gap-4 lg:grid-cols-2">
        {/* El sobre del primer día. Cerrado se ve que hay algo dentro; abierto
            se lee al lado del hallazgo, que es para lo que se guardó. */}
        <div className="rounded-xl border border-[var(--crema)]/14 p-4">
          <p className="rotulo text-[var(--crema)]/70">El primer día creían</p>

          {!hayRazones ? (
            <p className="mt-2.5 text-sm leading-relaxed text-[var(--crema)]/55">
              No quedó escrito en la etapa 1. Se puede volver y anotarlo: es lo
              que hace que esta comparación tenga dos lados.
            </p>
          ) : !primera.destapado ? (
            <div className="mt-3">
              <p className="text-sm leading-relaxed text-[var(--crema)]/70">
                Está guardado desde la etapa 1 y no se ha abierto.
              </p>
              <button
                type="button"
                onClick={() => onCambio(ponerRegistro(b, "problematica", { destapado: true }))}
                className="mt-3 inline-flex min-h-11 items-center rounded-full border border-[var(--tierra-600)] bg-[var(--tierra-600)]/15 px-5 text-sm font-medium text-[var(--tierra-300)] transition hover:bg-[var(--tierra-600)]/25"
              >
                Abrirlo con el curso
              </button>
            </div>
          ) : (
            <dl className="mt-3 space-y-3 text-[15px] leading-relaxed">
              <div>
                <dt className="text-[var(--crema)]/60">
                  Una mitad {primera.cuantosA ? `(${primera.cuantosA})` : ""}
                </dt>
                <dd className="text-[var(--crema-clara)]">{primera.ladoA || "Sin anotar."}</dd>
              </div>
              <div>
                <dt className="text-[var(--crema)]/60">
                  La otra {primera.cuantosB ? `(${primera.cuantosB})` : ""}
                </dt>
                <dd className="text-[var(--crema-clara)]">{primera.ladoB || "Sin anotar."}</dd>
              </div>
            </dl>
          )}
        </div>

        {/* El hallazgo. */}
        <div className="rounded-xl border border-[var(--tierra-600)]/35 bg-[var(--tierra-600)]/[0.06] p-4">
          <p className="rotulo text-[var(--tierra-300)]">La frase que queda</p>
          <Ayuda>
            Una sola frase, la que el curso puede defender delante de alguien
            que no estuvo. Si hacen falta tres, todavía hay material y no hay
            hallazgo.
          </Ayuda>
          <Parrafo
            value={r.hallazgo}
            onChange={(ev) => poner({ hallazgo: ev.target.value })}
            placeholder="El problema entra después del pueblo y no antes."
          />
          <p className="mt-1.5 text-xs text-[var(--crema)]/45">
            {r.hallazgo.trim().length} caracteres.
          </p>
        </div>
      </div>

      <div className="mt-5">
        <Rotulo>¿Contradice lo que creían?</Rotulo>
        <Ayuda>
          Las dos respuestas son buenas y dicen cosas distintas. Que contradiga
          es la prueba de que el terreno sirvió para algo; que no, obliga a
          mostrar con qué se comprobó, que es un trabajo igual de real.
        </Ayuda>
        <div className="mt-3 flex flex-wrap gap-2">
          {(
            [
              ["si", "Sí, salió al revés"],
              ["no", "No, se confirmó"],
            ] as const
          ).map(([valor, titulo]) => (
            <Marca
              key={valor}
              puesta={r.contradice === valor}
              onClick={() => poner({ contradice: r.contradice === valor ? null : valor })}
            >
              {titulo}
            </Marca>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── 05 · La propuesta: las versiones ──────────────────────────────────── */

/**
 * El historial de versiones, con el motivo de cada una.
 *
 * La etapa pide una primera versión, que se la critiquen entre ellos, y
 * rehacerla. La segunda versión es donde se aprende, y es justamente la que se
 * pierde cuando el tiempo se acaba. Guardar las versiones con la crítica que
 * provocó cada una deja a la vista si eso ocurrió: una propuesta con una sola
 * fila no pasó por nadie.
 *
 * La crítica se escribe con las palabras del que la hizo y no con las del
 * docente. «El otro curso preguntó cómo saben que es el desagüe y no la
 * lluvia» es una frase que el curso reconoce; «faltó fundamentación» no la
 * dijo nadie.
 */
export function InstrumentoPropuesta({ e, b, onCambio }: Props) {
  const r = hojaDe(b, "propuesta").registro;

  return (
    <div>
      <Rotulo>Las versiones de la propuesta</Rotulo>
      <Ayuda>
        Una fila por versión, con la crítica que llevó a la siguiente. Con una
        sola fila, la propuesta no pasó por nadie todavía.
      </Ayuda>

      {e.formato && (
        <p className="mt-3 text-sm leading-relaxed text-[var(--crema)]/70">
          Lo que van a entregar quedó elegido como:{" "}
          {formatoPorId(e.formato)?.nombre ?? e.formato}.
        </p>
      )}

      {r.versiones.length === 0 ? (
        <p className="mt-3 text-sm leading-relaxed text-[var(--crema)]/55">
          Todavía no hay ninguna versión anotada.
        </p>
      ) : (
        <ol className="mt-4 space-y-3">
          {r.versiones.map((v, i) => (
            <li key={v.id} className="flex items-start gap-3">
              {/* El riel vertical: se ve de un vistazo que hubo un antes y un
                  después, que es el punto entero de esta etapa. */}
              <div className="flex shrink-0 flex-col items-center self-stretch pt-1">
                <span className="cifra grid h-7 w-7 place-items-center rounded-full border border-[var(--tierra-600)]/50 text-xs text-[var(--tierra-300)]">
                  v{i + 1}
                </span>
                {i < r.versiones.length - 1 && (
                  <span aria-hidden className="mt-1 w-px flex-1 bg-[var(--crema)]/15" />
                )}
              </div>

              <div className="min-w-0 flex-1 rounded-xl border border-[var(--crema)]/14 p-3.5">
                <div className="flex flex-wrap items-center gap-3">
                  <label className="flex items-center gap-2 text-sm text-[var(--crema)]/70">
                    <span>Del</span>
                    <input
                      type="date"
                      value={v.fecha}
                      max={hoy()}
                      onChange={(ev) =>
                        onCambio(
                          cambiarVersion(b, "propuesta", v.id, { fecha: ev.target.value })
                        )
                      }
                      className="rounded-lg border border-[var(--crema)]/20 bg-transparent px-2.5 py-1.5 text-[var(--crema-clara)] [color-scheme:dark]"
                    />
                  </label>
                  <span className="flex-1" />
                  <Quitar
                    onClick={() => onCambio(quitarVersion(b, "propuesta", v.id))}
                    que={`la versión ${i + 1}`}
                  />
                </div>

                <label className="mt-2.5 block">
                  <span className="rotulo block text-[var(--crema)]/70">
                    {i === r.versiones.length - 1
                      ? "Qué le criticaron"
                      : "Qué le criticaron, y por eso vino la siguiente"}
                  </span>
                  <Parrafo
                    value={v.critica}
                    onChange={(ev) =>
                      onCambio(
                        cambiarVersion(b, "propuesta", v.id, { critica: ev.target.value })
                      )
                    }
                    placeholder="Nos preguntaron cómo sabemos que es el desagüe y no la lluvia."
                  />
                </label>
              </div>
            </li>
          ))}
        </ol>
      )}

      <Agregar onClick={() => onCambio(agregarVersion(b, "propuesta"))}>
        {r.versiones.length === 0 ? "Anotar la primera versión" : "Anotar otra versión"}
      </Agregar>
    </div>
  );
}

/* ── 06 · La difusión: a quién llegó y qué contestó ────────────────────── */

/**
 * A quién se le entregó, y si contestó.
 *
 * Es la forma que usa cualquier herramienta donde se le manda algo a alguien
 * de fuera y hay que acordarse de si respondió. Aquí importa más que en
 * ninguna: sin alguien esperándolo, el trabajo se queda en la mochila y el
 * proyecto fue una unidad larga. Y que no contesten también es una respuesta,
 * con la que el curso puede hacer algo.
 *
 * La reflexión del final va en la misma hoja y no en otra pantalla, porque
 * ocurre el mismo día: se presenta, y después se mira atrás. Separarlas sería
 * partir en dos lo que en la sala es una sola clase.
 */
export function InstrumentoDifusion({ e, b, onCambio }: Props) {
  const r = hojaDe(b, "difusion").registro;
  const poner = (cambio: Partial<typeof r>) =>
    onCambio(ponerRegistro(b, "difusion", cambio));

  return (
    <div>
      <Rotulo>A quién le llegó</Rotulo>
      <Ayuda>
        Una fila por cada persona u organización a la que se le entregó, con lo
        que contestó. La columna vacía también dice algo.
      </Ayuda>

      {r.entregas.length === 0 ? (
        <p className="mt-3 text-sm leading-relaxed text-[var(--crema)]/55">
          Todavía no se ha entregado a nadie.
        </p>
      ) : (
        <ul className="mt-3 space-y-2.5">
          {r.entregas.map((x, i) => (
            <li
              key={x.id}
              className="rounded-xl border border-[var(--crema)]/14 p-3.5"
            >
              <div className="flex flex-wrap items-center gap-3">
                <label className="min-w-[12rem] flex-1">
                  <span className="sr-only">A quién, en la entrega {i + 1}</span>
                  <Texto
                    value={x.aQuien}
                    onChange={(ev) =>
                      onCambio(cambiarEntrega(b, "difusion", x.id, { aQuien: ev.target.value }))
                    }
                    placeholder="Al comité de agua, en la reunión"
                  />
                </label>
                <label className="flex items-center gap-2 text-sm text-[var(--crema)]/70">
                  <span>El</span>
                  <input
                    type="date"
                    value={x.fecha}
                    max={hoy()}
                    onChange={(ev) =>
                      onCambio(cambiarEntrega(b, "difusion", x.id, { fecha: ev.target.value }))
                    }
                    className="rounded-lg border border-[var(--crema)]/20 bg-transparent px-2.5 py-1.5 text-[var(--crema-clara)] [color-scheme:dark]"
                  />
                </label>
                <Quitar
                  onClick={() => onCambio(quitarEntrega(b, "difusion", x.id))}
                  que={`la entrega ${i + 1}`}
                />
              </div>

              <label className="mt-2.5 block">
                <span className="rotulo block text-[var(--crema)]/70">
                  {x.respuesta.trim() ? "Qué contestaron" : "Sin respuesta anotada"}
                </span>
                <Texto
                  value={x.respuesta}
                  onChange={(ev) =>
                    onCambio(
                      cambiarEntrega(b, "difusion", x.id, { respuesta: ev.target.value })
                    )
                  }
                  placeholder="Pidieron el dato de los tres puntos por escrito."
                />
              </label>
            </li>
          ))}
        </ul>
      )}

      <Agregar onClick={() => onCambio(agregarEntrega(b, "difusion", e.destinatario))}>
        Anotar una entrega
      </Agregar>

      <div className="mt-6">
        <Rotulo>Y después, mirar atrás</Rotulo>
        <Ayuda>
          En qué cambió lo que el curso pensaba del lugar y de su propio papel
          en él. Es la parte que no se salta, y la que suele quedarse fuera
          cuando el timbre gana.
        </Ayuda>
        <Parrafo
          value={r.queCambio}
          onChange={(ev) => poner({ queCambio: ev.target.value })}
          placeholder="Compararon la lista que dibujaron en agosto con la de septiembre."
        />
      </div>
    </div>
  );
}
