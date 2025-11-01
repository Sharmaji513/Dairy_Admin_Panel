// src/lib/auth.js

import { createClient } from '@supabase/supabase-js';
// Make sure your info file exports supabaseUrl, not projectId
import { supabaseUrl, publicAnonKey } from '../utils/supabase/info.jsx';

export const supabase = createClient(supabaseUrl, publicAnonKey);

// Simple authentication storage
const USERS_STORAGE_KEY = 'dynasty_premium_users';
const CURRENT_USER_KEY = 'dynasty_premium_current_user';

// Initialize with default admin user
const initializeUsers = () => {
  const stored = localStorage.getItem(USERS_STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  // Default admin user with credentials: admin@123 / admin123
  const defaultUsers = [
    {
      id: '1',
      email: 'admin@123',
      password: 'admin123',
      name: 'Admin User',
      phone: '+91 98765 43210',
      role: 'Super Admin',
      profilePhoto: ''
    }
  ];
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(defaultUsers));
  return defaultUsers;
};

export const getAllUsers = () => {
  return initializeUsers();
};

export const registerUser = (email, password, name, phone, role = 'User') => {
  const users = getAllUsers();

  // Check if user already exists
  if (users.find(u => u.email === email)) {
    return null;
  }

  const newUser = {
    id: Date.now().toString(),
    email,
    password,
    name,
    phone,
    role,
    profilePhoto: ''
  };

  users.push(newUser);
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  return newUser;
};

// This now uses local storage again to match your other functions
export const loginUser = (email, password) => {
  const users = getAllUsers();
  const user = users.find(u => u.email === email && u.password === password);

  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    return user;
  }

  return null;
};

export const getCurrentUser = () => {
  const stored = localStorage.getItem(CURRENT_USER_KEY);
  return stored ? JSON.parse(stored) : null;
};

export const updateCurrentUser = (updates) => {
  const currentUser = getCurrentUser();
  if (!currentUser) return;

  const updatedUser = { ...currentUser, ...updates };
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));

  // Also update in users list
  const users = getAllUsers();
  const index = users.findIndex(u => u.id === currentUser.id);
  if (index !== -1) {
    users[index] = updatedUser;
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  }
};

export const logoutUser = () => {
  localStorage.removeItem(CURRENT_USER_KEY);
};

export const addUserToSystem = (user) => {
  const users = getAllUsers();
  const newUser = {
    ...user,
    id: Date.now().toString()
  };
  users.push(newUser);
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  return newUser;
};

export const deleteUserFromSystem = (id) => {
  const users = getAllUsers();
  const filtered = users.filter(u => u.id !== id);
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(filtered));
};

export const updateUserInSystem = (id, updates) => {
  const users = getAllUsers();
  const index = users.findIndex(u => u.id === id);
  if (index !== -1) {
    users[index] = { ...users[index], ...updates };
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));

    const currentUser = getCurrentUser();
    if (currentUser && currentUser.id === id) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(users[index]));
    }
  }
};

export const isEmailRegistered = (email) => {
  const users = getAllUsers();
  return users.some(u => u.email === email);
};

// **FIXED:** Added the missing resetUserPassword function
export const resetUserPassword = (email, newPassword) => {
  const users = getAllUsers();
  const userIndex = users.findIndex(u => u.email === email);

  if (userIndex === -1) {
    return false;
  }

  users[userIndex].password = newPassword;
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));

  const currentUser = getCurrentUser();
  if (currentUser && currentUser.email === email) {
    currentUser.password = newPassword;
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));
  }

  return true;
};