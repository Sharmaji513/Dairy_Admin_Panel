import { apiClient } from '../client';
import { API_ENDPOINTS, buildUrl } from '../config';

export const productService = {
  async getProducts(filters) {
    return apiClient.get(API_ENDPOINTS.PRODUCTS.LIST, filters);
  },

  async getProduct(id) {
    return apiClient.get(buildUrl(API_ENDPOINTS.PRODUCTS.GET, { id }));
  },

  async createProduct(productData) {
    const formData = new FormData();
    
    // 1. Basic Fields
    formData.append('dishName', productData.name); 
    formData.append('category', productData.category);
    formData.append('description', productData.description || '');
    formData.append('availableForOrder', productData.availableForOrder ? 'true' : 'false');
    formData.append('vegetarian', productData.vegetarian ? 'true' : 'false');
    
    // 2. ✨ HANDLE VARIANTS (availableQuantities)
    if (productData.variants && productData.variants.length > 0) {
        // Format variants to match schema: { label, value, unit, price, stock }
        const quantities = productData.variants.map(v => ({
            label: v.label,
            value: parseFloat(v.value),
            unit: v.unit,
            price: parseFloat(v.price),
            stock: parseInt(v.stock)
        }));
        
        // Backend expects array stringified
        formData.append('availableQuantities', JSON.stringify(quantities));
        
        // ✨ Set root price/stock from the first variant (as a default)
        formData.append('price', quantities[0].price);
        formData.append('stock', quantities[0].stock);
        formData.append('cost', quantities[0].price); // Default cost
    } else {
         // Fallback if no variants (should not happen with new modal)
         formData.append('price', '0');
         formData.append('stock', '0');
    }

    // 3. Handle Image
    if (productData.imageFile) {
      formData.append('image', productData.imageFile);
    }

    return apiClient.post(API_ENDPOINTS.PRODUCTS.CREATE, formData);
  },

  async updateProduct(id, productData) {
    const formData = new FormData();
    
    if (productData.name) formData.append('dishName', productData.name);
    if (productData.category) formData.append('category', productData.category);
    if (productData.price) formData.append('price', productData.price);
    if (productData.stock) formData.append('stock', productData.stock);
    if (productData.description) formData.append('description', productData.description);
    
    // Only append image if a new one was selected
    if (productData.imageFile) {
      formData.append('image', productData.imageFile);
    }

    return apiClient.put(buildUrl(API_ENDPOINTS.PRODUCTS.UPDATE, { id }), formData);
  },

  async deleteProduct(id) {
    return apiClient.delete(buildUrl(API_ENDPOINTS.PRODUCTS.DELETE, { id }));
  },

  async toggleProductStatus(id) {
    return apiClient.patch(buildUrl(API_ENDPOINTS.PRODUCTS.TOGGLE_STATUS, { id }));
  },
};