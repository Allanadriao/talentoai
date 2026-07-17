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

async function listTables() {
  // Query the information_schema to get all tables in public
  const { data, error } = await supabase
    .rpc('get_tables', {}) // Let's just query directly via postgrest if possible, or use a known table
    
}
// since we don't have get_tables RPC, let's just query the tables we see in the image
async function checkTables() {
  const { data: c, error: cErr } = await supabase.from('candidatos').select('*').limit(1);
  const { data: r, error: rErr } = await supabase.from('resultados_da_avaliacao').select('*').limit(1);
  const { data: e, error: eErr } = await supabase.from('entrevistas').select('*').limit(1);
  
  console.log('candidatos:', cErr ? cErr.message : 'exists');
  console.log('resultados_da_avaliacao:', rErr ? rErr.message : 'exists');
  console.log('entrevistas:', eErr ? eErr.message : 'exists');

  const { data: users, error: uErr } = await supabase.auth.admin.listUsers();
  console.log('Users count:', users?.users?.length);
  if (users?.users?.length > 0) {
     console.log('First user:', users.users[0].email);
  }
}

checkTables();
