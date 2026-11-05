import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Image, Pressable, ScrollView, Text, View } from "react-native";
import ButtonSocial from "../components/ButtonSocial";
import MyButton from "../components/MyButton";
import MyInput from "../components/MyInput";
import { supabase } from "../lib/supabase";

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (loading) return;

    if (username.trim() === "" || password === "") {
      setError("Email dan password wajib diisi");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: username.trim(),
      password: password,
    });
    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setError("");
    router.replace("/main");
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
          className="h-[200px] w-full"
          resizeMode="contain"
        />

        {/* Judul */}
        <Text className="mt-8 text-[22px] font-semibold">Login Details</Text>

        {/* Input */}
        <MyInput
          className="mt-4"
          placeholder="Email"
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

        <Pressable
          className="mt-2 self-end"
          onPress={() =>
            Alert.alert("Forgot Password", "Fitur reset password belum tersedia.")
          }
        >
          <Text className="text-[12px] text-black">Forgot Password ?</Text>
        </Pressable>

        {error !== "" && (
          <Text className="mt-3 text-[13px] text-red-500">{error}</Text>
        )}

        <MyButton
          title={loading ? "Loading..." : "Login"}
          className="mt-8"
          onPress={handleLogin}
        />

        {/* Link ke register */}
        <View className="mt-4 flex-row justify-center">
          <Text className="text-[12px]">{"Don't have an account? "}</Text>
          <Pressable onPress={() => router.push("/register")}>
            <Text className="text-[12px] font-semibold text-[#0B6EFE]">
              Register
            </Text>
          </Pressable>
        </View>

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
