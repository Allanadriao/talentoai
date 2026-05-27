import { createClient } from '@supabase/supabase-js';

const NEXT_PUBLIC_SUPABASE_URL='https://myiushzntomrnbxvjplg.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15aXVzaHpudG9tcm5ieHZqcGxnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjQ1OTI0OCwiZXhwIjoyMDkyMDM1MjQ4fQ.ISEqL3AZM38iAUC_GqYEFDeFYWrxhJQajQWzHdGtjIw';

const supabase = createClient(NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function saveAssessmentResult(candidateId, testType, resultPayload, rawAnswersPayload) {
  try {
    const { data: candidate, error: candidateError } = await supabase
      .from("candidates")
      .select("id, progress, status")
      .eq("id", candidateId)
      .single();

    if (candidateError || !candidate) {
      console.log('Candidate error:', candidateError);
      return { success: false, error: "Candidato não encontrado." };
    }

    const { data: existingResult, error: existErr } = await supabase
      .from("assessment_results")
      .select("id, raw_answers")
      .eq("candidate_id", candidateId)
      .maybeSingle();
      
    console.log('Existing:', existingResult, 'Err:', existErr);

    let isNewTestForCandidate = false;

    if (existingResult) {
      console.log('Updating...');
      const raw = existingResult.raw_answers || {};
      if (!raw[testType]) isNewTestForCandidate = true;
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
      console.log('Inserting...');
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
    console.log('Done!');
  } catch (e) {
    console.error('Catch Error:', e);
  }
}

async function run() {
    const { data: candidates } = await supabase.from('candidates').select('id').limit(1);
    await saveAssessmentResult(candidates[0].id, 'vision_mx', { alien: 10, robo: 20 }, { 1: 'A' });
}
run();
