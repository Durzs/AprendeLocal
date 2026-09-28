/**
 * El panel donde la ruta deja de ser genérica.
 *
 * Son seis campos y ninguno es opcional por capricho: cada uno cambia algo
 * concreto en el papel que el docente se lleva a la sala.
 *
 *   cursos       → cuántas hojas de terreno se imprimen, y qué ejercicios
 *                  aparecen. Es el que más cambia la clase.
 *   lugar        → el estero deja de llamarse «un estero» en la carta.
 *   escuela      → membrete de todo lo que se reparte.
 *   docente      → quién firma la autorización.
 *   fecha        → sin fecha la carta no sirve para pedir el permiso.
 *   destinatario → a quién entregan; la ruta propone uno y casi siempre hay
 *                  que cambiarlo, porque cada comunidad tiene los suyos.
 *
 * Se abre plegado. Un docente que solo quiere mirar la ruta no debería
 * encontrarse un formulario antes que la clase; y el que ya lo llenó una vez
 * no tiene que volver a verlo, porque queda guardado.
 */

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { cursoCorto, type Ruta } from "./catalogo";
import type { AjustesEscuela, AjustesRuta } from "./ajustes";

function Campo({
  etiqueta,
  ayuda,
  ...resto
}: {
  etiqueta: string;
  ayuda?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-700">{etiqueta}</span>
      <input
        {...resto}
        className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-1 focus:ring-slate-400"
      />
      {ayuda && <span className="mt-1 block text-xs text-slate-500">{ayuda}</span>}
    </label>
  );
}

export default function Personalizar({
  ruta,
  escuela,
  onEscuela,
  ajustes,
  onAjustes,
}: {
  ruta: Ruta;
  escuela: AjustesEscuela;
  onEscuela: (a: AjustesEscuela) => void;
  ajustes: AjustesRuta;
  onAjustes: (a: AjustesRuta) => void;
}) {
  const { t } = useTranslation();
  // Abierto de entrada solo si no hay nada guardado: la primera vez hay que
  // llenarlo, y a partir de ahí estorba.
  const [abierto, setAbierto] = useState(!escuela.escuela && !escuela.cursos.length);

  const disponibles = ruta.cubre.map((c) => c.nivel);
  const elegidos = escuela.cursos.length
    ? escuela.cursos.filter((n) => disponibles.includes(n))
    : disponibles;

  function alternarCurso(nivel: string) {
    // Sin cursos guardados se parte de todos los de la ruta, así que la
    // primera pulsación quita uno en vez de empezar de cero.
    const base = escuela.cursos.length ? escuela.cursos : disponibles;
    const nuevos = base.includes(nivel)
      ? base.filter((n) => n !== nivel)
      : [...base, nivel];
    onEscuela({ ...escuela, cursos: nuevos });
  }

  const resumen = [
    escuela.escuela,
    elegidos.length ? elegidos.map(cursoCorto).join(" ") : null,
    ajustes.lugar,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <section className="mt-4 rounded-2xl border border-slate-200 bg-white print:hidden">
      <button
        type="button"
        onClick={() => setAbierto((v) => !v)}
        aria-expanded={abierto}
        className="flex w-full items-center gap-3 px-6 py-4 text-left"
      >
        <span className="min-w-0 flex-1">
          <span className="block rotulo text-slate-500">
            {t("rutas.customize")}
          </span>
          <span className="mt-0.5 block truncate text-sm text-slate-700">
            {resumen || t("rutas.customizeEmpty")}
          </span>
        </span>
        <span
          aria-hidden
          className={`shrink-0 text-slate-400 transition-transform duration-200 ${abierto ? "rotate-180" : ""}`}
        >
          ▾
        </span>
      </button>

      {abierto && (
        <div className="animar-asoma border-t border-slate-100 px-6 pb-6 pt-5">
          <p className="text-sm text-slate-600">{t("rutas.customizeLead")}</p>

          {/* Los cursos van primero: es el ajuste que más cambia lo que se
              imprime, y el único que un docente nota si se equivoca. */}
          <div className="mt-4">
            <p className="mb-1.5 text-sm font-medium text-slate-700">
              {t("rutas.gradesInRoom")}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {disponibles.map((n) => {
                const activo = elegidos.includes(n);
                return (
                  <button
                    key={n}
                    type="button"
                    onClick={() => alternarCurso(n)}
                    aria-pressed={activo}
                    className={[
                      "rounded-full border px-3.5 py-1.5 text-sm font-semibold transition",
                      activo
                        ? "border-slate-900 bg-tinta-950 text-white"
                        : "border-slate-300 text-slate-500 hover:bg-slate-50",
                    ].join(" ")}
                  >
                    {cursoCorto(n)}
                  </button>
                );
              })}
            </div>
            <p className="mt-1.5 text-xs text-slate-500">{t("rutas.gradesHelp")}</p>
            {elegidos.length === 0 && (
              <p className="mt-1.5 text-xs font-semibold text-amber-800">
                {t("rutas.gradesNone")}
              </p>
            )}
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Campo
              etiqueta={t("rutas.placeName")}
              ayuda={ruta.lugar}
              value={ajustes.lugar}
              placeholder={t("rutas.placeNamePlaceholder")}
              onChange={(e) => onAjustes({ ...ajustes, lugar: e.target.value })}
            />
            <Campo
              etiqueta={t("rutas.outingDate")}
              ayuda={t("rutas.outingDateHelp")}
              type="date"
              value={ajustes.fechaSalida}
              onChange={(e) => onAjustes({ ...ajustes, fechaSalida: e.target.value })}
            />
            <Campo
              etiqueta={t("rutas.schoolName")}
              value={escuela.escuela}
              placeholder={t("rutas.schoolPlaceholder")}
              onChange={(e) => onEscuela({ ...escuela, escuela: e.target.value })}
            />
            <Campo
              etiqueta={t("rutas.teacherName")}
              ayuda={t("rutas.teacherHelp")}
              value={escuela.docente}
              onChange={(e) => onEscuela({ ...escuela, docente: e.target.value })}
            />
            <div className="sm:col-span-2">
              <Campo
                etiqueta={t("rutas.recipient")}
                ayuda={t("rutas.recipientHelp")}
                value={ajustes.destinatario}
                onChange={(e) => onAjustes({ ...ajustes, destinatario: e.target.value })}
              />
            </div>
          </div>

          <p className="mt-4 text-xs text-slate-500">{t("rutas.savedHere")}</p>
        </div>
      )}
    </section>
  );
}
