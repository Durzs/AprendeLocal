import { useState } from "react";

import { ETAPAS, type Decide, type Etapa } from "./etapas";
import { COMO_SE_ELIGE, FORMATOS, type Formato } from "./formatos";
import { Hoja } from "../crear/Campos";

/**
 * El método, para leerlo y para trabajar con él.
 *
 * Lo que se veía antes en esta lámina era una de cuatro rutas escritas, y por
 * eso solo servía a quien tuviera un estero, un bosque, un corte de camino o
 * una sala fría. Un profesor que va al río a medir contaminación y cuyos
 * estudiantes terminan armando una campaña en redes no tenía dónde entrar.
 *
 * Esto sí le sirve, porque no dice qué hacer sino qué tiene que estar pasando.
 * Las etapas se abren de a una: la lista cerrada se lee de un vistazo antes de
 * la clase, y la etapa abierta trae los aprendizajes con que se evalúa y las
 * preguntas que se hacen en la sala.
 */

/**
 * De quién es cada etapa.
 *
 * Decía «lo deciden ellos» y en una entrevista se leyó como que los
 * estudiantes votaban cuáles de las cinco etapas hacer. No es eso: las cinco
 * se hacen siempre, y lo que cambia es quién las arma. «Se construye con el
 * curso» dice lo que pasa; «lo deciden ellos» daba a entender que podían
 * decidir no hacerla.
 */
const ETIQUETA_DECIDE: Record<Decide, string> = {
  docente: "La preparas tú",
  estudiantes: "Se construye con el curso",
  ambos: "Se arma entre todos",
};

const ANILLO: Record<string, string> = {
  inmediato: "La sala y el patio",
  intermedio: "El vecindario",
  amplio: "Más allá",
};

export function VistaMetodo({ orden = 5 }: { orden?: number }) {
  const [abierto, ponerAbierto] = useState<string | null>(ETAPAS[0]?.id ?? null);

  return (
    <Hoja titulo="Cómo se guía un proyecto" orden={orden}>
      <p className="mb-1 max-w-2xl text-[15px] leading-relaxed text-[var(--crema)]/82">
        Son cinco etapas y sirven para proyectos muy distintos. Un curso puede
        medir la contaminación de un río y terminar armando una campaña. Otro
        puede catalogar el desierto florido y terminar montando una exposición
        en la plaza. Las dos cosas pasan por estas mismas cinco etapas.
      </p>
      <p className="mb-1 max-w-2xl text-[15px] leading-relaxed text-[var(--crema)]/82">
        Las etapas no dicen qué actividad hacer. Dicen qué tiene que estar
        pasando, qué se lleva el curso de ahí, y quién lo decide.
      </p>
      <p className="mb-5 max-w-2xl text-[15px] leading-relaxed text-[var(--crema)]/72">
        Las cinco etapas se hacen siempre, en este orden. Lo que cambia es
        quién las arma: la primera se arma entre todos, la segunda la preparas
        tú, y de la tercera a la quinta se construyen con el curso.
      </p>

      <ol className="space-y-2">
        {ETAPAS.map((m, i) => (
          <EtapaPlegada
            key={m.id}
            m={m}
            n={i + 1}
            abierta={abierto === m.id}
            onAbrir={() => ponerAbierto(abierto === m.id ? null : m.id)}
          />
        ))}
      </ol>
    </Hoja>
  );
}

function EtapaPlegada({
  m,
  n,
  abierta: abierto,
  onAbrir,
}: {
  m: Etapa;
  n: number;
  abierta: boolean;
  onAbrir: () => void;
}) {
  const deEllos = m.decide === "estudiantes";

  return (
    <li
      className={`overflow-hidden rounded-xl border transition ${
        abierto
          ? "border-[var(--crema)]/25 bg-[var(--crema)]/[0.05]"
          : "border-[var(--crema)]/12"
      }`}
    >
      <button
        type="button"
        onClick={onAbrir}
        aria-expanded={abierto}
        className="flex min-h-11 w-full items-baseline gap-3 px-4 py-3 text-left"
      >
        <span className="cifra shrink-0 text-xs text-[var(--crema)]/40">
          {String(n).padStart(2, "0")}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[17px] leading-snug text-[var(--crema-clara)]">
            {m.nombre}
          </span>
          <span className="mt-1 block text-xs text-[var(--crema)]/70">
            {ANILLO[m.alcance]} ·{" "}
            <span className={deEllos ? "text-[var(--tierra-300)]" : ""}>
              {ETIQUETA_DECIDE[m.decide]}
            </span>
          </span>
        </span>
        <span aria-hidden className="shrink-0 text-[var(--crema)]/35">
          {abierto ? "−" : "+"}
        </span>
      </button>

      {abierto && (
        <div className="space-y-4 border-t border-[var(--crema)]/12 px-4 py-4 text-[15px] leading-relaxed">
          <p className="text-[var(--crema)]/88">{m.queOcurre}</p>

          {/* Los aprendizajes van primero porque son lo que se evalúa y lo que
              se pide para el papeleo. Cada uno trae cómo se ve que ocurrió,
              que es lo que permite mirarlo en la sala en vez de suponerlo. */}
          <div>
            <p className="rotulo text-[var(--crema)]/72">Qué se lleva el curso</p>
            <ul className="mt-2 space-y-2.5">
              {m.aprendizajes.map((a) => (
                <li key={a.nombre}>
                  <p className="text-[var(--crema-clara)]">{a.nombre}</p>
                  <p className="text-[var(--crema)]/85">{a.queEs}</p>
                  <p className="text-[var(--crema)]/70">Se nota en que {a.seNotaEn}</p>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="rotulo text-[var(--tierra-600)]">Preguntas que abren</p>
            <ul className="mt-2 space-y-1.5">
              {m.preguntasQueAbren.map((q) => (
                <li key={q} className="text-[var(--crema-clara)]">
                  «{q}»
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="rotulo text-[var(--crema)]/72">Puedes seguir cuando</p>
            <ul className="mt-2 space-y-1.5">
              {m.estaListoCuando.map((c) => (
                <li key={c} className="flex gap-2.5 text-[var(--crema)]/82">
                  <span aria-hidden className="text-[var(--crema)]/30">
                    ·
                  </span>
                  {c}
                </li>
              ))}
            </ul>
          </div>

          {/* Cómo se cae cada momento es lo que casi nunca está escrito en
              ninguna parte, y es lo que un docente que lo hace por primera
              vez no puede anticipar solo. */}
          <p className="rounded-lg border border-[var(--tierra-300)]/30 bg-[var(--tierra-300)]/[0.06] px-3.5 py-2.5 text-[var(--tierra-300)]">
            <span className="font-medium">Se cae cuando:</span> {m.seCaeCuando}
          </p>

          <div className="grid gap-3 sm:grid-cols-2">
            {m.ejemplos.map((e) => (
              <div
                key={e.proyecto}
                className="rounded-lg border border-[var(--crema)]/12 px-3.5 py-3"
              >
                <p className="rotulo text-[var(--crema)]/70">{e.proyecto}</p>
                <p className="mt-1.5 text-[var(--crema)]/82">{e.asiSeVe}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </li>
  );
}

/**
 * El momento en que el curso decide qué construye.
 *
 * Va aparte de los otros nueve porque es el único que deja algo guardado: la
 * decisión del curso se escribe aquí y viaja con la expedición. Y porque es el
 * que faltaba entero: con el producto puesto de antemano no hay proyecto, hay
 * tarea larga.
 *
 * La lista no está para elegir de ella. Está para descartar con argumento, que
 * es un razonamiento mejor: un curso que deja fuera el informe porque en su
 * pueblo nadie lee informes está pensando en su destinatario, y eso es la
 * mitad del trabajo.
 */
export function ElegirFormato({
  formato,
  destinatario,
  onCambio,
  orden = 7,
}: {
  formato: string | null;
  destinatario: string;
  onCambio: (cambio: { formato?: string | null; destinatario?: string }) => void;
  orden?: number;
}) {
  const elegido = FORMATOS.find((f) => f.id === formato) ?? null;

  return (
    <Hoja titulo="Qué van a construir ellos" orden={orden}>
      <p className="mb-5 max-w-2xl text-[15px] leading-relaxed text-[var(--crema)]/82">
        Esto lo decide el curso, después de volver del terreno y no antes: hasta
        que no sepan qué encontraron, no pueden saber qué hacer con ello. Lo que
        se marque aquí queda registrado para no perderlo de vista.
      </p>

      <label className="block">
        <span className="rotulo text-[var(--crema)]/75">
          A quién le sirve, con nombre
        </span>
        <input
          type="text"
          value={destinatario}
          onChange={(ev) => onCambio({ destinatario: ev.target.value })}
          placeholder="El comité de agua, no «la comunidad»"
          className="mt-2 min-h-11 w-full rounded-xl border border-[var(--crema)]/18 bg-transparent px-3.5 py-2.5 text-[15px] text-[var(--crema-clara)] placeholder:text-[var(--crema)]/30"
        />
        <span className="mt-2 block text-sm leading-relaxed text-[var(--crema)]/70">
          Si no se puede nombrar a una persona o a un grupo concreto, todavía no
          hay destinatario, y sin destinatario el trabajo termina en la nota.
        </span>
      </label>

      <div className="mt-6">
        <p className="rotulo text-[var(--crema)]/75">
          Cómo se elige, en la sala
        </p>
        <ul className="mt-2.5 space-y-1.5">
          {COMO_SE_ELIGE.map((q) => (
            <li key={q} className="text-[15px] leading-relaxed text-[var(--crema-clara)]">
              «{q}»
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6">
        <p className="rotulo text-[var(--crema)]/75">
          Si no se les ocurre nada, para mirar
        </p>
        <ul className="mt-2.5 flex flex-wrap gap-2">
          {FORMATOS.map((f) => {
            const activo = f.id === formato;
            return (
              <li key={f.id}>
                <button
                  type="button"
                  onClick={() => onCambio({ formato: activo ? null : f.id })}
                  aria-pressed={activo}
                  className={`min-h-11 rounded-full border px-4 text-sm transition ${
                    activo
                      ? "border-[var(--tierra-600)] bg-[var(--tierra-600)] text-[#1e2a24]"
                      : "border-[var(--crema)]/18 text-[var(--crema)]/85 hover:border-[var(--crema)]/35"
                  }`}
                >
                  {f.nombre}
                </button>
              </li>
            );
          })}
        </ul>
        <p className="mt-3 text-sm leading-relaxed text-[var(--crema)]/70">
          Si inventan uno que no está, mejor: esta lista no está para cerrar.
        </p>
      </div>

      {elegido && <FichaFormato f={elegido} />}
    </Hoja>
  );
}

function FichaFormato({ f }: { f: Formato }) {
  return (
    <div className="mt-5 space-y-3 rounded-xl border border-[var(--crema)]/14 p-4 text-[15px] leading-relaxed">
      <p className="text-[var(--crema-clara)]">{f.queEs}</p>
      <p className="text-[var(--crema)]/82">
        <span className="text-[var(--crema-clara)]">Llega a:</span> {f.llegaA}
      </p>
      <div>
        <p className="rotulo text-[var(--crema)]/72">Necesita</p>
        <ul className="mt-2 space-y-1.5">
          {f.exige.map((x) => (
            <li key={x} className="flex gap-2.5 text-[var(--crema)]/82">
              <span aria-hidden className="text-[var(--crema)]/30">
                ·
              </span>
              {x}
            </li>
          ))}
        </ul>
      </div>
      <p className="rounded-lg border border-[var(--tierra-300)]/30 bg-[var(--tierra-300)]/[0.06] px-3.5 py-2.5 text-[var(--tierra-300)]">
        <span className="font-medium">Se cae cuando:</span> {f.seCaeCuando}
      </p>
      <p className="text-[var(--crema)]/78">
        <span className="text-[var(--crema-clara)]">Bueno para:</span>{" "}
        {f.buenoPara}
      </p>
    </div>
  );
}
