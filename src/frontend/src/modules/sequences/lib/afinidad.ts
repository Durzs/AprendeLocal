/**
 * Afinidad entre un objetivo de aprendizaje y un lugar.
 *
 * El formulario dejaba elegir cualquier objetivo con cualquier lugar, y eso
 * permite construir disparates: «estructuras básicas del sistema digestivo» en
 * una cancha de palín. La secuencia sale igual —el modelo siempre escribe
 * algo—, pero el lugar no sostiene nada: es decorado. Y una plataforma de
 * educación basada en el lugar que produce decorado se desmiente sola.
 *
 * Así que el emparejamiento se calcula y se muestra, en tres bandas:
 *
 *   sirve      el lugar aporta materia al objetivo
 *   quizas     hay relación, pero el docente tiene que juzgarla
 *   no_aporta  ninguna coincidencia
 *
 * Y —esto es lo que de verdad importa— cuando ningún lugar aporta, se dice.
 * De los 62 objetivos cargados hay una franja entera —sistema digestivo,
 * pubertad, células, tabaco— que no se ancla en ningún territorio, y forzarla
 * a terreno le añade trabajo al docente sin añadirle aprendizaje al curso.
 * Reconocerlo es lo que separa la educación basada en el lugar de la excursión
 * con nombre bonito.
 *
 * El cálculo es léxico y deliberadamente simple: se explica entero en los
 * motivos que devuelve, para que el docente pueda no estar de acuerdo. No
 * pretende más precisión de la que tiene.
 */

import type { CurriculumObjective, POIFeature } from "../../../types";

export type Banda = "sirve" | "quizas" | "no_aporta";

export type Afinidad = {
  puntos: number;
  banda: Banda;
  /** Qué coincidió, en palabras: «agua», «patrimonio mapuche»… */
  motivos: string[];
};

/** Los datos vienen con guiones bajos (`bosque_nativo`): cuentan como palabras. */
function normalizar(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[_-]+/g, " ");
}

/**
 * Temas que pueden anclar un objetivo en un lugar. Cada uno necesita las dos
 * mitades: que el objetivo trate de eso y que el lugar sea eso. Una sola mitad
 * no vale — un estero no ayuda a enseñar el sistema digestivo por ser un
 * estero.
 *
 * Las listas se escribieron mirando los valores reales de la base: los ejes y
 * las palabras clave de `curriculum_objectives`, y los `ecosystem_type`,
 * `threats` y `heritage_type` de `points_of_interest`.
 *
 * Lo que queda deliberadamente FUERA es tan importante como lo que entra. No
 * están «célula», «tejido», «órgano», «nutriente» ni «átomo»: son contenidos
 * de microscopio y de pizarra, y un bosque no los enseña mejor por ser bosque.
 *
 * Y no pesan igual. Unos son específicos —o el lugar es un curso de agua o no
 * lo es— y por sí solos justifican la salida. Otros son ambientales: la
 * temperatura se mide en cualquier parte, y casi todo lugar tiene alguna
 * amenaza, así que coincidir en eso no dice gran cosa.
 */
const FUERTE = 5;
const DEBIL = 2;

const TEMAS: { nombre: string; peso: number; objetivo: RegExp; lugar: RegExp }[] = [
  {
    nombre: "agua",
    peso: FUERTE,
    objetivo:
      /\bagua|hidrolog|oceano|glaciar|\brios?\b|\blagos?\b|caudal|cuenca|lluvia|humedad|riego|acuatic|hidrosfera/,
    lugar: /fluvial|lacustre|vertiente|humedal|estero|\brio\b|lago|vega|surgencia|cascada|salto/,
  },
  {
    nombre: "seres vivos y ecosistemas",
    peso: FUERTE,
    objetivo:
      /biodivers|especie|ecosistema|seres? vivo|habitat|fauna|flora|\bplanta|animal|adaptac|cadenas? alimentaria|redes? alimentaria|fotosintesis|nativ|endemic|tropismo|poliniza|sucesion|\becolog/,
    lugar: /bosque|matorral|pradera|renoval|humedal|vega|nativo|coigue|roble|rauli|quila|fauna|helecho/,
  },
  {
    nombre: "geología y volcanes",
    peso: FUERTE,
    objetivo:
      /volcan|vulcanolog|\brocas?\b|mineral|sismo|terremoto|tectonic|placas|erosion|geolog|relieve|lava|\bsuelo|sediment|litosfera|capas tierra/,
    lugar: /volcanic|volcan|geolog|\broca|quebrada|montano|trumao|afloramiento|suelo|cordiller|glaciar/,
  },
  {
    nombre: "clima y atmósfera",
    peso: DEBIL,
    objetivo: /\bclima|atmosfer|meteorolog|temperatura|cambio climatico|humedad/,
    lugar: /montano|volcan|lago|humedal|bosque|quebrada|vega/,
  },
  {
    nombre: "patrimonio mapuche",
    peso: FUERTE,
    objetivo: /cultur|patrimoni|pueblo|mapuche|histori|memoria|identidad|tradicion|comunidad/,
    lugar: /cultural mapuche|mapuche|rewe|nguillatu|fogon|ruka|palin|ceremonial|lawentuche|medicinal/,
  },
  {
    // «electric» a secas sobraba: un circuito de pila y ampolleta se arma en la
    // mesa del aula, y arrastraba todos los objetivos de electricidad hasta el
    // estero. Queda lo que un lugar sí aporta: generación renovable y calor
    // medido en terreno.
    nombre: "energía",
    peso: DEBIL,
    objetivo:
      /energia renovab|recursos? (naturales )?energetic|generacion electric|energia (hidr|solar|eolic|geoterm)|\bcalor\b|termic|energia termica/,
    lugar: /volcan|termas|hidroelectr|salto|vertiente|\brio\b|fluvial/,
  },
  {
    // «proteccion» a secas colaba «conductas de protección» del objetivo de
    // drogas contra las amenazas de cualquier lugar.
    nombre: "impacto ambiental",
    peso: DEBIL,
    objetivo:
      /contaminac|residuo|basura|reciclaj|impacto ambiental|conservacion|sustentab|recursos naturales|actividad humana|deterioro|proteger|proteccion (de|del|ambiental)/,
    lugar:
      /contaminacion|deforestacion|\btala\b|erosion|drenaje|eutrofizacion|extraccion|monocultivo|herbicida|basura|incendio|sequia|canalizacion|urbana/,
  },
];

/**
 * El catálogo ya etiqueta cada lugar con sus áreas STEM. Sirve para reforzar un
 * tema que ya coincidió, nunca para crear uno: si valiera por sí solo, todo
 * bosque saldría afín a todo objetivo de biología —incluido el aparato
 * digestivo—, que es exactamente el error que esto viene a corregir.
 */
const AREAS_POR_EJE: Record<string, RegExp> = {
  ciencias_tierra: /geolog|hidrolog|ecolog|quimic/,
  fisica: /fisica|geolog|vulcanolog/,
  ciencias_fisicas: /fisica|quimic/,
  quimica: /quimic/,
  biologia: /biolog|ecolog/,
  ciencias_vida: /biolog|ecolog/,
};

function textoDelObjetivo(oa: CurriculumObjective): string {
  return normalizar(
    [oa.description ?? "", oa.axis ?? "", (oa.keywords ?? []).join(" ")].join(" ")
  );
}

function propiedades(p: POIFeature): Record<string, unknown> {
  return p.properties as unknown as Record<string, unknown>;
}

function textoDelLugar(p: POIFeature): string {
  const pr = propiedades(p);
  const lista = (v: unknown) => (Array.isArray(v) ? v.join(" ") : "");
  return normalizar(
    [
      String(pr.name ?? ""),
      String(pr.type ?? ""),
      String(pr.ecosystem ?? pr.ecosystem_type ?? ""),
      String(pr.heritage_type ?? ""),
      String(pr.description ?? ""),
      lista(pr.threats),
      lista(pr.stem_areas),
    ].join(" ")
  );
}

/**
 * Palabras demasiado comunes para que su coincidencia signifique algo. Las
 * disciplinas («biologia», «geologia») están aquí porque ya entran por el canal
 * de las áreas STEM: contarlas dos veces inflaría la afinidad. Y «actividad» y
 * «fisica» salen de partir «actividad física», que casaba alegremente con
 * «actividad volcánica» y con el área STEM «fisica» de cualquier lugar.
 */
const VACIAS = new Set([
  "agua", "energia", "salud", "chile", "datos", "medio", "ambiente",
  "experimentacion", "modelos", "sistema", "sistemas", "cambio", "cambios",
  "actividad", "fisica", "natural", "naturales", "formacion", "materia",
  "humana", "superficie", "agentes", "propiedades", "estructuras",
  "biologia", "ecologia", "geologia", "quimica", "matematica", "tecnologia",
  "hidrologia", "vulcanologia", "historia",
]);

export function afinidad(oa: CurriculumObjective, lugar: POIFeature): Afinidad {
  const tObjetivo = textoDelObjetivo(oa);
  const tLugar = textoDelLugar(lugar);

  let puntos = 0;
  const motivos: string[] = [];

  for (const tema of TEMAS) {
    if (tema.objetivo.test(tObjetivo) && tema.lugar.test(tLugar)) {
      puntos += tema.peso;
      motivos.push(tema.nombre);
    }
  }

  // Coincidencia literal de las palabras clave del objetivo con el lugar. Las
  // claves vienen como frases («cadenas alimentarias»), así que se parten. Se
  // prueba también el singular porque el currículum habla en plural —«ríos»,
  // «lagos»— y los lugares se llaman en singular: «Río Allipén», «Lago Colico».
  for (const frase of oa.keywords ?? []) {
    for (const palabra of normalizar(frase).split(/\s+/)) {
      const singular = palabra.replace(/e?s$/, "");
      // El filtro se aplica también al singular: «químicas» no estaba en la
      // lista de vacías pero «quimica» sí, y colaba por la puerta de atrás.
      if (palabra.length < 5 || VACIAS.has(palabra) || VACIAS.has(singular)) continue;
      const encontrada = tLugar.includes(palabra)
        ? palabra
        : singular.length >= 4 && tLugar.includes(singular)
          ? singular
          : null;
      if (encontrada && !motivos.includes(encontrada)) {
        puntos += 2;
        motivos.push(encontrada);
      }
    }
  }

  // Refuerzo, nunca origen: solo suma si algún tema ya coincidió.
  if (puntos > 0) {
    const areas = AREAS_POR_EJE[oa.axis ?? ""];
    const pr = propiedades(lugar);
    const stem = Array.isArray(pr.stem_areas) ? normalizar(pr.stem_areas.join(" ")) : "";
    if (areas && stem && areas.test(stem)) puntos += 1;
  }

  // Con los pesos anteriores, el umbral cae solo: un tema fuerte (5) basta para
  // «sirve»; uno débil (2), o un par de palabras clave sueltas, se quedan en
  // «quizás» y es el docente quien decide. Un único vínculo ambiental
  // —«temperatura», que se mide en cualquier parte— no alcanza para decirle a
  // nadie que vale la pena sacar al curso.
  const banda: Banda = puntos >= FUERTE ? "sirve" : puntos > 0 ? "quizas" : "no_aporta";
  return { puntos, banda, motivos };
}

export type LugarPuntuado = { lugar: POIFeature; afinidad: Afinidad };

/** Ordena de más a menos afín; a igualdad, alfabético para que no baile. */
export function ordenarPorAfinidad(
  oa: CurriculumObjective | undefined,
  lugares: POIFeature[]
): LugarPuntuado[] {
  if (!oa) {
    return lugares.map((lugar) => ({
      lugar,
      afinidad: { puntos: 0, banda: "no_aporta" as const, motivos: [] },
    }));
  }

  return lugares
    .map((lugar) => ({ lugar, afinidad: afinidad(oa, lugar) }))
    .sort((a, b) => {
      if (b.afinidad.puntos !== a.afinidad.puntos) {
        return b.afinidad.puntos - a.afinidad.puntos;
      }
      return String(a.lugar.properties.name).localeCompare(
        String(b.lugar.properties.name),
        "es"
      );
    });
}
