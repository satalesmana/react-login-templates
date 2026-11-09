import { createClient } from "@supabase/supabase-js";
import "react-native-url-polyfill/auto";

const supabaseUrl = "https://sstbedecuoppcgpnejvn.supabase.co";
const supabaseAnonKey = "sb_publishable_U-men0NcJyUqbwXLQFIy2w_XzVD51sd";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
