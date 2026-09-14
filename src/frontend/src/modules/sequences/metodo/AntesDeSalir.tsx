import { Hoja } from "../crear/Campos";
import type { Expedicion } from "../crear/expedicion";
import { angulosDe, nombreAsignatura, problemaPorId } from "./problemas";
import { ANTES_DE_SALIR, TECNICAS, tecnicaPorId } from "./tecnicas";

/**
 * La segunda etapa: lo que se enseña en la sala antes de salir.
 *
 * Es el único momento del método que decide entero el profesor, y no se vota:
 * mandar a un curso a averiguar algo sin haberle enseñado a usar lo que va a
 * usar no es dejarlos crear, es dejarlos solos. Quince personas aprendiendo a
 * leer una tira de pH en la orilla de un río, con viento, es una hora perdida
 * y un dato inservible.
 *
 * Dos cosas se preparan aquí y son de naturaleza distinta. Los CONCEPTOS son
 * los del programa, y salen del problema cruzado con la asignatura: para mirar
 * un río desde biología hace falta «bioindicador» y desde historia no hace
 * ninguna falta. La TÉCNICA es de oficio, y es la que siempre se salta, porque
 * se supone que ya saben usar un cuaderno. No saben, como no sabía nadie la
 * primera vez.
 *
 * Ninguna de las dos se pide en un cuadro en blanco: se proponen a partir de
 * lo que ya eligió, y él las corrige. Corregir una lista es mucho más rápido
 * que escribirla.
 */
export function AntesDeSalir({
  e,
  onCambio,
  orden = 6,
}: {
  e: Expedicion;
  onCambio: (e: Expedicion) => void;
  orden?: number;
}) {
  const problema = e.problemaId ? problemaPorId(e.problemaId) : null;

  if (!problema) {
    return (
      <Hoja titulo="Lo que se enseña antes de salir" orden={orden}>
        <p className="text-[15px] leading-relaxed text-[var(--crema)]/82">
          Esto aparece cuando elijas de qué va a tratar: los conceptos y la
          técnica que hay que ensayar dependen del problema y de la asignatura
          desde la que entres, y sin eso solo podríamos ofrecerte un cuadro en
          blanco.
        </p>
      </Hoja>
    );
  }

  const angulos = angulosDe(problema, e.asignaturas);
  const sugeridas = [...new Set(angulos.flatMap((a) => a.tecnicas))];

  function alternar(campo: "conceptos" | "tecnicas", v: string) {
    const ya = e[campo].includes(v);
    onCambio({
      ...e,
      [campo]: ya ? e[campo].filter((x) => x !== v) : [...e[campo], v],
    });
  }

  return (
    <Hoja titulo="Lo que se enseña antes de salir" orden={orden}>
      <p className="mb-5 max-w-2xl text-[15px] leading-relaxed text-[var(--crema)]/82">
        Esta suele ser la parte que el docente prepara solo, y hay un motivo:
        mandar a un curso a averiguar algo sin haberle enseñado a usar lo que va
        a usar no es dejarlo crear, es dejarlo solo. Cabe en una o dos clases:
        los conceptos que hacen falta para entender el problema, y un ensayo en
        la sala de la técnica con la que van a levantar el dato, sobre algo que
        no importe.
      </p>

      {/* ── Conceptos, por asignatura ──────────────────────────────────── */}
      <p className="rotulo text-[var(--crema)]/75">Conceptos que abre este problema</p>
      <div className="mt-3 space-y-3.5">
        {angulos.map((a) => (
          <div key={a.asignatura}>
            <p className="text-sm text-[var(--crema)]/70">
              {nombreAsignatura(a.asignatura)}
            </p>
            <ul className="mt-2 flex flex-wrap gap-2">
              {a.conceptosClave.map((c) => {
                const marcado = e.conceptos.includes(c);
                return (
                  <li key={c}>
                    <button
                      type="button"
                      onClick={() => alternar("conceptos", c)}
                      aria-pressed={marcado}
                      className={`min-h-11 rounded-full border px-4 text-sm transition ${
                        marcado
                          ? "border-[var(--tierra-600)] bg-[var(--tierra-600)] text-[#1e2a24]"
                          : "border-[var(--crema)]/18 text-[var(--crema)]/85 hover:border-[var(--crema)]/35"
                      }`}
                    >
                      {c}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
      <p className="mt-3 text-sm leading-relaxed text-[var(--crema)]/70">
        Salen del problema cruzado con la asignatura, así que son una propuesta
        y no una lista cerrada. Marca los que vas a pasar de verdad: tres bien
        entendidos sirven más que ocho nombrados.
      </p>

      {/* ── La técnica que se ensaya ───────────────────────────────────── */}
      <div className="mt-7 border-t border-[var(--crema)]/12 pt-5">
        <p className="rotulo text-[var(--crema)]/75">Qué técnica se ensaya en la sala</p>
        <ul className="mt-2.5 flex flex-wrap gap-2">
          {TECNICAS.map((t) => {
            const marcada = e.tecnicas.includes(t.id);
            const propuesta = sugeridas.includes(t.id);
            return (
              <li key={t.id}>
                <button
                  type="button"
                  onClick={() => alternar("tecnicas", t.id)}
                  aria-pressed={marcada}
                  className={`min-h-11 rounded-full border px-4 text-sm transition ${
                    marcada
                      ? "border-[var(--tierra-600)] bg-[var(--tierra-600)] text-[#1e2a24]"
                      : propuesta
                        ? "border-[var(--tierra-600)]/45 text-[var(--crema)]/85 hover:border-[var(--crema)]/40"
                        : "border-[var(--crema)]/12 text-[var(--crema)]/45 hover:border-[var(--crema)]/30"
                  }`}
                >
                  {t.nombre}
                </button>
              </li>
            );
          })}
        </ul>
        <p className="mt-3 text-sm leading-relaxed text-[var(--crema)]/70">
          Las que llevan el borde marcado son las que pide el ángulo que
          elegiste. Las demás se pueden usar igual. Con una bien ensayada basta:
          dos técnicas nuevas en la misma salida es una de más.
        </p>
      </div>

      {e.tecnicas.map((id) => {
        const t = tecnicaPorId(id);
        return t ? <FichaTecnica key={id} t={t} /> : null;
      })}

      {/* ── Lo que tiene que quedar antes de subir a la micro ──────────── */}
      <div className="mt-7 border-t border-[var(--crema)]/12 pt-5">
        <p className="rotulo text-[var(--crema)]/75">
          Qué tiene que estar listo antes de salir
        </p>
        <ul className="mt-3 space-y-3">
          {ANTES_DE_SALIR.map((q) => (
            <li key={q.titulo}>
              <p className="text-[17px] leading-snug text-[var(--crema-clara)]">
                {q.titulo}
              </p>
              <p className="mt-1 text-[15px] leading-relaxed text-[var(--crema)]/82">
                {q.queEs}
              </p>
              <p className="mt-1 text-[15px] leading-relaxed text-[var(--crema)]/70">
                Se nota en que {q.seNotaEn}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </Hoja>
  );
}

/**
 * La ficha de una técnica.
 *
 * La seguridad y la ética van en bloques separados a propósito: la primera es
 * lo que puede lastimar a alguien y la segunda lo que puede dañar a alguien.
 * No son lo mismo y se olvidan distinto. La de ética casi nunca está escrita
 * en ninguna parte y es la que decide si la comunidad vuelve a abrirle la
 * puerta a la escuela el año siguiente.
 */
function FichaTecnica({ t }: { t: ReturnType<typeof tecnicaPorId> }) {
  if (!t) return null;
  return (
    <div className="mt-4 space-y-3.5 rounded-xl border border-[var(--crema)]/14 p-4">
      <p className="rotulo text-[var(--tierra-600)]">{t.nombre}</p>
      <p className="text-[15px] leading-relaxed text-[var(--crema-clara)]">{t.queEs}</p>

      <div>
        <p className="text-sm text-[var(--crema)]/70">Cómo se ensaya en la sala</p>
        <p className="mt-1 text-[15px] leading-relaxed text-[var(--crema)]/85">
          {t.queSeEnsaya}
        </p>
      </div>

      <p className="text-[15px] leading-relaxed text-[var(--crema)]/75">
        <span className="text-[var(--crema-clara)]">Hace falta:</span>{" "}
        {t.materiales.join(", ")}.
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-[var(--tierra-300)]/30 bg-[var(--tierra-300)]/[0.06] px-3.5 py-3">
          <p className="rotulo text-[var(--tierra-300)]">Seguridad</p>
          <ul className="mt-2 space-y-1.5">
            {t.seguridad.map((x) => (
              <li key={x} className="text-[15px] leading-relaxed text-[var(--tierra-300)]">
                {x}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-lg border border-[var(--crema)]/14 px-3.5 py-3">
          <p className="rotulo text-[var(--crema)]/75">Con las personas y el lugar</p>
          <ul className="mt-2 space-y-1.5">
            {t.etica.map((x) => (
              <li key={x} className="text-[15px] leading-relaxed text-[var(--crema)]/85">
                {x}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="text-[15px] leading-relaxed text-[var(--crema)]/75">
        <span className="text-[var(--crema-clara)]">Se cae cuando:</span>{" "}
        {t.seCaeCuando}
      </p>
    </div>
  );
}
