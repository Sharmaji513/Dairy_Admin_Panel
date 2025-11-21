import { useState, useEffect } from 'react';
import { customerService } from '../api/services/customerService';
import { API_CONFIG } from '../api/config';
import { customers as defaultCustomers } from '../mockData';

export function useApiCustomers(filters) {
  // Initialize with empty array
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);

  const cleanFilters = (dirtyFilters) => {
    const cleaned = {};
    if (!dirtyFilters) return cleaned;
    Object.keys(dirtyFilters).forEach((key) => {
      const value = dirtyFilters[key];
      if (value !== 'all' && value !== '' && value !== null && value !== undefined) {
        cleaned[key] = value;
      }
    });
    return cleaned;
  };

  const fetchCustomers = async (isBackground = false) => {
    if (!API_CONFIG.ENABLE_API) {
      setCustomers(defaultCustomers);
      setTotal(defaultCustomers.length);
      return;
    }

    // Only set loading if it's not a background refresh (like after a toggle)
    if (!isBackground) setLoading(true);
    setError(null);

    try {
      const activeFilters = cleanFilters(filters);
      const response = await customerService.getCustomers(activeFilters);
      console.log("API Response (Background:", isBackground, "):", response);
      
      // Robust response handling
      const customersList = response.customers || (response.data && response.data.customers) || [];
      if (isBackground && customersList.length === 0 && total > 0) {
          console.warn("Background fetch returned empty list, ignoring to preserve UI.");
          return;
      }
      const mappedCustomers = Array.isArray(customersList) ? customersList.map(c => ({
        ...c,
        id: c._id || c.id,
        name: c.name || (c.firstName && c.lastName ? `${c.firstName} ${c.lastName}` : null) || c.email || "Unknown"
      })) : [];

      const totalCount = response.total || (response.data && response.data.total) || mappedCustomers.length || 0;

      setCustomers(mappedCustomers);
      setTotal(totalCount);

    } catch (err) {
      console.error('Error fetching customers:', err);
      if (!isBackground) {
        setError(err.message || 'Failed to fetch customers');
        setCustomers([]); 
      }
    } finally {
      if (!isBackground) setLoading(false);
    }
  };

  // Create
  const createCustomer = async (customer) => {
    setLoading(true);
    try {
      const response = await customerService.createCustomer(customer);
      await fetchCustomers(); 
      return response;
    } catch (err) {
      setError(err.message || 'Failed to create customer');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update
  const updateCustomer = async (id, customer) => {
    setLoading(true);
    try {
      const response = await customerService.updateCustomer(id, customer);
      await fetchCustomers(); 
      return response;
    } catch (err) {
      setError(err.message || 'Failed to update customer');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete
  const deleteCustomer = async (id) => {
    setLoading(true);
    try {
      const response = await customerService.deleteCustomer(id);
      await fetchCustomers(); 
      return response;
    } catch (err) {
      setError(err.message || 'Failed to delete customer');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ✨ FIX: Optimistic Toggle (Instant update, no loading spinner)
  const toggleCustomerStatus = async (id) => {
    // 1. Snapshot previous state for rollback
    const previousCustomers = [...customers];
    
    // 2. Optimistically update LOCAL state immediately
    setCustomers(currentCustomers => 
      currentCustomers.map(c => {
        if (c.id === id) {
          // Flip the status locally and KEEP IT
          const currentStatus = (c.status || '').toLowerCase();
          const newStatus = currentStatus === 'active' ? 'Inactive' : 'Active';
          return { ...c, status: newStatus };
        }
        return c;
      })
    );

    try {
      // 3. Call API
      await customerService.toggleCustomerStatus(id);
      
      // 4. ✨ SUCCESS! Do NOT re-fetch immediately.
      // We assume our optimistic update was correct. 
      // This prevents the "stale data" from the server flipping the switch back.
      
    } catch (err) {
      // 5. ONLY Revert on ERROR
      console.error('Toggle failed, reverting UI:', err);
      setCustomers(previousCustomers); // Flip it back because it failed
      throw err;
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [JSON.stringify(filters)]);

  return {
    customers,
    loading,
    error,
    total,
    refetch: fetchCustomers,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    toggleCustomerStatus
  };
}