import { router } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useState } from "react";
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PURPLE = "#6C63FF";
const { height: SCREEN_H } = Dimensions.get("window");

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── Hero: full-bleed image with title overlaid ── */}
          <View style={styles.heroSection}>
            <Image
              source={require("@/assets/images/register_login.jpeg")}
              style={styles.heroImage}
              resizeMode="cover"
            />
            {/* Title sits inside the hero area */}
            <View style={styles.titleOverlay}>
              <Text style={styles.title}>Welcome back</Text>
              <Text style={styles.subtitle}>
                sign in to access your account
              </Text>
            </View>
          </View>

          {/* ── Form ── */}
          <View style={styles.formSection}>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor="#C0C0CC"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <SymbolView
                name={{ ios: "envelope", android: "email", web: "email" }}
                size={17}
                tintColor="#C0C0CC"
              />
            </View>

            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#C0C0CC"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
              <SymbolView
                name={{ ios: "lock", android: "lock", web: "lock" }}
                size={17}
                tintColor="#C0C0CC"
              />
            </View>

            <View style={styles.rememberRow}>
              <TouchableOpacity
                style={styles.rememberLeft}
                onPress={() => setRememberMe(!rememberMe)}
                activeOpacity={0.8}
              >
                <View
                  style={[
                    styles.checkbox,
                    rememberMe && styles.checkboxChecked,
                  ]}
                >
                  {rememberMe && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={styles.rememberText}>REMEMBER ME</Text>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.7}>
                <Text style={styles.forgotText}>FORGOT PASSWORD?</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* ── Button + Links ── */}
          <View style={styles.buttonWrapper}>
            <TouchableOpacity
              style={styles.nextButton}
              onPress={() => router.push("/main")}
              activeOpacity={0.85}
            >
              <Text style={styles.nextButtonText}>Next {">"}</Text>
            </TouchableOpacity>

            <View style={styles.bottomRow}>
              <Text style={styles.bottomPrompt}>New Member? </Text>
              <TouchableOpacity onPress={() => router.push("/register")}>
                <Text style={styles.bottomLink}>Register now</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  scrollContent: { flexGrow: 1 },

  // ─── Hero ─────────────────────────────────────────────
  heroSection: {
    width: "100%",
    height: SCREEN_H * 0.42, // ~40% of screen height
    position: "relative",
  },
  heroImage: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    height: "100%",
  },
  titleOverlay: {
    position: "absolute",
    bottom: 24,
    left: 24,
    right: 24,
    alignItems: "center", // <-- Tambahkan ini agar kontainer berada di tengah
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1A1A2E",
    letterSpacing: -0.3,
    textAlign: "center", // <-- Tambahkan ini untuk meratakan teks ke tengah
  },
  subtitle: {
    fontSize: 13,
    color: "#555566",
    marginTop: 4,
    textAlign: "center", // <-- Tambahkan ini untuk meratakan teks ke tengah
  },
  // ─── Form ─────────────────────────────────────────────
  formSection: {
    paddingHorizontal: 24,
    paddingTop: 20,
    gap: 12,
    marginBottom: 28,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F4F4F6",
    borderRadius: 10,
    paddingHorizontal: 16,
    height: 50,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: "#1A1A2E",
  },

  // ─── Remember / Forgot ────────────────────────────────
  rememberRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 2,
  },
  rememberLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  checkbox: {
    width: 14,
    height: 14,
    borderRadius: 3,
    borderWidth: 1.5,
    borderColor: "#CCCCCC",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: PURPLE,
    borderColor: PURPLE,
  },
  checkmark: { color: "#FFFFFF", fontSize: 9, fontWeight: "700" },
  rememberText: {
    fontSize: 10,
    color: "#9A9AB0",
    fontWeight: "600",
    letterSpacing: 0.4,
  },
  forgotText: {
    fontSize: 10,
    color: PURPLE,
    fontWeight: "600",
    letterSpacing: 0.4,
  },

  // ─── Button + Links ───────────────────────────────────
  buttonWrapper: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    gap: 20,
    alignItems: "center",
  },
  nextButton: {
    width: "100%",
    height: 52,
    backgroundColor: "#38BDF8", // <-- Ganti ke kode warna biru muda (Sky Blue)
    borderRadius: 10, // <-- Ubah dari 26 ke 10 agar sudutnya tidak terlalu melengkung
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#38BDF8", // <-- Sesuaikan warna bayangan dengan warna biru muda
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  nextButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  bottomRow: { flexDirection: "row", alignItems: "center" },
  bottomPrompt: { fontSize: 13, color: "#9A9AB0" },
  bottomLink: { fontSize: 13, color: PURPLE, fontWeight: "600" },
});
