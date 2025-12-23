import { apiClient } from '../client';
import { API_ENDPOINTS, buildUrl } from '../config';

export const productService = {
  async getProducts(filters) {
    return apiClient.get(API_ENDPOINTS.PRODUCTS.LIST, filters);
  },

  async getProduct(id) {
    return apiClient.get(buildUrl(API_ENDPOINTS.PRODUCTS.GET, { id }));
  },

  async createProduct(productData, imageFile) {
    const formData = new FormData();
    appendProductData(formData, productData);
    if (imageFile) formData.append('image', imageFile);

    try {
      const response = await apiClient.post(API_ENDPOINTS.PRODUCTS.CREATE, formData);
      return response.data;
    } catch (error) {
      console.error("Create Error:", error.response?.data);
      throw error.response?.data || { message: "Failed to create product" };
    }
  },

  async updateProduct(id, productData, imageFile) {
    // 1. VALIDATION: Ensure we have a valid ID before calling the backend
    if (!id || id.includes('product-')) { // Checks for your custom temp IDs
        throw new Error(`Cannot update product with invalid ID: ${id}. Real database ID required.`);
    }

    const formData = new FormData();
    appendProductData(formData, productData);
    
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
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

// --- Helper to safely append data ---
function appendProductData(formData, data) {
    // 1. Text Fields (Fallback to empty string if undefined)
    formData.append('dishName', data.dishName || data.name || ''); 
    
    // 2. Category ID Safety Check
    let catId = data.category;
    if (typeof catId === 'object' && catId !== null) {
        catId = catId._id || catId.id; 
    }
    // Only append if it's a valid string (prevents "undefined" string error)
    if (catId && typeof catId === 'string' && catId !== 'undefined' && catId !== 'null') {
        formData.append('category', catId);
    }

    // 3. Numbers (Sanitize to 0 if missing/invalid)
    formData.append('price', String(parseFloat(data.price) || 0));
    formData.append('cost', String(parseFloat(data.cost) || 0)); 
    formData.append('originalPrice', String(parseFloat(data.originalPrice) || 0));
    formData.append('stock', String(parseInt(data.stock) || 0));
    
    // 4. Strings
    formData.append('volume', data.volume || '');
    formData.append('description', data.description || '');

    // 5. Booleans (Backend requires "true"/"false" strings)
    formData.append('availableForOrder', data.availableForOrder ? "true" : "false");
    formData.append('isVIP', data.isVIP ? "true" : "false");
    
    // 6. Arrays (Must be JSON stringified)
    if (Array.isArray(data.benefits)) {
        formData.append('benefits', JSON.stringify(data.benefits));
    }
    if (Array.isArray(data.attributes)) {
        formData.append('attributes', JSON.stringify(data.attributes));
    }
}