import { useState } from "react";

import { ETAPAS, type Decide, type Etapa } from "./etapas";
import { COMO_SE_ELIGE, FORMATOS, type Formato } from "./formatos";
import { FAMILIAS, RASGOS, familiaPorId, type Rasgos } from "./destinatarios";
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
 * De quién suele ser cada etapa.
 *
 * Dos correcciones, las dos de entrevistas.
 *
 * La primera: decía «lo deciden ellos» y se leyó como que los estudiantes
 * votaban cuáles de las etapas hacer. «Se construye con el curso» dice lo que
 * pasa sin dar a entender que se pueda saltar.
 *
 * La segunda es de tono y llegó después. Decía «la preparas tú», que le dice
 * al docente lo que tiene que hacer. Nadie que lleva veinte años en una sala
 * necesita que una aplicación le reparta el trabajo. Ahora describe lo que
 * suele pasar y deja la decisión donde estaba: en quien conoce su curso.
 */
const ETIQUETA_DECIDE: Record<Decide, string> = {
  docente: "Suele salir de ti",
  estudiantes: "Suele tomarla el curso",
  ambos: "Suele armarse entre todos",
};

const ANILLO: Record<string, string> = {
  inmediato: "La sala y el patio",
  intermedio: "El vecindario",
  amplio: "Más allá",
};

export function VistaMetodo({ orden = 5 }: { orden?: number }) {
  // Ninguna abierta de entrada. Venía la primera abierta de oficio, y en una
  // entrevista se pidió quitar los destacados predeterminados justamente por
  // la diversidad de contextos: dejar una abierta sugiere que ahí empieza lo
  // importante, y la lista cerrada se lee entera de un vistazo, que es para lo
  // que está.
  const [abierto, ponerAbierto] = useState<string | null>(null);

  return (
    <Hoja titulo="Cómo se guía un proyecto" orden={orden}>
      <p className="mb-1 max-w-2xl text-[15px] leading-relaxed text-[var(--crema)]/82">
        Son seis etapas y sirven para proyectos muy distintos. Un curso puede
        medir la contaminación de un río y terminar armando una campaña. Otro
        puede catalogar el desierto florido y terminar montando una exposición
        en la plaza. Las dos cosas pasan por estas mismas seis etapas.
      </p>
      <p className="mb-1 max-w-2xl text-[15px] leading-relaxed text-[var(--crema)]/82">
        No dicen qué actividad hacer. Describen qué suele estar pasando en cada
        tramo, qué se lleva el curso de ahí, y de quién acaba siendo cada parte.
      </p>
      <p className="mb-5 max-w-2xl text-[15px] leading-relaxed text-[var(--crema)]/72">
        El orden es el que suele funcionar, y el peso de cada etapa cambia mucho
        de un curso a otro. En la mayoría de los proyectos la primera se arma
        entre todos, la segunda sale del docente y de la tercera en adelante la
        va tomando el curso. Es una manera de repartirlo, no la única.
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

          {/* El cierre va después de «se cae cuando» y antes de los ejemplos:
              es lo último que pasa en la etapa. Se pidió en una entrevista que
              la metacognición fuera formal y constante, en cada fase, y de a
              uno: en grupo contesta el que siempre contesta, y el que se está
              quedando atrás es justamente el que no levanta la mano. */}
          <div className="rounded-lg border border-[var(--crema)]/14 px-3.5 py-3">
            <p className="rotulo text-[var(--crema)]/72">
              Para cerrar: cada uno en su cuaderno
            </p>
            <ul className="mt-2 space-y-1.5">
              {m.cierre.preguntas.map((q) => (
                <li key={q} className="text-[var(--crema-clara)]">
                  {q}
                </li>
              ))}
            </ul>
            <p className="mt-2.5 text-[var(--crema)]/78">
              <span className="text-[var(--crema-clara)]">Qué mirar:</span>{" "}
              {m.cierre.queMirar}
            </p>
          </div>

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
 * A quién le llega lo que el curso construye, y recién después con qué.
 *
 * ESTE ORDEN NO ES UN DETALLE
 *
 * Antes el destinatario era una caja de texto con la advertencia de que «la
 * comunidad» no es un nombre, y enseguida venía la lista de formatos. Dos
 * problemas, los dos dichos en una entrevista de validación por alguien que
 * lleva tres años pidiendo esto mismo en tecnología.
 *
 * El primero: con una barra de texto se escribe «la comunidad», «para todos»,
 * «cualquier persona». Saber que hay que concretar no es saber cómo. Hacen
 * falta criterios y opciones, no un hueco. Por eso ahora hay cinco familias de
 * destinatario con ejemplos de verdad, y tres preguntas que lo caracterizan:
 * qué edad tienen, dónde están y qué necesitan.
 *
 * El segundo: el formato se elegía antes de saber a quién le llega, y las
 * preguntas de la sala hablaban de «la campaña» cuando nadie había decidido
 * que fuera una campaña. Va al revés. Una campaña en redes funciona con
 * adolescentes que andan con el teléfono y no funciona en una caleta donde no
 * hay señal, por buena que sea la campaña.
 *
 * Los formatos que no le llegan a ese destinatario no desaparecen: quedan
 * marcados con el motivo. Descartar con argumento es un razonamiento mejor que
 * no haber visto nunca la opción, y es lo que el curso tiene que aprender a
 * hacer.
 */
export function ElegirFormato({
  formato,
  destinatario,
  familia,
  rasgos,
  onCambio,
  orden = 7,
}: {
  formato: string | null;
  destinatario: string;
  familia: string | null;
  rasgos: Rasgos;
  onCambio: (cambio: {
    formato?: string | null;
    destinatario?: string;
    familiaDestinatario?: string | null;
    rasgosDestinatario?: Rasgos;
  }) => void;
  orden?: number;
}) {
  const elegido = FORMATOS.find((f) => f.id === formato) ?? null;
  const suFamilia = familia ? familiaPorId(familia) : null;

  // Lo que no le llega a esta gente, con su motivo, para marcarlo sin
  // esconderlo. Sin familia elegida no se marca nada: sería inventarse un
  // impedimento antes de saber para quién.
  const noLlega = new Map(
    (suFamilia?.noLlegan ?? []).map((x) => [x.formato, x.porQue])
  );

  return (
    <Hoja titulo="Qué van a construir ellos" orden={orden}>
      <p className="mb-5 max-w-2xl text-[15px] leading-relaxed text-[var(--crema)]/82">
        Esto lo decide el curso, después de volver del terreno y no antes: hasta
        que no sepan qué encontraron, no pueden saber qué hacer con ello. Lo que
        se marque aquí queda registrado para no perderlo de vista.
      </p>

      {/* ── 1 · De qué clase es el destinatario ───────────────────────── */}
      <p className="rotulo text-[var(--tierra-600)]">
        1 · A quién le va a llegar
      </p>
      <p className="mt-1.5 max-w-2xl text-[15px] leading-relaxed text-[var(--crema)]/78">
        Primero a quién y después qué, porque lo segundo depende de lo primero.
        Estas son las cinco clases que aparecen siempre; la de ustedes es una de
        estas, aunque el nombre sea otro.
      </p>

      <ul className="mt-3 grid gap-2 sm:grid-cols-2">
        {FAMILIAS.map((f) => {
          const activa = f.id === familia;
          return (
            <li key={f.id}>
              <button
                type="button"
                onClick={() =>
                  onCambio({ familiaDestinatario: activa ? null : f.id })
                }
                aria-pressed={activa}
                className={`h-full w-full rounded-xl border px-4 py-3 text-left transition ${
                  activa
                    ? "border-[var(--tierra-600)] bg-[var(--tierra-600)]/[0.1]"
                    : "border-[var(--crema)]/14 hover:border-[var(--crema)]/32"
                }`}
              >
                <span
                  className={`block text-[15px] leading-snug ${
                    activa ? "text-[var(--tierra-300)]" : "text-[var(--crema-clara)]"
                  }`}
                >
                  {f.nombre}
                </span>
                <span className="mt-1.5 block text-sm leading-relaxed text-[var(--crema)]/75">
                  {f.quienEs}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {suFamilia && (
        <div className="mt-4 rounded-xl border border-[var(--crema)]/14 p-4">
          <p className="rotulo text-[var(--crema)]/72">
            De esta clase, por ejemplo
          </p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {suFamilia.ejemplos.map((x) => (
              <li
                key={x}
                className="rounded-full border border-[var(--crema)]/14 px-3 py-1 text-sm text-[var(--crema)]/82"
              >
                {x}
              </li>
            ))}
          </ul>
          <p className="mt-3.5 text-[15px] leading-relaxed text-[var(--crema)]/82">
            <span className="text-[var(--crema-clara)]">Qué les mueve:</span>{" "}
            {suFamilia.queLesMueve}
          </p>

          <label className="mt-4 block">
            <span className="rotulo text-[var(--crema)]/75">
              El de ustedes, con nombre propio
            </span>
            <input
              type="text"
              value={destinatario}
              onChange={(ev) => onCambio({ destinatario: ev.target.value })}
              placeholder={suFamilia.ejemplos[0]}
              className="mt-2 min-h-11 w-full rounded-xl border border-[var(--crema)]/18 bg-transparent px-3.5 py-2.5 text-[15px] text-[var(--crema-clara)] placeholder:text-[var(--crema)]/30"
            />
          </label>
        </div>
      )}

      {/* ── 2 · Cómo es esa gente ─────────────────────────────────────── */}
      {/* El marco va siempre, aunque no haya destinatario elegido: cuando el
          paso 2 desaparecía, en pantalla se leía «1 · …» y enseguida «3 · …»,
          y el salto parecía un error. */}
      <div className="mt-6">
        <p className="rotulo text-[var(--tierra-600)]">2 · Cómo es esa gente</p>
        {!suFamilia && (
          <p className="mt-1.5 max-w-2xl text-[15px] leading-relaxed text-[var(--crema)]/72">
            Tres preguntas sobre el destinatario: qué edad tiene, dónde está y
            qué necesita. Aparecen en cuanto elijas arriba de qué clase es.
          </p>
        )}
      </div>
      {suFamilia && (
        <div className="mt-3">
          <p className="max-w-2xl text-[15px] leading-relaxed text-[var(--crema)]/78">
            Se contestan en la sala. De aquí sale la mitad de la decisión
            siguiente: si en el sector no hay señal, no hay campaña en redes que
            llegue, y el curso puede decir por qué la descartó.
          </p>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {RASGOS.map((r) => (
              <label key={r.id} className="block">
                <span className="block text-[15px] text-[var(--crema-clara)]">
                  {r.pregunta}
                </span>
                <input
                  type="text"
                  value={rasgos[r.id]}
                  onChange={(ev) =>
                    onCambio({
                      rasgosDestinatario: { ...rasgos, [r.id]: ev.target.value },
                    })
                  }
                  placeholder={r.ejemplo}
                  className="mt-2 min-h-11 w-full rounded-xl border border-[var(--crema)]/18 bg-transparent px-3.5 py-2.5 text-[15px] text-[var(--crema-clara)] placeholder:text-[var(--crema)]/30"
                />
                <span className="mt-1.5 block text-sm leading-relaxed text-[var(--crema)]/70">
                  {r.ayuda}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* ── 3 · Recién ahora, con qué ─────────────────────────────────── */}
      <div className="mt-6">
        <p className="rotulo text-[var(--tierra-600)]">
          3 · Con qué se lo van a entregar
        </p>
        <p className="mt-1.5 max-w-2xl text-[15px] leading-relaxed text-[var(--crema)]/78">
          {suFamilia
            ? `Lo que le llega a ${suFamilia.nombre.toLowerCase()} va primero. Lo tachado no es que esté prohibido: es que a esta gente no le llega, y conviene que el curso sepa por qué antes de insistir.`
            : "Elige arriba a quién le va a llegar y esta lista se ordena sola, marcando lo que a esa gente no le sirve."}
        </p>

        <ul className="mt-3 space-y-2">
          {[...FORMATOS]
            .sort((a, b) => {
              if (!suFamilia) return 0;
              const puntos = (id: string) =>
                suFamilia.llegan.includes(id) ? 0 : noLlega.has(id) ? 2 : 1;
              return puntos(a.id) - puntos(b.id);
            })
            .map((f) => {
              const activo = f.id === formato;
              const motivo = noLlega.get(f.id);
              const llega = suFamilia?.llegan.includes(f.id);
              return (
                <li key={f.id}>
                  <button
                    type="button"
                    onClick={() => onCambio({ formato: activo ? null : f.id })}
                    aria-pressed={activo}
                    className={`w-full rounded-xl border px-4 py-3 text-left transition ${
                      activo
                        ? "border-[var(--tierra-600)] bg-[var(--tierra-600)]/[0.1]"
                        : "border-[var(--crema)]/14 hover:border-[var(--crema)]/32"
                    }`}
                  >
                    <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <span
                        className={`text-[15px] ${
                          activo
                            ? "text-[var(--tierra-300)]"
                            : motivo
                              ? "text-[var(--crema)]/55"
                              : "text-[var(--crema-clara)]"
                        }`}
                      >
                        {f.nombre}
                      </span>
                      {llega && (
                        <span className="rounded-full bg-[var(--tierra-600)]/20 px-2 py-0.5 rotulo text-[var(--tierra-300)]">
                          le llega
                        </span>
                      )}
                    </span>
                    {motivo && (
                      <span className="mt-1.5 block text-sm leading-relaxed text-[var(--crema)]/70">
                        {motivo}
                      </span>
                    )}
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

      {/* Las preguntas de la sala van al final y no al principio: son para
          discutir una decisión que ya está tomada, no para tomarla a ciegas. */}
      <div className="mt-6 border-t border-[var(--crema)]/12 pt-5">
        <p className="rotulo text-[var(--crema)]/75">
          Para discutirlo en la sala
        </p>
        <ul className="mt-2.5 space-y-1.5">
          {COMO_SE_ELIGE.map((q) => (
            <li
              key={q}
              className="text-[15px] leading-relaxed text-[var(--crema-clara)]"
            >
              «{q}»
            </li>
          ))}
        </ul>
      </div>
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
