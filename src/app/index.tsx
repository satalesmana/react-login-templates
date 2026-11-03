import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CLogo from "../components/CLogo";
import { isSupabaseConfigured, supabase } from "../lib/supabase";

export default function SplashScreen() {
  const router = useRouter();
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function checkAuth() {
      try {
        if (isSupabaseConfigured()) {
          const {
            data: { session },
          } = await supabase.auth.getSession();

          if (!isMounted) return;

          if (session?.user) {
            router.replace({
              pathname: "/main",
              params: {
                userEmail: session.user.email || "",
                userName: session.user.user_metadata?.full_name || "",
              },
            });
            return;
          }
        }
      } catch (err) {
        console.warn("Session check error:", err);
      } finally {
        if (isMounted) {
          setCheckingSession(false);
        }
      }

      // Default timeout redirect to /login
      const timer = setTimeout(() => {
        if (isMounted) {
          router.replace("/login");
        }
      }, 2000);

      return () => clearTimeout(timer);
    }

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, [router]);

  return (
    <SafeAreaView className="flex-1 bg-[#0D1E4C]">
      <StatusBar style="light" />
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => router.replace("/login")}
        className="flex-1 items-center justify-center px-6"
      >
        {/* Large Iconic "C" Logo Style 29 */}
        <View className="items-center justify-center">
          <CLogo size={160} variant="orange" />
        </View>

        {/* Loading spinner or tap hint */}
        <View className="absolute bottom-12 items-center">
          {checkingSession ? (
            <ActivityIndicator color="#FFA726" size="small" />
          ) : (
            <Text className="text-white/70 text-xs tracking-widest uppercase">
              Tap to continue
            </Text>
          )}
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
