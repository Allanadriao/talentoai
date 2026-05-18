export type PlayerContext = 'atual' | 'aparente' | 'pressão';
export type PlayerProfile = 'Pragmático' | 'Expressivo' | 'Afável' | 'Analítico';

export interface PlayerOption {
  id: string; // A, B, C, D
  text: string;
  profile: PlayerProfile;
}

export interface PlayerQuestion {
  id: number;
  context: PlayerContext;
  options: PlayerOption[];
}

export const playerMxQuestions: PlayerQuestion[] = [
  {
    "id": 1,
    "context": "atual",
    "options": [
      {
        "id": "A",
        "text": "Animado",
        "profile": "Expressivo"
      },
      {
        "id": "B",
        "text": "Aventureiro",
        "profile": "Pragmático"
      },
      {
        "id": "C",
        "text": "Analítico",
        "profile": "Analítico"
      },
      {
        "id": "D",
        "text": "Adaptável",
        "profile": "Afável"
      }
    ]
  },
  {
    "id": 2,
    "context": "atual",
    "options": [
      {
        "id": "A",
        "text": "Estimulante",
        "profile": "Expressivo"
      },
      {
        "id": "B",
        "text": "Habilidoso",
        "profile": "Pragmático"
      },
      {
        "id": "C",
        "text": "Respeitoso",
        "profile": "Afável"
      },
      {
        "id": "D",
        "text": "Reservado",
        "profile": "Analítico"
      }
    ]
  },
  {
    "id": 3,
    "context": "pressão",
    "options": [
      {
        "id": "A",
        "text": "Otimista",
        "profile": "Expressivo"
      },
      {
        "id": "B",
        "text": "Franco",
        "profile": "Analítico"
      },
      {
        "id": "C",
        "text": "Ordeiro",
        "profile": "Pragmático"
      },
      {
        "id": "D",
        "text": "Serviçal",
        "profile": "Afável"
      }
    ]
  },
  {
    "id": 4,
    "context": "atual",
    "options": [
      {
        "id": "A",
        "text": "Inspirador",
        "profile": "Expressivo"
      },
      {
        "id": "B",
        "text": "Independente",
        "profile": "Pragmático"
      },
      {
        "id": "C",
        "text": "Idealista",
        "profile": "Analítico"
      },
      {
        "id": "D",
        "text": "Inofensivo",
        "profile": "Afável"
      }
    ]
  },
  {
    "id": 5,
    "context": "atual",
    "options": [
      {
        "id": "A",
        "text": "Vivo",
        "profile": "Expressivo"
      },
      {
        "id": "B",
        "text": "Líder",
        "profile": "Pragmático"
      },
      {
        "id": "C",
        "text": "Leal",
        "profile": "Afável"
      },
      {
        "id": "D",
        "text": "Ouvinte",
        "profile": "Analítico"
      }
    ]
  },
  {
    "id": 6,
    "context": "aparente",
    "options": [
      {
        "id": "A",
        "text": "Metido",
        "profile": "Expressivo"
      },
      {
        "id": "B",
        "text": "Mandão",
        "profile": "Pragmático"
      },
      {
        "id": "C",
        "text": "Acanhado",
        "profile": "Afável"
      },
      {
        "id": "D",
        "text": "Vazio",
        "profile": "Analítico"
      }
    ]
  },
  {
    "id": 7,
    "context": "pressão",
    "options": [
      {
        "id": "A",
        "text": "Inoportuno",
        "profile": "Expressivo"
      },
      {
        "id": "B",
        "text": "Impaciente",
        "profile": "Pragmático"
      },
      {
        "id": "C",
        "text": "Inseguro",
        "profile": "Afável"
      },
      {
        "id": "D",
        "text": "Indeciso",
        "profile": "Analítico"
      }
    ]
  },
  {
    "id": 8,
    "context": "pressão",
    "options": [
      {
        "id": "A",
        "text": "Esquentado",
        "profile": "Expressivo"
      },
      {
        "id": "B",
        "text": "Discutidor",
        "profile": "Pragmático"
      },
      {
        "id": "C",
        "text": "Alienado",
        "profile": "Analítico"
      },
      {
        "id": "D",
        "text": "Incerto",
        "profile": "Afável"
      }
    ]
  },
  {
    "id": 9,
    "context": "aparente",
    "options": [
      {
        "id": "A",
        "text": "Desorganizado",
        "profile": "Expressivo"
      },
      {
        "id": "B",
        "text": "Mandão",
        "profile": "Pragmático"
      },
      {
        "id": "C",
        "text": "Deprimido",
        "profile": "Afável"
      },
      {
        "id": "D",
        "text": "Confuso",
        "profile": "Analítico"
      }
    ]
  },
  {
    "id": 10,
    "context": "atual",
    "options": [
      {
        "id": "A",
        "text": "Barulhento",
        "profile": "Expressivo"
      },
      {
        "id": "B",
        "text": "Tirânico",
        "profile": "Pragmático"
      },
      {
        "id": "C",
        "text": "Solitário",
        "profile": "Analítico"
      },
      {
        "id": "D",
        "text": "Preguiçoso",
        "profile": "Afável"
      }
    ]
  },
  {
    "id": 11,
    "context": "aparente",
    "options": [
      {
        "id": "A",
        "text": "Brincalhão",
        "profile": "Expressivo"
      },
      {
        "id": "B",
        "text": "Persuasivo",
        "profile": "Pragmático"
      },
      {
        "id": "C",
        "text": "Persistente",
        "profile": "Analítico"
      },
      {
        "id": "D",
        "text": "Sereno",
        "profile": "Afável"
      }
    ]
  },
  {
    "id": 12,
    "context": "aparente",
    "options": [
      {
        "id": "A",
        "text": "Espirituoso",
        "profile": "Expressivo"
      },
      {
        "id": "B",
        "text": "Auto-Suficiente",
        "profile": "Pragmático"
      },
      {
        "id": "C",
        "text": "Sensível",
        "profile": "Afável"
      },
      {
        "id": "D",
        "text": "Satisfeito",
        "profile": "Analítico"
      }
    ]
  },
  {
    "id": 13,
    "context": "atual",
    "options": [
      {
        "id": "A",
        "text": "Engraçado",
        "profile": "Expressivo"
      },
      {
        "id": "B",
        "text": "Vigoroso",
        "profile": "Pragmático"
      },
      {
        "id": "C",
        "text": "Fiel",
        "profile": "Afável"
      },
      {
        "id": "D",
        "text": "Amigável",
        "profile": "Analítico"
      }
    ]
  },
  {
    "id": 14,
    "context": "atual",
    "options": [
      {
        "id": "A",
        "text": "Demonstrativo",
        "profile": "Expressivo"
      },
      {
        "id": "B",
        "text": "Decidido",
        "profile": "Pragmático"
      },
      {
        "id": "C",
        "text": "Profundo",
        "profile": "Afável"
      },
      {
        "id": "D",
        "text": "Irônico",
        "profile": "Analítico"
      }
    ]
  },
  {
    "id": 15,
    "context": "aparente",
    "options": [
      {
        "id": "A",
        "text": "Atraente",
        "profile": "Expressivo"
      },
      {
        "id": "B",
        "text": "Chefe",
        "profile": "Pragmático"
      },
      {
        "id": "C",
        "text": "Detalhista",
        "profile": "Analítico"
      },
      {
        "id": "D",
        "text": "Contente",
        "profile": "Afável"
      }
    ]
  },
  {
    "id": 16,
    "context": "pressão",
    "options": [
      {
        "id": "A",
        "text": "Indisciplinado",
        "profile": "Expressivo"
      },
      {
        "id": "B",
        "text": "Insensível",
        "profile": "Pragmático"
      },
      {
        "id": "C",
        "text": "Rancoroso",
        "profile": "Afável"
      },
      {
        "id": "D",
        "text": "Desinteressado",
        "profile": "Analítico"
      }
    ]
  },
  {
    "id": 17,
    "context": "atual",
    "options": [
      {
        "id": "A",
        "text": "Imprevisível",
        "profile": "Expressivo"
      },
      {
        "id": "B",
        "text": "Frio",
        "profile": "Pragmático"
      },
      {
        "id": "C",
        "text": "Impopular",
        "profile": "Analítico"
      },
      {
        "id": "D",
        "text": "Desligado",
        "profile": "Afável"
      }
    ]
  },
  {
    "id": 18,
    "context": "aparente",
    "options": [
      {
        "id": "A",
        "text": "Ingênuo",
        "profile": "Afável"
      },
      {
        "id": "B",
        "text": "Ousado",
        "profile": "Pragmático"
      },
      {
        "id": "C",
        "text": "Negativo",
        "profile": "Expressivo"
      },
      {
        "id": "D",
        "text": "Indiferente",
        "profile": "Analítico"
      }
    ]
  },
  {
    "id": 19,
    "context": "pressão",
    "options": [
      {
        "id": "A",
        "text": "Inconstante",
        "profile": "Pragmático"
      },
      {
        "id": "B",
        "text": "Intolerante",
        "profile": "Expressivo"
      },
      {
        "id": "C",
        "text": "Introvertido",
        "profile": "Analítico"
      },
      {
        "id": "D",
        "text": "Apático",
        "profile": "Afável"
      }
    ]
  },
  {
    "id": 20,
    "context": "atual",
    "options": [
      {
        "id": "A",
        "text": "Distraído",
        "profile": "Analítico"
      },
      {
        "id": "B",
        "text": "Irritável",
        "profile": "Pragmático"
      },
      {
        "id": "C",
        "text": "Desconfiado",
        "profile": "Expressivo"
      },
      {
        "id": "D",
        "text": "Vagaroso",
        "profile": "Afável"
      }
    ]
  },
  {
    "id": 21,
    "context": "aparente",
    "options": [
      {
        "id": "A",
        "text": "Sociável",
        "profile": "Expressivo"
      },
      {
        "id": "B",
        "text": "Energético",
        "profile": "Pragmático"
      },
      {
        "id": "C",
        "text": "Doador",
        "profile": "Analítico"
      },
      {
        "id": "D",
        "text": "Submisso",
        "profile": "Afável"
      }
    ]
  },
  {
    "id": 22,
    "context": "aparente",
    "options": [
      {
        "id": "A",
        "text": "Charmoso",
        "profile": "Expressivo"
      },
      {
        "id": "B",
        "text": "Positivo",
        "profile": "Pragmático"
      },
      {
        "id": "C",
        "text": "Planejador",
        "profile": "Analítico"
      },
      {
        "id": "D",
        "text": "Paciente",
        "profile": "Afável"
      }
    ]
  },
  {
    "id": 23,
    "context": "aparente",
    "options": [
      {
        "id": "A",
        "text": "Encantador",
        "profile": "Expressivo"
      },
      {
        "id": "B",
        "text": "Audacioso",
        "profile": "Pragmático"
      },
      {
        "id": "C",
        "text": "Minucioso",
        "profile": "Analítico"
      },
      {
        "id": "D",
        "text": "Diplomático",
        "profile": "Afável"
      }
    ]
  },
  {
    "id": 24,
    "context": "atual",
    "options": [
      {
        "id": "A",
        "text": "Desembaraçado",
        "profile": "Expressivo"
      },
      {
        "id": "B",
        "text": "Ativo",
        "profile": "Pragmático"
      },
      {
        "id": "C",
        "text": "Musical",
        "profile": "Analítico"
      },
      {
        "id": "D",
        "text": "Mediador",
        "profile": "Afável"
      }
    ]
  },
  {
    "id": 25,
    "context": "aparente",
    "options": [
      {
        "id": "A",
        "text": "Popular",
        "profile": "Expressivo"
      },
      {
        "id": "B",
        "text": "Produtivo",
        "profile": "Pragmático"
      },
      {
        "id": "C",
        "text": "Perfeccionista",
        "profile": "Analítico"
      },
      {
        "id": "D",
        "text": "Agradável",
        "profile": "Afável"
      }
    ]
  },
  {
    "id": 26,
    "context": "pressão",
    "options": [
      {
        "id": "A",
        "text": "Repetitível",
        "profile": "Expressivo"
      },
      {
        "id": "B",
        "text": "Inflexível",
        "profile": "Pragmático"
      },
      {
        "id": "C",
        "text": "Ressentido",
        "profile": "Afável"
      },
      {
        "id": "D",
        "text": "Relutante",
        "profile": "Analítico"
      }
    ]
  },
  {
    "id": 27,
    "context": "pressão",
    "options": [
      {
        "id": "A",
        "text": "Casual",
        "profile": "Afável"
      },
      {
        "id": "B",
        "text": "Cabeçudo",
        "profile": "Pragmático"
      },
      {
        "id": "C",
        "text": "Insatisfeito",
        "profile": "Analítico"
      },
      {
        "id": "D",
        "text": "Exitante",
        "profile": "Expressivo"
      }
    ]
  },
  {
    "id": 28,
    "context": "pressão",
    "options": [
      {
        "id": "A",
        "text": "Egoísta",
        "profile": "Afável"
      },
      {
        "id": "B",
        "text": "Trabalhador",
        "profile": "Pragmático"
      },
      {
        "id": "C",
        "text": "Retraído",
        "profile": "Analítico"
      },
      {
        "id": "D",
        "text": "Preocupado",
        "profile": "Expressivo"
      }
    ]
  },
  {
    "id": 29,
    "context": "pressão",
    "options": [
      {
        "id": "A",
        "text": "Desordenado",
        "profile": "Pragmático"
      },
      {
        "id": "B",
        "text": "Manipulador",
        "profile": "Analítico"
      },
      {
        "id": "C",
        "text": "Triste",
        "profile": "Afável"
      },
      {
        "id": "D",
        "text": "Resmungão",
        "profile": "Expressivo"
      }
    ]
  },
  {
    "id": 30,
    "context": "pressão",
    "options": [
      {
        "id": "A",
        "text": "Agitado",
        "profile": "Expressivo"
      },
      {
        "id": "B",
        "text": "Imprudente",
        "profile": "Pragmático"
      },
      {
        "id": "C",
        "text": "Vingativo",
        "profile": "Afável"
      },
      {
        "id": "D",
        "text": "Relutante",
        "profile": "Analítico"
      }
    ]
  },
  {
    "id": 31,
    "context": "aparente",
    "options": [
      {
        "id": "A",
        "text": "Convincente",
        "profile": "Expressivo"
      },
      {
        "id": "B",
        "text": "Competitivo",
        "profile": "Pragmático"
      },
      {
        "id": "C",
        "text": "Atencioso",
        "profile": "Afável"
      },
      {
        "id": "D",
        "text": "Controlado",
        "profile": "Analítico"
      }
    ]
  },
  {
    "id": 32,
    "context": "aparente",
    "options": [
      {
        "id": "A",
        "text": "Espontâneo",
        "profile": "Expressivo"
      },
      {
        "id": "B",
        "text": "Seguro",
        "profile": "Pragmático"
      },
      {
        "id": "C",
        "text": "Organizado",
        "profile": "Analítico"
      },
      {
        "id": "D",
        "text": "Tímido",
        "profile": "Afável"
      }
    ]
  },
  {
    "id": 33,
    "context": "atual",
    "options": [
      {
        "id": "A",
        "text": "Alegre",
        "profile": "Expressivo"
      },
      {
        "id": "B",
        "text": "Confiante",
        "profile": "Pragmático"
      },
      {
        "id": "C",
        "text": "Culto",
        "profile": "Analítico"
      },
      {
        "id": "D",
        "text": "Previsível",
        "profile": "Afável"
      }
    ]
  },
  {
    "id": 34,
    "context": "atual",
    "options": [
      {
        "id": "A",
        "text": "Conversador",
        "profile": "Expressivo"
      },
      {
        "id": "B",
        "text": "Firme",
        "profile": "Pragmático"
      },
      {
        "id": "C",
        "text": "Pensativo",
        "profile": "Analítico"
      },
      {
        "id": "D",
        "text": "Tolerante",
        "profile": "Afável"
      }
    ]
  },
  {
    "id": 35,
    "context": "atual",
    "options": [
      {
        "id": "A",
        "text": "Vivaz",
        "profile": "Expressivo"
      },
      {
        "id": "B",
        "text": "Valente",
        "profile": "Pragmático"
      },
      {
        "id": "C",
        "text": "Comportado",
        "profile": "Afável"
      },
      {
        "id": "D",
        "text": "Equilibrado",
        "profile": "Analítico"
      }
    ]
  },
  {
    "id": 36,
    "context": "aparente",
    "options": [
      {
        "id": "A",
        "text": "Esquecido",
        "profile": "Expressivo"
      },
      {
        "id": "B",
        "text": "Franco",
        "profile": "Pragmático"
      },
      {
        "id": "C",
        "text": "Complicado",
        "profile": "Analítico"
      },
      {
        "id": "D",
        "text": "Medroso",
        "profile": "Afável"
      }
    ]
  },
  {
    "id": 37,
    "context": "atual",
    "options": [
      {
        "id": "A",
        "text": "Permissivo",
        "profile": "Afável"
      },
      {
        "id": "B",
        "text": "Orgulhoso",
        "profile": "Pragmático"
      },
      {
        "id": "C",
        "text": "Cauteloso",
        "profile": "Analítico"
      },
      {
        "id": "D",
        "text": "Simples",
        "profile": "Expressivo"
      }
    ]
  },
  {
    "id": 38,
    "context": "aparente",
    "options": [
      {
        "id": "A",
        "text": "Tagarela",
        "profile": "Expressivo"
      },
      {
        "id": "B",
        "text": "Indelicado",
        "profile": "Pragmático"
      },
      {
        "id": "C",
        "text": "Sensível demais",
        "profile": "Afável"
      },
      {
        "id": "D",
        "text": "Tímido",
        "profile": "Analítico"
      }
    ]
  },
  {
    "id": 39,
    "context": "atual",
    "options": [
      {
        "id": "A",
        "text": "Convencido",
        "profile": "Expressivo"
      },
      {
        "id": "B",
        "text": "Obstinado",
        "profile": "Pragmático"
      },
      {
        "id": "C",
        "text": "Cético (não acreditar)",
        "profile": "Analítico"
      },
      {
        "id": "D",
        "text": "Lento",
        "profile": "Afável"
      }
    ]
  },
  {
    "id": 40,
    "context": "aparente",
    "options": [
      {
        "id": "A",
        "text": "Instável",
        "profile": "Expressivo"
      },
      {
        "id": "B",
        "text": "Astuto",
        "profile": "Pragmático"
      },
      {
        "id": "C",
        "text": "Crítico",
        "profile": "Analítico"
      },
      {
        "id": "D",
        "text": "Acomodado",
        "profile": "Afável"
      }
    ]
  }
];
