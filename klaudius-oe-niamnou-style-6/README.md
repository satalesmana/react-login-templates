# UTS Mobile Programming - Sistem Login, Registrasi & Dashboard (React Native + Expo)

Tugas Ujian Tengah Semester (UTS) Tahun Ajaran 2026/2027  
**Lembaga Pendidikan dan Pengembangan Profesi Indonesia (LP3I)**  
**Mata Kuliah:** Mobile Programming  
**Dosen Pengampu:** Sata Lesmana, M.Kom.  

---

## 👨‍🎓 Identitas Mahasiswa
* **Nama Lengkap:** Klaudius Oe Naimnou
* **NIM:** 240444020010
* **Kelas:** Informatika Komputer (IK-24)
* **Semester / SKS:** I / 4 SKS
* **Pilihan UI Desain:** **Style 6** (Tercatat di Spreadsheet & Figma)
* **Akun GitHub:** dekuizuku811@gmail.com / [deku-klaudius](https://github.com/deku-klaudius)

---

## 🔑 Akun Siap Pakai (Dapat Langsung Digunakan Login)

| Role | Username / Email | Password | Keterangan |
|---|---|---|---|
| **Admin / Mahasiswa** | `admin@gmail.com` | `test123` | Akun Utama (Otomatis terisi di layar Login) |
| **Mahasiswa** | `klaudius` | `test123` | Akun Mahasiswa (Klaudius Oe Naimnou) |

> **Catatan:** Siapa saja juga dapat mendaftar akun baru langsung di halaman **Register**. Akun yang didaftarkan akan langsung tersimpan secara persisten dan bisa langsung digunakan untuk login!

---

## 📱 Daftar Halaman / Screen Aplikasi (Sesuai Soal UTS Dosen)

1. **Welcome Page / Splash Screen (`src/app/index.tsx`)**
   * Ilustrasi sambutan (Gadis mengendarai vespa mint).
   * Kartu identitas mahasiswa (Nama, NIM, Kelas, Mata Kuliah, Dosen).
   * Tombol navigasi menuju **Login** dan **Register**.

2. **Login Page (`src/app/login.tsx`) - Sesuai Figma Style 6**
   * Ilustrasi dua pebisnis berjabat tangan dalam card rounded.
   * **Tombol Cepat Akun Demo (One-tap Fill)** untuk kemudahan pengujian.
   * Input Username / Email & Input Password dengan tombol toggle tampil/sembunyikan password (👁).
   * Tombol "Lupa password?".
   * Tombol utama **MASUK** warna biru (`#2B92E4`).
   * Pemisah *"Atau masuk menggunakan"*.
   * Tombol login sosial media (Google & Facebook).
   * Tautan pendaftaran *"Belum punya akun? Mendaftar sekarang"*.

3. **Register Page (`src/app/register.tsx`) - Sesuai Figma Style 6**
   * Ilustrasi gadis bersandar di vespa merah.
   * Input form lengkap:
     * Nama Lengkap
     * Email atau Username
     * Nomor HP
     * Password (dengan eye toggle)
     * Konfirmasi Password (dengan eye toggle)
   * Validasi form lengkap.
   * Tombol utama **MENDAFTAR**.
   * Tautan *"Sudah punya akun? silahkan masuk"*.

4. **Success / Verification Notice Page (`src/app/success.tsx`) - Layar Kiri Figma Style 6**
   * Ilustrasi vespa mint.
   * Judul: **SELAMAT! ANDA SUDAH BERHASIL MENDAFTAR**.
   * Teks: *"Silahkan periksa email anda untuk melakukan verifikasi sebelum melakukan Login."*
   * Rincian data akun yang baru saja didaftarkan.
   * Tombol **LANJUTKAN** menuju halaman login.

5. **Main Page / Dashboard (`src/app/dashboard.tsx`) - Ketentuan Soal UTS**
   * Header sapaan: *"Halo, [Nama Pengguna]! 👋"*.
   * **Informasi Wajib Nama dan Kelas Mahasiswa**:
     * Nama: Klaudius Oe Naimnou
     * NIM: 240444020010
     * Kelas: Informatika Komputer (IK-24)
     * Dosen Pengampu: Sata Lesmana, M.Kom.
   * Status Login Sukses (Aktif).
   * Ringkasan Akademik (Beban SKS, Waktu Ujian, Status Tugas).
   * Jadwal Kuliah Hari Ini.
   * **Fitur Tambahan Sederhana: Catatan Cepat (Quick Notes)**: Mahasiswa dapat menambah, melihat, dan menghapus catatan secara interaktif.
   * Tombol **Keluar / Logout Akun** dengan dialog konfirmasi.

---

## 🚀 Cara Menjalankan Aplikasi

Pastikan berada di folder project (`c:\Users\asus\Downloads\uts-mobile-programming`):

### 1. Jalankan di Web Browser (Rekomendasi Cepat & Tanpa Error Port)
```bash
npx expo start --web
```
Buka browser di `http://localhost:8081`.

### 2. Jalankan di HP (Expo Go)
```bash
npx expo start
```
Scan kode QR yang muncul menggunakan aplikasi **Expo Go**.

---

*Dibuat oleh Klaudius Oe Naimnou (240444020010) untuk Ujian Tengah Semester (UTS) Mobile Programming 2026/2027.*
