'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
  const supabase = createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    return redirect('/login?message=Could not authenticate user')
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signup(formData: FormData) {
  const supabase = createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return redirect('/login?message=Preencha e-mail e senha')
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) {
    if (error.message.includes('rate limit')) {
      return redirect('/login?message=Limite do Supabase atingido! Acesse as opções do Supabase, desative o "Confirm Email" e tente criar a conta usando um e-mail diferente (ex: ola@teste.com).')
    }
    return redirect(`/login?message=${encodeURIComponent(error.message)}`)
  }

  if (data.user && data.user.identities && data.user.identities.length === 0) {
    return redirect('/login?message=Este e-mail já está em uso.')
  }

  if (!data.session) {
    return redirect('/login?message=Conta criada com sucesso! Verifique seu e-mail para confirmar.')
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function logout() {
  const supabase = createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
