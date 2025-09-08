-- Chuyển public.candidates (nếu là TABLE) thành VIEW trỏ về cv_t_candidates

-- Nếu đang tồn tại VIEW cùng tên thì xoá trước
do $$
begin
  if exists (
    select 1 from pg_class c
    join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public' and c.relname = 'candidates' and c.relkind = 'v'
  ) then
    execute 'drop view public.candidates cascade';
  end if;
end $$;

-- Nếu public.candidates đang là TABLE, xử lý đổi tên/bảo lưu
do $$
declare
  is_table boolean;
  has_cv_t boolean;
  bak_name text;
begin
  select exists (
    select 1 from pg_class c
    join pg_namespace n on n.oid = c.relnamespace
    where n.nspname='public' and c.relname='candidates' and c.relkind='r'  -- 'r' = ordinary table
  ) into is_table;

  select to_regclass('public.cv_t_candidates') is not null into has_cv_t;

  if is_table then
    if not has_cv_t then
      -- TH1: chưa có bảng chuẩn hoá -> rename bảng cũ thành cv_t_candidates
      execute 'alter table public.candidates rename to cv_t_candidates';
    else
      -- TH2: đã có bảng chuẩn hoá -> đổi tên bảng cũ thành bản backup
      bak_name := 'candidates_bak_' || to_char(now(), 'YYYYMMDDHH24MISS');
      execute format('alter table public.candidates rename to %I', bak_name);
      -- (tuỳ chọn) có thể merge dữ liệu từ bản bak sang cv_t_candidates tại đây nếu cần
    end if;
  end if;
end $$;

-- Tạo VIEW để FE dùng tên cũ
create or replace view public.candidates as
  select id, full_name, email, phone, seniority, current_title, location,
         status, match_score, created_at, updated_at
  from public.cv_t_candidates;
