/**
 * Las especies del bosque templado de La Araucanía, con lo que las APIs no
 * saben decir.
 *
 * Cada especie cuenta con su fotografía oficial verificada de iNaturalist,
 * nombres en Mapuzugun y notas docentes para el aula.
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
  /** Fotografía representativa oficial de la especie. */
  fotoUrl?: string;
};

export type Introducida = {
  cientifico: string;
  comun: string;
  porQue: string;
  fotoUrl?: string;
};

/**
 * Lo que NO es de aquí (especies introducidas e invasoras).
 */
export const INTRODUCIDAS: Introducida[] = [
  {
    cientifico: "Pinus radiata",
    comun: "pino insigne",
    porQue: "Plantación forestal. Bajo un pinar casi no crece nada más, y el suelo se acidifica.",
    fotoUrl: "https://inaturalist-open-data.s3.amazonaws.com/photos/168316058/medium.jpg",
  },
  {
    cientifico: "Eucalyptus globulus",
    comun: "eucalipto",
    porQue: "Plantación forestal. Consume mucha agua, y eso se nota en los esteros de al lado.",
    fotoUrl: "https://static.inaturalist.org/photos/30675602/medium.jpg",
  },
  {
    cientifico: "Rubus ulmifolius",
    comun: "zarzamora, murra",
    porQue: "Invasora. Tapa los claros y no deja que el bosque nativo se regenere.",
    fotoUrl: "https://inaturalist-open-data.s3.amazonaws.com/photos/37606/medium.jpg",
  },
  {
    cientifico: "Ulex europaeus",
    comun: "espinillo",
    porQue: "Invasora. Coloniza suelo quemado o removido y es muy difícil de sacar.",
    fotoUrl: "https://inaturalist-open-data.s3.amazonaws.com/photos/459991680/medium.jpg",
  },
  {
    cientifico: "Salmo trutta",
    comun: "trucha café",
    porQue: "Introducida en los ríos. Se come al puye y a los anfibios pequeños.",
    fotoUrl: "https://inaturalist-open-data.s3.amazonaws.com/photos/34847723/medium.jpg",
  },
  {
    cientifico: "Oncorhynchus mykiss",
    comun: "trucha arcoíris",
    porQue: "Introducida. Compite con los peces nativos del mismo estero.",
    fotoUrl: "https://static.inaturalist.org/photos/60921460/medium.jpg",
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
    fotoUrl: "https://inaturalist-open-data.s3.amazonaws.com/photos/176887961/medium.jpg",
  },
  {
    cientifico: "Nothofagus dombeyi",
    comun: "coigüe",
    mapuzugun: "koywe",
    grupo: "arbol",
    porQue: "El árbol más alto del bosque templado. Su copa provee la sombra y humedad donde habita el sotobosque.",
    fotoUrl: "https://static.inaturalist.org/photos/27177332/medium.jpeg",
  },
  {
    cientifico: "Nothofagus obliqua",
    comun: "roble pellín",
    mapuzugun: "koyam",
    grupo: "arbol",
    porQue: "Su madera es tan dura que se usaba tradicionalmente para las vigas maestras de las rukas.",
    fotoUrl: "https://static.inaturalist.org/photos/27150090/medium.jpeg",
  },
  {
    cientifico: "Nothofagus alpina",
    comun: "raulí",
    mapuzugun: "ruyli",
    grupo: "arbol",
    porQue: "Hoja grande y ondulada. Árbol emblemático de las laderas andinas con follaje otoñal rojizo.",
    fotoUrl: "https://inaturalist-open-data.s3.amazonaws.com/photos/475340040/medium.jpg",
  },
  {
    cientifico: "Nothofagus pumilio",
    comun: "lenga",
    grupo: "arbol",
    porQue: "El árbol que aguanta más arriba en el límite arbóreo cerca de la nieve. En otoño viste las montañas de rojo.",
    fotoUrl: "https://inaturalist-open-data.s3.amazonaws.com/photos/75075173/medium.jpg",
  },
  {
    cientifico: "Drimys winteri",
    comun: "canelo",
    mapuzugun: "foye",
    grupo: "arbol",
    porQue: "Árbol sagrado del pueblo mapuche y símbolo de paz. Presente en el rewe y en ceremonias medicinales.",
    fotoUrl: "https://inaturalist-open-data.s3.amazonaws.com/photos/1542790/medium.jpg",
  },
  {
    cientifico: "Persea lingue",
    comun: "lingue",
    mapuzugun: "lige",
    grupo: "arbol",
    porQue: "De su corteza se extraen tinturas tradicionales para el telar. Crece en quebradas húmedas protegidas.",
    fotoUrl: "https://inaturalist-open-data.s3.amazonaws.com/photos/188777834/medium.jpg",
  },
  {
    cientifico: "Luma apiculata",
    comun: "arrayán",
    grupo: "arbol",
    porQue: "Tronco anaranjado, liso y notablemente frío al tacto. Crece siempre junto a cursos de agua cristalina.",
    fotoUrl: "https://inaturalist-open-data.s3.amazonaws.com/photos/1541071/medium.jpg",
  },
  {
    cientifico: "Embothrium coccineum",
    comun: "notro, ciruelillo",
    mapuzugun: "notxu",
    grupo: "arbol",
    porQue: "En primavera florece con un rojo encendido que nutre a picaflores. Es pionero tras incendios o erupciones.",
    fotoUrl: "https://inaturalist-open-data.s3.amazonaws.com/photos/587661720/medium.jpg",
  },
  {
    cientifico: "Peumus boldus",
    comun: "boldo",
    grupo: "arbol",
    porQue: "Sus aromáticas hojas se usan en infusión digestiva. Es ley y lawen (planta medicinal de alto valor).",
    fotoUrl: "https://inaturalist-open-data.s3.amazonaws.com/photos/142596835/medium.jpg",
  },

  // ── Plantas del sotobosque ──
  {
    cientifico: "Chusquea quila",
    comun: "quila",
    mapuzugun: "küla",
    grupo: "planta",
    porQue: "Bambú nativo que forma densos matorrales donde se refugian aves y pequeños mamíferos.",
    fotoUrl: "https://inaturalist-open-data.s3.amazonaws.com/photos/100760355/medium.jpg",
  },
  {
    cientifico: "Gunnera tinctoria",
    comun: "nalca, pangue",
    mapuzugun: "nalka",
    grupo: "planta",
    porQue: "La hoja más grande de la flora chilena. Su tallo tierno se come y sus hojas se usan para tapar el curanto.",
    fotoUrl: "https://inaturalist-open-data.s3.amazonaws.com/photos/125734/medium.jpg",
  },
  {
    cientifico: "Aristotelia chilensis",
    comun: "maqui",
    mapuzugun: "maki",
    grupo: "planta",
    porQue: "Fruto silvestre morado con altísimo poder antioxidante. Planta sagrada y regeneradora del suelo.",
    fotoUrl: "https://inaturalist-open-data.s3.amazonaws.com/photos/28746610/medium.jpg",
  },
  {
    cientifico: "Lapageria rosea",
    comun: "copihue",
    mapuzugun: "kopiwe",
    grupo: "planta",
    porQue: "Flor nacional de Chile. Enredadera que escala por los troncos húmedos en bosques sombríos.",
    fotoUrl: "https://static.inaturalist.org/photos/62761239/medium.jpeg",
  },
  {
    cientifico: "Blechnum chilense",
    comun: "costilla de vaca, quil-quil",
    grupo: "planta",
    porQue: "Helecho gigante de quebradas y cascadas que indica humedad permanente en el ecosistema.",
    fotoUrl: "https://inaturalist-open-data.s3.amazonaws.com/photos/31461704/medium.jpg",
  },

  // ── Aves ──
  {
    cientifico: "Scelorchilus rubecula",
    comun: "chucao",
    mapuzugun: "chukaw",
    grupo: "ave",
    porQue:
      "Su canto potente guía al caminante en el sotobosque. En la cosmovisión mapuche avisa el destino según el lado por donde canta.",
    fotoUrl: "https://static.inaturalist.org/photos/285165353/medium.jpeg",
  },
  {
    cientifico: "Pteroptochos tarnii",
    comun: "hued-hued del sur",
    grupo: "ave",
    porQue: "Pariente del chucao pero más grande. Corre velozmente entre los troncos caídos en busca de insectos.",
    fotoUrl: "https://static.inaturalist.org/photos/285165396/medium.jpg",
  },
  {
    cientifico: "Sephanoides sephaniodes",
    comun: "picaflor chico",
    mapuzugun: "pigda",
    grupo: "ave",
    porQue: "El picaflor más austral del planeta. Principal polinizador del notro y el copihue durante todo el año.",
    fotoUrl: "https://inaturalist-open-data.s3.amazonaws.com/photos/238706641/medium.jpg",
  },
  {
    cientifico: "Campephilus magellanicus",
    comun: "carpintero negro",
    grupo: "ave",
    porQue: "El carpintero más grande de Sudamérica. Con su fuerte picoteo abre cavidades en árboles centenarios.",
    estado: "vulnerable",
    fotoUrl: "https://inaturalist-open-data.s3.amazonaws.com/photos/48405/medium.jpg",
  },
  {
    cientifico: "Enicognathus ferrugineus",
    comun: "cachaña",
    grupo: "ave",
    porQue: "Loro austral muy sociable que vuela en ruidosas bandadas dispersando semillas de piñones y frutos.",
    fotoUrl: "https://inaturalist-open-data.s3.amazonaws.com/photos/198371508/medium.jpeg",
  },
  {
    cientifico: "Vanellus chilensis",
    comun: "queltehue, treile",
    mapuzugun: "ketxewe",
    grupo: "ave",
    porQue: "Centinela de los potreros y esteros. Con su alarma sonora protege su nido ubicado a ras de suelo.",
    fotoUrl: "https://static.inaturalist.org/photos/601222938/medium.jpg",
  },
  {
    cientifico: "Strix rufipes",
    comun: "concón",
    grupo: "ave",
    porQue: "Búho misterioso del bosque nativo antiguo. Su presencia confirma la existencia de árboles maduros.",
    fotoUrl: "https://inaturalist-open-data.s3.amazonaws.com/photos/384798110/medium.jpeg",
  },
  {
    cientifico: "Vultur gryphus",
    comun: "cóndor andino",
    mapuzugun: "mañke",
    grupo: "ave",
    porQue: "El ave voladora más grande del mundo. Sobrevuela las altas cumbres y riscos de la cordillera araucana.",
    estado: "vulnerable",
    fotoUrl: "https://inaturalist-open-data.s3.amazonaws.com/photos/90906598/medium.jpg",
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
    fotoUrl: "https://inaturalist-open-data.s3.amazonaws.com/photos/6096/medium.jpg",
  },
  {
    cientifico: "Pudu puda",
    comun: "pudú",
    mapuzugun: "püdü",
    grupo: "mamifero",
    porQue: "Uno de los ciervos más pequeños del mundo (40 cm de alto). Muy tímido y dependiente del bosque denso.",
    estado: "vulnerable",
    fotoUrl: "https://inaturalist-open-data.s3.amazonaws.com/photos/263624688/medium.jpg",
  },
  {
    cientifico: "Leopardus guigna",
    comun: "güiña, kod-kod",
    mapuzugun: "kodkod",
    grupo: "mamifero",
    porQue: "El felino salvaje más pequeño de América. Gran trepador de árboles que controla roedores en el bosque.",
    estado: "vulnerable",
    fotoUrl: "https://inaturalist-open-data.s3.amazonaws.com/photos/403906400/medium.jpeg",
  },
  {
    cientifico: "Lycalopex culpaeus",
    comun: "zorro culpeo",
    mapuzugun: "gürü",
    grupo: "mamifero",
    porQue: "El cánido nativo más grande de Chile. Figura central en los relatos tradicionales mapuches.",
    fotoUrl: "https://inaturalist-open-data.s3.amazonaws.com/photos/487960433/medium.jpg",
  },
  {
    cientifico: "Lontra provocax",
    comun: "huillín",
    grupo: "mamifero",
    porQue: "Nutria de río nativa de aguas limpias y riberas con vegetación nativa densa.",
    estado: "en_peligro",
    fotoUrl: "https://inaturalist-open-data.s3.amazonaws.com/photos/38082946/medium.jpg",
  },
  {
    cientifico: "Myocastor coypus",
    comun: "coipo",
    mapuzugun: "koypu",
    grupo: "mamifero",
    porQue: "Roedor acuático nativo con membranas en las patas traseras. Indicador de esteros y lagunas sanas.",
    fotoUrl: "https://inaturalist-open-data.s3.amazonaws.com/photos/136260379/medium.jpeg",
  },

  // ── Anfibios ──
  {
    cientifico: "Rhinoderma darwinii",
    comun: "ranita de Darwin",
    grupo: "anfibio",
    porQue:
      "El macho cría a los renacuajos dentro de su saco vocal hasta que emergen formados. Joya biológica única de Chile.",
    estado: "en_peligro",
    fotoUrl: "https://static.inaturalist.org/photos/57901672/medium.jpeg",
  },
  {
    cientifico: "Batrachyla taeniata",
    comun: "sapito de antifaz",
    grupo: "anfibio",
    porQue: "Pequeño anfibio de hojarasca húmeda con una característica franja oscura en los ojos.",
    fotoUrl: "https://static.inaturalist.org/photos/357596074/medium.jpg",
  },
  {
    cientifico: "Calyptocephalella gayi",
    comun: "rana grande chilena",
    grupo: "anfibio",
    porQue: "Gigante acuático que puede superar el kilo de peso. Fósil viviente que requiere pozones y esteros tranquilos.",
    estado: "vulnerable",
    fotoUrl: "https://inaturalist-open-data.s3.amazonaws.com/photos/69691825/medium.jpg",
  },

  // ── Peces ──
  {
    cientifico: "Galaxias maculatus",
    comun: "puye",
    grupo: "pez",
    porQue: "Pez nativo pequeño y translúcido. Realiza migraciones entre el agua dulce y los estuarios.",
    fotoUrl: "https://static.inaturalist.org/photos/6037920/medium.jpg",
  },

  // ── Hongos ──
  {
    cientifico: "Cyttaria espinosae",
    comun: "digüeñe",
    mapuzugun: "dihweñ",
    grupo: "hongo",
    porQue: "Hongo comestible primaveral que crece en las ramas de robles y coigües. Tradición gastronómica campesina.",
    fotoUrl: "https://inaturalist-open-data.s3.amazonaws.com/photos/64640152/medium.jpeg",
  },
  {
    cientifico: "Ramaria flava",
    comun: "changle",
    grupo: "hongo",
    porQue: "Hongo con forma de coral dorado que brota en el suelo del bosque nativo maduro tras las primeras lluvias.",
    fotoUrl: "https://static.inaturalist.org/photos/35300556/medium.jpeg",
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
 * Se compara por género y especie, ignorando subespecie y autoría.
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
