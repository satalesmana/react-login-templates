import { Stack, useRouter } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminHomeScreen() {
  const router = useRouter();
  const [balance, setBalance] = useState(100000); // Saldo awal dummy

  // Fungsi Tambah Saldo +50.000
  const handleAddWallet = () => {
    setBalance((prev) => prev + 50000);
  };

  // Fungsi Log Out
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.content}>
        <Image
          source={require("@/assets/images/rexodus-logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.name}>Andika Dwiyansyah</Text>
        <Text style={styles.major}>Manajemen Informatika</Text>

        {/* Kotak UI Wallet yang Simpel */}
        <View style={styles.walletCard}>
          <Text style={styles.walletLabel}>My Wallet Balance</Text>
          <Text style={styles.walletBalance}>
            Rp {balance.toLocaleString("id-ID")}
          </Text>

          {/* Tombol Tambah Wallet +50.000 */}
          <Pressable style={styles.addWalletButton} onPress={handleAddWallet}>
            <Text style={styles.addWalletText}>+ Add Wallet (+50.000)</Text>
          </Pressable>
        </View>

        {/* Tombol Log Out */}
        <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Log Out</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  logo: {
    width: 140,
    height: 140,
    marginBottom: 16,
  },
  name: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111111",
    textAlign: "center",
  },
  major: {
    fontSize: 14,
    color: "#666666",
    textAlign: "center",
    marginBottom: 24,
  },
  walletCard: {
    width: "100%",
    maxWidth: 320,
    backgroundColor: "#F8F8FC",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#EDEDF0",
    marginBottom: 16,
  },
  walletLabel: {
    fontSize: 12,
    color: "#888888",
    fontWeight: "600",
    marginBottom: 6,
  },
  walletBalance: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111111",
    marginBottom: 14,
  },
  addWalletButton: {
    backgroundColor: "#22C55E",
    width: "100%",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  addWalletText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
  logoutButton: {
    width: "100%",
    maxWidth: 320,
    backgroundColor: "#DF0000",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  logoutText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
});