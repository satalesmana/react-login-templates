# Expo Auth App — Style 2

Aplikasi mobile (Expo + React Native) berisi 4 layar sesuai desain **Style 2**:
1. **Onboarding** (`app/index.tsx`) — "Kerja tim, semua bisa" (1 gambar ilustrasi)
2. **Sign In** (`app/sign-in.tsx`) — "Yuk, masuk dulu" + tombol sosmed
3. **Register** (`app/register.tsx`) — "Bikin akun dulu"
4. **Admin** (`app/admin.tsx`) — dashboard khusus admin

Styling pakai **Tailwind (NativeWind v4)**, navigasi pakai **expo-router**.

## Login admin (buat demo)

Di layar login, pakai:
- **email:** `admin`
- **password:** `admin123`

→ langsung masuk ke dashboard admin (`app/admin.tsx`).

## Cara jalanin di VS Code

```bash
# 1. Extract zip ini, buka foldernya di VS Code
# 2. Install dependency
npm install

# 3. Jalanin
npx expo start
```

Terus scan QR yang muncul pakai aplikasi **Expo Go** di HP (Android/iOS).
Kalau mau langsung di emulator: `npx expo start --android` / `npx expo start --ios`.

Mau buka di browser laptop (kayak pas sama dosen)?

```bash
npm run web
```

Kebuka di `http://localhost:3000`.

## Ganti gambar ilustrasi

File di `assets/images/` sekarang cuma **placeholder** — cuma 1 file, sesuai
desain Style 2 (layar sign in & register nggak pakai gambar). Tinggal timpa
aja dengan gambarmu pakai nama yang sama persis: `onboarding.png`.

> Catatan: nama file layarnya `sign-in.tsx` (pakai strip, bukan spasi) biar aman
> di semua OS. Rutenya tetap `/sign-in`.

## Struktur folder

```
expo-auth-app/
├── app/
│   ├── _layout.tsx      → Stack navigation (header disembunyikan)
│   ├── index.tsx        → Layar onboarding
│   ├── sign-in.tsx      → Layar login
│   └── register.tsx     → Layar daftar
├── components/
│   ├── InputField.tsx   → Kolom input reusable (ikon di kanan)
│   ├── PrimaryButton.tsx→ Tombol merah gede
│   └── Checkbox.tsx     → Checkbox custom
├── assets/images/       → Ilustrasi (ganti dengan gambarmu)
├── global.css           → Entry Tailwind (NativeWind)
├── tailwind.config.js   → Config Tailwind (wajib ada!)
├── app.json             → Config Expo
├── babel.config.js      → Babel + NativeWind
└── metro.config.js      → Metro + NativeWind
```

## Catatan

- Tombol **Lanjut** sekarang cuma nampilin `Alert` contoh — sambungin ke API/backend
  kampus lo kalau udah ada.
- Warna merah tombol: `#f43f5e`. Ganti di `components/PrimaryButton.tsx`
  (dan `Checkbox.tsx`) kalau mau warna lain.

Selamat ngoding! 🚀
