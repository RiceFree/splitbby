import Constants from 'expo-constants';

export const getSupabaseConfig = () => {
  // Try to get from Constants first (from app.json extra)
  let supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl;
  let supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey;

  // Fallback to environment variables
  if (!supabaseUrl) {
    supabaseUrl = process.env.SUPABASE_URL;
  }
  if (!supabaseAnonKey) {
    supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
  }

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase configuration incomplete');
    console.warn('supabaseUrl:', supabaseUrl);
    console.warn('supabaseAnonKey:', supabaseAnonKey ? '***' : undefined);
  }

  return {
    supabaseUrl,
    supabaseAnonKey,
  };
};
