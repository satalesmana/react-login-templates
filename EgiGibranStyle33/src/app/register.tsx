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

export default function RegisterScreen() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Validasi Sederhana
  const isMinLength = password.length >= 8;
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      Alert.alert('Peringatan', 'Semua field wajib diisi!');
      return;
    }

    if (!isMinLength || !hasSpecialChar) {
      Alert.alert('Peringatan', 'Password belum memenuhi kriteria keamanan!');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Peringatan', 'Password dan Confirm Password tidak cocok!');
      return;
    }

    setLoading(true);

    try {
      // Register ke Supabase Auth dengan Metadata Role 'user'
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password,
        options: {
          data: {
            full_name: name.trim(),
            role: 'user', // Otomatis diset sebagai 'user'
          },
        },
      });

      if (error) {
        setLoading(false);
        Alert.alert('Gagal Register', error.message);
        return;
      }

      // Beri delay singkat (1 detik) agar pengalaman transisi loading smooth
      setTimeout(() => {
        setLoading(false);
        Alert.alert(
          'Registrasi Berhasil!',
          'Akun kamu berhasil dibuat. Silakan login menggunakan akun tersebut.',
          [
            {
              text: 'Lanjut Sign In',
              onPress: () => router.push('/signin'),
            },
          ]
        );
      }, 1000);
    } catch (err: any) {
      setLoading(false);
      Alert.alert('Terjadi Kesalahan', err.message || 'Gagal mendaftar akun baru.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        {/* Header Navigation */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton} disabled={loading}>
            <Text style={styles.backButtonText}>{'‹'}</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Register Account</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Lock Icon */}
        <View style={styles.iconContainer}>
          <View style={styles.iconBox}>
            <Text style={styles.lockIcon}>🔒</Text>
          </View>
        </View>

        {/* Title & Subtitle */}
        <Text style={styles.title}>Create new account</Text>
        <Text style={styles.subtitle}>
          {"your new password must be different\nto previously used Passwords."}
        </Text>

        {/* Input Form */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your name"
            placeholderTextColor="#A0A0A0"
            value={name}
            onChangeText={setName}
            editable={!loading}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email address"
            placeholderTextColor="#A0A0A0"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            editable={!loading}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>New Password*</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your new password"
            placeholderTextColor="#A0A0A0"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            editable={!loading}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Confirm Password*</Text>
          <TextInput
            style={styles.input}
            placeholder="Confirm password"
            placeholderTextColor="#A0A0A0"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            editable={!loading}
          />
        </View>

        {/* Password Validation Indicators */}
        <View style={styles.validationContainer}>
          <View style={styles.validationRow}>
            <Text style={[styles.checkIcon, isMinLength && styles.checkIconActive]}>
              {'✓'}
            </Text>
            <Text style={[styles.validationText, isMinLength && styles.validationTextActive]}>
              Must be at least 8 characters
            </Text>
          </View>

          <View style={styles.validationRow}>
            <Text style={[styles.checkIcon, hasSpecialChar && styles.checkIconActive]}>
              {'✓'}
            </Text>
            <Text style={[styles.validationText, hasSpecialChar && styles.validationTextActive]}>
              Must contain one special character
            </Text>
          </View>
        </View>

        {/* Submit Button dengan Loading */}
        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          activeOpacity={0.8}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={styles.submitButtonText}>Submit</Text>
          )}
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
    paddingTop: 50,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  backButton: {
    paddingRight: 10,
  },
  backButtonText: {
    fontSize: 28,
    color: '#333333',
    fontWeight: '300',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  iconContainer: {
    alignItems: 'center',
    marginVertical: 12,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#EEECFB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockIcon: {
    fontSize: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222222',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: '#777777',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 18,
  },
  inputGroup: {
    marginBottom: 14,
  },
  label: {
    fontSize: 14,
    color: '#444444',
    marginBottom: 6,
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
  validationContainer: {
    marginTop: 6,
    marginBottom: 24,
  },
  validationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  checkIcon: {
    fontSize: 12,
    color: '#B0B0B0',
    marginRight: 8,
  },
  checkIconActive: {
    color: '#5B51D8',
  },
  validationText: {
    fontSize: 12,
    color: '#888888',
  },
  validationTextActive: {
    color: '#5B51D8',
  },
  submitButton: {
    backgroundColor: '#5B51D8',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
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
});