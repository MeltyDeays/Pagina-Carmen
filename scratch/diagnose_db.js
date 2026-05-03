import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vaxhflarjyknjunexmak.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZheGhmbGFyanlrbmp1bmV4bWFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc3NzM5MjAsImV4cCI6MjA5MzM0OTkyMH0.CxPetJ6-yefU4Y0pLRsXC6cC0qLH-mfi9YNrTANUGgw';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function diagnose() {
  console.log("--- DIAGNÓSTICO DE BASE DE DATOS ---");
  
  // 1. Probar Categorías
  const { data: cats, error: catErr } = await supabase.from('categories').select('*').limit(1);
  if (catErr) console.error("❌ Error en Tabla 'categories':", catErr.message);
  else console.log("✅ Tabla 'categories' accesible.");

  // 2. Probar Productos
  const { data: prods, error: prodErr } = await supabase.from('products').select('*').limit(1);
  if (prodErr) console.error("❌ Error en Tabla 'products':", prodErr.message);
  else console.log("✅ Tabla 'products' accesible.");

  // 3. Probar Bucket
  const { data: buckets, error: bucketErr } = await supabase.storage.listBuckets();
  if (bucketErr) console.error("❌ Error al listar Buckets:", bucketErr.message);
  else {
    const target = buckets.find(b => b.name === 'Imagenes-Ropa');
    if (target) {
      console.log(`✅ Bucket 'Imagenes-Ropa' encontrado. Público: ${target.public}`);
    } else {
      console.log("❌ Bucket 'Imagenes-Ropa' NO EXISTE.");
    }
  }
}

diagnose();
