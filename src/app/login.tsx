import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CLogo from "../components/CLogo";
import SocialButtons from "../components/SocialButtons";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = () => {
    setErrorMessage("");

    if (!email.trim()) {
      setErrorMessage("Please enter your email.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }
    if (!password) {
      setErrorMessage("Please enter your password.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.replace({
        pathname: "/main",
        params: { userEmail: email.trim() },
      });
    }, 600);
  };

  const handleSocialLogin = (provider: string) => {
    const demoEmail = `${provider}.user@example.com`;
    router.replace({
      pathname: "/main",
      params: { userEmail: demoEmail },
    });
  };

  const handleForgotPassword = () => {
    Alert.alert(
      "Forgot Password",
      "A password reset link has been sent to your email address.",
      [{ text: "OK" }]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          className="px-8 py-6"
        >
          {/* Top Center Logo (Gambar 1) */}
          <View className="items-center mt-6 mb-8">
            <CLogo size={80} variant="navy" />
          </View>

          {/* Heading */}
          <View className="mb-6">
            <Text className="text-2xl font-bold text-[#1A1A1A] mb-1">
              Welcome back!
            </Text>
            <Text className="text-sm text-gray-400">
              Login to your account
            </Text>
          </View>

          {/* Error Message */}
          {errorMessage ? (
            <View className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex-row items-center">
              <Ionicons name="alert-circle" size={16} color="#DC2626" />
              <Text className="ml-2 text-xs text-red-600 flex-1">
                {errorMessage}
              </Text>
            </View>
          ) : null}

          {/* Input Fields */}
          <View className="space-y-4">
            {/* Email Field */}
            <View className="border border-gray-300 rounded-lg px-4 py-3 bg-white">
              <TextInput
                className="text-sm text-gray-900"
                placeholder="Email"
                placeholderTextColor="#9E9E9E"
                value={email}
                onChangeText={(val) => {
                  setEmail(val);
                  if (errorMessage) setErrorMessage("");
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {/* Password Field */}
            <View className="border border-gray-300 rounded-lg px-4 py-3 bg-white flex-row items-center justify-between mt-3">
              <TextInput
                className="text-sm text-gray-900 flex-1 pr-2"
                placeholder="Password"
                placeholderTextColor="#9E9E9E"
                value={password}
                onChangeText={(val) => {
                  setPassword(val);
                  if (errorMessage) setErrorMessage("");
                }}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={18}
                  color="#9E9E9E"
                />
              </TouchableOpacity>
            </View>

            {/* Login Button */}
            <TouchableOpacity
              activeOpacity={0.8}
              disabled={loading}
              onPress={handleLogin}
              className="bg-[#0D1E4C] active:bg-[#081433] rounded-lg py-3.5 items-center justify-center mt-5"
            >
              <Text className="text-white text-base font-semibold">
                {loading ? "Logging in..." : "Login"}
              </Text>
            </TouchableOpacity>

            {/* Forgot Password */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleForgotPassword}
              className="items-center py-3"
            >
              <Text className="text-xs text-gray-500 font-normal">
                Forgot Password ?
              </Text>
            </TouchableOpacity>
          </View>

          {/* Spacer */}
          <View className="flex-1 min-h-[40px]" />

          {/* Social Logins */}
          <View className="items-center mb-6">
            <SocialButtons onPressProvider={handleSocialLogin} />
          </View>

          {/* Bottom Prompt */}
          <View className="items-center pb-2">
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.push("/register")}
            >
              <Text className="text-xs text-gray-400">
                Don't have an account ?{" "}
                <Text className="text-gray-900 font-bold">Sign Up</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}