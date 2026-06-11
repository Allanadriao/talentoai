import React from 'react';
import { motion } from 'motion/react';
import { Target, Mail, Phone, Calendar, Link2, Eye, Trash2, Video } from 'lucide-react';
import { Candidate } from '../../types';

interface CandidateCardsMobileProps {
  candidates: Candidate[];
  deleteCandidate: (id: string) => void;
  setCandidateToShare: (c: Candidate | 'public' | null) => void;
  setCandidateToSchedule: (c: Candidate) => void;
  setShowInterviewModal: (show: boolean) => void;
  setSelectedCandidate: (c: Candidate) => void;
  setActiveView: (view: any) => void;
}

export function CandidateCardsMobile({
  candidates,
  deleteCandidate,
  setCandidateToShare,
  setCandidateToSchedule,
  setShowInterviewModal,
  setSelectedCandidate,
  setActiveView
}: CandidateCardsMobileProps) {

  return (
    <div className="grid grid-cols-1 gap-4 sm:hidden">
      {candidates.map((c, index) => (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          key={c.id} 
          className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-4"
        >
          {/* Cabeçalho do Card */}
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-700 font-black text-lg border border-indigo-200 shadow-sm">
                {c.name.charAt(0)}
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-base">{c.name}</h4>
                <p className="text-xs text-slate-500 font-medium">{c.role || 'Candidato'}</p>
              </div>
            </div>
            {/* Status Badge */}
            <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${
              c.status === 'Completo' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
              c.status === 'Em Progresso' ? 'bg-orange-50 text-orange-600 border-orange-100' :
              'bg-slate-50 text-slate-400 border-slate-100'
            }`}>
              {c.status === 'Completo' && c.progress < 5 ? 'Concluído (Parcial)' : c.status}
            </span>
          </div>

          {/* Contatos */}
          <div className="flex flex-col gap-1.5 mt-1">
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <Mail size={14} className="text-slate-400" />
              <span className="truncate">{c.email}</span>
            </div>
            {c.phone && (
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <Phone size={14} className="text-slate-400" />
                <span>{c.phone}</span>
              </div>
            )}
          </div>

          <div className="h-px w-full bg-slate-100"></div>

          {/* Progresso e Score */}
          <div className="grid grid-cols-2 gap-4 items-center">
            {/* Score */}
            <div>
              <p className="text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Match Score</p>
              {c.match_score ? (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-[10px]">
                    {c.match_score}%
                  </div>
                  <div className="flex-grow h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500" style={{ width: `${c.match_score}%` }} />
                  </div>
                </div>
              ) : (
                <span className="text-xs text-slate-300 font-bold">N/A</span>
              )}
            </div>

            {/* Progresso */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Progresso</span>
                <span className={`text-[10px] font-bold ${c.status === 'Completo' ? 'text-emerald-600' : 'text-indigo-600'}`}>
                  {c.progress}/5 {c.status === 'Completo' && c.progress < 5 && <span className="text-emerald-500 ml-0.5">(Designados)</span>}
                </span>
              </div>
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden flex gap-0.5">
                {[1, 2, 3, 4, 5].map(step => (
                  <div 
                    key={step}
                    className={`h-full flex-grow transition-all duration-500 ${
                      step <= c.progress 
                        ? (c.status === 'Completo' ? 'bg-emerald-500' : 'bg-indigo-500') 
                        : 'bg-slate-200'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Entrevista Info (Se houver) */}
          {c.interview_date && (
            <div className="bg-indigo-50/50 p-3 rounded-xl border border-indigo-100/50 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                <Calendar size={14} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-indigo-400 uppercase">Entrevista Agendada</p>
                <p className="text-xs font-semibold text-indigo-900">
                  {new Date(c.interview_date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          )}

          {/* Botões de Ação */}
          <div className="grid grid-cols-4 gap-2 mt-2">
            <button 
              onClick={() => setCandidateToShare(c)}
              className="flex items-center justify-center p-3 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl transition-colors border border-slate-100"
              aria-label="Gerar Link"
            >
              <Link2 size={18} />
            </button>
            <button 
              onClick={() => { setCandidateToSchedule(c); setShowInterviewModal(true); }}
              className="flex items-center justify-center p-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-xl transition-colors border border-indigo-100"
              aria-label="Agendar Entrevista"
            >
              <Video size={18} />
            </button>
            <button 
              onClick={() => { setSelectedCandidate(c); setActiveView('reports'); }}
              disabled={c.progress === 0}
              className="flex items-center justify-center p-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-emerald-100"
              aria-label="Ver Relatório"
            >
              <Eye size={18} />
            </button>
            <button 
              onClick={() => {
                if(window.confirm('Tem certeza que deseja excluir este candidato?')) {
                  deleteCandidate(c.id);
                }
              }}
              className="flex items-center justify-center p-3 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl transition-colors border border-rose-100"
              aria-label="Excluir"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
