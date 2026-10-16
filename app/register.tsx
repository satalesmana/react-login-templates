// app/register.tsx
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Platform, StyleSheet, Text, TextInput, TouchableOpacity, View, SafeAreaView } from 'react-native';

export default function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = () => {
    // Validasi input kosong
    if (!name || !email || !password) {
      const msg = 'Peringatan: Silakan lengkapi semua data terlebih dahulu!';
      if (Platform.OS === 'web') {
        window.alert(msg);
      } else {
        alert(msg);
      }
      return;
    }

    // Mengambil nama dari input register
    const registeredName = name.trim() || 'Pengguna';

    // Langsung arahkan ke halaman /main sambil membawa parameter nama yang didaftarkan
    router.replace({
      pathname: '/main',
      params: { name: registeredName }
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header Form */}
        <View style={styles.headerSection}>
          <Text style={styles.title}>Buat akun</Text>
        </View>

        {/* Input Fields */}
        <View style={styles.formSection}>
          <Text style={styles.label}>Nama</Text>
          <TextInput
            style={styles.input}
            placeholder="Masukkan nama"
            placeholderTextColor="#9CA3AF"
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.label}>Alamat Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Masukkan email"
            placeholderTextColor="#9CA3AF"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Kata sandi</Text>
          <TextInput
            style={styles.input}
            placeholder="Masukkan password"
            placeholderTextColor="#9CA3AF"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          {/* Tombol Mendaftar */}
          <TouchableOpacity style={styles.signUpButton} onPress={handleRegister} activeOpacity={0.8}>
            <Text style={styles.signUpButtonText}>Mendaftar</Text>
          </TouchableOpacity>
        </View>

        {/* Footer / Login Link */}
        <View style={styles.footer}>
          <TouchableOpacity onPress={() => router.push('/login')}>
            <Text style={styles.footerText}>
              Sudah punya akun? <Text style={styles.linkText}>Login di sini</Text>
            </Text>
          </TouchableOpacity>
          <View style={styles.homeIndicator} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    paddingTop: 10, // Dibuat rapat agar menyesuaikan batas atas perangkat secara natural
  },
  headerSection: {
    marginTop: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
  },
  formSection: {
    marginVertical: 10,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 14,
    color: '#1F2937',
    marginBottom: 16,
    backgroundColor: '#FAFAFA',
  },
  signUpButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#3B82F6',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  signUpButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  footerText: {
    fontSize: 13,
    color: '#4B5563',
    marginBottom: 20,
  },
  linkText: {
    color: '#3B82F6',
    fontWeight: '500',
  },
  homeIndicator: {
    width: 134,
    height: 5,
    backgroundColor: '#1F2937',
    borderRadius: 100,
  },
});