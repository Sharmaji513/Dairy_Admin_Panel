import { useState, useEffect, useRef } from 'react';
import { Upload, Plus, Trash2, Link as LinkIcon, X, ChevronDown, ChevronUp, Image as ImageIcon, Check, Power } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { toast } from 'sonner@2.0.3';
import { useNavigate } from 'react-router-dom';
import { categoryService } from '../../lib/api/services/categoryService';

// --- HELPER COMPONENTS ---

function CustomToggle({ label, checked, onChange, activeColor = "bg-green-500", icon: Icon = Check }) {
  return (
    <div 
      onClick={() => onChange(!checked)}
      className={`
        flex items-center justify-between w-full p-3 rounded-lg border cursor-pointer transition-all duration-200 select-none
        ${checked ? `border-${activeColor.split('-')[1]}-200 bg-${activeColor.split('-')[1]}-50` : 'border-gray-200 bg-white hover:bg-gray-50'}
      `}
    >
      <div className="flex items-center gap-3">
        <div className={`
          h-8 w-8 rounded-full flex items-center justify-center transition-colors flex-shrink-0
          ${checked ? `bg-white text-${activeColor.split('-')[1]}-600 shadow-sm` : 'bg-gray-100 text-gray-400'}
        `}>
          <Icon className="h-4 w-4" />
        </div>
        <span className={`text-xs font-medium ${checked ? 'text-gray-900' : 'text-gray-500'}`}>
          {label}
        </span>
      </div>
      
      <div className={`
        w-9 h-5 rounded-full transition-colors relative flex-shrink-0
        ${checked ? activeColor : 'bg-gray-300'}
      `}>
        <div className={`
          absolute top-1 left-1 bg-white w-3 h-3 rounded-full shadow transition-transform duration-200
          ${checked ? 'translate-x-4' : 'translate-x-0'}
        `} />
      </div>
    </div>
  );
}

function ImageInput({ label, imageData, onChange, className = "" }) {
  const [inputType, setInputType] = useState('file');
  const [urlInput, setUrlInput] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (imageData?.type === 'url') {
        setInputType('url');
        setUrlInput(imageData.value);
    }
  }, [imageData]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      onChange({ type: 'file', value: file, preview });
    }
  };

  const handleUrlChange = (e) => {
    const url = e.target.value;
    setUrlInput(url);
    if (url.match(/\.(jpeg|jpg|gif|png|webp)$/i)) {
      onChange({ type: 'url', value: url, preview: url });
    }
  };
  
  const handleUrlBlur = () => {
     if (urlInput) {
         onChange({ type: 'url', value: urlInput, preview: urlInput });
     }
  };

  const clearImage = () => {
    onChange(null);
    setUrlInput('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between mb-1">
        <Label className="text-xs font-semibold">{label}</Label>
        <div className="flex bg-gray-100 rounded-md p-0.5">
           <button 
             type="button"
             onClick={() => setInputType('file')}
             className={`px-2 py-0.5 text-[10px] rounded transition-all ${inputType === 'file' ? 'bg-white shadow text-blue-600 font-medium' : 'text-gray-500 hover:text-gray-700'}`}
           >
             Upload
           </button>
           <button 
             type="button"
             onClick={() => setInputType('url')}
             className={`px-2 py-0.5 text-[10px] rounded transition-all ${inputType === 'url' ? 'bg-white shadow text-blue-600 font-medium' : 'text-gray-500 hover:text-gray-700'}`}
           >
             Link
           </button>
        </div>
      </div>

      {imageData ? (
        <div className="relative w-full h-48 border rounded-lg overflow-hidden group bg-gray-50 z-0">
          <img src={imageData.preview} alt="Preview" className="w-full h-full object-contain" />
          <button
            type="button"
            onClick={clearImage}
            className="absolute top-2 right-2 p-1 bg-white/90 text-red-500 rounded-full hover:bg-red-50 shadow-sm border transition-opacity opacity-0 group-hover:opacity-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors relative overflow-hidden z-0">
          {inputType === 'file' ? (
            <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center p-4">
              <Upload className="w-8 h-8 mb-2 text-gray-400" />
              <p className="text-xs text-gray-500 font-medium text-center">Click to upload image</p>
              <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} ref={fileInputRef} />
            </label>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-4 gap-2">
              <LinkIcon className="w-8 h-8 text-gray-400" />
              <Input 
                placeholder="Paste image link here..." 
                value={urlInput}
                onChange={handleUrlChange}
                onBlur={handleUrlBlur}
                className="h-8 text-xs bg-white w-full max-w-[80%]"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function TagInput({ label, tags, onChange, placeholder }) {
    const [input, setInput] = useState('');
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            if (input.trim()) {
                onChange([...tags, input.trim()]);
                setInput('');
            }
        }
    };
    const removeTag = (index) => {
        onChange(tags.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-2">
            <Label className="text-xs font-semibold">{label}</Label>
            <div className="flex flex-wrap gap-2 border rounded-md p-2 bg-white min-h-[40px]">
                {tags.map((tag, i) => (
                    <span key={i} className="bg-blue-100 text-blue-800 text-[10px] px-2 py-1 rounded-full flex items-center">
                        {tag} <button type="button" onClick={() => removeTag(i)} className="ml-1"><X className="h-3 w-3"/></button>
                    </span>
                ))}
                <input 
                    className="flex-1 outline-none text-xs min-w-[60px]" 
                    value={input} 
                    onChange={e => setInput(e.target.value)} 
                    onKeyDown={handleKeyDown} 
                    placeholder={placeholder}
                />
            </div>
        </div>
    );
}

function VariantRow({ index, variant, onChange, onRemove, onImageChange }) {
  return (
    <div className="border p-4 rounded-xl mb-4 bg-white shadow-sm relative group">
       <Button 
         variant="ghost" 
         size="icon" 
         onClick={() => onRemove(index)} 
         className="absolute top-2 right-2 text-gray-400 hover:text-red-500 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity z-10"
       >
         <Trash2 className="h-4 w-4"/>
       </Button>

       <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-4">
             <ImageInput 
               label={`Variant Image`}
               imageData={variant.imageData}
               onChange={(data) => onImageChange(index, data)}
               className="h-32"
             />
          </div>

          <div className="md:col-span-8 grid grid-cols-2 gap-4 content-start">
              <div className="space-y-1 col-span-2">
                <Label className="text-xs font-medium">Label <span className="text-red-500">*</span></Label>
                <Input value={variant.label} onChange={(e) => onChange(index, 'label', e.target.value)} placeholder="e.g. Family Pack" className="h-9 text-xs" />
              </div>
              
              <div className="space-y-1">
                <Label className="text-xs font-medium">Value <span className="text-red-500">*</span></Label>
                <Input type="number" value={variant.value} onChange={(e) => onChange(index, 'value', e.target.value)} placeholder="500" className="h-9 text-xs" />
              </div>
              
              <div className="space-y-1">
                <Label className="text-xs font-medium">Unit <span className="text-red-500">*</span></Label>
                <Select value={variant.unit} onValueChange={(val) => onChange(index, 'unit', val)}>
                  <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
                  {/* ✨ FIX: Z-Index 200 allows clicking above modal */}
                  <SelectContent className="z-[200]">
                    <SelectItem value="ml">ml</SelectItem>
                    <SelectItem value="kg">kg</SelectItem>
                    <SelectItem value="gm">gm</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-1">
                <Label className="text-xs font-medium">Stock <span className="text-red-500">*</span></Label>
                <Input type="number" value={variant.stock} onChange={(e) => onChange(index, 'stock', e.target.value)} placeholder="0" className="h-9 text-xs" />
              </div>
              
              <div className="space-y-1">
                 <Label className="text-xs font-medium">Price (₹) <span className="text-red-500">*</span></Label>
                 <Input type="number" value={variant.price} onChange={(e) => onChange(index, 'price', e.target.value)} placeholder="0" className="h-9 text-xs font-medium" />
              </div>
          </div>
       </div>
    </div>
  );
}

export function AddProductModal({ open, onClose, onAdd, categories = [], onCategoryCreate }) {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '', category: '', price: '', originalPrice: '', cost: '', stock: '', volume: '',
    discountPercent: '', isVIP: false, description: '', mainImage: null, 
    availableForOrder: true, vegetarian: false, benefits: [], attributes: [],
  });

  const [variants, setVariants] = useState([]);
  const [variantsOpen, setVariantsOpen] = useState(false); // Closed by default
  const [loading, setLoading] = useState(false);
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  useEffect(() => {
    if (!open) {
      setFormData({ name: '', category: '', price: '', originalPrice: '', cost: '', stock: '', volume: '', discountPercent: '', isVIP: false, description: '', mainImage: null, availableForOrder: true, vegetarian: false, benefits: [], attributes: [] });
      setVariants([]);
      setVariantsOpen(false);
    }
  }, [open]);

  const handleMainImageChange = (data) => setFormData(prev => ({ ...prev, mainImage: data }));
  const handleVariantChange = (index, field, value) => { const newVariants = [...variants]; newVariants[index][field] = value; setVariants(newVariants); };
  const handleVariantImageChange = (index, data) => { const newVariants = [...variants]; newVariants[index].imageData = data; setVariants(newVariants); };
  
  const addVariant = () => {
    if (!variantsOpen) setVariantsOpen(true);
    setVariants([...variants, { label: '', value: '', unit: 'ml', price: '', stock: '', imageData: null }]);
  };
  const removeVariant = (index) => setVariants(variants.filter((_, i) => i !== index));

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) { toast.error("Category name cannot be empty"); return; }
    try {
      setLoading(true);
      const response = await categoryService.createCategory({ name: newCategoryName, displayName: newCategoryName });
      const newCategory = response.category || response.data;
      toast.success(`Category "${newCategory.name}" created!`);
      if (onCategoryCreate) onCategoryCreate();
      setFormData(prev => ({ ...prev, category: newCategory._id || newCategory.id }));
      setIsCreatingCategory(false);
      setNewCategoryName('');
    } catch (error) { toast.error("Failed to create category"); } finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.category || !formData.price || !formData.originalPrice || !formData.cost || !formData.stock || !formData.volume) {
      toast.error("Please fill in all mandatory fields (*)");
      return;
    }
    setLoading(true);
    try { await onAdd({ ...formData, variants }); onClose(); } catch (error) { } finally { setLoading(false); }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      {/* ✨ FIX: 'block' layout for reliable scrolling. z-[100] for modal. */}
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto bg-white border shadow-lg p-0 block z-[100]">
        
        <DialogHeader className="bg-white px-6 py-4 border-b sticky top-0 z-50">
          <DialogTitle className="text-xl font-bold text-gray-800">Add New Product</DialogTitle>
        </DialogHeader>

        <div className="p-6">
          {isCreatingCategory ? (
            <div className="space-y-4 py-4 border p-4 rounded-lg bg-white shadow-sm">
              <h3 className="font-medium text-sm">Create New Category</h3>
              <Input placeholder="Enter category name" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} />
              <div className="flex gap-2 justify-end">
                <Button variant="outline" size="sm" onClick={() => setIsCreatingCategory(false)}>Cancel</Button>
                <Button size="sm" onClick={handleCreateCategory} disabled={loading}>Create</Button>
              </div>
            </div>
          ) : (
            <form id="product-form" onSubmit={handleSubmit} className="space-y-6">
              
              {/* ✨ LAYOUT: Top Image */}
              <div className="w-full">
                  <ImageInput label="Product Image" imageData={formData.mainImage} onChange={handleMainImageChange} className="h-full" />
              </div>

              {/* Main Fields */}
              <div className="space-y-4 bg-white p-4 rounded-lg border shadow-sm">
                  <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1"><Label className="text-xs font-semibold">Product Name <span className="text-red-500">*</span></Label><Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Butter Chicken" className="h-9 text-xs" /></div>
                      <div className="space-y-1"><Label className="text-xs font-semibold">Category <span className="text-red-500">*</span></Label>
                          <Select value={formData.category} onValueChange={(value) => { if (value === 'create_new') navigate('/category-management?action=create'); else setFormData({ ...formData, category: value }); }}>
                          <SelectTrigger className="h-9 text-xs"><SelectValue placeholder="Select" /></SelectTrigger>
                          {/* ✨ FIX: Z-Index 200 for clickable dropdown */}
                          <SelectContent className="z-[200]">
                              {categories.map((cat) => (<SelectItem key={cat._id || cat.id} value={cat._id || cat.id}>{cat.displayName || cat.name}</SelectItem>))}
                              <SelectItem value="create_new" className="text-blue-600 border-t"><Plus className="h-3 w-3 inline mr-1"/> New Category</SelectItem>
                          </SelectContent>
                          </Select>
                      </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-1"><Label className="text-xs font-semibold">Price <span className="text-red-500">*</span></Label><Input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} placeholder="50" className="h-9 text-xs" /></div>
                      <div className="space-y-1"><Label className="text-xs font-semibold">Original Price <span className="text-red-500">*</span></Label><Input type="number" value={formData.originalPrice} onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })} placeholder="80" className="h-9 text-xs" /></div>
                      <div className="space-y-1"><Label className="text-xs font-semibold">Cost <span className="text-red-500">*</span></Label><Input type="number" value={formData.cost} onChange={(e) => setFormData({ ...formData, cost: e.target.value })} placeholder="10" className="h-9 text-xs" /></div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1"><Label className="text-xs font-semibold">Total Stock <span className="text-red-500">*</span></Label><Input type="number" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} placeholder="20" className="h-9 text-xs" /></div>
                      <div className="space-y-1"><Label className="text-xs font-semibold">Volume/Size <span className="text-red-500">*</span></Label><Input value={formData.volume} onChange={(e) => setFormData({ ...formData, volume: e.target.value })} placeholder="100 ml Bottle" className="h-9 text-xs" /></div>
                  </div>
              </div>

              {/* Desc & Tags */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1 bg-white p-4 rounded-lg border shadow-sm"><Label className="text-xs font-semibold">Description</Label><Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Product details..." className="text-xs min-h-[100px]" /></div>
                  <div className="space-y-4 bg-white p-4 rounded-lg border shadow-sm">
                      <TagInput label="Benefits (Optional)" tags={formData.benefits} onChange={(t) => setFormData({...formData, benefits: t})} placeholder="Add benefit + Enter" />
                      <TagInput label="Attributes (Optional)" tags={formData.attributes} onChange={(t) => setFormData({...formData, attributes: t})} placeholder="Add attribute + Enter" />
                  </div>
              </div>

              {/* Variants */}
              <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
                <div className="flex justify-between items-center p-3 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors border-b" onClick={() => setVariantsOpen(!variantsOpen)}>
                  <div className="flex items-center gap-2">{variantsOpen ? <ChevronUp className="h-4 w-4 text-gray-600"/> : <ChevronDown className="h-4 w-4 text-gray-600"/>}<Label className="text-sm font-bold cursor-pointer text-gray-700">Variants / Quantities</Label><span className="text-xs text-muted-foreground bg-white px-2 py-0.5 rounded-full border">{variants.length} added</span></div>
                  <Button type="button" variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); addVariant(); }} className="h-7 text-xs bg-white hover:bg-blue-50 text-blue-600 border-blue-200"><Plus className="h-3 w-3 mr-1"/> Add Variant</Button>
                </div>
                {variantsOpen && (
                  <div className="p-4 space-y-4 bg-gray-50/30">
                    {variants.length === 0 && <p className="text-xs text-center text-muted-foreground py-2">No variants added yet.</p>}
                    {variants.map((variant, index) => <VariantRow key={index} index={index} variant={variant} onChange={handleVariantChange} onRemove={removeVariant} onImageChange={handleVariantImageChange} />)}
                  </div>
                )}
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CustomToggle label="Available for Order" checked={formData.availableForOrder} onChange={(c) => setFormData({...formData, availableForOrder: c})} activeColor="bg-green-500" icon={Check} />
                <CustomToggle label="VIP Only Product" checked={formData.isVIP} onChange={(c) => setFormData({...formData, isVIP: c})} activeColor="bg-purple-500" icon={Plus} />
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t sticky bottom-0 z-10 flex justify-end gap-3">
            <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
            <Button type="submit" form="product-form" className="bg-blue-600 hover:bg-blue-700 text-white min-w-[150px]" disabled={loading}>{loading ? 'Saving...' : 'Save Product'}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}