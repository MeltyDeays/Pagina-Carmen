import { createClient } from '@supabase/supabase-js';

// Reemplazar estas variables con las reales que te dará el otro agente.
// Por ahora usamos placeholders para que no falle la app.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
