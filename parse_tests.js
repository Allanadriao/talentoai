const fs = require('fs');
const path = require('path');

const overviewPath = 'C:\\Users\\PC\\.gemini\\antigravity\\brain\\b6cc0fa1-e076-4668-a67d-7b87381e96d8\\.system_generated\\logs\\overview.txt';

try {
  const content = fs.readFileSync(overviewPath, 'utf8');
  console.log("Read overview.txt successfully, length:", content.length);
  
  // We want to extract the Power MX 180 questions.
  // They start after "Power MX" and "1. Me esforço muito para corrigir minhas falhas."
  const powerMxMatch = content.match(/Power MX\s+Pergunta 1 de 180([\s\S]*?)Personality MX 2/i);
  if (powerMxMatch) {
    const powerMxText = powerMxMatch[1];
    const lines = powerMxText.split('\n');
    const questions = [];
    
    for (const line of lines) {
      const match = line.match(/^(\d+)\.\s+(.*?)[-–]?\s+(\d+)\s*$/);
      if (match) {
        questions.push({
          id: parseInt(match[1]),
          text: match[2].trim(),
          parte: parseInt(match[3])
        });
      }
    }
    
    console.log(`Found ${questions.length} questions for Power MX`);
    
    // Generate TS file
    const tsContent = `export type ParteType = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export interface PowerQuestion {
  id: number;
  text: string;
  parte: ParteType;
}

export const powerMxQuestions: PowerQuestion[] = ${JSON.stringify(questions, null, 2)};
`;
    fs.writeFileSync(path.join(__dirname, 'src', 'data', 'powerMx.ts'), tsContent);
    console.log("Wrote src/data/powerMx.ts");
  } else {
    console.log("Could not find Power MX section in overview");
  }

} catch (err) {
  console.error("Error reading overview.txt:", err);
}
