export interface Candidate {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: 'Completo' | 'Em Progresso' | 'Pendente';
  progress: number;
  match_score?: number;
  created_at?: string;
}

export interface Interview {
  id: string;
  candidate_id: string;
  candidate_name: string;
  date: string;
  time: string;
  location: string;
  notes?: string;
  status: 'Agendada' | 'Concluída' | 'Cancelada';
  created_at?: string;
}
