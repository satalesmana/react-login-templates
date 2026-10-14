import { Ionicons } from "@expo/vector-icons";
import { MyTextInput } from "@/components";
import { useRouter } from "expo-router";
import React from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Letakkan gambarnya di assets/images/rexodus-logo.png
const LOGO_IMAGE = require("@/assets/images/rexodus-logo.png");

export default function RegisterScreen() {
  const router = useRouter();
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const onContinuePress = () => {
    if (!firstName.trim() || !lastName.trim() || !password || !confirmPassword) {
      alert("Please fill in all fields.");
      return;
    }
    if (password.length < 6) {
      alert("Password must contain at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    alert(
      "Form valid. This is a UI demo, so no new account was created. Please sign in using the provided dummy account."
    );
    router.replace("/login");
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <StatusBar barStyle="light-content" backgroundColor="#050505" />
      <View style={styles.blackTop} />
      <ScrollView
        style={styles.whiteSheet}
        contentContainerStyle={styles.sheetContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.handle} />
        <View style={styles.formContent}>
          <Text style={styles.title}>Create Your Account</Text>
          <Text style={styles.subtitle}>Create account for exploring news</Text>

          <Image
            source={LOGO_IMAGE}
            resizeMode="contain"
            style={styles.logo}
            accessibilityLabel="Rexodus Gaming logo"
          />

          <Text style={styles.label}>First Name</Text>
          <View style={styles.fieldWrapper}>
            <MyTextInput
              placeholder="First Name"
              value={firstName}
              onChangeText={setFirstName}
              autoCapitalize="words"
              autoComplete="given-name"
              containerStyle={styles.inputContainer}
              style={styles.inputText}
            />
            <View style={styles.fieldIcon} pointerEvents="none">
              <Ionicons name="person-outline" size={16} color="#E60012" />
            </View>
          </View>

          <Text style={styles.label}>Last Name</Text>
          <View style={styles.fieldWrapper}>
            <MyTextInput
              placeholder="Last Name"
              value={lastName}
              onChangeText={setLastName}
              autoCapitalize="words"
              autoComplete="family-name"
              containerStyle={styles.inputContainer}
              style={styles.inputText}
            />
            <View style={styles.fieldIcon} pointerEvents="none">
              <Ionicons name="person-outline" size={16} color="#E60012" />
            </View>
          </View>

          <Text style={styles.label}>Password</Text>
          <View style={styles.fieldWrapper}>
            <MyTextInput
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              autoCapitalize="none"
              secureTextEntry={!showPassword}
              autoComplete="new-password"
              containerStyle={styles.inputContainer}
              style={[styles.inputText, styles.passwordText]}
            />
            <View style={styles.fieldIcon} pointerEvents="none">
              <Ionicons
                name="lock-closed-outline"
                size={16}
                color="#E60012"
              />
            </View>
            <Pressable
              style={styles.eyeButton}
              onPress={() => setShowPassword((value) => !value)}
              hitSlop={10}
              accessibilityRole="button"
              accessibilityLabel={showPassword ? "Hide password" : "Show password"}
            >
              <Ionicons
                name={showPassword ? "eye-outline" : "eye-off-outline"}
                size={18}
                color="#9898A3"
              />
            </Pressable>
          </View>

          <Text style={styles.label}>Confirm Password</Text>
          <View style={styles.fieldWrapper}>
            <MyTextInput
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              autoCapitalize="none"
              secureTextEntry={!showConfirmPassword}
              autoComplete="new-password"
              containerStyle={styles.inputContainer}
              style={[styles.inputText, styles.passwordText]}
            />
            <View style={styles.fieldIcon} pointerEvents="none">
              <Ionicons
                name="lock-closed-outline"
                size={16}
                color="#E60012"
              />
            </View>
            <Pressable
              style={styles.eyeButton}
              onPress={() => setShowConfirmPassword((value) => !value)}
              hitSlop={10}
              accessibilityRole="button"
              accessibilityLabel={
                showConfirmPassword ? "Hide confirm password" : "Show confirm password"
              }
            >
              <Ionicons
                name={showConfirmPassword ? "eye-outline" : "eye-off-outline"}
                size={18}
                color="#9898A3"
              />
            </Pressable>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.continueButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={onContinuePress}
            accessibilityRole="button"
          >
            <Text style={styles.continueText}>Continue</Text>
          </Pressable>

          <Pressable
            onPress={() => router.replace("/login")}
            accessibilityRole="button"
            style={styles.backToLogin}
          >
            <Text style={styles.backToLoginText}>Already have an account? Sign in</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#050505" },
  blackTop: { height: 20, backgroundColor: "#050505" },
  whiteSheet: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 27,
    borderTopRightRadius: 27,
  },
  sheetContent: {
    flexGrow: 1,
    alignItems: "center",
    paddingBottom: 25,
  },
  handle: {
    width: 46,
    height: 5,
    backgroundColor: "#DFE2EB",
    borderRadius: 4,
    marginTop: 12,
    marginBottom: 15,
  },
  formContent: {
    width: "100%",
    maxWidth: 390,
    paddingHorizontal: 22,
  },
  title: {
    fontSize: 19,
    color: "#151515",
    fontWeight: "700",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 11,
    color: "#9B9EAD",
    textAlign: "center",
    marginTop: 6,
  },
  logo: {
    height: 100,
    width: 150,
    alignSelf: "center",
    marginTop: 3,
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: "#171717",
    marginBottom: 7,
  },
  fieldWrapper: {
    position: "relative",
    marginBottom: 13,
  },
  inputContainer: {
    height: 43,
    paddingHorizontal: 0,
    marginBottom: 0,
    backgroundColor: "#F8F8FC",
    borderColor: "#F8F8FC",
    borderWidth: 1,
    borderRadius: 9,
  },
  inputText: {
    width: "100%",
    height: "100%",
    color: "#171717",
    fontSize: 12,
    paddingLeft: 39,
    paddingRight: 12,
  },
  passwordText: {
    paddingRight: 45,
  },
  fieldIcon: {
    position: "absolute",
    left: 13,
    top: 13,
  },
  eyeButton: {
    position: "absolute",
    right: 12,
    top: 0,
    width: 28,
    height: 43,
    alignItems: "center",
    justifyContent: "center",
  },
  continueButton: {
    backgroundColor: "#DF0000",
    minHeight: 48,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },
  buttonPressed: { opacity: 0.85 },
  continueText: { color: "#FFFFFF", fontSize: 13, fontWeight: "700" },
  backToLogin: { paddingVertical: 15, alignItems: "center" },
  backToLoginText: { fontSize: 11, color: "#DF0000" },
});
