// admin_11/src/lib/api/client.js
import { API_CONFIG } from './config.js';

class ApiClient {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.timeout = API_CONFIG.TIMEOUT;
  }

  getAuthToken() {
    return localStorage.getItem('auth_token');
  }

  // Updated to handle FormData automatically
  buildHeaders(customHeaders = {}) {
    const headers = {
      ...customHeaders,
    };

    const token = this.getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  async handleError(response) {
    let errorMessage = `Request failed with status ${response.status}`;
    // Try to parse JSON error first
    try {
      const errorData = await response.json();
      const msg = errorData?.message || errorData?.error || null;
      if (msg) errorMessage = `${errorMessage}: ${msg}`;
      else if (typeof errorData === 'string') errorMessage = `${errorMessage}: ${errorData}`;
    } catch (jsonErr) {
      // If JSON parse fails, try to get plain text body
      try {
        const text = await response.text();
        if (text) errorMessage = `${errorMessage}: ${text.slice(0, 200)}`;
      } catch (textErr) {
        // fallback to statusText
        errorMessage = `${errorMessage}: ${response.statusText || 'No response body'}`;
      }
    }

    if (response.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      window.location.href = '/login';
    }

    const err = new Error(errorMessage);
    err.status = response.status;
    throw err;
  }

  async get(endpoint, params) {
    let url = `${this.baseURL}${endpoint}`;
    if (params) {
      const queryString = new URLSearchParams(params).toString();
      url += `?${queryString}`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: this.buildHeaders({ 'Content-Type': 'application/json' }),
    });

    if (!response.ok) return this.handleError(response);
    
    // Handle empty response body (204 No Content or empty JSON)
    const contentLength = response.headers.get('content-length');
    if (contentLength === '0' || response.status === 204) {
      return { success: true };
    }
    
    // Try to parse JSON, but handle empty responses gracefully
    try {
      const text = await response.text();
      return text ? JSON.parse(text) : { success: true };
    } catch (err) {
      // If JSON parsing fails, return success indicator
      return { success: true };
    }
  }

  // ✨ UPDATED POST METHOD ✨
  async post(endpoint, body) {
    const isFormData = body instanceof FormData;
    
    // If it's FormData, let the browser set Content-Type (don't set it manually)
    const headers = this.buildHeaders(
      isFormData ? {} : { 'Content-Type': 'application/json' }
    );

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers,
      body: isFormData ? body : JSON.stringify(body),
    });

    if (!response.ok) return this.handleError(response);
    
    // Handle empty response body (204 No Content or empty JSON)
    const contentLength = response.headers.get('content-length');
    if (contentLength === '0' || response.status === 204) {
      return { success: true };
    }
    
    // Try to parse JSON, but handle empty responses gracefully
    try {
      const text = await response.text();
      return text ? JSON.parse(text) : { success: true };
    } catch (err) {
      // If JSON parsing fails, return success indicator
      return { success: true };
    }
  }

  // ✨ UPDATED PUT METHOD ✨
  async put(endpoint, body) {
    const isFormData = body instanceof FormData;
    
    const headers = this.buildHeaders(
      isFormData ? {} : { 'Content-Type': 'application/json' }
    );

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'PUT',
      headers,
      body: isFormData ? body : JSON.stringify(body),
    });

    if (!response.ok) return this.handleError(response);
    
    // Handle empty response body (204 No Content or empty JSON)
    const contentLength = response.headers.get('content-length');
    if (contentLength === '0' || response.status === 204) {
      return { success: true };
    }
    
    // Try to parse JSON, but handle empty responses gracefully
    try {
      const text = await response.text();
      return text ? JSON.parse(text) : { success: true };
    } catch (err) {
      // If JSON parsing fails, return success indicator
      return { success: true };
    }
  }

  async delete(endpoint) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'DELETE',
      headers: this.buildHeaders({ 'Content-Type': 'application/json' }),
    });

    if (!response.ok) return this.handleError(response);
    
    // Handle empty response body (204 No Content or empty JSON)
    const contentLength = response.headers.get('content-length');
    if (contentLength === '0' || response.status === 204) {
      return { success: true };
    }
    
    // Try to parse JSON, but handle empty responses gracefully
    try {
      const text = await response.text();
      return text ? JSON.parse(text) : { success: true };
    } catch (err) {
      // If JSON parsing fails, return success indicator
      return { success: true };
    }
  }
  
  async patch(endpoint, body) {
     const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'PATCH',
      headers: this.buildHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(body),
    });

    if (!response.ok) return this.handleError(response);
    
    // Handle empty response body (204 No Content or empty JSON)
    const contentLength = response.headers.get('content-length');
    if (contentLength === '0' || response.status === 204) {
      return { success: true };
    }
    
    // Try to parse JSON, but handle empty responses gracefully
    try {
      const text = await response.text();
      return text ? JSON.parse(text) : { success: true };
    } catch (err) {
      // If JSON parsing fails, return success indicator
      return { success: true };
    }
  }
}

export const apiClient = new ApiClient();