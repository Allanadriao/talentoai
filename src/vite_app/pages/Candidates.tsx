import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, Download, Plus, Users, Calendar, FileText, Trash2, Link as LinkIcon, Check, Copy, X } from 'lucide-react';
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

const AVAILABLE_TESTS = [
  { id: 'energy-mx', name: 'Energy MX' },
  { id: 'vision-mx', name: 'Vision MX' },
  { id: 'personality-mx', name: 'Personality MX' },
  { id: 'player-mx', name: 'Player MX' },
  { id: 'power-mx', name: 'Power MX' }
];

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
  
  const [candidateToShare, setCandidateToShare] = useState<Candidate | 'public' | null>(null);
  const [selectedTests, setSelectedTests] = useState<string[]>(AVAILABLE_TESTS.map(t => t.id));
  const [copied, setCopied] = useState(false);

  const filteredCandidates = candidates.filter(c => {
    const q = searchQuery.toLowerCase();
    return (
      (c.name || '').toLowerCase().includes(q) ||
      (c.email || '').toLowerCase().includes(q) ||
      (c.role || '').toLowerCase().includes(q) ||
      (c.department || '').toLowerCase().includes(q)
    );
  });

  const handleCopyLink = async () => {
    if (!candidateToShare) return;
    
    const baseUrl = window.location.origin;
    let link = '';

    if (candidateToShare === 'public') {
      // Need user id. Let's get it dynamically.
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      const userId = user?.id || '';

      link = `${baseUrl}/test/onboarding?r=${userId}`;
      if (selectedTests.length > 0 && selectedTests.length < AVAILABLE_TESTS.length) {
        link += `&t=${selectedTests.join(',')}`;
      }
    } else {
      link = `${baseUrl}/test?candidate_id=${candidateToShare.id}`;
      if (selectedTests.length > 0 && selectedTests.length < AVAILABLE_TESTS.length) {
        link += `&t=${selectedTests.join(',')}`;
      }
    }

    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
      setCandidateToShare(null);
    }, 2000);
  };

  const toggleTest = (id: string) => {
    setSelectedTests(prev => 
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  return (
    <motion.div 
      key="candidates"
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden relative"
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
            onClick={() => {
              setCandidateToShare('public');
              setSelectedTests(AVAILABLE_TESTS.map(t => t.id));
            }}
            className="px-4 py-2 bg-indigo-100 text-indigo-700 font-bold text-sm rounded-xl flex items-center gap-2 hover:bg-indigo-200"
          >
            <LinkIcon size={18} /> Link Público
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
                      {(c.name || 'U').split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-bold">{c.name || 'Sem nome'}</p>
                      <p className="text-[10px] text-slate-400">{c.email || ''}</p>
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
                    <button 
                      onClick={() => {
                        setCandidateToShare(c);
                        setSelectedTests(AVAILABLE_TESTS.map(t => t.id)); // Reset to all
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-blue-100"
                      title="Gerar Link Mágico"
                    >
                      <LinkIcon size={16} />
                    </button>

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

      {/* Share Link Modal */}
      <AnimatePresence>
        {candidateToShare && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-xl border border-slate-100"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">
                    {candidateToShare === 'public' ? 'Gerar Link Público' : 'Gerar Link Mágico'}
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">
                    {candidateToShare === 'public' 
                      ? 'Este link permitirá que qualquer pessoa inicie os testes selecionados e seja adicionada à sua lista de candidatos.'
                      : <>Para <span className="font-semibold text-indigo-600">{candidateToShare.name}</span></>
                    }
                  </p>
                </div>
                <button 
                  onClick={() => setCandidateToShare(null)}
                  className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="mb-6">
                <p className="text-sm font-bold text-slate-700 mb-3">Quais testes o candidato deve responder?</p>
                <div className="space-y-2">
                  {AVAILABLE_TESTS.map(test => (
                    <div 
                      key={test.id} 
                      onClick={() => toggleTest(test.id)}
                      className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors select-none ${
                        selectedTests.includes(test.id) 
                          ? 'bg-indigo-50 border-indigo-200 text-indigo-900' 
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded flex items-center justify-center border ${
                        selectedTests.includes(test.id) ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300'
                      }`}>
                        {selectedTests.includes(test.id) && <Check size={14} />}
                      </div>
                      <span className="text-sm font-medium">{test.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button 
                onClick={handleCopyLink}
                disabled={selectedTests.length === 0}
                className={`w-full py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors ${
                  copied 
                    ? 'bg-emerald-500 text-white hover:bg-emerald-600' 
                    : selectedTests.length === 0 
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                {copied ? (
                  <>
                    <Check size={18} /> Copiado!
                  </>
                ) : (
                  <>
                    <Copy size={18} /> Copiar Link do Portal
                  </>
                )}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
