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
    
    // 1. Mandatory Fields
    formData.append('dishName', productData.name); 
    formData.append('category', productData.category);
    formData.append('price', productData.price);
    formData.append('originalPrice', productData.originalPrice);
    formData.append('cost', productData.cost);
    formData.append('stock', productData.stock);
    formData.append('volume', productData.volume);
    
    // 2. Optional Fields
    formData.append('description', productData.description || '');
    formData.append('preparationTime', productData.preparationTime || '15');
    formData.append('calories', productData.calories || '0');
    
    // 3. Arrays
    if (productData.benefits && productData.benefits.length > 0) {
        productData.benefits.forEach(benefit => formData.append('benefits[]', benefit));
    }
    if (productData.attributes && productData.attributes.length > 0) {
         productData.attributes.forEach(attr => formData.append('attributes[]', attr));
    }

    // 4. Booleans
    formData.append('availableForOrder', productData.availableForOrder ? 'true' : 'false');
    formData.append('vegetarian', productData.vegetarian ? 'true' : 'false');
    formData.append('isVIP', productData.isVIP ? 'true' : 'false');

    // 5. Main Image
    if (productData.mainImage) {
      if (productData.mainImage.type === 'file') {
        formData.append('image', productData.mainImage.value);
      } else if (productData.mainImage.type === 'url') {
        formData.append('image', productData.mainImage.value);
      }
    }

    // 6. Variants
    if (productData.variants && productData.variants.length > 0) {
        const quantities = productData.variants.map((v, index) => {
           let variantImageVal = "";
           if (v.imageData) {
             if (v.imageData.type === 'url') {
               variantImageVal = v.imageData.value;
             } else if (v.imageData.type === 'file') {
               formData.append(`variantImage_${index}`, v.imageData.value);
               variantImageVal = `variantImage_${index}`; 
             }
           }
           return {
            label: v.label,
            value: Number(v.value),
            unit: v.unit,
            price: Number(v.price),
            stock: Number(v.stock),
            image: variantImageVal
           };
        });
        formData.append('availableQuantities', JSON.stringify(quantities));
    }

    return apiClient.post(API_ENDPOINTS.PRODUCTS.CREATE, formData);
  },

  async updateProduct(id, productData) {
      const formData = new FormData();
      if(productData.name) formData.append('dishName', productData.name);
      // ... add other fields if you want update to work fully
      if (productData.mainImage?.type === 'file') {
          formData.append('image', productData.mainImage.value);
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