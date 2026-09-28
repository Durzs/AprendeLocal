import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useTx } from "../../../shared/tx";

/**
 * El armazón de diapositivas.
 *
 * La creación de rutas era un formulario largo: todo a la vista, todo
 * obligatorio, y la sensación de trámite antes de haber escrito una palabra.
 * Ahora es un recorrido: una cosa a la vez, con el paso anterior guardado y el
 * siguiente a un clic.
 *
 * La dirección de la animación no es adorno. Al avanzar la lámina entra por la
 * derecha; al volver, por la izquierda. Es lo que le dice al ojo si acaba de
 * ganar terreno o de retroceder, y sin eso dos diapositivas parecidas se
 * confunden entre sí.
 *
 * Las flechas del teclado mueven el recorrido, porque un docente que llena
 * campos tiene las manos en el teclado y sacar la mano al mouse para pasar de
 * lámina es una interrupción por lámina.
 *
 * DENTRO DEL SITIO, NO ENCIMA
 *
 * El cuaderno se abría a pantalla completa, sin la cabecera del sitio, con su
 * propia barra arriba que decía «Cuaderno de expedición» y un «Guardar y
 * salir». Se leía como otra aplicación, y salir de ella era la única forma de
 * llegar a cualquier otra parte. Ahora cuelga de la misma cabecera que el
 * resto; lo que queda arriba es solo lo que la cabecera no puede decir: en qué
 * lámina se está y si lo escrito quedó guardado.
 */

export type Lamina = {
  id: string;
  /** El número romano que va en el margen, como en un cuaderno de campo. */
  marca: string;
  titulo: string;
  bajada?: string;
  contenido: React.ReactNode;
  /** Si está en falso, el botón de avanzar queda apagado y dice por qué. */
  puedeAvanzar?: boolean;
  faltaPara?: string;
};

/** Lo que dura la salida en el CSS. Si cambia allá, cambia aquí. */
const SALIDA_MS = 190;

export default function Diapositivas({
  laminas,
  indice,
  onIndice,
  guardado,
  alTerminar,
}: {
  laminas: Lamina[];
  indice: number;
  onIndice: (n: number) => void;
  /** Dónde quedó guardado lo escrito, dicho en una línea. */
  guardado?: React.ReactNode;
  /** Adónde lleva el pie en la última lámina, que antes no llevaba a nada. */
  alTerminar?: { a: string; texto: string };
}) {
  /*
   * El cambio de lámina va en dos tiempos.
   *
   * La que se va sale primero, y recién cuando terminó se monta la que llega.
   * `visible` es la que está saliendo mientras dura la salida.
   *
   * Todo se decide al pulsar, en `ir`, y no en un efecto que mire el índice.
   * Antes el efecto ponía el estado de salida después de pintar, así que había
   * un cuadro con la lámina nueva ya puesta antes de que empezara a salir la
   * vieja; y el sentido de la animación se leía de una referencia durante el
   * render, que React no garantiza que esté al día.
   */
  const [visible, setVisible] = useState(indice);
  const [saliendo, setSaliendo] = useState(false);
  const [sentido, setSentido] = useState<"avanza" | "retrocede">("avanza");
  const reloj = useRef<number | undefined>(undefined);
  const tx = useTx();

  useEffect(() => () => window.clearTimeout(reloj.current), []);

  const actual = laminas[saliendo ? visible : indice];
  const primera = indice === 0;
  const ultima = indice === laminas.length - 1;
  const puede = laminas[indice]?.puedeAvanzar !== false;
  const falta = !puede ? laminas[indice]?.faltaPara : undefined;

  const ir = (n: number) => {
    if (n < 0 || n >= laminas.length || n === indice || saliendo) return;
    setVisible(indice);
    setSentido(n > indice ? "avanza" : "retrocede");
    setSaliendo(true);
    onIndice(n);
    window.clearTimeout(reloj.current);
    reloj.current = window.setTimeout(() => setSaliendo(false), SALIDA_MS);
    // Al cambiar de lámina el foco se queda donde estaba, que puede ser un
    // campo que ya no existe. Se sube al principio para no dejarlo perdido.
    // Sin `smooth`: la lámina está saliendo y las dos cosas juntas marean.
    window.scrollTo({ top: 0 });
  };

  const claseLamina = saliendo
    ? sentido === "avanza"
      ? "lamina-sale-izquierda"
      : "lamina-sale-derecha"
    : sentido === "avanza"
      ? "lamina-entra-derecha"
      : "lamina-entra-izquierda";

  useEffect(() => {
    function teclas(e: KeyboardEvent) {
      // Dentro de un campo las flechas mueven el cursor, no la presentación.
      const en = document.activeElement?.tagName;
      if (en === "INPUT" || en === "TEXTAREA" || en === "SELECT") return;
      if (e.key === "ArrowRight" && puede && !ultima) ir(indice + 1);
      if (e.key === "ArrowLeft" && !primera) ir(indice - 1);
    }
    window.addEventListener("keydown", teclas);
    return () => window.removeEventListener("keydown", teclas);
  });

  if (!actual) return null;

  return (
    <div className="grano relative flex flex-1 flex-col bg-[var(--fondo)] text-[var(--crema)]">
      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 pt-5 sm:px-8">
        {/* ── Dónde va y si quedó guardado ─────────────────────────────── */}
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
          <p className="rotulo text-[var(--crema)]/55">
            {tx("Cuaderno · lámina", "Caderno · lâmina")} {indice + 1} {tx("de", "de")} {laminas.length}
          </p>
          {guardado && (
            <p className="text-xs text-[var(--crema)]/55" aria-live="polite">
              {guardado}
            </p>
          )}
        </div>

        <ol
          className="mt-4 flex gap-1.5"
          aria-label={tx("Láminas del cuaderno", "Lâminas do caderno")}
        >
          {laminas.map((l, i) => (
            <li key={l.id} className="flex-1">
              <button
                type="button"
                onClick={() => ir(i)}
                aria-current={i === indice ? "step" : undefined}
                aria-label={`${l.marca}${i < indice ? tx(" (hecha)", " (feita)") : ""}`}
                className="group block min-h-11 w-full py-2 text-left"
              >
                <span
                  className={[
                    "block h-[3px] w-full rounded-full transition-all duration-500",
                    i < indice
                      ? "bg-[var(--acento)]"
                      : i === indice
                        ? "bg-[var(--crema)]"
                        : "bg-[var(--crema)]/18 group-hover:bg-[var(--crema)]/35",
                  ].join(" ")}
                />
                <span
                  className={[
                    "mt-2 hidden rotulo transition sm:block",
                    i === indice ? "text-[var(--crema)]" : "text-[var(--crema)]/40",
                  ].join(" ")}
                >
                  {l.marca}
                </span>
              </button>
            </li>
          ))}
        </ol>

        {/* ── La lámina ────────────────────────────────────────────────── */}
        {/* La clave incluye si está saliendo, para que el navegador vuelva a
            correr la animación en vez de dar por buena la anterior. */}
        <main key={`${actual.id}-${saliendo}`} className={`flex-1 pt-7 ${claseLamina}`}>
          <p className="animar-hoja animar-hoja-1 rotulo text-[var(--tierra-600)]">
            {actual.marca}
          </p>
          <h1 className="animar-hoja animar-hoja-2 mt-2.5 max-w-3xl text-[1.85rem] font-semibold leading-[1.08] tracking-[-0.03em] text-[var(--crema-clara)] sm:text-[2.4rem]">
            {actual.titulo}
          </h1>
          {actual.bajada && (
            <p className="animar-hoja animar-hoja-3 mt-3.5 max-w-2xl text-[15px] leading-relaxed text-[var(--crema)]/70">
              {actual.bajada}
            </p>
          )}

          <div className="mt-8 pb-10">{actual.contenido}</div>
        </main>

        {/* ── Pie: avanzar y volver ────────────────────────────────────── */}
        <footer className="sticky bottom-0 -mx-4 border-t border-[var(--crema)]/12 bg-[var(--fondo)]/95 px-4 py-3 backdrop-blur sm:-mx-8 sm:px-8">
          {/* Por qué no se puede seguir, también en el teléfono. Antes se
              escondía en pantallas chicas y quedaba un botón gris sin
              explicación, que es exactamente donde más hace falta. */}
          {falta && (
            <p className="mb-2 text-xs leading-snug text-[var(--crema)]/65 sm:hidden">{falta}</p>
          )}

          <div className="flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => ir(indice - 1)}
              disabled={primera}
              className="min-h-11 rounded-full border border-[var(--crema)]/25 px-5 text-sm font-medium text-[var(--crema)]/85 transition hover:border-[var(--crema)]/55 hover:text-[var(--crema)] disabled:cursor-not-allowed disabled:opacity-25"
            >
              {tx("Volver", "Voltar")}
            </button>

            <div className="flex items-center gap-4">
              {falta && (
                <p className="hidden max-w-xs text-right text-xs leading-snug text-[var(--crema)]/55 sm:block">
                  {falta}
                </p>
              )}
              <span className="cifra hidden text-[11px] tracking-[0.14em] text-[var(--crema)]/40 sm:inline">
                {indice + 1} / {laminas.length}
              </span>

              {!ultima ? (
                <button
                  type="button"
                  onClick={() => ir(indice + 1)}
                  disabled={!puede}
                  className="group inline-flex min-h-11 items-center gap-2 rounded-full bg-[var(--acento)] px-6 text-sm font-semibold text-white transition hover:bg-tierra-500 disabled:cursor-not-allowed disabled:bg-[var(--crema)]/15 disabled:text-[var(--crema)]/45"
                >
                  {tx("Seguir", "Seguir")}
                  <span aria-hidden className="transition-transform group-enabled:group-hover:translate-x-1">
                    →
                  </span>
                </button>
              ) : (
                // La última lámina no terminaba en ninguna parte: el pie
                // ofrecía «Volver» y nada más, y lo que sigue —el
                // seguimiento— estaba al fondo de una página larga.
                alTerminar && (
                  <Link
                    to={alTerminar.a}
                    className="group inline-flex min-h-11 items-center gap-2 rounded-full bg-[var(--acento)] px-6 text-sm font-semibold text-white transition hover:bg-tierra-500"
                  >
                    {alTerminar.texto}
                    <span aria-hidden className="transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </Link>
                )
              )}
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
