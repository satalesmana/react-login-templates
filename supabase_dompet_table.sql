-- ==========================================================
-- SQL MIGRATION: TABLE "dompet" UNTUK SUPABASE
-- Tugas UTS Pemrograman Mobile - Style 29
-- ==========================================================

-- 1. Buat Tabel dompet
create table if not exists public.dompet (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users(id) on delete cascade,
    nama_dompet text not null,
    jenis_dompet text not null default 'Bank', -- 'Bank', 'E-Wallet', 'Tunai', 'Tabungan', 'Lainnya'
    saldo numeric(15, 2) not null default 0,
    nomor_rekening text,
    catatan text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Aktifkan Row Level Security (RLS)
alter table public.dompet enable row level security;

-- 3. Kebijakan (Policies) RLS untuk Autentikasi Pengguna
-- Pengguna hanya dapat melihat dompet miliknya sendiri
create policy "Users can view their own dompet"
    on public.dompet
    for select
    using (auth.uid() = user_id or user_id is null);

-- Pengguna dapat menambahkan dompet baru
create policy "Users can insert their own dompet"
    on public.dompet
    for insert
    with check (auth.uid() = user_id or user_id is null);

-- Pengguna dapat mengubah data dompet miliknya
create policy "Users can update their own dompet"
    on public.dompet
    for update
    using (auth.uid() = user_id or user_id is null);

-- Pengguna dapat menghapus dompet miliknya
create policy "Users can delete their own dompet"
    on public.dompet
    for delete
    using (auth.uid() = user_id or user_id is null);

-- 4. Fungsi otomatis untuk update kolom updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$ language plpgsql;

create or replace trigger set_updated_at
    before update on public.dompet
    for each row
    execute function public.handle_updated_at();

-- 5. Contoh Data Awal (Opsional untuk testing jika diperlukan):
-- insert into public.dompet (nama_dompet, jenis_dompet, saldo, nomor_rekening, catatan)
-- values 
--   ('BCA Tahapan', 'Bank', 2500000, '5410982341', 'Rekening Gaji & Harian'),
--   ('GoPay Utama', 'E-Wallet', 350000, '081234567890', 'Untuk Transportasi & Makanan'),
--   ('Dompet Tunai', 'Tunai', 500000, null, 'Uang Cash di Dompet Fisik');
