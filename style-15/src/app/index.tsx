import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Illustration from "@/components/Illustration";
import PrimaryButton from "@/components/PrimaryButton";
import { colors, fonts } from "@/theme";

export default function Welcome() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Illustration icon="shield-checkmark-outline" />
        <Text style={styles.title}>Welcome!</Text>
        <Text style={styles.subtitle}>
          Sign in or create a new account to get started
        </Text>

        <View style={styles.buttons}>
          <PrimaryButton title="Login" onPress={() => router.push("/login")} />
          <PrimaryButton
            title="Register"
            variant="outline"
            onPress={() => router.push("/register")}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: {
    flex: 1,
    paddingHorizontal: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    marginTop: 24,
    fontSize: 20,
    fontFamily: fonts.semibold,
    color: colors.text,
  },
  subtitle: {
    marginTop: 8,
    fontSize: 12,
    fontFamily: fonts.regular,
    color: colors.muted,
    textAlign: "center",
  },
  buttons: { width: "100%", gap: 16, marginTop: 40 },
});