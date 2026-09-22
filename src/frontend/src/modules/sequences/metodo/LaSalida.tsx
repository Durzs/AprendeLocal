/**
 * Lo que solo sabe quien ha estado ahí.
 *
 * DE DÓNDE SALEN ESTOS TRES CAMPOS
 *
 * Venían dentro de la ruta que armaba el modelo, marcados como huecos: la
 * ruta llegaba con todo escrito menos cuatro cosas, y esas cuatro las llenaba
 * el docente. No era un descuido. Eran justamente lo que un modelo no puede
 * saber: cómo se llama el vecino que araba ahí antes de que se secara, por qué
 * potrero se baja al vado, y cuál es la barranca que está floja.
 *
 * Al sacar la ruta armada, esos huecos eran lo único que valía la pena
 * conservar, así que dejaron de ser huecos de otra cosa y pasaron a ser
 * campos del cuaderno. El cuarto no está aquí porque ya existía con otro
 * nombre: a quién le entregan el trabajo se elige junto con el formato, en la
 * lámina siguiente.
 *
 * POR QUÉ EN ESTA LÁMINA
 *
 * Es la lámina del lugar, y los tres son del lugar. Además se contestan en el
 * mismo momento: mirando por la ventana o acordándose del camino, no con la
 * planificación al lado.
 *
 * Ninguno es obligatorio para seguir. El último sí lleva un aviso distinto, y
 * es el único de todo el cuaderno que se marca así: los otros campos vacíos
 * dejan un papel incompleto, y este deja a un curso de catorce en una
 * barranca que nadie avisó que estaba floja.
 */

import { Campo, Hoja, Parrafo, Texto } from "../crear/Campos";
import type { Expedicion } from "../crear/expedicion";

/**
 * Los tres, con lo que hay que decir en cada uno.
 *
 * El texto vive junto a la clave y no en la pantalla, que es como estaban
 * escritos cuando eran huecos de la ruta: así no se puede agregar un campo sin
 * decir para qué sirve.
 */
const CAMPOS: {
  clave: "preguntarA" | "puntoDeSalida" | "queCuidar";
  etiqueta: string;
  porque: string;
  ejemplo: string;
  largo?: boolean;
}[] = [
  {
    clave: "preguntarA",
    etiqueta: "A quién de la comunidad le preguntan",
    porque:
      "El lugar tiene memoria y esa memoria está en personas. Escribe quién, con nombre si lo sabes.",
    ejemplo: "A don Manuel, que araba ahí antes de que se secara",
  },
  {
    clave: "puntoDeSalida",
    etiqueta: "Dónde se para el curso",
    porque:
      "El punto exacto y cómo se llega. Es lo que va en la hoja de terreno y en la carta a las familias.",
    ejemplo: "En el vado, bajando por el potrero del fondo. Veinte minutos a pie.",
    largo: true,
  },
  {
    clave: "queCuidar",
    etiqueta: "Qué hay que cuidar ahí",
    porque:
      "Esto no lo puede saber nadie que no haya estado. Es lo único de la salida que, si falta, alguien se puede lastimar.",
    ejemplo: "La barranca del lado norte está floja. Nadie cruza solo.",
    largo: true,
  },
];

export function LaSalida({
  e,
  onCambio,
  orden = 7,
}: {
  e: Expedicion;
  onCambio: (e: Expedicion) => void;
  orden?: number;
}) {
  const faltaCuidado = !e.queCuidar.trim();

  return (
    <Hoja titulo="Lo que solo sabes tú del lugar" orden={orden}>
      <p className="mb-5 max-w-2xl text-[15px] leading-relaxed text-[var(--crema)]/82">
        Tres cosas que no están en ningún mapa ni en ningún programa, y que
        salen impresas en los dos papeles de la salida. Se pueden dejar para
        después; la última conviene escribirla antes de que el curso salga.
      </p>

      <div className="space-y-5">
        {CAMPOS.map((c) => (
          <Campo key={c.clave} etiqueta={c.etiqueta} ayuda={c.porque} ancho="entera">
            {c.largo ? (
              <Parrafo
                value={e[c.clave]}
                onChange={(ev) => onCambio({ ...e, [c.clave]: ev.target.value })}
                placeholder={c.ejemplo}
              />
            ) : (
              <Texto
                value={e[c.clave]}
                onChange={(ev) => onCambio({ ...e, [c.clave]: ev.target.value })}
                placeholder={c.ejemplo}
              />
            )}
          </Campo>
        ))}
      </div>

      {/* El único aviso de este tipo en todo el cuaderno, y por eso pesa. Si
          se pusiera uno igual en cada campo vacío dejaría de leerse. */}
      {faltaCuidado && (
        <p className="mt-5 rounded-xl border border-[var(--tierra-300)]/30 bg-[var(--tierra-300)]/[0.06] px-4 py-3 text-[15px] leading-relaxed text-[var(--tierra-300)]">
          Falta qué hay que cuidar. El curso puede salir igual, y esto es lo
          que conviene tener escrito antes de que salga: todo lo demás, si
          falta, deja un papel a medias.
        </p>
      )}
    </Hoja>
  );
}
