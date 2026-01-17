import { useState, useEffect, useCallback } from "react";
import { membershipService } from "../api/services/membershipService";
import { toast } from "sonner";

export function useApiMemberships() {
  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMemberships = useCallback(async () => {
    setLoading(true);
    try {
      const response = await membershipService.getMemberships();

      if (response?.success && Array.isArray(response.plans)) {
        setMemberships(response.plans); 
        setError(null);
      } else {
        setMemberships([]);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message || "Failed to load plans");
      setMemberships([]);
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    fetchMemberships();
  }, [fetchMemberships]);
  const createMembership = async (data) => {
    try {
      console.log("SENDING TO BACKEND:", data);

      await membershipService.createMembership(data);

      fetchMemberships();
      toast.success("Membership tier added successfully!");
    } catch (err) {
      console.error("Create API Error:", err);
      toast.error(
        err.response?.data?.message || "Failed to create membership plan"
      );
      throw err;
    }
  };

 const updateMembership = async (id, payload) => {
  try {
    console.log("FINAL PUT PAYLOAD:", payload);

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
  if (!id) throw new Error("Membership ID is required");

  try {
    await membershipService.deleteMembership(id);
    fetchMemberships();
    toast.success("Membership tier deleted successfully!");
  } catch (err) {
    console.error("Delete API Error:", err);
    toast.error(
      err.response?.data?.message || "Failed to delete membership plan"
    );
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
    deleteMembership,
  };
}
