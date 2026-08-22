-- FC Erlinsbach App — initial schema
-- Run this in the Supabase SQL editor (or via `supabase db push`) on a fresh project.

-- ─────────────────────────────────────────────────────────────
-- Extensions
-- ─────────────────────────────────────────────────────────────
create extension if not exists "pgcrypto";

-- ─────────────────────────────────────────────────────────────
-- Profiles (links Supabase Auth users to an admin role)
-- ─────────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  role text not null default 'admin' check (role in ('admin')),
  created_at timestamptz not null default now()
);

-- Auto-create a profile row whenever a new auth user is created.
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─────────────────────────────────────────────────────────────
-- Teams (Aktive, Junioren, Senioren, ...)
-- ─────────────────────────────────────────────────────────────
create table if not exists public.teams (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null default 'Aktive',
  league text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────
-- Players
-- ─────────────────────────────────────────────────────────────
create table if not exists public.players (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references public.teams (id) on delete cascade,
  first_name text not null,
  last_name text not null,
  position text,
  jersey_number int,
  photo_url text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────
-- News / match reports
-- ─────────────────────────────────────────────────────────────
create table if not exists public.news (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique,
  content text not null,
  image_url text,
  author text,
  published_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────
-- Matches (fixtures + results)
-- ─────────────────────────────────────────────────────────────
create table if not exists public.matches (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references public.teams (id) on delete cascade,
  opponent text not null,
  home_away text not null default 'home' check (home_away in ('home', 'away')),
  competition text,
  location text,
  match_date timestamptz not null,
  home_score int,
  away_score int,
  status text not null default 'scheduled' check (status in ('scheduled', 'finished', 'cancelled', 'postponed')),
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────
-- Sponsors
-- ─────────────────────────────────────────────────────────────
create table if not exists public.sponsors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo_url text,
  website_url text,
  tier text not null default 'bronze' check (tier in ('gold', 'silver', 'bronze')),
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────
-- Contacts (Vorstand / board members)
-- ─────────────────────────────────────────────────────────────
create table if not exists public.contacts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null,
  email text,
  phone text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────
-- Club info (singleton row: address, general contact, social links)
-- ─────────────────────────────────────────────────────────────
create table if not exists public.club_info (
  id int primary key default 1 check (id = 1),
  address text,
  email text,
  phone text,
  website text,
  facebook_url text,
  instagram_url text,
  updated_at timestamptz not null default now()
);
insert into public.club_info (id) values (1) on conflict (id) do nothing;

-- ─────────────────────────────────────────────────────────────
-- Row Level Security
-- ─────────────────────────────────────────────────────────────
alter table public.profiles enable row level security;
alter table public.teams enable row level security;
alter table public.players enable row level security;
alter table public.news enable row level security;
alter table public.matches enable row level security;
alter table public.sponsors enable row level security;
alter table public.contacts enable row level security;
alter table public.club_info enable row level security;

-- Everyone (anon + authenticated) can read all public content.
create policy "Public read teams" on public.teams for select using (true);
create policy "Public read players" on public.players for select using (true);
create policy "Public read news" on public.news for select using (true);
create policy "Public read matches" on public.matches for select using (true);
create policy "Public read sponsors" on public.sponsors for select using (true);
create policy "Public read contacts" on public.contacts for select using (true);
create policy "Public read club_info" on public.club_info for select using (true);

-- Only signed-in users with a profile row (i.e. invited admins) can write.
create policy "Admins can view own profile" on public.profiles for select using (auth.uid() = id);

create policy "Admins manage teams" on public.teams for all
  using (exists (select 1 from public.profiles where id = auth.uid()))
  with check (exists (select 1 from public.profiles where id = auth.uid()));

create policy "Admins manage players" on public.players for all
  using (exists (select 1 from public.profiles where id = auth.uid()))
  with check (exists (select 1 from public.profiles where id = auth.uid()));

create policy "Admins manage news" on public.news for all
  using (exists (select 1 from public.profiles where id = auth.uid()))
  with check (exists (select 1 from public.profiles where id = auth.uid()));

create policy "Admins manage matches" on public.matches for all
  using (exists (select 1 from public.profiles where id = auth.uid()))
  with check (exists (select 1 from public.profiles where id = auth.uid()));

create policy "Admins manage sponsors" on public.sponsors for all
  using (exists (select 1 from public.profiles where id = auth.uid()))
  with check (exists (select 1 from public.profiles where id = auth.uid()));

create policy "Admins manage contacts" on public.contacts for all
  using (exists (select 1 from public.profiles where id = auth.uid()))
  with check (exists (select 1 from public.profiles where id = auth.uid()));

create policy "Admins manage club_info" on public.club_info for all
  using (exists (select 1 from public.profiles where id = auth.uid()))
  with check (exists (select 1 from public.profiles where id = auth.uid()));

-- ─────────────────────────────────────────────────────────────
-- Storage bucket for images (logos, news photos, player photos)
-- ─────────────────────────────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

create policy "Public read media" on storage.objects for select
  using (bucket_id = 'media');

create policy "Admins upload media" on storage.objects for insert
  with check (bucket_id = 'media' and exists (select 1 from public.profiles where id = auth.uid()));

create policy "Admins update media" on storage.objects for update
  using (bucket_id = 'media' and exists (select 1 from public.profiles where id = auth.uid()));

create policy "Admins delete media" on storage.objects for delete
  using (bucket_id = 'media' and exists (select 1 from public.profiles where id = auth.uid()));
