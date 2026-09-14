import { useRef } from "react";

import { Hoja } from "../crear/Campos";
import { Copiar } from "../crear/Copiar";
import { buscarOA } from "../crear/oa";
import type { Expedicion } from "../crear/expedicion";
import { problemaPorId } from "./problemas";
import { tecnicaPorId } from "./tecnicas";

/**
 * Los dos papeles de la salida a terreno.
 *
 * Esto salió entero de una entrevista de validación y es de las cosas más
 * útiles que se han agregado, porque es trabajo administrativo puro: una
 * salida a terreno en Chile necesita DOS documentos distintos, el formulario
 * de la Superintendencia de Educación y la autorización de los apoderados, y
 * los dos piden campos que el docente ya escribió aquí.
 *
 * El formulario de la Superintendencia pide nombre de la actividad, fecha y
 * hora, lugar, curso, docente responsable, objetivos, objetivos de
 * aprendizaje, diseño pedagógico, ejes transversales, transporte y seguro
 * escolar. De esos, siete ya están en la expedición. Los cuatro que faltan
 * —fecha, hora, transporte y seguro— son los únicos que hay que escribir, y
 * van marcados con líneas para llenar a mano o en pantalla.
 *
 * LA LISTA DE QUÉ LLEVAR
 *
 * La pidió ella y no se me había ocurrido: el equipo cambia con la estación,
 * el terreno y la hora. Bloqueador y agua en enero, botas y capa en junio. Va
 * aquí y no en la técnica porque es cosa de la salida, no del instrumento.
 */

/** Lo que hay que llevar puesto o encima, según cuándo y adónde se va. */
const QUE_LLEVAR: { titulo: string; cosas: string[]; cuando: string }[] = [
  {
    titulo: "Siempre",
    cuando: "Vaya donde vaya el curso y en cualquier mes",
    cosas: [
      "Botella de agua, una por persona",
      "Calzado cerrado que se pueda mojar o embarrar",
      "Una colación: una salida de noventa minutos pilla el recreo",
      "El cuaderno o la hoja de terreno, en papel",
      "Botiquín pequeño, con el docente",
      "Un teléfono cargado, aunque no haya señal: sirve para fotografiar y para la hora",
    ],
  },
  {
    titulo: "De noviembre a marzo",
    cuando: "Sol fuerte y días largos",
    cosas: [
      "Bloqueador, aplicado antes de salir y no en el camino",
      "Gorro con visera o de ala",
      "Manga larga liviana: cubre mejor que el bloqueador",
      "Más agua de la que parece necesaria",
    ],
  },
  {
    titulo: "De abril a octubre",
    cuando: "Lluvia, barro y poca luz",
    cosas: [
      "Capa de agua o parka impermeable, no paraguas: se necesitan las dos manos",
      "Botas de goma si se va a un cauce o a un terreno blando",
      "Una muda de calcetines en la mochila",
      "Salir temprano: a las seis ya está oscuro",
    ],
  },
  {
    titulo: "Si se entra al agua o a la orilla",
    cuando: "Río, estero, canal o humedal",
    cosas: [
      "Botas altas, y nadie entra por sobre la rodilla",
      "Guantes si se va a tocar agua sospechosa",
      "Bolsa para la ropa que se moje",
      "Jabón o alcohol gel para después",
    ],
  },
  {
    titulo: "Si se camina por ladera o corte",
    cuando: "Cerro, barranca, corte de camino",
    cosas: [
      "Calzado con suela que agarre",
      "Nadie se pone al pie de un corte: se desprende tierra",
      "Guantes de trabajo si se va a cavar",
    ],
  },
];

export function Permisos({ e, orden = 7 }: { e: Expedicion; orden?: number }) {
  const papeles = useRef<HTMLDivElement>(null);
  const problema = e.problemaId ? problemaPorId(e.problemaId) : null;
  const titulo = problema?.nombre || e.problemaPropio.trim();
  const tecnicas = e.tecnicas.map(tecnicaPorId).filter(Boolean);
  const oas = e.oa.map((cod) => ({ cod, oa: buscarOA(cod) })).filter((x) => x.oa);
  const sale = Boolean(e.ubicacion.trim());

  if (!sale) {
    return (
      <Hoja titulo="Los permisos de la salida" orden={orden}>
        <p className="text-[15px] leading-relaxed text-[var(--crema)]/82">
          Los dos permisos aparecen cuando quede elegido el lugar al que va el
          curso. Si el proyecto se resuelve dentro del recinto no hace falta
          ninguno de los dos.
        </p>
      </Hoja>
    );
  }

  const linea = "________________";

  return (
    <Hoja titulo="Los permisos de la salida" orden={orden}>
      <p className="mb-5 max-w-2xl text-[15px] leading-relaxed text-[var(--crema)]/82">
        Una salida a terreno necesita dos documentos: el formulario de la
        Superintendencia de Educación y la autorización de los apoderados. Casi
        todos los campos salen de lo que ya está escrito aquí; los que no, van
        con línea para completar.
      </p>

      {/* ── Superintendencia ──────────────────────────────────────────── */}
      <div ref={papeles}>
      <div className="space-y-3.5 rounded-xl border border-[var(--crema)]/12 p-5 text-[15px] leading-relaxed text-[var(--crema)]/85">
        <p className="rotulo text-[var(--tierra-600)]">
          Formulario de la Superintendencia de Educación
        </p>

        <Campo etiqueta="Nombre de la actividad" valor={titulo || linea} />
        <Campo etiqueta="Fecha y hora" valor={linea} falta />
        <Campo etiqueta="Lugar" valor={e.ubicacion} />
        <Campo
          etiqueta="Curso o cursos"
          valor={e.cursos.length ? e.cursos.join(", ") : linea}
        />
        <Campo etiqueta="Docente responsable" valor={e.docente || linea} />
        <Campo
          etiqueta="Número de estudiantes"
          valor={e.estudiantes ? String(e.estudiantes) : linea}
        />

        <div>
          <p className="text-[var(--crema-clara)]">Objetivo de la actividad</p>
          <p className="mt-1">
            {e.fenomeno.trim()
              ? `Que el curso levante en terreno los datos que necesita para responder a esta situación: ${e.fenomeno}`
              : `Que el curso levante en terreno los datos que necesita para trabajar la problemática de ${titulo.toLowerCase()}.`}
          </p>
        </div>

        {oas.length > 0 && (
          <div>
            <p className="text-[var(--crema-clara)]">Objetivos de aprendizaje</p>
            <ul className="mt-1 space-y-1">
              {oas.map(({ cod, oa }) => (
                <li key={cod} className="flex gap-2.5">
                  <span className="shrink-0 font-mono text-xs text-[var(--tierra-600)]">
                    {cod}
                  </span>
                  <span>{oa?.texto}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div>
          <p className="text-[var(--crema-clara)]">Diseño pedagógico</p>
          <p className="mt-1">
            El curso trabajó en aula los conceptos
            {e.conceptos.length ? ` de ${e.conceptos.join(", ")}` : " del objetivo"} y
            ensayó en la sala
            {tecnicas.length
              ? ` la técnica de ${tecnicas.map((t) => t!.nombre.toLowerCase()).join(" y ")}`
              : " la técnica de recolección"}
            . En terreno la aplica, y en las clases siguientes contrasta lo que
            recolectó con lo que suponía antes de salir. Cierra construyendo y
            entregando un producto a un destinatario de la comunidad.
          </p>
        </div>

        <Campo
          etiqueta="Ejes transversales"
          valor="Formación ciudadana; cuidado del entorno; trabajo en equipo y responsabilidad en el espacio público."
        />
        <Campo etiqueta="Transporte" valor={linea} falta />
        <Campo etiqueta="Seguro escolar" valor={linea} falta />

        {tecnicas.length > 0 && (
          <div>
            <p className="text-[var(--crema-clara)]">Medidas de seguridad</p>
            <p className="mt-1">
              {[...new Set(tecnicas.flatMap((t) => t!.seguridad))].join("; ")}.
            </p>
          </div>
        )}
      </div>

      {/* ── Apoderados ────────────────────────────────────────────────── */}
      <div className="mt-4 space-y-3.5 rounded-xl border border-[var(--crema)]/12 p-5 text-[15px] leading-relaxed text-[var(--crema)]/85">
        <p className="rotulo text-[var(--tierra-600)]">
          Autorización de apoderados
        </p>
        <p>
          Yo, {linea}, apoderado o apoderada de {linea}, del curso{" "}
          {e.cursos.length ? e.cursos.join(", ") : linea}, autorizo su
          participación en la salida pedagógica a {e.ubicacion}, el día {linea},
          entre las {linea} y las {linea} horas, a cargo de{" "}
          {e.docente || linea}.
        </p>
        <p>
          Declaro estar en conocimiento de que la actividad forma parte del
          trabajo de la asignatura, que el estudiante permanecerá acompañado por
          personal del establecimiento durante toda la salida, y que cuenta con
          la cobertura del seguro escolar.
        </p>
        <p className="text-[var(--crema)]/78">
          Alguna condición de salud, alergia o medicamento que debamos saber:{" "}
          {linea}
        </p>
        <p className="border-t border-[var(--crema)]/12 pt-3.5 text-[var(--crema)]/72">
          Firma: {linea} · RUT: {linea} · Teléfono de contacto: {linea} · Fecha:
          ____ / ____ / ______
        </p>
      </div>

      </div>

      {/* ── Qué llevar ────────────────────────────────────────────────── */}
      <div className="mt-6 border-t border-[var(--crema)]/12 pt-5">
        <p className="rotulo text-[var(--crema)]/75">Qué tiene que llevar el curso</p>
        <p className="mt-1.5 text-[15px] leading-relaxed text-[var(--crema)]/78">
          Va en la circular a las familias. Cambia con la estación y con el
          terreno, así que están los dos casos y lo que depende del sitio.
        </p>
        <div className="mt-3.5 grid gap-3 sm:grid-cols-2">
          {QUE_LLEVAR.map((b) => (
            <div key={b.titulo} className="rounded-xl border border-[var(--crema)]/12 p-4">
              <p className="text-base text-[var(--crema-clara)]">{b.titulo}</p>
              <p className="mt-0.5 text-sm text-[var(--crema)]/72">{b.cuando}</p>
              <ul className="mt-2.5 space-y-1.5">
                {b.cosas.map((c) => (
                  <li
                    key={c}
                    className="flex gap-2.5 text-[15px] leading-relaxed text-[var(--crema)]/85"
                  >
                    <span aria-hidden className="text-[var(--crema)]/45">
                      ·
                    </span>
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-3">
        <button
          type="button"
          onClick={() => window.print()}
          className="min-h-11 rounded-full border border-[var(--crema)]/25 px-5 text-sm font-medium text-[var(--crema-clara)] transition hover:bg-[var(--crema)]/10"
        >
          Imprimir los dos documentos
        </button>
        <Copiar de={papeles} que="los dos documentos" />
      </div>
    </Hoja>
  );
}

/** Una fila del formulario. `falta` marca lo que la plataforma no puede saber. */
function Campo({
  etiqueta,
  valor,
  falta,
}: {
  etiqueta: string;
  valor: string;
  falta?: boolean;
}) {
  return (
    <p>
      <span className="text-[var(--crema-clara)]">{etiqueta}:</span>{" "}
      <span className={falta ? "text-[var(--tierra-300)]" : ""}>{valor}</span>
    </p>
  );
}
