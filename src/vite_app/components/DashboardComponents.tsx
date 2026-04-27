import React from 'react';
import { ArrowUpRight, Clock, FileText, ChevronRight, Download } from 'lucide-react';
import { motion } from 'motion/react';

export function StatCard({ label, value, trend, icon: Icon, color, bg }: any) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-start justify-between">
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{label}</p>
        <div className="flex items-baseline gap-2">
          <h4 className="text-2xl font-bold">{value}</h4>
          {trend && <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-0.5"><ArrowUpRight size={10} /> {trend} vs mês anterior</span>}
        </div>
      </div>
      <div className={`w-12 h-12 ${bg} ${color} rounded-2xl flex items-center justify-center`}>
        <Icon size={24} />
      </div>
    </div>
  );
}

export function AssessmentCard({ title, desc, time, questions, color, icon: Icon, onStart }: any) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
      <div className={`w-12 h-12 ${color} text-white rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-current/20`}>
        <Icon size={24} />
      </div>
      <h4 className="font-bold mb-1">{title}</h4>
      <p className="text-[10px] text-slate-400 font-medium mb-4 leading-relaxed">{desc}</p>
      <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 mb-6">
        <span className="flex items-center gap-1"><Clock size={12} /> {time}</span>
        <span className="flex items-center gap-1"><FileText size={12} /> {questions} perguntas</span>
      </div>
      <button 
        onClick={onStart}
        className="w-full py-2 bg-slate-50 text-slate-900 text-[10px] font-bold rounded-lg border border-slate-100 hover:bg-slate-900 hover:text-white transition-all flex items-center justify-center gap-2"
      >
        Acessar Formulário <ChevronRight size={12} />
      </button>
    </div>
  );
}

export function AssessmentCardLarge({ title, desc, time, questions, color, icon: Icon, onStart }: any) {
  return (
    <div className="bg-white p-6 lg:p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
      <div className="flex items-start gap-4 lg:gap-6 mb-6 lg:mb-8">
        <div className={`w-12 h-12 lg:w-16 lg:h-16 ${color} text-white rounded-2xl flex items-center justify-center shadow-lg shadow-current/20 flex-shrink-0`}>
          <Icon size={24} className="lg:hidden" />
          <Icon size={32} className="hidden lg:block" />
        </div>
        <div>
          <h4 className="text-lg lg:text-xl font-bold mb-1 lg:mb-2">{title}</h4>
          <p className="text-xs lg:text-sm text-slate-400 leading-relaxed">{desc}</p>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4 lg:gap-6 text-[10px] lg:text-xs font-bold text-slate-400">
          <span className="flex items-center gap-1.5"><Clock size={16} /> {time}</span>
          <span className="flex items-center gap-1.5"><FileText size={16} /> {questions} perguntas</span>
        </div>
        <button 
          onClick={onStart}
          className={`w-full sm:w-auto px-6 lg:px-8 py-2 lg:py-3 rounded-xl text-white font-bold text-xs lg:text-sm flex items-center justify-center gap-2 transition-all hover:opacity-90 ${color}`}
        >
          Acessar <ArrowUpRight size={18} />
        </button>
      </div>
    </div>
  );
}

export function ProfileBar({ label, value, color }: any) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-[10px] font-bold">
        <span className="text-slate-900">{label}</span>
        <span className="text-slate-400">{value}%</span>
      </div>
      <div className="w-full h-2 bg-slate-50 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-full ${color}`} 
        />
      </div>
    </div>
  );
}

export function PowerItem({ rank, label, desc, value, color }: any) {
  return (
    <div className="flex items-center gap-4">
      <div className={`w-8 h-8 rounded-full ${color} text-white flex items-center justify-center text-xs font-bold flex-shrink-0`}>
        {rank}
      </div>
      <div className="flex-grow">
        <div className="flex items-center justify-between mb-1">
          <div>
            <p className="text-xs font-bold">{label}</p>
            <p className="text-[10px] text-slate-400 font-medium">{desc}</p>
          </div>
          <span className={`text-[10px] font-bold ${color.replace('bg-', 'text-')}`}>{value}%</span>
        </div>
        <div className="w-full h-1.5 bg-slate-50 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${value}%` }}
            transition={{ duration: 1, delay: rank * 0.2 }}
            className={`h-full ${color}`} 
          />
        </div>
      </div>
    </div>
  );
}

export function ReportActionCard({ title, desc, icon: Icon, color }: any) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex items-center justify-between group">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 bg-slate-50 ${color} rounded-2xl flex items-center justify-center`}>
          <Icon size={24} />
        </div>
        <div>
          <h4 className="text-sm font-bold">{title}</h4>
          <p className="text-[10px] text-slate-400 font-medium">{desc}</p>
        </div>
      </div>
      <button className="p-2 bg-slate-50 text-slate-900 rounded-lg border border-slate-100 hover:bg-slate-900 hover:text-white transition-all">
        <Download size={18} />
      </button>
    </div>
  );
}
