import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

/**
 * Cómo se arma una ruta, en la portada.
 *
 * Antes esta sección era un escaparate: las cuatro rutas escritas, con su
 * pregunta y sus cursos, como si el producto fuera escoger de una lista de
 * cuatro. Eso decía lo que el producto no es. Una escuela rural de la
 * Araucanía no anda buscando «la ruta del agua»; anda buscando qué hacer con
 * el estero que tiene detrás de la cancha y con los objetivos que le tocan
 * este semestre. Las cuatro rutas escritas son el material del que sale su
 * ruta, no la vitrina donde elige.
 *
 * Así que la portada ya no las lista. Muestra el recorrido: qué se le pregunta
 * al docente, qué pone él, y qué sale de ahí. La ruta se designa al final de
 * ese recorrido, a partir de los Objetivos de Aprendizaje que marcó.
 */

/** Los tres pasos, y de quién es cada parte. */
const PASOS = [
  {
    n: "01",
    titulo: "Lo que ya está decidido",
    cuerpo:
      "Tus cursos, las semanas que tienes y los Objetivos de Aprendizaje que te toca pasar. Se marcan de una lista, no se escriben de memoria.",
    pone: "Lo pone el programa",
    color: "text-blue-800 bg-blue-50 border-blue-200",
  },
  {
    n: "02",
    titulo: "Lo que hay al otro lado de la puerta",
    cuerpo:
      "Qué se alcanza caminando, cómo se llama y qué pasa ahí que en otra escuela no pasaría igual. Esto no lo sabe nadie más que tú.",
    pone: "Lo pones tú",
    color: "text-orange-900 bg-orange-50 border-orange-200",
  },
  {
    n: "03",
    titulo: "La pregunta que aguanta tres semanas",
    cuerpo:
      "Llegan borradores armados con lo que escribiste. Los corriges hasta que la pregunta lleve tus palabras, y esa es la que sostiene el proyecto.",
    pone: "Entre los dos",
    color: "text-emerald-800 bg-emerald-50 border-emerald-200",
  },
];

export default function ProjectsSection() {
  const { t } = useTranslation();

  return (
    <section
      id="proyectos"
      className="border-b border-slate-100 bg-white px-4 py-16 sm:px-6 sm:py-24 lg:px-8"
    >
      <div className="mx-auto w-full max-w-7xl">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <h2 className="mb-3 text-3xl font-semibold leading-[0.95] tracking-[-0.055em] text-[#111217] sm:text-4xl md:text-5xl">
            {t(
              "home.build.title",
              "La ruta se arma con tu lugar, no se escoge de una lista"
            )}
          </h2>
          <p className="text-sm text-slate-600 sm:text-base">
            {t(
              "home.build.subtitle",
              "Tres pasos. Una parte la propone el sistema y la otra la escribes tú, porque el estero de tu escuela no lo conoce nadie más."
            )}
          </p>
        </div>

        <ol className="grid gap-6 md:grid-cols-3">
          {PASOS.map((p, i) => (
            <li
              key={p.n}
              className={`animar-asoma animar-asoma-${Math.min(i + 1, 4)} flex flex-col rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-md`}
            >
              <div className="flex items-baseline justify-between gap-3">
                <span className="font-mono text-3xl font-semibold tracking-tight text-slate-300">
                  {p.n}
                </span>
                <span
                  className={`rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ${p.color}`}
                >
                  {p.pone}
                </span>
              </div>
              <h3 className="mt-4 text-xl font-bold leading-snug text-slate-900">
                {p.titulo}
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-slate-600">{p.cuerpo}</p>
            </li>
          ))}
        </ol>

        {/* Lo que sale al final. Va aparte y no como un cuarto paso, porque no
            es algo que el docente haga: es lo que se lleva impreso. */}
        <div className="mt-6 rounded-3xl border border-slate-200 bg-[#f8fafc] p-7 sm:p-9">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-xl">
              <span className="rotulo text-slate-500">
                {t("home.build.outEyebrow", "Y sale de ahí")}
              </span>
              <p className="mt-2 text-lg font-semibold leading-snug text-slate-900">
                {t(
                  "home.build.outTitle",
                  "Las sesiones, los documentos para imprimir y lo que vive alrededor de tu escuela."
                )}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {t(
                  "home.build.outBody",
                  "Los documentos salen de los objetivos que marcaste y de lo que escribiste del lugar, sin volver a pedírtelo. Los datos de especies vienen de iNaturalist y GBIF."
                )}
              </p>
            </div>
            <Link
              to="/crear"
              className="group inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#0a0047] px-7 py-3.5 text-sm font-bold text-white shadow-md shadow-[#0a0047]/20 transition hover:bg-[#140066]"
            >
              {t("home.build.cta", "Empezar a armar la mía")}
              <span aria-hidden className="transition-transform group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
