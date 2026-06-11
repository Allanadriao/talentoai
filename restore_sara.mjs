import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const candidateId = '920a8cc7-4ce4-4306-9b41-a099c214db38';
  
  const energyData = { 'Ação': 40, 'Razão': 34, 'Energia': 115, 'Emoção': 41 };
  const visionData = { 'Alien': '20%', 'Robô': '28%', 'Tubarão': '40%', 'Mamífero': '12%' };
  
  const { error } = await supabase.from('assessment_results')
    .update({
      energy_mx: energyData,
      vision_mx: visionData
    })
    .eq('candidate_id', candidateId);
    
  if (error) {
    console.error("Error updating:", error);
  } else {
    console.log("Restored Sara Larissa's data successfully!");
  }
}

run();
