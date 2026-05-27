import { createClient } from '@supabase/supabase-js';

const NEXT_PUBLIC_SUPABASE_URL='https://myiushzntomrnbxvjplg.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15aXVzaHpudG9tcm5ieHZqcGxnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjQ1OTI0OCwiZXhwIjoyMDkyMDM1MjQ4fQ.ISEqL3AZM38iAUC_GqYEFDeFYWrxhJQajQWzHdGtjIw';

const supabase = createClient(NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function run() {
    // find a candidate with no results
    const { data: candidates } = await supabase.from('candidates').select('id, name').limit(10);
    
    for (const cand of candidates) {
        const { data: results } = await supabase.from('assessment_results').select('id').eq('candidate_id', cand.id);
        if (!results || results.length === 0) {
            console.log('Candidate with NO results:', cand);
            // Now test the insert code!
            const testType = 'vision_mx';
            const resultPayload = { alien: 10, robo: 20 };
            const rawAnswersPayload = { 1: 'A' };

            const { error: insertError } = await supabase
                .from("assessment_results")
                .insert({
                  candidate_id: cand.id,
                  [testType]: resultPayload,
                  raw_answers: { [testType]: rawAnswersPayload }
                });

            console.log('Insert Error:', insertError);
            return;
        }
    }
    console.log('Could not find candidate with no results. Please create one.');
}
run();
