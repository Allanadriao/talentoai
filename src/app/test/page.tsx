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

export default function TestDashboard({
  searchParams,
}: {
  searchParams: { candidate_id?: string, t?: string }
}) {
  const candidateId = searchParams.candidate_id || "";

  const allowedTests = searchParams.t ? searchParams.t.split(',') : null;
  const visibleTests = tests.filter(test => {
    if (!allowedTests) return true;
    
    // extrair o id do teste a partir do href (ex: '/test/energy-mx' -> 'energy-mx')
    const testId = test.href.split('/').pop();
    // mapeamento flexível para garantir compatibilidade ('energy_mx' ou 'energy-mx')
    const normalizedAllowed = allowedTests.map(t => t.replace('_', '-'));
    return testId && normalizedAllowed.includes(testId);
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
               <p className="text-slate-500 font-medium mt-1">Selecione um dos testes abaixo para iniciar sua avaliação</p>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleTests.map((test, index) => (
            <Link key={index} href={test.href !== '#' && candidateId ? `${test.href}?candidate_id=${candidateId}` : test.href}>
              <div className="bg-white border border-slate-200 rounded-2xl p-6 h-full hover:shadow-xl hover:shadow-slate-200/50 hover:border-indigo-300 transition-all group flex flex-col cursor-pointer">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white mb-6 shadow-md ${test.color} group-hover:scale-110 transition-transform`}>
                  {test.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">{test.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed flex-grow">{test.description}</p>
                <div className="mt-6 flex items-center text-indigo-600 font-semibold text-sm group-hover:translate-x-1 transition-transform">
                  Acessar Teste &rarr;
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
