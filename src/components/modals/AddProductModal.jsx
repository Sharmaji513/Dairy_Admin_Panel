import { useState, useEffect } from 'react';
import { Upload, Plus, Trash2 } from 'lucide-react'; // Added Trash2
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';
import { toast } from 'sonner@2.0.3';


// ✨ NEW: Component for a single variant row
function VariantRow({ index, variant, onChange, onRemove }) {
  return (
    <div className="grid grid-cols-5 gap-2 items-end border p-3 rounded-lg mb-2 bg-gray-50">
      <div className="space-y-1 col-span-2">
        <Label className="text-xs">Label (e.g. Small)</Label>
        <Input 
          value={variant.label} 
          onChange={(e) => onChange(index, 'label', e.target.value)} 
          placeholder="Small" 
          className="h-8 text-xs" 
        />
      </div>
      <div className="space-y-1">
        <Label className="text-xs">Value</Label>
        <Input 
          type="number" 
          value={variant.value} 
          onChange={(e) => onChange(index, 'value', e.target.value)} 
          placeholder="500" 
          className="h-8 text-xs" 
        />
      </div>
      <div className="space-y-1">
        <Label className="text-xs">Unit</Label>
        <Select 
          value={variant.unit} 
          onValueChange={(val) => onChange(index, 'unit', val)}
        >
          <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ml">ml</SelectItem>
            <SelectItem value="kg">kg</SelectItem>
            <SelectItem value="gm">gm</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1">
        <Label className="text-xs">Stock</Label>
        <Input 
          type="number" 
          value={variant.stock} 
          onChange={(e) => onChange(index, 'stock', e.target.value)} 
          placeholder="0" 
          className="h-8 text-xs" 
        />
      </div>
      <div className="space-y-1 col-span-2">
         <Label className="text-xs">Price (₹)</Label>
         <Input 
          type="number" 
          value={variant.price} 
          onChange={(e) => onChange(index, 'price', e.target.value)} 
          placeholder="0" 
          className="h-8 text-xs" 
        />
      </div>
       <div className="col-span-5 flex justify-end">
         <Button variant="ghost" size="sm" onClick={() => onRemove(index)} className="text-red-500 h-6 px-2"><Trash2 className="h-3 w-3 mr-1"/> Remove</Button>
       </div>
    </div>
  );
}

export function AddProductModal({ open, onClose, onAdd, categories = [] }) {
  // ✨ NEW: State for variants
  const [variants, setVariants] = useState([
    { label: 'Standard', value: '', unit: 'gm', price: '', stock: '' }
  ]);

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    imageFile: null,
    availableForOrder: true,
    vegetarian: false,
  });
  
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) {
      // Reset form
      setFormData({ name: '', category: '', description: '', imageFile: null, availableForOrder: true, vegetarian: false });
      setVariants([{ label: 'Standard', value: '', unit: 'gm', price: '', stock: '' }]);
      setImagePreview('');
    }
  }, [open]);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Store the file for the API
      setFormData(prev => ({ ...prev, imageFile: file }));
      // Show local preview immediately
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // ✨ NEW: Variant Handlers
  const handleVariantChange = (index, field, value) => {
    const newVariants = [...variants];
    newVariants[index][field] = value;
    setVariants(newVariants);
  };

  const addVariant = () => {
    setVariants([...variants, { label: '', value: '', unit: 'gm', price: '', stock: '' }]);
  };

  const removeVariant = (index) => {
    setVariants(variants.filter((_, i) => i !== index));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.category) {
      toast.error("Name and Category are required");
      return;
    }
    
    // Validate variants
    if (variants.length === 0 || variants.some(v => !v.label || !v.value || !v.price || !v.stock)) {
        toast.error("Please fill in all fields for at least one variant");
        return;
    }

    setLoading(true);
    try {
      // Combine form data with variants
      await onAdd({ ...formData, variants });
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
            {/* ... (Image Upload Section remains same) ... */}
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 relative overflow-hidden">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-contain" />
                ) : (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-4 text-gray-500" />
                    <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> image</p>
                  </div>
                )}
                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
              </label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Product Name *</Label>
                <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Butter Chicken" />
              </div>

              <div className="space-y-2">
                <Label>Category *</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat._id || cat.id} value={cat._id || cat.id}>
                        {cat.displayName || cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* ✨ NEW: Variants Section */}
            <div className="space-y-2 border-t pt-2">
               <div className="flex justify-between items-center">
                 <Label>Variants & Pricing *</Label>
                 <Button type="button" variant="outline" size="sm" onClick={addVariant} className="h-7 text-xs"><Plus className="h-3 w-3 mr-1"/> Add Variant</Button>
               </div>
               {variants.map((variant, index) => (
                 <VariantRow 
                   key={index} 
                   index={index} 
                   variant={variant} 
                   onChange={handleVariantChange} 
                   onRemove={removeVariant} 
                 />
               ))}
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Product details..." />
            </div>

            <div className="flex gap-4">
              <div className="flex items-center space-x-2 border p-3 rounded w-full">
                <Switch checked={formData.availableForOrder} onCheckedChange={(c) => setFormData({...formData, availableForOrder: c})} />
                <Label>Available</Label>
              </div>
              <div className="flex items-center space-x-2 border p-3 rounded w-full">
                <Switch checked={formData.vegetarian} onCheckedChange={(c) => setFormData({...formData, vegetarian: c})} />
                <Label>Veg</Label>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Adding...' : 'Add Product'}
            </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}