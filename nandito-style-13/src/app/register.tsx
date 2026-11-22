
import { Ionicons } from "@expo/vector-icons";
import { MyButton, MyTextInput } from "@/components";
import { supabase } from "@/lib/supabase";
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

export default function RegisterScreen() {
  const [email, onChangeEmail] = React.useState("");
  const [password, onChangePassword] = React.useState("");
  const [confirmPassword, onChangeConfirmPassword] =
    React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const router = useRouter();

  const showMessage = (message: string) => {
    if (Platform.OS === "web") {
      alert(message);
    } else {
      Alert.alert("Registration", message);
    }
  };

  const onRegisterPress = async () => {
    if (loading) return;

    const normalizedEmail = email.trim().toLowerCase();

    if (
      normalizedEmail === "" ||
      password === "" ||
      confirmPassword === ""
    ) {
      showMessage("Please fill in all fields");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      showMessage("Please enter a valid email address");
      return;
    }

    if (password.length < 6) {
      showMessage("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      showMessage("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: normalizedEmail,
        password,
      });

      if (error) {
        showMessage(error.message);
        return;
      }

      if (!data.user) {
        showMessage("Registration failed. Please try again.");
        return;
      }

      if (data.session) {
  const { error: signOutError } = await supabase.auth.signOut({
    scope: "local",
  });

  if (signOutError) {
    showMessage(
      "Account created, but automatic logout failed. Please log out manually."
    );
    return;
  }
}

const successMessage = data.session
  ? "Registration successful! Please log in."
  : "Registration received. Verify your email if required, then log in.";

if (Platform.OS === "web") {
  alert(successMessage);
  router.replace("/login");
} else {
  Alert.alert("Registration", successMessage, [
    {
      text: "OK",
      onPress: () => router.replace("/login"),
    },
  ]);
}
    } catch {
      showMessage(
        "Unable to connect to Supabase. Check your internet connection."
      );
    } finally {
      setLoading(false);
    }
  };

  const onSocialPress = (provider: string) => {
    showMessage(
      `Sign in with ${provider} is not available yet.`
    );
  };

  return (
    <ScrollView
      style={styles.body}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.container}>
        {/* Judul */}
        <View style={styles.titleContainer}>
          <Text style={styles.textTitle}>Sign up</Text>
        </View>

        {/* Form Registrasi */}
        <View style={styles.inputContainer}>
          <MyTextInput
            placeholder="Email Address"
            value={email}
            onChangeText={onChangeEmail}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
          />

          <MyTextInput
            placeholder="Password"
            value={password}
            onChangeText={onChangePassword}
            secureTextEntry={!showPassword}
            rightElement={
              <Pressable
                onPress={() => setShowPassword(!showPassword)}
                hitSlop={12}
                accessibilityRole="button"
                accessibilityLabel={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                <Ionicons
                  name={
                    showPassword
                      ? "eye-outline"
                      : "eye-off-outline"
                  }
                  size={18}
                  color="#333333"
                />
              </Pressable>
            }
          />

          <MyTextInput
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={onChangeConfirmPassword}
            secureTextEntry
          />
        </View>

        {/* Tombol Register */}
        <View
          style={[
            styles.buttonContainer,
            loading && styles.buttonLoading,
          ]}
          pointerEvents={loading ? "none" : "auto"}
        >
          <MyButton
            text={loading ? "Registering..." : "Register"}
            btnType="Primary"
            action={onRegisterPress}
          />
        </View>

        {/* Navigasi Login */}
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>
            Already have an account?{" "}
          </Text>

          <Pressable onPress={() => router.replace("/login")}>
            <Text style={styles.loginLink}>Log in</Text>
          </Pressable>
        </View>

        {/* Pembatas OR */}
        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Social Login */}
        <View style={styles.socialContainer}>
          <Pressable
            style={styles.socialButton}
            onPress={() => onSocialPress("Google")}
          >
            <Ionicons
              name="logo-google"
              size={18}
              color="#4285F4"
              style={styles.socialIcon}
            />
            <Text style={styles.socialText}>
              Sign in with Google
            </Text>
          </Pressable>

          <Pressable
            style={styles.socialButton}
            onPress={() => onSocialPress("Facebook")}
          >
            <Ionicons
              name="logo-facebook"
              size={18}
              color="#1877F2"
              style={styles.socialIcon}
            />
            <Text style={styles.socialText}>
              Sign in with Facebook
            </Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
    paddingHorizontal: 30,
    paddingBottom: 35,
  },
  container: {
    width: "100%",
    maxWidth: 350,
    paddingTop: 56,
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: 27,
  },
  textTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#111111",
    textAlign: "center",
  },
  inputContainer: {
    width: "100%",
  },
  buttonContainer: {
    marginTop: 27,
  },
  buttonLoading: {
    opacity: 0.6,
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 19,
  },
  loginText: {
    fontSize: 12,
    color: "#606D8B",
  },
  loginLink: {
    fontSize: 12,
    color: "#FF1F3C",
    fontWeight: "600",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 32,
    marginBottom: 26,
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E9E9E9",
  },
  dividerText: {
    color: "#111111",
    fontSize: 13,
    fontWeight: "500",
  },
  socialContainer: {
    gap: 11,
  },
  socialButton: {
    height: 44,
    borderWidth: 1,
    borderColor: "#C9C9C9",
    borderRadius: 6,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  socialIcon: {
    position: "absolute",
    left: 14,
  },
  socialText: {
    fontSize: 12,
    color: "#111111",
    fontWeight: "500",
  },
});
