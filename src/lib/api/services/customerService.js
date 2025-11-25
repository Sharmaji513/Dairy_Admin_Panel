import { apiClient } from '../client';
import { API_ENDPOINTS, buildUrl } from '../config';

export const customerService = {
  /**
   * Get all customers with filters
   */
  async getCustomers(filters) {
    return apiClient.get(
      API_ENDPOINTS.CUSTOMERS.LIST,
      filters
    );
  },

  /**
   * Get single customer by ID
   */
  async getCustomer(id) {
    return apiClient.get(
      buildUrl(API_ENDPOINTS.CUSTOMERS.GET, { id })
    );
  },

  /**
   * Create new customer
   */
  async createCustomer(customer) {
    return apiClient.post(
      API_ENDPOINTS.CUSTOMERS.CREATE,
      customer
    );
  },

  /**
   * Update customer
   */
  async updateCustomer(id, customer) {
    return apiClient.put(
      buildUrl(API_ENDPOINTS.CUSTOMERS.UPDATE, { id }),
      customer
    );
  },

  /**
   * Delete customer
   */
  async deleteCustomer(id) {
    return apiClient.delete(
      buildUrl(API_ENDPOINTS.CUSTOMERS.DELETE, { id })
    );
  },

  /**
   * Toggle customer status (active/inactive)
   */
  async toggleCustomerStatus(id, currentStatus) {
    // Determine the new status we want
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    
    // Send it explicitly in the body
    return apiClient.patch(
      buildUrl(API_ENDPOINTS.CUSTOMERS.TOGGLE_STATUS, { id }),
      { status: newStatus }
    );
  },
};