-- Adicionar as colunas da UI base do Google AI Studio para a tabela candidates e consertar inserções diretas do front-end
ALTER TABLE public.candidates
ALTER COLUMN user_id SET DEFAULT auth.uid();

ALTER TABLE public.candidates
ADD COLUMN IF NOT EXISTS role text,
ADD COLUMN IF NOT EXISTS department text,
ADD COLUMN IF NOT EXISTS progress integer,
ADD COLUMN IF NOT EXISTS match_score integer;

-- Table para armazenar avaliações detalhadas de RH
CREATE TABLE IF NOT EXISTS public.assessment_results (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid references public.candidates(id) on delete cascade not null,
  energy_mx jsonb,
  vision_mx jsonb,
  personality_mx jsonb,
  player_mx jsonb,
  power_mx jsonb,
  raw_answers jsonb,
  match_score integer,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Habilitar RLS para assessment_results
ALTER TABLE public.assessment_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own candidate assessments"
  ON public.assessment_results FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.candidates c 
    WHERE c.id = assessment_results.candidate_id 
    AND c.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert their own candidate assessments"
  ON public.assessment_results FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.candidates c 
    WHERE c.id = assessment_results.candidate_id 
    AND c.user_id = auth.uid()
  ));

-- Table para Entrevistas (Interviews) do Dashboard
CREATE TABLE IF NOT EXISTS public.interviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  candidate_id uuid references public.candidates(id) on delete cascade not null,
  candidate_name text not null,
  date text not null,
  time text not null,
  location text not null,
  notes text,
  status text default 'Agendada',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Interviews
ALTER TABLE public.interviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own interviews"
  ON public.interviews FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own interviews"
  ON public.interviews FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own interviews"
  ON public.interviews FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own interviews"
  ON public.interviews FOR DELETE USING (auth.uid() = user_id);
