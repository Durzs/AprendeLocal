/**
 * Las pantallas del demo. Cada una recibe lo que necesita y avisa hacia
 * arriba; el estado vive en §CongresoPage.tsx.
 */

import { useMemo, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpenCheck,
  CalendarDays,
  Check,
  ClipboardCheck,
  FileSignature,
  FlaskConical,
  Leaf,
  LoaderCircle,
  Lock,
  MapPin,
  MapPinned,
  Mail,
  NotebookPen,
  Presentation,
  RotateCcw,
  Ruler,
  Sparkles,
  WifiOff,
} from "lucide-react";

import { useTx } from "../../shared/tx";
import { useContenido } from "../sequences/contenido";
import { buscarObjetivo } from "../sequences/contenido/curriculo";
import { angulosDe, type Angulo, type Problema } from "../sequences/metodo/problemas";
import { etapasEn } from "../sequences/metodo/etapas";
import { tecnicaPorId } from "../sequences/metodo/tecnicas";
import { COLOR_ETAPA, FRANJA_ODS, esStem, odsDe, type Ods } from "./ods";
import { RADIO_KM, grupoDe, respaldo, type Especie, type Lugar, type Resultado } from "./especies";
import { useSede } from "../../shared/sede";
import Qr from "./Qr";
import { HAY_SORTEO, type Respuesta } from "./ruta";

/* ── Piezas comunes ──────────────────────────────────────────────────────── */

export function FranjaOds({ alto = "h-2" }: { alto?: string }) {
  return (
    <div className={`flex w-full ${alto}`} aria-hidden>
      {FRANJA_ODS.map((c) => (
        <span key={c} className="flex-1" style={{ background: c }} />
      ))}
    </div>
  );
}

export function ChipOds({ o, chico = false }: { o: Ods; chico?: boolean }) {
  const tx = useTx();
  return (
    <span
      className={`inline-flex items-baseline gap-1.5 font-semibold ${chico ? "rounded-full px-2.5 py-1 text-xs" : "rounded-2xl px-3 py-1.5 text-sm"}`}
      style={{ background: o.color, color: o.claro ? "#1a1a1a" : "#ffffff" }}
      title={tx.de(o.nombre)}
    >
      <span className="cifra shrink-0 whitespace-nowrap font-bold">ODS {o.n}</span>
      {!chico && <span className="font-medium">{tx.de(o.nombre)}</span>}
    </span>
  );
}

function Encabezado({ rotulo, titulo, bajada }: { rotulo: string; titulo: ReactNode; bajada?: ReactNode }) {
  return (
    <header className="max-w-3xl">
      <p className="rotulo text-[#3b29ae]">{rotulo}</p>
      <h1 className="display mt-3 text-4xl text-[#111217] sm:text-5xl [text-wrap:balance]">{titulo}</h1>
      {bajada && <p className="mt-4 text-lg leading-relaxed text-slate-600">{bajada}</p>}
    </header>
  );
}

export function BotonPrincipal({
  children,
  onClick,
  disabled,
  type = "button",
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-[#0a0047] px-8 text-lg font-bold text-white shadow-lg shadow-[#0a0047]/25 transition hover:-translate-y-0.5 hover:bg-[#201372] focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-[#FD6925] disabled:translate-y-0 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
    >
      {children}
    </button>
  );
}

/* ── 0 · La portada ──────────────────────────────────────────────────────── */

export function Portada({ onEmpezar, kiosco }: { onEmpezar: () => void; kiosco: boolean }) {
  const tx = useTx();
  const pilares = [
    {
      sigla: tx("ABP", "ABP"),
      nombre: tx("Aprendizaje Basado en Proyectos", "Aprendizagem Baseada em Projetos"),
      texto: tx(
        "Seis etapas: de una noticia real a una propuesta que el curso presenta a su comunidad.",
        "Seis etapas: de uma notícia real a uma proposta que a turma apresenta para a comunidade."
      ),
      fondo: "#FD6925",
      claro: true,
      Icono: Sparkles,
    },
    {
      sigla: "STEM",
      nombre: tx("Ciencias, tecnología y matemática", "Ciências, tecnologia e matemática"),
      texto: tx(
        "El curso mide, registra y analiza datos propios. Nada sale del libro.",
        "A turma mede, registra e analisa dados próprios. Nada sai do livro."
      ),
      fondo: "#26BDE2",
      claro: true,
      Icono: FlaskConical,
    },
    {
      sigla: "iNaturalist",
      nombre: tx("Ciencia ciudadana", "Ciência cidadã"),
      texto: tx(
        "Lo que de verdad vive cerca de la escuela, registrado por la comunidad.",
        "O que de fato vive perto da escola, registrado pela comunidade."
      ),
      fondo: "#56C02B",
      claro: true,
      Icono: Leaf,
    },
  ];
  return (
    <div className="flex flex-col gap-10">
      <div className="grid items-center gap-10 lg:grid-cols-[1.25fr_1fr]">
        <div>
        <div className="flex flex-wrap items-center gap-2">
          <ChipOds o={{ n: 4, color: "#C5192D", claro: false, nombre: { es: "Educación de calidad", pt: "Educação de qualidade" } }} />
          <span className="rotulo text-slate-500">
            {tx("Meta 4.7 · Educación para el desarrollo sostenible", "Meta 4.7 · Educação para o desenvolvimento sustentável")}
          </span>
        </div>
        <h1 className="display mt-6 text-5xl text-[#111217] sm:text-6xl xl:text-7xl [text-wrap:balance]">
          {tx("Arma un proyecto con tu territorio en ", "Monte um projeto com o seu território em ")}
          <span className="relative whitespace-nowrap text-[#DD1367]">{tx("2 minutos", "2 minutos")}</span>
        </h1>
        <p className="mt-6 max-w-2xl text-xl leading-relaxed text-slate-600">
          {tx(
            "Elige un problema real de tu zona, súmale ciencias y matemática, mira qué especies viven ahí según iNaturalist y llévate la ruta completa de tu proyecto.",
            "Escolha um problema real da sua região, some ciências e matemática, veja quais espécies vivem ali segundo o iNaturalist e leve a rota completa do seu projeto."
          )}
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <span className={kiosco ? "motion-safe:animate-[latido_2.4s_ease-in-out_infinite] inline-block" : ""}>
            <BotonPrincipal onClick={onEmpezar}>
              {tx("Empezar", "Começar")} <ArrowRight className="h-5 w-5" aria-hidden />
            </BotonPrincipal>
          </span>
          <p className="max-w-xs text-slate-500">
            {HAY_SORTEO
              ? tx(
                  "Cuatro pasos, sin cuenta. Al final te llevas un número para el sorteo del cierre.",
                  "Quatro passos, sem conta. No final você leva um número para o sorteio do encerramento."
                )
              : tx("Cuatro pasos. Sin cuenta.", "Quatro passos. Sem conta.")}
          </p>
        </div>
      </div>
        <Mosaico />
      </div>

      <ul className="grid gap-4 md:grid-cols-3">
        {pilares.map(({ sigla, nombre, texto, fondo, claro, Icono }) => (
          <li
            key={sigla}
            className="rounded-3xl p-6"
            style={{ background: fondo, color: claro ? "#111217" : "#ffffff" }}
          >
            <Icono className="h-8 w-8" aria-hidden />
            <p className="mt-4 text-3xl font-bold tracking-tight">{sigla}</p>
            <p className="mt-1 font-semibold">{nombre}</p>
            <p className="mt-3 leading-relaxed opacity-90">{texto}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Seis especies nativas de la edición, para que la portada tenga color desde
 * el primer vistazo. Son las mismas de la portada del sitio, con foto de
 * iNaturalist; sin red, queda el color de su grupo con el nombre.
 */
function Mosaico() {
  const tx = useTx();
  const sede = useSede();
  const especies = respaldo(sede).especies.filter((e) => e.foto).slice(0, 6);
  return (
    <figure className="hidden lg:block">
      <ul className="grid grid-cols-3 gap-3">
        {especies.map((e) => (
          <li
            key={e.cientifico}
            className="relative aspect-square overflow-hidden rounded-3xl"
            style={{ background: grupoDe(e.grupo).color }}
          >
            <img
              src={e.foto}
              alt={e.comun}
              loading="lazy"
              onError={(ev) => (ev.currentTarget.style.visibility = "hidden")}
              className="h-full w-full object-cover"
            />
            <span className="absolute inset-x-2 bottom-2 truncate rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-[#111217] first-letter:uppercase">
              {e.comun.split(",")[0]}
            </span>
          </li>
        ))}
      </ul>
      <figcaption className="mt-3 text-sm text-slate-500">
        {tx("Especies nativas, con fotos de la comunidad de iNaturalist.", "Espécies nativas, com fotos da comunidade do iNaturalist.")}
      </figcaption>
    </figure>
  );
}

/* ── 1 · La problemática ─────────────────────────────────────────────────── */

export function PasoProblema({
  elegido,
  onElegir,
}: {
  elegido: string | null;
  onElegir: (id: string) => void;
}) {
  const tx = useTx();
  const c = useContenido();
  return (
    <div className="flex flex-col gap-8">
      <Encabezado
        rotulo={tx("Paso 1 de 4 · La problemática", "Passo 1 de 4 · A problemática")}
        titulo={tx("¿Qué está pasando cerca de tu escuela?", "O que está acontecendo perto da sua escola?")}
        bajada={tx(
          "Son problemas reales, cada uno con noticias que leímos y verificamos. El proyecto parte de aquí.",
          "São problemas reais, cada um com notícias que lemos e verificamos. O projeto parte daqui."
        )}
      />
      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {c.problemas.map((p) => {
          const ods = odsDe(p.id);
          const color = ods[0]?.color ?? "#0a0047";
          const activo = elegido === p.id;
          const familia = c.familias.find((f) => f.id === p.familia);
          return (
            <li key={p.id}>
              <button
                type="button"
                onClick={() => onElegir(p.id)}
                aria-pressed={activo}
                className="group relative flex h-full w-full flex-col overflow-hidden rounded-3xl border-2 bg-white text-left transition hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-[#0a0047]"
                style={{ borderColor: activo ? color : "#e2e8f0", boxShadow: activo ? `0 0 0 4px ${color}33` : undefined }}
              >
                <span className="block h-3 w-full" style={{ background: color }} aria-hidden />
                <span className="flex flex-1 flex-col gap-3 p-5">
                  <span className="flex flex-wrap gap-1.5">
                    {ods.map((o) => (
                      <ChipOds key={o.n} o={o} chico />
                    ))}
                  </span>
                  {familia && <span className="rotulo text-slate-500">{familia.nombre}</span>}
                  <span className="titulo text-xl text-[#111217]">{p.nombre}</span>
                  <span className="line-clamp-3 text-slate-600">{p.queEs}</span>
                </span>
                {activo && (
                  <span
                    className="absolute right-4 top-6 grid h-9 w-9 place-items-center rounded-full"
                    style={{ background: color, color: ods[0]?.claro ? "#111217" : "#fff" }}
                  >
                    <Check className="h-5 w-5" aria-hidden />
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/** La noticia que abre la primera clase, para la barra de abajo. */
export function Noticia({ p }: { p: Problema }) {
  const tx = useTx();
  const n = p.respaldo[0];
  if (!n) return null;
  return (
    <p className="text-sm leading-snug text-slate-700 sm:text-base">
      <span className="font-semibold text-[#111217]">{tx("Salió en la prensa: ", "Saiu na imprensa: ")}</span>«{n.titular}»{" "}
      <span className="text-slate-500">
        ({n.medio}
        {n.fecha ? `, ${n.fecha}` : ""})
      </span>
    </p>
  );
}

/* ── 2 · Las asignaturas ─────────────────────────────────────────────────── */

/** Un ángulo por asignatura: el primero que trae el catálogo. */
function primerosAngulos(p: Problema): Angulo[] {
  const vistos = new Set<string>();
  return p.angulos.filter((a) => (vistos.has(a.asignatura) ? false : (vistos.add(a.asignatura), true)));
}

/** Agrupa sin `Object.groupBy`, que las tablets de hace unos años no tienen. */
function porAsignatura<T extends { nombreAsignatura: string }>(lista: T[]): [string, T[]][] {
  const m = new Map<string, T[]>();
  for (const o of lista) m.set(o.nombreAsignatura, [...(m.get(o.nombreAsignatura) ?? []), o]);
  return [...m];
}

/** Los objetivos que abre la ruta, sin repetir y solo los que existen. */
function useObjetivosDe(p: Problema | undefined, asignaturas: string[]) {
  const c = useContenido();
  return useMemo(() => {
    if (!p || !asignaturas.length) return [];
    const codigos = new Set(angulosDe(p, asignaturas).flatMap((a) => a.oaQueAbre));
    // Se lee `c.objetivos` para que esto se recalcule cuando llegue el currículum.
    return c.objetivos.length ? [...codigos].map(buscarObjetivo).filter((o) => o !== undefined) : [];
  }, [p, asignaturas, c.objetivos]);
}

export function PasoAsignaturas({
  p,
  elegidas,
  onCambiar,
}: {
  p: Problema;
  elegidas: string[];
  onCambiar: (a: string[]) => void;
}) {
  const tx = useTx();
  const c = useContenido();
  const angulos = primerosAngulos(p);
  const objetivos = useObjetivosDe(p, elegidas);
  const stem = elegidas.filter(esStem).length;
  const MAX = 3;

  const alternar = (id: string) => {
    if (elegidas.includes(id)) onCambiar(elegidas.filter((x) => x !== id));
    else if (elegidas.length < MAX) onCambiar([...elegidas, id]);
  };

  const nombre = (id: string) => c.asignaturas.find((a) => a.id === id)?.nombre ?? id;
  const tramo = `${c.cursos[0]} ${tx("a", "ao")} ${c.nombreCurso(c.cursos[c.cursos.length - 1])}`;

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
      <div className="flex flex-col gap-8">
        <Encabezado
          rotulo={tx("Paso 2 de 4 · Las asignaturas", "Passo 2 de 4 · Os componentes")}
          titulo={tx("¿Desde qué asignaturas lo miras?", "A partir de quais componentes você olha?")}
          bajada={tx(
            `Elige hasta ${MAX}. El mismo problema abre proyectos distintos según desde dónde se entre.`,
            `Escolha até ${MAX}. O mesmo problema abre projetos diferentes conforme por onde se entra.`
          )}
        />
        <ul className="grid gap-3 sm:grid-cols-2">
          {angulos.map((a) => {
            const activo = elegidas.includes(a.asignatura);
            const lleno = !activo && elegidas.length >= MAX;
            const esS = esStem(a.asignatura);
            return (
              <li key={a.asignatura}>
                <button
                  type="button"
                  onClick={() => alternar(a.asignatura)}
                  aria-pressed={activo}
                  disabled={lleno}
                  className={`flex h-full w-full flex-col gap-2 rounded-3xl border-2 p-5 text-left transition focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-[#0a0047] ${
                    activo
                      ? "border-[#3b29ae] bg-[#f3f2fc] shadow-md"
                      : lleno
                        ? "border-slate-100 bg-slate-50 opacity-60"
                        : "border-slate-200 bg-white hover:-translate-y-0.5 hover:shadow-lg"
                  }`}
                >
                  <span className="flex items-center justify-between gap-3">
                    <span className="titulo text-xl text-[#111217]">{nombre(a.asignatura)}</span>
                    <span className="flex items-center gap-2">
                      {esS && (
                        <span className="rounded-full bg-[#26BDE2] px-2.5 py-1 text-xs font-bold text-[#111217]">STEM</span>
                      )}
                      <span
                        className={`grid h-7 w-7 place-items-center rounded-full border-2 ${
                          activo ? "border-[#3b29ae] bg-[#3b29ae] text-white" : "border-slate-300"
                        }`}
                        aria-hidden
                      >
                        {activo && <Check className="h-4 w-4" />}
                      </span>
                    </span>
                  </span>
                  <span className="text-slate-600">{a.enfoque}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <aside className="h-fit rounded-3xl bg-[#0a0047] p-6 text-white lg:sticky lg:top-6" aria-live="polite">
        <p className="rotulo text-[#cfcaec]">{tx("Tu proyecto", "Seu projeto")}</p>
        <p className="mt-4 text-sm font-semibold text-[#cfcaec]">
          {tx("Disciplinas STEM", "Disciplinas STEM")}
        </p>
        <div className="mt-2 flex gap-2" aria-hidden>
          {Array.from({ length: MAX }, (_, i) => (
            <span
              key={i}
              className="h-4 flex-1 rounded-full transition-colors"
              style={{ background: i < stem ? "#26BDE2" : i < elegidas.length ? "#FD9D24" : "#ffffff26" }}
            />
          ))}
        </div>
        <p className="mt-2 text-lg font-semibold">
          {elegidas.length === 0
            ? tx("Elige una asignatura", "Escolha um componente")
            : elegidas.length === 1
              ? tx("Un proyecto de una asignatura", "Um projeto de um componente")
              : tx(`Interdisciplinario: ${elegidas.length} asignaturas`, `Interdisciplinar: ${elegidas.length} componentes`)}
          {stem > 0 && (
            <span className="block text-base font-normal text-[#cfcaec]">
              {tx(`${stem} de ellas STEM`, `${stem} delas STEM`)}
            </span>
          )}
        </p>

        <p className="mt-6 text-sm font-semibold text-[#cfcaec]">{c.palabras.Objetivos}</p>
        <p className="cifra mt-1 text-5xl font-bold">{objetivos.length}</p>
        <p className="text-sm text-[#cfcaec]">
          {tx(`de las ${c.palabras.fuente}, de ${tramo}`, `da ${c.palabras.fuente}, do ${tramo}`)}
        </p>
        {/* Por asignatura: «OA 14» de Ciencias y «OA 14» de Historia son dos
            objetivos distintos, y sueltos se leían como uno repetido. */}
        {objetivos.length > 0 && (
          <div className="mt-3 flex flex-col gap-3">
            {porAsignatura(objetivos).map(([asig, lista]) => (
              <div key={asig}>
                <p className="text-xs font-semibold text-[#cfcaec]">{asig}</p>
                <ul className="mt-1 flex flex-wrap gap-1.5">
                  {lista.slice(0, 8).map((o) => (
                    <li key={o.codigo} className="cifra rounded-md bg-white/10 px-2 py-1 text-xs" title={o.texto}>
                      {o.etiqueta}
                    </li>
                  ))}
                  {lista.length > 8 && <li className="px-1 py-1 text-xs text-[#cfcaec]">+{lista.length - 8}</li>}
                </ul>
              </div>
            ))}
          </div>
        )}
      </aside>
    </div>
  );
}

/* ── 3 · Lo que vive ahí ─────────────────────────────────────────────────── */

export type EstadoEspecies = { estado: "cargando" } | { estado: "listo"; r: Resultado } | null;

export function PasoEspecies({
  lugares,
  lugar,
  especies,
  onLugar,
  onAqui,
  onReintentar,
  ubicando,
  sinUbicacion,
  kiosco,
}: {
  lugares: Lugar[];
  lugar: Lugar | null;
  especies: EstadoEspecies;
  onLugar: (l: Lugar) => void;
  onAqui: () => void;
  onReintentar: () => void;
  ubicando: boolean;
  sinUbicacion: boolean;
  kiosco: boolean;
}) {
  const tx = useTx();
  const r = especies?.estado === "listo" ? especies.r : null;
  return (
    <div className="flex flex-col gap-8">
      <Encabezado
        rotulo={tx("Paso 3 de 4 · El lugar", "Passo 3 de 4 · O lugar")}
        titulo={tx("¿Qué vive ahí?", "O que vive ali?")}
        bajada={tx(
          `Lo que la comunidad de iNaturalist ya registró a ${RADIO_KM} km. Tu curso sale a buscarlo y puede sumar sus propias observaciones.`,
          `O que a comunidade do iNaturalist já registrou a ${RADIO_KM} km. A turma sai para procurar e pode somar as próprias observações.`
        )}
      />

      <div className="flex flex-wrap gap-2" role="group" aria-label={tx("Elegir el lugar", "Escolher o lugar")}>
        <button
          type="button"
          onClick={onAqui}
          aria-pressed={lugar?.id === "aqui"}
          className={`inline-flex min-h-12 items-center gap-2 rounded-full border-2 px-5 font-semibold transition ${
            lugar?.id === "aqui" ? "border-[#DD1367] bg-[#DD1367] text-white" : "border-[#DD1367] text-[#a50e4d] hover:bg-[#fdf0f5]"
          }`}
        >
          {ubicando ? <LoaderCircle className="h-5 w-5 animate-spin" aria-hidden /> : <MapPin className="h-5 w-5" aria-hidden />}
          {tx("Aquí, donde estoy", "Aqui, onde estou")}
        </button>
        {lugares.map((l) => (
          <button
            key={l.id}
            type="button"
            onClick={() => onLugar(l)}
            aria-pressed={lugar?.id === l.id}
            className={`min-h-12 rounded-full border-2 px-5 font-semibold transition ${
              lugar?.id === l.id ? "border-[#0a0047] bg-[#0a0047] text-white" : "border-slate-200 text-slate-700 hover:border-slate-400"
            }`}
          >
            {l.nombre}
          </button>
        ))}
      </div>
      {sinUbicacion && (
        <p className="-mt-4 text-sm text-slate-500">
          {tx(
            "No pudimos leer la ubicación de este equipo. Elige uno de los lugares de la lista.",
            "Não conseguimos ler a localização deste aparelho. Escolha um dos lugares da lista."
          )}
        </p>
      )}

      {especies?.estado === "cargando" && (
        <p className="flex items-center gap-3 text-lg text-slate-600">
          <LoaderCircle className="h-6 w-6 animate-spin text-[#56C02B]" aria-hidden />
          {tx("Consultando iNaturalist…", "Consultando o iNaturalist…")}
        </p>
      )}

      {r && (
        <section aria-live="polite" className="flex flex-col gap-4">
          {r.fuente === "inaturalist" ? (
            <p className="flex flex-wrap items-baseline gap-x-3">
              <span className="cifra text-5xl font-bold text-[#3F7E44]">{r.total.toLocaleString(tx("es-CL", "pt-BR"))}</span>
              <span className="text-lg text-slate-700">
                {tx(
                  `especies confirmadas por la comunidad a ${RADIO_KM} km ${lugar?.id === "aqui" ? "de aquí" : `de ${lugar?.nombre ?? ""}`}. Estas son las más observadas:`,
                  `espécies confirmadas pela comunidade a ${RADIO_KM} km ${lugar?.id === "aqui" ? "daqui" : `de ${lugar?.nombre ?? ""}`}. Estas são as mais observadas:`
                )}
              </span>
            </p>
          ) : (
            <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-amber-50 p-4 text-slate-700">
              <WifiOff className="h-5 w-5 shrink-0 text-amber-700" aria-hidden />
              <p className="min-w-0 flex-1 basis-64">
                {tx(
                  "Sin conexión con iNaturalist en este momento. Te mostramos especies nativas de la región que ya teníamos guardadas; con señal, aparece lo registrado en el lugar elegido.",
                  "Sem conexão com o iNaturalist agora. Mostramos espécies nativas da região que já tínhamos guardadas; com sinal, aparece o registrado no lugar escolhido."
                )}
              </p>
              <button
                type="button"
                onClick={onReintentar}
                className="inline-flex min-h-11 items-center gap-2 rounded-full border-2 border-amber-700 px-4 font-semibold text-amber-800 hover:bg-amber-100"
              >
                <RotateCcw className="h-4 w-4" aria-hidden /> {tx("Reintentar", "Tentar de novo")}
              </button>
            </div>
          )}
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {r.especies.map((e) => (
              <FichaEspecie key={e.cientifico} e={e} enlace={!kiosco} />
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function FichaEspecie({ e, enlace }: { e: Especie; enlace: boolean }) {
  const tx = useTx();
  const g = grupoDe(e.grupo);
  const [rota, setRota] = useState(false);
  const cuerpo = (
    <>
      <div className="relative aspect-square overflow-hidden rounded-2xl" style={{ background: g.color }}>
        {e.foto && !rota ? (
          <img
            src={e.foto}
            alt={e.comun || e.cientifico}
            loading="lazy"
            onError={() => setRota(true)}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <span className="grid h-full w-full place-items-center p-3 text-center text-lg font-semibold text-[#111217]/80">
            {e.comun || e.cientifico}
          </span>
        )}
        <span
          className="absolute left-2 top-2 rounded-full px-2.5 py-1 text-xs font-bold"
          style={{ background: g.color, color: "#111217" }}
        >
          {tx.de(g)}
        </span>
        {e.autoria && (
          <span className="absolute inset-x-0 bottom-0 truncate bg-black/55 px-2 py-1 text-[10px] text-white" title={e.autoria}>
            {e.autoria}
          </span>
        )}
      </div>
      <p className="mt-2 font-semibold leading-tight text-[#111217] first-letter:uppercase">{e.comun || e.cientifico}</p>
      <p className="text-sm italic text-slate-500">{e.cientifico}</p>
      {e.observaciones > 0 && (
        <p className="cifra text-xs text-slate-500">
          {e.observaciones.toLocaleString()} {tx("observaciones", "observações")}
        </p>
      )}
    </>
  );
  return (
    <li>
      {enlace ? (
        <a href={e.url} target="_blank" rel="noreferrer" className="group block">
          {cuerpo}
        </a>
      ) : (
        <div className="group">{cuerpo}</div>
      )}
    </li>
  );
}

/* ── 4 · La ruta ─────────────────────────────────────────────────────────── */

export function PasoRuta({
  p,
  asignaturas,
  lugar,
  especies,
}: {
  p: Problema;
  asignaturas: string[];
  lugar: Lugar | null;
  especies: Especie[];
}) {
  const tx = useTx();
  const c = useContenido();
  const ods = odsDe(p.id);
  const color = ods[0]?.color ?? "#0a0047";
  const angulos = angulosDe(p, asignaturas);
  const primeros = primerosAngulos({ ...p, angulos });
  const objetivos = useObjetivosDe(p, asignaturas);
  const conceptos = [...new Set(angulos.flatMap((a) => a.conceptosClave))].slice(0, 6);
  const tecnicas = [...new Set(angulos.flatMap((a) => a.tecnicas))]
    .map((id) => tecnicaPorId(id, tx.idioma)?.nombre)
    .filter(Boolean)
    .slice(0, 4);
  const nombre = (id: string) => c.asignaturas.find((a) => a.id === id)?.nombre ?? id;
  const nombresEspecies = especies.slice(0, 4).map((e) => e.comun || e.cientifico);
  const n = p.respaldo[0];
  const stem = asignaturas.filter(esStem).length;

  const detalle: Record<string, ReactNode> = {
    problematica: n ? (
      <>
        «{n.titular}» <span className="text-slate-500">({n.medio}{n.fecha ? `, ${n.fecha}` : ""})</span>
      </>
    ) : null,
    aula: (
      <>
        {conceptos.length > 0 && (
          <span className="flex flex-wrap gap-1.5">
            {conceptos.map((x) => (
              <span key={x} className="rounded-full bg-[#e6f7fc] px-2.5 py-1 text-sm text-[#0b5566]">
                {x}
              </span>
            ))}
          </span>
        )}
        {tecnicas.length > 0 && (
          <span className="mt-2 flex items-center gap-2 text-slate-600">
            <Ruler className="h-4 w-4 shrink-0" aria-hidden />
            {tx("Ensayan antes de salir: ", "Ensaiam antes de sair: ")}
            {tecnicas.join(", ")}
          </span>
        )}
      </>
    ),
    terreno: (
      <>
        {lugar && lugar.id !== "aqui" && <strong className="text-[#111217]">{lugar.nombre}. </strong>}
        {primeros[0]?.queInvestigan}
        {nombresEspecies.length > 0 && (
          <span className="mt-2 flex items-start gap-2 text-slate-600">
            <Leaf className="mt-0.5 h-4 w-4 shrink-0 text-[#3F7E44]" aria-hidden />
            <span>
              {tx("Buscan y registran en iNaturalist: ", "Procuram e registram no iNaturalist: ")}
              {nombresEspecies.join(", ")}.
            </span>
          </span>
        )}
      </>
    ),
    analisis: primeros[0]?.queSaleDeAqui,
  };

  return (
    <div className="flex flex-col gap-8">
      <section className="overflow-hidden rounded-[2rem] text-white" style={{ background: "#0a0047" }}>
        <span className="block h-3" style={{ background: color }} aria-hidden />
        <div className="flex flex-col gap-4 p-6 sm:p-8">
          <p className="rotulo text-[#cfcaec]">{tx("Paso 4 de 4 · Tu ruta", "Passo 4 de 4 · Sua rota")}</p>
          <h1 className="display text-4xl sm:text-5xl [text-wrap:balance]">{p.nombre}</h1>
          <div className="flex flex-wrap gap-2">
            {asignaturas.map((a) => (
              <span key={a} className="rounded-full bg-white/10 px-3 py-1.5 text-sm font-semibold">
                {nombre(a)}
                {esStem(a) && <span className="ml-1.5 text-[#26BDE2]">STEM</span>}
              </span>
            ))}
            {lugar && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-sm">
                <MapPin className="h-4 w-4" aria-hidden /> {lugar.nombre}
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {ods.map((o) => (
              <ChipOds key={o.n} o={o} />
            ))}
          </div>
        </div>
        <dl className="grid grid-cols-2 border-t border-white/10 sm:grid-cols-4">
          {[
            { valor: 6, rotulo: tx("etapas de proyecto", "etapas de projeto"), color: "#FD9D24" },
            { valor: stem, rotulo: tx("disciplinas STEM", "disciplinas STEM"), color: "#26BDE2" },
            { valor: objetivos.length, rotulo: c.palabras.objetivos, color: "#FCC30B" },
            { valor: especies.length, rotulo: tx("especies para buscar", "espécies para procurar"), color: "#56C02B" },
          ].map((x) => (
            <div key={x.rotulo} className="border-white/10 p-5 [&:not(:last-child)]:border-r">
              <dt className="sr-only">{x.rotulo}</dt>
              <dd>
                <span className="cifra block text-4xl font-bold" style={{ color: x.color }}>
                  {x.valor}
                </span>
                <span className="text-sm text-[#cfcaec]">{x.rotulo}</span>
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section>
        <h2 className="titulo text-2xl text-[#111217]">
          {tx("El proyecto, etapa por etapa", "O projeto, etapa por etapa")}
        </h2>
        <ol className="mt-5 flex flex-col gap-3">
          {etapasEn(tx.idioma).map((e, i) => {
            const col = COLOR_ETAPA[e.id] ?? { fondo: "#0a0047", claro: false };
            return (
              <li key={e.id} className="flex gap-4 rounded-3xl border border-slate-200 bg-white p-4 sm:p-5">
                <span
                  className="cifra grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-xl font-bold"
                  style={{ background: col.fondo, color: col.claro ? "#111217" : "#fff" }}
                  aria-hidden
                >
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="titulo text-lg text-[#111217]">{e.nombre}</h3>
                  <p className="text-slate-600">{e.enUnaLinea}</p>
                  {detalle[e.id] && <div className="mt-2 leading-relaxed text-slate-700">{detalle[e.id]}</div>}
                </div>
              </li>
            );
          })}
        </ol>
      </section>
    </div>
  );
}

/* ── 5 · Llevársela ──────────────────────────────────────────────────────── */

export type EstadoCorreo = { estado: "libre" } | { estado: "enviando" } | Respuesta;

export function PasoLlevar({
  enlace,
  kiosco,
  correo,
  onEnviar,
  onOtra,
  onCuaderno,
}: {
  enlace: string;
  kiosco: boolean;
  correo: EstadoCorreo;
  onEnviar: (correo: string, trampa: string) => void;
  onOtra: () => void;
  onCuaderno: () => void;
}) {
  const tx = useTx();
  const c = useContenido();
  const [direccion, setDireccion] = useState("");
  const [acepta, setAcepta] = useState(false);
  const [trampa, setTrampa] = useState("");

  const funciones = [
    { Icono: BookOpenCheck, titulo: c.palabras.Objetivos, texto: tx("Marcas los de tu curso y quedan en todos los papeles.", "Você marca os da sua turma e eles vão para todos os documentos.") },
    { Icono: ClipboardCheck, titulo: tx("Indicadores para evaluar", "Indicadores para avaliar"), texto: tx("Qué mirar en la sala para saber si se aprendió.", "O que observar na sala para saber se aprenderam.") },
    { Icono: Presentation, titulo: tx("Diapositivas de la primera clase", "Slides da primeira aula"), texto: tx("La problemática lista para proyectar.", "A problemática pronta para projetar.") },
    { Icono: MapPinned, titulo: tx("El mapa del lugar", "O mapa do lugar"), texto: tx("El punto de salida y lo que queda a pie.", "O ponto de saída e o que fica a pé.") },
    { Icono: Ruler, titulo: tx("Técnicas de terreno", "Técnicas de campo"), texto: tx("Cómo se ensayan en la sala antes de salir.", "Como ensaiar na sala antes de sair.") },
    {
      Icono: FileSignature,
      titulo: tx("Los papeles de la salida", "Os documentos da saída"),
      texto: c.papeles === "br"
        ? "A autorização dos responsáveis e o plano para a direção."
        : "La autorización de apoderados y el formulario para la Superintendencia.",
    },
    { Icono: NotebookPen, titulo: tx("Bitácora por etapas", "Diário por etapas"), texto: tx("El seguimiento, con un instrumento de evaluación en cada etapa.", "O acompanhamento, com um instrumento de avaliação em cada etapa.") },
    { Icono: CalendarDays, titulo: tx("Calendario de clases", "Calendário de aulas"), texto: tx("Cuántas clases y qué pasa en cada una.", "Quantas aulas e o que acontece em cada uma.") },
  ];

  const listo = correo.estado === "ok" || correo.estado === "fila";

  return (
    <div className="flex flex-col gap-10">
      <div className="grid gap-6 lg:grid-cols-[1fr_auto]">
        <section className="rounded-[2rem] bg-[#f3f2fc] p-6 sm:p-8">
          {correo.estado === "ok" ? (
            <div className="flex flex-col gap-3" aria-live="polite">
              <p className="rotulo text-[#3b29ae]">
                {HAY_SORTEO ? tx("Tu número para el sorteo", "Seu número para o sorteio") : tx("Tu ruta", "Sua rota")}
              </p>
              <p className="display text-7xl tabular-nums text-[#0a0047] sm:text-8xl">
                Nº {String(correo.numero).padStart(4, "0")}
              </p>
              {HAY_SORTEO && (
                <p className="max-w-xl text-xl font-semibold text-[#111217]">
                  {correo.repetido
                    ? tx(
                        "Este correo ya tenía número y lo conserva: es uno por persona.",
                        "Este e-mail já tinha número e ele continua o mesmo: é um por pessoa."
                      )
                    : tx(
                        "Con este número participas en el sorteo del cierre del congreso.",
                        "Com este número você participa do sorteio no encerramento do congresso."
                      )}
                </p>
              )}
              <p className="max-w-xl text-lg text-slate-700">
                {correo.enviado
                  ? tx(
                      `Te la mandamos a ${direccion}, con copia al equipo de AprendeLocal. Revisa también la carpeta de spam.`,
                      `Enviamos para ${direccion}, com cópia para a equipe da AprendeLocal. Confira também a caixa de spam.`
                    )
                  : tx(
                      "Tu número quedó registrado, pero el correo no salió ahora. El equipo te lo manda en cuanto pueda.",
                      "Seu número ficou registrado, mas o e-mail não saiu agora. A equipe envia assim que puder."
                    )}
              </p>
              <p className="text-slate-600">
                {tx("Sácale una foto a esta pantalla o anota el número.", "Tire uma foto desta tela ou anote o número.")}
              </p>
            </div>
          ) : correo.estado === "fila" ? (
            <div className="flex flex-col gap-3" aria-live="polite">
              <WifiOff className="h-10 w-10 text-[#FD6925]" aria-hidden />
              <p className="titulo text-2xl text-[#111217]">{tx("Sin señal en este momento", "Sem sinal neste momento")}</p>
              <p className="max-w-xl text-lg text-slate-700">
                {tx(
                  `Tu pedido quedó guardado en este equipo y sale apenas vuelva la conexión. El correo a ${direccion} llega con tu número${HAY_SORTEO ? " para el sorteo" : ""}.`,
                  `Seu pedido ficou guardado neste aparelho e sai assim que a conexão voltar. O e-mail para ${direccion} chega com o seu número${HAY_SORTEO ? " para o sorteio" : ""}.`
                )}
              </p>
            </div>
          ) : (
            <form
              className="flex flex-col gap-4"
              onSubmit={(ev) => {
                ev.preventDefault();
                if (acepta && direccion.trim()) onEnviar(direccion.trim(), trampa);
              }}
            >
              <Mail className="h-10 w-10 text-[#DD1367]" aria-hidden />
              <h1 className="display text-4xl text-[#111217] [text-wrap:balance]">
                {HAY_SORTEO
                  ? tx("Llévate tu ruta y participa en el sorteo", "Leve a sua rota e participe do sorteio")
                  : tx("Llévate tu ruta con su número", "Leve a sua rota com o número dela")}
              </h1>
              <p className="max-w-xl text-lg text-slate-600">
                {HAY_SORTEO
                  ? tx(
                      "Te mandamos la ruta por correo con tu número para el sorteo del cierre del congreso. Un número por persona.",
                      "Enviamos a rota por e-mail com o seu número para o sorteio no encerramento do congresso. Um número por pessoa."
                    )
                  : tx(
                      "Te la mandamos por correo, con las seis etapas y el enlace para seguir en tu cuenta.",
                      "Enviamos por e-mail, com as seis etapas e o link para continuar na sua conta."
                    )}
              </p>
              <label htmlFor="congreso-correo" className="font-semibold text-[#111217]">
                {tx("Tu correo", "Seu e-mail")}
              </label>
              <input
                id="congreso-correo"
                type="email"
                inputMode="email"
                autoComplete={kiosco ? "off" : "email"}
                required
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                placeholder={tx("nombre@escuela.cl", "nome@escola.com.br")}
                className="min-h-14 w-full max-w-md rounded-2xl border-2 border-slate-300 bg-white px-4 text-lg focus:border-[#3b29ae] focus:outline-none"
              />
              {/* Campo trampa: fuera de la vista y del tabulador. Una persona no lo ve. */}
              <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden>
                <label htmlFor="congreso-sitio">Sitio web</label>
                <input id="congreso-sitio" tabIndex={-1} autoComplete="off" value={trampa} onChange={(e) => setTrampa(e.target.value)} />
              </div>
              <label htmlFor="congreso-acepta" className="flex max-w-xl cursor-pointer items-start gap-3 text-slate-700">
                <input
                  id="congreso-acepta"
                  type="checkbox"
                  checked={acepta}
                  onChange={(e) => setAcepta(e.target.checked)}
                  className="mt-1 h-5 w-5 shrink-0 accent-[#3b29ae]"
                />
                <span>
                  {tx(
                    "Acepto que el correo vaya con copia al equipo de AprendeLocal y que me escriban por el sorteo y para contarme cómo sumarme. Puedo pedir que borren mi dirección cuando quiera.",
                    "Aceito que o e-mail vá com cópia para a equipe da AprendeLocal e que me escrevam sobre o sorteio e para contar como participar. Posso pedir que apaguem meu endereço quando quiser."
                  )}
                </span>
              </label>
              {correo.estado === "error" && (
                <p role="alert" className="font-semibold text-[#C5192D]">
                  {correo.motivo === "correo"
                    ? tx("Revisa el correo: parece que falta algo.", "Confira o e-mail: parece que falta algo.")
                    : correo.motivo === "limite"
                      ? tx("Ya enviamos varias rutas a este correo.", "Já enviamos várias rotas para este e-mail.")
                      : tx("No pudimos enviarla. Prueba otra vez en un momento.", "Não conseguimos enviar. Tente de novo em instantes.")}
                </p>
              )}
              <div>
                <BotonPrincipal type="submit" disabled={!acepta || !direccion.trim() || correo.estado === "enviando"}>
                  {correo.estado === "enviando" ? (
                    <LoaderCircle className="h-5 w-5 animate-spin" aria-hidden />
                  ) : (
                    <Mail className="h-5 w-5" aria-hidden />
                  )}
                  {HAY_SORTEO ? tx("Quiero mi número", "Quero meu número") : tx("Enviarme la ruta", "Enviar a rota")}
                </BotonPrincipal>
              </div>
            </form>
          )}
        </section>

        {/* En el teléfono no: ya está en el teléfono. */}
        <section
          className={`${kiosco ? "flex" : "hidden lg:flex"} flex-col items-center gap-3 rounded-[2rem] border-2 border-slate-200 p-6 text-center lg:w-72`}
        >
          <Qr
            texto={enlace}
            etiqueta={tx("Código QR para abrir esta ruta en el teléfono", "Código QR para abrir esta rota no celular")}
            className="h-52 w-52"
          />
          <p className="font-semibold text-[#111217]">
            {tx("Escanéala y sigue en tu teléfono", "Escaneie e continue no celular")}
          </p>
          <p className="text-sm text-slate-500">{tx("Sin cuenta, sin instalar nada.", "Sem conta, sem instalar nada.")}</p>
        </section>
      </div>

      <section>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="rotulo text-[#DD1367]">{tx("Con tu cuenta gratis", "Com a sua conta grátis")}</p>
            <h2 className="titulo mt-2 text-3xl text-[#111217] [text-wrap:balance]">
              {tx("Esto fue la primera página del cuaderno", "Esta foi a primeira página do caderno")}
            </h2>
          </div>
          {!kiosco && (
            <Link
              to="/cadastrar?origen=congreso"
              className="inline-flex min-h-14 items-center gap-2 rounded-full bg-[#f97316] px-8 text-lg font-bold text-white shadow-lg shadow-orange-500/25 transition hover:-translate-y-0.5 hover:bg-[#ea580c]"
            >
              {tx("Crear mi cuenta", "Criar minha conta")} <ArrowRight className="h-5 w-5" aria-hidden />
            </Link>
          )}
        </div>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {funciones.map(({ Icono, titulo, texto }, i) => {
            const tono = FRANJA_ODS[(i * 5) % FRANJA_ODS.length];
            return (
              <li key={titulo} className="relative rounded-3xl border border-slate-200 bg-white p-5">
                <span className="grid h-11 w-11 place-items-center rounded-2xl" style={{ background: `${tono}1f`, color: tono }}>
                  <Icono className="h-6 w-6" aria-hidden />
                </span>
                <Lock className="absolute right-4 top-4 h-4 w-4 text-slate-300" aria-label={tx("Con cuenta", "Com conta")} />
                <p className="mt-3 font-semibold text-[#111217]">{titulo}</p>
                <p className="mt-1 text-sm text-slate-600">{texto}</p>
              </li>
            );
          })}
        </ul>
      </section>

      <div className="flex flex-wrap gap-3">
        {!kiosco && (
          <button
            type="button"
            onClick={onCuaderno}
            className="inline-flex min-h-12 items-center gap-2 rounded-full border-2 border-[#0a0047] px-6 font-bold text-[#0a0047] transition hover:bg-[#f3f2fc]"
          >
            <NotebookPen className="h-5 w-5" aria-hidden /> {tx("Seguir en el cuaderno", "Continuar no caderno")}
          </button>
        )}
        <button
          type="button"
          onClick={onOtra}
          className={`inline-flex min-h-12 items-center gap-2 rounded-full px-6 font-bold transition ${
            listo && kiosco ? "bg-[#0a0047] text-white" : "border-2 border-slate-200 text-slate-700 hover:border-slate-400"
          }`}
        >
          <RotateCcw className="h-5 w-5" aria-hidden /> {tx("Armar otra ruta", "Montar outra rota")}
        </button>
      </div>
    </div>
  );
}
