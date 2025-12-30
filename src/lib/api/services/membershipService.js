// admin_11/src/lib/api/services/membershipService.js
import { apiClient } from '../client';

export const membershipService = {
  // Get all plans (Admin view might need a specific endpoint if different from public, 
  // but assuming we can use the public one or a specific admin list endpoint)
  async getMemberships() {
    // Teammate's route: router.get("/plans", protect, getAllPlans);
    // Adjust endpoint if your backend prefixes it (e.g. /api/v1/membership/plans)
    return apiClient.get('/membership/plans'); 
  },

  async createMembership(data) {
    // Teammate's route: router.post("/admin/plans", protect, authorize("Admin"), createPlan);
    return apiClient.post('/membership/admin/plans', data);
  },

  async updateMembership(id, data) {
    // Teammate's route: router.put("/admin/plans/:id", protect, authorize("Admin"), updatePlan);
    return apiClient.put(`/membership/admin/plans/${id}`, data);
  },

  async deleteMembership(id) {
    // Teammate didn't provide a DELETE route in the snippet!
    // You should ask them to add: router.delete("/admin/plans/:id", protect, authorize("Admin"), deletePlan);
    // For now, assuming it exists:
    return apiClient.delete(`/membership/admin/plans/${id}`);
  }
};