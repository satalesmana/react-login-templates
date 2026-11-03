import 'react-native-url-polyfill/auto';
import { AppState, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// Versi TypeScript untuk Style10 (file .ts, jadi tanda `!` boleh dipakai —
// beda dengan Style_12 dulu yang file-nya .js, di situ `!` bikin error).
// .env harus ada DI DALAM folder Style10, bukan di root repo,
// dan jangan pakai tanda < > di sekitar URL/key.
// Kalau di .env kamu namanya ANON_KEY, itu yang dibaca duluan.
// Kalau namanya PUBLISHABLE_KEY (seperti contoh di blog dosen),
// itu juga dibaca sebagai cadangan.
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = (
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY
)!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    ...(Platform.OS !== 'web' ? { storage: AsyncStorage } : {}),
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Supaya token otomatis di-refresh saat app kembali ke foreground (Android/iOS).
if (Platform.OS !== 'web') {
  AppState.addEventListener('change', (state) => {
    if (state === 'active') {
      supabase.auth.startAutoRefresh();
    } else {
      supabase.auth.stopAutoRefresh();
    }
  });
}
