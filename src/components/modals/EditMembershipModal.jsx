import { useState, useEffect } from "react";
import {
  X,
  Crown,
  Star,
  Percent,
  Truck,
  Shield,
  Zap,
  Diamond,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export function EditMembershipModal({ open, onOpenChange, onSave, plan }) {
  const [formData, setFormData] = useState({
    name: "",
    originalPrice: 0,
    discountPercent: 0,
    durationDays: 30,
    benefitsText: "",
  });

  useEffect(() => {
    if (plan && open) {
      setFormData({
        name: plan.name || "",
        originalPrice: plan.originalPrice || 0,
        discountPercent: plan.originalPrice
          ? Math.round(
              ((plan.originalPrice - plan.discountPrice) / plan.originalPrice) *
                100
            )
          : 0,
        durationDays: plan.durationDays || 30,

        benefitsText: Array.isArray(plan.benefits)
          ? plan.benefits.join("\n")
          : "",
      });
    }
  }, [plan, open]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const discountPrice = Math.round(
    formData.originalPrice -
      (formData.originalPrice * formData.discountPercent) / 100
  );

  const savings = formData.originalPrice - discountPrice;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (plan) {
      const benefitsArray = formData.benefitsText
        .split("\n")
        .map((b) => b.trim())
        .filter(Boolean);

      onSave({
        name: formData.name,
        durationDays: Number(formData.durationDays),
        originalPrice: Number(formData.originalPrice),
        discountPrice,
        savings,
        benefits: benefitsArray,
        description: plan.description || "Premium membership plan",
        isBestValue: plan.isBestValue,
        isActive: plan.isActive,
      });

      onOpenChange(false);
    }
  };

  const renderIcon = (iconName) => {
    const baseClass = "h-4 w-4 mr-2";
    switch (iconName) {
      case "Crown":
        return (
          <Crown className={`${baseClass} text-yellow-500 fill-yellow-100`} />
        );
      case "Platinum Crown":
        return (
          <Crown className={`${baseClass} text-slate-500 fill-slate-200`} />
        );
      case "Star":
        return <Star className={`${baseClass} text-gray-400 fill-gray-100`} />;
      case "Percent":
        return (
          <Percent
            className={`${baseClass} text-orange-700 fill-orange-700/20`}
          />
        ); // Copper
      case "Diamond":
        return <Diamond className={`${baseClass} text-red-600 fill-red-100`} />;
      case "Truck":
        return <Truck className={`${baseClass} text-blue-500`} />;
      case "Shield":
        return <Shield className={`${baseClass} text-emerald-500`} />;
      case "Zap":
        return <Zap className={`${baseClass} text-purple-500`} />;
      default:
        return <Truck className={`${baseClass} text-gray-500`} />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto p-0 gap-0 bg-white rounded-lg shadow-xl border border-gray-200">
        <div className="px-6 py-4 border-b flex justify-between items-center sticky top-0 bg-white z-10">
          <div>
            <DialogTitle className="text-lg font-bold text-gray-900">
              Edit Tier
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-1">
              Modify details
            </DialogDescription>
          </div>
        </div>
        <div className="p-6">
          <form
            id="edit-membership-form"
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-gray-700">
                  Tier Name
                </Label>
                <Input
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  required
                  className="h-9 text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-gray-700">
                  Price (₹)
                </Label>
                <Input
                  type="number"
                  value={formData.originalPrice}
                  onChange={(e) =>
                    handleChange("originalPrice", Number(e.target.value))
                  }
                  required
                  className="h-9 text-xs"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-gray-700">
                Duration
              </Label>
              <Select
                value={String(formData.durationDays)}
                onValueChange={(val) =>
                  handleChange("durationDays", Number(val))
                }
              >
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 Days</SelectItem>
                  <SelectItem value="60">60 Days</SelectItem>
                  <SelectItem value="90">90 Days</SelectItem>
                  <SelectItem value="365">1 Year</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-gray-700">
                  Discount (%)
                </Label>
                <Input
                  type="number"
                  value={formData.discountPercent}
                  onChange={(e) =>
                    handleChange("discountPercent", Number(e.target.value))
                  }
                  className="h-9 text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-gray-700">
                  Discounted Price (₹)
                </Label>
                <Input
                  value={discountPrice}
                  disabled
                  className="h-9 text-xs bg-gray-100"
                />
              </div>
            </div>
            <div className="space-y-1.5 pt-2 border-t mt-2">
              <Label className="text-xs font-semibold text-gray-700">
                Benefits (One per line)
              </Label>
              <Textarea
                value={formData.benefitsText}
                onChange={(e) => handleChange("benefitsText", e.target.value)}
                className="min-h-[100px] text-xs resize-none"
              />
            </div>
          </form>
        </div>
        <div className="p-4 border-t bg-gray-50 flex justify-end gap-3 sticky bottom-0 z-10">
          <Button
            variant="outline"
            type="button"
            onClick={() => onOpenChange(false)}
            className="h-9 text-xs border-gray-300 bg-white"
          >
            Cancel
          </Button>
          <button
            type="submit"
            form="edit-membership-form"
            className="inline-flex items-center justify-center rounded-md text-xs font-bold h-9 px-6 bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Update Tier
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
