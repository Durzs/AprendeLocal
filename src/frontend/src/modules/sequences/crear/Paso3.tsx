/**
 * Paso tres: la ruta armada.
 *
 * Aquí se junta todo: las sesiones con su material, el código con que entra el
 * curso, la hoja de evaluación con los métodos que él marcó en el paso uno, y
 * lo que vive alrededor del lugar que escribió.
 *
 * Las rutas que aparecen no se inventan: son las del catálogo, ordenadas por
 * cuántos de los objetivos que él marcó cubre cada una. Manda el currículo, y
 * la tarjeta enseña los códigos para que lo compruebe en vez de confiar. Si
 * ninguna cubre nada de lo marcado se dice, en vez de empujarle la que sobró.
 */

import { useMemo, useState } from "react";

import { RUTAS, cursoCorto, type Ruta } from "../rutas/catalogo";
import { consultar, pedirUbicacion, type Especie, type Grupo } from "../rutas/inaturalist";
import { Hoja } from "./Campos";
import { buscarOA } from "./oa";
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

/** Por qué una ruta calza, además de cuánto. */
type Calce = {
  /** Los OA que el docente marcó y esta ruta efectivamente cubre. */
  cubiertos: string[];
  /** Los que marcó y esta ruta no toca. */
  fuera: string[];
  mismoEntorno: boolean;
  mismosCursos: boolean;
  /** Para ordenar. Manda el currículo. */
  puntos: number;
};

/**
 * Cuánto y por qué calza una ruta con lo que el docente pidió.
 *
 * Antes esto miraba el entorno y algunas palabras del título. Podía darle una
 * ruta de suelo a quien había marcado objetivos de energía, y el docente no
 * tenía cómo saber por qué. Ahora manda el currículo: cada objetivo que marcó
 * y la ruta cubre vale tres, y el entorno y los cursos desempatan. Es lo que
 * hace que la ruta tenga que ver con lo que él dijo que iba a pasar.
 */
function calce(ruta: Ruta, e: Expedicion): Calce {
  const suyos = ruta.cubre.flatMap((c) => c.codigos);
  const cubiertos = e.oa.filter((c) => suyos.includes(c));
  const fuera = e.oa.filter((c) => !suyos.includes(c));
  const mismoEntorno = Boolean(e.entorno && ENTORNO_DE_RUTA[ruta.id]?.includes(e.entorno));
  const mismosCursos =
    e.cursos.length > 0 && ruta.cubre.some((c) => e.cursos.includes(cursoCorto(c.nivel)));

  return {
    cubiertos,
    fuera,
    mismoEntorno,
    mismosCursos,
    puntos: cubiertos.length * 3 + (mismoEntorno ? 2 : 0) + (mismosCursos ? 1 : 0),
  };
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
  const [viendoOtras, setViendoOtras] = useState(false);

  const ordenadas = useMemo(
    () =>
      RUTAS.map((r) => ({ ruta: r, c: calce(r, e) })).sort((a, b) => b.c.puntos - a.c.puntos),
    [e]
  );

  const sinOA = e.oa.length === 0;
  const mejor = ordenadas[0];
  const ningunaCubre = !sinOA && mejor?.c.cubiertos.length === 0;

  /*
   * La ruta se designa, no se escoge de una fila.
   *
   * Antes esta lamina ponia las cuatro en tarjetas iguales, o sea la misma
   * vitrina que se habia sacado de la portada, movida al final. Ahora la que
   * calza queda designada y las demas se guardan detras de un enlace, para
   * quien quiera cambiarla.
   *
   * La designacion es derivada y no guardada: mientras el docente no elija
   * otra, `rutaId` sigue vacio y la ruta se recalcula si vuelve atras y cambia
   * un objetivo. Guardarla congelaria una decision que el todavia no tomo.
   */
  const designada = ordenadas.find(({ ruta }) => ruta.id === e.rutaId) ?? mejor;
  const elegida = designada?.ruta ?? null;
  const cambiada = Boolean(e.rutaId) && e.rutaId !== mejor?.ruta.id;
  const otras = ordenadas.filter(({ ruta }) => ruta.id !== elegida?.id);

  return (
    <div className="space-y-4">
      {/* ── La ruta designada ────────────────────────────────────────── */}
      <Hoja titulo={cambiada ? "La ruta que elegiste" : "La ruta que te toca"} orden={4}>
        {sinOA ? (
          <p className="mb-4 max-w-2xl text-sm leading-relaxed text-[#e0a678]">
            No marcaste objetivos de aprendizaje en la primera lámina, así que
            esta sale solo por tu lugar. Vuelve y márcalos: es lo que hace que
            la ruta tenga que ver con lo que vas a pasar.
          </p>
        ) : ningunaCubre ? (
          <p className="mb-4 max-w-2xl text-sm leading-relaxed text-[#e0a678]">
            Ninguna de las rutas escritas cubre los objetivos que marcaste. Esta
            es la que más se acerca por tu lugar y tus cursos, y habrá que
            ajustarla. Conviene saberlo antes: son cuatro rutas escritas, no un
            catálogo completo.
          </p>
        ) : null}

        {elegida && designada && (
          <div className="rounded-2xl border border-[#c9612a]/50 bg-[#c9612a]/[0.07] p-5">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#c9612a]">
                {elegida.titulo}
              </span>
              {designada.c.cubiertos.length > 0 && (
                <span className="shrink-0 rounded-full bg-[#c9612a] px-2.5 py-0.5 font-mono text-[10px] font-semibold text-[#1e2a24]">
                  {designada.c.cubiertos.length} de {e.oa.length} OA
                </span>
              )}
            </div>

            <p className="mt-2.5 text-lg leading-snug text-[#f3efe7]">
              {elegida.preguntaGuia}
            </p>

            {/* Por qué salió esta. Sin el porqué, una designación es una orden;
                con él, el docente puede darle la contra con argumento. */}
            <p className="mt-3.5 text-sm leading-relaxed text-[#e4ded2]/70">
              {designada.c.cubiertos.length > 0 ? (
                <>
                  Sale por los objetivos que marcaste
                  {designada.c.mismoEntorno ? " y porque calza con tu entorno" : ""}.
                </>
              ) : designada.c.mismoEntorno ? (
                <>Sale por tu entorno, no por los objetivos.</>
              ) : (
                <>Es la que queda más cerca de lo que contaste.</>
              )}{" "}
              {elegida.semanas} semanas · {elegida.cubre.map((x) => cursoCorto(x.nivel)).join(" ")}
            </p>

            {designada.c.cubiertos.length > 0 && (
              <p className="mt-2.5 flex flex-wrap gap-1.5">
                {designada.c.cubiertos.map((cod) => (
                  <span
                    key={cod}
                    className="rounded bg-[#e4ded2]/14 px-1.5 py-0.5 font-mono text-[10px] text-[#e4ded2]/85"
                  >
                    {cod.replace(/_CN_/, " · ")}
                  </span>
                ))}
              </p>
            )}
          </div>
        )}

        {/* Las otras, guardadas. Están para dar la contra, no para elegir de
            una vitrina: por eso hay que pedirlas. */}
        <button
          type="button"
          onClick={() => setViendoOtras((v) => !v)}
          aria-expanded={viendoOtras}
          className="mt-3.5 font-mono text-[11px] uppercase tracking-[0.14em] text-[#e4ded2]/55 underline underline-offset-4 transition hover:text-[#e4ded2]"
        >
          {viendoOtras ? "Cerrar las otras" : `Ver las otras ${otras.length}`}
        </button>

        {viendoOtras && (
          <ul className="animar-hoja mt-3 grid gap-2.5 sm:grid-cols-2">
            {otras.map(({ ruta, c }) => (
              <li key={ruta.id}>
                <button
                  type="button"
                  onClick={() => {
                    onCambio({ ...e, rutaId: ruta.id });
                    setViendoOtras(false);
                  }}
                  className="flex h-full w-full flex-col rounded-xl border border-[#e4ded2]/14 p-4 text-left transition hover:border-[#e4ded2]/40"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#e4ded2]/60">
                      {ruta.titulo}
                    </span>
                    <span className="shrink-0 font-mono text-[10px] text-[#e4ded2]/45">
                      {c.cubiertos.length > 0 ? `${c.cubiertos.length} OA` : "—"}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-snug text-[#e4ded2]/85">
                    {ruta.preguntaGuia}
                  </p>
                </button>
              </li>
            ))}
          </ul>
        )}

        {cambiada && (
          <button
            type="button"
            onClick={() => onCambio({ ...e, rutaId: null })}
            className="mt-3 block font-mono text-[11px] uppercase tracking-[0.14em] text-[#c9612a] underline underline-offset-4 transition hover:text-[#e08a52]"
          >
            Volver a la que me tocaba
          </button>
        )}
      </Hoja>

      {elegida && (
        <>
          <Cobertura ruta={elegida} e={e} />
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
    <Hoja titulo="Las sesiones" orden={6}>
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
    <Hoja titulo="El curso" orden={7}>
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
      <Hoja titulo="Evaluación" orden={8}>
        <p className="text-sm leading-relaxed text-[#e4ded2]/60">
          No marcaste ningún método en el primer paso. Vuelve a la primera lámina
          y elige al menos uno: sin eso, la ruta llega al final sin manera de
          mostrar lo que aprendieron.
        </p>
      </Hoja>
    );
  }

  return (
    <Hoja titulo="Evaluación" orden={8}>
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
      {(e.oa.length > 0 || e.objetivos.trim()) && (
        <div className="mt-4 border-t border-[#e4ded2]/12 pt-4">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#e4ded2]/55">
            Contra estos objetivos
          </p>
          <ul className="mt-2.5 space-y-1.5">
            {e.oa.map((cod) => {
              const oa = buscarOA(cod);
              return (
                <li key={cod} className="flex gap-2.5 text-sm leading-relaxed">
                  <span className="shrink-0 font-mono text-[11px] text-[#c9612a]">
                    {cod.replace(/_CN_/, " · ")}
                  </span>
                  <span className="text-[#e4ded2]/75">{oa?.texto ?? ""}</span>
                </li>
              );
            })}
          </ul>
          {e.objetivos.trim() && (
            <p className="mt-3 whitespace-pre-line border-t border-[#e4ded2]/8 pt-3 text-sm leading-relaxed text-[#e4ded2]/75">
              <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#e4ded2]/45">
                Y lo tuyo:{" "}
              </span>
              {e.objetivos}
            </p>
          )}
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
    <Hoja titulo="Qué vive ahí">
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

/**
 * Qué objetivos cubre la ruta elegida y cuáles no.
 *
 * Es la hoja que evita el malentendido más caro: creer que porque la ruta
 * salió primera cubre todo lo que se marcó. Casi nunca cubre todo. Decirlo
 * aquí, con los códigos a la vista, le deja al docente decidir si estira la
 * ruta o si esos objetivos los pasa por otro lado.
 */
function Cobertura({ ruta, e }: { ruta: Ruta; e: Expedicion }) {
  if (!e.oa.length) return null;
  const c = calce(ruta, e);

  return (
    <Hoja titulo="Qué cubre y qué no" orden={5}>
      <p className="mb-4 max-w-2xl text-sm leading-relaxed text-[#e4ded2]/60">
        De los {e.oa.length} objetivos que marcaste, esta ruta trabaja{" "}
        {c.cubiertos.length}.
      </p>

      <ul className="space-y-2">
        {e.oa.map((cod) => {
          const oa = buscarOA(cod);
          const dentro = c.cubiertos.includes(cod);
          return (
            <li
              key={cod}
              className={`flex gap-3 rounded-xl border p-3.5 ${
                dentro
                  ? "border-[#c9612a]/45 bg-[#c9612a]/[0.06]"
                  : "border-[#e4ded2]/12"
              }`}
            >
              <span
                aria-hidden
                className={`mt-0.5 shrink-0 font-mono text-xs ${
                  dentro ? "text-[#c9612a]" : "text-[#e4ded2]/30"
                }`}
              >
                {dentro ? "✓" : "○"}
              </span>
              <span className="min-w-0">
                <span className="font-mono text-[11px] font-semibold text-[#e4ded2]/70">
                  {cod.replace(/_CN_/, " · ")}
                </span>
                <span className="mt-1 block text-sm leading-relaxed text-[#e4ded2]/75">
                  {oa?.texto ?? cod}
                </span>
              </span>
            </li>
          );
        })}
      </ul>

      {c.fuera.length > 0 && (
        <p className="mt-4 rounded-lg border border-[#e0a678]/35 bg-[#e0a678]/[0.07] px-3.5 py-2.5 text-xs leading-relaxed text-[#e0a678]">
          Los {c.fuera.length} sin marca no los toca esta ruta. Habrá que
          pasarlos por otro lado, o estirar la ruta para que entren.
        </p>
      )}
    </Hoja>
  );
}
