import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { SYSTEM_PROMPT_CRITERIA } from '@/config/aiPrompt';

// Initialize the OpenAI client
// Note: Requires OPENAI_API_KEY environment variable to be set
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { candidateName, data, role } = body;

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'Chave da API da OpenAI não está configurada no servidor (OPENAI_API_KEY).' },
        { status: 500 }
      );
    }

    if (!candidateName || !data) {
      return NextResponse.json(
        { error: 'Nome do candidato e dados de avaliação são obrigatórios.' },
        { status: 400 }
      );
    }

    // Build the user prompt with the candidate's actual data
    const userPrompt = `
Por favor, gere a análise profunda para o candidato abaixo, seguindo ESTRITAMENTE o formato e os critérios definidos no seu System Prompt.

Candidato: ${candidateName}
Cargo Atual / Pretendido: ${role || 'Não especificado'}

DADOS DA AVALIAÇÃO:
1. ENERGY MX
- Razão: ${data.energy.razao}
- Ação: ${data.energy.acao}
- Emoção: ${data.energy.emocao}
- Total: ${data.energy.total}

2. VISION MX
- Alien: ${data.vision.alien}%
- Robô: ${data.vision.robo}%
- Mamífero: ${data.vision.mamifero}%
- Tubarão: ${data.vision.tubarao}%

3. PERSONALITY MX
- Aberto: ${data.personality.aberto}% | Fechado: ${data.personality.fechado}%
- Tradicional: ${data.personality.tradicional}% | Inovador: ${data.personality.inovador}%
- Pensador: ${data.personality.pensador}% | Sentimento: ${data.personality.sentimento}%
- Decisivo: ${data.personality.decisivo}% | Flexível: ${data.personality.flexivel}%

4. PLAYER MX (Comportamento Atual - Média Geral)
- Pragmático: ${data.player.atual.pragmatico}%
- Expressivo: ${data.player.atual.expressivo}%
- Afável: ${data.player.atual.afavel}%
- Analítico: ${data.player.atual.analitico}%

5. POWER MX (Eneagrama)
- 1. Comprometimento (O Perfeccionista): ${data.power.find((p:any) => p.type.includes('1'))?.value || 0}%
- 2. Amor (O Doador): ${data.power.find((p:any) => p.type.includes('2'))?.value || 0}%
- 3. Ambição (O Realizador): ${data.power.find((p:any) => p.type.includes('3'))?.value || 0}%
- 4. Ego (O Individualista): ${data.power.find((p:any) => p.type.includes('4'))?.value || 0}%
- 5. Desenvolvimento (O Investigador): ${data.power.find((p:any) => p.type.includes('5'))?.value || 0}%
- 6. Medo (O Leal): ${data.power.find((p:any) => p.type.includes('6'))?.value || 0}%
- 7. Relacionamento (O Entusiasta): ${data.power.find((p:any) => p.type.includes('7'))?.value || 0}%
- 8. Liderança (O Desafiador): ${data.power.find((p:any) => p.type.includes('8'))?.value || 0}%
- 9. Análise (O Pacificador): ${data.power.find((p:any) => p.type.includes('9'))?.value || 0}%

Lembre-se de entregar exatamente nos 8 tópicos solicitados. Responda formatado em Markdown para melhor visualização.
`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `Você é um Analista de Perfil Comportamental de Elite trabalhando para a TalentoIA. 
Sua tarefa é analisar os resultados de assessments de candidatos e gerar um relatório profundo e estruturado.
Abaixo estão os critérios rigorosos que você DEVE usar para interpretar as notas:

${SYSTEM_PROMPT_CRITERIA}`
        },
        {
          role: 'user',
          content: userPrompt
        }
      ],
      temperature: 0.3, // Low temperature for more analytical and consistent output
    });

    const analysis = response.choices[0]?.message?.content;

    if (!analysis) {
      throw new Error('A OpenAI não retornou nenhuma análise.');
    }

    return NextResponse.json({ analysis });
  } catch (error: any) {
    console.error('Error generating AI synthesis:', error);
    return NextResponse.json(
      { error: error.message || 'Ocorreu um erro ao gerar a análise com a OpenAI.' },
      { status: 500 }
    );
  }
}
