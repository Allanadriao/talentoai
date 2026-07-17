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

async function checkUsers() {
  const { data: users, error } = await supabase.auth.admin.listUsers();
  if (error) {
    console.error('Error fetching users:', error);
    return;
  }
  console.log('Users:');
  users.users.forEach(u => {
    console.log(`- ID: ${u.id}, Email: ${u.email}, Confirmed: ${u.email_confirmed_at ? 'Yes' : 'No'}, Role: ${u.user_metadata?.role}`);
  });
}

checkUsers();
