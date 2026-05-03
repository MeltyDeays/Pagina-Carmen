import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vaxhflarjyknjunexmak.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZheGhmbGFyanlrbmp1bmV4bWFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc3NzM5MjAsImV4cCI6MjA5MzM0OTkyMH0.CxPetJ6-yefU4Y0pLRsXC6cC0qLH-mfi9YNrTANUGgw';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testDelete() {
  console.log("--- PROBANDO BORRADO DE CATEGORÍA ---");
  
  // Primero creamos una para borrarla
  const { data: newData } = await supabase.from('categories').insert([{ name: 'Borrar me' }]).select();
  if (!newData) return console.log("No pude crear la categoría de prueba.");
  
  const id = newData[0].id;
  console.log("Categoría temporal creada con ID:", id);

  const { error } = await supabase.from('categories').delete().eq('id', id);

  if (error) {
    console.error("❌ ERROR AL BORRAR:", error.message);
    console.log("👉 CONFIRMADO: Te faltan permisos de DELETE en Supabase.");
  } else {
    console.log("✅ ÉXITO: El borrado funciona correctamente.");
  }
}

testDelete();
