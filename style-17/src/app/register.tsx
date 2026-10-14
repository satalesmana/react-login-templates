import { useRouter } from "expo-router";
import { useState } from "react";
import { Image, ScrollView, Text, View } from "react-native";
import ButtonSocial from "../components/ButtonSocial";
import MyButton from "../components/MyButton";
import MyInput from "../components/MyInput";

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

  const handleRegister = () => {
    const newErrors = { fullName: "", email: "", password: "" };
    const emailTrim = email.trim();

    if (fullName.trim() === "") {
      newErrors.fullName = "Please enter your full name !";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrim)) {
      newErrors.email = "Please enter valid email !";
    } else if (emailTrim === "tes@gmail.com") {
      newErrors.email = "Email already registered !";
    }

    if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters !";
    } else if (emailTrim === "tes@gmail.com" && password === "tes123") {
      newErrors.password = "Account already registered !";
    }

    setErrors(newErrors);

    const hasError = Object.values(newErrors).some((msg) => msg !== "");
    if (!hasError) {
      router.replace("/login");
    }
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
        <MyButton title="Register" className="mt-8" onPress={handleRegister} />

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
            onPress={() => router.replace("/login")}
          />
          <ButtonSocial
            icon={require("../../assets/images/facebook.png")}
            onPress={() => router.replace("/login")}
          />
          <ButtonSocial
            icon={require("../../assets/images/apple.png")}
            onPress={() => router.replace("/login")}
          />
        </View>
      </ScrollView>
    </View>
  );
}
