import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase.from('assessment_results').select('id, candidate_id, energy_mx, vision_mx, player_mx, personality_mx').order('created_at', { ascending: false });
  if (error) {
    console.error('Error:', error);
    return;
  }
  
  console.log(`Found ${data.length} results`);
  for (const row of data) {
    console.log(`\nCandidate: ${row.candidate_id}`);
    console.log('Energy:', JSON.stringify(row.energy_mx));
    console.log('Vision:', JSON.stringify(row.vision_mx));
    console.log('Personality:', JSON.stringify(row.personality_mx));
    console.log('Player:', JSON.stringify(row.player_mx));
  }
}

run();
