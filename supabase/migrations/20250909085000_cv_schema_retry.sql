-- === Minimal CV schema to unblock seeding ===
create extension if not exists "pgcrypto";

-- updated_at trigger function
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- MASTER: Skills
create table if not exists public.cv_m_skills (
  id          serial primary key,
  code        text unique,
  name        text unique not null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
do $$ begin
  create trigger trg_cv_m_skills_updated
  before update on public.cv_m_skills
  for each row execute function public.set_updated_at();
exception when duplicate_object then null; end $$;

-- TRANSACTION: Candidates
create table if not exists public.cv_t_candidates (
  id             uuid primary key default gen_random_uuid(),
  full_name      text not null,
  email          text,
  phone          text,
  seniority      text,
  current_title  text,
  location       text,
  status         text not null default 'new',
  match_score    int  not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
do $$ begin
  create trigger trg_cv_t_candidates_updated
  before update on public.cv_t_candidates
  for each row execute function public.set_updated_at();
exception when duplicate_object then null; end $$;

-- TRANSACTION: Candidate skills (bridge)
create table if not exists public.cv_t_candidate_skills (
  candidate_id  uuid not null references public.cv_t_candidates(id) on delete cascade,
  skill_id      int  not null references public.cv_m_skills(id)     on delete cascade,
  level         int,
  created_at    timestamptz not null default now(),
  primary key (candidate_id, skill_id)
);

-- TRANSACTION: Jobs
create table if not exists public.cv_t_jobs (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  level        text,
  location     text,
  status       text not null default 'open',
  description  text,
  requirements jsonb,
  created_at   timestamptz not null default now()
);

-- (Optional) Matches – để FE tính điểm sau này
create table if not exists public.cv_t_matches (
  id            uuid primary key default gen_random_uuid(),
  candidate_id  uuid not null references public.cv_t_candidates(id) on delete cascade,
  job_id        uuid not null references public.cv_t_jobs(id)       on delete cascade,
  score         int  not null,
  explanation   text,
  created_at    timestamptz not null default now(),
  unique (candidate_id, job_id)
);

-- (Optional) Views giữ nguyên tên để FE đang dùng vẫn chạy
create or replace view public.candidates as
  select id, full_name, email, phone, seniority, current_title, location,
         status, match_score, created_at, updated_at
  from public.cv_t_candidates;

create or replace view public.skills as
  select id, code, name, created_at, updated_at
  from public.cv_m_skills;

create or replace view public.candidate_skills as
  select candidate_id, skill_id, level, created_at
  from public.cv_t_candidate_skills;

create or replace view public.jobs as
  select id, title, level, location, status, description, requirements, created_at
  from public.cv_t_jobs;

create or replace view public.matches as
  select id, candidate_id, job_id, score, explanation, created_at
  from public.cv_t_matches;

