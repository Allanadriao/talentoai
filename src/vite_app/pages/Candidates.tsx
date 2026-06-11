import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, Filter, Download, Plus, Users, Link as LinkIcon } from 'lucide-react';
import { Candidate } from '../types';
import { CandidateTableDesktop } from '../components/candidates/CandidateTableDesktop';
import { CandidateCardsMobile } from '../components/candidates/CandidateCardsMobile';
import { MagicLinkModal } from '../components/candidates/MagicLinkModal';
import { toast } from 'sonner';

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
  
  const [candidateToShare, setCandidateToShare] = useState<Candidate | 'public' | null>(null);

  const filteredCandidates = candidates.filter(c => {
    const q = searchQuery.toLowerCase();
    return (
      (c.name || '').toLowerCase().includes(q) ||
      (c.email || '').toLowerCase().includes(q) ||
      (c.role || '').toLowerCase().includes(q) ||
      (c.department || '').toLowerCase().includes(q)
    );
  });

  return (
    <motion.div 
      key="candidates"
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-transparent sm:bg-white sm:rounded-3xl sm:border sm:border-slate-100 sm:shadow-sm overflow-hidden relative"
    >
      {/* Header com Buscas e Filtros */}
      <div className="p-0 sm:p-6 sm:border-b sm:border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 sm:mb-0">
        <div className="relative flex-grow max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por nome ou email..."
            className="w-full pl-10 pr-4 py-3 sm:py-2 bg-white sm:bg-slate-50 border border-slate-100 rounded-2xl sm:rounded-xl text-sm shadow-sm sm:shadow-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <button 
            onClick={() => toast.info('Filtros avançados em desenvolvimento.')}
            className="p-3 sm:p-2 text-slate-400 bg-white sm:bg-transparent hover:bg-slate-50 rounded-xl sm:rounded-lg border border-slate-100 shadow-sm sm:shadow-none"
          >
            <Filter size={18} />
          </button>
          <button 
            onClick={() => {
              exportToCSV();
              toast.success('Relatório exportado com sucesso!');
            }}
            className="px-4 py-3 sm:py-2 bg-white sm:bg-transparent text-slate-600 font-bold text-sm border border-slate-200 rounded-xl flex items-center gap-2 hover:bg-slate-50 shadow-sm sm:shadow-none"
          >
            <Download size={18} /> <span className="hidden sm:inline">Exportar</span>
          </button>
          <button 
            onClick={() => setCandidateToShare('public')}
            className="px-4 py-3 sm:py-2 bg-indigo-100 text-indigo-700 font-bold text-sm rounded-xl flex items-center gap-2 hover:bg-indigo-200"
          >
            <LinkIcon size={18} /> <span className="hidden sm:inline">Link Público</span>
          </button>
          <button 
            onClick={() => setShowForm(true)}
            className="flex-grow sm:flex-grow-0 px-4 py-3 sm:py-2 bg-indigo-600 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 hover:bg-indigo-700 shadow-md sm:shadow-none"
          >
            <Plus size={18} /> Novo <span className="hidden sm:inline">Candidato</span>
          </button>
        </div>
      </div>

      {/* Conteúdo: Tabela (Desktop) ou Cards (Mobile) */}
      {filteredCandidates.length === 0 ? (
        <div className="px-8 py-20 text-center bg-white rounded-3xl sm:rounded-none shadow-sm sm:shadow-none">
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
              className="mt-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-colors"
            >
              Adicionar Candidato
            </button>
          </div>
        </div>
      ) : (
        <>
          <CandidateTableDesktop 
            candidates={filteredCandidates}
            deleteCandidate={deleteCandidate}
            setCandidateToShare={setCandidateToShare}
            setCandidateToSchedule={setCandidateToSchedule}
            setShowInterviewModal={setShowInterviewModal}
            setSelectedCandidate={setSelectedCandidate}
            setActiveView={setActiveView}
          />
          
          <CandidateCardsMobile 
            candidates={filteredCandidates}
            deleteCandidate={deleteCandidate}
            setCandidateToShare={setCandidateToShare}
            setCandidateToSchedule={setCandidateToSchedule}
            setShowInterviewModal={setShowInterviewModal}
            setSelectedCandidate={setSelectedCandidate}
            setActiveView={setActiveView}
          />
        </>
      )}

      {/* Modal Mágico para Links */}
      <MagicLinkModal 
        candidateToShare={candidateToShare}
        setCandidateToShare={setCandidateToShare}
      />

    </motion.div>
  );
}
