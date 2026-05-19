import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { ShieldAlert, Users, CreditCard, Settings } from 'lucide-react';
import { logout } from '../login/actions';
import AdminLinkGenerator from './AdminLinkGenerator';

export default async function AdminDashboard() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.user_metadata?.role !== 'admin') {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-12 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <ShieldAlert size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Portal do Administrador</h1>
              <p className="text-slate-500 text-sm">Gestão global da plataforma TalentoIA</p>
            </div>
          </div>
          <form action={logout}>
            <button className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200 transition-colors text-sm">
              Sair
            </button>
          </form>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <AdminLinkGenerator userId={user.id} />
          
          <Link href="/admin/recruiters">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer h-full">
              <Users className="text-indigo-500 mb-4" size={32} />
              <h2 className="text-xl font-bold text-slate-800 mb-2">Gestão de Recrutadores</h2>
              <p className="text-slate-500 text-sm">Gerencie o acesso das empresas e recrutadores que utilizam a plataforma.</p>
            </div>
          </Link>
          <Link href="/admin/billing">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer h-full">
              <CreditCard className="text-emerald-500 mb-4" size={32} />
              <h2 className="text-xl font-bold text-slate-800 mb-2">Assinaturas e Pagamentos</h2>
              <p className="text-slate-500 text-sm">Controle de planos, limites de candidatos e faturamento.</p>
            </div>
          </Link>
          <Link href="/admin/settings">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer h-full">
              <Settings className="text-slate-500 mb-4" size={32} />
              <h2 className="text-xl font-bold text-slate-800 mb-2">Configurações do Sistema</h2>
              <p className="text-slate-500 text-sm">Ajustes globais do motor de IA e dos testes de perfil.</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
