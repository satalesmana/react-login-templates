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
const TEXT_DARK = "#1A1A2E";
const TEXT_GRAY = "#9A9AB0";
const GRAY_BG = "#F4F4F6";
const GRAY_ICON = "#C0C0CC";
const { height: SCREEN_H } = Dimensions.get("window");

export default function RegisterScreen() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={0}
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
              <Text style={styles.title}>Get Started</Text>
              <Text style={styles.subtitle}>by creating a free account.</Text>
            </View>
          </View>

          {/* ── Form ── */}
          <View style={styles.formSection}>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Full name"
                placeholderTextColor={GRAY_ICON}
                value={fullName}
                onChangeText={setFullName}
                autoCapitalize="words"
              />
              <SymbolView
                name={{ ios: "person", android: "person", web: "person" }}
                size={17}
                tintColor={GRAY_ICON}
              />
            </View>

            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Valid email"
                placeholderTextColor={GRAY_ICON}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <SymbolView
                name={{ ios: "envelope", android: "email", web: "email" }}
                size={17}
                tintColor={GRAY_ICON}
              />
            </View>

            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Phone number"
                placeholderTextColor={GRAY_ICON}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
              <SymbolView
                name={{ ios: "phone", android: "phone", web: "phone" }}
                size={17}
                tintColor={GRAY_ICON}
              />
            </View>

            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Strong Password"
                placeholderTextColor={GRAY_ICON}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
              <SymbolView
                name={{ ios: "lock", android: "lock", web: "lock" }}
                size={17}
                tintColor={GRAY_ICON}
              />
            </View>

            <TouchableOpacity
              style={styles.termsRow}
              onPress={() => setAgreed(!agreed)}
              activeOpacity={0.8}
            >
              <View style={[styles.checkbox, agreed && styles.checkboxChecked]}>
                {agreed && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.termsText}>
                BY CHECKING THE BOX YOU AGREE TO OUR{" "}
                <Text style={styles.termsLink}>TERMS</Text> AND{" "}
                <Text style={styles.termsLink}>CONDITIONS.</Text>
              </Text>
            </TouchableOpacity>
          </View>

          {/* ── Button + Links ── */}
          <View style={styles.buttonWrapper}>
            <TouchableOpacity
              style={styles.nextButton}
              onPress={() => router.replace("/login")}
              activeOpacity={0.85}
            >
              <Text style={styles.nextButtonText}>Next {">"}</Text>
            </TouchableOpacity>

            <View style={styles.bottomRow}>
              <Text style={styles.bottomPrompt}>Already a member? </Text>
              <TouchableOpacity onPress={() => router.push("/login")}>
                <Text style={styles.bottomLink}>Log In</Text>
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
    fontSize: 40,
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
    backgroundColor: GRAY_BG,
    borderRadius: 10,
    paddingHorizontal: 16,
    height: 50,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: TEXT_DARK,
  },

  // ─── Terms ────────────────────────────────────────────
  termsRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginTop: 4,
  },
  checkbox: {
    width: 17,
    height: 17,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: "#CCCCCC",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
    flexShrink: 0,
  },
  checkboxChecked: {
    backgroundColor: PURPLE,
    borderColor: PURPLE,
  },
  checkmark: { color: "#FFFFFF", fontSize: 10, fontWeight: "700" },
  termsText: {
    flex: 1,
    fontSize: 10,
    color: TEXT_GRAY,
    lineHeight: 16,
    letterSpacing: 0.2,
  },
  termsLink: { color: PURPLE, fontWeight: "700" },

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
  bottomPrompt: { fontSize: 13, color: TEXT_GRAY },
  bottomLink: { fontSize: 13, color: PURPLE, fontWeight: "600" },
});
