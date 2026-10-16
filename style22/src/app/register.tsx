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

export default function RegisterScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const [errorName, setErrorName] = useState("");
  const [errorEmail, setErrorEmail] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const [errorConfirm, setErrorConfirm] = useState("");

  const handleRegister = () => {
    let valid = true;
    setErrorName("");
    setErrorEmail("");
    setErrorPassword("");
    setErrorConfirm("");

    if (!fullName.trim()) {
      setErrorName("Nama lengkap wajib diisi");
      valid = false;
    }

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

    if (password !== confirmPassword) {
      setErrorConfirm("Konfirmasi kata sandi tidak cocok");
      valid = false;
    }

    if (!agreeTerms) {
      Alert.alert("Perhatian", "Anda harus menyetujui syarat & ketentuan");
      valid = false;
    }

    if (!valid) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert("Pendaftaran Berhasil", "Akun Anda telah berhasil dibuat!", [
        { text: "Masuk", onPress: () => router.replace("/login") },
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
          <View style={styles.headerContainer} className="mb-6">
            <Text style={styles.title} className="text-3xl font-extrabold text-slate-900 mb-2">
              Daftar Akun
            </Text>
            <Text style={styles.subtitle} className="text-base text-slate-500">
              Buat akun baru untuk mulai menjelajah
            </Text>
          </View>

          {/* Form */}
          <View style={styles.formContainer} className="w-full">
            <MyInput
              label="Nama Lengkap"
              placeholder="Contoh: Hamzah Fadhila"
              icon="person-outline"
              value={fullName}
              onChangeText={setFullName}
              error={errorName}
            />

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
              placeholder="Minimal 6 karakter"
              isPassword
              icon="lock-closed-outline"
              value={password}
              onChangeText={setPassword}
              error={errorPassword}
            />

            <MyInput
              label="Konfirmasi Kata Sandi"
              placeholder="Ulangi kata sandi"
              isPassword
              icon="shield-checkmark-outline"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              error={errorConfirm}
            />

            {/* Terms checkbox */}
            <TouchableOpacity
              style={styles.termsRow}
              onPress={() => setAgreeTerms(!agreeTerms)}
              activeOpacity={0.7}
              className="flex-row items-center mb-6"
            >
              <Ionicons
                name={agreeTerms ? "checkbox" : "square-outline"}
                size={20}
                color={agreeTerms ? "#4F46E5" : "#94A3B8"}
              />
              <Text style={styles.termsText} className="ml-2 text-sm text-slate-600 flex-1">
                Saya menyetujui <Text style={styles.termsLink}>Syarat & Ketentuan</Text> yang berlaku
              </Text>
            </TouchableOpacity>

            {/* Submit Button */}
            <MyButton
              title="Buat Akun"
              onPress={handleRegister}
              loading={loading}
              className="mb-6"
            />

            {/* Login Link */}
            <View style={styles.footerRow} className="flex-row justify-center items-center mt-2 pb-6">
              <Text style={styles.footerText} className="text-sm text-slate-500">
                Sudah punya akun?{" "}
              </Text>
              <TouchableOpacity onPress={() => router.push("/login")}>
                <Text style={styles.loginLink} className="text-sm font-bold text-indigo-600">
                  Masuk di Sini
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
    marginBottom: 24,
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
  termsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  termsText: {
    marginLeft: 8,
    fontSize: 13,
    color: "#475569",
    flex: 1,
  },
  termsLink: {
    color: "#4F46E5",
    fontWeight: "600",
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 24,
  },
  footerText: {
    fontSize: 14,
    color: "#64748B",
  },
  loginLink: {
    fontSize: 14,
    fontWeight: "700",
    color: "#4F46E5",
  },
});
