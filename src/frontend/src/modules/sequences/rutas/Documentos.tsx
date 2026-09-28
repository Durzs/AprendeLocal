/**
 * Lo que el docente se lleva en papel.
 *
 * En una escuela rural el papel no es un respaldo del sitio web: es el sitio
 * donde ocurre la clase. En el estero no hay señal, los estudiantes no tienen
 * dispositivo, y la fotocopiadora es la tecnología que sí está y sí funciona.
 * Una plataforma que solo existe en pantalla deja al docente copiando a mano
 * lo que ya tenía escrito.
 *
 * Son cinco documentos y ninguno es la pantalla impresa:
 *
 *   1. El cuadernillo del docente, que ya sale de la vista de la secuencia.
 *   2. La hoja de terreno, UNA POR CURSO, con filas en blanco. Es la que va
 *      en el bolsillo junto al estero, y la que ninguna otra herramienta le
 *      da: dice qué mide este curso y deja dónde anotarlo.
 *   3. La guía del estudiante, una por curso, con espacio para trabajar.
 *   4. La carta a la familia. Sin firma no hay salida, y redactarla cada vez
 *      es media hora que nadie tiene.
 *   5. La hoja del producto: qué entregan, a quién, y con qué tiene que
 *      cumplir. Es lo que convierte el proyecto en algo con destinatario.
 *
 * Se imprimen los que el docente marque. Todo esto vive oculto en pantalla y
 * solo aparece en papel, para no llenar la página de cosas que nadie va a leer
 * en el navegador.
 */

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { cursoCorto, type Ruta } from "./catalogo";
import { fechaLegible, type AjustesEscuela, type AjustesRuta } from "./ajustes";
import type { Secuencia } from "../../../types";
import type { Guardado } from "./inaturalist";
import { nombreLegible } from "../lib/etiquetas";

/**
 * Quita el punto final de un campo que se va a incrustar en mitad de otra
 * frase. Sin esto la carta salía diciendo «...llegar caminando. y tomar
 * medidas ahí», que es la clase de detalle por el que una carta a las familias
 * deja de parecer escrita por una persona.
 */
function sinPuntoFinal(texto: string): string {
  return texto.trim().replace(/\.+$/, "");
}

/** Renglones en blanco para escribir a mano. Sin esto no es una hoja, es un texto. */
function Renglones({ cuantos }: { cuantos: number }) {
  return (
    <div className="mt-2 space-y-5">
      {Array.from({ length: cuantos }, (_, i) => (
        <div key={i} className="border-b border-slate-400" />
      ))}
    </div>
  );
}

function Hoja({
  titulo,
  subtitulo,
  membrete,
  children,
}: {
  titulo: string;
  subtitulo?: string;
  /** Escuela y docente, cuando el panel los tiene. */
  membrete?: string;
  children: React.ReactNode;
}) {
  return (
    // `break-after` obliga a que cada documento empiece en una hoja nueva: si
    // se mezclan, el docente no puede repartir uno por curso.
    <section className="hidden print:block print:break-after-page print:pt-6">
      <header className="border-b-2 border-slate-900 pb-2">
        {membrete && (
          <p className="text-[11px] uppercase tracking-widest text-slate-700">
            {membrete}
          </p>
        )}
        <h2 className="text-xl font-bold text-texto">{titulo}</h2>
        {subtitulo && <p className="text-sm text-slate-700">{subtitulo}</p>}
      </header>
      <div className="mt-4 text-sm leading-relaxed text-slate-900">{children}</div>
    </section>
  );
}

type Cual = "terreno" | "guia" | "familia" | "producto" | "especies";

export default function Documentos({
  ruta,
  secuencia,
  escuela,
  ajustes,
  naturaleza,
}: {
  ruta: Ruta;
  /** Ya recortada a los cursos que esta escuela tiene en la sala. */
  secuencia: Secuencia;
  escuela: AjustesEscuela;
  ajustes: AjustesRuta;
  /** La lista de iNaturalist, si el docente la consultó. */
  naturaleza: Guardado | null;
}) {
  const { t, i18n } = useTranslation();
  const [marcados, setMarcados] = useState<Record<Cual, boolean>>({
    terreno: true,
    guia: true,
    familia: true,
    producto: true,
    especies: true,
  });

  const opciones: { clave: Cual; etiqueta: string; ayuda: string }[] = [
    { clave: "terreno", etiqueta: t("rutas.docField"), ayuda: t("rutas.docFieldHelp") },
    { clave: "guia", etiqueta: t("rutas.docGuide"), ayuda: t("rutas.docGuideHelp") },
    { clave: "familia", etiqueta: t("rutas.docLetter"), ayuda: t("rutas.docLetterHelp") },
    { clave: "producto", etiqueta: t("rutas.docProduct"), ayuda: t("rutas.docProductHelp") },
    // Solo se ofrece si hay algo que imprimir: una casilla que no produce
    // nada es peor que no tener la casilla.
    ...(naturaleza
      ? [
          {
            clave: "especies" as Cual,
            etiqueta: t("rutas.docSpecies"),
            ayuda: t("rutas.docSpeciesHelp"),
          },
        ]
      : []),
  ];

  const protocolo = secuencia.salida_terreno?.protocolo ?? [];
  const porNivel = secuencia.por_nivel ?? [];

  const membrete = [escuela.escuela, escuela.docente].filter(Boolean).join(" · ");
  // El nombre propio del sitio, si el docente lo puso. Vacío significa que
  // todavía no lo dijo, y cada documento decide con qué lo sustituye: la hoja
  // de terreno con el título de la ruta, la carta con su descripción genérica.
  const lugarPropio = ajustes.lugar.trim();
  const destinatario = ajustes.destinatario.trim() || ruta.producto.paraQuien;
  const fecha = fechaLegible(ajustes.fechaSalida, i18n.resolvedLanguage ?? "es");

  return (
    <>
      <section className="mt-4 rounded-2xl border border-slate-200 bg-white p-6 print:hidden">
        <p className="rotulo text-slate-500">
          {t("rutas.printTitle")}
        </p>
        <p className="mt-1.5 text-sm text-slate-600">{t("rutas.printLead")}</p>

        <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
          {opciones.map((o, i) => (
            <li
              key={o.clave}
              className={`animar-asoma animar-asoma-${Math.min(i + 1, 4)}`}
            >
              <label className="flex cursor-pointer items-start gap-2.5 rounded-xl border border-slate-200 px-3.5 py-2.5 transition hover:border-slate-400 hover:bg-slate-50">
                <input
                  type="checkbox"
                  checked={marcados[o.clave]}
                  onChange={(e) =>
                    setMarcados((m) => ({ ...m, [o.clave]: e.target.checked }))
                  }
                  className="mt-0.5 h-4 w-4 shrink-0 accent-slate-900"
                />
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-slate-900">
                    {o.etiqueta}
                  </span>
                  <span className="block text-xs text-slate-500">{o.ayuda}</span>
                </span>
              </label>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={() => window.print()}
          className="mt-4 rounded-full bg-tinta-950 px-6 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg"
        >
          {t("rutas.printButton")}
        </button>
        <p className="mt-2 text-xs text-slate-500">{t("rutas.printNote")}</p>
      </section>

      {/* ── Hoja de terreno, una por curso ── */}
      {marcados.terreno &&
        porNivel.map((b) => (
          <Hoja
            key={`terreno-${b.nivel}`}
            titulo={`${t("rutas.docField")} · ${cursoCorto(b.nivel)}`}
            subtitulo={lugarPropio || ruta.titulo}
            membrete={membrete}
          >
            <p>
              <strong>{t("rutas.yourJob")}</strong> {b.rol_en_terreno}
            </p>

            <p className="mt-3">
              <strong>{t("rutas.bring")}</strong>{" "}
              {(secuencia.salida_terreno?.preparacion ?? []).join(", ")}
            </p>

            <table className="mt-4 w-full border-collapse text-left text-xs">
              <thead>
                <tr>
                  <th className="border border-slate-400 px-2 py-1.5 font-semibold">
                    {t("rutas.measurement")}
                  </th>
                  {[1, 2, 3].map((n) => (
                    <th
                      key={n}
                      className="border border-slate-400 px-2 py-1.5 text-center font-semibold"
                    >
                      {n}
                    </th>
                  ))}
                  <th className="border border-slate-400 px-2 py-1.5 text-center font-semibold">
                    {t("rutas.average")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {protocolo.map((c) => (
                  <tr key={c.campo}>
                    <td className="border border-slate-400 px-2 py-3 align-top">
                      <span className="font-semibold">
                        {c.etiqueta?.trim() || nombreLegible(c.campo, c.unidad)}
                      </span>
                      {c.unidad ? (
                        <span className="text-slate-600"> ({c.unidad})</span>
                      ) : null}
                      <span className="block text-[11px] font-normal text-slate-600">
                        {c.instruccion}
                      </span>
                    </td>
                    {[1, 2, 3, 4].map((n) => (
                      <td key={n} className="border border-slate-400 px-2 py-3" />
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Sobel: dibujar el sitio es parte de conocerlo, no un adorno para
                los que terminan antes. Por eso el recuadro tiene tamaño. */}
            <p className="mt-4 font-semibold">{t("rutas.drawThePlace")}</p>
            <div className="mt-1.5 h-40 border border-slate-400" />

            {ruta.mapuzugun?.length ? (
              <p className="mt-3 text-xs text-slate-700">
                <strong>{t("rutas.inMapuzugun")}:</strong>{" "}
                {ruta.mapuzugun.map((m) => `${m.termino} (${m.castellano})`).join(" · ")}
              </p>
            ) : null}

            <p className="mt-3 text-xs">
              <strong>{t("rutas.safety")}</strong>{" "}
              {(secuencia.salida_terreno?.seguridad ?? []).join(" · ")}
            </p>
          </Hoja>
        ))}

      {/* ── Guía del estudiante, una por curso ── */}
      {marcados.guia &&
        porNivel.map((b) => {
          // Los dos tipos se imprimen seguidos: en la hoja del estudiante no
          // hay razón para separar «los que hiciste conmigo» de «los que
          // hiciste solo». Solo el guiado trae apoyo, así que el tipo lo dice.
          const ejercicios: { enunciado: string; apoyo?: string }[] = [
            ...(b.practica_guiada?.ejercicios ?? []),
            ...(b.practica_autonoma?.ejercicios ?? []),
          ];
          return (
            <Hoja
              key={`guia-${b.nivel}`}
              titulo={`${t("rutas.docGuide")} · ${cursoCorto(b.nivel)}`}
              subtitulo={ruta.preguntaGuia}
              membrete={membrete}
            >
              <p className="text-xs text-slate-700">{b.objetivo_descripcion}</p>
              <ol className="mt-4 space-y-1">
                {ejercicios.map((e, i) => (
                  <li key={i}>
                    <p className="font-semibold">
                      {i + 1}. {e.enunciado}
                    </p>
                    {e.apoyo ? (
                      <p className="text-xs text-slate-600">{e.apoyo}</p>
                    ) : null}
                    <Renglones cuantos={3} />
                  </li>
                ))}
              </ol>
            </Hoja>
          );
        })}

      {/* ── Carta a la familia ── */}
      {marcados.familia && (
        <Hoja
          titulo={t("rutas.docLetter")}
          subtitulo={ruta.titulo}
          membrete={membrete}
        >
          <p>{t("rutas.letterGreeting")}</p>
          <p className="mt-3">
            {t("rutas.letterBody", {
              question: sinPuntoFinal(ruta.preguntaGuia),
              place: lugarPropio || sinPuntoFinal(ruta.lugar).toLowerCase(),
              weeks: ruta.semanas,
            })}
          </p>
          {/* Sin fecha la carta no sirve para pedir el permiso, así que si el
              docente la puso, va en su propia línea y no perdida en el párrafo. */}
          {fecha && (
            <p className="mt-3 font-semibold">{t("rutas.letterDate2", { date: fecha })}</p>
          )}
          <p className="mt-3">
            {t("rutas.letterDeliver", { to: sinPuntoFinal(destinatario) })}
          </p>
          <p className="mt-3">{t("rutas.letterSafety")}</p>
          <ul className="mt-1 list-disc pl-5 text-xs">
            {(secuencia.salida_terreno?.seguridad ?? []).map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
          {escuela.docente && (
            <p className="mt-5 text-sm">
              {t("rutas.letterSignedBy", { teacher: escuela.docente })}
            </p>
          )}

          <div className="mt-8 border-t border-slate-400 pt-4">
            <p className="text-xs font-semibold uppercase tracking-wide">
              {t("rutas.letterConsent")}
            </p>
            <div className="mt-4 grid grid-cols-2 gap-x-8 gap-y-7 text-xs">
              <div className="border-b border-slate-400 pb-1">
                {t("rutas.letterStudent")}
              </div>
              <div className="border-b border-slate-400 pb-1">{t("rutas.letterGrade")}</div>
              <div className="border-b border-slate-400 pb-1">
                {t("rutas.letterGuardian")}
              </div>
              <div className="border-b border-slate-400 pb-1">{t("rutas.letterPhone")}</div>
              <div className="border-b border-slate-400 pb-1">
                {t("rutas.letterSignature")}
              </div>
              <div className="border-b border-slate-400 pb-1">{t("rutas.letterDate")}</div>
            </div>
          </div>
        </Hoja>
      )}

      {/* ── La hoja del producto ── */}
      {marcados.producto && (
        <Hoja
          titulo={t("rutas.docProduct")}
          subtitulo={ruta.titulo}
          membrete={membrete}
        >
          <p className="text-base font-semibold">{ruta.preguntaGuia}</p>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                {t("rutas.whatTheyDeliver")}
              </p>
              <p className="mt-1">{ruta.producto.que}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                {t("rutas.toWhom")}
              </p>
              <p className="mt-1">{destinatario}</p>
            </div>
          </div>

          <p className="mt-6 font-semibold">{t("rutas.productAnswer")}</p>
          <Renglones cuantos={4} />

          <p className="mt-5 font-semibold">{t("rutas.productEvidence")}</p>
          <Renglones cuantos={4} />

          <p className="mt-5 font-semibold">{t("rutas.productWhoDidWhat")}</p>
          <ul className="mt-2 space-y-3 text-xs">
            {ruta.cubre
              .filter((c) => porNivel.some((b) => b.nivel === c.nivel))
              .map((c) => (
              <li key={c.nivel} className="flex items-baseline gap-2">
                <span className="w-8 shrink-0 font-bold">{cursoCorto(c.nivel)}</span>
                <span className="flex-1 border-b border-slate-400 pb-1">{c.papel}</span>
              </li>
            ))}
          </ul>

          <p className="mt-6 text-xs text-slate-600">{t("rutas.productReminder")}</p>
        </Hoja>
      )}

      {/* ── Lo que se ha visto por aquí, para comparar en terreno ── */}
      {marcados.especies && naturaleza && (
        <Hoja
          titulo={t("rutas.docSpecies")}
          subtitulo={lugarPropio || ruta.titulo}
          membrete={membrete}
        >
          <p className="text-xs">{t("rutas.speciesIntro")}</p>

          {/* Dos columnas y una casilla al lado de cada nombre: la hoja sirve
              para marcar lo que el curso encuentre, no solo para leerla. */}
          <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-1 text-xs">
            {naturaleza.especies.slice(0, 44).map((e) => (
              <li key={e.cientifico} className="flex items-baseline gap-2">
                <span className="mt-0.5 inline-block h-3 w-3 shrink-0 border border-slate-500" />
                <span className="min-w-0">
                  <span className="font-semibold">{e.comun || e.cientifico}</span>
                  {e.comun && <span className="italic"> · {e.cientifico}</span>}
                </span>
              </li>
            ))}
          </ul>

          <p className="mt-5 font-semibold">{t("rutas.speciesNotListed")}</p>
          <Renglones cuantos={5} />

          <p className="mt-4 text-[11px]">{t("rutas.speciesSource")}</p>
        </Hoja>
      )}
    </>
  );
}
