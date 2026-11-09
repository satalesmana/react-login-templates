import { useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import WaveHeader from "@/components/WaveHeader";
import LineInput from "@/components/LineInput";
import PrimaryButton from "@/components/PrimaryButton";
import { colors, fonts } from "@/theme";

export default function Login() {
  const router = useRouter();
  const { height } = useWindowDimensions();
  const headerH = height * 0.38;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
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
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={{
          paddingTop: headerH * 0.88,
          paddingHorizontal: 28,
          paddingBottom: 32,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <WaveHeader height={headerH} />

        <Text style={styles.title}>Sign in</Text>
        <View style={styles.underline} />

        <LineInput
          label="Email"
          icon="mail-outline"
          placeholder="demo@email.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <LineInput
          label="Password"
          icon="lock-closed-outline"
          placeholder="*********"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <View style={styles.rowBetween}>
          <Pressable
            style={styles.remember}
            onPress={() => setRemember(!remember)}
          >
            <View style={[styles.checkbox, remember && styles.checkboxOn]}>
              {remember && <Ionicons name="checkmark" size={10} color="#fff" />}
            </View>
            <Text style={styles.small}>Remember Me</Text>
          </Pressable>
          <Text style={styles.forgot}>Forgot Password?</Text>
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <View style={{ marginTop: 28 }}>
          <PrimaryButton title="Login" onPress={handleLogin} />
        </View>

        <View style={styles.footer}>
          <Text style={styles.small}>Don't have an Account ? </Text>
          <Pressable onPress={() => router.replace("/register")}>
            <Text style={styles.link}>Sign up</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 28, fontFamily: fonts.regular, color: colors.text },
  underline: {
    width: 56,
    height: 2,
    backgroundColor: colors.primary,
    marginTop: 4,
    marginBottom: 28,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  remember: { flexDirection: "row", alignItems: "center", gap: 6 },
  checkbox: {
    width: 14,
    height: 14,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  small: { fontSize: 11, fontFamily: fonts.regular, color: colors.text },
  forgot: { fontSize: 11, fontFamily: fonts.medium, color: colors.primary },
  error: {
    marginTop: 12,
    fontSize: 12,
    fontFamily: fonts.regular,
    color: colors.error,
  },
  footer: { flexDirection: "row", justifyContent: "center", marginTop: 20 },
  link: { fontSize: 11, fontFamily: fonts.medium, color: colors.primary },
});