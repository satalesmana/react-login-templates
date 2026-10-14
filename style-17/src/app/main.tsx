import { useRouter } from "expo-router";
import { ScrollView, Text, View } from "react-native";
import MyButton from "../components/MyButton";

export default function Main() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white">
      <ScrollView
        className="flex-1"
        contentContainerClassName="flex-grow px-[28px] pt-[70px] pb-[40px]"
      >
        {/* Sapaan */}
        <Text className="text-[14px] text-gray-500">Selamat datang,</Text>
        <Text className="mt-1 text-[28px] font-semibold">Andika Saputra</Text>

        {/* Kartu profil */}
        <View className="mt-8 flex-row items-center rounded-[10px] bg-[#0B6EFE] p-5">
          <View className="h-[60px] w-[60px] items-center justify-center rounded-full bg-white">
            <Text className="text-[24px] font-bold text-[#0B6EFE]">A</Text>
          </View>
          <View className="ml-4">
            <Text className="text-[18px] font-bold text-white">
              Andika Saputra
            </Text>
            <Text className="mt-1 text-[13px] text-white">240444020025</Text>
            <Text className="mt-1 text-[13px] text-white">
              Mahasiswa Manajemen Informatika
            </Text>
          </View>
        </View>

        {/* Kartu info */}
        <View className="mt-5 rounded-[10px] border border-[#9CA3AF] p-5">
          <Text className="text-[16px] font-semibold">Status</Text>
          <Text className="mt-2 text-[14px] text-gray-600">
            Kamu berhasil login. Ini adalah halaman utama aplikasi.
          </Text>
        </View>

        {/* Logout */}
        <MyButton
          title="Logout"
          className="mt-8"
          onPress={() => router.replace("/login")}
        />
      </ScrollView>
    </View>
  );
}
