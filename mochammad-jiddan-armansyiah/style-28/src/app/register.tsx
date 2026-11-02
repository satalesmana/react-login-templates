import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Modal,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import FontAwesome from "@expo/vector-icons/FontAwesome";

import MyTextInput from "@/components/MyTextInput";
import MyButton from "@/components/MyButton";
import { supabase } from "../../lib/supabase";

export default function RegisterScreen() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  
  // Modal state: "idle" | "loading" | "success" | "error"
  const [modalType, setModalType] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [modalErrorMessage, setModalErrorMessage] = useState("");

  const onSubmitRegister = async () => {
    setErrorMsg("");

    if (!fullName.trim()) {
      setErrorMsg("Silakan masukkan Full Name");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setErrorMsg("Silakan masukkan Email yang valid");
      return;
    }
    if (!password || password.length < 6) {
      setErrorMsg("Password minimal 6 karakter");
      return;
    }

    try {
      setModalType("loading");

      const {
        data: { session },
        error,
      } = await supabase.auth.signUp({
        email: email.trim(),
        password: password,
        options: {
          data: {
            full_name: fullName.trim(),
            phone: phone.trim(),
          },
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      setModalType("success");
    } catch (error: any) {
      console.error("[onSubmitRegister]", error);
      setModalErrorMessage(error?.message || "Gagal membuat akun. Silakan coba lagi.");
      setModalType("error");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <View style={styles.topBar}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
              activeOpacity={0.7}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <FontAwesome name="chevron-left" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.header}>
            <Text style={styles.title}>Create Account Now!</Text>
          </View>

          <View style={styles.form}>
            <MyTextInput
              label="Full Name"
              placeholder="Your Full Name"
              value={fullName}
              onChangeText={setFullName}
              autoCapitalize="words"
            />

            <MyTextInput
              label="Email"
              placeholder="example@gmail.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <MyTextInput
              label="Password"
              placeholder="Create password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              autoCapitalize="none"
            />

            <MyTextInput
              label="Phone No"
              placeholder="08xxxxxxxxxx"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />

            {errorMsg ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{errorMsg}</Text>
              </View>
            ) : null}

            <View style={styles.buttonWrapper}>
              <MyButton
                text="Sign Up"
                btnType="primary"
                action={onSubmitRegister}
                loading={modalType === "loading"}
              />
            </View>

            <View style={styles.footerRow}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <TouchableOpacity
                onPress={() => router.push("/login")}
                activeOpacity={0.7}
              >
                <Text style={styles.loginLink}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Modal Popup Loading / Success / Error */}
      <Modal
        visible={modalType !== "idle"}
        transparent
        animationType="fade"
        onRequestClose={() => {
          if (modalType !== "loading") {
            setModalType("idle");
          }
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            {modalType === "loading" && (
              <View style={styles.modalContent}>
                <View style={styles.modalIconContainer}>
                  <ActivityIndicator size="large" color="#DEC39A" />
                </View>
                <Text style={styles.modalTitle}>Membuat Akun...</Text>
                <Text style={styles.modalSubtitle}>
                  Mohon tunggu sebentar, kami sedang memproses pendaftaran Anda.
                </Text>
              </View>
            )}

            {modalType === "success" && (
              <View style={styles.modalContent}>
                <View style={[styles.modalIconContainer, styles.successIconBg]}>
                  <FontAwesome name="check-circle" size={48} color="#DEC39A" />
                </View>
                <Text style={styles.modalTitle}>Sukses Buat Akun!</Text>
                <Text style={styles.modalSubtitle}>
                  Akun Anda berhasil didaftarkan. Silakan check email Anda (
                  <Text style={styles.boldEmail}>{email}</Text>
                  ) untuk verifikasi akun sebelum login.
                </Text>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => {
                    setModalType("idle");
                    router.replace("/login");
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={styles.modalButtonText}>Ke Halaman Login</Text>
                </TouchableOpacity>
              </View>
            )}

            {modalType === "error" && (
              <View style={styles.modalContent}>
                <View style={[styles.modalIconContainer, styles.errorIconBg]}>
                  <FontAwesome name="exclamation-circle" size={48} color="#F87171" />
                </View>
                <Text style={styles.modalTitle}>Gagal Mendaftar</Text>
                <Text style={styles.modalSubtitle}>
                  {modalErrorMessage || "Terjadi kesalahan, silakan coba lagi."}
                </Text>
                <TouchableOpacity
                  style={[styles.modalButton, styles.errorButton]}
                  onPress={() => setModalType("idle")}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.modalButtonText, { color: "#FFFFFF" }]}>Coba Lagi</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#102C57",
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingTop: 16,
    paddingBottom: 36,
    justifyContent: "space-between",
  },
  topBar: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 28,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    width: "100%",
    marginBottom: 28,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  form: {
    width: "100%",
  },
  errorContainer: {
    backgroundColor: "rgba(239, 68, 68, 0.15)",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.4)",
  },
  errorText: {
    color: "#FCA5A5",
    fontSize: 13,
    textAlign: "center",
  },
  buttonWrapper: {
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
  },
  footerText: {
    color: "#E2E8F0",
    fontSize: 14,
  },
  loginLink: {
    color: "#DEC39A",
    fontSize: 14,
    fontWeight: "700",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(5, 15, 30, 0.75)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  modalCard: {
    width: "100%",
    maxWidth: 340,
    backgroundColor: "#163869",
    borderRadius: 24,
    paddingVertical: 28,
    paddingHorizontal: 22,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(222, 195, 154, 0.35)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 10,
  },
  modalContent: {
    width: "100%",
    alignItems: "center",
  },
  modalIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "rgba(222, 195, 154, 0.12)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "rgba(222, 195, 154, 0.3)",
  },
  successIconBg: {
    backgroundColor: "rgba(222, 195, 154, 0.18)",
    borderColor: "#DEC39A",
  },
  errorIconBg: {
    backgroundColor: "rgba(239, 68, 68, 0.15)",
    borderColor: "rgba(239, 68, 68, 0.4)",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 8,
    textAlign: "center",
    letterSpacing: 0.3,
  },
  modalSubtitle: {
    fontSize: 14,
    color: "#D1D5DB",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 22,
  },
  boldEmail: {
    color: "#DEC39A",
    fontWeight: "700",
  },
  modalButton: {
    backgroundColor: "#DEC39A",
    width: "100%",
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  modalButtonText: {
    color: "#111827",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  errorButton: {
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
});
