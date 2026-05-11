export type ProfileType = 'Razão' | 'Ação' | 'Emoção';

export interface EnergyQuestion {
  id: number;
  text: string;
  profile: ProfileType;
}

export const energyMxQuestions: EnergyQuestion[] = [
  { id: 1, text: "Examinar, entender logo, avaliar", profile: "Razão" },
  { id: 2, text: "Programar, organizar, fazer planos", profile: "Ação" },
  { id: 3, text: "Espiritualidade, fé", profile: "Emoção" },
  { id: 4, text: "Espírito humorístico, jogos, brincadeiras", profile: "Emoção" },
  { id: 5, text: "Argumentar, usar as palavras", profile: "Ação" },
  { id: 6, text: "Intuição, sexto sentido, ter pressentimentos", profile: "Emoção" },
  { id: 7, text: "Romantismo, afetividade", profile: "Emoção" },
  { id: 8, text: "Linguagem verbal, falar bem, transmitir ideias", profile: "Ação" },
  { id: 9, text: "Uso da linguagem não-verbal, corporal, gestos", profile: "Emoção" },
  { id: 10, text: "Empatia, colocar-se na situação do outro", profile: "Emoção" },
  { id: 11, text: "Diagnosticar, conhecer causas com facilidade", profile: "Razão" },
  { id: 12, text: "Detalhamento, análise, tim-tim por tim-tim", profile: "Razão" },
  { id: 13, text: "Êxito em negócios", profile: "Ação" },
  { id: 14, text: "Espírito inovador", profile: "Emoção" },
  { id: 15, text: "Pensar antes de fazer alguma coisa", profile: "Razão" },
  { id: 16, text: "Atitude científica, lógica", profile: "Razão" },
  { id: 17, text: "Habilidades em trabalhos manuais", profile: "Ação" },
  { id: 18, text: "Esforço, concentração nas tarefas", profile: "Ação" },
  { id: 19, text: "Capacidade administrativa", profile: "Razão" },
  { id: 20, text: "Capacidade estética, decoração, bom gosto", profile: "Emoção" },
  { id: 21, text: "Ser o primeiro a arriscar-se, ser pioneiro", profile: "Emoção" },
  { id: 22, text: "Espírito crítico, questionador", profile: "Razão" },
  { id: 23, text: "Pensar e fazer, terminar o que começa", profile: "Ação" },
  { id: 24, text: "Previsões, imaginar o futuro", profile: "Razão" },
  { id: 25, text: "Uso de aparelhos e máquinas", profile: "Ação" },
  { id: 26, text: "Rendimento, rapidez no trabalho", profile: "Ação" },
  { id: 27, text: "Uso de números, fazer contas, cálculos", profile: "Razão" },
];
