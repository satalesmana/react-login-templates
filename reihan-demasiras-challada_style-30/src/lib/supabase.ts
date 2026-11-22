import { createClient } from "@supabase/supabase-js";
import { Platform } from "react-native";

// Hanya import polyfill dan AsyncStorage di native (bukan web/SSR)
if (Platform.OS !== "web") {
  require("react-native-url-polyfill/auto");
}

const supabaseUrl = "https://jngrzijxcdhlvmxhdxnt.supabase.co";
const supabaseAnonKey = "sb_publishable_IPZqJVzO-d2TUSO4U44SUg_3Mh898vw";

// Gunakan localStorage untuk web, AsyncStorage untuk native
const getStorage = () => {
  if (Platform.OS === "web") {
    // Di web, gunakan localStorage bawaan browser
    return typeof window !== "undefined" ? window.localStorage : undefined;
  }
  // Di native (Android/iOS), gunakan AsyncStorage
  const AsyncStorage =
    require("@react-native-async-storage/async-storage").default;
  return AsyncStorage;
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: getStorage(),
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: Platform.OS === "web",
  },
});
