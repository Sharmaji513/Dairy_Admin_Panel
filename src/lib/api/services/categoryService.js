import { apiClient } from '../client';
import { API_ENDPOINTS } from '../config';

export const categoryService = {
  async getCategories() {
    return apiClient.get(API_ENDPOINTS.CATEGORIES.LIST);
  },

  // ✨ Function to create a new category
  async createCategory(categoryData) {
    // Sends JSON like { name: "Ice Cream", displayName: "Ice Cream" }
    return apiClient.post(API_ENDPOINTS.CATEGORIES.CREATE, categoryData);
  }
};