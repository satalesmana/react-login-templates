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
    if (!email || !password) {
      Alert.alert('Error', 'Email dan Password wajib diisi!');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    setLoading(false);

    if (error) {
      Alert.alert('Login Gagal', error.message);
    } else {
      Alert.alert('Sukses', 'Login Berhasil!');
      router.replace('/dompet');
    }
  };

  return (
    <Style5Screen
      type="login"
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      name=""
      setName={() => {}}
      onPress={handleLogin}
      loading={loading}
    />
  );
}