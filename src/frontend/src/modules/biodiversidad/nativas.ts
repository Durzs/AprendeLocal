/**
 * Las especies del bosque templado de La Araucanía, con lo que las APIs no
 * saben decir.
 *
 * Por qué hace falta esta lista si ya consultamos iNaturalist y GBIF. Porque
 * una lista de especies bajada de una API es una lista de nombres, y a un
 * curso de 6º no le dice nada. Lo que convierte esa lista en algo enseñable
 * son tres cosas que ninguna de las dos APIs entrega junta y fiable:
 *
 *   1. SI ES NATIVA O NO. En La Araucanía esto no es un detalle académico: la
 *      diferencia entre un renoval de coigüe y una plantación de pino es la
 *      discusión ambiental y política del territorio. Un mapa que las mezcla
 *      sin distinguirlas está enseñando algo falso.
 *   2. CÓMO SE LLAMA EN MAPUZUGUN. El nombre castellano de casi todas estas
 *      especies ES el nombre mapuche castellanizado —coigüe de koywe, quila
 *      de küla, copihue de kopiwe—, y decirlo devuelve al territorio una capa
 *      que estaba ahí antes que el catálogo científico.
 *   3. POR QUÉ IMPORTA. Una frase que un docente pueda repetir.
 *
 * De dónde sale. De literatura de botánica y fauna chilena de referencia
 * general, no de una base de datos consultada en línea.
 */

export type Estado = "en_peligro" | "vulnerable" | "casi_amenazada";

export type Nativa = {
  /** El científico, que es la clave para cruzar con iNaturalist y con GBIF. */
  cientifico: string;
  comun: string;
  /** En mapuzugun, cuando se conoce. Sin validar. */
  mapuzugun?: string;
  grupo: "arbol" | "planta" | "ave" | "mamifero" | "anfibio" | "pez" | "hongo";
  /** Una frase que el docente pueda decir en voz alta. */
  porQue: string;
  estado?: Estado;
  /** Fotografía representativa de la especie. */
  fotoUrl?: string;
};

export type Introducida = {
  cientifico: string;
  comun: string;
  porQue: string;
  fotoUrl?: string;
};

/**
 * Lo que NO es de aquí.
 *
 * Va en su propia lista y se marca en rojo en el mapa. Cuando un curso
 * encuentra pino o zarzamora no está encontrando naturaleza: está encontrando
 * la historia reciente del uso del suelo, y eso también se enseña.
 */
export const INTRODUCIDAS: Introducida[] = [
  {
    cientifico: "Pinus radiata",
    comun: "pino insigne",
    porQue: "Plantación forestal. Bajo un pinar casi no crece nada más, y el suelo se acidifica.",
    fotoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Pinus_radiata_foliage.jpg/640px-Pinus_radiata_foliage.jpg",
  },
  {
    cientifico: "Eucalyptus globulus",
    comun: "eucalipto",
    porQue: "Plantación forestal. Consume mucha agua, y eso se nota en los esteros de al lado.",
    fotoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Eucalyptus_globulus_leaves.jpg/640px-Eucalyptus_globulus_leaves.jpg",
  },
  {
    cientifico: "Rubus ulmifolius",
    comun: "zarzamora, murra",
    porQue: "Invasora. Tapa los claros y no deja que el bosque nativo se regenere.",
    fotoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Rubus_ulmifolius_berries.jpg/640px-Rubus_ulmifolius_berries.jpg",
  },
  {
    cientifico: "Ulex europaeus",
    comun: "espinillo",
    porQue: "Invasora. Coloniza suelo quemado o removido y es muy difícil de sacar.",
    fotoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Ulex_europaeus_flowers.jpg/640px-Ulex_europaeus_flowers.jpg",
  },
  {
    cientifico: "Salmo trutta",
    comun: "trucha café",
    porQue: "Introducida en los ríos. Se come al puye y a los anfibios pequeños.",
    fotoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Salmo_trutta.jpg/640px-Salmo_trutta.jpg",
  },
  {
    cientifico: "Oncorhynchus mykiss",
    comun: "trucha arcoíris",
    porQue: "Introducida. Compite con los peces nativos del mismo estero.",
    fotoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Rainbow_trout.png/640px-Rainbow_trout.png",
  },
];

export const NATIVAS: Nativa[] = [
  // ── Árboles ──
  {
    cientifico: "Araucaria araucana",
    comun: "araucaria, pehuén",
    mapuzugun: "pewen",
    grupo: "arbol",
    porQue:
      "Da el piñón, alimento sagrado del pueblo pewenche. Un árbol puede vivir más de mil años en las alturas volcánicas.",
    estado: "en_peligro",
    fotoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Araucaria_araucana_Conguillio.jpg/640px-Araucaria_araucana_Conguillio.jpg",
  },
  {
    cientifico: "Nothofagus dombeyi",
    comun: "coigüe",
    mapuzugun: "koywe",
    grupo: "arbol",
    porQue: "El árbol más alto del bosque templado. Su copa provee la sombra y humedad donde habita el sotobosque.",
    fotoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Nothofagus_dombeyi_1.jpg/640px-Nothofagus_dombeyi_1.jpg",
  },
  {
    cientifico: "Nothofagus obliqua",
    comun: "roble pellín",
    mapuzugun: "koyam",
    grupo: "arbol",
    porQue: "Su madera es tan dura que se usaba tradicionalmente para las vigas maestras de las rukas.",
    fotoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Nothofagus_obliqua.jpg/640px-Nothofagus_obliqua.jpg",
  },
  {
    cientifico: "Nothofagus alpina",
    comun: "raulí",
    mapuzugun: "ruyli",
    grupo: "arbol",
    porQue: "Hoja grande y ondulada. Árbol emblemático de las laderas andinas con follaje otoñal rojizo.",
    fotoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Nothofagus_alpina_leaves.jpg/640px-Nothofagus_alpina_leaves.jpg",
  },
  {
    cientifico: "Nothofagus pumilio",
    comun: "lenga",
    grupo: "arbol",
    porQue: "El árbol que aguanta más arriba en el límite arbóreo cerca de la nieve. En otoño viste las montañas de rojo.",
    fotoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Nothofagus_pumilio_autumn.jpg/640px-Nothofagus_pumilio_autumn.jpg",
  },
  {
    cientifico: "Drimys winteri",
    comun: "canelo",
    mapuzugun: "foye",
    grupo: "arbol",
    porQue: "Árbol sagrado del pueblo mapuche y símbolo de paz. Presente en el rewe y en ceremonias medicinales.",
    fotoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Drimys_winteri_leaves_and_flowers.jpg/640px-Drimys_winteri_leaves_and_flowers.jpg",
  },
  {
    cientifico: "Persea lingue",
    comun: "lingue",
    mapuzugun: "lige",
    grupo: "arbol",
    porQue: "De su corteza se extraen tinturas tradicionales para el telar. Crece en quebradas húmedas protegidas.",
    fotoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Persea_lingue.jpg/640px-Persea_lingue.jpg",
  },
  {
    cientifico: "Luma apiculata",
    comun: "arrayán",
    grupo: "arbol",
    porQue: "Tronco anaranjado, liso y notablemente frío al tacto. Crece siempre junto a cursos de agua cristalina.",
    fotoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Luma_apiculata.jpg/640px-Luma_apiculata.jpg",
  },
  {
    cientifico: "Embothrium coccineum",
    comun: "notro, ciruelillo",
    mapuzugun: "notxu",
    grupo: "arbol",
    porQue: "En primavera florece con un rojo encendido que nutre a picaflores. Es pionero tras incendios o erupciones.",
    fotoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Embothrium_coccineum_flores.jpg/640px-Embothrium_coccineum_flores.jpg",
  },
  {
    cientifico: "Peumus boldus",
    comun: "boldo",
    grupo: "arbol",
    porQue: "Sus aromáticas hojas se usan en infusión digestiva. Es ley y lawen (planta medicinal de alto valor).",
    fotoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Peumus_boldus.jpg/640px-Peumus_boldus.jpg",
  },

  // ── Plantas del sotobosque ──
  {
    cientifico: "Chusquea quila",
    comun: "quila",
    mapuzugun: "küla",
    grupo: "planta",
    porQue: "Bambú nativo que forma densos matorrales donde se refugian aves y pequeños mamíferos.",
    fotoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Chusquea_cumingii.jpg/640px-Chusquea_cumingii.jpg",
  },
  {
    cientifico: "Gunnera tinctoria",
    comun: "nalca, pangue",
    mapuzugun: "nalka",
    grupo: "planta",
    porQue: "La hoja más grande de la flora chilena. Su tallo tierno se come y sus hojas se usan para tapar el curanto.",
    fotoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Gunnera_tinctoria_1.jpg/640px-Gunnera_tinctoria_1.jpg",
  },
  {
    cientifico: "Aristotelia chilensis",
    comun: "maqui",
    mapuzugun: "maki",
    grupo: "planta",
    porQue: "Fruto silvestre morado con altísimo poder antioxidante. Planta sagrada y regeneradora del suelo.",
    fotoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Aristotelia_chilensis_leaves_and_berries.jpg/640px-Aristotelia_chilensis_leaves_and_berries.jpg",
  },
  {
    cientifico: "Lapageria rosea",
    comun: "copihue",
    mapuzugun: "kopiwe",
    grupo: "planta",
    porQue: "Flor nacional de Chile. Enredadera que escala por los troncos húmedos en bosques sombríos.",
    fotoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Lapageria_rosea_1.jpg/640px-Lapageria_rosea_1.jpg",
  },
  {
    cientifico: "Blechnum chilense",
    comun: "costilla de vaca, quil-quil",
    grupo: "planta",
    porQue: "Helecho gigante de quebradas y cascadas que indica humedad permanente en el ecosistema.",
    fotoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Blechnum_chilense.jpg/640px-Blechnum_chilense.jpg",
  },

  // ── Aves ──
  {
    cientifico: "Scelorchilus rubecula",
    comun: "chucao",
    mapuzugun: "chukaw",
    grupo: "ave",
    porQue:
      "Su canto potente guía al caminante en el sotobosque. En la cosmovisión mapuche avisa el destino según el lado por donde canta.",
    fotoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Scelorchilus_rubecula_-Chile-8.jpg/640px-Scelorchilus_rubecula_-Chile-8.jpg",
  },
  {
    cientifico: "Pteroptochos tarnii",
    comun: "hued-hued del sur",
    grupo: "ave",
    porQue: "Pariente del chucao pero más grande. Corre velozmente entre los troncos caídos en busca de insectos.",
    fotoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Pteroptochos_tarnii.jpg/640px-Pteroptochos_tarnii.jpg",
  },
  {
    cientifico: "Sephanoides sephaniodes",
    comun: "picaflor chico",
    mapuzugun: "pigda",
    grupo: "ave",
    porQue: "El picaflor más austral del planeta. Principal polinizador del notro y el copihue durante todo el año.",
    fotoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Sephanoides_sephaniodes_-Chile-8.jpg/640px-Sephanoides_sephaniodes_-Chile-8.jpg",
  },
  {
    cientifico: "Campephilus magellanicus",
    comun: "carpintero negro",
    grupo: "ave",
    porQue: "El carpintero más grande de Sudamérica. Con su fuerte picoteo abre cavidades en árboles centenarios.",
    estado: "vulnerable",
    fotoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Campephilus_magellanicus_-Conguillio_National_Park%2C_Chile_-male-8.jpg/640px-Campephilus_magellanicus_-Conguillio_National_Park%2C_Chile_-male-8.jpg",
  },
  {
    cientifico: "Enicognathus ferrugineus",
    comun: "cachaña",
    grupo: "ave",
    porQue: "Loro austral muy sociable que vuela en ruidosas bandadas dispersando semillas de piñones y frutos.",
    fotoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Austral_Parakeet.jpg/640px-Austral_Parakeet.jpg",
  },
  {
    cientifico: "Vanellus chilensis",
    comun: "queltehue, treile",
    mapuzugun: "ketxewe",
    grupo: "ave",
    porQue: "Centinela de los potreros y esteros. Con su alarma sonora protege su nido ubicado a ras de suelo.",
    fotoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Southern_Lapwing_RWD2.jpg/640px-Southern_Lapwing_RWD2.jpg",
  },
  {
    cientifico: "Strix rufipes",
    comun: "concón",
    grupo: "ave",
    porQue: "Búho misterioso del bosque nativo antiguo. Su presencia confirma la existencia de árboles maduros.",
    fotoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Strix_rufipes.jpg/640px-Strix_rufipes.jpg",
  },
  {
    cientifico: "Vultur gryphus",
    comun: "cóndor andino",
    mapuzugun: "mañke",
    grupo: "ave",
    porQue: "El ave voladora más grande del mundo. Sobrevuela las altas cumbres y riscos de la cordillera araucana.",
    estado: "vulnerable",
    fotoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Vultur_gryphus_-San_Diego_Zoo-8a.jpg/640px-Vultur_gryphus_-San_Diego_Zoo-8a.jpg",
  },

  // ── Mamíferos ──
  {
    cientifico: "Dromiciops gliroides",
    comun: "monito del monte",
    mapuzugun: "chumaihuén",
    grupo: "mamifero",
    porQue:
      "Fósil viviente y único representante del orden Microbiotheria. Marsupial clave que hiberna en invierno.",
    estado: "casi_amenazada",
    fotoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Dromiciops_gliroides.jpg/640px-Dromiciops_gliroides.jpg",
  },
  {
    cientifico: "Pudu puda",
    comun: "pudú",
    mapuzugun: "püdü",
    grupo: "mamifero",
    porQue: "Uno de los ciervos más pequeños del mundo (40 cm de alto). Muy tímido y dependiente del bosque denso.",
    estado: "vulnerable",
    fotoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Pudu_puda.jpg/640px-Pudu_puda.jpg",
  },
  {
    cientifico: "Leopardus guigna",
    comun: "güiña, kod-kod",
    mapuzugun: "kodkod",
    grupo: "mamifero",
    porQue: "El felino salvaje más pequeño de América. Gran trepador de árboles que controla roedores en el bosque.",
    estado: "vulnerable",
    fotoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Leopardus_guigna_Faunia.jpg/640px-Leopardus_guigna_Faunia.jpg",
  },
  {
    cientifico: "Lycalopex culpaeus",
    comun: "zorro culpeo",
    mapuzugun: "gürü",
    grupo: "mamifero",
    porQue: "El cánido nativo más grande de Chile. Figura central en los relatos tradicionales mapuches.",
    fotoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Lycalopex_culpaeus_standing.jpg/640px-Lycalopex_culpaeus_standing.jpg",
  },
  {
    cientifico: "Lontra provocax",
    comun: "huillín",
    grupo: "mamifero",
    porQue: "Nutria de río nativa de aguas limpias y riberas con vegetación nativa densa.",
    estado: "en_peligro",
    fotoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Lontra_provocax.jpg/640px-Lontra_provocax.jpg",
  },
  {
    cientifico: "Myocastor coypus",
    comun: "coipo",
    mapuzugun: "koypu",
    grupo: "mamifero",
    porQue: "Roedor acuático nativo con membranas en las patas traseras. Indicador de esteros y lagunas sanas.",
    fotoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Myocastor_coypus_in_water.jpg/640px-Myocastor_coypus_in_water.jpg",
  },

  // ── Anfibios ──
  {
    cientifico: "Rhinoderma darwinii",
    comun: "ranita de Darwin",
    grupo: "anfibio",
    porQue:
      "El macho cría a los renacuajos dentro de su saco vocal hasta que emergen formados. Joya biológica única de Chile.",
    estado: "en_peligro",
    fotoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Rhinoderma_darwinii.jpg/640px-Rhinoderma_darwinii.jpg",
  },
  {
    cientifico: "Batrachyla taeniata",
    comun: "sapito de antifaz",
    grupo: "anfibio",
    porQue: "Pequeño anfibio de hojarasca húmeda con una característica franja oscura en los ojos.",
    fotoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Batrachyla_taeniata.jpg/640px-Batrachyla_taeniata.jpg",
  },
  {
    cientifico: "Calyptocephalella gayi",
    comun: "rana grande chilena",
    grupo: "anfibio",
    porQue: "Gigante acuático que puede superar el kilo de peso. Fósil viviente que requiere pozones y esteros tranquilos.",
    estado: "vulnerable",
    fotoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Calyptocephalella_gayi.jpg/640px-Calyptocephalella_gayi.jpg",
  },

  // ── Peces ──
  {
    cientifico: "Galaxias maculatus",
    comun: "puye",
    grupo: "pez",
    porQue: "Pez nativo pequeño y translúcido. Realiza migraciones entre el agua dulce y los estuarios.",
    fotoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Galaxias_maculatus.jpg/640px-Galaxias_maculatus.jpg",
  },

  // ── Hongos ──
  {
    cientifico: "Cyttaria espinosae",
    comun: "digüeñe",
    mapuzugun: "dihweñ",
    grupo: "hongo",
    porQue: "Hongo comestible primaveral que crece en las ramas de robles y coigües. Tradición gastronómica campesina.",
    fotoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Cyttaria_espinosae.jpg/640px-Cyttaria_espinosae.jpg",
  },
  {
    cientifico: "Ramaria flava",
    comun: "changle",
    grupo: "hongo",
    porQue: "Hongo con forma de coral dorado que brota en el suelo del bosque nativo maduro tras las primeras lluvias.",
    fotoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Ramaria_flava.jpg/640px-Ramaria_flava.jpg",
  },
];

/** Todo junto, para cruzar contra lo que devuelvan las APIs. */
const PORNOMBRE = new Map<string, Nativa>(
  NATIVAS.map((n) => [n.cientifico.toLowerCase(), n])
);
const INTRODUCIDA_PORNOMBRE = new Map<string, Introducida>(
  INTRODUCIDAS.map((i) => [i.cientifico.toLowerCase(), i])
);

export type Origen =
  | { tipo: "nativa"; ficha: Nativa }
  | { tipo: "introducida"; ficha: Introducida }
  | { tipo: "desconocido" };

/**
 * Qué sabemos de una especie que nos devolvió una API.
 *
 * Se compara por género y especie, ignorando subespecie y autoría: iNaturalist
 * y GBIF no siempre coinciden en cuánto nombre devuelven, y «Nothofagus
 * dombeyi Mirb. Oerst.» y «Nothofagus dombeyi» son el mismo árbol.
 */
export function reconocer(cientifico: string): Origen {
  const limpio = cientifico.trim().toLowerCase();
  const dosPalabras = limpio.split(/\s+/).slice(0, 2).join(" ");
  const genero = limpio.split(/\s+/)[0] ?? "";

  const nativa =
    PORNOMBRE.get(limpio) ?? PORNOMBRE.get(dosPalabras) ?? PORNOMBRE.get(genero);
  if (nativa) return { tipo: "nativa", ficha: nativa };

  const intro =
    INTRODUCIDA_PORNOMBRE.get(limpio) ??
    INTRODUCIDA_PORNOMBRE.get(dosPalabras) ??
    INTRODUCIDA_PORNOMBRE.get(genero);
  if (intro) return { tipo: "introducida", ficha: intro };

  return { tipo: "desconocido" };
}
