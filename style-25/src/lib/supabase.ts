import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

const supabaseUrl = 'https://ndwqndfvohlqthaswjta.supabase.co';
const supabaseAnonKey = 'sb_publishable_XkhsmjnVPCflO7Eg-7BKQA_IMAgDEss'; 

const DummyStorage = {
  getItem: () => Promise.resolve(null),
  setItem: () => Promise.resolve(),
  removeItem: () => Promise.resolve(),
};

const customStorage = Platform.OS === 'web' && typeof window === 'undefined' ? DummyStorage : AsyncStorage;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: customStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});