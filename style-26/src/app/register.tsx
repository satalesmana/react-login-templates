import { FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { MySocialButton } from "../components";

export default function RegisterScreen() {
  const [email, onChangeEmail] = React.useState("");
  const [phone, onChangePhone] = React.useState("");
  const [password, onChangePassword] = React.useState("");
  const [rememberMe, setRememberMe] = React.useState(true);
  const [showPassword, setShowPassword] = React.useState(false);
  const router = useRouter();

  const onSignUpPress = () => {
    if (email === "" || phone === "" || password === "") {
      alert("Please fill in all fields");
      return;
    }
    alert("Account created!");
    router.push("/login");
  };

  return (
    <ScrollView style={styles.body} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.textTitle}>Create an account</Text>
      <Text style={styles.textDesc}>Connect with your friends today!</Text>

      <Text style={styles.label}>Email Address</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        placeholderTextColor="#A0A0A0"
        value={email}
        onChangeText={onChangeEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <Text style={styles.label}>Phone Number</Text>
      <View style={styles.phoneWrap}>
        <Text style={styles.phoneCode}>+855</Text>
        <View style={styles.phoneDivider} />
        <TextInput
          style={styles.phoneInput}
          placeholder="Enter your phonenumber"
          placeholderTextColor="#A0A0A0"
          value={phone}
          onChangeText={onChangePhone}
          keyboardType="phone-pad"
        />
      </View>

      <Text style={styles.label}>Password</Text>
      <View style={styles.passwordWrap}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Please Enter Your Password"
          placeholderTextColor="#A0A0A0"
          value={password}
          onChangeText={onChangePassword}
          autoCapitalize="none"
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

      <TouchableOpacity style={styles.primaryButton} onPress={onSignUpPress}>
        <Text style={styles.primaryButtonText}>Sign Up</Text>
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
        <Text style={styles.bottomText}>Already have an account ? </Text>
        <TouchableOpacity onPress={() => router.push("/login")}>
          <Text style={styles.bottomLink}>Login</Text>
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
  phoneWrap: {
    height: 56,
    borderWidth: 1,
    borderColor: "#D1D1D6",
    borderRadius: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  phoneCode: {
    fontSize: 15,
    color: "#000000",
  },
  phoneDivider: {
    width: 1,
    height: 24,
    backgroundColor: "#D1D1D6",
    marginHorizontal: 12,
  },
  phoneInput: {
    flex: 1,
    fontSize: 15,
    color: "#000000",
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
