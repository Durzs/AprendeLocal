/**
 * A quién se le entrega el trabajo, en portugués y para Río.
 *
 * Las mismas cinco familias de §destinatarios.ts, con los mismos `id`. Los
 * ejemplos no se traducen: se cambian por los de una ciudad brasileña, porque
 * el punto de esta lista es que el docente reconozca al suyo, y en Río nadie
 * tiene un comité de agua potable rural ni una seremi.
 */

import type { Familia, Rasgos } from "./destinatarios";

export const FAMILIAS_PT: Familia[] = [
  {
    id: "causan",
    nombre: "Quem está causando o problema",
    quienEs:
      "A pessoa, a empresa ou o serviço de cuja atividade sai o problema. É o destinatário mais incômodo, e o que mais muda as coisas se responder.",
    ejemplos: [
      "A concessionária que opera o esgoto do bairro",
      "A obra que joga entulho na beira do canal",
      "O comércio que descarta lixo na calçada",
      "A prefeitura, quando o problema é um serviço que não chega",
    ],
    queLesMueve:
      "Que o dado esteja bem coletado e que haja mais gente olhando. A um particular move o contato direto; a uma empresa ou a um órgão, que a coisa fique por escrito e com protocolo.",
    llegan: ["informe", "mural", "video"],
    noLlegan: [
      {
        formato: "campana_redes",
        porQue:
          "Uma campanha nas redes é lida como denúncia pública e fecha a conversa antes de começar. Serve depois, se não responderem.",
      },
    ],
  },
  {
    id: "afectados",
    nombre: "Quem está sofrendo o problema",
    quienEs:
      "Quem já vive com isso e muitas vezes já sabia. Não é preciso convencê-los de que existe: é preciso dar algo que possam usar.",
    ejemplos: [
      "As famílias que moram na beira do rio ou do canal",
      "Os moradores da encosta que ficam sem saída quando chove",
      "Os vizinhos da rua onde o lixo se acumula",
      "Os pescadores e catadores de caranguejo da baía",
    ],
    queLesMueve:
      "Que sirva para algo concreto: saber a quem reclamar, o que fazer enquanto isso, ou ter o papel que antes não tinham.",
    llegan: ["guia", "taller", "radio", "intervencion"],
    noLlegan: [
      {
        formato: "informe",
        porQue:
          "Um relatório se entrega a quem decide, não a quem sofre. Para essas pessoas funciona algo que se leva na mão e se usa.",
      },
    ],
  },
  {
    id: "decide",
    nombre: "Quem pode decidir que mude",
    quienEs:
      "A autoridade ou a organização que tem a atribuição de fazer algo. É pouca gente, e fala-se com ela de outro jeito: com números, curto e pelo canal certo.",
    ejemplos: [
      "A Câmara de Vereadores ou um vereador do bairro",
      "A subprefeitura da região",
      "A Defesa Civil do município",
      "A diretoria da associação de moradores",
    ],
    queLesMueve:
      "Um número que não tinham, coletado num lugar que conseguem localizar, e um pedido de uma coisa só. Dois pedidos já é nenhum.",
    llegan: ["informe", "coleccion"],
    noLlegan: [
      {
        formato: "mural",
        porQue:
          "Um mural não entra num gabinete nem fica em ata. Serve para que a pressão exista ao redor, não para que a decisão seja tomada.",
      },
    ],
  },
  {
    id: "comunidad",
    nombre: "O pessoal do bairro que ainda não presta atenção",
    quienEs:
      "Quem passa ao lado do problema todo dia sem perceber. Não são vítimas nem culpados: são os que deveriam estar olhando e não olham.",
    ejemplos: [
      "Quem passa pela feira no sábado",
      "Quem espera no posto de saúde ou no ponto de ônibus",
      "Os moradores na reunião da associação",
      "Quem ouve a rádio comunitária de manhã",
    ],
    queLesMueve:
      "Encontrar sem ter procurado, num lugar por onde já iam passar. Essas pessoas não se convocam: se interceptam.",
    llegan: ["exposicion", "mural", "radio", "intervencion"],
    noLlegan: [
      {
        formato: "informe",
        porQue:
          "Ninguém que vai à feira para para ler um relatório. O que funciona aqui se vê de longe e se entende de passagem.",
      },
    ],
  },
  {
    id: "otros_cursos",
    nombre: "Outras turmas e as famílias da escola",
    quienEs:
      "O destinatário mais próximo e o mais subestimado. Tem a vantagem de que dá para ensaiar com ele e de que a entrega acontece com certeza.",
    ejemplos: [
      "As turmas mais novas, numa aula cedida",
      "As famílias, na reunião de pais e responsáveis",
      "A escola vizinha, se houver como juntar",
      "Os professores de outros componentes, no conselho de classe",
    ],
    queLesMueve:
      "Que quem explica sejam pessoas da idade deles ou os próprios filhos. É o único destinatário que pergunta de volta, e isso vale mais que o alcance.",
    llegan: ["taller", "exposicion", "coleccion", "video"],
    noLlegan: [
      {
        formato: "campana_redes",
        porQue:
          "Para gente que se vê todo dia no pátio, uma campanha nas redes é o caminho longo para uma conversa que dá para ter cara a cara.",
      },
    ],
  },
];

export const RASGOS_PT: { id: keyof Rasgos; pregunta: string; ayuda: string; ejemplo: string }[] = [
  {
    id: "edad",
    pregunta: "Que idade eles têm?",
    ayuda:
      "Muda o formato inteiro. O que faz parar alguém de quinze anos não faz parar alguém de setenta.",
    ejemplo: "Entre 40 e 70, a maioria acima de 50",
  },
  {
    id: "donde",
    pregunta: "Onde estão e o que olham no dia a dia?",
    ayuda:
      "Aqui cai metade das ideias. Se as pessoas não usam redes sociais, não há campanha nas redes que chegue.",
    ejemplo: "No alto do morro, voltam tarde do trabalho; ouvem a rádio comunitária",
  },
  {
    id: "necesidad",
    pregunta: "Do que precisam que hoje não têm?",
    ayuda:
      "O que a turma pode dar e ninguém mais está dando. Se a resposta é «que fiquem sabendo», ainda falta pensar.",
    ejemplo: "Saber o que fazer quando a sirene toca e para onde ir",
  },
];
