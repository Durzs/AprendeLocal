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

import { Campo, Fichas, Hoja, Parrafo, Texto } from "./Campos";
import type { Entorno, Evaluacion, Expedicion } from "./expedicion";

const CURSOS = ["5º", "6º", "7º", "8º"];

const EVALUACIONES: { valor: Evaluacion; titulo: string }[] = [
  { valor: "cuaderno", titulo: "Cuaderno de campo" },
  { valor: "producto", titulo: "El producto final" },
  { valor: "presentacion", titulo: "Presentación al curso" },
  { valor: "rubrica", titulo: "Rúbrica por criterios" },
  { valor: "observacion", titulo: "Observación en terreno" },
];

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
      <Hoja titulo="Quién y cuánto">
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

          <Campo etiqueta="Cuántas semanas" ayuda="Tres o cuatro es lo habitual.">
            <Texto
              type="number"
              min={1}
              max={20}
              value={e.semanas ?? ""}
              onChange={(ev) =>
                set("semanas", ev.target.value ? Number(ev.target.value) : null)
              }
              placeholder="3"
            />
          </Campo>
        </div>
      </Hoja>

      <Hoja titulo="Lo que el programa exige">
        <div className="grid gap-5 sm:grid-cols-2">
          <Campo
            etiqueta="Objetivos de aprendizaje"
            ayuda="Los códigos si los tienes a mano, o escritos con tus palabras."
            ancho="entera"
          >
            <Parrafo
              value={e.objetivos}
              onChange={(ev) => set("objetivos", ev.target.value)}
              placeholder="OA 12: medir y comparar volúmenes de agua…"
            />
          </Campo>

          <Campo
            etiqueta="Temas obligatorios de la unidad"
            ayuda="Lo que hay que pasar sí o sí este semestre."
            ancho="entera"
          >
            <Parrafo
              value={e.temasObligatorios}
              onChange={(ev) => set("temasObligatorios", ev.target.value)}
              placeholder="El ciclo del agua. Medición de volumen. Gráficos de barras."
            />
          </Campo>

          <Fichas
            etiqueta="Cómo vas a evaluar"
            ayuda="Marca todas las que uses. Después salen en la hoja de evaluación."
            opciones={EVALUACIONES}
            elegidas={e.evaluacion}
            onElegir={(v) => set("evaluacion", v)}
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
      <Hoja titulo="Dónde queda la escuela">
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

      <Hoja titulo="Qué pasa ahí">
        <div className="grid gap-5 sm:grid-cols-2">
          <Campo etiqueta="Asignatura" ayuda="Desde dónde entras al tema.">
            <Texto
              value={e.asignatura}
              onChange={(ev) => set("asignatura", ev.target.value)}
              placeholder="Ciencias Naturales"
            />
          </Campo>

          <Campo etiqueta="Temáticas" ayuda="Dos o tres palabras.">
            <Texto
              value={e.tematicas}
              onChange={(ev) => set("tematicas", ev.target.value)}
              placeholder="agua, caudal, consumo"
            />
          </Campo>

          <Campo
            etiqueta="Fenómeno local"
            ayuda="Algo que ahí pasa y que en otra escuela no pasaría igual."
            ancho="entera"
          >
            <Parrafo
              value={e.fenomeno}
              onChange={(ev) => set("fenomeno", ev.target.value)}
              placeholder="En verano el estero baja tanto que la bomba de la escuela se queda sin agua."
            />
          </Campo>

          <Campo
            etiqueta="Qué se podría averiguar"
            ayuda="El espacio de indagación: lo que nadie sabe todavía y el curso podría medir."
            ancho="entera"
          >
            <Parrafo
              value={e.indagacion}
              onChange={(ev) => set("indagacion", ev.target.value)}
              placeholder="Cuánta agua lleva el estero en marzo comparado con septiembre."
            />
          </Campo>

          <Campo
            etiqueta="Producto final esperado"
            ayuda="Qué queda al terminar, y que se le pueda pasar a alguien de afuera."
            ancho="entera"
          >
            <Texto
              value={e.producto}
              onChange={(ev) => set("producto", ev.target.value)}
              placeholder="Un informe de una plana con el caudal medido, para el comité de agua"
            />
          </Campo>
        </div>
      </Hoja>
    </div>
  );
}
