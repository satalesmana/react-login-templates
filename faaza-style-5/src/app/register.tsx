import { Ionicons } from "@expo/vector-icons";
import MyButton from "@/components/MyButton";
import MyTextInput from "@/components/textInput";
import Style5Screen from "@/components/Style5Screen";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

function showNotice(title: string, message: string) {
  if (Platform.OS === "web") {
    alert(`${title}\n${message}`);
  } else {
    Alert.alert(title, message);
  }
}

export default function RegisterScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [hoveredSocial, setHoveredSocial] = useState("");

  const passwordMeetsDemoRule =
    password.length >= 8 && /[a-zA-Z]/.test(password) && /\d/.test(password);

  const onRegister = () => {
    if (!email.trim() || !name.trim() || !password) {
      showNotice("Form belum lengkap", "Isi semua kolom terlebih dahulu.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      showNotice("Email tidak valid", "Masukkan alamat email yang benar.");
      return;
    }
    if (!passwordMeetsDemoRule) {
      showNotice("Password belum sesuai", "Gunakan minimal 8 karakter dengan huruf dan angka.");
      return;
    }
    showNotice("Form valid", "Registrasi ini hanya demo. Belum ada akun yang disimpan.");
  };

  return (
    <Style5Screen>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.page}>
          <View style={styles.hero}>
            <Image
              source={require("@/assets/images/style5-phone.png")}
              style={styles.heroImage}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.title}>Get Started Free</Text>
          <Text style={styles.subtitle}>Free Forever. No Credit Card Needed</Text>

          <View style={styles.form}>
            <Text style={styles.label}>Email Address</Text>
            <MyTextInput
              placeholder="youremail@gmail.com"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              leftElement={<Ionicons name="mail-outline" size={17} color="#B6A9BC" />}
            />

            <Text style={[styles.label, styles.nextLabel]}>Your Name</Text>
            <MyTextInput
              placeholder="@yourname"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              leftElement={<Ionicons name="person-outline" size={17} color="#B6A9BC" />}
            />

            <Text style={[styles.label, styles.nextLabel]}>Password</Text>
            <MyTextInput
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              leftElement={<Ionicons name="key-outline" size={17} color="#B6A9BC" />}
              rightElement={
                <Pressable
                  onPress={() => setShowPassword((previous) => !previous)}
                  accessibilityLabel={showPassword ? "Hide password" : "Show password"}
                  accessibilityRole="button"
                  hitSlop={12}
                >
                  <Ionicons
                    name={showPassword ? "eye-outline" : "eye-off-outline"}
                    size={17}
                    color="#B6A9BC"
                  />
                </Pressable>
              }
            />
            {password.length > 0 && (
              <Text style={[styles.passwordHint, passwordMeetsDemoRule && styles.goodHint]}>
                {passwordMeetsDemoRule
                  ? "✓ Minimal 8 karakter, huruf dan angka"
                  : "Minimal 8 karakter, huruf dan angka"}
              </Text>
            )}

            <View style={styles.registerButton}>
              <MyButton text="Sign up" btnType="Primary" action={onRegister} />
            </View>
          </View>

          <View style={styles.socialSection}>
            <View style={styles.separator}>
              <View style={styles.line} />
              <Text style={styles.orText}>Or sign up with</Text>
              <View style={styles.line} />
            </View>
            <View style={styles.socialRow}>
              {([
                { id: "Google", icon: "logo-google", color: "#F7B646" },
                { id: "Apple", icon: "logo-apple", color: "#FFFFFF" },
                { id: "Facebook", icon: "logo-facebook", color: "#378BFF" },
              ] as const).map((provider) => (
                <Pressable
                  key={provider.id}
                  onHoverIn={() => setHoveredSocial(provider.id)}
                  onHoverOut={() => setHoveredSocial("")}
                  onPress={() => showNotice(provider.id, "Sign up sosial belum tersedia pada demo.")}
                  accessibilityRole="button"
                  accessibilityLabel={`Sign up with ${provider.id}`}
                  style={[styles.socialButton, hoveredSocial === provider.id && styles.socialHover]}
                >
                  <Ionicons name={provider.icon} color={provider.color} size={22} />
                </Pressable>
              ))}
            </View>
          </View>

          <Pressable style={styles.loginLink} onPress={() => router.replace("/login")}>
            <Text style={styles.bottomText}>
              Already have an account? <Text style={styles.link}>Sign in</Text>
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </Style5Screen>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  scrollContent: { flexGrow: 1, alignItems: "center" },
  page: { flexGrow: 1, width: "100%", maxWidth: 430, paddingHorizontal: 29, paddingBottom: 20 },
  hero: { height: 220, alignItems: "center", justifyContent: "center" },
  heroImage: { width: 220, height: 210 },
  title: { color: "#FFFFFF", textAlign: "center", fontWeight: "800", fontSize: 27 },
  subtitle: { color: "#B7A9B9", textAlign: "center", fontSize: 12, marginTop: 6 },
  form: { marginTop: 25 },
  label: { color: "#D8CFDA", fontSize: 12, marginBottom: 8 },
  nextLabel: { marginTop: 14 },
  passwordHint: { marginTop: 8, color: "#B5A7B8", fontSize: 11 },
  goodHint: { color: "#67D280" },
  registerButton: { marginTop: 22 },
  socialSection: { marginTop: 25 },
  separator: { flexDirection: "row", alignItems: "center", gap: 10 },
  line: { flex: 1, height: 1, backgroundColor: "rgba(255,255,255,0.16)" },
  orText: { color: "#BEB0C2", fontSize: 11 },
  socialRow: { flexDirection: "row", justifyContent: "center", gap: 13, marginTop: 16 },
  socialButton: {
    width: 53,
    height: 43,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  socialHover: { backgroundColor: "rgba(166,60,230,0.24)", borderColor: "#A53CE8" },
  loginLink: { alignItems: "center", paddingVertical: 20, marginTop: 10 },
  bottomText: { color: "#D0C3D0", fontSize: 12 },
  link: { color: "#C66CF5", fontWeight: "700" },
});
