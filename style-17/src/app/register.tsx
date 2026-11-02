import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Image, ScrollView, Text, View } from "react-native";
import ButtonSocial from "../components/ButtonSocial";
import MyButton from "../components/MyButton";
import MyInput from "../components/MyInput";
import { supabase } from "../lib/supabase";

export default function Register() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  // Kembali ke login tanpa membuat halaman login dobel
  const goToLogin = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/login");
    }
  };

  const handleRegister = async () => {
    if (loading) return;

    const newErrors = { fullName: "", email: "", password: "" };
    const emailTrim = email.trim();

    if (fullName.trim() === "") {
      newErrors.fullName = "Please enter your full name !";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrim)) {
      newErrors.email = "Please enter valid email !";
    }

    if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters !";
    }

    setErrors(newErrors);

    const hasError = Object.values(newErrors).some((msg) => msg !== "");
    if (hasError) return;

    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: emailTrim,
      password: password,
      options: {
        data: { full_name: fullName.trim() },
      },
    });
    setLoading(false);

    if (error) {
      setErrors({ ...newErrors, email: error.message });
      return;
    }

    if (data.session) {
      // Supabase langsung me-login-kan user baru.
      // Kita logout dulu supaya user login sendiri di halaman Login.
      await supabase.auth.signOut();
      Alert.alert("Berhasil", "Akun berhasil dibuat, silakan login.");
    } else {
      Alert.alert("Cek Email", "Silakan cek email kamu untuk verifikasi.");
    }
    goToLogin();
  };

  return (
    <View className="flex-1 bg-white">
      <ScrollView
        className="flex-1"
        contentContainerClassName="flex-grow px-[28px] pt-[60px] pb-[40px]"
        keyboardShouldPersistTaps="handled"
      >
        {/* Ilustrasi */}
        <Image
          source={require("../../assets/images/cover3.png")}
          className="h-[200px] w-full"
          resizeMode="contain"
        />

        {/* Judul */}
        <Text className="mt-8 text-[22px] font-semibold">Register account</Text>

        {/* Input */}
        <MyInput
          className="mt-4"
          placeholder="Full Name"
          value={fullName}
          onChangeText={setFullName}
          error={errors.fullName}
        />
        <MyInput
          className="mt-4"
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          error={errors.email}
        />
        <MyInput
          className="mt-4"
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          error={errors.password}
        />

        {/* Tombol register */}
        <MyButton
          title={loading ? "Loading..." : "Register"}
          className="mt-8"
          onPress={handleRegister}
        />

        {/* Pemisah */}
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

        {/* Tombol sosial, semuanya ke login */}
        <View className="mt-5 flex-row items-center justify-center gap-4">
          <ButtonSocial
            icon={require("../../assets/images/google.png")}
            onPress={goToLogin}
          />
          <ButtonSocial
            icon={require("../../assets/images/facebook.png")}
            onPress={goToLogin}
          />
          <ButtonSocial
            icon={require("../../assets/images/apple.png")}
            onPress={goToLogin}
          />
        </View>
      </ScrollView>
    </View>
  );
}
