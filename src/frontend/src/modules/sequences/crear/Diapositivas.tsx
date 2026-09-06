import { useEffect, useRef, useState } from "react";

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
  onSalir,
}: {
  laminas: Lamina[];
  indice: number;
  onIndice: (n: number) => void;
  onSalir?: () => void;
}) {
  /*
   * El cambio de lámina va en dos tiempos.
   *
   * Antes era uno solo: React reemplazaba el contenido y la lámina nueva
   * entraba, pero la vieja desaparecía de golpe. Con eso la transición se ve a
   * medias, que es casi lo mismo que no verla. Ahora la que se va sale
   * primero, y recién cuando terminó se monta la que llega.
   *
   * `visible` es la lámina que está en pantalla, que durante la salida sigue
   * siendo la vieja aunque `indice` ya apunte a la nueva.
   */
  const [visible, setVisible] = useState(indice);
  const [saliendo, setSaliendo] = useState(false);
  const sentido = useRef<"avanza" | "retrocede">("avanza");
  const reloj = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (indice === visible) return;
    sentido.current = indice > visible ? "avanza" : "retrocede";
    setSaliendo(true);
    reloj.current = window.setTimeout(() => {
      setVisible(indice);
      setSaliendo(false);
    }, SALIDA_MS);
    return () => window.clearTimeout(reloj.current);
  }, [indice, visible]);

  const actual = laminas[visible];
  const primera = indice === 0;
  const ultima = indice === laminas.length - 1;
  const puede = laminas[indice]?.puedeAvanzar !== false;

  const ir = (n: number) => {
    if (n < 0 || n >= laminas.length || n === indice || saliendo) return;
    onIndice(n);
    // Al cambiar de lámina el foco se queda donde estaba, que puede ser un
    // campo que ya no existe. Se sube al principio para no dejarlo perdido.
    // Sin `smooth`: la lámina está saliendo y las dos cosas juntas marean.
    window.scrollTo({ top: 0 });
  };

  const claseLamina = saliendo
    ? sentido.current === "avanza"
      ? "lamina-sale-izquierda"
      : "lamina-sale-derecha"
    : sentido.current === "avanza"
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
    <div className="min-h-screen bg-[#1e2a24] text-[#e4ded2]">
      {/* Grano de papel. Sostiene el resto del diseño: sin esta capa el verde
          queda plano y el conjunto se lee como una diapositiva de empresa. */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 opacity-[0.16] mix-blend-overlay"
        style={{
          backgroundImage:
            "radial-gradient(#e4ded2 0.5px, transparent 0.5px), radial-gradient(#e4ded2 0.5px, transparent 0.5px)",
          backgroundSize: "7px 7px, 7px 7px",
          backgroundPosition: "0 0, 3.5px 3.5px",
        }}
      />

      <div className="relative mx-auto flex min-h-screen max-w-5xl flex-col px-5 py-7 sm:px-8">
        {/* ── Cabecera: dónde va y cuánto falta ────────────────────────── */}
        <header className="flex flex-wrap items-center justify-between gap-4">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#e4ded2]/55">
            Cuaderno de expedición
          </p>
          {onSalir && (
            <button
              type="button"
              onClick={onSalir}
              className="rounded-full border border-[#e4ded2]/25 px-3.5 py-1 font-mono text-[11px] uppercase tracking-[0.16em] text-[#e4ded2]/70 transition hover:border-[#e4ded2]/50 hover:text-[#e4ded2]"
            >
              Guardar y salir
            </button>
          )}
        </header>

        <ol className="mt-5 flex gap-1.5" aria-label="Pasos">
          {laminas.map((l, i) => (
            <li key={l.id} className="flex-1">
              <button
                type="button"
                onClick={() => ir(i)}
                aria-current={i === indice ? "step" : undefined}
                className="group block w-full text-left"
              >
                <span
                  className={[
                    "block h-[3px] w-full rounded-full transition-all duration-500",
                    i < indice
                      ? "bg-[#c9612a]"
                      : i === indice
                        ? "bg-[#e4ded2]"
                        : "bg-[#e4ded2]/18 group-hover:bg-[#e4ded2]/35",
                  ].join(" ")}
                />
                <span
                  className={[
                    "mt-2 hidden font-mono text-[10px] uppercase tracking-[0.14em] transition sm:block",
                    i === indice ? "text-[#e4ded2]" : "text-[#e4ded2]/40",
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
        <main key={`${actual.id}-${saliendo}`} className={`flex-1 pt-9 ${claseLamina}`}>
          <p className="animar-hoja animar-hoja-1 font-mono text-[11px] uppercase tracking-[0.22em] text-[#c9612a]">
            {actual.marca}
          </p>
          <h1 className="animar-hoja animar-hoja-2 mt-2.5 max-w-3xl text-[1.85rem] font-semibold leading-[1.08] tracking-[-0.03em] text-[#f3efe7] sm:text-[2.4rem]">
            {actual.titulo}
          </h1>
          {actual.bajada && (
            <p className="animar-hoja animar-hoja-3 mt-3.5 max-w-2xl text-[15px] leading-relaxed text-[#e4ded2]/70">
              {actual.bajada}
            </p>
          )}

          <div className="mt-8 pb-10">{actual.contenido}</div>
        </main>

        {/* ── Pie: avanzar y volver ────────────────────────────────────── */}
        <footer className="sticky bottom-0 -mx-5 flex items-center justify-between gap-4 border-t border-[#e4ded2]/12 bg-[#1e2a24]/95 px-5 py-4 backdrop-blur sm:-mx-8 sm:px-8">
          <button
            type="button"
            onClick={() => ir(indice - 1)}
            disabled={primera}
            className="rounded-full border border-[#e4ded2]/25 px-5 py-2 text-sm font-medium text-[#e4ded2]/85 transition hover:border-[#e4ded2]/55 hover:text-[#e4ded2] disabled:cursor-not-allowed disabled:opacity-25"
          >
            Volver
          </button>

          <div className="flex items-center gap-4">
            {!puede && actual.faltaPara && (
              <p className="hidden max-w-xs text-right text-xs leading-snug text-[#e4ded2]/50 sm:block">
                {actual.faltaPara}
              </p>
            )}
            <span className="font-mono text-[11px] tracking-[0.14em] text-[#e4ded2]/40">
              {indice + 1} / {laminas.length}
            </span>
            {!ultima && (
              <button
                type="button"
                onClick={() => ir(indice + 1)}
                disabled={!puede}
                className="group inline-flex items-center gap-2 rounded-full bg-[#c9612a] px-6 py-2.5 text-sm font-semibold text-[#1e2a24] transition hover:bg-[#d97038] disabled:cursor-not-allowed disabled:bg-[#e4ded2]/15 disabled:text-[#e4ded2]/40"
              >
                Seguir
                <span aria-hidden className="transition-transform group-enabled:group-hover:translate-x-1">
                  →
                </span>
              </button>
            )}
          </div>
        </footer>
      </div>
    </div>
  );
}
