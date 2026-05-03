import { useState, useEffect } from 'react';
import { ProductModel } from '../models/ProductModel';
import { CategoryModel } from '../models/CategoryModel';

export function useCatalogController() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [productsData, categoriesData] = await Promise.all([
        ProductModel.getAll(),
        CategoryModel.getAll()
      ]);
      setProducts(productsData || []);
      setCategories(categoriesData || []);
    } catch (err) {
      console.error(err);
      // Fallback para pruebas sin base de datos real aún
      setError("No se pudo cargar desde Supabase. Usando mock local.");
      setProducts([
        { id: '1', name: 'Blusa Vintage', price: 150, brand: 'Shein', materials: ['Algodón'], condition: 'Como nueva', images: ['https://placehold.co/300x400/D1C4E9/4A4A4A?text=Blusa'] },
        { id: '2', name: 'Pantalón Cargo', price: 300, brand: 'Zara', materials: ['Poliéster'], condition: 'Buen estado', images: ['https://placehold.co/300x400/F8BBD0/4A4A4A?text=Pantalon'] }
      ]);
      setCategories([
        { id: 'c1', name: 'Blusas' },
        { id: 'c2', name: 'Pantalones' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(p => {
    // 0. Ocultar si NO está publicado (a menos que sea data vieja sin el campo, que tratamos como publicada)
    if (p.is_published === false) return false;

    // 1. Ocultar si se vendió hace más de 2 horas
    if (p.sold_at) {
      const soldTime = new Date(p.sold_at).getTime();
      const now = new Date().getTime();
      const hoursSinceSold = (now - soldTime) / (1000 * 60 * 60);
      if (hoursSinceSold > 2) return false;
    }
    
    // 2. Filtrar por categoría
    if (selectedCategory && p.category_id !== selectedCategory) return false;
    
    return true;
  });

  return {
    products: filteredProducts,
    categories,
    loading,
    error,
    selectedCategory,
    setSelectedCategory
  };
}
