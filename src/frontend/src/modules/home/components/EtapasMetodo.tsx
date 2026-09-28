import { useEffect, useRef, useState } from "react";

import { etapasEn } from "../../sequences/metodo/etapas";
import { useTx } from "../../../shared/tx";

/**
 * Las seis etapas del método, con lo que pasa en cada una.
 *
 * QUÉ REEMPLAZA Y POR QUÉ
 *
 * Aquí había cuatro tarjetas —mirar, medir, preguntar, devolver— que venían
 * del esquema anterior y que además lo decían: «las cuatro vienen de David
 * Sobel». Dos cosas mal. El método dejó de tener cuatro familias de preguntas
 * hace varias versiones y ahora tiene seis etapas, así que la portada
 * prometía un recorrido que la aplicación ya no hace. Y citar el referente
 * teórico por su nombre no le sirve a nadie: un docente que abre esto quiere
 * saber qué va a hacer con su curso, no de quién es la idea.
 *
 * LO INTERACTIVO YA NO SON LAS PREGUNTAS
 *
 * Antes se escogía qué hay cerca de la escuela y las cuatro preguntas se
 * rehacían. Estaba bien para un esquema cuyo centro eran las preguntas; para
 * este el centro es otro, y es el argumento más difícil de creer que tiene la
 * plataforma: que las mismas seis etapas sirven para proyectos que no se
 * parecen en nada.
 *
 * Así que lo que se escoge son los dos proyectos, y las seis tarjetas cambian
 * enteras. Un curso mide la contaminación de un río y termina armando una
 * campaña; otro cataloga el desierto florido y termina montando una
 * exposición en la plaza. Se ve que la etapa tres es salir a terreno en los
 * dos casos, y que lo que se hace allá no se parece.
 *
 * No son ejemplos escritos para la portada: salen de `ETAPAS`, el mismo dato
 * que usa el cuaderno. Si alguien edita una etapa, esto cambia con ella.
 */

/** Hasta dónde llega cada etapa. Es el anillo que se va abriendo. */
const ALCANCE: Record<string, { es: string; pt: string }> = {
  inmediato: { es: "En la sala", pt: "Na sala" },
  intermedio: { es: "En el vecindario", pt: "No bairro" },
  amplio: { es: "Fuera de la escuela", pt: "Fora da escola" },
};

const LIENZO = "h-full w-full max-w-[120px]";
/* Valores literales y no `var(...)`: van en atributos de SVG (`stroke`,
   `fill`), donde no todos los navegadores resuelven variables. Son los de
   slate-400 y del acento de §index.css; si cambian allá, cambian aquí. */
const CREMA = "#94a3b8";
const ACENTO = "#b8561f";

/** Un dibujo por etapa, en el mismo trazo que ya usaba esta sección. */
const DIBUJOS: Record<string, () => React.ReactNode> = {
  problematica: Problematica,
  aula: Aula,
  terreno: Terreno,
  analisis: Analisis,
  propuesta: Propuesta,
  difusion: Difusion,
};

export default function EtapasMetodo() {
  const tx = useTx();
  const ETAPAS = etapasEn(tx.idioma);
  // Los dos proyectos de ejemplo, leídos del propio método. Se guarda cuál
  // por su posición y no por su nombre: en portugués los proyectos son otros.
  const PROYECTOS = [...new Set(ETAPAS.flatMap((e) => e.ejemplos.map((x) => x.proyecto)))];
  const [elegido, ponerElegido] = useState(0);
  const proyecto = PROYECTOS[elegido] ?? PROYECTOS[0] ?? "";
  const [enVista, ponerEnVista] = useState(false);
  const caja = useRef<HTMLDivElement>(null);

  // Los dibujos no se animan hasta que se llega a ellos. Animarlos al cargar
  // la página significa que para cuando alguien baja hasta aquí ya terminaron.
  useEffect(() => {
    const el = caja.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) ponerEnVista(true);
      },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={caja}>
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
        <div className="max-w-xl">
          <span className="rotulo block text-tierra-700">
            {tx("Cómo se recorre", "Como se percorre")}
          </span>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            {tx(
              "Seis etapas, siempre en este orden. Escoge un proyecto y mira cómo se ve cada etapa cuando el curso trabaja en él.",
              "Seis etapas, sempre nesta ordem. Escolha um projeto e veja como fica cada etapa quando a turma trabalha nele."
            )}
          </p>
        </div>

        {/* Los dos proyectos. Son el argumento de la sección: el mismo
            recorrido sirve para dos cosas que no se parecen. */}
        <fieldset className="flex flex-wrap gap-2">
          <legend className="sr-only">
            {tx("Qué proyecto quieres ver", "Qual projeto você quer ver")}
          </legend>
          {PROYECTOS.map((p, i) => {
            const puesto = p === proyecto;
            return (
              <button
                key={p}
                type="button"
                onClick={() => ponerElegido(i)}
                aria-pressed={puesto}
                className={`cursor-pointer rounded-full border px-4 py-1.5 text-sm transition ${
                  puesto
                    ? "border-tierra-300 bg-tierra-50 text-tierra-800"
                    : "border-slate-300 text-slate-600 hover:border-slate-400 hover:text-texto"
                }`}
              >
                {p}
              </button>
            );
          })}
        </fieldset>
      </div>

      {/* Tres por fila y dos filas. Con seis, cuatro columnas dejaban dos
          tarjetas huérfanas en la segunda fila; tres por tres deja las dos
          filas llenas y el orden se sigue leyendo de izquierda a derecha. */}
      <ol className="mt-7 grid gap-px overflow-hidden rounded-3xl border border-slate-200/80 bg-slate-200/70 shadow-sm sm:grid-cols-2 lg:grid-cols-3">
        {ETAPAS.map((etapa, i) => (
          <Etapa
            key={etapa.id}
            indice={i}
            nombre={etapa.nombre}
            enUnaLinea={etapa.enUnaLinea}
            alcance={ALCANCE[etapa.alcance] ? tx.de(ALCANCE[etapa.alcance]) : ""}
            asiSeVe={
              etapa.ejemplos.find((x) => x.proyecto === proyecto)?.asiSeVe ?? ""
            }
            Dibujo={DIBUJOS[etapa.id]}
            enVista={enVista}
          />
        ))}
      </ol>
    </div>
  );
}

function Etapa({
  indice,
  nombre,
  enUnaLinea,
  alcance,
  asiSeVe,
  Dibujo,
  enVista,
}: {
  indice: number;
  nombre: string;
  enUnaLinea: string;
  alcance: string;
  asiSeVe: string;
  Dibujo?: () => React.ReactNode;
  enVista: boolean;
}) {
  // Volver a pasar el ratón vuelve a dibujar. Las animaciones son de CSS y no
  // se reinician solas, así que se cambia la llave del dibujo y React lo monta
  // de nuevo.
  const tx = useTx();
  const [pase, ponerPase] = useState(0);
  const rebobinar = () => ponerPase((n) => n + 1);

  return (
    <li
      className="group relative flex flex-col overflow-hidden bg-white p-6 sm:p-7"
      onMouseEnter={rebobinar}
      onFocus={rebobinar}
    >
      {/* El número, grande y fantasma: marca el orden sin competir. Iba
          acompañado de un rótulo «Etapa 01» que decía exactamente lo mismo dos
          centímetros más allá, así que el rótulo se fue y el número quedó
          entero dentro de la tarjeta en vez de cortado contra el borde. */}
      <span
        aria-hidden
        className="cifra pointer-events-none absolute right-5 top-4 text-[4.5rem] font-semibold leading-none text-slate-900/[0.06]"
      >
        {String(indice + 1).padStart(2, "0")}
      </span>

      <span className="sr-only">Etapa {indice + 1} / 6.</span>
      {alcance && (
        <span className="rotulo relative block text-slate-500">{alcance}</span>
      )}

      {Dibujo && (
        <div
          key={pase}
          className={`mt-5 flex h-[72px] items-center ${enVista ? "" : "opacity-0"}`}
        >
          {enVista && <Dibujo />}
        </div>
      )}

      {/* Las dos alturas mínimas son lo que deja «Así se ve» a la misma altura
          en las tres tarjetas de una fila. Un nombre ocupa uno o dos renglones
          y la línea corta lo mismo, así que reservando dos en cada uno el
          rótulo cae siempre en el mismo sitio. Sin eso la fila se lee
          desordenada, que es lo que más se nota de un vistazo. */}
      <h3 className="mt-5 min-h-[3.5rem] text-lg font-semibold leading-snug text-texto">
        {nombre}
      </h3>
      <p className="mt-1 min-h-[2.75rem] text-sm leading-relaxed text-slate-600">
        {enUnaLinea}
      </p>

      {/* Lo concreto. Es lo único que cambia al escoger el otro proyecto, y por
          eso es lo que lleva el color: mirando la misma tarjeta con un proyecto
          y con el otro se ve que la etapa es la misma y que lo que se hace
          dentro no se parece en nada. */}
      {asiSeVe && (
        <div className="mt-5">
          <span className="rotulo block text-tierra-700">{tx("Así se ve", "Assim fica")}</span>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">{asiSeVe}</p>
        </div>
      )}
    </li>
  );
}

/* ── Los seis dibujos ─────────────────────────────────────────────────────
   Todos en el mismo lienzo y el mismo trazo. Cada uno hace lo que dice su
   etapa: no ilustran el tema, muestran el movimiento. */

/** Una nota de prensa, y dentro de ella un lugar que es este. */
function Problematica() {
  return (
    <svg className={LIENZO} viewBox="0 0 120 72" fill="none">
      <rect
        className="trazo paso-1"
        style={{ ["--largo" as string]: 200 }}
        x="10" y="10" width="62" height="52" rx="3"
        stroke={CREMA} strokeOpacity="0.5" strokeWidth="1.5"
      />
      <path className="trazo paso-2" style={{ ["--largo" as string]: 42 }}
        d="M20 24 H62" stroke={CREMA} strokeOpacity="0.45" strokeWidth="1.5" strokeLinecap="round" />
      <path className="trazo paso-3" style={{ ["--largo" as string]: 34 }}
        d="M20 34 H54" stroke={CREMA} strokeOpacity="0.45" strokeWidth="1.5" strokeLinecap="round" />
      <path className="trazo paso-4" style={{ ["--largo" as string]: 28 }}
        d="M20 44 H48" stroke={ACENTO} strokeWidth="2" strokeLinecap="round" />
      {/* El punto en el mapa: la nota habla de aquí. */}
      <path className="trazo paso-5" style={{ ["--largo" as string]: 60 }}
        d="M88 46 C 88 34, 104 34, 104 46 C 104 54, 96 60, 96 60 C 96 60, 88 54, 88 46 Z"
        stroke={ACENTO} strokeWidth="1.5" />
      <circle className="marca paso-6" cx="96" cy="45" r="2.5" fill={ACENTO} />
    </svg>
  );
}

/** La pizarra con el concepto, y el instrumento que se ensaya debajo. */
function Aula() {
  return (
    <svg className={LIENZO} viewBox="0 0 120 72" fill="none">
      <rect
        className="trazo paso-1"
        style={{ ["--largo" as string]: 210 }}
        x="14" y="8" width="70" height="42" rx="3"
        stroke={CREMA} strokeOpacity="0.5" strokeWidth="1.5"
      />
      <path className="trazo paso-2" style={{ ["--largo" as string]: 36 }}
        d="M24 22 H60" stroke={CREMA} strokeOpacity="0.45" strokeWidth="1.5" strokeLinecap="round" />
      <path className="trazo paso-3" style={{ ["--largo" as string]: 24 }}
        d="M24 32 H48" stroke={ACENTO} strokeWidth="2" strokeLinecap="round" />
      {/* El instrumento, ensayado sobre algo que no importa. */}
      <path className="trazo paso-4" style={{ ["--largo" as string]: 30 }}
        d="M96 14 V44" stroke={CREMA} strokeOpacity="0.5" strokeWidth="1.5" strokeLinecap="round" />
      <path className="trazo paso-5" style={{ ["--largo" as string]: 14 }}
        d="M90 44 H102" stroke={ACENTO} strokeWidth="2" strokeLinecap="round" />
      <circle className="marca paso-6" cx="96" cy="26" r="3" fill={ACENTO} />
    </svg>
  );
}

/** El terreno, y tres puntos elegidos sobre él. */
function Terreno() {
  return (
    <svg className={LIENZO} viewBox="0 0 120 72" fill="none">
      <path
        className="trazo paso-1"
        style={{ ["--largo" as string]: 160 }}
        d="M2 54 C 22 40, 34 46, 48 34 C 62 22, 78 30, 96 20 L 118 26"
        stroke={CREMA} strokeOpacity="0.45" strokeWidth="1.5" strokeLinecap="round"
      />
      {/* El recorrido, punteado, de un punto al siguiente. */}
      <path
        className="trazo paso-2"
        style={{ ["--largo" as string]: 120 }}
        d="M20 50 C 44 44, 60 32, 92 24"
        stroke={ACENTO} strokeWidth="1.5" strokeDasharray="3 4" strokeLinecap="round"
      />
      <circle className="marca paso-3" cx="20" cy="50" r="3" fill={ACENTO} />
      <circle className="marca paso-4" cx="56" cy="36" r="3" fill={ACENTO} />
      <circle className="marca paso-5" cx="92" cy="24" r="3" fill={ACENTO} />
    </svg>
  );
}

/** Los datos sueltos que se ordenan y dejan ver una diferencia. */
function Analisis() {
  return (
    <svg className={LIENZO} viewBox="0 0 120 72" fill="none">
      <path className="trazo paso-1" style={{ ["--largo" as string]: 100 }}
        d="M16 58 H104" stroke={CREMA} strokeOpacity="0.5" strokeWidth="1.5" strokeLinecap="round" />
      {/* Tres barras. La del medio es la que se sale. */}
      <rect className="trazo paso-2" style={{ ["--largo" as string]: 70 }}
        x="26" y="38" width="16" height="20" stroke={CREMA} strokeOpacity="0.5" strokeWidth="1.5" />
      <rect className="trazo paso-3" style={{ ["--largo" as string]: 106 }}
        x="52" y="16" width="16" height="42" stroke={ACENTO} strokeWidth="2" />
      <rect className="trazo paso-4" style={{ ["--largo" as string]: 78 }}
        x="78" y="34" width="16" height="24" stroke={CREMA} strokeOpacity="0.5" strokeWidth="1.5" />
      {/* La línea del promedio, que es contra lo que se compara. */}
      <path className="trazo paso-5" style={{ ["--largo" as string]: 92 }}
        d="M18 36 H102" stroke={ACENTO} strokeWidth="1.5" strokeDasharray="4 4" strokeLinecap="round" />
    </svg>
  );
}

/** Piezas que se juntan en una cosa, y una marca de que está hecha. */
function Propuesta() {
  return (
    <svg className={LIENZO} viewBox="0 0 120 72" fill="none">
      <rect className="trazo paso-1" style={{ ["--largo" as string]: 68 }}
        x="14" y="40" width="18" height="18" rx="2" stroke={CREMA} strokeOpacity="0.5" strokeWidth="1.5" />
      <rect className="trazo paso-2" style={{ ["--largo" as string]: 68 }}
        x="14" y="16" width="18" height="18" rx="2" stroke={CREMA} strokeOpacity="0.5" strokeWidth="1.5" />
      {/* Las dos flechas que las llevan al mismo sitio. */}
      <path className="trazo paso-3" style={{ ["--largo" as string]: 34 }}
        d="M38 49 C 50 49, 52 40, 60 38" stroke={ACENTO} strokeWidth="1.5" strokeLinecap="round" />
      <path className="trazo paso-4" style={{ ["--largo" as string]: 34 }}
        d="M38 25 C 50 25, 52 34, 60 36" stroke={ACENTO} strokeWidth="1.5" strokeLinecap="round" />
      {/* Lo construido. */}
      <path className="trazo paso-5" style={{ ["--largo" as string]: 96 }}
        d="M66 46 V28 L82 18 L98 28 V46 Z" stroke={ACENTO} strokeWidth="2" strokeLinejoin="round" />
      <path className="trazo paso-6" style={{ ["--largo" as string]: 18 }}
        d="M76 37 l4 4 l8 -9" stroke={ACENTO} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Sale hacia alguien de fuera, y algo vuelve. */
function Difusion() {
  return (
    <svg className={LIENZO} viewBox="0 0 120 72" fill="none">
      <rect className="trazo paso-1" style={{ ["--largo" as string]: 80 }}
        x="10" y="24" width="24" height="24" rx="3" stroke={CREMA} strokeOpacity="0.5" strokeWidth="1.5" />
      {/* El camino de ida, que es el que importa. */}
      <path className="trazo paso-2" style={{ ["--largo" as string]: 60 }}
        d="M38 32 C 58 24, 68 24, 84 28" stroke={ACENTO} strokeWidth="2" strokeLinecap="round" />
      <path className="trazo paso-3" style={{ ["--largo" as string]: 16 }}
        d="M78 22 l7 6 l-7 6" stroke={ACENTO} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {/* Quien lo recibe. */}
      <circle className="trazo paso-4" style={{ ["--largo" as string]: 44 }}
        cx="98" cy="36" r="7" stroke={ACENTO} strokeWidth="2" />
      {/* Y la vuelta: lo que el curso mira de sí mismo al terminar. */}
      <path className="trazo paso-5" style={{ ["--largo" as string]: 58 }}
        d="M88 48 C 70 56, 54 54, 40 46" stroke={CREMA} strokeOpacity="0.55" strokeWidth="1.5"
        strokeDasharray="3 4" strokeLinecap="round" />
      <path className="trazo paso-6" style={{ ["--largo" as string]: 14 }}
        d="M46 40 l-6 6 l7 4" stroke={CREMA} strokeOpacity="0.55" strokeWidth="1.5"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
