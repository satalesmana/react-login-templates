import { SafeAreaView, StyleSheet, Text, View } from "react-native";

export default function MainScreen() {
  return (
    <SafeAreaView style={styles.containerMain}>
      <View style={styles.card}>
        <Text style={styles.welcomeText}>Selamat Datang!</Text>
        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Nama:</Text>
          <Text style={styles.infoValue}>Zahwa Nur Aisyah</Text>

          <Text style={styles.infoLabel}>NIM:</Text>
          <Text style={styles.infoValue}>240444020021</Text>

          <Text style={styles.infoLabel}>Program Studi:</Text>
          <Text style={styles.infoValue}>
            Manajemen Informatika - Politeknik LP3I Jakarta
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  containerMain: {
    flex: 1,
    backgroundColor: "#f4f4f4",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#fff",
    padding: 30,
    borderRadius: 15,
    width: "85%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  welcomeText: {
    fontSize: 24,
    fontFamily: "Oswald_700Bold",
    textAlign: "center",
    color: "#2e8b57",
    marginBottom: 20,
  },
  infoBox: { marginTop: 10 },
  infoLabel: {
    fontSize: 12,
    color: "#718096",
    fontFamily: "Oswald_700Bold",
    marginTop: 10,
  },
  infoValue: {
    fontSize: 16,
    color: "#1a202c",
    fontFamily: "Oswald_400Regular",
    borderBottomWidth: 1,
    borderBottomColor: "#edf2f7",
    paddingBottom: 5,
    marginBottom: 5,
  },
});
