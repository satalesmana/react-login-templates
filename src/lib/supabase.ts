import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
const authStorage =
  typeof window === "undefined"
    ? {
        getItem: async (_key: string): Promise<string | null> => null,
        setItem: async (_key: string, _value: string): Promise<void> => {},
        removeItem: async (_key: string): Promise<void> => {},
      }
    : AsyncStorage;

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient<Database>(supabaseUrl, supabaseAnonKey, {
        auth: {
          storage: authStorage,
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: false,
        },
      })
    : null;

export function getSupabase() {
  if (!supabase) {
    throw new Error(
      "Konfigurasi Supabase belum lengkap. Atur EXPO_PUBLIC_SUPABASE_URL dan EXPO_PUBLIC_SUPABASE_ANON_KEY."
    );
  }

  return supabase;
}
