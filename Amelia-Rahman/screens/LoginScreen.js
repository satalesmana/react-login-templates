import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { users } from '../store';

export default function LoginScreen({ navigation }) {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');

  const login = () => {
    const user = users.find((u) => [u.email, u.phone, u.name].includes(id) && u.password === password);
    if (!user) return Alert.alert('Error', 'Akun atau password salah');
    navigation.replace('Main', { name: user.name });
  };

  const inputStyle = { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 12 };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff', padding: 24, paddingTop: 60 }}>
      <Text style={{ fontSize: 30, fontWeight: 'bold' }}>Lets Sign you in</Text>
      <Text style={{ fontSize: 20, marginTop: 8, marginBottom: 32 }}>Welcome Back ,{'\n'}You have been missed</Text>

      <TextInput placeholder="Email ,phone & username" autoCapitalize="none" value={id} onChangeText={setId} style={inputStyle} />
      <TextInput placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} style={inputStyle} />

      <Text style={{ textAlign: 'right', fontSize: 12, marginBottom: 16 }}>Forgot Password ?</Text>

      <TouchableOpacity onPress={login} style={{ backgroundColor: '#000', padding: 16, borderRadius: 8 }}>
        <Text style={{ color: '#fff', textAlign: 'center', fontWeight: 'bold' }}>Sign in</Text>
      </TouchableOpacity>

      <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 20 }}>
        <View style={{ flex: 1, height: 1, backgroundColor: '#ccc' }} />
        <Text style={{ marginHorizontal: 12, fontWeight: 'bold' }}>or</Text>
        <View style={{ flex: 1, height: 1, backgroundColor: '#ccc' }} />
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 28 }}>
        <FontAwesome name="google" size={24} color="#DB4437" />
        <FontAwesome name="facebook" size={24} color="#3B5998" />
        <FontAwesome name="apple" size={26} color="#000" />
      </View>

      <Text style={{ textAlign: 'center', marginTop: 32 }}>
        Don't have an account ?{' '}
        <Text style={{ fontWeight: 'bold' }} onPress={() => navigation.navigate('Register')}>Register Now</Text>
      </Text>
    </View>
  );
}