import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { FileText, BarChart3, Users, ArrowLeft, Target, Download, Loader2 } from 'lucide-react';
import { ReportActionCard, ProfileBar, PowerItem } from '../components/DashboardComponents';
import { Candidate } from '../types';
import { supabase } from '../lib/supabase';

interface ReportsProps {
  selectedCandidate: Candidate | null;
  setSelectedCandidate: (c: Candidate | null) => void;
  setActiveView: (view: any) => void;
}

export default function Reports({ selectedCandidate, setSelectedCandidate, setActiveView }: ReportsProps) {
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedCandidate) {
      setLoading(true);
      supabase
        .from('assessment_results')
        .select('*')
        .eq('candidate_id', selectedCandidate.id)
        .single()
        .then(({ data, error }) => {
          if (!error && data) {
            setResults(data);
          } else {
            setResults(null);
          }
          setLoading(false);
        });
    } else {
      setResults(null);
    }
  }, [selectedCandidate]);

  const calculatePercentages = () => {
    if (!results) return null;

    // Vision MX
    const vision = results.vision_mx || {};
    const vAlien = Math.round(((vision.alien || 0) / 25) * 100);
    const vRobo = Math.round(((vision.robo || 0) / 25) * 100);
    const vMamifero = Math.round(((vision.mamifero || 0) / 25) * 100);
    const vTubarao = Math.round(((vision.tubarao || 0) / 25) * 100);
    
    const vMax = Math.max(vAlien, vRobo, vMamifero, vTubarao);
    let dominantVision = "Tubarão";
    let dominantVisionColor = "bg-sky-500";
    if (vAlien === vMax) { dominantVision = "Alien"; dominantVisionColor = "bg-purple-500"; }
    if (vRobo === vMax) { dominantVision = "Robô"; dominantVisionColor = "bg-indigo-500"; }
    if (vMamifero === vMax) { dominantVision = "Mamífero"; dominantVisionColor = "bg-emerald-500"; }
    if (vTubarao === vMax) { dominantVision = "Tubarão"; dominantVisionColor = "bg-sky-500"; }

    // Energy MX
    const energy = results.energy_mx || {};
    const eRazao = energy.razao || 0;
    const eAcao = energy.acao || 0;
    const eEmocao = energy.emocao || 0;
    const eTotal = energy.total || (eRazao + eAcao + eEmocao);
    const eMax = 135; // Max possible score

    // Power MX
    const power = results.power_mx || {};
    const powerMap: Record<string, { label: string, desc: string }> = {
      "Tipo 1": { label: "O Perfeccionista", desc: "Responsabilidade e disciplina" },
      "Tipo 2": { label: "O Doador", desc: "Amoroso, generoso, prestativo" },
      "Tipo 3": { label: "O Realizador", desc: "Orientado a metas, ambicioso" },
      "Tipo 4": { label: "O Individualista", desc: "Criativo, sensível" },
      "Tipo 5": { label: "O Investigador", desc: "Estudioso, analítico" },
      "Tipo 6": { label: "O Leal", desc: "Medroso, prudente" },
      "Tipo 7": { label: "O Entusiasta", desc: "Sociável, espontâneo" },
      "Tipo 8": { label: "O Desafiador", desc: "Líder, decidido, protetor" },
      "Tipo 9": { label: "O Pacificador", desc: "Mediador, tolerante, empático" }
    };
    const powerEntries = Object.entries(power).map(([key, val]) => ({
      type: key,
      value: Number(val),
      label: powerMap[key]?.label || key,
      desc: powerMap[key]?.desc || ""
    }));
    powerEntries.sort((a, b) => b.value - a.value);
    const topPower = powerEntries.slice(0, 3);
    const powerColors = ["bg-rose-500", "bg-indigo-500", "bg-sky-500"];

    // Personality MX
    const personality = results.personality_mx || {};
    const pAber = personality.aberto || 0;
    const pFech = personality.fechado || 0;
    const tAberFech = (pAber + pFech) || 11;
    const pctAber = Math.round((pAber / tAberFech) * 100);
    const pctFech = Math.round((pFech / tAberFech) * 100);

    const pTrad = personality.tradicional || 0;
    const pInov = personality.inovador || 0;
    const tTradInov = (pTrad + pInov) || 21;
    const pctTrad = Math.round((pTrad / tTradInov) * 100);
    const pctInov = Math.round((pInov / tTradInov) * 100);

    const pPens = personality.pensador || 0;
    const pSent = personality.sentimento || 0;
    const tPensSent = (pPens + pSent) || 18;
    const pctPens = Math.round((pPens / tPensSent) * 100);
    const pctSent = Math.round((pSent / tPensSent) * 100);

    const pDeci = personality.decisivo || 0;
    const pFlex = personality.flexivel || 0;
    const tDeciFlex = (pDeci + pFlex) || 20;
    const pctDeci = Math.round((pDeci / tDeciFlex) * 100);
    const pctFlex = Math.round((pFlex / tDeciFlex) * 100);

    // Player MX
    const player = results.player_mx || { aparente: {}, atual: {}, pressao: {} };
    const getPlayerPct = (ctx: string, profile: string, total: number) => {
      const val = player[ctx]?.[profile] || 0;
      return Math.round((val / total) * 100);
    };
    // Sum all profiles in each context to get total
    const getContextTotal = (ctx: string) => {
      return (player[ctx]?.expressivo || 0) + (player[ctx]?.pragmatico || 0) + (player[ctx]?.afavel || 0) + (player[ctx]?.analitico || 0) || 1;
    };
    const totalAparente = getContextTotal('aparente');
    const totalAtual = getContextTotal('atual');
    const totalPressao = getContextTotal('pressao');

    return {
      vision: { vAlien, vRobo, vMamifero, vTubarao, dominantVision, dominantVisionColor },
      energy: { eRazao, eAcao, eEmocao, eTotal, eMax },
      power: topPower.map((p, i) => ({ ...p, color: powerColors[i] || "bg-slate-500" })),
      personality: { pctAber, pctFech, pctTrad, pctInov, pctPens, pctSent, pctDeci, pctFlex },
      player: {
        aparente: { 
          expressivo: getPlayerPct('aparente', 'expressivo', totalAparente),
          pragmatico: getPlayerPct('aparente', 'pragmatico', totalAparente),
          afavel: getPlayerPct('aparente', 'afavel', totalAparente),
          analitico: getPlayerPct('aparente', 'analitico', totalAparente)
        },
        atual: { 
          expressivo: getPlayerPct('atual', 'expressivo', totalAtual),
          pragmatico: getPlayerPct('atual', 'pragmatico', totalAtual),
          afavel: getPlayerPct('atual', 'afavel', totalAtual),
          analitico: getPlayerPct('atual', 'analitico', totalAtual)
        },
        pressao: { 
          expressivo: getPlayerPct('pressao', 'expressivo', totalPressao),
          pragmatico: getPlayerPct('pressao', 'pragmatico', totalPressao),
          afavel: getPlayerPct('pressao', 'afavel', totalPressao),
          analitico: getPlayerPct('pressao', 'analitico', totalPressao)
        }
      }
    };
  };

  const data = calculatePercentages();

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
            disabled={!selectedCandidate || !data}
            className="w-full sm:w-auto text-indigo-600 font-bold text-sm flex items-center justify-center gap-2 hover:bg-indigo-50 px-4 py-2 rounded-xl transition-all border border-indigo-100 sm:border-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download size={18} /> Imprimir
          </button>
        </div>
        
        {!selectedCandidate ? (
          <div className="py-20 text-center text-slate-400">
            <FileText size={48} className="mx-auto mb-4 opacity-20" />
            <p>Nenhum candidato selecionado para visualização detalhada.</p>
          </div>
        ) : loading ? (
          <div className="py-20 text-center text-indigo-500 flex flex-col items-center">
            <Loader2 size={48} className="mx-auto mb-4 animate-spin" />
            <p className="text-slate-500 font-medium">Carregando resultados do assessment...</p>
          </div>
        ) : data ? (
          <div className="space-y-12">
            {/* Primeira Linha: Vision, Energy, Power */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Vision MX */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold">Perfil Dominante (Vision MX)</h4>
                  <span className={`${data.vision.dominantVisionColor} text-white text-[10px] font-bold px-2 py-1 rounded-md`}>
                    {data.vision.dominantVision}
                  </span>
                </div>
                <div className="space-y-4">
                  <ProfileBar label="Tubarão" value={data.vision.vTubarao} color="bg-sky-500" />
                  <ProfileBar label="Mamífero" value={data.vision.vMamifero} color="bg-emerald-500" />
                  <ProfileBar label="Robô" value={data.vision.vRobo} color="bg-indigo-500" />
                  <ProfileBar label="Alien" value={data.vision.vAlien} color="bg-purple-500" />
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Perfis baseados na visão de mundo e tomada de decisão.
                </p>
              </div>

              {/* Energy MX */}
              <div className="flex flex-col items-center">
                <h4 className="font-bold w-full mb-8">Energy MX</h4>
                <div className="relative w-40 h-40 mb-8">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="80" cy="80" r="72" stroke="#F1F5F9" strokeWidth="12" fill="transparent" />
                    <circle 
                      cx="80" cy="80" r="72" 
                      stroke="#F59E0B" strokeWidth="12" fill="transparent" 
                      strokeDasharray="452.4" 
                      strokeDashoffset={452.4 - ((data.energy.eTotal / data.energy.eMax) * 452.4)} 
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold">{data.energy.eTotal}</span>
                    <span className="text-xs text-slate-400 font-bold">/ {data.energy.eMax}</span>
                  </div>
                </div>
                <div className="w-full space-y-4">
                  <ProfileBar label="Razão" value={Math.round((data.energy.eRazao/45)*100)} color="bg-indigo-500" />
                  <ProfileBar label="Ação" value={Math.round((data.energy.eAcao/45)*100)} color="bg-orange-500" />
                  <ProfileBar label="Emoção" value={Math.round((data.energy.eEmocao/45)*100)} color="bg-rose-500" />
                </div>
              </div>

              {/* Power MX */}
              <div>
                <h4 className="font-bold mb-8">Power MX</h4>
                <div className="space-y-8">
                  {data.power.map((item: any, idx: number) => (
                    <PowerItem 
                      key={item.type} 
                      rank={idx + 1} 
                      label={item.label} 
                      desc={item.desc} 
                      value={item.value} 
                      color={item.color} 
                    />
                  ))}
                  {data.power.length === 0 && (
                    <p className="text-slate-400 text-sm">Nenhum resultado registrado.</p>
                  )}
                </div>
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* Segunda Linha: Personality e Player */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Personality MX */}
              <div>
                <h4 className="font-bold mb-6">Personality MX (MBTI)</h4>
                <div className="space-y-8 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <PersonalityDichotomy label1="Aberto (E)" val1={data.personality.pctAber} label2="Fechado (I)" val2={data.personality.pctFech} color="bg-rose-500" />
                  <PersonalityDichotomy label1="Inovador (N)" val1={data.personality.pctInov} label2="Tradicional (S)" val2={data.personality.pctTrad} color="bg-purple-500" />
                  <PersonalityDichotomy label1="Pensador (T)" val1={data.personality.pctPens} label2="Sentimento (F)" val2={data.personality.pctSent} color="bg-indigo-500" />
                  <PersonalityDichotomy label1="Decisivo (J)" val1={data.personality.pctDeci} label2="Flexível (P)" val2={data.personality.pctFlex} color="bg-sky-500" />
                </div>
              </div>

              {/* Player MX */}
              <div>
                <h4 className="font-bold mb-6">Player MX (Comportamento)</h4>
                <div className="bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden">
                  <div className="grid grid-cols-4 bg-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-wider p-3">
                    <div>Perfil</div>
                    <div className="text-center">Aparente</div>
                    <div className="text-center">Atual</div>
                    <div className="text-center">Sob Pressão</div>
                  </div>
                  <div className="divide-y divide-slate-100">
                    <PlayerRow label="Expressivo" color="text-rose-500" bg="bg-rose-100" dataCtx={data.player} profile="expressivo" />
                    <PlayerRow label="Pragmático" color="text-orange-500" bg="bg-orange-100" dataCtx={data.player} profile="pragmatico" />
                    <PlayerRow label="Afável" color="text-emerald-500" bg="bg-emerald-100" dataCtx={data.player} profile="afavel" />
                    <PlayerRow label="Analítico" color="text-indigo-500" bg="bg-indigo-100" dataCtx={data.player} profile="analitico" />
                  </div>
                </div>
              </div>
            </div>

          </div>
        ) : (
          <div className="py-20 text-center text-slate-400">
            <FileText size={48} className="mx-auto mb-4 opacity-20" />
            <p>Este candidato ainda não possui resultados de assessment registrados.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// Components auxiliares para os novos gráficos
function PersonalityDichotomy({ label1, val1, label2, val2, color }: { label1: string, val1: number, label2: string, val2: number, color: string }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs font-bold text-slate-600">
        <span className={val1 >= val2 ? color.replace('bg-', 'text-') : 'text-slate-400'}>{label1} {val1}%</span>
        <span className={val2 > val1 ? color.replace('bg-', 'text-') : 'text-slate-400'}>{val2}% {label2}</span>
      </div>
      <div className="w-full h-2 bg-slate-200 rounded-full flex overflow-hidden">
        <div className={`h-full ${val1 >= val2 ? color : 'bg-slate-300'}`} style={{ width: `${val1}%` }} />
        <div className={`h-full ${val2 > val1 ? color : 'bg-slate-300'}`} style={{ width: `${val2}%` }} />
      </div>
    </div>
  );
}

function PlayerRow({ label, color, bg, dataCtx, profile }: { label: string, color: string, bg: string, dataCtx: any, profile: string }) {
  const aparente = dataCtx.aparente[profile];
  const atual = dataCtx.atual[profile];
  const pressao = dataCtx.pressao[profile];
  
  return (
    <div className="grid grid-cols-4 items-center p-4 hover:bg-white transition-colors">
      <div className={`font-bold text-xs ${color}`}>{label}</div>
      <div className="text-center">
        <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${aparente >= 30 ? bg + ' ' + color : 'text-slate-400'}`}>
          {aparente}%
        </span>
      </div>
      <div className="text-center">
        <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${atual >= 30 ? bg + ' ' + color : 'text-slate-400'}`}>
          {atual}%
        </span>
      </div>
      <div className="text-center">
        <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${pressao >= 30 ? bg + ' ' + color : 'text-slate-400'}`}>
          {pressao}%
        </span>
      </div>
    </div>
  );
}

