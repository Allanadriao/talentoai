import React, { useState, useEffect } from 'react';
import { Menu, Search, Bell, Plus } from 'lucide-react';

type View = 'dashboard' | 'candidates' | 'assessments' | 'reports' | 'settings' | 'interviews';

interface HeaderProps {
  activeView: View;
  setIsMenuOpen: (isOpen: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  setShowForm?: (show: boolean) => void;
}

export default function Header({ activeView, setIsMenuOpen, searchQuery, setSearchQuery, setShowForm }: HeaderProps) {
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
          <h2 className="text-lg lg:text-xl font-bold capitalize">{activeView}</h2>
          <p className="hidden sm:block text-xs text-slate-400 font-medium">
            {activeView === 'dashboard' && 'Gerencie assessments e visualize perfis comportamentais'}
            {activeView === 'candidates' && 'Gerencie todos os candidatos e seus assessments'}
            {activeView === 'interviews' && 'Gerencie o agendamento de entrevistas'}
            {activeView === 'assessments' && 'Gerencie os formulários de avaliação comportamental'}
            {activeView === 'reports' && 'Análises detalhadas e exportação de dados'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 lg:gap-6">
        {setShowForm && (
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
          <button 
            onClick={() => alert('Perfil do Administrador')}
            className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-sm hover:bg-indigo-200 transition-colors"
          >
            AD
          </button>
          <div className="hidden sm:block text-right">
            <p className="text-sm font-bold">Admin</p>
            <p className="text-[10px] text-slate-400 font-medium uppercase">{companyName}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
