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
 * general, no de una base de datos consultada en línea. Por eso:
 *
 * · Los nombres en mapuzugun van en Azümchefe y SIN VALIDAR por un hablante,
 *   igual que los de las rutas.
 * · El estado de conservación solo se anota donde hay poca duda, y aun así
 *   hay que contrastarlo con el Reglamento de Clasificación de Especies
 *   vigente: las categorías cambian y esta lista no se actualiza sola.
 *
 * La lista es corta a propósito. No pretende ser el catálogo de la región:
 * son las especies que un curso puede encontrar caminando desde su escuela.
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
};

/**
 * Lo que NO es de aquí.
 *
 * Va en su propia lista y se marca en rojo en el mapa. Cuando un curso
 * encuentra pino o zarzamora no está encontrando naturaleza: está encontrando
 * la historia reciente del uso del suelo, y eso también se enseña.
 */
export const INTRODUCIDAS: { cientifico: string; comun: string; porQue: string }[] = [
  {
    cientifico: "Pinus radiata",
    comun: "pino insigne",
    porQue: "Plantación forestal. Bajo un pinar casi no crece nada más, y el suelo se acidifica.",
  },
  {
    cientifico: "Eucalyptus globulus",
    comun: "eucalipto",
    porQue: "Plantación forestal. Consume mucha agua, y eso se nota en los esteros de al lado.",
  },
  {
    cientifico: "Rubus ulmifolius",
    comun: "zarzamora, murra",
    porQue: "Invasora. Tapa los claros y no deja que el bosque nativo se regenere.",
  },
  {
    cientifico: "Ulex europaeus",
    comun: "espinillo",
    porQue: "Invasora. Coloniza suelo quemado o removido y es muy difícil de sacar.",
  },
  {
    cientifico: "Salmo trutta",
    comun: "trucha café",
    porQue: "Introducida en los ríos. Se come al puye y a los anfibios pequeños.",
  },
  {
    cientifico: "Oncorhynchus mykiss",
    comun: "trucha arcoíris",
    porQue: "Introducida. Compite con los peces nativos del mismo estero.",
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
      "Da el piñón, que fue alimento base del pueblo pewenche y se sigue recogiendo. Un árbol puede vivir mil años.",
    estado: "en_peligro",
  },
  {
    cientifico: "Nothofagus dombeyi",
    comun: "coigüe",
    mapuzugun: "koywe",
    grupo: "arbol",
    porQue: "El árbol más alto del bosque de acá. Su copa es la que da la sombra donde vive todo lo demás.",
  },
  {
    cientifico: "Nothofagus obliqua",
    comun: "roble pellín",
    mapuzugun: "koyam",
    grupo: "arbol",
    porQue: "Su madera es tan dura que se usaba para las vigas de las rukas y de las casas.",
  },
  {
    cientifico: "Nothofagus alpina",
    comun: "raulí",
    mapuzugun: "ruyli",
    grupo: "arbol",
    porQue: "Hoja grande y dentada. Fue tan cortado por su madera que quedan pocos bosques adultos.",
  },
  {
    cientifico: "Nothofagus pumilio",
    comun: "lenga",
    grupo: "arbol",
    porQue: "El que aguanta más arriba, cerca de la nieve. En otoño el cerro entero se pone rojo.",
  },
  {
    cientifico: "Drimys winteri",
    comun: "canelo",
    mapuzugun: "foye",
    grupo: "arbol",
    porQue: "Árbol sagrado del pueblo mapuche. Está en el rewe y en la ceremonia. No se corta.",
  },
  {
    cientifico: "Persea lingue",
    comun: "lingue",
    mapuzugun: "lige",
    grupo: "arbol",
    porQue: "De su corteza se saca tintura para teñir. Crece en las quebradas húmedas.",
  },
  {
    cientifico: "Luma apiculata",
    comun: "arrayán",
    grupo: "arbol",
    porQue: "Tronco anaranjado y liso, frío al tacto incluso en verano. Crece pegado al agua.",
  },
  {
    cientifico: "Embothrium coccineum",
    comun: "notro, ciruelillo",
    mapuzugun: "notxu",
    grupo: "arbol",
    porQue: "En noviembre se llena de flores rojas y aparecen los picaflores. Es el primero que vuelve tras un incendio.",
  },
  {
    cientifico: "Peumus boldus",
    comun: "boldo",
    grupo: "arbol",
    porQue: "Sus hojas se usan en infusión para el estómago. Es lawen, planta que cura.",
  },

  // ── Plantas del sotobosque ──
  {
    cientifico: "Chusquea quila",
    comun: "quila",
    mapuzugun: "küla",
    grupo: "planta",
    porQue: "El bambú de acá. Florece toda junta cada muchos años, y después mueren todas a la vez.",
  },
  {
    cientifico: "Gunnera tinctoria",
    comun: "nalca, pangue",
    mapuzugun: "nalka",
    grupo: "planta",
    porQue: "La hoja más grande del bosque. El tallo se come pelado, y crece donde hay agua todo el año.",
  },
  {
    cientifico: "Aristotelia chilensis",
    comun: "maqui",
    mapuzugun: "maki",
    grupo: "planta",
    porQue: "Su fruto morado se come y tiñe. Es de las primeras que aparecen cuando el bosque se abre.",
  },
  {
    cientifico: "Lapageria rosea",
    comun: "copihue",
    mapuzugun: "kopiwe",
    grupo: "planta",
    porQue: "La flor nacional de Chile, y trepa por los troncos. Está protegida: no se arranca.",
  },
  {
    cientifico: "Blechnum chilense",
    comun: "quilquil, costilla de vaca",
    grupo: "planta",
    porQue: "Helecho grande de lugares sombríos y húmedos. Si está, es que ahí no da el sol nunca.",
  },

  // ── Aves ──
  {
    cientifico: "Scelorchilus rubecula",
    comun: "chucao",
    mapuzugun: "chukaw",
    grupo: "ave",
    porQue:
      "Se oye antes de verlo, siempre en el suelo del bosque. En la tradición mapuche su canto avisa según de qué lado venga.",
  },
  {
    cientifico: "Pteroptochos tarnii",
    comun: "hued-hued",
    grupo: "ave",
    porQue: "Pariente del chucao, más grande y más escondido. Corre en vez de volar.",
  },
  {
    cientifico: "Sephanoides sephaniodes",
    comun: "picaflor chico",
    mapuzugun: "pigda",
    grupo: "ave",
    porQue: "El único picaflor que aguanta el invierno acá. Poliniza el notro y el copihue.",
  },
  {
    cientifico: "Campephilus magellanicus",
    comun: "carpintero negro",
    grupo: "ave",
    porQue: "El carpintero más grande de Sudamérica. Necesita árboles viejos y muertos para hacer su nido.",
    estado: "vulnerable",
  },
  {
    cientifico: "Enicognathus ferrugineus",
    comun: "cachaña",
    grupo: "ave",
    porQue: "El loro más austral del mundo. Anda en bandadas y come piñones.",
  },
  {
    cientifico: "Vanellus chilensis",
    comun: "queltehue, treile",
    mapuzugun: "ketxewe",
    grupo: "ave",
    porQue: "Grita cuando alguien se acerca al potrero. Anida en el suelo abierto, así que es fácil pisarle el nido.",
  },
  {
    cientifico: "Strix rufipes",
    comun: "concón",
    grupo: "ave",
    porQue: "Búho del bosque nativo. Si se oye de noche, es que queda bosque adulto cerca.",
  },

  // ── Mamíferos ──
  {
    cientifico: "Dromiciops gliroides",
    comun: "monito del monte",
    grupo: "mamifero",
    porQue:
      "Marsupial, pariente de los de Australia, y el último de su linaje. Dispersa las semillas del quintral. Duerme en invierno.",
    estado: "casi_amenazada",
  },
  {
    cientifico: "Pudu puda",
    comun: "pudú",
    mapuzugun: "püdü",
    grupo: "mamifero",
    porQue: "El ciervo más pequeño del mundo, del alto de una rodilla. Lo matan los perros sueltos.",
    estado: "vulnerable",
  },
  {
    cientifico: "Leopardus guigna",
    comun: "güiña, kod-kod",
    mapuzugun: "kodkod",
    grupo: "mamifero",
    porQue: "El gato salvaje más chico de América. Necesita bosque continuo, y por eso desaparece con la tala.",
    estado: "vulnerable",
  },
  {
    cientifico: "Lycalopex culpaeus",
    comun: "zorro culpeo",
    mapuzugun: "gürü",
    grupo: "mamifero",
    porQue: "El zorro grande. Aparece en los cuentos mapuches como el astuto que casi siempre pierde.",
  },
  {
    cientifico: "Myocastor coypus",
    comun: "coipo",
    mapuzugun: "koypu",
    grupo: "mamifero",
    porQue: "Roedor de agua. Si hay coipo en el estero, es que el agua está razonablemente limpia.",
  },

  // ── Anfibios ──
  {
    cientifico: "Rhinoderma darwinii",
    comun: "ranita de Darwin",
    grupo: "anfibio",
    porQue:
      "El macho se traga los renacuajos y los cría dentro de su boca. No existe en ninguna otra parte del mundo.",
    estado: "en_peligro",
  },
  {
    cientifico: "Batrachyla taeniata",
    comun: "sapito de antifaz",
    grupo: "anfibio",
    porQue: "Vive bajo la hojarasca húmeda del bosque. Es de los primeros que se van si el bosque se seca.",
  },
  {
    cientifico: "Calyptocephalella gayi",
    comun: "rana grande chilena",
    grupo: "anfibio",
    porQue: "Puede pesar más de un kilo. Se la comieron casi entera y hoy queda en pocos lugares.",
    estado: "vulnerable",
  },

  // ── Peces y agua ──
  {
    cientifico: "Galaxias maculatus",
    comun: "puye",
    grupo: "pez",
    porQue: "Pez chico y transparente. Baja al mar y vuelve al río, y la trucha introducida se lo come.",
  },
  {
    cientifico: "Aegla",
    comun: "pancora",
    grupo: "pez",
    porQue:
      "Cangrejo de agua dulce, bajo las piedras del estero. Si está, el agua tiene oxígeno y poca contaminación.",
  },
];

/** Todo junto, para cruzar contra lo que devuelvan las APIs. */
const PORNOMBRE = new Map<string, Nativa>(
  NATIVAS.map((n) => [n.cientifico.toLowerCase(), n])
);
const INTRODUCIDA_PORNOMBRE = new Map(
  INTRODUCIDAS.map((i) => [i.cientifico.toLowerCase(), i])
);

export type Origen =
  | { tipo: "nativa"; ficha: Nativa }
  | { tipo: "introducida"; ficha: { cientifico: string; comun: string; porQue: string } }
  | { tipo: "desconocido" };

/**
 * Qué sabemos de una especie que nos devolvió una API.
 *
 * Se compara por género y especie, ignorando subespecie y autoría: iNaturalist
 * y GBIF no siempre coinciden en cuánto nombre devuelven, y «Nothofagus
 * dombeyi Mirb. Oerst.» y «Nothofagus dombeyi» son el mismo árbol.
 *
 * «desconocido» NO significa introducida. Significa que no está en nuestra
 * lista, que es corta a propósito. Decir «no sé» es más útil que adivinar.
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
