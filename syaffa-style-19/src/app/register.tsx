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

export default function RegisterScreen() {
  const router = useRouter();
  const [username, setUsername] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [message, setMessage] = React.useState("");

  const onRegister = () => {
    if (!username.trim() || !email.trim() || !password || !confirmPassword) {
      setMessage("Semua kolom harus diisi.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setMessage("Format email belum benar.");
      return;
    }
    if (password.length < 6) {
      setMessage("Password minimal 6 karakter.");
      return;
    }
    if (password !== confirmPassword) {
      setMessage("Konfirmasi password tidak cocok.");
      return;
    }
    // Sesuai scope UTS: validasi form saja, tidak menyimpan akun sungguhan.
    setMessage("Form valid. Registrasi masih demo dan akun belum disimpan.");
  };

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
            accessibilityRole="button"
            accessibilityLabel="Kembali ke Welcome"
          >
            <Ionicons name="chevron-back" size={18} color="#20262B" />
          </Pressable>

          <Text style={styles.title}>
            Hello! Register to get{"\n"}started
          </Text>

          <View style={styles.form}>
            <MyTextInput
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="words"
            />
            <MyTextInput
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            <MyTextInput
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              rightElement={
                <Pressable
                  onPress={() => setShowPassword(!showPassword)}
                  hitSlop={10}
                  accessibilityRole="button"
                  accessibilityLabel={showPassword ? "Sembunyikan password" : "Lihat password"}
                >
                  <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={18} color="#969DA7" />
                </Pressable>
              }
            />
            <MyTextInput
              placeholder="Confirm password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirm}
              rightElement={
                <Pressable
                  onPress={() => setShowConfirm(!showConfirm)}
                  hitSlop={10}
                  accessibilityRole="button"
                  accessibilityLabel={showConfirm ? "Sembunyikan konfirmasi" : "Lihat konfirmasi"}
                >
                  <Ionicons name={showConfirm ? "eye-outline" : "eye-off-outline"} size={18} color="#969DA7" />
                </Pressable>
              }
            />
            <View style={styles.registerButton}>
              <MyButton text="Register" btnType="Primary" action={onRegister} />
            </View>
            {message ? <Text style={styles.message}>{message}</Text> : null}
          </View>

          <View style={styles.socialArea}>
            <View style={styles.dividerRow}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>Or Register with</Text>
              <View style={styles.divider} />
            </View>
            <View style={styles.socialRow}>
              {(["logo-facebook", "logo-google", "logo-apple"] as const).map((name, index) => (
                <Pressable
                  key={name}
                  style={({ pressed }) => [styles.socialButton, pressed && styles.pressed]}
                  accessibilityRole="button"
                  accessibilityLabel="Registrasi sosial demo"
                  onPress={() => setMessage("Social register belum tersedia pada demo UTS.")}
                >
                  <Ionicons
                    name={name}
                    size={24}
                    color={["#1877F2", "#4285F4", "#171717"][index]}
                  />
                </Pressable>
              ))}
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <Pressable onPress={() => router.replace("/login")} accessibilityRole="button">
              <Text style={styles.footerLink}>Login Now</Text>
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
    marginBottom: 27,
  },
  form: { width: "100%" },
  registerButton: { marginTop: 14 },
  message: {
    color: "#59636E",
    fontSize: 12,
    textAlign: "center",
    marginTop: 11,
    lineHeight: 18,
  },
  socialArea: { marginTop: 25 },
  dividerRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  divider: { height: 1, flex: 1, backgroundColor: "#E8E9ED" },
  dividerText: { fontSize: 11, color: "#9AA1AE" },
  socialRow: { flexDirection: "row", gap: 12, marginTop: 18 },
  socialButton: {
    flex: 1,
    height: 49,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#E6E8EC",
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: { opacity: 0.7, backgroundColor: "#F5F6F8" },
  footer: {
    marginTop: "auto",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 34,
  },
  footerText: { fontSize: 12, color: "#545A61" },
  footerLink: { fontSize: 12, color: "#16B4B6", fontWeight: "600" },
});
