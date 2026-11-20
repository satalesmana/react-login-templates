import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { supabase } from "../lib/supabase";

export default function MainScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? "");
    });
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
  };

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

        {email ? (
          <Text style={styles.loginAsText}>Login sebagai: {email}</Text>
        ) : null}

        <TouchableOpacity
          style={styles.btnDompet}
          onPress={() => router.push("/dompet")}
        >
          <Text style={styles.btnDompetText}>Dompet Saya</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btnKeluar} onPress={handleLogout}>
          <Text style={styles.btnKeluarText}>Keluar</Text>
        </TouchableOpacity>
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
  loginAsText: {
    fontSize: 12,
    color: "#718096",
    fontFamily: "Oswald_400Regular",
    textAlign: "center",
    marginTop: 15,
  },
  btnDompet: {
    backgroundColor: "#2e8b57",
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 20,
  },
  btnDompetText: {
    fontFamily: "Oswald_700Bold",
    color: "#fff",
    fontSize: 14,
  },
  btnKeluar: {
    borderWidth: 1,
    borderColor: "#c53030",
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 10,
  },
  btnKeluarText: {
    fontFamily: "Oswald_700Bold",
    color: "#c53030",
    fontSize: 14,
  },
});
