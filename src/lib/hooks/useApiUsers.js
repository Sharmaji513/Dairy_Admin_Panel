import { useState, useEffect } from 'react';
import { userService } from '../api/services/userService';
import { API_CONFIG } from '../api/config';
import { users as defaultUsers } from '../mockData';

export function useApiUsers(filters) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    if (!API_CONFIG.ENABLE_API) {
      setUsers(defaultUsers);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await userService.getUsers(filters);
      
      // Handle response structure
      const usersList = response.users || (response.data && response.data.users) || response.data || [];

      const mappedUsers = Array.isArray(usersList) ? usersList.map(u => {
        const isActive = (typeof u.isActive === 'boolean')
          ? u.isActive
          : (typeof u.status === 'string')
            ? u.status.toLowerCase() === 'active'
            : true; // default to true if neither present

        const status = (typeof u.status === 'string')
          ? u.status.toLowerCase()
          : (isActive ? 'active' : 'inactive');

        return {
          ...u,
          id: u._id || u.id,
          name: u.name || `${u.firstName || ''} ${u.lastName || ''}`.trim(),
          isActive,
          status,
          role: u.role || 'Manager', // Default role if missing
        };
      }) : [];

      setUsers(mappedUsers);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (userData) => {
    setLoading(true);
    try {
      await userService.createUser(userData);
      await fetchUsers();
    } catch (err) {
      setError(err.message || 'Failed to create user');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (id, userData) => {
    setLoading(true);
    try {
      await userService.updateUser(id, userData);
      await fetchUsers();
    } catch (err) {
      setError(err.message || 'Failed to update user');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    setLoading(true);
    try {
      await userService.deleteUser(id);
      await fetchUsers();
    } catch (err) {
      setError(err.message || 'Failed to delete user');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  const toggleUserStatus = async (id, currentStatus) => {
    try {
        await userService.toggleUserStatus(id, currentStatus);
        await fetchUsers();
    } catch(err) {
        throw err;
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [JSON.stringify(filters)]);

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