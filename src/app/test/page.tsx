import React from 'react';
import Link from 'next/link';
import { Zap, Activity, Eye, Brain, Compass } from 'lucide-react';

const tests = [
  {
    title: "Energy MX",
    description: "Avalie sua energia e perfil entre Razão, Ação e Emoção em 27 perguntas.",
    href: "/test/energy-mx",
    icon: <Activity size={24} />,
    color: "bg-orange-500",
  },
  {
    title: "Vision MX",
    description: "Descubra com qual dos 4 arquétipos (Alien, Robô, Mamífero, Tubarão) você mais se identifica.",
    href: "/test/vision-mx",
    icon: <Eye size={24} />,
    color: "bg-blue-500",
  },
  {
    title: "Power MX",
    description: "Avaliação profunda de 180 perguntas sobre seu perfil de personalidade central.",
    href: "/test/power-mx",
    icon: <Zap size={24} />,
    color: "bg-indigo-600",
  },
  {
    title: "Personality MX (Perfil)",
    description: "Teste de personalidade com escolha direta entre duas características opostas.",
    href: "/test/personality-mx",
    icon: <Brain size={24} />,
    color: "bg-purple-500",
  },
  {
    title: "Personality MX (Escala)",
    description: "Versão avançada do teste de personalidade utilizando escala de 1 a 10.",
    href: "/test/personality-mx-2",
    icon: <Brain size={24} />,
    color: "bg-fuchsia-500",
  },
  {
    title: "Player MX",
    description: "Avalie seu comportamento nas três dimensões: Atual, Aparente e Sob pressão.",
    href: "/test/player-mx",
    icon: <Compass size={24} />,
    color: "bg-teal-500",
  }
];

import { createAdminClient } from "@/lib/supabase/server";

export default async function TestDashboard({
  searchParams,
}: {
  searchParams: { candidate_id?: string, t?: string }
}) {
  const candidateId = searchParams.candidate_id || "";
  const allowedTests = searchParams.t ? searchParams.t.split(',') : null;
  
  let completedTests: string[] = [];
  
  if (candidateId) {
    const supabase = createAdminClient();
    const { data: results } = await supabase
      .from('assessment_results')
      .select('energy_mx, vision_mx, personality_mx, player_mx, power_mx')
      .eq('candidate_id', candidateId)
      .order('created_at', { ascending: false })
      .limit(1);
      
    if (results && results.length > 0) {
      const res = results[0];
      if (res.energy_mx) completedTests.push('energy-mx');
      if (res.vision_mx) completedTests.push('vision-mx');
      if (res.personality_mx) {
        completedTests.push('personality-mx');
        completedTests.push('personality-mx-2');
      }
      if (res.player_mx) completedTests.push('player-mx');
      if (res.power_mx) completedTests.push('power-mx');
    }
  }

  const visibleTests = tests.filter(test => {
    if (!allowedTests) return true;
    const testId = test.href.split('/').pop();
    const normalizedAllowed = allowedTests.map(t => t.replace('_', '-'));
    return testId && normalizedAllowed.includes(testId);
  });
  
  const allCompleted = visibleTests.length > 0 && visibleTests.every(test => {
    const testId = test.href.split('/').pop() || '';
    return completedTests.includes(testId);
  });

  return (
    <div className="min-h-screen bg-[#F8F9FD] text-slate-900 p-6 sm:p-12 font-sans relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none translate-y-1/3 -translate-x-1/3" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
             <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
               <Zap size={24} fill="currentColor" />
             </div>
             <div>
               <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Portal do Candidato</h1>
               <p className="text-slate-500 font-medium mt-1">
                 {allCompleted 
                   ? "Parabéns, você concluiu todos os testes disponíveis!"
                   : "Selecione um dos testes abaixo para iniciar sua avaliação."}
               </p>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleTests.map((test, index) => {
            const testId = test.href.split('/').pop() || '';
            const isCompleted = completedTests.includes(testId);
            
            const cardContent = (
              <div className={`border rounded-2xl p-6 h-full transition-all flex flex-col ${isCompleted ? 'bg-emerald-50/50 border-emerald-100 opacity-80 cursor-default' : 'bg-white border-slate-200 hover:shadow-xl hover:shadow-slate-200/50 hover:border-indigo-300 group cursor-pointer'}`}>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white mb-6 shadow-md ${isCompleted ? 'bg-emerald-500' : test.color} ${!isCompleted && 'group-hover:scale-110 transition-transform'}`}>
                  {test.icon}
                </div>
                <h3 className={`text-xl font-bold mb-2 ${isCompleted ? 'text-emerald-900' : 'text-slate-800'}`}>{test.title}</h3>
                <p className={`text-sm leading-relaxed flex-grow ${isCompleted ? 'text-emerald-700/70' : 'text-slate-500'}`}>{test.description}</p>
                <div className={`mt-6 font-semibold text-sm flex items-center ${isCompleted ? 'text-emerald-600' : 'text-indigo-600 group-hover:translate-x-1 transition-transform'}`}>
                  {isCompleted ? '✔ Concluído' : 'Acessar Teste \u2192'}
                </div>
              </div>
            );
            
            if (isCompleted) {
              return <div key={index}>{cardContent}</div>;
            }
            const tParam = allowedTests ? `&t=${allowedTests.join(',')}` : '';
            return (
              <Link key={index} href={test.href !== '#' && candidateId ? `${test.href}?candidate_id=${candidateId}${tParam}` : test.href}>
                {cardContent}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
