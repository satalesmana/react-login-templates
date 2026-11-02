import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
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

export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  
  // Modal states: "idle" | "loading" | "success" | "error"
  const [modalType, setModalType] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [modalErrorMessage, setModalErrorMessage] = useState("");

  const handleLogin = async () => {
    setErrorMsg("");

    if (!email.trim()) {
      setErrorMsg("Silakan masukkan Email");
      return;
    }
    if (!password) {
      setErrorMsg("Silakan masukkan Password");
      return;
    }

    try {
      setModalType("loading");

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) {
        throw new Error(error.message);
      }

      setModalType("success");
    } catch (err: any) {
      console.error("[handleLogin]", err);
      setModalErrorMessage(err?.message || "Login gagal, silakan periksa data Anda.");
      setModalType("error");
    }
  };

  const handleForgotPassword = () => {
    Alert.alert(
      "Forgot Password",
      "Silakan hubungi administrator atau gunakan reset password melalui Supabase Auth."
    );
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
            <Text style={styles.title}>Welcome Back!</Text>
            <Text style={styles.subtitle}>Login to continue</Text>
          </View>

          <View style={styles.form}>
            <MyTextInput
              label="Email"
              placeholder="example@gmail.com"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (errorMsg) setErrorMsg("");
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <MyTextInput
              label="Password"
              placeholder="Password"
              secureTextEntry
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errorMsg) setErrorMsg("");
              }}
              autoCapitalize="none"
            />

            <View style={styles.optionsRow}>
              <TouchableOpacity
                style={styles.rememberMeRow}
                activeOpacity={0.8}
                onPress={() => setRememberMe((prev) => !prev)}
              >
                <View
                  style={[
                    styles.checkbox,
                    rememberMe && styles.checkboxActive,
                  ]}
                >
                  {rememberMe && (
                    <FontAwesome name="check" size={10} color="#102C57" />
                  )}
                </View>
                <Text style={styles.rememberMeText}>Remember me</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleForgotPassword}
                activeOpacity={0.7}
              >
                <Text style={styles.forgotPasswordText}>Forgot password?</Text>
              </TouchableOpacity>
            </View>

            {errorMsg ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{errorMsg}</Text>
              </View>
            ) : null}

            <View style={styles.buttonWrapper}>
              <MyButton
                text="Login"
                btnType="primary"
                action={handleLogin}
                loading={modalType === "loading"}
              />
            </View>

            <View style={styles.footerRow}>
              <Text style={styles.footerText}>Don't have an account? </Text>
              <TouchableOpacity
                onPress={() => router.push("/register")}
                activeOpacity={0.7}
              >
                <Text style={styles.signUpLink}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.bottomRow}>
            <TouchableOpacity
              style={styles.floatingBadge}
              onPress={() => Alert.alert("Login with Google")}
              activeOpacity={0.8}
            >
              <FontAwesome name="google" size={16} color="#102C57" />
            </TouchableOpacity>
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
                <Text style={styles.modalTitle}>Masuk ke Akun...</Text>
                <Text style={styles.modalSubtitle}>
                  Mohon tunggu sebentar, kami sedang memverifikasi kredensial Anda.
                </Text>
              </View>
            )}

            {modalType === "success" && (
              <View style={styles.modalContent}>
                <View style={[styles.modalIconContainer, styles.successIconBg]}>
                  <FontAwesome name="check-circle" size={48} color="#DEC39A" />
                </View>
                <Text style={styles.modalTitle}>Login Berhasil!</Text>
                <Text style={styles.modalSubtitle}>
                  Selamat datang kembali! Anda akan diarahkan ke Dashboard.
                </Text>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => {
                    setModalType("idle");
                    router.replace("/dashboard");
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={styles.modalButtonText}>Buka Dashboard</Text>
                </TouchableOpacity>
              </View>
            )}

            {modalType === "error" && (
              <View style={styles.modalContent}>
                <View style={[styles.modalIconContainer, styles.errorIconBg]}>
                  <FontAwesome name="exclamation-circle" size={48} color="#F87171" />
                </View>
                <Text style={styles.modalTitle}>Gagal Login</Text>
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
    paddingBottom: 24,
    justifyContent: "space-between",
  },
  topBar: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 40,
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
    marginBottom: 36,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  subtitle: {
    color: "#CBD5E1",
    fontSize: 16,
    fontWeight: "400",
    marginTop: 8,
  },
  form: {
    width: "100%",
  },
  optionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 6,
    marginBottom: 30,
  },
  rememberMeRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    backgroundColor: "#E2E8F0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  checkboxActive: {
    backgroundColor: "#DEC39A",
  },
  rememberMeText: {
    color: "#CBD5E1",
    fontSize: 13,
  },
  forgotPasswordText: {
    color: "#CBD5E1",
    fontSize: 13,
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
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  footerText: {
    color: "#E2E8F0",
    fontSize: 14,
  },
  signUpLink: {
    color: "#DEC39A",
    fontSize: 14,
    fontWeight: "700",
  },
  bottomRow: {
    width: "100%",
    marginTop: 40,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  adminHint: {
    flex: 1,
    paddingRight: 10,
  },
  hintText: {
    color: "rgba(203, 213, 225, 0.6)",
    fontSize: 11,
    lineHeight: 16,
  },
  hintBold: {
    color: "#DEC39A",
    fontWeight: "700",
  },
  floatingBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#DEC39A",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
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
