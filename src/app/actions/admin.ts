'use server'

import { createClient, createAdminClient } from '@/lib/supabase/server'

export async function fetchAllCandidatesWithRecruiters() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { candidates: [], isAdmin: false, currentUserEmail: '' }

  if (user.email === 'admin@talentoia.com') {
    const adminClient = createAdminClient()
    
    // Fetch all candidates ignoring RLS
    const { data: candidates } = await adminClient
      .from('candidates')
      .select('*')
      .order('created_at', { ascending: false })
    
    // Fetch all users to map emails
    const { data: { users } } = await adminClient.auth.admin.listUsers()
    const userMap = new Map()
    users.forEach(u => userMap.set(u.id, u.email))

    const mappedCandidates = (candidates || []).map(c => ({
      ...c,
      recruiter_email: userMap.get(c.user_id) || 'Desconhecido'
    }))

    return { 
      candidates: mappedCandidates, 
      isAdmin: true, 
      currentUserEmail: user.email 
    }
  }

  // Not admin: fetch normally (RLS will restrict to their own)
  const { data: candidates } = await supabase
    .from('candidates')
    .select('*')
    .order('created_at', { ascending: false })
  
  const mappedCandidates = (candidates || []).map(c => ({
    ...c,
    recruiter_email: user.email
  }))

  return { 
    candidates: mappedCandidates, 
    isAdmin: false, 
    currentUserEmail: user.email 
  }
}
