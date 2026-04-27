'use client'

import { useState } from 'react'
import { addCandidate } from '../actions'
import { Sparkles, Loader2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NewCandidatePage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    const formData = new FormData(e.currentTarget)
    try {
      await addCandidate(formData)
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro ao analisar o candidato.')
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link href="/dashboard" className="text-sm font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 w-fit mb-4">
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          Adicionar Novo Candidato
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Preencha os dados e cole o currículo. A Inteligência Artificial fará a análise em segundos.
        </p>
      </div>

      <div className="glass rounded-2xl p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="name">Nome Completo</label>
              <input
                id="name" name="name" type="text" required disabled={loading}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50"
                placeholder="Ex: Maria Silva"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="email">E-mail</label>
              <input
                id="email" name="email" type="email" required disabled={loading}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50"
                placeholder="maria@email.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="phone">Telefone</label>
              <input
                id="phone" name="phone" type="text" disabled={loading}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50"
                placeholder="(00) 00000-0000"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="position">Vaga Desejada</label>
              <input
                id="position" name="position" type="text" required disabled={loading}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50"
                placeholder="Ex: Desenvolvedor Front-end"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="resume">Currículo (Texto)</label>
            <textarea
              id="resume" name="resume" required disabled={loading} rows={8}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50 resize-y"
              placeholder="Cole aqui o conteúdo do currículo ou texto do perfil do LinkedIn..."
            />
          </div>

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full sm:w-auto items-center justify-center rounded-md text-sm font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-8 py-2 disabled:opacity-70 group"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analisando com IA...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2 group-hover:text-yellow-200 transition-colors" />
                  Salvar e Analisar
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
