export type PersonalityTrait = 'Aberto' | 'Fechado' | 'Tradicional' | 'Inovador' | 'Pensador' | 'Sentimento' | 'Decisivo' | 'Flexível';

export interface PersonalityOption {
  text: string;
  trait: PersonalityTrait;
}

export interface PersonalityQuestion {
  id: number;
  options: [PersonalityOption, PersonalityOption];
}

export const personalityMxQuestions: PersonalityQuestion[] = [
  {
    id: 1,
    options: [
      { text: "Interage com muitos, incluindo estranhos", trait: "Aberto" },
      { text: "Interage com poucos, apenas conhecidos", trait: "Fechado" }
    ]
  },
  {
    id: 2,
    options: [
      { text: "Realista", trait: "Tradicional" },
      { text: "Filosófico", trait: "Inovador" }
    ]
  },
  {
    id: 3,
    options: [
      { text: "Fatos", trait: "Decisivo" },
      { text: "Semelhanças (comparações)", trait: "Flexível" }
    ]
  },
  {
    id: 4,
    options: [
      { text: "Justo", trait: "Pensador" },
      { text: "Sensível (interessado)", trait: "Sentimento" }
    ]
  },
  {
    id: 5,
    options: [
      { text: "Calculista", trait: "Pensador" },
      { text: "Empático", trait: "Sentimento" }
    ]
  }
];
