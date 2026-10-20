import { useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Illustration from "@/components/Illustration";
import InputField from "@/components/InputField";
import PrimaryButton from "@/components/PrimaryButton";
import { colors, fonts } from "@/theme";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    if (!email.includes("@")) {
      setError("Email is not valid");
      return;
    }
    setError("");
    router.replace("/main");
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <Pressable onPress={() => router.back()} style={styles.back}>
            <Ionicons name="arrow-back" size={22} color={colors.muted} />
          </Pressable>

          <View style={styles.illustration}>
            <Illustration icon="lock-closed-outline" />
          </View>

          <Text style={styles.title}>Login</Text>
          <Text style={styles.subtitle}>
            Enter your email and password to continue
          </Text>

          <InputField
            label="Email"
            placeholder="you@gmail.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            icon="mail-outline"
          />
          <InputField
            label="Password"
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <View style={{ marginTop: 10 }}>
            <PrimaryButton title="Confirm" onPress={handleLogin} />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <Pressable onPress={() => router.replace("/register")}>
              <Text style={styles.link}>Register</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { flexGrow: 1, paddingHorizontal: 28, paddingBottom: 32 },
  back: { marginTop: 12, width: 32 },
  illustration: { alignItems: "center", marginVertical: 8 },
  title: { fontSize: 16, fontFamily: fonts.semibold, color: colors.text },
  subtitle: {
    marginTop: 4,
    marginBottom: 20,
    fontSize: 11,
    fontFamily: fonts.regular,
    color: colors.muted,
  },
  error: {
    color: colors.error,
    fontSize: 12,
    fontFamily: fonts.regular,
    marginBottom: 4,
  },
  footer: { flexDirection: "row", justifyContent: "center", marginTop: 24 },
  footerText: { fontSize: 12, fontFamily: fonts.regular, color: colors.muted },
  link: { fontSize: 12, fontFamily: fonts.semibold, color: colors.primary },
});