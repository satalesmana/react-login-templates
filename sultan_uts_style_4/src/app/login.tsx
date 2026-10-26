import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { BackgroundImage } from "@/components/background-image";

export default function Login() {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (!user || !password) {
      setError("Isi username/email dan password dulu ya");
      return;
    }
    setError("");
    router.replace("/home"); // sementara, ganti ke halaman utama lu nanti
  };

  return (
    <View style={styles.container}>
      <BackgroundImage source={require("../../assets/images/login.png")} />

      <SafeAreaView style={styles.flex}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ScrollView
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.title}>Log in to Shh!</Text>

            <Pressable
              style={({ pressed }) => [
                styles.googleButton,
                pressed && styles.pressed,
              ]}
            >
              <Ionicons name="logo-google" size={20} color="#fff" />
              <Text style={styles.googleText}>Log in with Google</Text>
            </Pressable>

            <View style={styles.dividerRow}>
              <View style={styles.line} />
              <Text style={styles.dividerText}>Or log in with Email</Text>
              <View style={styles.line} />
            </View>

            <Text style={styles.label}>Username or Email</Text>
            <TextInput
              style={styles.input}
              autoCapitalize="none"
              value={user}
              onChangeText={setUser}
            />

            <View style={styles.passwordRow}>
              <Text style={styles.label}>Password</Text>
              <Text style={styles.forgot}>Forgot?</Text>
            </View>
            <TextInput
              style={styles.input}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            {error !== "" && <Text style={styles.error}>{error}</Text>}

            <Pressable
              style={({ pressed }) => [
                styles.loginButton,
                pressed && styles.pressed,
              ]}
              onPress={handleLogin}
            >
              <Text style={styles.loginText}>Log in</Text>
            </Pressable>

            <Text style={styles.linkText}>
              Don't have an account?{"\n"}
              <Text
                style={styles.linkBold}
                onPress={() => router.replace("/signup")}
              >
                Sign up
              </Text>
            </Text>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, backgroundColor: "#8B5FB0" },
  content: { paddingHorizontal: 28, paddingBottom: 24 },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginTop: 16,
    marginBottom: 16,
  },
  googleButton: {
    flexDirection: "row",
    backgroundColor: "#000",
    borderRadius: 30,
    paddingVertical: 14,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  pressed: { opacity: 0.7 },
  googleText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 16,
  },
  line: { flex: 1, height: 1, backgroundColor: "#000" },
  dividerText: { marginHorizontal: 10, fontWeight: "600", color: "#000" },
  label: { fontSize: 16, fontWeight: "700", color: "#000", marginBottom: 6 },
  passwordRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  forgot: { color: "#222", marginBottom: 6 },
  input: {
    backgroundColor: "#fff",
    borderRadius: 25,
    height: 48,
    paddingHorizontal: 20,
    fontSize: 16,
    marginBottom: 14,
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.25)",
  },
  error: { color: "#FFE9A8", fontWeight: "600", marginBottom: 8 },
  loginButton: {
    backgroundColor: "#000",
    borderRadius: 25,
    paddingVertical: 14,
    alignItems: "center",
  },
  loginText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  linkText: { color: "#fff", fontSize: 16, fontWeight: "600", marginTop: 16 },
  linkBold: { color: "#000", fontWeight: "bold" },
});
