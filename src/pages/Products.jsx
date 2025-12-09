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
  const [priceFilter, setPriceFilter] = useState('all');
  const [popularityFilter, setPopularityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const { categories, refetch: refetchCategories } = useApiCategories();

  const categoryMap = useMemo(() => {
    const map = {};
    categories.forEach(cat => {
      map[cat._id || cat.id] = (cat.name || '').toLowerCase();
    });
    return map;
  }, [categories]);

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

  const { stats, loading: statsLoading } = useDashboardStats();

  const availableProductsCount = rawProducts.filter(p => (p.stock || 0) > 0).length;
  const totalProducts = totalProductsApi || rawProducts.length || 0;
  const availableProducts = productsLoading ? '...' : availableProductsCount;
  const todaysRevenue = statsLoading ? '...' : (stats?.todaysRevenue?.toLocaleString() ?? 'N/A');
  const avgRating = statsLoading ? '...' : (stats?.avgRating ?? 'N/A');

  // Filter Logic
  const validProducts = rawProducts.filter(p => p && typeof p === 'object');

  const filteredProducts = validProducts.filter(product => {
    const matchesSearch = product.name?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const categoryId = product.category;
    let productCatName = '';
    if (product.category && typeof product.category === 'object' && product.category.name) {
        productCatName = product.category.name.toLowerCase().trim();
    } else {
        productCatName = (categoryMap[categoryId] || (typeof categoryId === 'string' ? categoryId : '')).toLowerCase().trim();
    }

    const filterCatName = selectedCategory.toLowerCase().trim();
    const matchesCategory = selectedCategory === 'all' || productCatName === filterCatName;

    let matchesStatus = true;
    if (selectedStatus === 'instock') matchesStatus = (product.stock || 0) > 0;
    else if (selectedStatus === 'outofstock') matchesStatus = (product.stock || 0) <= 0;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    let compareValue = 0;
    const nameA = a?.name || '';
    const nameB = b?.name || '';
    if (sortBy === 'name') compareValue = nameA.localeCompare(nameB);
    return sortOrder === 'asc' ? compareValue : -compareValue;
  });

  const handleUpdateProduct = async (updatedData) => {
    if (selectedProduct) {
      try {
        await updateProduct(selectedProduct.id, updatedData);
        showSuccessToast('Product updated successfully!');
        setEditModalOpen(false);
        setSelectedProduct(null);
      } catch (err) {
        toast.error(err.message || "Failed to update product");
      }
    }
  };

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

  const handleClearAllFilters = () => {
    setPriceFilter('all');
    setPopularityFilter('all');
    setSortBy('name');
    setSortOrder('asc');
    setSelectedCategory('all');
    setSelectedStatus('all');
    setSearchQuery('');
  };

  return (
    <div className="p-4">
      {/* Statistics Cards */}
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
                {categories.map((cat) => (<SelectItem key={cat._id || cat.id} value={cat.name}>{cat.displayName || cat.name}</SelectItem>))}
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-40 border border-gray-300"><SelectValue placeholder="All Status" /></SelectTrigger>
              <SelectContent><SelectItem value="all">All Status</SelectItem><SelectItem value="instock">In Stock</SelectItem><SelectItem value="outofstock">Out of Stock</SelectItem></SelectContent>
            </Select>

            <div className="relative">
              <Button variant="outline" onClick={() => setMoreDropdownOpen(!moreDropdownOpen)} className="gap-2 border border-gray-300"><Filter className="h-4 w-4" /> More <ChevronDown className="h-4 w-4" /></Button>
            </div>

            <Button className="bg-red-500 hover:bg-red-600 border border-red-500" onClick={() => setAddModalOpen(true)}><Plus className="h-4 w-4 mr-2" /> Add Product</Button>
          </div>

          {moreDropdownOpen && (
            <div className="flex items-center gap-2 flex-wrap p-4 bg-white rounded-lg border shadow-sm">
              <Select value={priceFilter} onValueChange={setPriceFilter}>
                <SelectTrigger className="w-36 border border-gray-300"><SelectValue placeholder="All Prices" /></SelectTrigger>
                <SelectContent><SelectItem value="all">All Prices</SelectItem><SelectItem value="low">Low (0-100)</SelectItem><SelectItem value="medium">Medium (100-300)</SelectItem><SelectItem value="high">High (300+)</SelectItem></SelectContent>
              </Select>
              <Select value={popularityFilter} onValueChange={setPopularityFilter}>
                <SelectTrigger className="w-40 border border-gray-300"><SelectValue placeholder="All Popularity" /></SelectTrigger>
                <SelectContent><SelectItem value="all">All Popularity</SelectItem><SelectItem value="trending">Trending</SelectItem><SelectItem value="popular">Popular</SelectItem><SelectItem value="new">New</SelectItem></SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40 border border-gray-300"><SelectValue placeholder="Sort by Name" /></SelectTrigger>
                <SelectContent><SelectItem value="name">Sort by Name</SelectItem><SelectItem value="price">Sort by Price</SelectItem><SelectItem value="stock">Sort by Stock</SelectItem></SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')} className="border border-gray-300">{sortOrder === 'asc' ? '↑ ASC' : '↓ DESC'}</Button>
              <Button variant="outline" size="sm" onClick={handleClearAllFilters} className="gap-1 border border-gray-300"><X className="h-3 w-3" /> Clear All</Button>
            </div>
          )}
        </div>

        {!productsLoading && !productsError && (
          /* ✨ FIXED: Removed comment that caused syntax error */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 mt-6">
              {sortedProducts.map((product) => {
                if (!product) return null;
                
                let categoryName = 'Uncategorized';
                if (product.category && typeof product.category === 'object' && product.category.name) {
                    categoryName = product.category.name;
                } else if (categoryMap[product.category]) {
                    categoryName = categoryMap[product.category];
                } else if (typeof product.category === 'string') {
                    const found = Object.keys(categoryMap).find(key => key.toLowerCase() === product.category.toLowerCase());
                    if(found) categoryName = categoryMap[found];
                    else categoryName = product.category; 
                }

                return (
                  <Card key={product.id} className="overflow-hidden transition-all duration-300 hover:shadow-xl border border-gray-200 bg-white flex flex-col h-full group">
                    
                    {/* ✨ FIXED: Image Container with object-cover for smooth, full images */}
                    <div className="relative h-48 bg-gray-50 border-b flex items-center justify-center overflow-hidden">
                      <ImageWithFallback 
                        src={product.image} 
                        alt={product.name || 'Product Image'}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <Badge 
                        className="absolute top-2 right-2 px-2 py-0.5 text-[10px] font-semibold shadow-sm z-10"
                        style={{ 
                          backgroundColor: (product.stock || 0) > 0 ? '#dcfce7' : '#fee2e2',
                          color: (product.stock || 0) > 0 ? '#166534' : '#b91c1c',
                          border: (product.stock || 0) > 0 ? '1px solid #86efac' : '1px solid #fca5a5'
                        }}
                      >
                        {(product.stock || 0) > 0 ? `In Stock: ${product.stock}` : 'Out of Stock'}
                      </Badge>
                    </div>
                    
                    <div className="p-5 flex flex-col flex-1">
                      <div className="mb-4 flex-1">
                        {/* ✨ FIXED: Truncate Title to 1 line */}
                        <h3 className="font-bold text-lg text-gray-900 mb-1 truncate" title={product.name}>{product.name || 'Unknown Name'}</h3>
                        <p className="text-sm text-muted-foreground mb-3 capitalize font-medium truncate">{categoryName}</p>
                        
                        <div className="flex items-center justify-between mt-3">
                             <div>
                                <span className="text-2xl font-bold text-gray-900">₹{product.price || 0}</span>
                             </div>
                             {/* ✨ FIXED: Stock shown clearly in body */}
                             
                        </div>
                      </div>

                      {/* ✨ ACTIONS: Variants, Edit, Delete */}
                      <div className="grid grid-cols-3 gap-2 pt-4 border-t border-gray-100 mt-auto">
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100 hover:text-purple-800 transition-colors flex items-center justify-center"
                          onClick={() => navigate(`/products/${product.id}/variants`)}
                        >
                          <Layers className="h-4 w-4 mr-1" />
                          Variants
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          className="hover:bg-blue-50 hover:text-blue-600 transition-colors border-gray-300 flex items-center justify-center"
                          onClick={() => {
                            const normalizedProduct = {
                              ...product,
                              category: product.category && typeof product.category === 'object' 
                                ? (product.category._id || product.category.id) 
                                : product.category
                            };
                            setSelectedProduct(normalizedProduct);
                            setEditModalOpen(true);
                          }}
                        >
                          <Edit2 className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="hover:bg-red-50 hover:text-red-600 transition-colors border-gray-300 text-red-500 flex items-center justify-center"
                          onClick={() => {
                            setSelectedProduct(product);
                            setDeleteModalOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
          </div>
        )}
      </Card>

      <AddProductModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onAdd={createProduct} 
        categories={categories} 
        onCategoryCreate={refetchCategories} 
      />

      {selectedProduct && (
        <>
          <EditModal
            open={editModalOpen}
            onOpenChange={(open) => {
              setEditModalOpen(open);
              if (!open) setSelectedProduct(null);
            }}
            onSave={(updatedData) => handleUpdateProduct(updatedData)}
            title="Edit Product"
            data={selectedProduct}
            fields={[
              { key: 'name', label: 'Product Name', type: 'text' },
              { 
                key: 'category', 
                label: 'Category', 
                type: 'select', 
                options: categories.map(c => ({ 
                    label: c.name || c.displayName, 
                    value: c._id || c.id 
                }))
              },
              { key: 'price', label: 'Price (₹)', type: 'text' },
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