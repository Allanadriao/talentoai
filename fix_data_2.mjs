import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const targetUserId = '8debb82a-b523-4236-b440-b5f0711928e5'; // Evandro Fonseca's ID
  console.log('Atualizando todos os candidatos para o ID do Evandro:', targetUserId);
  
  const { data: candidates, error } = await supabase.from('candidates').select('id, name, user_id');
  if (error) {
    console.error('Erro ao buscar candidatos:', error);
    return;
  }
  
  const toUpdate = candidates.filter(c => c.user_id !== targetUserId);
  console.log(`Encontrados ${toUpdate.length} candidatos para atualizar.`);
  
  if (toUpdate.length > 0) {
    for (const c of toUpdate) {
      console.log(`Atualizando ${c.name} para ${targetUserId}`);
      const { error: updateError } = await supabase
        .from('candidates')
        .update({ user_id: targetUserId })
        .eq('id', c.id);
        
      if (updateError) {
        console.error(`Erro ao atualizar ${c.name}:`, updateError);
      } else {
        console.log(`${c.name} atualizado com sucesso.`);
      }
    }
  } else {
    console.log('Nenhum candidato precisou ser atualizado.');
  }
}

run();
