import { supabase } from '../services/supabase';

export const CategoryModel = {
  async getAll() {
    const { data, error } = await supabase.from('categories').select('*');
    if (error) throw error;
    return data;
  },

  async create(categoryData) {
    const { data, error } = await supabase.from('categories').insert([categoryData]).select();
    if (error) throw error;
    return data[0];
  },

  async update(id, categoryData) {
    const { data, error } = await supabase.from('categories').update(categoryData).eq('id', id).select();
    if (error) throw error;
    return data[0];
  },

  async delete(id) {
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) throw error;
    return true;
  }
};
