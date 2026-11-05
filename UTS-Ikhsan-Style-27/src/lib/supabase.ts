import { AppState, Platform } from 'react-native';
import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// Prevent "@supabase/realtime-js" from throwing on Node.js < 22 during Expo Router web SSR
if (typeof globalThis.WebSocket === 'undefined') {
  (globalThis as unknown as { WebSocket: unknown }).WebSocket = class {};
}

const supabaseUrl =
  process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabasePublishableKey =
  process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'placeholder-publishable-key';

export const isSupabaseConfigured =
  Boolean(process.env.EXPO_PUBLIC_SUPABASE_URL) &&
  !supabaseUrl.includes('project-anda.supabase.co') &&
  !supabaseUrl.includes('your-project-id.supabase.co') &&
  !supabaseUrl.includes('placeholder.supabase.co');

export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    ...(Platform.OS !== 'web' ? { storage: AsyncStorage } : {}),
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export interface LocalUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  password: string;
}

export interface DompetItem {
  id?: number | string;
  userId: string;
  name: string;
  balance: number;
  cardBackground: string;
  cardColor: string;
  created_at?: string;
  updated_at?: string;
}

const REGISTERED_USERS_KEY = '@uts_registered_users';
const CURRENT_SESSION_KEY = '@uts_current_user';
const LOCAL_DOMPET_KEY = '@uts_dompet_items';

export async function saveRegisteredUser(user: Omit<LocalUser, 'id'>): Promise<LocalUser> {
  const normalizedEmail = user.email.trim().toLowerCase();
  const raw = await AsyncStorage.getItem(REGISTERED_USERS_KEY);
  const users: LocalUser[] = raw ? JSON.parse(raw) : [];
  const existingIndex = users.findIndex(
    (u) =>
      (normalizedEmail && u.email.toLowerCase() === normalizedEmail) ||
      (user.phone && u.phone === user.phone.trim())
  );
  const savedUser: LocalUser = {
    id: existingIndex >= 0 ? users[existingIndex].id : `user-${Date.now()}`,
    name: user.name.trim(),
    email: normalizedEmail,
    phone: user.phone ? user.phone.trim() : undefined,
    password: user.password,
  };

  if (existingIndex >= 0) {
    users[existingIndex] = savedUser;
  } else {
    users.push(savedUser);
  }

  await AsyncStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));
  return savedUser;
}

export async function verifyRegisteredUser(
  identifier: string,
  password: string
): Promise<LocalUser | null> {
  const normalized = identifier.trim().toLowerCase();
  const raw = await AsyncStorage.getItem(REGISTERED_USERS_KEY);
  const users: LocalUser[] = raw ? JSON.parse(raw) : [];
  const found = users.find(
    (u) =>
      (u.email.toLowerCase() === normalized || (u.phone && u.phone === normalized)) &&
      u.password === password
  );
  if (found) {
    await AsyncStorage.setItem(CURRENT_SESSION_KEY, JSON.stringify(found));
    return found;
  }
  return null;
}

export async function getLocalSessionUser(): Promise<LocalUser | null> {
  const raw = await AsyncStorage.getItem(CURRENT_SESSION_KEY);
  return raw ? JSON.parse(raw) : null;
}

export async function clearLocalSessionUser(): Promise<void> {
  await AsyncStorage.removeItem(CURRENT_SESSION_KEY);
}

// ==========================================
// CRUD Dompet Helpers (Supabase + Local fallback)
// Sesuai panduan: https://satalesmana.github.io/blog/supabase/
// ==========================================

export async function insertDompet(item: DompetItem): Promise<{ data: DompetItem[] | null; error: any }> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('dompet')
        .insert([
          {
            userId: item.userId,
            name: item.name,
            balance: item.balance,
            cardBackground: item.cardBackground,
            cardColor: item.cardColor,
          },
        ])
        .select();

      if (!error && data) {
        return { data: data as DompetItem[], error: null };
      }
      console.warn('Supabase insert dompet error, falling back to local storage:', error);
    } catch (err) {
      console.warn('Supabase insert dompet exception, falling back to local storage:', err);
    }
  }

  // Local fallback storage
  const raw = await AsyncStorage.getItem(LOCAL_DOMPET_KEY);
  const list: DompetItem[] = raw ? JSON.parse(raw) : [];
  const newItem: DompetItem = {
    ...item,
    id: Date.now(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  list.unshift(newItem);
  await AsyncStorage.setItem(LOCAL_DOMPET_KEY, JSON.stringify(list));
  return { data: [newItem], error: null };
}

export async function getDompetList(userId?: string): Promise<{ data: DompetItem[] | null; error: any }> {
  if (isSupabaseConfigured) {
    try {
      let query = supabase.from('dompet').select().order('balance', { ascending: false });
      if (userId) {
        query = query.eq('userId', userId);
      }
      const { data, error } = await query;
      if (!error && data) {
        return { data: data as DompetItem[], error: null };
      }
    } catch (err) {
      console.warn('Supabase get dompet error, fallback to local:', err);
    }
  }

  const raw = await AsyncStorage.getItem(LOCAL_DOMPET_KEY);
  const list: DompetItem[] = raw ? JSON.parse(raw) : [];
  const filtered = userId ? list.filter((i) => i.userId === userId) : list;
  filtered.sort((a, b) => b.balance - a.balance);
  return { data: filtered, error: null };
}

export async function deleteDompet(id: number | string): Promise<{ error: any }> {
  if (isSupabaseConfigured) {
    try {
      const { error } = await supabase.from('dompet').delete().eq('id', id);
      if (!error) return { error: null };
    } catch (err) {
      console.warn('Supabase delete error:', err);
    }
  }

  const raw = await AsyncStorage.getItem(LOCAL_DOMPET_KEY);
  let list: DompetItem[] = raw ? JSON.parse(raw) : [];
  list = list.filter((i) => String(i.id) !== String(id));
  await AsyncStorage.setItem(LOCAL_DOMPET_KEY, JSON.stringify(list));
  return { error: null };
}

// Tells Supabase Auth to continuously refresh the session automatically
// if the app is in the foreground.
if (Platform.OS !== 'web') {
  AppState.addEventListener('change', (state) => {
    if (state === 'active') {
      supabase.auth.startAutoRefresh();
    } else {
      supabase.auth.stopAutoRefresh();
    }
  });
}
