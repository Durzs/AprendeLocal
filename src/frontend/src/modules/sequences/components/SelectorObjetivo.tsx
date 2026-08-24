/**
 * Elegir los objetivos que tocan esta semana.
 *
 * Antes eran 62 opciones en un desplegable plano, ordenadas por código. Un
 * docente no busca «OA02_CN_5»: busca lo que le toca en 6º, o busca «agua».
 * Así que se filtra por curso —que es como está organizado su horario— y se
 * busca por palabras.
 *
 * Cuando se entra por el lugar, además, la lista se ordena por lo que ese
 * lugar sostiene de verdad y lo dice: buscar por palabras exigía saber de
 * antemano de qué trataba el objetivo, que es justo lo que no sabe quien parte
 * del sitio al que puede llevar al curso.
 *
 * Y se eligen VARIOS. En un aula multigrado hay tres o cuatro cursos sentados
 * a la misma hora en la misma sala: obligar a elegir uno significaba repetir
 * todo el proceso una vez por curso y juntar después las secuencias a mano.
 * El aula de curso único no paga por esto: elegir uno solo se ve y funciona
 * igual que antes.
 */

import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import type { CurriculumObjective, POIFeature } from "../../../types";
import { ordenarObjetivosPorAfinidad, type Banda } from "../lib/afinidad";

const ESTILO: Record<Banda, { etiqueta: string; clave: string }> = {
  sirve: { etiqueta: "bg-emerald-600 text-white", clave: "preparar.bands.serves" },
  quizas: { etiqueta: "bg-slate-200 text-slate-700", clave: "preparar.bands.mayServe" },
  no_aporta: { etiqueta: "bg-slate-100 text-slate-500", clave: "preparar.bands.unrelated" },
};

/**
 * `6to_basico` → `6º` en español, `G6` en inglés.
 *
 * El dato viene con la forma de la base, no de la sala. La marca ordinal no se
 * puede fijar en el código porque no viaja: el inglés no escribe «6º», y sus
 * ordinales son irregulares —1st, 2nd, 3rd—, así que la forma la pone el
 * catálogo de idioma y aquí solo se extrae el número.
 */
export function nivelCorto(level: string, patron = "{{n}}º"): string {
  const n = /^(\d)/.exec(level.replace(/^(\d)(to|mo|vo|er|ro)?/, "$1"));
  return n ? patron.replace("{{n}}", n[1]) : level;
}

function normalizar(s: string): string {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

type Props = {
  objetivos: CurriculumObjective[];
  /** Un código por curso de la sala. */
  valores: string[];
  onCambiar: (codes: string[]) => void;
  cargando: boolean;
  /** Si se entró por el lugar, se ordena y se explica respecto de él. */
  lugar?: POIFeature;
  /** Tope del generador: más allá, la secuencia se corta por longitud. */
  maximo?: number;
};

export default function SelectorObjetivo({
  objetivos,
  valores,
  onCambiar,
  cargando,
  lugar,
  maximo = 5,
}: Props) {
  const { t } = useTranslation();
  const patronNivel = t("preparar.gradeBadge");
  const [busqueda, setBusqueda] = useState("");
  const [nivelesActivos, setNivelesActivos] = useState<string[]>([]);
  const [verTodos, setVerTodos] = useState(false);

  const niveles = useMemo(
    () => [...new Set(objetivos.map((o) => o.level))].sort(),
    [objetivos]
  );

  const elegidos = useMemo(
    () =>
      valores
        .map((c) => objetivos.find((o) => o.code === c))
        .filter((o): o is CurriculumObjective => Boolean(o)),
    [valores, objetivos]
  );

  const filtrados = useMemo(() => {
    const q = normalizar(busqueda).split(/\s+/).filter(Boolean);
    return objetivos.filter((o) => {
      if (nivelesActivos.length > 0 && !nivelesActivos.includes(o.level)) return false;
      if (q.length === 0) return true;
      const texto = normalizar(
        `${o.code} ${o.description} ${(o.keywords ?? []).join(" ")}`
      );
      return q.every((w) => texto.includes(w));
    });
  }, [objetivos, busqueda, nivelesActivos]);

  // Con lugar, el orden lo decide lo que ese lugar sostiene; sin él, se
  // conserva el orden del catálogo, que es el del programa de estudio.
  const puntuados = useMemo(
    () => (lugar ? ordenarObjetivosPorAfinidad(lugar, filtrados) : null),
    [lugar, filtrados]
  );

  const utiles = puntuados ? puntuados.filter((r) => r.afinidad.banda !== "no_aporta") : [];
  const resto = puntuados ? puntuados.filter((r) => r.afinidad.banda === "no_aporta") : [];

  const lleno = valores.length >= maximo;

  function alternar(code: string) {
    if (valores.includes(code)) {
      onCambiar(valores.filter((c) => c !== code));
      return;
    }
    if (lleno) return;
    onCambiar([...valores, code]);
  }

  function alternarNivel(n: string) {
    setNivelesActivos((prev) =>
      prev.includes(n) ? prev.filter((x) => x !== n) : [...prev, n]
    );
  }

  const cursosDistintos = new Set(elegidos.map((o) => o.level)).size;

  /** Fila de un objetivo, con o sin banda de afinidad. */
  function Fila({
    objetivo,
    banda,
    motivos,
  }: {
    objetivo: CurriculumObjective;
    banda?: Banda;
    motivos?: string[];
  }) {
    const marcado = valores.includes(objetivo.code);
    const bloqueado = !marcado && lleno;

    return (
      <li>
        <button
          type="button"
          onClick={() => alternar(objetivo.code)}
          disabled={bloqueado}
          aria-pressed={marcado}
          className={[
            "flex w-full items-start gap-3 px-4 py-2.5 text-left transition",
            marcado ? "bg-slate-100" : bloqueado ? "opacity-40" : "hover:bg-slate-50",
          ].join(" ")}
        >
          <span
            aria-hidden
            className={[
              "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border text-[10px] font-bold",
              marcado
                ? "border-slate-900 bg-slate-900 text-white"
                : "border-slate-300 bg-white text-transparent",
            ].join(" ")}
          >
            ✓
          </span>
          <span className="mt-0.5 shrink-0 rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-slate-600">
            {nivelCorto(objetivo.level, patronNivel)}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm text-slate-800">{objetivo.description}</span>
            {motivos && motivos.length > 0 && (
              <span className="mt-0.5 block text-xs text-slate-600">
                {t("preparar.objective.matchesOn", {
                  reasons: motivos.slice(0, 3).join(" · "),
                })}
              </span>
            )}
          </span>
          {banda && (
            <span
              className={`mt-0.5 shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${ESTILO[banda].etiqueta}`}
            >
              {t(ESTILO[banda].clave)}
            </span>
          )}
        </button>
      </li>
    );
  }

  return (
    <div>
      {/* Lo ya elegido, siempre visible: en multigrado el docente necesita ver
          de un vistazo que no se le quedó un curso fuera. */}
      {elegidos.length > 0 && (
        <ul className="mb-3 space-y-1.5">
          {elegidos.map((o) => (
            <li
              key={o.code}
              className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5"
            >
              <span className="mt-0.5 shrink-0 rounded bg-slate-900 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-white">
                {nivelCorto(o.level, patronNivel)}
              </span>
              <p className="min-w-0 flex-1 text-sm text-slate-800">{o.description}</p>
              <button
                type="button"
                onClick={() => alternar(o.code)}
                className="shrink-0 rounded-full border border-slate-300 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                {t("preparar.objective.remove")}
              </button>
            </li>
          ))}
        </ul>
      )}

      {cursosDistintos > 1 && (
        <p className="mb-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-xs text-emerald-900">
          <strong>{t("preparar.objective.multigradeTitle")}</strong>{" "}
          {t("preparar.objective.multigradeBody", { count: cursosDistintos })}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex flex-wrap gap-1.5">
          {niveles.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => alternarNivel(n)}
              aria-pressed={nivelesActivos.includes(n)}
              className={[
                "rounded-full border px-3 py-1 text-xs font-semibold transition",
                nivelesActivos.includes(n)
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-300 text-slate-600 hover:bg-slate-50",
              ].join(" ")}
            >
              {nivelCorto(n, patronNivel)}
            </button>
          ))}
        </div>
        <input
          type="search"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder={t("preparar.objective.searchPlaceholder")}
          disabled={cargando}
          className="min-w-0 flex-1 rounded-full border border-slate-200 px-4 py-1.5 text-sm outline-none focus:border-slate-400"
        />
      </div>

      {lleno && (
        <p className="mt-2 text-xs text-amber-800">
          {t("preparar.objective.maxReached", { max: maximo })}
        </p>
      )}

      {/* Ningún objetivo se ancla aquí. Decirlo evita que el docente recorra
          62 opciones buscando una que este lugar no puede sostener. */}
      {puntuados && !cargando && utiles.length === 0 && filtrados.length > 0 && (
        <div className="mt-3 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3.5 text-sm text-amber-900">
          <p className="font-semibold">{t("preparar.objective.noAnchorTitle")}</p>
          <p className="mt-1.5 leading-relaxed">
            {t("preparar.objective.noAnchorBody", { count: filtrados.length })}
          </p>
        </div>
      )}

      <ul className="mt-3 max-h-72 divide-y divide-slate-100 overflow-y-auto rounded-xl border border-slate-200">
        {cargando && <li className="px-4 py-3 text-sm text-slate-500">{t("preparar.objective.loading")}</li>}
        {!cargando && filtrados.length === 0 && (
          <li className="px-4 py-3 text-sm text-slate-500">
            {t("preparar.objective.noMatch")}
          </li>
        )}

        {!puntuados &&
          filtrados.map((o) => <Fila key={o.code} objetivo={o} />)}

        {puntuados &&
          (verTodos ? [...utiles, ...resto] : utiles).map(({ objetivo, afinidad }) => (
            <Fila
              key={objetivo.code}
              objetivo={objetivo}
              banda={afinidad.banda}
              motivos={afinidad.motivos}
            />
          ))}
      </ul>

      {puntuados && resto.length > 0 && (
        <button
          type="button"
          onClick={() => setVerTodos(!verTodos)}
          className="mt-2 text-xs font-semibold text-slate-500 underline underline-offset-2 hover:text-slate-800"
        >
          {verTodos
            ? t("preparar.objective.hideUnrelated")
            : t("preparar.objective.showUnrelated", { count: resto.length })}
        </button>
      )}

      <p className="mt-1.5 text-xs text-slate-400">
        {t("preparar.objective.counter", {
          shown: filtrados.length,
          total: objetivos.length,
        })}
        {valores.length > 0
          ? ` · ${t("preparar.objective.chosen", { count: valores.length })}`
          : ""}
      </p>
    </div>
  );
}
