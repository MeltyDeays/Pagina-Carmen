import { supabase } from '../services/supabase';

export const ProductModel = {
  async getAll() {
    const { data, error } = await supabase.from('products').select('*, categories(name)');
    if (error) throw error;
    return data;
  },

  async create(productData) {
    const { data, error } = await supabase.from('products').insert([productData]).select();
    if (error) throw error;
    return data[0];
  },

  async update(id, productData) {
    const { data, error } = await supabase.from('products').update(productData).eq('id', id).select();
    if (error) throw error;
    return data[0];
  },

  async markAsSold(id) {
    const { data, error } = await supabase.from('products').update({ 
      sold_at: new Date().toISOString() 
    }).eq('id', id).select();
    if (error) throw error;
    return data[0];
  },
  
  async delete(id) {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw error;
    return true;
  },

  async cleanupSoldImages() {
    try {
      const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
      
      // 1. Buscar productos vendidos hace más de 2 horas que aún tengan imágenes
      const { data: products, error } = await supabase
        .from('products')
        .select('id, images')
        .not('images', 'is', null)
        .lt('sold_at', twoHoursAgo);

      if (error) throw error;
      if (!products || products.length === 0) return;

      for (const product of products) {
        if (!product.images || product.images.length === 0) continue;

        // 2. Extraer rutas de las imágenes (asumiendo que las URLs contienen la ruta del bucket)
        const pathsToDelete = product.images.map(url => {
          const parts = url.split('/Imagenes-Ropa/');
          return parts.length > 1 ? parts[1] : null;
        }).filter(Boolean);

        if (pathsToDelete.length > 0) {
          // 3. Borrar del bucket
          await supabase.storage.from('Imagenes-Ropa').remove(pathsToDelete);
          
          // 4. Limpiar el array de imágenes en la base de datos para no repetir proceso
          await supabase.from('products').update({ images: [] }).eq('id', product.id);
        }
      }
    } catch (err) {
      console.error('Error en limpieza de imágenes:', err);
    }
  },
  supabase
};
