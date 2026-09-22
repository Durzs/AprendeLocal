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
 * qué van a construir los estudiantes, con qué se evalúa y la hoja que firma la
 * dirección. Las cuatro rutas escritas siguen en el repositorio y se pueden
 * leer, pero dejaron de empujarse encima de un proyecto que no es el suyo.
 *
 * DOS COSAS MÁS QUE SE FUERON DE AQUÍ
 *
 * La ruta que armaba el modelo, con su plan por semanas y sus cuatro huecos. El
 * plan repetía lo que ya dicen las seis etapas, y los cuatro huecos, que eran
 * lo que valía, pasaron a ser campos del cuaderno en la lámina anterior.
 *
 * Y el seguimiento. Esta lámina es de armar: se abre una vez, se llena en una
 * tarde y se cierra. Seguir el proyecto se hace todos los martes, así que vive
 * en su propia página y aquí solo queda la puerta.
 */

import { useRef } from "react";
import { Link } from "react-router-dom";

import { Hoja } from "./Campos";
import { Copiar } from "./Copiar";
import type { Expedicion } from "./expedicion";
import { buscarObjetivo } from "../contenido/curriculo";
import { useContenido } from "../contenido";
import { useTx } from "../../../shared/tx";
import { ElegirFormato, VistaMetodo } from "../metodo/VistaMetodo";
import { problemaPorId } from "../metodo/problemas";
import { tecnicaPorId } from "../metodo/tecnicas";
import { Permisos } from "../metodo/Permisos";
import { Indicadores } from "../metodo/Indicadores";

export default function Paso3({
  e,
  onCambio,
}: {
  e: Expedicion;
  onCambio: (e: Expedicion) => void;
}) {
  return (
    <div className="space-y-4">
      {/* El método primero: es por lo que se guía todo lo demás. Va plegado,
          así que ocupa cinco líneas hasta que alguien abra una etapa. */}
      <VistaMetodo orden={3} />

      {/* Aquí iba la ruta que armaba el modelo, con su plan por semanas y sus
          cuatro huecos. Se retiró: el plan repetía lo que ya dicen las seis
          etapas, y los cuatro huecos, que eran lo que valía, pasaron a ser
          campos del cuaderno. El plan de clases lo escribe el docente, en el
          calendario de la página de seguimiento. */}
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

      {/* El seguimiento se mudó a su propia página. Esta lámina es de armar la
          ruta: se abre una vez, se llena en una tarde y se cierra. Seguir el
          proyecto es lo contrario, y se hace en el momento contrario, así que
          aquí solo queda la puerta. */}
      <Entrega e={e} />
    </div>
  );
}

/**
 * La puerta al seguimiento, y el final del cuaderno.
 *
 * Es la última hoja de la última lámina, y por eso hace dos cosas: cierra el
 * armado y abre lo que viene después. Lo que viene después es otra pantalla y
 * otro día, porque armar la ruta es de una tarde y seguirla es de todos los
 * martes.
 *
 * No exige que la ruta esté completa para dejar pasar. Un proyecto se puede
 * empezar en la sala con la mitad de los papeles sin imprimir, y un botón que
 * se niegue hasta que todo esté lleno es una manera de decirle a alguien que
 * su trabajo no cuenta hasta que el formulario lo apruebe.
 */
function Entrega({ e }: { e: Expedicion }) {
  const armada = e.semanas.length > 0;
  const tx = useTx();

  return (
    <Hoja titulo={tx("Cuando empiece en la sala", "Quando começar em sala")} orden={7}>
      <p className="max-w-2xl text-[15px] leading-relaxed text-[var(--crema)]/82">
        {tx(
          "Esta lámina se llena una vez. Lo que cambia cada semana está en otra página: en qué etapa va el curso, qué salió de la salida, cuántos entregaron el cierre y qué contestaron los que recibieron el trabajo.",
          "Esta lâmina se preenche uma vez. O que muda toda semana está em outra página: em que etapa a turma está, o que saiu da saída de campo, quantos entregaram o fechamento e o que responderam os que receberam o trabalho."
        )}
      </p>
      <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-[var(--crema)]/70">
        {armada
          ? tx(
              "Ahí está también el calendario, con las clases que anotaste. Se abre el día de la primera y se vuelve a ella el martes siguiente.",
              "Lá também está o calendário, com as aulas que você anotou. Abre-se no dia da primeira e volta-se a ele na semana seguinte."
            )
          : tx(
              "Ahí se anotan también las clases del plan, una por una y con el título que les pongas. Se puede abrir desde ya: las seis etapas del método no dependen de que el resto esté listo.",
              "Lá também se anotam as aulas do plano, uma por uma e com o título que você der. Dá para abrir desde já: as seis etapas do método não dependem de o resto estar pronto."
            )}
      </p>

      <Link
        to="/proyecto"
        className="group mt-5 inline-flex items-center gap-2 rounded-full bg-[var(--tierra-600)] px-6 py-3 text-sm font-semibold text-[#1e2a24] transition hover:bg-[var(--tierra-500)]"
      >
        {tx("Ir al seguimiento del proyecto", "Ir para o acompanhamento do projeto")}
        <span aria-hidden className="transition-transform group-hover:translate-x-1">
          →
        </span>
      </Link>
    </Hoja>
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
  const tx = useTx();
  const c = useContenido();
  const oas = e.oa.map((cod) => ({ cod, oa: buscarObjetivo(cod) })).filter((x) => x.oa);
  const problema = e.problemaId ? problemaPorId(e.problemaId) : null;
  const titulo = problema?.nombre || e.problemaPropioNombre.trim() || e.problemaPropio.trim();
  const tecnicas = e.tecnicas.map((t) => tecnicaPorId(t, tx.idioma)).filter(Boolean);
  // Solo se sale del recinto si hay un lugar elegido. Sin eso, el proyecto se
  // resuelve en el patio y la dirección no tiene nada que autorizar.
  const sale = Boolean(e.ubicacion.trim());

  if (!titulo) {
    return (
      <Hoja titulo={tx("La hoja que firma la dirección", "O documento que a direção assina")} orden={6}>
        <p className="text-[15px] leading-relaxed text-[var(--crema)]/82">
          {tx(
            "Esta hoja se arma sola cuando elijas de qué va a tratar el proyecto. No hay nada que llenar aquí: sale de lo que ya escribiste.",
            "Este documento se monta sozinho quando você escolher do que o projeto vai tratar. Não há nada para preencher aqui: sai do que você já escreveu."
          )}
        </p>
      </Hoja>
    );
  }

  return (
    <Hoja
      titulo={tx("La hoja que firma la dirección", "O documento que a direção assina")}
      orden={6}
      resumen={tx(
        "Armada con lo que ya escribiste. No hay nada nuevo que llenar: se imprime y se firma.",
        "Montado com o que você já escreveu. Não há nada novo para preencher: imprime-se e assina-se."
      )}
    >

      <div
        ref={hoja}
        className="space-y-4 rounded-xl border border-[var(--crema)]/12 p-5 text-[15px] leading-relaxed text-[var(--crema)]/85"
      >
        <p>
          <span className="text-[var(--crema-clara)]">{tx("Proyecto", "Projeto")}:</span> {titulo}.
          {e.cursos.length > 0
            ? ` ${tx("Cursos", "Turmas")} ${e.cursos.map(c.nombreCurso).join(", ")}.`
            : ""}
          {e.estudiantes ? ` ${e.estudiantes} ${tx("estudiantes", "alunos")}.` : ""}
          {e.sesiones
            ? ` ${e.sesiones} ${tx("clases", "aulas")}${
                e.duracionSesion ? ` ${tx("de", "de")} ${e.duracionSesion} ${tx("minutos", "minutos")}` : ""
              }.`
            : ""}
        </p>

        {oas.length > 0 && (
          <div>
            <p className="text-[var(--crema-clara)]">
              {tx("Objetivos de aprendizaje que cubre", "Habilidades da BNCC que trabalha")}
            </p>
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
                        {tx("Se mira en que", "Observa-se se")}:{" "}
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
            <span className="text-[var(--crema-clara)]">
              {tx("Conceptos que se pasan en aula", "Conceitos trabalhados em sala")}:
            </span>{" "}
            {e.conceptos.join(", ")}.
          </p>
        )}

        {sale && (
          <div>
            <p className="text-[var(--crema-clara)]">
              {tx("Salida del recinto", "Saída da escola")}
            </p>
            <p className="mt-1.5">
              {tx("Una sesión, en", "Uma aula, em")} {e.ubicacion}.
              {tecnicas.length > 0
                ? tx(
                    ` Técnica que se aplica: ${tecnicas.map((t) => t!.nombre.toLowerCase()).join(", ")}, ensayada antes en la sala.`,
                    ` Técnica aplicada: ${tecnicas.map((t) => t!.nombre.toLowerCase()).join(", ")}, ensaiada antes em sala.`
                  )
                : ""}
            </p>
            {tecnicas.length > 0 && (
              <>
                <p className="mt-2">
                  <span className="text-[var(--crema-clara)]">{tx("Resguardos", "Cuidados")}:</span>{" "}
                  {[...new Set(tecnicas.flatMap((t) => t!.seguridad))].join("; ")}.
                </p>
                <p className="mt-2">
                  <span className="text-[var(--crema-clara)]">
                    {tx("Con las personas y el lugar", "Com as pessoas e o lugar")}:
                  </span>{" "}
                  {[...new Set(tecnicas.flatMap((t) => t!.etica))].join("; ")}.
                </p>
              </>
            )}
          </div>
        )}

        <p>
          <span className="text-[var(--crema-clara)]">
            {tx("Qué entrega el curso", "O que a turma entrega")}:
          </span>{" "}
          {tx(
            "lo que el curso decida construir después de volver del terreno, en su segunda versión y corregido por sus compañeros.",
            "o que a turma decidir construir depois de voltar do campo, na segunda versão e corrigido pelos colegas."
          )}
          {e.destinatario.trim() ? ` ${tx("Se entrega a", "Será entregue a")}: ${e.destinatario}.` : ""}
          {[e.rasgosDestinatario.edad, e.rasgosDestinatario.donde]
            .filter((x) => x.trim())
            .join("; ") &&
            ` ${tx("Ese destinatario es", "Esse destinatário é")}: ${[e.rasgosDestinatario.edad, e.rasgosDestinatario.donde, e.rasgosDestinatario.necesidad].filter((x) => x.trim()).join("; ")}.`}
        </p>

        <p>
          <span className="text-[var(--crema-clara)]">{tx("Cómo se evalúa", "Como se avalia")}:</span>{" "}
          {tx(
            "lo que construyan y entreguen a ese destinatario, más lo que se les pregunta en las semanas siguientes sobre un lugar distinto del trabajado, para comprobar que el aprendizaje no quedó atado a este caso.",
            "o que construírem e entregarem a esse destinatário, mais o que se pergunta nas semanas seguintes sobre um lugar diferente do trabalhado, para comprovar que a aprendizagem não ficou presa a este caso."
          )}
        </p>

        <p className="border-t border-[var(--crema)]/12 pt-4 text-[var(--crema)]/72">
          {tx("Docente", "Professor(a)")}: {e.docente || "________________"} ·{" "}
          {tx("Firma de dirección", "Assinatura da direção")}: ________________ ·{" "}
          {tx("Fecha", "Data")}: ____ / ____ / ______
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
          {tx("Imprimir esta hoja", "Imprimir este documento")}
        </button>
        <Copiar de={hoja} que={tx("la hoja", "o documento")} />
      </div>
    </Hoja>
  );
}
