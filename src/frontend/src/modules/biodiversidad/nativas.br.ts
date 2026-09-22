import type { Nativa } from "./nativas";

/**
 * Doce especies de la Mata Atlântica que un curso de Río puede encontrar.
 *
 * Es el equivalente de `NATIVAS` para la edición brasileña. Se eligieron
 * entre las que tienen observaciones de grado de investigación en
 * iNaturalist dentro del municipio de Río de Janeiro (place_id 23734),
 * consultado el 22 de septiembre de 2026, para que ninguna sea una especie
 * que el curso solo va a ver en un libro. Hay aves, mamíferos, un reptil, un
 * crustáceo del manglar y cuatro plantas, porque en la ciudad se sale a la
 * plaza, a la laguna, al manglar y al borde de la mata.
 *
 * EL ESTADO DE CONSERVACIÓN
 *
 * Va con su fuente. La lista de la UICN es mundial y la de CNCFlora es
 * brasileña, y no siempre dicen lo mismo: la juçara está fuera de peligro
 * para la UICN y es vulnerable para CNCFlora, que es lo que le importa a una
 * escuela carioca. Antes de imprimir hay que confirmarlo en la lista nacional
 * vigente del Ministerio del Medio Ambiente, y la pantalla lo dice.
 *
 * LAS FOTOS
 *
 * Vienen de iNaturalist, con licencias Creative Commons; se eligieron las que
 * tienen licencia abierta y no las «todos los derechos reservados».
 */
export const NATIVAS_BR: Nativa[] = [
  {
    cientifico: "Ramphastos vitellinus",
    comun: "tucano-de-bico-preto",
    grupo: "ave",
    porQue:
      "Aparece nas árvores do Parque Nacional da Tijuca e dos bairros encostados na mata. Come frutos e espalha as sementes.",
    fotoUrl: "https://inaturalist-open-data.s3.amazonaws.com/photos/210402416/medium.jpg",
  },
  {
    cientifico: "Turdus rufiventris",
    comun: "sabiá-laranjeira",
    grupo: "ave",
    porQue:
      "O canto que se ouve de madrugada na primavera, até no meio da cidade. É a ave-símbolo do Brasil.",
    fotoUrl: "https://inaturalist-open-data.s3.amazonaws.com/photos/1507197/medium.jpg",
  },
  {
    cientifico: "Ramphocelus bresilius",
    comun: "tiê-sangue",
    grupo: "ave",
    porQue:
      "Só existe no Brasil, na Mata Atlântica. O macho é vermelho vivo e a fêmea é parda: dá para perguntar à turma por que seriam diferentes.",
    fotoUrl: "https://inaturalist-open-data.s3.amazonaws.com/photos/26314668/medium.jpeg",
  },
  {
    cientifico: "Tangara seledon",
    comun: "saíra-sete-cores",
    grupo: "ave",
    porQue:
      "Anda em bandos pelas copas e só vive na Mata Atlântica. Contar as cores com a turma é um bom exercício de observação.",
    fotoUrl: "https://inaturalist-open-data.s3.amazonaws.com/photos/366557/medium.jpg",
  },
  {
    cientifico: "Hydrochoerus hydrochaeris",
    comun: "capivara",
    grupo: "mamifero",
    porQue:
      "O maior roedor do mundo. Vive na beira das lagoas e dos rios da cidade, perto de casas e condomínios.",
    fotoUrl: "https://inaturalist-open-data.s3.amazonaws.com/photos/91546944/medium.jpg",
  },
  {
    cientifico: "Caiman latirostris",
    comun: "jacaré-de-papo-amarelo",
    grupo: "reptil",
    porQue:
      "Vive nas lagoas da Baixada de Jacarepaguá, cercadas de prédios e de esgoto. Um bom ponto de partida para falar da qualidade da água.",
    fotoUrl: "https://inaturalist-open-data.s3.amazonaws.com/photos/7428764/medium.jpeg",
  },
  {
    cientifico: "Nasua nasua",
    comun: "quati",
    grupo: "mamifero",
    porQue:
      "Anda em grupos pela Floresta da Tijuca. Comida de gente faz mal a ele, e é um bom exemplo do que não se faz numa saída de campo.",
    fotoUrl: "https://inaturalist-open-data.s3.amazonaws.com/photos/29129520/medium.jpeg",
  },
  {
    cientifico: "Ucides cordatus",
    comun: "caranguejo-uçá",
    grupo: "crustaceo",
    porQue:
      "Cava tocas na lama do manguezal. Tem período de defeso: na época da andada, a cata é proibida.",
    fotoUrl: "https://inaturalist-open-data.s3.amazonaws.com/photos/227804427/medium.jpeg",
  },
  {
    cientifico: "Paubrasilia echinata",
    comun: "pau-brasil",
    grupo: "arbol",
    porQue:
      "A árvore que deu nome ao país. Foi tão explorada pela madeira vermelha que hoje está ameaçada.",
    estado: "en_peligro",
    fuenteEstado: "UICN",
    fotoUrl: "https://inaturalist-open-data.s3.amazonaws.com/photos/26448062/medium.jpeg",
  },
  {
    cientifico: "Schizolobium parahyba",
    comun: "guapuruvu",
    grupo: "arbol",
    porQue:
      "Cresce muito rápido e por isso é usado para recompor a mata. No fim do inverno fica coberto de flores amarelas.",
    fotoUrl: "https://inaturalist-open-data.s3.amazonaws.com/photos/59825163/medium.jpeg",
  },
  {
    cientifico: "Euterpe edulis",
    comun: "palmeira-juçara",
    grupo: "arbol",
    porQue:
      "O corte para tirar o palmito mata a planta inteira, e por isso ela está ameaçada. Os frutos alimentam muitas aves da mata.",
    estado: "vulnerable",
    fuenteEstado: "CNCFlora",
    fotoUrl: "https://inaturalist-open-data.s3.amazonaws.com/photos/148161929/medium.jpeg",
  },
  {
    cientifico: "Rhizophora mangle",
    comun: "mangue-vermelho",
    grupo: "arbol",
    porQue:
      "As raízes em forma de escora seguram a lama do manguezal. É ali que muitos peixes e caranguejos passam o começo da vida.",
    fotoUrl: "https://inaturalist-open-data.s3.amazonaws.com/photos/125165299/medium.jpg",
  },
];
