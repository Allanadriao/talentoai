export interface Personality2Question {
  id: number;
  leftTrait: string;
  rightTrait: string;
}

export const personalityMx2Questions: Personality2Question[] = [
  { id: 1, leftTrait: "Interage com muitos, incluindo estranhos", rightTrait: "Interage com poucos, apenas conhecidos" },
  { id: 2, leftTrait: "Realista", rightTrait: "Filosófico" },
  { id: 3, leftTrait: "Fatos", rightTrait: "Semelhanças (comparações)" },
  { id: 4, leftTrait: "Justo", rightTrait: "Sensível (interessado)" },
  { id: 5, leftTrait: "Calculista", rightTrait: "Empático" }
];
