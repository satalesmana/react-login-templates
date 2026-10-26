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
import { SocialButton } from '../../components/button/SocialButton';
import {
  supabase,
  isSupabaseConfigured,
  saveRegisteredUser,
} from '../../lib/supabase';

export default function SignUpScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: 'error' | 'success';
  } | null>(null);

  function showNotification(message: string, type: 'error' | 'success' = 'error') {
    setNotification({ message, type });
    Alert.alert(type === 'error' ? 'Peringatan' : 'Informasi', message);
  }

  async function signUpWithEmail() {
    setNotification(null);

    if (!email.trim()) {
      showNotification('Tolong Masukkan email anda', 'error');
      return;
    }

    if (!password || !confirmPassword || password !== confirmPassword) {
      showNotification('Tolong masukan password yang sama', 'error');
      return;
    }

    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 700));
      await saveRegisteredUser({
        name: name,
        email: email.trim(),
        password: password,
      });

      if (isSupabaseConfigured) {
        const {
          data: { session },
          error,
        } = await supabase.auth.signUp({
          email: email.trim(),
          password: password,
          options: {
            data: {
              full_name: name,
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
          <View className="flex-row justify-between items-center mb-6">
            <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
              <FontAwesome name="arrow-left" size={20} color="black" />
            </TouchableOpacity>
            <Logo size="small" variant="outline" />
          </View>

          <View className="flex-1 justify-center">
            <Text className="text-2xl font-bold mb-6">Create your account</Text>

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
                placeholder="ex: jon.smith@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (notification) setNotification(null);
                }}
              />
              <FormInput
                label="Password"
                placeholder="*********"
                secureTextEntry
                autoCapitalize="none"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (notification) setNotification(null);
                }}
              />
              <FormInput
                label="Confirm password"
                placeholder="*********"
                secureTextEntry
                autoCapitalize="none"
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  if (notification) setNotification(null);
                }}
              />
            </View>

            <View className="flex-row items-center mb-6 pl-1">
              <TouchableOpacity
                onPress={() => setAcceptedTerms(!acceptedTerms)}
                className={`w-4 h-4 border border-primary rounded-sm items-center justify-center mr-2 ${
                  acceptedTerms ? 'bg-primary' : 'bg-white'
                }`}
              >
                {acceptedTerms && <FontAwesome name="check" size={10} color="white" />}
              </TouchableOpacity>
              <Text className="text-gray-500 text-xs">
                I understood the <Text className="text-primary">terms & policy</Text>.
              </Text>
            </View>

            <PrimaryButton
              title={loading ? 'SIGNING UP...' : 'SIGN UP'}
              onPress={() => signUpWithEmail()}
              loading={loading}
              disabled={loading}
            />

            <View className="items-center my-6">
              <Text className="text-gray-400 text-sm">or sign up with</Text>
            </View>

            <View className="flex-row justify-between mb-8">
              <SocialButton iconName="google" color="#DB4437" />
              <SocialButton iconName="facebook" color="#4267B2" />
              <SocialButton iconName="twitter" color="#1DA1F2" />
            </View>
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
