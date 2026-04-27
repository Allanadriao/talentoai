import React from 'react';
import { motion } from 'motion/react';
import { Calendar, Trash2, MapPin } from 'lucide-react';
import { Interview } from '../types';

interface InterviewsProps {
  interviews: Interview[];
  deleteInterview: (id: string) => void;
  setActiveView: (view: any) => void;
}

export default function Interviews({ interviews, deleteInterview, setActiveView }: InterviewsProps) {
  return (
    <motion.div 
      key="interviews"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {interviews.length === 0 ? (
          <div className="col-span-full bg-white p-12 rounded-3xl border border-slate-100 shadow-sm text-center space-y-4">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mx-auto">
              <Calendar size={32} />
            </div>
            <div>
              <h3 className="text-lg font-bold">Nenhuma entrevista agendada</h3>
              <p className="text-sm text-slate-400">Agende entrevistas diretamente na aba de Candidatos.</p>
            </div>
            <button 
              onClick={() => setActiveView('candidates')}
              className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl text-sm hover:bg-indigo-700 transition-all"
            >
              Ver Candidatos
            </button>
          </div>
        ) : (
          interviews.map(interview => (
            <div key={interview.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6 hover:shadow-md transition-all">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-bold text-xs">
                    {interview.candidate_name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">{interview.candidate_name}</h4>
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Entrevista Técnica</p>
                  </div>
                </div>
                <button 
                  onClick={() => deleteInterview(interview.id)}
                  className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-xs text-slate-600">
                  <Calendar size={14} className="text-slate-400" />
                  <span>{new Date(interview.date).toLocaleDateString('pt-BR')} às {interview.time}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-600">
                  <MapPin size={14} className="text-slate-400" />
                  <span className="truncate">{interview.location}</span>
                </div>
              </div>

              {interview.notes && (
                <div className="p-3 bg-slate-50 rounded-xl">
                  <p className="text-[10px] text-slate-500 italic leading-relaxed">"{interview.notes}"</p>
                </div>
              )}

              <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                <span className="px-2 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-bold rounded-md">
                  {interview.status}
                </span>
                <button className="text-indigo-600 font-bold text-[10px] hover:underline">
                  Entrar na Sala
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
}
