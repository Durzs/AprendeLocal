import { useState } from "react";

import { Campo, Hoja, Parrafo, Texto } from "../crear/Campos";
import type { Expedicion } from "../crear/expedicion";
import {
  ASIGNATURAS,
  PROBLEMAS,
  QUE_SACAN_DE_LA_NOTICIA,
  angulosDe,
  nombreAsignatura,
  problemaPorId,
} from "./problemas";

/**
 * De dónde arranca el proyecto: la problemática.
 *
 * Sustituye a la lámina «Qué pasa ahí», que eran cinco cuadros de texto en
 * blanco —asignatura, temáticas, fenómeno local, qué se podría averiguar,
 * producto final— puestos delante de alguien que abrió la aplicación
 * justamente porque no tenía eso pensado. Pedirle a un docente que redacte lo
 * que vino a buscar es la manera más segura de que cierre la pestaña.
 *
 * Ahora elige de una lista de problemáticas que están ocurriendo, marca desde
 * qué asignaturas entra, y ve cómo cambia el trabajo según eso. Lo único que
 * escribe es cómo se ve el problema en SU sitio, que es lo único que la
 * plataforma no puede saber.
 */
export function ElegirProblema({
  e,
  onCambio,
  orden = 4,
}: {
  e: Expedicion;
  onCambio: (e: Expedicion) => void;
  orden?: number;
}) {
  const [proponiendo, ponerProponiendo] = useState(Boolean(e.problemaPropio));
  const set = <K extends keyof Expedicion>(k: K, v: Expedicion[K]) =>
    onCambio({ ...e, [k]: v });

  const elegido = e.problemaId ? problemaPorId(e.problemaId) : null;

  return (
    <Hoja titulo="De qué va a tratar" orden={orden}>
      <p className="mb-5 max-w-2xl text-[15px] leading-relaxed text-[var(--crema)]/82">
        Un proyecto empieza por algo que está pasando, no por un tema. Elige una
        de estas o propone la tuya, y después marca desde qué asignaturas
        entras: la misma problemática abre trabajos distintos según eso.
      </p>

      <ul className="grid gap-2.5 sm:grid-cols-2">
        {PROBLEMAS.map((p) => {
          const activo = p.id === e.problemaId && !proponiendo;
          return (
            <li key={p.id}>
              <button
                type="button"
                onClick={() => {
                  ponerProponiendo(false);
                  onCambio({ ...e, problemaId: activo ? null : p.id, problemaPropio: "" });
                }}
                aria-pressed={activo}
                className={`h-full w-full rounded-xl border px-4 py-3.5 text-left transition ${
                  activo
                    ? "border-[var(--tierra-600)] bg-[var(--tierra-600)]/[0.1]"
                    : "border-[var(--crema)]/14 hover:border-[var(--crema)]/30"
                }`}
              >
                <span
                  className={`block text-[17px] leading-snug ${
                    activo ? "text-[var(--tierra-300)]" : "text-[var(--crema-clara)]"
                  }`}
                >
                  {p.nombre}
                </span>
                <span className="mt-1.5 block text-sm leading-relaxed text-[var(--crema)]/75">
                  {p.dondeAparece}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <button
        type="button"
        onClick={() => {
          ponerProponiendo(true);
          set("problemaId", null);
        }}
        aria-pressed={proponiendo}
        className={`mt-3 min-h-11 rounded-full border px-4 text-sm transition ${
          proponiendo
            ? "border-[var(--tierra-600)] bg-[var(--tierra-600)] text-[#1e2a24]"
            : "border-[var(--crema)]/18 text-[var(--crema)]/85 hover:border-[var(--crema)]/35"
        }`}
      >
        Ninguna: la mía es otra
      </button>

      {proponiendo && (
        <Campo
          etiqueta="Cuál es"
          ayuda="Algo que esté ocurriendo aquí y de lo que se pueda averiguar algo."
          ancho="entera"
        >
          <Parrafo
            value={e.problemaPropio}
            onChange={(ev) => set("problemaPropio", ev.target.value)}
            placeholder="La planta de áridos levanta polvo todo el verano y las casas de al lado no pueden abrir las ventanas."
            rows={2}
          />
        </Campo>
      )}

      {elegido && !proponiendo && (
        <>
          <p className="mt-5 text-[15px] leading-relaxed text-[var(--crema)]/85">
            {elegido.queEs}
          </p>

          <Noticias e={e} onCambio={onCambio} problema={elegido} />

          <div className="mt-6">
            <p className="rotulo text-[var(--crema)]/75">Desde qué asignaturas entras</p>
            <ul className="mt-2.5 flex flex-wrap gap-2">
              {ASIGNATURAS.map((a) => {
                const marcada = e.asignaturas.includes(a.id);
                const hayAngulo = elegido.angulos.some((x) => x.asignatura === a.id);
                return (
                  <li key={a.id}>
                    <button
                      type="button"
                      onClick={() =>
                        set(
                          "asignaturas",
                          marcada
                            ? e.asignaturas.filter((x) => x !== a.id)
                            : [...e.asignaturas, a.id]
                        )
                      }
                      aria-pressed={marcada}
                      className={`min-h-11 rounded-full border px-4 text-sm transition ${
                        marcada
                          ? "border-[var(--tierra-600)] bg-[var(--tierra-600)] text-[#1e2a24]"
                          : hayAngulo
                            ? "border-[var(--crema)]/18 text-[var(--crema)]/85 hover:border-[var(--crema)]/35"
                            : "border-[var(--crema)]/10 text-[var(--crema)]/35"
                      }`}
                    >
                      {a.nombre}
                    </button>
                  </li>
                );
              })}
            </ul>
            {/* Las apagadas no se esconden: que una asignatura no tenga ángulo
                escrito para este problema es información, y esconderla haría
                creer que no da para entrar por ahí. */}
            <p className="mt-2.5 text-sm leading-relaxed text-[var(--crema)]/70">
              Las apagadas no traen un ángulo escrito para esta problemática.
              Puedes marcarlas igual: quiere decir que ese lo armas tú.
            </p>
          </div>

          <div className="mt-5 space-y-2.5">
            {angulosDe(elegido, e.asignaturas).map((a) => (
              <div
                key={a.asignatura}
                className="rounded-xl border border-[var(--crema)]/12 p-4"
              >
                <p className="rotulo text-[var(--tierra-600)]">
                  {nombreAsignatura(a.asignatura)}
                </p>
                <p className="mt-1.5 text-base leading-relaxed text-[var(--crema-clara)]">
                  {a.enfoque}
                </p>
                <p className="mt-2 text-[15px] leading-relaxed text-[var(--crema)]/82">
                  {a.queInvestigan}
                </p>
                <p className="mt-2 text-[15px] leading-relaxed text-[var(--crema)]/75">
                  {a.queSaleDeAqui}
                </p>
              </div>
            ))}
          </div>
        </>
      )}

      <Campo
        etiqueta="Cómo se ve eso aquí"
        ayuda="En una frase, lo que se nota en tu sitio y que en otra escuela no se notaría igual. Es lo único que no podemos saber nosotros."
        ancho="entera"
      >
        <Parrafo
          value={e.fenomeno}
          onChange={(ev) => set("fenomeno", ev.target.value)}
          placeholder="El estero baja tanto en verano que la bomba de la escuela se queda sin agua."
          rows={2}
        />
      </Campo>

      {(elegido || e.problemaPropio.trim()) && <QueSacanDeAhi />}
    </Hoja>
  );
}

/**
 * Las notas de prensa, que las pone el docente.
 *
 * El catálogo no trae titulares escritos y eso es deliberado. Un titular con
 * su medio y su fecha es un registro; uno inventado sigue pareciendo
 * verdadero después de que alguien lo cite, y acabaría en la pizarra de una
 * escuela como si fuera cierto. Lo que sí se puede dar es con qué palabras
 * buscar, dónde, y qué nota sirve de verdad.
 */
function Noticias({
  e,
  onCambio,
  problema,
}: {
  e: Expedicion;
  onCambio: (e: Expedicion) => void;
  problema: NonNullable<ReturnType<typeof problemaPorId>>;
}) {
  const [titular, ponerTitular] = useState("");
  const [url, ponerUrl] = useState("");

  function agregar() {
    if (!titular.trim()) return;
    onCambio({
      ...e,
      noticias: [...e.noticias, { titular: titular.trim(), url: url.trim() }],
    });
    ponerTitular("");
    ponerUrl("");
  }

  return (
    <div className="mt-5 rounded-xl border border-[var(--crema)]/12 p-4">
      {/* Primero las fuentes comprobadas, que son las que sostienen que esto
          es un problema y no un tema. Después el hueco para las de su comuna,
          que son las que de verdad mueven a un curso y que no tenemos. */}
      {problema.respaldo.length > 0 ? (
        <>
          <p className="rotulo text-[var(--crema)]/75">De dónde sale este problema</p>
          <ul className="mt-3 space-y-3.5">
            {problema.respaldo.map((n) => (
              <li key={n.titular}>
                <p className="text-base leading-snug text-[var(--crema-clara)]">
                  {n.url ? (
                    <a
                      href={n.url}
                      target="_blank"
                      rel="noreferrer"
                      className="underline decoration-[var(--tierra-600)] underline-offset-4 hover:text-[var(--tierra-300)]"
                    >
                      {n.titular}
                    </a>
                  ) : (
                    n.titular
                  )}
                </p>
                <p className="mt-1 text-sm text-[var(--crema)]/70">
                  {n.medio}
                  {n.fecha ? ` · ${n.fecha}` : ""}
                </p>
                {n.queAporta && (
                  <p className="mt-1.5 text-[15px] leading-relaxed text-[var(--crema)]/82">
                    {n.queAporta}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p className="text-[15px] leading-relaxed text-[var(--crema)]/82">
          Esta es la única sin fuentes nacionales, y no es un descuido: lo que
          se está dejando de saber en un pueblo no sale en ningún estudio, se
          sabe preguntando ahí.
        </p>
      )}

      <p className="mt-5 border-t border-[var(--crema)]/12 pt-4 rotulo text-[var(--crema)]/75">
        Las noticias de tu zona
      </p>

      {e.noticias.length > 0 && (
        <ul className="mt-3 space-y-2">
          {e.noticias.map((n, i) => (
            <li key={`${n.titular}-${i}`} className="flex items-start gap-3">
              <span className="min-w-0 flex-1 text-[15px] leading-relaxed text-[var(--crema-clara)]">
                {n.titular}
                {n.url && (
                  <span className="mt-0.5 block truncate text-xs text-[var(--crema)]/70">
                    {n.url}
                  </span>
                )}
              </span>
              <button
                type="button"
                onClick={() =>
                  onCambio({ ...e, noticias: e.noticias.filter((_, j) => j !== i) })
                }
                className="min-h-11 shrink-0 px-2 text-sm text-[var(--crema)]/72 hover:text-[var(--tierra-300)]"
              >
                Quitar
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-3 grid gap-2.5 sm:grid-cols-[1fr_auto]">
        <div className="grid gap-2.5">
          <Texto
            value={titular}
            onChange={(ev) => ponerTitular(ev.target.value)}
            placeholder="El titular, tal como salió"
          />
          <Texto
            value={url}
            onChange={(ev) => ponerUrl(ev.target.value)}
            placeholder="El enlace, si lo tienes"
          />
        </div>
        <button
          type="button"
          onClick={agregar}
          className="min-h-11 self-start rounded-full border border-[var(--crema)]/25 px-5 text-sm font-medium text-[var(--crema-clara)] transition hover:bg-[var(--crema)]/10"
        >
          Agregar
        </button>
      </div>

      <div className="mt-4 border-t border-[var(--crema)]/12 pt-3.5">
        <p className="text-sm leading-relaxed text-[var(--crema)]/75">
          Las de arriba son nacionales y sirven para plantear el asunto. La que
          de verdad mueve a un curso es la de su propia comuna, y esa no la
          tenemos cargada todavía: la pones tú.
        </p>
        <p className="mt-2.5 text-sm leading-relaxed text-[var(--crema)]/82">
          <span className="text-[var(--crema-clara)]">Cómo buscarlas:</span>{" "}
          {problema.comoSeBuscan.terminos.join(" · ")}
        </p>
        <p className="mt-1.5 text-sm leading-relaxed text-[var(--crema)]/75">
          {problema.comoSeBuscan.donde}
        </p>
        <p className="mt-1.5 text-sm leading-relaxed text-[var(--crema)]/75">
          {problema.comoSeBuscan.queNotaSirve}
        </p>
      </div>
    </div>
  );
}

/** Lo que el curso tiene que sacar en limpio antes de seguir. */
function QueSacanDeAhi() {
  return (
    <div className="mt-6 border-t border-[var(--crema)]/12 pt-5">
      <p className="rotulo text-[var(--crema)]/75">
        Qué tiene que pasar en esa primera clase
      </p>
      <ul className="mt-3 space-y-3">
        {QUE_SACAN_DE_LA_NOTICIA.map((q) => (
          <li key={q.titulo}>
            <p className="text-[17px] leading-snug text-[var(--crema-clara)]">
              {q.titulo}
            </p>
            <p className="mt-1 text-[15px] leading-relaxed text-[var(--crema)]/82">
              {q.queEs}
            </p>
            <p className="mt-1 text-[15px] leading-relaxed text-[var(--crema)]/72">
              Se nota en que {q.seNotaEn}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
