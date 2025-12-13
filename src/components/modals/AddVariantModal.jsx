import { useState, useEffect, useRef } from 'react';
import { Upload, X, Link as LinkIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { ToggleGroup, ToggleGroupItem } from '../ui/toggle-group';

function ImageInput({ label, imageData, onChange, className = '' }) {
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
            className={`px-2 py-0.5 text-[10px] rounded transition-all ${
              inputType === 'file' ? 'bg-white shadow text-blue-600 font-medium' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Upload
          </button>
          <button
            type="button"
            onClick={() => setInputType('url')}
            className={`px-2 py-0.5 text-[10px] rounded transition-all ${
              inputType === 'url' ? 'bg-white shadow text-blue-600 font-medium' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Link
          </button>
        </div>
      </div>
      {imageData ? (
        <div className="relative w-full h-20 border rounded-lg overflow-hidden group bg-gray-50">
          <img 
            src={imageData.preview} 
            alt="Preview" 
            className="w-full h-full object-cover transition-all duration-300 ease-in-out hover:scale-105 pointer-events-none" 
            style={{ imageRendering: 'auto' }}
          />
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              clearImage();
            }}
            className="absolute top-2 right-2 z-30 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-lg border-2 border-white transition-all duration-200 hover:scale-110 cursor-pointer"
            style={{ pointerEvents: 'auto' }}
          >
            <X className="h-4 w-4" />
          </button>
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
        </div>
      ) : (
        <div className="w-full h-20 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors relative overflow-hidden z-0">
          {inputType === 'file' ? (
            <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center p-4">
              <Upload className="w-6 h-6 mb-2 text-gray-400" />
              <span className="text-xs text-gray-500 font-medium">Click to upload</span>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
                ref={fileInputRef}
              />
            </label>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-4 gap-2">
              <LinkIcon className="w-6 h-6 text-gray-400" />
              <Input
                placeholder="Paste link..."
                value={urlInput}
                onChange={handleUrlChange}
                className="h-8 text-xs bg-white w-full max-w-[80%]"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function AddVariantModal({ open, onClose, onAdd, productName }) {
  const [loading, setLoading] = useState(false);
  const [variantData, setVariantData] = useState({
    label: '',
    value: '',
    unit: 'ml',
    price: '',
    stock: '',
    imageData: null,
  });

  useEffect(() => {
    if (!open) {
      setVariantData({ label: '', value: '', unit: 'ml', price: '', stock: '', imageData: null });
    }
  }, [open]);

  const handleChange = (field, value) => {
    setVariantData((prev) => ({ ...prev, [field]: value }));
  };

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
      <DialogContent className="sm:max-w-[500px] bg-white p-0 block max-h-[85vh] overflow-hidden">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle>Add Variant for: {productName}</DialogTitle>
        </DialogHeader>

        <div className="max-h-[calc(85vh-80px)] overflow-y-auto px-6 py-4">
          <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {/* Image Section */}
            <div>
              <ImageInput
                label="Variant Image (Optional)"
                imageData={variantData.imageData}
                onChange={(data) => handleChange('imageData', data)}
                className="h-full"
              />
            </div>

            {/* Fields Section */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1 col-span-2">
                <Label className="text-xs font-medium">
                  Label <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={variantData.label}
                  onChange={(e) => handleChange('label', e.target.value)}
                  placeholder="e.g. Family Pack"
                  className="h-9 text-xs"
                  required
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-medium">
                  Value <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="number"
                  value={variantData.value}
                  onChange={(e) => handleChange('value', e.target.value)}
                  placeholder="500"
                  className="h-9 text-xs"
                  required
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-medium">
                  Unit <span className="text-red-500">*</span>
                </Label>
                <ToggleGroup 
                  type="single" 
                  value={variantData.unit} 
                  onValueChange={(value) => value && handleChange('unit', value)}
                  className="justify-start gap-1"
                >
                  <ToggleGroupItem value="ml" className="text-xs px-3 py-1 h-8 data-[state=on]:bg-blue-100 data-[state=on]:text-blue-700">
                    ml
                  </ToggleGroupItem>
                  <ToggleGroupItem value="litre" className="text-xs px-3 py-1 h-8 data-[state=on]:bg-blue-100 data-[state=on]:text-blue-700">
                    litre
                  </ToggleGroupItem>
                  <ToggleGroupItem value="gm" className="text-xs px-3 py-1 h-8 data-[state=on]:bg-blue-100 data-[state=on]:text-blue-700">
                    gm
                  </ToggleGroupItem>
                  <ToggleGroupItem value="kg" className="text-xs px-3 py-1 h-8 data-[state=on]:bg-blue-100 data-[state=on]:text-blue-700">
                    kg
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-medium">
                  Price (₹) <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="number"
                  value={variantData.price}
                  onChange={(e) => handleChange('price', e.target.value)}
                  placeholder="0"
                  className="h-9 text-xs font-medium"
                  required
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-medium">
                  Stock <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="number"
                  value={variantData.stock}
                  onChange={(e) => handleChange('stock', e.target.value)}
                  placeholder="0"
                  className="h-9 text-xs"
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={loading}>
              {loading ? 'Adding...' : 'Add Variant'}
            </Button>
          </div>
        </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
