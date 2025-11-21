import { useState, useRef } from 'react';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';

export function AddProductModal({ open, onClose, onAdd }) {
  const fileInputRef = useRef(null);
  const [imagePreview, setImagePreview] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    stock: '', // ✨ Added Stock field
    description: '',
    imageFile: null,
    availableForOrder: true,
    vegetarian: false,
    // Removed: cost, preparationTime, calories
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    // For price and stock, allow only numbers and decimals, but store as string
    if (name === 'price' || name === 'stock') {
      if (value === '' || /^\d*\.?\d*$/.test(value)) {
        setFormData({ ...formData, [name]: value });
      }
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? e.target.checked : value,
      });
    }
  };

  const handleSwitchChange = (name) => (checked) => {
    setFormData({ ...formData, [name]: checked });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, imageFile: file }));
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const triggerImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = () => {
    // Validate required fields
    if (!formData.name || !formData.category || !formData.price || !formData.stock) {
      alert("Please fill in all required fields (Name, Category, Price, Stock).");
      return;
    }

    const newProduct = {
      name: formData.name,
      category: formData.category,
      price: parseFloat(formData.price) || 0,
      stock: parseInt(formData.stock) || 0, // ✨ Parse stock as an integer
      description: formData.description,
      availableForOrder: formData.availableForOrder,
      vegetarian: formData.vegetarian,
      imageFile: formData.imageFile,
    };
    
    onAdd(newProduct);
    onClose();
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      price: '',
      stock: '',
      description: '',
      imageFile: null,
      availableForOrder: true,
      vegetarian: false,
    });
    setImagePreview('');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Add New Product</DialogTitle>
            <DialogDescription className="sr-only">
              Fill in the details to create a new product.
            </DialogDescription>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-6 py-4">
          {/* Left Column - Image Upload */}
          <div>
            <Label>Product Image</Label>
            <div 
              className={`mt-2 border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors h-[300px] flex flex-col items-center justify-center ${
                imagePreview ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
              }`}
              onClick={triggerImageUpload}
            >
              {imagePreview ? (
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="h-full w-full object-contain rounded-lg" 
                />
              ) : (
                <>
                  <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                    <Upload className="h-6 w-6 text-gray-400" />
                  </div>
                  <p className="text-sm font-medium">Click to upload image</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    SVG, PNG, JPG or GIF (max. 2MB)
                  </p>
                </>
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
            />
          </div>

          {/* Right Column - Product Details */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Chicken Biryani"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Dairy">Dairy</SelectItem>
                  <SelectItem value="Beverages">Beverages</SelectItem>
                  <SelectItem value="Cookies">Cookies</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price (₹) *</Label>
                <Input
                  id="price"
                  name="price"
                  type="text" // ✨ Changed from 'number' to 'text' to remove arrows
                  inputMode="decimal" // Helps on mobile keyboards
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">Stock *</Label> {/* ✨ Added Stock field */}
                <Input
                  id="stock"
                  name="stock"
                  type="text"
                  inputMode="numeric"
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="e.g., 50"
                />
              </div>
            </div>

            {/* Removed Cost, Preparation Time, Calories fields */}

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter product description..."
                className="h-20"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="flex items-center justify-between border p-3 rounded-lg">
                <Label htmlFor="availableForOrder" className="cursor-pointer">Available</Label>
                <Switch
                  id="availableForOrder"
                  checked={formData.availableForOrder}
                  onCheckedChange={handleSwitchChange('availableForOrder')}
                />
              </div>
              <div className="flex items-center justify-between border p-3 rounded-lg">
                <Label htmlFor="vegetarian" className="cursor-pointer">Vegetarian</Label>
                <Switch
                  id="vegetarian"
                  checked={formData.vegetarian}
                  onCheckedChange={handleSwitchChange('vegetarian')}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Add Product
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}