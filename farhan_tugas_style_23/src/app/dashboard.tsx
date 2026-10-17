import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Animated,
} from "react-native";
import { useRouter } from "expo-router";
import MyButton from "../component/mybutton";

export default function DashboardScreen() {
  const router = useRouter();

  // Animasi Smooth Entrance (Sama persis dengan halaman login & register)
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        <Animated.View
          style={[
            styles.container,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Header Dashboard */}
          <View style={styles.headerContainer}>
            <View>
              <Text style={styles.welcomeSubText}>Welcome back,</Text>
              <Text style={styles.headerTitle}>Dashboard</Text>
            </View>
            
            {/* Tombol Logout / Kembali ke Login */}
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={() => router.replace("/login")}
              activeOpacity={0.7}
            >
              <Text style={styles.logoutText}>🚪</Text>
            </TouchableOpacity>
          </View>

          {/* Kartu Informasi Utama (Card Kapsul / Rounded Box) */}
          <View style={styles.cardContainer}>
            <Text style={styles.cardTitle}>Status Akun</Text>
            <Text style={styles.cardDesc}>
              Kamu berhasil masuk ke dalam aplikasi menggunakan template Style 23. Semua navigasi dan animasi berjalan lancar!
            </Text>
          </View>

          {/* Menu / Aksi Cepat */}
          <View style={styles.menuSection}>
            <Text style={styles.sectionTitle}>Menu Utama</Text>

            <View style={styles.menuCard}>
              <Text style={styles.menuIcon}>📊</Text>
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuItemTitle}>Statistik & Analitik</Text>
                <Text style={styles.menuItemDesc}>Lihat laporan performa aplikasi harian</Text>
              </View>
            </View>

            <View style={styles.menuCard}>
              <Text style={styles.menuIcon}>⚙️</Text>
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuItemTitle}>Pengaturan Akun</Text>
                <Text style={styles.menuItemDesc}>Kelola profil dan keamanan sandi</Text>
              </View>
            </View>
          </View>

          {/* Tombol Aksi menggunakan MyButton */}
          <View style={styles.buttonWrapper}>
            <MyButton
              title="Kembali ke Beranda"
              onPress={() => router.push("/")}
              style={styles.mainBtnStyle}
            />
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#EBF2F7", // Background biru muda lembut khas Style 23
  },
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: "#EBF2F7",
    paddingBottom: 32,
  },
  container: {
    flex: 1,
    paddingHorizontal: 26,
    paddingTop: 20,
    justifyContent: "space-between",
  },

  // Header
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 28,
  },
  welcomeSubText: {
    fontSize: 14,
    color: "#718096",
    fontWeight: "600",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#2D3748",
    letterSpacing: -0.5,
  },
  logoutButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
  },
  logoutText: {
    fontSize: 18,
  },

  // Card Info Kapsul/Rounded
  cardContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2D3748",
    marginBottom: 8,
  },
  cardDesc: {
    fontSize: 13.5,
    color: "#64748B",
    lineHeight: 20,
  },

  // Menu Section
  menuSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2D3748",
    marginBottom: 14,
  },
  menuCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
    borderWidth: 1.2,
    borderColor: "#CBD5E1",
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
  },
  menuIcon: {
    fontSize: 22,
    marginRight: 14,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#2D3748",
    marginBottom: 2,
  },
  menuItemDesc: {
    fontSize: 12,
    color: "#718096",
  },

  // Button Style Override
  buttonWrapper: {
    marginTop: 10,
  },
  mainBtnStyle: {
    width: "100%",
    backgroundColor: "#44484B", // Warna gelap solid serasi dengan tombol login/register
    borderRadius: 30,
    height: 52,
  },
});