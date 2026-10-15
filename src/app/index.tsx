import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CLogo from "../components/CLogo";

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    // Optional auto-redirect after 2 seconds if user doesn't tap
    const timer = setTimeout(() => {
      router.push("/login");
    }, 2500);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <SafeAreaView className="flex-1 bg-[#0D1E4C]">
      <StatusBar style="light" />
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => router.push("/login")}
        className="flex-1 items-center justify-center px-6"
      >
        {/* Large Iconic "C" Logo (Gambar 2) */}
        <View className="items-center justify-center">
          <CLogo size={160} variant="orange" />
        </View>

        {/* Subtle hint at bottom */}
        <View className="absolute bottom-12 items-center">
          <Text className="text-white/60 text-xs tracking-widest uppercase">
            Tap to continue
          </Text>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
}