import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';

export default function SignInScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    console.log('--- Proses Sign In (Cek Tabel Users) ---');

    if (!email.trim() || !password) {
      Alert.alert('Peringatan', 'Email dan password wajib diisi!');
      return;
    }

    setLoading(true);

    try {
      // 1. Authenticate ke Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (authError) {
        console.log('Error Auth Supabase:', authError.message);
        setLoading(false);
        Alert.alert('Login Gagal', authError.message || 'Email atau password salah.');
        return;
      }

      const user = authData.user;
      console.log('Auth Sukses! User ID:', user?.id);

      // 2. Ambil data role dan name LANGSUNG dari tabel public.users
      const { data: dbUser, error: dbError } = await supabase
        .from('users')
        .select('role, name')
        .eq('id', user.id)
        .single();

      if (dbError || !dbUser) {
        console.log('Error fetch tabel users:', dbError?.message);
        setLoading(false);
        Alert.alert('Login Gagal', 'Data profil pengguna tidak ditemukan di database.');
        return;
      }

      const userRole = dbUser.role; // 'admin' atau 'user'
      const userName = dbUser.name;
      console.log('Role dari tabel public.users:', userRole);

      setLoading(false);

      // 3. Direct/Navigate Berdasarkan Role secara Langsung (Aman untuk Web & Mobile)
      if (userRole === 'admin') {
        console.log(`Login Admin Berhasil! Selamat datang kembali, ${userName}`);
        router.replace('/admin/dashboard');
      } else {
        console.log(`Login Berhasil! Selamat datang, ${userName}`);
        router.replace('/user/dashboard');
      }

    } catch (err: any) {
      console.error('Exception Catch:', err);
      setLoading(false);
      Alert.alert('Terjadi Kesalahan', err?.message || 'Gagal terhubung ke server.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        {/* Header Logo & Title */}
        <Text style={styles.logoText}>DocuFlex</Text>
        <Text style={styles.title}>Sign In</Text>

        {/* Form Inputs */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor="#A0A0A0"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            editable={!loading}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="********"
            placeholderTextColor="#A0A0A0"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            editable={!loading}
          />
          <TouchableOpacity style={styles.forgotContainer} activeOpacity={0.7} disabled={loading}>
            <Text style={styles.forgotText}>Forgot Password ?</Text>
          </TouchableOpacity>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          activeOpacity={0.8}
          onPress={handleSignIn}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={styles.submitButtonText}>Submit</Text>
          )}
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.orText}>Or</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Social Buttons */}
        <TouchableOpacity style={styles.socialButton} activeOpacity={0.7} disabled={loading}>
          <Text style={styles.socialButtonText}>Continue with Apple</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.socialButton} activeOpacity={0.7} disabled={loading}>
          <Text style={styles.socialButtonText}>Continue with Google</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.socialButton} activeOpacity={0.7} disabled={loading}>
          <Text style={styles.socialButtonText}>Continue with Facebook</Text>
        </TouchableOpacity>

        {/* Link ke Register */}
        <TouchableOpacity
          style={styles.registerLinkContainer}
          activeOpacity={0.7}
          onPress={() => router.push('/register')}
          disabled={loading}
        >
          <Text style={styles.registerLinkText}>Create an Account</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#5B51D8',
    textAlign: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222222',
    textAlign: 'center',
    marginBottom: 28,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#555555',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#333333',
    backgroundColor: '#FFFFFF',
  },
  forgotContainer: {
    alignItems: 'flex-end',
    marginTop: 8,
  },
  forgotText: {
    color: '#5B51D8',
    fontSize: 13,
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: '#5B51D8',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 20,
    height: 50,
    justifyContent: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  orText: {
    marginHorizontal: 12,
    color: '#888888',
    fontSize: 14,
  },
  socialButton: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 13,
    borderRadius: 24,
    alignItems: 'center',
    marginBottom: 12,
  },
  socialButtonText: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '500',
  },
  registerLinkContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  registerLinkText: {
    color: '#222222',
    fontSize: 14,
    fontWeight: '600',
  },
});