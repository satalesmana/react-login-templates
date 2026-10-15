import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import FontAwesome from "@expo/vector-icons/FontAwesome";

import { authService } from "@/services/authStore";
import MyButton from "@/components/MyButton";

export default function DashboardScreen() {
  const router = useRouter();
  const user = authService.getCurrentUser() || {
    fullName: "Guest",
    username: "guest",
    email: "-",
    role: "user" as const,
  };

  const isAdmin = user.role === "admin";

  const handleLogout = () => {
    authService.logout();
    router.replace("/login");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View
            style={[
              styles.avatarContainer,
              isAdmin ? styles.adminAvatar : styles.userAvatar,
            ]}
          >
            <FontAwesome
              name={isAdmin ? "shield" : "user"}
              size={40}
              color={isAdmin ? "#DEC39A" : "#FFFFFF"}
            />
          </View>
          <Text style={styles.welcomeText}>Hello,</Text>
          <Text style={styles.nameText}>{user.fullName}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Account Details</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Username</Text>
            <Text style={styles.infoValue}>@{user.username}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{user.email}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Role</Text>
            <Text style={styles.infoValue}>
              {isAdmin ? "Full Access (Administrator)" : "Standard User"}
            </Text>
          </View>
        </View>

        <View style={styles.buttonWrapper}>
          <MyButton
            text="Logout"
            variant="outline"
            action={handleLogout}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#102C57",
  },
  container: {
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100%",
  },
  header: {
    alignItems: "center",
    marginBottom: 28,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 2,
  },
  adminAvatar: {
    backgroundColor: "#1B3A6B",
    borderColor: "#DEC39A",
  },
  userAvatar: {
    backgroundColor: "#1B3A6B",
    borderColor: "#93C5FD",
  },
  welcomeText: {
    color: "#CBD5E1",
    fontSize: 16,
  },
  nameText: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "700",
    marginTop: 4,
  },
  roleBadge: {
    marginTop: 10,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  roleBadgeAdmin: {
    backgroundColor: "#DEC39A",
  },
  roleBadgeUser: {
    backgroundColor: "#2563EB",
  },
  roleText: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1,
  },
  roleTextAdmin: {
    color: "#102C57",
  },
  roleTextUser: {
    color: "#FFFFFF",
  },
  card: {
    width: "100%",
    maxWidth: 340,
    backgroundColor: "#173769",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  cardTitle: {
    color: "#DEC39A",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoLabel: {
    color: "#94A3B8",
    fontSize: 14,
  },
  infoValue: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: "#224A8A",
    marginVertical: 12,
  },
  adminPanel: {
    width: "100%",
    maxWidth: 340,
    backgroundColor: "#152E57",
    borderWidth: 1,
    borderColor: "#DEC39A",
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  adminHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  adminPanelTitle: {
    color: "#DEC39A",
    fontSize: 15,
    fontWeight: "700",
  },
  adminPanelDesc: {
    color: "#CBD5E1",
    fontSize: 13,
    lineHeight: 18,
  },
  buttonWrapper: {
    width: "100%",
    alignItems: "center",
    marginTop: 8,
  },
});
