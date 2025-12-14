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

    // Debug: log FormData keys and file names (helps diagnose upload issues)
    try {
      if (typeof window !== 'undefined') {
        for (const pair of formData.entries()) {
          const [key, val] = pair;
          if (val instanceof File) {
            console.debug('[productService] formData', key, 'File:', val.name, val.size, val.type);
          } else {
            console.debug('[productService] formData', key, typeof val === 'string' ? val.slice(0, 200) : val);
          }
        }
      }
    } catch (e) {
      console.debug('[productService] could not enumerate formData', e);
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

  // Variant Management
  async getProductById(id) {
    return apiClient.get(buildUrl(API_ENDPOINTS.PRODUCTS.GET, { id }));
  },

  async addVariantToProduct(productId, variantData) {
    // Prepare the data for JSON request
    const requestData = {
      label: variantData.label,
      value: parseFloat(variantData.value),
      unit: variantData.unit,
      price: parseFloat(variantData.price),
      stock: parseInt(variantData.stock),
    };

    // Handle image attachment
    if (variantData.imageData) {
      if (variantData.imageData.type === 'file') {
        // For file uploads, we still need FormData
        const formData = new FormData();
        Object.keys(requestData).forEach(key => {
          formData.append(key, requestData[key]);
        });
        formData.append('image', variantData.imageData.value);
        const url = buildUrl(API_ENDPOINTS.PRODUCTS.VARIANTS.CREATE, { id: productId });
        return apiClient.post(url, formData);
      } else if (variantData.imageData.type === 'url') {
        requestData.imageUrl = variantData.imageData.value;
      }
    }

    // Send as JSON for non-file uploads
    const url = buildUrl(API_ENDPOINTS.PRODUCTS.VARIANTS.CREATE, { id: productId });
    return apiClient.post(url, requestData);
  },

  async deleteVariant(productId, variantId) {
    const url = buildUrl(API_ENDPOINTS.PRODUCTS.VARIANTS.DELETE, {
      id: productId,
      variantId: variantId,
    });
    return apiClient.delete(url);
  },
};