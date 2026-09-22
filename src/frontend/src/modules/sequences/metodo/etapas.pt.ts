/**
 * Las seis etapas, en portugués y para una escuela de Río.
 *
 * Es el mismo método que §etapas.ts, etapa por etapa y con los mismos `id`.
 * No es una traducción línea a línea: los dos proyectos de ejemplo son
 * cariocas —un río canalizado y los árboles de la calle— porque el desierto
 * florido no le dice nada a una escuela de la Zona Norte, y las situaciones
 * están contadas como pasan allá (la van escolar, la prefeitura, el año que
 * empieza en febrero).
 *
 * Si se cambia una etapa en español hay que cambiarla aquí. `etapasEn` avisa
 * en desarrollo si las dos listas dejan de coincidir en número o en `id`.
 */

import type { Etapa } from "./etapas";

export const ETAPAS_PT: Etapa[] = [
  {
    id: "problematica",
    nombre: "Apresentação da problemática",
    queOcurre:
      "Escolhe-se uma das problemáticas que a plataforma traz, com as notícias e os estudos que a sustentam, ou o professor propõe a sua. A turma lê, desmonta o texto, e daí sai uma pergunta que divide a sala e que não se resolve no bate-papo.",
    enUnaLinea:
      "Lê-se uma problemática do lugar até surgir uma pergunta que divide a turma.",
    alcance: "inmediato",
    decide: "ambos",
    aprendizajes: [
      {
        nombre: "Análise do contexto",
        queEs:
          "Identifica os elementos-chave da problemática: quem está envolvido, o que a causou, que consequências tem, onde acontece e desde quando.",
        seNotaEn:
          "conseguem dizer de quando é e onde fica sem reler, e percebem quando a notícia não diz.",
      },
      {
        nombre: "Compreensão crítica",
        queEs:
          "Explica com as próprias palavras como aquilo afeta a eles ou à comunidade, de forma direta ou indireta.",
        seNotaEn:
          "aparece um lugar concreto daqui no que dizem, não «o meio ambiente». Se ninguém consegue fazer a ligação, essa problemática não é a desta escola.",
      },
      {
        nombre: "Apropriação do problema",
        queEs:
          "Formula perguntas ou reflexões próprias que mostram interesse e que a notícia não responde. Isso não sai de pedir: sai de mostrar duas ou três perguntas prontas, desmontá-las na frente da turma para ver do que são feitas, e corrigir as primeiras que eles escreverem. Pedir perguntas complexas na primeira aula, sem esse trabalho, devolve perguntas de uma linha que ninguém vai querer investigar.",
        seNotaEn:
          "as perguntas são sobre aqui e não sobre a notícia. É esta que decide se há projeto: sem perguntas próprias, o que vem depois é interpretação de texto.",
      },
    ],
    preguntasQueAbren: [
      "Esta pergunta que eu trouxe, do que ela é feita? O que a torna difícil de responder de uma vez?",
      "De quando é isto, quem escreveu e a quem interessava escrever?",
      "Isto acontece com a gente? Onde exatamente?",
      "Quem acha que sim e quem acha que não? Fiquem deste lado e daquele",
      "O que a gente teria que ver para saber qual dos dois tem razão?",
    ],
    estaListoCuando: [
      "Há dois lados e os dois têm um argumento, não um palpite",
      "Você também não sabe a resposta com certeza",
      "As razões de cada lado ficaram escritas no quadro, e essa parte fica coberta até a volta do campo",
    ],
    seCaeCuando:
      "Começa-se pelo tema em vez do caso. Assim que você diz «hoje vamos ver poluição», a turma para de ler e começa a adivinhar que resposta você quer.",
    cierre: {
      preguntas: [
        "O que disto acontece perto de onde eu moro? Escreva um lugar concreto.",
        "O que eu ainda não entendo deste problema?",
        "O que eu gostaria de descobrir que hoje não sei?",
      ],
      queMirar:
        "A primeira mostra se o problema aterrissou ou ficou no abstrato: quem escreve «o meio ambiente» ainda não fez a ligação. A segunda é a mais útil das três, porque quem não pergunta nada costuma ser quem não entendeu nada.",
    },
    ejemplos: [
      {
        proyecto: "Um rio que parece sujo",
        asiSeVe:
          "Leem a reportagem sobre o esgoto que chega ao rio sem tratamento e a reclamação dos moradores pelo mau cheiro. A pergunta que divide: está poluído, ou só barrento porque arrasta terra da encosta? Metade da turma diz que o rio sempre foi assim.",
      },
      {
        proyecto: "As árvores da rua",
        asiSeVe:
          "Leem o que se publicou sobre as ilhas de calor no Rio. A pergunta: a rua da escola é mais quente que a praça porque tem menos árvores? Os avós dizem que antes a rua tinha sombra, e ninguém tem como provar.",
      },
    ],
  },
  {
    id: "aula",
    nombre: "Ensino em sala de aula",
    queOcurre:
      "Uma ou duas aulas com os conceitos do currículo necessários para entender a problemática, e o ensaio em sala da técnica com que vão coletar o dado, praticada sobre algo que não importe.",
    enUnaLinea:
      "Os conceitos do currículo que fazem falta, e a técnica ensaiada antes de sair.",
    alcance: "inmediato",
    decide: "docente",
    aprendizajes: [
      {
        nombre: "Conexão com o lugar e com o currículo",
        queEs:
          "Relaciona os fatos e os números da problemática com os conceitos e princípios que estão sendo trabalhados em aula.",
        seNotaEn:
          "usam uma palavra do currículo para explicar algo da notícia, sem que você peça.",
      },
      {
        nombre: "Compreensão conceitual",
        queEs:
          "Explica os conceitos-chave da habilidade e por que eles são necessários para entender as causas ou as consequências do problema daqui.",
        seNotaEn:
          "conseguem explicar para alguém que faltou, com as próprias palavras e sem ler.",
      },
      {
        nombre: "Apropriação da técnica",
        queEs:
          "Identifica e descreve os passos, os instrumentos e a técnica com que vai coletar o dado: diário de campo, roteiro de entrevista, instrumento de medição, regras de amostragem.",
        seNotaEn:
          "conseguem dizer em que ordem se faz e o que se anota primeiro, sem olhar a folha.",
      },
      {
        nombre: "Preparação para o campo",
        queEs:
          "Reconhece os cuidados, o que precisa ser pedido antes e o que não se faz, tanto com o lugar quanto com as pessoas.",
        seNotaEn:
          "alguém da turma sabe dizer o que faria se uma pessoa não quisesse ser entrevistada.",
      },
    ],
    preguntasQueAbren: [
      "Que palavras do currículo fazem falta para entender isto, e quais não têm nada a ver?",
      "Com o que vão coletar o dado, e onde podem praticar sem que importe?",
      "Qual é o erro que vão cometer se eu não avisar antes?",
      "O que é preciso pedir, avisar ou assinar antes de sairmos?",
      "Como vou saber, antes de entrar na van, quem entendeu e quem não?",
    ],
    estaListoCuando: [
      "Ensaiaram a técnica pelo menos uma vez, com o material de verdade",
      "Conseguem explicar os conceitos para alguém que faltou",
      "Estão resolvidos a autorização, o transporte e o que se faz se chover",
      "Você fez uma pergunta que todos responderam ao mesmo tempo e sabe quem errou",
    ],
    seCaeCuando:
      "Ensinam-se os conceitos e pula-se o ensaio da técnica, porque se supõe que eles já sabem usar um caderno. Não sabem, e quinze pessoas aprendendo a ler uma fita de pH na margem do rio, com vento, são uma hora perdida e um dado inútil.",
    cierre: {
      preguntas: [
        "Explique com suas palavras um dos conceitos que vimos, sem olhar o caderno.",
        "Que parte da técnica ainda não ficou clara para mim?",
        "Para que serve o que a gente vai fazer?",
      ],
      queMirar:
        "Se a terceira é respondida com «porque a professora mandou», o projeto ainda não é deles. A segunda evita que alguém chegue ao campo sem saber o que fazer, que é quando a saída se perde para essa pessoa.",
    },
    ejemplos: [
      {
        proyecto: "Um rio que parece sujo",
        asiSeVe:
          "Conceitos: pH, turbidez, bioindicador. Ensaia-se medindo a água da torneira, a de uma poça e a de um copo com terra mexida: três águas dão três leituras, e aí se aprende a ler a escala sem pressa.",
      },
      {
        proyecto: "As árvores da rua",
        asiSeVe:
          "Conceitos: temperatura e sombra, espécie nativa e exótica, amostragem. Ensaia-se medindo a temperatura do pátio ao sol e na sombra, e descrevendo uma árvore da escola para que outro grupo a encontre só pela descrição. Quando não encontram, entende-se o que faltava.",
      },
    ],
  },
  {
    id: "terreno",
    nombre: "Investigação em campo",
    queOcurre:
      "Saem pelo território para coletar dados, recolher amostras, entrevistar, mapear ou consultar documentos antigos. Na volta, o que trouxeram é colocado ao lado do que acreditavam no primeiro dia, e os conceitos da aula servem para ler isso.",
    enUnaLinea:
      "Saem para coletar o dado e voltam com material que ninguém tinha no primeiro dia.",
    alcance: "intermedio",
    decide: "estudiantes",
    aprendizajes: [
      {
        nombre: "Aplicação da técnica",
        queEs:
          "Aplica em campo as técnicas de coleta que ensaiou: entrevistas, cartografia, diário de campo, amostragem.",
        seNotaEn:
          "voltam com o registro completo e legível, não com anotações que todos precisam decifrar juntos.",
      },
      {
        nombre: "Integração de conceitos",
        queEs:
          "Usa os conceitos do currículo —de ciências, de geografia, de matemática— para analisar o que coletou, e não só para nomear.",
        seNotaEn:
          "explicam um dado estranho com uma ideia da aula, em vez de apagá-lo por ser estranho.",
      },
      {
        nombre: "Trabalho em equipe num espaço dos outros",
        queEs:
          "Colabora com responsabilidade, respeitando o funcionamento do espaço público e da comunidade que os recebe.",
        seNotaEn:
          "o lugar fica igual ou melhor do que estava, e ninguém precisou pedir duas vezes que falassem mais baixo.",
      },
    ],
    preguntasQueAbren: [
      "Onde exatamente precisamos ir, e por que ali e não vinte metros adiante?",
      "Se dois grupos escolhem lugares diferentes e dá diferente, qual vale?",
      "Quem sabe sobre isto algo que nós não conseguimos descobrir?",
      "O que deixamos feito antes de ir embora?",
      "Na volta: quem mudou de lado, e por quê?",
    ],
    estaListoCuando: [
      "Cada grupo consegue defender onde escolheu trabalhar",
      "Há pelo menos quatro maneiras diferentes de trabalhar, e nem todas são medir",
      "Alguém do lugar foi entrevistado com perguntas preparadas por eles",
      "Destapou-se o que tinha ficado escrito no primeiro dia e comparou-se",
      "O que não bate foi discutido em vez de apagado",
    ],
    seCaeCuando:
      "Chega-se com a planilha pronta e o ponto marcado, e na volta passa-se direto aos cálculos. Aí os dados são do lugar, mas a ideia com que chegaram continua inteira, e a saída foi um passeio com planilha.",
    cierre: {
      preguntas: [
        "O que eu vi que não esperava ver?",
        "O que foi difícil de fazer, e por quê?",
        "Que parte do trabalho fui eu que fiz?",
      ],
      queMirar:
        "A terceira é desconfortável de propósito e é a que detecta quem ficou de fora do grupo. Respondida no caderno e não em voz alta, é respondida de verdade.",
    },
    ejemplos: [
      {
        proyecto: "Um rio que parece sujo",
        asiSeVe:
          "Três pontos escolhidos por eles: antes do bairro, no bairro e depois. Medem, cheiram, fotografam, seguem uma saída de esgoto até onde começa e conversam com quem mora na beira. O ponto mais barrento deu pH bom: metade da sala tinha razão pelo motivo errado.",
      },
      {
        proyecto: "As árvores da rua",
        asiSeVe:
          "Duas quadras, uma arborizada e outra sem árvores. Medem a temperatura no mesmo horário, contam e fotografam as árvores, e perguntam ao dono da banca desde quando ele está ali. Na quadra sem árvores o termômetro marcou quatro graus a mais, e duas das árvores que os avós lembravam foram cortadas.",
      },
    ],
  },
  {
    id: "analisis",
    nombre: "Análise dos dados coletados",
    queOcurre:
      "A turma volta do campo com registros soltos e ainda não tem uma descoberta: tem material. Aqui ele é organizado, cruzado com o que já sabiam, e decide-se o que de fato encontraram. É a etapa em que o dado vira algo que se pode dizer em voz alta e defender.",
    enUnaLinea:
      "Organiza-se o que trouxeram até aparecer uma descoberta que se possa defender.",
    alcance: "inmediato",
    decide: "estudiantes",
    aprendizajes: [
      {
        nombre: "Tratamento de dados",
        queEs:
          "Organizar o que foi coletado de modo que se possa comparar: a mesma unidade, a mesma escala, os pontos na mesma ordem. É trabalho de matemática e quase sempre é pulado.",
        seNotaEn:
          "a tabela ou o gráfico permite comparar duas coisas, e sabem dizer por que puseram aquilo no eixo e não outra coisa.",
      },
      {
        nombre: "Distinção entre dado e conclusão",
        queEs:
          "Saber onde termina o que mediram e onde começa o que interpretam. As duas coisas valem; confundi-las é o que torna uma conclusão indefensável.",
        seNotaEn:
          "conseguem separar em duas colunas o que viram e o que acham que significa, e percebem quando um colega passa de uma para a outra sem avisar.",
      },
      {
        nombre: "Contraste com o que supunham",
        queEs:
          "Voltar ao que escreveram antes de sair e ver o que se sustentou e o que não. O que não bate é o mais valioso, e é o primeiro que se tende a apagar.",
        seNotaEn:
          "conseguem nomear uma coisa concreta em que se enganaram, sem que soe como se o projeto tivesse sido um erro.",
      },
      {
        nombre: "Formulação da descoberta",
        queEs:
          "Deixar escrita numa frase a coisa que a turma pode afirmar, com o dado por trás. Essa frase é o que depois sustenta a proposta.",
        seNotaEn:
          "a frase cabe numa linha, nomeia um lugar e traz um número ou uma observação que a sustenta.",
      },
    ],
    preguntasQueAbren: [
      "O que encontramos que não esperávamos?",
      "De tudo isto, o que podemos afirmar e o que estamos supondo?",
      "Se alguém não acreditar em nós, o que mostramos?",
      "O que falta para podermos dizer isso? Dá para conseguir?",
      "Há um dado que não bate com os outros? Medimos errado ou ali acontece alguma coisa?",
    ],
    estaListoCuando: [
      "Existe uma frase escrita dizendo o que encontraram, e ela cabe numa linha",
      "Essa frase tem por trás um dado que se pode mostrar",
      "Revisou-se o que tinham suposto antes de sair e disse-se em que se enganaram",
      "O que não bate ficou anotado como pergunta aberta, e não apagado",
    ],
    seCaeCuando:
      "Volta-se do campo e passa-se direto a propor soluções. Então a proposta não se apoia no que encontraram, mas no que já pensavam antes de sair, e todo o trabalho de campo vira enfeite. É o salto mais comum e o mais caro.",
    cierre: {
      preguntas: [
        "Em que eu estava enganado antes de sair?",
        "Que dado me convenceu, e por que esse e não outro?",
        "O que eu diria a alguém que não acredita na gente?",
      ],
      queMirar:
        "A primeira é o coração da etapa: quem não consegue nomear nada em que se enganou provavelmente não olhou os próprios dados. A terceira ensaia a defesa da descoberta antes que seja preciso.",
    },
    ejemplos: [
      {
        proyecto: "Um rio que parece sujo",
        asiSeVe:
          "Põem os três pontos numa tabela e descobrem que o mais barrento não é o mais poluído. A frase que fica escrita é que o problema entra depois do bairro e não antes, o contrário do que metade da sala pensava.",
      },
      {
        proyecto: "As árvores da rua",
        asiSeVe:
          "Cruzam as temperaturas das duas quadras com a contagem de árvores e com o que os avós contaram. A frase que fica é que a quadra sem sombra é mais quente no mesmo horário, e isso abre a pergunta de quem decidiu cortar as árvores e quando.",
      },
    ],
  },
  {
    id: "propuesta",
    nombre: "Criação de propostas e ação na comunidade",
    queOcurre:
      "Com o que encontraram, a turma projeta algo que possa ser feito aqui: uma campanha, um modelo, um plantio, uma proposta à subprefeitura. Faz-se uma primeira versão, os colegas criticam, e ela é refeita.",
    enUnaLinea:
      "Projetam algo que possa ser feito aqui, os colegas criticam e eles refazem.",
    alcance: "amplio",
    decide: "estudiantes",
    aprendizajes: [
      {
        nombre: "Projeto de uma solução viável",
        queEs:
          "Projeta soluções, modelos ou artefatos que possam ser feitos de verdade com as condições deste bairro.",
        seNotaEn:
          "sabem dizer que materiais fazem falta e de onde saem. Se depende de algo que precisa ser comprado longe, ainda não é viável.",
      },
      {
        nombre: "Compromisso cidadão",
        queEs:
          "Implementa ou formaliza a proposta, em vez de deixá-la no desenho.",
        seNotaEn:
          "há algo instalado, enviado ou protocolado, com data, e alguém de fora da escola recebeu.",
      },
      {
        nombre: "Uso do que existe",
        queEs:
          "Adapta os recursos disponíveis no entorno para responder à problemática.",
        seNotaEn:
          "a solução usa o que sobra no bairro, não o que aparece no catálogo de um fornecedor.",
      },
    ],
    preguntasQueAbren: [
      "De tudo o que encontramos, o que alguém de fora precisa saber?",
      "Para quem isto muda alguma coisa? Diga o nome: a comunidade não é um nome",
      "Que formato chega de verdade a essa pessoa, e qual a faria passar reto?",
      "Dá tempo de terminar bem com o que resta?",
      "Se quem precisa ver isto vir, qual é a primeira coisa que não vai entender?",
    ],
    estaListoCuando: [
      "Há um destinatário com nome",
      "O formato foi escolhido por eles e sabem dizer por que esse e não outro",
      "Houve uma primeira versão feita rápido, e feia, que ninguém entregou",
      "Dá para apontar com o dedo o que mudou entre uma versão e a outra",
    ],
    seCaeCuando:
      "O produto vem decidido de antes. Com o formato imposto pelo professor, isto vira uma tarefa longa, e o que ocorrer aos alunos não tem por onde entrar.",
    cierre: {
      preguntas: [
        "Para quem serve isto que estamos fazendo? Diga o nome.",
        "Que parte da nossa proposta eu acho que não vai funcionar?",
        "O que eu preciso aprender para fazer bem a minha parte?",
      ],
      queMirar:
        "A segunda vale mais que qualquer entusiasmo: uma turma que consegue nomear a parte fraca da própria proposta vai consertá-la. A terceira diz o que ainda falta ensinar, e a tempo.",
    },
    ejemplos: [
      {
        proyecto: "Um rio que parece sujo",
        asiSeVe:
          "Descartam o relatório porque no bairro ninguém lê relatório. Campanha nas redes: vídeo na margem com os dois frascos e uma pergunta à prefeitura. A outra turma pergunta como eles sabem que é o esgoto e não a chuva, e a segunda versão responde.",
      },
      {
        proyecto: "As árvores da rua",
        asiSeVe:
          "Um mapa da sombra do bairro, pendurado na entrada da escola, com a temperatura de cada quadra e um pedido de plantio à subprefeitura. Um morador antigo corrige o nome de duas árvores e o mapa é refeito.",
      },
    ],
  },
  {
    id: "difusion",
    nombre: "Divulgação e reflexão",
    queOcurre:
      "Apresentam o que encontraram e o que fizeram diante de gente de verdade: vizinhos, autoridades, quem entenda do assunto. Depois, e isto não se pula, olham para trás: em que mudou o que pensavam do lugar e do próprio papel nele.",
    enUnaLinea:
      "Apresentam para gente de fora e depois olham em que mudaram de ideia.",
    alcance: "amplio",
    decide: "estudiantes",
    aprendizajes: [
      {
        nombre: "Comunicação para um público real",
        queEs:
          "Comunica com clareza as descobertas e a proposta a autoridades, vizinhos ou colegas que não tinham obrigação de ouvir.",
        seNotaEn:
          "fala mais de um, não só quem sempre fala, e respondem a pergunta difícil sem olhar para você.",
      },
      {
        nombre: "Avaliação do próprio papel",
        queEs:
          "Avalia com critério o que conseguiu e o que não conseguiu fazer no seu território, sem inflar nem diminuir.",
        seNotaEn:
          "conseguem dizer que parte do problema continua de pé depois de tudo isto, sem que soe como derrota.",
      },
      {
        nombre: "Mudança no olhar",
        queEs:
          "Reflete sobre como mudou o que via, o que valorizava e o que sentia pelo seu entorno depois do projeto.",
        seNotaEn:
          "nomeiam algo do lugar que antes não olhavam. A frase que sempre aparece é alguma versão de «eu passava ali todo dia».",
      },
    ],
    preguntasQueAbren: [
      "Quando e onde exatamente, e quem avisa?",
      "Quem fala, e o que o resto faz enquanto isso?",
      "Se perguntarem algo que não sabemos, o que respondemos?",
      "O que você sabe hoje deste lugar que não sabia em fevereiro?",
      "Que parte disto fica para a turma do ano que vem?",
    ],
    estaListoCuando: [
      "Há data, lugar e alguém de fora esperando",
      "Está combinado quem faz o quê",
      "Ensaiaram a pergunta incômoda",
      "Cada um escreveu o que mudou no que pensava, e isso foi lido em voz alta",
    ],
    seCaeCuando:
      "Entrega-se à professora e fecha-se sem olhar para trás. Sem ninguém de fora, tudo o que veio antes foi um simulado; e sem o momento de reflexão, a turma fez o trabalho e não percebeu o que aconteceu com ela enquanto fazia.",
    cierre: {
      preguntas: [
        "O que mudou no jeito como eu olho este lugar?",
        "O que eu faria diferente se começássemos de novo?",
        "Que parte do problema continua ali depois de tudo isto?",
      ],
      queMirar:
        "A terceira é perguntada de propósito e não é derrotista: um projeto que diz ter resolvido um problema do território está mentindo, e reconhecer o que continua de pé faz parte da aprendizagem cidadã.",
    },
    ejemplos: [
      {
        proyecto: "Um rio que parece sujo",
        asiSeVe:
          "Publicam pela conta da escola e registram a reclamação no canal da prefeitura. Anotam se respondem e o quê. No fechamento, escrevem o que fariam diferente se o rio piorar no próximo verão.",
      },
      {
        proyecto: "As árvores da rua",
        asiSeVe:
          "Apresentam o mapa numa reunião de pais e na feira do sábado, cada um ao lado da sua quadra. No fechamento, comparam o bairro que desenharam em março com o que conhecem agora.",
      },
    ],
  },
];
