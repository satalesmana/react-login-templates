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
  password: string;
}

const REGISTERED_USERS_KEY = '@uts_registered_users';
const CURRENT_SESSION_KEY = '@uts_current_user';

export async function saveRegisteredUser(user: Omit<LocalUser, 'id'>): Promise<LocalUser> {
  const normalizedEmail = user.email.trim().toLowerCase();
  const raw = await AsyncStorage.getItem(REGISTERED_USERS_KEY);
  const users: LocalUser[] = raw ? JSON.parse(raw) : [];
  const existingIndex = users.findIndex((u) => u.email.toLowerCase() === normalizedEmail);
  const savedUser: LocalUser = {
    id: existingIndex >= 0 ? users[existingIndex].id : `user-${Date.now()}`,
    name: user.name.trim(),
    email: normalizedEmail,
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
  email: string,
  password: string
): Promise<LocalUser | null> {
  const normalizedEmail = email.trim().toLowerCase();
  const raw = await AsyncStorage.getItem(REGISTERED_USERS_KEY);
  const users: LocalUser[] = raw ? JSON.parse(raw) : [];
  const found = users.find(
    (u) => u.email.toLowerCase() === normalizedEmail && u.password === password
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

// Tells Supabase Auth to continuously refresh the session automatically
// if the app is in the foreground. When this is added, you will continue
// to receive `onAuthStateChange` events with the `TOKEN_REFRESHED` or
// `SIGNED_OUT` event if the user's session is terminated. This should
// only be registered once.
if (Platform.OS !== 'web') {
  AppState.addEventListener('change', (state) => {
    if (state === 'active') {
      supabase.auth.startAutoRefresh();
    } else {
      supabase.auth.stopAutoRefresh();
    }
  });
}
