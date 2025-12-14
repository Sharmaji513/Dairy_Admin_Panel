// admin_11/src/lib/hooks/useApiProducts.js
import { useState, useEffect } from 'react';
import { productService } from '../api/services/productService';
import { API_CONFIG } from '../api/config';
import { products as defaultProducts } from '../mockData';

export function useApiProducts(filters) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);

  // Helper to clean filters (Remove 'all' and empty strings)
  const cleanFilters = (dirtyFilters) => {
    const cleaned = {};
    Object.keys(dirtyFilters).forEach((key) => {
      const value = dirtyFilters[key];
      // Only include the filter if it's NOT 'all' and NOT empty
      if (value !== 'all' && value !== '' && value !== null && value !== undefined) {
        cleaned[key] = value;
      }
    });
    return cleaned;
  };

  const fetchProducts = async () => {
    if (!API_CONFIG.ENABLE_API) {
      setProducts(defaultProducts);
      setTotal(defaultProducts.length);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const activeFilters = cleanFilters(filters);
      const response = await productService.getProducts(activeFilters);

      // Handle different response structures
      const rawProducts = response.products || (response.data && response.data.products) || [];
      
      // ✨ KEY FIX: Map backend fields to frontend fields
      const mappedProducts = rawProducts.map(p => {
        // 1. Get the raw image string from backend
        let imageUrl = p.image || p.thumbnail || null;
        
        // 2. Determine if it's a full URL or a relative path
        if (imageUrl) {
            // Check if it starts with http://, https://, or blob:
            const isAbsoluteUrl = /^(https?:\/\/|blob:)/i.test(imageUrl);
            
            if (!isAbsoluteUrl) {
               // If relative path (e.g., "/uploads/img.jpg"), prepend backend URL
               const backendUrl = API_CONFIG.BASE_URL.replace(/\/api$/, '');
               const cleanPath = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
               imageUrl = `${backendUrl}${cleanPath}`;
            }
            // If it IS absolute (e.g. pasted link), leave it as-is
        }

        return {
          ...p,
          id: p._id || p.id,
          name: p.dishName || p.name || 'Unknown Product',
          image: imageUrl, // Use the processed URL
          stock: p.stock || (p.availableQuantities?.[0]?.stock) || 0, // Prioritize variant stock if root is 0
          unit: p.unit || (p.availableQuantities?.[0]?.unit) || 'unit',
          price: p.price || (p.availableQuantities?.[0]?.price) || 0
        };
      });

      const totalCount = response.total || (response.data && response.data.total) || mappedProducts.length || 0;

      setProducts(mappedProducts);
      setTotal(totalCount);

    } catch (err) {
      setError(err.message || 'Failed to fetch products');
      console.error('Error fetching products:', err);
      setProducts([]); 
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async (product) => {
      try {
          const response = await productService.createProduct(product);
          await fetchProducts(); // Refresh list after adding
          return response;
      } catch (err) {
          setError(err.message || 'Failed to create product');
          throw err;
      }
  };
  
  const updateProduct = async (id, product) => {
      try {
          const response = await productService.updateProduct(id, product);
          await fetchProducts();
          return response;
      } catch (err) {
          setError(err.message || 'Failed to update product');
          throw err;
      }
  };

  const deleteProduct = async (id) => {
      try {
          const response = await productService.deleteProduct(id);
          await fetchProducts();
          return response;
      } catch (err) {
          setError(err.message || 'Failed to delete product');
          throw err;
      }
  };

  const addVariantToProduct = async (productId, variantData) => {
      try {
          const response = await productService.addVariantToProduct(productId, variantData);
          await fetchProducts(); // Refresh products to get updated variants
          return response;
      } catch (err) {
          setError(err.message || 'Failed to add variant');
          throw err;
      }
  };

  const deleteVariant = async (productId, variantId) => {
      try {
          const response = await productService.deleteVariant(productId, variantId);
          await fetchProducts(); // Refresh products to get updated variants
          return response;
      } catch (err) {
          setError(err.message || 'Failed to delete variant');
          throw err;
      }
  };

  useEffect(() => {
    fetchProducts();
  }, [JSON.stringify(filters)]);

  return {
    products,
    loading,
    error,
    total,
    refetch: fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    addVariantToProduct,
    deleteVariant,
  };
}