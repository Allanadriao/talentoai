export type VisionProfile = 'Alien' | 'Robô' | 'Mamífero' | 'Tubarão';

export interface VisionOption {
  id: string; // 'A', 'B', 'C', 'D'
  text: string;
  profile: VisionProfile;
}

export interface VisionQuestion {
  id: number;
  options: VisionOption[];
}

export const visionMxQuestions: VisionQuestion[] = [
  { id: 1, options: [{ id: 'A', text: 'Idealismo', profile: 'Alien' }, { id: 'B', text: 'Meticulosidade', profile: 'Robô' }, { id: 'C', text: 'Diversão', profile: 'Mamífero' }, { id: 'D', text: 'Persistência', profile: 'Tubarão' }] },
  { id: 2, options: [{ id: 'A', text: 'Inovação', profile: 'Alien' }, { id: 'B', text: 'Organização', profile: 'Robô' }, { id: 'C', text: 'Cuidado', profile: 'Mamífero' }, { id: 'D', text: 'Tarefa', profile: 'Tubarão' }] },
  { id: 3, options: [{ id: 'A', text: 'Curiosidade', profile: 'Alien' }, { id: 'B', text: 'Planejamento', profile: 'Robô' }, { id: 'C', text: 'Relacionamento', profile: 'Mamífero' }, { id: 'D', text: 'Direção', profile: 'Tubarão' }] },
  { id: 4, options: [{ id: 'A', text: 'Complexidade', profile: 'Alien' }, { id: 'B', text: 'Sistematização', profile: 'Robô' }, { id: 'C', text: 'Animação', profile: 'Mamífero' }, { id: 'D', text: 'Objetividade', profile: 'Tubarão' }] },
  { id: 5, options: [{ id: 'A', text: 'Descobertas', profile: 'Alien' }, { id: 'B', text: 'Previsão', profile: 'Robô' }, { id: 'C', text: 'Naturalidade', profile: 'Mamífero' }, { id: 'D', text: 'Determinação', profile: 'Tubarão' }] },
  { id: 6, options: [{ id: 'A', text: 'Questionamento', profile: 'Alien' }, { id: 'B', text: 'Detalhamento', profile: 'Robô' }, { id: 'C', text: 'Participação', profile: 'Mamífero' }, { id: 'D', text: 'Impulsividade', profile: 'Tubarão' }] },
  { id: 7, options: [{ id: 'A', text: 'Liberdade', profile: 'Alien' }, { id: 'B', text: 'Controle', profile: 'Robô' }, { id: 'C', text: 'Compreensão', profile: 'Mamífero' }, { id: 'D', text: 'Impaciência', profile: 'Tubarão' }] },
  { id: 8, options: [{ id: 'A', text: 'Revolução', profile: 'Alien' }, { id: 'B', text: 'Lógica', profile: 'Robô' }, { id: 'C', text: 'Tradição', profile: 'Mamífero' }, { id: 'D', text: 'Quantidade', profile: 'Tubarão' }] },
  { id: 9, options: [{ id: 'A', text: 'Escolha', profile: 'Alien' }, { id: 'B', text: 'Melhoria', profile: 'Robô' }, { id: 'C', text: 'Lazer', profile: 'Mamífero' }, { id: 'D', text: 'Autonomia', profile: 'Tubarão' }] },
  { id: 10, options: [{ id: 'A', text: 'Independência', profile: 'Alien' }, { id: 'B', text: 'Acúmulo', profile: 'Robô' }, { id: 'C', text: 'Assistência', profile: 'Mamífero' }, { id: 'D', text: 'Empreendimento', profile: 'Tubarão' }] },
  { id: 11, options: [{ id: 'A', text: 'Antecipação', profile: 'Alien' }, { id: 'B', text: 'Regras', profile: 'Robô' }, { id: 'C', text: 'Acordo', profile: 'Mamífero' }, { id: 'D', text: 'Persistência', profile: 'Tubarão' }] },
  { id: 12, options: [{ id: 'A', text: 'Criatividade', profile: 'Alien' }, { id: 'B', text: 'Pontualidade', profile: 'Robô' }, { id: 'C', text: 'Parceria', profile: 'Mamífero' }, { id: 'D', text: 'Vantagem', profile: 'Tubarão' }] },
  { id: 13, options: [{ id: 'A', text: 'Aventura', profile: 'Alien' }, { id: 'B', text: 'Ordem', profile: 'Robô' }, { id: 'C', text: 'Cooperação', profile: 'Mamífero' }, { id: 'D', text: 'Execução', profile: 'Tubarão' }] },
  { id: 14, options: [{ id: 'A', text: 'Despreocupação', profile: 'Alien' }, { id: 'B', text: 'Estratégia', profile: 'Robô' }, { id: 'C', text: 'Percurso', profile: 'Mamífero' }, { id: 'D', text: 'Chegada', profile: 'Tubarão' }] },
  { id: 15, options: [{ id: 'A', text: 'Inconstância', profile: 'Alien' }, { id: 'B', text: 'Consistência', profile: 'Robô' }, { id: 'C', text: 'Liderado', profile: 'Mamífero' }, { id: 'D', text: 'Líder', profile: 'Tubarão' }] },
  { id: 16, options: [{ id: 'A', text: 'Irrelevância', profile: 'Alien' }, { id: 'B', text: 'Irritabilidade', profile: 'Robô' }, { id: 'C', text: 'Socialização', profile: 'Mamífero' }, { id: 'D', text: 'Facilidade', profile: 'Tubarão' }] },
  { id: 17, options: [{ id: 'A', text: 'Novidade', profile: 'Alien' }, { id: 'B', text: 'Comando', profile: 'Robô' }, { id: 'C', text: 'Solidariedade', profile: 'Mamífero' }, { id: 'D', text: 'Atuação', profile: 'Tubarão' }] },
  { id: 18, options: [{ id: 'A', text: 'Desconfiança', profile: 'Alien' }, { id: 'B', text: 'Prevenção', profile: 'Robô' }, { id: 'C', text: 'União', profile: 'Mamífero' }, { id: 'D', text: 'Ataque', profile: 'Tubarão' }] },
  { id: 19, options: [{ id: 'A', text: 'Mudança', profile: 'Alien' }, { id: 'B', text: 'Rotina', profile: 'Robô' }, { id: 'C', text: 'Amizade', profile: 'Mamífero' }, { id: 'D', text: 'Produtividade', profile: 'Tubarão' }] },
  { id: 20, options: [{ id: 'A', text: 'Mistério', profile: 'Alien' }, { id: 'B', text: 'Compensação', profile: 'Robô' }, { id: 'C', text: 'Reencontro', profile: 'Mamífero' }, { id: 'D', text: 'Pressa', profile: 'Tubarão' }] },
  { id: 21, options: [{ id: 'A', text: 'Estranheza', profile: 'Alien' }, { id: 'B', text: 'Perfeição', profile: 'Robô' }, { id: 'C', text: 'Envolvimento', profile: 'Mamífero' }, { id: 'D', text: 'Foco', profile: 'Tubarão' }] },
  { id: 22, options: [{ id: 'A', text: 'Eficácia', profile: 'Alien' }, { id: 'B', text: 'Perícia', profile: 'Robô' }, { id: 'C', text: 'Experiência', profile: 'Mamífero' }, { id: 'D', text: 'Sucesso', profile: 'Tubarão' }] },
  { id: 23, options: [{ id: 'A', text: 'Multiplicidade', profile: 'Alien' }, { id: 'B', text: 'Cautela', profile: 'Robô' }, { id: 'C', text: 'Conjunto', profile: 'Mamífero' }, { id: 'D', text: 'Competição', profile: 'Tubarão' }] },
  { id: 24, options: [{ id: 'A', text: 'Polêmica', profile: 'Alien' }, { id: 'B', text: 'Prudência', profile: 'Robô' }, { id: 'C', text: 'Coletividade', profile: 'Mamífero' }, { id: 'D', text: 'Persistência', profile: 'Tubarão' }] },
  { id: 25, options: [{ id: 'A', text: 'Coletividade', profile: 'Alien' }, { id: 'B', text: 'Gradativo', profile: 'Robô' }, { id: 'C', text: 'Justiça', profile: 'Mamífero' }, { id: 'D', text: 'Firmeza', profile: 'Tubarão' }] },
];
