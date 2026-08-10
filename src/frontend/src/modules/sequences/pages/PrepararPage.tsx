/**
 * Preparar una unidad — pantalla del docente.
 *
 * La diferencia de fondo con la plataforma actual está en la puerta de
 * entrada: aquí se empieza por el objetivo de aprendizaje que toca esta
 * semana, y el lugar se elige para servirlo. En el mapa se empezaba al revés,
 * y esa inversión es la que arrastra al resto del diseño.
 *
 * La secuencia se muestra completa y editable mentalmente por el docente antes
 * de llevarla al aula: por eso los problemas de validación se enseñan en lugar
 * de ocultarse, y por eso la página se puede imprimir.
 */

import { useEffect, useMemo, useState } from "react";
import {
  generarSecuencia,
  leerObjetivos,
  leerPuntos,
} from "../../../shared/lib/catalogos";
import type {
  CurriculumObjective,
  POIFeature,
  RespuestaSecuencia,
  Secuencia,
} from "../../../types";
import EtapaSecuencia from "../components/EtapaSecuencia";
import RielEtapas, { type ResumenEtapa } from "../components/RielEtapas";
import {
  OBJETIVOS_DEMO,
  PUNTOS_DEMO,
  SECUENCIA_DEMO,
  esperar,
  modoDemo,
} from "../../../shared/lib/demo";

/** Distintivo que separa el dato real del texto generado por el modelo. */
function Procedencia({ tipo }: { tipo: "dato" | "generado" }) {
  const esDato = tipo === "dato";
  return (
    <span
      className={[
        "ml-2 rounded border px-1.5 py-0.5 align-middle font-mono text-[10px] uppercase tracking-wider",
        esDato
          ? "border-slate-300 bg-slate-50 text-slate-600"
          : "border-amber-300 bg-amber-50 text-amber-800",
      ].join(" ")}
      title={
        esDato
          ? "Proviene de los datos territoriales y del currículo"
          : "Lo redactó el modelo. Revísalo antes de llevarlo al aula"
      }
    >
      {esDato ? "dato" : "generado"}
    </span>
  );
}

export default function PrepararPage() {
  const [objetivos, setObjetivos] = useState<CurriculumObjective[]>([]);
  const [puntos, setPuntos] = useState<POIFeature[]>([]);
  const [cargandoCatalogos, setCargandoCatalogos] = useState(true);
  const [errorCatalogos, setErrorCatalogos] = useState<string | null>(null);

  const [objetivoCode, setObjetivoCode] = useState("");
  const [pointId, setPointId] = useState("");
  const [sesiones, setSesiones] = useState(4);
  const [notas, setNotas] = useState("");

  const [etapaActiva, setEtapaActiva] = useState(1);
  const [formAbierto, setFormAbierto] = useState(true);
  const [generando, setGenerando] = useState(false);
  const [resultado, setResultado] = useState<RespuestaSecuencia | null>(null);
  const [errorGeneracion, setErrorGeneracion] = useState<string | null>(null);

  useEffect(() => {
    let vigente = true;
    (async () => {
      try {
        if (modoDemo()) {
          if (!vigente) return;
          setObjetivos(OBJETIVOS_DEMO);
          setPuntos(PUNTOS_DEMO);
          return;
        }
        // Directo a Supabase: estas tablas tienen lectura pública y no
        // necesitan la API intermedia.
        const [oas, puntos] = await Promise.all([leerObjetivos(), leerPuntos()]);
        if (!vigente) return;
        setObjetivos(oas);
        setPuntos(puntos);
      } catch (err: unknown) {
        if (!vigente) return;
        // Sin VITE_API_URL las rutas quedan relativas y esto falla en silencio
        // en producción. Se nombra el motivo probable en vez de dejar la
        // pantalla vacía.
        setErrorCatalogos(
          err instanceof Error ? err.message : "No se pudo cargar el catálogo"
        );
      } finally {
        if (vigente) setCargandoCatalogos(false);
      }
    })();
    return () => {
      vigente = false;
    };
  }, []);

  const objetivoElegido = useMemo(
    () => objetivos.find((o) => o.code === objetivoCode),
    [objetivos, objetivoCode]
  );

  const listo = Boolean(objetivoCode && pointId) && !generando;

  async function handleGenerar() {
    if (!listo) return;
    setGenerando(true);
    setErrorGeneracion(null);
    setResultado(null);
    try {
      if (modoDemo()) {
        await esperar(900); // la generación real tampoco es instantánea
        setResultado(SECUENCIA_DEMO);
        setFormAbierto(false);
        setEtapaActiva(1);
        return;
      }
      const r = await generarSecuencia({
        objectiveCode: objetivoCode,
        pointId,
        sesiones,
        notasDocente: notas,
      });
      setResultado(r);
      setFormAbierto(false);
      setEtapaActiva(1);
    } catch (err: unknown) {
      setErrorGeneracion(
        err instanceof Error ? err.message : "No se pudo generar la secuencia"
      );
    } finally {
      setGenerando(false);
    }
  }

  const s: Secuencia | undefined = resultado?.secuencia;

  // El riel muestra cuántas piezas trae cada etapa, para que el docente juzgue
  // el conjunto antes de leerlo entero.
  const etapas: ResumenEtapa[] = [
    { numero: 1, momento: "Clase 1", titulo: "Explicas tú", unidad: "puntos",
      piezas: s?.instruccion_explicita?.notas_para_el_docente?.length },
    { numero: 2, momento: "Clase 1", titulo: "Muestras este ejemplo", unidad: "pasos",
      piezas: s?.ejemplo_resuelto?.pasos?.length },
    { numero: 3, momento: "Clase 2", titulo: "Resuelven contigo", unidad: "ejercicios",
      piezas: s?.practica_guiada?.ejercicios?.length },
    { numero: 4, momento: "Clase 2", titulo: "Resuelven solos", unidad: "ejercicios",
      piezas: s?.practica_autonoma?.ejercicios?.length },
    { numero: 5, momento: "Clase 3", titulo: "Salen a medir", unidad: "mediciones",
      piezas: s?.salida_terreno?.protocolo?.length },
    { numero: 6, momento: "Semanas 1, 3 y 6", titulo: "Vuelves a preguntar", unidad: "preguntas",
      piezas: s?.recuperacion_espaciada?.length },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <header className="print:hidden">
        <p className="font-mono text-xs uppercase tracking-widest text-slate-500">
          Preparar una unidad
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
          Empieza por lo que tienes que enseñar
        </h1>
        <p className="mt-3 max-w-2xl text-slate-600">
          Elige el objetivo de aprendizaje y un lugar cercano a tu escuela. La
          secuencia llega con instrucción explícita, un ejemplo resuelto de ese lugar,
          práctica y salida a terreno — en ese orden.
        </p>
      </header>

      {modoDemo() && (
        <p className="mt-6 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <strong>Datos de demostración.</strong> No hay API detrás: los objetivos, los
          lugares y la secuencia son de ejemplo, para poder revisar la interfaz sin
          levantar el backend.
        </p>
      )}

      {/* Barra compacta: sustituye al formulario una vez hay resultado */}
      {resultado && !formAbierto && (
        <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm print:hidden">
          <span className="font-mono text-xs text-slate-500">{objetivoCode}</span>
          <span className="text-slate-300">·</span>
          <span className="text-slate-700">
            {puntos.find((p) => String(p.properties.id) === pointId)?.properties.name}
          </span>
          <span className="text-slate-300">·</span>
          <span className="text-slate-600">{sesiones} sesiones</span>
          <button
            type="button"
            onClick={() => setFormAbierto(true)}
            className="ml-auto rounded-full border border-slate-300 px-4 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            Cambiar
          </button>
        </div>
      )}

      {/* ── Formulario ── */}
      <div
        className={[
          "mt-8 space-y-5 rounded-2xl border border-slate-200 bg-white p-6 print:hidden",
          resultado && !formAbierto ? "hidden" : "",
        ].join(" ")}
      >
        {errorCatalogos && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          >
            <p className="font-semibold">No se pudo cargar el catálogo</p>
            <p className="mt-1">
              No se pudieron leer los objetivos de aprendizaje ni los lugares desde la
              base de datos.
            </p>
            {/* Salida inmediata: quien solo quiere ver la pantalla no debería
                quedarse ante un muro sin siguiente paso. */}
            <p className="mt-2.5">
              <a href="?demo=1" className="font-semibold underline underline-offset-2">
                Ver la pantalla con datos de ejemplo
              </a>
            </p>
            {/* El detalle técnico queda, pero en segundo plano: lo necesita quien
                mantiene el sitio, no quien va a dar la clase. */}
            <p className="mt-2.5 text-xs opacity-70">
              Detalle: {errorCatalogos}
            </p>
          </div>
        )}

        <div>
          <label
            htmlFor="objetivo"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Objetivo de aprendizaje
          </label>
          <select
            id="objetivo"
            value={objetivoCode}
            onChange={(e) => setObjetivoCode(e.target.value)}
            disabled={cargandoCatalogos}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400"
          >
            <option value="">
              {cargandoCatalogos ? "Cargando…" : "Elige un objetivo"}
            </option>
            {objetivos.map((o) => (
              <option key={o.code} value={o.code}>
                {o.code} · {o.description.slice(0, 90)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="lugar"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Lugar donde anclar la enseñanza
          </label>
          <select
            id="lugar"
            value={pointId}
            onChange={(e) => setPointId(e.target.value)}
            disabled={cargandoCatalogos}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400"
          >
            <option value="">
              {cargandoCatalogos ? "Cargando…" : "Elige un punto cercano"}
            </option>
            {puntos.map((p) => (
              <option key={String(p.properties.id)} value={String(p.properties.id)}>
                {p.properties.name} — {p.properties.commune}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="sesiones"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Sesiones disponibles
            </label>
            <input
              id="sesiones"
              type="number"
              min={2}
              max={12}
              value={sesiones}
              onChange={(e) => setSesiones(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400"
            />
          </div>
          <div>
            <label
              htmlFor="notas"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Notas (opcional)
            </label>
            <input
              id="notas"
              type="text"
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              placeholder="Aula multigrado 5º a 8º"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={handleGenerar}
          disabled={!listo}
          className="w-full rounded-full bg-[#111217] px-6 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg disabled:translate-y-0 disabled:opacity-60 disabled:shadow-none"
        >
          {generando ? "Preparando la secuencia…" : "Preparar secuencia"}
        </button>

        {errorGeneracion && (
          <p
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          >
            {errorGeneracion}
          </p>
        )}
      </div>

      {/* ── Secuencia ── */}
      {s && (
        <article className="mt-8">
          <header className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
              {s.titulo}
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              {objetivoElegido?.code ?? s.objetivo_codigo}
              <Procedencia tipo="dato" /> · {s.objetivo_descripcion}
            </p>
            {s.sintesis_docente && (
              <p className="mt-3 text-slate-700">
                {s.sintesis_docente}
                <Procedencia tipo="generado" />
              </p>
            )}

            {s.procedencia && (
              <p className="mt-4 font-mono text-[11px] text-slate-500">
                lugar: {s.procedencia.de_datos.punto} · {s.procedencia.de_datos.comuna} ·
                ecosistema: {s.procedencia.de_datos.ecosistema} · modelo:{" "}
                {s.procedencia.modelo}
              </p>
            )}

            <div className="mt-5 flex flex-wrap gap-3 print:hidden">
              <button
                type="button"
                onClick={() => window.print()}
                className="rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50"
              >
                Imprimir
              </button>
            </div>
          </header>

          {/* Los problemas se muestran: el docente edita antes de usar. */}
          {resultado && resultado.problemas.length > 0 && (
            <div
              role="alert"
              className="rounded-2xl border border-amber-300 bg-amber-50 p-5 text-sm text-amber-900"
            >
              <p className="font-semibold">
                Revisa esto antes de llevarla al aula
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                {resultado.problemas.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
          )}

          {s.requiere_consulta && (
            <div className="rounded-2xl border border-amber-300 bg-amber-50 p-5 text-sm text-amber-900">
              Esta secuencia incorpora elementos culturales mapuche.{" "}
              <strong>Requiere consulta previa a la comunidad</strong> antes de usarse.
            </div>
          )}

          <div className="mt-6 grid gap-8 lg:grid-cols-[15rem_minmax(0,1fr)]">
            <RielEtapas etapas={etapas} activa={etapaActiva} onCambiar={setEtapaActiva} />

            <div className="min-w-0 space-y-4 print:space-y-0">
          <EtapaSecuencia
            activa={etapaActiva === 1}
            titulo="Explicas tú"
            subtitulo={
              s.instruccion_explicita?.duracion_min
                ? `${s.instruccion_explicita.duracion_min} minutos`
                : undefined
            }
            actor="docente"
          >
            <ul className="list-disc space-y-1 pl-5">
              {(s.instruccion_explicita?.notas_para_el_docente ?? []).map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
            {(s.instruccion_explicita?.errores_frecuentes ?? []).length > 0 && (
              <p className="text-slate-600">
                <strong>Errores que conviene anticipar:</strong>{" "}
                {s.instruccion_explicita?.errores_frecuentes?.join("; ")}
              </p>
            )}
          </EtapaSecuencia>

          <EtapaSecuencia
            activa={etapaActiva === 2}
            titulo="Muestras este ejemplo"
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
                    <em>Por qué:</em> {p.razonamiento}
                  </p>
                  <p className="mt-1 text-slate-800">
                    <em>Resultado:</em> {p.resultado}
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
            activa={etapaActiva === 3}
            titulo="Resuelven contigo"
            subtitulo={s.practica_guiada?.instrucciones_docente}
            actor="docente"
          >
            <ol className="list-decimal space-y-2 pl-5">
              {(s.practica_guiada?.ejercicios ?? []).map((e, i) => (
                <li key={i}>
                  {e.enunciado}
                  {e.apoyo && (
                    <span className="block text-slate-500">Apoyo: {e.apoyo}</span>
                  )}
                </li>
              ))}
            </ol>
          </EtapaSecuencia>

          <EtapaSecuencia
            activa={etapaActiva === 4}
            titulo="Resuelven solos"
            actor="estudiantes"
          >
            <ol className="list-decimal space-y-2 pl-5">
              {(s.practica_autonoma?.ejercicios ?? []).map((e, i) => (
                <li key={i}>{e.enunciado}</li>
              ))}
            </ol>
          </EtapaSecuencia>

          <EtapaSecuencia
            activa={etapaActiva === 5}
            titulo="Salen a medir"
            subtitulo="Ya practicaron: llegan sabiendo qué mirar"
            actor="estudiantes"
            destacada
          >
            {(s.salida_terreno?.preparacion ?? []).length > 0 && (
              <p>
                <strong>Llevar:</strong> {s.salida_terreno?.preparacion?.join(", ")}
              </p>
            )}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[420px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 font-mono text-[11px] uppercase tracking-wider text-slate-500">
                    <th className="py-2 pr-3">Campo</th>
                    <th className="py-2 pr-3">Qué medir</th>
                    <th className="py-2">Unidad</th>
                  </tr>
                </thead>
                <tbody>
                  {(s.salida_terreno?.protocolo ?? []).map((c) => (
                    <tr key={c.campo} className="border-b border-slate-100 align-top">
                      <td className="py-2 pr-3 font-mono text-xs">{c.campo}</td>
                      <td className="py-2 pr-3">{c.instruccion}</td>
                      <td className="py-2 font-mono text-xs">{c.unidad ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {(s.salida_terreno?.seguridad ?? []).length > 0 && (
              <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-amber-900">
                <strong>Seguridad:</strong> {s.salida_terreno?.seguridad?.join(" · ")}
              </p>
            )}
          </EtapaSecuencia>

          <EtapaSecuencia
            activa={etapaActiva === 6}
            titulo="Vuelves a preguntar"
            subtitulo="Con lo que ellos mismos midieron en el estero"
            actor="estudiantes"
          >
            <ul className="space-y-2">
              {(s.recuperacion_espaciada ?? []).map((m) => (
                <li key={m.semanas_despues} className="rounded-xl bg-slate-50 p-3">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-slate-500">
                    {m.semanas_despues}{" "}
                    {m.semanas_despues === 1 ? "semana después" : "semanas después"}
                  </span>
                  <p className="mt-1 text-slate-800">{m.pregunta}</p>
                </li>
              ))}
            </ul>
          </EtapaSecuencia>

              {/* Avance secuencial, para quien prefiere recorrerla en orden */}
              <div className="flex items-center justify-between gap-3 print:hidden">
                <button
                  type="button"
                  onClick={() => setEtapaActiva((n) => Math.max(1, n - 1))}
                  disabled={etapaActiva === 1}
                  className="rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-40"
                >
                  Anterior
                </button>
                <span className="font-mono text-xs text-slate-400">
                  {etapaActiva} de {etapas.length}
                </span>
                <button
                  type="button"
                  onClick={() => setEtapaActiva((n) => Math.min(etapas.length, n + 1))}
                  disabled={etapaActiva === etapas.length}
                  className="rounded-full bg-[#111217] px-5 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-40"
                >
                  Siguiente
                </button>
              </div>
            </div>
          </div>

          <p className="pt-6 text-sm text-slate-500">
            Todo lo marcado como <Procedencia tipo="generado" /> lo redactó un modelo.
            Revísalo y edítalo: quien enseña eres tú.
          </p>
        </article>
      )}
    </div>
  );
}
