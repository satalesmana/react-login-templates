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

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [agree, setAgree] = useState(false);

  const handleNext = () => {
    if (!name.trim() || !email.trim() || !phone.trim() || !password.trim()) {
      Alert.alert('Belum lengkap', 'Isi semua kolom dulu ya.');
      return;
    }
    if (!agree) {
      Alert.alert('Syarat & Ketentuan', 'Centang persetujuan dulu ya.');
      return;
    }
    Alert.alert('Berhasil', 'Akun dibuat! Silakan masuk.', [
      { text: 'OK', onPress: () => router.replace('/sign-in') },
    ]);
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
          source={require('../assets/images/register.png')}
          style={{ width: 224, height: 208 }}
          resizeMode="contain"
        />
        </View>
        <Text className="text-3xl font-extrabold text-center text-black mt-2">
          Get Started
        </Text>
        <Text className="text-gray-400 text-center text-sm mt-1 mb-8">
          by creating a free account.
        </Text>

        <InputField
          placeholder="Full name"
          icon="person-outline"
          value={name}
          onChangeText={setName}
        />
        <InputField
          placeholder="Valid email"
          icon="mail-outline"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <InputField
          placeholder="Phone number"
          icon="call-outline"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />
        <InputField
          placeholder="Strong Password"
          icon="lock-closed-outline"
          secure
          value={password}
          onChangeText={setPassword}
        />

        <View className="mb-4">
          <Checkbox
            checked={agree}
            onToggle={() => setAgree(!agree)}
            label={
              <Text className="text-sm text-gray-500">
                By checking the box you agree to our{' '}
                <Text className="text-[#f43f5e]">Terms</Text> and{' '}
                <Text className="text-[#f43f5e]">Conditions</Text>.
              </Text>
            }
          />
        </View>

        <PrimaryButton label="Next " onPress={handleNext} />

        <View className="flex-row justify-center mt-8 mb-10">
          <Text className="text-gray-500">Already a member? </Text>
          <TouchableOpacity onPress={() => router.push('/sign-in')}>
            <Text className="text-[#f43f5e] font-semibold">Log In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
