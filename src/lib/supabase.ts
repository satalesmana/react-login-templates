import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import { Platform } from "react-native";

// Expo public environment variables
const rawUrl =
  process.env.EXPO_PUBLIC_SUPABASE_URL || "https://placeholder-project.supabase.co";
// Clean up URL in case user copied the REST URL with /rest/v1
const supabaseUrl = rawUrl.replace(/\/rest\/v1\/?$/, "").replace(/\/+$/, "");
const supabaseAnonKey =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

// Safe storage adapter that prevents "window is not defined" during Node/SSR rendering
const isServer = typeof window === "undefined" && Platform.OS === "web";

const safeStorage = {
  getItem: async (key: string): Promise<string | null> => {
    if (isServer) return null;
    try {
      return await AsyncStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem: async (key: string, value: string): Promise<void> => {
    if (isServer) return;
    try {
      await AsyncStorage.setItem(key, value);
    } catch {}
  },
  removeItem: async (key: string): Promise<void> => {
    if (isServer) return;
    try {
      await AsyncStorage.removeItem(key);
    } catch {}
  },
};

export const isSupabaseConfigured = () => {
  return (
    process.env.EXPO_PUBLIC_SUPABASE_URL !== undefined &&
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY !== undefined &&
    process.env.EXPO_PUBLIC_SUPABASE_URL !== "" &&
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY !== "" &&
    !process.env.EXPO_PUBLIC_SUPABASE_URL.includes("placeholder-project")
  );
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: safeStorage,
    autoRefreshToken: !isServer,
    persistSession: !isServer,
    detectSessionInUrl: typeof window !== "undefined",
  },
});

export default supabase;
