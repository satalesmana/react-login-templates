import { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { users } from '../store';

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const register = () => {
    if (!name || !email || !password) return Alert.alert('Error', 'Semua kolom wajib diisi');
    users.push({ name, email, password });
    Alert.alert('Berhasil', 'Akun dibuat, silakan login');
    navigation.navigate('Login');
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 24 }}>
      <Text style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 16 }}>Register</Text>
      <TextInput placeholder="Nama" value={name} onChangeText={setName} style={{ borderWidth: 1, padding: 10, marginBottom: 12 }} />
      <TextInput placeholder="Email" autoCapitalize="none" value={email} onChangeText={setEmail} style={{ borderWidth: 1, padding: 10, marginBottom: 12 }} />
      <TextInput placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} style={{ borderWidth: 1, padding: 10, marginBottom: 12 }} />
      <Button title="Daftar" onPress={register} />
    </View>
  );
}