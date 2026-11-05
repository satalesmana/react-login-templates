import { View, Text, ScrollView, StyleSheet, useWindowDimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import WaveHeader from "@/components/WaveHeader";
import PrimaryButton from "@/components/PrimaryButton";
import { PROFILE } from "@/profile";
import { colors, fonts } from "@/theme";

export default function Main() {
  const router = useRouter();
  const { height } = useWindowDimensions();
  const headerH = height * 0.34;

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={{
        paddingTop: headerH * 0.88,
        paddingHorizontal: 28,
        paddingBottom: 32,
      }}
    >
      <WaveHeader height={headerH} />

      <Text style={styles.title}>Welcome Back!</Text>
      <View style={styles.underline} />

      <View style={styles.card}>
        <View style={styles.row}>
          <Ionicons name="person-outline" size={18} color={colors.primary} />
          <View>
            <Text style={styles.label}>Nama</Text>
            <Text style={styles.value}>{PROFILE.name}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.row}>
          <Ionicons name="school-outline" size={18} color={colors.primary} />
          <View>
            <Text style={styles.label}>Kelas</Text>
            <Text style={styles.value}>{PROFILE.kelas}</Text>
          </View>
        </View>
      </View>

      <View style={{ marginTop: 32 }}>
        <PrimaryButton title="Logout" onPress={() => router.replace("/")} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 26, fontFamily: fonts.regular, color: colors.text },
  underline: {
    width: 56,
    height: 2,
    backgroundColor: colors.primary,
    marginTop: 4,
    marginBottom: 24,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 18,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  row: { flexDirection: "row", alignItems: "center", gap: 14 },
  label: { fontSize: 11, fontFamily: fonts.regular, color: colors.muted },
  value: {
    marginTop: 2,
    fontSize: 15,
    fontFamily: fonts.medium,
    color: colors.text,
  },
  divider: { height: 1, backgroundColor: "#EEF0F2", marginVertical: 14 },
});