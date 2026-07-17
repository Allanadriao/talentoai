const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const envFile = fs.readFileSync('.env.local', 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    env[match[1]] = match[2].trim();
  }
});

const supabaseUrl = env['NEXT_PUBLIC_SUPABASE_URL'];
const supabaseKey = env['SUPABASE_SERVICE_ROLE_KEY'];
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkData() {
  const { data: candidates, error: cErr } = await supabase.from('candidates').select('*');
  const { data: results, error: rErr } = await supabase.from('assessment_results').select('*');
  
  if (cErr) console.error('Error candidates:', cErr);
  if (rErr) console.error('Error results:', rErr);
  
  console.log('Candidates count:', candidates ? candidates.length : 0);
  console.log('Results count:', results ? results.length : 0);
}

checkData();
