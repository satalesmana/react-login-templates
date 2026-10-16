// app/login.tsx
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View, SafeAreaView } from 'react-native';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('hello@example.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [keepSigned, setKeepSigned] = useState(true);
 
  // Fungsi penanganan saat tombol login ditekan (Membaca nama & mengirim parameter ke /main)
  const handleLogin = () => {
    // Validasi sederhana
    if (!email || !password) {
      const msg = 'Silakan masukkan Email dan Password terlebih dahulu!';
      if (Platform.OS === 'web') {
        window.alert(msg);
      } else {
        Alert.alert('Peringatan', msg);
      }
      return;
    }

    // Mengambil nama dari teks sebelum '@' di email (misal: sata@gmail.com -> Sata)
    let extractedName = email.split('@')[0];
    if (extractedName) {
      extractedName = extractedName.charAt(0).toUpperCase() + extractedName.slice(1);
    } else {
      extractedName = 'Pengguna';
    }

    // Mengirim parameter nama ke halaman /main
    router.replace({
      pathname: '/main',
      params: { name: extractedName }
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        {/* Header Form */}
        <View style={styles.headerSection}>
          <Text style={styles.title}>Login</Text>
          <Text style={styles.subtitle}>Welcome back to the app</Text>
        </View>

        {/* Input Fields */}
        <View style={styles.formSection}>
          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={styles.input}
            placeholder="hello@example.com"
            placeholderTextColor="#9CA3AF"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <View style={styles.passwordHeader}>
            <Text style={styles.label}>Password</Text>
            <TouchableOpacity>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="••••••••••••"
              placeholderTextColor="#9CA3AF"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons 
                name={showPassword ? "eye-outline" : "eye-off-outline"} 
                size={20} 
                color="#9CA3AF" 
              />
            </TouchableOpacity>
          </View>

          {/* Checkbox Keep me signed in */}
          <TouchableOpacity 
            style={styles.checkboxContainer} 
            onPress={() => setKeepSigned(!keepSigned)}
            activeOpacity={0.8}
          >
            <View style={[styles.checkbox, keepSigned && styles.checkboxChecked]}>
              {keepSigned && <Ionicons name="checkmark" size={12} color="#FFF" />}
            </View>
            <Text style={styles.checkboxLabel}>Keep me signed in</Text>
          </TouchableOpacity>

          {/* Tombol Login */}
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin} activeOpacity={0.8}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or sign in with</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Tombol Google */}
          <TouchableOpacity style={styles.googleButton} onPress={handleLogin} activeOpacity={0.8}>
            <Ionicons name="logo-google" size={18} color="#EA4335" style={{ marginRight: 10 }} />
            <Text style={styles.googleButtonText}>Continue with Google</Text>
          </TouchableOpacity>
        </View>

        {/* Footer / Create Account */}
        <View style={styles.footer}>
          <TouchableOpacity onPress={() => router.push('/register')}>
            <Text style={styles.createAccountText}>Create an account</Text>
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
    paddingTop: 10,
  },
  headerSection: {
    marginTop: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
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
  passwordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  forgotPasswordText: {
    fontSize: 12,
    color: '#3B82F6',
    fontWeight: '500',
  },
  passwordContainer: {
    flexDirection: 'row',
    height: 48,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    marginBottom: 16,
  },
  passwordInput: {
    flex: 1,
    fontSize: 14,
    color: '#1F2937',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    backgroundColor: '#FFF',
  },
  checkboxChecked: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  checkboxLabel: {
    fontSize: 13,
    color: '#4B5563',
  },
  loginButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#3B82F6',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  loginButtonText: {
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
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 12,
    color: '#9CA3AF',
  },
  googleButton: {
    width: '100%',
    height: 48,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 24,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  googleButtonText: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  createAccountText: {
    color: '#3B82F6',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 20,
  },
  homeIndicator: {
    width: 134,
    height: 5,
    backgroundColor: '#1F2937',
    borderRadius: 100,
  },
});