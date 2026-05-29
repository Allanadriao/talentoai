import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { FileText, BarChart3, Users, ArrowLeft, Target, Download, Loader2, Sparkles, Brain, Zap, HeartHandshake, Eye } from 'lucide-react';
import { ReportActionCard, ProfileBar, PowerItem } from '../components/DashboardComponents';
import { Candidate } from '../types';
import { supabase } from '../lib/supabase';

// --- Textos e Descrições de Perfis ---
const PROFILE_DESCRIPTIONS = {
  vision: {
    Alien: "Sente-se deslocado ou desconectado do ambiente convencional. Possui criatividade intensa com ideias originais e inovadoras, e uma visão alternativa que questiona normas estabelecidas. Pode precisar de suporte para traduzir ideias para a prática.",
    Robô: "Abordagem extremamente lógica e racional. Segue processos e regras de forma rigorosa, toma decisões focadas em dados e quantificações, possuindo uma comunicação muito direta, objetiva e processual.",
    Mamífero: "Abordagem adaptativa, colaborativa e empática. Sente-se confortável em ambientes dinâmicos, tem forte empatia pelas emoções alheias, valoriza o trabalho em equipe e busca um aprendizado contínuo através de trocas de ideias.",
    Tubarão: "Perfil agressivo, competitivo e orientado para resultados. Apresenta forte ambição, toma decisões rapidamente e é movido por metas tangíveis. Destaca-se em ambientes altamente competitivos e focados em performance."
  } as Record<string, string>,
  player: {
    Pragmático: "Adota uma abordagem prática e orientada para resultados nas interações diárias. Valoriza a eficiência e a aplicabilidade das soluções, focando no que funciona na prática em vez de se perder em teorias ou ideais.",
    Expressivo: "Destaca-se pela habilidade de comunicar emoções e ideias de maneira clara e envolvente. Cria conexões significativas e influencia positivamente o ambiente com sua facilidade de fala e presença.",
    Afável: "Sua natureza é amigável, colaborativa e altamente empática. Acessível e compreensivo, foca na criação e manutenção de um ambiente de trabalho acolhedor e relações interpessoais saudáveis.",
    Analítico: "Abordagem lógica e estruturada. Valoriza dados, fatos concretos e análises profundas. Busca entender as situações em todos os detalhes, sempre embasando as decisões de forma calculada e racional."
  } as Record<string, string>,
  energy: {
    Razão: "Perfil movido pelo intelecto, análise e racionalidade. Prefere examinar detalhadamente os fatos, tomar decisões baseadas em dados e avaliar as situações com espírito crítico e calculista antes de se comprometer. Traz clareza e precisão às tarefas.",
    Ação: "Perfil movido pela execução, ritmo e energia prática. Focado em programar, organizar e realizar. Tem facilidade em terminar o que começa, valoriza o rendimento e a atitude proativa de 'fazer acontecer' de forma dinâmica.",
    Emoção: "Perfil guiado pela intuição, empatia e sensibilidade. Tem forte capacidade de se colocar no lugar do outro, inovar, valorizar os sentimentos e ler o ambiente além das palavras. Traz profundo engajamento e inspiração aos relacionamentos."
  } as Record<string, string>
};

const generateAISynthesis = (candidateName: string, data: any) => {
  if (!data) return null;
  const name = candidateName.split(' ')[0];
  const { vision, energy, player, personality } = data;
  
  const mbti1 = personality.pctAber >= personality.pctFech ? "extrovertida e aberta a novas interações" : "introvertida e focada no mundo interno";
  const mbti2 = personality.pctInov >= personality.pctTrad ? "inovadora e voltada para o futuro" : "tradicional e focada na realidade prática";
  const mbti3 = personality.pctPens >= personality.pctSent ? "lógica, baseada em dados racionais" : "empática, guiada por valores e sentimentos";
  const mbti4 = personality.pctDeci >= personality.pctFlex ? "decisiva, organizada e planejada" : "flexível, espontânea e adaptável";

  return (
    <>
      Com base na análise multidimensional, a Inteligência Artificial TalentoIA mapeou que <strong className="text-white font-bold">{name}</strong> apresenta um perfil cognitivo com forte ancoragem em <strong className="text-white font-bold">{energy.dominantEnergy}</strong> (Energy MX), demonstrando uma abordagem natural predominante para lidar com desafios diários. 
      <br /><br />
      Sua visão estratégica e forma de processar o mundo alinham-se ao arquétipo <strong className="text-white font-bold">{vision.dominantVision}</strong> (Vision MX), o que sugere uma forma singular de absorver informações e projetar cenários sob essa lente. No ambiente corporativo, atua predominantemente de forma <strong className="text-white font-bold">{player.dominantPlayer}</strong> (Player MX), característica que molda a maneira como colabora e entrega resultados sob pressão. 
      <br /><br />
      Na estrutura de personalidade (Personality MX), destaca-se uma natureza {mbti1}, aliada a uma preferência {mbti2}. Toma decisões de forma predominantemente {mbti3} e estrutura sua rotina de maneira {mbti4}. 
      <br /><br />
      <strong className="text-indigo-300 font-bold">Conclusão da IA:</strong> Esse conjunto forma um padrão comportamental altamente específico, capaz de agregar extremo valor em contextos que demandem a combinação destas virtudes comportamentais.
    </>
  );
};

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
        .order('created_at', { ascending: false })
        .limit(1)
        .then(({ data, error }) => {
          if (!error && data && data.length > 0) setResults(data[0]);
          else setResults(null);
          setLoading(false);
        });
    } else {
      setResults(null);
    }
  }, [selectedCandidate]);

  const calculatePercentages = () => {
    if (!results) return null;

    const parsePct = (val: any) => {
      if (!val) return 0;
      if (typeof val === 'string') return parseInt(val.replace('%', '')) || 0;
      if (typeof val === 'number') {
        // If it's a raw number for vision, it might be out of 25. Let's assume if it's <= 25 it's raw.
        // But wait, what if it's a percentage that is 20? 
        // It's safer to always return the number and let the caller divide if needed.
        return val;
      }
      return 0;
    };

    const parseRaw = (val: any) => {
      if (!val) return 0;
      if (typeof val === 'string') return parseInt(val.replace('%', '')) || 0;
      if (typeof val === 'number') return val;
      return 0;
    };

    // Vision MX
    const vision = results.vision_mx || {};
    
    let vAlien = parsePct(vision.Alien ?? vision.alien);
    let vRobo = parsePct(vision.Robô ?? vision.robo);
    let vMamifero = parsePct(vision.Mamífero ?? vision.mamifero);
    let vTubarao = parsePct(vision.Tubarão ?? vision.tubarao);

    // Se vieram como números crus (ex: 10), converte para porcentagem
    if (vAlien <= 25 && vRobo <= 25 && vMamifero <= 25 && vTubarao <= 25 && (vAlien + vRobo + vMamifero + vTubarao) <= 25 && (vAlien + vRobo + vMamifero + vTubarao) > 0) {
      vAlien = Math.round((vAlien / 25) * 100);
      vRobo = Math.round((vRobo / 25) * 100);
      vMamifero = Math.round((vMamifero / 25) * 100);
      vTubarao = Math.round((vTubarao / 25) * 100);
    }
    
    const vMax = Math.max(vAlien, vRobo, vMamifero, vTubarao);
    let dominantVision = "Tubarão";
    let dominantVisionColor = "from-sky-400 to-sky-600";
    if (vAlien === vMax) { dominantVision = "Alien"; dominantVisionColor = "from-purple-400 to-purple-600"; }
    else if (vRobo === vMax) { dominantVision = "Robô"; dominantVisionColor = "from-indigo-400 to-indigo-600"; }
    else if (vMamifero === vMax) { dominantVision = "Mamífero"; dominantVisionColor = "from-emerald-400 to-emerald-600"; }

    // Energy MX
    const energy = results.energy_mx || {};
    const eRazao = parseRaw(energy.Razão ?? energy.razao);
    const eAcao = parseRaw(energy.Ação ?? energy.acao);
    const eEmocao = parseRaw(energy.Emoção ?? energy.emocao);
    const eTotal = parseRaw(energy.Energia ?? energy.total) || (eRazao + eAcao + eEmocao);
    const eMax = 135; 
    
    const eMaxScore = Math.max(eRazao, eAcao, eEmocao);
    let dominantEnergy = "Ação";
    let dominantEnergyColor = "from-orange-400 to-orange-600";
    if (eRazao === eMaxScore) { dominantEnergy = "Razão"; dominantEnergyColor = "from-indigo-400 to-indigo-600"; }
    else if (eEmocao === eMaxScore) { dominantEnergy = "Emoção"; dominantEnergyColor = "from-rose-400 to-rose-600"; }

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
    const powerEntries = Object.entries(power).map(([key, val]) => {
      const typeKey = key.startsWith("Tipo") ? key : `Tipo ${key}`;
      return {
        type: typeKey, value: parseRaw(val), label: powerMap[typeKey]?.label || typeKey, desc: powerMap[typeKey]?.desc || ""
      };
    });
    powerEntries.sort((a, b) => b.value - a.value);
    const topPower = powerEntries;
    const powerColors = ["bg-rose-500", "bg-indigo-500", "bg-sky-500", "bg-emerald-500", "bg-amber-500", "bg-purple-500", "bg-teal-500", "bg-fuchsia-500", "bg-orange-500"];

    // Personality MX
    const personality = results.personality_mx || {};
    const pAber = parseRaw(personality.Aberto ?? personality.aberto); const pFech = parseRaw(personality.Fechado ?? personality.fechado);
    const tAberFech = (pAber + pFech) || 11;
    const pTrad = parseRaw(personality.Tradicional ?? personality.tradicional); const pInov = parseRaw(personality.Inovador ?? personality.inovador);
    const tTradInov = (pTrad + pInov) || 21;
    const pPens = parseRaw(personality.Pensador ?? personality.pensador); const pSent = parseRaw(personality.Sentimento ?? personality.sentimento);
    const tPensSent = (pPens + pSent) || 18;
    const pDeci = parseRaw(personality.Decisivo ?? personality.decisivo); const pFlex = parseRaw(personality.Flexível ?? personality.flexivel);
    const tDeciFlex = (pDeci + pFlex) || 20;

    // Player MX
    const player = results.player_mx || {};
    
    const getRawPct = (prof: string, ctx: string) => {
      const normProf = prof.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const normCtx = ctx.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const valStr = player[prof]?.[ctx] ?? player[normCtx]?.[normProf] ?? player[ctx]?.[normProf] ?? player[ctx]?.[prof.toLowerCase()] ?? player[ctx]?.[prof] ?? '0';
      return parsePct(valStr);
    };

    // Identificar Player MX dominante no contexto "Atual"
    const pAtual = {
      Expressivo: getRawPct('Expressivo', 'atual'),
      Pragmático: getRawPct('Pragmático', 'atual'),
      Afável: getRawPct('Afável', 'atual'),
      Analítico: getRawPct('Analítico', 'atual')
    };
    
    const maxPlayerPct = Math.max(pAtual.Expressivo, pAtual.Pragmático, pAtual.Afável, pAtual.Analítico);
    let dominantPlayer = "Pragmático";
    let dominantPlayerColor = "from-orange-400 to-orange-600";
    if (pAtual.Expressivo === maxPlayerPct) { dominantPlayer = "Expressivo"; dominantPlayerColor = "from-rose-400 to-rose-600"; }
    else if (pAtual.Afável === maxPlayerPct) { dominantPlayer = "Afável"; dominantPlayerColor = "from-emerald-400 to-emerald-600"; }
    else if (pAtual.Analítico === maxPlayerPct) { dominantPlayer = "Analítico"; dominantPlayerColor = "from-indigo-400 to-indigo-600"; }

    return {
      vision: { vAlien, vRobo, vMamifero, vTubarao, dominantVision, dominantVisionColor },
      energy: { eRazao, eAcao, eEmocao, eTotal, eMax, dominantEnergy, dominantEnergyColor },
      power: topPower.map((p, i) => ({ ...p, color: powerColors[i] || "bg-slate-500" })),
      personality: {
        pctAber: Math.round((pAber / tAberFech) * 100), pctFech: Math.round((pFech / tAberFech) * 100),
        pctTrad: Math.round((pTrad / tTradInov) * 100), pctInov: Math.round((pInov / tTradInov) * 100),
        pctPens: Math.round((pPens / tPensSent) * 100), pctSent: Math.round((pSent / tPensSent) * 100),
        pctDeci: Math.round((pDeci / tDeciFlex) * 100), pctFlex: Math.round((pFlex / tDeciFlex) * 100)
      },
      player: {
        dominantPlayer, dominantPlayerColor,
        aparente: { expressivo: getRawPct('Expressivo', 'aparente'), pragmatico: getRawPct('Pragmático', 'aparente'), afavel: getRawPct('Afável', 'aparente'), analitico: getRawPct('Analítico', 'aparente') },
        atual: {
          expressivo: pAtual.Expressivo,
          pragmatico: pAtual.Pragmático,
          afavel: pAtual.Afável,
          analitico: pAtual.Analítico
        },
        pressao: { expressivo: getRawPct('Expressivo', 'pressão'), pragmatico: getRawPct('Pragmático', 'pressão'), afavel: getRawPct('Afável', 'pressão'), analitico: getRawPct('Analítico', 'pressão') }
      }
    };
  };

  const data = calculatePercentages();

  return (
    <motion.div key="reports" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 pb-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ReportActionCard title="Relatório Individual" desc="PDF detalhado por candidato" icon={FileText} color="text-indigo-600" onClick={() => window.print()} />
        <ReportActionCard title="Relatório Comparativo" desc="Compare múltiplos candidatos" icon={BarChart3} color="text-emerald-600" onClick={() => window.print()} />
        <ReportActionCard title="Análise de Equipe" desc="Distribuição de perfis" icon={Users} color="text-purple-600" onClick={() => window.print()} />
      </div>

      <div className="bg-white/70 backdrop-blur-xl p-4 lg:p-8 rounded-[2rem] border border-white shadow-xl shadow-slate-200/50">
        {/* Header Section */}
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
                <div className="flex items-center gap-4">
                  <div className="p-3.5 bg-white/10 backdrop-blur-md text-indigo-300 rounded-2xl border border-white/10 shadow-inner">
                    <Sparkles size={24} className="animate-pulse" />
                  </div>
                  <div>
                    <h4 className="font-black text-2xl text-white tracking-tight flex items-center gap-3">
                      Síntese Comportamental IA
                    </h4>
                    <p className="text-indigo-200/80 text-sm font-medium mt-1">
                      Resumo executivo gerado automaticamente por Inteligência Artificial
                    </p>
                  </div>
                </div>
                
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-2xl">
                  <p className="text-white/90 leading-relaxed font-medium text-sm md:text-base whitespace-pre-line">
                    {generateAISynthesis(selectedCandidate.name, data)}
                  </p>
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
                    <ProfileBar label="Razão" value={Math.round((data.energy.eRazao/45)*100)} color="bg-indigo-500" />
                    <ProfileBar label="Ação" value={Math.round((data.energy.eAcao/45)*100)} color="bg-orange-500" />
                    <ProfileBar label="Emoção" value={Math.round((data.energy.eEmocao/45)*100)} color="bg-rose-500" />
                  </div>
                </div>
                
                {/* Dynamic Result Box */}
                <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-100/80">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Foco Dominante</span>
                    <span className={`bg-gradient-to-r ${data.energy.dominantEnergyColor} text-white text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider shadow-sm`}>{data.energy.dominantEnergy}</span>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed font-medium">
                    {PROFILE_DESCRIPTIONS.energy[data.energy.dominantEnergy]}
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
                
                {/* Dynamic Result Box */}
                <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-100/80 mt-auto">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Perfil Visão</span>
                    <span className={`bg-gradient-to-r ${data.vision.dominantVisionColor} text-white text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider shadow-sm`}>{data.vision.dominantVision}</span>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed font-medium">
                    {PROFILE_DESCRIPTIONS.vision[data.vision.dominantVision]}
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

                {/* Dynamic Result Box */}
                <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-100/80">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Atuação Dominante</span>
                    <span className={`bg-gradient-to-r ${data.player.dominantPlayerColor} text-white text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider shadow-sm`}>{data.player.dominantPlayer}</span>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed font-medium">
                    {PROFILE_DESCRIPTIONS.player[data.player.dominantPlayer]}
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
                      <span className={`px-2 py-1 rounded bg-white/10 text-white text-[10px] font-black uppercase tracking-wider`}>{item.value} PTS</span>
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
