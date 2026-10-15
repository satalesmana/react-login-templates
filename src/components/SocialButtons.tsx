import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

export default function SocialButtons() {
  return (
    <View className="mt-5 items-center">
      <View className="mb-4 w-full flex-row items-center">
        <View className="h-px flex-1 bg-[#d7e5f7]" />
        <Text className="mx-3 text-[10px] text-[#555]">Or sign up with</Text>
        <View className="h-px flex-1 bg-[#d7e5f7]" />
      </View>
      <View className="flex-row items-center gap-3">
        <View className="h-10 w-10 items-center justify-center rounded-full border border-[#f1d5eb] bg-[#fbf4fa]">
          <Ionicons name="logo-google" size={20} color="#4285F4" />
        </View>
        <View className="h-10 w-10 items-center justify-center rounded-full border border-[#f1d5eb] bg-[#fbf4fa]">
          <Ionicons name="logo-facebook" size={20} color="#1877F2" />
        </View>
        <View className="h-10 w-10 items-center justify-center rounded-full border border-[#f1d5eb] bg-[#fbf4fa]">
          <Ionicons name="logo-apple" size={20} color="#111" />
        </View>
      </View>
    </View>
  );
}
