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
  verifyRegisteredUser,
} from '../../lib/supabase';

export default function SignInScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: 'error' | 'success';
  } | null>(null);

  function showNotification(message: string, type: 'error' | 'success' = 'error') {
    setNotification({ message, type });
    Alert.alert(type === 'error' ? 'Peringatan' : 'Informasi', message);
  }

  async function signInWithEmail() {
    setNotification(null);

    if (!email.trim() || !password) {
      showNotification('Tolong Masukkan Email dan Password anda yang benar', 'error');
      return;
    }

    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 700));
      const localMatch = await verifyRegisteredUser(email, password);

      if (isSupabaseConfigured) {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password,
        });

        if (error && !localMatch) {
          showNotification('Tolong Masukkan Email dan Password anda yang benar', 'error');
          setLoading(false);
          return;
        }
      } else if (!localMatch) {
        showNotification('Tolong Masukkan Email dan Password anda yang benar', 'error');
        setLoading(false);
        return;
      }

      router.replace('/');
    } catch {
      showNotification('Tolong Masukkan Email dan Password anda yang benar', 'error');
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
          contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingVertical: 24 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1 justify-center">
            <View className="items-center mb-8 mt-4">
              <Logo size="medium" variant="outline" />
              <Text className="text-2xl font-bold mt-6">Sign in your account</Text>
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

            <View className="mb-6">
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
            </View>

            <PrimaryButton
              title={loading ? 'SIGNING IN...' : 'SIGN IN'}
              onPress={() => signInWithEmail()}
              loading={loading}
              disabled={loading}
            />

            <View className="items-center my-6">
              <Text className="text-gray-400 text-sm">or sign in with</Text>
            </View>

            <View className="flex-row justify-between mb-8">
              <SocialButton iconName="google" color="#DB4437" />
              <SocialButton iconName="facebook" color="#4267B2" />
              <SocialButton iconName="twitter" color="#1DA1F2" />
            </View>
          </View>

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
