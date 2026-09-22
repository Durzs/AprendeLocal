/**
 * Lo que el cuaderno trae de cada país, en un solo sitio.
 *
 * Es la segunda de las dos tablas de §shared/sede.ts. La primera dice el
 * idioma y la región; esta dice qué hay dentro del cuaderno: qué cursos, qué
 * currículum, desde qué asignaturas se entra, qué problemáticas hay para
 * elegir, dónde se busca en el mapa y qué papeles se imprimen para la salida.
 *
 * El método —las seis etapas, las técnicas de terreno, los formatos del
 * producto— es el mismo en los dos países y no está aquí: cambia de idioma,
 * no de contenido, y eso lo resuelve §shared/tx.ts.
 *
 * PARA AGREGAR O CAMBIAR ALGO DE UN PAÍS
 *
 * Se toca su entrada de `CONTENIDOS` y el archivo de datos al que apunta. Las
 * pantallas no preguntan en qué país están: leen `useContenido()`. Si alguna
 * vez aparece un `if (sede === "br")` en un componente del cuaderno, lo que
 * falta es un campo aquí.
 */

import { use, useMemo } from "react";

import { useSede, type Sede } from "../../../shared/sede";
import {
  ASIGNATURAS,
  FAMILIAS_PROBLEMA,
  PROBLEMAS,
  QUE_SACAN_DE_LA_NOTICIA,
  type Familia,
  type Problema,
} from "../metodo/problemas";
import {
  ASIGNATURAS_BR,
  FAMILIAS_BR,
  PROBLEMAS_BR,
  QUE_SACAN_PT,
} from "../metodo/problemas.br";
import { GEO_BR, GEO_CL, type Geo } from "../metodo/lugar";
import { registrarObjetivos, type Objetivo } from "./curriculo";

export type Contenido = {
  sede: Sede;
  /** Los cursos que se pueden marcar en la sala. */
  cursos: string[];
  /** Cómo se completa el nombre de un curso: «7º básico», «7º ano». */
  nombreCurso: (curso: string) => string;
  /** El currículum, ya traducido a la forma común. Ver §curriculo.ts. */
  objetivos: Objetivo[];
  /** Cómo se llama en pantalla lo que se marca, y de dónde sale. */
  palabras: {
    objetivo: string;
    objetivos: string;
    /** El nombre formal, con mayúsculas, como va en los papeles. */
    Objetivos: string;
    /** El documento del que salen. */
    fuente: string;
    /** Qué se escribe en el buscador como ejemplo. */
    ejemploBusqueda: string;
  };
  /** Desde qué asignaturas se entra a una problemática. */
  asignaturas: { id: string; nombre: string }[];
  familias: Familia[];
  problemas: Problema[];
  queSacan: { titulo: string; queEs: string; seNotaEn: string }[];
  /** Cómo se busca en el mapa. Ver §metodo/lugar.ts. */
  geo: Geo;
  /** Cómo se llama la unidad local donde se buscan noticias: comuna, bairro. */
  localidad: string;
  /** Un sitio público de ejemplo para el operador `site:` del buscador. */
  sitioEjemplo: string;
  /**
   * Qué papeles se arman para la salida. Ver §metodo/Permisos.tsx: en Chile
   * son el formulario de la Superintendencia y la autorización de
   * apoderados; en Brasil, un plan para la dirección y la autorización de los
   * responsables, como modelo.
   */
  papeles: "cl" | "br";
};

/** Todo menos el currículum, que baja aparte. Ver `cargarObjetivos`. */
export const CONTENIDOS: Record<Sede, Omit<Contenido, "objetivos">> = {
  cl: {
    sede: "cl",
    cursos: ["5º", "6º", "7º", "8º"],
    nombreCurso: (c) => `${c} básico`,
    palabras: {
      objetivo: "objetivo",
      objetivos: "objetivos",
      Objetivos: "Objetivos de Aprendizaje",
      fuente: "Bases Curriculares",
      ejemploBusqueda: "agua, promedio, porcentaje, células…",
    },
    asignaturas: ASIGNATURAS,
    familias: FAMILIAS_PROBLEMA,
    problemas: PROBLEMAS,
    queSacan: QUE_SACAN_DE_LA_NOTICIA,
    geo: GEO_CL,
    localidad: "comuna",
    sitioEjemplo: "site:bcn.cl",
    papeles: "cl",
  },
  br: {
    sede: "br",
    // Los anos finais. El 5º ano chileno equivale a los anos iniciais
    // brasileños, que esta edición no cubre todavía.
    cursos: ["6º", "7º", "8º", "9º"],
    nombreCurso: (c) => `${c} ano`,
    palabras: {
      objetivo: "habilidade",
      objetivos: "habilidades",
      Objetivos: "Habilidades da BNCC",
      fuente: "BNCC",
      ejemploBusqueda: "água, média, porcentagem, notícia…",
    },
    asignaturas: ASIGNATURAS_BR,
    familias: FAMILIAS_BR,
    problemas: PROBLEMAS_BR,
    queSacan: QUE_SACAN_PT,
    geo: GEO_BR,
    localidad: "bairro",
    sitioEjemplo: "site:prefeitura.rio",
    papeles: "br",
  },
};

/*
 * El currículum de cada edición, cuando haga falta.
 *
 * Los objetivos chilenos y las habilidades brasileñas pesaban juntos 70 KB
 * comprimidos dentro del cuaderno, y cada docente usa solo los de su país.
 * Ahora cada lista baja la primera vez que alguien abre el cuaderno de esa
 * edición, y después queda en memoria.
 */
const CARGADORES: Record<Sede, () => Promise<Objetivo[]>> = {
  cl: () => import("./objetivos.cl").then((m) => m.OBJETIVOS_CL),
  br: () => import("./objetivos.br").then((m) => m.OBJETIVOS_BR),
};

const PROMESAS: Partial<Record<Sede, Promise<Objetivo[]>>> = {};

/** Pide el currículum de una edición. Se puede llamar muchas veces: baja una. */
export function cargarObjetivos(s: Sede): Promise<Objetivo[]> {
  if (!PROMESAS[s]) {
    const p = CARGADORES[s]().then((lista) => {
      registrarObjetivos(lista);
      // Así la marca React en `use`: si ya llegó, no vuelve a suspender y la
      // página no pasa por la barra de carga una segunda vez.
      Object.assign(p, { status: "fulfilled", value: lista });
      return lista;
    });
    PROMESAS[s] = p;
  }
  return PROMESAS[s];
}

/**
 * Lo del país que se está viendo.
 *
 * Suspende hasta que llega el currículum, así que quien lo usa tiene que estar
 * dentro de un `<Suspense>`; el `Layout` pone uno alrededor de cada página.
 */
export function useContenido(): Contenido {
  const sede = useSede();
  const objetivos = use(cargarObjetivos(sede));
  return useMemo(() => ({ ...CONTENIDOS[sede], objetivos }), [sede, objetivos]);
}

/** Una problemática, de cualquiera de las dos ediciones. */
export function problemaPorIdEn(c: Pick<Contenido, "problemas">, id: string): Problema | undefined {
  return c.problemas.find((p) => p.id === id);
}

/** El nombre de una asignatura, en la edición que toca. */
export function nombreAsignaturaEn(c: Pick<Contenido, "asignaturas">, id: string): string {
  return c.asignaturas.find((a) => a.id === id)?.nombre ?? id;
}
