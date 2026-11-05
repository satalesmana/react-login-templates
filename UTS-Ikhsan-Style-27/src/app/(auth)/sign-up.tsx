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
  saveRegisteredUser,
} from '../../lib/supabase';

export default function SignUpScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<CountryOption>(COUNTRY_LIST[0]);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: 'error' | 'success';
  } | null>(null);

  const isFormComplete =
    name.trim().length > 0 &&
    email.trim().length > 0 &&
    phoneNumber.trim().length > 0 &&
    password.length > 0 &&
    confirmPassword.length > 0 &&
    acceptedTerms;

  function showNotification(message: string, type: 'error' | 'success' = 'error') {
    setNotification({ message, type });
    Alert.alert(type === 'error' ? 'Peringatan' : 'Informasi', message);
  }

  async function signUpWithEmail() {
    if (!isFormComplete) return;
    setNotification(null);

    const trimmedEmail = email.trim();
    const identifierEmail = trimmedEmail
      ? (trimmedEmail.includes('@') ? trimmedEmail : `${trimmedEmail}@gmail.com`)
      : '';

    const cleanPhone = phoneNumber.trim().replace(/^0+/, '');
    const identifierPhone = cleanPhone ? `${selectedCountry.code}${cleanPhone}` : '';

    if (!identifierEmail) {
      showNotification('Tolong Masukkan email atau nama pengguna anda', 'error');
      return;
    }

    if (!password || !confirmPassword || password !== confirmPassword) {
      showNotification('Tolong masukkan password yang sama', 'error');
      return;
    }

    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 700));
      await saveRegisteredUser({
        name: name,
        email: identifierEmail,
        phone: identifierPhone || undefined,
        password: password,
      });

      if (isSupabaseConfigured) {
        const {
          data: { session },
          error,
        } = await supabase.auth.signUp({
          email: identifierEmail,
          password: password,
          options: {
            data: {
              full_name: name,
              phone: identifierPhone || undefined,
            },
          },
        });

        if (error) {
          showNotification(error.message, 'error');
          setLoading(false);
          return;
        }
        if (!session) {
          showNotification('Pendaftaran berhasil! Silakan login.', 'success');
        }
      } else {
        showNotification('Pendaftaran berhasil! Silakan login.', 'success');
      }

      setTimeout(() => {
        router.push('/sign-in');
      }, 800);
    } catch {
      showNotification('Terjadi kesalahan saat mendaftar', 'error');
    } finally {
      setLoading(false);
    }
  }

  function handleBack() {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/sign-in');
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <LoadingUI visible={loading} message="Mendaftarkan akun..." />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingVertical: 16 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-row justify-between items-center mb-4">
            <TouchableOpacity onPress={handleBack} className="p-2 -ml-2">
              <FontAwesome name="arrow-left" size={20} color="black" />
            </TouchableOpacity>
            <Logo size="small" variant="outline" />
          </View>

          <View className="flex-1 justify-center">
            {/* Header */}
            <View className="mb-5">
              <Text className="text-3xl font-bold text-gray-900">Create your account</Text>
              <Text className="text-gray-400 text-sm mt-1">Please fill in your details to start</Text>
            </View>

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

            <View className="mb-2">
              <FormInput
                label="Name"
                placeholder="ex: jon smith"
                value={name}
                onChangeText={(text) => setName(text)}
              />

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

              <FormInput
                label="Confirm password"
                placeholder="••••••••••••"
                isPassword
                autoCapitalize="none"
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  if (notification) setNotification(null);
                }}
              />
            </View>

            <View className="flex-row items-center mb-5 pl-1">
              <TouchableOpacity
                onPress={() => setAcceptedTerms(!acceptedTerms)}
                className={`w-4 h-4 border rounded-sm items-center justify-center mr-2 ${
                  acceptedTerms ? 'bg-primary border-primary' : 'bg-gray-200 border-gray-300'
                }`}
              >
                {acceptedTerms && <FontAwesome name="check" size={10} color="white" />}
              </TouchableOpacity>
              <Text className="text-gray-500 text-xs">
                I understood the <Text className="text-primary font-medium">terms & policy</Text>.
              </Text>
            </View>

            <PrimaryButton
              title={loading ? 'SIGNING UP...' : 'SIGN UP'}
              onPress={() => signUpWithEmail()}
              loading={loading}
              disabled={!isFormComplete}
            />

            <View className="items-center my-4">
              <Text className="text-gray-400 text-xs">or</Text>
            </View>

            {/* Continue with Google Button */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => showNotification('Fitur Google Sign-up dalam tahap persiapan', 'error')}
              className="w-full bg-gray-100 py-3.5 px-4 rounded-full flex-row items-center justify-center mb-4"
            >
              <FontAwesome name="google" size={16} color="#DB4437" />
              <Text className="ml-3 font-semibold text-gray-700 text-sm">
                Continue with Google
              </Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row justify-center mt-auto pt-4">
            <Text className="text-gray-500">Have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/sign-in')} className="p-1 -m-1">
              <Text className="text-primary font-bold">SIGN IN</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
