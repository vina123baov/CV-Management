-- Skills
insert into public.cv_m_skills (name) values
  ('React'), ('Next.js'), ('TypeScript'), ('Python'), ('SQL'), ('AWS')
on conflict (name) do nothing;

-- Jobs
insert into public.cv_t_jobs (title, level, location, status, description, requirements)
values
(
  'Frontend Developer', 'mid', 'Hà Nội', 'open',
  'Xây dựng UI với React/Next.js',
  '{
     "skills": [
       {"name": "React", "min": 3},
       {"name": "Next.js", "min": 3},
       {"name": "TypeScript", "min": 3}
     ]
   }'::jsonb
),
(
  'Data Scientist', 'senior', 'Hồ Chí Minh', 'open',
  'Phân tích dữ liệu, ML cơ bản',
  '{
     "skills": [
       {"name": "Python", "min": 4},
       {"name": "SQL", "min": 4},
       {"name": "AWS", "min": 3}
     ]
   }'::jsonb
)
on conflict do nothing;

-- Candidates
insert into public.cv_t_candidates (full_name, email, location, seniority, current_title)
values
  ('Nguyen Van A','a@example.com','Hà Nội','mid','Frontend Dev'),
  ('Tran Thi B','b@example.com','HCM','senior','Data Scientist')
on conflict do nothing;

-- Map skills cho candidate
with s as (select id, name from public.cv_m_skills),
     c as (select id, full_name from public.cv_t_candidates)
insert into public.cv_t_candidate_skills (candidate_id, skill_id, level)
select (select id from c where full_name='Nguyen Van A'),
       (select id from s where name='React'), 4
on conflict do nothing;

insert into public.cv_t_candidate_skills (candidate_id, skill_id, level)
select (select id from (select id, full_name from public.cv_t_candidates) c where full_name='Nguyen Van A'),
       (select id from (select id, name from public.cv_m_skills) s where name='TypeScript'), 3
on conflict do nothing;

insert into public.cv_t_candidate_skills (candidate_id, skill_id, level)
select (select id from (select id, full_name from public.cv_t_candidates) c where full_name='Tran Thi B'),
       (select id from (select id, name from public.cv_m_skills) s where name='Python'), 5
on conflict do nothing;

insert into public.cv_t_candidate_skills (candidate_id, skill_id, level)
select (select id from (select id, full_name from public.cv_t_candidates) c where full_name='Tran Thi B'),
       (select id from (select id, name from public.cv_m_skills) s where name='SQL'), 5
on conflict do nothing;
