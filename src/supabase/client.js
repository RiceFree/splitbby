import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';
import { getSupabaseConfig } from './config';

const config = getSupabaseConfig();

console.log("Supabase URL:", config.supabaseUrl);
console.log("Supabase Anon Key:", config.supabaseAnonKey ? '***' : 'NOT SET');

if (!config.supabaseUrl || !config.supabaseAnonKey) {
  throw new Error('Supabase environment variables are not set! Make sure .env file exists with SUPABASE_URL and SUPABASE_ANON_KEY');
}

export const supabase = createClient(config.supabaseUrl, config.supabaseAnonKey);