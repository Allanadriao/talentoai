-- Create the candidates table
create table public.candidates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  email text not null,
  phone text,
  position text not null,
  resume text not null,
  ai_score integer,
  ai_summary text,
  ai_decision text,
  status text default 'pending',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.candidates enable row level security;

-- Create policies for Candidates
create policy "Users can view their own candidates"
  on public.candidates for select
  using (auth.uid() = user_id);

create policy "Users can insert their own candidates"
  on public.candidates for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own candidates"
  on public.candidates for update
  using (auth.uid() = user_id);

create policy "Users can delete their own candidates"
  on public.candidates for delete
  using (auth.uid() = user_id);

-- Create updated_at trigger function
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_updated_at
before update on public.candidates
for each row
execute function public.handle_updated_at();
