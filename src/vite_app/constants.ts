/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Zap, Brain, Eye, Target } from 'lucide-react';
import { energyMxQuestions } from '../data/energyMx';
import { visionMxQuestions } from '../data/visionMx';
import { personalityMxQuestions } from '../data/personalityMx';
import { playerMxQuestions } from '../data/playerMx';
import { powerMxQuestions } from '../data/powerMx';

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
  { id: 'personality', title: 'Personality MX', desc: 'Mapeia o perfil comportamental', time: '25-30 min', questions: 70, color: 'bg-purple-500', icon: Brain },
  { id: 'vision', title: 'Vision MX', desc: 'Identifica a visão de mundo do candidato', time: '15-20 min', questions: 25, color: 'bg-emerald-500', icon: Eye },
  { id: 'player', title: 'Player MX', desc: 'Analisa comportamento em 3 níveis', time: '20-25 min', questions: 40, color: 'bg-sky-500', icon: Target },
  { id: 'power', title: 'Power MX', desc: 'Avaliação profunda de personalidade central', time: '40-50 min', questions: 180, color: 'bg-indigo-600', icon: Zap },
];

export const ENERGY_MX_QUESTIONS: Question[] = energyMxQuestions.map(q => ({
  id: q.id,
  text: q.text,
  category: q.profile,
  type: "scale"
}));

export const VISION_MX_QUESTIONS: Question[] = visionMxQuestions.map(q => ({
  id: q.id,
  text: "Marque com um X a opção com a qual você mais se identificar:",
  category: "Vision",
  type: "choice",
  options: q.options.map(opt => ({
    text: opt.text,
    value: opt.id,
    category: opt.profile
  }))
}));

export const PERSONALITY_MX_QUESTIONS: Question[] = personalityMxQuestions.map(q => ({
  id: q.id,
  text: q.text || "Marque a opção que melhor te descreve:",
  category: "Personality",
  type: "choice",
  options: [
    { text: q.options[0].text, value: "A", category: q.options[0].trait },
    { text: q.options[1].text, value: "F", category: q.options[1].trait }
  ]
}));

export const PLAYER_MX_QUESTIONS: Question[] = playerMxQuestions.map(q => ({
  id: q.id,
  text: `Preencha como você realmente é: ${q.context}`,
  category: "Player",
  condition: q.context === 'pressão' ? 'pressao' : q.context,
  type: "choice",
  options: q.options.map(opt => ({
    text: opt.text,
    value: opt.id,
    category: opt.profile
  }))
}));

export const POWER_MX_QUESTIONS: Question[] = powerMxQuestions.map(q => ({
  id: q.id,
  text: q.text,
  category: `Tipo ${q.parte}`,
  type: "scale"
}));

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
      parsed.energy.total = (parsed.energy.razao || 0) + (parsed.energy.acao || 0) + (parsed.energy.emocao || 0);
      return parsed;
    } catch {
      return DEFAULT_IDEAL_PROFILE;
    }
  }
  return DEFAULT_IDEAL_PROFILE;
}
