import { useState, useRef } from 'react';
import { Search, Plus, Edit2, Trash2, FolderOpen, Upload, Image as ImageIcon, Check, Power } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card } from '../components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { useApiCategories } from '../lib/hooks/useApiCategories';
import { categoryService } from '../lib/api/services/categoryService';
import { showSuccessToast } from '../lib/toast';
import { toast } from 'sonner@2.0.3';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

// Reusing CustomToggle logic locally
function CustomToggle({ label, checked, onChange, activeColor = "bg-green-500" }) {
  return (
    <div 
      onClick={() => onChange(!checked)}
      className={`
        flex items-center justify-between w-full p-3 rounded-lg border cursor-pointer transition-all duration-200
        ${checked ? `border-${activeColor.split('-')[1]}-200 bg-${activeColor.split('-')[1]}-50` : 'border-gray-200 bg-white hover:bg-gray-50'}
      `}
    >
      <div className="flex items-center gap-3">
        <div className={`
          h-10 w-10 rounded-full flex items-center justify-center transition-colors
          ${checked ? `bg-white text-${activeColor.split('-')[1]}-600 shadow-sm` : 'bg-gray-100 text-gray-400'}
        `}>
          {checked ? <Check className="h-5 w-5" /> : <Power className="h-5 w-5" />}
        </div>
        <span className={`text-sm font-medium ${checked ? 'text-gray-900' : 'text-gray-500'}`}>
          {label}
        </span>
      </div>
      
      <div className={`
        w-11 h-6 rounded-full transition-colors relative
        ${checked ? activeColor : 'bg-gray-300'}
      `}>
        <div className={`
          absolute top-1 left-1 bg-white w-4 h-4 rounded-full shadow transition-transform duration-200
          ${checked ? 'translate-x-5' : 'translate-x-0'}
        `} />
      </div>
    </div>
  );
}

export function CategoryManagement() {
  const { categories, loading, refetch } = useApiCategories();
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({ 
    name: '', 
    displayName: '', 
    description: '', 
    icon: '', 
    imageFile: null, 
    imagePreview: '',
    isActive: true 
  });

  const filteredCategories = categories.filter(c => 
    (c.displayName || c.name).toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({ 
        name: category.name, 
        displayName: category.displayName || category.name,
        description: category.description || '',
        icon: category.icon || '',
        imageFile: null,
        imagePreview: category.image || '', 
        isActive: category.isActive ?? true
      });
    } else {
      setEditingCategory(null);
      setFormData({ 
        name: '', 
        displayName: '', 
        description: '', 
        icon: '', 
        imageFile: null, 
        imagePreview: '',
        isActive: true 
      });
    }
    setModalOpen(true);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, imageFile: file }));
      const reader = new FileReader();
      reader.onloadend = () => setFormData(prev => ({ ...prev, imagePreview: reader.result }));
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.displayName) {
       toast.error("Name and Display Name are required");
       return;
    }
    try {
      if (editingCategory) {
        await categoryService.updateCategory(editingCategory._id || editingCategory.id, formData);
        showSuccessToast('Category updated successfully!');
      } else {
        if (!formData.imageFile && !formData.imagePreview) {
             toast.error("Image is required for new categories");
             return;
        }
        await categoryService.createCategory(formData);
        showSuccessToast('Category created successfully!');
      }
      setModalOpen(false);
      refetch();
    } catch (err) {
      toast.error(err.message || "Failed to save category");
    }
  };

  const handleDelete = async (id) => {
    if(confirm("Are you sure you want to delete this category?")) {
       try {
         await categoryService.deleteCategory(id);
         showSuccessToast('Category deleted');
         refetch();
       } catch(err) {
         toast.error("Failed to delete category");
       }
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Category Management</h1>
        <Button onClick={() => handleOpenModal()} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" /> Add Category
        </Button>
      </div>

      <Card className="p-6">
        <div className="mb-6 relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search categories..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? <p>Loading...</p> : filteredCategories.map(cat => (
            <Card key={cat._id || cat.id} className="p-4 flex items-center justify-between hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-4">
                {/* ✨ LARGER IMAGE */}
                <div className="h-20 w-20 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden border shadow-sm">
                  {cat.image ? (
                     <ImageWithFallback 
                        src={cat.image} 
                        alt={cat.name} 
                        className="w-full h-full object-cover product-image"
                     />
                  ) : (
                     <FolderOpen className="h-8 w-8 text-blue-600" />
                  )}
                </div>
                
                <div>
                  <h3 className="font-bold text-lg">{cat.displayName || cat.name}</h3>
                  <p className="text-sm text-gray-500">{cat.productsCount || 0} Products</p>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Button variant="ghost" size="icon" onClick={() => handleOpenModal(cat)} className="hover:bg-blue-50 text-blue-600">
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(cat._id || cat.id)} className="hover:bg-red-50 text-red-600">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </Card>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-[500px] p-0 gap-0 overflow-hidden bg-white">
          <DialogHeader className="px-6 py-4 border-b bg-white">
            <DialogTitle>{editingCategory ? 'Edit Category' : 'New Category'}</DialogTitle>
          </DialogHeader>
          
          <div className="p-6 space-y-6">
            {/* Image Upload */}
            <div className="flex justify-center">
               <div 
                  className="h-32 w-32 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 overflow-hidden relative transition-colors"
                  onClick={() => fileInputRef.current?.click()}
               >
                  {formData.imagePreview ? (
                    <img src={formData.imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <Upload className="h-8 w-8 text-gray-400 mb-2" />
                      <span className="text-xs text-gray-500 font-medium">Click to Upload</span>
                    </>
                  )}
               </div>
               <input type="file" ref={fileInputRef} className="hidden" onChange={handleImageUpload} accept="image/*" />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Display Name *</Label>
                    <Input 
                        value={formData.displayName} 
                        onChange={(e) => setFormData({...formData, displayName: e.target.value})} 
                        placeholder="e.g. Fresh Milk"
                    />
                </div>
                <div className="space-y-2">
                    <Label>Internal Name *</Label>
                    <Input 
                        value={formData.name} 
                        onChange={(e) => setFormData({...formData, name: e.target.value})} 
                        placeholder="e.g. milk"
                        disabled={!!editingCategory} 
                    />
                </div>
            </div>
            
             <div className="space-y-2">
              <Label>Description</Label>
              <Input 
                value={formData.description} 
                onChange={(e) => setFormData({...formData, description: e.target.value})} 
                placeholder="Short description..."
              />
            </div>
            
            {/* ✨ NEW CUSTOM TOGGLE */}
            <CustomToggle 
              label={formData.isActive ? "Category is Active" : "Category is Inactive"} 
              checked={formData.isActive}
              onChange={(c) => setFormData({...formData, isActive: c})}
            />

            <Button onClick={handleSubmit} className="w-full bg-blue-600 hover:bg-blue-700 h-11">
                {editingCategory ? 'Update Category' : 'Create Category'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}