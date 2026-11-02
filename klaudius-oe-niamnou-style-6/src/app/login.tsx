import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { authService } from "../../lib/auth";

export default function LoginScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const registeredEmail = (params.registeredEmail as string) || (params.identifier as string) || "";
  const registeredPassword = (params.registeredPassword as string) || "";
  const justRegistered = params.justRegistered === "1";

  // Langsung terisi fix admin@gmail.com dan test123 jika default, atau akun yang baru didaftarkan
  const [identifier, setIdentifier] = useState(registeredEmail || "admin@gmail.com");
  const [password, setPassword] = useState(registeredPassword || (registeredEmail ? "" : "test123"));
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(
    justRegistered && registeredEmail
      ? `Akun baru (${registeredEmail}) siap digunakan! Silakan klik Masuk Sekarang.`
      : null
  );

  useEffect(() => {
    if (registeredEmail) {
      setIdentifier(registeredEmail);
      if (registeredPassword) {
        setPassword(registeredPassword);
      }
      setSuccessNotice(`Akun baru (${registeredEmail}) siap digunakan! Silakan klik Masuk Sekarang.`);
    }
  }, [registeredEmail, registeredPassword]);

  const handleLogin = async () => {
    setErrorMessage(null);

    const cleanId = identifier.trim();
    if (!cleanId) {
      setErrorMessage("Silahkan masukkan username atau email anda.");
      return;
    }
    if (!password) {
      setErrorMessage("Silahkan masukkan password anda.");
      return;
    }

    setLoading(true);
    try {
      await authService.login(cleanId, password);
      // Langsung masuk ke Dashboard
      router.replace("/dashboard");
    } catch (err: any) {
      const msg = err.message || "Gagal masuk. Periksa kembali username dan password.";
      setErrorMessage(msg);
      Alert.alert("Gagal Masuk", msg);
    } finally {
      setLoading(false);
    }
  };

  const handleClearForm = () => {
    setIdentifier("");
    setPassword("");
    setErrorMessage(null);
    setSuccessNotice(null);
  };

  const handleFillDefault = () => {
    setIdentifier("admin@gmail.com");
    setPassword("test123");
    setErrorMessage(null);
    setSuccessNotice(null);
  };

  const handleForgotPassword = () => {
    Alert.alert(
      "Informasi Login",
      "Akun Login Utama:\n• Username/Email: admin@gmail.com\n• Password: test123",
      [{ text: "Mengerti" }]
    );
  };

  const handleSocialLogin = (platform: "Google" | "Facebook") => {
    // Quick login via social simulation
    handleLogin();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >

          {/* Illustration Card (Style 6) */}
          <View style={styles.illustrationCard}>
            <Image
              source={require("../../assets/images/illustrations/login-partnership.png")}
              style={styles.illustrationImage}
              resizeMode="contain"
            />
          </View>

          {/* Form Inputs */}
          <View style={styles.formContainer}>
            {/* Quick Action: Hapus Form / Isi Ulang */}
            <View style={styles.formActionHeader}>
              <Text style={styles.formLabelTitle}>Data Akun Login</Text>
              {identifier || password ? (
                <TouchableOpacity
                  onPress={handleClearForm}
                  style={styles.clearFormBtn}
                  activeOpacity={0.7}
                >
                  <Text style={styles.clearFormBtnText}>✕ Hapus / Kosongkan Form</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={handleFillDefault}
                  style={styles.fillDefaultBtn}
                  activeOpacity={0.7}
                >
                  <Text style={styles.fillDefaultBtnText}>↺ Isi Akun admin@gmail.com</Text>
                </TouchableOpacity>
              )}
            </View>

            {successNotice ? (
              <View style={styles.successBanner}>
                <Text style={styles.successBannerText}>✓ {successNotice}</Text>
              </View>
            ) : null}

            {errorMessage ? (
              <View style={styles.errorBanner}>
                <Text style={styles.errorBannerText}>{errorMessage}</Text>
              </View>
            ) : null}

            {/* Email / Username Field (Sudah terisi langsung) */}
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Email atau Username"
                placeholderTextColor="#94A3B8"
                value={identifier}
                onChangeText={(t) => {
                  setIdentifier(t);
                  if (errorMessage) setErrorMessage(null);
                }}
                autoCapitalize="none"
              />
            </View>

            {/* Password Field with Eye Toggle (Sudah terisi langsung) */}
            <View style={styles.passwordInputWrapper}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Password"
                placeholderTextColor="#94A3B8"
                value={password}
                onChangeText={(t) => {
                  setPassword(t);
                  if (errorMessage) setErrorMessage(null);
                }}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
                activeOpacity={0.7}
              >
                <Text style={styles.eyeIconText}>{showPassword ? "👁" : "👁‍🗨"}</Text>
              </TouchableOpacity>
            </View>

            {/* Lupa Password */}
            <View style={styles.forgotPasswordContainer}>
              <TouchableOpacity onPress={handleForgotPassword} activeOpacity={0.7}>
                <Text style={styles.forgotPasswordText}>Lupa password?</Text>
              </TouchableOpacity>
            </View>

            {/* Masuk Button (Style 6) */}
            <TouchableOpacity
              style={[styles.primaryButton, loading && styles.buttonDisabled]}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.primaryButtonText}>MASUK</Text>
              )}
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>Atau masuk menggunakan</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social Buttons */}
            <TouchableOpacity
              style={styles.googleButton}
              activeOpacity={0.85}
              onPress={() => handleSocialLogin("Google")}
            >
              <View style={styles.socialContent}>
                <Text style={styles.googleLogo}>G</Text>
                <Text style={styles.googleButtonText}>Google</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.facebookButton}
              activeOpacity={0.85}
              onPress={() => handleSocialLogin("Facebook")}
            >
              <View style={styles.socialContent}>
                <Text style={styles.facebookLogo}>f</Text>
                <Text style={styles.facebookButtonText}>Facebook</Text>
              </View>
            </TouchableOpacity>

            {/* Footer */}
            <View style={styles.footerRow}>
              <Text style={styles.footerNormalText}>Belum punya akun? </Text>
              <TouchableOpacity
                onPress={() => router.push("/register")}
                activeOpacity={0.7}
              >
                <Text style={styles.footerLinkText}>Mendaftar sekarang</Text>
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
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 28,
  },

  illustrationCard: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 24,
    paddingVertical: 18,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  illustrationImage: {
    width: 170,
    height: 160,
  },
  formContainer: {
    marginTop: 6,
  },
  formActionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  formLabelTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#475569",
  },
  clearFormBtn: {
    backgroundColor: "#FEE2E2",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  clearFormBtnText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#DC2626",
  },
  fillDefaultBtn: {
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },
  fillDefaultBtnText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#1D4ED8",
  },
  successBanner: {
    backgroundColor: "#ECFDF5",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#A7F3D0",
  },
  successBannerText: {
    color: "#065F46",
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
  },
  errorBanner: {
    backgroundColor: "#FEF2F2",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  errorBannerText: {
    color: "#DC2626",
    fontSize: 13,
    textAlign: "center",
  },
  inputWrapper: {
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: "#FFFFFF",
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontSize: 14,
    color: "#1E293B",
  },
  passwordInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: "#FFFFFF",
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontSize: 14,
    color: "#1E293B",
  },
  eyeIcon: {
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  eyeIconText: {
    fontSize: 16,
    color: "#64748B",
  },
  forgotPasswordContainer: {
    alignItems: "flex-end",
    marginBottom: 18,
  },
  forgotPasswordText: {
    fontSize: 12,
    color: "#475569",
    fontWeight: "500",
  },
  primaryButton: {
    backgroundColor: "#2B92E4",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#2B92E4",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  buttonDisabled: {
    opacity: 0.65,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E2E8F0",
  },
  dividerText: {
    paddingHorizontal: 10,
    fontSize: 11,
    color: "#94A3B8",
    fontWeight: "500",
  },
  googleButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#EA4335",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  socialContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  googleLogo: {
    fontSize: 16,
    fontWeight: "900",
    color: "#EA4335",
    marginRight: 10,
  },
  googleButtonText: {
    color: "#EA4335",
    fontSize: 14,
    fontWeight: "600",
  },
  facebookButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#1877F2",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  facebookLogo: {
    fontSize: 16,
    fontWeight: "900",
    color: "#1877F2",
    marginRight: 10,
  },
  facebookButtonText: {
    color: "#1877F2",
    fontSize: 14,
    fontWeight: "600",
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 2,
  },
  footerNormalText: {
    fontSize: 13,
    color: "#64748B",
  },
  footerLinkText: {
    fontSize: 13,
    color: "#2B92E4",
    fontWeight: "700",
  },
});
