import { View, Text, Pressable, StyleSheet, useWindowDimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import WaveHeader from "@/components/WaveHeader";
import { colors, fonts } from "@/theme";

export default function Welcome() {
  const router = useRouter();
  const { height } = useWindowDimensions();
  const headerH = height * 0.6;

  return (
    <View style={styles.container}>
      <WaveHeader height={headerH} />

      <View style={[styles.content, { paddingTop: headerH * 0.9 }]}>
        <View>
          <Text style={styles.title}>Welcome</Text>
          <Text style={styles.desc}>
            lorem lorem lorem lorem lorem lorem lorem lorem
          </Text>
        </View>

        <View style={styles.bottom}>
          <Pressable
            onPress={() => router.push("/login")}
            style={({ pressed }) => [styles.next, pressed && { opacity: 0.7 }]}
          >
            <Text style={styles.nextText}>Next</Text>
            <Ionicons name="arrow-forward" size={16} color={colors.primary} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: {
    flex: 1,
    paddingHorizontal: 28,
    paddingBottom: 40,
    justifyContent: "space-between",
  },
  title: { fontSize: 30, fontFamily: fonts.regular, color: colors.text },
  desc: {
    marginTop: 14,
    fontSize: 11,
    fontFamily: fonts.regular,
    color: colors.muted,
    lineHeight: 16,
    maxWidth: 220,
  },
  bottom: { alignItems: "flex-end" },
  next: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 22,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  nextText: { fontSize: 14, fontFamily: fonts.medium, color: colors.primary },
});