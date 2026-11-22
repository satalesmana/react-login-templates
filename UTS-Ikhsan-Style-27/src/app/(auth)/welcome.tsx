import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Logo } from '../../components/configuration/Logo';
import { useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function WelcomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/sign-in');
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <TouchableOpacity 
      activeOpacity={1} 
      className="flex-1 bg-primary items-center px-6" 
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
      onPress={() => router.replace('/sign-in')}
    >
      <View className="flex-1 items-center justify-center w-full">
        <Logo size="large" />
        <Text className="text-white text-3xl font-bold mt-6 tracking-widest text-center">
          HOPE FOR{"\n"}HUMANITY
        </Text>
      </View>
      <View className="pb-16 pt-8 w-full items-center">
        <Text className="text-white text-2xl font-semibold mb-2 text-center text-green-900">
          Welcome to{"\n"}hope for humanity
        </Text>
      </View>
    </TouchableOpacity>
  );
}
