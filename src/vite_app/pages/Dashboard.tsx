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

    </motion.div>
  );
}
