import { createClient } from '@supabase/supabase-js';

const NEXT_PUBLIC_SUPABASE_URL='https://myiushzntomrnbxvjplg.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15aXVzaHpudG9tcm5ieHZqcGxnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjQ1OTI0OCwiZXhwIjoyMDkyMDM1MjQ4fQ.ISEqL3AZM38iAUC_GqYEFDeFYWrxhJQajQWzHdGtjIw';

const supabase = createClient(NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const { data: candidates } = await supabase.from('candidates').select('id').limit(1);
  if (!candidates || candidates.length === 0) {
    console.log('No candidates found');
    return;
  }
  const realId = candidates[0].id;
  console.log('Testing with candidate ID:', realId);

  const { data: existing, error: err1 } = await supabase
      .from("assessment_results")
      .select("id, raw_answers")
      .eq("candidate_id", realId)
      .single();
  
  console.log('Existing result:', existing, 'Error:', err1);

  // Now try an insert
  const { data: insertData, error: err2 } = await supabase
      .from("assessment_results")
      .insert({
        candidate_id: realId,
        energy_mx: { razao: 10, acao: 20, emocao: 30, total: 60 },
        raw_answers: { energy_mx: { 1: 5 } }
      })
      .select();
      
  console.log('Insert result:', insertData, 'Error:', err2);
}

run();
