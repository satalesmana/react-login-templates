import { Ionicons } from "@expo/vector-icons";
import { MyButton, MyTextInput } from "@/components";
import { supabase } from "../../lib/supabase";
import { useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  Platform,
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
  const [loading, setLoading] = React.useState(false);

  const registrationInProgress = React.useRef(false);

  const onRegister = async () => {
    if (registrationInProgress.current) return;

    const normalizedUsername = username.trim();
    const normalizedEmail = email.trim().toLowerCase();

    setMessage("");

    if (
      !normalizedUsername ||
      !normalizedEmail ||
      !password ||
      !confirmPassword
    ) {
      setMessage("Semua kolom harus diisi.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
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

    registrationInProgress.current = true;
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: normalizedEmail,
        password,
        options: {
          data: {
            username: normalizedUsername,
          },
        },
      });

      if (error) {
        setMessage(error.message);
        return;
      }

      if (!data.user) {
        setMessage("Registrasi gagal. Silakan coba lagi.");
        return;
      }

      // Jika konfirmasi email nonaktif, Supabase dapat
      // langsung membuat sesi. Akhiri sesi tersebut agar
      // pengguna tetap harus login secara manual.
      if (data.session) {
        const { error: signOutError } =
          await supabase.auth.signOut({
            scope: "local",
          });

        if (signOutError) {
          setMessage(
            "Registrasi berhasil, tetapi sesi otomatis gagal diakhiri. Silakan logout terlebih dahulu."
          );
          return;
        }
      }

      const successMessage = data.session
        ? "Registrasi berhasil! Silakan login menggunakan akun baru."
        : "Permintaan registrasi diterima. Jika verifikasi email aktif, periksa inbox terlebih dahulu sebelum login.";

      if (Platform.OS === "web") {
        alert(successMessage);
        router.replace("/login");
      } else {
        Alert.alert(
          "Registrasi",
          successMessage,
          [
            {
              text: "Ke Login",
              onPress: () => router.replace("/login"),
            },
          ]
        );
      }
    } catch {
      setMessage(
        "Tidak dapat menghubungi Supabase. Periksa koneksi internet."
      );
    } finally {
      registrationInProgress.current = false;
      setLoading(false);
    }
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
            <Ionicons
              name="chevron-back"
              size={18}
              color="#20262B"
            />
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
                  accessibilityLabel={
                    showPassword
                      ? "Sembunyikan password"
                      : "Lihat password"
                  }
                >
                  <Ionicons
                    name={
                      showPassword
                        ? "eye-outline"
                        : "eye-off-outline"
                    }
                    size={18}
                    color="#969DA7"
                  />
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
                  accessibilityLabel={
                    showConfirm
                      ? "Sembunyikan konfirmasi"
                      : "Lihat konfirmasi"
                  }
                >
                  <Ionicons
                    name={
                      showConfirm
                        ? "eye-outline"
                        : "eye-off-outline"
                    }
                    size={18}
                    color="#969DA7"
                  />
                </Pressable>
              }
            />

            <View
              style={[
                styles.registerButton,
                loading && styles.loadingButton,
              ]}
            >
              <MyButton
                text={loading ? "Registering..." : "Register"}
                btnType="Primary"
                action={onRegister}
              />
            </View>

            {message ? (
              <Text
                style={styles.message}
                accessibilityRole="alert"
              >
                {message}
              </Text>
            ) : null}
          </View>

          <View style={styles.socialArea}>
            <View style={styles.dividerRow}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>
                Or Register with
              </Text>
              <View style={styles.divider} />
            </View>

            <View style={styles.socialRow}>
              {(
                [
                  "logo-facebook",
                  "logo-google",
                  "logo-apple",
                ] as const
              ).map((name, index) => (
                <Pressable
                  key={name}
                  style={({ pressed }) => [
                    styles.socialButton,
                    pressed && styles.pressed,
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel="Registrasi sosial"
                  onPress={() =>
                    setMessage(
                      "Social register belum tersedia."
                    )
                  }
                >
                  <Ionicons
                    name={name}
                    size={24}
                    color={
                      [
                        "#1877F2",
                        "#4285F4",
                        "#171717",
                      ][index]
                    }
                  />
                </Pressable>
              ))}
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Already have an account?{" "}
            </Text>

            <Pressable
              onPress={() => router.replace("/login")}
              accessibilityRole="button"
            >
              <Text style={styles.footerLink}>
                Login Now
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
    paddingHorizontal: 25,
  },
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
  form: {
    width: "100%",
  },
  registerButton: {
    marginTop: 14,
  },
  loadingButton: {
    opacity: 0.6,
  },
  message: {
    color: "#59636E",
    fontSize: 12,
    textAlign: "center",
    marginTop: 11,
    lineHeight: 18,
  },
  socialArea: {
    marginTop: 25,
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  divider: {
    height: 1,
    flex: 1,
    backgroundColor: "#E8E9ED",
  },
  dividerText: {
    fontSize: 11,
    color: "#9AA1AE",
  },
  socialRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 18,
  },
  socialButton: {
    flex: 1,
    height: 49,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#E6E8EC",
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: {
    opacity: 0.7,
    backgroundColor: "#F5F6F8",
  },
  footer: {
    marginTop: "auto",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 34,
  },
  footerText: {
    fontSize: 12,
    color: "#545A61",
  },
  footerLink: {
    color: "#16B4B6",
    fontSize: 12,
    fontWeight: "600",
  },
});