import React from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { ArrowLeft, Settings, Cpu } from 'lucide-react';
import Link from 'next/link';

export default async function AdminSettingsPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.user_metadata?.role !== 'admin') {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans p-6 sm:p-12">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin" className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
            <ArrowLeft className="text-slate-500" size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Configurações do Sistema</h1>
            <p className="text-slate-500 text-sm">Ajustes da IA e banco de dados.</p>
          </div>
        </div>

        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center flex flex-col items-center justify-center">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-6">
            <Settings size={40} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Painel de Parâmetros Globais</h2>
          <p className="text-slate-500 max-w-md mx-auto mb-8">
            As configurações de pesos e medidas do Motor de Inteligência Artificial serão ajustadas diretamente por este painel no futuro.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl text-sm font-bold border border-indigo-200">
            <Cpu size={16} /> Motor da IA estável e operando
          </div>
        </div>

      </div>
    </div>
  );
}
