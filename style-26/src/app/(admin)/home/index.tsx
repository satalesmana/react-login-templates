import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";


export default function AdminHomeScreen() {
  const router = useRouter();

  const onLogoutPress = () => {
    router.replace("/login");
  };

  return (
    <ScrollView style={styles.body} contentContainerStyle={styles.scrollContent}>
      <View style={styles.checkCircle}>
        <Text style={styles.checkmark}>✓</Text>
      </View>

      <Text style={styles.textTitle}>Selamat, Anda Berhasil Login!</Text>
      <Text style={styles.textDesc}>Anda berhasil masuk ke aplikasi.</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Profil Mahasiswa</Text>

        <Text style={styles.label}>Nama</Text>
        <Text style={styles.value}>Nakeshya Raka Putra Priyatna</Text>

        <Text style={styles.label}>NIM</Text>
        <Text style={styles.value}>240444020011</Text>

        <Text style={styles.label}>Prodi</Text>
        <Text style={styles.value}>Manajemen Informatika</Text>

        <Text style={styles.label}>Mata Kuliah</Text>
        <Text style={styles.value}>Mobile Programming</Text>
      </View>

      <Text style={styles.credit}>
        Aplikasi ini dibuat oleh Nakeshya Raka Putra Priyatna
      </Text>

      <TouchableOpacity style={styles.primaryButton} onPress={onLogoutPress}>
        <Text style={styles.primaryButtonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  body: {
    backgroundColor: "white",
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingTop: 48,
    paddingBottom: 32,
  },
  checkCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "#4E0189",
    justifyContent: "center",
    alignItems: "center",
  },
  checkmark: {
    fontSize: 44,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  textTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#000000",
    marginTop: 24,
  },
  textDesc: {
    fontSize: 14,
    color: "#8E8E93",
    marginTop: 6,
    marginBottom: 32,
  },
  card: {
    backgroundColor: "#F3EDF9",
    borderRadius: 14,
    padding: 20,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#4E0189",
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: "500",
    color: "#8E8E93",
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 14,
  },
  credit: {
    fontSize: 14,
    color: "#8E8E93",
    textAlign: "center",
    marginTop: 24,
  },
  primaryButton: {
    height: 56,
    borderRadius: 14,
    backgroundColor: "#4E0189",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "600",
  },
});
