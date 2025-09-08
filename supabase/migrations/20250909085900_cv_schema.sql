-- ====== EXTENSIONS ======
create extension if not exists "pgcrypto";   -- gen_random_uuid
create extension if not exists "pg_trgm";    -- trigram search
create extension if not exists "unaccent";   -- optional

-- ====== COMMON: updated_at trigger ======
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- =========================================================
-- ===============   MASTER TABLES (cv_m_*)  ===============
-- =========================================================

-- Kỹ năng (danh mục)
create table if not exists public.cv_m_skills (
  id          serial primary key,
  code        text unique,            -- tuỳ chọn: mã kỹ năng
  name        text unique not null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create trigger trg_cv_m_skills_updated
before update on public.cv_m_skills
for each row execute function public.set_updated_at();

-- (Tuỳ chọn) cấp độ/level chuẩn hoá (nếu cần)
create table if not exists public.cv_m_levels (
  id          serial primary key,
  name        text unique not null,   -- ví dụ: Junior/Mid/Senior
  weight      int not null default 0, -- dùng khi tính điểm
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create trigger trg_cv_m_levels_updated
before update on public.cv_m_levels
for each row execute function public.set_updated_at();

-- =========================================================
-- ============   TRANSACTION TABLES (cv_t_*)  =============
-- =========================================================

-- Ứng viên
create table if not exists public.cv_t_candidates (
  id             uuid primary key default gen_random_uuid(),
  full_name      text not null,
  email          text,
  phone          text,
  seniority      text,
  current_title  text,
  location       text,
  status         text not null default 'new' check (status in ('new','reviewing','interview','offer','hired','rejected')),
  match_score    int  not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
create index if not exists idx_cv_t_candidates_name_trgm
  on public.cv_t_candidates using gin (full_name gin_trgm_ops);
create index if not exists idx_cv_t_candidates_email_trgm
  on public.cv_t_candidates using gin (email gin_trgm_ops);
create trigger trg_cv_t_candidates_updated
before update on public.cv_t_candidates
for each row execute function public.set_updated_at();

-- CV/Resume (file + dữ liệu parse)
create table if not exists public.cv_t_resumes (
  id                 uuid primary key default gen_random_uuid(),
  candidate_id       uuid not null references public.cv_t_candidates(id) on delete cascade,
  storage_path       text not null,        -- đường dẫn trong Supabase Storage
  original_filename  text not null,
  mime_type          text,
  parsed_text        text,
  parsed_json        jsonb,
  created_at         timestamptz not null default now()
);
create index if not exists idx_cv_t_resumes_candidate on public.cv_t_resumes(candidate_id);
-- fulltext (optional)
-- create index if not exists idx_cv_t_resumes_text on public.cv_t_resumes using gin (to_tsvector('simple', coalesce(parsed_text,'')));

-- Bảng liên kết kỹ năng của ứng viên
create table if not exists public.cv_t_candidate_skills (
  candidate_id  uuid  not null references public.cv_t_candidates(id) on delete cascade,
  skill_id      int   not null references public.cv_m_skills(id)     on delete cascade,
  level         int,                -- 1..5
  created_at    timestamptz not null default now(),
  primary key (candidate_id, skill_id)
);
create index if not exists idx_cv_t_cand_skills_skill on public.cv_t_candidate_skills(skill_id);

-- JD/Job
create table if not exists public.cv_t_jobs (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  level        text,
  location     text,
  status       text not null default 'open' check (status in ('open','closed','draft')),
  description  text,
  requirements jsonb,             -- { skills: [{name,min}], ... }
  created_at   timestamptz not null default now()
);
create index if not exists idx_cv_t_jobs_title_trgm on public.cv_t_jobs using gin (title gin_trgm_ops);
create index if not exists idx_cv_t_jobs_status on public.cv_t_jobs(status);

-- Liệt kê skill yêu cầu cho Job (tuỳ chọn, nếu muốn dạng bảng hoá song song với JSON)
create table if not exists public.cv_t_job_skills (
  job_id     uuid not null references public.cv_t_jobs(id) on delete cascade,
  skill_id   int  not null references public.cv_m_skills(id) on delete cascade,
  min_level  int,
  created_at timestamptz not null default now(),
  primary key (job_id, skill_id)
);

-- Kết quả matching giữa Candidate và Job
create table if not exists public.cv_t_matches (
  id            uuid primary key default gen_random_uuid(),
  candidate_id  uuid not null references public.cv_t_candidates(id) on delete cascade,
  job_id        uuid not null references public.cv_t_jobs(id)       on delete cascade,
  score         int  not null,
  explanation   text,
  created_at    timestamptz not null default now(),
  unique (candidate_id, job_id)
);
create index if not exists idx_cv_t_matches_job on public.cv_t_matches(job_id);
create index if not exists idx_cv_t_matches_candidate on public.cv_t_matches(candidate_id);

-- (Tuỳ chọn) Log/Ghi chú
create table if not exists public.cv_t_activity_logs (
  id            bigserial primary key,
  actor_uid     uuid,                 -- user id nếu dùng supabase auth.getUser
  action        text not null,        -- e.g. 'upload_cv','update_candidate','compute_match'
  ref_type      text,                 -- 'candidate'/'job'...
  ref_id        uuid,
  meta          jsonb,
  created_at    timestamptz not null default now()
);

-- =========================================================
-- ===================  RLS + POLICIES  ====================
-- =========================================================

alter table public.cv_t_candidates        enable row level security;
alter table public.cv_t_resumes           enable row level security;
alter table public.cv_m_skills            enable row level security;
alter table public.cv_m_levels            enable row level security;
alter table public.cv_t_candidate_skills  enable row level security;
alter table public.cv_t_jobs              enable row level security;
alter table public.cv_t_job_skills        enable row level security;
alter table public.cv_t_matches           enable row level security;
alter table public.cv_t_activity_logs     enable row level security;

-- Candidates
do $$
begin
  create policy cv_candidates_select on public.cv_t_candidates
    for select using (auth.role() = 'authenticated');
exception when duplicate_object then null; end$$;
do $$
begin
  create policy cv_candidates_insert on public.cv_t_candidates
    for insert with check (auth.role() = 'authenticated');
exception when duplicate_object then null; end$$;
do $$
begin
  create policy cv_candidates_update on public.cv_t_candidates
    for update using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
exception when duplicate_object then null; end$$;

-- Resumes
do $$
begin
  create policy cv_resumes_select on public.cv_t_resumes
    for select using (auth.role() = 'authenticated');
exception when duplicate_object then null; end$$;
do $$
begin
  create policy cv_resumes_insert on public.cv_t_resumes
    for insert with check (auth.role() = 'authenticated');
exception when duplicate_object then null; end$$;

-- Skills (cho phép public đọc)
do $$
begin
  create policy cv_skills_select on public.cv_m_skills
    for select to public using (true);
exception when duplicate_object then null; end$$;
do $$
begin
  create policy cv_skills_insert on public.cv_m_skills
    for insert with check (auth.role() = 'authenticated');
exception when duplicate_object then null; end$$;

-- Candidate skills
do $$
begin
  create policy cv_candskills_select on public.cv_t_candidate_skills
    for select using (auth.role() = 'authenticated');
exception when duplicate_object then null; end$$;
do $$
begin
  create policy cv_candskills_insert on public.cv_t_candidate_skills
    for insert with check (auth.role() = 'authenticated');
exception when duplicate_object then null; end$$;

-- Jobs (public đọc, authenticated insert)
do $$
begin
  create policy cv_jobs_select on public.cv_t_jobs
    for select to public using (true);
exception when duplicate_object then null; end$$;
do $$
begin
  create policy cv_jobs_insert on public.cv_t_jobs
    for insert with check (auth.role() = 'authenticated');
exception when duplicate_object then null; end$$;

-- Matches
do $$
begin
  create policy cv_matches_select on public.cv_t_matches
    for select using (auth.role() = 'authenticated');
exception when duplicate_object then null; end$$;
do $$
begin
  create policy cv_matches_upsert on public.cv_t_matches
    for insert with check (auth.role() = 'authenticated');
exception when duplicate_object then null; end$$;

-- Activity logs (chỉ đọc cho authenticated; insert khi có hành động)
do $$
begin
  create policy cv_logs_select on public.cv_t_activity_logs
    for select using (auth.role() = 'authenticated');
exception when duplicate_object then null; end$$;
do $$
begin
  create policy cv_logs_insert on public.cv_t_activity_logs
    for insert with check (auth.role() = 'authenticated');
exception when duplicate_object then null; end$$;

-- =========================================================
-- ==============  VIEWS tương thích với app  ==============
-- (giữ code FE hiện tại, vẫn dùng tên bảng cũ)
-- =========================================================

-- Đổi tên view nếu đã tồn tại
drop view if exists public.candidates cascade;
drop view if exists public.skills cascade;
drop view if exists public.candidate_skills cascade;
drop view if exists public.jobs cascade;
drop view if exists public.resumes cascade;
drop view if exists public.matches cascade;

create view public.candidates as
  select id, full_name, email, phone, seniority, current_title, location,
         status, match_score, created_at, updated_at
  from public.cv_t_candidates;

create view public.skills as
  select id, code, name, created_at, updated_at
  from public.cv_m_skills;

create view public.candidate_skills as
  select candidate_id, skill_id, level, created_at
  from public.cv_t_candidate_skills;

create view public.jobs as
  select id, title, level, location, status, description, requirements, created_at
  from public.cv_t_jobs;

create view public.resumes as
  select id, candidate_id, storage_path, original_filename, mime_type, parsed_text, parsed_json, created_at
  from public.cv_t_resumes;

create view public.matches as
  select id, candidate_id, job_id, score, explanation, created_at
  from public.cv_t_matches;

-- =========================================================
-- ==============  STORAGE (bucket & policies)  ============
-- =========================================================

-- Bucket 'resumes' (nếu chưa có)
-- Supabase >= 2024: sử dụng storage.create_bucket(name, public, file_size_limit)
do $$
begin
  perform 1 from storage.buckets where id = 'resumes';
  if not found then
    insert into storage.buckets (id, name, public)
    values ('resumes', 'resumes', false);
  end if;
end $$;

-- Policies cho storage.objects
-- Quyền: authenticated được upload/đọc file thuộc bucket 'resumes'
do $$
begin
  create policy "resumes_read_authenticated"
    on storage.objects for select
    using ( bucket_id = 'resumes' and auth.role() = 'authenticated' );
exception when duplicate_object then null; end$$;

do $$
begin
  create policy "resumes_insert_authenticated"
    on storage.objects for insert
    with check ( bucket_id = 'resumes' and auth.role() = 'authenticated' );
exception when duplicate_object then null; end$$;

do $$
begin
  create policy "resumes_update_authenticated"
    on storage.objects for update
    using ( bucket_id = 'resumes' and auth.role() = 'authenticated' )
    with check ( bucket_id = 'resumes' and auth.role() = 'authenticated' );
exception when duplicate_object then null; end$$;

do $$
begin
  create policy "resumes_delete_authenticated"
    on storage.objects for delete
    using ( bucket_id = 'resumes' and auth.role() = 'authenticated' );
exception when duplicate_object then null; end$$;
