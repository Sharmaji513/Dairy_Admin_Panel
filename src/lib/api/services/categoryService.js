import { apiClient } from '../client';
import { API_ENDPOINTS, buildUrl } from '../config';

export const categoryService = {
  async getCategories() {
    return apiClient.get(API_ENDPOINTS.CATEGORIES.LIST);
  },

  async createCategory(categoryData) {
    const formData = new FormData();
    formData.append('name', categoryData.name);
    formData.append('displayName', categoryData.displayName);
    formData.append('description', categoryData.description || '');
    
    if (categoryData.imageFile) {
      formData.append('image', categoryData.imageFile);
    }
    
    if (categoryData.icon) {
      formData.append('icon', categoryData.icon);
    }

    formData.append('isActive', categoryData.isActive ? 'true' : 'false');

    return apiClient.post(API_ENDPOINTS.CATEGORIES.CREATE, formData);
  },

  // ✨ NEW: Update
  async updateCategory(id, categoryData) {
    const formData = new FormData();
    if (categoryData.displayName) formData.append('displayName', categoryData.displayName);
    if (categoryData.description !== undefined) formData.append('description', categoryData.description);
    if (categoryData.imageFile) formData.append('image', categoryData.imageFile);
    if (categoryData.isActive !== undefined) formData.append('isActive', categoryData.isActive ? 'true' : 'false');

    return apiClient.put(buildUrl(API_ENDPOINTS.CATEGORIES.UPDATE, { id }), formData);
  },

  // ✨ NEW: Delete
  async deleteCategory(id) {
    return apiClient.delete(buildUrl(API_ENDPOINTS.CATEGORIES.DELETE, { id }));
  }
};