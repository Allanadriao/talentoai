"use server";

import { createAdminClient } from "@/lib/supabase/server";

export type TestType = "energy_mx" | "vision_mx" | "personality_mx" | "player_mx" | "power_mx";

export async function createPublicCandidate(recruiterId: string, name: string, email: string, role: string, department: string) {
  const supabase = createAdminClient();
  
  if (!recruiterId || !name || !email) {
    return { success: false, error: "Dados obrigatórios faltando." };
  }

  try {
    // Verifica se o candidato já existe (evita erro de constraint de email unico se houver)
    const { data: existing } = await supabase
      .from('candidates')
      .select('id')
      .eq('email', email)
      .eq('user_id', recruiterId)
      .maybeSingle();

    if (existing) {
      return { success: true, candidateId: existing.id };
    }

    const { data, error } = await supabase
      .from('candidates')
      .insert({
        user_id: recruiterId,
        name,
        email,
        role: role || 'Não informado',
        department: department || 'Não informado',
        status: 'Pendente',
        progress: 0,
        position: role || 'Não informado',
        resume: 'Não enviado' // Garante que a coluna não fique nula caso haja constraint
      })
      .select('id')
      .single();

    if (error) throw error;

    return { success: true, candidateId: data.id };
  } catch (err: any) {
    console.error("Erro ao criar candidato público:", err);
    return { success: false, error: err.message || "Erro desconhecido." };
  }
}


export async function saveAssessmentResult(candidateId: string, testType: TestType, resultPayload: any, rawAnswersPayload?: any, requiredCount: number = 5) {
  if (!candidateId) {
    return { success: false, error: "ID do candidato não informado." };
  }

  const supabase = createAdminClient();

  try {
    // Check if the candidate exists
    const { data: candidate, error: candidateError } = await supabase
      .from("candidates")
      .select("id, progress, status")
      .eq("id", candidateId)
      .single();

    if (candidateError || !candidate) {
      return { success: false, error: "Candidato não encontrado." };
    }

    // Check if there is already an assessment_results row for this candidate
    const { data: existingResults } = await supabase
      .from("assessment_results")
      .select("id, raw_answers")
      .eq("candidate_id", candidateId)
      .order("created_at", { ascending: false })
      .limit(1);

    const existingResult = existingResults && existingResults.length > 0 ? existingResults[0] : null;

    let isNewTestForCandidate = false;

    if (existingResult) {
      // Update existing record
      const raw = existingResult.raw_answers || {};
      if (!raw[testType]) {
        isNewTestForCandidate = true;
      }
      const updatedRawAnswers = { ...raw, [testType]: rawAnswersPayload };
      
      const { error: updateError } = await supabase
        .from("assessment_results")
        .update({
          [testType]: resultPayload,
          raw_answers: updatedRawAnswers
        })
        .eq("id", existingResult.id);

      if (updateError) throw updateError;
    } else {
      isNewTestForCandidate = true;
      // Insert new record
      const { error: insertError } = await supabase
        .from("assessment_results")
        .insert({
          candidate_id: candidateId,
          [testType]: resultPayload,
          raw_answers: { [testType]: rawAnswersPayload }
        });

      if (insertError) throw insertError;
    }

    // Atualiza o progresso e calcula match_score se concluído
    const newProgress = isNewTestForCandidate ? (candidate.progress || 0) + 1 : candidate.progress || 0;
    const newStatus = newProgress >= requiredCount ? 'Completo' : 'Em Progresso';
    
    let matchScore = null;
    
    // Se estiver completo, buscamos todos os resultados para calcular o match_score
    if (newStatus === 'Completo') {
      const { data: fullResultsArr } = await supabase
        .from('assessment_results')
        .select('*')
        .eq('candidate_id', candidateId)
        .order('created_at', { ascending: false })
        .limit(1);
        
      const fullResults = fullResultsArr && fullResultsArr.length > 0 ? fullResultsArr[0] : null;
        
      if (fullResults) {
        let totalDiff = 0;
        let totalPossibleDiff = 0;
        
        // Fetch Ideal Profile from DB or use default
        let ideal = {
          energy: { razao: 39, acao: 34, emocao: 37, total: 110 },
          vision: { alien: 16, robo: 48, mamifero: 12, tubarao: 24 },
          personality: { aberto: 4, fechado: 6, tradicional: 13, inovador: 7, pensador: 9, sentimento: 11, decisivo: 12, flexivel: 8 },
          player: { pragmatico: 50, expressivo: 50, afavel: 50, analitico: 50 },
          power: { tipo1: 100, tipo2: 100, tipo3: 100, tipo4: 100, tipo5: 100, tipo6: 100, tipo7: 100, tipo8: 100, tipo9: 100 }
        };

        try {
          const { data: settingsData } = await supabase.from('system_settings').select('setting_value').eq('setting_key', 'ideal_profile').single();
          if (settingsData && settingsData.setting_value) {
            ideal = settingsData.setting_value;
          }
        } catch (e) {
          console.warn("Could not fetch ideal_profile from DB, using fallback.", e);
        }
        
        // Energy Match (Raw scores, max per trait ~45)
        if (fullResults.energy_mx) {
          const energyMap = { razao: 'Razão', acao: 'Ação', emocao: 'Emoção' };
          ['razao', 'acao', 'emocao'].forEach(key => {
            const idl = (ideal.energy as any)[key];
            const act = fullResults.energy_mx[(energyMap as any)[key]] || 0;
            totalDiff += Math.abs(idl - act);
            totalPossibleDiff += Math.max(idl, 45 - idl); // max possible difference
          });
        }
        
        // Vision Match (Percentage scores, 0-100)
        if (fullResults.vision_mx) {
          const visionMap = { alien: 'Alien', robo: 'Robô', mamifero: 'Mamífero', tubarao: 'Tubarão' };
          ['alien', 'robo', 'mamifero', 'tubarao'].forEach(key => {
            const idl = (ideal.vision as any)[key];
            const rawAct = fullResults.vision_mx[(visionMap as any)[key]];
            const act = typeof rawAct === 'string' ? parseInt(rawAct.replace('%', '')) || 0 : rawAct || 0;
            totalDiff += Math.abs(idl - act);
            totalPossibleDiff += Math.max(idl, 100 - idl);
          });
        }
        
        // Personality Match (Raw scores per dichotomy)
        if (fullResults.personality_mx) {
          const persMap = { aberto: 'Aberto', fechado: 'Fechado', tradicional: 'Tradicional', inovador: 'Inovador', pensador: 'Pensador', sentimento: 'Sentimento', decisivo: 'Decisivo', flexivel: 'Flexível' };
          ['aberto', 'fechado', 'tradicional', 'inovador', 'pensador', 'sentimento', 'decisivo', 'flexivel'].forEach(key => {
            const idl = (ideal.personality as any)[key];
            const act = fullResults.personality_mx[(persMap as any)[key]] || 0;
            totalDiff += Math.abs(idl - act);
            // Since max points per dichotomy vary (e.g. 11, 21), approximating max diff
            totalPossibleDiff += Math.max(idl, 20); 
          });
        }

        // Player Match (Using average of Aparente, Atual, Pressão)
        if (fullResults.player_mx && ideal.player) {
          const playerMap = { pragmatico: 'Pragmático', expressivo: 'Expressivo', afavel: 'Afável', analitico: 'Analítico' };
          ['pragmatico', 'expressivo', 'afavel', 'analitico'].forEach(key => {
            const idl = (ideal.player as any)[key];
            const prof = (playerMap as any)[key];
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
        if (fullResults.power_mx && ideal.power) {
          const powerMap = { tipo1: 'Tipo 1', tipo2: 'Tipo 2', tipo3: 'Tipo 3', tipo4: 'Tipo 4', tipo5: 'Tipo 5', tipo6: 'Tipo 6', tipo7: 'Tipo 7', tipo8: 'Tipo 8', tipo9: 'Tipo 9' };
          ['tipo1', 'tipo2', 'tipo3', 'tipo4', 'tipo5', 'tipo6', 'tipo7', 'tipo8', 'tipo9'].forEach(key => {
            const idl = (ideal.power as any)[key];
            const act = fullResults.power_mx[(powerMap as any)[key]] || 0;
            totalDiff += Math.abs(idl - act);
            totalPossibleDiff += Math.max(idl, 200 - idl);
          });
        }
        
        if (totalPossibleDiff > 0) {
          matchScore = Math.max(0, Math.min(100, Math.floor(100 - (totalDiff / totalPossibleDiff * 100))));
          
          await supabase.from("assessment_results")
            .update({ match_score: matchScore })
            .eq("candidate_id", candidateId);
        }
      }
    }
    
    await supabase
      .from("candidates")
      .update({
        progress: newProgress,
        status: newStatus,
        ...(matchScore !== null ? { match_score: matchScore } : {})
      })
      .eq("id", candidateId);

    return { success: true };
  } catch (err: any) {
    console.error(`Erro ao salvar ${testType}:`, err);
    return { success: false, error: err.message || "Erro desconhecido ao salvar o teste." };
  }
}
