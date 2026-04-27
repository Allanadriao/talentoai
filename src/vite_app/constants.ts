/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Zap, Brain, Eye, Target } from 'lucide-react';

export interface Question {
  id: number;
  text: string;
  category: string;
  type: 'scale' | 'choice';
  options?: { text: string; value: string; category: string }[];
  condition?: 'aparente' | 'atual' | 'pressao';
}

export const ASSESSMENT_CARDS = [
  { id: 'energy', title: 'Energy MX', desc: 'Mede o estado atual de energia e motivação', time: '15-20 min', questions: 27, color: 'bg-orange-500', icon: Zap },
  { id: 'personality', title: 'Personality MX', desc: 'Mapeia o perfil comportamental', time: '25-30 min', questions: 40, color: 'bg-purple-500', icon: Brain },
  { id: 'vision', title: 'Vision MX', desc: 'Identifica a visão de mundo do candidato', time: '15-20 min', questions: 25, color: 'bg-emerald-500', icon: Eye },
  { id: 'player', title: 'Player MX', desc: 'Analisa comportamento em 3 níveis', time: '20-25 min', questions: 39, color: 'bg-sky-500', icon: Target },
];

export const ENERGY_MX_QUESTIONS: Question[] = [
  { id: 1, text: "Examinar, entender logo, avaliar", category: "Razão", type: "scale" },
  { id: 2, text: "Programar, organizar, fazer planos", category: "Ação", type: "scale" },
  { id: 3, text: "Espiritualidade, fé", category: "Emoção", type: "scale" },
  { id: 4, text: "Espírito humorístico, jogos, brincadeiras", category: "Emoção", type: "scale" },
  { id: 5, text: "Argumentar, usar as palavras", category: "Ação", type: "scale" },
  { id: 6, text: "Intuição, sexto sentido, ter pressentimentos", category: "Emoção", type: "scale" },
  { id: 7, text: "Romantismo, afetividade", category: "Emoção", type: "scale" },
  { id: 8, text: "Linguagem verbal, falar bem, transmitir ideias", category: "Ação", type: "scale" },
  { id: 9, text: "Uso da linguagem não-verbal, corporal, gestos", category: "Emoção", type: "scale" },
  { id: 10, text: "Empatia, colocar-se na situação do outro", category: "Emoção", type: "scale" },
  { id: 11, text: "Diagnosticar, conhecer causas com facilidade", category: "Razão", type: "scale" },
  { id: 12, text: "Detalhamento, análise, tim-tim por tim-tim", category: "Razão", type: "scale" },
  { id: 13, text: "Êxito em negócios", category: "Ação", type: "scale" },
  { id: 14, text: "Espírito inovador", category: "Emoção", type: "scale" },
  { id: 15, text: "Pensar antes de fazer alguma coisa", category: "Razão", type: "scale" },
  { id: 16, text: "Atitude científica, lógica", category: "Razão", type: "scale" },
  { id: 17, text: "Habilidades em trabalhos manuais", category: "Ação", type: "scale" },
  { id: 18, text: "Esforço, concentração nas tarefas", category: "Ação", type: "scale" },
  { id: 19, text: "Capacidade administrativa", category: "Razão", type: "scale" },
  { id: 20, text: "Capacidade estética, decoração, bom gosto", category: "Emoção", type: "scale" },
  { id: 21, text: "Ser o primeiro a arriscar-se, ser pioneiro", category: "Emoção", type: "scale" },
  { id: 22, text: "Espírito crítico, questionador", category: "Razão", type: "scale" },
  { id: 23, text: "Pensar e fazer, terminar o que começa", category: "Ação", type: "scale" },
  { id: 24, text: "Previsões, imaginar o futuro", category: "Razão", type: "scale" },
  { id: 25, text: "Uso de aparelhos e máquinas", category: "Ação", type: "scale" },
  { id: 26, text: "Rendimento, rapidez no trabalho", category: "Ação", type: "scale" },
  { id: 27, text: "Uso de números, fazer contas, cálculos", category: "Razão", type: "scale" },
];

export const VISION_MX_QUESTIONS: Question[] = [
  { id: 1, text: "Marque a opção com a qual você mais se identificar:", category: "Vision", type: "choice", options: [
    { text: "Idealismo", value: "A", category: "Alien" },
    { text: "Meticulosidade", value: "B", category: "Robô" },
    { text: "Diversão", value: "C", category: "Mamífero" },
    { text: "Persistência", value: "D", category: "Tubarão" }
  ]},
  { id: 2, text: "Marque a opção com a qual você mais se identificar:", category: "Vision", type: "choice", options: [
    { text: "Inovação", value: "A", category: "Alien" },
    { text: "Organização", value: "B", category: "Robô" },
    { text: "Cuidado", value: "C", category: "Mamífero" },
    { text: "Tarefa", value: "D", category: "Tubarão" }
  ]},
  { id: 3, text: "Marque a opção com a qual você mais se identificar:", category: "Vision", type: "choice", options: [
    { text: "Curiosidade", value: "A", category: "Alien" },
    { text: "Planejamento", value: "B", category: "Robô" },
    { text: "Relacionamento", value: "C", category: "Mamífero" },
    { text: "Direção", value: "D", category: "Tubarão" }
  ]},
  { id: 4, text: "Marque a opção com a qual você mais se identificar:", category: "Vision", type: "choice", options: [
    { text: "Complexidade", value: "A", category: "Alien" },
    { text: "Sistematização", value: "B", category: "Robô" },
    { text: "Animação", value: "C", category: "Mamífero" },
    { text: "Objetividade", value: "D", category: "Tubarão" }
  ]},
  { id: 5, text: "Marque a opção com a qual você mais se identificar:", category: "Vision", type: "choice", options: [
    { text: "Descobertas", value: "A", category: "Alien" },
    { text: "Previsão", value: "B", category: "Robô" },
    { text: "Naturalidade", value: "C", category: "Mamífero" },
    { text: "Determinação", value: "D", category: "Tubarão" }
  ]},
  // ... adding more to reach 25
];

// Fill the rest of Vision MX with generic but correctly categorized options to reach 25
for (let i = 6; i <= 25; i++) {
  VISION_MX_QUESTIONS.push({
    id: i,
    text: `Marque a opção com a qual você mais se identificar (${i}):`,
    category: "Vision",
    type: "choice",
    options: [
      { text: `Opção A - ${i}`, value: "A", category: "Alien" },
      { text: `Opção B - ${i}`, value: "B", category: "Robô" },
      { text: `Opção C - ${i}`, value: "C", category: "Mamífero" },
      { text: `Opção D - ${i}`, value: "D", category: "Tubarão" }
    ]
  });
}

export const PERSONALITY_MX_QUESTIONS: Question[] = [
  { id: 1, text: "Numa festa você:", category: "Personality", type: "choice", options: [
    { text: "Interage com muitos, incluindo estranhos", value: "A", category: "Aberto" },
    { text: "Interage com poucos, apenas conhecidos", value: "F", category: "Fechado" }
  ]},
  { id: 2, text: "Você é mais:", category: "Personality", type: "choice", options: [
    { text: "Realista", value: "T", category: "Tradicional" },
    { text: "Filosófico", value: "I", category: "Inovador" }
  ]},
  { id: 3, text: "Você se interessa mais por:", category: "Personality", type: "choice", options: [
    { text: "Fatos", value: "D", category: "Decisivo" },
    { text: "Semelhanças (comparações)", value: "F", category: "Flexível" }
  ]},
  { id: 4, text: "Normalmente você é:", category: "Personality", type: "choice", options: [
    { text: "Justo", value: "P", category: "Pensador" },
    { text: "Sensível (interessado)", value: "S", category: "Sentimento" }
  ]},
];

// Fill the rest of Personality MX to reach 70
for (let i = 5; i <= 70; i++) {
  const catPair = i % 4 === 0 ? ["Decisivo", "Flexível"] : i % 3 === 0 ? ["Pensador", "Sentimento"] : i % 2 === 0 ? ["Tradicional", "Inovador"] : ["Aberto", "Fechado"];
  PERSONALITY_MX_QUESTIONS.push({
    id: i,
    text: `Pergunta de Personalidade ${i}:`,
    category: "Personality",
    type: "choice",
    options: [
      { text: `Opção 1 - ${i}`, value: "1", category: catPair[0] },
      { text: `Opção 2 - ${i}`, value: "2", category: catPair[1] }
    ]
  });
}

export const PLAYER_MX_QUESTIONS: Question[] = [
  { id: 1, text: "Preencha como você realmente é: atual", category: "Player", condition: "atual", type: "choice", options: [
    { text: "Animado", value: "A", category: "Expressivo" },
    { text: "Aventureiro", value: "B", category: "Pragmático" },
    { text: "Analítico", value: "C", category: "Analítico" },
    { text: "Adaptável", value: "D", category: "Afável" }
  ]},
  { id: 2, text: "Preencha como você realmente é: atual", category: "Player", condition: "atual", type: "choice", options: [
    { text: "Estimulante", value: "A", category: "Expressivo" },
    { text: "Habilidoso", value: "B", category: "Pragmático" },
    { text: "Respeitoso", value: "C", category: "Afável" },
    { text: "Reservado", value: "D", category: "Analítico" }
  ]},
  { id: 3, text: "Preencha como você realmente é: pressão", category: "Player", condition: "pressao", type: "choice", options: [
    { text: "Otimista", value: "A", category: "Expressivo" },
    { text: "Franco", value: "B", category: "Analítico" },
    { text: "Ordeiro", value: "C", category: "Pragmático" },
    { text: "Serviçal", value: "D", category: "Afável" }
  ]},
];

// Fill the rest of Player MX to reach 40
for (let i = 4; i <= 40; i++) {
  const cond = i % 3 === 0 ? "pressao" : i % 2 === 0 ? "aparente" : "atual";
  PLAYER_MX_QUESTIONS.push({
    id: i,
    text: `Preencha como você realmente é: ${cond}`,
    category: "Player",
    condition: cond as any,
    type: "choice",
    options: [
      { text: `Expressivo - ${i}`, value: "A", category: "Expressivo" },
      { text: `Pragmático - ${i}`, value: "B", category: "Pragmático" },
      { text: `Afável - ${i}`, value: "C", category: "Afável" },
      { text: `Analítico - ${i}`, value: "D", category: "Analítico" }
    ]
  });
}

export const POWER_MX_QUESTIONS: Question[] = [];
for (let i = 1; i <= 180; i++) {
  // Power MX is usually Enneagram (9 types)
  const type = (i % 9) + 1;
  POWER_MX_QUESTIONS.push({
    id: i,
    text: `Pergunta de Power MX ${i}:`,
    category: `Tipo ${type}`,
    type: "scale"
  });
}

export const DEFAULT_IDEAL_PROFILE = {
  energy: { razao: 39, acao: 34, emocao: 37, total: 110 },
  vision: { alien: 16, robo: 48, mamifero: 12, tubarao: 24 },
  personality: { aberto: 4, fechado: 6, tradicional: 13, inovador: 7, pensador: 9, sentimento: 11, decisivo: 12, flexivel: 8 }
};

export function getIdealProfile() {
  if (typeof window === 'undefined') return DEFAULT_IDEAL_PROFILE;
  
  const saved = localStorage.getItem('idealProfile');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      // Append energy total since the user shouldn't need to do mental math
      parsed.energy.total = (parsed.energy.razao || 0) + (parsed.energy.acao || 0) + (parsed.energy.emocao || 0);
      return parsed;
    } catch {
      return DEFAULT_IDEAL_PROFILE;
    }
  }
  return DEFAULT_IDEAL_PROFILE;
}
