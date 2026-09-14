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

/** Clases, no semanas: es el tiempo que el docente tiene de verdad. */
const SESIONES = [
  { valor: "3", titulo: "3 clases" },
  { valor: "4", titulo: "4 clases" },
  { valor: "6", titulo: "6 clases" },
  { valor: "8", titulo: "8 clases" },
  { valor: "12", titulo: "12 clases" },
];

const DURACIONES = [
  { valor: "45", titulo: "45 min" },
  { valor: "90", titulo: "90 min" },
  { valor: "135", titulo: "135 min" },
];

/** Cuántas semanas, en las duraciones que de verdad se usan. */

/**
 * Los objetivos que alguna ruta escrita ya cubre.
 *
 * Se calcula una vez y no en cada tecla: son sesenta y dos objetivos contra
 * cuatro rutas, y el docente escribe mientras la lista está abierta.
 */



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
      <Hoja titulo="Quién y cuánto" orden={4}>
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
            etiqueta="Cuántas clases"
            ayuda="No semanas: clases. Un proyecto de tres semanas, en un ramo que se ve una vez por semana, son tres clases."
            opciones={SESIONES}
            elegidas={e.sesiones ? [String(e.sesiones)] : []}
            onElegir={(v) => set("sesiones", v[0] ? Number(v[0]) : null)}
            unica
          />

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

      <Hoja titulo="Lo que el programa exige" orden={5}>
        <div className="grid gap-5 sm:grid-cols-2">

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
