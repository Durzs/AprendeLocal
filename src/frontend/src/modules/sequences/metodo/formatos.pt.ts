/**
 * Los formatos del producto final, en portugués.
 *
 * Los mismos de §formatos.ts, con los mismos `id` y en el mismo orden, para
 * que el formato guardado en una expedición sirva en las dos lenguas. Los
 * lugares son los de una ciudad: la feira, o posto de saúde, a associação de
 * moradores, o ponto de ônibus.
 */

import type { Formato } from "./formatos";

export const FORMATOS_PT: Formato[] = [
  {
    id: "campana_redes",
    nombre: "Campanha nas redes sociais",
    queEs:
      "Uma série curta de publicações com uma ideia só e uma peça diferente a cada vez: a foto do antes e do depois, o vídeo de dez segundos, o número sozinho sobre fundo liso.",
    llegaA:
      "Gente do bairro e de mais longe, no celular, enquanto faz outra coisa. Tudo se decide nos primeiros três segundos.",
    alcance: "mas_alla",
    exige: [
      "Uma ideia só, repetida; duas ideias se anulam",
      "Pelo menos uma imagem que não se possa contestar: a foto da saída de esgoto, os dois frascos lado a lado",
      "Um calendário do que se publica a cada dia, feito antes de começar",
      "Autorização assinada das famílias para que os rostos apareçam",
    ],
    seCaeCuando:
      "Acaba no terceiro dia. Começa-se com tudo e uma semana depois ninguém está publicando nada, porque não havia nada preparado.",
    buenoPara:
      "Uma descoberta que se vê numa imagem e que importa a muita gente que não vai a nenhuma reunião.",
  },
  {
    id: "exposicion",
    nombre: "Exposição num lugar de passagem",
    queEs:
      "As peças montadas onde as pessoas já passam: a feira de sábado, o corredor do posto de saúde, a associação de moradores. Uma ficha por coisa, e a turma ao lado.",
    llegaA:
      "Quem passava por ali sem procurar, que é justamente quem nunca iria à escola ver um trabalho.",
    alcance: "el_pueblo",
    exige: [
      "Que cada peça se entenda sozinha, porque nem todos vão perguntar",
      "Alguém da turma ao lado o tempo todo: sem isso são papéis colados",
      "Autorização do lugar, e um plano do que fazer se chover ou ventar",
      "Uma ordem de percurso: por onde se começa e por onde se sai",
    ],
    seCaeCuando:
      "Monta-se e deixa-se sozinha. Uma exposição sem ninguém para explicar dura o que dura a curiosidade do primeiro que passa.",
    buenoPara:
      "Muitas peças parecidas que ganham quando vistas juntas: uma coleção, uma série, um catálogo de algo.",
  },
  {
    id: "informe",
    nombre: "Relatório curto para quem decide",
    queEs:
      "Uma ou duas páginas com o que encontraram, o que significa e o que se pede. Só isso, com data e assinatura.",
    llegaA:
      "Quem pode mudar algo: a direção, a subprefeitura, a concessionária, a vereadora do bairro. Uma pessoa concreta, não um órgão.",
    alcance: "pocos",
    exige: [
      "Saber de antemão o que essa pessoa pode decidir e o que não pode",
      "Que o número esteja em cima e a explicação embaixo, não o contrário",
      "Dizer o que não sabem, porque é a primeira coisa que vão contestar",
      "Um pedido concreto: o que querem que aconteça, e até quando",
    ],
    seCaeCuando:
      "Entrega-se e não se acompanha. Um relatório sem ninguém que pergunte depois o que aconteceu com ele vai para a gaveta, e a turma aprende que escrever não adianta.",
    buenoPara:
      "Uma descoberta que obriga alguém a tomar uma decisão, e que se sustenta em números.",
  },
  {
    id: "guia",
    nombre: "Guia ou cartilha para distribuir",
    queEs:
      "Uma folha dobrada que as pessoas levam: como reconhecer algo, o que fazer, para quem ligar. Imprime-se na escola e entrega-se na mão.",
    llegaA: "Quem recebe, guarda e usa semanas depois.",
    alcance: "el_pueblo",
    exige: [
      "Que sirva para fazer algo, não só para saber algo",
      "Que caiba num bolso e se entenda sem ler inteira",
      "Desenhos próprios: fotos da internet a transformam num folheto qualquer",
    ],
    seCaeCuando:
      "Enche-se de informação. Uma cartilha com tudo o que aprenderam ninguém lê; uma com três coisas que dá para fazer fica presa na geladeira.",
    buenoPara:
      "Um conhecimento de que alguém vai precisar quando a turma já não estiver lá para explicar.",
  },
  {
    id: "radio",
    nombre: "Spot ou programa na rádio comunitária",
    queEs:
      "Dois ou três minutos gravados, ou uma conversa ao vivo na rádio comunitária ou no carro de som do bairro.",
    llegaA:
      "Os mais velhos e quem trabalha com o rádio ligado: oficina, banca, cozinha. É o meio que a escola mais subestima.",
    alcance: "el_pueblo",
    exige: [
      "Um roteiro escrito e cronometrado: no rádio trinta segundos são longos",
      "Falar de coisas que se possam imaginar sem ver",
      "Ensaiar em voz alta até não soar como leitura",
      "Combinar o dia e o horário com a rádio, por escrito",
    ],
    seCaeCuando:
      "Lê-se um texto escrito para o papel. No rádio isso se nota na hora e as pessoas mudam de estação.",
    buenoPara:
      "Algo que se conta melhor do que se mostra: uma história, um depoimento, um antes e um depois.",
  },
  {
    id: "mural",
    nombre: "Mural ou cartaz grande onde se passa",
    queEs:
      "Uma peça grande e fixa num muro que as pessoas cruzam todo dia: a escola, a associação, o ponto de ônibus.",
    llegaA: "As mesmas pessoas, muitas vezes, durante meses.",
    alcance: "el_pueblo",
    exige: [
      "Que se leia de longe: se é preciso chegar perto para ler, não é mural",
      "Autorização do dono do muro, e saber quanto tempo vai ficar ali",
      "Materiais que aguentem sol e chuva, se for do lado de fora",
    ],
    seCaeCuando:
      "Enche-se de texto pequeno. Um mural com parágrafos é um cartaz ampliado, e ninguém para para ler.",
    buenoPara:
      "Uma ideia que ganha quando vista inteira e de uma vez: um mapa, uma rede, um antes e um depois.",
  },
  {
    id: "coleccion",
    nombre: "Coleção catalogada",
    queEs:
      "As amostras organizadas, cada uma com a sua ficha: herbário, mostruário de solos, fichário de espécies, arquivo de fotos com data.",
    llegaA:
      "A turma do ano que vem, e quem quiser consultar depois. É o formato que dura mais que todos os outros.",
    alcance: "pocos",
    exige: [
      "Um critério de organização decidido por eles, e escrito: por que isto vai aqui",
      "Que cada peça tenha onde e quando foi coletada, ou não vale nada",
      "Um lugar para ficar: uma caixa, um armário, uma pasta com responsável",
    ],
    seCaeCuando:
      "Guarda-se sem fichas. Uma caixa de plantas secas sem onde nem quando é lixo bonito, e em um ano ninguém saberá o que era.",
    buenoPara:
      "Muitos exemplares da mesma coisa, quando o interessante é em que eles se diferenciam.",
  },
  {
    id: "video",
    nombre: "Vídeo curto",
    queEs:
      "Dois ou três minutos gravados com celular, com o que aconteceu no lugar e a voz deles.",
    llegaA: "Quem assistir até o fim, que vão ser menos do que os que começam.",
    alcance: "mas_alla",
    exige: [
      "Uma coisa que só se entenda vendo: se dá para contar, não precisava de vídeo",
      "Gravar no lugar, não na sala explicando o lugar",
      "Som: é o que estraga, mais que a imagem",
    ],
    seCaeCuando:
      "Dura oito minutos. Tudo o que trabalharam entra e ninguém termina de ver.",
    buenoPara:
      "Um processo ou um lugar que é preciso ver se mexendo para entender.",
  },
  {
    id: "taller",
    nombre: "Oficina para outra turma ou para as famílias",
    queEs:
      "A turma ensina o que aprendeu, com uma atividade que os outros fazem com as mãos.",
    llegaA: "Poucos, mas de verdade: quem faz não esquece.",
    alcance: "pocos",
    exige: [
      "Que os outros façam algo, não que só escutem",
      "Dividir quem explica o quê, para que não falem só dois",
      "Ter previsto a pergunta que não vão saber responder",
    ],
    seCaeCuando:
      "Vira uma apresentação oral. Se quem vem só escuta, se entedia, e a turma desanima na frente de todos.",
    buenoPara:
      "Algo que se aprende fazendo, e que a turma já sabe fazer bem.",
  },
  {
    id: "intervencion",
    nombre: "Cuidar ou sinalizar o próprio lugar",
    queEs:
      "Deixar algo feito no lugar: sinalizar, limpar, plantar, marcar pontos de medição, pôr placas com nomes.",
    llegaA: "Todo mundo que passar por ali, sem que ninguém precise convocar.",
    alcance: "el_pueblo",
    exige: [
      "Autorização de quem é dono ou responsável pelo lugar",
      "Que aguente: algo que se desfaz na primeira chuva é pior que nada",
      "Um compromisso de voltar para olhar, com data",
    ],
    seCaeCuando:
      "Faz-se e não se volta. A intervenção se deteriora, fica pior do que antes, e a turma seguinte herda um fracasso visível.",
    buenoPara:
      "Um problema que dá para melhorar, nem que seja um pouco, com o que se tem à mão.",
  },
];

export const COMO_SE_ELIGE_PT: string[] = [
  "Para quem o que encontramos muda alguma coisa? Diga o nome: a comunidade não é um nome.",
  "Onde essa pessoa está e o que ela olha no dia a dia? Se não usa o celular, a campanha não chega, por mais bonita que seja.",
  "Que formato a faria parar, e qual a faria passar reto?",
  "Dá tempo de terminar bem com o que resta? Vale mais uma coisa terminada que três pela metade.",
  "O que esta turma sabe fazer que ainda não usamos?",
  "Se der errado, como vai ser esse fracasso? Escolher sabendo disso é diferente de escolher às cegas.",
];
