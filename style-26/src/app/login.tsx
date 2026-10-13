import { FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { MySocialButton } from "../components";

export default function LoginScreen() {
  const [email, onChangeEmail] = React.useState("");
  const [password, onChangePassword] = React.useState("");
  const [rememberMe, setRememberMe] = React.useState(true);
  const [showPassword, setShowPassword] = React.useState(false);
  const router = useRouter();

  const onLoginPress = () => {
    if (email === "" || password === "") {
      alert("Please fill in all fields");
      return;
    }
    if (email === "admin@gmail.com" && password === "tes123") {
      router.replace("/(admin)/home");
    } else {
      alert("Invalid email or password");
      return;
    }
  };

  return (
    <ScrollView style={styles.body} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.textTitle}>Hi, Wecome Back!👋</Text>
      <Text style={styles.textDesc}>Hello again, you've been missed!</Text>

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        placeholderTextColor="#A0A0A0"
        value={email}
        onChangeText={onChangeEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <Text style={styles.label}>Password</Text>
      <View style={styles.passwordWrap}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Please Enter Your Password"
          placeholderTextColor="#A0A0A0"
          value={password}
          onChangeText={onChangePassword}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <FontAwesome5
            name={showPassword ? "eye" : "eye-slash"}
            size={20}
            color="#000000"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.optionRow}>
        <TouchableOpacity
          style={styles.rememberWrap}
          onPress={() => setRememberMe(!rememberMe)}
        >
          <View style={styles.checkbox}>
            {rememberMe && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text style={styles.rememberText}>Remember Me</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => console.log("Forgot password pressed")}>
          <Text style={styles.forgotText}>Forgot Password</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.primaryButton} onPress={onLoginPress}>
        <Text style={styles.primaryButtonText}>Login</Text>
      </TouchableOpacity>

      <View style={styles.dividerRow}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>Or With</Text>
        <View style={styles.dividerLine} />
      </View>

      <View style={styles.socialRow}>
        <MySocialButton
          icon="github"
          text="GitHub"
          action={() => console.log("GitHub pressed")}
        />
        <MySocialButton
          icon="gitlab"
          text="GitLab"
          action={() => console.log("GitLab pressed")}
        />
      </View>

      <View style={styles.bottomRow}>
        <Text style={styles.bottomText}>Don't have an account ? </Text>
        <TouchableOpacity onPress={() => router.push("/register")}>
          <Text style={styles.bottomLink}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  body: {
    backgroundColor: "white",
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingTop: 48,
    paddingBottom: 32,
  },
  textTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#000000",
  },
  textDesc: {
    fontSize: 14,
    color: "#8E8E93",
    marginTop: 6,
    marginBottom: 32,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#4E0189",
    marginBottom: 8,
  },
  input: {
    height: 56,
    borderWidth: 1,
    borderColor: "#D1D1D6",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 15,
    color: "#000000",
    marginBottom: 20,
  },
  passwordWrap: {
    height: 56,
    borderWidth: 1,
    borderColor: "#D1D1D6",
    borderRadius: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  passwordInput: {
    flex: 1,
    fontSize: 15,
    color: "#000000",
  },
  optionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  rememberWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 1.5,
    borderColor: "#8E8E93",
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  checkmark: {
    fontSize: 14,
    fontWeight: "700",
    color: "#000000",
  },
  rememberText: {
    fontSize: 14,
    color: "#000000",
  },
  forgotText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#FF3B30",
  },
  primaryButton: {
    height: 56,
    borderRadius: 14,
    backgroundColor: "#4E0189",
    justifyContent: "center",
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "600",
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 28,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E0E0E0",
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: "#8E8E93",
  },
  socialRow: {
    flexDirection: "row",
    gap: 16,
    marginTop: 20,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: "auto",
    paddingTop: 48,
  },
  bottomText: {
    fontSize: 14,
    color: "#8E8E93",
  },
  bottomLink: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4E0189",
  },
});
