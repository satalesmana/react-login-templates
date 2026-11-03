import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackgroundCircles from '@/components/BackgroundCircles';
import MiniShopLogo from '@/components/MiniShopLogo';
import InputField from '@/components/InputField';
import PrimaryButton from '@/components/PrimaryButton';
import { Colors, Fonts } from '@/constants/theme';
import { supabase } from '@/lib/supabase';

export default function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    if (!name.trim() || !email.trim() || !password) {
      Alert.alert('Belum lengkap', 'Isi nama, email, dan password dulu.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Password terlalu pendek', 'Password minimal 6 karakter.');
      return;
    }
    setLoading(true);
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email.trim(),
      password: password,
      // Nama disimpan di user_metadata, jadi nanti bisa dipakai
      // untuk dompet / profil tanpa tabel tambahan.
      options: { data: { name: name.trim() } },
    });
    setLoading(false);
    if (error) {
      Alert.alert('Register gagal', error.message);
      return;
    }
    if (!session) {
      // Ini terjadi kalau "Confirm email" masih ON di Supabase.
      // Akun sudah dibuat, tapi belum bisa login sampai email dikonfirmasi.
      Alert.alert(
        'Cek email kamu',
        'Akun berhasil dibuat. Konfirmasi lewat link di email dulu, baru login.',
        [{ text: 'OK', onPress: () => router.replace('/login' as never) }],
      );
      return;
    }
    router.replace('/main' as never);
  }

  return (
    <View style={styles.container}>
      <BackgroundCircles height={330} />
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            <Text style={styles.title}>Register</Text>

            <View style={styles.logo}>
              <MiniShopLogo />
            </View>

            <InputField placeholder="Enter your name" value={name} onChangeText={setName} />
            <InputField
              placeholder="Enter email i’d"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              style={{ marginTop: 10 }}
            />
            <InputField
              placeholder="Enter password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              style={{ marginTop: 10 }}
            />

            <PrimaryButton
              title={loading ? 'Memproses...' : 'Register'}
              onPress={handleRegister}
              style={{ marginTop: 100 }}
            />

            <Text style={styles.footer}>
              Already have account ?{' '}
              <Text style={styles.footerLink} onPress={() => router.replace('/login' as never)}>
                Login
              </Text>
            </Text>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingHorizontal: 26, paddingBottom: 32 },
  title: { fontFamily: Fonts.medium, fontSize: 22, color: Colors.text, marginTop: 30 },
  logo: { marginTop: 56, marginBottom: 56, alignItems: 'center' },
  footer: {
    textAlign: 'center',
    marginTop: 40,
    fontFamily: Fonts.regular,
    fontSize: 12,
    color: Colors.muted,
  },
  footerLink: { fontFamily: Fonts.semiBold, color: Colors.text },
});
