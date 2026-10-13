
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

export default function LoginScreen() {
  const [email, onChangeEmail] = React.useState("");
  const [password, onChangePassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);

  const router = useRouter();

  // Validasi login demo dari latihan dosen
  const onLoginPress = () => {
    if (email === "" || password === "") {
      alert("Please fill in all fields");
      return;
    }

    if (email === "admin@gmail.com" && password === "tes123") {
      router.replace("/(admin)/home");
    } else {
      alert("Invalid email or password");
    }
  };

  const onSocialPress = (provider: string) => {
    alert(`Login with ${provider} belum tersedia pada demo.`);
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
          <Text style={styles.textTitle}>Log in</Text>
        </View>

        {/* Form */}
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
        </View>

        {/* Forgot password */}
        <Pressable
          style={styles.forgotContainer}
          onPress={() =>
            alert("Password reset belum tersedia pada demo.")
          }
        >
          <Text style={styles.forgotPasswordText}>
            Forgot Password?
          </Text>
        </Pressable>

        {/* Tombol login */}
        <View style={styles.buttonContainer}>
          <MyButton
            text="Log in"
            btnType="Primary"
            action={onLoginPress}
          />
        </View>

        {/* Link register */}
        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>
            Don't have an account?{" "}
          </Text>

          <Pressable onPress={() => router.push("/register")}>
            <Text style={styles.registerLink}>Sign up</Text>
          </Pressable>
        </View>

        {/* Pembatas OR */}
        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Login sosial */}
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
  forgotContainer: {
    alignSelf: "flex-start",
    marginTop: 1,
  },
  forgotPasswordText: {
    color: "#FF1F3C",
    fontSize: 12,
    fontWeight: "500",
  },
  buttonContainer: {
    marginTop: 27,
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 19,
  },
  registerText: {
    fontSize: 12,
    color: "#606D8B",
  },
  registerLink: {
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
