/**
 * Las técnicas de terreno, en portugués.
 *
 * Las mismas de §tecnicas.ts, con los mismos `id` y en el mismo orden, para
 * que lo guardado en una expedición («muestreo_agua») sirva en las dos
 * lenguas. Los resguardos están pensados para una escuela de ciudad: la
 * orilla es la de un río canalizado y la encuesta se hace en la calle del
 * barrio, no en la plaza del pueblo.
 */

import type { Tecnica } from "./tecnicas";

export const TECNICAS_PT: Tecnica[] = [
  {
    id: "bitacora",
    nombre: "Diário de campo",
    queEs:
      "O caderno em que se anota na hora, não depois. Data, horário, lugar, quem anota, e o que se vê como se vê, separado do que a gente acha que significa.",
    queSeEnsaya:
      "Quinze minutos no pátio preenchendo um diário sobre qualquer coisa: o recreio, uma árvore, a entrada da escola. Depois se leem dois em voz alta e a turma decide qual deles permitiria a outra pessoa reconstruir o que aconteceu. Quase sempre ganha o que separa o visto do interpretado.",
    materiales: ["caderno", "lápis", "uma prancheta ou pasta dura para escrever em pé"],
    seguridad: ["Ninguém anota andando pela beira de um rio, de um canal ou de um barranco"],
    etica: [
      "O que uma pessoa diz se anota como ela disse, sem arrumar",
      "Se alguém pede para algo não ser anotado, não se anota",
    ],
    seCaeCuando:
      "Preenche-se na volta, de memória. No caminho de volta se perde metade, e o que sobra se ajeita ao que se esperava encontrar.",
    registros: ["describir", "dibujar"],
  },
  {
    id: "pauta_observacion",
    nombre: "Roteiro de observação",
    queEs:
      "Uma lista curta do que olhar, decidida antes de chegar, para que todos os grupos olhem a mesma coisa e os dados possam ser juntados.",
    queSeEnsaya:
      "Monta-se o roteiro com a turma e testa-se no pátio. A turma descobre sozinha o problema de sempre: duas pessoas marcam diferente a mesma coisa porque a casa diz «muito lixo» em vez de «mais de dez embalagens». Corrige-se ali, e não no campo.",
    materiales: ["o roteiro impresso, um por grupo", "lápis"],
    seguridad: ["Observa-se de onde dá para ficar parado com as duas mãos livres"],
    etica: ["Não se observa o interior das casas nem pessoas que não sabem que estão sendo observadas"],
    seCaeCuando:
      "As casas admitem interpretação. Se duas pessoas podem marcar diferente a mesma coisa, o roteiro não serve para juntar nada, e é melhor saber disso em sala.",
    registros: ["describir", "contar"],
  },
  {
    id: "entrevista",
    nombre: "Roteiro de entrevista",
    queEs:
      "Três ou quatro perguntas escritas pelos alunos para alguém que sabe algo que eles não sabem. Abertas, sobre o que essa pessoa viveu, não sobre o que ela acha em geral.",
    queSeEnsaya:
      "Eles se entrevistam em duplas, com as perguntas prontas, na frente da turma. Na hora se nota qual pergunta se responde com um sim e qual abre dez minutos. Divide-se também quem pergunta e quem anota, e não é a mesma pessoa.",
    materiales: ["as perguntas escritas", "caderno", "gravador ou celular, se a pessoa autorizar"],
    seguridad: [
      "Entrevista-se em dupla, nunca alguém sozinho",
      "Num lugar à vista, não dentro de uma casa sem um adulto da escola",
    ],
    etica: [
      "Diz-se antes para que é e onde vai aparecer",
      "Para gravar pede-se permissão em voz alta, e a permissão fica gravada",
      "Mostra-se à pessoa o que ficou escrito antes de publicar",
      "Se ela preferir que o nome não apareça, não aparece",
    ],
    seCaeCuando:
      "As perguntas saem na hora. Sem roteiro o convidado fala vinte minutos do que quer, a turma escuta, e não fica anotado nada que se possa usar.",
    registros: ["preguntar"],
  },
  {
    id: "encuesta",
    nombre: "Enquete com vizinhos",
    queEs:
      "As mesmas poucas perguntas feitas a muitas pessoas, para poder contar respostas em vez de citá-las. Fechadas e curtas: três perguntas respondidas por quarenta pessoas valem mais que doze respondidas por cinco.",
    queSeEnsaya:
      "Aplica-se o rascunho entre eles e cronometra-se. Se passar de dois minutos, corta-se. Decide-se também a quem se vai perguntar e a quem não, que é o que depois permite dizer o que o resultado representa e o que não.",
    materiales: ["a folha impressa, várias cópias", "lápis", "uma prancheta"],
    seguridad: ["Sempre em dupla e em lugares públicos", "Nunca se entra numa casa"],
    etica: [
      "Diz-se de que escola são e para que é, antes da primeira pergunta",
      "Aceita-se um não sem insistir",
      "Não se pedem dados pessoais que não façam falta",
    ],
    seCaeCuando:
      "Pergunta-se só a quem passa pela praça num sábado. A amostra fica torta e o resultado não se defende: convém decidir antes quem falta e ir atrás.",
    registros: ["preguntar", "contar"],
  },
  {
    id: "muestreo_agua",
    nombre: "Coleta de amostras de água",
    queEs:
      "Medir a água em vários pontos do mesmo rio, sempre igual: pH, turbidez e temperatura, no mesmo horário e com o mesmo procedimento, para que os pontos possam ser comparados entre si.",
    queSeEnsaya:
      "Mede-se a água da torneira da escola, a de uma poça e a de um copo com terra mexida. Três águas diferentes dão três leituras diferentes, e aí se aprende a ler a escala de cores sem pressa. Pratica-se também coletar a amostra sem pôr os dedos, que é o erro que estraga o dado.",
    materiales: [
      "fitas de pH",
      "frascos limpos com tampa, um por ponto",
      "um termômetro",
      "etiquetas ou fita crepe para identificar",
      "luvas",
    ],
    seguridad: [
      "Ninguém entra na água nem desce a margem de um rio canalizado",
      "Ninguém chega sozinho à beira",
      "Se choveu forte nos dias anteriores, a saída é suspensa",
      "Depois de tocar água suspeita, ninguém leva as mãos ao rosto, e todos lavam as mãos ao terminar",
    ],
    etica: [
      "Se o rio passa por um terreno particular, pede-se permissão para entrar",
      "Um resultado ruim não se publica como acusação a uma pessoa: informa-se onde se mediu e o que deu",
    ],
    seCaeCuando:
      "Mede-se em horários diferentes ou com procedimentos diferentes em cada ponto. Aí as diferenças entre os pontos podem ser do horário e não da água, e depois não há como saber.",
    registros: ["medir", "recoger"],
  },
  {
    id: "cuadrante",
    nombre: "Quadrado de amostragem",
    queEs:
      "Um quadrado marcado no chão dentro do qual se conta e se anota tudo. Permite comparar lugares diferentes e voltar ao mesmo lugar no ano seguinte.",
    queSeEnsaya:
      "Marca-se um metro quadrado no pátio e conta-se tudo o que há dentro. Saem duas descobertas: que há muito mais do que parecia, e que dois grupos contam diferente a mesma coisa até combinarem o que conta como o quê.",
    materiales: ["barbante de quatro metros", "quatro estacas", "trena", "lupa"],
    seguridad: ["Levanta-se uma pedra de cada vez, e olha-se antes de pôr a mão"],
    etica: [
      "Tudo o que se levanta volta para o lugar",
      "Nada vivo vai para a sala",
    ],
    seCaeCuando:
      "Escolhe-se o quadrado onde está mais bonito. Isso entorta tudo, e convém decidir onde ele fica antes de olhar o que há.",
    registros: ["contar", "mapear", "dejar_hecho"],
  },
  {
    id: "muestra_suelo",
    nombre: "Coleta de amostras de solo",
    queEs:
      "Um saco por camada ou por lugar, identificado com de onde saiu e a que profundidade. O que se faz depois com ele acontece em sala.",
    queSeEnsaya:
      "Coletam-se duas amostras do pátio, uma da superfície e outra um palmo abaixo, e identificam-se. Depois abrem-se e comparam-se pelo tato e pelo cheiro. O ensaio serve sobretudo para o que parece bobagem e estraga o dia: se os sacos se misturam, perdeu-se a saída.",
    materiales: ["sacos com fecho", "uma pá pequena", "fita crepe e caneta permanente", "luvas"],
    seguridad: [
      "Ninguém fica ao pé de um barranco ou de uma encosta cortada: pode descer terra",
      "Não se cava em cortes mais altos que uma pessoa",
    ],
    etica: ["Se o terreno tem dono, pede-se: um saco de terra é pouca coisa, e pedir faz a diferença"],
    seCaeCuando:
      "Identifica-se depois. Cinco sacos iguais sem etiqueta são cinco sacos de terra e mais nada.",
    registros: ["recoger", "describir"],
  },
  {
    id: "foto_punto_fijo",
    nombre: "Fotografia de um ponto fixo",
    queEs:
      "A mesma foto, do mesmo lugar, com algo que dê a escala. Repetida ao longo do tempo, é a prova mais difícil de contestar que uma turma pode conseguir.",
    queSeEnsaya:
      "Escolhe-se um ponto do pátio, marca-se no chão e fotografa-se. No dia seguinte tenta-se repetir a foto exata. Nunca sai igual à primeira, e daí sai a regra: é preciso anotar de onde, a que altura e para onde.",
    materiales: ["um celular", "algo que dê a escala: uma régua, uma mochila, uma pessoa", "uma estaca ou marca para o ponto"],
    seguridad: ["Ninguém anda para trás olhando pela tela"],
    etica: [
      "Não se fotografam pessoas sem permissão, e menos ainda crianças de outra escola",
      "Se aparece a casa de alguém identificável, pergunta-se antes de publicar",
    ],
    seCaeCuando:
      "Não fica anotado de onde foi tirada. Um ano depois ninguém consegue repeti-la, e a série se interrompe.",
    registros: ["comparar", "describir"],
  },
  {
    id: "mapa_a_mano",
    nombre: "Mapa desenhado à mão",
    queEs:
      "O lugar visto de cima, desenhado na hora, sem escala mas com tudo no seu lugar: o que está ao lado de quê, por onde se entra, onde está cada coisa que importa.",
    queSeEnsaya:
      "Cada um desenha de memória o pátio da escola. Depois saem para olhar e corrigem. A distância entre os dois desenhos é a lição: o que a gente acha que sabe de um lugar que vê todo dia.",
    materiales: ["folha grande", "lápis", "lápis de cor para diferenciar"],
    seguridad: ["Desenha-se parado, não andando"],
    etica: ["Se o mapa vai mostrar a propriedade de alguém, avisa-se a pessoa"],
    seCaeCuando:
      "Tenta-se fazer em escala. Com régua e proporção o desenho fica lento e ruim; o que importa aqui é a posição relativa, e a medição vem por outro caminho.",
    registros: ["mapear", "dibujar"],
  },
  {
    id: "medicion_dimensiones",
    nombre: "Medição de dimensões",
    queEs:
      "Comprimento, largura, profundidade, espessura, com trena ou vara, em vários pontos e não em um, porque nada na natureza é uniforme.",
    queSeEnsaya:
      "Mede-se algo do pátio três vezes, por três grupos diferentes, e comparam-se os três resultados. Nunca coincidem, e essa é a aula: daí sai por que se mede em vários pontos e o que se faz com o que foge de todos.",
    materiales: ["trena de cinco metros", "uma vara marcada a cada dez centímetros", "caderno"],
    seguridad: ["Ninguém mede dentro de um rio com correnteza", "A vara não se apoia na beira de um barranco"],
    etica: ["Se for preciso entrar num terreno para medir, pede-se"],
    seCaeCuando:
      "Mede-se uma vez só e dá-se por bom. Um número sozinho não diz se está certo: só diz algo quando há outro ao lado.",
    registros: ["medir"],
  },
];

/** Lo que el curso se lleva de estas clases antes de salir, en portugués. */
export const ANTES_DE_SALIR_PT: { titulo: string; queEs: string; seNotaEn: string }[] = [
  {
    titulo: "Ligam a notícia com o que estão vendo em aula",
    queEs:
      "Relacionam os fatos e os números da problemática com os conceitos e princípios que estão sendo trabalhados.",
    seNotaEn:
      "usam uma palavra do currículo para explicar algo da notícia, sem que você peça.",
  },
  {
    titulo: "Explicam os conceitos, não os repetem",
    queEs:
      "Dizem o que significa cada conceito-chave e por que ele faz falta para entender as causas ou as consequências do problema daqui.",
    seNotaEn:
      "conseguem explicar para alguém que faltou, com as próprias palavras e sem ler.",
  },
  {
    titulo: "Sabem usar o que vão usar",
    queEs:
      "Descrevem os passos, os instrumentos e a técnica com que vão coletar o dado, e já praticaram pelo menos uma vez.",
    seNotaEn:
      "conseguem dizer em que ordem se faz e o que se anota primeiro, sem olhar a folha.",
  },
  {
    titulo: "Sabem o que pode e o que não pode no campo",
    queEs:
      "Reconhecem os cuidados, o que precisa ser pedido antes e o que não se faz, tanto com o lugar quanto com as pessoas.",
    seNotaEn:
      "alguém da turma sabe dizer o que faria se uma pessoa não quisesse ser entrevistada.",
  },
];
