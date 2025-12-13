import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { toast } from 'sonner@2.0.3';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { AddVariantModal } from '../components/modals/AddVariantModal';
import { useApiProducts } from '../lib/hooks/useApiProducts';

export function ProductVariants() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const { products, addVariantToProduct, deleteVariant } = useApiProducts({ page: 1, limit: 1000 });

  useEffect(() => {
    if (products && products.length > 0) {
      const found = products.find(p => p.id === id);
      if (found) {
        setProduct(found);
        setVariants(found.availableQuantities || []);
      }
      setLoading(false);
    }
  }, [products, id]);

  const handleAddVariant = async (variantData) => {
    try {
      await addVariantToProduct(id, variantData);
      toast.success('Variant added successfully');
      setIsAddModalOpen(false);
      
      // Force refresh the current product's variants
      setTimeout(() => {
        if (products && products.length > 0) {
          const found = products.find(p => p.id === id);
          if (found) {
            setProduct(found);
            setVariants(found.availableQuantities || []);
          }
        }
      }, 500); // Small delay to ensure API has processed
    } catch (error) {
      console.error('Error adding variant:', error);
      toast.error(error.message || 'Failed to add variant');
    }
  };

  const handleDeleteVariant = async (variantId) => {
    if (!confirm('Are you sure you want to delete this variant?')) return;
    try {
      await deleteVariant(id, variantId);
      toast.success('Variant deleted successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete variant');
    }
  };

  if (loading) return <div className="p-8 text-center text-muted-foreground">Loading...</div>;
  if (!product) return <div className="p-8 text-center text-muted-foreground">Product not found.</div>;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/products')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Manage Variants</h1>
            <p className="text-muted-foreground">For product: <span className="font-semibold">{product.name}</span></p>
          </div>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" /> Add Variant
        </Button>
      </div>

      {/* Variants Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Label</TableHead>
              <TableHead>Value/Unit</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {variants.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                  No variants found for this product.
                </TableCell>
              </TableRow>
            ) : (
              variants.map((variant, index) => (
                <TableRow key={variant._id || index}>
                  <TableCell>
                    <div className="h-12 w-12 rounded-lg border overflow-hidden bg-gray-50">
                      <ImageWithFallback src={variant.image} alt={variant.label} className="h-full w-full object-cover product-image" />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{variant.label}</TableCell>
                  <TableCell>{variant.value} {variant.unit}</TableCell>
                  <TableCell>₹{Number(variant.price).toFixed(2)}</TableCell>
                  <TableCell>
                    <span className={Number(variant.stock) > 0 ? 'text-green-600' : 'text-red-600 font-medium'}>
                      {variant.stock}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteVariant(variant._id || index)} className="text-red-500 hover:bg-red-50">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      <AddVariantModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddVariant}
        productName={product.name}
      />
    </div>
  );
}
