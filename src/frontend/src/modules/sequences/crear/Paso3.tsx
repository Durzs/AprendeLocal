/**
 * Paso tres: lo que queda armado.
 *
 * QUÉ SE SACÓ DE AQUÍ Y POR QUÉ
 *
 * Esta lámina mostraba, además de lo del docente, una de las cuatro rutas
 * escritas para La Araucanía: sus semanas, su material, sus momentos, y qué
 * vive alrededor. Se elegía por objetivos y por entorno, así que a alguien que
 * había dicho «río contaminado, desde química e historia» podía tocarle una
 * ruta sobre el suelo o sobre el frío de la sala. Material genérico, largo, y
 * sin relación con lo que acababa de elegir dos pantallas antes.
 *
 * Ahora solo aparece lo que es de ESTE proyecto: el método por el que se guía,
 * qué van a construir los estudiantes, la ruta que arma el modelo con sus
 * datos, la hoja que firma la dirección y el seguimiento semana a semana. Las
 * cuatro rutas escritas siguen en el repositorio y se pueden leer, pero dejaron
 * de empujarse encima de un proyecto que no es el suyo.
 */

import { useRef } from "react";

import { Hoja } from "./Campos";
import { Copiar } from "./Copiar";
import RutaGenerada from "./RutaGenerada";
import { buscarOA } from "./oa";
import type { Expedicion } from "./expedicion";
import Seguimiento from "./Seguimiento";
import { ElegirFormato, VistaMetodo } from "../metodo/VistaMetodo";
import { problemaPorId } from "../metodo/problemas";
import { tecnicaPorId } from "../metodo/tecnicas";
import { Permisos } from "../metodo/Permisos";
import { Indicadores } from "../metodo/Indicadores";
import type { Avance } from "./avance";
import type { EstadoNube } from "./nube";

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
  return (
    <div className="space-y-4">
      {/* El método primero: es por lo que se guía todo lo demás. Va plegado,
          así que ocupa cinco líneas hasta que alguien abra una etapa. */}
      <VistaMetodo orden={3} />

      {/* La ruta armada con sus datos. Es lo único de esta lámina que se
          fabrica para esta escuela y no sirve para ninguna otra. */}
      <RutaGenerada e={e} onCambio={onCambio} />

      <ElegirFormato
        formato={e.formato}
        destinatario={e.destinatario}
        familia={e.familiaDestinatario}
        rasgos={e.rasgosDestinatario}
        onCambio={(cambio) => onCambio({ ...e, ...cambio })}
      />

      {/* Los indicadores van antes de la hoja de dirección porque es de donde
          esa hoja saca con qué se evalúa. Lo pidieron dos docentes distintos
          en dos entrevistas, sin conocerse. */}
      <Indicadores e={e} onCambio={onCambio} orden={5} />

      <Justificacion e={e} />

      {/* Los dos papeles de la salida. Salió de la entrevista: nadie lo había
          pedido y es lo más concreto que se puede automatizar, porque son
          campos que el docente ya escribió. */}
      <Permisos e={e} />

      {/* Lo único a lo que se vuelve semana tras semana. */}
      <Seguimiento e={e} avance={avance} onCambio={onAvance} estado={estadoNube} />
    </div>
  );
}

/**
 * La hoja que se lleva a la dirección para que la firmen.
 *
 * Es el trámite que hoy hace que un proyecto no se haga. Un docente puede
 * tener la unidad entera pensada y quedarse ahí, porque justificar por escrito
 * qué objetivos del programa cubre y por qué el curso va a salir del recinto es
 * otra tarde de trabajo, y esa tarde no existe.
 *
 * Todo lo que va aquí ya está escrito en las dos láminas anteriores: la
 * problemática, los objetivos marcados, los cursos, el lugar, los conceptos
 * que va a pasar y la técnica que van a ensayar. Esto solo lo ordena en el
 * formato en que se pide y lo deja listo para imprimir. No se inventa nada, y
 * por eso no lleva ninguna advertencia de revisar: si algo está mal, está mal
 * desde la primera lámina.
 */
function Justificacion({ e }: { e: Expedicion }) {
  const hoja = useRef<HTMLDivElement>(null);
  const oas = e.oa.map((cod) => ({ cod, oa: buscarOA(cod) })).filter((x) => x.oa);
  const problema = e.problemaId ? problemaPorId(e.problemaId) : null;
  const titulo = problema?.nombre || e.problemaPropio.trim();
  const tecnicas = e.tecnicas.map(tecnicaPorId).filter(Boolean);
  // Solo se sale del recinto si hay un lugar elegido. Sin eso, el proyecto se
  // resuelve en el patio y la dirección no tiene nada que autorizar.
  const sale = Boolean(e.ubicacion.trim());

  if (!titulo) {
    return (
      <Hoja titulo="La hoja que firma la dirección" orden={6}>
        <p className="text-[15px] leading-relaxed text-[var(--crema)]/82">
          Esta hoja se arma sola cuando elijas de qué va a tratar el proyecto.
          No hay nada que llenar aquí: sale de lo que ya escribiste.
        </p>
      </Hoja>
    );
  }

  return (
    <Hoja titulo="La hoja que firma la dirección" orden={6}>
      <p className="mb-5 max-w-2xl text-[15px] leading-relaxed text-[var(--crema)]/82">
        Lo que hay que presentar, armado con lo que ya escribiste. No hay nada
        nuevo que llenar: se imprime y se firma.
      </p>

      <div
        ref={hoja}
        className="space-y-4 rounded-xl border border-[var(--crema)]/12 p-5 text-[15px] leading-relaxed text-[var(--crema)]/85"
      >
        <p>
          <span className="text-[var(--crema-clara)]">Proyecto:</span> {titulo}.
          {e.cursos.length > 0 ? ` Cursos ${e.cursos.join(", ")}.` : ""}
          {e.estudiantes ? ` ${e.estudiantes} estudiantes.` : ""}
          {e.sesiones
            ? ` ${e.sesiones} clases${e.duracionSesion ? ` de ${e.duracionSesion} minutos` : ""}.`
            : ""}
        </p>

        {oas.length > 0 && (
          <div>
            <p className="text-[var(--crema-clara)]">Objetivos de aprendizaje que cubre</p>
            <ul className="mt-1.5 space-y-1">
              {oas.map(({ cod, oa }) => (
                <li key={cod} className="flex gap-2.5">
                  <span className="shrink-0 font-mono text-xs text-[var(--tierra-600)]">
                    {cod}
                  </span>
                  <span>
                    {oa?.texto}
                    {/* Los indicadores van pegados a su objetivo y no en una
                        lista aparte: la hoja se lee para comprobar que cada
                        objetivo tiene con qué mirarse. */}
                    {(e.indicadores[cod] ?? []).length > 0 && (
                      <span className="mt-1.5 block text-[var(--crema)]/75">
                        Se mira en que:{" "}
                        {(e.indicadores[cod] ?? []).join("; ")}.
                      </span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {e.conceptos.length > 0 && (
          <p>
            <span className="text-[var(--crema-clara)]">Conceptos que se pasan en aula:</span>{" "}
            {e.conceptos.join(", ")}.
          </p>
        )}

        {sale && (
          <div>
            <p className="text-[var(--crema-clara)]">Salida del recinto</p>
            <p className="mt-1.5">
              Una sesión, en {e.ubicacion}.
              {tecnicas.length > 0
                ? ` Técnica que se aplica: ${tecnicas.map((t) => t!.nombre.toLowerCase()).join(", ")}, ensayada antes en la sala.`
                : ""}
            </p>
            {tecnicas.length > 0 && (
              <>
                <p className="mt-2">
                  <span className="text-[var(--crema-clara)]">Resguardos:</span>{" "}
                  {[...new Set(tecnicas.flatMap((t) => t!.seguridad))].join("; ")}.
                </p>
                <p className="mt-2">
                  <span className="text-[var(--crema-clara)]">Con las personas y el lugar:</span>{" "}
                  {[...new Set(tecnicas.flatMap((t) => t!.etica))].join("; ")}.
                </p>
              </>
            )}
          </div>
        )}

        <p>
          <span className="text-[var(--crema-clara)]">Qué entrega el curso:</span>{" "}
          lo que el curso decida construir después de volver del terreno, en su
          segunda versión y corregido por sus compañeros.
          {e.destinatario.trim() ? ` Se entrega a: ${e.destinatario}.` : ""}
          {[e.rasgosDestinatario.edad, e.rasgosDestinatario.donde]
            .filter((x) => x.trim())
            .join("; ") &&
            ` Ese destinatario es: ${[e.rasgosDestinatario.edad, e.rasgosDestinatario.donde, e.rasgosDestinatario.necesidad].filter((x) => x.trim()).join("; ")}.`}
        </p>

        <p>
          <span className="text-[var(--crema-clara)]">Cómo se evalúa:</span> lo
          que construyan y entreguen a ese destinatario, más lo que se les
          pregunta en las semanas siguientes sobre un lugar distinto del
          trabajado, para comprobar que el aprendizaje no quedó atado a este
          caso.
        </p>

        <p className="border-t border-[var(--crema)]/12 pt-4 text-[var(--crema)]/72">
          Docente: {e.docente || "________________"} · Firma de dirección:
          ________________ · Fecha: ____ / ____ / ______
        </p>
      </div>

      {/* Imprimir y copiar, las dos. Se pidió en una entrevista que el
          material viniera en formato editable: casi nadie usa un documento
          entero, se toma un pedazo y se adapta, y algo que solo se imprime
          obliga a teclearlo de nuevo para cambiar una línea. */}
      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-3">
        <button
          type="button"
          onClick={() => window.print()}
          className="min-h-11 rounded-full border border-[var(--crema)]/25 px-5 text-sm font-medium text-[var(--crema-clara)] transition hover:bg-[var(--crema)]/10"
        >
          Imprimir esta hoja
        </button>
        <Copiar de={hoja} que="la hoja" />
      </div>
    </Hoja>
  );
}
