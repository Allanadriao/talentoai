import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase.from('assessment_results').select('*').limit(3).order('created_at', { ascending: false });
  if (error) {
    console.error('Error:', error);
    return;
  }
  
  console.dir(data, { depth: null });
}

run();
