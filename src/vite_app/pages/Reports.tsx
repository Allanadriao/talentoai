import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { FileText, BarChart3, Users, ArrowLeft, Target, Download, Loader2, Sparkles, Brain, Zap, HeartHandshake, Eye } from 'lucide-react';
import { ReportActionCard, ProfileBar } from '../components/DashboardComponents';
import { Candidate } from '../types';
import { supabase } from '../lib/supabase';
import { PROFILE_DESCRIPTIONS, calculateReportData } from '../lib/reportUtils';

import ReactMarkdown from 'react-markdown';

interface ReportsProps {
  selectedCandidate: Candidate | null;
  setSelectedCandidate: (c: Candidate | null) => void;
  setActiveView: (view: any) => void;
}

export default function Reports({ selectedCandidate, setSelectedCandidate, setActiveView }: ReportsProps) {
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [aiReport, setAiReport] = useState<string | null>(null);
  const [generatingAI, setGeneratingAI] = useState(false);

  useEffect(() => {
    if (selectedCandidate) {
      setLoading(true);
      setAiReport(null); // Reset report when candidate changes
      supabase
        .from('assessment_results')
        .select('*')
        .eq('candidate_id', selectedCandidate.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .then(({ data, error }) => {
          if (!error && data && data.length > 0) setResults(data[0]);
          else setResults(null);
          setLoading(false);
        });
    } else {
      setResults(null);
      setAiReport(null);
    }
  }, [selectedCandidate]);

  const data = calculateReportData(results);

  const handleGenerateAI = async () => {
    if (!selectedCandidate || !data) return;
    setGeneratingAI(true);
    try {
      const response = await fetch('/api/ai-synthesis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidateName: selectedCandidate.name,
          role: selectedCandidate.role,
          data: data
        })
      });
      const result = await response.json();
      if (response.ok && result.analysis) {
        setAiReport(result.analysis);
      } else {
        alert(result.error || 'Erro ao gerar análise.');
      }
    } catch (err) {
      alert('Falha na comunicação com o servidor.');
    } finally {
      setGeneratingAI(false);
    }
  };

  return (
    <motion.div key="reports" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 pb-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ReportActionCard title="Relatório Individual" desc="PDF detalhado por candidato" icon={FileText} color="text-indigo-600" onClick={() => window.print()} />
        <ReportActionCard title="Relatório Comparativo" desc="Compare múltiplos candidatos" icon={BarChart3} color="text-emerald-600" onClick={() => window.print()} />
        <ReportActionCard title="Análise de Equipe" desc="Distribuição de perfis" icon={Users} color="text-purple-600" onClick={() => window.print()} />
      </div>

      <div className="bg-white/70 backdrop-blur-xl p-4 lg:p-8 rounded-[2rem] border border-white shadow-xl shadow-slate-200/50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-4">
            {selectedCandidate && (
              <button 
                onClick={() => { setSelectedCandidate(null); setActiveView('candidates'); }}
                className="p-3 bg-white hover:bg-slate-50 shadow-sm border border-slate-100 rounded-full text-slate-500 hover:text-indigo-600 transition-all hover:scale-105"
              >
                <ArrowLeft size={20} />
              </button>
            )}
            <div>
              <h3 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-500 tracking-tight">
                {selectedCandidate ? `Análise Comportamental` : 'Selecione um candidato'}
              </h3>
              {selectedCandidate && (
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-medium text-slate-600">{selectedCandidate.name}</span>
                  {selectedCandidate.match_score && (
                    <span className="flex items-center gap-1 bg-indigo-50 px-2.5 py-1 rounded-full text-[11px] font-bold text-indigo-600 border border-indigo-100 shadow-sm">
                      <Target size={12} /> {selectedCandidate.match_score}% Match
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
          <button 
            onClick={() => window.print()} disabled={!selectedCandidate || !data}
            className="group w-full sm:w-auto bg-slate-900 text-white font-bold text-sm flex items-center justify-center gap-2 px-6 py-3 rounded-2xl transition-all hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download size={18} className="group-hover:-translate-y-0.5 transition-transform" /> Imprimir Relatório
          </button>
        </div>
        
        {!selectedCandidate ? (
          <div className="py-24 text-center text-slate-400 bg-white/50 rounded-3xl border border-slate-100/50">
            <FileText size={48} className="mx-auto mb-4 opacity-20" />
            <p className="font-medium">Nenhum candidato selecionado para visualização detalhada.</p>
          </div>
        ) : loading ? (
          <div className="py-24 text-center text-indigo-500 flex flex-col items-center bg-white/50 rounded-3xl">
            <Loader2 size={48} className="mx-auto mb-4 animate-spin" />
            <p className="font-medium text-slate-500">Mapeando perfil cognitivo do candidato...</p>
          </div>
        ) : data ? (
          <div className="space-y-12">
            
            {/* AI SYNTHESIS CARD */}
            <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-900 p-8 lg:p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-3xl rounded-full group-hover:bg-indigo-500/20 transition-colors duration-700"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 blur-3xl rounded-full group-hover:bg-purple-500/20 transition-colors duration-700"></div>
              
              <div className="relative z-10 flex flex-col gap-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3.5 bg-white/10 backdrop-blur-md text-indigo-300 rounded-2xl border border-white/10 shadow-inner">
                      <Sparkles size={24} className="animate-pulse" />
                    </div>
                    <div>
                      <h4 className="font-black text-2xl text-white tracking-tight flex items-center gap-3">
                        Síntese Comportamental IA
                      </h4>
                      <p className="text-indigo-200/80 text-sm font-medium mt-1">
                        Análise profunda gerada por Inteligência Artificial
                      </p>
                    </div>
                  </div>
                  {!aiReport && (
                    <button
                      onClick={handleGenerateAI}
                      disabled={generatingAI}
                      className="bg-indigo-500 hover:bg-indigo-400 text-white font-bold py-2.5 px-6 rounded-xl shadow-lg transition-all flex items-center gap-2 justify-center disabled:opacity-70 disabled:cursor-wait"
                    >
                      {generatingAI ? (
                        <><Loader2 size={18} className="animate-spin" /> Gerando Análise...</>
                      ) : (
                        <><Brain size={18} /> Gerar Análise Profunda</>
                      )}
                    </button>
                  )}
                </div>
                
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-2xl min-h-[120px]">
                  {aiReport ? (
                    <div className="prose prose-invert prose-indigo max-w-none text-white/90 text-sm md:text-base marker:text-indigo-400">
                      <ReactMarkdown>{aiReport}</ReactMarkdown>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full py-8 text-center text-white/50">
                      <Brain size={48} className="mb-4 opacity-20" />
                      <p>Clique no botão acima para acionar a OpenAI e gerar o laudo comportamental detalhado deste candidato de acordo com os critérios da consultoria.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ROW 1: ENERGY MX & VISION MX */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* ENERGY MX CARD */}
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-100/50 to-rose-100/50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-500"></div>
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-2.5 bg-orange-50 text-orange-600 rounded-xl"><Zap size={20} /></div>
                  <h4 className="font-black text-xl text-slate-800 tracking-tight">Energy MX</h4>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
                  <div className="relative w-40 h-40 flex-shrink-0">
                    <svg className="w-full h-full transform -rotate-90 filter drop-shadow-md">
                      <circle cx="80" cy="80" r="72" stroke="#F1F5F9" strokeWidth="12" fill="transparent" />
                      <circle cx="80" cy="80" r="72" stroke="url(#energy-gradient)" strokeWidth="12" fill="transparent" strokeDasharray="452.4" strokeDashoffset={452.4 - ((data.energy.eTotal / data.energy.eMax) * 452.4)} strokeLinecap="round" className="transition-all duration-1000 ease-out" />
                      <defs>
                        <linearGradient id="energy-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#F59E0B" />
                          <stop offset="100%" stopColor="#E11D48" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-black text-slate-800">{data.energy.eTotal}</span>
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Score Total</span>
                    </div>
                  </div>
                  
                  <div className="w-full space-y-5">
                    <ProfileBar label="Razão" value={data.energy.eRazao} widthPct={Math.round((data.energy.eRazao/45)*100)} suffix="" color="bg-indigo-500" />
                    <ProfileBar label="Ação" value={data.energy.eAcao} widthPct={Math.round((data.energy.eAcao/45)*100)} suffix="" color="bg-orange-500" />
                    <ProfileBar label="Emoção" value={data.energy.eEmocao} widthPct={Math.round((data.energy.eEmocao/45)*100)} suffix="" color="bg-rose-500" />
                  </div>
                </div>
                
                <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-100/80">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Foco Dominante</span>
                    <span className={`bg-gradient-to-r ${data.energy.dominantEnergyColor} text-white text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider shadow-sm`}>{data.energy.dominantEnergy}</span>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed font-medium">
                    {PROFILE_DESCRIPTIONS.energy[data.energy.dominantEnergy as keyof typeof PROFILE_DESCRIPTIONS.energy]}
                  </p>
                </div>
              </div>

              {/* VISION MX CARD */}
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-sky-100/50 to-indigo-100/50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-500"></div>
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-2.5 bg-sky-50 text-sky-600 rounded-xl"><Eye size={20} /></div>
                  <h4 className="font-black text-xl text-slate-800 tracking-tight">Vision MX</h4>
                </div>

                <div className="space-y-5 mb-8">
                  <ProfileBar label="Tubarão" value={data.vision.vTubarao} color="bg-sky-500" />
                  <ProfileBar label="Mamífero" value={data.vision.vMamifero} color="bg-emerald-500" />
                  <ProfileBar label="Robô" value={data.vision.vRobo} color="bg-indigo-500" />
                  <ProfileBar label="Alien" value={data.vision.vAlien} color="bg-purple-500" />
                </div>
                
                <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-100/80 mt-auto">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Perfil Visão</span>
                    <span className={`bg-gradient-to-r ${data.vision.dominantVisionColor} text-white text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider shadow-sm`}>{data.vision.dominantVision}</span>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed font-medium">
                    {PROFILE_DESCRIPTIONS.vision[data.vision.dominantVision as keyof typeof PROFILE_DESCRIPTIONS.vision]}
                  </p>
                </div>
              </div>

            </div>

            {/* ROW 2: PLAYER MX & PERSONALITY MX */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* PLAYER MX CARD */}
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl"><HeartHandshake size={20} /></div>
                  <h4 className="font-black text-xl text-slate-800 tracking-tight">Player MX</h4>
                </div>

                <div className="bg-slate-50/50 rounded-2xl border border-slate-100 overflow-hidden mb-8">
                  <div className="grid grid-cols-4 bg-slate-100/80 text-[10px] font-black text-slate-500 uppercase tracking-wider p-3">
                    <div>Perfil</div><div className="text-center">Aparente</div><div className="text-center">Atual</div><div className="text-center">Pressão</div>
                  </div>
                  <div className="divide-y divide-slate-100/50">
                    <PlayerRow label="Expressivo" color="text-rose-600" bg="bg-rose-100" dataCtx={data.player} profile="expressivo" />
                    <PlayerRow label="Pragmático" color="text-orange-600" bg="bg-orange-100" dataCtx={data.player} profile="pragmatico" />
                    <PlayerRow label="Afável" color="text-emerald-600" bg="bg-emerald-100" dataCtx={data.player} profile="afavel" />
                    <PlayerRow label="Analítico" color="text-indigo-600" bg="bg-indigo-100" dataCtx={data.player} profile="analitico" />
                  </div>
                </div>

                <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-100/80">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Atuação Dominante</span>
                    <span className={`bg-gradient-to-r ${data.player.dominantPlayerColor} text-white text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider shadow-sm`}>{data.player.dominantPlayer}</span>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed font-medium">
                    {PROFILE_DESCRIPTIONS.player[data.player.dominantPlayer as keyof typeof PROFILE_DESCRIPTIONS.player]}
                  </p>
                </div>
              </div>

              {/* PERSONALITY MX CARD */}
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl"><Brain size={20} /></div>
                  <h4 className="font-black text-xl text-slate-800 tracking-tight">Personality MX (MBTI)</h4>
                </div>

                <div className="space-y-8">
                  <PersonalityDichotomy label1="Aberto (E)" val1={data.personality.pctAber} label2="Fechado (I)" val2={data.personality.pctFech} color="bg-rose-500" desc1="Recarrega energias na interação" desc2="Focado no mundo interno" />
                  <PersonalityDichotomy label1="Inovador (N)" val1={data.personality.pctInov} label2="Tradicional (S)" val2={data.personality.pctTrad} color="bg-purple-500" desc1="Ideias abstratas e futuras" desc2="Fatos práticos e realismo" />
                  <PersonalityDichotomy label1="Pensador (T)" val1={data.personality.pctPens} label2="Sentimento (F)" val2={data.personality.pctSent} color="bg-indigo-500" desc1="Decisões lógicas e imparciais" desc2="Decisões guiadas por valores" />
                  <PersonalityDichotomy label1="Decisivo (J)" val1={data.personality.pctDeci} label2="Flexível (P)" val2={data.personality.pctFlex} color="bg-sky-500" desc1="Organizado e planejado" desc2="Adaptável e espontâneo" />
                </div>
              </div>

            </div>

            {/* POWER MX */}
            <div className="bg-slate-900 p-8 lg:p-10 rounded-[2.5rem] shadow-xl relative overflow-hidden">
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/20 blur-3xl rounded-full"></div>
              <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-rose-500/20 blur-3xl rounded-full"></div>
              
              <div className="relative z-10 flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/10 backdrop-blur-md text-white rounded-xl"><Sparkles size={24} /></div>
                  <h4 className="font-black text-2xl text-white tracking-tight">Power MX (Eneagrama)</h4>
                </div>
                <span className="hidden sm:inline-block px-3 py-1 bg-white/10 text-white/80 text-xs font-bold rounded-full border border-white/10">Todos os 9 Traços</span>
              </div>

              <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6">
                {data.power.map((item: any, idx: number) => (
                  <div key={item.type} className="bg-white/10 backdrop-blur-lg border border-white/10 p-6 rounded-3xl hover:bg-white/15 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-4xl font-black text-white/30 italic">0{idx + 1}</span>
                      <span className={`px-2 py-1 rounded bg-white/10 text-white text-[10px] font-black uppercase tracking-wider whitespace-nowrap`}>{item.value}%</span>
                    </div>
                    <h5 className="font-bold text-lg text-white mb-1">{item.label}</h5>
                    <p className="text-white/60 text-sm font-medium">{item.desc}</p>
                  </div>
                ))}
                {data.power.length === 0 && (
                  <p className="text-white/40 text-sm">Nenhum resultado registrado para Power MX.</p>
                )}
              </div>
            </div>

          </div>
        ) : (
          <div className="py-24 text-center text-slate-400 bg-white/50 rounded-3xl border border-slate-100/50">
            <FileText size={48} className="mx-auto mb-4 opacity-20" />
            <p className="font-medium">Este candidato ainda não possui resultados de assessment registrados.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// Components auxiliares para gráficos
function PersonalityDichotomy({ label1, val1, label2, val2, color, desc1, desc2 }: { label1: string, val1: number, label2: string, val2: number, color: string, desc1: string, desc2: string }) {
  const isL1 = val1 >= val2;
  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between font-bold">
        <div className={`flex flex-col ${isL1 ? color.replace('bg-', 'text-') : 'text-slate-400'}`}>
          <span className="text-xs uppercase tracking-wider">{label1} {val1}%</span>
        </div>
        <div className={`flex flex-col text-right ${!isL1 ? color.replace('bg-', 'text-') : 'text-slate-400'}`}>
          <span className="text-xs uppercase tracking-wider">{val2}% {label2}</span>
        </div>
      </div>
      <div className="w-full h-2.5 bg-slate-100 rounded-full flex overflow-hidden shadow-inner">
        <motion.div initial={{ width: 0 }} animate={{ width: `${val1}%` }} transition={{ duration: 1, ease: "easeOut" }} className={`h-full ${isL1 ? color : 'bg-slate-300'}`} />
        <motion.div initial={{ width: 0 }} animate={{ width: `${val2}%` }} transition={{ duration: 1, ease: "easeOut" }} className={`h-full ${!isL1 ? color : 'bg-slate-300'}`} />
      </div>
      <div className="flex justify-between text-[10px] font-medium text-slate-400">
        <span>{desc1}</span>
        <span>{desc2}</span>
      </div>
    </div>
  );
}

function PlayerRow({ label, color, bg, dataCtx, profile }: { label: string, color: string, bg: string, dataCtx: any, profile: string }) {
  const aparente = dataCtx.aparente[profile];
  const atual = dataCtx.atual[profile];
  const pressao = dataCtx.pressao[profile];
  
  const getBadgeClass = (val: number) => 
    `inline-flex w-10 h-6 items-center justify-center rounded-lg text-xs font-black ${val >= 4 ? bg + ' ' + color + ' shadow-sm' : 'text-slate-400 bg-transparent'}`;

  return (
    <div className="grid grid-cols-4 items-center p-4 hover:bg-white transition-colors group cursor-default">
      <div className={`font-black text-xs uppercase tracking-wider ${color}`}>{label}</div>
      <div className="text-center"><span className={getBadgeClass(aparente)}>{aparente}</span></div>
      <div className="text-center"><span className={getBadgeClass(atual)}>{atual}</span></div>
      <div className="text-center"><span className={getBadgeClass(pressao)}>{pressao}</span></div>
    </div>
  );
}
