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
    id: 1,
    context: 'atual',
    options: [
      { id: 'A', text: 'Animado', profile: 'Expressivo' },
      { id: 'B', text: 'Aventureiro', profile: 'Pragmático' },
      { id: 'C', text: 'Analítico', profile: 'Analítico' },
      { id: 'D', text: 'Adaptável', profile: 'Afável' }
    ]
  },
  {
    id: 2,
    context: 'atual',
    options: [
      { id: 'A', text: 'Estimulante', profile: 'Expressivo' },
      { id: 'B', text: 'Habilidoso', profile: 'Pragmático' },
      { id: 'C', text: 'Respeitoso', profile: 'Afável' },
      { id: 'D', text: 'Reservado', profile: 'Analítico' }
    ]
  },
  {
    id: 3,
    context: 'pressão',
    options: [
      { id: 'A', text: 'Otimista', profile: 'Expressivo' },
      { id: 'B', text: 'Franco', profile: 'Analítico' },
      { id: 'C', text: 'Ordeiro', profile: 'Pragmático' },
      { id: 'D', text: 'Serviçal', profile: 'Afável' }
    ]
  },
  {
    id: 4,
    context: 'atual',
    options: [
      { id: 'A', text: 'Inspirador', profile: 'Expressivo' },
      { id: 'B', text: 'Independente', profile: 'Pragmático' },
      { id: 'C', text: 'Idealista', profile: 'Analítico' },
      { id: 'D', text: 'Inofensivo', profile: 'Afável' }
    ]
  },
  {
    id: 5,
    context: 'atual',
    options: [
      { id: 'A', text: 'Vivo', profile: 'Expressivo' },
      { id: 'B', text: 'Líder', profile: 'Pragmático' },
      { id: 'C', text: 'Leal', profile: 'Afável' },
      { id: 'D', text: 'Ouvinte', profile: 'Analítico' }
    ]
  },
  {
    id: 6,
    context: 'aparente',
    options: [
      { id: 'A', text: 'Metido', profile: 'Expressivo' },
      { id: 'B', text: 'Mandão', profile: 'Pragmático' },
      { id: 'C', text: 'Acanhado', profile: 'Afável' },
      { id: 'D', text: 'Vazio', profile: 'Analítico' }
    ]
  },
  {
    id: 7,
    context: 'pressão',
    options: [
      { id: 'A', text: 'Inoportuno', profile: 'Expressivo' },
      { id: 'B', text: 'Impaciente', profile: 'Pragmático' },
      { id: 'C', text: 'Inseguro', profile: 'Afável' },
      { id: 'D', text: 'Indeciso', profile: 'Analítico' }
    ]
  },
  {
    id: 8,
    context: 'pressão',
    options: [
      { id: 'A', text: 'Esquentado', profile: 'Expressivo' },
      { id: 'B', text: 'Discutidor', profile: 'Pragmático' },
      { id: 'C', text: 'Alienado', profile: 'Analítico' },
      { id: 'D', text: 'Incerto', profile: 'Afável' }
    ]
  },
  {
    id: 9,
    context: 'aparente',
    options: [
      { id: 'A', text: 'Desorganizado', profile: 'Expressivo' },
      { id: 'B', text: 'Mandão', profile: 'Pragmático' },
      { id: 'C', text: 'Deprimido', profile: 'Afável' },
      { id: 'D', text: 'Confuso', profile: 'Analítico' }
    ]
  },
  {
    id: 10,
    context: 'atual',
    options: [
      { id: 'A', text: 'Barulhento', profile: 'Expressivo' },
      { id: 'B', text: 'Tirânico', profile: 'Pragmático' },
      { id: 'C', text: 'Solitário', profile: 'Analítico' },
      { id: 'D', text: 'Preguiçoso', profile: 'Afável' }
    ]
  }
];
