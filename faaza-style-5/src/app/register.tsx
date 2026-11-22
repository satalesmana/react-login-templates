import React, { useState } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../supabaseClient';
import Style5Screen from '../components/Style5Screen';

export default function RegisterScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    const normalizedEmail = email.trim().toLowerCase();
    if (!name.trim() || !normalizedEmail || !password) {
      Alert.alert('Data belum lengkap', 'Nama, email, dan password wajib diisi.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Password terlalu pendek', 'Gunakan password minimal 6 karakter.');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: normalizedEmail,
        password,
        options: {
          data: { full_name: name.trim() },
        },
      });

      if (error) {
        Alert.alert('Registrasi gagal', error.message);
        return;
      }

      if (data.session) {
        router.replace('/dompet');
        return;
      }

      Alert.alert(
        'Registrasi berhasil',
        'Periksa email untuk konfirmasi akun, lalu masuk dengan akun yang baru dibuat.',
      );
      router.replace('/login');
    } catch (error) {
      Alert.alert(
        'Registrasi gagal',
        error instanceof Error ? error.message : 'Silakan coba lagi.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Style5Screen
      type="register"
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      name={name}
      setName={setName}
      onPress={handleRegister}
      onSwitch={() => router.replace('/login')}
      loading={loading}
    />
  );
}
