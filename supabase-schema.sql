-- ═══════════════════════════════════════════
-- APEX V-Taper — Supabase Schema
-- Run this in Supabase SQL Editor
-- ═══════════════════════════════════════════

-- Enable RLS (Row Level Security) on all tables
-- Each user only sees their own data

-- ── PROFILES ──────────────────────────────
create table public.profiles (
  id          uuid references auth.users on delete cascade primary key,
  name        text,
  uid         text unique,           -- apex-xxxx-xxxx legacy ID
  morpho      text default '2m04',
  level       text default 'Avancé',
  created_at  timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, uid)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.email),
    'apex-' || substr(new.id::text, 1, 8)
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ── SESSIONS ──────────────────────────────
create table public.sessions (
  id          uuid default gen_random_uuid() primary key,
  user_id     uuid references public.profiles on delete cascade not null,
  day_idx     integer not null check (day_idx between 0 and 3),
  day_name    text not null,
  date        text not null,          -- 'dd/mm/yyyy' for display
  started_at  timestamptz,
  duration    text,                   -- 'MM:SS'
  mood        text,
  volume_kg   integer default 0,
  sets_done   integer default 0,
  sets_data   jsonb default '{}',     -- {exoIndex: [{w, r, rpe, done}]}
  notes_data  jsonb default '{}',     -- {exoIndex: "note text"}
  cardio      jsonb default '{}',     -- {type, dur, int, cal, note}
  color       text,
  created_at  timestamptz default now()
);

alter table public.sessions enable row level security;

create policy "Users own sessions"
  on public.sessions for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index sessions_user_date on public.sessions(user_id, created_at desc);

-- ── PERSONAL RECORDS ──────────────────────
create table public.personal_records (
  id          uuid default gen_random_uuid() primary key,
  user_id     uuid references public.profiles on delete cascade not null,
  exercise    text not null,
  weight_kg   numeric not null,
  reps        integer not null,
  date        text not null,
  created_at  timestamptz default now(),
  unique(user_id, exercise)           -- one PR per exercise
);

alter table public.personal_records enable row level security;

create policy "Users own PRs"
  on public.personal_records for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ── JOURNAL DE FORME ──────────────────────
create table public.journal_entries (
  id          uuid default gen_random_uuid() primary key,
  user_id     uuid references public.profiles on delete cascade not null,
  date        text not null,          -- 'dd/mm/yyyy'
  energy      integer check (energy between 1 and 5),
  motiv       integer check (motiv between 1 and 5),
  stress      integer check (stress between 1 and 5),
  note        text,
  created_at  timestamptz default now(),
  unique(user_id, date)
);

alter table public.journal_entries enable row level security;

create policy "Users own journal"
  on public.journal_entries for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ── WEIGHT TRACKING ───────────────────────
create table public.weight_logs (
  id          uuid default gen_random_uuid() primary key,
  user_id     uuid references public.profiles on delete cascade not null,
  date        text not null,
  weight_kg   numeric not null,
  created_at  timestamptz default now(),
  unique(user_id, date)
);

alter table public.weight_logs enable row level security;

create policy "Users own weight logs"
  on public.weight_logs for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ── OBJECTIF ──────────────────────────────
create table public.objectifs (
  id          uuid default gen_random_uuid() primary key,
  user_id     uuid references public.profiles on delete cascade not null,
  start_weight  numeric,
  target_weight numeric,
  target_date   text default '01/05/2025',
  age           integer,
  created_at    timestamptz default now(),
  unique(user_id)
);

alter table public.objectifs enable row level security;

create policy "Users own objectif"
  on public.objectifs for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
