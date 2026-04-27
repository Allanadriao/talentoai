import React from 'react';
import { motion } from 'motion/react';
import { FileText, Clock, Users, CheckCircle2 } from 'lucide-react';
import { StatCard, AssessmentCardLarge } from '../components/DashboardComponents';
import { Candidate } from '../types';

interface AssessmentsProps {
  candidates: Candidate[];
  assessmentCards: any[];
  setShowForm: (show: boolean) => void;
}

export default function Assessments({ candidates, assessmentCards, setShowForm }: AssessmentsProps) {
  return (
    <motion.div 
      key="assessments"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total Formulários Preenchidos" value={candidates.reduce((acc, c) => acc + (c.progress || 0), 0)} trend="" icon={FileText} color="text-indigo-600" bg="bg-indigo-50" />
        <StatCard label="Em Andamento" value={candidates.filter(c => c.status === 'Em Progresso').length} trend="" icon={Clock} color="text-orange-600" bg="bg-orange-50" />
        <StatCard label="Candidatos Avaliados" value={candidates.length} trend="" icon={Users} color="text-emerald-600" bg="bg-emerald-50" />
        <StatCard label="Concluídos" value={candidates.filter(c => c.status === 'Completo').length} trend="" icon={CheckCircle2} color="text-sky-600" bg="bg-sky-50" />
      </div>

      <section>
        <h3 className="text-lg font-bold mb-2">Formulários de Assessment</h3>
        <p className="text-sm text-slate-400 mb-6">Cada candidato deve completar os 4 formulários abaixo para um mapeamento comportamental completo.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {assessmentCards.map(card => (
            <AssessmentCardLarge key={card.id} {...card} onStart={() => setShowForm(true)} />
          ))}
        </div>
      </section>
    </motion.div>
  );
}
