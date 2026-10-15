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

export default function RegisterScreen() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleRegister = () => {
    setErrorMsg("");

    if (!fullName.trim()) {
      setErrorMsg("Silakan isi Full Name");
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
    if (!phone.trim()) {
      setErrorMsg("Silakan isi Phone No");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      try {
        const username = email.split("@")[0].toLowerCase();

        authService.register({
          username,
          fullName: fullName.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          password,
          role: "user",
        });

        setLoading(false);

        Alert.alert(
          "Registrasi Berhasil!",
          `Akun untuk ${fullName} berhasil dibuat sebagai User. Silakan login.`,
          [
            {
              text: "Login Sekarang",
              onPress: () => router.push("/login"),
            },
          ]
        );
      } catch (err: any) {
        setLoading(false);
        const msg = err?.message || "Gagal mendaftar, silakan coba lagi.";
        setErrorMsg(msg);
        Alert.alert("Gagal Registrasi", msg);
      }
    }, 400);
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
              onChangeText={(text) => {
                setFullName(text);
                if (errorMsg) setErrorMsg("");
              }}
              autoCapitalize="words"
            />

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
              placeholder="Create password"
              secureTextEntry
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errorMsg) setErrorMsg("");
              }}
              autoCapitalize="none"
            />

            <MyTextInput
              label="Phone No"
              placeholder="08xxxxxxxxxx"
              value={phone}
              onChangeText={(text) => {
                setPhone(text);
                if (errorMsg) setErrorMsg("");
              }}
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
                action={handleRegister}
                loading={loading}
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
});
