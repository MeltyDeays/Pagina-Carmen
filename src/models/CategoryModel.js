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
  }
};
