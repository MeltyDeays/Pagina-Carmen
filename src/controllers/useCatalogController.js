import { useState, useEffect } from 'react';
import { ProductModel } from '../models/ProductModel';
import { CategoryModel } from '../models/CategoryModel';

export function useCatalogController() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

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
      setError("Error cargando catálogo.");
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(p => {
    // 0. Ocultar si NO está publicado
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

    // 3. Filtrar por búsqueda
    if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase()) && !p.brand?.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  return {
    products: filteredProducts,
    categories,
    loading,
    error,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery
  };
}
