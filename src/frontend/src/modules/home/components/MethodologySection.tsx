import { useTranslation } from "react-i18next";

/**
 * Qué es AprendeLocal.
 *
 * LO QUE SE ARREGLÓ AQUÍ
 *
 * A la derecha había cuatro tarjetas con un icono cada una, y cada icono en
 * su propio color: verde esmeralda, azul, naranjo y añil. Cuatro matices
 * distintos, ninguno de la marca, para cuatro piezas que son del mismo rango.
 * Eso es lo que Diego vio desentonar: el color no estaba diciendo nada —las
 * cuatro cosas valen lo mismo— y aun así gritaba cuatro veces distinto.
 *
 * Ahora las cuatro son iguales entre sí y van numeradas, que es la única
 * jerarquía que de verdad hay: ocurren en ese orden. El color queda para el
 * acento, que es uno solo.
 *
 * Los rótulos diminutos y el número fantasma vienen de sutera.ch, la misma
 * gramática que usa la sección del territorio.
 */
export default function MethodologySection() {
  const { t } = useTranslation();

  /**
   * Las cuatro piezas, en el orden en que pasan.
   *
   * No son «pilares»: son los cuatro campos que hay que llenar para que salga
   * una ruta, y por eso están numerados y no adornados.
   */
  const piezas = [
    {
      titulo: "Tu lugar",
      pie: "El estero, el cerro o el camino que se ve por la ventana",
    },
    {
      titulo: "El programa",
      pie: "Los objetivos de Ciencias Naturales que te toca pasar",
    },
    {
      titulo: "Clases escritas",
      pie: "Sesión por sesión, con la hoja de terreno y la carta a las familias",
    },
    {
      titulo: "Alguien lo recibe",
      pie: "Un destinatario de la comunidad, que lo escribes tú",
    },
  ];

  return (
    <section
      id="metodologia"
      className="border-b border-slate-200/70 bg-[var(--tinta-50)] px-4 py-20 sm:px-6 sm:py-28 lg:px-8"
    >
      <div className="mx-auto w-full max-w-7xl">
        {/* ── Franja de anotación ──────────────────────────────────────── */}
        <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 border-b border-slate-300/70 pb-4">
          <span className="rotulo text-[var(--tierra-700)]">Qué es</span>
          <span className="rotulo text-slate-400">
            Educación basada en el lugar
          </span>
        </div>

        <div className="mt-12 grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-14">
          {/* ── El texto ─────────────────────────────────────────────────── */}
          <div className="space-y-6 lg:col-span-6">
            <h2 className="display text-3xl text-[#111217] sm:text-4xl md:text-5xl">
              {t("home.whatIs.title", "¿Qué es AprendeLocal?")}
            </h2>

            <p className="text-base leading-relaxed text-slate-700 sm:text-lg">
              {t(
                "home.whatIs.p1",
                "AprendeLocal arma la clase de ciencias con el lugar donde está tu escuela. Dices qué objetivos te toca pasar y qué hay a distancia de caminata, y sale un proyecto de tres semanas: qué hace cada curso, qué se mide en terreno y qué entregan al final."
              )}
            </p>

            <p className="text-base leading-relaxed text-slate-600 sm:text-lg">
              {t(
                "home.whatIs.p2",
                "Una parte la propone el sistema y la otra la escribes tú. El nombre del estero, a quién se le entrega el trabajo, a quién de la comunidad se le pregunta: eso no lo sabe nadie más, y va vacío hasta que lo pongas."
              )}
            </p>

            <p className="text-base leading-relaxed text-slate-600 sm:text-lg">
              {t(
                "home.whatIs.p3",
                "Todo se imprime. En una escuela sin señal la clase igual sale."
              )}
            </p>
          </div>

          {/* ── Las cuatro piezas ────────────────────────────────────────── */}
          <ol className="grid gap-px overflow-hidden rounded-3xl border border-slate-200 bg-slate-200 sm:grid-cols-2 lg:col-span-6">
            {piezas.map((p, i) => (
              <li
                key={p.titulo}
                className={`animar-asoma animar-asoma-${i + 1} relative overflow-hidden bg-white p-6 sm:p-7`}
              >
                <span
                  aria-hidden
                  className="cifra pointer-events-none absolute -right-1 -top-2 text-[4.5rem] font-semibold leading-none text-slate-900/[0.05]"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="rotulo text-[var(--tierra-700)]">
                  Parte {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="titulo mt-3 text-lg text-slate-900">{p.titulo}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{p.pie}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
