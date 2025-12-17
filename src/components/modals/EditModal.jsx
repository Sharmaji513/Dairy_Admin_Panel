import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

export function EditModal({ open, onOpenChange, onSave, title, data, fields }) {
  const [formData, setFormData] = useState({});
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    if (open && data) {
      const categoryId =
        data.category && typeof data.category === 'object'
          ? data.category._id || data.category.id || data.category
          : data.category;

      setFormData({ ...data, category: categoryId });
      setImagePreview(data.image || '');
    } else if (!open) {
      setFormData({});
      setImagePreview('');
    }
  }, [open, data]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedData = { ...data, ...formData };
    
    // Ensure numbers are actually numbers
    fields.forEach(field => {
        if(field.type === 'number' && updatedData[field.key]) {
            updatedData[field.key] = Number(updatedData[field.key]);
        }
    });

    if (!(formData.image instanceof File)) {
      delete updatedData.image;
    }

    onSave(updatedData);
  };

  const handleImageChange = (file) => {
    if (file) {
      setFormData({ ...formData, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleFieldChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  const isHalfWidth = (field) => {
    const key = field.key.toLowerCase();
    return (
      field.type === 'number' || 
      key.includes('price') || 
      key.includes('cost') || 
      key.includes('stock') ||
      key.includes('volume')
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* ✨ FIX: Added p-1 to outer container to prevent focus ring clipping */}
      <DialogContent className="sm:max-w-[600px] w-[95vw] max-h-[90vh] p-0 flex flex-col bg-white rounded-xl shadow-2xl my-4">
        
        {/* Header */}
        <div className="px-8 py-5 border-b bg-gray-50/80 backdrop-blur-sm flex-shrink-0 z-10 rounded-t-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900 tracking-tight">{title}</DialogTitle>
            <DialogDescription className="text-sm text-gray-500 mt-1">
              Update the product details below.
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Scrollable Form Body */}
        <div className="flex-1 overflow-y-auto p-8">
          <form id="edit-form" onSubmit={handleSubmit} className="grid grid-cols-2 gap-x-6 gap-y-6">
            {fields.map((field) => {
              const half = isHalfWidth(field);
              
              return (
                <div 
                  key={field.key} 
                  className={half ? 'col-span-1' : 'col-span-2'}
                >
                  <Label htmlFor={field.key} className="text-sm font-semibold text-gray-700 mb-2 block">
                    {field.label}
                  </Label>

                  {field.type === 'select' ? (
                    <Select
                      value={formData[field.key]?.toString() || ''}
                      onValueChange={(value) => handleFieldChange(field.key, value)}
                    >
                      <SelectTrigger className="w-full h-10 text-sm border-gray-300 focus:ring-red-500 focus:border-red-500">
                        <SelectValue placeholder={`Select ${field.label}`} />
                      </SelectTrigger>
                      <SelectContent>
                        {field.options?.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : field.type === 'file' ? (
                    <div className="flex items-center gap-5 p-4 border border-dashed border-gray-300 rounded-lg bg-gray-50/50 hover:bg-gray-50 transition-colors">
                      {imagePreview ? (
                        <div className="h-20 w-20 bg-white rounded-lg border shadow-sm flex-shrink-0 overflow-hidden relative">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="h-20 w-20 bg-gray-100 rounded-lg flex items-center justify-center text-xs text-gray-400 font-medium border border-gray-200">
                          No Image
                        </div>
                      )}
                      <div className="flex-1 space-y-2">
                         <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => e.target.files?.[0] && handleImageChange(e.target.files[0])}
                          className="cursor-pointer text-sm h-10 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
                        />
                        <p className="text-[11px] text-gray-400">Supported: JPG, PNG, WEBP (Max 5MB)</p>
                      </div>
                    </div>
                  ) : (
                    <Input
                      id={field.key}
                      type={field.type === 'number' ? 'number' : 'text'}
                      value={formData[field.key] ?? ''}
                      onChange={(e) =>
                        handleFieldChange(
                          field.key,
                          field.type === 'number' ? Number(e.target.value) || 0 : e.target.value
                        )
                      }
                      placeholder={field.label}
                      className="w-full h-10 text-sm border-gray-300 focus:ring-red-500 focus:border-red-500"
                    />
                  )}
                </div>
              );
            })}
          </form>
        </div>

        {/* Footer */}
        <div className="px-8 py-5 border-t bg-gray-50 flex justify-end gap-3 flex-shrink-0 rounded-b-xl">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="h-10 px-5 text-gray-700">
            Cancel
          </Button>
          <Button type="submit" form="edit-form" className="bg-red-500 hover:bg-red-600 text-white h-10 px-8 font-medium shadow-sm transition-all hover:shadow-md">
            Save Changes
          </Button>
        </div>

      </DialogContent>
    </Dialog>
  );
}