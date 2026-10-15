import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MainPage() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    userName?: string;
    userEmail?: string;
  }>();
  const userName = params.userName || "Pengguna";
  const userEmail = params.userEmail || "";

  const handleLogout = () => {
    router.replace("/login");
  };

  return (
    <SafeAreaView className="flex-1 bg-[#f7f8fc]">
      <StatusBar style="dark" />
      <View className="flex-1 px-6 pt-8">
        <View className="mb-9 flex-row items-center justify-between">
          <View>
            <Text className="text-sm text-[#777]">Selamat datang,</Text>
            <Text className="mt-1 text-2xl font-bold text-[#171717]">
              {userName}
            </Text>
          </View>
          <View className="h-12 w-12 items-center justify-center rounded-full bg-[#e8efff]">
            <Ionicons name="person-outline" size={24} color="#1769F6" />
          </View>
        </View>

        <View className="rounded-2xl bg-[#1769F6] p-6">
          <View className="mb-5 h-12 w-12 items-center justify-center rounded-xl bg-white/20">
            <Ionicons name="checkmark-circle-outline" size={29} color="white" />
          </View>
          <Text className="mb-2 text-xl font-bold text-white">
            Login berhasil!
          </Text>
          <Text className="text-sm leading-5 text-white/85">
            Anda sudah masuk ke akun. Selamat menggunakan aplikasi.
          </Text>
        </View>

        <View className="mt-6 rounded-xl border border-[#ececf1] bg-white p-5">
          <Text className="mb-2 text-xs font-medium uppercase tracking-wider text-[#888]">
            Email akun
          </Text>
          <Text className="text-base text-[#222]">{userEmail}</Text>
        </View>

        <TouchableOpacity
          accessibilityRole="button"
          activeOpacity={0.8}
          onPress={handleLogout}
          className="mt-auto mb-8 flex-row items-center justify-center rounded-lg border border-[#1769F6] py-3.5"
        >
          <Ionicons name="log-out-outline" size={19} color="#1769F6" />
          <Text className="ml-2 font-semibold text-[#1769F6]">Keluar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
