-- SQL Schema untuk tabel "dompet" di Supabase
-- Sesuai materi: https://satalesmana.github.io/blog/supabase/

-- 1. Create table dompet
create table if not exists dompet (
  id serial primary key,
  userId text not null,
  name text not null,
  balance integer not null default 0,
  cardBackground text not null,
  cardColor text not null,
  updated_at timestamptz default now(),
  created_at timestamptz default now()
);

-- 2. Grant akses select anon (opsional)
grant select on public.dompet to anon;

-- 3. Turn on Row Level Security (RLS)
alter table "dompet" enable row level security;

-- 4. Policy: Anyone can read dompet
create policy "dompet is public"
  on dompet
  for select
  to anon, authenticated
  using (true);

-- 5. Policy: Authenticated users can insert
create policy "Authenticated users can submit scores"
  on dompet
  for insert
  to authenticated
  with check (true);

-- 6. Policy: Authenticated users can update
create policy "Authenticated users can update scores"
  on dompet
  for update
  to authenticated
  using (true)
  with check (true);
