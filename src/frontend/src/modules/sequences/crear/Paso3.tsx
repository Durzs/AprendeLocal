/**
 * Paso tres: la ruta armada.
 *
 * Aquí se junta todo: las sesiones con su material, el código con que entra el
 * curso, la hoja de evaluación con los métodos que él marcó en el paso uno, y
 * lo que vive alrededor del lugar que escribió.
 *
 * Las rutas que aparecen no se inventan: son las cuatro del catálogo, ordenadas
 * por lo que calza con lo que él contó del lugar. Si ninguna calza del todo se
 * dice, en vez de empujarle la que sobró.
 */

import { useMemo, useState } from "react";

import { RUTAS, cursoCorto, type Ruta } from "../rutas/catalogo";
import { consultar, pedirUbicacion, type Especie, type Grupo } from "../rutas/inaturalist";
import { Hoja } from "./Campos";
import type { Entorno, Expedicion } from "./expedicion";
import { codigoNuevo } from "./expedicion";

/**
 * Qué entorno atiende cada ruta.
 *
 * Es un mapa a mano y corto, porque son cuatro rutas. Cuando sean veinte esto
 * tendrá que salir de la ruta misma; mientras tanto, un objeto de cuatro líneas
 * se lee mejor que un motor de afinidad.
 */
const ENTORNO_DE_RUTA: Record<string, Entorno[]> = {
  agua: ["rio", "costa"],
  redes: ["bosque", "campo"],
  suelo: ["campo", "cordillera"],
  calor: ["pueblo", "cordillera"],
};

/** Cuánto calza una ruta con lo que el docente contó. De 0 a 3. */
function calce(ruta: Ruta, e: Expedicion): number {
  let n = 0;
  if (e.entorno && ENTORNO_DE_RUTA[ruta.id]?.includes(e.entorno)) n += 2;
  const dicho = `${e.tematicas} ${e.fenomeno} ${e.indagacion}`.toLowerCase();
  if (dicho && ruta.titulo.toLowerCase().split(/\s+/).some((w) => w.length > 4 && dicho.includes(w))) {
    n += 1;
  }
  if (e.cursos.length && ruta.cubre.some((c) => e.cursos.includes(cursoCorto(c.nivel)))) n += 1;
  return n;
}

const ETIQUETA_EVAL: Record<string, string> = {
  cuaderno: "Cuaderno de campo",
  producto: "El producto final",
  presentacion: "Presentación al curso",
  rubrica: "Rúbrica por criterios",
  observacion: "Observación en terreno",
};

export default function Paso3({
  e,
  onCambio,
}: {
  e: Expedicion;
  onCambio: (e: Expedicion) => void;
}) {
  const ordenadas = useMemo(
    () =>
      RUTAS.map((r) => ({ ruta: r, calce: calce(r, e) })).sort((a, b) => b.calce - a.calce),
    [e]
  );
  const elegida = RUTAS.find((r) => r.id === e.rutaId) ?? null;
  const ninguna = ordenadas[0]?.calce === 0;

  return (
    <div className="space-y-4">
      {/* ── Qué ruta ─────────────────────────────────────────────────── */}
      <Hoja titulo="La ruta que calza" orden={4}>
        {ninguna ? (
          <p className="mb-4 max-w-2xl text-sm leading-relaxed text-[#e0a678]">
            Ninguna de las cuatro calza con lo que contaste. Puedes tomar la que
            más se acerque y ajustarla, pero conviene saberlo antes: son cuatro
            rutas, no un catálogo.
          </p>
        ) : (
          <p className="mb-4 max-w-2xl text-sm leading-relaxed text-[#e4ded2]/60">
            Ordenadas por lo que calza con tu lugar y tus cursos. La primera es
            la que más se acerca.
          </p>
        )}

        <ul className="grid gap-3 sm:grid-cols-2">
          {ordenadas.map(({ ruta, calce: c }) => {
            const puesta = ruta.id === e.rutaId;
            return (
              <li key={ruta.id}>
                <button
                  type="button"
                  onClick={() => onCambio({ ...e, rutaId: puesta ? null : ruta.id })}
                  aria-pressed={puesta}
                  className={[
                    "flex h-full w-full flex-col rounded-xl border p-4 text-left transition",
                    puesta
                      ? "border-[#c9612a] bg-[#c9612a]/[0.1]"
                      : "border-[#e4ded2]/14 hover:border-[#e4ded2]/35",
                  ].join(" ")}
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#c9612a]">
                      {ruta.titulo}
                    </span>
                    <span className="font-mono text-[10px] text-[#e4ded2]/35">
                      {c > 0 ? "•".repeat(c) : "—"}
                    </span>
                  </div>
                  <p className="mt-2 text-[15px] leading-snug text-[#f3efe7]">
                    {ruta.preguntaGuia}
                  </p>
                  <p className="mt-2.5 text-xs text-[#e4ded2]/50">
                    {ruta.semanas} semanas ·{" "}
                    {ruta.cubre.map((x) => cursoCorto(x.nivel)).join(" ")}
                  </p>
                </button>
              </li>
            );
          })}
        </ul>
      </Hoja>

      {elegida && (
        <>
          <Sesiones ruta={elegida} e={e} />
          <Curso e={e} onCambio={onCambio} />
          <Evaluacion e={e} ruta={elegida} />
          <Alrededor e={e} ruta={elegida} />
        </>
      )}
    </div>
  );
}

/** Las sesiones de la ruta y lo que hace falta llevar. */
function Sesiones({ ruta, e }: { ruta: Ruta; e: Expedicion }) {
  // El material no cuelga de la ruta sino de su secuencia, que es donde se
  // sabe de verdad que hace falta llevar.
  const materiales = ruta.secuencia.materiales ?? [];

  return (
    <Hoja titulo="Las sesiones" orden={5}>
      <ol className="space-y-3">
        {ruta.fases.map((f, i) => (
          <li
            key={f.titulo}
            className={`animar-asoma animar-asoma-${Math.min(i + 1, 4)} flex gap-4 rounded-xl border border-[#e4ded2]/12 p-4`}
          >
            <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#c9612a]/50 font-mono text-xs text-[#c9612a]">
              {i + 1}
            </span>
            <div className="min-w-0">
              <p className="text-[15px] font-medium text-[#f3efe7]">{f.titulo}</p>
              {f.queOcurre && (
                <p className="mt-1 text-sm leading-relaxed text-[#e4ded2]/65">{f.queOcurre}</p>
              )}
            </div>
          </li>
        ))}
      </ol>

      {materiales.length ? (
        <div className="mt-5 border-t border-[#e4ded2]/12 pt-4">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#e4ded2]/55">
            Material disponible
          </p>
          <ul className="mt-2.5 flex flex-wrap gap-2">
            {materiales.map((m) => (
              <li
                key={m}
                className="rounded-full border border-[#e4ded2]/18 px-3 py-1 text-xs text-[#e4ded2]/75"
              >
                {m}
              </li>
            ))}
          </ul>
          <p className="mt-2.5 text-xs text-[#e4ded2]/45">
            Nada de esto hay que comprarlo. Si algo falta, la hoja de terreno se
            imprime igual y se anota a mano.
          </p>
        </div>
      ) : null}

      {e.semanas && e.semanas !== ruta.semanas && (
        <p className="mt-4 rounded-lg border border-[#e0a678]/35 bg-[#e0a678]/[0.07] px-3.5 py-2.5 text-xs leading-relaxed text-[#e0a678]">
          Dijiste {e.semanas} semanas y la ruta está escrita para {ruta.semanas}.
          Se puede estirar o apretar, pero la salida a terreno necesita su
          sesión completa.
        </p>
      )}
    </Hoja>
  );
}

/**
 * El código con que entra el curso.
 *
 * Genera el código y lo deja copiable. Lo que todavía no hace es crear las
 * cuentas: la tabla de códigos por escuela existe en la base, pero enlazar una
 * expedición con un curso todavía no está escrito. Se dice aquí en vez de
 * mostrar una lista de estudiantes vacía que parezca que algo falló.
 */
function Curso({ e, onCambio }: { e: Expedicion; onCambio: (e: Expedicion) => void }) {
  const [copiado, setCopiado] = useState(false);

  async function copiar() {
    try {
      await navigator.clipboard.writeText(e.codigoCurso);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      /* Sin permiso de portapapeles. El código está a la vista para copiarlo a mano. */
    }
  }

  return (
    <Hoja titulo="El curso" orden={6}>
      <div className="flex flex-wrap items-end gap-5">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#e4ded2]/55">
            Código de la expedición
          </p>
          <p className="mt-1.5 font-mono text-3xl tracking-[0.14em] text-[#f3efe7]">
            {e.codigoCurso || "— — —"}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() =>
              onCambio({ ...e, codigoCurso: codigoNuevo(e.docente || "ruta") })
            }
            className="rounded-full border border-[#e4ded2]/25 px-4 py-2 text-sm text-[#e4ded2]/85 transition hover:border-[#e4ded2]/55 hover:text-[#e4ded2]"
          >
            {e.codigoCurso ? "Otro código" : "Generar código"}
          </button>
          {e.codigoCurso && (
            <button
              type="button"
              onClick={copiar}
              className="rounded-full bg-[#e4ded2]/12 px-4 py-2 text-sm text-[#e4ded2] transition hover:bg-[#e4ded2]/22"
            >
              {copiado ? "Copiado" : "Copiar"}
            </button>
          )}
        </div>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-[#e4ded2]/60">
        Se dicta en voz alta y se escribe en el pizarrón: sin O ni I ni ceros ni
        unos, que ahí se confunden.
        {e.estudiantes ? ` Son ${e.estudiantes} estudiantes.` : ""}
      </p>

      <p className="mt-3 rounded-lg border border-[#e0a678]/35 bg-[#e0a678]/[0.07] px-3.5 py-2.5 text-xs leading-relaxed text-[#e0a678]">
        Todavía no crea las cuentas. El código queda guardado en este computador
        y sirve para anotarlo, pero enlazar la expedición con las cuentas de los
        estudiantes está por escribirse. Vale saberlo antes de dictárselo al
        curso.
      </p>
    </Hoja>
  );
}

/** La hoja de evaluación, armada con lo que él marcó en el paso uno. */
function Evaluacion({ e, ruta }: { e: Expedicion; ruta: Ruta }) {
  if (!e.evaluacion.length) {
    return (
      <Hoja titulo="Evaluación" orden={7}>
        <p className="text-sm leading-relaxed text-[#e4ded2]/60">
          No marcaste ningún método en el primer paso. Vuelve a la primera lámina
          y elige al menos uno: sin eso, la ruta llega al final sin manera de
          mostrar lo que aprendieron.
        </p>
      </Hoja>
    );
  }

  return (
    <Hoja titulo="Evaluación" orden={7}>
      <p className="mb-4 max-w-2xl text-sm leading-relaxed text-[#e4ded2]/60">
        Lo que marcaste en el primer paso, puesto contra lo que la ruta produce.
      </p>
      <ul className="space-y-2.5">
        {e.evaluacion.map((v) => (
          <li
            key={v}
            className="flex flex-wrap items-baseline gap-x-3 gap-y-1 rounded-xl border border-[#e4ded2]/12 p-3.5"
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#c9612a]">
              {ETIQUETA_EVAL[v] ?? v}
            </span>
            <span className="min-w-0 flex-1 text-sm leading-relaxed text-[#e4ded2]/75">
              {v === "producto"
                ? `Se evalúa lo que entregan: ${ruta.producto.que}`
                : v === "cuaderno"
                  ? "Se evalúa lo anotado en terreno, con la hoja de campo de cada curso."
                  : v === "presentacion"
                    ? `Se evalúa cómo se lo cuentan a ${ruta.producto.paraQuien}.`
                    : v === "rubrica"
                      ? "Los criterios salen de los objetivos que escribiste."
                      : "Se evalúa mirando trabajar, durante la salida."}
            </span>
          </li>
        ))}
      </ul>
      {e.objetivos.trim() && (
        <div className="mt-4 border-t border-[#e4ded2]/12 pt-4">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#e4ded2]/55">
            Contra estos objetivos
          </p>
          <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-[#e4ded2]/75">
            {e.objetivos}
          </p>
        </div>
      )}
    </Hoja>
  );
}

/** Qué vive alrededor del lugar, con iNaturalist. */
function Alrededor({ e, ruta }: { e: Expedicion; ruta: Ruta }) {
  const [estado, setEstado] = useState<"quieto" | "pidiendo" | "listo" | "error">("quieto");
  const [especies, setEspecies] = useState<Especie[]>([]);
  const [motivo, setMotivo] = useState("");

  const grupos: Grupo[] = ruta.naturaleza?.grupos ?? ["Plantae", "Aves"];

  async function buscar() {
    setEstado("pidiendo");
    setMotivo("");
    try {
      const donde = await pedirUbicacion();
      const r = await consultar({ ...donde, radio: 5, grupos, idioma: "es" });
      if (r.estado === "ok") {
        setEspecies(r.datos.especies);
        setEstado("listo");
      } else if (r.estado === "vacio") {
        setEspecies([]);
        setEstado("listo");
      } else {
        setMotivo(r.motivo);
        setEstado("error");
      }
    } catch {
      setMotivo("No se pudo saber dónde estás. Puede que el navegador no diera permiso.");
      setEstado("error");
    }
  }

  return (
    <Hoja titulo="Qué vive ahí" orden={8}>
      <p className="mb-4 max-w-2xl text-sm leading-relaxed text-[#e4ded2]/60">
        Lo que la ciencia ciudadana ha registrado alrededor de{" "}
        {e.ubicacion.trim() || "tu escuela"}, para saber qué se puede encontrar
        el día de la salida. Los datos vienen de iNaturalist.
      </p>

      <button
        type="button"
        onClick={buscar}
        disabled={estado === "pidiendo"}
        className="rounded-full border border-[#e4ded2]/25 px-5 py-2 text-sm text-[#e4ded2]/85 transition hover:border-[#e4ded2]/55 hover:text-[#e4ded2] disabled:opacity-50"
      >
        {estado === "pidiendo" ? "Preguntando…" : "Usar mi ubicación"}
      </button>

      {estado === "error" && (
        <p className="mt-3.5 text-sm leading-relaxed text-[#e0a678]">{motivo}</p>
      )}

      {estado === "listo" && especies.length === 0 && (
        <p className="mt-3.5 text-sm leading-relaxed text-[#e4ded2]/60">
          No hay registros a cinco kilómetros. Pasa en zonas rurales, y es una
          buena noticia para el curso: lo que anoten va a ser el primer registro
          del lugar.
        </p>
      )}

      {estado === "listo" && especies.length > 0 && (
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {especies.slice(0, 12).map((sp, i) => (
            <li
              key={sp.cientifico || i}
              className={`animar-asoma animar-asoma-${Math.min(i + 1, 4)} rounded-lg border border-[#e4ded2]/12 px-3.5 py-2.5`}
            >
              <p className="text-sm text-[#f3efe7]">
                {sp.comun || sp.cientifico}
              </p>
              {sp.comun && (
                <p className="mt-0.5 font-mono text-[11px] italic text-[#e4ded2]/45">
                  {sp.cientifico}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </Hoja>
  );
}
