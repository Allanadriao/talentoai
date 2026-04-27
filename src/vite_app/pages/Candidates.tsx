import React from 'react';
import { motion } from 'motion/react';
import { Search, Filter, Download, Plus, Users, Calendar, FileText, Trash2 } from 'lucide-react';
import { Candidate } from '../types';

interface CandidatesProps {
  candidates: Candidate[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  exportToCSV: () => void;
  setShowForm: (show: boolean) => void;
  setCandidateToSchedule: (c: Candidate) => void;
  setShowInterviewModal: (show: boolean) => void;
  setSelectedCandidate: (c: Candidate) => void;
  setActiveView: (view: any) => void;
  deleteCandidate: (id: string) => void;
}

export default function Candidates({
  candidates,
  searchQuery,
  setSearchQuery,
  exportToCSV,
  setShowForm,
  setCandidateToSchedule,
  setShowInterviewModal,
  setSelectedCandidate,
  setActiveView,
  deleteCandidate
}: CandidatesProps) {
  
  const filteredCandidates = candidates.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div 
      key="candidates"
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden"
    >
      <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-grow max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por nome ou email..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => alert('Filtros avançados em desenvolvimento.')}
            className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg border border-slate-100"
          >
            <Filter size={18} />
          </button>
          <button 
            onClick={exportToCSV}
            className="px-4 py-2 text-slate-600 font-bold text-sm border border-slate-200 rounded-xl flex items-center gap-2 hover:bg-slate-50"
          >
            <Download size={18} /> Exportar
          </button>
          <button 
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-indigo-600 text-white font-bold text-sm rounded-xl flex items-center gap-2 hover:bg-indigo-700"
          >
            <Plus size={18} /> Novo Candidato
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50">
              <th className="px-8 py-4">Candidato</th>
              <th className="px-8 py-4">Cargo</th>
              <th className="px-8 py-4">Status</th>
              <th className="px-8 py-4">Match</th>
              <th className="px-8 py-4">Progresso</th>
              <th className="px-8 py-4">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredCandidates.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-8 py-20 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                      <Users size={32} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-600">Nenhum candidato encontrado</p>
                      <p className="text-xs text-slate-400">Tente ajustar sua busca ou adicione um novo candidato.</p>
                    </div>
                    <button 
                      onClick={() => setShowForm(true)}
                      className="mt-2 px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl"
                    >
                      Novo Candidato
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              filteredCandidates.map(c => (
              <tr key={c.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-8 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-xs">
                      {c.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-sm font-bold">{c.name}</p>
                      <p className="text-[10px] text-slate-400">{c.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <p className="text-sm font-medium">{c.role}</p>
                  <p className="text-[10px] text-slate-400">{c.department}</p>
                </td>
                <td className="px-8 py-5">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${
                    c.status === 'Completo' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                    c.status === 'Em Progresso' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                    'bg-slate-50 text-slate-400 border-slate-100'
                  }`}>
                    {c.status}
                  </span>
                </td>
                <td className="px-8 py-5">
                  {c.match_score ? (
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-[10px]">
                        {c.match_score}%
                      </div>
                      <div className="flex-grow w-16 h-1 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500" style={{ width: `${c.match_score}%` }} />
                      </div>
                    </div>
                  ) : (
                    <span className="text-[10px] text-slate-300 font-bold">N/A</span>
                  )}
                </td>
                <td className="px-8 py-5">
                  <div className="flex flex-col gap-1.5 w-full max-w-[140px]">
                    <div className="flex items-center justify-between text-[10px] font-bold">
                      <span className={c.progress === 4 ? 'text-emerald-600' : 'text-indigo-600'}>
                        {Math.round((c.progress / 4) * 100)}%
                      </span>
                      <span className="text-slate-400">{c.progress}/4</span>
                    </div>
                    <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden flex gap-0.5 p-0.5">
                      {[1, 2, 3, 4].map(step => (
                        <div 
                          key={step}
                          className={`h-full flex-grow rounded-full transition-all duration-500 ${
                            step <= c.progress 
                              ? (c.progress === 4 ? 'bg-emerald-500' : 'bg-indigo-500') 
                              : 'bg-slate-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <div className="flex items-center gap-2">
                    {c.status === 'Completo' && (
                      <button 
                        onClick={() => {
                          setCandidateToSchedule(c);
                          setShowInterviewModal(true);
                        }}
                        className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                        title="Agendar Entrevista"
                      >
                        <Calendar size={18} />
                      </button>
                    )}
                    <button 
                      onClick={() => {
                        setSelectedCandidate(c);
                        setActiveView('reports');
                      }}
                      className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="Ver Relatório"
                    >
                      <FileText size={18} />
                    </button>
                    <button 
                      onClick={() => deleteCandidate(c.id)}
                      className="p-2 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Excluir"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            )))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
