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

  // Control de edición
  const [editingId, setEditingId] = useState(null);
  const [editingCatId, setEditingCatId] = useState(null);

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

      if (editingId) {
        // ACTUALIZAR
        await ProductModel.update(editingId, data);
        alert('¡Producto actualizado!');
      } else {
        // CREAR
        await ProductModel.create(data);
        alert('¡Producto publicado con éxito!');
      }
      
      // Limpiar todo
      setShowProductForm(false);
      setEditingId(null);
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

  const startEditProduct = (product) => {
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price,
      brand: product.brand,
      category_id: product.category_id,
      materials: Array.isArray(product.materials) ? product.materials.join(', ') : '',
      condition: product.condition,
      size: product.size,
      images: product.images,
      is_published: product.is_published
    });
    setEditingId(product.id);
    setShowProductForm(true);
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este producto? Esta acción no se puede deshacer.")) return;
    try {
      setLoading(true);
      await ProductModel.delete(id);
      loadData();
    } catch (err) {
      alert("Error eliminando producto");
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (editingCatId) {
        await CategoryModel.update(editingCatId, categoryForm);
        alert('Categoría actualizada');
      } else {
        await CategoryModel.create(categoryForm);
        alert('Categoría agregada');
      }
      setShowCategoryForm(false);
      setEditingCatId(null);
      setCategoryForm({ name: '', description: '' });
      loadData();
    } catch (err) {
      alert('Error guardando categoría.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const startEditCategory = (cat) => {
    setCategoryForm({ name: cat.name, description: cat.description });
    setEditingCatId(cat.id);
    setShowCategoryForm(true);
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm("¿Eliminar categoría? Los productos asociados podrían quedar sin categoría.")) return;
    try {
      setLoading(true);
      await CategoryModel.delete(id);
      loadData();
    } catch (err) {
      alert("Error eliminando categoría");
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
    handleProductSubmit, handleCategorySubmit, handleMarkAsSold,
    handleDeleteProduct, handleDeleteCategory,
    startEditProduct, startEditCategory,
    editingId, setEditingId, editingCatId, setEditingCatId
  };
}
