import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";

export default function SuccessScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const fullName = (params.fullName as string) || "Mahasiswa";
  const username = (params.username as string) || "";
  const email = (params.email as string) || "";
  const registeredPassword = (params.registeredPassword as string) || "";

  const handleContinue = () => {
    router.replace({
      pathname: "/login",
      params: {
        registeredEmail: email || username,
        registeredPassword: registeredPassword,
        justRegistered: "1",
      },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topSpace} />

        {/* Illustration Section (Left Screen Style 6) */}
        <View style={styles.illustrationSection}>
          <Image
            source={require("../../assets/images/illustrations/welcome-scooter.png")}
            style={styles.illustrationImage}
            resizeMode="contain"
          />
        </View>

        {/* Text Section (Exact copy from Figma Style 6) */}
        <View style={styles.contentSection}>
          <Text style={styles.headlineTop}>SELAMAT!</Text>
          <Text style={styles.headlineBottom}>ANDA SUDAH BERHASIL MENDAFTAR</Text>

          <Text style={styles.description}>
            Silahkan periksa email anda untuk melakukan verifikasi sebelum melakukan Login.
          </Text>

          {/* Registration Info Pill */}
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Nama Terdaftar:</Text>
              <Text style={styles.infoValue}>{fullName}</Text>
            </View>
            {username ? (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Username:</Text>
                <Text style={[styles.infoValue, { color: "#2B92E4" }]}>{username}</Text>
              </View>
            ) : null}
            {email ? (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Email:</Text>
                <Text style={styles.infoValue}>{email}</Text>
              </View>
            ) : null}
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Status Akun:</Text>
              <Text style={[styles.infoValue, { color: "#10B981" }]}>
                Aktif & Siap Digunakan
              </Text>
            </View>
          </View>
        </View>

        {/* Action Button: LANJUTKAN */}
        <View style={styles.bottomSection}>
          <TouchableOpacity
            style={styles.primaryButton}
            activeOpacity={0.85}
            onPress={handleContinue}
          >
            <Text style={styles.primaryButtonText}>LANJUTKAN</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingVertical: 20,
    justifyContent: "space-between",
  },
  topSpace: {
    height: 10,
  },
  illustrationSection: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 24,
  },
  illustrationImage: {
    width: 240,
    height: 210,
  },
  contentSection: {
    alignItems: "center",
    paddingHorizontal: 10,
  },
  headlineTop: {
    fontSize: 20,
    fontWeight: "900",
    color: "#0F172A",
    textAlign: "center",
    letterSpacing: 0.5,
  },
  headlineBottom: {
    fontSize: 18,
    fontWeight: "900",
    color: "#0F172A",
    textAlign: "center",
    marginTop: 4,
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  description: {
    fontSize: 13,
    color: "#475569",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  infoCard: {
    width: "100%",
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  infoLabel: {
    fontSize: 12,
    color: "#64748B",
  },
  infoValue: {
    fontSize: 12,
    fontWeight: "600",
    color: "#0F172A",
  },
  bottomSection: {
    marginTop: "auto",
    paddingTop: 20,
  },
  primaryButton: {
    backgroundColor: "#2B92E4",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#2B92E4",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});
