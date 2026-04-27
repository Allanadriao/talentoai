'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { analyzeCandidate } from '@/services/ai'

export async function addCandidate(formData: FormData) {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Não autorizado")

  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const phone = formData.get('phone') as string
  const position = formData.get('position') as string
  const resume = formData.get('resume') as string

  // 1. Send to OpenAI for analysis
  let ai_score = null;
  let ai_summary = null;
  let ai_decision = null;

  try {
    const analysis = await analyzeCandidate(position, resume);
    ai_score = analysis.score;
    ai_summary = analysis.summary;
    ai_decision = analysis.decision;
  } catch (err) {
    console.error("AI Analysis failed", err);
    // Continue without AI data or just fail. For SaaS, we could fail or save as pending.
    // Let's mark it as a failure to analyze if keys are wrong.
    throw new Error("Falha ao analisar currículo com a IA. Verifique sua OpenAI API Key.");
  }

  // 2. Save in database
  const { error } = await supabase.from('candidates').insert({
    user_id: user.id,
    name,
    email,
    phone,
    position,
    resume,
    ai_score,
    ai_summary,
    ai_decision,
    status: 'analyzed'
  })

  if (error) {
    throw new Error("Erro ao salvar no banco de dados: " + error.message)
  }

  // 3. Webhook (simulated for n8n future integration)
  try {
    // fetch('https://seu-endereco-do-n8n.com/webhook/candidate', {
    //   method: 'POST',
    //   body: JSON.stringify({ name, email, ai_score, ai_decision })
    // });
    console.log("Webhook triggered as placeholder.");
  } catch (e) {
    // Ignore webhook errors
  }

  revalidatePath('/dashboard')
  redirect('/dashboard')
}
