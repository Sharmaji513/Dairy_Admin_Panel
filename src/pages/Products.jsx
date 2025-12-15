// Products.jsx - Full Final Code
import { useState, useMemo } from 'react';
import { Search, Plus, Filter, Edit2, Trash2, Package, CheckCircle, TrendingUp, Star, X, ChevronDown, Layers } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { AddProductModal } from '../components/modals/AddProductModal';
import { EditModal } from '../components/modals/EditModal';
import { DeleteConfirmationModal } from '../components/modals/DeleteConfirmationModal';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useApiProducts } from '../lib/hooks/useApiProducts';
import { useDashboardStats } from '../lib/hooks/useDashboardStats';
import { showSuccessToast } from '../lib/toast';
import { toast } from 'sonner@2.0.3';
import { useApiCategories } from '../lib/hooks/useApiCategories';
import { useNavigate } from 'react-router-dom';

export function Products() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const { categories } = useApiCategories();

  const {
    products: rawProducts = [],
    loading: productsLoading,
    error: productsError,
    total: totalProductsApi,
    createProduct,
    updateProduct,
    deleteProduct,
    refetch
  } = useApiProducts({
    search: searchQuery,
    category: selectedCategory,
    status: selectedStatus,
    page: 1,
    limit: 50
  });

  const { stats, loading: statsLoading } = useDashboardStats();

  const availableProductsCount = rawProducts.filter(p => p.inStock).length;
  const totalProducts = totalProductsApi || rawProducts.length || 0;
  const availableProducts = productsLoading ? '...' : availableProductsCount;
  const todaysRevenue = statsLoading ? '...' : (stats?.todaysRevenue?.toLocaleString() ?? 'N/A');
  const avgRating = statsLoading ? '...' : (stats?.avgRating ?? 'N/A');

  const validProducts = rawProducts.filter(p => p && typeof p === 'object');

  const filteredProducts = validProducts.filter(product => {
    const productName = product.name || '';
    const matchesSearch = productName.toLowerCase().includes(searchQuery.toLowerCase());

    const productCatName = (product.categoryName || '').toLowerCase().trim();

    const matchesCategory = selectedCategory === 'all' || productCatName === selectedCategory.toLowerCase().trim();

    let matchesStatus = true;
    if (selectedStatus === 'instock') matchesStatus = product.inStock;
    else if (selectedStatus === 'outofstock') matchesStatus = !product.inStock;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const nameA = (a.name || '').toLowerCase();
    const nameB = (b.name || '').toLowerCase();
    return nameA.localeCompare(nameB);
  });

  const handleUpdateProduct = async (updatedData) => {
    if (!selectedProduct) return;

    try {
      const payload = new FormData();

      if (updatedData.dishName !== undefined && updatedData.dishName !== selectedProduct.name) {
        payload.append('dishName', updatedData.dishName.trim());
      }
      if (updatedData.category !== undefined) {
        payload.append('category', updatedData.category);
      }
      if (updatedData.price !== undefined) {
        payload.append('price', updatedData.price);
      }
      if (updatedData.originalPrice !== undefined) {
        payload.append('originalPrice', updatedData.originalPrice);
      }
      if (updatedData.cost !== undefined) {
        payload.append('cost', updatedData.cost);
      }
      if (updatedData.stock !== undefined) {
        payload.append('stock', updatedData.stock);
      }
      if (updatedData.volume !== undefined) {
        payload.append('volume', updatedData.volume.trim());
      }
      if (updatedData.image instanceof File) {
        payload.append('image', updatedData.image);
      }

      if (payload.entries().next().done) {
        toast.info('No changes made');
        setEditModalOpen(false);
        return;
      }

      await updateProduct(selectedProduct.id, payload);

      showSuccessToast('Product updated successfully!');

      if (refetch) refetch();

      setEditModalOpen(false);
      setSelectedProduct(null);
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Failed to update product');
    }
  };

  const handleDeleteProduct = async () => {
    if (!selectedProduct) return;
    try {
      await deleteProduct(selectedProduct.id);
      showSuccessToast('Product deleted successfully!');
      if (refetch) refetch();
      setDeleteModalOpen(false);
      setSelectedProduct(null);
    } catch (err) {
      toast.error(err.message || 'Failed to delete product');
    }
  };

  const handleClearAllFilters = () => {
    setSelectedCategory('all');
    setSelectedStatus('all');
    setSearchQuery('');
  };

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <Card className="p-4 transition-all duration-200 hover:shadow-md">
          <div className="flex items-start justify-between">
            <div><p className="text-sm text-muted-foreground mb-1 font-bold">Total Products</p><h3 className="text-lg">{totalProducts}</h3></div>
            <div className="h-9 w-9 bg-blue-50 rounded-full flex items-center justify-center"><Package className="h-4 w-4 text-blue-500" /></div>
          </div>
        </Card>
        <Card className="p-4 transition-all duration-200 hover:shadow-md">
          <div className="flex items-start justify-between">
            <div><p className="text-sm text-muted-foreground mb-1 font-bold">Available</p><h3 className="text-lg">{availableProducts}</h3></div>
            <div className="h-9 w-9 rounded-full flex items-center justify-center" style={{ backgroundColor: '#e8f5e9' }}><CheckCircle className="h-4 w-4 text-green-600" /></div>
          </div>
        </Card>
        <Card className="p-4 transition-all duration-200 hover:shadow-md">
          <div className="flex items-start justify-between">
            <div><p className="text-sm text-muted-foreground mb-1 font-bold">Today's Revenue</p><h3 className="text-lg">₹{todaysRevenue}</h3></div>
            <div className="h-9 w-9 bg-purple-50 rounded-full flex items-center justify-center"><TrendingUp className="h-4 w-4 text-purple-500" /></div>
          </div>
        </Card>
        <Card className="p-4 transition-all duration-200 hover:shadow-md">
          <div className="flex items-start justify-between">
            <div><p className="text-sm text-muted-foreground mb-1 font-bold">Avg Rating</p><h3 className="text-lg">{avgRating}</h3></div>
            <div className="h-9 w-9 bg-yellow-50 rounded-full flex items-center justify-center"><Star className="h-4 w-4 text-yellow-500" /></div>
          </div>
        </Card>
      </div>

      <Card className="p-6 bg-gray-50/50 border-none shadow-none">
        <div className="space-y-4 mb-6">
          <div className="flex items-center gap-4 bg-white p-4 rounded-lg border shadow-sm">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search products..." className="pl-10 border border-gray-300" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}/>
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48 border border-gray-300"><SelectValue placeholder="All Categories" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat._id || cat.id} value={(cat.name || '').toLowerCase()}>
                    {cat.displayName || cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-40 border border-gray-300"><SelectValue placeholder="All Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="instock">In Stock</SelectItem>
                <SelectItem value="outofstock">Out of Stock</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => setMoreDropdownOpen(!moreDropdownOpen)} className="gap-2 border border-gray-300">
              <Filter className="h-4 w-4" /> More <ChevronDown className="h-4 w-4" />
            </Button>
            <Button className="bg-red-500 hover:bg-red-600 border border-red-500" onClick={() => setAddModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" /> Add Product
            </Button>
          </div>

          {moreDropdownOpen && (
            <div className="flex items-center gap-2 flex-wrap p-4 bg-white rounded-lg border shadow-sm">
              <Button variant="outline" size="sm" onClick={handleClearAllFilters} className="gap-1 border border-gray-300">
                <X className="h-3 w-3" /> Clear All
              </Button>
            </div>
          )}
        </div>

        {!productsLoading && !productsError && sortedProducts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
            {sortedProducts.map((product) => {
              if (!product) return null;
              const categoryName = product.categoryName || 'Uncategorized';
              const productName = product.name || 'Unknown Name';

              return (
                <Card key={product.id} className="overflow-hidden transition-all duration-300 hover:shadow-xl border border-gray-200 bg-white flex flex-col h-full group">
                  <div className="relative h-48 bg-gray-50 border-b flex items-center justify-center overflow-hidden">
                    <ImageWithFallback src={product.image} alt={productName} className="w-full h-full object-contain transition-transform duration-100 group-hover:scale-105" />
                    <Badge className="absolute top-2 right-2 px-2 py-0.5 text-[10px] font-semibold shadow-sm z-10" style={{ backgroundColor: product.inStock ? '#dcfce7' : '#fee2e2', color: product.inStock ? '#166534' : '#b91c1c', border: product.inStock ? '1px solid #86efac' : '1px solid #fca5a5' }}>
                      {product.inStock ? 'In Stock' : 'Out of Stock'}
                    </Badge>
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    <div className="px-2 mb-4 flex-1">
                      <h3 className="font-semibold text-base text-gray-900 mb-1 leading-snug line-clamp-2 min-h-[40px]" title={productName}>
                        {productName}
                      </h3>
                      <p className="text-xs text-gray-500 capitalize mb-2 truncate">{categoryName}</p>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-2xl font-bold text-gray-900">₹{product.price || 0}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-4 border-t border-gray-100 mt-auto">
                      <Button variant="outline" size="sm" className="bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100 hover:text-purple-800 transition-colors flex items-center justify-center"
                        onClick={() => navigate(`/products/${product.id}/variants`)}>
                        <Layers className="h-4 w-4 mr-1" /> Variants
                      </Button>

                      <Button variant="outline" size="sm" className="hover:bg-blue-50 hover:text-blue-600 transition-colors border-gray-300 flex items-center justify-center"
                        onClick={() => {
                          setSelectedProduct({
                            ...product,
                            dishName: product.name
                          });
                          setEditModalOpen(true);
                        }}>
                        <Edit2 className="h-4 w-4 mr-2" /> Edit
                      </Button>

                      <Button variant="outline" size="sm" className="hover:bg-red-50 hover:text-red-600 transition-colors border-gray-300 text-red-500 flex items-center justify-center"
                        onClick={() => { setSelectedProduct(product); setDeleteModalOpen(true); }}>
                        <Trash2 className="h-4 w-4 mr-2" /> Delete
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {productsLoading && <p className="text-center mt-8">Loading products...</p>}
        {!productsLoading && sortedProducts.length === 0 && <p className="text-center mt-8">No products found.</p>}
      </Card>

      <AddProductModal open={addModalOpen} onClose={() => setAddModalOpen(false)} onAdd={createProduct} categories={categories} />

      {selectedProduct && (
        <>
          <EditModal
            open={editModalOpen}
            onOpenChange={(open) => { setEditModalOpen(open); if (!open) setSelectedProduct(null); }}
            onSave={handleUpdateProduct}
            title="Edit Product"
            data={selectedProduct}
            fields={[
              { key: 'dishName', label: 'Product Name', type: 'text' },
              { key: 'category', label: 'Category', type: 'select', options: categories.map(c => ({ label: c.displayName || c.name, value: c._id || c.id })) },
              { key: 'price', label: 'Price (₹)', type: 'number' },
              { key: 'originalPrice', label: 'Original Price (₹)', type: 'number' },
              { key: 'cost', label: 'Cost (₹)', type: 'number' },
              { key: 'stock', label: 'Stock', type: 'number' },
              { key: 'volume', label: 'Volume/Size', type: 'text' },
              { key: 'image', label: 'Product Image', type: 'file' },
            ]}
          />
          <DeleteConfirmationModal
            open={deleteModalOpen}
            onOpenChange={(open) => { setDeleteModalOpen(open); if (!open) setSelectedProduct(null); }}
            onConfirm={handleDeleteProduct}
            title="Delete Product"
            description={`Are you sure you want to delete "${selectedProduct.name || 'this product'}"? This action cannot be undone.`}
          />
        </>
      )}
    </div>
  );
}