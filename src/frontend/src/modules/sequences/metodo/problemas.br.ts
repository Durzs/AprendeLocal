/**
 * Las problemáticas de la edición carioca.
 *
 * Son dos y no once, a propósito: sirven para que Thais pruebe el recorrido
 * entero con un curso real antes de escribir las demás sobre supuestos. Cada
 * una tiene la misma forma que las chilenas de §problemas.ts —fuentes reales,
 * cómo buscar las del barrio, y un ángulo por componente con las habilidades
 * de la BNCC que abre— y está escrita en portugués para un docente de Río.
 *
 * LAS FUENTES
 *
 * Todas se abrieron y se leyeron antes de citarlas; el registro de qué decía
 * cada una y quién la firma está en docs/fuentes-rio.md. Dos cosas que hay que
 * saber de ellas:
 *
 *   - La nota de Agência Brasil sobre las sirenas está desactivada en su sitio
 *     mientras dure el período electoral de 2026, por la legislación
 *     electoral. Se cita desde un diario que la reprodujo entera y con firma,
 *     y se dice así en pantalla. (La de Radioagência Nacional sobre la Baía
 *     sí abre: se comprobó el 22 de septiembre de 2026.)
 *   - La nota del Diário do Rio da las cifras de la concesionaria que opera el
 *     saneamiento, y ningún órgano público las respalda dentro del artículo.
 *     No se esconde: es justamente la conversación de la etapa 1, la de quién
 *     escribió esto y a quién le convenía escribirlo.
 *
 * LAS HABILIDADES
 *
 * Cada código de `oaQueAbre` existe en la BNCC cargada; el guardia del build
 * (scripts/revisar-lenguaje.mjs) falla si alguno no está.
 *
 * LOS COMPONENTES
 *
 * En los anos finais Ciências es uno solo —no hay biología, química y física
 * por separado— e História y Geografia son dos. Los ángulos usan esos
 * componentes, con los identificadores de `ASIGNATURAS_BR`.
 */

import type { Familia, Problema } from "./problemas";

export const ASIGNATURAS_BR: { id: string; nombre: string }[] = [
  { id: "ciencias", nombre: "Ciências" },
  { id: "geografia", nombre: "Geografia" },
  { id: "historia", nombre: "História" },
  { id: "matematica", nombre: "Matemática" },
  { id: "lingua_portuguesa", nombre: "Língua Portuguesa" },
  { id: "arte", nombre: "Arte" },
];

export const FAMILIAS_BR: Familia[] = [
  {
    id: "agua",
    nombre: "Água, rios e baía",
    deQueVa:
      "Qualidade da água e saneamento. O campo é o rio, o canal ou a praia perto da escola.",
  },
  {
    id: "encosta",
    nombre: "Encostas e chuva",
    deQueVa:
      "Risco de deslizamento e de alagamento. O campo é a encosta, a rua e a memória dos vizinhos.",
  },
];

export const PROBLEMAS_BR: Problema[] = [
  {
    id: "br_baia_guanabara",
    familia: "agua",
    nombre: "O esgoto que chega à Baía de Guanabara",
    queEs:
      "Os rios que atravessam a cidade —muitos canalizados, alguns escondidos debaixo da rua— recebem esgoto sem tratamento e o levam até a Baía de Guanabara. O cheiro, a cor e o lixo na margem são a parte que se vê. O que não se vê é quanto disso vem de ligações clandestinas e quanto de uma rede que nunca chegou.",
    dondeAparece:
      "Escolas perto de um rio, canal ou valão que deságua na Baía de Guanabara, o que inclui boa parte da Zona Norte, do Centro e da Baixada Fluminense. Serve também para quem tem perto uma lagoa ou uma praia imprópria para banho.",
    respaldo: [
      {
        titular: "Baía de Guanabara tem toda sua água classificada como péssima ou ruim",
        medio: "Radioagência Nacional (EBC)",
        fecha: "28 de junho de 2022",
        url: "https://agenciabrasil.ebc.com.br/radioagencia-nacional/meio-ambiente/audio/2022-06/baia-de-guanabara-tem-toda-sua-agua-classificada-como-pessima-ou-ruim",
        queAporta:
          "A medição é do Inea, o Instituto Estadual do Ambiente. Dos 21 pontos analisados, 13 ficaram «péssima» e 8 «ruim», e nenhum chegou a «regular». Foi a primeira vez, na série iniciada em 2014, que todos os pontos deram índice negativo.",
      },
      {
        titular:
          "Força-tarefa evita despejo diário de 9 milhões de litros de esgoto no Rio Maracanã",
        medio: "Diário do Rio",
        fecha: "20 de julho de 2026",
        url: "https://diariodorio.com/forca-tarefa-evita-despejo-diario-de-9-milhoes-de-litros-de-esgoto-no-rio-maracana",
        queAporta:
          "Os números são da Águas do Rio, a concessionária que opera o saneamento, ditos pelo seu diretor: 9,36 milhões de litros por dia que deixam de chegar ao rio Maracanã, 82 ligações clandestinas eliminadas e R$ 6,3 bilhões investidos. Nenhum órgão público confirma esses números dentro da matéria. Não é motivo para descartá-la, e sim para ler com a turma quem está falando.",
      },
    ],
    comoSeBuscan: {
      terminos: [
        "valão + nome do bairro",
        "esgoto + nome do rio",
        "língua negra + nome da praia",
        "balneabilidade Inea + nome da praia",
      ],
      donde:
        "Portais e jornais locais, os boletins de balneabilidade do Inea e as reclamações registradas pelos moradores na central 1746 da prefeitura, que dizem rua e data.",
      queNotaSirve:
        "Prefira notícias com data, rua ou trecho do rio e alguém citado. Uma matéria geral sobre a Baía não dá para visitar; uma que fala do valão da sua rua, sim.",
    },
    angulos: [
      {
        asignatura: "ciencias",
        enfoque: "Medir a qualidade da água em três pontos do mesmo rio.",
        queInvestigan:
          "pH, turbidez, cor e cheiro antes do bairro, no bairro e depois, sempre no mesmo horário, e que animais e plantas aparecem em cada trecho.",
        queSaleDeAqui:
          "Um mapa do rio com os pontos marcados. Serve para mostrar onde o problema entra, que é diferente de dizer que o rio está sujo.",
        conceptosClave: [
          "mistura homogênea e heterogênea",
          "pH",
          "turbidez",
          "saneamento básico",
          "doença de veiculação hídrica",
        ],
        tecnicas: ["muestreo_agua", "bitacora"],
        oaQueAbre: ["EF06CI01", "EF07CI09", "EF09CI13"],
      },
      {
        asignatura: "geografia",
        enfoque: "O caminho da água, da rua até a baía.",
        queInvestigan:
          "Por onde passa o rio, onde foi canalizado, onde some debaixo da rua e onde deságua. E a diferença entre a chuva que cai no asfalto e a que cai num trecho de terra com plantas.",
        queSaleDeAqui:
          "Um mapa da bacia do bairro feito pela turma, com os trechos canalizados e as saídas de esgoto que encontraram.",
        conceptosClave: [
          "bacia hidrográfica",
          "escoamento superficial",
          "canalização",
          "escala do mapa",
        ],
        tecnicas: ["mapa_a_mano", "foto_punto_fijo"],
        oaQueAbre: ["EF06GE04", "EF06GE08", "EF06GE10", "EF06GE12"],
      },
      {
        asignatura: "historia",
        enfoque: "O que o rio era antes de virar valão.",
        queInvestigan:
          "Para que o rio servia, quando foi canalizado e por quê. Com fotos antigas das famílias e entrevistas com quem mora no bairro há mais tempo.",
        queSaleDeAqui:
          "A linha do tempo do rio contada por quem estava lá. É o que explica por que ele importa para o bairro, e sem isso o projeto é um relatório técnico.",
        conceptosClave: ["urbanização", "fonte oral", "memória", "linha do tempo"],
        tecnicas: ["entrevista", "foto_punto_fijo"],
        oaQueAbre: ["EF09HI05", "EF06HI05"],
      },
      {
        asignatura: "matematica",
        enfoque: "Os números do esgoto, lidos com cuidado.",
        queInvestigan:
          "Transformar os milhões de litros por dia das notícias em algo que caiba na cabeça (caixas-d'água, piscinas), calcular a média das medições da turma e ver se os números das duas notícias podem ser comparados.",
        queSaleDeAqui:
          "Os gráficos com que a turma defende a descoberta, e a conta que mostra quando um número grande não quer dizer o que parece.",
        conceptosClave: ["litro e metro cúbico", "média", "porcentagem", "gráfico de barras e de linhas"],
        tecnicas: ["medicion_dimensiones", "bitacora"],
        oaQueAbre: ["EF08MA20", "EF07MA35", "EF06MA32", "EF09MA21"],
      },
      {
        asignatura: "lingua_portuguesa",
        enfoque: "Quem diz o quê sobre a baía, e por quê.",
        queInvestigan:
          "Comparar as duas notícias: quem mediu, quem assina, que número cada uma escolhe mostrar e o que deixa de fora. Depois, escrever a reclamação ou a notícia da turma.",
        queSaleDeAqui:
          "Uma carta de reclamação ou uma notícia que ninguém consiga desmontar, porque cada afirmação diz de onde veio.",
        conceptosClave: ["fato e opinião", "fonte", "notícia e reportagem", "carta de reclamação"],
        tecnicas: ["entrevista", "bitacora"],
        oaQueAbre: ["EF07LP02", "EF69LP03", "EF67LP17", "EF69LP06"],
      },
      {
        asignatura: "arte",
        enfoque: "O rio em fotografia, sempre do mesmo ponto.",
        queInvestigan:
          "Fotografar os três trechos com o mesmo enquadramento e no mesmo horário, repetido ao longo das semanas.",
        queSaleDeAqui:
          "Uma série que mostra a diferença entre os trechos sem precisar explicar. É o que faz alguém de fora entender do que se está falando.",
        conceptosClave: ["enquadramento", "série", "ponto de vista", "luz"],
        tecnicas: ["foto_punto_fijo", "bitacora"],
        oaQueAbre: ["EF69AR05", "EF69AR04"],
      },
    ],
  },
  {
    id: "br_encostas",
    familia: "encosta",
    nombre: "Morar na encosta quando chove forte",
    queEs:
      "Quando chove forte, a terra da encosta pode descer, e a água que não tem por onde escoar invade a rua. Onde se constrói na encosta e na beira do rio o risco cresce, e ele não é igual para todos: as sirenes e os estudos de risco chegaram a alguns bairros e não a outros.",
    dondeAparece:
      "Escolas em morros, perto de encostas ou de rios que transbordam, e especialmente nas comunidades que ainda não têm sirene nem estudo de risco.",
    respaldo: [
      {
        titular:
          "Moradias em áreas de risco de deslizamentos triplicaram em 40 anos, enquanto eventos extremos são mais frequentes: «É desesperador»",
        medio: "Brasil de Fato",
        fecha: "4 de março de 2026",
        url: "https://www.brasildefato.com.br/2026/03/04/moradias-em-areas-de-risco-de-deslizamentos-triplicaram-em-40-anos-enquanto-eventos-extremos-sao-mais-frequentes-e-desesperador/",
        queAporta:
          "Os números são do MapBiomas, a partir de imagens de satélite: a área urbanizada em risco de deslizamento passou de 14 mil hectares em 1985 para 43,4 mil em 2024. Sobre o Rio, diz que a cidade está entre as que têm maior proporção de área urbanizada em cotas críticas: 43% até três metros.",
      },
      {
        titular: "Rio precisa ampliar sistema de alerta de deslizamentos, diz instituto",
        medio: "Agência Brasil, reproduzida pelo Diário de Petrópolis",
        fecha: "5 de abril de 2025",
        url: "https://diariodepetropolis.com.br/integra/rio-precisa-ampliar-sistema-de-alerta-de-deslizamentos-diz-instituto-22080",
        queAporta:
          "Matéria de Vitor Abdala. O sistema de sirenes de 2011 tem 164 sirenes em 103 comunidades das zonas Sul e Norte, e não foi ampliado desde então. Um relatório do Tribunal de Contas do Município de 2022 contou pelo menos 400 comunidades sem sirene nem estudo de risco, a maioria na Zona Oeste. O projeto Rio 60ºC, da UFF, estima 60 mil domicílios sujeitos a deslizamento. O original da Agência Brasil fica fora do ar durante o período eleitoral de 2026.",
      },
    ],
    comoSeBuscan: {
      terminos: [
        "deslizamento + nome do bairro",
        "sirene Defesa Civil + nome da comunidade",
        "alagamento + nome da rua",
        "Alerta Rio + chuva + mês e ano",
      ],
      donde:
        "Portais e jornais locais, o site da Defesa Civil do município, que publica o plano de contingência, e o Alerta Rio, que guarda quanto choveu em cada estação.",
      queNotaSirve:
        "Prefira notícias com o nome da comunidade, a data da chuva e quantos milímetros caíram. É o que permite comparar com o que a turma mede e com o que os vizinhos lembram.",
    },
    angulos: [
      {
        asignatura: "geografia",
        enfoque: "Onde é seguro construir, e quem decide.",
        queInvestigan:
          "Desenhar o perfil da encosta do bairro e marcar onde há casas, por onde a água corre quando chove e onde fica a sirene mais próxima, se houver.",
        queSaleDeAqui:
          "Um mapa de risco do entorno da escola feito pela turma. Mostra o que o mapa oficial não mostra, ou o que falta nele.",
        conceptosClave: ["encosta e declividade", "escoamento superficial", "área de risco", "perfil topográfico"],
        tecnicas: ["mapa_a_mano", "foto_punto_fijo"],
        oaQueAbre: ["EF06GE09", "EF06GE04", "EF06GE10", "EF08GE17"],
      },
      {
        asignatura: "ciencias",
        enfoque: "Por que a terra desce.",
        queInvestigan:
          "Com terra em bandejas inclinadas, com e sem plantas, comparar quanto solo a água leva. No campo, observar onde há raízes, lixo ou entulho na encosta.",
        queSaleDeAqui:
          "Uma explicação, com prova, de por que uma encosta coberta segura mais que uma encosta nua. É o argumento a favor do replantio.",
        conceptosClave: ["solo", "erosão", "cobertura vegetal", "catástrofe natural"],
        tecnicas: ["muestra_suelo", "bitacora"],
        oaQueAbre: ["EF07CI08", "EF08CI16", "EF09CI13"],
      },
      {
        asignatura: "matematica",
        enfoque: "Quarenta anos em números.",
        queInvestigan:
          "Comparar os números de 1985 e de 2024 da notícia (quantas vezes cresceu, e em porcentagem), medir a chuva com um pluviômetro de garrafa PET e calcular a média da semana.",
        queSaleDeAqui:
          "A conta que mostra quanto o risco cresceu, e uma série de chuva medida pela própria escola.",
        conceptosClave: ["porcentagem", "razão", "média", "milímetro de chuva"],
        tecnicas: ["medicion_dimensiones", "bitacora"],
        oaQueAbre: ["EF06MA13", "EF07MA02", "EF07MA35", "EF06MA24"],
      },
      {
        asignatura: "historia",
        enfoque: "Como o morro foi ocupado.",
        queInvestigan:
          "Quando chegaram as primeiras famílias, de onde vieram e por que ali, contado por moradores antigos. E de quais chuvas fortes o bairro se lembra.",
        queSaleDeAqui:
          "A história do bairro que explica o risco sem culpar quem mora lá. Sem ela, a proposta vira sermão.",
        conceptosClave: ["urbanização", "migração", "fonte oral", "memória"],
        tecnicas: ["entrevista"],
        oaQueAbre: ["EF09HI05", "EF09HI18"],
      },
      {
        asignatura: "lingua_portuguesa",
        enfoque: "Um aviso que a vizinhança leia.",
        queInvestigan:
          "Como a Defesa Civil avisa hoje (sirene, SMS, rádio), o que os vizinhos entendem desses avisos, e escrever um material que funcione para quem mora ali.",
        queSaleDeAqui:
          "Uma campanha testada com gente do bairro antes de ser distribuída.",
        conceptosClave: ["público-alvo", "campanha", "entrevista", "argumento"],
        tecnicas: ["entrevista", "encuesta"],
        oaQueAbre: ["EF69LP09", "EF89LP13", "EF89LP21", "EF67LP16"],
      },
      {
        asignatura: "arte",
        enfoque: "A encosta desenhada de perto.",
        queInvestigan:
          "Desenhos e fotos da encosta vista da escola, repetidos depois de cada chuva forte.",
        queSaleDeAqui:
          "Uma série que mostra o que muda depois da chuva, para quem nunca olhou a encosta com atenção.",
        conceptosClave: ["enquadramento", "série", "desenho de observação", "escala"],
        tecnicas: ["foto_punto_fijo", "bitacora"],
        oaQueAbre: ["EF69AR05", "EF69AR04"],
      },
    ],
  },
];

/**
 * Lo que el curso tiene que sacar en limpio de la primera clase, en
 * portugués. Es el mismo contenido que `QUE_SACAN_DE_LA_NOTICIA`.
 */
export const QUE_SACAN_PT: { titulo: string; queEs: string; seNotaEn: string }[] = [
  {
    titulo: "Entendem do que se trata",
    queEs:
      "Separam da notícia quem está envolvido, o que causou, que consequências tem, onde acontece e desde quando.",
    seNotaEn:
      "conseguem responder «de quando é isto e onde fica?» sem reler, e percebem quando a notícia não diz.",
  },
  {
    titulo: "Ligam com o que é deles",
    queEs:
      "Explicam com as próprias palavras em que isso os afeta, ou afeta a comunidade, de forma direta ou indireta.",
    seNotaEn:
      "aparece um lugar concreto daqui no que dizem, não «o meio ambiente». Se ninguém consegue fazer a ligação, essa problemática não é a desta escola.",
  },
  {
    titulo: "Fazem perguntas próprias",
    queEs:
      "Formulam perguntas ou dúvidas que mostram que querem descobrir algo, e que a notícia não responde.",
    seNotaEn:
      "as perguntas são sobre aqui e não sobre a notícia. É esta que decide se há projeto: sem perguntas próprias, o que vem depois é interpretação de texto.",
  },
];
