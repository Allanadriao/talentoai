import { personalityMxQuestions } from '@/data/personalityMx';
import { energyMxQuestions } from '@/data/energyMx';
import { playerMxQuestions } from '@/data/playerMx';
import { visionMxQuestions } from '@/data/visionMx';
import { powerMxQuestions } from '@/data/powerMx';

export const PROFILE_DESCRIPTIONS = {
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

export function calculateReportData(results: any) {
  if (!results) return null;

  const parsePct = (val: any) => {
    if (!val) return 0;
    if (typeof val === 'string') return parseInt(val.replace('%', '')) || 0;
    if (typeof val === 'number') return val;
    return 0;
  };

  const parseRaw = (val: any) => {
    if (!val) return 0;
    if (typeof val === 'string') return parseInt(val.replace('%', '')) || 0;
    if (typeof val === 'number') return val;
    return 0;
  };

  // Vision MX
  let vAlien = 0, vRobo = 0, vMamifero = 0, vTubarao = 0;
  
  if (results.raw_answers?.vision_mx) {
    const rawAnswers = results.raw_answers.vision_mx;
    Object.entries(rawAnswers).forEach(([qId, optionId]) => {
      const q = visionMxQuestions.find((q: any) => q.id === Number(qId));
      if (q) {
        const opt = q.options.find((o: any) => o.id === optionId);
        if (opt) {
          if (opt.profile === 'Alien') vAlien++;
          else if (opt.profile === 'Robô') vRobo++;
          else if (opt.profile === 'Mamífero') vMamifero++;
          else if (opt.profile === 'Tubarão') vTubarao++;
        }
      }
    });
    const totalQs = visionMxQuestions.length || 25;
    vAlien = Math.round((vAlien / totalQs) * 100);
    vRobo = Math.round((vRobo / totalQs) * 100);
    vMamifero = Math.round((vMamifero / totalQs) * 100);
    vTubarao = Math.round((vTubarao / totalQs) * 100);
  } else {
    const vision = results.vision_mx || {};
    vAlien = parseRaw(vision.Alien ?? vision.alien);
    vRobo = parseRaw(vision.Robô ?? vision.robo);
    vMamifero = parseRaw(vision.Mamífero ?? vision.mamifero);
    vTubarao = parseRaw(vision.Tubarão ?? vision.tubarao);
    // Compatibility if stored as 0-1 values instead of percentages
    if (vAlien < 2 && vRobo < 2 && vMamifero < 2 && vTubarao < 2) {
      vAlien = Math.round((vAlien / 25) * 100);
      vRobo = Math.round((vRobo / 25) * 100);
      vMamifero = Math.round((vMamifero / 25) * 100);
      vTubarao = Math.round((vTubarao / 25) * 100);
    }
  }

  const vMax = Math.max(vAlien, vRobo, vMamifero, vTubarao);
  let dominantVision = "Tubarão";
  let dominantVisionColor = "from-sky-400 to-sky-600";
  if (vAlien === vMax) { dominantVision = "Alien"; dominantVisionColor = "from-purple-400 to-purple-600"; }
  else if (vRobo === vMax) { dominantVision = "Robô"; dominantVisionColor = "from-indigo-400 to-indigo-600"; }
  else if (vMamifero === vMax) { dominantVision = "Mamífero"; dominantVisionColor = "from-emerald-400 to-emerald-600"; }

  // Energy MX
  let eRazao = 0, eAcao = 0, eEmocao = 0;
  
  if (results.raw_answers?.energy_mx) {
    const rawAnswers = results.raw_answers.energy_mx;
    Object.entries(rawAnswers).forEach(([qId, value]) => {
      const q = energyMxQuestions.find((q: any) => q.id === Number(qId));
      if (q) {
        if (q.profile === 'Razão') eRazao += (value as number);
        else if (q.profile === 'Ação') eAcao += (value as number);
        else if (q.profile === 'Emoção') eEmocao += (value as number);
      }
    });
  } else {
    const energy = results.energy_mx || {};
    eRazao = parseRaw(energy.Razão ?? energy.razao);
    eAcao = parseRaw(energy.Ação ?? energy.acao);
    eEmocao = parseRaw(energy.Emoção ?? energy.emocao);
  }

  const eTotal = eRazao + eAcao + eEmocao;
  const eMax = 135; 
  
  const eMaxScore = Math.max(eRazao, eAcao, eEmocao);
  let dominantEnergy = "Ação";
  let dominantEnergyColor = "from-orange-400 to-orange-600";
  if (eRazao === eMaxScore) { dominantEnergy = "Razão"; dominantEnergyColor = "from-indigo-400 to-indigo-600"; }
  else if (eEmocao === eMaxScore) { dominantEnergy = "Emoção"; dominantEnergyColor = "from-rose-400 to-rose-600"; }

  // Power MX
  let power = results.power_mx || {};
  if (results.raw_answers?.power_mx) {
    const rawAnswers = results.raw_answers.power_mx;
    const rawPower: Record<string, number> = {
      "Tipo 1": 0, "Tipo 2": 0, "Tipo 3": 0, "Tipo 4": 0, "Tipo 5": 0,
      "Tipo 6": 0, "Tipo 7": 0, "Tipo 8": 0, "Tipo 9": 0
    };
    Object.entries(rawAnswers).forEach(([qId, value]) => {
      const q = powerMxQuestions.find((q: any) => q.id === Number(qId));
      if (q && q.parte >= 1 && q.parte <= 9) {
        rawPower[`Tipo ${q.parte}`] += Number(value) || 0;
      }
    });
    Object.keys(rawPower).forEach(key => {
      rawPower[key] = Math.round((rawPower[key] * 100) / 180);
    });
    power = rawPower;
  }

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
  const powerColors = ["bg-rose-500", "bg-indigo-500", "bg-sky-500", "bg-emerald-500", "bg-amber-500", "bg-purple-500", "bg-teal-500", "bg-fuchsia-500", "bg-orange-500"];

  // Personality MX
  const personality = results.personality_mx || {};
  
  let pAber = 0, pFech = 0;
  let pTrad = 0, pInov = 0;
  let pPens = 0, pSent = 0;
  let pDeci = 0, pFlex = 0;

  if (personality.fromScale && results.raw_answers?.personality_mx) {
    const rawAnswers = results.raw_answers.personality_mx;
    
    personalityMxQuestions.forEach((q: any) => {
      const val = rawAnswers[q.id];
      if (val !== undefined) {
        // val is from 1 to 10
        // 1 means strongly leftTrait (options[0]), 10 means strongly rightTrait (options[1])
        const leftScore = 11 - val;
        const rightScore = val;
        
        const applyScore = (trait: string, score: number) => {
          if (trait === 'Aberto') pAber += score;
          else if (trait === 'Fechado') pFech += score;
          else if (trait === 'Tradicional') pTrad += score;
          else if (trait === 'Inovador') pInov += score;
          else if (trait === 'Pensador') pPens += score;
          else if (trait === 'Sentimento') pSent += score;
          else if (trait === 'Decisivo') pDeci += score;
          else if (trait === 'Flexível') pFlex += score;
        };
        
        applyScore(q.options[0].trait, leftScore);
        applyScore(q.options[1].trait, rightScore);
      }
    });
  } else {
    pAber = parseRaw(personality.Aberto ?? personality.aberto); 
    pFech = parseRaw(personality.Fechado ?? personality.fechado);
    pTrad = parseRaw(personality.Tradicional ?? personality.tradicional); 
    pInov = parseRaw(personality.Inovador ?? personality.inovador);
    pPens = parseRaw(personality.Pensador ?? personality.pensador); 
    pSent = parseRaw(personality.Sentimento ?? personality.sentimento);
    pDeci = parseRaw(personality.Decisivo ?? personality.decisivo); 
    pFlex = parseRaw(personality.Flexível ?? personality.flexivel);
  }

  const tAberFech = (pAber + pFech) || 11;
  const tTradInov = (pTrad + pInov) || 21;
  const tPensSent = (pPens + pSent) || 18;
  const tDeciFlex = (pDeci + pFlex) || 20;

  // Player MX
  let pAparente = { expressivo: 0, pragmatico: 0, afavel: 0, analitico: 0 };
  let pAtual = { expressivo: 0, pragmatico: 0, afavel: 0, analitico: 0 };
  let pPressao = { expressivo: 0, pragmatico: 0, afavel: 0, analitico: 0 };

  if (results.raw_answers?.player_mx) {
    const rawAnswers = results.raw_answers.player_mx;
    
    let counts = {
      aparente: { Expressivo: 0, Pragmático: 0, Afável: 0, Analítico: 0 },
      atual: { Expressivo: 0, Pragmático: 0, Afável: 0, Analítico: 0 },
      pressão: { Expressivo: 0, Pragmático: 0, Afável: 0, Analítico: 0 }
    } as any;
    
    let totals = { aparente: 0, atual: 0, pressão: 0 } as any;
    
    Object.entries(rawAnswers).forEach(([qId, profile]) => {
       const q = playerMxQuestions.find((q: any) => q.id === Number(qId));
       if (q) {
          counts[q.context][profile as string] += 1;
          totals[q.context] += 1;
       }
    });
    
    const calcContextPcts = (c: any, total: number) => {
      if (total === 0) return { expressivo: 0, pragmatico: 0, afavel: 0, analitico: 0 };
      const exp = Math.round((c.Expressivo / total) * 100);
      const pra = Math.round((c.Pragmático / total) * 100);
      const afa = Math.round((c.Afável / total) * 100);
      const ana = 100 - (exp + pra + afa);
      // To prevent negative values in edge cases (though mathematically impossible if counts sum to total)
      return {
        expressivo: exp,
        pragmatico: pra,
        afavel: afa,
        analitico: Math.max(0, ana)
      };
    };

    pAparente = calcContextPcts(counts.aparente, totals.aparente);
    pAtual = calcContextPcts(counts.atual, totals.atual);
    pPressao = calcContextPcts(counts.pressão, totals.pressão);
  } else {
    const player = results.player_mx || {};
    const getRawPct = (prof: string, ctx: string) => {
      const normProf = prof.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const normCtx = ctx.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const valStr = player[prof]?.[ctx] ?? player[normCtx]?.[normProf] ?? player[ctx]?.[normProf] ?? player[ctx]?.[prof.toLowerCase()] ?? player[ctx]?.[prof] ?? '0';
      return parsePct(valStr);
    };

    pAtual = {
      expressivo: getRawPct('Expressivo', 'atual'),
      pragmatico: getRawPct('Pragmático', 'atual'),
      afavel: getRawPct('Afável', 'atual'),
      analitico: getRawPct('Analítico', 'atual')
    };
    pAparente = { 
      expressivo: getRawPct('Expressivo', 'aparente'), 
      pragmatico: getRawPct('Pragmático', 'aparente'), 
      afavel: getRawPct('Afável', 'aparente'), 
      analitico: getRawPct('Analítico', 'aparente') 
    };
    pPressao = { 
      expressivo: getRawPct('Expressivo', 'pressão'), 
      pragmatico: getRawPct('Pragmático', 'pressão'), 
      afavel: getRawPct('Afável', 'pressão'), 
      analitico: getRawPct('Analítico', 'pressão') 
    };
  }
  
  const maxPlayerPct = Math.max(pAtual.expressivo, pAtual.pragmatico, pAtual.afavel, pAtual.analitico);
  let dominantPlayer = "Pragmático";
  let dominantPlayerColor = "from-orange-400 to-orange-600";
  if (pAtual.expressivo === maxPlayerPct) { dominantPlayer = "Expressivo"; dominantPlayerColor = "from-rose-400 to-rose-600"; }
  else if (pAtual.afavel === maxPlayerPct) { dominantPlayer = "Afável"; dominantPlayerColor = "from-emerald-400 to-emerald-600"; }
  else if (pAtual.analitico === maxPlayerPct) { dominantPlayer = "Analítico"; dominantPlayerColor = "from-indigo-400 to-indigo-600"; }

  return {
    vision: { vAlien, vRobo, vMamifero, vTubarao, dominantVision, dominantVisionColor },
    energy: { eRazao, eAcao, eEmocao, eTotal, eMax, dominantEnergy, dominantEnergyColor },
    power: powerEntries.map((p, i) => ({ ...p, color: powerColors[i] || "bg-slate-500" })),
    personality: {
      pctAber: Math.round((pAber / tAberFech) * 100), pctFech: Math.round((pFech / tAberFech) * 100),
      pctTrad: Math.round((pTrad / tTradInov) * 100), pctInov: Math.round((pInov / tTradInov) * 100),
      pctPens: Math.round((pPens / tPensSent) * 100), pctSent: Math.round((pSent / tPensSent) * 100),
      pctDeci: Math.round((pDeci / tDeciFlex) * 100), pctFlex: Math.round((pFlex / tDeciFlex) * 100)
    },
    player: {
      dominantPlayer, dominantPlayerColor,
      aparente: pAparente,
      atual: pAtual,
      pressao: pPressao
    }
  };
}
