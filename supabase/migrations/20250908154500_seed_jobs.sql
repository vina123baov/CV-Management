-- Frontend Developer
insert into public.jobs (title, level, location, status, description, requirements)
select
  'Frontend Developer',
  'mid',
  'Hà Nội',
  'open',
  'Tìm kiếm lập trình viên Frontend thành thạo React/Next.js để phát triển giao diện web.',
  '{
     "skills": [
       {"name": "React", "min": 3},
       {"name": "Next.js", "min": 3},
       {"name": "TypeScript", "min": 3}
     ]
   }'::jsonb
where not exists (
  select 1 from public.jobs
  where title = 'Frontend Developer' and location = 'Hà Nội'
);

-- Data Scientist
insert into public.jobs (title, level, location, status, description, requirements)
select
  'Data Scientist',
  'senior',
  'Hồ Chí Minh',
  'open',
  'Cần Data Scientist có kinh nghiệm với Python, SQL và AWS để xây dựng mô hình phân tích dữ liệu.',
  '{
     "skills": [
       {"name": "Python", "min": 4},
       {"name": "SQL", "min": 4},
       {"name": "AWS", "min": 3}
     ]
   }'::jsonb
where not exists (
  select 1 from public.jobs
  where title = 'Data Scientist' and location = 'Hồ Chí Minh'
);
