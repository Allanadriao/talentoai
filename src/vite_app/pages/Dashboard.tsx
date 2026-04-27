import React from 'react';
import { motion } from 'motion/react';
import { Users, CheckCircle2, Clock, Calendar, Plus, ChevronRight, ArrowUpRight } from 'lucide-react';
import { StatCard, AssessmentCard, ProfileBar, PowerItem } from '../components/DashboardComponents';
import { Candidate, Interview } from '../types';

interface DashboardProps {
  candidates: Candidate[];
  interviews: Interview[];
  setShowForm: (show: boolean) => void;
  setActiveView: (view: any) => void;
  assessmentCards: any[];
}

export default function Dashboard({ candidates, interviews, setShowForm, setActiveView, assessmentCards }: DashboardProps) {
  return (
    <motion.div 
      key="dashboard"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-8"
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total de Candidatos" value={candidates.length} trend="" icon={Users} color="text-indigo-600" bg="bg-indigo-50" />
        <StatCard label="Assessments Completos" value={candidates.filter(c => c.status === 'Completo').length} trend="" icon={CheckCircle2} color="text-emerald-600" bg="bg-emerald-50" />
        <StatCard label="Em Progresso" value={candidates.filter(c => c.status === 'Em Progresso').length} trend="" icon={Clock} color="text-orange-600" bg="bg-orange-50" />
        <StatCard label="Entrevistas" value={interviews.length} trend="" icon={Calendar} color="text-sky-600" bg="bg-sky-50" />
      </div>

      {/* Upcoming Interviews Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold">Próximas Entrevistas</h3>
          <button 
            onClick={() => setActiveView('interviews')}
            className="text-indigo-600 text-sm font-bold hover:underline"
          >
            Ver Todas
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {interviews.slice(0, 3).map(interview => (
            <div key={interview.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-all cursor-pointer" onClick={() => setActiveView('interviews')}>
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-bold text-sm">
                {interview.candidate_name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-grow">
                <h4 className="font-bold text-sm">{interview.candidate_name}</h4>
                <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold">
                  <Calendar size={10} /> {new Date(interview.date).toLocaleDateString('pt-BR')}
                  <Clock size={10} /> {interview.time}
                </div>
              </div>
              <ChevronRight size={16} className="text-slate-300" />
            </div>
          ))}
          {interviews.length === 0 && (
            <div className="col-span-full py-8 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
              <p className="text-xs text-slate-400 font-medium">Nenhuma entrevista agendada para os próximos dias.</p>
            </div>
          )}
        </div>
      </section>

      {/* Assessments Section */}
      <section>
        <div className="mb-6">
          <h3 className="text-lg font-bold">Assessments Disponíveis</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {assessmentCards.map(card => (
            <AssessmentCard key={card.id} {...card} onStart={() => setShowForm(true)} />
          ))}
        </div>
      </section>

      {/* Quick Reports Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h4 className="font-bold">Perfil Dominante</h4>
            <span className="bg-sky-500 text-white text-[10px] font-bold px-2 py-1 rounded-md">Tubarão</span>
          </div>
          <div className="space-y-4">
            <ProfileBar label="Tubarão" value={44} color="bg-sky-500" />
            <ProfileBar label="Mamífero" value={20} color="bg-emerald-500" />
            <ProfileBar label="Robô" value={28} color="bg-indigo-500" />
            <ProfileBar label="Alien" value={8} color="bg-purple-500" />
          </div>
          <p className="text-xs text-slate-400 mt-6 leading-relaxed">
            Perfil orientado a resultados, competitivo e direto. Foco em conquistas e metas.
          </p>
        </div>

        <div className="lg:col-span-1 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center justify-center">
          <h4 className="font-bold w-full mb-6">Energy MX</h4>
          <div className="relative w-32 h-32 mb-6">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="64" cy="64" r="58" stroke="#F1F5F9" strokeWidth="10" fill="transparent" />
              <circle cx="64" cy="64" r="58" stroke="#F59E0B" strokeWidth="10" fill="transparent" strokeDasharray="364.4" strokeDashoffset="80" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold">115</span>
              <span className="text-[10px] text-slate-400 font-bold">/ 150</span>
            </div>
          </div>
          <div className="w-full space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">Razão</span>
              <span className="font-bold">40</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 w-[80%]" />
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <h4 className="font-bold mb-6">Power MX</h4>
          <div className="space-y-6">
            <PowerItem rank={1} label="Realizador" desc="Orientado a metas" value={85} color="bg-rose-500" />
            <PowerItem rank={2} label="Desafiador" desc="Líder e decidido" value={80} color="bg-indigo-500" />
            <PowerItem rank={3} label="Perfeccionista" desc="Responsabilidade e disciplina" value={75} color="bg-sky-500" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
