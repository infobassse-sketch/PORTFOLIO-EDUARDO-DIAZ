import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || 'https://oxriwlpjxdikdgpejnxk.supabase.co';
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 'sb_publishable_VOirMmDWiXM3zwD6qRK4eQ_yLMKaFPT';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
