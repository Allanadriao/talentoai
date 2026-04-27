"use client";

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, Search, Bell, Plus } from 'lucide-react';
import { useLayout } from './LayoutContext';

export default function Header() {
  const pathname = usePathname();
  const { setIsMenuOpen, searchQuery, setSearchQuery, setShowForm } = useLayout();
  const [companyName, setCompanyName] = useState('EVANDRO FONSECA');

  useEffect(() => {
    const updateName = () => {
      const saved = localStorage.getItem('companyName');
      if (saved) setCompanyName(saved);
    };
    updateName();
    window.addEventListener('settings-updated', updateName as EventListener);
    return () => window.removeEventListener('settings-updated', updateName as EventListener);
  }, []);

  // Determine title and description based on pathname
  let activeViewTitle = 'Dashboard';
  let description = 'Gerencie assessments e visualize perfis comportamentais';

  if (pathname.includes('/candidates')) {
    activeViewTitle = 'Candidatos';
    description = 'Gerencie todos os candidatos e seus assessments';
  } else if (pathname.includes('/interviews')) {
    activeViewTitle = 'Entrevistas';
    description = 'Gerencie o agendamento de entrevistas';
  } else if (pathname.includes('/assessments')) {
    activeViewTitle = 'Assessments';
    description = 'Gerencie os formulários de avaliação comportamental';
  } else if (pathname.includes('/reports')) {
    activeViewTitle = 'Relatórios';
    description = 'Análises detalhadas e exportação de dados';
  } else if (pathname.includes('/settings')) {
    activeViewTitle = 'Configurações';
    description = 'Ajuste preferências e configurações do sistema';
  }

  // Show the "Novo Candidato" button mostly everywhere except maybe settings, but let's keep it global as the original allowed it.
  const canShowForm = pathname.includes('/candidates') || pathname === '/dashboard';

  return (
    <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-20">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setIsMenuOpen(true)}
          className="lg:hidden p-2 text-slate-400 hover:bg-slate-50 rounded-lg"
        >
          <Menu size={24} />
        </button>
        <div>
          <h2 className="text-lg lg:text-xl font-bold capitalize">{activeViewTitle}</h2>
          <p className="hidden sm:block text-xs text-slate-400 font-medium">
            {description}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 lg:gap-6">
        {canShowForm && (
          <button 
            onClick={() => setShowForm(true)}
            className="hidden sm:flex bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold items-center gap-2 hover:bg-indigo-700 transition-all shadow-sm shadow-indigo-200"
          >
            <Plus size={18} /> Novo Candidato
          </button>
        )}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar candidatos..."
            className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/10 w-64"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button 
          onClick={() => alert('Você não tem novas notificações.')}
          className="relative text-slate-400 hover:text-slate-600"
        >
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full border-2 border-white"></span>
        </button>
        <div className="flex items-center gap-3 pl-6 border-l border-slate-100">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-bold">Admin</p>
            <p className="text-[10px] text-slate-400 font-medium uppercase">{companyName}</p>
          </div>
          <button 
            onClick={async () => {
              // Limpar a sessão do Supabase chamando a API ou limpando dados do client
              const { createClient } = await import('@/lib/supabase/client');
              const supabase = createClient();
              await supabase.auth.signOut();
              window.location.href = '/login';
            }}
            className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center text-rose-600 font-bold text-sm hover:bg-rose-200 transition-colors cursor-pointer"
            title="Sair da conta"
          >
            SAIR
          </button>
        </div>
      </div>
    </header>
  );
}
