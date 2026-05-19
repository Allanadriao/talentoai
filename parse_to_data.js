const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.join(__dirname, 'assessment_text.txt'), 'utf8');
const lines = content.split('\n').map(l => l.replace('\r', '').trim()).filter(l => l.length > 0);

// ==========================================
// 1. PARSE PERSONALITY MX (70 QUESTIONS)
// ==========================================
console.log("Parsing Personality MX...");
let pStart = -1;
let pEnd = -1;

for (let i = 25; i < lines.length; i++) {
  if (lines[i] === "Personality MX") {
    pStart = i;
  }
  if (pStart !== -1 && lines[i] === "Vision MX") {
    pEnd = i;
    break;
  }
}

const personalityQuestions = [];
let currentQ = null;

for (let i = pStart + 1; i < pEnd; i++) {
  const line = lines[i];
  const qMatch = line.match(/^(\d+)\.\s+(.*)$/);
  
  if (qMatch) {
    if (currentQ) {
      personalityQuestions.push(currentQ);
    }
    currentQ = {
      id: parseInt(qMatch[1]),
      text: qMatch[2].trim(),
      optionsText: []
    };
  } else if (currentQ) {
    currentQ.optionsText.push(line);
  }
}
if (currentQ) {
  personalityQuestions.push(currentQ);
}

const cleanedPersonality = personalityQuestions.map(q => {
  const optionsTextJoined = q.optionsText.join(' ');
  const matches = [];
  
  const traitRegex = /(.+?)\s*[-–]\s*(Aberto|Fechado|Tradicional|Inovador|Pensador|Sentimento|Decisivo|Flexível|Flexivel)/gi;
  
  let match;
  while ((match = traitRegex.exec(optionsTextJoined)) !== null) {
    let optionText = match[1].trim();
    let trait = match[2].trim();
    
    const traitsList = ['Aberto', 'Fechado', 'Tradicional', 'Inovador', 'Pensador', 'Sentimento', 'Decisivo', 'Flexível', 'Flexivel'];
    traitsList.forEach(t => {
      const reg = new RegExp(`^\\s*${t}\\s*`, 'i');
      optionText = optionText.replace(reg, '').trim();
    });
    
    if (trait.toLowerCase() === 'flexivel') {
      trait = 'Flexível';
    }
    trait = trait.charAt(0).toUpperCase() + trait.slice(1);
    
    matches.push({
      text: optionText,
      trait: trait
    });
  }
  
  if (matches.length < 2) {
    const parts = optionsTextJoined.split(/\s{2,}|\u00a0/);
    if (parts.length >= 2) {
      const parsedParts = parts.map(p => {
        const m = p.match(/(.*?)\s*[-–]\s*(Aberto|Fechado|Tradicional|Inovador|Pensador|Sentimento|Decisivo|Flexível|Flexivel)/i);
        if (m) {
          let trait = m[2].trim();
          if (trait.toLowerCase() === 'flexivel') trait = 'Flexível';
          return { text: m[1].trim(), trait: trait.charAt(0).toUpperCase() + trait.slice(1) };
        }
        return null;
      }).filter(x => x !== null);
      
      if (parsedParts.length >= 2) {
        return {
          id: q.id,
          text: q.text,
          options: [parsedParts[0], parsedParts[1]]
        };
      }
    }
    
    return {
      id: q.id,
      text: q.text,
      options: [
        { text: "Opção 1", trait: "Aberto" },
        { text: "Opção 2", trait: "Fechado" }
      ]
    };
  }
  
  return {
    id: q.id,
    text: q.text,
    options: [
      { text: matches[0].text, trait: matches[0].trait },
      { text: matches[1].text, trait: matches[1].trait }
    ]
  };
});

console.log(`Parsed ${cleanedPersonality.length} Personality MX questions.`);

// ==========================================
// 2. PARSE PLAYER MX (40 QUESTIONS)
// ==========================================
console.log("Parsing Player MX...");
let plStart = -1;
let plEnd = -1;
for (let i = 25; i < lines.length; i++) {
  if (lines[i] === "Player MX") {
    plStart = i;
  }
  if (plStart !== -1 && lines[i] === "Power MX") {
    plEnd = i;
    break;
  }
}

const playerQuestions = [];
let currentPlayerQ = null;
for (let i = plStart + 1; i < plEnd; i++) {
  const line = lines[i];
  const qMatch = line.match(/^(\d+)\.\s+Preencha como você realmente é:\s*(atual|aparente|pressão|pressao|Atual)$/i);
  
  if (qMatch) {
    if (currentPlayerQ) {
      playerQuestions.push(currentPlayerQ);
    }
    let context = qMatch[2].toLowerCase().trim();
    if (context === 'pressao') context = 'pressão';
    if (context === 'atual') context = 'atual';
    
    currentPlayerQ = {
      id: parseInt(qMatch[1]),
      context: context,
      optionsText: []
    };
  } else if (currentPlayerQ) {
    currentPlayerQ.optionsText.push(line);
  }
}
if (currentPlayerQ) {
  playerQuestions.push(currentPlayerQ);
}

const cleanedPlayer = playerQuestions.map(q => {
  const textJoined = q.optionsText.join(' ');
  const options = [];
  
  const optRegex = /([A-D])\s*[-–]\s*(.*?)\s*[-–]\s*(Expressivo|Pragmático|Analítico|Afável|Pragmatico)/gi;
  let match;
  while ((match = optRegex.exec(textJoined)) !== null) {
    const letter = match[1].toUpperCase();
    let text = match[2].trim();
    let profile = match[3].trim();
    
    if (profile.toLowerCase() === 'pragmatico') {
      profile = 'Pragmático';
    }
    text = text.replace(/^\s*[ln]\s+/i, '').trim();
    
    options.push({
      id: letter,
      text: text,
      profile: profile
    });
  }
  
  if (options.length < 4) {
    const softRegex = /([A-D])\s*[-–]\s*([^A-D]+)/gi;
    let sMatch;
    const fallbackOptions = [];
    while ((sMatch = softRegex.exec(textJoined)) !== null) {
      const letter = sMatch[1].toUpperCase();
      let rawText = sMatch[2].trim();
      
      let profile = 'Pragmático';
      if (/expressivo/i.test(rawText)) profile = 'Expressivo';
      else if (/analitico|analítico/i.test(rawText)) profile = 'Analítico';
      else if (/afavel|afável/i.test(rawText)) profile = 'Afável';
      
      let cleanedText = rawText.replace(/[-–]\s*(Expressivo|Pragmático|Analítico|Afável|Pragmatico)/gi, '').trim();
      cleanedText = cleanedText.replace(/^\s*[ln]\s+/i, '').trim();
      
      fallbackOptions.push({
        id: letter,
        text: cleanedText,
        profile: profile
      });
    }
    
    if (fallbackOptions.length === 4) {
      return {
        id: q.id,
        context: q.context,
        options: fallbackOptions
      };
    }
    
    return {
      id: q.id,
      context: q.context,
      options: [
        { id: 'A', text: 'Animado', profile: 'Expressivo' },
        { id: 'B', text: 'Aventureiro', profile: 'Pragmático' },
        { id: 'C', text: 'Analítico', profile: 'Analítico' },
        { id: 'D', text: 'Adaptável', profile: 'Afável' }
      ]
    };
  }
  
  return {
    id: q.id,
    context: q.context,
    options: options
  };
});

console.log(`Parsed ${cleanedPlayer.length} Player MX questions.`);

// ==========================================
// 3. PARSE POWER MX (180 QUESTIONS)
// ==========================================
console.log("Parsing Power MX...");
const powerQuestions = [];
let powStart = -1;
for (let i = 25; i < lines.length; i++) {
  if (lines[i] === "Power MX") {
    powStart = i;
    break;
  }
}

for (let i = powStart + 2; i < lines.length; i++) {
  const line = lines[i];
  if (line === "Personality MX 2") {
    break;
  }
  
  const match = line.match(/^(\d+)\.\s+(.*?)\s*[-–]?\s*(\d)\s*$/);
  if (match) {
    powerQuestions.push({
      id: parseInt(match[1]),
      text: match[2].trim(),
      parte: parseInt(match[3])
    });
  }
}

console.log(`Parsed ${powerQuestions.length} Power MX questions.`);

// ==========================================
// 4. WRITE THE OUTPUT DATA FILES
// ==========================================

// Write personalityMx.ts
const personalityMxContent = `export type PersonalityTrait = 'Aberto' | 'Fechado' | 'Tradicional' | 'Inovador' | 'Pensador' | 'Sentimento' | 'Decisivo' | 'Flexível';

export interface PersonalityOption {
  text: string;
  trait: PersonalityTrait;
}

export interface PersonalityQuestion {
  id: number;
  text: string;
  options: [PersonalityOption, PersonalityOption];
}

export const personalityMxQuestions: PersonalityQuestion[] = ${JSON.stringify(cleanedPersonality, null, 2)};
`;
fs.writeFileSync(path.join(__dirname, 'src', 'data', 'personalityMx.ts'), personalityMxContent, 'utf8');
console.log("Wrote src/data/personalityMx.ts successfully!");

// Write personalityMx2.ts
const cleanedPersonality2 = cleanedPersonality.map(q => ({
  id: q.id,
  leftTrait: q.options[0].text,
  rightTrait: q.options[1].text
}));

const personalityMx2Content = `export interface Personality2Question {
  id: number;
  leftTrait: string;
  rightTrait: string;
}

export const personalityMx2Questions: Personality2Question[] = ${JSON.stringify(cleanedPersonality2, null, 2)};
`;
fs.writeFileSync(path.join(__dirname, 'src', 'data', 'personalityMx2.ts'), personalityMx2Content, 'utf8');
console.log("Wrote src/data/personalityMx2.ts successfully!");

// Write playerMx.ts
const playerMxContent = `export type PlayerContext = 'atual' | 'aparente' | 'pressão';
export type PlayerProfile = 'Pragmático' | 'Expressivo' | 'Afável' | 'Analítico';

export interface PlayerOption {
  id: string; // A, B, C, D
  text: string;
  profile: PlayerProfile;
}

export interface PlayerQuestion {
  id: number;
  context: PlayerContext;
  options: PlayerOption[];
}

export const playerMxQuestions: PlayerQuestion[] = ${JSON.stringify(cleanedPlayer, null, 2)};
`;
fs.writeFileSync(path.join(__dirname, 'src', 'data', 'playerMx.ts'), playerMxContent, 'utf8');
console.log("Wrote src/data/playerMx.ts successfully!");

// Write powerMx.ts
const powerMxContent = `export type ParteType = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export interface PowerQuestion {
  id: number;
  text: string;
  parte: ParteType;
}

export const powerMxQuestions: PowerQuestion[] = ${JSON.stringify(powerQuestions, null, 2)};

export const powerMxProfiles: Record<ParteType, string> = {
  1: "O Perfeccionista",
  2: "O Doador",
  3: "O Realizador",
  4: "O Individualista",
  5: "O Investigador",
  6: "O Leal",
  7: "O Entusiasta",
  8: "O Desafiador",
  9: "O Pacificador"
};
`;
fs.writeFileSync(path.join(__dirname, 'src', 'data', 'powerMx.ts'), powerMxContent, 'utf8');
console.log("Wrote src/data/powerMx.ts successfully!");
