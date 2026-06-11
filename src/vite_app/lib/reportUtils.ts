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
    power: powerEntries.map((p, i) => ({ ...p, color: powerColors[i] || "bg-slate-500" })),
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
}
