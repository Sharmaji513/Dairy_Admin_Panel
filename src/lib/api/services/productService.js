import { apiClient } from '../client';
import { API_ENDPOINTS, buildUrl } from '../config';

const isValidMongoId = (id) => /^[0-9a-fA-F]{24}$/.test(id);

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
      return response.data || response;
    } catch (error) {
      console.error("Create Error:", error);
      throw error.response?.data || { message: "Failed to create product" };
    }
  },

  async updateProduct(id, productData, imageFile) {
    if (!id || !isValidMongoId(id)) {
        throw new Error(`Cannot update: Product ID '${id}' is invalid.`);
    }

    const formData = new FormData();
    
    // --- Manual append to ensure correctness ---
    formData.append('dishName', productData.dishName || productData.name || ''); 
    
    // ✅ CRITICAL CATEGORY CHECK
    // Only send valid Hex IDs. If it's empty, null, or weird string, skip it.
    if (productData.category && isValidMongoId(productData.category)) {
        formData.append('category', productData.category);
    }

    // Numbers
    formData.append('price', String(parseFloat(productData.price) || 0));
    formData.append('cost', String(parseFloat(productData.cost) || 0)); 
    formData.append('originalPrice', String(parseFloat(productData.originalPrice) || 0));
    formData.append('stock', String(parseInt(productData.stock) || 0));
    
    // Strings
    formData.append('volume', productData.volume || '');
    formData.append('description', productData.description || '');

    // Booleans
    formData.append('availableForOrder', productData.availableForOrder ? "true" : "false");
    formData.append('isVIP', productData.isVIP ? "true" : "false");
    
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      const response = await apiClient.put(
        buildUrl(API_ENDPOINTS.PRODUCTS.UPDATE, { id }), 
        formData
      );
      // ✅ Fix for "undefined reading success"
      return response.data || response;
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

