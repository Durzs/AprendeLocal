/**
 * Los Objetivos de Aprendizaje chilenos, en la forma común de §curriculo.ts.
 *
 * Va en su propio archivo para que baje solo con la edición chilena.
 */

import { CURSO_CORTO, EJES, NOMBRE_ASIGNATURA_OA, OBJETIVOS, type OA } from "../crear/oa";
import type { Objetivo } from "./curriculo";

function deOA(o: OA): Objetivo {
  return {
    codigo: o.codigo,
    cursos: [CURSO_CORTO[o.nivel]],
    asignatura: o.asignatura,
    nombreAsignatura: NOMBRE_ASIGNATURA_OA[o.asignatura],
    grupo: EJES[o.eje] ?? o.eje,
    etiqueta: `OA ${o.n}`,
    texto: o.texto,
    claves: o.claves,
  };
}

export const OBJETIVOS_CL: Objetivo[] = OBJETIVOS.map(deOA);
