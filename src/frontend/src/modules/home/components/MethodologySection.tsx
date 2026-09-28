import { useTranslation } from "react-i18next";

import { useIdioma } from "../../../shared/tx";
import { etapasEn } from "../../sequences/metodo/etapas";
import territorio from "../../../assets/images/que-es/territorio.webp";
import ciencia from "../../../assets/images/que-es/ciencia.webp";
import comunidad from "../../../assets/images/que-es/comunidad.webp";

/**
 * «¿Qué es AprendeLocal?», con el lenguaje del video de presentación.
 *
 * Eran cuatro cuadros blancos con un ícono de colores cada uno, iguales a los
 * de cualquier sitio. El video que abre la portada tiene una voz propia:
 * fondo azul profundo, tarjetas de papel crema un poco torcidas como fotos
 * sobre una mesa, un rótulo chico con punto naranjo y la pregunta en azul.
 * Esta sección es la que viene justo después del video, así que habla igual.
 *
 * Las tres fotos son cuadros del mismo video (La Araucanía): el bosque de
 * araucarias en la niebla, un renoval medido en terreno, y una casa del
 * sector con nieve. La tercera tarjeta no lleva foto sino las seis etapas,
 * como la ficha del proyecto que aparece en el video: una ruta es eso.
 */

/** Los dos colores del video, medidos sobre el cuadro. */
const AZUL = "#172a85";
const CREMA = "#f2ece3";

/** Cada tarjeta un poco torcida, distinta de la vecina. */
const GIRO = ["-rotate-[1.5deg]", "rotate-[1.2deg]", "rotate-[1deg]", "-rotate-[1.2deg]"];

type Tarjeta = { etiqueta: string; texto: string };

export default function MethodologySection() {
  const { t } = useTranslation();
  const idioma = useIdioma();

  const nombres = t("home.whatIs.pilares", { returnObjects: true }) as string[];
  const tarjetas = t("home.whatIs.tarjetas", { returnObjects: true }) as Tarjeta[];
  const etapas = etapasEn(idioma);
  const fotos = [territorio, ciencia, null, comunidad];

  return (
    <section
      id="metodologia"
      className="relative isolate overflow-hidden px-4 py-20 sm:px-6 sm:py-28 lg:px-8"
      style={{ background: AZUL }}
    >
      <CurvasDeNivel />

      <div className="mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div className="text-left">
          {/* El indicador de etapas del video: seis puntos y un rótulo. */}
          <p className="inline-flex items-center gap-2.5 rounded-full bg-[#0a1450] px-3.5 py-1.5 text-sm text-white/85">
            <span className="flex gap-1" aria-hidden>
              {Array.from({ length: 6 }, (_, i) => (
                <span key={i} className={`h-1.5 w-1.5 rounded-full ${i === 0 ? "bg-[#f97316]" : "bg-white/40"}`} />
              ))}
            </span>
            <span className="font-serif">{t("home.whatIs.rotulo", "Qué es")}</span>
          </p>

          <h2 className="mt-6 text-4xl font-bold leading-[0.95] tracking-[-0.045em] text-white sm:text-5xl md:text-6xl [text-wrap:balance]">
            {t("home.whatIs.title", "¿Qué es AprendeLocal?")}
          </h2>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/90">
            {t("home.whatIs.p1")}
          </p>
          <p className="mt-4 max-w-xl font-serif text-base leading-relaxed text-white/70 sm:text-lg">
            {t("home.whatIs.p2")}
          </p>
        </div>

        <ul className="grid gap-6 sm:grid-cols-2 sm:gap-5">
          {tarjetas.map((tarjeta, i) => {
            const foto = fotos[i];
            return (
              <li
                key={nombres[i]}
                className={`mx-auto w-full max-w-sm rounded-2xl p-3 pb-5 shadow-[0_18px_40px_-12px_rgba(5,10,60,0.55)] transition duration-300 hover:-translate-y-1 hover:rotate-0 sm:max-w-none ${GIRO[i]}`}
                style={{ background: CREMA }}
              >
                <div className="aspect-[4/3] overflow-hidden rounded-xl">
                  {foto ? (
                    <img
                      src={foto}
                      alt=""
                      width={800}
                      height={600}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <ol className="flex h-full flex-col justify-center gap-[0.35rem] rounded-xl border border-[#172a85]/15 bg-white/60 px-4 py-3">
                      {etapas.map((e, n) => (
                        <li key={e.id} className="flex items-center gap-2.5 font-serif text-sm leading-tight text-[#172a85] sm:text-[13px]">
                          <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full border border-[#172a85]/40 text-[10px] tabular-nums">
                            {String(n + 1).padStart(2, "0")}
                          </span>
                          <span className="truncate">{e.nombre}</span>
                        </li>
                      ))}
                    </ol>
                  )}
                </div>
                <p className="mt-4 flex items-center gap-2 px-1 font-serif text-sm text-[#172a85]/75">
                  <span className="h-2 w-2 shrink-0 rounded-full bg-[#f97316]" aria-hidden />
                  {tarjeta.etiqueta}
                </p>
                <h3 className="mt-1.5 px-1 text-xl font-bold leading-tight tracking-[-0.03em] text-[#172a85]">
                  {nombres[i]}
                </h3>
                <p className="mt-1.5 px-1 text-[15px] leading-snug text-slate-700">{tarjeta.texto}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/**
 * Las curvas de nivel del video, de fondo y apenas visibles. Un cerro dibujado
 * con elipses, que es como el video marca los lugares en el mapa.
 */
function CurvasDeNivel() {
  return (
    <svg
      className="pointer-events-none absolute -bottom-10 -right-24 -z-10 w-[42rem] max-w-none text-white/[0.09] sm:-right-10"
      viewBox="0 0 600 300"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden
    >
      {Array.from({ length: 12 }, (_, i) => (
        <ellipse key={i} cx="300" cy={250 - i * 14} rx={280 - i * 22} ry={46 - i * 3.2} />
      ))}
    </svg>
  );
}
