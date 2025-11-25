import { useState } from 'react';
import { Search, Plus, Edit2, Trash2, FolderOpen } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card } from '../components/ui/card';
// ✨ FIX: Corrected import paths (added 'components')
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { useApiCategories } from '../lib/hooks/useApiCategories';
import { categoryService } from '../lib/api/services/categoryService';
import { showSuccessToast } from '../lib/toast';
import { toast } from 'sonner@2.0.3';

export function CategoryManagement() {
  const { categories, loading, refetch } = useApiCategories();
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({ name: '', displayName: '', description: '' });

  const filteredCategories = categories.filter(c => 
    (c.displayName || c.name).toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({ 
        name: category.name, 
        displayName: category.displayName || category.name,
        description: category.description || ''
      });
    } else {
      setEditingCategory(null);
      setFormData({ name: '', displayName: '', description: '' });
    }
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      if (editingCategory) {
        // Update logic (assuming update endpoint exists)
        // For now, standard create/update pattern
        toast.info("Update feature pending backend support");
      } else {
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
    if(confirm("Delete this category?")) {
       try {
         // toast.info("Delete feature pending backend support");
         // If you have a delete endpoint:
         // await categoryService.deleteCategory(id);
         // refetch();
         toast.info("Delete feature pending backend support");
       } catch(err) {
         toast.error("Failed to delete");
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {loading ? <p>Loading...</p> : filteredCategories.map(cat => (
            <Card key={cat._id || cat.id} className="p-4 flex items-center justify-between hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                  <FolderOpen className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium">{cat.displayName || cat.name}</h3>
                  <p className="text-xs text-gray-500">{cat.name}</p>
                </div>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" onClick={() => handleOpenModal(cat)}>
                  <Edit2 className="h-4 w-4 text-gray-500" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(cat._id || cat.id)}>
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </Card>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCategory ? 'Edit Category' : 'New Category'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Display Name (Visible to users)</Label>
              <Input 
                value={formData.displayName} 
                onChange={(e) => setFormData({...formData, displayName: e.target.value})} 
                placeholder="e.g. Fresh Milk"
              />
            </div>
            <div className="space-y-2">
              <Label>Internal Name (Unique ID)</Label>
              <Input 
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})} 
                placeholder="e.g. milk"
                disabled={!!editingCategory} 
              />
            </div>
             <div className="space-y-2">
              <Label>Description</Label>
              <Input 
                value={formData.description} 
                onChange={(e) => setFormData({...formData, description: e.target.value})} 
                placeholder="Category description..."
              />
            </div>
            <Button onClick={handleSubmit} className="w-full">Save Category</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}