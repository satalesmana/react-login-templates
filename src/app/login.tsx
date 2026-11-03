import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthIllustration, AuthWave } from "../components/AuthIllustration";
import { getSupabase } from "../lib/supabase";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setErrorMessage("");
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) {
      setErrorMessage("Masukkan email.");
      return;
    }
    if (!password) {
      setErrorMessage("Masukkan kata sandi.");
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await getSupabase().auth.signInWithPassword({
        email: normalizedEmail,
        password,
      });
      if (error) throw error;
      router.replace("/main");
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Login gagal. Silakan coba lagi."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) {
      setErrorMessage("Masukkan email untuk menerima tautan pemulihan.");
      return;
    }

    try {
      const { error } = await getSupabase().auth.resetPasswordForEmail(
        normalizedEmail
      );
      if (error) throw error;
      Alert.alert(
        "Periksa email",
        "Jika email terdaftar, tautan pemulihan kata sandi akan dikirim."
      );
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Tautan pemulihan gagal dikirim."
      );
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />
      <AuthWave />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 24 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          className="px-7"
        >
          <AuthIllustration height={182} />
          <Text className="mb-4 mt-1 text-lg font-semibold text-[#171717]">
            Login Details
          </Text>

          <TextInput
            accessibilityLabel="Email"
            className="mb-2 rounded-md border border-[#c9c1bf] px-3.5 py-3 text-sm text-[#222]"
            placeholder="Email"
            placeholderTextColor="#777"
            value={email}
            onChangeText={(value) => {
              setEmail(value);
              if (errorMessage) setErrorMessage("");
            }}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="next"
          />

          <View className="mb-1 flex-row items-center rounded-md border border-[#b9b0ae] px-3.5">
            <TextInput
              accessibilityLabel="Kata sandi"
              className="flex-1 py-3 text-sm text-[#222]"
              placeholder="Password"
              placeholderTextColor="#777"
              value={password}
              onChangeText={(value) => {
                setPassword(value);
                if (errorMessage) setErrorMessage("");
              }}
              secureTextEntry
              autoCapitalize="none"
              autoComplete="current-password"
              returnKeyType="done"
              onSubmitEditing={handleLogin}
            />
          </View>

          <View className="min-h-[25px] justify-center">
            {errorMessage ? (
              <Text accessibilityRole="alert" className="mt-1 text-xs text-red-600">
                {errorMessage}
              </Text>
            ) : null}
          </View>
          <TouchableOpacity
            accessibilityRole="button"
            activeOpacity={0.7}
            onPress={handleForgotPassword}
            className="mb-4 self-end"
          >
            <Text className="text-xs text-[#555]">Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            accessibilityRole="button"
            activeOpacity={0.85}
            onPress={handleLogin}
            disabled={isLoading}
            className="items-center rounded-md bg-[#1769F6] py-3.5"
          >
            <Text className="text-base font-bold text-white">
              {isLoading ? "Memproses..." : "Login"}
            </Text>
          </TouchableOpacity>

          <View className="mt-auto flex-row items-center justify-center pt-5">
            <Text className="text-sm text-[#666]">Belum punya akun? </Text>
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="Sign Up"
              activeOpacity={0.7}
              onPress={() => router.push("/register")}
              className="px-1 py-2"
            >
              <Text className="text-sm font-bold text-[#171717]">Sign Up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
