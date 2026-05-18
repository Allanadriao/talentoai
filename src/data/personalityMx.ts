export type PersonalityTrait = 'Aberto' | 'Fechado' | 'Tradicional' | 'Inovador' | 'Pensador' | 'Sentimento' | 'Decisivo' | 'Flexível';

export interface PersonalityOption {
  text: string;
  trait: PersonalityTrait;
}

export interface PersonalityQuestion {
  id: number;
  text: string;
  options: [PersonalityOption, PersonalityOption];
}

export const personalityMxQuestions: PersonalityQuestion[] = [
  {
    "id": 1,
    "text": "Numa festa você:",
    "options": [
      {
        "text": "Interage com muitos, incluindo estranhos",
        "trait": "Aberto"
      },
      {
        "text": "Interage com poucos, apenas conhecidos",
        "trait": "Fechado"
      }
    ]
  },
  {
    "id": 2,
    "text": "Você é mais:",
    "options": [
      {
        "text": "Realista",
        "trait": "Tradicional"
      },
      {
        "text": "Filosófico",
        "trait": "Inovador"
      }
    ]
  },
  {
    "id": 3,
    "text": "Você se interessa mais por: D / F",
    "options": [
      {
        "text": "Fatos",
        "trait": "Decisivo"
      },
      {
        "text": "Semelhanças (comparações)",
        "trait": "Flexível"
      }
    ]
  },
  {
    "id": 4,
    "text": "Normalmente você é:",
    "options": [
      {
        "text": "Justo",
        "trait": "Pensador"
      },
      {
        "text": "Sensível (interessado)",
        "trait": "Sentimento"
      }
    ]
  },
  {
    "id": 5,
    "text": "Você tende ser mais:",
    "options": [
      {
        "text": "Calculista",
        "trait": "Pensador"
      },
      {
        "text": "Empático",
        "trait": "Sentimento"
      }
    ]
  },
  {
    "id": 6,
    "text": "Você prefere trabalhar: D / F",
    "options": [
      {
        "text": "Na última hora",
        "trait": "Decisivo"
      },
      {
        "text": "A todo tempo",
        "trait": "Flexível"
      }
    ]
  },
  {
    "id": 7,
    "text": "Você tende escolher:",
    "options": [
      {
        "text": "Cuidadosamente",
        "trait": "Pensador"
      },
      {
        "text": "Impulsivamente",
        "trait": "Sentimento"
      }
    ]
  },
  {
    "id": 8,
    "text": "Nas festas você:",
    "options": [
      {
        "text": "Fica até tarde, com muita disposição",
        "trait": "Aberto"
      },
      {
        "text": "Sai cedo, com pouca disposição",
        "trait": "Fechado"
      }
    ]
  },
  {
    "id": 9,
    "text": "Você é uma pessoa mais:",
    "options": [
      {
        "text": "Sensível",
        "trait": "Sentimento"
      },
      {
        "text": "Reflexiva",
        "trait": "Pensador"
      }
    ]
  },
  {
    "id": 10,
    "text": "Você é mais inclinado a ser:",
    "options": [
      {
        "text": "Objetivo",
        "trait": "Tradicional"
      },
      {
        "text": "Abstrato",
        "trait": "Inovador"
      }
    ]
  },
  {
    "id": 11,
    "text": "Para você é mais natural ser:",
    "options": [
      {
        "text": "Justo com os outros",
        "trait": "Decisivo"
      },
      {
        "text": "Agradável",
        "trait": "Flexível"
      }
    ]
  },
  {
    "id": 12,
    "text": "Num primeiro contato com os outros, você é:",
    "options": [
      {
        "text": "Impessoal e desinteressado",
        "trait": "Fechado"
      },
      {
        "text": "Pessoal e interessado",
        "trait": "Aberto"
      }
    ]
  },
  {
    "id": 13,
    "text": "Normalmente você é: D / F",
    "options": [
      {
        "text": "Pontual",
        "trait": "Decisivo"
      },
      {
        "text": "Sossegado",
        "trait": "Flexível"
      }
    ]
  },
  {
    "id": 14,
    "text": "Você se incomoda mais em ter coisas:",
    "options": [
      {
        "text": "Incompletas",
        "trait": "Decisivo"
      },
      {
        "text": "Completas",
        "trait": "Flexível"
      }
    ]
  },
  {
    "id": 15,
    "text": "Em seus grupos sociais você:I",
    "options": [
      {
        "text": "Mantém-se atualizado acerca dos acontecimentos",
        "trait": "Inovador"
      },
      {
        "text": "Fica desatualizado",
        "trait": "Tradicional"
      }
    ]
  },
  {
    "id": 16,
    "text": "Normalmente você se interessa mais por: T / I",
    "options": [
      {
        "text": "Detalhes",
        "trait": "Inovador"
      },
      {
        "text": "Conceitos",
        "trait": "Tradicional"
      }
    ]
  },
  {
    "id": 17,
    "text": "Você prefere escritores que: I",
    "options": [
      {
        "text": "Vão direto ao assunto",
        "trait": "Tradicional"
      },
      {
        "text": "Usam muitas analogias",
        "trait": "Inovador"
      }
    ]
  },
  {
    "id": 18,
    "text": "Naturalmente você é mais: P / S",
    "options": [
      {
        "text": "Imparcial",
        "trait": "Pensador"
      },
      {
        "text": "Compassivo",
        "trait": "Sentimento"
      }
    ]
  },
  {
    "id": 19,
    "text": "Num julgamento é mais comum você ser:",
    "options": [
      {
        "text": "Impessoal",
        "trait": "Pensador"
      },
      {
        "text": "Sentimental",
        "trait": "Sentimento"
      }
    ]
  },
  {
    "id": 20,
    "text": "Você normalmente:",
    "options": [
      {
        "text": "Define as coisas",
        "trait": "Decisivo"
      },
      {
        "text": "Mantém-se aberto às opções",
        "trait": "Flexível"
      }
    ]
  },
  {
    "id": 21,
    "text": "Você normalmente prefere:",
    "options": [
      {
        "text": "Rapidamente concordar com um horário",
        "trait": "Aberto"
      },
      {
        "text": "Relutar em aceitar um horário",
        "trait": "Fechado"
      }
    ]
  },
  {
    "id": 22,
    "text": "Ao ligar para alguém você:",
    "options": [
      {
        "text": "Apenas começa falando",
        "trait": "Sentimento"
      },
      {
        "text": "Prepara o que irá dizer -",
        "trait": "Pensador"
      }
    ]
  },
  {
    "id": 23,
    "text": "Fatos:",
    "options": [
      {
        "text": "Falam por eles mesmos",
        "trait": "Tradicional"
      },
      {
        "text": "Normalmente requer que sejam interpretados",
        "trait": "Inovador"
      }
    ]
  },
  {
    "id": 24,
    "text": "Você prefere trabalhar com:",
    "options": [
      {
        "text": "Informações práticas",
        "trait": "Tradicional"
      },
      {
        "text": "Ideias abstratas",
        "trait": "Inovador"
      }
    ]
  },
  {
    "id": 25,
    "text": "Você é mais inclinado a ser uma pessoa:",
    "options": [
      {
        "text": "Fria",
        "trait": "Fechado"
      },
      {
        "text": "Calorosa",
        "trait": "Aberto"
      }
    ]
  },
  {
    "id": 26,
    "text": "Você preferiria ser:",
    "options": [
      {
        "text": "Mais justo que misericordioso",
        "trait": "Pensador"
      },
      {
        "text": "Mais misericordioso que justo",
        "trait": "Sentimento"
      }
    ]
  },
  {
    "id": 27,
    "text": "Você se sente mais confortável:",
    "options": [
      {
        "text": "Cumprindo um cronograma",
        "trait": "Decisivo"
      },
      {
        "text": "Colocando-as de lado",
        "trait": "Flexível"
      }
    ]
  },
  {
    "id": 28,
    "text": "Você se sente mais confortável com:",
    "options": [
      {
        "text": "Acordos escritos",
        "trait": "Decisivo"
      },
      {
        "text": "Acordos de palavra",
        "trait": "Flexível"
      }
    ]
  },
  {
    "id": 29,
    "text": "Quando na companhia de alguém você:",
    "options": [
      {
        "text": "Inicia as conversas",
        "trait": "Aberto"
      },
      {
        "text": "Espera ser abordado",
        "trait": "Fechado"
      }
    ]
  },
  {
    "id": 30,
    "text": "O senso comum tradicional é: I",
    "options": [
      {
        "text": "Normalmente confiável",
        "trait": "Tradicional"
      },
      {
        "text": "Frequentemente enganoso",
        "trait": "Inovador"
      }
    ]
  },
  {
    "id": 31,
    "text": "As crianças normalmente não:",
    "options": [
      {
        "text": "Fazem-se suficientemente úteis",
        "trait": "Pensador"
      },
      {
        "text": "Sonham o bastante",
        "trait": "Sentimento"
      }
    ]
  },
  {
    "id": 32,
    "text": "Você normalmente é mais:",
    "options": [
      {
        "text": "De caráter forte",
        "trait": "Decisivo"
      },
      {
        "text": "Gentil e simpático",
        "trait": "Flexível"
      }
    ]
  },
  {
    "id": 33,
    "text": "Você é mais:",
    "options": [
      {
        "text": "Firme do que gentil",
        "trait": "Decisivo"
      },
      {
        "text": "Gentil do que firme",
        "trait": "Flexível"
      }
    ]
  },
  {
    "id": 34,
    "text": "Você é mais tendencioso a manter as coisas:",
    "options": [
      {
        "text": "Bem organizadas",
        "trait": "Decisivo"
      },
      {
        "text": "Sem terminar",
        "trait": "Flexível"
      }
    ]
  },
  {
    "id": 35,
    "text": "Você dá mais valor ao que é:",
    "options": [
      {
        "text": "Definitivo",
        "trait": "Tradicional"
      },
      {
        "text": "Mutável",
        "trait": "Inovador"
      }
    ]
  },
  {
    "id": 36,
    "text": "Novas interações com outros:",
    "options": [
      {
        "text": "O estimula e incentiva",
        "trait": "Aberto"
      },
      {
        "text": "Consome suas energias",
        "trait": "Fechado"
      }
    ]
  },
  {
    "id": 37,
    "text": "Frequentemente você é:",
    "options": [
      {
        "text": "Uma pessoa do tipo prática",
        "trait": "Tradicional"
      },
      {
        "text": "Um tipo de pessoa abstrata",
        "trait": "Inovador"
      }
    ]
  },
  {
    "id": 38,
    "text": "Qual dos itens se identifica mais com você: F",
    "options": [
      {
        "text": "Percepção exata e sem enganos",
        "trait": "Decisivo"
      },
      {
        "text": "Formação de conceitos",
        "trait": "Flexível"
      }
    ]
  },
  {
    "id": 39,
    "text": "O que é mais realizador:",
    "options": [
      {
        "text": "Discutir uma questão profundamente",
        "trait": "Pensador"
      },
      {
        "text": "Chegar a um acordo acerca de um assunto",
        "trait": "Sentimento"
      }
    ]
  },
  {
    "id": 40,
    "text": "O que te conduz mais:",
    "options": [
      {
        "text": "Sua cabeça",
        "trait": "Pensador"
      },
      {
        "text": "Seu coração",
        "trait": "Sentimento"
      }
    ]
  },
  {
    "id": 41,
    "text": "Você se sente mais confortável com um trabalho:",
    "options": [
      {
        "text": "Contratado",
        "trait": "Tradicional"
      },
      {
        "text": "Feito de forma casual",
        "trait": "Inovador"
      }
    ]
  },
  {
    "id": 42,
    "text": "Você prefere que as coisas sejam: T / I",
    "options": [
      {
        "text": "Certas e ordenadas",
        "trait": "Tradicional"
      },
      {
        "text": "Opcionais",
        "trait": "Inovador"
      }
    ]
  },
  {
    "id": 43,
    "text": "Você prefere: A / F",
    "options": [
      {
        "text": "Muitos amigos com breves contatos",
        "trait": "Aberto"
      },
      {
        "text": "Poucos amigos com um contato mais longo",
        "trait": "Fechado"
      }
    ]
  },
  {
    "id": 44,
    "text": "Você é mais atraído a: I",
    "options": [
      {
        "text": "Informações substanciais",
        "trait": "Inovador"
      },
      {
        "text": "Suposições confiáveis",
        "trait": "Tradicional"
      }
    ]
  },
  {
    "id": 45,
    "text": "Você se interessa mais em: I",
    "options": [
      {
        "text": "Produção",
        "trait": "Tradicional"
      },
      {
        "text": "Pesquisas",
        "trait": "Inovador"
      }
    ]
  },
  {
    "id": 46,
    "text": "Você se sente mais confortável quando está sendo: P / S",
    "options": [
      {
        "text": "Objetivo",
        "trait": "Pensador"
      },
      {
        "text": "Pessoal",
        "trait": "Sentimento"
      }
    ]
  },
  {
    "id": 47,
    "text": "Você se avalia como uma pessoa que é mais: D / F",
    "options": [
      {
        "text": "Indisposta",
        "trait": "Flexível"
      },
      {
        "text": "Dedicada, esforçada",
        "trait": "Decisivo"
      }
    ]
  },
  {
    "id": 48,
    "text": "Você fica mais confortável com uma: D / F",
    "options": [
      {
        "text": "Opinião final",
        "trait": "Decisivo"
      },
      {
        "text": "Opinião incerta",
        "trait": "Flexível"
      }
    ]
  },
  {
    "id": 49,
    "text": "Você fica mais confortável:",
    "options": [
      {
        "text": "Após uma decisão",
        "trait": "Pensador"
      },
      {
        "text": "Antes de uma decisão",
        "trait": "Sentimento"
      }
    ]
  },
  {
    "id": 50,
    "text": "Você: A / F",
    "options": [
      {
        "text": "Fala fácil e longamente com desconhecidos",
        "trait": "Aberto"
      },
      {
        "text": "Não tem muito que dizer a desconhecidos",
        "trait": "Fechado"
      }
    ]
  },
  {
    "id": 51,
    "text": "Você normalmente é mais interessado em: P / S",
    "options": [
      {
        "text": "Um fato isolado",
        "trait": "Pensador"
      },
      {
        "text": "Um caso geral",
        "trait": "Sentimento"
      }
    ]
  },
  {
    "id": 52,
    "text": "Você se sente: T  / I",
    "options": [
      {
        "text": "Mais prático do que engenhoso",
        "trait": "Tradicional"
      },
      {
        "text": "Mais engenhoso do que prático",
        "trait": "Inovador"
      }
    ]
  },
  {
    "id": 53,
    "text": "Você tipicamente é uma pessoa com: P / S",
    "options": [
      {
        "text": "Claros propósitos",
        "trait": "Pensador"
      },
      {
        "text": "s fortes",
        "trait": "Sentimento"
      }
    ]
  },
  {
    "id": 54,
    "text": "Você se inclina mais a ser: D / F",
    "options": [
      {
        "text": "Justo",
        "trait": "Decisivo"
      },
      {
        "text": "Compreensivo",
        "trait": "Flexível"
      }
    ]
  },
  {
    "id": 55,
    "text": "É mais preferível: T / I",
    "options": [
      {
        "text": "Certificar-se de que as coisas estão certas",
        "trait": "Tradicional"
      },
      {
        "text": "Apenas deixar que as coisas aconteçam",
        "trait": "Inovador"
      }
    ]
  },
  {
    "id": 56,
    "text": "É mais do seu jeito: D / F",
    "options": [
      {
        "text": "Deixar as coisas ajeitadas",
        "trait": "Decisivo"
      },
      {
        "text": "Acomodar-se",
        "trait": "Flexível"
      }
    ]
  },
  {
    "id": 57,
    "text": "Quando o telefone toca você: D / F",
    "options": [
      {
        "text": "Corre para atender",
        "trait": "Decisivo"
      },
      {
        "text": "Espera que alguém atenda",
        "trait": "Flexível"
      }
    ]
  },
  {
    "id": 58,
    "text": "Você acha que tem mais: T / I",
    "options": [
      {
        "text": "Um bom senso de realidade",
        "trait": "Tradicional"
      },
      {
        "text": "Uma boa imaginação",
        "trait": "Inovador"
      }
    ]
  },
  {
    "id": 59,
    "text": "Você é mais atraído a: P / S",
    "options": [
      {
        "text": "Fundamentos",
        "trait": "Pensador"
      },
      {
        "text": "Insinuações",
        "trait": "Sentimento"
      }
    ]
  },
  {
    "id": 60,
    "text": "Ao julgar você é mais: P / S",
    "options": [
      {
        "text": "Neutro",
        "trait": "Sentimento"
      },
      {
        "text": "Cuidadoso",
        "trait": "Pensador"
      }
    ]
  },
  {
    "id": 61,
    "text": "Você considera a si mesmo uma pessoa: P / S",
    "options": [
      {
        "text": "Capaz de pensar claramente",
        "trait": "Pensador"
      },
      {
        "text": "De boa intenções",
        "trait": "Sentimento"
      }
    ]
  },
  {
    "id": 62,
    "text": "Você é mais tendencioso a: D / F",
    "options": [
      {
        "text": "Organizar as atividades",
        "trait": "Decisivo"
      },
      {
        "text": "Pegar as coisas quando elas vêm",
        "trait": "Flexível"
      }
    ]
  },
  {
    "id": 63,
    "text": "Você é uma pessoa que é mais: T / I",
    "options": [
      {
        "text": "Sistemática",
        "trait": "Tradicional"
      },
      {
        "text": "Imprevisível",
        "trait": "Inovador"
      }
    ]
  },
  {
    "id": 64,
    "text": "Você é mais inclinado a ser:",
    "options": [
      {
        "text": "De fácil acesso",
        "trait": "Aberto"
      },
      {
        "text": "De certa forma reservado",
        "trait": "Fechado"
      }
    ]
  },
  {
    "id": 65,
    "text": "Você se diverte mais com: T / I",
    "options": [
      {
        "text": "Experiências palpáveis",
        "trait": "Tradicional"
      },
      {
        "text": "Imaginações",
        "trait": "Inovador"
      }
    ]
  },
  {
    "id": 66,
    "text": "Você prefere: T / I",
    "options": [
      {
        "text": "Algo mais literal",
        "trait": "Tradicional"
      },
      {
        "text": "Algo mais figurativo",
        "trait": "Inovador"
      }
    ]
  },
  {
    "id": 67,
    "text": "Normalmente você é mais: P / S",
    "options": [
      {
        "text": "Imparcial",
        "trait": "Pensador"
      },
      {
        "text": "Compassivo",
        "trait": "Sentimento"
      }
    ]
  },
  {
    "id": 68,
    "text": "Tipicamente você é mais: P / S",
    "options": [
      {
        "text": "Justo do que bondoso",
        "trait": "Pensador"
      },
      {
        "text": "Bondoso do que justo",
        "trait": "Sentimento"
      }
    ]
  },
  {
    "id": 69,
    "text": "É mais parecido com você: D / F",
    "options": [
      {
        "text": "Fazer rápidos juízos",
        "trait": "Decisivo"
      },
      {
        "text": "Demorar-se em fazer julgamentos",
        "trait": "Flexível"
      }
    ]
  },
  {
    "id": 70,
    "text": "Você tende a ser mais:",
    "options": [
      {
        "text": "Deliberado do que espontâneo",
        "trait": "Decisivo"
      },
      {
        "text": "Espontâneo do que deliberado",
        "trait": "Flexível"
      }
    ]
  }
];
