create table public.dompet (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  nama text not null check (char_length(btrim(nama)) > 0),
  jenis text not null check (jenis in ('Tunai', 'Bank', 'E-Wallet', 'Lainnya')),
  saldo numeric(14, 2) not null default 0 check (saldo >= 0),
  created_at timestamptz not null default now()
);

create index dompet_user_id_created_at_idx
  on public.dompet (user_id, created_at desc);

alter table public.dompet enable row level security;

create policy "Users can view their own wallets"
  on public.dompet
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can add their own wallets"
  on public.dompet
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

grant select, insert on table public.dompet to authenticated;
