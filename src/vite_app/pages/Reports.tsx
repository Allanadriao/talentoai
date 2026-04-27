import React from 'react';
import { motion } from 'motion/react';
import { FileText, BarChart3, Users, ArrowLeft, Target, Download } from 'lucide-react';
import { ReportActionCard, ProfileBar, PowerItem } from '../components/DashboardComponents';
import { Candidate } from '../types';

interface ReportsProps {
  selectedCandidate: Candidate | null;
  setSelectedCandidate: (c: Candidate | null) => void;
  setActiveView: (view: any) => void;
}

export default function Reports({ selectedCandidate, setSelectedCandidate, setActiveView }: ReportsProps) {
  return (
    <motion.div 
      key="reports"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ReportActionCard title="Relatório Individual" desc="PDF detalhado por candidato" icon={FileText} color="text-indigo-600" />
        <ReportActionCard title="Relatório Comparativo" desc="Compare múltiplos candidatos" icon={BarChart3} color="text-emerald-600" />
        <ReportActionCard title="Análise de Equipe" desc="Distribuição de perfis" icon={Users} color="text-purple-600" />
      </div>

      <div className="bg-white p-4 lg:p-8 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
            {selectedCandidate && (
              <button 
                onClick={() => {
                  setSelectedCandidate(null);
                  setActiveView('candidates');
                }}
                className="p-2 hover:bg-slate-50 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
                title="Voltar para Lista"
              >
                <ArrowLeft size={20} />
              </button>
            )}
            <div>
              <h3 className="text-lg lg:text-xl font-bold">
                {selectedCandidate ? `Análise: ${selectedCandidate.name}` : 'Selecione um candidato'}
              </h3>
              {selectedCandidate?.match_score && (
                <div className="mt-1 flex items-center gap-2 bg-indigo-50 px-2 py-0.5 rounded-full w-fit">
                  <Target size={12} className="text-indigo-600" />
                  <span className="text-[10px] font-bold text-indigo-600">{selectedCandidate.match_score}% Match</span>
                </div>
              )}
            </div>
          </div>
          <button 
            onClick={() => window.print()}
            className="w-full sm:w-auto text-indigo-600 font-bold text-sm flex items-center justify-center gap-2 hover:bg-indigo-50 px-4 py-2 rounded-xl transition-all border border-indigo-100 sm:border-none"
          >
            <Download size={18} /> Imprimir
          </button>
        </div>
        
        {selectedCandidate ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="font-bold">Perfil Dominante</h4>
                <span className="bg-sky-500 text-white text-[10px] font-bold px-2 py-1 rounded-md">Tubarão</span>
              </div>
              <div className="space-y-4">
                <ProfileBar label="Tubarão" value={44} color="bg-sky-500" />
                <ProfileBar label="Mamífero" value={20} color="bg-emerald-500" />
                <ProfileBar label="Robô" value={28} color="bg-indigo-500" />
                <ProfileBar label="Alien" value={8} color="bg-purple-500" />
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Perfil orientado a resultados, competitivo e direto. Foco em conquistas e metas.
              </p>
            </div>

            <div className="flex flex-col items-center">
              <h4 className="font-bold w-full mb-8">Energy MX</h4>
              <div className="relative w-40 h-40 mb-8">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="80" cy="80" r="72" stroke="#F1F5F9" strokeWidth="12" fill="transparent" />
                  <circle cx="80" cy="80" r="72" stroke="#F59E0B" strokeWidth="12" fill="transparent" strokeDasharray="452.4" strokeDashoffset="100" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold">115</span>
                  <span className="text-xs text-slate-400 font-bold">/ 150</span>
                </div>
              </div>
              <div className="w-full space-y-4">
                <ProfileBar label="Razão" value={40} color="bg-indigo-500" />
                <ProfileBar label="Ação" value={39} color="bg-orange-500" />
                <ProfileBar label="Emoção" value={36} color="bg-rose-500" />
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-8">Power MX</h4>
              <div className="space-y-8">
                <PowerItem rank={1} label="Realizador" desc="Orientado a metas" value={85} color="bg-rose-500" />
                <PowerItem rank={2} label="Desafiador" desc="Líder e decidido" value={80} color="bg-indigo-500" />
                <PowerItem rank={3} label="Perfeccionista" desc="Responsabilidade e disciplina" value={75} color="bg-sky-500" />
              </div>
            </div>
          </div>
        ) : (
          <div className="py-20 text-center text-slate-400">
            <FileText size={48} className="mx-auto mb-4 opacity-20" />
            <p>Nenhum candidato selecionado para visualização detalhada.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
