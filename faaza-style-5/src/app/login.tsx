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

export default function LoginScreen() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [hoveredSocial, setHoveredSocial] = useState("");

  const onLogin = () => {
    if (!username.trim() || !password) {
      showNotice("Form belum lengkap", "Isi username dan password dulu.");
      return;
    }

    if (
      (username.trim().toLowerCase() === "admin@gmail.com" ||
        username.trim().toLowerCase() === "admin") &&
      password === "admin123"
    ) {
      router.replace("/(admin)/home");
      return;
    }

    showNotice("Login gagal", "Username atau password demo salah.");
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
              source={require("@/assets/images/style5-reading.png")}
              style={styles.heroImage}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.title}>Welcome Back!</Text>
          <Text style={styles.subtitle}>welcome back we missed you</Text>

          <View style={styles.form}>
            <Text style={styles.label}>Username</Text>
            <MyTextInput
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="Username"
              leftElement={<Ionicons name="person-outline" size={17} color="#B6A9BC" />}
            />

            <Text style={[styles.label, styles.nextLabel]}>Password</Text>
            <MyTextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Password"
              secureTextEntry={!showPassword}
              leftElement={<Ionicons name="key-outline" size={17} color="#B6A9BC" />}
              rightElement={
                <Pressable
                  onPress={() => setShowPassword((previous) => !previous)}
                  accessibilityRole="button"
                  accessibilityLabel={showPassword ? "Hide password" : "Show password"}
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

            <Pressable
              style={styles.forgot}
              onPress={() => showNotice("Forgot Password", "Reset password belum tersedia pada demo.")}
            >
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </Pressable>

            <View style={styles.signInButton}>
              <MyButton text="Sign in" btnType="Primary" action={onLogin} />
            </View>
          </View>

          <View style={styles.socialSection}>
            <View style={styles.separator}>
              <View style={styles.line} />
              <Text style={styles.orText}>Or continue with</Text>
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
                  onPress={() => showNotice(provider.id, "Login sosial belum tersedia pada demo.")}
                  style={[
                    styles.socialButton,
                    hoveredSocial === provider.id && styles.socialHover,
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel={`Sign in with ${provider.id}`}
                >
                  <Ionicons name={provider.icon} size={22} color={provider.color} />
                </Pressable>
              ))}
            </View>
          </View>

          <Pressable style={styles.signUpLink} onPress={() => router.push("/register")}>
            <Text style={styles.bottomText}>
              Don't have an account? <Text style={styles.link}>Sign up</Text>
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
  page: { width: "100%", maxWidth: 430, flexGrow: 1, paddingHorizontal: 29, paddingBottom: 26 },
  hero: { height: 230, marginHorizontal: -29, alignItems: "center", overflow: "hidden" },
  heroImage: { width: "100%", height: 250 },
  title: { color: "#FFFFFF", fontWeight: "800", fontSize: 27, textAlign: "center", marginTop: 6 },
  subtitle: { color: "#B4A6B6", fontSize: 12, textAlign: "center", marginTop: 5 },
  form: { marginTop: 25 },
  label: { color: "#D8CFDA", fontSize: 12, marginBottom: 8 },
  nextLabel: { marginTop: 14 },
  forgot: { alignSelf: "flex-end", paddingVertical: 10, paddingLeft: 10 },
  forgotText: { fontSize: 11, color: "#BFB3C0" },
  signInButton: { marginTop: 15 },
  socialSection: { marginTop: 28 },
  separator: { flexDirection: "row", alignItems: "center", gap: 10 },
  line: { height: 1, flex: 1, backgroundColor: "rgba(255,255,255,0.16)" },
  orText: { fontSize: 11, color: "#BEB0C2" },
  socialRow: { flexDirection: "row", gap: 13, justifyContent: "center", marginTop: 16 },
  socialButton: {
    height: 43,
    width: 53,
    borderRadius: 9,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  socialHover: { borderColor: "#A53CE8", backgroundColor: "rgba(166,60,230,0.24)" },
  signUpLink: { paddingVertical: 18, alignItems: "center", marginTop: 17 },
  bottomText: { color: "#D0C3D0", fontSize: 12 },
  link: { color: "#C66CF5", fontWeight: "700" },
});
