# Ferdi Mobile

Aplikasi Expo untuk login, registrasi, dan pencatatan dompet pribadi menggunakan Supabase Auth dan database.

## Menyiapkan Supabase

1. Buat project di [Supabase](https://supabase.com/).
2. Salin `.env.example` menjadi `.env`, lalu isi URL project dan anon/publishable key dari pengaturan API Supabase:

   ```env
   EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

3. Buka **SQL Editor** di dashboard Supabase, salin seluruh SQL di bagian [Struktur tabel dompet](#struktur-tabel-dompet) di bawah, lalu klik **Run**. Tabel tidak dibuat otomatis oleh aplikasi; error pada gambar muncul karena SQL ini belum dijalankan pada project Supabase yang dipakai aplikasi.
4. Aktifkan provider Email di **Authentication → Sign In / Providers → Email**.
5. Untuk development tanpa pengiriman email, matikan **Confirm email** pada pengaturan provider Email. Dengan begitu, alamat berformat valid seperti `udin@gmail.com` tidak perlu menerima email konfirmasi dan akun akan langsung masuk. Password `123456` memenuhi validasi aplikasi (minimal 6 karakter), selama minimum password di pengaturan Supabase tidak dibuat lebih panjang.

Supabase membatasi pengiriman email bawaan project baru (2 email per jam). Jika muncul `email rate limit exceeded`, tunggu sampai kuota pulih; mematikan **Confirm email** mencegah email konfirmasi dikirim untuk registrasi berikutnya. Alamat tetap harus berformat email yang valid dan tidak boleh sudah terdaftar.

Jangan masukkan `service_role` key ke aplikasi. Gunakan anon/publishable key; akses tabel dibatasi oleh policy RLS.

## Struktur tabel dompet

Jalankan SQL berikut **satu kali** melalui Supabase → **SQL Editor** → **New query** → **Run**:

```sql
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
```

Struktur kolom `public.dompet`:

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | `uuid` | Primary key, dibuat otomatis |
| `user_id` | `uuid` | Pemilik dompet, mengacu ke `auth.users.id` |
| `nama` | `text` | Nama dompet, wajib diisi |
| `jenis` | `text` | `Tunai`, `Bank`, `E-Wallet`, atau `Lainnya` |
| `saldo` | `numeric(14,2)` | Saldo awal, default `0`, tidak boleh negatif |
| `created_at` | `timestamptz` | Waktu pembuatan, diisi otomatis |

Row Level Security membatasi baca dan tambah dompet pada pengguna yang sedang login. Setelah query sukses, muat ulang aplikasi dan coba simpan dompet lagi. SQL migrasi yang sama juga tersedia di `supabase/migrations/20261103000000_create_dompet.sql`.

## Menjalankan aplikasi

```bash
npm install
npx expo start
```

Setelah mengubah `.env`, mulai ulang Expo agar variabel environment dimuat kembali. Autentikasi menggunakan email dan kata sandi Supabase; halaman utama menampilkan dan menyimpan dompet berdasarkan akun yang sedang login.
