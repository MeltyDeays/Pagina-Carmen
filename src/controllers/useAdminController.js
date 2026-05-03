import { useState, useEffect } from 'react';
import { ProductModel } from '../models/ProductModel';
import { CategoryModel } from '../models/CategoryModel';

export function useAdminController() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // Form states
  const [showProductForm, setShowProductForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  
  const [productForm, setProductForm] = useState({
    name: '', description: '', price: '', brand: '', category_id: '',
    materials: '', condition: '', size: '', images: [], is_published: false
  });
  const [selectedFiles, setSelectedFiles] = useState([]); // Nuevo estado para archivos físicos

  const [categoryForm, setCategoryForm] = useState({ name: '', description: '' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [prod, cat] = await Promise.all([ProductModel.getAll(), CategoryModel.getAll()]);
      setProducts(prod || []);
      setCategories(cat || []);
    } catch (e) {
      console.error(e);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const uploadImages = async (files) => {
    const uploadedUrls = [];
    for (const file of files) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { data, error } = await ProductModel.supabase.storage
        .from('Imagenes-Ropa')
        .upload(filePath, file);

      if (error) {
        console.error('Error subiendo imagen:', error);
        continue;
      }

      const { data: { publicUrl } } = ProductModel.supabase.storage
        .from('Imagenes-Ropa')
        .getPublicUrl(filePath);
      
      uploadedUrls.push(publicUrl);
    }
    return uploadedUrls;
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      // 1. Subir imágenes si hay archivos seleccionados
      let imageUrls = [];
      if (selectedFiles.length > 0) {
        imageUrls = await uploadImages(selectedFiles);
      }

      // 2. Preparar datos finales
      const data = {
        ...productForm,
        price: parseFloat(productForm.price),
        materials: productForm.materials ? productForm.materials.split(',').map(m => m.trim()) : [],
        images: imageUrls.length > 0 ? imageUrls : [productForm.images], // Prioridad a subidas
        category_id: productForm.category_id || null
      };

      await ProductModel.create(data);
      alert('¡Producto publicado con éxito!');
      
      // Limpiar todo
      setShowProductForm(false);
      setSelectedFiles([]);
      setProductForm({ name: '', description: '', price: '', brand: '', category_id: '', materials: '', condition: '', size: '', images: [], is_published: false });
      loadData();
    } catch (err) {
      alert('Error guardando producto. Revisa que el bucket "Imagenes-Ropa" sea público.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await CategoryModel.create(categoryForm);
      alert('Categoría agregada');
      setShowCategoryForm(false);
      setCategoryForm({ name: '', description: '' });
      loadData();
    } catch (err) {
      alert('Error guardando categoría.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const togglePublished = async (productId, currentStatus) => {
    try {
      await ProductModel.supabase
        .from('products')
        .update({ is_published: !currentStatus })
        .eq('id', productId);
      loadData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleMarkAsSold = async (id) => {
    if (!window.confirm("¿Seguro que quieres marcar esta prenda como vendida?")) return;
    try {
      setLoading(true);
      await ProductModel.markAsSold(id);
      loadData();
    } catch (err) {
      alert('Error marcando como vendido.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    products, categories, loading,
    showProductForm, setShowProductForm,
    showCategoryForm, setShowCategoryForm,
    productForm, setProductForm,
    categoryForm, setCategoryForm,
    selectedFiles, setSelectedFiles,
    handleProductSubmit, handleCategorySubmit, handleMarkAsSold
  };
}
