import { useState } from "react";

import { etapasEn, type Decide, type Etapa } from "./etapas";
import { comoSeEligeEn, formatosEn, type Formato } from "./formatos";
import { familiaPorId, familiasEn, rasgosEn, type Rasgos } from "./destinatarios";
import { Hoja } from "../crear/Campos";
import { useTx } from "../../../shared/tx";

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
const ETIQUETA_DECIDE: Record<Decide, { es: string; pt: string }> = {
  docente: { es: "Suele salir de ti", pt: "Costuma sair de você" },
  estudiantes: { es: "Suele tomarla el curso", pt: "Costuma ficar com a turma" },
  ambos: { es: "Suele armarse entre todos", pt: "Costuma ser montada por todos" },
};

const ANILLO: Record<string, { es: string; pt: string }> = {
  inmediato: { es: "La sala y el patio", pt: "A sala e o pátio" },
  intermedio: { es: "El vecindario", pt: "O bairro" },
  amplio: { es: "Más allá", pt: "Mais além" },
};

export function VistaMetodo({ orden = 5 }: { orden?: number }) {
  // Ninguna abierta de entrada. Venía la primera abierta de oficio, y en una
  // entrevista se pidió quitar los destacados predeterminados justamente por
  // la diversidad de contextos: dejar una abierta sugiere que ahí empieza lo
  // importante, y la lista cerrada se lee entera de un vistazo, que es para lo
  // que está.
  const [abierto, ponerAbierto] = useState<string | null>(null);
  const tx = useTx();

  return (
    <Hoja
      titulo={tx("El método, etapa por etapa", "O método, etapa por etapa")}
      orden={orden}
      resumen={tx(
        "Las seis etapas por las que pasa cualquier proyecto, con lo que aprende el curso en cada una y las preguntas para la sala.",
        "As seis etapas por que passa qualquer projeto, com o que a turma aprende em cada uma e as perguntas para a sala."
      )}
    >
      <p className="mb-5 max-w-2xl text-[15px] leading-relaxed text-[var(--crema)]/82">
        {tx(
          "No dicen qué actividad hacer: describen qué suele estar pasando en cada tramo. El orden es el que suele funcionar y el peso de cada etapa cambia de un curso a otro; es una manera de repartirlo, no la única.",
          "Não dizem que atividade fazer: descrevem o que costuma estar acontecendo em cada trecho. A ordem é a que costuma funcionar, e o peso de cada etapa muda de uma turma para outra; é um jeito de dividir, não o único."
        )}
      </p>

      <ol className="space-y-2">
        {etapasEn(tx.idioma).map((m, i) => (
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
  const tx = useTx();

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
            {ANILLO[m.alcance] ? tx.de(ANILLO[m.alcance]) : ""} ·{" "}
            <span className={deEllos ? "text-[var(--tierra-300)]" : ""}>
              {tx.de(ETIQUETA_DECIDE[m.decide])}
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
            <p className="rotulo text-[var(--crema)]/72">
              {tx("Qué aprende el curso", "O que a turma aprende")}
            </p>
            <ul className="mt-2 space-y-2.5">
              {m.aprendizajes.map((a) => (
                <li key={a.nombre}>
                  <p className="text-[var(--crema-clara)]">{a.nombre}</p>
                  <p className="text-[var(--crema)]/85">{a.queEs}</p>
                  <p className="text-[var(--crema)]/70">
                    {tx("Se nota en que", "Nota-se quando")} {a.seNotaEn}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="rotulo text-[var(--tierra-600)]">
              {tx("Preguntas para la sala", "Perguntas para a sala")}
            </p>
            <ul className="mt-2 space-y-1.5">
              {m.preguntasQueAbren.map((q) => (
                <li key={q} className="text-[var(--crema-clara)]">
                  «{q}»
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="rotulo text-[var(--crema)]/72">
              {tx("Puedes seguir cuando", "Dá para seguir quando")}
            </p>
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
            <span className="font-medium">{tx("Se cae cuando", "Dá errado quando")}:</span>{" "}
            {m.seCaeCuando}
          </p>

          {/* El cierre va después de «se cae cuando» y antes de los ejemplos:
              es lo último que pasa en la etapa. Se pidió en una entrevista que
              la metacognición fuera formal y constante, en cada fase, y de a
              uno: en grupo contesta el que siempre contesta, y el que se está
              quedando atrás es justamente el que no levanta la mano. */}
          <div className="rounded-lg border border-[var(--crema)]/14 px-3.5 py-3">
            <p className="rotulo text-[var(--crema)]/72">
              {tx("Para cerrar: cada uno en su cuaderno", "Para fechar: cada um no seu caderno")}
            </p>
            <ul className="mt-2 space-y-1.5">
              {m.cierre.preguntas.map((q) => (
                <li key={q} className="text-[var(--crema-clara)]">
                  {q}
                </li>
              ))}
            </ul>
            <p className="mt-2.5 text-[var(--crema)]/78">
              <span className="text-[var(--crema-clara)]">{tx("Qué mirar", "O que observar")}:</span>{" "}
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
  const tx = useTx();
  const FORMATOS = formatosEn(tx.idioma);
  const elegido = FORMATOS.find((f) => f.id === formato) ?? null;
  const suFamilia = familia ? familiaPorId(familia, tx.idioma) : null;

  // Lo que no le llega a esta gente, con su motivo, para marcarlo sin
  // esconderlo. Sin familia elegida no se marca nada: sería inventarse un
  // impedimento antes de saber para quién.
  const noLlega = new Map(
    (suFamilia?.noLlegan ?? []).map((x) => [x.formato, x.porQue])
  );

  return (
    <Hoja titulo={tx("El producto y su destinatario", "O produto e o seu destinatário")} orden={orden}>
      <p className="mb-5 max-w-2xl text-[15px] leading-relaxed text-[var(--crema)]/82">
        {tx(
          "Lo decide el curso después de volver del terreno: hasta que no sepan qué encontraron, no pueden saber qué hacer con ello.",
          "Quem decide é a turma, depois de voltar do campo: enquanto não souberem o que encontraram, não podem saber o que fazer com isso."
        )}
      </p>

      {/* ── 1 · De qué clase es el destinatario ───────────────────────── */}
      <p className="rotulo text-[var(--tierra-600)]">
        1 · {tx("A quién le va a llegar", "Para quem vai chegar")}
      </p>
      <p className="mt-1.5 max-w-2xl text-[15px] leading-relaxed text-[var(--crema)]/78">
        {tx(
          "Primero a quién y después qué, porque lo segundo depende de lo primero.",
          "Primeiro para quem e depois o quê, porque a segunda coisa depende da primeira."
        )}
      </p>

      <ul className="mt-3 grid gap-2 sm:grid-cols-2">
        {familiasEn(tx.idioma).map((f) => {
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
                {activa && (
                  <span className="mt-1.5 block text-sm leading-relaxed text-[var(--crema)]/75">
                    {f.quienEs}
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>

      {suFamilia && (
        <div className="mt-4 rounded-xl border border-[var(--crema)]/14 p-4">
          <p className="rotulo text-[var(--crema)]/72">
            {tx("De esta clase, por ejemplo", "Deste tipo, por exemplo")}
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
            <span className="text-[var(--crema-clara)]">{tx("Qué les mueve", "O que os move")}:</span>{" "}
            {suFamilia.queLesMueve}
          </p>

          <label className="mt-4 block">
            <span className="rotulo text-[var(--crema)]/75">
              {tx("El de ustedes, con nombre propio", "O de vocês, com nome próprio")}
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
        <p className="rotulo text-[var(--tierra-600)]">
          2 · {tx("Cómo es esa gente", "Como são essas pessoas")}
        </p>
        {!suFamilia && (
          <p className="mt-1.5 max-w-2xl text-[15px] leading-relaxed text-[var(--crema)]/72">
            {tx(
              "Tres preguntas sobre el destinatario: qué edad tiene, dónde está y qué necesita. Aparecen en cuanto elijas arriba de qué clase es.",
              "Três perguntas sobre o destinatário: que idade tem, onde está e do que precisa. Aparecem assim que você escolher acima de que tipo ele é."
            )}
          </p>
        )}
      </div>
      {suFamilia && (
        <div className="mt-3">
          <p className="max-w-2xl text-[15px] leading-relaxed text-[var(--crema)]/78">
            {tx(
              "Se contestan en la sala. De aquí sale la mitad de la decisión siguiente.",
              "Respondem-se em sala. Daqui sai metade da próxima decisão."
            )}
          </p>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {rasgosEn(tx.idioma).map((r) => (
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
                  title={r.ayuda}
                  className="mt-2 min-h-11 w-full rounded-xl border border-[var(--crema)]/18 bg-transparent px-3.5 py-2.5 text-[15px] text-[var(--crema-clara)] placeholder:text-[var(--crema)]/30"
                />
              </label>
            ))}
          </div>
        </div>
      )}

      {/* ── 3 · Recién ahora, con qué ─────────────────────────────────── */}
      <div className="mt-6">
        <p className="rotulo text-[var(--tierra-600)]">
          3 · {tx("Con qué se lo van a entregar", "Com o que vão entregar")}
        </p>
        <p className="mt-1.5 max-w-2xl text-[15px] leading-relaxed text-[var(--crema)]/78">
          {suFamilia
            ? tx(
                `Lo que le llega a ${suFamilia.nombre.toLowerCase()} va primero. Lo tachado no es que esté prohibido: es que a esta gente no le llega, y conviene que el curso sepa por qué antes de insistir.`,
                `O que chega a «${suFamilia.nombre.toLowerCase()}» vem primeiro. O riscado não é proibido: é que não chega a essas pessoas, e convém que a turma saiba por quê antes de insistir.`
              )
            : tx(
                "Elige arriba a quién le va a llegar y esta lista se ordena sola, marcando lo que a esa gente no le sirve.",
                "Escolha acima para quem vai chegar e esta lista se ordena sozinha, marcando o que não serve para essas pessoas."
              )}
        </p>

        <ul className="mt-3 flex flex-wrap gap-2">
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
                    title={motivo ?? undefined}
                    className={`min-h-11 rounded-full border px-4 text-sm transition ${
                      activo
                        ? "border-[var(--tierra-600)] bg-[var(--tierra-600)] text-[#1e2a24]"
                        : motivo
                          ? "border-[var(--crema)]/10 text-[var(--crema)]/45 line-through decoration-[var(--crema)]/25"
                          : llega
                            ? "border-[var(--tierra-600)]/45 text-[var(--crema-clara)] hover:border-[var(--tierra-600)]"
                            : "border-[var(--crema)]/16 text-[var(--crema)]/85 hover:border-[var(--crema)]/35"
                    }`}
                  >
                    {f.nombre}
                  </button>
                </li>
              );
            })}
        </ul>
        {formato && noLlega.has(formato) && (
          <p className="mt-3 rounded-lg border border-[var(--tierra-300)]/30 bg-[var(--tierra-300)]/[0.06] px-3.5 py-2.5 text-sm leading-relaxed text-[var(--tierra-300)]">
            {noLlega.get(formato)}
          </p>
        )}
        <p className="mt-3 text-sm leading-relaxed text-[var(--crema)]/70">
          {tx(
            "Lo tachado no le llega a esa gente; pasa el cursor para ver por qué. Si inventan uno que no está, mejor: la lista no está para cerrar.",
            "O riscado não chega a essas pessoas; passe o cursor para ver por quê. Se inventarem um que não está aqui, melhor: a lista não está para fechar."
          )}
        </p>
      </div>

      {elegido && <FichaFormato f={elegido} />}

      {/* Las preguntas de la sala van al final y no al principio: son para
          discutir una decisión que ya está tomada, no para tomarla a ciegas. */}
      <details className="mt-6 border-t border-[var(--crema)]/12 pt-5">
        <summary className="min-h-11 cursor-pointer text-sm text-[var(--crema)]/78 hover:text-[var(--crema-clara)]">
          {tx("Seis preguntas para discutirlo en la sala", "Seis perguntas para discutir em sala")}
        </summary>
        <ul className="mt-2.5 space-y-1.5">
          {comoSeEligeEn(tx.idioma).map((q) => (
            <li
              key={q}
              className="text-[15px] leading-relaxed text-[var(--crema-clara)]"
            >
              «{q}»
            </li>
          ))}
        </ul>
      </details>
    </Hoja>
  );
}
function FichaFormato({ f }: { f: Formato }) {
  const tx = useTx();
  return (
    <div className="mt-5 space-y-3 rounded-xl border border-[var(--crema)]/14 p-4 text-[15px] leading-relaxed">
      <p className="text-[var(--crema-clara)]">{f.queEs}</p>
      <p className="text-[var(--crema)]/82">
        <span className="text-[var(--crema-clara)]">{tx("Llega a", "Chega a")}:</span> {f.llegaA}
      </p>
      <div>
        <p className="rotulo text-[var(--crema)]/72">{tx("Necesita", "Precisa")}</p>
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
        <span className="font-medium">{tx("Se cae cuando", "Dá errado quando")}:</span> {f.seCaeCuando}
      </p>
      <p className="text-[var(--crema)]/78">
        <span className="text-[var(--crema-clara)]">{tx("Bueno para", "Bom para")}:</span>{" "}
        {f.buenoPara}
      </p>
    </div>
  );
}
