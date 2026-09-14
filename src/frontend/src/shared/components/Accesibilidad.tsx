import { useEffect, useState } from "react";

/**
 * Modo accesible: más contraste y letra más grande.
 *
 * Salió de una entrevista de validación. La profesora dijo, mirando el
 * cuaderno de expedición, que el texto gris pequeño sobre fondo oscuro le
 * costaba leerlo. Tenía razón y no era un caso raro: buena parte de esta
 * interfaz vive en tonos de crema al 70 u 80 por ciento sobre verde muy
 * oscuro, que en una sala con sol de frente o en una pantalla vieja de
 * escuela se pierde.
 *
 * Se resuelve con dos interruptores y no con un rediseño, porque el diseño
 * base también tiene que existir: quien lo lee bien no tiene por qué leer
 * todo en blanco puro y a veinte píxeles.
 *
 * CÓMO FUNCIONA
 *
 * Pone dos marcas en el elemento raíz y el resto lo hace el CSS. Se guarda en
 * el navegador, porque alguien que lo necesita lo necesita todas las veces y
 * no una: hacerle activarlo en cada visita sería peor que no tenerlo.
 */

const LLAVE = "aprendelocal:accesible";

type Ajustes = { contraste: boolean; grande: boolean };

const APAGADO: Ajustes = { contraste: false, grande: false };

function leer(): Ajustes {
  try {
    const crudo = localStorage.getItem(LLAVE);
    return crudo ? { ...APAGADO, ...JSON.parse(crudo) } : APAGADO;
  } catch {
    return APAGADO;
  }
}

export default function Accesibilidad() {
  const [abierto, ponerAbierto] = useState(false);
  const [ajustes, ponerAjustes] = useState<Ajustes>(leer);

  useEffect(() => {
    const raiz = document.documentElement;
    raiz.classList.toggle("mas-contraste", ajustes.contraste);
    raiz.classList.toggle("letra-grande", ajustes.grande);
    try {
      localStorage.setItem(LLAVE, JSON.stringify(ajustes));
    } catch {
      /* Ventana privada. Sigue aplicado en esta sesión. */
    }
  }, [ajustes]);

  return (
    <div className="fixed bottom-4 right-4 z-50 print:hidden">
      {abierto && (
        <div
          role="group"
          aria-label="Ajustes de lectura"
          className="mb-2 w-64 rounded-2xl border border-[var(--crema)]/25 bg-[#1a211c] p-4 shadow-xl"
        >
          <p className="text-[15px] font-medium text-[var(--crema-clara)]">
            Ajustes de lectura
          </p>
          <Interruptor
            etiqueta="Más contraste"
            puesto={ajustes.contraste}
            onCambio={(v) => ponerAjustes({ ...ajustes, contraste: v })}
          />
          <Interruptor
            etiqueta="Letra más grande"
            puesto={ajustes.grande}
            onCambio={(v) => ponerAjustes({ ...ajustes, grande: v })}
          />
          <p className="mt-3 text-sm leading-relaxed text-[var(--crema)]/75">
            Queda guardado en este navegador.
          </p>
        </div>
      )}

      <button
        type="button"
        onClick={() => ponerAbierto(!abierto)}
        aria-expanded={abierto}
        aria-label="Ajustes de lectura: contraste y tamaño de letra"
        className="flex min-h-11 items-center gap-2 rounded-full border border-[var(--crema)]/30 bg-[#1a211c] px-4 text-sm font-medium text-[var(--crema-clara)] shadow-lg transition hover:bg-[var(--crema)]/10"
      >
        <span aria-hidden className="text-base">
          Aa
        </span>
        Lectura
      </button>
    </div>
  );
}

function Interruptor({
  etiqueta,
  puesto,
  onCambio,
}: {
  etiqueta: string;
  puesto: boolean;
  onCambio: (v: boolean) => void;
}) {
  return (
    <label className="mt-3 flex min-h-11 cursor-pointer items-center justify-between gap-3">
      <span className="text-[15px] text-[var(--crema)]/88">{etiqueta}</span>
      <input
        type="checkbox"
        checked={puesto}
        onChange={(ev) => onCambio(ev.target.checked)}
        className="h-5 w-5 accent-[var(--tierra-600)]"
      />
    </label>
  );
}
