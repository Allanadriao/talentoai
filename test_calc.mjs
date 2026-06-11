import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase.from('assessment_results').select('*').limit(5).order('created_at', { ascending: false });
  if (error) {
    console.error('Error:', error);
    return;
  }
  
  for (const results of data) {
    console.log(`\n\n--- Testing results for ${results.candidate_id} ---`);
    try {
      const parsed = calculatePercentages(results);
      console.log('Result:', JSON.stringify(parsed, null, 2));
    } catch (e) {
      console.error('Error calculating:', e);
    }
  }
}

function calculatePercentages(results) {
  if (!results) return null;

  const parsePct = (val) => {
    if (val === undefined || val === null) return 0;
    if (typeof val === 'string') return parseInt(val.replace('%', '')) || 0;
    if (typeof val === 'number') {
      return val;
    }
    return 0;
  };

  const parseRaw = (val) => {
    if (val === undefined || val === null) return 0;
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
  const powerMap = {
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
  const topPower = powerEntries.slice(0, 3);
  const powerColors = ["bg-rose-500", "bg-indigo-500", "bg-sky-500"];

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
  
  const getRawPct = (prof, ctx) => {
    const valStr = player[prof]?.[ctx] ?? player[ctx]?.[prof.toLowerCase()] ?? player[ctx]?.[prof] ?? '0%';
    return parsePct(valStr);
  };

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
      atual: pAtual,
      pressao: { expressivo: getRawPct('Expressivo', 'pressão'), pragmatico: getRawPct('Pragmático', 'pressão'), afavel: getRawPct('Afável', 'pressão'), analitico: getRawPct('Analítico', 'pressão') }
    }
  };
}

run();
