import { useState } from "react";

import { MOMENTOS, DE_LOS_ESTUDIANTES, type Decide, type Momento } from "./momentos";
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
 * Los momentos se abren de a uno: la lista cerrada se lee en veinte segundos
 * antes de la clase, y el momento abierto trae las preguntas que se hacen en
 * la sala.
 */

const ETIQUETA_DECIDE: Record<Decide, string> = {
  docente: "Lo decides tú",
  estudiantes: "Lo deciden ellos",
  ambos: "Lo deciden entre todos",
};

const ANILLO: Record<string, string> = {
  inmediato: "La sala y el patio",
  intermedio: "El vecindario",
  amplio: "Más allá",
};

export function VistaMetodo({ orden = 5 }: { orden?: number }) {
  const [abierto, ponerAbierto] = useState<string | null>(MOMENTOS[0]?.id ?? null);

  return (
    <Hoja titulo="Cómo se guía un proyecto" orden={orden}>
      <p className="mb-1 max-w-2xl text-sm leading-relaxed text-[var(--crema)]/70">
        Diez momentos que sirven igual para medir la contaminación de un río y
        armar una campaña, que para catalogar el desierto florido y montarlo en
        la plaza. No dicen qué actividad hacer: dicen qué tiene que estar
        pasando, y quién decide.
      </p>
      <p className="mb-5 max-w-2xl text-sm leading-relaxed text-[var(--crema)]/50">
        {DE_LOS_ESTUDIANTES} de los {MOMENTOS.length} los deciden los
        estudiantes, y uno de ellos es qué van a construir.
      </p>

      <ol className="space-y-2">
        {MOMENTOS.map((m, i) => (
          <MomentoPlegado
            key={m.id}
            m={m}
            n={i + 1}
            abierto={abierto === m.id}
            onAbrir={() => ponerAbierto(abierto === m.id ? null : m.id)}
          />
        ))}
      </ol>
    </Hoja>
  );
}

function MomentoPlegado({
  m,
  n,
  abierto,
  onAbrir,
}: {
  m: Momento;
  n: number;
  abierto: boolean;
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
          <span className="block text-[15px] leading-snug text-[var(--crema-clara)]">
            {m.nombre}
          </span>
          <span className="mt-1 block text-xs text-[var(--crema)]/45">
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
        <div className="space-y-4 border-t border-[var(--crema)]/12 px-4 py-4 text-sm leading-relaxed">
          <p className="text-[var(--crema)]/80">{m.proposito}</p>

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
            <p className="rotulo text-[var(--crema)]/50">Puedes seguir cuando</p>
            <ul className="mt-2 space-y-1.5">
              {m.estaListoCuando.map((c) => (
                <li key={c} className="flex gap-2.5 text-[var(--crema)]/70">
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
                <p className="rotulo text-[var(--crema)]/45">{e.proyecto}</p>
                <p className="mt-1.5 text-[var(--crema)]/70">{e.asiSeVe}</p>
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
      <p className="mb-5 max-w-2xl text-sm leading-relaxed text-[var(--crema)]/70">
        Esto lo decide el curso, después de volver del terreno y no antes: hasta
        que no sepan qué encontraron, no pueden saber qué hacer con ello. Lo que
        marques aquí es para que no se te pierda.
      </p>

      <label className="block">
        <span className="rotulo text-[var(--crema)]/55">
          A quién le sirve, con nombre
        </span>
        <input
          type="text"
          value={destinatario}
          onChange={(ev) => onCambio({ destinatario: ev.target.value })}
          placeholder="El comité de agua, no «la comunidad»"
          className="mt-2 min-h-11 w-full rounded-xl border border-[var(--crema)]/18 bg-transparent px-3.5 py-2.5 text-[15px] text-[var(--crema-clara)] placeholder:text-[var(--crema)]/30"
        />
        <span className="mt-2 block text-xs leading-relaxed text-[var(--crema)]/45">
          Si no se puede nombrar a una persona o a un grupo concreto, todavía no
          hay destinatario, y sin destinatario el trabajo termina en la nota.
        </span>
      </label>

      <div className="mt-6">
        <p className="rotulo text-[var(--crema)]/55">
          Cómo se elige, en la sala
        </p>
        <ul className="mt-2.5 space-y-1.5">
          {COMO_SE_ELIGE.map((q) => (
            <li key={q} className="text-sm leading-relaxed text-[var(--crema-clara)]">
              «{q}»
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6">
        <p className="rotulo text-[var(--crema)]/55">
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
                      : "border-[var(--crema)]/18 text-[var(--crema)]/75 hover:border-[var(--crema)]/35"
                  }`}
                >
                  {f.nombre}
                </button>
              </li>
            );
          })}
        </ul>
        <p className="mt-3 text-xs leading-relaxed text-[var(--crema)]/45">
          Si inventan uno que no está, mejor: esta lista no está para cerrar.
        </p>
      </div>

      {elegido && <FichaFormato f={elegido} />}
    </Hoja>
  );
}

function FichaFormato({ f }: { f: Formato }) {
  return (
    <div className="mt-5 space-y-3 rounded-xl border border-[var(--crema)]/14 p-4 text-sm leading-relaxed">
      <p className="text-[var(--crema-clara)]">{f.queEs}</p>
      <p className="text-[var(--crema)]/70">
        <span className="text-[var(--crema-clara)]">Llega a:</span> {f.llegaA}
      </p>
      <div>
        <p className="rotulo text-[var(--crema)]/50">Necesita</p>
        <ul className="mt-2 space-y-1.5">
          {f.exige.map((x) => (
            <li key={x} className="flex gap-2.5 text-[var(--crema)]/70">
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
      <p className="text-[var(--crema)]/60">
        <span className="text-[var(--crema-clara)]">Bueno para:</span>{" "}
        {f.buenoPara}
      </p>
    </div>
  );
}
