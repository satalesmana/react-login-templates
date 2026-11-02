import { useEffect, useState } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabase';
import "../../global.css";

export default function RootLayout() {
  const [session, setSession] = useState<Session | null>(null);
  const [initialized, setInitialized] = useState(false);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // 1. Ambil sesi aktif saat aplikasi pertama kali dibuka
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setInitialized(true);
    });

    // 2. Dengarkan perubahan status login (auth state changes)
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  useEffect(() => {
    if (!initialized) return;

    const inAuthGroup = segments[0] === 'login' || segments[0] === 'register' || segments[0] === 'welcome';

    if (!session && !inAuthGroup) {
      // Jika pengguna BELUM login dan tidak sedang di halaman auth, arahkan ke halaman login
      router.replace('/login');
    } else if (session && inAuthGroup) {
      // Jika pengguna SUDAH login tapi masih di halaman auth, arahkan ke halaman utama/profil
      router.replace('/profile'); // atau ke halaman index/home Anda
    }
  }, [session, initialized, segments]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Stack Navigator otomatis membaca file di dalam folder app/ */}
    </Stack>
  );
}