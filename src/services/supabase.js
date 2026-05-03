import { createClient } from '@supabase/supabase-js';

// Reemplazar estas variables con las reales que te dará el otro agente.
// Por ahora usamos placeholders para que no falle la app.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://tu-proyecto.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'tu-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
