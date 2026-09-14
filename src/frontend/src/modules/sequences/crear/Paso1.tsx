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

import { RUTAS } from "../rutas/catalogo";
import { Campo, Fichas, Hoja, Texto } from "./Campos";
import { ElegirProblema } from "../metodo/ElegirProblema";
import { AntesDeSalir } from "../metodo/AntesDeSalir";
import SelectorOA from "./SelectorOA";
import type { Entorno, Expedicion } from "./expedicion";

const CURSOS = ["5º", "6º", "7º", "8º"];

/** Cuántas semanas, en las duraciones que de verdad se usan. */
const SEMANAS = [2, 3, 4, 6];

/**
 * Los objetivos que alguna ruta escrita ya cubre.
 *
 * Se calcula una vez y no en cada tecla: son sesenta y dos objetivos contra
 * cuatro rutas, y el docente escribe mientras la lista está abierta.
 */
const CON_RUTA = new Set(RUTAS.flatMap((r) => r.cubre.flatMap((c) => c.codigos)));


const ENTORNOS: { valor: Entorno; titulo: string }[] = [
  { valor: "rio", titulo: "Río o estero" },
  { valor: "bosque", titulo: "Bosque" },
  { valor: "campo", titulo: "Campo o huerta" },
  { valor: "costa", titulo: "Costa o lago" },
  { valor: "cordillera", titulo: "Cerro o volcán" },
  { valor: "pueblo", titulo: "Pueblo o camino" },
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
            etiqueta="Cuántas semanas"
            ayuda="Tres es lo habitual: una para preparar, una de salida y una para armar lo que entregan."
            opciones={SEMANAS.map((n) => ({ valor: String(n), titulo: `${n} semanas` }))}
            elegidas={e.semanas ? [String(e.semanas)] : []}
            onElegir={(v) => set("semanas", v[0] ? Number(v[0]) : null)}
            unica
          />
        </div>
      </Hoja>

      <Hoja titulo="Lo que el programa exige" orden={5}>
        <div className="grid gap-5 sm:grid-cols-2">
          <SelectorOA
            cursos={e.cursos}
            elegidos={e.oa}
            onElegir={(v) => set("oa", v)}
            conRuta={CON_RUTA}
          />

        </div>
      </Hoja>
    </div>
  );
}

/** Lámina 2: lo que pone el lugar. */
export function PasoLugar({ e, onCambio }: Props) {
  const set = <K extends keyof Expedicion>(k: K, v: Expedicion[K]) =>
    onCambio({ ...e, [k]: v });

  return (
    <div className="space-y-4">
      <Hoja titulo="Dónde queda la escuela" orden={4}>
        <div className="grid gap-5 sm:grid-cols-2">
          <Fichas
            etiqueta="Qué hay a distancia de caminata"
            ayuda="Lo que se alcanza a pie en un recreo largo. Elige uno."
            opciones={ENTORNOS}
            elegidas={e.entorno ? [e.entorno] : []}
            onElegir={(v) => set("entorno", (v[0] as Entorno) ?? null)}
            unica
          />

          <Campo
            etiqueta="Cómo se llama ese lugar"
            ayuda="Su nombre de verdad, el que usa la gente de ahí."
            ancho="entera"
          >
            <Texto
              value={e.ubicacion}
              onChange={(ev) => set("ubicacion", ev.target.value)}
              placeholder="El estero Trailelfu, detrás de la cancha"
            />
          </Campo>
        </div>
      </Hoja>

      <ElegirProblema e={e} onCambio={onCambio} orden={5} />

      <AntesDeSalir e={e} onCambio={onCambio} orden={6} />
    </div>
  );
}
