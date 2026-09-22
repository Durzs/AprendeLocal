/**
 * Con qué se mira cada habilidad en la sala, para la edición carioca.
 *
 * Lo mismo que §indicadores.ts y por las mismas razones: tres por habilidad,
 * escritos para poder mirarlos un jueves a las diez, y no los de ningún
 * documento oficial. La pantalla lo dice arriba, porque esta hoja se copia en
 * documentos que se firman.
 *
 * Solo están las habilidades que abre alguna actividad de §problemas.br.ts.
 * Las demás se pueden marcar igual, y el docente escribe sus indicadores.
 */
export const INDICADORES_BR: Record<string, string[]> = {
  /* ── Ciências ────────────────────────────────────────────────────────── */
  EF06CI01: [
    "Diz se a amostra de água do rio é uma mistura homogênea ou heterogênea e aponta o que viu para decidir.",
    "Separa, em duas colunas, o que dá para ver a olho nu na amostra e o que só aparece com a medição.",
    "Explica por que água transparente não é o mesmo que água limpa.",
  ],
  EF07CI09: [
    "Relaciona o que mediu no rio com uma doença que se transmite pela água, e diz qual é o caminho.",
    "Encontra um número sobre saneamento do próprio bairro ou município e diz de onde ele veio.",
    "Distingue o que depende de cada família e o que depende de uma política pública.",
  ],
  EF09CI13: [
    "Propõe uma ação que a turma consegue fazer de verdade com o que tem, e diz a quem ela serve.",
    "Cita uma experiência parecida que deu certo em outro lugar e diz o que dela se aplica aqui.",
    "Reconhece o limite da própria proposta: o que ela não resolve.",
  ],
  EF07CI08: [
    "Explica, com um exemplo do bairro, como uma chuva forte muda o que vive na encosta ou no rio.",
    "Distingue o que é fenômeno natural e o que é consequência de como o lugar foi ocupado.",
    "Usa o resultado do experimento das bandejas para sustentar o que afirma.",
  ],
  EF08CI16: [
    "Nomeia uma mudança no clima ou no ambiente do bairro e diz de onde tirou essa informação.",
    "Propõe uma iniciativa que ajuda a recompor o equilíbrio do lugar, como um replantio, e diz por quê.",
    "Separa o que é dado medido do que é opinião na discussão da turma.",
  ],

  /* ── Geografia ───────────────────────────────────────────────────────── */
  EF06GE04: [
    "Desenha o caminho da água da chuva desde a rua da escola até o rio ou a baía.",
    "Compara o que acontece com a chuva no asfalto e num trecho de terra com plantas, usando o que observou.",
    "Nomeia pelo menos um trecho do rio que foi canalizado ou coberto, e onde fica.",
  ],
  EF06GE08: [
    "Usa a escala do mapa para calcular a distância real entre dois pontos do percurso.",
    "O mapa da turma tem escala, e ela foi conferida com uma medida feita no campo.",
    "Percebe quando uma distância no mapa não bate com a que caminhou, e procura o porquê.",
  ],
  EF06GE09: [
    "Faz o perfil da encosta com a inclinação aproximada, e as casas e o caminho da água aparecem nele.",
    "Explica o perfil para alguém de fora apontando onde é mais íngreme e o que há ali.",
    "O modelo ou perfil corresponde ao que fotografou do lugar: dá para reconhecer a encosta.",
  ],
  EF06GE10: [
    "Identifica no bairro uma forma de uso do solo (aterro, corte de encosta, canalização) e diz para que foi feita.",
    "Diz uma vantagem e uma desvantagem dessa intervenção, com um exemplo do próprio lugar.",
    "Relaciona o caminho do esgoto do bairro com a rede de tratamento, ou com a falta dela.",
  ],
  EF06GE12: [
    "Nomeia a bacia hidrográfica a que pertence o rio perto da escola.",
    "Diz para que a água desse rio foi usada e para que é usada hoje.",
    "Relaciona o consumo de água do bairro com o que chega ao rio depois.",
  ],
  EF08GE17: [
    "Localiza no mapa as áreas de risco do entorno da escola, e onde existe e onde não existe sirene.",
    "Explica por que há gente morando em área de risco sem culpar quem mora lá.",
    "Compara duas partes da cidade quanto ao risco e à proteção que recebem, com dados.",
  ],

  /* ── História ────────────────────────────────────────────────────────── */
  EF09HI05: [
    "Monta uma linha do tempo do bairro com pelo menos três datas tiradas de entrevistas ou documentos.",
    "Relaciona uma mudança do bairro (canalização, ocupação do morro) com o crescimento da cidade.",
    "Aponta uma contradição da urbanização no próprio lugar: o que melhorou para uns e piorou para outros.",
  ],
  EF06HI05: [
    "Descreve como a paisagem do lugar era antes, segundo uma fonte, e como está hoje.",
    "Diz quem fez a mudança na paisagem e com que objetivo.",
    "Distingue o que a fonte afirma do que a turma supõe sobre o passado.",
  ],
  EF09HI18: [
    "Localiza no tempo quando o morro ou o bairro começou a ser ocupado, com uma fonte.",
    "Relaciona essa ocupação com a chegada de trabalhadores à cidade, contada por quem viveu.",
    "Explica como essa história ajuda a entender a desigualdade de hoje no bairro.",
  ],

  /* ── Matemática ──────────────────────────────────────────────────────── */
  EF08MA20: [
    "Converte milhões de litros em metros cúbicos e explica a conta em voz alta.",
    "Compara o volume da notícia com algo conhecido (caixa-d'água, piscina da escola).",
    "Percebe e corrige um erro de conversão de um colega.",
  ],
  EF07MA35: [
    "Calcula a média das medições de cada ponto e diz o que ela resume e o que esconde.",
    "Identifica a medição que foge das outras e discute se foi erro ou se ali acontece algo.",
    "Usa a média para comparar dois pontos, e não uma medição solta.",
  ],
  EF06MA32: [
    "Lê um gráfico ou tabela de notícia sobre o ambiente e diz o que ele mostra.",
    "Responde a uma pergunta da turma usando os dados, e não a opinião.",
    "Diz qual informação falta no gráfico para tirar a conclusão.",
  ],
  EF09MA21: [
    "Aponta num gráfico da mídia um elemento que pode induzir a erro (escala, eixo cortado, legenda).",
    "Refaz o gráfico corrigindo o problema e mostra a diferença.",
    "Explica quem ganha com o gráfico enganoso, se alguém ganha.",
  ],
  EF06MA13: [
    "Calcula quanto uma área cresceu em porcentagem entre duas datas, sem regra de três, e explica o caminho.",
    "Diz se «triplicou» e o resultado em porcentagem que calculou dizem a mesma coisa.",
    "Confere a conta com uma estimativa de cabeça antes de aceitar o resultado.",
  ],
  EF07MA02: [
    "Resolve um problema de acréscimo percentual com os dados da notícia.",
    "Formula um problema novo com os dados do bairro para um colega resolver.",
    "Explica a diferença entre aumentar 200% e aumentar para 200%.",
  ],
  EF06MA24: [
    "Mede a chuva em milímetros com o pluviômetro da escola, no mesmo horário, e anota.",
    "Compara a medição da escola com a da estação do Alerta Rio mais próxima e discute a diferença.",
    "Usa a unidade certa em cada medida da ficha de campo.",
  ],

  /* ── Língua Portuguesa ───────────────────────────────────────────────── */
  EF07LP02: [
    "Compara duas notícias sobre o mesmo fato e aponta o que cada uma destaca e o que omite.",
    "Identifica quem é a fonte de cada número e se ela tem interesse no resultado.",
    "Explica por que duas notícias verdadeiras podem parecer contraditórias.",
  ],
  EF69LP03: [
    "Diz o fato central da notícia, onde e quando aconteceu, sem reler.",
    "Separa o fato das circunstâncias e das consequências.",
    "Percebe quando a notícia não diz algo importante, como a data ou o lugar.",
  ],
  EF67LP17: [
    "A carta de reclamação da turma tem data, apresentação, problema, pedido e despedida.",
    "Cada afirmação da carta vem acompanhada de um dado ou de uma observação da turma.",
    "A carta chega a quem pode resolver, pelo canal certo, e a turma sabe qual é.",
  ],
  EF69LP06: [
    "Produz uma notícia ou fotodenúncia com título, lide e as fontes citadas.",
    "Publica o texto num lugar onde o bairro vai ver, e registra onde.",
    "Revisa o texto depois do comentário de um colega e aponta o que mudou.",
  ],
  EF69LP09: [
    "Planeja a campanha a partir do que levantou com os vizinhos, e não do que a turma supõe.",
    "Escolhe o formato e o lugar da campanha pensando em quem precisa vê-la.",
    "Testa uma peça da campanha com alguém do bairro antes de distribuí-la.",
  ],
  EF89LP13: [
    "Prepara o roteiro da entrevista antes, com perguntas abertas.",
    "Registra as respostas com fidelidade, e cita o entrevistado corretamente.",
    "Faz uma pergunta de acompanhamento que não estava no roteiro.",
  ],
  EF89LP21: [
    "Aplica uma enquete curta a vizinhos e registra quantos responderam.",
    "Resume os resultados em uma frase que os dados sustentam.",
    "Usa os resultados para decidir o conteúdo da campanha.",
  ],
  EF67LP16: [
    "Identifica o canal oficial onde se registra o problema (como a central 1746) e como funciona.",
    "Registra uma solicitação ou acompanha uma registrada, e anota o protocolo.",
    "Avalia se o canal respondeu, em quanto tempo e com o quê.",
  ],

  /* ── Arte ────────────────────────────────────────────────────────────── */
  EF69AR05: [
    "Fotografa ou desenha sempre do mesmo ponto e com o mesmo enquadramento, e consegue repetir.",
    "Escolhe, entre as imagens que fez, as que mostram a diferença, e diz por que descartou as outras.",
    "Monta uma série que alguém de fora entende sem explicação.",
  ],
  EF69AR04: [
    "Usa a luz, o enquadramento e a escala com intenção, e sabe dizer qual.",
    "Analisa a série de um colega apontando um elemento visual concreto.",
    "Percebe quando uma edição da imagem muda o que ela afirma.",
  ],
};
