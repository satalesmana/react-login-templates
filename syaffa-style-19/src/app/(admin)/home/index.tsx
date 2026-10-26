import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const STUDENT_NAME = "Syaffa Azzahra Safitri";
const STUDENT_CLASS = "MANAJEMEN INFORMATIKA 2024";
    
export default function AdminHomeScreen() {
  const router = useRouter();
  const { guest } = useLocalSearchParams<{ guest?: string }>();
  const isGuest = guest === "1";

  return (
    <SafeAreaView style={styles.screen}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <Image
          source={require("@/assets/images/fruzz-logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.brand}>Fruzzdigital</Text>
        <Text style={styles.heading}>
          {isGuest ? "Selamat datang, Guest!" : "Berhasil login admin"}
        </Text>
        <Text style={styles.label}>Nama</Text>
        <Text style={styles.value}>{STUDENT_NAME}</Text>
        <Text style={styles.label}>Kelas</Text>
        <Text style={styles.value}>{STUDENT_CLASS}</Text>
        <Pressable
          style={styles.button}
          onPress={() => router.replace(isGuest ? "/" : "/login")}
          accessibilityRole="button"
        >
          <Text style={styles.buttonText}>{isGuest ? "Kembali" : "Log out"}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#FFFFFF" },
  container: {
    flex: 1,
    padding: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: { width: 90, height: 90, marginBottom: 8 },
  brand: { color: "#20262B", fontSize: 21, fontWeight: "700" },
  heading: {
    marginTop: 28,
    marginBottom: 26,
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    color: "#20262B",
  },
  label: { color: "#949BA3", fontSize: 12, marginTop: 14 },
  value: { color: "#20262B", fontSize: 16, fontWeight: "600", marginTop: 5, textAlign: "center" },
  button: {
    marginTop: 32,
    backgroundColor: "#20262B",
    borderRadius: 6,
    height: 47,
    minWidth: 200,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: { color: "#FFFFFF", fontSize: 13, fontWeight: "600" },
});
