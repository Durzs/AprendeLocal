import { useState } from "react";
import { Link } from "react-router-dom";

import { NATIVAS } from "../../biodiversidad/nativas";
import { FAMILIAS } from "../../sequences/crear/preguntas";

/**
 * El territorio, en la portada.
 *
 * Reemplazó a «Qué vas a encontrar al entrar», que eran seis tarjetas con
 * enlaces: un índice del sitio disfrazado de sección. Aquí están la
 * metodología y parte del mapa, que es lo que Diego pidió recuperar.
 *
 * LO QUE SE TOMÓ DE SUTÉRA, Y LO QUE NO
 *
 * Diego mandó sutera.ch como referencia. Es un portafolio con estética de
 * laboratorio: fondo casi negro, un azul eléctrico de acento, y sobre todo
 * micro-tipografía —rótulos diminutos en mayúscula, con mucho espaciado—
 * usada como anotación de instrumento sobre cada pieza. Los temas van
 * numerados 01 a 04, y el sitio abre desarmando su propio nombre:
 * «su (underneath) + tera (earth)».
 *
 * De ahí se toman tres cosas: los rótulos diminutos como anotación, el número
 * grande y fantasma marcando cada etapa, y el recurso de la raíz compartida.
 * No se toma su paleta —AprendeLocal ya tiene la suya, verde y terracota— ni
 * el contador de carga ni el marco personal, que son de ese sitio y de nadie
 * más.
 *
 * El recurso de la raíz aquí funciona mejor que allá, y no por mérito del
 * diseño: en mapuzugun `ko` es agua, y `witrunko`, `menoko` y `trayenko` son
 * tres maneras distintas de que haya agua en un lugar. Eso no es un juego
 * tipográfico, es la idea entera de la plataforma en cuatro líneas. Las
 * palabras salen del catálogo de rutas, no de aquí.
 */

/**
 * El suelo de la sección. Esta es la única sección a sangre.
 *
 * Era el verde del logotipo tal cual. La explicación de por qué ahora es un
 * musgo un poco más cálido está donde vive el color, en index.css.
 */
const TINTA = "var(--bosque-950)";

/**
 * Las palabras del agua, con su raíz.
 *
 * Salen del catálogo de rutas y no se inventa la etimología: lo único que se
 * afirma es que las tres contienen `ko`, que el propio catálogo lista aparte
 * como agua. Presentarlas juntas es agrupar lo que ya está, no proponer un
 * análisis morfológico que no me corresponde hacer.
 */
const RAIZ = {
  raiz: "ko",
  significa: "agua",
  familia: [
    { palabra: "witrunko", es: "agua que corre", nota: "un estero" },
    { palabra: "menoko", es: "ojo de agua", nota: "vertiente con dueño y con reglas" },
    { palabra: "trayenko", es: "salto de agua", nota: "una cascada" },
  ],
};

const PEDIDAS = [
  "Araucaria araucana",
  "Vultur gryphus",
  "Nothofagus dombeyi",
  "Pudu puda",
  "Sephanoides sephaniodes",
  "Lapageria rosea",
  "Rhinoderma darwinii",
  "Leopardus guigna",
  "Scelorchilus rubecula",
  "Cyttaria espinosae",
  "Nothofagus obliqua",
  "Enicognathus ferrugineus",
];

/**
 * Un nombre mal escrito hacía desaparecer la ficha sin decir nada: la tira
 * salía con once en vez de doce y nadie se enteraba. Ahora se avisa en la
 * consola durante el desarrollo y se completa con lo que haya.
 */
const MUESTRA = PEDIDAS.map((c) => {
  const n = NATIVAS.find((x) => x.cientifico === c);
  if (!n && import.meta.env.DEV) {
    console.warn(`TerritorioSection: «${c}» no está en NATIVAS y no se va a ver.`);
  }
  return n;
}).filter(Boolean) as typeof NATIVAS;

const ESPECIES = [...MUESTRA, ...NATIVAS.filter((n) => !MUESTRA.includes(n))].slice(0, 12);

/**
 * El rótulo diminuto que anota cada pieza.
 *
 * El tamaño y el espaciado ya no se escriben aquí: los pone `.rotulo`, en
 * index.css, que es el único sitio donde se decide cómo se ve una anotación
 * en todo el sitio. Antes cada sección elegía el suyo y salían seis.
 */
function Rotulo({ children, tono = "crema" }: { children: React.ReactNode; tono?: "crema" | "naranjo" }) {
  // Sobre este verde, el terracota de marca (#c9612a) da 3:1 de contraste, que
  // a 10 px no se lee. El mismo matiz aclarado da 6:1 y sigue siendo el acento
  // de la marca.
  return (
    <span
      className={`rotulo block ${
        tono === "naranjo" ? "text-[var(--tierra-400)]" : "text-[var(--crema)]/40"
      }`}
    >
      {children}
    </span>
  );
}

export default function TerritorioSection() {
  return (
    <section
      id="territorio"
      className="grano relative overflow-hidden px-4 py-20 sm:px-6 sm:py-28 lg:px-8"
      style={{ backgroundColor: TINTA }}
    >
      <div className="relative z-10 mx-auto w-full max-w-7xl">
        {/* ── Franja de anotación ──────────────────────────────────────── */}
        <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 border-b border-[var(--crema)]/12 pb-4">
          <Rotulo tono="naranjo">El territorio</Rotulo>
          <Rotulo>La Araucanía · Temuco 38.7°S 72.6°O</Rotulo>
        </div>

        {/* ── La invitación ────────────────────────────────────────────── */}
        <div className="mt-10 max-w-4xl">
          <h2 className="display text-[2.1rem] text-[var(--crema-clara)] sm:text-5xl md:text-6xl">
            El lugar que hay detrás de tu escuela alcanza para tres semanas de
            ciencia
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-[var(--crema)]/70 sm:text-lg">
            No hace falta llevar al curso a ninguna parte. El estero, el cerro
            o el camino que se ve por la ventana tiene lo que el programa pide:
            algo que medir, alguien a quien preguntarle y alguien que espera lo
            que averigüen.
          </p>
        </div>

        {/* ── La raíz ──────────────────────────────────────────────────── */}
        <div className="mt-16 grid gap-x-12 gap-y-8 border-y border-[var(--crema)]/12 py-10 lg:grid-cols-[minmax(0,20rem)_1fr]">
          <div>
            <Rotulo>Una raíz</Rotulo>
            {/* En monoespaciada, `ko` se leía como una variable de programa. Es
                una palabra de una lengua: va en la misma tipografía que todo
                lo demás, y destaca por tamaño, que es como destaca una
                palabra. */}
            <p className="mt-4 text-6xl font-semibold leading-none tracking-[-0.04em] text-[var(--crema-clara)] sm:text-7xl">
              {RAIZ.raiz}
            </p>
            <p className="mt-3 text-lg text-[var(--crema)]/70">{RAIZ.significa}</p>
          </div>

          <div>
            <Rotulo>Tres maneras de que haya agua en un lugar</Rotulo>
            <ul className="mt-4 space-y-4">
              {RAIZ.familia.map((f, i) => (
                <li
                  key={f.palabra}
                  className={`animar-asoma animar-asoma-${Math.min(i + 1, 4)} flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b border-[var(--crema)]/8 pb-3.5 last:border-0`}
                >
                  {/* La palabra y su traducción son un par: misma tipografía y
                      mismo tamaño, distinto peso y distinto color. Antes la
                      palabra iba en monoespaciada a 24 px y la traducción en
                      sans a 16, o sea dos tipografías para las dos mitades de
                      una misma línea. */}
                  <span className="nombre text-[1.35rem] text-[var(--crema-clara)]">
                    {f.palabra}
                  </span>
                  <span className="glosa text-[1.35rem] text-[var(--crema)]/70">{f.es}</span>
                  <span className="rotulo ml-auto text-[var(--crema)]/35">{f.nota}</span>
                </li>
              ))}
            </ul>
            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-[var(--crema)]/55">
              Una escuela que sabe si lo suyo es un witrunko o un menoko ya sabe
              qué va a medir y a quién tiene que preguntarle. Por eso la ruta
              empieza preguntando cómo se llama el lugar, y no qué unidad toca.
            </p>
          </div>
        </div>

        {/* ── La metodología, como las etapas del viaje ────────────────── */}
        <div className="mt-16">
          <Rotulo tono="naranjo">Cómo se recorre</Rotulo>
          <ol className="mt-6 grid gap-px overflow-hidden rounded-3xl border border-[var(--crema)]/14 bg-[var(--crema)]/[0.08] sm:grid-cols-2 lg:grid-cols-4">
            {FAMILIAS.map((f, i) => (
              <li
                key={f.id}
                className={`animar-asoma animar-asoma-${Math.min(i + 1, 4)} relative flex flex-col overflow-hidden p-6 sm:p-7`}
                style={{ backgroundColor: TINTA }}
              >
                {/* El número, grande y fantasma, como en la referencia: marca
                    el orden sin competir con el título. */}
                <span
                  aria-hidden
                  className="cifra pointer-events-none absolute -right-2 -top-3 text-[5.5rem] font-semibold leading-none text-[var(--crema)]/[0.06]"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <Rotulo>Etapa {String(i + 1).padStart(2, "0")}</Rotulo>
                <h3 className="titulo mt-3.5 text-lg text-[var(--crema-clara)]">
                  {f.titulo}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--crema)]/60">
                  {f.porque}
                </p>
              </li>
            ))}
          </ol>

          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[var(--crema)]/50">
            Las cuatro vienen de David Sobel: los menores conocen el lugar, los
            mayores hacen algo por él. En una sala con varios cursos eso deja de
            ser un estorbo y pasa a ser el reparto del trabajo.{" "}
            <Link
              to="/metodologia"
              className="text-[var(--tierra-400)] underline underline-offset-4 transition hover:text-[var(--tierra-300)]"
            >
              En qué se apoya
            </Link>
          </p>
        </div>

        {/* ── Parte del mapa: lo que vive ahí ──────────────────────────── */}
        <div className="mt-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl">
              <Rotulo tono="naranjo">Qué vive ahí</Rotulo>
              <h3 className="titulo mt-3 text-2xl text-[var(--crema-clara)] sm:text-3xl">
                Con el nombre que le da la gente de aquí
              </h3>
            </div>
            <Link
              to="/crear"
              className="group inline-flex items-center gap-2 rounded-full border border-[var(--crema)]/25 px-5 py-2.5 text-sm font-medium text-[var(--crema)]/85 transition hover:border-[var(--crema)]/55 hover:text-[var(--crema-clara)]"
            >
              Ver lo de tu escuela
              <span aria-hidden className="transition-transform group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>

          {/* Se desliza a lo ancho: doce fichas apiladas son doce pantallas, y
              aquí la gracia es pasarles el ojo por encima. */}
          <ul className="mt-7 -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 sm:mx-0 sm:px-0">
            {ESPECIES.map((n, i) => (
              <Ficha key={n.cientifico} n={n} i={i} />
            ))}
          </ul>

          <p className="mt-3 text-xs leading-relaxed text-[var(--crema)]/45">
            Las fotografías vienen de iNaturalist. Los nombres en mapuzugun no
            los ha revisado un hablante todavía: antes de imprimirlos,
            pregúntale al educador tradicional de tu escuela.
          </p>
        </div>
      </div>
    </section>
  );
}

const ESTADO: Record<string, string> = {
  en_peligro: "En peligro",
  vulnerable: "Vulnerable",
  casi_amenazada: "Casi amenazada",
};

function Ficha({ n, i }: { n: (typeof NATIVAS)[number]; i: number }) {
  // Si la foto no carga —sin señal, o iNaturalist caído— la ficha se sostiene
  // sola con el nombre y la frase, que es lo que de verdad importa.
  const [sinFoto, setSinFoto] = useState(false);

  return (
    <li className="w-[16rem] shrink-0 snap-start sm:w-[18rem]">
      <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--crema)]/14 bg-[var(--crema)]/[0.04]">
        <div className="relative aspect-[4/3] overflow-hidden bg-[var(--crema)]/[0.06]">
          {n.fotoUrl && !sinFoto ? (
            <img
              src={n.fotoUrl}
              alt={n.comun}
              loading="lazy"
              onError={() => setSinFoto(true)}
              className="h-full w-full object-cover transition duration-700 hover:scale-105"
            />
          ) : (
            <span
              aria-hidden
              className="rotulo grid h-full w-full place-items-center text-[var(--crema)]/25"
            >
              {n.grupo}
            </span>
          )}

          {/* La numeración va sobre la foto, como la anotación de una lámina
              de herbario. */}
          <span className="cifra absolute right-3 top-3 text-[10px] tracking-[0.18em] text-[var(--crema)]/70 mix-blend-difference">
            {String(i + 1).padStart(2, "0")}
          </span>

          {n.estado && (
            <span className="rotulo absolute left-3 top-3 rounded-full bg-[var(--bosque-950)]/85 px-2.5 py-1.5 text-[var(--tierra-300)] backdrop-blur">
              {ESTADO[n.estado]}
            </span>
          )}
        </div>

        {/* ── El nombre ────────────────────────────────────────────────────
            Aquí estaba el peor caso de todo el sitio, y es el que Diego
            señaló: el nombre común salía en monoespaciada a 18 px cuando la
            especie no tenía nombre en mapuzugun, y en sans a 14 px cuando sí
            lo tenía. El mismo dato, dos tipografías y dos tamaños, decidido
            por lo que tuviera el campo de al lado.

            Un nombre en mapuzugun y su equivalente en castellano son la misma
            clase de cosa —los dos son el nombre del bicho— y por eso van en la
            misma tipografía y el mismo tamaño. Lo único que cambia es cuál va
            primero, y eso sí tiene una razón: la sección se llama «con el
            nombre que le da la gente de aquí». */}
        <div className="flex flex-1 flex-col p-5">
          <p className="nombre text-[var(--crema-clara)]">
            {n.mapuzugun || n.comun}
          </p>
          {n.mapuzugun && (
            <p className="glosa mt-1 text-[var(--crema)]/60">{n.comun}</p>
          )}
          <p className="mt-1.5 text-[11px] italic text-[var(--crema)]/35">{n.cientifico}</p>
          <p className="mt-3 flex-1 text-sm leading-relaxed text-[var(--crema)]/70">{n.porQue}</p>
        </div>
      </article>
    </li>
  );
}
