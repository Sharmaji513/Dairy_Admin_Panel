// admin_11/src/lib/api/services/productService.js
import { apiClient } from "../client";
import { API_ENDPOINTS, buildUrl } from "../config";

export const productService = {
  /**
   * Get all products with filters
   */
  async getProducts(filters) {
    return apiClient.get(
      API_ENDPOINTS.PRODUCTS.LIST,
      filters,
    );
  },

  /**
   * Get single product by ID
   */
  async getProduct(id) {
    return apiClient.get(
      buildUrl(API_ENDPOINTS.PRODUCTS.GET, { id }),
    );
  },

  /**
   * Create new product (Using FormData)
   */
  async createProduct(productData) {
    const formData = new FormData();
    
    // ✨ KEY FIX: Map 'name' to 'dishName'
    formData.append('dishName', productData.name); 
    formData.append('category', productData.category);
    formData.append('price', productData.price);
    formData.append('stock', productData.stock || 0);
    formData.append('unit', productData.unit || 'portion');
    
    // Optional fields with defaults
    formData.append('cost', productData.cost || productData.price);
    formData.append('preparationTime', productData.preparationTime || '15');
    formData.append('calories', productData.calories || '0');
    formData.append('description', productData.description || '');
    formData.append('availableForOrder', productData.availableForOrder ? 'true' : 'false');
    formData.append('vegetarian', productData.vegetarian ? 'true' : 'false');

    // ✨ KEY FIX: Append the actual file object
    if (productData.imageFile) {
      formData.append('image', productData.imageFile);
    }

    return apiClient.post(
      API_ENDPOINTS.PRODUCTS.CREATE,
      formData, // Sending FormData, not JSON
    );
  },

  /**
   * Update product
   */
  async updateProduct(id, productData) {
    const formData = new FormData();
    
    // Map fields for update as well
    if (productData.name) formData.append('dishName', productData.name);
    if (productData.category) formData.append('category', productData.category);
    if (productData.price) formData.append('price', productData.price);
    if (productData.stock) formData.append('stock', productData.stock);
    if (productData.unit) formData.append('unit', productData.unit);
    if (productData.imageFile) {
      formData.append('image', productData.imageFile);
    }

    return apiClient.put(
      buildUrl(API_ENDPOINTS.PRODUCTS.UPDATE, { id }),
      formData,
    );
  },

  /**
   * Delete product
   */
  async deleteProduct(id) {
    return apiClient.delete(
      buildUrl(API_ENDPOINTS.PRODUCTS.DELETE, { id }),
    );
  },

  /**
   * Toggle product status (active/inactive)
   */
  async toggleProductStatus(id) {
    return apiClient.patch(
      buildUrl(API_ENDPOINTS.PRODUCTS.TOGGLE_STATUS, { id }),
    );
  },
};