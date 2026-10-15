import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
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

export default function RegisterScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleRegister = () => {
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
      setErrorMessage("Please enter a password.");
      return;
    }
    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
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

  const handleSocialRegister = (provider: string) => {
    const demoEmail = `${provider}.user@example.com`;
    router.replace({
      pathname: "/main",
      params: { userEmail: demoEmail },
    });
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
              Welcome
            </Text>
            <Text className="text-sm text-gray-400">
              Create your account
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

            {/* Confirm Password Field */}
            <View className="border border-gray-300 rounded-lg px-4 py-3 bg-white flex-row items-center justify-between mt-3">
              <TextInput
                className="text-sm text-gray-900 flex-1 pr-2"
                placeholder="Confirm Password"
                placeholderTextColor="#9E9E9E"
                value={confirmPassword}
                onChangeText={(val) => {
                  setConfirmPassword(val);
                  if (errorMessage) setErrorMessage("");
                }}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons
                  name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                  size={18}
                  color="#9E9E9E"
                />
              </TouchableOpacity>
            </View>

            {/* Sign Up Button */}
            <TouchableOpacity
              activeOpacity={0.8}
              disabled={loading}
              onPress={handleRegister}
              className="bg-[#0D1E4C] active:bg-[#081433] rounded-lg py-3.5 items-center justify-center mt-5"
            >
              <Text className="text-white text-base font-semibold">
                {loading ? "Creating account..." : "Sign up"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Divider "── or ──" */}
          <View className="flex-row items-center justify-center my-6">
            <View className="flex-1 h-[1px] bg-gray-200" />
            <Text className="mx-3 text-xs text-gray-400 font-normal">or</Text>
            <View className="flex-1 h-[1px] bg-gray-200" />
          </View>

          {/* Social Logins */}
          <View className="items-center mb-6">
            <SocialButtons onPressProvider={handleSocialRegister} />
          </View>

          {/* Bottom Prompt */}
          <View className="items-center pb-2">
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.push("/login")}
            >
              <Text className="text-xs text-gray-400">
                Already have an account ?{" "}
                <Text className="text-gray-900 font-bold">Login</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}