import { useState } from "react";
import { Link } from "react-router-dom";

import { NATIVAS } from "../../biodiversidad/nativas";
import EtapasMetodo from "./EtapasMetodo";

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
 * De ahí quedan dos cosas: los rótulos diminutos como anotación y el número
 * grande y fantasma marcando cada etapa. No se toma su paleta ni el contador
 * de carga ni el marco personal, que son de ese sitio y de nadie más.
 *
 * LO QUE SE FUE, Y POR QUÉ
 *
 * Había un tercer recurso copiado de allá: la raíz compartida. `ko` es agua
 * en mapuzugun, y `witrunko`, `menoko` y `trayenko` son tres maneras de que
 * haya agua en un lugar. Se veía bien y decía algo cierto, pero Diego levantó
 * dos cosas que pesan más. La primera es que no sabía si agregaba o restaba:
 * es el trozo más decorativo de una sección que por lo demás promete cosas
 * concretas. La segunda es la que decide: esto se va a usar fuera de La
 * Araucanía, y una portada que abre con una etimología en mapuzugun le habla
 * a una región y no a una escuela rural cualquiera. Las palabras siguen donde
 * sirven, en el catálogo de rutas y en las fichas de las especies, que es
 * donde el docente las va a leer con su curso.
 */

/**
 * El verde del logotipo, bajado a fondo.
 *
 * La sección era un bloque verde oscuro a sangre, con la crema encima. Venía
 * de Sutéra y, cuando la portada volvió a la estética de Isidora —blanca,
 * aireada, con tarjetas redondeadas y sombra suave—, quedó siendo lo único
 * del sitio que hablaba otro idioma: un rectángulo negro verdoso entre ocho
 * secciones claras.
 *
 * Sigue siendo la sección verde, que es como Diego la llama, pero el verde
 * pasa de ser el fondo entero a ser el tinte del papel. Lo que estaba en
 * crema sobre oscuro está ahora en tinta sobre claro, y las fichas son las
 * mismas tarjetas blancas con borde y sombra suave que usa el resto de la
 * portada. Lo que no cambia es nada de lo que dice.
 */
const VERDE_PAPEL = "var(--verde-papel)";

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
  return (
    <span
      className={`rotulo block ${
        tono === "naranjo" ? "text-orange-700" : "text-slate-500"
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
      className="relative overflow-hidden border-y border-slate-200/70 px-4 py-20 sm:px-6 sm:py-28 lg:px-8"
      style={{ backgroundColor: VERDE_PAPEL }}
    >
      <div className="relative z-10 mx-auto w-full max-w-7xl">
        {/* ── Franja de anotación ──────────────────────────────────────── */}
        <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 border-b border-slate-300/70 pb-4">
          <Rotulo tono="naranjo">El territorio</Rotulo>
          <Rotulo>Piloto en La Araucanía, Chile</Rotulo>
        </div>

        {/* ── La invitación ────────────────────────────────────────────── */}
        <div className="mt-10 max-w-4xl">
          <h2 className="display text-[2.1rem] text-[#111217] sm:text-5xl md:text-6xl">
            El lugar que hay detrás de tu escuela alcanza para tres semanas de
            ciencia
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
            No hace falta llevar al curso a ninguna parte. El estero, el cerro
            o el camino que se ve por la ventana tiene lo que el programa pide:
            algo que medir, alguien a quien preguntarle y alguien que espera lo
            que averigüen.
          </p>
        </div>

        {/* ── La metodología, como las etapas del viaje ────────────────── */}
        <div className="mt-16">
          {/* Eran cuatro tarjetas que ya no correspondían a nada: el método
              tiene seis etapas y la portada seguía prometiendo cuatro. Ahora
              son las seis, y lo que el visitante escoge son los dos proyectos
              de ejemplo. Está aparte porque tiene estado propio y esta sección
              ya es larga. */}
          <EtapasMetodo />

          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-slate-600">
            Los menores conocen el lugar y los mayores hacen algo por él: en
            una sala con varios cursos a la vez, eso deja de ser un estorbo y
            pasa a ser el reparto del trabajo.{" "}
            {/* Llevaba a /metodologia, que ya no existe: sus pilares volvieron
                a la portada, unas pantallas más arriba. */}
            <a
              href="#habilidades"
              className="text-orange-700 underline underline-offset-4 transition hover:text-orange-800"
            >
              En qué se apoya
            </a>
          </p>
        </div>

        {/* ── Parte del mapa: lo que vive ahí ──────────────────────────── */}
        <div className="mt-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl">
              <Rotulo tono="naranjo">Qué vive ahí</Rotulo>
              <h3 className="titulo mt-3 text-2xl text-[#111217] sm:text-3xl">
                Con el nombre que le da la gente de aquí
              </h3>
            </div>
            <Link
              to="/crear"
              className="group inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-400 hover:text-[#111217]"
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

          <p className="mt-3 text-xs leading-relaxed text-slate-500">
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
      <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
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
              className="rotulo grid h-full w-full place-items-center text-slate-400"
            >
              {n.grupo}
            </span>
          )}

          {/* La numeración va sobre la foto, como la anotación de una lámina
              de herbario. */}
          <span className="cifra absolute right-3 top-3 text-[10px] tracking-[0.18em] text-white/80 mix-blend-difference">
            {String(i + 1).padStart(2, "0")}
          </span>

          {n.estado && (
            <span className="rotulo absolute left-3 top-3 rounded-full border border-orange-200 bg-white/90 px-2.5 py-1.5 text-orange-800 backdrop-blur">
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
          <p className="nombre text-[#111217]">
            {n.mapuzugun || n.comun}
          </p>
          {n.mapuzugun && (
            <p className="glosa mt-1 text-slate-600">{n.comun}</p>
          )}
          <p className="mt-1.5 text-[11px] italic text-slate-400">{n.cientifico}</p>
          <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">{n.porQue}</p>
        </div>
      </article>
    </li>
  );
}
