-- ============================================
-- WILLPOWER OS — Supabase Schema + RLS + RBAC
-- ============================================

-- 1. TABLE PROFILES
create table if not exists public.profiles (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid references auth.users(id) on delete cascade not null unique,
  theme        text check (theme in ('sport', 'culture', 'focus')),
  goal_minutes int default 60,
  role         text not null default 'user' check (role in ('user', 'admin')),
  created_at   timestamptz default now()
);

-- 2. TABLE CUSTOM HABITS
create table if not exists public.habits (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references auth.users(id) on delete cascade not null,
  name       text not null,
  theme      text,
  created_at timestamptz default now()
);

-- 3. TABLE DAILY LOGS
create table if not exists public.daily_logs (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid references auth.users(id) on delete cascade not null,
  date            date not null,
  credit          int default 0,
  solidity        int default 100,
  checked_habits  text[] default '{}',
  streak          int default 0,
  unique(user_id, date)
);

-- ============================================
-- RLS (Row Level Security)
-- ============================================

alter table public.profiles   enable row level security;
alter table public.habits      enable row level security;
alter table public.daily_logs  enable row level security;

-- PROFILES : user voit/modifie uniquement le sien, admin voit tout
create policy "profiles: user select own"
  on public.profiles for select
  using (auth.uid() = user_id);

create policy "profiles: user insert own"
  on public.profiles for insert
  with check (auth.uid() = user_id);

create policy "profiles: user update own"
  on public.profiles for update
  using (auth.uid() = user_id);

create policy "profiles: user delete own"
  on public.profiles for delete
  using (auth.uid() = user_id);

-- HABITS
create policy "habits: select own"  on public.habits for select using (auth.uid() = user_id);
create policy "habits: insert own"  on public.habits for insert with check (auth.uid() = user_id);
create policy "habits: update own"  on public.habits for update using (auth.uid() = user_id);
create policy "habits: delete own"  on public.habits for delete using (auth.uid() = user_id);

-- DAILY LOGS
create policy "daily_logs: select own"  on public.daily_logs for select using (auth.uid() = user_id);
create policy "daily_logs: insert own"  on public.daily_logs for insert with check (auth.uid() = user_id);
create policy "daily_logs: update own"  on public.daily_logs for update using (auth.uid() = user_id);
create policy "daily_logs: delete own"  on public.daily_logs for delete using (auth.uid() = user_id);

-- ============================================
-- FONCTION : récupérer le rôle d'un user
-- ============================================
create or replace function public.get_user_role(uid uuid)
returns text
language sql
security definer
as $$
  select role from public.profiles where user_id = uid;
$$;
