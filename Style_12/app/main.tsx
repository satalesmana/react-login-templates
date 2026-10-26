import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const PROFILE = {
  nama: 'Muhamad Reva Cahyadi',
  kelas: 'Manajemen Informatika',
  kampus: 'Politeknik LP3I Jakarta',
};

const MENUS: { icon: keyof typeof Ionicons.glyphMap; label: string }[] = [
  { icon: 'compass-outline', label: 'Explore' },
  { icon: 'airplane-outline', label: 'My Trips' },
  { icon: 'ticket-outline', label: 'Tickets' },
  { icon: 'person-outline', label: 'Profile' },
];

export default function MainScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        {}
        <View className="flex-row items-center justify-between mt-4">
          <View className="flex-1 mr-3">
            <Text className="text-gray-400">Halo, selamat datang</Text>
            <Text className="text-xl font-extrabold text-black">
              {PROFILE.nama}
            </Text>
          </View>
          <View className="w-12 h-12 rounded-full bg-[#f43f5e] items-center justify-center">
            <Text className="text-white text-xl font-extrabold">R</Text>
          </View>
        </View>

        {/* kartu identitas: nama + kelas */}
        <View className="bg-[#38bdf8] rounded-3xl p-5 mt-6">
          <Text className="text-white/70 text-sm">Nama</Text>
          <Text className="text-white text-lg font-bold">{PROFILE.nama}</Text>
          <View className="h-px bg-white/20 my-3" />
          <Text className="text-white/70 text-sm">Kelas</Text>
          <Text className="text-white text-lg font-bold">{PROFILE.kelas}</Text>
          <Text className="text-white/70 text-sm mt-3">{PROFILE.kampus}</Text>
        </View>

        <TouchableOpacity
          onPress={() => router.replace('/sign-in')}
          activeOpacity={0.7}
          className="border border-gray-200 rounded-2xl py-4 items-center mb-10"
        >
          <Text className="text-[#f43f5e] font-bold">Keluar</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
