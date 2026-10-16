import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { MyInput } from "../components/MyInput";
import { MyButton } from "../components/MyButton";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorEmail, setErrorEmail] = useState("");
  const [errorPassword, setErrorPassword] = useState("");

  const handleLogin = () => {
    let valid = true;
    setErrorEmail("");
    setErrorPassword("");

    if (!email.trim()) {
      setErrorEmail("Email wajib diisi");
      valid = false;
    } else if (!email.includes("@")) {
      setErrorEmail("Format email tidak valid");
      valid = false;
    }

    if (!password) {
      setErrorPassword("Kata sandi wajib diisi");
      valid = false;
    } else if (password.length < 6) {
      setErrorPassword("Kata sandi minimal 6 karakter");
      valid = false;
    }

    if (!valid) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert("Berhasil", "Selamat datang kembali!", [
        { text: "OK", onPress: () => router.replace("/main") },
      ]);
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.safeArea} className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Back button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color="#0F172A" />
          </TouchableOpacity>

          {/* Heading */}
          <View style={styles.headerContainer} className="mb-8">
            <Text style={styles.title} className="text-3xl font-extrabold text-slate-900 mb-2">
              Masuk
            </Text>
            <Text style={styles.subtitle} className="text-base text-slate-500">
              Silakan masukkan akun Anda untuk melanjutkan
            </Text>
          </View>

          {/* Form */}
          <View style={styles.formContainer} className="w-full">
            <MyInput
              label="Alamat Email"
              placeholder="nama@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              icon="mail-outline"
              value={email}
              onChangeText={setEmail}
              error={errorEmail}
            />

            <MyInput
              label="Kata Sandi"
              placeholder="••••••••"
              isPassword
              icon="lock-closed-outline"
              value={password}
              onChangeText={setPassword}
              error={errorPassword}
            />

            {/* Remember Me & Forgot Password */}
            <View style={styles.rowOptions} className="flex-row justify-between items-center mb-6">
              <TouchableOpacity
                style={styles.rememberRow}
                onPress={() => setRememberMe(!rememberMe)}
                activeOpacity={0.7}
                className="flex-row items-center"
              >
                <Ionicons
                  name={rememberMe ? "checkbox" : "square-outline"}
                  size={20}
                  color={rememberMe ? "#4F46E5" : "#94A3B8"}
                />
                <Text style={styles.rememberText} className="ml-2 text-sm text-slate-600">
                  Ingat Saya
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => Alert.alert("Lupa Kata Sandi", "Fitur reset kata sandi")}
              >
                <Text style={styles.forgotText} className="text-sm font-semibold text-indigo-600">
                  Lupa Sandi?
                </Text>
              </TouchableOpacity>
            </View>

            {/* Login Button */}
            <MyButton
              title="Masuk"
              onPress={handleLogin}
              loading={loading}
              className="mb-6"
            />

            {/* Divider */}
            <View style={styles.dividerRow} className="flex-row items-center my-6">
              <View style={styles.divider} className="flex-1 h-[1px] bg-slate-200" />
              <Text style={styles.dividerText} className="mx-4 text-xs font-medium text-slate-400 uppercase">
                Atau masuk dengan
              </Text>
              <View style={styles.divider} className="flex-1 h-[1px] bg-slate-200" />
            </View>

            {/* Social Logins */}
            <View style={styles.socialRow} className="flex-row justify-center space-x-4 mb-8">
              <TouchableOpacity
                style={styles.socialBtn}
                onPress={() => Alert.alert("Google", "Login via Google")}
                activeOpacity={0.8}
              >
                <Ionicons name="logo-google" size={22} color="#EA4335" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.socialBtn}
                onPress={() => Alert.alert("Apple", "Login via Apple")}
                activeOpacity={0.8}
              >
                <Ionicons name="logo-apple" size={22} color="#000000" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.socialBtn}
                onPress={() => Alert.alert("GitHub", "Login via GitHub")}
                activeOpacity={0.8}
              >
                <Ionicons name="logo-github" size={22} color="#24292E" />
              </TouchableOpacity>
            </View>

            {/* Register Link */}
            <View style={styles.footerRow} className="flex-row justify-center items-center mt-2">
              <Text style={styles.footerText} className="text-sm text-slate-500">
                Belum punya akun?{" "}
              </Text>
              <TouchableOpacity onPress={() => router.push("/register")}>
                <Text style={styles.registerLink} className="text-sm font-bold text-indigo-600">
                  Daftar Sekarang
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingTop: 16,
    flexGrow: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  headerContainer: {
    marginBottom: 28,
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: "#64748B",
  },
  formContainer: {
    width: "100%",
  },
  rowOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  rememberRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  rememberText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#475569",
  },
  forgotText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4F46E5",
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#E2E8F0",
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 12,
    fontWeight: "600",
    color: "#94A3B8",
    textTransform: "uppercase",
  },
  socialRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    marginBottom: 32,
  },
  socialBtn: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    color: "#64748B",
  },
  registerLink: {
    fontSize: 14,
    fontWeight: "700",
    color: "#4F46E5",
  },
});
