import { useState, useEffect } from 'react';
import { categoryService } from '../api/services/categoryService';
import { API_CONFIG } from '../api/config';

export function useApiCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    if (!API_CONFIG.ENABLE_API) {
      // Fallback for testing if API is off
      setCategories([
        { _id: '1', name: 'Dairy', displayName: 'Dairy' },
        { _id: '2', name: 'Beverages', displayName: 'Beverages' }
      ]);
      return;
    }

    setLoading(true);
    try {
      const response = await categoryService.getCategories();
      // Handle different response structures
      const list = response.categories || (response.data && response.data.categories) || response.data || [];
      setCategories(list);
    } catch (err) {
      console.error("Failed to load categories", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return { categories, loading, refetch: fetchCategories };
}