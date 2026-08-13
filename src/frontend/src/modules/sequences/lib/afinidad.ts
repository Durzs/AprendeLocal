/**
 * Afinidad entre un objetivo de aprendizaje y un lugar.
 *
 * El formulario dejaba elegir cualquier objetivo con cualquier lugar, y eso
 * permite construir disparates: «estructuras básicas del sistema digestivo» en
 * una cancha de palín. La secuencia sale igual —el modelo siempre escribe
 * algo—, pero el lugar no está sosteniendo nada: es decorado. Y una plataforma
 * de educación basada en el lugar que produce decorado se desmiente sola.
 *
 * Así que el emparejamiento se calcula y se muestra. Tres bandas:
 *
 *   sirve     el lugar aporta materia al objetivo
 *   quizás    hay una relación, pero el docente tiene que juzgarla
 *   no aporta ninguna coincidencia
 *
 * Y —esto es lo importante— cuando ningún lugar aporta, se dice. Hay objetivos
 * que se enseñan mejor en el aula, y forzarlos a terreno le añade trabajo al
 * docente sin añadirle aprendizaje al curso. Reconocerlo es lo que separa la
 * educación basada en el lugar de la excursión con nombre bonito.
 *
 * El cálculo es léxico y deliberadamente simple: se explica entero en los
 * motivos que devuelve, de modo que el docente pueda no estar de acuerdo. No
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

function normalizar(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

/**
 * Temas que pueden anclar un objetivo en un lugar. Cada uno necesita las dos
 * mitades: que el objetivo hable de eso y que el lugar sea eso. Una sola mitad
 * no vale —un río no ayuda a enseñar el sistema digestivo por ser un río—.
 */
const TEMAS: { nombre: string; objetivo: RegExp; lugar: RegExp }[] = [
  {
    nombre: "agua",
    objetivo: /agua|hidric|hidrolog|caudal|cuenca|\brio\b|lluvia|precipitac|humedad|riego/,
    lugar: /\brio\b|estero|lago|laguna|humedal|hidrolog|cascada|salto|vertiente|termas|confluencia/,
  },
  {
    nombre: "seres vivos y ecosistemas",
    objetivo:
      /biodivers|especie|ecosistema|ser vivo|seres vivos|habitat|fauna|flora|planta|animal|adaptac|cadena alimentaria|fotosintesis|nativa|endemic/,
    lugar: /bosque|reserva|parque|araucaria|nativ|santuario|humedal|natural|monumento/,
  },
  {
    nombre: "geología y relieve",
    objetivo: /volcan|roca|mineral|sismo|terremoto|placa|erosion|geolog|relieve|lava|suelo|sedimento/,
    lugar: /volcan|geolog|roca|cueva|cordiller|lava|crater|termas|morrena|acantilado/,
  },
  {
    nombre: "cielo y astronomía",
    objetivo: /astronom|estrella|planeta|universo|cielo|constelac|galaxia|eclipse/,
    lugar: /observatorio|mirador|cielo|cerro|cumbre|cima/,
  },
  {
    nombre: "patrimonio y memoria",
    objetivo: /cultur|patrimoni|pueblo|mapuche|histori|memoria|identidad|tradicion|lengua|comunidad/,
    lugar: /cultural|patrimoni|mapuche|ruka|palin|ceremonial|nguillatun|sitio|cementerio|museo/,
  },
  {
    nombre: "energía",
    objetivo: /energi|electric|\bcalor\b|temperatura|combustib|renovab|potencia/,
    lugar: /central|hidroelectr|termas|volcan|salto|eolic|solar/,
  },
  {
    nombre: "impacto ambiental",
    objetivo: /contaminac|residuo|basura|reciclaj|impacto ambiental|conservac|amenaza|deterioro/,
    lugar: /vertedero|basural|relleno|contaminac|degradad|erosionad/,
  },
];

/** El propio catálogo etiqueta cada lugar con sus áreas STEM: se aprovecha. */
const AREAS_POR_ASIGNATURA: Record<string, RegExp> = {
  "ciencias naturales": /biolog|ecolog|ciencias|geolog|hidrolog|astronom|quimic|fisica/,
  biologia: /biolog|ecolog/,
  fisica: /fisica|astronom|energi/,
  quimica: /quimic/,
  matematica: /matemat|estadis|medicion/,
  matematicas: /matemat|estadis|medicion/,
  tecnologia: /tecnolog|ingenier/,
  historia: /histori|patrimoni|cultur|social/,
  geografia: /geograf|territori|geolog/,
};

function textoDelObjetivo(oa: CurriculumObjective): string {
  return normalizar(
    [oa.description, oa.axis ?? "", (oa.keywords ?? []).join(" ")].join(" ")
  );
}

function textoDelLugar(p: POIFeature): string {
  const pr = p.properties as Record<string, unknown>;
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

export function afinidad(oa: CurriculumObjective, lugar: POIFeature): Afinidad {
  const tObjetivo = textoDelObjetivo(oa);
  const tLugar = textoDelLugar(lugar);

  let puntos = 0;
  const motivos: string[] = [];

  for (const tema of TEMAS) {
    if (tema.objetivo.test(tObjetivo) && tema.lugar.test(tLugar)) {
      puntos += 3;
      motivos.push(tema.nombre);
    }
  }

  // Coincidencia directa de las palabras clave del objetivo con el lugar.
  for (const clave of oa.keywords ?? []) {
    const k = normalizar(clave);
    if (k.length >= 4 && tLugar.includes(k) && !motivos.includes(k)) {
      puntos += 2;
      motivos.push(k);
    }
  }

  // Las áreas STEM que el catálogo ya le asignó al lugar.
  const areas = AREAS_POR_ASIGNATURA[normalizar(oa.subject ?? "")];
  const pr = lugar.properties as Record<string, unknown>;
  const stem = Array.isArray(pr.stem_areas) ? normalizar(pr.stem_areas.join(" ")) : "";
  if (areas && stem && areas.test(stem)) {
    puntos += 2;
    if (motivos.length === 0) motivos.push(`área de ${oa.subject?.toLowerCase()}`);
  }

  const banda: Banda = puntos >= 3 ? "sirve" : puntos > 0 ? "quizas" : "no_aporta";
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
      afinidad: { puntos: 0, banda: "no_aporta", motivos: [] },
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
