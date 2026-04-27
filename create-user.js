const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://myiushzntomrnbxvjplg.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15aXVzaHpudG9tcm5ieHZqcGxnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjQ1OTI0OCwiZXhwIjoyMDkyMDM1MjQ4fQ.ISEqL3AZM38iAUC_GqYEFDeFYWrxhJQajQWzHdGtjIw'
);

async function main() {
  const { data, error } = await supabase.auth.admin.createUser({
    email: 'admin@talentoia.com',
    password: 'admin',
    email_confirm: true
  });

  if (error) {
    if (error.message.includes('already exists')) {
      console.log('User already exists, script success anyway.');
    } else {
      console.error('Error:', error.message);
    }
  } else {
    console.log('User created successfully!');
  }
}

main();
