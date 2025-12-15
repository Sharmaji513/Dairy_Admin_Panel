import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Upload, X, Link as LinkIcon } from "lucide-react";

// Image Input Component
function ImageInput({ label, imageData, onChange }) {
  const [inputType, setInputType] = useState("file");
  const [urlInput, setUrlInput] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (imageData?.type === "url") {
      setInputType("url");
      setUrlInput(imageData.value);
    } else {
      setInputType("file");
    }
  }, [imageData]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    onChange({ type: "file", value: file, preview: URL.createObjectURL(file) });
  };

  const handleUrlChange = (e) => {
    const url = e.target.value;
    setUrlInput(url);
    if (url.match(/\.(jpeg|jpg|png|webp)$/i)) {
      onChange({ type: "url", value: url, preview: url });
    }
  };

  const clearImage = () => {
    onChange(null);
    setUrlInput("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-xs font-semibold">{label}</Label>
        <div className="flex bg-gray-100 rounded-md p-0.5">
          <button
            type="button"
            onClick={() => setInputType("file")}
            className={`px-2 py-0.5 text-[10px] rounded ${
              inputType === "file"
                ? "bg-white shadow text-blue-600 font-medium"
                : "text-gray-500"
            }`}
          >
            Upload
          </button>
          <button
            type="button"
            onClick={() => setInputType("url")}
            className={`px-2 py-0.5 text-[10px] rounded ${
              inputType === "url"
                ? "bg-white shadow text-blue-600 font-medium"
                : "text-gray-500"
            }`}
          >
            Link
          </button>
        </div>
      </div>

      {imageData ? (
        <div className="relative w-full border rounded-lg bg-gray-50 overflow-hidden" style={{ height: "128px" }}>
          <img src={imageData.preview} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
          <button
            type="button"
            onClick={clearImage}
            className="absolute top-2 right-2 z-10 p-1 bg-white/90 text-red-500 rounded-full hover:bg-red-50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div
          className="w-full border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 flex items-center justify-center"
          style={{ height: "128px" }}
        >
          {inputType === "file" ? (
            <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center">
              <Upload className="w-6 h-6 mb-2 text-gray-400" />
              <span className="text-xs text-gray-500">Click to upload image</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} ref={fileInputRef} />
            </label>
          ) : (
            <div className="w-full px-4 flex flex-col items-center gap-2">
              <LinkIcon className="w-6 h-6 text-gray-400" />
              <Input placeholder="Paste image URL" value={urlInput} onChange={handleUrlChange} className="h-8 text-xs" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Main Modal
export function AddVariantModal({ open, onClose, onAdd, productName, initialData }) {
  const [loading, setLoading] = useState(false);
  const [variantData, setVariantData] = useState({
    label: "",
    value: "",
    unit: "ml",
    price: "",
    stock: "",
    imageData: null,
  });

  useEffect(() => {
    if (open && initialData) {
      setVariantData({
        label: initialData.label,
        value: initialData.value,
        unit: initialData.unit,
        price: initialData.price,
        stock: initialData.stock,
        imageData: initialData.image
          ? { type: "url", value: initialData.image, preview: initialData.image }
          : null,
      });
    } else if (open && !initialData) {
      setVariantData({ label: "", value: "", unit: "ml", price: "", stock: "", imageData: null });
    }
  }, [open, initialData]);

  const handleChange = (key, value) => setVariantData(prev => ({ ...prev, [key]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onAdd(variantData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-white p-0 overflow-hidden">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle>{initialData ? "Edit" : "Add"} Variant – {productName}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <ImageInput label="Variant Image (Optional)" imageData={variantData.imageData} onChange={data => handleChange("imageData", data)} />

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label className="text-xs font-medium">Label *</Label>
              <Input className="h-9 text-xs" value={variantData.label} onChange={e => handleChange("label", e.target.value)} required />
            </div>

            <div>
              <Label className="text-xs font-medium">Value *</Label>
              <Input type="number" className="h-9 text-xs" value={variantData.value} onChange={e => handleChange("value", e.target.value)} required />
            </div>

            <div>
              <Label className="text-xs font-medium">Unit *</Label>
              <Select value={variantData.unit} onValueChange={v => handleChange("unit", v)}>
                <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ml">ml</SelectItem>
                  <SelectItem value="kg">kg</SelectItem>
                  <SelectItem value="gm">gm</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs font-medium">Price (₹) *</Label>
              <Input type="number" className="h-9 text-xs" value={variantData.price} onChange={e => handleChange("price", e.target.value)} required />
            </div>

            <div>
              <Label className="text-xs font-medium">Stock *</Label>
              <Input type="number" className="h-9 text-xs" value={variantData.stock} onChange={e => handleChange("stock", e.target.value)} required />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
              {loading ? (initialData ? "Updating..." : "Adding...") : (initialData ? "Update Variant" : "Add Variant")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
