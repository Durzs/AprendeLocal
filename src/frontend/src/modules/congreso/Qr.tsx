import { useMemo } from "react";
import { encode } from "uqr";

/**
 * Un código QR dibujado en SVG.
 *
 * Se arma en el navegador y no con un servicio de afuera: en el stand el
 * wifi falla, y un QR que depende de la red es un cuadrado vacío justo cuando
 * alguien saca el teléfono.
 */
export default function Qr({ texto, etiqueta, className }: { texto: string; etiqueta: string; className?: string }) {
  const { size, data } = useMemo(() => encode(texto, { ecc: "M", border: 2 }), [texto]);
  const camino = useMemo(() => {
    let d = "";
    data.forEach((fila, y) =>
      fila.forEach((negro, x) => {
        if (negro) d += `M${x} ${y}h1v1h-1z`;
      })
    );
    return d;
  }, [data]);
  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-label={etiqueta}
      className={className}
      shapeRendering="crispEdges"
    >
      <rect width={size} height={size} fill="#ffffff" />
      <path d={camino} fill="#0a0047" />
    </svg>
  );
}
