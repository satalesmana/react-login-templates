import { useRouter } from "expo-router";
import { Image, ScrollView, Text } from "react-native";
import MyButton from "../components/MyButton";

export default function Index() {
  const router = useRouter();
  return (
    <ScrollView
      className="flex-1 bg-white"
      contentContainerClassName="flex-grow items-center justify-center px-[28px]"
    >
      <Text className="text-[32px] font-medium">Welcome to our app</Text>

      <Image
        className="w-[310px] h-[187px] mt-[50px]"
        source={require("../../assets/images/cover.png")}
      />

      <MyButton
        title="Start"
        className="mt-[50px]"
        onPress={() => router.push("/login")}
      />
    </ScrollView>
  );
}
