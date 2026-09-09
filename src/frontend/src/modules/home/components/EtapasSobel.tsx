import { useEffect, useRef, useState } from "react";

import { FAMILIAS, proponer } from "../../sequences/crear/preguntas";
import { VACIA, type Entorno } from "../../sequences/crear/expedicion";

/**
 * Las cuatro etapas de Sobel, con lo que cada una hace.
 *
 * Eran cuatro párrafos en una rejilla. Un párrafo explica una etapa, pero no
 * la muestra: «medir y comparar» dicho con palabras es una definición, y dicho
 * con dos barras que crecen a alturas distintas y un número que aparece entre
 * ellas es la cosa misma. Cada etapa tiene ahora su dibujo, y cada dibujo hace
 * exactamente lo que dice su etapa.
 *
 * LO INTERACTIVO NO ES EL DIBUJO
 *
 * Lo que de verdad se puede tocar aquí son las preguntas. Debajo del título
 * hay una fila para escoger qué hay cerca de tu escuela —un río, un bosque, un
 * cerro— y las cuatro preguntas se rehacen con eso. No son ejemplos escritos a
 * mano para la portada: salen de `proponer()`, la misma función que usa el
 * cuaderno de expedición en el paso 2. Quien mueve el chip está viendo
 * funcionar el mecanismo central de la aplicación antes de entrar, y lo que
 * ve aquí es literalmente lo que le va a salir allá.
 *
 * Por lo mismo se dice que son borradores. En el cuaderno se presentan así, y
 * prometer aquí algo más terminado que lo que hay adentro sería vender otra
 * cosa.
 */

/** Las opciones de la fila, con el nombre que tienen en el cuaderno. */
const ENTORNOS: { id: Entorno; etiqueta: string }[] = [
  { id: "rio", etiqueta: "un río" },
  { id: "bosque", etiqueta: "un bosque" },
  { id: "campo", etiqueta: "un campo" },
  { id: "cordillera", etiqueta: "un cerro" },
  { id: "costa", etiqueta: "la orilla" },
  { id: "pueblo", etiqueta: "el pueblo" },
];

/** El dibujo de cada etapa, por el id de la familia. */
const DIBUJOS: Record<string, () => React.ReactNode> = {
  mirar: Mirar,
  medir: Medir,
  preguntar: Preguntar,
  devolver: Devolver,
};

/**
 * Cuál de las dos preguntas de cada familia se enseña aquí.
 *
 * `proponer` da dos por familia y no todas nombran el lugar. La primera de
 * «devolver» es «¿A quién le sirve saber esto, y cómo se lo entregamos?», que
 * está bien pero es la misma para un río que para un cerro: al mover la fila
 * de arriba, tres tarjetas cambiaban y la cuarta se quedaba quieta, que se lee
 * como que algo falló.
 *
 * En vez de escribir a mano qué pregunta va en cada tarjeta —que se rompe en
 * silencio la próxima vez que alguien edite las plantillas— se pide lo mismo
 * dos veces con entornos distintos y se guarda, por familia, la que salió
 * distinta. O sea: se enseña la que responde. Si algún día ninguna de las dos
 * responde, se enseña la primera y no pasa nada.
 */
const QUE_RESPONDE: Record<string, number> = (() => {
  const conRio = proponer({ ...VACIA, entorno: "rio" });
  const conCerro = proponer({ ...VACIA, entorno: "cordillera" });
  const elegida: Record<string, number> = {};
  for (const f of FAMILIAS) {
    const a = conRio.filter((p) => p.familia === f.id);
    const b = conCerro.filter((p) => p.familia === f.id);
    const i = a.findIndex((p, n) => p.texto !== b[n]?.texto);
    elegida[f.id] = i === -1 ? 0 : i;
  }
  return elegida;
})();

export default function EtapasSobel() {
  const [entorno, setEntorno] = useState<Entorno>("rio");
  const [enVista, setEnVista] = useState(false);
  const caja = useRef<HTMLDivElement>(null);

  // Los dibujos no se animan hasta que se llega a ellos. Animarlos al cargar
  // la página significa que para cuando alguien baja hasta aquí ya terminaron,
  // o sea que no los ve nadie.
  useEffect(() => {
    const el = caja.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setEnVista(true);
      },
      { threshold: 0.25 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Las preguntas salen de la misma función que el cuaderno, con una
  // expedición que solo tiene puesto el entorno. Sin lugar escrito, `proponer`
  // usa el nombre genérico del entorno y la frase se lee igual de bien.
  const propuestas = proponer({ ...VACIA, entorno });
  const preguntaDe = (familia: string) =>
    propuestas.filter((p) => p.familia === familia)[QUE_RESPONDE[familia] ?? 0]?.texto ?? "";

  return (
    <div ref={caja}>
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
        <div className="max-w-xl">
          <span className="rotulo block text-[#f97316]">Cómo se recorre</span>
          <p className="mt-3 text-sm leading-relaxed text-[var(--crema)]/60">
            Las cuatro vienen de David Sobel y van en este orden. Escoge qué
            hay cerca de tu escuela: las preguntas se rehacen con eso.
          </p>
        </div>

        {/* La fila que rehace las cuatro preguntas. */}
        <fieldset className="flex flex-wrap gap-2">
          <legend className="sr-only">Qué hay cerca de tu escuela</legend>
          {ENTORNOS.map((e) => {
            const puesto = e.id === entorno;
            return (
              <button
                key={e.id}
                type="button"
                onClick={() => setEntorno(e.id)}
                aria-pressed={puesto}
                className={`cursor-pointer rounded-full border px-4 py-1.5 text-sm transition ${
                  puesto
                    ? "border-[#f97316] bg-[#f97316]/15 text-[#fbbf24]"
                    : "border-[var(--crema)]/20 text-[var(--crema)]/65 hover:border-[var(--crema)]/45 hover:text-[var(--crema-clara)]"
                }`}
              >
                {e.etiqueta}
              </button>
            );
          })}
        </fieldset>
      </div>

      <ol className="mt-7 grid gap-px overflow-hidden rounded-3xl border border-[var(--crema)]/14 bg-[var(--crema)]/[0.08] sm:grid-cols-2 lg:grid-cols-4">
        {FAMILIAS.map((f, i) => (
          <Etapa
            key={f.id}
            indice={i}
            titulo={f.titulo}
            porque={f.porque}
            pregunta={preguntaDe(f.id)}
            Dibujo={DIBUJOS[f.id]}
            enVista={enVista}
          />
        ))}
      </ol>

      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[var(--crema)]/50">
        Las preguntas son borradores: la que quede escrita con tus palabras
        siempre va a ser mejor que estas. Salen del mismo sitio que las del
        cuaderno, y ahí se corrigen una por una.
      </p>
    </div>
  );
}

function Etapa({
  indice,
  titulo,
  porque,
  pregunta,
  Dibujo,
  enVista,
}: {
  indice: number;
  titulo: string;
  porque: string;
  pregunta: string;
  Dibujo?: () => React.ReactNode;
  enVista: boolean;
}) {
  // Volver a pasar el ratón vuelve a dibujar. Las animaciones son de CSS y no
  // se reinician solas, así que se cambia la llave del dibujo y React lo monta
  // de nuevo: es la manera corta de rebobinar sin llevar el estado de cada
  // fotograma.
  const [pase, setPase] = useState(0);
  const rebobinar = () => setPase((n) => n + 1);

  return (
    <li
      className="group relative flex flex-col overflow-hidden p-6 sm:p-7"
      style={{ backgroundColor: "var(--bosque-950)" }}
      onMouseEnter={rebobinar}
      onFocus={rebobinar}
    >
      {/* El número, grande y fantasma: marca el orden sin competir. */}
      <span
        aria-hidden
        className="cifra pointer-events-none absolute -right-2 -top-3 text-[5.5rem] font-semibold leading-none text-[var(--crema)]/[0.06]"
      >
        {String(indice + 1).padStart(2, "0")}
      </span>

      <span className="rotulo block text-[var(--crema)]/40">
        Etapa {String(indice + 1).padStart(2, "0")}
      </span>

      {/* El dibujo espera a que se llegue a él. Antes de eso ocupa su sitio
          vacío, así la rejilla no da un salto cuando aparece. */}
      <div aria-hidden className="mt-5 h-[72px]">
        {enVista && Dibujo && <div key={pase}>{Dibujo()}</div>}
      </div>

      <h3 className="titulo mt-5 text-lg text-[var(--crema-clara)]">{titulo}</h3>
      <p className="mt-2 text-sm leading-relaxed text-[var(--crema)]/60">{porque}</p>

      {/* La pregunta que produce esta etapa, con el entorno escogido arriba.
          La llave lleva el texto: al cambiar de entorno el elemento se monta
          de nuevo y la pregunta nueva entra asomándose, que es lo que hace
          notar que cambió. */}
      <p
        key={pregunta}
        className="animar-asoma mt-5 flex-1 border-t border-[var(--crema)]/12 pt-4 text-sm leading-snug text-[#fbbf24]"
      >
        {pregunta}
      </p>
    </li>
  );
}

/* ───────────────────────────────────────────────────────────────────────────
 * Los cuatro dibujos.
 *
 * Todos en el mismo lienzo de 120×72, con el mismo trazo y la misma paleta:
 * la crema para lo que ya estaba, el terracota para lo que hace la etapa. La
 * gramática la ponen las clases `.trazo`, `.crece` y `.marca` de index.css.
 * ─────────────────────────────────────────────────────────────────────────── */

const LIENZO = "h-full w-full max-w-[132px]";
const CREMA = "var(--crema)";
const ACENTO = "#f97316";

/** Mirar de cerca: el marco se cierra sobre un trozo, y ahí aparece lo que no se veía. */
function Mirar() {
  return (
    <svg className={LIENZO} viewBox="0 0 120 72" fill="none">
      {/* La línea del lugar, vista de lejos. */}
      <path
        className="trazo paso-1"
        style={{ ["--largo" as string]: 150 }}
        d="M2 54 C 22 40, 34 46, 48 34 C 62 22, 78 30, 96 20 L 118 26"
        stroke={CREMA}
        strokeOpacity="0.45"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* El marco que se cierra sobre un trozo. */}
      <rect
        className="trazo paso-2"
        style={{ ["--largo" as string]: 132 }}
        x="58"
        y="14"
        width="42"
        height="30"
        rx="3"
        stroke={ACENTO}
        strokeWidth="1.5"
      />
      {/* Lo que solo se ve estando ahí. */}
      <circle className="marca paso-3" cx="70" cy="30" r="2.5" fill={ACENTO} />
      <circle className="marca paso-4" cx="80" cy="24" r="2" fill={ACENTO} />
      <circle className="marca paso-5" cx="88" cy="34" r="2.5" fill={ACENTO} />
    </svg>
  );
}

/** Medir y comparar: dos barras a alturas distintas, y la diferencia entre ellas. */
function Medir() {
  return (
    <svg className={LIENZO} viewBox="0 0 120 72" fill="none">
      <line x1="8" y1="60" x2="112" y2="60" stroke={CREMA} strokeOpacity="0.3" strokeWidth="1.5" />
      <rect className="crece paso-1" x="26" y="30" width="18" height="30" rx="2" fill={CREMA} fillOpacity="0.35" />
      <rect className="crece paso-2" x="62" y="14" width="18" height="46" rx="2" fill={ACENTO} />
      {/* La diferencia, que es el dato que antes no existía. */}
      <path
        className="trazo paso-3"
        style={{ ["--largo" as string]: 40 }}
        d="M52 30 L52 14 M48 30 L56 30 M48 14 L56 14"
        stroke={ACENTO}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <rect className="marca paso-4" x="88" y="24" width="22" height="13" rx="3" fill={ACENTO} fillOpacity="0.22" />
      <line className="marca paso-4" x1="92" y1="30.5" x2="106" y2="30.5" stroke={ACENTO} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/** Preguntar a quien sabe: la pregunta va, la memoria vuelve. */
function Preguntar() {
  return (
    <svg className={LIENZO} viewBox="0 0 120 72" fill="none">
      {/* El curso y la persona que sabe. */}
      <circle cx="20" cy="46" r="7" stroke={CREMA} strokeOpacity="0.45" strokeWidth="1.5" />
      <circle className="marca paso-4" cx="100" cy="46" r="7" fill={ACENTO} fillOpacity="0.25" stroke={ACENTO} strokeWidth="1.5" />
      {/* La pregunta que va. */}
      <path
        className="trazo paso-1"
        style={{ ["--largo" as string]: 92 }}
        d="M30 40 C 48 18, 74 18, 92 40"
        stroke={ACENTO}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Lo que vuelve, que es lo que el lugar recuerda. */}
      <path
        className="trazo paso-3"
        style={{ ["--largo" as string]: 92 }}
        d="M92 54 C 74 68, 48 68, 30 54"
        stroke={CREMA}
        strokeOpacity="0.5"
        strokeWidth="1.5"
        strokeDasharray="4 4"
        strokeLinecap="round"
      />
      <circle className="marca paso-2" cx="60" cy="24" r="2.5" fill={ACENTO} />
    </svg>
  );
}

/** Devolver algo: sale de la escuela y llega a alguien que lo estaba esperando. */
function Devolver() {
  return (
    <svg className={LIENZO} viewBox="0 0 120 72" fill="none">
      {/* La escuela. */}
      <path d="M12 56 L12 40 L24 32 L36 40 L36 56 Z" stroke={CREMA} strokeOpacity="0.45" strokeWidth="1.5" strokeLinejoin="round" />
      {/* El camino que hace lo que averiguaron. */}
      <path
        className="trazo paso-1"
        style={{ ["--largo" as string]: 86 }}
        d="M42 44 C 60 16, 78 16, 94 34"
        stroke={ACENTO}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeDasharray="5 4"
      />
      {/* Lo que entregan. */}
      <rect className="marca paso-2" x="62" y="14" width="14" height="11" rx="2" fill={ACENTO} fillOpacity="0.3" stroke={ACENTO} strokeWidth="1.5" />
      {/* Quien lo estaba esperando, que se enciende al recibirlo. */}
      <circle className="marca paso-3" cx="100" cy="44" r="9" fill={ACENTO} fillOpacity="0.25" stroke={ACENTO} strokeWidth="1.5" />
      <path className="marca paso-4" d="M96 44 L99 47.5 L105 40.5" stroke={ACENTO} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
