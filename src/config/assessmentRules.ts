// Configuração centralizada das regras de negócio dos testes (Single Source of Truth)

export const DEFAULT_IDEAL_PROFILE = {
  energy: { razao: 35, acao: 31, emocao: 34, total: 100 },
  vision: { alien: 16, robo: 48, mamifero: 12, tubarao: 24 },
  personality: { aberto: 40, fechado: 60, tradicional: 65, inovador: 35, pensador: 45, sentimento: 55, decisivo: 60, flexivel: 40 },
  player: { pragmatico: 50, expressivo: 50, afavel: 50, analitico: 50 },
  power: { tipo1: 50, tipo2: 50, tipo3: 50, tipo4: 50, tipo5: 50, tipo6: 50, tipo7: 50, tipo8: 50, tipo9: 50 }
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

  // Energy Match (Percentage scores, 0-100)
  if (fullResults.energy_mx) {
    Object.keys(ASSESSMENT_MAPS.energy).forEach(key => {
      const idl = (idealProfile.energy as any)[key] || 0;
      const act = fullResults.energy_mx[(ASSESSMENT_MAPS.energy as any)[key]] || 0;
      totalDiff += Math.abs(idl - act);
      totalPossibleDiff += Math.max(idl, 100 - idl); 
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
  
  // Personality Match (Percentage scores, 0-100)
  if (fullResults.personality_mx) {
    Object.keys(ASSESSMENT_MAPS.personality).forEach(key => {
      const idl = (idealProfile.personality as any)[key] || 0;
      const act = fullResults.personality_mx[(ASSESSMENT_MAPS.personality as any)[key]] || 0;
      totalDiff += Math.abs(idl - act);
      totalPossibleDiff += Math.max(idl, 100 - idl); 
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

  // Power Match (Percentage scores, 0-100)
  if (fullResults.power_mx && idealProfile.power) {
    Object.keys(ASSESSMENT_MAPS.power).forEach(key => {
      const idl = (idealProfile.power as any)[key] || 0;
      const parteStr = (ASSESSMENT_MAPS.power as any)[key].replace("Tipo ", "");
      const act = fullResults.power_mx[parteStr] || 0;
      totalDiff += Math.abs(idl - act);
      totalPossibleDiff += Math.max(idl, 100 - idl);
    });
  }
  
  if (totalPossibleDiff > 0) {
    return Math.max(0, Math.min(100, Math.floor(100 - (totalDiff / totalPossibleDiff * 100))));
  }

  return null;
}
