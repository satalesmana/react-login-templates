import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthIllustration } from "../components/AuthIllustration";

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />
      <View className="flex-1 justify-center px-8">
        <Text className="mb-4 text-center text-[22px] font-semibold text-[#151515]">
          Welcome to our app
        </Text>
        <AuthIllustration height={230} />
        <TouchableOpacity
          accessibilityRole="button"
          activeOpacity={0.85}
          onPress={() => router.push("/login")}
          className="mt-10 items-center rounded-md bg-[#1769F6] py-4"
        >
          <Text className="text-base font-bold text-white">Start</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
