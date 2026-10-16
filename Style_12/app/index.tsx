import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function WelcomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-8 pt-8">
        <Image
          source={require('../assets/images/onboarding.png')}
          style={{ width: '100%', height: 280, alignSelf: 'center' }}
          resizeMode="contain"
        />
        <Text className="text-[32px] font-extrabold text-black mt-6 leading-10">
          Explore the{'\n'}world easily
        </Text>
        <Text className="text-gray-400 text-lg mt-2">To your desire</Text>

        <View className="flex-1" />

        <View className="flex-row items-center justify-between pb-10">
          <View className="flex-row items-center gap-2">
            <View className="w-7 h-2.5 rounded-full bg-[#f43f5e]" />
            <View className="w-2.5 h-2.5 rounded-full bg-[#fbcdd4]" />
            <View className="w-2.5 h-2.5 rounded-full bg-[#fbcdd4]" />
          </View>
          <TouchableOpacity
            onPress={() => router.push('/sign-in')}
            activeOpacity={0.8}
            className="w-16 h-16 rounded-full bg-black items-center justify-center"
          >
            <Ionicons name="arrow-forward" size={28} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
