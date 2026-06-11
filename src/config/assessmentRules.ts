// Configuração centralizada das regras de negócio dos testes (Single Source of Truth)

export const DEFAULT_IDEAL_PROFILE = {
  energy: { razao: 39, acao: 34, emocao: 37, total: 110 },
  vision: { alien: 16, robo: 48, mamifero: 12, tubarao: 24 },
  personality: { aberto: 4, fechado: 6, tradicional: 13, inovador: 7, pensador: 9, sentimento: 11, decisivo: 12, flexivel: 8 },
  player: { pragmatico: 50, expressivo: 50, afavel: 50, analitico: 50 },
  power: { tipo1: 100, tipo2: 100, tipo3: 100, tipo4: 100, tipo5: 100, tipo6: 100, tipo7: 100, tipo8: 100, tipo9: 100 }
};

export const ASSESSMENT_MAPS = {
  energy: { razao: 'Razão', acao: 'Ação', emocao: 'Emoção' },
  vision: { alien: 'Alien', robo: 'Robô', mamifero: 'Mamífero', tubarao: 'Tubarão' },
  personality: { aberto: 'Aberto', fechado: 'Fechado', tradicional: 'Tradicional', inovador: 'Inovador', pensador: 'Pensador', sentimento: 'Sentimento', decisivo: 'Decisivo', flexivel: 'Flexível' },
  player: { pragmatico: 'Pragmático', expressivo: 'Expressivo', afavel: 'Afável', analitico: 'Analítico' },
  power: { tipo1: 'Tipo 1', tipo2: 'Tipo 2', tipo3: 'Tipo 3', tipo4: 'Tipo 4', tipo5: 'Tipo 5', tipo6: 'Tipo 6', tipo7: 'Tipo 7', tipo8: 'Tipo 8', tipo9: 'Tipo 9' }
};

export function calculateMatchScore(fullResults: any, idealProfile: any = DEFAULT_IDEAL_PROFILE) {
  let totalDiff = 0;
  let totalPossibleDiff = 0;

  // Energy Match (Raw scores, max per trait ~45)
  if (fullResults.energy_mx) {
    Object.keys(ASSESSMENT_MAPS.energy).forEach(key => {
      const idl = (idealProfile.energy as any)[key] || 0;
      const act = fullResults.energy_mx[(ASSESSMENT_MAPS.energy as any)[key]] || 0;
      totalDiff += Math.abs(idl - act);
      totalPossibleDiff += Math.max(idl, 45 - idl); // max possible difference
    });
  }
  
  // Vision Match (Percentage scores, 0-100)
  if (fullResults.vision_mx) {
    Object.keys(ASSESSMENT_MAPS.vision).forEach(key => {
      const idl = (idealProfile.vision as any)[key] || 0;
      const rawAct = fullResults.vision_mx[(ASSESSMENT_MAPS.vision as any)[key]];
      const act = typeof rawAct === 'string' ? parseInt(rawAct.replace('%', '')) || 0 : rawAct || 0;
      totalDiff += Math.abs(idl - act);
      totalPossibleDiff += Math.max(idl, 100 - idl);
    });
  }
  
  // Personality Match (Raw scores per dichotomy)
  if (fullResults.personality_mx) {
    Object.keys(ASSESSMENT_MAPS.personality).forEach(key => {
      const idl = (idealProfile.personality as any)[key] || 0;
      const act = fullResults.personality_mx[(ASSESSMENT_MAPS.personality as any)[key]] || 0;
      totalDiff += Math.abs(idl - act);
      totalPossibleDiff += Math.max(idl, 20); 
    });
  }

  // Player Match (Using average of Aparente, Atual, Pressão)
  if (fullResults.player_mx && idealProfile.player) {
    Object.keys(ASSESSMENT_MAPS.player).forEach(key => {
      const idl = (idealProfile.player as any)[key] || 0;
      const prof = (ASSESSMENT_MAPS.player as any)[key];
      const profileData = fullResults.player_mx[prof] || { aparente: 0, atual: 0, pressão: 0 };
      
      const pAp = typeof profileData.aparente === 'string' ? parseInt(profileData.aparente.replace('%', '')) || 0 : profileData.aparente || 0;
      const pAt = typeof profileData.atual === 'string' ? parseInt(profileData.atual.replace('%', '')) || 0 : profileData.atual || 0;
      const pPr = typeof profileData.pressão === 'string' ? parseInt(profileData.pressão.replace('%', '')) || 0 : profileData.pressão || 0;
      
      const act = Math.round((pAp + pAt + pPr) / 3);
      
      totalDiff += Math.abs(idl - act);
      totalPossibleDiff += Math.max(idl, 100 - idl);
    });
  }

  // Power Match (Scores up to 200)
  if (fullResults.power_mx && idealProfile.power) {
    Object.keys(ASSESSMENT_MAPS.power).forEach(key => {
      const idl = (idealProfile.power as any)[key] || 0;
      const act = fullResults.power_mx[(ASSESSMENT_MAPS.power as any)[key]] || 0;
      totalDiff += Math.abs(idl - act);
      totalPossibleDiff += Math.max(idl, 200 - idl);
    });
  }
  
  if (totalPossibleDiff > 0) {
    return Math.max(0, Math.min(100, Math.floor(100 - (totalDiff / totalPossibleDiff * 100))));
  }

  return null;
}
