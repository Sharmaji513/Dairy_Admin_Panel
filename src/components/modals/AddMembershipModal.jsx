import { useState } from "react";
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

export function AddMembershipModal({ open, onOpenChange, onSave }) {
  const [formData, setFormData] = useState({
    name: "",
    duration: "",
    originalPrice: "",
    discountPercent: "",
    benefitsText: "",
    icon: "Crown",
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
  e.preventDefault();

  const benefitsArray = formData.benefitsText
    .split("\n")
    .map(b => b.trim())
    .filter(Boolean);

  const durationMap = {
    "30 Days": 30,
    "60 Days": 60,
    "90 Days": 90,
    "1 Year Plan": 365
  };

  const durationDays = durationMap[formData.duration];

  const originalPrice = Number(formData.originalPrice);
  const discountPercent = Number(formData.discountPercent);

  const discountPrice = Math.round(
    originalPrice - (originalPrice * discountPercent) / 100
  );

  const savings = originalPrice - discountPrice;

  const payload = {
    name: formData.name,
    durationDays,
    originalPrice,
    discountPrice,
    savings,
    description: `Unlock all premium benefits for ${formData.duration}.`,
    benefits: benefitsArray,
    isBestValue: false,
    isActive: true
  };

  console.log("FINAL BACKEND PAYLOAD:", payload); // 🔥 MUST MATCH POSTMAN

  onSave(payload);
};


  const discountPrice =
    formData.originalPrice && formData.discountPercent
      ? Math.round(
          formData.originalPrice -
            (formData.originalPrice * formData.discountPercent) / 100
        )
      : "";

  // ✅ Updated Colors: Copper is now orange-600
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
              Add New Tier
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-1">
              Define a new membership level
            </DialogDescription>
          </div>
        </div>
        <div className="p-6">
          <form
            id="add-membership-form"
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-gray-700">
                  Tier Name
                </Label>
                <Select
                  value={formData.name}
                  onValueChange={(val) => handleChange("name", val)}
                >
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="Select Tier Name" />
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      "Silver Elite",
                      "Bronze Daily Saver",
                      "Gold Pro",
                      "Premium Plus",
                    ].map((tier) => (
                      <SelectItem key={tier} value={tier}>
                        {tier}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-gray-700">
                  Price (₹)
                </Label>
                <Input
                  type="number"
                  placeholder="Original Price"
                  value={formData.originalPrice}
                  onChange={(e) =>
                    handleChange("originalPrice", Number(e.target.value))
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-gray-700">
                  Discounted Percent (%)
                </Label>
                <Input
                  type="number"
                  placeholder="Discount %"
                  value={formData.discountPercent}
                  onChange={(e) =>
                    handleChange("discountPercent", Number(e.target.value))
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-gray-700">
                  Discounted Price (₹)
                </Label>
                <Input
                  disabled
                  value={discountPrice}
                  placeholder="Discount Price (Auto)"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-gray-700">
                Duration
              </Label>
              <Select
                value={formData.duration}
                onValueChange={(val) => handleChange("duration", val)}
              >
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue placeholder="Select Duration" />
                </SelectTrigger>
                <SelectContent>
                  {["30 Days", "60 Days", "90 Days", "1 Year Plan"].map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-gray-700">
                Tier Icon
              </Label>
              <Select
                value={formData.icon}
                onValueChange={(val) => handleChange("icon", val)}
              >
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue placeholder="Select icon" />
                </SelectTrigger>
                <SelectContent>
                  {[
                    "Truck",
                    "Crown",
                    "Platinum Crown",
                    "Star",
                    "Percent",
                    "Diamond",
                    "Shield",
                    "Zap",
                  ].map((icon) => (
                    <SelectItem key={icon} value={icon} className="text-xs">
                      <div className="flex items-center">
                        {renderIcon(icon)}
                        <span>{icon}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1.5"><Label className="text-xs font-semibold text-gray-700">Min Orders</Label><Input type="number" value={formData.minOrders} onChange={(e) => handleChange('minOrders', e.target.value)} className="h-9 text-xs" /></div>
                <div className="space-y-1.5"><Label className="text-xs font-semibold text-gray-700">Min Spend</Label><Input type="number" value={formData.minSpend} onChange={(e) => handleChange('minSpend', e.target.value)} className="h-9 text-xs" /></div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-gray-700">
                  Discount (%)
                </Label>
                <Input
                  type="number"
                  value={formData.discount}
                  onChange={(e) => handleChange("discount", e.target.value)}
                  className="h-9 text-xs"
                />
              </div>
            </div> */}
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
            form="add-membership-form"
            className="inline-flex items-center justify-center rounded-md text-xs font-bold h-9 px-6 bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Create Tier
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
