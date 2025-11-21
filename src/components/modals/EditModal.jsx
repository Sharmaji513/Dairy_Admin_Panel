import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Slider } from '../ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'; // ✨ Added Imports

export function EditModal({
  open,
  onOpenChange,
  onSave,
  title,
  data,
  fields,
}) {
  const [formData, setFormData] = useState(data || {});

  useEffect(() => {
    if (data) {
      setFormData(data);
    }
  }, [data]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Make changes to the item here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          {fields.map((field) => (
            <div key={field.key} className="grid gap-2">
              <Label htmlFor={field.key}>{field.label}</Label>
              
              {/* ✨ Handle Slider Inputs */}
              {field.type === 'slider' ? (
                <div className="flex items-center gap-4">
                  <Slider
                    value={[Number(formData[field.key]) || 0]}
                    min={field.min}
                    max={field.max}
                    step={field.step}
                    onValueChange={([value]) => setFormData({ ...formData, [field.key]: value })}
                    className="flex-1"
                  />
                  <span className="w-12 text-sm text-right">{formData[field.key]}</span>
                </div>
              ) : field.type === 'select' ? ( 
                /* ✨ Handle Select/Dropdown Inputs (NEW) */
                <Select 
                  value={formData[field.key]} 
                  onValueChange={(value) => setFormData({ ...formData, [field.key]: value })}
                >
                  <SelectTrigger id={field.key}>
                    <SelectValue placeholder={`Select ${field.label}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options?.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                /* ✨ Handle Standard Text/Number Inputs */
                <Input
                  id={field.key}
                  type={field.type}
                  value={formData[field.key] || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      [field.key]:
                        field.type === 'number'
                          ? parseFloat(e.target.value)
                          : e.target.value,
                    })
                  }
                />
              )}
            </div>
          ))}
          <div className="flex justify-end gap-3 mt-4">
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