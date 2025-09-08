-- ===== CV MANAGEMENT SEED (idempotent) =====

-- 1) Skills (cv_m_skills)
insert into public.cv_m_skills (code, name)
select * from (values
  ('react','React'),
  ('next','Next.js'),
  ('ts','TypeScript'),
  ('node','Node.js'),
  ('python','Python'),
  ('sql','SQL'),
  ('aws','AWS'),
  ('docker','Docker'),
  ('k8s','Kubernetes'),
  ('java','Java'),
  ('csharp','C#'),
  ('ml','Machine Learning')
) as v(code,name)
where not exists (
  select 1 from public.cv_m_skills s where s.name = v.name
);

-- 2) Candidates (cv_t_candidates)
insert into public.cv_t_candidates (full_name, email, phone, seniority, current_title, location, status, match_score)
select * from (values
  ('Nguyen Van A','a@example.com','0901000001','mid','Frontend Dev','Hà Nội','new',0),
  ('Tran Thi B','b@example.com','0901000002','senior','Data Scientist','Hồ Chí Minh','new',0),
  ('Le Van C','c@example.com','0901000003','junior','Backend Dev','Đà Nẵng','new',0),
  ('Pham Thi D','d@example.com','0901000004','mid','Fullstack Dev','Hà Nội','reviewing',0),
  ('Hoang Van E','e@example.com','0901000005','senior','DevOps Engineer','Hà Nội','new',0),
  ('Vu Thi F','f@example.com','0901000006','mid','QA Engineer','HCM','new',0),
  ('Do Van G','g@example.com','0901000007','junior','Data Analyst','Đà Nẵng','new',0),
  ('Bui Thi H','h@example.com','0901000008','senior','ML Engineer','HCM','new',0)
) as v(full_name,email,phone,seniority,current_title,location,status,match_score)
where not exists (
  select 1 from public.cv_t_candidates c where c.email = v.email
);

-- Helper CTEs
with s as (select id, name from public.cv_m_skills),
     c as (select id, full_name, email from public.cv_t_candidates)

-- 3) Candidate skills (cv_t_candidate_skills)
-- Nguyen Van A: React, Next.js, TypeScript
insert into public.cv_t_candidate_skills (candidate_id, skill_id, level)
select (select id from c where email='a@example.com'),
       (select id from s where name='React'), 4
where not exists (
  select 1 from public.cv_t_candidate_skills x
  where x.candidate_id = (select id from c where email='a@example.com')
    and x.skill_id = (select id from s where name='React')
);

insert into public.cv_t_candidate_skills (candidate_id, skill_id, level)
select (select id from c where email='a@example.com'),
       (select id from s where name='Next.js'), 4
where not exists (
  select 1 from public.cv_t_candidate_skills x
  where x.candidate_id = (select id from c where email='a@example.com')
    and x.skill_id = (select id from s where name='Next.js')
);

insert into public.cv_t_candidate_skills (candidate_id, skill_id, level)
select (select id from c where email='a@example.com'),
       (select id from s where name='TypeScript'), 3
where not exists (
  select 1 from public.cv_t_candidate_skills x
  where x.candidate_id = (select id from c where email='a@example.com')
    and x.skill_id = (select id from s where name='TypeScript')
);

-- Tran Thi B: Python, SQL, AWS, ML
insert into public.cv_t_candidate_skills (candidate_id, skill_id, level)
select (select id from c where email='b@example.com'),
       (select id from s where name='Python'), 5
where not exists (
  select 1 from public.cv_t_candidate_skills x
  where x.candidate_id = (select id from c where email='b@example.com')
    and x.skill_id = (select id from s where name='Python')
);

insert into public.cv_t_candidate_skills (candidate_id, skill_id, level)
select (select id from c where email='b@example.com'),
       (select id from s where name='SQL'), 5
where not exists (
  select 1 from public.cv_t_candidate_skills x
  where x.candidate_id = (select id from c where email='b@example.com')
    and x.skill_id = (select id from s where name='SQL')
);

insert into public.cv_t_candidate_skills (candidate_id, skill_id, level)
select (select id from c where email='b@example.com'),
       (select id from s where name='AWS'), 4
where not exists (
  select 1 from public.cv_t_candidate_skills x
  where x.candidate_id = (select id from c where email='b@example.com')
    and x.skill_id = (select id from s where name='AWS')
);

insert into public.cv_t_candidate_skills (candidate_id, skill_id, level)
select (select id from c where email='b@example.com'),
       (select id from s where name='Machine Learning'), 5
where not exists (
  select 1 from public.cv_t_candidate_skills x
  where x.candidate_id = (select id from c where email='b@example.com')
    and x.skill_id = (select id from s where name='Machine Learning')
);

-- Le Van C: Node.js, SQL
insert into public.cv_t_candidate_skills (candidate_id, skill_id, level)
select (select id from c where email='c@example.com'),
       (select id from s where name='Node.js'), 3
where not exists (
  select 1 from public.cv_t_candidate_skills x
  where x.candidate_id = (select id from c where email='c@example.com')
    and x.skill_id = (select id from s where name='Node.js')
);

insert into public.cv_t_candidate_skills (candidate_id, skill_id, level)
select (select id from c where email='c@example.com'),
       (select id from s where name='SQL'), 3
where not exists (
  select 1 from public.cv_t_candidate_skills x
  where x.candidate_id = (select id from c where email='c@example.com')
    and x.skill_id = (select id from s where name='SQL')
);

-- Pham Thi D: React, Node.js
insert into public.cv_t_candidate_skills (candidate_id, skill_id, level)
select (select id from c where email='d@example.com'),
       (select id from s where name='React'), 3
where not exists (
  select 1 from public.cv_t_candidate_skills x
  where x.candidate_id = (select id from c where email='d@example.com')
    and x.skill_id = (select id from s where name='React')
);

insert into public.cv_t_candidate_skills (candidate_id, skill_id, level)
select (select id from c where email='d@example.com'),
       (select id from s where name='Node.js'), 3
where not exists (
  select 1 from public.cv_t_candidate_skills x
  where x.candidate_id = (select id from c where email='d@example.com')
    and x.skill_id = (select id from s where name='Node.js')
);

-- Hoang Van E: AWS, Docker, Kubernetes
insert into public.cv_t_candidate_skills (candidate_id, skill_id, level)
select (select id from c where email='e@example.com'),
       (select id from s where name='AWS'), 4
where not exists (
  select 1 from public.cv_t_candidate_skills x
  where x.candidate_id = (select id from c where email='e@example.com')
    and x.skill_id = (select id from s where name='AWS')
);

insert into public.cv_t_candidate_skills (candidate_id, skill_id, level)
select (select id from c where email='e@example.com'),
       (select id from s where name='Docker'), 4
where not exists (
  select 1 from public.cv_t_candidate_skills x
  where x.candidate_id = (select id from c where email='e@example.com')
    and x.skill_id = (select id from s where name='Docker')
);

insert into public.cv_t_candidate_skills (candidate_id, skill_id, level)
select (select id from c where email='e@example.com'),
       (select id from s where name='Kubernetes'), 3
where not exists (
  select 1 from public.cv_t_candidate_skills x
  where x.candidate_id = (select id from c where email='e@example.com')
    and x.skill_id = (select id from s where name='Kubernetes')
);

-- Bổ sung vài candidate khác nhẹ nhàng
insert into public.cv_t_candidate_skills (candidate_id, skill_id, level)
select (select id from c where email='f@example.com'),
       (select id from s where name='TypeScript'), 3
where not exists (
  select 1 from public.cv_t_candidate_skills x
  where x.candidate_id = (select id from c where email='f@example.com')
    and x.skill_id = (select id from s where name='TypeScript')
);

insert into public.cv_t_candidate_skills (candidate_id, skill_id, level)
select (select id from c where email='g@example.com'),
       (select id from s where name='SQL'), 3
where not exists (
  select 1 from public.cv_t_candidate_skills x
  where x.candidate_id = (select id from c where email='g@example.com')
    and x.skill_id = (select id from s where name='SQL')
);

insert into public.cv_t_candidate_skills (candidate_id, skill_id, level)
select (select id from c where email='h@example.com'),
       (select id from s where name='Machine Learning'), 5
where not exists (
  select 1 from public.cv_t_candidate_skills x
  where x.candidate_id = (select id from c where email='h@example.com')
    and x.skill_id = (select id from s where name='Machine Learning')
);

-- 4) Jobs (cv_t_jobs) + requirements JSON
insert into public.cv_t_jobs (title, level, location, status, description, requirements)
select * from (values
  (
    'Frontend Developer','mid','Hà Nội','open',
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
    'Data Scientist','senior','Hồ Chí Minh','open',
    'Phân tích dữ liệu, ML cơ bản',
    '{
      "skills": [
        {"name": "Python", "min": 4},
        {"name": "SQL", "min": 4},
        {"name": "Machine Learning", "min": 4}
      ]
    }'::jsonb
  ),
  (
    'Backend Engineer','mid','Đà Nẵng','open',
    'Phát triển API với Node.js/SQL',
    '{
      "skills": [
        {"name": "Node.js", "min": 3},
        {"name": "SQL", "min": 3}
      ]
    }'::jsonb
  ),
  (
    'DevOps Engineer','senior','Hà Nội','open',
    'Triển khai hạ tầng AWS/Docker/Kubernetes',
    '{
      "skills": [
        {"name": "AWS", "min": 3},
        {"name": "Docker", "min": 3},
        {"name": "Kubernetes", "min": 3}
      ]
    }'::jsonb
  )
) as v(title, level, location, status, description, requirements)
where not exists (
  select 1 from public.cv_t_jobs j where j.title = v.title and j.location = v.location
);
