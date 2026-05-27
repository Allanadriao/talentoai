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


export async function saveAssessmentResult(candidateId: string, testType: TestType, resultPayload: any, rawAnswersPayload?: any) {
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
        .eq("candidate_id", candidateId);

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
    const newStatus = newProgress >= 4 ? 'Completo' : 'Em Progresso';
    
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
        
        // Default Ideal Profile
        const ideal = {
          energy: { razao: 39, acao: 34, emocao: 37, total: 110 },
          vision: { alien: 16, robo: 48, mamifero: 12, tubarao: 24 },
          personality: { aberto: 4, fechado: 6, tradicional: 13, inovador: 7, pensador: 9, sentimento: 11, decisivo: 12, flexivel: 8 }
        };
        
        // Energy Match
        if (fullResults.energy_mx) {
          ['razao', 'acao', 'emocao'].forEach(key => {
            const idl = (ideal.energy as any)[key];
            const act = fullResults.energy_mx[key] || 0;
            totalDiff += Math.abs(idl - act);
            totalPossibleDiff += Math.max(idl, 50);
          });
        }
        
        // Vision Match
        if (fullResults.vision_mx) {
          ['alien', 'robo', 'mamifero', 'tubarao'].forEach(key => {
            const idl = (ideal.vision as any)[key];
            const act = fullResults.vision_mx[key] || 0;
            totalDiff += Math.abs(idl - act);
            totalPossibleDiff += 25;
          });
        }
        
        // Personality Match
        if (fullResults.personality_mx) {
          ['aberto', 'fechado', 'tradicional', 'inovador', 'pensador', 'sentimento', 'decisivo', 'flexivel'].forEach(key => {
            const idl = (ideal.personality as any)[key];
            const act = fullResults.personality_mx[key] || 0;
            totalDiff += Math.abs(idl - act);
            totalPossibleDiff += 70;
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
