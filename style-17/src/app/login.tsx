import { useRouter } from "expo-router";
import { useState } from "react";
import { Image, ScrollView, Text, View } from "react-native";
import ButtonSocial from "../components/ButtonSocial";
import MyButton from "../components/MyButton";
import MyInput from "../components/MyInput";

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (username.trim() === "tes@gmail.com" && password === "tes123") {
      setError("");
      router.replace("/main");
    } else {
      setError("Email atau password salah");
    }
  };

  return (
    <View className="flex-1 bg-white">
      <Image
        source={require("../../assets/images/cover2.png")}
        className="absolute bottom-0 left-0 w-full"
        style={{ aspectRatio: 390 / 150 }}
        resizeMode="cover"
      />

      <ScrollView
        className="flex-1"
        contentContainerClassName="flex-grow px-[28px] pt-[60px] pb-[40px]"
        keyboardShouldPersistTaps="handled"
      >
        {/* Ilustrasi */}
        <Image
          source={require("../../assets/images/cover.png")}
          className="h-[200px] w-full "
          resizeMode="contain"
        />

        {/* Judul */}
        <Text className="mt-8 text-[22px] font-semibold">Login Details</Text>

        {/* Input */}
        <MyInput
          className="mt-4"
          placeholder="Username , email & phone number"
          value={username}
          onChangeText={setUsername}
        />
        <MyInput
          className="mt-4"
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Text className="mt-2 self-end text-[12px] text-black">
          Forgot Password ?
        </Text>

        {error !== "" && (
          <Text className="mt-3 text-[13px] text-red-500">{error}</Text>
        )}

        <MyButton title="Login" className="mt-8" onPress={handleLogin} />

        <View className="mt-8 flex-row items-center justify-center gap-2">
          <Image
            source={require("../../assets/images/garis-kiri.png")}
            className="h-[2px] flex-1"
            resizeMode="stretch"
          />
          <Text className="text-[10px]">Or Sign up With</Text>
          <Image
            source={require("../../assets/images/garis-kanan.png")}
            className="h-[2px] flex-1"
            resizeMode="stretch"
          />
        </View>

        <View className="mt-5 flex-row items-center justify-center gap-4">
          <ButtonSocial
            icon={require("../../assets/images/google.png")}
            onPress={() => router.push("/register")}
          />
          <ButtonSocial
            icon={require("../../assets/images/facebook.png")}
            onPress={() => router.push("/register")}
          />
          <ButtonSocial
            icon={require("../../assets/images/apple.png")}
            onPress={() => router.push("/register")}
          />
        </View>
      </ScrollView>
    </View>
  );
}
