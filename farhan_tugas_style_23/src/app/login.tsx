import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Animated,
} from "react-native";
import { useRouter } from "expo-router";
import MyButton from "../component/mybutton";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Animasi Smooth Entrance persis seperti di index.tsx
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        bounces={true}
      >
        <Animated.View
          style={[
            styles.container,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* 1. Tombol Back Circle */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>

          {/* 2. Judul: Hey, Welcome Back */}
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Hey,</Text>
            <Text style={styles.headerTitle}>Welcome</Text>
            <Text style={styles.headerTitle}>Back</Text>
          </View>

          {/* 3. Form Inputs */}
          <View style={styles.formContainer}>
            {/* Input Email */}
            <View style={styles.inputWrapper}>
              <View style={styles.iconBoxLeft}>
                <Text style={styles.inputIconText}>✉</Text>
              </View>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor="#A0AEC0"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Input Password */}
            <View style={styles.inputWrapper}>
              <View style={styles.iconBoxLeft}>
                <Text style={styles.inputIconText}>📍</Text>
              </View>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor="#A0AEC0"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIconBtn}
              >
                <Text style={styles.eyeIconText}>👁</Text>
              </TouchableOpacity>
            </View>

            {/* Forgot Password Link */}
            <TouchableOpacity style={styles.forgotPasswordContainer}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            {/* Tombol Login MyButton */}
            <MyButton
              title="Login"
              onPress={() => router.push("/dashboard")}
              style={styles.loginBtnStyle}
            />
          </View>

          {/* 4. Footer & Social Login */}
          <View style={styles.footerContainer}>
            <Text style={styles.orText}>or continue with</Text>

            <View style={styles.signupPromptContainer}>
              <Text style={styles.promptText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => router.push("/register")}>
                <Text style={styles.signUpLink}>Sign up</Text>
              </TouchableOpacity>
            </View>

            {/* Tombol Google Kapsul Outlined dengan Logo Google Multi-Color CSS Murni */}
            <TouchableOpacity
              style={styles.googleCustomBtn}
              activeOpacity={0.8}
              onPress={() => {
                // Aksi Login Google
              }}
            >
              <View style={styles.googleLogoCircle}>
                <Text style={styles.googleLetterBlue}>G</Text>
              </View>
              <Text style={styles.googleBtnText}>Google</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#EBF2F7", // Background biru muda lembut
  },
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: "#EBF2F7",
    paddingBottom: 28,
  },
  container: {
    flex: 1,
    paddingHorizontal: 26,
    paddingTop: 16,
    justifyContent: "space-between",
  },

  // Back Button Bulat
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  backArrow: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2D3748",
  },

  // Header Title
  headerTitleContainer: {
    marginBottom: 28,
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: "800",
    color: "#2D3748",
    lineHeight: 42,
    letterSpacing: -0.5,
  },

  // Form Inputs
  formContainer: {
    width: "100%",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
    borderWidth: 1.2,
    borderColor: "#CBD5E1",
    borderRadius: 30, // Kapsul Melengkung Presisi
    height: 52,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  iconBoxLeft: {
    width: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  inputIconText: {
    fontSize: 16,
    color: "#A0AEC0",
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: "#2D3748",
  },
  eyeIconBtn: {
    padding: 4,
  },
  eyeIconText: {
    fontSize: 16,
    color: "#A0AEC0",
  },

  // Forgot Password
  forgotPasswordContainer: {
    alignSelf: "flex-end",
    marginBottom: 22,
    marginTop: -2,
  },
  forgotPasswordText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#4A5568",
  },

  // Styling MyButton Login
  loginBtnStyle: {
    width: "100%",
    backgroundColor: "#44484B", // Warna gelap solid persis gambar
    borderRadius: 30,
    height: 52,
  },

  // Footer & Social Login
  footerContainer: {
    alignItems: "center",
    marginTop: 16,
  },
  orText: {
    fontSize: 12,
    color: "#718096",
    marginBottom: 12,
  },
  signupPromptContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  promptText: {
    fontSize: 13,
    color: "#718096",
  },
  signUpLink: {
    fontSize: 13,
    fontWeight: "700",
    color: "#2D3748",
  },

  // Google Custom Button Kapsul Outlined
  googleCustomBtn: {
    flexDirection: "row",
    width: "100%",
    height: 52,
    borderRadius: 30,
    borderWidth: 1.2,
    borderColor: "#44484B",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    gap: 10,
  },
  // Logo G Google Bulat CSS Styled
  googleLogoCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#4285F4",
    alignItems: "center",
    justifyContent: "center",
  },
  googleLetterBlue: {
    fontSize: 13,
    fontWeight: "900",
    color: "#4285F4",
  },
  googleBtnText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#2D3748",
  },
});