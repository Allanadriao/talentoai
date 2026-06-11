import React from 'react';
import { motion } from 'motion/react';
import { Calendar, Link2, Eye, Trash2, Video } from 'lucide-react';
import { Candidate } from '../../types';

interface CandidateTableDesktopProps {
  candidates: Candidate[];
  deleteCandidate: (id: string) => void;
  setCandidateToShare: (c: Candidate | 'public' | null) => void;
  setCandidateToSchedule: (c: Candidate) => void;
  setShowInterviewModal: (show: boolean) => void;
  setSelectedCandidate: (c: Candidate) => void;
  setActiveView: (view: any) => void;
}

export function CandidateTableDesktop({
  candidates,
  deleteCandidate,
  setCandidateToShare,
  setCandidateToSchedule,
  setShowInterviewModal,
  setSelectedCandidate,
  setActiveView
}: CandidateTableDesktopProps) {

  return (
    <div className="hidden sm:block overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-100">
            <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50 rounded-tl-2xl">Candidato</th>
            <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50">Status</th>
            <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50">Match Score</th>
            <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50">Progresso</th>
            <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50 rounded-tr-2xl">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {candidates.map((c, index) => (
            <motion.tr 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              key={c.id} 
              className="hover:bg-slate-50/50 transition-colors group"
            >
              <td className="px-8 py-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-700 font-black text-lg shadow-sm border border-indigo-200/50 group-hover:scale-105 transition-transform">
                    {c.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-slate-800 text-base">{c.name}</div>
                    <div className="text-sm text-slate-500 font-medium">{c.email}</div>
                    {c.interview_date && (
                      <div className="text-xs text-indigo-600 mt-1 flex items-center gap-1 bg-indigo-50 inline-flex px-2 py-0.5 rounded-full font-semibold border border-indigo-100">
                        <Calendar size={12} /> Entrevista: {new Date(c.interview_date).toLocaleDateString('pt-BR')}
                      </div>
                    )}
                  </div>
                </div>
              </td>
              <td className="px-8 py-5">
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${
                  c.status === 'Completo' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                  c.status === 'Em Progresso' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                  'bg-slate-50 text-slate-400 border-slate-100'
                }`}>
                  {c.status === 'Completo' && c.progress < 5 ? 'Concluído (Parcial)' : c.status}
                </span>
              </td>
              <td className="px-8 py-5">
                {c.match_score ? (
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-[10px] border border-indigo-100">
                      {c.match_score}%
                    </div>
                    <div className="flex-grow w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
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
                    <span className={c.status === 'Completo' ? 'text-emerald-600' : 'text-indigo-600'}>
                      {Math.round((c.progress / 5) * 100)}%
                    </span>
                    <span className="text-slate-400">
                      {c.progress}/5 {c.status === 'Completo' && c.progress < 5 && <span className="text-emerald-500 ml-1">(Designados)</span>}
                    </span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden flex gap-0.5">
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
              </td>
              <td className="px-8 py-5">
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => setCandidateToShare(c)}
                    className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors border border-transparent hover:border-indigo-100"
                    title="Gerar Link"
                  >
                    <Link2 size={16} />
                  </button>
                  <button 
                    onClick={() => { setCandidateToSchedule(c); setShowInterviewModal(true); }}
                    className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors border border-transparent hover:border-indigo-100"
                    title="Agendar Entrevista"
                  >
                    <Video size={16} />
                  </button>
                  <button 
                    onClick={() => { setSelectedCandidate(c); setActiveView('reports'); }}
                    disabled={c.progress === 0}
                    className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-transparent hover:border-emerald-100"
                    title="Ver Relatório"
                  >
                    <Eye size={16} />
                  </button>
                  <button 
                    onClick={() => {
                      if(window.confirm('Tem certeza que deseja excluir este candidato?')) {
                        deleteCandidate(c.id);
                      }
                    }}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-100"
                    title="Excluir Candidato"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
      {candidates.length === 0 && (
        <div className="text-center py-12 text-slate-400">
          Nenhum candidato encontrado.
        </div>
      )}
    </div>
  );
}
