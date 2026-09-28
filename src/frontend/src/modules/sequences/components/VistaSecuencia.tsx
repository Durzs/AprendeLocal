/**
 * La secuencia, ya hecha, mirada por el docente.
 *
 * Vivía dentro de la pantalla de generar, y eso ataba una cosa a la otra: para
 * ver una clase había que fabricarla antes. Separarlas es lo que permite tener
 * rutas ya escritas y revisadas, que es lo que un profesor necesita el lunes:
 * abrir y usar, no configurar y esperar.
 *
 * El mismo componente sirve para las dos procedencias. La diferencia se
 * declara: lo que redactó un modelo lleva su sello y su advertencia; una ruta
 * revisada no los lleva, porque decir «revísalo, lo escribió una máquina» de
 * algo que escribió una persona sería mentir en la dirección contraria.
 */

import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { Secuencia } from "../../../types";
import EtapaSecuencia from "./EtapaSecuencia";
import RielEtapas, { type ResumenEtapa } from "./RielEtapas";
import { nivelCorto } from "./SelectorObjetivo";
import { enPalabras, nombreLegible } from "../lib/etiquetas";

/** Distintivo que separa el dato real del texto generado por el modelo. */
function Procedencia({ tipo }: { tipo: "dato" | "generado" }) {
  const { t } = useTranslation();
  const esDato = tipo === "dato";
  return (
    <span
      className={[
        "ml-2 rounded border px-1.5 py-0.5 align-middle rotulo",
        esDato
          ? "border-slate-300 bg-slate-50 text-slate-600"
          : "border-amber-300 bg-amber-50 text-amber-800",
      ].join(" ")}
      title={
        esDato
          ? t("preparar.provenanceDataTitle")
          : t("preparar.provenanceGeneratedTitle")
      }
    >
      {esDato ? t("preparar.provenanceData") : t("preparar.provenanceGenerated")}
    </span>
  );
}

/**
 * Lo que le toca a cada curso cuando la sala es multigrado.
 *
 * Va dentro de la etapa correspondiente y no en una sección aparte: el docente
 * lee la clase en orden, y separar «lo de 5º» de «lo de 7º» en dos bloques
 * lejanos le obliga a reconstruir mentalmente lo que pasa a la misma hora.
 */
function PorNivel({
  bloques,
  campo,
}: {
  bloques: NonNullable<Secuencia["por_nivel"]>;
  campo: "practica_guiada" | "practica_autonoma";
}) {
  const { t } = useTranslation();
  const conTrabajo = bloques.filter((b) => (b[campo]?.ejercicios?.length ?? 0) > 0);
  if (conTrabajo.length === 0) return null;

  return (
    <div className="mt-4 space-y-3 border-t border-slate-200 pt-4">
      {conTrabajo.map((b, i) => (
        // Escalonados: tres o cuatro cursos entrando a la vez son una pared.
        // Entrando de arriba abajo se leen como la lista que son.
        <div
          key={`${b.nivel}-${b.objetivo_codigo}`}
          className={`animar-asoma animar-asoma-${Math.min(i + 1, 4)}`}
        >
          <p className="flex items-baseline gap-2 text-sm font-semibold text-slate-800">
            <span className="rounded bg-tinta-950 px-1.5 py-0.5 font-mono text-[10px] text-white">
              {nivelCorto(b.nivel, t("preparar.gradeBadge"))}
            </span>
            {b.objetivo_descripcion ? (
              <span className="font-normal text-slate-500">{b.objetivo_descripcion}</span>
            ) : null}
          </p>
          <ol className="mt-1.5 list-decimal space-y-1.5 pl-5 text-sm">
            {/* Los dos tipos de ejercicio comparten enunciado; solo el guiado
                trae apoyo, y leerlo así evita duplicar este bloque. */}
            {((b[campo]?.ejercicios ?? []) as { enunciado: string; apoyo?: string }[]).map(
              (e, i) => (
                <li key={i}>
                  {e.enunciado}
                  {e.apoyo ? (
                    <span className="block text-slate-500">
                      {t("preparar.support")} {e.apoyo}
                    </span>
                  ) : null}
                </li>
              )
            )}
          </ol>

          {/* El profesor solo puede estar en un puesto a la vez. Esto es lo que
              hace este curso cuando no está con él, y va pegado a sus
              ejercicios porque se leen en el mismo momento. */}
          {b.mientras_esperan?.trim() ? (
            <p className="mt-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
              <span className="font-semibold">{t("preparar.meanwhile")}</span>{" "}
              {b.mientras_esperan}
            </p>
          ) : null}
        </div>
      ))}
    </div>
  );
}

/**
 * La pregunta con la que se averigua quién entendió.
 *
 * No va al final de la clase sino en medio de ella, porque su único uso es
 * decidir si se sigue o si se vuelve atrás. Las respuestas equivocadas se
 * muestran igual de grandes que la correcta a propósito: lo que el docente
 * necesita leer de un vistazo no es cuál era la buena —esa la sabe— sino qué
 * está pensando el que contestó mal, que es lo que le dice qué repetir.
 */
function Comprobar({ c }: { c: NonNullable<Secuencia["instruccion_explicita"]>["comprobacion"] }) {
  const { t } = useTranslation();
  if (!c) return null;

  return (
    <div className="rounded-xl border border-slate-300 bg-white p-4">
      <p className="rotulo text-slate-500">{t("preparar.checkTitle")}</p>
      <p className="mt-1.5 font-medium text-slate-900">{c.pregunta}</p>
      <ul className="mt-3 space-y-1.5">
        {c.respuestas.map((r) => (
          <li key={r.dice} className="text-slate-700">
            <span className="font-medium text-slate-900">{r.dice}</span>{" "}
            <span className="text-slate-500">{t("preparar.checkMeans")}</span> {r.significa}
          </li>
        ))}
      </ul>
      <p className="mt-3 border-t border-slate-200 pt-3 text-slate-700">
        <strong className="text-slate-900">{t("preparar.checkIfWrong")}</strong> {c.si_falla}
      </p>
    </div>
  );
}

/**
 * Qué está haciendo la sala en este momento de la clase.
 *
 * La secuencia decía muy bien QUÉ se enseña y no decía nunca QUÉ PASA: si el
 * curso está sentado escuchando, si copia, si trabaja en parejas. Un profesor
 * no puede ejecutar una clase que solo describe contenido, y menos con cuatro
 * cursos a la vez.
 */
function QueHaceLaSala({ texto }: { texto?: string }) {
  const { t } = useTranslation();
  if (!texto?.trim()) return null;
  return (
    <p className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-slate-700">
      <span className="font-semibold text-slate-900">{t("preparar.whatTheyDo")}</span>{" "}
      {texto}
    </p>
  );
}

type Props = {
  secuencia: Secuencia;
  /** Lo que hay que revisar antes de llevarla al aula. */
  problemas?: string[];
  /** Los códigos pedidos, cuando son más de uno (sala multigrado). */
  codigos?: string[];
  /** Si la redactó un modelo. Una ruta revisada a mano no lo es. */
  porModelo?: boolean;
};

export default function VistaSecuencia({
  secuencia: s,
  problemas = [],
  codigos,
  porModelo = true,
}: Props) {
  const { t } = useTranslation();
  const [etapaActiva, setEtapaActiva] = useState(1);
  // Saltar del riel a una etapa lejana también tiene sentido: hacia adelante
  // si el número sube, hacia atrás si baja.
  const [sentido, setSentido] = useState<1 | -1>(1);

  function irA(numero: number) {
    setSentido(numero >= etapaActiva ? 1 : -1);
    setEtapaActiva(numero);
  }

  // Los tres momentos nuevos —el desacuerdo, la vuelta y la crítica— solo los
  // traen las rutas escritas: una secuencia generada antes de que existieran
  // no los tiene, y entonces el riel se lee como se leía antes. Por eso los
  // números no están fijos en el código, se reparten según lo que haya.
  const desacuerdo = s.desacuerdo;
  const vuelta = s.vuelta_del_terreno;
  const critica = s.borrador_y_critica;

  let n = 0;
  const nDesacuerdo = desacuerdo ? ++n : 0;
  const nExplicar = ++n;
  const nEjemplo = ++n;
  const nGuiada = ++n;
  const nAutonoma = ++n;
  const red = s.red_comunitaria;
  const transferencia = s.transferencia;
  // Si ninguna tarea pide unidad, encabezar esa columna con «Unidad» y
  // llenarla de rayas es decirle al docente que la salida le quedó coja. No
  // le quedó coja: es que no toda salida es una toma de datos.
  const hayUnidades = (s.salida_terreno?.protocolo ?? []).some((c) => c.unidad);

  const nRed = red ? ++n : 0;
  const nTerreno = ++n;
  const nVuelta = vuelta ? ++n : 0;
  const nCritica = critica ? ++n : 0;
  const nRepaso = ++n;
  const nTransfer = transferencia ? n + 1 : 0;

  // El riel muestra cuántas piezas trae cada etapa, para que el docente juzgue
  // el conjunto antes de leerlo entero.
  const etapas: ResumenEtapa[] = [
    ...(desacuerdo
      ? [{ numero: nDesacuerdo, momento: t("preparar.stages.class1"), titulo: t("preparar.stages.split") }]
      : []),
    { numero: nExplicar, momento: t("preparar.stages.class1"), titulo: t("preparar.stages.explain"),
      unidad: "points", piezas: s.instruccion_explicita?.notas_para_el_docente?.length },
    { numero: nEjemplo, momento: t("preparar.stages.class1"), titulo: t("preparar.stages.example"),
      unidad: "steps", piezas: s.ejemplo_resuelto?.pasos?.length },
    { numero: nGuiada, momento: t("preparar.stages.class2"), titulo: t("preparar.stages.guided"),
      unidad: "exercises", piezas: s.practica_guiada?.ejercicios?.length },
    { numero: nAutonoma, momento: t("preparar.stages.class2"), titulo: t("preparar.stages.independent"),
      unidad: "exercises", piezas: s.practica_autonoma?.ejercicios?.length },
    ...(red
      ? [{ numero: nRed, momento: t("preparar.stages.class3"), titulo: t("preparar.stages.network") }]
      : []),
    { numero: nTerreno, momento: t("preparar.stages.class3"), titulo: t("preparar.stages.field"),
      unidad: "measurements", piezas: s.salida_terreno?.protocolo?.length },
    ...(vuelta
      ? [{ numero: nVuelta, momento: t("preparar.stages.class4"), titulo: t("preparar.stages.back") }]
      : []),
    ...(critica
      ? [{ numero: nCritica, momento: t("preparar.stages.class5"), titulo: t("preparar.stages.draft") }]
      : []),
    { numero: nRepaso, momento: t("preparar.stages.reviewWeeks"), titulo: t("preparar.stages.review"),
      unidad: "questions", piezas: s.recuperacion_espaciada?.length },
    ...(transferencia
      ? [{ numero: nTransfer, momento: t("preparar.stages.reviewWeeks"), titulo: t("preparar.stages.transfer") }]
      : []),
  ];

  return (
      <article className="mt-8">
        <header className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-2xl font-semibold tracking-tight text-texto">
            {s.titulo}
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            {codigos?.length ? codigos.join(", ") : s.objetivo_codigo}
            <Procedencia tipo="dato" /> · {s.objetivo_descripcion}
          </p>
          {s.sintesis_docente && (
            <p className="mt-3 text-slate-700">
              {s.sintesis_docente}
              {porModelo ? <Procedencia tipo="generado" /> : null}
            </p>
          )}

          {s.procedencia && (
            <p className="mt-4 font-mono text-[11px] text-slate-500">
              {t("preparar.provenanceLine", {
                place: s.procedencia.de_datos.punto,
                commune: s.procedencia.de_datos.comuna,
                ecosystem: enPalabras(s.procedencia.de_datos.ecosistema ?? ""),
                model: s.procedencia.modelo,
              })}
            </p>
          )}

          <div className="mt-5 flex flex-wrap gap-3 print:hidden">
            <button
              type="button"
              onClick={() => window.print()}
              className="rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50"
            >
              {t("preparar.print")}
            </button>
          </div>
        </header>

        {/* Los problemas se muestran: el docente edita antes de usar. */}
        {problemas.length > 0 && (
          <div
            role="alert"
            className="rounded-2xl border border-amber-300 bg-amber-50 p-5 text-sm text-amber-900"
          >
            <p className="font-semibold">{t("preparar.issuesTitle")}</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {problemas.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </div>
        )}

        {s.requiere_consulta && (
          <div className="rounded-2xl border border-amber-300 bg-amber-50 p-5 text-sm text-amber-900">
            {t("preparar.consultationBody")}{" "}
            <strong>{t("preparar.consultationStrong")}</strong>{" "}
            {t("preparar.consultationTail")}
          </div>
        )}

        <div className="mt-6 grid gap-8 lg:grid-cols-[15rem_minmax(0,1fr)]">
          <RielEtapas etapas={etapas} activa={etapaActiva} onCambiar={irA} />

          <div className="min-w-0 space-y-4 print:space-y-0">
        {/* Lo primero de todo, y lo que cambia el sentido de lo que viene
            después: si la sala no se ha dividido por una pregunta que nadie
            puede ganar discutiendo, salir a medir es ejecutar el protocolo de
            otro para confirmar lo que el profesor ya dijo. */}
        {desacuerdo && (
          <EtapaSecuencia
            activa={etapaActiva === nDesacuerdo}
            sentido={sentido}
            titulo={t("preparar.stages.split")}
            subtitulo={t("preparar.stages.splitSubtitle")}
            actor="estudiantes"
            destacada
          >
            <p className="font-medium text-slate-900">{desacuerdo.sobre_que}</p>
            <p>
              <strong>{t("preparar.splitHow")}</strong> {desacuerdo.como_se_ve}
            </p>
            <p className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-700">
              <strong className="text-slate-900">{t("preparar.splitWho")}</strong>{" "}
              {desacuerdo.quien_lo_zanja}
            </p>
          </EtapaSecuencia>
        )}

        <EtapaSecuencia
          activa={etapaActiva === nExplicar}
            sentido={sentido}
          titulo={t("preparar.stages.explain")}
          subtitulo={
            s.instruccion_explicita?.duracion_min
              ? t("preparar.minutes", {
                  count: s.instruccion_explicita.duracion_min,
                })
              : undefined
          }
          actor="docente"
        >
          <QueHaceLaSala texto={s.instruccion_explicita?.que_hacen_los_estudiantes} />
          <ul className="list-disc space-y-1 pl-5">
            {(s.instruccion_explicita?.notas_para_el_docente ?? []).map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
          {(s.instruccion_explicita?.errores_frecuentes ?? []).length > 0 && (
            <p className="text-slate-600">
              <strong>{t("preparar.commonMistakes")}</strong>{" "}
              {s.instruccion_explicita?.errores_frecuentes?.join("; ")}
            </p>
          )}
          {/* Va al final de la etapa porque ese es su momento: se explicó, y
              antes de pasar a los ejercicios hay que saber con quién se
              cuenta. */}
          <Comprobar c={s.instruccion_explicita?.comprobacion} />
        </EtapaSecuencia>

        <EtapaSecuencia
          activa={etapaActiva === nEjemplo}
            sentido={sentido}
          titulo={t("preparar.stages.example")}
          subtitulo={s.ejemplo_resuelto?.situacion}
          actor="plataforma"
          destacada
        >
          <ol className="space-y-3">
            {(s.ejemplo_resuelto?.pasos ?? []).map((p) => (
              <li key={p.paso} className="rounded-xl bg-slate-50 p-3">
                <p className="font-medium text-slate-900">
                  {p.paso}. {p.accion}
                </p>
                <p className="mt-1 text-slate-600">
                  <em>{t("preparar.why")}</em> {p.razonamiento}
                </p>
                <p className="mt-1 text-slate-800">
                  <em>{t("preparar.result")}</em> {p.resultado}
                </p>
              </li>
            ))}
          </ol>
          {s.ejemplo_resuelto?.respuesta && (
            <p className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-emerald-900">
              {s.ejemplo_resuelto.respuesta}
            </p>
          )}
        </EtapaSecuencia>

        <EtapaSecuencia
          activa={etapaActiva === nGuiada}
            sentido={sentido}
          titulo={t("preparar.stages.guided")}
          actor="docente"
        >
          {/* `instrucciones_docente` decía lo mismo que `como_trabajan` y se
              pintaba dos veces, en el subtítulo y en el bloque. Se conserva
              solo como respaldo de las secuencias ya generadas. */}
          <QueHaceLaSala
            texto={
              s.practica_guiada?.como_trabajan ??
              s.practica_guiada?.instrucciones_docente
            }
          />
          <ol className="list-decimal space-y-2 pl-5">
            {(s.practica_guiada?.ejercicios ?? []).map((e, i) => (
              <li key={i}>
                {e.enunciado}
                {e.apoyo && (
                  <span className="block text-slate-500">
                    {t("preparar.support")} {e.apoyo}
                  </span>
                )}
              </li>
            ))}
          </ol>
          {s.por_nivel && <PorNivel bloques={s.por_nivel} campo="practica_guiada" />}
        </EtapaSecuencia>

        <EtapaSecuencia
          activa={etapaActiva === nAutonoma}
            sentido={sentido}
          titulo={t("preparar.stages.independent")}
          actor="estudiantes"
        >
          <QueHaceLaSala texto={s.practica_autonoma?.como_trabajan} />
          <ol className="list-decimal space-y-2 pl-5">
            {(s.practica_autonoma?.ejercicios ?? []).map((e, i) => (
              <li key={i}>{e.enunciado}</li>
            ))}
          </ol>
          {s.por_nivel && <PorNivel bloques={s.por_nivel} campo="practica_autonoma" />}
        </EtapaSecuencia>

        {/* Va antes de la salida y no después: las preguntas se preparan en
            la sala, y una visita sin preguntas preparadas termina en una
            charla de veinte minutos donde el invitado habla y el curso
            escucha. Quien investiga tiene que ser el estudiante. */}
        {red && (
          <EtapaSecuencia
            activa={etapaActiva === nRed}
            sentido={sentido}
            titulo={t("preparar.stages.network")}
            subtitulo={t("preparar.stages.networkSubtitle")}
            actor="estudiantes"
          >
            {red.actores.map((a) => (
              <div key={a.quien} className="rounded-xl border border-slate-200 p-3.5">
                <p className="font-medium text-slate-900">{a.quien}</p>
                <p className="mt-1.5 text-slate-600">
                  <strong className="text-slate-800">{t("preparar.netWhy")}</strong> {a.por_que}
                </p>
                <p className="mt-2.5 text-slate-800">
                  <strong>{t("preparar.netAsk")}</strong>
                </p>
                <ul className="mt-1 list-disc space-y-1 pl-5 text-slate-700">
                  {a.que_le_preguntan.map((q) => (
                    <li key={q}>{q}</li>
                  ))}
                </ul>
                <p className="mt-2.5 text-slate-600">
                  <strong className="text-slate-800">{t("preparar.netWho")}</strong>{" "}
                  {a.quien_pregunta}
                </p>
              </div>
            ))}
            {red.permisos.length > 0 && (
              <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-amber-900">
                <strong>{t("preparar.netPermits")}</strong> {red.permisos.join(" · ")}
              </p>
            )}
            <p className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-emerald-900">
              <strong>{t("preparar.netBack")}</strong> {red.devolucion}
            </p>
          </EtapaSecuencia>
        )}

        <EtapaSecuencia
          activa={etapaActiva === nTerreno}
            sentido={sentido}
          titulo={t("preparar.stages.field")}
          subtitulo={t("preparar.stages.fieldSubtitle")}
          actor="estudiantes"
          destacada
        >
          {(s.salida_terreno?.preparacion ?? []).length > 0 && (
            <p>
              <strong>{t("preparar.bring")}</strong>{" "}
              {s.salida_terreno?.preparacion?.join(", ")}
            </p>
          )}

          {/* Con varios cursos en una salida, lo que decide si es manejable
              no es el protocolo sino quién hace qué. Va antes de la tabla:
              es lo primero que el docente necesita resolver. */}
          {(s.por_nivel ?? []).some((b) => b.rol_en_terreno) && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                {t("preparar.whoDoesWhat")}
              </p>
              <ul className="mt-2 space-y-1.5 text-sm">
                {(s.por_nivel ?? [])
                  .filter((b) => b.rol_en_terreno)
                  .map((b) => (
                    <li key={`rol-${b.nivel}-${b.objetivo_codigo}`} className="flex gap-2">
                      <span className="mt-0.5 h-fit shrink-0 rounded bg-tinta-950 px-1.5 py-0.5 font-mono text-[10px] text-white">
                        {nivelCorto(b.nivel, t("preparar.gradeBadge"))}
                      </span>
                      <span className="text-slate-800">{b.rol_en_terreno}</span>
                    </li>
                  ))}
              </ul>
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[420px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 rotulo text-slate-500">
                  <th className="py-2 pr-3">{t("preparar.colWhat")}</th>
                  <th className="py-2 pr-3">{t("preparar.colHow")}</th>
                  {/* La columna se llamaba «Unidad» y antes de eso la del medio
                      se llamaba «Cómo se mide». Entre las dos daban por hecho
                      que salir es tomar datos, y las rutas salieron así. Ahora
                      la unidad solo aparece cuando de verdad hay algo que
                      medir, y la columna dice de qué clase de trabajo se
                      trata. */}
                  <th className="py-2">{hayUnidades ? t("preparar.colUnit") : t("preparar.colKind")}</th>
                </tr>
              </thead>
              <tbody>
                {(s.salida_terreno?.protocolo ?? []).map((c) => (
                  <tr key={c.campo} className="border-b border-slate-100 align-top">
                    {/* El nombre técnico queda en el title por si hay que
                        cruzar estos datos con los que quedan guardados. */}
                    <td className="py-2 pr-3 font-medium text-slate-900" title={c.campo}>
                      {/* El nombre derivado sale del identificador, que es
                          español siempre. Si el generador mandó etiqueta, se
                          prefiere: es la que está en el idioma del docente. */}
                      {c.etiqueta?.trim() || nombreLegible(c.campo, c.unidad)}
                    </td>
                    <td className="py-2 pr-3">{c.instruccion}</td>
                    <td className="py-2">
                      {c.unidad ? (
                        <span className="font-mono text-xs">{c.unidad}</span>
                      ) : c.registro ? (
                        <span
                          className={`whitespace-nowrap rounded-full border px-2 py-0.5 text-[11px] ${
                            c.registro === "dejar_hecho"
                              ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                              : "border-slate-200 bg-slate-50 text-slate-600"
                          }`}
                        >
                          {t(`preparar.kinds.${c.registro}`)}
                        </span>
                      ) : (
                        <span className="font-mono text-xs">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Sin esto la salida es llenar casillas al aire libre. La tabla de
              arriba dice qué se anota; esto dice qué queda de verdad en sus
              manos, y por eso va después: primero lo que está resuelto, y al
              final lo único que no. */}
          {s.salida_terreno?.lo_que_eligen && (
            <div className="rounded-xl border border-slate-300 bg-white p-4">
              <p className="rotulo text-slate-500">{t("preparar.chooseTitle")}</p>
              <p className="mt-1.5 font-medium text-slate-900">
                {s.salida_terreno.lo_que_eligen.que_eligen}
              </p>
              <p className="mt-2.5 text-slate-700">
                <strong className="text-slate-900">{t("preparar.chooseWhy")}</strong>{" "}
                {s.salida_terreno.lo_que_eligen.en_que_cambia}
              </p>
              <p className="mt-2.5 text-slate-700">
                <strong className="text-slate-900">{t("preparar.chooseDefend")}</strong>{" "}
                {s.salida_terreno.lo_que_eligen.como_lo_defienden}
              </p>
            </div>
          )}

          {(s.salida_terreno?.seguridad ?? []).length > 0 && (
            <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-amber-900">
              <strong>{t("preparar.safety")}</strong>{" "}
              {s.salida_terreno?.seguridad?.join(" · ")}
            </p>
          )}
        </EtapaSecuencia>

        {/* La clase de vuelta. Sin ella la salida queda como un paseo con
            planilla: los datos son del lugar, pero la idea con la que llegaron
            sigue en pie. Aquí la desmiente su propia medición, y la desmiente
            a casi todo el curso a la vez, que es lo que la hace soportable. */}
        {vuelta && (
          <EtapaSecuencia
            activa={etapaActiva === nVuelta}
            sentido={sentido}
            titulo={t("preparar.stages.back")}
            subtitulo={t("preparar.stages.backSubtitle")}
            actor="estudiantes"
            destacada
          >
            <QueHaceLaSala texto={vuelta.como_empieza} />
            <p>
              <strong>{t("preparar.backCompare")}</strong> {vuelta.que_comparan}
            </p>
            <p className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-700">
              <strong className="text-slate-900">{t("preparar.backOdd")}</strong>{" "}
              {vuelta.si_no_calza}
            </p>
            {vuelta.con_la_comunidad && (
              <p className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-emerald-900">
                <strong>{t("preparar.backCommunity")}</strong> {vuelta.con_la_comunidad}
              </p>
            )}
            {(s.por_nivel ?? []).length > 0 && (
              <p className="text-slate-500">{t("preparar.backLevels")}</p>
            )}
          </EtapaSecuencia>
        )}

        {/* Un trabajo que no se rehace no se aprende a hacer. Esta etapa
            faltaba entera: el producto salía en un solo borrador y se
            entregaba, cuando la distancia entre la primera versión y la
            segunda es la mitad de lo que el curso se lleva. */}
        {critica && (
          <EtapaSecuencia
            activa={etapaActiva === nCritica}
            sentido={sentido}
            titulo={t("preparar.stages.draft")}
            subtitulo={t("preparar.stages.draftSubtitle")}
            actor="estudiantes"
            destacada
          >
            <p>
              <strong>{t("preparar.draftFirst")}</strong> {critica.primera_version}
            </p>
            <p className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-700">
              <strong className="text-slate-900">{t("preparar.draftHow")}</strong>{" "}
              {critica.como_se_critica}
            </p>
            <p className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-emerald-900">
              <strong>{t("preparar.draftBetter")}</strong> {critica.que_mejora}
            </p>
          </EtapaSecuencia>
        )}

        <EtapaSecuencia
          activa={etapaActiva === nRepaso}
            sentido={sentido}
          titulo={t("preparar.stages.review")}
          subtitulo={t("preparar.stages.reviewSubtitle")}
          actor="estudiantes"
        >
          <ul className="space-y-2">
            {(s.recuperacion_espaciada ?? []).map((m) => (
              <li key={m.semanas_despues} className="rounded-xl bg-slate-50 p-3">
                <span className="rotulo text-slate-500">
                  {t("preparar.weeksLater", { count: m.semanas_despues })}
                </span>
                <p className="mt-1 text-slate-800">{m.pregunta}</p>
              </li>
            ))}
          </ul>
        </EtapaSecuencia>

        {/* La última y la que de verdad prueba algo. Un curso puede contestar
            todas las preguntas de repaso y seguir sin entender nada: se sabe
            su caso de memoria. Lo que separa saber el caso de entender la idea
            es poder usarla donde no se estuvo. */}
        {transferencia && (
          <EtapaSecuencia
            activa={etapaActiva === nTransfer}
            sentido={sentido}
            titulo={t("preparar.stages.transfer")}
            subtitulo={t("preparar.stages.transferSubtitle")}
            actor="estudiantes"
            destacada
          >
            <p className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-800">
              {transferencia.escenario_nuevo}
            </p>
            <p className="font-medium text-slate-900">
              <strong>{t("preparar.transferAsk")}</strong> {transferencia.que_se_les_pide}
            </p>
            <p className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-emerald-900">
              <strong>{t("preparar.transferOk")}</strong>{" "}
              {transferencia.que_muestra_que_lo_entendieron}
            </p>
            <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-amber-900">
              <strong>{t("preparar.transferNo")}</strong> {transferencia.que_no_cuenta}
            </p>
          </EtapaSecuencia>
        )}

            {/* Avance secuencial, para quien prefiere recorrerla en orden */}
            <div className="flex items-center justify-between gap-3 print:hidden">
              <button
                type="button"
                onClick={() => irA(Math.max(1, etapaActiva - 1))}
                disabled={etapaActiva === 1}
                className="rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-40"
              >
                {t("preparar.prev")}
              </button>
              <span className="font-mono text-xs text-slate-400">
                {t("preparar.stepOf", {
                  current: etapaActiva,
                  total: etapas.length,
                })}
              </span>
              <button
                type="button"
                onClick={() => irA(Math.min(etapas.length, etapaActiva + 1))}
                disabled={etapaActiva === etapas.length}
                className="rounded-full bg-tinta-950 px-5 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-40"
              >
                {t("preparar.next")}
              </button>
            </div>
          </div>
        </div>

        {porModelo ? (
          <p className="pt-6 text-sm text-slate-500">
            {t("preparar.footerBefore")} <Procedencia tipo="generado" />{" "}
            {t("preparar.footerAfter")}
          </p>
        ) : (
          <p className="pt-6 text-sm text-slate-500">{t("preparar.reviewedRoute")}</p>
        )}
      </article>
  );
}
