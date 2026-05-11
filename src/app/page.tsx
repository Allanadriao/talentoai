import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function RootPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    const role = user.user_metadata?.role;
    if (role === 'admin') {
      redirect('/admin')
    } else {
      redirect('/dashboard')
    }
  } else {
    redirect('/login')
  }
}
