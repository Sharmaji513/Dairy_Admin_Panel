import { useState } from 'react';
import { Search, Plus, Filter, Edit2, Trash2, Package, CheckCircle, TrendingUp, Star, X, ChevronDown } from 'lucide-react';
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

export function Products() {
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [priceFilter, setPriceFilter] = useState('all');
  const [popularityFilter, setPopularityFilter] = useState('all');
  const [dietFilter, setDietFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  
  // Modal states
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // --- API Hook for Product List ---
  const {
    products: rawProducts = [], 
    loading: productsLoading,
    error: productsError,
    total: totalProductsApi,
    createProduct,
    updateProduct,
    deleteProduct
  } = useApiProducts({
    search: searchQuery,
    category: selectedCategory,
    status: selectedStatus,
    page: 1,
    limit: 50
  });

  // --- API Hook for Stat Cards ---
  const { 
    stats, 
    loading: statsLoading 
  } = useDashboardStats();

  // Filter out null/undefined items
  const validProducts = rawProducts.filter(p => p && typeof p === 'object');

  // Safe Client-Side Sorting
  const sortedProducts = [...validProducts].sort((a, b) => {
    let compareValue = 0;
    const nameA = a?.name || '';
    const nameB = b?.name || '';
    const priceA = a?.price || 0;
    const priceB = b?.price || 0;
    const stockA = a?.stock || 0;
    const stockB = b?.stock || 0;

    if (sortBy === 'name') compareValue = nameA.localeCompare(nameB);
    else if (sortBy === 'price') compareValue = priceA - priceB;
    else if (sortBy === 'stock') compareValue = stockA - stockB;
    
    return sortOrder === 'asc' ? compareValue : -compareValue;
  });

  // Handle Delete
  const handleDeleteProduct = async () => {
    if (selectedProduct) {
      try {
        await deleteProduct(selectedProduct.id);
        showSuccessToast('Product deleted successfully!');
      } catch (err) {
        toast.error(err.message || "Failed to delete product");
      }
      setDeleteModalOpen(false);
      setSelectedProduct(null);
    }
  };

  const handleUpdateProduct = async (updatedData) => {
    if (selectedProduct) {
      try {
        await updateProduct(selectedProduct.id, updatedData);
        showSuccessToast('Product updated successfully!');
        setEditModalOpen(false); // ✨ CLOSE THE MODAL
        setSelectedProduct(null); // Clear selection
      } catch (err) {
        toast.error(err.message || "Failed to update product");
      }
    }
  };

  const handleClearAllFilters = () => {
    setPriceFilter('all');
    setPopularityFilter('all');
    setDietFilter('all');
    setSortBy('name');
    setSortOrder('asc');
    setSelectedCategory('all');
    setSelectedStatus('all');
    setSearchQuery('');
  };

  // Stat card values
  const totalProducts = statsLoading ? '...' : (stats?.totalProducts ?? totalProductsApi ?? 0);
  const availableProducts = statsLoading ? '...' : (stats?.availableProducts ?? 'N/A');
  const todaysRevenue = statsLoading ? '...' : (stats?.todaysRevenue?.toLocaleString() ?? 'N/A');
  const avgRating = statsLoading ? '...' : (stats?.avgRating ?? 'N/A');

  return (
    <div className="p-4">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <Card className="p-4 transition-all duration-200 hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1 font-bold">Total Products</p>
              <h3 className="text-lg">{totalProducts}</h3>
            </div>
            <div className="h-9 w-9 bg-blue-50 rounded-full flex items-center justify-center">
              <Package className="h-4 w-4 text-blue-500" />
            </div>
          </div>
        </Card>
        <Card className="p-4 transition-all duration-200 hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1 font-bold">Available</p>
              <h3 className="text-lg">{availableProducts}</h3>
            </div>
            <div className="h-9 w-9 rounded-full flex items-center justify-center" style={{ backgroundColor: '#e8f5e9' }}>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
          </div>
        </Card>
        <Card className="p-4 transition-all duration-200 hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1 font-bold">Today's Revenue</p>
              <h3 className="text-lg">₹{todaysRevenue}</h3>
            </div>
            <div className="h-9 w-9 bg-purple-50 rounded-full flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-purple-500" />
            </div>
          </div>
        </Card>
        <Card className="p-4 transition-all duration-200 hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1 font-bold">Avg Rating</p>
              <h3 className="text-lg">{avgRating}</h3>
            </div>
            <div className="h-9 w-9 bg-yellow-50 rounded-full flex items-center justify-center">
              <Star className="h-4 w-4 text-yellow-500" />
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          {/* Search and Controls Row */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search products..." 
                className="pl-10 border border-gray-300" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48 border border-gray-300">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Dairy">Dairy</SelectItem>
                <SelectItem value="Beverages">Beverages</SelectItem>
                <SelectItem value="Cookies">Cookies</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-40 border border-gray-300">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="instock">In Stock</SelectItem>
                <SelectItem value="outofstock">Out of Stock</SelectItem>
              </SelectContent>
            </Select>

            <div className="relative">
              <Button 
                variant="outline"
                onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                className="gap-2 border border-gray-300"
              >
                <Filter className="h-4 w-4" />
                More
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>

            <Button 
              className="bg-red-500 hover:bg-red-600 border border-red-500"
              onClick={() => setAddModalOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </div>

          {/* Filter Buttons Row */}
          {moreDropdownOpen && (
            <div className="flex items-center gap-2 flex-wrap p-4 bg-gray-50 rounded-lg">
              <Select value={priceFilter} onValueChange={setPriceFilter}>
                <SelectTrigger className="w-36 border border-gray-300">
                  <SelectValue placeholder="All Prices" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="low">Low (0-100)</SelectItem>
                  <SelectItem value="medium">Medium (100-300)</SelectItem>
                  <SelectItem value="high">High (300+)</SelectItem>
                </SelectContent>
              </Select>

              <Select value={popularityFilter} onValueChange={setPopularityFilter}>
                <SelectTrigger className="w-40 border border-gray-300">
                  <SelectValue placeholder="All Popularity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Popularity</SelectItem>
                  <SelectItem value="trending">Trending</SelectItem>
                  <SelectItem value="popular">Popular</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                </SelectContent>
              </Select>

              <Select value={dietFilter} onValueChange={setDietFilter}>
                <SelectTrigger className="w-40 border border-gray-300">
                  <SelectValue placeholder="All Diet Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Diet Types</SelectItem>
                  <SelectItem value="veg">Vegetarian</SelectItem>
                  <SelectItem value="vegan">Vegan</SelectItem>
                  <SelectItem value="organic">Organic</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40 border border-gray-300">
                  <SelectValue placeholder="Sort by Name" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Sort by Name</SelectItem>
                  <SelectItem value="price">Sort by Price</SelectItem>
                  <SelectItem value="stock">Sort by Stock</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="border border-gray-300"
              >
                {sortOrder === 'asc' ? '↑ ASC' : '↓ DESC'}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleClearAllFilters}
                className="gap-1 border border-gray-300"
              >
                <X className="h-3 w-3" />
                Clear All
              </Button>
            </div>
          )}
        </div>

        {productsLoading && <div className="text-center py-12 text-muted-foreground">Loading products...</div>}
        {productsError && <div className="text-center py-12 text-red-500">Error: {productsError}</div>}
        
        {!productsLoading && !productsError && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-6">
              {sortedProducts.map((product) => {
                if (!product) return null;
                return (
                  <Card key={product.id} className="overflow-hidden transition-all duration-200 hover:shadow-lg">
                    <div className="relative h-48 bg-gray-100">
                      <ImageWithFallback 
                        src={product.image} 
                        alt={product.name || 'Product Image'}
                        className="w-full h-full object-cover"
                      />
                      <Badge 
                        className="absolute top-2 right-2 text-xs"
                        style={{ 
                          backgroundColor: (product.stock || 0) > 0 ? '#e8f5e9' : '#f5f5f5',
                          color: (product.stock || 0) > 0 ? '#2e7d32' : '#757575'
                        }}
                      >
                        {(product.stock || 0) > 0 ? 'In Stock' : 'Out of Stock'}
                      </Badge>
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium mb-1">{product.name || 'Unknown Name'}</h3>
                      <p className="text-xs text-muted-foreground mb-2">{product.category || 'Uncategorized'}</p>
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-semibold">₹{product.price || 0}</span>
                        <span className="text-xs text-muted-foreground">{product.unit || 'unit'}</span>
                      </div>
                      <div className="text-xs text-muted-foreground mb-3">
                        Stock: {product.stock || 0} 
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => {
                            setSelectedProduct(product);
                            setEditModalOpen(true);
                          }}
                        >
                          <Edit2 className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => {
                            setSelectedProduct(product);
                            setDeleteModalOpen(true);
                          }}
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            {sortedProducts.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                No products found
              </div>
            )}
          </>
        )}
      </Card>

      {/* Add Product Modal */}
      <AddProductModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onAdd={createProduct} 
      />

      {selectedProduct && (
        <>
          {/* ✨ Updated Edit Modal with Dropdown */}
          <EditModal
            open={editModalOpen}
            onOpenChange={(open) => {
              setEditModalOpen(open);
              if (!open) setSelectedProduct(null);
            }}
            onSave={handleUpdateProduct}
            title="Edit Product"
            data={selectedProduct}
            fields={[
              { key: 'name', label: 'Product Name', type: 'text' },
              { 
                key: 'category', 
                label: 'Category', 
                type: 'select', // ✨ Changed to select
                options: ['Dairy', 'Beverages', 'Cookies', 'Other'] // ✨ Options added
              },
              { key: 'price', label: 'Price (₹)', type: 'text' }, // Changed from slider to text input for cleaner editing
              { key: 'stock', label: 'Stock', type: 'number' },
              { key: 'unit', label: 'Unit', type: 'text' },
            ]}
          />

          <DeleteConfirmationModal
            open={deleteModalOpen}
            onOpenChange={(open) => {
              setDeleteModalOpen(open);
              if (!open) setSelectedProduct(null);
            }}
            onConfirm={handleDeleteProduct}
            title="Delete Product"
            description={`Are you sure you want to delete ${selectedProduct.name || 'this product'}? This action cannot be undone.`}
          />
        </>
      )}
    </div>
  );
}