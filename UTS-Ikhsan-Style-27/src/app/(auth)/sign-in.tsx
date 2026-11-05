import { useState } from 'react';
import {
  Alert,
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { Logo } from '../../components/configuration/Logo';
import { FormInput } from '../../components/configuration/FormInput';
import { LoadingUI } from '../../components/configuration/LoadingUI';
import { PrimaryButton } from '../../components/button/PrimaryButton';
import {
  COUNTRY_LIST,
  CountryOption,
  CountrySelector,
} from '../../components/configuration/CountrySelector';
import {
  supabase,
  isSupabaseConfigured,
  verifyRegisteredUser,
} from '../../lib/supabase';

export default function SignInScreen() {
  const router = useRouter();
  const [authType, setAuthType] = useState<'email' | 'phone'>('email');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<CountryOption>(COUNTRY_LIST[0]);
  const [password, setPassword] = useState('');
  const [keepSignedIn, setKeepSignedIn] = useState(true);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: 'error' | 'success';
  } | null>(null);

  const isFormComplete =
    (authType === 'email' ? email.trim().length > 0 : phoneNumber.trim().length > 0) &&
    password.length > 0;

  function showNotification(message: string, type: 'error' | 'success' = 'error') {
    setNotification({ message, type });
    Alert.alert(type === 'error' ? 'Peringatan' : 'Informasi', message);
  }

  async function handleLogin() {
    if (!isFormComplete) return;
    setNotification(null);

    let identifier = '';
    if (authType === 'email') {
      const trimmed = email.trim();
      if (!trimmed) {
        showNotification('Tolong Masukkan email atau nama pengguna anda', 'error');
        return;
      }
      identifier = trimmed.includes('@') ? trimmed : `${trimmed}@gmail.com`;
    } else {
      const cleanPhone = phoneNumber.trim().replace(/^0+/, '');
      if (!cleanPhone) {
        showNotification('Tolong Masukkan nomor telepon anda', 'error');
        return;
      }
      identifier = `${selectedCountry.code}${cleanPhone}`;
    }

    if (!password) {
      showNotification('Tolong Masukkan password anda', 'error');
      return;
    }

    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      const localMatch = await verifyRegisteredUser(identifier, password);

      if (isSupabaseConfigured && authType === 'email') {
        const { error } = await supabase.auth.signInWithPassword({
          email: identifier,
          password: password,
        });

        if (error && !localMatch) {
          showNotification('Email atau Password anda salah', 'error');
          setLoading(false);
          return;
        }
      } else if (!localMatch) {
        showNotification(
          `${authType === 'email' ? 'Email' : 'Nomor Telepon'} atau Password tidak cocok`,
          'error'
        );
        setLoading(false);
        return;
      }

      router.replace('/');
    } catch {
      showNotification('Terjadi kesalahan saat masuk', 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <LoadingUI visible={loading} message="Sedang masuk..." />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingVertical: 16 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-row justify-end items-center mb-4">
            <Logo size="small" variant="outline" />
          </View>

          <View className="flex-1 justify-center">
            {/* Header Login */}
            <View className="mb-6">
              <Text className="text-3xl font-bold text-gray-900">Login</Text>
              <Text className="text-gray-400 text-sm mt-1">Welcome back to the app</Text>
            </View>

            {/* Tab: Email vs Phone Number */}
            <View className="flex-row mb-6 border-b border-gray-100">
              <TouchableOpacity
                onPress={() => setAuthType('email')}
                className={`pb-3 mr-8 ${
                  authType === 'email' ? 'border-b-2 border-primary' : ''
                }`}
              >
                <Text
                  className={`font-semibold text-sm ${
                    authType === 'email' ? 'text-primary font-bold' : 'text-gray-400'
                  }`}
                >
                  Email
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setAuthType('phone')}
                className={`pb-3 ${
                  authType === 'phone' ? 'border-b-2 border-primary' : ''
                }`}
              >
                <Text
                  className={`font-semibold text-sm ${
                    authType === 'phone' ? 'text-primary font-bold' : 'text-gray-400'
                  }`}
                >
                  Phone Number
                </Text>
              </TouchableOpacity>
            </View>

            {/* Notification alert */}
            {notification && (
              <View
                className={`flex-row items-center justify-between px-4 py-3 rounded-lg mb-4 border ${
                  notification.type === 'error'
                    ? 'bg-red-50 border-red-300'
                    : 'bg-green-50 border-green-300'
                }`}
              >
                <View className="flex-row items-center flex-1 mr-2">
                  <FontAwesome
                    name={notification.type === 'error' ? 'exclamation-circle' : 'check-circle'}
                    size={16}
                    color={notification.type === 'error' ? '#dc2626' : '#16a34a'}
                  />
                  <Text
                    className={`ml-2 text-xs font-medium flex-1 ${
                      notification.type === 'error' ? 'text-red-600' : 'text-green-700'
                    }`}
                  >
                    {notification.message}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => setNotification(null)} className="p-1">
                  <FontAwesome
                    name="close"
                    size={14}
                    color={notification.type === 'error' ? '#dc2626' : '#16a34a'}
                  />
                </TouchableOpacity>
              </View>
            )}

            {/* Input Fields */}
            <View className="mb-2">
              {authType === 'email' ? (
                <FormInput
                  label="Email"
                  placeholder="Nama pengguna"
                  suffix="@gmail.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={(text) => {
                    const cleanText = text.replace(/@gmail\.com$/i, '').trim();
                    setEmail(cleanText);
                    if (notification) setNotification(null);
                  }}
                />
              ) : (
                <FormInput
                  label="Phone Number"
                  placeholder="812 3456 7890"
                  keyboardType="phone-pad"
                  value={phoneNumber}
                  onChangeText={(text) => {
                    setPhoneNumber(text);
                    if (notification) setNotification(null);
                  }}
                  prefix={
                    <CountrySelector
                      selectedCountry={selectedCountry}
                      onSelect={setSelectedCountry}
                    />
                  }
                />
              )}

              {/* Password with Eye Toggle Icon */}
              <FormInput
                label="Password"
                placeholder="••••••••••••"
                isPassword
                autoCapitalize="none"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (notification) setNotification(null);
                }}
              />
            </View>

            {/* Checkbox Keep me signed in */}
            <View className="flex-row items-center justify-between mb-6 pl-1">
              <TouchableOpacity
                onPress={() => setKeepSignedIn(!keepSignedIn)}
                className="flex-row items-center"
                activeOpacity={0.8}
              >
                <View
                  className={`w-4 h-4 rounded border items-center justify-center mr-2 ${
                    keepSignedIn ? 'bg-primary border-primary' : 'border-gray-300 bg-gray-200'
                  }`}
                >
                  {keepSignedIn && <FontAwesome name="check" size={10} color="white" />}
                </View>
                <Text className="text-gray-600 text-xs">Keep me signed in</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => showNotification('Fitur reset password belum diaktifkan', 'error')}>
                <Text className="text-primary text-xs font-medium">Forgot Password?</Text>
              </TouchableOpacity>
            </View>

            {/* Login Button */}
            <PrimaryButton
              title={loading ? 'LOGGING IN...' : 'Login'}
              onPress={handleLogin}
              loading={loading}
              disabled={!isFormComplete}
            />

            {/* Divider */}
            <View className="items-center my-5">
              <Text className="text-gray-400 text-xs">or</Text>
            </View>

            {/* Continue with Google Button */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => showNotification('Fitur Google Sign-in dalam tahap persiapan', 'error')}
              className="w-full bg-gray-100 py-3.5 px-4 rounded-full flex-row items-center justify-center mb-4"
            >
              <FontAwesome name="google" size={16} color="#DB4437" />
              <Text className="ml-3 font-semibold text-gray-700 text-sm">
                Continue with Google
              </Text>
            </TouchableOpacity>
          </View>

          {/* Bottom link to Sign Up */}
          <View className="flex-row justify-center mt-auto pt-4">
            <Text className="text-gray-500">Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/sign-up')} className="p-1 -m-1">
              <Text className="text-primary font-bold">SIGN UP</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
