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
  const [categoryFilter, setCategoryFilter] = useState(null);

  const filteredProducts = categoryFilter 
    ? products.filter(p => p.category_id === categoryFilter)
    : products;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Limpieza automática de imágenes de productos vendidos hace > 2 horas
      await ProductModel.cleanupSoldImages();
      
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

  const compressImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1000; // Resolución optimizada para móviles
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_WIDTH) {
              width *= MAX_WIDTH / height;
              height = MAX_WIDTH;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob((blob) => {
            resolve(new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".jpg", { type: 'image/jpeg' }));
          }, 'image/jpeg', 0.7); // 70% de calidad es el punto dulce entre peso y nitidez
        };
      };
    });
  };

  const uploadImages = async (files) => {
    const uploadedUrls = [];
    for (const file of files) {
      try {
        // Comprimir antes de subir
        const compressedFile = await compressImage(file);
        
        const fileExt = 'jpg';
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `products/${fileName}`;

        const { data, error } = await ProductModel.supabase.storage
          .from('Imagenes-Ropa')
          .upload(filePath, compressedFile);

        if (error) throw error;

        const { data: { publicUrl } } = ProductModel.supabase.storage
          .from('Imagenes-Ropa')
          .getPublicUrl(filePath);
        
        uploadedUrls.push(publicUrl);
      } catch (err) {
        console.error('Error procesando/subiendo imagen:', err);
      }
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

      // 2. Preparar datos limpios (solo columnas existentes en la BD)
      const data = {
        name: productForm.name,
        description: productForm.description,
        price: parseFloat(productForm.price),
        brand: productForm.brand,
        category_id: productForm.category_id || null,
        condition: productForm.condition,
        size: productForm.size,
        materials: productForm.materials ? (typeof productForm.materials === 'string' ? productForm.materials.split(',').map(m => m.trim()) : productForm.materials) : [],
        images: imageUrls.length > 0 ? [...(productForm.images || []), ...imageUrls] : productForm.images,
        is_published: productForm.is_published
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
      alert(`Error al guardar: ${err.message || 'Error desconocido'}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!id) return;
    if (!window.confirm("¿Estás seguro de eliminar este producto?")) return;
    try {
      setLoading(true);
      const success = await ProductModel.delete(id);
      if (success) {
        alert("Producto eliminado con éxito");
        loadData();
      }
    } catch (err) {
      alert(`Error al eliminar: ${err.message}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const startEditProduct = (product) => {
    setProductForm({
      name: product.name || '',
      description: product.description || '',
      price: product.price || '',
      brand: product.brand || '',
      category_id: product.category_id || '',
      materials: Array.isArray(product.materials) ? product.materials.join(', ') : '',
      condition: product.condition || '',
      size: product.size || '',
      images: product.images || [],
      is_published: !!product.is_published
    });
    setEditingId(product.id);
    setShowProductForm(true);
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const data = {
        name: categoryForm.name,
        description: categoryForm.description
      };

      if (editingCatId) {
        await CategoryModel.update(editingCatId, data);
        alert('¡Categoría actualizada con éxito!');
      } else {
        await CategoryModel.create(data);
        alert('¡Categoría agregada con éxito!');
      }
      setShowCategoryForm(false);
      setEditingCatId(null);
      setCategoryForm({ name: '', description: '' });
      loadData();
    } catch (err) {
      alert(`Error en categorías: ${err.message || 'Error desconocido'}`);
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

  const removeImage = (index) => {
    const newImages = [...productForm.images];
    newImages.splice(index, 1);
    setProductForm({ ...productForm, images: newImages });
  };

  const removeSelectedFile = (index) => {
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    setSelectedFiles(newFiles);
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
    togglePublished, removeImage, removeSelectedFile,
    editingId, setEditingId, editingCatId, setEditingCatId,
    categoryFilter, setCategoryFilter, filteredProducts
  };
}
