import { useState, useEffect, useCallback } from 'react';
import { membershipService } from '../api/services/membershipService';
import { toast } from 'sonner';

export function useApiMemberships() {
  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMemberships = useCallback(async () => {
    setLoading(true);
    try {
      const response = await membershipService.getMemberships();
      
      // Safety check
      if (!response || !response.data) {
         setMemberships([]);
         return;
      }

      const plansList = response.data.plans || [];

      const mappedPlans = plansList.map(plan => ({
        id: plan.id || plan._id,
        name: plan.name || 'Unnamed Plan',
        price: plan.discountPrice || plan.price || 0,
        // Backend doesn't support these yet, so we use defaults or try to read them if added later
        minOrders: plan.minOrders || 0, 
        minSpend: plan.minSpend || 0,
        discount: plan.discountPercent || 0,
        benefits: plan.benefits || [],
        icon: plan.icon || 'Truck', 
      }));

      setMemberships(mappedPlans);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch memberships:", err);
      if (err.response && err.response.status !== 404) {
          setError(err.message || 'Failed to load plans');
      } else {
          setMemberships([]);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMemberships();
  }, [fetchMemberships]);

  const createMembership = async (data) => {
    try {
      // ✅ FIX: Calculate fields required by backend that are missing from frontend form
      const price = Number(data.price);
      const discountPercent = Number(data.discount) || 0;
      
      // Calculate a fake 'originalPrice' because backend requires it to show savings
      // Formula: Original = Price / (1 - discount%)
      const originalPrice = discountPercent > 0 
        ? Math.round(price / (1 - (discountPercent / 100))) 
        : price;

      const payload = {
        name: data.name,
        originalPrice: originalPrice, // REQUIRED by backend
        discountPrice: price,         // REQUIRED by backend
        durationDays: 30,             // REQUIRED by backend (Defaulting to 30 days)
        benefits: data.benefits,
        
        // These fields are NOT in your teammate's controller yet. 
        // We send them anyway hoping they updated the model, or they will just be ignored.
        icon: data.icon,
        minOrders: Number(data.minOrders),
        minSpend: Number(data.minSpend),
        discountPercent: discountPercent
      };
      
      console.log("Sending payload to backend:", payload); // For debugging

      await membershipService.createMembership(payload);
      fetchMemberships(); 
      toast.success("Membership tier added successfully!"); // Moved success toast here
    } catch (err) {
      console.error("Create API Error:", err);
      const errorMsg = err.response?.data?.message || err.message || "Failed to create plan";
      toast.error(errorMsg); // Show actual error from backend
      throw err;
    }
  };

  const updateMembership = async (id, data) => {
    try {
      const price = Number(data.price);
      const discountPercent = Number(data.discount) || 0;
      const originalPrice = discountPercent > 0 
        ? Math.round(price / (1 - (discountPercent / 100))) 
        : price;

      const payload = {
        name: data.name,
        originalPrice: originalPrice,
        discountPrice: price,
        benefits: data.benefits,
        // icon: data.icon,
        // minOrders: Number(data.minOrders),
        // minSpend: Number(data.minSpend),
        // discountPercent: discountPercent
      };
      
      await membershipService.updateMembership(id, payload);
      fetchMemberships();
      toast.success("Membership tier updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to update plan");
      throw err;
    }
  };

  const deleteMembership = async (id) => {
    try {
      await membershipService.deleteMembership(id);
      fetchMemberships();
      toast.success("Membership tier deleted successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete plan");
      throw err;
    }
  };

  return {
    memberships,
    loading,
    error,
    refetch: fetchMemberships,
    createMembership,
    updateMembership,
    deleteMembership
  };
}