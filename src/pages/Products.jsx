import { useState, useMemo } from 'react';
import { Search, Plus, Filter, Edit2, Trash2, Package, CheckCircle, TrendingUp, Star, X, ChevronDown, Layers, RefreshCw, Download } from 'lucide-react';
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
import { toast } from 'sonner';
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
    refetch // ✅ This is what we need to call to refresh the list
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

  const handleRefresh = () => {
    if (refetch) refetch();
    toast.success("Product data refreshed");
  };

  // ... (handleUpdateProduct and handleDeleteProduct logic remains same) ...
  const handleDeleteProduct = async () => {
    if (!selectedProduct) return;
    const productId = selectedProduct._id || selectedProduct.id;
    try {
      await deleteProduct(productId);
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
      {/* ... Header and Stats ... */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Products / Management</h2>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4" /> Refresh
          </Button>
          <Button variant="outline" className="gap-2" onClick={() => toast.info("Exporting...")}>
            <Download className="h-4 w-4" /> Export
          </Button>
          <Button className="bg-red-500 hover:bg-red-600 gap-2" onClick={() => setAddModalOpen(true)}>
            <Plus className="h-4 w-4" /> Add Product
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
         <Card className="p-4 hover:shadow-md transition-all"><div className="flex justify-between"><div><p className="text-sm text-gray-500 font-bold">Total Products</p><h3 className="text-lg">{totalProducts}</h3></div><div className="h-9 w-9 bg-blue-50 rounded-full flex items-center justify-center text-blue-500"><Package className="h-4 w-4"/></div></div></Card>
         <Card className="p-4 hover:shadow-md transition-all"><div className="flex justify-between"><div><p className="text-sm text-gray-500 font-bold">Available</p><h3 className="text-lg">{availableProducts}</h3></div><div className="h-9 w-9 bg-green-50 rounded-full flex items-center justify-center text-green-600"><CheckCircle className="h-4 w-4"/></div></div></Card>
         <Card className="p-4 hover:shadow-md transition-all"><div className="flex justify-between"><div><p className="text-sm text-gray-500 font-bold">Revenue</p><h3 className="text-lg">₹{todaysRevenue}</h3></div><div className="h-9 w-9 bg-purple-50 rounded-full flex items-center justify-center text-purple-500"><TrendingUp className="h-4 w-4"/></div></div></Card>
         <Card className="p-4 hover:shadow-md transition-all"><div className="flex justify-between"><div><p className="text-sm text-gray-500 font-bold">Avg Rating</p><h3 className="text-lg">{avgRating}</h3></div><div className="h-9 w-9 bg-yellow-50 rounded-full flex items-center justify-center text-yellow-500"><Star className="h-4 w-4"/></div></div></Card>
      </div>

      <Card className="p-6 bg-gray-50/50 border-none shadow-none">
        {/* ... Search and Filters ... */}
        <div className="space-y-4 mb-2">
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
          </div>

          {moreDropdownOpen && (
            <div className="flex items-center gap-2 flex-wrap p-4 bg-white rounded-lg border shadow-sm">
              <Button variant="outline" size="sm" onClick={handleClearAllFilters} className="gap-1 border border-gray-300">
                <X className="h-3 w-3" /> Clear All
              </Button>
            </div>
          )}
        </div>

        {/* ... Products Grid ... */}
        {!productsLoading && !productsError && sortedProducts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-2">
            {sortedProducts.map((product) => {
              if (!product) return null;
              const categoryName = product.categoryName || 'Uncategorized';
              const productName = product.name || 'Unknown Name';

              return (
                <Card key={product.id || product._id} className="overflow-hidden transition-all duration-300 hover:shadow-xl border border-gray-200 bg-white flex flex-col h-full group">
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
                        onClick={() => navigate(`/products/${product.id || product._id}/variants`)}>
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

      {/* ✅ CORRECTED ADD MODAL IMPLEMENTATION */}
      <AddProductModal 
        open={addModalOpen} 
        onClose={() => setAddModalOpen(false)} 
        // 1. Removed onAdd={createProduct} because the modal handles API call internally now
        // 2. Added onSuccess to trigger refresh
        onSuccess={() => {
            if (refetch) refetch(); // <-- Triggers re-fetch
        }} 
        categories={categories} 
      />

      {selectedProduct && (
        <>
          <EditModal
            open={editModalOpen}
            onOpenChange={(open) => {
              setEditModalOpen(open);
              if (!open) setSelectedProduct(null);
            }}
            product={selectedProduct}
            categories={categories} 
            onSuccess={() => {
              if (refetch) refetch(); 
              setEditModalOpen(false); 
            }}
          />

          <DeleteConfirmationModal
            open={deleteModalOpen}
            onOpenChange={(open) => {
              setDeleteModalOpen(open);
              if (!open) setSelectedProduct(null);
            }}
            onConfirm={handleDeleteProduct}
            title="Delete Product"
            description={`Are you sure you want to delete "${selectedProduct.name || 'this product'}"? This action cannot be undone.`}
          />
        </>
      )}
    </div>
  );
}