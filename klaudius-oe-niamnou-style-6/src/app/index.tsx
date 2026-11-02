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
import { useRouter } from "expo-router";

export default function WelcomeScreen() {
  const router = useRouter();

  const handleContinue = () => {
    router.push("/login");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topSpace} />

        {/* Illustration Section (Exact Style 6) */}
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

          <Text style={styles.studentFootnote}>
            UTS Mobile Programming • Klaudius Oe Naimnou (240444020010)
          </Text>
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
    marginVertical: 30,
  },
  illustrationImage: {
    width: 250,
    height: 220,
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
    paddingHorizontal: 12,
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
  studentFootnote: {
    textAlign: "center",
    fontSize: 11,
    color: "#94A3B8",
    marginTop: 16,
  },
});