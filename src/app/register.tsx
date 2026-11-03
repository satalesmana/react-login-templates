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

export default function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    setErrorMessage("");
    const normalizedEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailTouched(true);

    if (!name.trim()) {
      setErrorMessage("Masukkan nama lengkap.");
      return;
    }
    if (!emailRegex.test(normalizedEmail)) {
      setErrorMessage("Masukkan alamat email yang valid.");
      return;
    }
    if (password.length < 6) {
      setErrorMessage("Kata sandi minimal 6 karakter.");
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await getSupabase().auth.signUp({
        email: normalizedEmail,
        password,
        options: { data: { full_name: name.trim() } },
      });
      if (error) throw error;

      if (data.session) {
        router.replace("/main");
      } else {
        Alert.alert(
          "Periksa email",
          "Akun berhasil dibuat. Konfirmasi email Anda sebelum login."
        );
        router.replace("/login");
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message.toLowerCase() : "";

      if (message.includes("rate limit") || message.includes("too many requests")) {
        setErrorMessage(
          "Batas email Supabase tercapai. Untuk development, matikan Confirm email di Supabase: Authentication → Sign In / Providers → Email. Jika masih dibatasi, tunggu batas email pulih sebelum mencoba lagi."
        );
      } else if (message.includes("already registered")) {
        setErrorMessage(
          "Email ini sudah terdaftar. Silakan login atau gunakan email lain."
        );
      } else if (message.includes("password")) {
        setErrorMessage(
          "Kata sandi tidak memenuhi aturan Supabase. Gunakan minimal 6 karakter dan periksa pengaturan password Auth."
        );
      } else if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Pendaftaran gagal. Silakan coba lagi.");
      }
    } finally {
      setIsLoading(false);
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
          <AuthIllustration height={174} characterColor="#df7778" />
          <Text className="mb-4 mt-1 text-lg font-semibold text-[#171717]">
            Register account
          </Text>

          <TextInput
            accessibilityLabel="Nama lengkap"
            className="mb-2 rounded-md border border-[#b9b0ae] px-3.5 py-3 text-sm text-[#222]"
            placeholder="Nama lengkap"
            placeholderTextColor="#777"
            value={name}
            onChangeText={(value) => {
              setName(value);
              if (errorMessage) setErrorMessage("");
            }}
            autoCapitalize="words"
            autoComplete="name"
            returnKeyType="next"
          />
          <TextInput
            accessibilityLabel="Email"
            className={`rounded-md border px-3.5 py-3 text-sm text-[#222] ${
              emailTouched && email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
                ? "border-[#ff6b6b]"
                : "mb-2 border-[#b9b0ae]"
            }`}
            placeholder="Email"
            placeholderTextColor="#777"
            value={email}
            onChangeText={(value) => {
              setEmail(value);
              setEmailTouched(true);
              if (errorMessage) setErrorMessage("");
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect={false}
            returnKeyType="next"
          />
          {emailTouched && email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ? (
            <Text className="mb-2 ml-2 text-[10px] text-[#e25353]">
              Masukkan format email yang valid, contoh: udin@gmail.com
            </Text>
          ) : null}
          <View className="mb-2 flex-row items-center rounded-md border border-[#b9b0ae] px-3.5">
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
              autoComplete="new-password"
              returnKeyType="done"
              onSubmitEditing={handleRegister}
            />
          </View>
          <Text className="mb-2 ml-1 text-[11px] text-[#777]">
            Password minimal 6 karakter, contoh: 123456.
          </Text>

          <View className="min-h-[25px] justify-center">
            {errorMessage ? (
              <Text accessibilityRole="alert" className="mt-1 text-xs text-red-600">
                {errorMessage}
              </Text>
            ) : null}
          </View>

          <TouchableOpacity
            accessibilityRole="button"
            activeOpacity={0.85}
            onPress={handleRegister}
            disabled={isLoading}
            className="mt-1 items-center rounded-md bg-[#1769F6] py-3.5"
          >
            <Text className="text-base font-bold text-white">
              {isLoading ? "Memproses..." : "Buat akun"}
            </Text>
          </TouchableOpacity>

          <View className="mt-auto items-center pt-4">
            <TouchableOpacity
              accessibilityRole="button"
              onPress={() => router.replace("/login")}
            >
              <Text className="text-sm text-[#666]">
                Sudah punya akun?{" "}
                <Text className="font-bold text-[#171717]">Login</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
