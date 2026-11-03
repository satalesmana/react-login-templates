import { Stack } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  View,
} from "react-native";
import type { Session } from "@supabase/supabase-js";

import { supabase } from "../../lib/supabase";
import "../../global.css";

export default function RootLayout() {
  const [session, setSession] =
    React.useState<Session | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let active = true;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, nextSession) => {
        if (!active) return;

        setSession(nextSession);
      }
    );

    const restoreSession = async () => {
      try {
        const { data, error } =
          await supabase.auth.getSession();

        if (!active) return;

        setSession(error ? null : data.session);
      } catch {
        if (active) {
          setSession(null);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void restoreSession();

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color="#20BFC4"
        />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />

      <Stack.Protected guard={session !== null}>
        <Stack.Screen name="(admin)" />
      </Stack.Protected>
    </Stack>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
});