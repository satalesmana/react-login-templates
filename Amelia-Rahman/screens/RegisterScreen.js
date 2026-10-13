import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { users } from '../store';

const fields = [
  { key: 'name', placeholder: 'Name' },
  { key: 'business', placeholder: 'Buissness name' },
  { key: 'phone', placeholder: 'Phone', keyboardType: 'phone-pad' },
  { key: 'email', placeholder: 'Email', keyboardType: 'email-address', autoCapitalize: 'none' },
  { key: 'password', placeholder: 'Password', secureTextEntry: true },
];

export default function RegisterScreen({ navigation }) {
  const [form, setForm] = useState({ name: '', business: '', phone: '', email: '', password: '' });

  const register = () => {
    if (Object.values(form).some((v) => !v)) return Alert.alert('Error', 'Semua kolom wajib diisi');
    users.push(form);
    Alert.alert('Berhasil', 'Akun dibuat, silakan login');
    navigation.navigate('Login');
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff', padding: 24, paddingTop: 60 }}>
      <Text style={{ fontSize: 30, fontWeight: 'bold' }}>Lets Register Account</Text>
      <Text style={{ fontSize: 20, marginTop: 8, marginBottom: 24 }}>Hello user , you have a greatful journey</Text>

      {fields.map(({ key, ...props }) => (
        <TextInput
          key={key}
          {...props}
          value={form[key]}
          onChangeText={(v) => setForm({ ...form, [key]: v })}
          style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 12 }}
        />
      ))}

      <TouchableOpacity onPress={register} style={{ backgroundColor: '#000', padding: 16, borderRadius: 8, marginTop: 24 }}>
        <Text style={{ color: '#fff', textAlign: 'center', fontWeight: 'bold' }}>Sign in</Text>
      </TouchableOpacity>

      <Text style={{ textAlign: 'center', marginTop: 20 }}>
        Already have an account ?{' '}
        <Text style={{ fontWeight: 'bold' }} onPress={() => navigation.navigate('Login')}>Login</Text>
      </Text>
    </View>
  );
}