/**
 * Paso tres: la ruta armada.
 *
 * Aquí se junta todo: las sesiones con su material, por dónde va la ruta en la
 * sala, la hoja de evaluación con los métodos que él marcó en el paso uno, y lo
 * que vive alrededor del lugar que escribió.
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
import RutaGenerada from "./RutaGenerada";
import { buscarOA } from "./oa";
import type { Entorno, Expedicion } from "./expedicion";
import Seguimiento from "./Seguimiento";
import type { Avance } from "./avance";
import type { EstadoNube } from "./nube";

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
  avance,
  onAvance,
  estadoNube,
}: {
  e: Expedicion;
  onCambio: (e: Expedicion) => void;
  avance: Avance;
  onAvance: (a: Avance) => void;
  estadoNube: EstadoNube;
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
      {/* La ruta armada para esta escuela manda. Las cuatro escritas quedan
          detrás, para cuando no hay señal o el docente prefiere una probada. */}
      <RutaGenerada e={e} onCambio={onCambio} />

      {e.rutaIA ? null : (
        <>
      {/* ── La ruta designada ────────────────────────────────────────── */}
      <Hoja titulo={cambiada ? "La ruta que elegiste" : "La ruta que te toca"} orden={4}>
        {sinOA ? (
          <p className="mb-4 max-w-2xl text-sm leading-relaxed text-[var(--tierra-300)]">
            No marcaste objetivos de aprendizaje en la primera lámina, así que
            esta sale solo por tu lugar. Vuelve y márcalos: es lo que hace que
            la ruta tenga que ver con lo que vas a pasar.
          </p>
        ) : ningunaCubre ? (
          <p className="mb-4 max-w-2xl text-sm leading-relaxed text-[var(--tierra-300)]">
            Ninguna de las rutas escritas cubre los objetivos que marcaste. Esta
            es la que más se acerca por tu lugar y tus cursos, y habrá que
            ajustarla. Conviene saberlo antes: son cuatro rutas escritas, no un
            catálogo completo.
          </p>
        ) : null}

        {elegida && designada && (
          <div className="rounded-2xl border border-[var(--tierra-600)]/50 bg-[var(--tierra-600)]/[0.07] p-5">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <span className="rotulo text-[var(--tierra-600)]">
                {elegida.titulo}
              </span>
              {designada.c.cubiertos.length > 0 && (
                <span className="shrink-0 rounded-full bg-[var(--tierra-600)] px-2.5 py-0.5 font-mono text-[10px] font-semibold text-[#1e2a24]">
                  {designada.c.cubiertos.length} de {e.oa.length} OA
                </span>
              )}
            </div>

            <p className="mt-2.5 text-lg leading-snug text-[var(--crema-clara)]">
              {elegida.preguntaGuia}
            </p>

            {/* Por qué salió esta. Sin el porqué, una designación es una orden;
                con él, el docente puede darle la contra con argumento. */}
            <p className="mt-3.5 text-sm leading-relaxed text-[var(--crema)]/70">
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
                    className="rounded bg-[var(--crema)]/14 px-1.5 py-0.5 font-mono text-[10px] text-[var(--crema)]/85"
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
          className="mt-3.5 rotulo text-[var(--crema)]/55 underline underline-offset-4 transition hover:text-[var(--crema)]"
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
                  className="flex h-full w-full flex-col rounded-xl border border-[var(--crema)]/14 p-4 text-left transition hover:border-[var(--crema)]/40"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="rotulo text-[var(--crema)]/60">
                      {ruta.titulo}
                    </span>
                    <span className="shrink-0 font-mono text-[10px] text-[var(--crema)]/45">
                      {c.cubiertos.length > 0 ? `${c.cubiertos.length} OA` : "—"}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-snug text-[var(--crema)]/85">
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
            className="mt-3 block rotulo text-[var(--tierra-600)] underline underline-offset-4 transition hover:text-[var(--tierra-500)]"
          >
            Volver a la que me tocaba
          </button>
        )}
      </Hoja>

      {elegida && (
        <>
          <Cobertura ruta={elegida} e={e} />
          <Sesiones ruta={elegida} e={e} />
          <Evaluacion e={e} ruta={elegida} />
          <Alrededor e={e} ruta={elegida} />
        </>
      )}
        </>
      )}

      {/* El seguimiento va al final y fuera de las dos ramas: da igual si la
          ruta la armó el modelo o si es una de las escritas, lo que el docente
          necesita el martes siguiente es el mismo. Es además la única hoja de
          esta lámina a la que se vuelve semana tras semana. */}
      <Seguimiento e={e} avance={avance} onCambio={onAvance} estado={estadoNube} />
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
            className={`animar-asoma animar-asoma-${Math.min(i + 1, 4)} flex gap-4 rounded-xl border border-[var(--crema)]/12 p-4`}
          >
            <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[var(--tierra-600)]/50 font-mono text-xs text-[var(--tierra-600)]">
              {i + 1}
            </span>
            <div className="min-w-0">
              <p className="text-[15px] font-medium text-[var(--crema-clara)]">{f.titulo}</p>
              {f.queOcurre && (
                <p className="mt-1 text-sm leading-relaxed text-[var(--crema)]/65">{f.queOcurre}</p>
              )}
            </div>
          </li>
        ))}
      </ol>

      {materiales.length ? (
        <div className="mt-5 border-t border-[var(--crema)]/12 pt-4">
          <p className="rotulo text-[var(--crema)]/55">
            Material disponible
          </p>
          <ul className="mt-2.5 flex flex-wrap gap-2">
            {materiales.map((m) => (
              <li
                key={m}
                className="rounded-full border border-[var(--crema)]/18 px-3 py-1 text-xs text-[var(--crema)]/75"
              >
                {m}
              </li>
            ))}
          </ul>
          <p className="mt-2.5 text-xs text-[var(--crema)]/45">
            Nada de esto hay que comprarlo. Si algo falta, la hoja de terreno se
            imprime igual y se anota a mano.
          </p>
        </div>
      ) : null}

      <LosRatosQueImportan ruta={ruta} />

      {e.semanas && e.semanas !== ruta.semanas && (
        <p className="mt-4 rounded-lg border border-[var(--tierra-300)]/35 bg-[var(--tierra-300)]/[0.07] px-3.5 py-2.5 text-xs leading-relaxed text-[var(--tierra-300)]">
          Dijiste {e.semanas} semanas y la ruta está escrita para {ruta.semanas}.
          Se puede estirar o apretar, pero la salida a terreno necesita su
          sesión completa.
        </p>
      )}
    </Hoja>
  );
}

/**
 * Los ratos de los que depende que la ruta sea un proyecto y no una tarea.
 *
 * La lista de semanas de arriba se lee por encima: son títulos y se entienden
 * solos. Estos no, y son exactamente los que se caen cuando la clase va
 * apretada, que es siempre. Van juntos porque son la misma idea vista en
 * cuatro momentos: que haya algo de verdad sin decidir, que ellos decidan una
 * parte, que el dato propio zanje la discusión, y que el trabajo se rehaga.
 *
 * Sin el primero, salir a medir es ejecutar el protocolo de otro para
 * confirmar lo que el profesor ya dijo. Sin el último, el trabajo sale en un
 * solo borrador y nadie aprende a hacerlo: la distancia entre la primera
 * versión y la segunda es la mitad de lo que el curso se lleva.
 */
function LosRatosQueImportan({ ruta }: { ruta: Ruta }) {
  const s = ruta.secuencia;
  const comprobacion = s.instruccion_explicita?.comprobacion;
  const eligen = s.salida_terreno?.lo_que_eligen;

  const ratos: { cuando: string; titular: string; cuerpo: string[] }[] = [];

  if (s.desacuerdo) {
    ratos.push({
      cuando: "Lo primero de la clase 1, antes de que expliques nada",
      titular: s.desacuerdo.sobre_que,
      cuerpo: [s.desacuerdo.como_se_ve, s.desacuerdo.quien_lo_zanja],
    });
  }
  if (comprobacion) {
    ratos.push({
      cuando: "En medio de la clase 1, antes de los ejercicios",
      titular: comprobacion.pregunta,
      cuerpo: [
        ...comprobacion.respuestas.map((r) => `${r.dice}: ${r.significa}`),
        comprobacion.si_falla,
      ],
    });
  }
  if (eligen) {
    ratos.push({
      cuando: "En la salida, lo que eligen ellos y no tú",
      titular: eligen.que_eligen,
      cuerpo: [eligen.en_que_cambia, eligen.como_lo_defienden],
    });
  }
  if (s.vuelta_del_terreno) {
    ratos.push({
      cuando: "Al volver del terreno, antes de cualquier cálculo",
      titular: s.vuelta_del_terreno.como_empieza,
      cuerpo: [
        s.vuelta_del_terreno.que_comparan,
        ...(s.vuelta_del_terreno.con_la_comunidad
          ? [s.vuelta_del_terreno.con_la_comunidad]
          : []),
      ],
    });
  }
  if (s.borrador_y_critica) {
    ratos.push({
      cuando: "Antes de entregar: una versión, las críticas, y otra versión",
      titular: s.borrador_y_critica.primera_version,
      cuerpo: [s.borrador_y_critica.como_se_critica, s.borrador_y_critica.que_mejora],
    });
  }

  if (!ratos.length) return null;

  return (
    <div className="mt-5 space-y-3 border-t border-[var(--crema)]/12 pt-4">
      <p className="rotulo text-[var(--crema)]/55">No te saltes estos ratos</p>
      {ratos.map((r) => (
        <div key={r.cuando} className="rounded-xl border border-[var(--crema)]/12 p-4">
          <p className="rotulo text-[var(--tierra-600)]">{r.cuando}</p>
          <p className="mt-1.5 text-[15px] leading-relaxed text-[var(--crema-clara)]">
            {r.titular}
          </p>
          {r.cuerpo.map((linea) => (
            <p
              key={linea}
              className="mt-2.5 text-sm leading-relaxed text-[var(--crema)]/65"
            >
              {linea}
            </p>
          ))}
        </div>
      ))}
    </div>
  );
}

/** La hoja de evaluación, armada con lo que él marcó en el paso uno. */
function Evaluacion({ e, ruta }: { e: Expedicion; ruta: Ruta }) {
  if (!e.evaluacion.length) {
    return (
      <Hoja titulo="Evaluación" orden={8}>
        <p className="text-sm leading-relaxed text-[var(--crema)]/60">
          No marcaste ningún método en el primer paso. Vuelve a la primera lámina
          y elige al menos uno: sin eso, la ruta llega al final sin manera de
          mostrar lo que aprendieron.
        </p>
      </Hoja>
    );
  }

  return (
    <Hoja titulo="Evaluación" orden={8}>
      <p className="mb-4 max-w-2xl text-sm leading-relaxed text-[var(--crema)]/60">
        Lo que marcaste en el primer paso, puesto contra lo que la ruta produce.
      </p>
      <ul className="space-y-2.5">
        {e.evaluacion.map((v) => (
          <li
            key={v}
            className="flex flex-wrap items-baseline gap-x-3 gap-y-1 rounded-xl border border-[var(--crema)]/12 p-3.5"
          >
            <span className="rotulo text-[var(--tierra-600)]">
              {ETIQUETA_EVAL[v] ?? v}
            </span>
            <span className="min-w-0 flex-1 text-sm leading-relaxed text-[var(--crema)]/75">
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
        <div className="mt-4 border-t border-[var(--crema)]/12 pt-4">
          <p className="rotulo text-[var(--crema)]/55">
            Contra estos objetivos
          </p>
          <ul className="mt-2.5 space-y-1.5">
            {e.oa.map((cod) => {
              const oa = buscarOA(cod);
              return (
                <li key={cod} className="flex gap-2.5 text-sm leading-relaxed">
                  <span className="shrink-0 font-mono text-[11px] text-[var(--tierra-600)]">
                    {cod.replace(/_CN_/, " · ")}
                  </span>
                  <span className="text-[var(--crema)]/75">{oa?.texto ?? ""}</span>
                </li>
              );
            })}
          </ul>
          {e.objetivos.trim() && (
            <p className="mt-3 whitespace-pre-line border-t border-[var(--crema)]/8 pt-3 text-sm leading-relaxed text-[var(--crema)]/75">
              <span className="rotulo text-[var(--crema)]/45">
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
      <p className="mb-4 max-w-2xl text-sm leading-relaxed text-[var(--crema)]/60">
        Lo que la ciencia ciudadana ha registrado alrededor de{" "}
        {e.ubicacion.trim() || "tu escuela"}, para saber qué se puede encontrar
        el día de la salida. Los datos vienen de iNaturalist.
      </p>

      <button
        type="button"
        onClick={buscar}
        disabled={estado === "pidiendo"}
        className="rounded-full border border-[var(--crema)]/25 px-5 py-2 text-sm text-[var(--crema)]/85 transition hover:border-[var(--crema)]/55 hover:text-[var(--crema)] disabled:opacity-50"
      >
        {estado === "pidiendo" ? "Preguntando…" : "Usar mi ubicación"}
      </button>

      {estado === "error" && (
        <p className="mt-3.5 text-sm leading-relaxed text-[var(--tierra-300)]">{motivo}</p>
      )}

      {estado === "listo" && especies.length === 0 && (
        <p className="mt-3.5 text-sm leading-relaxed text-[var(--crema)]/60">
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
              className={`animar-asoma animar-asoma-${Math.min(i + 1, 4)} rounded-lg border border-[var(--crema)]/12 px-3.5 py-2.5`}
            >
              <p className="text-sm text-[var(--crema-clara)]">
                {sp.comun || sp.cientifico}
              </p>
              {sp.comun && (
                <p className="mt-0.5 font-mono text-[11px] italic text-[var(--crema)]/45">
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
      <p className="mb-4 max-w-2xl text-sm leading-relaxed text-[var(--crema)]/60">
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
                  ? "border-[var(--tierra-600)]/45 bg-[var(--tierra-600)]/[0.06]"
                  : "border-[var(--crema)]/12"
              }`}
            >
              <span
                aria-hidden
                className={`mt-0.5 shrink-0 font-mono text-xs ${
                  dentro ? "text-[var(--tierra-600)]" : "text-[var(--crema)]/30"
                }`}
              >
                {dentro ? "✓" : "○"}
              </span>
              <span className="min-w-0">
                <span className="font-mono text-[11px] font-semibold text-[var(--crema)]/70">
                  {cod.replace(/_CN_/, " · ")}
                </span>
                <span className="mt-1 block text-sm leading-relaxed text-[var(--crema)]/75">
                  {oa?.texto ?? cod}
                </span>
              </span>
            </li>
          );
        })}
      </ul>

      {c.fuera.length > 0 && (
        <p className="mt-4 rounded-lg border border-[var(--tierra-300)]/35 bg-[var(--tierra-300)]/[0.07] px-3.5 py-2.5 text-xs leading-relaxed text-[var(--tierra-300)]">
          Los {c.fuera.length} sin marca no los toca esta ruta. Habrá que
          pasarlos por otro lado, o estirar la ruta para que entren.
        </p>
      )}
    </Hoja>
  );
}
