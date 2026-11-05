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
        className="mt-[50px] w-full max-w-[310px]"
        style={{ aspectRatio: 310 / 187 }}
        source={require("../../assets/images/cover.png")}
        resizeMode="contain"
      />

      <MyButton
        title="Start"
        className="mt-[50px]"
        onPress={() => router.push("/login")}
      />
    </ScrollView>
  );
}
