/**
 * Los objetivos del currículum, con una sola forma para las dos ediciones.
 *
 * Chile trae Objetivos de Aprendizaje de las Bases Curriculares (§crear/oa.ts)
 * y Brasil trae habilidades de la BNCC (§crear/bncc.ts). No se parecen: los
 * chilenos tienen un solo curso y se nombran por número dentro del curso («OA
 * 12»); los brasileños pueden cubrir cuatro años a la vez y se nombran por su
 * código («EF69AR01»). Las pantallas no deberían tener que saberlo.
 *
 * Aquí se traducen los dos a `Objetivo`, que es lo único que leen el selector,
 * la columna de la problemática, los indicadores y los papeles de la salida.
 * Los dos catálogos siguen siendo la fuente; esto es solo la ventanilla.
 *
 * Los códigos de un país y del otro no se pisan, así que `buscarObjetivo`
 * busca en todos los cargados sin preguntar de qué edición es.
 */

export type Objetivo = {
  /** El código tal como lo cita el documento oficial. */
  codigo: string;
  /** En qué cursos de la sala se puede marcar: «5º», «6º»… */
  cursos: string[];
  asignatura: string;
  nombreAsignatura: string;
  /** Con qué encabezado se agrupa: el eje chileno o la unidade temática. */
  grupo: string;
  /** Cómo lo nombra un docente en voz alta: «OA 12» o «EF06CI01». */
  etiqueta: string;
  texto: string;
  claves: string[];
};

/*
 * Los datos de cada país están en §objetivos.cl.ts y §objetivos.br.ts y bajan
 * por separado: los 353 objetivos chilenos y las 570 habilidades brasileñas
 * pesan juntos lo mismo que el resto del cuaderno, y cada docente necesita
 * solo los de su edición. Ver `cargarObjetivos` en §index.ts.
 *
 * Aquí queda el índice por código, que se va llenando a medida que llegan.
 */
const INDICE = new Map<string, Objetivo>();

export function registrarObjetivos(lista: Objetivo[]): void {
  for (const o of lista) INDICE.set(o.codigo, o);
}

export function buscarObjetivo(codigo: string): Objetivo | undefined {
  return INDICE.get(codigo);
}

/** Los de un curso de la sala, en el orden del catálogo. */
export function objetivosDelCurso(lista: Objetivo[], curso: string): Objetivo[] {
  return lista.filter((o) => o.cursos.includes(curso));
}

/**
 * Filtra por lo que el docente escribió en la caja de búsqueda.
 *
 * Sin tildes y sin mayúsculas: quien escribe «celulas» o «ciencias» con prisa
 * tiene que encontrar «células» y «Ciências».
 */
export function filtrarObjetivos(lista: Objetivo[], consulta: string): Objetivo[] {
  const q = normalizar(consulta.trim());
  if (!q) return lista;
  const partes = q.split(/\s+/);
  return lista.filter((o) => {
    const heno = normalizar(
      `${o.codigo} ${o.etiqueta} ${o.nombreAsignatura} ${o.grupo} ${o.texto} ${o.claves.join(" ")}`
    );
    return partes.every((p) => heno.includes(p));
  });
}

function normalizar(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}
