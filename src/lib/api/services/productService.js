// import { apiClient } from '../client';
import { API_ENDPOINTS, buildUrl } from '../config';

export const productService = {
  async getProducts(filters) {
    return apiClient.get(API_ENDPOINTS.PRODUCTS.LIST, filters);
  },

  async getProduct(id) {
    return apiClient.get(buildUrl(API_ENDPOINTS.PRODUCTS.GET, { id }));
  },

  async createProduct(productData) {
    return apiClient.post(API_ENDPOINTS.PRODUCTS.CREATE, productData);
  },

  async updateProduct(id, productData, imageFile) {
    const formData = new FormData();

    // 1. Text Fields
    formData.append('dishName', productData.dishName || '');
    
    // Safety check: Ensure category is a string ID
    let catId = productData.category;
    if (typeof catId === 'object' && catId !== null) {
        catId = catId._id || catId.id || '';
    }
    formData.append('category', catId || '');

    formData.append('price', String(productData.price || 0));
    formData.append('originalPrice', String(productData.originalPrice || 0));
    formData.append('stock', String(productData.stock || 0));
    formData.append('description', productData.description || '');

    // 2. Booleans (Backend expects strings "true" or "false")
    formData.append('availableForOrder', productData.availableForOrder ? "true" : "false");
    formData.append('isVIP', productData.isVIP ? "true" : "false");

    // 3. Image
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      // ✅ FIX: REMOVED manual 'Content-Type' header.
      // The browser automatically sets the correct Content-Type with boundary.
      const response = await apiClient.put(
        buildUrl(API_ENDPOINTS.PRODUCTS.UPDATE, { id }), 
        formData
      );
      return response.data;
    } catch (error) {
      console.error("Update Error:", error.response?.data);
      throw error.response?.data || { message: "Failed to update product" };
    }
  },

  async deleteProduct(id) {
    return apiClient.delete(buildUrl(API_ENDPOINTS.PRODUCTS.DELETE, { id }));
  },

  async toggleProductStatus(id) {
    return apiClient.patch(buildUrl(API_ENDPOINTS.PRODUCTS.TOGGLE_STATUS, { id }));
  },
  
  async addVariantToProduct(productId, variantData) {
      return apiClient.post(buildUrl(API_ENDPOINTS.PRODUCTS.VARIANTS.CREATE, { id: productId }), variantData);
  },

  async deleteVariant(productId, variantId) {
      return apiClient.delete(buildUrl(API_ENDPOINTS.PRODUCTS.VARIANTS.DELETE, { id: productId, variantId }));
  }
};
