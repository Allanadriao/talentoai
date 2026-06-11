"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { DEFAULT_IDEAL_PROFILE, calculateMatchScore } from "@/config/assessmentRules";

export type TestType = "energy_mx" | "vision_mx" | "personality_mx" | "player_mx" | "power_mx";

export async function createPublicCandidate(recruiterId: string, name: string, email: string, role: string, department: string) {
  const supabase = createAdminClient();
  
  if (!recruiterId || !name || !email) {
    return { success: false, error: "Dados obrigatórios faltando." };
  }

  try {
    const { data: existing } = await supabase
      .from('candidates')
      .select('id')
      .eq('email', email)
      .eq('user_id', recruiterId)
      .maybeSingle();

    if (existing) return { success: true, candidateId: existing.id };

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
        resume: 'Não enviado'
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
  if (!candidateId) return { success: false, error: "ID do candidato não informado." };

  const supabase = createAdminClient();

  try {
    const { data: candidate, error: candidateError } = await supabase
      .from("candidates")
      .select("id, progress, status")
      .eq("id", candidateId)
      .single();

    if (candidateError || !candidate) {
      return { success: false, error: "Candidato não encontrado." };
    }

    const { data: existingResults } = await supabase
      .from("assessment_results")
      .select("id, raw_answers")
      .eq("candidate_id", candidateId)
      .order("created_at", { ascending: false })
      .limit(1);

    const existingResult = existingResults && existingResults.length > 0 ? existingResults[0] : null;

    let isNewTestForCandidate = false;

    if (existingResult) {
      const raw = existingResult.raw_answers || {};
      if (!raw[testType]) isNewTestForCandidate = true;
      const updatedRawAnswers = { ...raw, [testType]: rawAnswersPayload };
      
      const { error: updateError } = await supabase
        .from("assessment_results")
        .update({ [testType]: resultPayload, raw_answers: updatedRawAnswers })
        .eq("id", existingResult.id);

      if (updateError) throw updateError;
    } else {
      isNewTestForCandidate = true;
      const { error: insertError } = await supabase
        .from("assessment_results")
        .insert({
          candidate_id: candidateId,
          [testType]: resultPayload,
          raw_answers: { [testType]: rawAnswersPayload }
        });

      if (insertError) throw insertError;
    }

    const newProgress = isNewTestForCandidate ? (candidate.progress || 0) + 1 : candidate.progress || 0;
    const newStatus = newProgress >= requiredCount ? 'Completo' : 'Em Progresso';
    
    let matchScore = null;
    
    if (newStatus === 'Completo') {
      const { data: fullResultsArr } = await supabase
        .from('assessment_results')
        .select('*')
        .eq('candidate_id', candidateId)
        .order('created_at', { ascending: false })
        .limit(1);
        
      const fullResults = fullResultsArr && fullResultsArr.length > 0 ? fullResultsArr[0] : null;
        
      if (fullResults) {
        let ideal = DEFAULT_IDEAL_PROFILE;

        try {
          const { data: settingsData } = await supabase.from('system_settings').select('setting_value').eq('setting_key', 'ideal_profile').single();
          if (settingsData && settingsData.setting_value) {
            ideal = settingsData.setting_value;
          }
        } catch (e) {
          console.warn("Using fallback ideal profile.");
        }
        
        matchScore = calculateMatchScore(fullResults, ideal);
        
        if (matchScore !== null) {
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
    return { success: false, error: err.message || "Falha na comunicação com o banco de dados." };
  }
}
