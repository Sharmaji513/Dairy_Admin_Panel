import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { productService } from '../../lib/api/services/productService'; 
import { toast } from 'sonner';
import { Upload, Loader, ChevronDown, Check, Plus } from 'lucide-react';

// Helper: Check for valid 24-char hex MongoDB ID
const isValidMongoId = (id) => /^[0-9a-fA-F]{24}$/.test(id);

function CustomToggle({ label, checked, onChange, activeColor = "bg-green-500", icon: Icon = Check }) {
  return (
    <div 
      onClick={() => onChange(!checked)}
      className={`flex items-center justify-between w-full p-3 rounded-lg border cursor-pointer transition-all duration-200 select-none ${checked ? `border-${activeColor.split('-')[1]}-200 bg-${activeColor.split('-')[1]}-50` : 'border-gray-200 bg-white hover:bg-gray-50'}`}
    >
      <div className="flex items-center gap-3">
        <div className={`h-8 w-8 rounded-full flex items-center justify-center transition-colors flex-shrink-0 ${checked ? `bg-white text-${activeColor.split('-')[1]}-600 shadow-sm` : 'bg-gray-100 text-gray-400'}`}>
          <Icon className="h-4 w-4" />
        </div>
        <span className={`text-xs font-medium ${checked ? 'text-gray-900' : 'text-gray-500'}`}>
          {label}
        </span>
      </div>
      <div className={`w-9 h-5 rounded-full transition-colors relative flex-shrink-0 ${checked ? activeColor : 'bg-gray-300'}`}>
        <div className={`absolute top-1 left-1 bg-white w-3 h-3 rounded-full shadow transition-transform duration-200 ${checked ? 'translate-x-4' : 'translate-x-0'}`} />
      </div>
    </div>
  );
}

export function EditModal({ open, onOpenChange, product, onSuccess, categories = [] }) {
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const [formData, setFormData] = useState({
    dishName: '',
    category: '', 
    price: '',
    originalPrice: '',
    cost: '',
    stock: '',
    volume: '',
    description: '',
    availableForOrder: true,
    isVIP: false,
  });

  // Load product data when modal opens
  useEffect(() => {
    if (product && open) {
      console.log("Edit Modal Loaded Product:", product);

      // Extract Category ID safely
      let catId = '';
      if (product.category) {
          catId = typeof product.category === 'object' ? (product.category._id || product.category.id) : product.category;
      }

      setFormData({
        dishName: product.dishName || product.name || '',
        category: catId || '',
        price: product.price || 0,
        originalPrice: product.originalPrice || 0,
        cost: product.cost || 0,
        stock: product.stock || 0,
        volume: product.volume || '',
        description: product.description || '',
        availableForOrder: product.availableForOrder ?? true,
        isVIP: product.isVIP || false,
      });
      setImagePreview(product.image);
      setSelectedFile(null);
    }
  }, [product, open]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSelectChange = (e) => {
    setFormData((prev) => ({ ...prev, category: e.target.value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Get the MongoDB _id. Fallback to id only if _id is missing.
      const id = product._id || product.id;

      // 2. Validate ID Format - BLOCK request if ID is fake/temporary
      if (!id || !isValidMongoId(id)) {
          console.error("Blocked Invalid ID:", id);
          toast.error(`Cannot update: Product has an invalid or temporary ID (${id}). Please create a new product instead.`);
          setLoading(false);
          return; 
      }

      // 3. Call Service
      const response = await productService.updateProduct(id, formData, selectedFile);
      
      if (response.success || response.product) {
        toast.success("Product Updated Successfully!");
        if (onSuccess) onSuccess(); 
        onOpenChange(false);
      }
    } catch (error) {
      console.error("Update Failed:", error);
      toast.error(error.message || "Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] w-[95vw] p-0 flex flex-col bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 bg-white flex-shrink-0">
          <DialogHeader className="m-0 p-0 text-left">
            <DialogTitle className="text-xl font-bold text-gray-900">Edit Product</DialogTitle>
            <DialogDescription className="text-sm text-gray-500 mt-1">
              Update the details below.
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-white">
          <form id="edit-product-form" onSubmit={handleSubmit} className="grid gap-6">
            
            {/* Image */}
            <div className="flex items-center gap-5 p-4 border border-gray-300 rounded-lg bg-gray-50">
              <div className="w-20 h-20 bg-white rounded-md border border-gray-300 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-gray-400 text-xs font-medium">No Img</span>
                )}
              </div>
              <div>
                <Label className="block text-sm font-semibold text-gray-900 mb-2">Product Image</Label>
                <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm text-gray-700">
                  <Upload size={16} /> 
                  <span>Change Image</span>
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                </label>
              </div>
            </div>

            {/* Inputs */}
            <div className="grid grid-cols-2 gap-5">
              <div className="col-span-2 space-y-1.5">
                <Label htmlFor="dishName" className="text-sm font-semibold text-gray-700">Dish Name <span className="text-red-500">*</span></Label>
                <Input id="dishName" name="dishName" value={formData.dishName} onChange={handleInputChange} required className="bg-white border border-gray-300 h-10" />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="category-select" className="text-sm font-semibold text-gray-700">Category</Label>
                <div className="relative">
                  <select 
                    id="category-select"
                    value={formData.category} 
                    onChange={handleSelectChange}
                    className="flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50 appearance-none cursor-pointer"
                  >
                    <option value="" disabled>Select Category</option>
                    {(categories || []).map((cat) => (
                      <option key={cat._id || cat.id} value={cat._id || cat.id}>
                        {cat.displayName || cat.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-gray-500 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm font-semibold text-gray-700">Stock</Label>
                <Input type="number" name="stock" value={formData.stock} onChange={handleInputChange} className="bg-white border border-gray-300 h-10" />
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm font-semibold text-gray-700">Volume</Label>
                <Input name="volume" value={formData.volume} onChange={handleInputChange} placeholder="e.g. 200ml" className="bg-white border border-gray-300 h-10" />
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm font-semibold text-gray-700">Price (₹)</Label>
                <Input type="number" name="price" value={formData.price} onChange={handleInputChange} className="bg-white border border-gray-300 h-10" />
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm font-semibold text-gray-700">Cost (₹)</Label>
                <Input type="number" name="cost" value={formData.cost} onChange={handleInputChange} className="bg-white border border-gray-300 h-10" />
              </div>
              
              <div className="space-y-1.5">
                <Label className="text-sm font-semibold text-gray-700">Original Price</Label>
                <Input type="number" name="originalPrice" value={formData.originalPrice} onChange={handleInputChange} className="bg-white border border-gray-300 h-10" />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-semibold text-gray-700">Description</Label>
              <Textarea name="description" value={formData.description} onChange={handleInputChange} rows={3} className="bg-white resize-none border border-gray-300" />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
                <CustomToggle label="Available" checked={formData.availableForOrder} onChange={(c) => setFormData({...formData, availableForOrder: c})} activeColor="bg-green-500" icon={Check} />
                <CustomToggle label="VIP Only" checked={formData.isVIP} onChange={(c) => setFormData({...formData, isVIP: c})} activeColor="bg-purple-500" icon={Plus} />
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 flex-shrink-0 z-10">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="h-10 px-5 text-gray-700 border-gray-300 bg-white hover:bg-gray-100 font-medium">
            Cancel
          </Button>
          
          <button
            type="submit"
            form="edit-product-form"
            disabled={loading}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-6 py-2 bg-red-600 text-white hover:bg-red-700 shadow-sm"
            style={{ backgroundColor: '#dc2626', color: 'white' }} 
          >
            {loading && <Loader className="animate-spin h-4 w-4 mr-2" />}
            Save Changes
          </button>
        </div>

      </DialogContent>
    </Dialog>
  );
}

export default EditModal;