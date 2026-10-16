import React from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { MyButton } from "../components/MyButton";

export default function MainScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} className="flex-1 bg-slate-50 justify-between p-6">
      <View style={styles.content} className="items-center mt-16 px-4">
        <View style={styles.successBadge} className="w-20 h-20 rounded-full bg-emerald-100 items-center justify-center mb-6">
          <Ionicons name="checkmark-circle" size={48} color="#10B981" />
        </View>

        <Text style={styles.title} className="text-2xl font-bold text-slate-900 text-center mb-2">
          Autentikasi Berhasil!
        </Text>

        <Text style={styles.subtitle} className="text-sm text-slate-500 text-center mb-8">
          Selamat datang di halaman utama Style 22. Template autentikasi Anda sudah berfungsi dengan baik.
        </Text>

        <View style={styles.infoCard} className="w-full bg-white p-5 rounded-2xl border border-slate-200 mb-6">
          <Text style={styles.cardTitle} className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            Informasi Proyek
          </Text>

          <View style={styles.infoRow} className="flex-row justify-between py-2 border-b border-slate-100">
            <Text style={styles.infoLabel} className="text-sm text-slate-500">Nama Style</Text>
            <Text style={styles.infoValue} className="text-sm font-semibold text-slate-800">Style 22</Text>
          </View>

          <View style={styles.infoRow} className="flex-row justify-between py-2 border-b border-slate-100">
            <Text style={styles.infoLabel} className="text-sm text-slate-500">Branch</Text>
            <Text style={styles.infoValue} className="text-sm font-semibold text-indigo-600">Hamzah-Fadhila</Text>
          </View>

          <View style={styles.infoRow} className="flex-row justify-between py-2">
            <Text style={styles.infoLabel} className="text-sm text-slate-500">Framework</Text>
            <Text style={styles.infoValue} className="text-sm font-semibold text-slate-800">Expo Router + NativeWind</Text>
          </View>
        </View>
      </View>

      <View style={styles.footer} className="w-full pb-8">
        <MyButton
          title="Keluar (Sign Out)"
          variant="outline"
          onPress={() => router.replace("/")}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    justifyContent: "space-between",
    padding: 24,
  },
  content: {
    alignItems: "center",
    marginTop: 64,
  },
  successBadge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#D1FAE5",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#0F172A",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 32,
    paddingHorizontal: 12,
  },
  infoCard: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  cardTitle: {
    fontSize: 11,
    fontWeight: "700",
    color: "#94A3B8",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  infoLabel: {
    fontSize: 14,
    color: "#64748B",
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0F172A",
  },
  footer: {
    width: "100%",
    paddingBottom: 24,
  },
});
