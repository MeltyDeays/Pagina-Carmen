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
      is_available: false, 
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
  supabase // Exportamos para que el controlador lo use para el storage
};
