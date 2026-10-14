import { Ionicons } from "@expo/vector-icons";
import { MyButton, MyTextInput } from "@/components";
import { useRouter } from "expo-router";
import React from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [visible, setVisible] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const router = useRouter();

  const onLoginPress = () => {
    if (!email.trim() || !password) {
      setMessage("Email dan password harus diisi.");
      return;
    }

    // Akun dummy untuk demonstrasi UTS, sesuai pola login latihan dosen.
    if (email.trim().toLowerCase() === "admin@gmail.com" && password === "admin123") {
      setMessage("");
      router.replace("/(admin)/home");
    } else {
      setMessage("Email atau password salah.");
    }
  };

  const socialIcons = [
    { name: "logo-facebook" as const, color: "#1877F2", label: "Facebook" },
    { name: "logo-google" as const, color: "#4285F4", label: "Google" },
    { name: "logo-apple" as const, color: "#171717", label: "Apple" },
  ];

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.page}>
          <Pressable
            style={styles.backButton}
            onPress={() => router.replace("/")}
            accessibilityLabel="Kembali ke Welcome"
            accessibilityRole="button"
          >
            <Ionicons name="chevron-back" size={18} color="#20262B" />
          </Pressable>

          <Text style={styles.title}>
            Welcome back! Glad{"\n"}to see you, Again!
          </Text>

          <View style={styles.form}>
            <MyTextInput
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            <MyTextInput
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!visible}
              rightElement={
                <Pressable
                  onPress={() => setVisible(!visible)}
                  hitSlop={10}
                  accessibilityLabel={visible ? "Sembunyikan password" : "Tampilkan password"}
                  accessibilityRole="button"
                >
                  <Ionicons
                    name={visible ? "eye-outline" : "eye-off-outline"}
                    size={18}
                    color="#969DA7"
                  />
                </Pressable>
              }
            />

            <Pressable
              style={styles.forgotLink}
              onPress={() => setMessage("Reset password belum tersedia pada demo UTS.")}
              accessibilityRole="button"
            >
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </Pressable>

            <View style={styles.loginButton}>
              <MyButton
                text="Login"
                btnType="Primary"
                action={onLoginPress}
              />
            </View>

            {message ? <Text style={styles.message}>{message}</Text> : null}
          </View>

          <View style={styles.socialArea}>
            <View style={styles.dividerRow}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>Or Login with</Text>
              <View style={styles.divider} />
            </View>

            <View style={styles.socialRow}>
              {socialIcons.map((item) => (
                <Pressable
                  key={item.label}
                  style={({ pressed }) => [
                    styles.socialButton,
                    pressed && styles.pressed,
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel={`Login ${item.label} demo`}
                  onPress={() => setMessage(`Login ${item.label} belum tersedia pada demo UTS.`)}
                >
                  <Ionicons name={item.name} size={24} color={item.color} />
                </Pressable>
              ))}
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <Pressable onPress={() => router.push("/register")} accessibilityRole="button">
              <Text style={styles.footerLink}>Register Now</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#FFFFFF" },
  scroll: { flex: 1 },
  scrollContent: { flexGrow: 1, alignItems: "center", paddingHorizontal: 25 },
  page: {
    flex: 1,
    width: "100%",
    maxWidth: 375,
    paddingTop: 28,
    paddingBottom: 18,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: "#E6E7E9",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 27,
  },
  title: {
    fontSize: 25,
    fontWeight: "700",
    color: "#20262B",
    lineHeight: 34,
    marginBottom: 28,
  },
  form: { width: "100%" },
  forgotLink: { alignSelf: "flex-end", paddingVertical: 5 },
  forgotText: { color: "#555A60", fontSize: 12 },
  loginButton: { marginTop: 13 },
  message: {
    color: "#A32929",
    textAlign: "center",
    fontSize: 12,
    marginTop: 12,
  },
  socialArea: { marginTop: 28 },
  dividerRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  divider: { height: 1, flex: 1, backgroundColor: "#E8E9ED" },
  dividerText: { fontSize: 11, color: "#9AA1AE" },
  socialRow: { flexDirection: "row", gap: 12, marginTop: 20 },
  socialButton: {
    flex: 1,
    height: 49,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E6E8EC",
    borderRadius: 6,
    backgroundColor: "#FFFFFF",
  },
  pressed: { opacity: 0.7, backgroundColor: "#F5F6F8" },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "auto",
    paddingTop: 35,
  },
  footerText: { color: "#545A61", fontSize: 12 },
  footerLink: { color: "#16B4B6", fontSize: 12, fontWeight: "600" },
});
