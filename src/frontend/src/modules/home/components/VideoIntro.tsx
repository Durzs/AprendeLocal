import { useState, useSyncExternalStore } from "react";
import { Play } from "lucide-react";

import { useTx } from "../../../shared/tx";
import { useSede } from "../../../shared/sede";

/**
 * El video de presentación, en la portada.
 *
 * Hay dos cortes del mismo video: uno horizontal para pantallas apaisadas y
 * uno vertical para el teléfono. No es recortar uno para sacar el otro: cada
 * uno está compuesto para su formato, y un 16:9 metido en un teléfono vertical
 * queda como una franja con los textos ilegibles.
 *
 * NO SE DESCARGA HASTA QUE ALGUIEN LO PIDE
 *
 * Cada corte pesa unos 6 MB (720p, 30 cuadros, recomprimidos desde los
 * originales de 26 MB). En una escuela rural con datos móviles eso es más que
 * todo el resto del sitio junto, y descargarlo solo por abrir la portada es
 * gastarle los datos a quien no lo iba a ver. Así que la portada muestra un
 * cuadro fijo del video (unos 100 KB, el mismo momento en los dos cortes) y el
 * video recién se pide al tocar el botón. Con sonido, porque trae música: por
 * eso no arranca solo.
 *
 * Los videos no entran al precacheo del modo sin conexión (ver `globPatterns`
 * en vite.config.ts); los cuadros fijos sí, para que la portada no se vea
 * rota sin señal.
 *
 * SOLO EN LA EDICIÓN CHILENA
 *
 * El video está en español y muestra La Araucanía. En la portada brasileña no
 * se muestra hasta que exista uno para Río.
 */

type Corte = { src: string; poster: string; ancho: number; alto: number };

const CORTES: Record<"horizontal" | "vertical", Corte> = {
  horizontal: { src: "/video/intro-horizontal.mp4", poster: "/video/intro-horizontal.webp", ancho: 1280, alto: 720 },
  vertical: { src: "/video/intro-vertical.mp4", poster: "/video/intro-vertical.webp", ancho: 720, alto: 1280 },
};

/** Apaisado y con algo de ancho: un teléfono girado también ve el horizontal. */
const APAISADO = "(orientation: landscape) and (min-width: 640px)";

function suscribir(avisar: () => void) {
  const m = window.matchMedia(APAISADO);
  m.addEventListener("change", avisar);
  return () => m.removeEventListener("change", avisar);
}

const esApaisado = () => window.matchMedia(APAISADO).matches;

export default function VideoIntro() {
  const tx = useTx();
  const sede = useSede();
  const apaisado = useSyncExternalStore(suscribir, esApaisado, () => true);
  // Mientras se reproduce se queda con el corte que empezó: girar el teléfono
  // a mitad del video no debería reiniciarlo desde cero.
  const [enCurso, setEnCurso] = useState<keyof typeof CORTES | null>(null);

  if (sede !== "cl") return null;

  const forma = enCurso ?? (apaisado ? "horizontal" : "vertical");
  const corte = CORTES[forma];

  return (
    <figure className={`mx-auto w-full ${forma === "horizontal" ? "max-w-4xl" : "max-w-[22rem]"}`}>
      <div
        className="relative overflow-hidden rounded-[1.75rem] bg-tinta-950 shadow-2xl shadow-tinta-950/25 ring-1 ring-black/5"
        style={{ aspectRatio: `${corte.ancho} / ${corte.alto}` }}
      >
        {enCurso ? (
          <video
            key={corte.src}
            src={corte.src}
            poster={corte.poster}
            controls
            autoPlay
            playsInline
            className="h-full w-full bg-tinta-950"
          >
            {tx(
              "Tu navegador no puede reproducir este video.",
              "Seu navegador não consegue reproduzir este vídeo."
            )}
          </video>
        ) : (
          <button
            type="button"
            onClick={() => setEnCurso(forma)}
            className="group absolute inset-0 cursor-pointer text-left focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-acento"
            aria-label={tx(
              "Ver el video de AprendeLocal, 1 minuto y 10 segundos, con sonido",
              "Ver o vídeo da AprendeLocal, 1 minuto e 10 segundos, com som"
            )}
          >
            <img
              src={corte.poster}
              alt=""
              width={corte.ancho}
              height={corte.alto}
              className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.02]"
            />
            <span className="absolute inset-0 bg-gradient-to-t from-tinta-950/70 via-transparent to-transparent" aria-hidden />
            <span
              className="absolute left-1/2 top-1/2 grid h-20 w-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/95 shadow-xl transition group-hover:scale-110 sm:h-24 sm:w-24"
              aria-hidden
            >
              <Play className="ml-1 h-9 w-9 fill-tinta-950 text-tinta-950 sm:h-10 sm:w-10" />
            </span>
            <span className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-3 text-white sm:inset-x-7 sm:bottom-6" aria-hidden>
              <span className="text-base font-semibold leading-tight sm:text-lg">
                {tx("Mira cómo funciona", "Veja como funciona")}
              </span>
              <span className="cifra rounded-full bg-white/15 px-3 py-1 text-sm backdrop-blur">1:10</span>
            </span>
          </button>
        )}
      </div>
      <figcaption className="mx-auto mt-4 max-w-2xl text-center text-sm leading-relaxed text-slate-500">
        {tx(
          "En La Araucanía: de una pregunta del lugar al instrumento que el curso construye para responderla.",
          "Na Araucanía: de uma pergunta do lugar ao instrumento que a turma constrói para respondê-la."
        )}
      </figcaption>
    </figure>
  );
}
