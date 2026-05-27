import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function run() {
  const candidateId = 'test-id'; // We will just test a fake id or get a real one
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
