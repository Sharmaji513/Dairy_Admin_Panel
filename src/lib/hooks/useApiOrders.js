// admin_11/src/lib/hooks/useApiOrders.js
import { useState, useEffect } from 'react';
import { orderService } from '../api/services/orderService';
import { API_CONFIG } from '../api/config';
import { orders as defaultOrders } from '../mockData'; // Using mockData directly for fallback

export function useApiOrders(filters) {
  // Initialize with empty array to prevent "length of undefined" errors
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);

  // Helper to clean filters (Remove 'all' and empty strings)
  const cleanFilters = (dirtyFilters) => {
    const cleaned = {};
    if (!dirtyFilters) return cleaned;
    
    Object.keys(dirtyFilters).forEach((key) => {
      const value = dirtyFilters[key];
      // Only include the filter if it's NOT 'all' and NOT empty
      if (value !== 'all' && value !== '' && value !== null && value !== undefined) {
        cleaned[key] = value;
      }
    });
    return cleaned;
  };

  // Fetch orders from API
  const fetchOrders = async () => {
    if (!API_CONFIG.ENABLE_API) {
      // Use local data when API is disabled
      setOrders(defaultOrders);
      setTotal(defaultOrders.length);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // ✨ FIX 1: Clean filters before sending
      const activeFilters = cleanFilters(filters);

      const response = await orderService.getOrders(activeFilters);
      
      // ✨ DEBUG: Check what the API actually sends
      console.log("Orders API Response:", response);

      // ✨ FIX 2: Handle both 'flat' and 'nested' response structures
      const ordersList = response.orders || (response.data && response.data.orders) || [];
      
      // ✨ FIX 3: Map backend _id to frontend id and ensure it's an array
      const mappedOrders = Array.isArray(ordersList) ? ordersList.map(order => ({
        ...order,
        id: order._id || order.id
      })) : [];

      const totalCount = response.total || (response.data && response.data.total) || mappedOrders.length || 0;

      setOrders(mappedOrders);
      setTotal(totalCount);

    } catch (err) {
      setError(err.message || 'Failed to fetch orders');
      console.error('Error fetching orders:', err);
      setOrders([]); // Safety fallback
    } finally {
      setLoading(false);
    }
  };

  // Create order
  const createOrder = async (order) => {
    setLoading(true);
    try {
      const response = await orderService.createOrder(order);
      await fetchOrders(); // Refresh list
      return response;
    } catch (err) {
      setError(err.message || 'Failed to create order');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update order
  const updateOrder = async (id, order) => {
    setLoading(true);
    try {
      const response = await orderService.updateOrder(id, order);
      await fetchOrders(); // Refresh list
      return response;
    } catch (err) {
      setError(err.message || 'Failed to update order');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete order
  const deleteOrder = async (id) => {
    setLoading(true);
    try {
      const response = await orderService.deleteOrder(id);
      await fetchOrders(); // Refresh list
      return response;
    } catch (err) {
      setError(err.message || 'Failed to delete order');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Update order status
  const updateOrderStatus = async (id, status) => {
    setLoading(true);
    try {
      const response = await orderService.updateOrderStatus(id, status);
      await fetchOrders(); // Refresh list
      return response;
    } catch (err) {
      setError(err.message || 'Failed to update order status');
      throw err;
    } finally {
      setLoading(false);
    }
  }

  // Fetch on mount and when filters change
  useEffect(() => {
    fetchOrders();
  }, [JSON.stringify(filters)]);

  return {
    orders,
    loading,
    error,
    total,
    refetch: fetchOrders,
    createOrder,
    updateOrder,
    deleteOrder,
    updateOrderStatus
  };
}