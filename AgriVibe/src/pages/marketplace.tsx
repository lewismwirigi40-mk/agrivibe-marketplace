// src/pages/marketplace.tsx
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  ChevronDown,
  ShoppingBag,
  Star,
  MapPin,
  Clock,
  Truck,
  Shield,
  X,
  SlidersHorizontal,
  ArrowUpDown,
  Eye,
  Heart,
  Share2,
  Sparkles,
  Leaf,
  Award
} from 'lucide-react';
import api from '../services/api';

export default function Marketplace() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState<any[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Fetch products
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/products');
      setProducts(response.data.products || []);
      setFilteredProducts(response.data.products || []);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data.categories || []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  // Filter and sort products
  useEffect(() => {
    let result = [...products];

    // Search filter
    if (search.trim()) {
      result = result.filter((p: any) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description?.toLowerCase().includes(search.toLowerCase()) ||
        p.store?.store_name?.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter((p: any) =>
        p.category?.name === selectedCategory ||
        p.category === selectedCategory
      );
    }

    // Price filter
    result = result.filter((p: any) =>
      p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    // Sorting
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'newest':
      default:
        result.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
        break;
    }

    setFilteredProducts(result);
  }, [search, products, selectedCategory, sortBy, priceRange]);

  const handleAddToCart = async (productId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await api.post('/cart/add', { product_id: productId, quantity: 1 });
      // Show success notification
      const toast = document.createElement('div');
      toast.className = 'fixed bottom-6 left-1/2 -translate-x-1/2 bg-agrivibe-green text-white px-6 py-4 rounded-xl shadow-2xl z-50 animate-fade-up';
      toast.textContent = '✅ Added to cart!';
      document.body.appendChild(toast);
      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.5s';
        setTimeout(() => toast.remove(), 500);
      }, 2500);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  const toggleWishlist = (productId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setWishlist(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const clearFilters = () => {
    setSearch('');
    setSelectedCategory('all');
    setSortBy('newest');
    setPriceRange([0, 10000]);
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-premium-light">
        <div className="container-premium pt-28 pb-16">
          <div className="flex justify-between items-center mb-8">
            <div className="h-10 w-48 bg-gray-200 rounded-xl animate-pulse" />
            <div className="h-12 w-64 bg-gray-200 rounded-xl animate-pulse" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm">
                <div className="h-48 bg-gray-200 animate-pulse" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
                  <div className="flex justify-between">
                    <div className="h-6 bg-gray-200 rounded animate-pulse w-1/3" />
                    <div className="h-8 bg-gray-200 rounded animate-pulse w-1/4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-premium-light">
      {/* ====== HEADER ====== */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-30 shadow-sm">
        <div className="container-premium py-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            {/* Title */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-agrivibe-green to-agrivibe-green-light rounded-xl flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Marketplace</h1>
                <p className="text-xs text-gray-500">{filteredProducts.length} products available</p>
              </div>
            </div>

            {/* Search & Actions */}
            <div className="flex-1 flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search for fresh produce, vendors, categories..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-agrivibe-green focus:ring-4 focus:ring-agrivibe-green/10 outline-none transition-all"
                />
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <SlidersHorizontal className="w-5 h-5" />
                  <span className="hidden sm:inline">Filters</span>
                </button>
                <button
                  onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                  className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  {viewMode === 'grid' ? <List className="w-5 h-5" /> : <Grid className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-premium py-8">
        {/* ====== FILTERS PANEL ====== */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-6"
            >
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-lg">Filters</h3>
                  <button
                    onClick={clearFilters}
                    className="text-sm text-agrivibe-green hover:underline"
                  >
                    Clear all
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {/* Categories */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-agrivibe-green outline-none"
                    >
                      <option value="all">All Categories</option>
                      {categories.map((cat: any) => (
                        <option key={cat.id || cat.name} value={cat.name}>
                          {cat.icon} {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Sort */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sort by</label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-agrivibe-green outline-none"
                    >
                      <option value="newest">Newest First</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="rating">Highest Rated</option>
                    </select>
                  </div>

                  {/* Price Range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price Range: KES {priceRange[0]} - KES {priceRange[1]}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="10000"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-full accent-agrivibe-green"
                    />
                  </div>

                  {/* Results count */}
                  <div className="flex items-end justify-end">
                    <div className="text-sm text-gray-500">
                      <span className="font-bold text-gray-900">{filteredProducts.length}</span> products found
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ====== PRODUCTS GRID ====== */}
        {filteredProducts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="text-8xl mb-6">🔍</div>
            <h3 className="text-3xl font-bold text-gray-800 mb-3">No products found</h3>
            <p className="text-gray-500 text-lg mb-8">
              {search ? `No results for "${search}"` : 'No products available yet'}
            </p>
            {search && (
              <button
                onClick={() => setSearch('')}
                className="btn-premium"
              >
                Clear Search
              </button>
            )}
          </motion.div>
        ) : (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
            : 'space-y-4'
          }>
            {filteredProducts.map((product: any, index: number) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -4 }}
                onClick={() => router.push(`/product/${product.id}`)}
                className={`group cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300'
                    : 'bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 flex'
                }`}
              >
                {/* Product Image */}
                <div className={`relative overflow-hidden ${
                  viewMode === 'grid' ? 'h-56' : 'h-48 w-48 flex-shrink-0'
                }`}>
                  <img
                    src={product.images?.[0] || product.image || 'https://images.unsplash.com/photo-1488459716781-31db5d0e8b2d?w=400&h=300&fit=crop'}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1">
                    {product.is_featured && (
                      <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                        🔥 Featured
                      </span>
                    )}
                    {product.is_organic && (
                      <span className="bg-agrivibe-green text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                        <Leaf className="w-3 h-3 inline mr-1" />
                        Organic
                      </span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={(e) => toggleWishlist(product.id, e)}
                      className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all shadow-lg"
                    >
                      <Heart className={`w-5 h-5 ${
                        wishlist.includes(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'
                      }`} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Share functionality
                      }}
                      className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all shadow-lg"
                    >
                      <Share2 className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>

                  {/* Stock Status */}
                  {product.stock_quantity > 0 ? (
                    <div className="absolute bottom-3 left-3 bg-green-500/90 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full">
                      <Truck className="w-3 h-3 inline mr-1" />
                      In Stock
                    </div>
                  ) : (
                    <div className="absolute bottom-3 left-3 bg-red-500/90 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full">
                      Out of Stock
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div className={`flex-1 p-4 ${viewMode === 'grid' ? '' : 'flex flex-col justify-center'}`}>
                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < Math.round(product.rating || 0) ? 'fill-current' : ''}`} />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">({product.rating || 0})</span>
                  </div>

                  {/* Name */}
                  <h3 className="font-bold text-gray-900 text-lg line-clamp-1">
                    {product.name}
                  </h3>

                  {/* Vendor */}
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Store className="w-4 h-4" />
                    {product.store?.store_name || 'Vendor'}
                  </div>

                  {/* Price & Add to Cart */}
                  <div className="flex items-center justify-between mt-3">
                    <div>
                      <span className="text-2xl font-bold text-agrivibe-green">
                        KES {product.price}
                      </span>
                      {product.original_price && (
                        <span className="text-sm text-gray-400 line-through ml-2">
                          KES {product.original_price}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={(e) => handleAddToCart(product.id, e)}
                      disabled={product.stock_quantity === 0}
                      className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
                        product.stock_quantity > 0
                          ? 'bg-gradient-to-r from-agrivibe-green to-agrivibe-green-light text-white hover:shadow-lg hover:shadow-agrivibe-green/30 hover:scale-105'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <ShoppingBag className="w-4 h-4" />
                      {product.stock_quantity > 0 ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                  </div>

                  {/* Delivery Info */}
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {product.delivery_time || 'Same day'}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {product.location || 'Nairobi'}
                    </div>
                    <div className="flex items-center gap-1">
                      <Shield className="w-3 h-3 text-agrivibe-green" />
                      Verified
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* ====== PRODUCT COUNT ====== */}
        {filteredProducts.length > 0 && (
          <div className="mt-8 text-center text-sm text-gray-500">
            Showing <span className="font-bold text-gray-700">{filteredProducts.length}</span> products
          </div>
        )}
      </div>

      {/* ====== FLOATING SEARCH BUTTON (Mobile) ====== */}
      <button
        onClick={() => searchInputRef.current?.focus()}
        className="lg:hidden fixed bottom-6 right-6 bg-agrivibe-green text-white p-4 rounded-full shadow-2xl shadow-agrivibe-green/30 hover:scale-110 transition-all duration-300 z-40"
      >
        <Search className="w-6 h-6" />
      </button>
    </div>
  );
}

// Missing Store icon from lucide-react - add this import
import { Store } from 'lucide-react';