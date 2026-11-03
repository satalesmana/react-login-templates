import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import { isSupabaseConfigured, supabase } from "../lib/supabase";

const isServer = typeof window === "undefined" && Platform.OS === "web";

async function getStoredItem(key: string): Promise<string | null> {
  if (isServer) return null;
  try {
    return await AsyncStorage.getItem(key);
  } catch {
    return null;
  }
}

async function setStoredItem(key: string, value: string): Promise<void> {
  if (isServer) return;
  try {
    await AsyncStorage.setItem(key, value);
  } catch {}
}

export interface Dompet {
  id: string;
  user_id?: string | null;
  nama_dompet: string;
  jenis_dompet: string;
  saldo: number;
  nomor_rekening?: string | null;
  catatan?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface CreateDompetInput {
  nama_dompet: string;
  jenis_dompet: string;
  saldo: number;
  nomor_rekening?: string;
  catatan?: string;
}

const LOCAL_STORAGE_KEY = "@dompet_offline_data";

// Initial mock data if no data exists yet in local fallback
const DEFAULT_LOCAL_DOMPET: Dompet[] = [
  {
    id: "demo-1",
    nama_dompet: "BCA Tahapan",
    jenis_dompet: "Bank",
    saldo: 3500000,
    nomor_rekening: "5410982341",
    catatan: "Rekening harian",
    created_at: new Date().toISOString(),
  },
  {
    id: "demo-2",
    nama_dompet: "GoPay",
    jenis_dompet: "E-Wallet",
    saldo: 450000,
    nomor_rekening: "081234567890",
    catatan: "Jajan & Transport",
    created_at: new Date().toISOString(),
  },
];

/**
 * Fetch all dompet records for current user
 */
export async function getDompetList(): Promise<Dompet[]> {
  if (isSupabaseConfigured()) {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      let query = supabase
        .from("dompet")
        .select("*")
        .order("created_at", { ascending: false });

      if (user?.id) {
        query = query.or(`user_id.eq.${user.id},user_id.is.null`);
      }

      const { data, error } = await query;

      if (error) {
        console.warn("Supabase dompet error:", error.message);
        return getLocalDompetList();
      }

      if (data) {
        // Also cache locally for offline access
        await setStoredItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
        return data as Dompet[];
      }
    } catch (err) {
      console.warn("Error fetching dompet from Supabase:", err);
      return getLocalDompetList();
    }
  }

  return getLocalDompetList();
}

/**
 * Fallback to AsyncStorage when Supabase is not configured or offline
 */
async function getLocalDompetList(): Promise<Dompet[]> {
  try {
    const raw = await getStoredItem(LOCAL_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw) as Dompet[];
    }
    // initialize default
    await setStoredItem(
      LOCAL_STORAGE_KEY,
      JSON.stringify(DEFAULT_LOCAL_DOMPET)
    );
    return DEFAULT_LOCAL_DOMPET;
  } catch {
    return DEFAULT_LOCAL_DOMPET;
  }
}

/**
 * Insert a new dompet into the Supabase table 'dompet'
 */
export async function createDompet(
  input: CreateDompetInput
): Promise<{ data: Dompet | null; error: string | null }> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const newRecord: Partial<Dompet> = {
    nama_dompet: input.nama_dompet.trim(),
    jenis_dompet: input.jenis_dompet,
    saldo: Number(input.saldo) || 0,
    nomor_rekening: input.nomor_rekening?.trim() || null,
    catatan: input.catatan?.trim() || null,
    user_id: user?.id || null,
  };

  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from("dompet")
        .insert([newRecord])
        .select()
        .single();

      if (error) {
        console.warn("Supabase insert dompet error:", error.message);
        // Save locally as fallback
        const localItem = await insertLocalDompet(newRecord);
        return { data: localItem, error: null };
      }

      return { data: data as Dompet, error: null };
    } catch (err: any) {
      console.warn("Supabase exception inserting dompet:", err);
      const localItem = await insertLocalDompet(newRecord);
      return { data: localItem, error: null };
    }
  }

  // Fallback to local storage
  const localItem = await insertLocalDompet(newRecord);
  return { data: localItem, error: null };
}

async function insertLocalDompet(
  record: Partial<Dompet>
): Promise<Dompet> {
  const currentList = await getLocalDompetList();
  const newItem: Dompet = {
    id: `local-${Date.now()}`,
    user_id: record.user_id || null,
    nama_dompet: record.nama_dompet || "Dompet Baru",
    jenis_dompet: record.jenis_dompet || "Bank",
    saldo: record.saldo || 0,
    nomor_rekening: record.nomor_rekening || null,
    catatan: record.catatan || null,
    created_at: new Date().toISOString(),
  };

  const updated = [newItem, ...currentList];
  await setStoredItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  return newItem;
}

/**
 * Delete a dompet by ID
 */
export async function deleteDompet(
  id: string
): Promise<{ error: string | null }> {
  if (isSupabaseConfigured() && !id.startsWith("local-") && !id.startsWith("demo-")) {
    try {
      const { error } = await supabase.from("dompet").delete().eq("id", id);
      if (error) {
        console.warn("Supabase delete dompet error:", error.message);
      }
    } catch (err: any) {
      console.warn("Supabase delete exception:", err);
    }
  }

  // Also remove from local storage
  try {
    const currentList = await getLocalDompetList();
    const updated = currentList.filter((item) => item.id !== id);
    await setStoredItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn("Local storage delete error:", err);
  }

  return { error: null };
}
