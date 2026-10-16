import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Checkbox from '../components/Checkbox';
import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';


export default function SignInScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);

  const handleNext = () => {
    if (email.trim() === 'revcah@gmail.com' && password === 'rev123') {
    router.replace('/main');
      } else {
    Alert.alert('Gagal masuk', 'Email atau password salah.');
    return;
    }
    router.replace('/main');
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        className="flex-1 px-8"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="items-center mt-2">
        <Image
          source={require('../assets/images/signin.png')}
          style={{ width: 224, height: 208 }}
          resizeMode="contain"
        />
        </View>
        <Text className="text-3xl font-extrabold text-center text-black mt-2">
          Welcome back
        </Text>
        <Text className="text-gray-400 text-center text-sm mt-1 mb-8">
          sign in to access your account
        </Text>

        <InputField
          placeholder="Enter your email"
          icon="mail-outline"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <InputField
          placeholder="Password"
          icon="lock-closed-outline"
          secure
          value={password}
          onChangeText={setPassword}
        />

        <View className="flex-row items-center justify-between mb-4">
          <Checkbox
            checked={remember}
            onToggle={() => setRemember(!remember)}
            label="Remember me"
          />
          <TouchableOpacity
            onPress={() => Alert.alert('Lupa password', 'Fitur demo saja.')}
          >
            <Text className="text-[#f43f5e] text-sm">Forget password ?</Text>
          </TouchableOpacity>
        </View>

        <PrimaryButton label="Next " onPress={handleNext} />

        <View className="flex-row justify-center mt-8 mb-10">
          <Text className="text-gray-500">New Member? </Text>
          <TouchableOpacity onPress={() => router.push('/register')}>
            <Text className="text-[#f43f5e] font-semibold">Register now</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
