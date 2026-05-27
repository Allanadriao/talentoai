import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log('Buscando candidatos...');
  const { data: candidates, error } = await supabase.from('candidates').select('id, name, user_id');
  if (error) {
    console.error('Erro ao buscar candidatos:', error);
    return;
  }
  
  const gabriel = candidates.find(c => c.name.includes('Gabriel Bispo'));
  if (!gabriel) {
    console.error('Gabriel Bispo não encontrado.');
    return;
  }
  
  const targetUserId = gabriel.user_id;
  console.log('ID do recrutador (Gabriel Bispo):', targetUserId);
  
  const toUpdate = candidates.filter(c => c.user_id !== targetUserId);
  console.log(`Encontrados ${toUpdate.length} candidatos com user_id diferente.`);
  
  if (toUpdate.length > 0) {
    console.log('Atualizando candidatos para o user_id correto...');
    for (const c of toUpdate) {
      console.log(`Atualizando ${c.name} (user_id: ${c.user_id}) para ${targetUserId}`);
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
