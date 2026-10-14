import { Text, View, Image } from "react-native";
import { useRouter } from "expo-router";

import CustomButton from "@/components/Button";

export default function Index() {
  const router = useRouter();

  function handleLoginPress() {
    router.push("/login");
  }

  function handleRegisterPress() {
    router.push("/register");
  }

  return (
    <View className="flex h-screen p-9">

      <View className="flex-grow items-center justify-center">
        <Image source={require('@/assets/images/splash-screen.png')} />
      </View>

      <Text className="text-[32px] font-medium text-center">Welcome To Light</Text>

      <View className="mt-[50px] flex items-center">
        <CustomButton title="Create an account" onPress={handleRegisterPress} />
        <Text className="mt-[22px] font-bold" onPress={handleLoginPress}>I already have an account</Text>
      </View>

    </View>
  );
}
