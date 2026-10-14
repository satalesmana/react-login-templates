import { Text, View, Pressable, Image } from "react-native";

export default function Index() {
  return (
    <View className="flex h-screen p-9">
      <View className="flex-grow items-center justify-center">
        <Image source={require('@/assets/images/splash-screen.png')} />
      </View>
      <Text className="text-[32px] font-medium text-center">Welcome To Light</Text>
      <View className="mt-[50px] flex items-center">
        <Pressable className="bg-[#0152FE] w-full h-[62px] flex items-center justify-center px-[15px] py-[10px] rounded-md">
          <Text className="color-white font-bold text-[16px]">
            Create new account
          </Text>
        </Pressable>
        <Text className="mt-[22px] font-bold">I already have an account</Text>
      </View>
    </View>
  );
}
