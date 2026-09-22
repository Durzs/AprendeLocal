/**
 * Por dónde va el proyecto, en su propia página.
 *
 * POR QUÉ NO ESTÁ EN EL CUADERNO
 *
 * El cuaderno de `/crear` sirve para armar la ruta: se abre una vez, se llena
 * en una tarde y se cierra. Esto es lo contrario, y se usa en el momento
 * contrario: se abre un martes a las ocho, cinco minutos antes de entrar a la
 * sala, para ver dónde quedó el proyecto la semana pasada.
 *
 * Mientras estuvo dentro de la tercera lámina había que pasar por todo lo de
 * armar la ruta para llegar a lo único que cambia cada semana. Y decía, sin
 * querer, que seguir un proyecto es un paso más de planificarlo.
 *
 * QUÉ TIENE DE DISTINTO A LAS DEMÁS PANTALLAS
 *
 * Es la misma tinta del cuaderno, el mismo verde y el mismo grano de papel,
 * porque es el mismo cuaderno: lo que cambia es la sección. Lo que no tiene es
 * el riel de las láminas ni el pie de «Seguir», que son de armar y no de
 * seguir; en su lugar la cabecera dice cómo se llama el proyecto y dónde
 * queda, que es lo que hace falta para reconocerlo de un vistazo.
 *
 * LOS DOS SEGUIMIENTOS, LOS DOS AQUÍ
 *
 * La bitácora sigue el método y contesta en qué parte del proyecto está el
 * curso. El calendario sigue las semanas de la ruta armada y contesta qué toca
 * el martes. Los dos son de seguir, así que los dos se mudaron.
 */

import { Link } from "react-router-dom";

import Bitacora from "../seguimiento/BitacoraEtapas";
import Calendario from "../seguimiento/Calendario";
import { useExpedicion } from "../crear/useExpedicion";
import { problemaPorId } from "../metodo/problemas";
import { useTx } from "../../../shared/tx";

export default function ProyectoPage() {
  // El mismo enganche que usa el cuaderno, así que los dos leen y escriben el
  // mismo trabajo: lo que se marca aquí un martes está en `/crear` sin más.
  const { expedicion: e, avance, estado, cambiar, cambiarAvance } = useExpedicion();
  const tx = useTx();

  const problema = e.problemaId ? problemaPorId(e.problemaId) : null;
  const titulo = e.problemaPropioNombre || problema?.nombre || e.preguntaGuia || "";

  // Hay proyecto cuando hay algo escrito, no por haber abierto la página una
  // vez. Es la misma regla que usa el escritorio.
  const hay = Boolean(
    e.oa.length || e.ubicacion.trim() || e.preguntaGuia.trim() || e.problemaId
  );

  return (
    <div className="grano relative flex flex-1 flex-col bg-[var(--fondo)] text-[var(--crema)]">
      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 pt-5 sm:px-8">
        {/* La cabecera del sitio ya lleva al inicio, al cuaderno y a la
            cuenta, y marca que se está en el seguimiento. Aquí quedaba una
            barra propia con «Salir», que era la única manera de irse cuando
            esta página vivía fuera del sitio. */}
        <main className="flex-1 pt-2 pb-14">
          <p className="animar-hoja animar-hoja-1 rotulo text-[var(--tierra-600)]">
            {tx("El proyecto en la sala", "O projeto em sala")}
          </p>
          <h1 className="animar-hoja animar-hoja-2 mt-2.5 max-w-3xl text-[1.85rem] font-semibold leading-[1.08] tracking-[-0.03em] text-[var(--crema-clara)] sm:text-[2.4rem]">
            {titulo || tx("Por dónde va el proyecto", "Em que ponto está o projeto")}
          </h1>

          {/* La pregunta y el lugar, que es con lo que un docente reconoce su
              propio proyecto sin leer el título entero. */}
          <p className="animar-hoja animar-hoja-3 mt-3.5 max-w-2xl text-[15px] leading-relaxed text-[var(--crema)]/70">
            {hay ? (
              <>
                {e.preguntaGuia.trim() && titulo !== e.preguntaGuia ? (
                  <>«{e.preguntaGuia}» </>
                ) : null}
                {e.ubicacion.trim() ? (
                  <>
                    {tx("En", "Em")} {e.ubicacion}.
                  </>
                ) : null}
              </>
            ) : (
              tx(
                "Aquí se sigue el proyecto semana a semana: en qué etapa va el curso, qué salió de la salida y cuántos entregaron el cierre.",
                "Aqui se acompanha o projeto semana a semana: em que etapa a turma está, o que saiu da saída de campo e quantos entregaram o fechamento."
              )
            )}
          </p>

          {hay ? (
            <div className="mt-9 space-y-4">
              <Bitacora
                e={e}
                hojas={avance.bitacora}
                onCambio={(b) => cambiarAvance({ ...avance, bitacora: b })}
                onExpedicion={cambiar}
                estado={estado}
                orden={1}
              />

              {/* El calendario escribe en dos sitios: las clases son del plan
                  y viven en la expedición, y cuáles se dieron es del avance. */}
              <Calendario
                e={e}
                avance={avance}
                onExpedicion={cambiar}
                onAvance={cambiarAvance}
              />

              {/* De vuelta a armar. Va abajo y en voz baja: se viene aquí a
                  seguir, y volver al cuaderno es la excepción. */}
              <p className="pt-2 text-sm leading-relaxed text-[var(--crema)]/55">
                {tx(
                  "Si hay que cambiar algo de la ruta, de los objetivos o de los papeles de la salida,",
                  "Se for preciso mudar algo da rota, das habilidades ou dos documentos da saída,"
                )}{" "}
                <Link
                  to="/crear"
                  className="text-[var(--tierra-300)] underline underline-offset-4 transition hover:text-[var(--tierra-200)]"
                >
                  {tx("el cuaderno sigue ahí", "o caderno continua lá")}
                </Link>
                .
              </p>
            </div>
          ) : (
            <SinProyecto />
          )}
        </main>
      </div>
    </div>
  );
}

/**
 * Cuando todavía no hay nada que seguir.
 *
 * No se muestra la bitácora vacía con sus seis etapas sin abrir: sería una
 * pantalla llena de casillas que no se pueden marcar, y la persona que llega
 * aquí sin proyecto lo que necesita es el camino de vuelta.
 */
function SinProyecto() {
  const tx = useTx();
  return (
    <div className="mt-9 rounded-2xl border border-[var(--crema)]/14 bg-[var(--crema)]/[0.035] p-6">
      <p className="max-w-2xl text-[15px] leading-relaxed text-[var(--crema)]/82">
        {tx(
          "Todavía no hay nada escrito en este computador. El seguimiento empieza con lo mínimo: basta con haber elegido la problemática y dónde queda la escuela para que las seis etapas aparezcan aquí. La ruta completa puede venir después.",
          "Ainda não há nada escrito neste computador. O acompanhamento começa com o mínimo: basta ter escolhido a problemática e onde fica a escola para que as seis etapas apareçam aqui. A rota completa pode vir depois."
        )}
      </p>
      <Link
        to="/crear"
        className="group mt-5 inline-flex items-center gap-2 rounded-full bg-[var(--tierra-600)] px-6 py-2.5 text-sm font-semibold text-[#1e2a24] transition hover:bg-[var(--tierra-500)]"
      >
        {tx("Armar la ruta", "Montar a rota")}
        <span aria-hidden className="transition-transform group-hover:translate-x-1">
          →
        </span>
      </Link>
    </div>
  );
}
