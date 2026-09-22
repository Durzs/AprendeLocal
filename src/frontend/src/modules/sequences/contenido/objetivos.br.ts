/**
 * Las habilidades de la BNCC, en la forma común de §curriculo.ts.
 *
 * Va en su propio archivo para que baje solo con la edición brasileña.
 */

import {
  ANO_CORTO,
  HABILIDADES,
  NOMBRE_COMPONENTE,
  componentesConHabilidades,
  type Habilidade,
} from "../crear/bncc";
import type { Objetivo } from "./curriculo";

function deHabilidade(h: Habilidade): Objetivo {
  return {
    codigo: h.codigo,
    cursos: h.anos.map((a) => ANO_CORTO[a]),
    asignatura: h.componente,
    nombreAsignatura: NOMBRE_COMPONENTE[h.componente],
    grupo: h.unidade,
    etiqueta: h.codigo,
    texto: h.texto,
    claves: h.claves,
  };
}

/** En el orden del documento: por componente, y dentro por código. */
export const OBJETIVOS_BR: Objetivo[] = (() => {
  const orden = componentesConHabilidades();
  return HABILIDADES.map(deHabilidade).sort((a, b) =>
    a.asignatura === b.asignatura
      ? a.codigo.localeCompare(b.codigo)
      : orden.indexOf(a.asignatura as never) - orden.indexOf(b.asignatura as never)
  );
})();
