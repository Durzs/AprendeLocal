import { useRef, useState } from "react";

/**
 * Llevarse un documento en un formato que se pueda editar.
 *
 * POR QUÉ NO BASTA CON IMPRIMIR
 *
 * Los documentos de aquí solo tenían botón de imprimir, y eso los volvía
 * rígidos. En una entrevista de validación quedó dicho con claridad: cualquier
 * material sirve siempre que venga en formato editable y adaptable, porque el
 * docente casi nunca toma el material entero. Toma un pedazo, lo cambia y lo
 * mete en lo suyo. Un documento que solo se imprime obliga a volver a
 * teclearlo para cambiarle una línea, y entonces no se usa.
 *
 * CÓMO
 *
 * Copiando al portapapeles el texto tal como se ve, para pegarlo en Word, en
 * Google Docs o en el cuaderno digital que use cada uno. No es un formato
 * propio ni un archivo que haya que abrir con algo: es texto, y el texto entra
 * en cualquier parte.
 *
 * Se copia lo que hay en pantalla y no una versión aparte, para que no existan
 * dos documentos que se puedan desincronizar. Se limpian los espacios que deja
 * el diseño y se respetan los saltos de línea de los bloques.
 */

/** Saca de un trozo de pantalla el texto que un humano leería. */
function textoDe(nodo: HTMLElement): string {
  const copia = nodo.cloneNode(true) as HTMLElement;

  // Los botones no son parte del documento: son de la pantalla.
  copia.querySelectorAll("button").forEach((b) => b.remove());

  const lineas: string[] = [];
  const bloques = copia.querySelectorAll<HTMLElement>("p, li, h1, h2, h3, div");

  // Solo los bloques que tienen texto propio y no los que solo envuelven a
  // otros, para no repetir cada frase una vez por cada contenedor.
  bloques.forEach((b) => {
    const suyo = Array.from(b.childNodes)
      .filter((n) => n.nodeType === Node.TEXT_NODE || n.nodeName === "SPAN")
      .map((n) => n.textContent ?? "")
      .join(" ")
      .replace(/\s+/g, " ")
      // Unir trozos con un espacio deja « .» y « ,» cuando el signo venía en
      // su propio nodo, que es como se ve un texto pegado a la ligera.
      .replace(/\s+([.,;:])/g, "$1")
      .trim();
    if (suyo) lineas.push(b.tagName === "LI" ? `· ${suyo}` : suyo);
  });

  return lineas.join("\n");
}

export function Copiar({
  de,
  que = "el documento",
}: {
  /** El contenedor del documento, tal como está en pantalla. */
  de: React.RefObject<HTMLDivElement | null>;
  /** Cómo se llama esto, para el aviso de que ya se copió. */
  que?: string;
}) {
  const [copiado, ponerCopiado] = useState(false);
  const reloj = useRef<number | null>(null);

  async function copiar() {
    if (!de.current) return;
    const texto = textoDe(de.current);
    try {
      await navigator.clipboard.writeText(texto);
      ponerCopiado(true);
      if (reloj.current) window.clearTimeout(reloj.current);
      reloj.current = window.setTimeout(() => ponerCopiado(false), 2500);
    } catch {
      /* Sin permiso de portapapeles queda la impresión, que sigue ahí. */
    }
  }

  return (
    <span className="inline-flex items-center gap-3">
      <button
        type="button"
        onClick={copiar}
        className="min-h-11 rounded-full border border-[var(--crema)]/25 px-5 text-sm font-medium text-[var(--crema-clara)] transition hover:bg-[var(--crema)]/10"
      >
        Copiar para editar
      </button>
      <span
        aria-live="polite"
        className="text-sm text-[var(--crema)]/75"
      >
        {copiado
          ? `Copiado. Pégalo en Word o en un documento y cámbialo.`
          : `Se copia ${que} como texto, para pegarlo y adaptarlo.`}
      </span>
    </span>
  );
}
