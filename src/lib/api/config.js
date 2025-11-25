// admin_11/src/lib/api/config.js

// Use Vite's syntax for environment variables
const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const API_CONFIG = {
  // Ensure this points to your actual backend (e.g., onrender.com or localhost:5000)
  // We do NOT add '/api' here because some endpoints might differ, 
  // but based on Postman, they all seem to start with /api. 
  // So let's append /api to be safe and clean.
  BASE_URL: (VITE_API_BASE_URL || 'http://localhost:5000') + '/api',

  TIMEOUT: 30000,
  ENABLE_API: true,
};

export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout', // Assuming this exists
    PROFILE: '/customer', // Postman "Get My Profile" uses GET /api/customer
    UPDATE_PROFILE: '/customer/update', // Postman "Update Self"
  },

  // Dashboard (Assuming standard paths since not in Postman)
  DASHBOARD: {
    STATS: '/dashboard/stats',
    RECENT_ORDERS: '/dashboard/recent-orders',
    REVENUE_CHART: '/dashboard/revenue-chart',
  },

  // Customers
  CUSTOMERS: {
    LIST: '/customer', // Postman: GET /api/customer
    GET: '/customer/:id',
    CREATE: '/auth/register', // Creating a customer is registering? Or '/customer/add'? Let's assume register for now.
    UPDATE: '/customer/update/:id', // Postman: POST /api/customer/update/:id
    DELETE: '/customer/delete/:id', // Assumed pattern
    TOGGLE_STATUS: '/customer/toggle/:id', // Postman: PATCH /api/customer/toggle/:id
  },

  // Products
  PRODUCTS: {
    LIST: '/products', // Postman: GET /api/products/
    GET: '/products/:id',
    CREATE: '/products/add-product', // Postman: POST /api/products/add-product
    UPDATE: '/products/update-product/:id', // Postman: PUT /api/products/update-product/:id
    DELETE: '/products/delete-product/:id', // Postman: DELETE /api/products/delete-product/:id
    TOGGLE_STATUS: '/products/toggle/:id', // Assumed pattern
  },

  CATEGORIES: {
    LIST: '/categories',
    GET: '/categories/:id',
    CREATE: '/categories',
    UPDATE: '/categories/:id',
    DELETE: '/categories/:id',
  },

  // Orders (Assuming patterns based on Products/Customers)
  ORDERS: {
    LIST: '/orders',
    GET: '/orders/:id',
    CREATE: '/orders/add-order',
    UPDATE: '/orders/update-order/:id',
    DELETE: '/orders/delete-order/:id',
    UPDATE_STATUS: '/orders/status/:id',
  },

  // Other modules (Keeping standard for now, update as you discover them)
  DELIVERY_STAFF: {
    LIST: '/delivery-staff',
    GET: '/delivery-staff/:id',
    CREATE: '/delivery-staff/add',
    UPDATE: '/delivery-staff/update/:id',
    DELETE: '/delivery-staff/delete/:id',
    TOGGLE_STATUS: '/delivery-staff/toggle/:id',
  },

  BRANCHES: {
    LIST: '/branches',
    GET: '/branches/:id',
    CREATE: '/branches/add',
    UPDATE: '/branches/update/:id',
    DELETE: '/branches/delete/:id',
  },

  NOTIFICATIONS: {
    LIST: '/notifications',
    CREATE: '/notifications/send',
    MARK_READ: '/notifications/read/:id',
    MARK_ALL_READ: '/notifications/read-all',
    DELETE: '/notifications/delete/:id',
  },

  WALLET: {
    DISCOUNTS: '/wallet/discounts',
    CREATE_DISCOUNT: '/wallet/discounts/add',
    UPDATE_DISCOUNT: '/wallet/discounts/update/:id',
    DELETE_DISCOUNT: '/wallet/discounts/delete/:id',
    GET_STATS: '/wallet/stats',
  },

  MEMBERSHIP: {
    LIST: '/memberships',
    CREATE: '/memberships/add',
    UPDATE: '/memberships/update/:id',
    DELETE: '/memberships/delete/:id',
  },

  REPORTS: {
    SALES: '/reports/sales',
    CUSTOMERS: '/reports/customers',
    PRODUCTS: '/reports/products',
    REVENUE: '/reports/revenue',
  },

  HOMEPAGE: {
    GET_SETTINGS: '/homepage/settings',
    UPDATE_SETTINGS: '/homepage/settings',
    BANNERS: '/homepage/banners',
    CREATE_BANNER: '/homepage/banners/add',
    UPDATE_BANNER: '/homepage/banners/update/:id',
    DELETE_BANNER: '/homepage/banners/delete/:id',
    REORDER_BANNERS: '/homepage/banners/reorder',
  },
};

export const buildUrl = (endpoint, params) => {
  let url = endpoint;
  if (params) {
    Object.keys(params).forEach(key => {
      url = url.replace(`:${key}`, String(params[key]));
    });
  }
  return url;
};