
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useRouter } from "expo-router";
import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { MyButton } from "@/components";

// Identitas mahasiswa
const STUDENT_NAME = "Nandito Gianza Agni";
const STUDENT_CLASS = "Manajemen Informatika 24";

export default function AdminHomeScreen() {
  const router = useRouter();

  const onLogoutPress = () => {
    router.replace("/login");
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="dark-content" />

      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.brandText}>
                EATMORE PIZZA
              </Text>
              <Text style={styles.pageTitle}>Home</Text>
            </View>

            <View style={styles.headerBadge}>
              <Text style={styles.headerBadgeText}>13</Text>
            </View>
          </View>

          {/* Banner Eatmore */}
          <LinearGradient
            colors={["#FF1F3C", "#F8828F"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.banner}
          >
            <Image
              source={require("@/assets/images/eatmore-food.png")}
              style={styles.foodImage}
              resizeMode="contain"
            />

            <View style={styles.bannerContent}>
              <Image
                source={require("@/assets/images/eatmore-logo.png")}
                style={styles.logo}
                resizeMode="contain"
              />

              <Text style={styles.bannerTitle}>
                Welcome to Eatmore!
              </Text>

              <Text style={styles.bannerDescription}>
                Good food, good mood.
              </Text>
            </View>
          </LinearGradient>

          {/* Welcome */}
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeTitle}>
              Welcome back!
            </Text>

            <Text style={styles.welcomeDescription}>
              Selamat datang di halaman utama
              Eatmore Pizza.
            </Text>
          </View>

          {/* Informasi Mahasiswa */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Student Information
            </Text>

            <View style={styles.studentCard}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>
                  Full Name
                </Text>
                <Text style={styles.infoValue}>
                  {STUDENT_NAME}
                </Text>
              </View>

              <View style={styles.separator} />

              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>
                  Class
                </Text>
                <Text style={styles.infoValue}>
                  {STUDENT_CLASS}
                </Text>
              </View>

              <View style={styles.separator} />

              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>
                  Project
                </Text>
                <Text style={styles.infoValue}>
                  Mobile Programming - Style 13
                </Text>
              </View>
            </View>
          </View>

          {/* Logout */}
          <View style={styles.logoutContainer}>
            <MyButton
              text="Log out"
              btnType="Primary"
              action={onLogoutPress}
            />
          </View>

          <Text style={styles.footerText}>
            Eatmore Pizza - Style 13
          </Text>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 36,
    paddingBottom: 40,
  },
  container: {
    width: "100%",
    maxWidth: 400,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  brandText: {
    color: "#FF1F3C",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 2,
  },
  pageTitle: {
    fontSize: 26,
    color: "#171717",
    fontWeight: "700",
    marginTop: 4,
  },
  headerBadge: {
    width: 38,
    height: 38,
    backgroundColor: "#FFF1F2",
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  headerBadgeText: {
    color: "#FF1F3C",
    fontSize: 15,
    fontWeight: "700",
  },
  banner: {
    height: 220,
    borderRadius: 16,
    overflow: "hidden",
    justifyContent: "center",
    paddingHorizontal: 22,
    marginBottom: 30,
  },
  bannerContent: {
    width: "60%",
    zIndex: 1,
  },
  logo: {
    width: 125,
    height: 100,
    marginBottom: 4,
  },
  bannerTitle: {
    color: "#FFFFFF",
    fontSize: 19,
    fontWeight: "700",
    marginBottom: 6,
  },
  bannerDescription: {
    color: "#FFFFFF",
    fontSize: 12,
  },
  foodImage: {
    position: "absolute",
    width: 205,
    height: 205,
    bottom: -40,
    right: -28,
  },
  welcomeContainer: {
    marginBottom: 28,
  },
  welcomeTitle: {
    fontSize: 21,
    fontWeight: "700",
    color: "#171717",
    marginBottom: 8,
  },
  welcomeDescription: {
    fontSize: 13,
    color: "#777777",
    lineHeight: 20,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#171717",
    marginBottom: 14,
  },
  studentCard: {
    backgroundColor: "#FFF7F7",
    borderWidth: 1,
    borderColor: "#FFE8E8",
    borderRadius: 12,
    padding: 20,
  },
  infoItem: {
    marginVertical: 4,
  },
  infoLabel: {
    fontSize: 11,
    color: "#888888",
    marginBottom: 7,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#272727",
  },
  separator: {
    height: 1,
    backgroundColor: "#F2DEDE",
    marginVertical: 16,
  },
  logoutContainer: {
    marginBottom: 25,
  },
  footerText: {
    textAlign: "center",
    fontSize: 11,
    color: "#AAAAAA",
  },
});
