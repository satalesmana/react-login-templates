import React from "react";
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { MyButton } from "../components/MyButton";

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} className="flex-1 bg-white justify-between p-6">
      <View style={styles.header} className="items-center mt-12">
        <View style={styles.iconCircle} className="w-24 h-24 rounded-full bg-indigo-50 items-center justify-center mb-6">
          <Ionicons name="sparkles" size={44} color="#4F46E5" />
        </View>

        <Text style={styles.badge} className="text-xs uppercase font-bold tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full mb-3">
          Style 22 Template
        </Text>

        <Text style={styles.title} className="text-3xl font-bold text-slate-900 text-center mb-3">
          Temukan Pengalaman Baru
        </Text>

        <Text style={styles.subtitle} className="text-base text-slate-500 text-center px-4">
          Aplikasi mobile modern dengan desain clean, elegan, dan siap digunakan untuk kebutuhan autentikasi Anda.
        </Text>
      </View>

      <View style={styles.footer} className="w-full pb-8">
        <MyButton
          title="Masuk ke Akun"
          variant="primary"
          onPress={() => router.push("/login")}
          className="mb-3"
        />

        <MyButton
          title="Daftar Akun Baru"
          variant="outline"
          onPress={() => router.push("/register")}
        />

        <View style={styles.guestLink} className="mt-6 items-center">
          <TouchableOpacity onPress={() => router.push("/main")}>
            <Text style={styles.guestText} className="text-sm font-medium text-slate-500">
              Lanjutkan sebagai Tamu &rarr;
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "space-between",
    padding: 24,
  },
  header: {
    alignItems: "center",
    marginTop: 48,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  badge: {
    fontSize: 12,
    fontWeight: "700",
    color: "#4F46E5",
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#0F172A",
    textAlign: "center",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 16,
  },
  footer: {
    width: "100%",
    paddingBottom: 24,
  },
  guestLink: {
    marginTop: 20,
    alignItems: "center",
  },
  guestText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#64748B",
  },
});
