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

    // Merge original data with edited values to preserve all fields
    const updatedData = {
      ...data,
      ...formData,
    };

    // Remove image from payload if no new file was uploaded
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[100px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>Make changes to the product. Click save when you're done.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-5 py-4">
          {fields.map((field) => (
            <div key={field.key} className="grid gap-2">
              <Label htmlFor={field.key}>{field.label}</Label>

              {field.type === 'select' ? (
                <Select
                  value={formData[field.key]?.toString() || ''}
                  onValueChange={(value) => handleFieldChange(field.key, value)}
                >
                  <SelectTrigger>
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
                <div className="space-y-3">
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Product preview"
                      className="w-12 h-12 object-cover "
                    />
                  )}
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && handleImageChange(e.target.files[0])}
                    className='w-full h-12 object-contain  '
                  />
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
                />
              )}
            </div>
          ))}

          <div className="flex justify-end gap-3 mt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Save changes</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}