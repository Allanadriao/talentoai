export type ParteType = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export interface PowerQuestion {
  id: number;
  text: string;
  parte: ParteType;
}

// Exemplos preenchidos baseados na listagem. (A lista completa de 180 pode ser populada aqui)
export const powerMxQuestions: PowerQuestion[] = [
  { id: 1, text: "Me esforço muito para corrigir minhas falhas.", parte: 1 },
  { id: 2, text: "Me aborreço quando vejo que as coisas não são como deveriam ser.", parte: 1 },
  { id: 3, text: "Odeio perder tempo.", parte: 3 },
  { id: 4, text: "Sempre me culpo por não ter feito o melhor.", parte: 1 },
  { id: 5, text: "A mínima falha pode arruinar a coisa toda para mim.", parte: 1 },
  { id: 6, text: "Tenho dificuldade em relaxar e ser brincalhão.", parte: 1 },
  { id: 7, text: "Ouço com frequência, na minha cabeça, vozes me criticando ou criticando outros.", parte: 1 },
  { id: 8, text: "Pareço preocupar-me mais do que as outras pessoas.", parte: 6 },
  { id: 9, text: "Me sinto forçado a ser honesto.", parte: 1 },
  { id: 10, text: "Às vezes me acho muito certinho.", parte: 1 },
  { id: 11, text: "É importante para mim ser direto.", parte: 8 },
  { id: 12, text: "Frequentemente me apresso sentindo que não tenho muito tempo para o muito que tenho que fazer.", parte: 3 },
  { id: 13, text: "Eu sou, ou poderia facilmente ser uma pessoa de confiança.", parte: 6 },
  { id: 14, text: "Preciso sentir-me responsável a maior parte do tempo.", parte: 6 },
  { id: 15, text: "Posso facilmente identificar-me com campanhas contra o mal.", parte: 6 },
  { id: 16, text: "Se uma coisa não é justa, ela realmente me incomoda.", parte: 1 },
  { id: 17, text: "Sinto-me forçado a me melhorar e ao que estou fazendo.", parte: 1 },
  { id: 18, text: "Preciso ser perfeito para ser amado e validado.", parte: 3 },
  { id: 19, text: "Sinto-me frustrado porque nem eu nem os outros somos o que deveríamos ser.", parte: 1 },
  { id: 20, text: "Vejo as coisas em termos de certo ou errado, bom ou mau.", parte: 1 },
  // Placeholder para os testes - vamos testar a lógica matemática com essas 20
];

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
