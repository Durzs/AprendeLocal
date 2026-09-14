/**
 * Paso uno: los primeros datos, en dos láminas.
 *
 * Están separadas porque son dos conversaciones distintas y mezclarlas es lo
 * que hacía que el formulario anterior pesara tanto. La primera es lo que le
 * pide el programa al docente: cursos, horas, objetivos, cómo va a evaluar. La
 * segunda es lo que pone el lugar: qué hay alrededor, qué pasa ahí, qué se
 * podría averiguar. Una se contesta con la planificación al lado; la otra,
 * mirando por la ventana.
 */

import { Campo, Fichas, Hoja, Texto } from "./Campos";
import { ElegirProblema } from "../metodo/ElegirProblema";
import { AntesDeSalir } from "../metodo/AntesDeSalir";
import { DondeQueda } from "../metodo/DondeQueda";
import type { Expedicion } from "./expedicion";

const CURSOS = ["5º", "6º", "7º", "8º"];

/**
 * Cuántas clases hay para esto.
 *
 * Se cuenta en clases y no en semanas porque lo dijo una docente probando la
 * plataforma: tres semanas en un ramo que se ve una vez por semana son tres
 * clases, y hay colegios de 45 minutos y colegios con tres bloques seguidos.
 * La semana no dice nada; la clase sí.
 *
 * Y son mínimos, no topes. Eso lo pidió otro docente en otra entrevista: un
 * proyecto completo con impacto en la comunidad pide un semestre, y poner un
 * número máximo empuja a recortar justo lo que hace que valga la pena. Un
 * proyecto de tres clases se puede hacer, pero hay que decir en voz alta a qué
 * se está renunciando, que es a la parte comunitaria y a la profundidad.
 */
const SESIONES = [
  { valor: "3", titulo: "3 clases o más" },
  { valor: "6", titulo: "6 clases o más" },
  { valor: "10", titulo: "10 clases o más" },
  { valor: "16", titulo: "Un semestre" },
];

/** Qué cabe de verdad con ese tiempo, dicho antes y no después. */
const QUE_CABE: Record<string, string> = {
  "3":
    "Alcanza para una salida y una entrega chica. Con tres clases se renuncia a la parte comunitaria y a la profundidad técnica: el curso sale, ordena lo que trajo y entrega algo breve. Sirve como primera vez, y conviene decirlo así en la sala.",
  "6":
    "Alcanza para las seis etapas sin apretar ninguna. Es el tamaño en que el proyecto cierra bien: hay clase de conceptos, salida, una clase entera para ordenar lo que se trajo, y tiempo de construir y corregir.",
  "10":
    "Alcanza para que la entrega salga de la escuela y llegue a alguien de fuera, y para una segunda versión después de que los compañeros la critiquen. Aquí empieza a ser un proyecto y no una unidad con salida.",
  "16":
    "Es el tamaño en que un proyecto de este tipo da todo lo que puede dar: hay tiempo para volver al terreno una segunda vez, para que la comunidad conteste, y para que el curso haga algo con esa respuesta.",
};

const DURACIONES = [
  { valor: "45", titulo: "45 min" },
  { valor: "90", titulo: "90 min" },
  { valor: "135", titulo: "135 min" },
];

type Props = {
  e: Expedicion;
  onCambio: (e: Expedicion) => void;
};

/** Lámina 1: lo que pide el programa. */
export function PasoPrograma({ e, onCambio }: Props) {
  const set = <K extends keyof Expedicion>(k: K, v: Expedicion[K]) =>
    onCambio({ ...e, [k]: v });

  return (
    <div className="space-y-4">
      <Hoja titulo="El curso y el tiempo disponible" orden={4}>
        <div className="grid gap-5 sm:grid-cols-2">
          <Campo etiqueta="Tu nombre" ayuda="Va firmado en la carta a las familias.">
            <Texto
              value={e.docente}
              onChange={(ev) => set("docente", ev.target.value)}
              placeholder="Rayen Millán"
            />
          </Campo>

          <Campo
            etiqueta="Cuántos estudiantes"
            ayuda="Sirve para calcular grupos y material."
          >
            <Texto
              type="number"
              min={1}
              max={200}
              value={e.estudiantes ?? ""}
              onChange={(ev) =>
                set("estudiantes", ev.target.value ? Number(ev.target.value) : null)
              }
              placeholder="14"
            />
          </Campo>

          <Fichas
            etiqueta="Cursos en la sala"
            ayuda="En multigrado son varios a la vez. Marca todos los que tengas."
            opciones={CURSOS.map((c) => ({ valor: c, titulo: c }))}
            elegidas={e.cursos}
            onElegir={(v) => set("cursos", v)}
          />

          <Fichas
            etiqueta="Cuántas clases tienes para esto"
            ayuda="En clases y no en semanas: tres semanas en un ramo que se ve una vez por semana son tres clases. Son mínimos, no topes: si tienes más, mejor."
            opciones={SESIONES}
            elegidas={e.sesiones ? [String(e.sesiones)] : []}
            onElegir={(v) => set("sesiones", v[0] ? Number(v[0]) : null)}
            unica
          />

          {/* Qué cabe con ese tiempo, dicho al elegirlo y no al final. Un
              proyecto de tres clases se puede hacer; lo que no se puede es
              hacerlo creyendo que va a llegar a la comunidad. */}
          {e.sesiones && QUE_CABE[String(e.sesiones)] && (
            <p className="sm:col-span-2 rounded-xl border border-[var(--crema)]/14 px-4 py-3 text-[15px] leading-relaxed text-[var(--crema)]/82">
              {QUE_CABE[String(e.sesiones)]}
            </p>
          )}

          <Fichas
            etiqueta="Cuánto dura cada clase"
            ayuda="Con esto se sabe el tiempo real que tienes, que es lo que decide si el proyecto cabe."
            opciones={DURACIONES}
            elegidas={e.duracionSesion ? [String(e.duracionSesion)] : []}
            onElegir={(v) => set("duracionSesion", v[0] ? Number(v[0]) : null)}
            unica
          />
        </div>
      </Hoja>
    </div>
  );
}

/** Lámina 2: lo que pone el lugar. */
export function PasoLugar({ e, onCambio }: Props) {
  return (
    <div className="space-y-4">
      <DondeQueda e={e} onCambio={onCambio} orden={4} />

      <ElegirProblema e={e} onCambio={onCambio} orden={5} />

      <AntesDeSalir e={e} onCambio={onCambio} orden={6} />
    </div>
  );
}
