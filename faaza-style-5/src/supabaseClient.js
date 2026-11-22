import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const supabaseUrl = 'https://etxolukzauseevpzzpcl.supabase.co';
const supabaseAnonKey = 'sb_publishable_9zBe6chUInbbY4vIieyBoQ_5lNjUJda';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    ...(Platform.OS !== 'web' || typeof window !== 'undefined'
      ? { storage: AsyncStorage }
      : {}),
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});