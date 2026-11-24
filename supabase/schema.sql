create table if not exists public.learning_progress (
  id uuid primary key default gen_random_uuid(),
  participant_id uuid not null,
  student_name text not null check (char_length(btrim(student_name)) between 1 and 100),
  activity text not null check (activity in ('pretest', 'materi', 'latihan', 'posttest')),
  score smallint,
  created_at timestamptz not null default now(),
  constraint learning_progress_score_valid check (
    (activity in ('pretest', 'posttest') and score is not null and score between 0 and 100)
    or (activity in ('materi', 'latihan') and score is null)
  )
);

alter table public.learning_progress
  add column if not exists student_name text;

alter table public.learning_progress enable row level security;

revoke all on table public.learning_progress from anon, authenticated, public;
grant insert on table public.learning_progress to anon;

drop policy if exists "Allow anonymous progress submissions" on public.learning_progress;
create policy "Allow anonymous progress submissions"
  on public.learning_progress
  for insert
  to anon
  with check (
    student_name is not null
    and char_length(btrim(student_name)) between 1 and 100
    and activity in ('pretest', 'materi', 'latihan', 'posttest')
    and (
      (activity in ('pretest', 'posttest') and score is not null and score between 0 and 100)
      or (activity in ('materi', 'latihan') and score is null)
    )
  );
