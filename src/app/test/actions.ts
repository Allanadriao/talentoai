"use server";

import { createAdminClient } from "@/lib/supabase/server";

export type TestType = "energy_mx" | "vision_mx" | "personality_mx" | "player_mx" | "power_mx";

export async function createPublicCandidate(recruiterId: string, name: string, email: string, role: string, department: string) {
  const supabase = createAdminClient();
  
  if (!recruiterId || !name || !email) {
    return { success: false, error: "Dados obrigatórios faltando." };
  }

  try {
    const { data, error } = await supabase
      .from('candidates')
      .insert({
        user_id: recruiterId, // Assumes candidates table uses user_id for the recruiter owner
        name,
        email,
        role: role || 'Não informado',
        department: department || 'Não informado',
        status: 'Pendente',
        progress: 0,
        // using the older fields if needed, like position: role
        position: role || 'Não informado'
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
      .select("id")
      .eq("id", candidateId)
      .single();

    if (candidateError || !candidate) {
      return { success: false, error: "Candidato não encontrado." };
    }

    // Check if there is already an assessment_results row for this candidate
    const { data: existingResult } = await supabase
      .from("assessment_results")
      .select("id, raw_answers")
      .eq("candidate_id", candidateId)
      .single();

    if (existingResult) {
      // Update existing record
      const updatedRawAnswers = { ...(existingResult.raw_answers || {}), [testType]: rawAnswersPayload };
      
      const { error: updateError } = await supabase
        .from("assessment_results")
        .update({
          [testType]: resultPayload,
          raw_answers: updatedRawAnswers
        })
        .eq("candidate_id", candidateId);

      if (updateError) throw updateError;
    } else {
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

    return { success: true };
  } catch (err: any) {
    console.error(`Erro ao salvar ${testType}:`, err);
    return { success: false, error: err.message || "Erro desconhecido ao salvar o teste." };
  }
}
