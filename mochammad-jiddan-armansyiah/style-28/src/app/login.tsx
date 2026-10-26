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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import FontAwesome from "@expo/vector-icons/FontAwesome";

import MyTextInput from "@/components/MyTextInput";
import MyButton from "@/components/MyButton";
import { authService } from "@/services/authStore";

export default function LoginScreen() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = () => {
    setErrorMsg("");

    if (!username.trim()) {
      setErrorMsg("Silakan masukkan Username atau Email");
      return;
    }
    if (!password) {
      setErrorMsg("Silakan masukkan Password");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      try {
        const user = authService.login(username, password);
        setLoading(false);

        if (user.role === "admin") {
          Alert.alert(
            "Login Berhasil (Admin)",
            `Selamat datang Administrator! Anda memiliki akses penuh.`,
            [{ text: "OK", onPress: () => router.replace("/dashboard") }]
          );
        } else {
          Alert.alert(
            "Login Berhasil (User)",
            `Selamat datang kembali, ${user.fullName}!`,
            [{ text: "OK", onPress: () => router.replace("/dashboard") }]
          );
        }
      } catch (err: any) {
        setLoading(false);
        const msg = err?.message || "Login gagal, silakan periksa data Anda.";
        setErrorMsg(msg);
        Alert.alert("Gagal Login", msg);
      }
    }, 400);
  };

  const handleForgotPassword = () => {
    Alert.alert(
      "Forgot Password",
      "Untuk reset password atau demo admin:\nUsername: admin\nPassword: 12345678"
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
              label="Username"
              placeholder="Username or Email"
              value={username}
              onChangeText={(text) => {
                setUsername(text);
                if (errorMsg) setErrorMsg("");
              }}
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
                loading={loading}
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
});
