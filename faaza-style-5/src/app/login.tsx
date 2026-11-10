import React, { useState } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../supabaseClient';
import Style5Screen from '../components/Style5Screen';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !password) {
      Alert.alert('Data belum lengkap', 'Email dan password wajib diisi.');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      });

      if (error) {
        Alert.alert('Login gagal', error.message);
        return;
      }

      router.replace('/dompet');
    } catch (error) {
      Alert.alert(
        'Login gagal',
        error instanceof Error ? error.message : 'Silakan coba lagi.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Style5Screen
      type="login"
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      onPress={handleLogin}
      onSwitch={() => router.replace('/register')}
      loading={loading}
    />
  );
}
