-- 1) Core tables (idempotent)
create table if not exists public.candidates (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text,
  phone text,
  seniority text,
  current_title text,
  location text,
  status text not null default 'new',
  match_score integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.resumes (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid not null references public.candidates(id) on delete cascade,
  storage_path text not null,
  original_filename text not null,
  mime_type text,
  parsed_text text,
  parsed_json jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.skills (
  id serial primary key,
  name text unique not null
);

create table if not exists public.candidate_skills (
  candidate_id uuid not null references public.candidates(id) on delete cascade,
  skill_id int not null references public.skills(id) on delete cascade,
  level int,
  primary key (candidate_id, skill_id)
);

create table if not exists public.jobs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  level text,
  location text,
  status text not null default 'open',
  description text,
  requirements jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.matches (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid not null references public.candidates(id) on delete cascade,
  job_id uuid not null references public.jobs(id) on delete cascade,
  score int not null,
  explanation text,
  created_at timestamptz not null default now(),
  unique (candidate_id, job_id)
);

-- 2) Trigger updated_at (idempotent)
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

do $$
begin
  if not exists (
    select 1
    from pg_trigger t
    join pg_class c on c.oid = t.tgrelid
    where t.tgname = 'trg_candidates_updated_at'
      and c.relname = 'candidates'
  ) then
    create trigger trg_candidates_updated_at
    before update on public.candidates
    for each row execute function public.set_updated_at();
  end if;
end $$;

-- 3) RLS (enable is safe if already enabled)
alter table public.candidates enable row level security;
alter table public.resumes   enable row level security;
alter table public.skills    enable row level security;
alter table public.candidate_skills enable row level security;
alter table public.jobs      enable row level security;
alter table public.matches   enable row level security;

-- 4) Policies (idempotent)
do $$
begin
  create policy p_select_all on public.candidates
    for select using (auth.role() = 'authenticated');
exception when duplicate_object then null;
end $$;

do $$
begin
  create policy p_insert_all on public.candidates
    for insert with check (auth.role() = 'authenticated');
exception when duplicate_object then null;
end $$;

do $$
begin
  create policy p_update_all on public.candidates
    for update using (auth.role() = 'authenticated')
    with check (auth.role() = 'authenticated');
exception when duplicate_object then null;
end $$;

do $$
begin
  create policy p_select_all_resumes on public.resumes
    for select using (auth.role() = 'authenticated');
exception when duplicate_object then null;
end $$;

do $$
begin
  create policy p_insert_all_resumes on public.resumes
    for insert with check (auth.role() = 'authenticated');
exception when duplicate_object then null;
end $$;

do $$
begin
  create policy p_select_skills on public.skills
    for select using (true);
exception when duplicate_object then null;
end $$;

do $$
begin
  create policy p_insert_skills on public.skills
    for insert with check (auth.role() = 'authenticated');
exception when duplicate_object then null;
end $$;

do $$
begin
  create policy p_select_candskills on public.candidate_skills
    for select using (auth.role() = 'authenticated');
exception when duplicate_object then null;
end $$;

do $$
begin
  create policy p_insert_candskills on public.candidate_skills
    for insert with check (auth.role() = 'authenticated');
exception when duplicate_object then null;
end $$;

do $$
begin
  create policy p_select_jobs on public.jobs
    for select using (true);
exception when duplicate_object then null;
end $$;

do $$
begin
  create policy p_insert_jobs on public.jobs
    for insert with check (auth.role() = 'authenticated');
exception when duplicate_object then null;
end $$;

do $$
begin
  create policy p_select_matches on public.matches
    for select using (auth.role() = 'authenticated');
exception when duplicate_object then null;
end $$;

do $$
begin
  create policy p_insert_matches on public.matches
    for insert with check (auth.role() = 'authenticated');
exception when duplicate_object then null;
end $$;
