// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';

// meglio prendere da env; per demo/incubazione puoi incollarli qui
const SUPABASE_URL = process.env.SUPABASE_URL ?? 'https://xxx.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY ?? 'public-anon-key';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
