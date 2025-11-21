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
      const mappedProducts = rawProducts.map(p => ({
        ...p,
        
        // 1. Map MongoDB '_id' to 'id'
        id: p._id || p.id, 
        
        // 2. Map 'dishName' to 'name'
        name: p.dishName || p.name || 'Unknown Product',
        
        // 3. Handle Image URL
        image: p.image ? (p.image.startsWith('http') ? p.image : `https://dynasty-premium-backend.onrender.com${p.image}`) : null
      }));

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
  };
}