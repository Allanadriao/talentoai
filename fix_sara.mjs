import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  // Encontrar a Sara Larissa
  const { data: candidates, error } = await supabase
    .from('candidates')
    .select('id, name')
    .ilike('name', '%Sara Larissa%');
    
  if (error) {
    console.error('Error finding candidate:', error);
    return;
  }
  
  if (!candidates || candidates.length === 0) {
    console.log("Candidate not found");
    return;
  }
  
  const saraId = candidates[0].id;
  console.log(`Sara Larissa ID: ${saraId}`);
  
  // Buscar resultados dela
  const { data: results, error: resultsError } = await supabase
    .from('assessment_results')
    .select('*')
    .eq('candidate_id', saraId)
    .order('created_at', { ascending: false });
    
  if (resultsError) {
    console.error('Error fetching results:', resultsError);
    return;
  }
  
  console.log(`Found ${results.length} result rows for Sara Larissa.`);
  if (results.length > 0) {
    console.dir(results, { depth: null });
  }
  
  if (results.length > 1) {
    // Se tiver mais de uma, vamos mesclar na mais recente e deletar as outras!
    console.log("Merging multiple rows...");
    const latest = results[0];
    const merged = { ...latest };
    
    for (let i = 1; i < results.length; i++) {
      const row = results[i];
      if (!merged.energy_mx && row.energy_mx) merged.energy_mx = row.energy_mx;
      if (!merged.vision_mx && row.vision_mx) merged.vision_mx = row.vision_mx;
      if (!merged.personality_mx && row.personality_mx) merged.personality_mx = row.personality_mx;
      if (!merged.player_mx && row.player_mx) merged.player_mx = row.player_mx;
      if (!merged.power_mx && row.power_mx) merged.power_mx = row.power_mx;
      
      // raw answers
      if (!merged.raw_answers) merged.raw_answers = {};
      if (row.raw_answers) {
        Object.assign(merged.raw_answers, row.raw_answers);
      }
    }
    
    // Update the newest row
    await supabase.from('assessment_results').update({
      energy_mx: merged.energy_mx,
      vision_mx: merged.vision_mx,
      personality_mx: merged.personality_mx,
      player_mx: merged.player_mx,
      power_mx: merged.power_mx,
      raw_answers: merged.raw_answers
    }).eq('id', latest.id);
    
    // Delete older rows
    for (let i = 1; i < results.length; i++) {
      await supabase.from('assessment_results').delete().eq('id', results[i].id);
    }
    console.log("Merge complete!");
  }
}

run();
