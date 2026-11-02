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
    if (!email || !password) {
      Alert.alert('Error', 'Email dan Password wajib diisi!');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
      },
    });
    setLoading(false);

    if (error) {
      Alert.alert('Register Gagal', error.message);
    } else {
      Alert.alert('Sukses', 'Registrasi berhasil! Silakan login.');
      router.replace('/login');
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
      loading={loading}
    />
  );
}