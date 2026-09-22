/**
 * El currículum brasileño: la BNCC de los anos finais.
 *
 * Es el equivalente de §oa.ts para la sede `br`. Mismo papel —de aquí cuelgan
 * las actividades, los indicadores y lo que se imprime en el papeleo— y una
 * forma distinta, porque la BNCC no está organizada como las Bases
 * Curriculares chilenas.
 *
 * LAS TRES DIFERENCIAS QUE OBLIGARON A UN TIPO PROPIO
 *
 * La primera es la que más duele: los códigos no numeran todos igual.
 * Matemática, Ciências, História y Geografia numeran por año, así que
 * `EF06CI01` es de 6º y de ningún otro. Língua Portuguesa y Arte numeran por
 * banda: `EF69AR01` es de 6º, 7º, 8º y 9º a la vez. Son 166 de las 570. Por eso
 * aquí hay `anos: AnoBNCC[]` y no el `nivel` único que tiene el tipo chileno;
 * meterlas con un nivel obligatorio habría obligado a elegirle un año falso a
 * casi un tercio del currículum.
 *
 * La segunda: História y Geografia son componentes separados. En Chile vienen
 * juntas en una asignatura.
 *
 * La tercera: no hay componente de Tecnología. En los anos finais la cultura
 * digital es transversal, y se decidió que esa columna no exista en la edición
 * brasileña en vez de inventarle un mapeo a los 26 objetivos chilenos.
 *
 * DE DÓNDE SALEN LOS DATOS
 *
 * De `bncc-dev/bncc-dados`, que publica la BNCC como datos abiertos y verifica
 * cada texto carácter a carácter contra el PDF homologado de 2018. Las 570 que
 * se cargaron están verificadas; el generador se niega a escribir una que no
 * lo esté. Cada una guarda la página donde se comprobó, así que una que
 * parezca rara se puede ir a mirar al documento.
 *
 * Los archivos de `bncc/` están generados por `scripts/generar-bncc.py` y no se
 * editan a mano.
 */

import { ARTE } from "./bncc/arte";
import { CIENCIAS } from "./bncc/ciencias";
import { GEOGRAFIA } from "./bncc/geografia";
import { HISTORIA } from "./bncc/historia";
import { LINGUA_PORTUGUESA } from "./bncc/lingua_portuguesa";
import { MATEMATICA } from "./bncc/matematica";

/** Los años que cubre la edición carioca. */
export type AnoBNCC = 6 | 7 | 8 | 9;

export type ComponenteBNCC =
  | "lingua_portuguesa"
  | "matematica"
  | "ciencias"
  | "historia"
  | "geografia"
  | "arte";

export const NOMBRE_COMPONENTE: Record<ComponenteBNCC, string> = {
  lingua_portuguesa: "Língua Portuguesa",
  matematica: "Matemática",
  ciencias: "Ciências",
  historia: "História",
  geografia: "Geografia",
  arte: "Arte",
};

export type Habilidade = {
  /** El código con que aparece en la BNCC: «EF06CI01», «EF69AR01». */
  codigo: string;
  /**
   * Los años que cubre. Uno para las que numeran por año; los cuatro para las
   * de banda. Nunca está vacío.
   */
  anos: AnoBNCC[];
  componente: ComponenteBNCC;
  /**
   * Con qué encabezado se agrupa en la lista. Es la unidade temática, salvo en
   * Língua Portuguesa, que se organiza por campo de actuación y práctica de
   * lenguaje y viene resuelto a una sola cadena.
   */
  unidade: string;
  texto: string;
  /**
   * Para buscar por palabra suelta sin acordarse del código.
   *
   * Derivadas del texto, no curadas a mano como las chilenas. Se dice porque
   * cambia lo que se puede esperar de ellas: encuentran la palabra que está
   * escrita en la habilidad, no sinónimos ni el término con que un docente
   * llamaría a esa cosa en la sala.
   */
  claves: string[];
  /** La página del PDF homologado donde se verificó el texto. */
  pagina: number;
};

export const HABILIDADES: Habilidade[] = [
  ...CIENCIAS,
  ...MATEMATICA,
  ...LINGUA_PORTUGUESA,
  ...HISTORIA,
  ...GEOGRAFIA,
  ...ARTE,
];

/** Una habilidad por su código. */
export function buscarHabilidade(codigo: string): Habilidade | undefined {
  return HABILIDADES.find((h) => h.codigo === codigo);
}

/**
 * Las habilidades de un año, opcionalmente de un componente.
 *
 * Una de banda aparece en los cuatro años, que es lo correcto: `EF69AR01` es
 * tan de 6º como de 9º, y un docente de 7º tiene que poder marcarla sin
 * enterarse de que el código dice «69».
 */
export function habilidadesDe(
  ano: AnoBNCC,
  componente?: ComponenteBNCC
): Habilidade[] {
  return HABILIDADES.filter(
    (h) => h.anos.includes(ano) && (!componente || h.componente === componente)
  );
}

/** Los componentes que tienen habilidades cargadas, en el orden del documento. */
export function componentesConHabilidades(): ComponenteBNCC[] {
  const orden: ComponenteBNCC[] = [
    "ciencias",
    "matematica",
    "lingua_portuguesa",
    "historia",
    "geografia",
    "arte",
  ];
  return orden.filter((c) => HABILIDADES.some((h) => h.componente === c));
}

/**
 * Filtra por texto, código o palabra clave.
 *
 * Sin acentos a los dos lados: quien busca «ciencias» tiene que encontrar
 * «Ciências», y en el teclado de un computador de escuela el acento es un
 * obstáculo, no un dato.
 */
export function filtrarHabilidades(
  lista: Habilidade[],
  consulta: string
): Habilidade[] {
  const q = sinAcentos(consulta.trim().toLowerCase());
  if (!q) return lista;
  return lista.filter(
    (h) =>
      sinAcentos(h.codigo.toLowerCase()).includes(q) ||
      sinAcentos(h.texto.toLowerCase()).includes(q) ||
      sinAcentos(h.unidade.toLowerCase()).includes(q) ||
      h.claves.some((c) => c.includes(q))
  );
}

function sinAcentos(s: string): string {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "");
}

/** Cómo se nombra un año en pantalla. */
export const ANO_CORTO: Record<AnoBNCC, string> = {
  6: "6º",
  7: "7º",
  8: "8º",
  9: "9º",
};
