import { useState } from "react";
import { Link } from "react-router-dom";

import { NATIVAS } from "../../biodiversidad/nativas";
import { FAMILIAS } from "../../sequences/crear/preguntas";

/**
 * El territorio, en la portada.
 *
 * Reemplaza a «Qué vas a encontrar al entrar», que era una rejilla de seis
 * tarjetas con enlaces: un índice del sitio disfrazado de sección. Explicaba
 * la aplicación y no decía nada del lugar, que es de lo que trata esto.
 *
 * La idea viene de los sitios que invitan a visitar un lugar: imagen a
 * sangre, tipografía grande, y el territorio con nombre propio en vez de
 * categorías. Con una vuelta, que es la que importa aquí: el destino no es la
 * Amazonía ni la Araucanía en general, es el estero que esa escuela tiene
 * detrás de la cancha. Un docente rural no necesita que le vendan un lugar
 * lejano; necesita que alguien le diga que el suyo alcanza.
 *
 * Las dos piezas que Diego pidió recuperar están aquí:
 *
 *   · La metodología, como las cuatro etapas del viaje. Salen del mismo
 *     archivo que arma las preguntas en /crear, así que lo que promete la
 *     portada es exactamente lo que el docente se encuentra adentro.
 *
 *   · Parte del mapa, que son las especies nativas de verdad, con su nombre
 *     en mapuzugun, su foto de iNaturalist y una frase que el docente pueda
 *     decir en voz alta. Treinta y cinco, no una muestra inventada.
 */

/** El verde y la crema del logotipo. Esta sección es la única a sangre. */
const TINTA = "#1e2a24";

/**
 * Cuáles se enseñan.
 *
 * Doce de treinta y cinco, elegidas para que haya de todo: árboles, aves, un
 * anfibio, un hongo. Una tira de doce árboles seguidos diría menos del bosque
 * que estas doce.
 */
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
 * consola durante el desarrollo y se completa con lo que haya, para que la
 * portada no dependa de que esta lista esté al día.
 */
const MUESTRA = PEDIDAS.map((c) => {
  const n = NATIVAS.find((x) => x.cientifico === c);
  if (!n && import.meta.env.DEV) {
    console.warn(`TerritorioSection: «${c}» no está en NATIVAS y no se va a ver.`);
  }
  return n;
}).filter(Boolean) as typeof NATIVAS;

const ESPECIES = [
  ...MUESTRA,
  ...NATIVAS.filter((n) => !MUESTRA.includes(n)),
].slice(0, 12);

export default function TerritorioSection() {
  return (
    <section
      id="territorio"
      className="relative overflow-hidden px-4 py-20 sm:px-6 sm:py-28 lg:px-8"
      style={{ backgroundColor: TINTA }}
    >
      {/* Grano de papel, la misma capa que el cuaderno de expedición. Sin ella
          el verde queda plano y la sección se lee como una diapositiva. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.14] mix-blend-overlay"
        style={{
          backgroundImage:
            "radial-gradient(#e4ded2 0.5px, transparent 0.5px), radial-gradient(#e4ded2 0.5px, transparent 0.5px)",
          backgroundSize: "7px 7px, 7px 7px",
          backgroundPosition: "0 0, 3.5px 3.5px",
        }}
      />

      <div className="relative mx-auto w-full max-w-7xl">
        {/* ── La invitación ───────────────────────────────────────────── */}
        <div className="max-w-3xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#c9612a]">
            El territorio
          </p>
          <h2 className="mt-3 text-[2.1rem] font-semibold leading-[0.98] tracking-[-0.045em] text-[#f3efe7] sm:text-5xl md:text-6xl">
            El lugar que hay detrás de tu escuela alcanza para tres semanas de
            ciencia
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#e4ded2]/70 sm:text-lg">
            No hace falta llevar al curso a ninguna parte. El estero, el cerro
            o el camino que se ve por la ventana tiene lo que el programa pide:
            algo que medir, alguien a quien preguntarle y alguien que espera lo
            que averigüen.
          </p>
        </div>

        {/* ── La metodología, como las etapas del viaje ────────────────── */}
        <ol className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-[#e4ded2]/14 bg-[#e4ded2]/[0.08] sm:grid-cols-2 lg:grid-cols-4">
          {FAMILIAS.map((f, i) => (
            <li
              key={f.id}
              className={`animar-asoma animar-asoma-${Math.min(i + 1, 4)} flex flex-col p-6 sm:p-7`}
              style={{ backgroundColor: TINTA }}
            >
              <span className="font-mono text-3xl font-semibold tracking-tight text-[#e4ded2]/20">
                0{i + 1}
              </span>
              <h3 className="mt-3.5 text-lg font-semibold leading-snug text-[#f3efe7]">
                {f.titulo}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-[#e4ded2]/60">
                {f.porque}
              </p>
            </li>
          ))}
        </ol>

        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[#e4ded2]/50">
          Las cuatro vienen de David Sobel: los menores conocen el lugar, los
          mayores hacen algo por él. En una sala con varios cursos eso deja de
          ser un estorbo y pasa a ser el reparto del trabajo.{" "}
          <Link
            to="/metodologia"
            className="text-[#c9612a] underline underline-offset-4 transition hover:text-[#e08a52]"
          >
            En qué se apoya
          </Link>
        </p>

        {/* ── Parte del mapa: lo que vive ahí ──────────────────────────── */}
        <div className="mt-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl">
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#c9612a]">
                Qué vive ahí
              </p>
              <h3 className="mt-2.5 text-2xl font-semibold leading-snug tracking-[-0.03em] text-[#f3efe7] sm:text-3xl">
                Con el nombre que le da la gente de aquí
              </h3>
            </div>
            <Link
              to="/crear"
              className="group inline-flex items-center gap-2 rounded-full border border-[#e4ded2]/25 px-5 py-2.5 text-sm font-medium text-[#e4ded2]/85 transition hover:border-[#e4ded2]/55 hover:text-[#f3efe7]"
            >
              Ver lo de tu escuela
              <span aria-hidden className="transition-transform group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>

          {/* Se desliza a lo ancho en vez de apilarse: doce fichas apiladas
              son doce pantallas, y aquí la gracia es pasarles el ojo por
              encima como quien mira un cajón de fotos. */}
          <ul className="mt-7 -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 sm:mx-0 sm:px-0">
            {ESPECIES.map((n) => (
              <Ficha key={n.cientifico} n={n} />
            ))}
          </ul>

          <p className="mt-3 text-xs leading-relaxed text-[#e4ded2]/45">
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

function Ficha({ n }: { n: (typeof NATIVAS)[number] }) {
  // Si la foto no carga —sin señal, o iNaturalist caído— la ficha se sostiene
  // sola con el nombre y la frase, que es lo que de verdad importa.
  const [sinFoto, setSinFoto] = useState(false);

  return (
    <li className="w-[16rem] shrink-0 snap-start sm:w-[18rem]">
      <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-[#e4ded2]/14 bg-[#e4ded2]/[0.04]">
        <div className="relative aspect-[4/3] overflow-hidden bg-[#e4ded2]/[0.06]">
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
              className="grid h-full w-full place-items-center font-mono text-[11px] uppercase tracking-[0.18em] text-[#e4ded2]/25"
            >
              {n.grupo}
            </span>
          )}

          {n.estado && (
            <span className="absolute left-3 top-3 rounded-full bg-[#1e2a24]/85 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.12em] text-[#e0a678] backdrop-blur">
              {ESTADO[n.estado]}
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col p-5">
          {n.mapuzugun && (
            <p className="text-lg font-semibold leading-tight text-[#f3efe7]">
              {n.mapuzugun}
            </p>
          )}
          <p
            className={
              n.mapuzugun
                ? "mt-0.5 text-sm text-[#e4ded2]/65"
                : "text-lg font-semibold leading-tight text-[#f3efe7]"
            }
          >
            {n.comun}
          </p>
          <p className="mt-0.5 font-mono text-[11px] italic text-[#e4ded2]/35">
            {n.cientifico}
          </p>
          <p className="mt-3 flex-1 text-sm leading-relaxed text-[#e4ded2]/70">
            {n.porQue}
          </p>
        </div>
      </article>
    </li>
  );
}
