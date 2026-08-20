// src/pages/admin/products.tsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, 
  Store, 
  DollarSign, 
  Calendar, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  Search,
  Filter,
  ChevronDown,
  ArrowUpDown,
  Eye,
  Edit,
  Trash2,
  Power,
  Clock,
  TrendingUp,
  Shield,
  Award,
  Sparkles,
  Star,
  Users,
  Building,
  Tag,
  Box,
  ShoppingBag,
  Percent,
  FileText  // ✅ ADD THIS
} from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../services/api';

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      const response = await api.get('/admin/products');
      setProducts(response.data.products || []);
    } catch (error: any) {
      console.error('Failed to fetch products:', error);
      setError(error.response?.data?.error || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const approveProduct = async (id: string) => {
    if (!confirm('Approve this product?')) return;
    try {
      await api.put(`/admin/products/${id}/approve`);
      await fetchProducts();
    } catch (error) {
      alert('Failed to approve product');
    }
  };

  const rejectProduct = async (id: string) => {
    if (!confirm('Reject this product?')) return;
    try {
      await api.put(`/admin/products/${id}/reject`);
      await fetchProducts();
    } catch (error) {
      alert('Failed to reject product');
    }
  };

  const toggleProductStatus = async (id: string, currentStatus: boolean) => {
    try {
      await api.put(`/admin/products/${id}/toggle`, { is_active: !currentStatus });
      await fetchProducts();
    } catch (error) {
      alert('Failed to update product status');
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await api.delete(`/admin/products/${id}`);
      await fetchProducts();
      setShowDeleteModal(null);
    } catch (error) {
      alert('Failed to delete product');
    }
  };

  // Filter and sort products
  const filteredProducts = products
    .filter(product => {
      const matchesSearch = 
        product.name?.toLowerCase().includes(search.toLowerCase()) ||
        product.store?.store_name?.toLowerCase().includes(search.toLowerCase()) ||
        product.description?.toLowerCase().includes(search.toLowerCase());
      
      const matchesFilter = filter === 'all' || product.status === filter;
      
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return (a.price || 0) - (b.price || 0);
        case 'price-high':
          return (b.price || 0) - (a.price || 0);
        case 'name':
          return (a.name || '').localeCompare(b.name || '');
        case 'oldest':
          return new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime();
        case 'newest':
        default:
          return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
      }
    });

  const stats = {
    total: products.length,
    approved: products.filter(p => p.status === 'approved').length,
    pending: products.filter(p => p.status === 'pending').length,
    rejected: products.filter(p => p.status === 'rejected').length,
  };

  const formatCurrency = (amount: number) => {
    return `KES ${amount?.toLocaleString() || 0}`;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'approved': 'bg-green-100 text-green-700 border-green-200',
      'pending': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'rejected': 'bg-red-100 text-red-700 border-red-200',
    };
    return colors[status?.toLowerCase()] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const getStatusIcon = (status: string) => {
    const icons: Record<string, any> = {
      'approved': CheckCircle,
      'pending': Clock,
      'rejected': XCircle,
    };
    return icons[status?.toLowerCase()] || Clock;
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-agrivibe-green border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Loading products...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center text-red-500">
            <AlertCircle className="w-12 h-12 mx-auto mb-4" />
            <p className="text-lg font-medium">{error}</p>
            <button
              onClick={fetchProducts}
              className="mt-4 bg-agrivibe-green text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              Try Again
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* ====== HEADER ====== */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Products</h1>
            <p className="text-gray-500 mt-1">Manage all vendor products</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-agrivibe-green/10 text-agrivibe-green rounded-full text-sm font-medium">
              <Package className="w-4 h-4" />
              {stats.total} Total Products
            </span>
          </div>
        </div>

        {/* ====== STATS CARDS ====== */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Products', value: stats.total, icon: Package, color: 'from-blue-500 to-blue-600', bg: 'bg-blue-50' },
            { label: 'Approved', value: stats.approved, icon: CheckCircle, color: 'from-green-500 to-emerald-500', bg: 'bg-green-50' },
            { label: 'Pending', value: stats.pending, icon: Clock, color: 'from-yellow-500 to-orange-500', bg: 'bg-yellow-50' },
            { label: 'Rejected', value: stats.rejected, icon: XCircle, color: 'from-red-500 to-red-600', bg: 'bg-red-50' },
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`${stat.bg} rounded-2xl border border-gray-100 p-4 hover:shadow-lg transition-all duration-300`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`w-10 h-10 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ====== FILTERS ====== */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products by name, vendor or description..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-agrivibe-green focus:ring-4 focus:ring-agrivibe-green/10 outline-none transition-all"
              />
            </div>

            {/* Status Filter */}
            <div className="relative sm:w-48">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full appearance-none px-4 py-2.5 pr-10 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:border-agrivibe-green focus:ring-4 focus:ring-agrivibe-green/10 outline-none transition-all cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="approved">✅ Approved</option>
                <option value="pending">⏳ Pending</option>
                <option value="rejected">❌ Rejected</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            {/* Sort */}
            <div className="relative sm:w-48">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full appearance-none px-4 py-2.5 pr-10 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:border-agrivibe-green focus:ring-4 focus:ring-agrivibe-green/10 outline-none transition-all cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="name">Name A-Z</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
              <ArrowUpDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* ====== PRODUCTS TABLE ====== */}
        {filteredProducts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 bg-white rounded-2xl shadow-md border border-gray-100"
          >
            <div className="text-8xl mb-6">📦</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">No products found</h3>
            <p className="text-gray-500 text-lg">
              {search || filter !== 'all' ? 'Try adjusting your filters' : 'No products available'}
            </p>
            {(search || filter !== 'all') && (
              <button
                onClick={() => { setSearch(''); setFilter('all'); }}
                className="mt-4 text-agrivibe-green font-medium hover:underline"
              >
                Clear Filters
              </button>
            )}
          </motion.div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left text-sm font-semibold text-gray-600 px-6 py-4">Product</th>
                    <th className="text-left text-sm font-semibold text-gray-600 px-6 py-4">Vendor</th>
                    <th className="text-left text-sm font-semibold text-gray-600 px-6 py-4">Price</th>
                    <th className="text-left text-sm font-semibold text-gray-600 px-6 py-4">Status</th>
                    <th className="text-left text-sm font-semibold text-gray-600 px-6 py-4">Added</th>
                    <th className="text-right text-sm font-semibold text-gray-600 px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {filteredProducts.map((product, index) => {
                      const StatusIcon = getStatusIcon(product.status);
                      const statusColor = getStatusColor(product.status);
                      const isPending = product.status === 'pending';
                      const isApproved = product.status === 'approved';
                      
                      return (
                        <motion.tr
                          key={product.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ delay: index * 0.03 }}
                          className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors group"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-agrivibe-green/20 to-emerald-500/20 rounded-xl flex items-center justify-center">
                                <Package className="w-5 h-5 text-agrivibe-green" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900 line-clamp-1">{product.name}</p>
                                {product.category && (
                                  <p className="text-xs text-gray-500">{product.category}</p>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm text-gray-600">{product.store?.store_name || 'Unknown'}</p>
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-bold text-agrivibe-green">{formatCurrency(product.price)}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${statusColor}`}>
                              <StatusIcon className="w-3.5 h-3.5" />
                              {product.status || 'pending'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm text-gray-500">
                              {new Date(product.created_at).toLocaleDateString()}
                            </p>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              {isPending ? (
                                <>
                                  <button
                                    onClick={() => approveProduct(product.id)}
                                    className="p-2 text-green-600 hover:text-green-700 transition-colors rounded-lg hover:bg-green-50"
                                    title="Approve"
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => rejectProduct(product.id)}
                                    className="p-2 text-red-600 hover:text-red-700 transition-colors rounded-lg hover:bg-red-50"
                                    title="Reject"
                                  >
                                    <XCircle className="w-4 h-4" />
                                  </button>
                                </>
                              ) : (
                                <button
                                  onClick={() => {
                                    setSelectedProduct(product);
                                    setShowProductModal(true);
                                  }}
                                  className="p-2 text-gray-400 hover:text-agrivibe-green transition-colors rounded-lg hover:bg-green-50"
                                  title="View Details"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                              )}
                              {isApproved && (
                                <button
                                  onClick={() => toggleProductStatus(product.id, product.is_active)}
                                  className={`p-2 transition-colors rounded-lg ${
                                    product.is_active 
                                      ? 'text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50' 
                                      : 'text-green-600 hover:text-green-700 hover:bg-green-50'
                                  }`}
                                  title={product.is_active ? 'Deactivate' : 'Activate'}
                                >
                                  <Power className="w-4 h-4" />
                                </button>
                              )}
                              <button
                                onClick={() => setShowDeleteModal(product.id)}
                                className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            {/* ====== PRODUCT COUNT ====== */}
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50">
              <p className="text-sm text-gray-500">
                Showing {filteredProducts.length} of {products.length} products
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ====== PRODUCT DETAILS MODAL ====== */}
      <AnimatePresence>
        {showProductModal && selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{selectedProduct.name}</h3>
                    <p className="text-sm text-gray-500">Product Details</p>
                  </div>
                  <button
                    onClick={() => setShowProductModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <XCircle className="w-5 h-5 text-gray-400" />
                  </button>
                </div>

                {/* Product Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Tag className="w-4 h-4" />
                      Product Information
                    </h4>
                    <p className="text-sm text-gray-900 font-medium">{selectedProduct.name}</p>
                    <p className="text-sm text-gray-500">{selectedProduct.category || 'No category'}</p>
                    <p className="text-sm text-gray-900 font-bold text-agrivibe-green mt-1">
                      {formatCurrency(selectedProduct.price)}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Store className="w-4 h-4" />
                      Vendor Information
                    </h4>
                    <p className="text-sm text-gray-900">{selectedProduct.store?.store_name || 'Unknown'}</p>
                    <p className="text-sm text-gray-500">{selectedProduct.store?.vendor?.email || ''}</p>
                  </div>
                </div>

                {selectedProduct.description && (
                  <div className="bg-gray-50 rounded-xl p-4 mb-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Description
                    </h4>
                    <p className="text-sm text-gray-600">{selectedProduct.description}</p>
                  </div>
                )}

                <div className="flex flex-wrap justify-between items-center border-t border-gray-200 pt-4 gap-2">
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedProduct.status)}`}>
                      {selectedProduct.status || 'pending'}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Stock</p>
                    <p className="text-sm font-medium text-gray-900">{selectedProduct.stock_quantity || 0} units</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Added</p>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(selectedProduct.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowProductModal(false)}
                  className="w-full mt-6 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ====== DELETE CONFIRMATION MODAL ====== */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Delete Product?</h3>
                <p className="text-gray-500 mt-2 text-sm">
                  This will permanently delete this product and all its data. This action cannot be undone.
                </p>
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowDeleteModal(null)}
                    className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => deleteProduct(showDeleteModal)}
                    className="flex-1 px-4 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}