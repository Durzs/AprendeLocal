/**
 * Los Objetivos de Desarrollo Sostenible, para el demo del congreso.
 *
 * El demo se muestra en congresos de educación para el desarrollo sostenible,
 * y ahí los ODS son el idioma común: quien pasa por el stand reconoce el
 * número y el color antes de leer el texto. Por eso cada problemática lleva
 * los suyos a la vista y el color de la tarjeta sale del primero.
 *
 * QUÉ ES Y QUÉ NO ES
 *
 * La relación entre una problemática y sus ODS es nuestra lectura, no una
 * clasificación oficial de Naciones Unidas. Se eligió el ODS cuyo tema es el
 * asunto mismo (el agua de un río va al 6 y al 15, que cubre también los
 * ecosistemas de agua dulce) y se dejó fuera lo que solo toca de lado. Todas
 * las problemáticas son además ODS 4, meta 4.7, que es lo que hace el método
 * entero: eso va una vez en la portada del demo y no repetido en cada tarjeta.
 *
 * Los colores son los de la paleta pública de los ODS. No se usan los íconos
 * oficiales, que tienen sus propias reglas de uso.
 */

import type { Bi } from "../../shared/tx";

export type Ods = {
  n: number;
  color: string;
  /** Si el texto encima va oscuro. Sobre el amarillo y el celeste, el blanco no se lee. */
  claro: boolean;
  nombre: Bi;
};

export const ODS: Record<number, Ods> = {
  2: { n: 2, color: "#DDA63A", claro: true, nombre: { es: "Hambre cero", pt: "Fome zero" } },
  3: { n: 3, color: "#4C9F38", claro: true, nombre: { es: "Salud y bienestar", pt: "Saúde e bem-estar" } },
  4: { n: 4, color: "#C5192D", claro: false, nombre: { es: "Educación de calidad", pt: "Educação de qualidade" } },
  6: { n: 6, color: "#26BDE2", claro: true, nombre: { es: "Agua limpia y saneamiento", pt: "Água potável e saneamento" } },
  7: { n: 7, color: "#FCC30B", claro: true, nombre: { es: "Energía asequible y no contaminante", pt: "Energia limpa e acessível" } },
  8: { n: 8, color: "#A21942", claro: false, nombre: { es: "Trabajo decente", pt: "Trabalho decente" } },
  9: { n: 9, color: "#FD6925", claro: true, nombre: { es: "Industria, innovación e infraestructura", pt: "Indústria, inovação e infraestrutura" } },
  10: { n: 10, color: "#DD1367", claro: false, nombre: { es: "Reducción de las desigualdades", pt: "Redução das desigualdades" } },
  11: { n: 11, color: "#FD9D24", claro: true, nombre: { es: "Ciudades y comunidades sostenibles", pt: "Cidades e comunidades sustentáveis" } },
  12: { n: 12, color: "#BF8B2E", claro: true, nombre: { es: "Producción y consumo responsables", pt: "Consumo e produção responsáveis" } },
  13: { n: 13, color: "#3F7E44", claro: false, nombre: { es: "Acción por el clima", pt: "Ação contra a mudança do clima" } },
  14: { n: 14, color: "#0A97D9", claro: true, nombre: { es: "Vida submarina", pt: "Vida na água" } },
  15: { n: 15, color: "#56C02B", claro: true, nombre: { es: "Vida de ecosistemas terrestres", pt: "Vida terrestre" } },
};

/** Los diecisiete colores en orden, para la franja de la portada. */
export const FRANJA_ODS = [
  "#E5243B", "#DDA63A", "#4C9F38", "#C5192D", "#FF3A21", "#26BDE2", "#FCC30B", "#A21942", "#FD6925",
  "#DD1367", "#FD9D24", "#BF8B2E", "#3F7E44", "#0A97D9", "#56C02B", "#00689D", "#19486A",
];

/**
 * Con qué ODS conecta cada problemática del catálogo.
 *
 * Una problemática nueva que no esté aquí sale con el 4, que es verdad de
 * todas, y avisa en la consola en desarrollo para que alguien la agregue.
 */
const POR_PROBLEMA: Record<string, number[]> = {
  // Chile
  rio_contaminado: [6, 15],
  falta_agua: [6, 13],
  basura: [12, 11],
  aire_lena: [3, 7, 11],
  suelo_erosion: [15, 2],
  bosque_que_retrocede: [15, 13],
  memoria_oficios: [11, 8],
  lengua_que_se_calla: [11, 10],
  sin_conexion: [9, 10],
  pueblo_que_se_vacia: [11, 10],
  alimentacion_escolar: [2, 3, 12],
  // Brasil
  br_baia_guanabara: [6, 14],
  br_encostas: [11, 13],
};

export function odsDe(problemaId: string): Ods[] {
  const ns = POR_PROBLEMA[problemaId];
  if (!ns && import.meta.env.DEV) {
    console.warn(`congreso/ods: la problemática «${problemaId}» no tiene ODS asignados.`);
  }
  return (ns ?? [4]).map((n) => ODS[n]).filter(Boolean);
}

/**
 * Las asignaturas que cuentan como STEM: ciencias, tecnología y matemática.
 *
 * Geografía, historia, lenguaje y artes no entran, y eso es a propósito: el
 * medidor del demo muestra cuánto STEM tiene la ruta armada, y cuando un
 * visitante suma historia o artes lo que ve es que el proyecto se vuelve
 * interdisciplinario, que es la otra mitad del mensaje.
 */
const STEM = new Set(["biologia", "quimica", "fisica", "matematica", "tecnologia", "ciencias"]);

export function esStem(asignatura: string): boolean {
  return STEM.has(asignatura);
}

/** El color de cada una de las seis etapas, en el orden del método. */
export const COLOR_ETAPA: Record<string, { fondo: string; claro: boolean }> = {
  problematica: { fondo: "#FD6925", claro: true },
  aula: { fondo: "#26BDE2", claro: true },
  terreno: { fondo: "#56C02B", claro: true },
  analisis: { fondo: "#FCC30B", claro: true },
  propuesta: { fondo: "#DD1367", claro: false },
  difusion: { fondo: "#19486A", claro: false },
};
