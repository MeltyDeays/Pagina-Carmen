import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vaxhflarjyknjunexmak.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZheGhmbGFyanlrbmp1bmV4bWFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc3NzM5MjAsImV4cCI6MjA5MzM0OTkyMH0.CxPetJ6-yefU4Y0pLRsXC6cC0qLH-mfi9YNrTANUGgw';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testInsert() {
  console.log("--- PROBANDO INSERCIÓN DE CATEGORÍA ---");
  const { data, error } = await supabase
    .from('categories')
    .insert([{ name: 'Categoría Prueba', description: 'Creada por el asistente' }])
    .select();

  if (error) {
    console.error("❌ ERROR AL INSERTAR:", error.message);
    if (error.message.includes("policy")) {
      console.log("👉 MOTIVO: Te falta activar las políticas RLS para INSERT en la tabla 'categories'.");
    }
  } else {
    console.log("✅ ÉXITO: Categoría creada con ID:", data[0].id);
  }
}

testInsert();
