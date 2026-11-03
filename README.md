# Tugas UTS Mobile - Template Style 29 (Ghesa Raditya Rodibillah)

Proyek aplikasi mobile menggunakan **React Native Expo (SDK 57)**, **Expo Router**, **NativeWind (Tailwind CSS)**, dan terintegrasi penuh dengan **Supabase Auth** & **Database (Tabel `dompet`)**. Desain antarmuka dibuat presisi mengikuti template **Style 29** pada Figma (Navy `#0D1E4C`, aksen oranye, dan tipografi modern).

---

## 🎯 Fitur yang Diimplementasikan

### 1. Integrasi Flow Supabase Auth (Tugas 1)
- **Splash Screen (`src/app/index.tsx`)**: Mengecek sesi aktif Supabase via `supabase.auth.getSession()`. Jika pengguna sudah login sebelumnya, otomatis diarahkan langsung ke halaman utama (`/main`).
- **Login (`src/app/login.tsx`)**: Login akun menggunakan `supabase.auth.signInWithPassword({ email, password })`. Dilengkapi validasi form, penanganan pesan error Supabase, status loading, dan tombol Forgot Password.
- **Register (`src/app/register.tsx`)**: Registrasi pengguna baru menggunakan `supabase.auth.signUp({ email, password })`. Validasi password minimal 6 karakter, konfirmasi password, serta penanganan konfirmasi email otomatis.
- **Main Dashboard (`src/app/main.tsx`)**: Menampilkan data email dan session aktif dari Supabase, indikator koneksi database, dan fitur Logout aman via `supabase.auth.signOut()`.

### 2. Tabel & UI Input Dompet (Tugas 2)
- **Tabel Database `dompet`**: Skema tabel SQL untuk Supabase dengan dukungan Row Level Security (RLS) lengkap. File SQL siap pakai tersedia di [`supabase_dompet_table.sql`](./supabase_dompet_table.sql).
  - Kolom: `id` (UUID), `user_id` (UUID), `nama_dompet` (Text), `jenis_dompet` (Text: Bank, E-Wallet, Tunai, Tabungan), `saldo` (Numeric), `nomor_rekening` (Text), `catatan` (Text), `created_at`, `updated_at`.
- **UI Input & Manajemen Dompet (`src/app/dompet.tsx`)**:
  - Ringkasan total saldo dompet bergaya kartu elegan Style 29.
  - Form interaktif penambahan dompet (Nama Dompet, Pilihan Jenis Dompet dengan badge/chip, Input Saldo Rupiah dengan tombol cepat +50rb/+100rb/+500rb/+1jt, No. Rekening, dan Catatan).
  - Daftar dompet tersimpan dengan pemformatan mata uang Rupiah otomatis (`Intl.NumberFormat`), badge kategori, dan tombol hapus dengan konfirmasi alert.
  - Dukungan fallback offline storage (`AsyncStorage`) sehingga UI tetap dapat diuji dengan lancar dalam mode demo.

---

## 🚀 Cara Menjalankan Project

### 1. Konfigurasi Supabase
Buka file `.env` di root direktori project, lalu masukkan kredensial Supabase Anda:
```env
EXPO_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJh......
```
*(Kredensial dapat ditemukan di Dashboard Supabase: **Project Settings** -> **API**)*

### 2. Menjalankan Skrip SQL di Supabase
1. Buka [Supabase Dashboard](https://supabase.com/dashboard) project Anda.
2. Masuk ke menu **SQL Editor** -> **New Query**.
3. Salin seluruh isi file [`supabase_dompet_table.sql`](./supabase_dompet_table.sql) lalu klik **Run**.

### 3. Menjalankan Aplikasi
Jalankan perintah berikut di terminal:
```bash
npx expo start
```
Pilihan pengujian:
- Tekan `a` untuk membuka di Android Emulator / HP (via Expo Go).
- Tekan `w` untuk membuka di browser (Web).
- Scan QR code menggunakan aplikasi Expo Go di smartphone Anda.

---

## 📂 Struktur Berkas Utama

```
d:\react-login-templates-ghesa-raditya-rodibillah\
├── .env                         # Konfigurasi URL & Anon Key Supabase
├── supabase_dompet_table.sql    # Skrip SQL DDL & RLS tabel dompet
├── src/
│   ├── app/
│   │   ├── _layout.tsx          # Root Stack Router & konfigurasi transisi
│   │   ├── index.tsx            # Splash Screen & cek sesi aktif Supabase
│   │   ├── login.tsx            # Halaman Login Supabase Auth
│   │   ├── register.tsx         # Halaman Registrasi Pengguna Baru
│   │   ├── main.tsx             # Halaman Utama / Dashboard Session
│   │   └── dompet.tsx           # UI Input Dompet & Daftar Dompet
│   ├── components/
│   │   ├── CLogo.tsx            # Komponen Logo Style 29
│   │   ├── SocialButtons.tsx    # Tombol media sosial
│   │   └── MyButton.tsx         # Reusable button component
│   ├── lib/
│   │   └── supabase.ts          # Supabase client & konfigurasi AsyncStorage
│   └── services/
│       └── dompetService.ts     # CRUD service data tabel dompet
```
