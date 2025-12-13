import { useState, useEffect, useCallback } from 'react';
import { userService } from '../api/services/userService';
import { toast } from 'sonner@2.0.3';

export function useApiUsers(filters = {}) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await userService.getUsers(filters);
      
      // Handle different response structures (e.g., [users] or { users: [...] } or { data: [...] })
      let data = [];
      if (Array.isArray(response)) {
        data = response;
      } else if (response.users && Array.isArray(response.users)) {
        data = response.users;
      } else if (response.data && Array.isArray(response.data)) {
        data = response.data;
      }

      setUsers(data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setError(err.message);
      // Optional: don't toast on initial load to avoid spam, or toast only critical errors
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const createUser = async (userData) => {
    try {
      const newUser = await userService.createUser(userData);
      // Optimistic update or refetch
      setUsers(prev => [newUser.user || newUser, ...prev]); 
      return newUser;
    } catch (err) {
      throw err;
    }
  };

  const updateUser = async (id, userData) => {
    try {
      const updated = await userService.updateUser(id, userData);
      setUsers(prev => prev.map(u => (u.id === id || u._id === id) ? (updated.user || updated) : u));
      return updated;
    } catch (err) {
      throw err;
    }
  };

  const deleteUser = async (id) => {
    try {
      await userService.deleteUser(id);
      setUsers(prev => prev.filter(u => u.id !== id && u._id !== id));
    } catch (err) {
      throw err;
    }
  };

  const toggleUserStatus = async (id, currentStatus) => {
    try {
      // Toggle logic
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      const isActive = newStatus === 'active';
      
      // Optimistic update locally first for speed
      setUsers(prev => prev.map(u => (u.id === id || u._id === id) ? { ...u, status: newStatus, isActive } : u));
      
      await userService.toggleUserStatus(id, currentStatus);
    } catch (err) {
      // Revert on failure
      fetchUsers(); 
      throw err;
    }
  };

  return {
    users,
    loading,
    error,
    refetch: fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    toggleUserStatus
  };
}