import { Link } from "react-router-dom";

/**
 * Qué hace esto, en la portada pública.
 *
 * La portada explicaba muy bien la idea y muy mal el producto: quien llegaba
 * sin saber nada entendía la metodología y seguía sin saber qué iba a
 * encontrar al entrar. Aquí están las funciones, con el nombre que tienen
 * dentro y el enlace a donde viven.
 *
 * Cada una dice si pide cuenta. Es más honesto ponerlo antes que dejar que
 * alguien llene tres láminas para toparse con la puerta al final, y además
 * enseña lo que de verdad separa una cosa de la otra: casi todo funciona sin
 * cuenta, y lo que la pide es lo que nos cuesta plata.
 */

const FUNCIONES = [
  {
    a: "/crear",
    titulo: "Armar una ruta con tu lugar",
    cuerpo:
      "Marcas los objetivos que te toca pasar y cuentas qué hay alrededor de tu escuela. Sale un proyecto de tres semanas con sus sesiones.",
    cuenta: "El modelo pide cuenta",
  },
  {
    a: "/rutas",
    titulo: "Cuatro rutas ya escritas",
    cuerpo:
      "Agua, bosque, suelo y calor. Con su pregunta, lo que hace cada curso y a quién le entregan el trabajo. Se ajustan a tu escuela y se imprimen.",
    cuenta: null,
  },
  {
    a: "/crear",
    titulo: "Qué vive junto a tu escuela",
    cuerpo:
      "Lo que la ciencia ciudadana registró alrededor del lugar donde vas a salir, para saber qué se puede encontrar. Datos de iNaturalist y GBIF.",
    cuenta: null,
  },
  {
    a: "/rutas",
    titulo: "Documentos para imprimir",
    cuerpo:
      "Hoja de terreno por curso, guía del estudiante, carta a las familias con su desprendible y la lista de especies. En papel, para una escuela sin señal.",
    cuenta: null,
  },
  {
    a: "/metodologia",
    titulo: "En qué se apoya",
    cuerpo:
      "La educación basada en el lugar de David Sobel: los menores conocen el territorio, los mayores hacen algo por él. Y qué formación hay para llevarlo a la sala.",
    cuenta: null,
  },
  {
    a: "/crear",
    titulo: "Una sala con varios cursos",
    cuerpo:
      "Todo está pensado para multigrado: una sola clase, y cada curso con una tarea distinta que los demás necesitan.",
    cuenta: null,
  },
];

export default function FuncionesSection() {
  return (
    <section
      id="funciones"
      className="border-b border-slate-100 bg-[var(--tinta-50)] px-4 py-16 sm:px-6 sm:py-24 lg:px-8"
    >
      <div className="mx-auto w-full max-w-7xl">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <h2 className="mb-3 text-3xl font-semibold leading-[0.95] tracking-[-0.055em] text-[#111217] sm:text-4xl md:text-5xl">
            Qué vas a encontrar al entrar
          </h2>
          <p className="text-sm text-slate-600 sm:text-base">
            Casi todo funciona sin cuenta y sin señal. Lo decimos aquí para que
            nadie lo descubra a mitad de camino.
          </p>
        </div>

        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FUNCIONES.map((f, i) => (
            <li key={f.titulo} className={`animar-asoma animar-asoma-${Math.min(i + 1, 4)}`}>
              <Link
                to={f.a}
                className="group flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-slate-300 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-bold leading-snug text-slate-900">
                    {f.titulo}
                  </h3>
                  <span
                    aria-hidden
                    className="shrink-0 text-lg text-[var(--tinta-600)] transition-transform group-hover:translate-x-1"
                  >
                    →
                  </span>
                </div>
                <p className="mt-2.5 flex-1 text-sm leading-relaxed text-slate-600">
                  {f.cuerpo}
                </p>
                <span
                  className={`mt-4 inline-block self-start rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] ${
                    f.cuenta
                      ? "border-orange-200 bg-orange-50 text-orange-900"
                      : "border-slate-200 bg-slate-50 text-slate-600"
                  }`}
                >
                  {f.cuenta ?? "Sin cuenta"}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
