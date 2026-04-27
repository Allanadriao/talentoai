import { login, signup } from './actions'
import { Zap, CheckCircle2, ShieldCheck, Cpu } from 'lucide-react'

export default function LoginPage({
  searchParams,
}: {
  searchParams: { message: string }
}) {
  return (
    <div className="flex min-h-screen bg-white font-sans">
      
      {/* Esquerda: Formulário de Login */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          
          <div className="text-center lg:text-left mb-10">
            <div className="lg:hidden w-14 h-14 bg-indigo-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 mx-auto mb-6">
              <Zap size={28} fill="currentColor" />
            </div>
            <h1 className="text-slate-900 font-bold text-3xl sm:text-4xl leading-tight mb-2">Bem-vindo(a)</h1>
            <p className="text-slate-500">Faça login ou cadastre-se para acessar o painel de recrutamento inteligente.</p>
          </div>

          <form className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-900" htmlFor="email">
                E-mail Profissional
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="exemplo@empresa.com"
                required
                className="flex h-12 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-900" htmlFor="password">
                Senha de Acesso
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                placeholder="••••••••"
                className="flex h-12 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
              />
            </div>

            <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                formAction={login}
                className="flex w-full items-center justify-center rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 h-12 font-medium shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5"
              >
                Entrar
              </button>
              <button
                formAction={signup}
                className="flex w-full items-center justify-center rounded-xl bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 h-12 font-medium transition-all"
              >
                Criar Nova Conta
              </button>
            </div>

            {searchParams?.message && (
              <div className={`mt-6 p-4 text-center text-sm rounded-xl font-medium border ${
                searchParams.message.includes('sucesso') 
                  ? 'bg-green-50 text-green-700 border-green-200'
                  : 'bg-red-50 text-red-600 border-red-200'
              }`}>
                {searchParams.message}
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Direita: Painel Decorativo (Estilo do App) */}
      <div className="hidden lg:flex w-1/2 bg-[#0F172A] p-16 relative overflow-hidden flex-col justify-center">
        {/* Elemento Decorativo */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3" />
        
        <div className="relative z-10 max-w-lg">
          <div className="w-16 h-16 bg-indigo-500 rounded-2xl flex items-center justify-center text-white mb-8 shadow-2xl shadow-indigo-500/30">
            <Zap size={32} fill="currentColor" />
          </div>
          <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
            Assessment Automático com Inteligência Artificial
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed mb-12">
            Otimize seu recrutamento. Adicione candidatos, interprete currículos com IA e reduza em 80% o tempo de triagem mantendo o padrão da sua empresa.
          </p>

          <div className="space-y-6">
            <div className="flex items-center gap-4 text-slate-300">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 text-indigo-400">
                <ShieldCheck size={20} />
              </div>
              <span className="font-medium">Protegido por Autenticação Segura (Supabase)</span>
            </div>
            <div className="flex items-center gap-4 text-slate-300">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 text-indigo-400">
                <Cpu size={20} />
              </div>
              <span className="font-medium">Motor de IA Preditiva na Nuvem</span>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  )
}
