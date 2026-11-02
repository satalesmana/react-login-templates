
import { router } from "expo-router";
import React from "react";
import {
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { supabase } from "@/lib/supabase";

export default function AdminProfileScreen() {
  const [loading, setLoading] = React.useState(false);

  const showError = (message: string) => {
    if (Platform.OS === "web") {
      alert(message);
    } else {
      Alert.alert("Logout Failed", message);
    }
  };

  const onLogoutPress = async () => {
    if (loading) return;

    setLoading(true);

    try {
      const { error } = await supabase.auth.signOut({
        scope: "local",
      });

      if (error) {
        showError(error.message);
        return;
      }

      router.replace("/login");
    } catch {
      showError(
        "Unable to log out. Check your internet connection."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.body}>
      <View style={styles.container}>
        <Text style={styles.title}>My Profile</Text>

        <Text style={styles.description}>
          Manage your Eatmore Pizza account.
        </Text>

        <Pressable
          style={[
            styles.logoutButton,
            loading && styles.disabledButton,
          ]}
          onPress={onLogoutPress}
          disabled={loading}
          accessibilityRole="button"
          accessibilityLabel="Log out"
          accessibilityState={{ disabled: loading }}
        >
          <Text style={styles.logoutText}>
            {loading ? "Logging out..." : "Log out"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
  },
  container: {
    width: "100%",
    maxWidth: 410,
    paddingHorizontal: 30,
    paddingTop: 56,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111111",
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: "#606D8B",
    marginBottom: 32,
  },
  logoutButton: {
    minHeight: 48,
    backgroundColor: "#FF1F3C",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  disabledButton: {
    opacity: 0.6,
  },
  logoutText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
});
