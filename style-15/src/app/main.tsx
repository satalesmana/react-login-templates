import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Illustration from "@/components/Illustration";
import PrimaryButton from "@/components/PrimaryButton";
import { PROFILE } from "@/profile";
import { colors, fonts } from "@/theme";

export default function Main() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Illustration icon="checkmark" />
        <Text style={styles.title}>Success!</Text>
        <Text style={styles.subtitle}>
          Congratulations! You have been successfully authenticated
        </Text>

        <View style={styles.card}>
          <Text style={styles.label}>Nama</Text>
          <Text style={styles.value}>{PROFILE.name}</Text>
          <View style={styles.divider} />
          <Text style={styles.label}>Kelas</Text>
          <Text style={styles.value}>{PROFILE.kelas}</Text>
        </View>

        <View style={styles.button}>
          <PrimaryButton title="Logout" onPress={() => router.replace("/")} />
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
    fontSize: 18,
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
  card: {
    width: "100%",
    marginTop: 28,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
  },
  label: { fontSize: 10, fontFamily: fonts.regular, color: colors.muted },
  value: {
    marginTop: 2,
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.text,
  },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: 12 },
  button: { width: "100%", marginTop: 32 },
});