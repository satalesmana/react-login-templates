import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vvwdqfrsxdcxyyzphfxy.supabase.co'
const supabaseAnonKey = 'sb_publishable_0iSX1Ph6hGFkUbZpxk07ng_5Zbr3J3p'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)