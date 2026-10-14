import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { MyTextInput } from "@/components";
import { useRouter } from "expo-router";
import React from "react";
import {
  Animated,
  Image,
  Platform,
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

type BrandName = "facebook" | "google" | "apple";

function HoverSocialIcon({
  name,
  color,
}: {
  name: BrandName;
  color: string;
}) {
  const scale = React.useRef(new Animated.Value(1)).current;

  const animate = (toValue: number) => {
    Animated.spring(scale, {
      toValue,
      friction: 5,
      tension: 110,
      useNativeDriver: Platform.OS !== "web",
    }).start();
  };

  return (
    <Pressable
      onHoverIn={() => animate(1.2)}
      onHoverOut={() => animate(1)}
      accessibilityRole="image"
      accessibilityLabel={`${name} icon (demo only)`}
      style={styles.socialPressable}
    >
      <Animated.View style={{ transform: [{ scale }] }}>
        <FontAwesome5 name={name} size={30} color={color} />
      </Animated.View>
    </Pressable>
  );
}

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [keepSignedIn, setKeepSignedIn] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

  const onLoginPress = () => {
    if (!email.trim() || !password) {
      alert("Please fill in your email and password.");
      return;
    }

    if (
      email.trim().toLowerCase() === "admin@gmail.com" &&
      password === "admin123"
    ) {
      router.replace("/(admin)/home");
    } else {
      alert("Invalid email or password.");
    }
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
          <Text style={styles.title}>Welcome Back!</Text>
          <Text style={styles.subtitle}>
            Let's login for explore continues
          </Text>

          <Image
            source={LOGO_IMAGE}
            resizeMode="contain"
            style={styles.logo}
            accessibilityLabel="Rexodus Gaming logo"
          />

          <Text style={styles.label}>Email or Phone Number</Text>
          <View style={styles.fieldWrapper}>
            <MyTextInput
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              autoComplete="email"
              containerStyle={styles.inputContainer}
              style={styles.inputText}
            />
            <View style={styles.fieldIcon} pointerEvents="none">
              <Ionicons name="mail-outline" size={16} color="#E60012" />
            </View>
          </View>

          <Text style={styles.label}>Password</Text>
          <View style={styles.fieldWrapper}>
            <MyTextInput
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoComplete="current-password"
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

          <View style={styles.loginOptions}>
            <Pressable
              style={styles.keepMeSignedIn}
              onPress={() => setKeepSignedIn((value) => !value)}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: keepSignedIn }}
            >
              <View
                style={[
                  styles.checkbox,
                  keepSignedIn && styles.checkboxChecked,
                ]}
              >
                {keepSignedIn && (
                  <Ionicons name="checkmark" color="#FFFFFF" size={13} />
                )}
              </View>
              <Text style={styles.keepText}>Keep me signed in</Text>
            </Pressable>

            <Pressable
              onPress={() => alert("Password recovery is not available in this demo.")}
              accessibilityRole="button"
            >
              <Text style={styles.forgotText}>Forgot password</Text>
            </Pressable>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.signInButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={onLoginPress}
            accessibilityRole="button"
          >
            <Text style={styles.signInText}>Sign in</Text>
          </Pressable>

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>You can Connect with</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.socialRow}>
            <HoverSocialIcon name="facebook" color="#3975E8" />
            <HoverSocialIcon name="google" color="#EA4335" />
            <HoverSocialIcon name="apple" color="#0B0B0B" />
          </View>

          <View style={styles.signupRow}>
            <Text style={styles.signupNormal}>Don't have an account? </Text>
            <Pressable onPress={() => router.push("/register")}>
              <Text style={styles.signupLink}>Sign Up here</Text>
            </Pressable>
          </View>
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
    paddingBottom: 26,
  },
  handle: {
    width: 46,
    height: 5,
    borderRadius: 4,
    backgroundColor: "#DFE2EB",
    marginTop: 12,
    marginBottom: 16,
  },
  formContent: {
    width: "100%",
    maxWidth: 390,
    paddingHorizontal: 22,
  },
  title: {
    fontSize: 19,
    fontWeight: "700",
    color: "#141414",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 11,
    color: "#9B9EAD",
    textAlign: "center",
    marginTop: 6,
  },
  logo: {
    height: 104,
    width: 150,
    alignSelf: "center",
    marginTop: 9,
    marginBottom: 12,
  },
  label: {
    color: "#161616",
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 7,
  },
  fieldWrapper: {
    position: "relative",
    marginBottom: 13,
  },
  inputContainer: {
    height: 44,
    marginBottom: 0,
    paddingHorizontal: 0,
    borderRadius: 9,
    borderWidth: 1,
    backgroundColor: "#F8F8FC",
    borderColor: "#F8F8FC",
  },
  inputText: {
    width: "100%",
    height: "100%",
    fontSize: 12,
    color: "#1B1B1B",
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
    height: 44,
    width: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  loginOptions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 2,
    marginBottom: 22,
  },
  keepMeSignedIn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  checkbox: {
    width: 16,
    height: 16,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: "#E6E7EA",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: "#E00000",
    borderColor: "#E00000",
  },
  keepText: { color: "#A5A6B1", fontSize: 10 },
  forgotText: { color: "#DE0000", fontSize: 11, fontWeight: "600" },
  signInButton: {
    height: 48,
    borderRadius: 10,
    backgroundColor: "#DF0000",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonPressed: { opacity: 0.85 },
  signInText: { color: "#FFFFFF", fontSize: 13, fontWeight: "700" },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    marginTop: 22,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: "#EDEDF0" },
  dividerText: { color: "#A2A4AF", fontSize: 10 },
  socialRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 15,
    marginTop: 18,
    marginBottom: 21,
  },
  socialPressable: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  signupRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
  },
  signupNormal: { color: "#1C1C1C", fontSize: 11 },
  signupLink: { color: "#DF0000", fontSize: 11, fontWeight: "600" },
});
