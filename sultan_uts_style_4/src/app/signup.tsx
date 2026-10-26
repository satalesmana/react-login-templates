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

export default function Signup() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = () => {
    if (!name || !username || !email || !password) {
      setError("Semua kolom harus diisi ya");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Format email belum bener");
      return;
    }
    if (password.length < 6) {
      setError("Password minimal 6 karakter");
      return;
    }
    if (!agree) {
      setError("Centang dulu Terms of Service dan Privacy Policy");
      return;
    }
    setError("");
    router.replace("/login");
  };

  return (
    <View style={styles.container}>
      <BackgroundImage source={require("../../assets/images/signup.png")} />

      <SafeAreaView style={styles.flex}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ScrollView
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.title}>Sign up to Shh!</Text>

            <Pressable
              style={({ pressed }) => [
                styles.googleButton,
                pressed && styles.pressed,
              ]}
            >
              <Ionicons name="logo-google" size={20} color="#fff" />
              <Text style={styles.googleText}>Sign up with Google</Text>
            </Pressable>

            <View style={styles.dividerRow}>
              <View style={styles.line} />
              <Text style={styles.dividerText}>Or continue with Email</Text>
              <View style={styles.line} />
            </View>

            <TextInput
              style={styles.input}
              placeholder="Enter your name"
              placeholderTextColor="#888"
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter username"
              placeholderTextColor="#888"
              autoCapitalize="none"
              value={username}
              onChangeText={setUsername}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter Email"
              placeholderTextColor="#888"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter password"
              placeholderTextColor="#888"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            <Pressable style={styles.checkRow} onPress={() => setAgree(!agree)}>
              <View style={styles.checkbox}>
                {agree && <Ionicons name="checkmark" size={18} color="#000" />}
              </View>
              <Text style={styles.checkText}>
                I agree with the Terms of Service and Privacy policy
              </Text>
            </Pressable>

            {error !== "" && <Text style={styles.error}>{error}</Text>}

            <View style={styles.actionArea}>
              <Pressable
                style={({ pressed }) => [
                  styles.createButton,
                  pressed && styles.pressed,
                ]}
                onPress={handleSignup}
              >
                <Text style={styles.createText}>Create Account</Text>
              </Pressable>
              <Text style={styles.linkText}>
                Already have an account?{"\n"}
                <Text
                  style={styles.linkBold}
                  onPress={() => router.replace("/login")}
                >
                  Login
                </Text>
              </Text>
            </View>
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
  input: {
    backgroundColor: "#fff",
    borderRadius: 25,
    height: 46,
    paddingHorizontal: 20,
    fontSize: 16,
    marginBottom: 10,
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.25)",
  },
  checkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 2,
  },
  checkbox: {
    width: 24,
    height: 24,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  checkText: { flex: 1, color: "#fff", fontSize: 12, fontWeight: "600" },
  error: { color: "#FFE9A8", fontWeight: "600", marginTop: 8 },
  actionArea: {
    alignSelf: "flex-end",
    width: "52%",
    alignItems: "center",
    marginTop: 12,
  },
  createButton: {
    backgroundColor: "#000",
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 26,
  },
  createText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  linkText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 10,
  },
  linkBold: { color: "#000", fontWeight: "bold" },
});
