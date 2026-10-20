import { useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { useRouter } from "expo-router";
import WaveHeader from "@/components/WaveHeader";
import LineInput from "@/components/LineInput";
import PrimaryButton from "@/components/PrimaryButton";
import { colors, fonts } from "@/theme";

export default function Register() {
  const router = useRouter();
  const { height } = useWindowDimensions();
  const headerH = height * 0.26;

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  const handleRegister = () => {
    if (!email || !phone || !password || !confirm) {
      setError("Please fill in all fields");
      return;
    }
    if (!email.includes("@")) {
      setError("Email is not valid");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    setError("");
    router.replace("/login");
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={{
          paddingTop: headerH * 0.88,
          paddingHorizontal: 28,
          paddingBottom: 32,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <WaveHeader height={headerH} />

        <Text style={styles.title}>Sign up</Text>
        <View style={styles.underline} />

        <LineInput
          label="Email"
          icon="mail-outline"
          placeholder="demo@email.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <LineInput
          label="Phone No"
          icon="call-outline"
          placeholder="+62 000-00-000"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
        <LineInput
          label="Password"
          icon="lock-closed-outline"
          placeholder="*********"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <LineInput
          label="Confirm Password"
          icon="lock-closed-outline"
          placeholder="*********"
          value={confirm}
          onChangeText={setConfirm}
          secureTextEntry
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <View style={{ marginTop: 24 }}>
          <PrimaryButton title="Create an Account" onPress={handleRegister} />
        </View>

        <View style={styles.footer}>
          <Text style={styles.small}>Already have an Account ! </Text>
          <Pressable onPress={() => router.replace("/login")}>
            <Text style={styles.link}>Login</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 28, fontFamily: fonts.regular, color: colors.text },
  underline: {
    width: 56,
    height: 2,
    backgroundColor: colors.primary,
    marginTop: 4,
    marginBottom: 24,
  },
  small: { fontSize: 11, fontFamily: fonts.regular, color: colors.text },
  error: {
    marginTop: 4,
    fontSize: 12,
    fontFamily: fonts.regular,
    color: colors.error,
  },
  footer: { flexDirection: "row", justifyContent: "center", marginTop: 20 },
  link: { fontSize: 11, fontFamily: fonts.medium, color: colors.primary },
});