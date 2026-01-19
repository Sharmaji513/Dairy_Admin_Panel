import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Badge } from "../components/ui/badge";
import {
  Search,
  Edit2,
  Trash2,
  Crown,
  Percent,
  Truck,
  Star,
  RefreshCw,
  Download,
  Plus,
  Shield,
  Zap,
  Diamond,
  Loader2,
} from "lucide-react";
import { AddMembershipModal } from "../components/modals/AddMembershipModal";
import { EditMembershipModal } from "../components/modals/EditMembershipModal";
import { DeleteConfirmationModal } from "../components/modals/DeleteConfirmationModal";
import { showSuccessToast } from "../lib/toast";
import { toast } from "sonner";
// ✅ IMPORT API HOOK
import { useApiMemberships } from "../lib/hooks/useApiMemberships";

export function Membership() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("price-asc");

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  // Removed local isRefreshing state, using hook's loading state instead

  // ✅ SWITCH TO API HOOK
  const {
    memberships, // Data from API
    loading,
    error,
    createMembership,
    updateMembership,
    deleteMembership,
    refetch,
  } = useApiMemberships();

  // ✅ UPDATE HANDLERS TO USE API FUNCTIONS
  const handleAddPlan = async (data) => {
    try {
      // API call to create
      await createMembership(data);
      showSuccessToast("Membership tier added successfully!");
      setAddModalOpen(false);
    } catch (err) {
      toast.error(err.message || "Failed to add tier");
    }
  };

  const handleEdit = (plan) => {
    setSelectedPlan(plan);
    setEditModalOpen(true);
  };

  const handleSaveEdit = async (updatedData) => {
  if (!selectedPlan) return;

  const payload = {
    name: updatedData.name,
    durationDays: Number(updatedData.durationDays),
    originalPrice: Number(updatedData.originalPrice),
    discountPrice: Number(updatedData.discountPrice),
    savings:
      Number(updatedData.originalPrice) - Number(updatedData.discountPrice),
    description:
      selectedPlan.description || "Unlock premium benefits for this plan",
    benefits: updatedData.benefits,
    isBestValue: selectedPlan.isBestValue,
    isActive: selectedPlan.isActive,
  };

  console.log("PUT PAYLOAD:", payload);

  try {
    await updateMembership(selectedPlan.id || selectedPlan._id, payload);
    showSuccessToast("Membership tier updated successfully!");
    setEditModalOpen(false);
    setSelectedPlan(null);
  } catch (err) {
    toast.error(err.message || "Failed to update tier");
  }
};


  const handleDelete = (plan) => {
    setSelectedPlan(plan);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
  if (!selectedPlan) return;

  const planId = selectedPlan.id || selectedPlan._id;

  if (!planId) {
    toast.error("Invalid membership ID");
    return;
  }

  console.log("DELETING PLAN ID:", planId);

  try {
    await deleteMembership(planId);
    showSuccessToast("Membership tier deleted successfully!");
    setDeleteModalOpen(false);
    setSelectedPlan(null);
  } catch (err) {
    toast.error(err.message || "Failed to delete tier");
  }
};


  // ✅ HELPER FUNCTIONS REMAIN THE SAME
  const getTierColorClass = (iconName) => {
    switch (iconName) {
      case "Crown":
        return "text-yellow-500 fill-yellow-100";
      case "Platinum Crown":
        return "text-slate-500 fill-slate-200";
      case "Star":
        return "text-gray-400 fill-gray-100";
      case "Percent":
        return "text-orange-700 fill-orange-700/20";
      case "Diamond":
        return "text-red-600 fill-red-100";
      case "Shield":
        return "text-emerald-500";
      case "Zap":
        return "text-purple-500";
      case "Truck":
        return "text-blue-500";
      default:
        return "text-gray-500";
    }
  };

  const getTierIcon = (iconName, className) => {
    const baseClass = "h-4 w-4 mr-2 " + className;
    switch (iconName) {
      case "Crown":
        return <Crown className={baseClass} />;
      case "Platinum Crown":
        return <Crown className={baseClass} />;
      case "Star":
        return <Star className={baseClass} />;
      case "Percent":
        return <Percent className={baseClass} />;
      case "Diamond":
        return <Diamond className={baseClass} />;
      case "Shield":
        return <Shield className={baseClass} />;
      case "Zap":
        return <Zap className={baseClass} />;
      default:
        return <Truck className={baseClass} />;
    }
  };

  const handleRefresh = () => {
    refetch();
    toast.success("Refreshing data...");
  };

  const handleExport = () => {
    toast.info("Exporting membership data...");
  };

  // Filter logic remains the same, acting on the API data
 const filteredMemberships = memberships
  .filter(m =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase())
  )
  .sort((a, b) => {
    if (sortOrder === "price-asc")
      return a.discountPrice - b.discountPrice;

    if (sortOrder === "price-desc")
      return b.discountPrice - a.discountPrice;

    if (sortOrder === "name-asc")
      return a.name.localeCompare(b.name);

    if (sortOrder === "name-desc")
      return b.name.localeCompare(a.name);

    return 0;
  });


  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Membership Tiers</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage membership tiers and benefits.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={loading}
            className="h-9 text-xs border border-gray-300"
          >
            {loading ? (
              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
            ) : (
              <RefreshCw className="h-3 w-3 mr-1" />
            )}
            {loading ? "Refreshing..." : "Refresh"}
          </Button>
          <Button
            size="sm"
            onClick={handleExport}
            className="h-9 text-xs bg-red-500 hover:bg-red-600 text-white border border-red-500"
          >
            <Download className="h-3 w-3 mr-1" /> Export
          </Button>
          {/* ✅ FIX: Ensure onClick is correctly set here */}
          <Button
            size="sm"
            onClick={() => setAddModalOpen(true)}
            className="h-9 text-xs bg-red-500 hover:bg-red-600 text-white border border-red-500"
          >
            <Plus className="h-3 w-3 mr-1" /> Add New Tier
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b space-y-3">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
              <Input
                placeholder="Search by tier name..."
                className="pl-9 text-xs h-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger className="h-9 text-xs w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="name-asc">Name: A to Z</SelectItem>
                <SelectItem value="name-desc">Name: Z to A</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table Area - Handle Loading/Error States inside layout */}
        {error && (
          <div className="p-8 text-center text-red-500">
            Error loading plans: {error}
          </div>
        )}

        {!error && (
          <Table>
            <TableHeader>
              <TableRow className="text-xs">
                <TableHead>TIER NAME</TableHead>
                <TableHead>DURATION</TableHead>
                <TableHead>ORIGINAL PRICE</TableHead>
                <TableHead>DISCOUNT PRICE</TableHead>
                <TableHead>DISCOUNT</TableHead>
                <TableHead>BENEFITS</TableHead>
                <TableHead>ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Show loading spinner inside table body if loading */}
              {loading && (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-gray-400" />
                  </TableCell>
                </TableRow>
              )}

              {/* Show empty state if no data */}
              {!loading && filteredMemberships.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="h-24 text-center text-gray-500 text-xs"
                  >
                    No membership tiers found. Add one to get started.
                  </TableCell>
                </TableRow>
              )}

              {/* Render data */}
              {!loading &&
                filteredMemberships.map((plan) => {
                  const colorClass = getTierColorClass(plan.icon);

                  return (
                    <TableRow key={plan.id || plan._id} className="text-xs">
                      <TableCell className="font-semibold">
                        {plan.name}
                      </TableCell>

                      <TableCell>{plan.durationDays ?? plan.duration ?? "-"}</TableCell>

                      <TableCell className="line-through text-gray-400">
                        ₹{plan.originalPrice.toLocaleString()}
                      </TableCell>

                      <TableCell className="font-semibold text-green-600">
                        ₹{plan.discountPrice.toLocaleString()}
                      </TableCell>

                      <TableCell>
                        <Badge className="bg-green-100 text-green-800">
                          {Math.round(((plan.originalPrice - plan.discountPrice) / plan.originalPrice) * 100)}% OFF

                        </Badge>
                      </TableCell>

                      <TableCell>
                        <ul className="list-disc list-inside text-xs text-gray-500">
                          {plan.benefits.map((b, i) => (
                            <li key={i}>{b}</li>
                          ))}
                        </ul>
                      </TableCell>

                      <TableCell >
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0"
                            onClick={() => handleEdit(plan)}
                          >
                            <Edit2 className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 text-red-600"
                            onClick={() => handleDelete(plan)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Modals */}
      <AddMembershipModal
        open={addModalOpen}
        onOpenChange={setAddModalOpen}
        onSave={handleAddPlan}
      />
      {selectedPlan && (
        <>
          <EditMembershipModal
            open={editModalOpen}
            onOpenChange={setEditModalOpen}
            onSave={handleSaveEdit}
            plan={selectedPlan}
          />
          <DeleteConfirmationModal
            open={deleteModalOpen}
            onOpenChange={setDeleteModalOpen}
            onConfirm={handleConfirmDelete}
            title="Delete Membership Tier"
            description={`Are you sure you want to delete the "${selectedPlan.name}" tier?`}
          />
        </>
      )}
    </div>
  );
}
