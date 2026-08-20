// src/pages/vendor/orders.tsx
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  XCircle,
  Search,
  Filter,
  ChevronDown,
  ArrowUpDown,
  Eye,
  User,
  Calendar,
  DollarSign,
  Sparkles,
  AlertCircle,
  Box,
  Send,
  MapPin,
  Phone,
  Mail
} from 'lucide-react';
import VendorLayout from '../../components/VendorLayout';
import api from '../../services/api';

export default function VendorOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [showOrderModal, setShowOrderModal] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      const response = await api.get('/orders/vendor');
      setOrders(response.data.orders || []);
    } catch (error: any) {
      console.error('Failed to fetch orders:', error);
      setError(error.response?.data?.error || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (id: string, status: string) => {
    try {
      await api.put(`/orders/${id}`, { status });
      await fetchOrders();
    } catch (error) {
      alert('Failed to update order status');
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'delivered': 'bg-green-100 text-green-700 border-green-200',
      'pending': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'processing': 'bg-blue-100 text-blue-700 border-blue-200',
      'shipped': 'bg-purple-100 text-purple-700 border-purple-200',
      'cancelled': 'bg-red-100 text-red-700 border-red-200',
    };
    return colors[status?.toLowerCase()] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const getStatusIcon = (status: string) => {
    const icons: Record<string, any> = {
      'delivered': CheckCircle,
      'pending': Clock,
      'processing': Package,
      'shipped': Truck,
      'cancelled': XCircle,
    };
    return icons[status?.toLowerCase()] || Clock;
  };

  const getStatusActions = (status: string) => {
    const actions: Record<string, string[]> = {
      'pending': ['processing', 'cancelled'],
      'processing': ['shipped', 'cancelled'],
      'shipped': ['delivered', 'cancelled'],
      'delivered': [],
      'cancelled': [],
    };
    return actions[status?.toLowerCase()] || [];
  };

  // Filter and sort orders
  const filteredOrders = orders
    .filter(order => {
      const matchesSearch = 
        order.order_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer?.email?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || order.status?.toLowerCase() === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime();
        case 'amount-high':
          return (b.total || 0) - (a.total || 0);
        case 'amount-low':
          return (a.total || 0) - (b.total || 0);
        case 'newest':
        default:
          return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
      }
    });

  // Order statistics
  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
  };

  if (loading) {
    return (
      <VendorLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-agrivibe-green border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Loading orders...</p>
          </div>
        </div>
      </VendorLayout>
    );
  }

  if (error) {
    return (
      <VendorLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center text-red-500">
            <AlertCircle className="w-12 h-12 mx-auto mb-4" />
            <p className="text-lg font-medium">{error}</p>
            <button
              onClick={fetchOrders}
              className="mt-4 btn-premium"
            >
              Try Again
            </button>
          </div>
        </div>
      </VendorLayout>
    );
  }

  return (
    <VendorLayout>
      <div className="space-y-6">
        {/* ====== HEADER ====== */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
            <p className="text-gray-500 mt-1">Manage your customer orders</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-medium">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              {stats.total} Total Orders
            </span>
          </div>
        </div>

        {/* ====== STATS ====== */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Orders', value: stats.total, icon: ShoppingBag, color: 'from-blue-500 to-blue-600' },
            { label: 'Pending', value: stats.pending, icon: Clock, color: 'from-yellow-500 to-orange-500' },
            { label: 'Processing', value: stats.processing, icon: Package, color: 'from-purple-500 to-purple-600' },
            { label: 'Delivered', value: stats.delivered, icon: CheckCircle, color: 'from-green-500 to-emerald-500' },
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-md border border-gray-100 p-4"
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
                placeholder="Search by order ID or customer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-agrivibe-green focus:ring-4 focus:ring-agrivibe-green/10 outline-none transition-all"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none px-4 py-2.5 pr-10 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:border-agrivibe-green focus:ring-4 focus:ring-agrivibe-green/10 outline-none transition-all cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="pending">🟡 Pending</option>
                <option value="processing">🔵 Processing</option>
                <option value="shipped">🟣 Shipped</option>
                <option value="delivered">🟢 Delivered</option>
                <option value="cancelled">🔴 Cancelled</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            {/* Sort */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none px-4 py-2.5 pr-10 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:border-agrivibe-green focus:ring-4 focus:ring-agrivibe-green/10 outline-none transition-all cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="amount-high">Amount: High to Low</option>
                <option value="amount-low">Amount: Low to High</option>
              </select>
              <ArrowUpDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* ====== ORDERS TABLE ====== */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-md border border-gray-100">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-800">No Orders Found</h3>
            <p className="text-gray-500 mt-2">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your filters' 
                : 'Orders will appear here when customers buy from you'}
            </p>
            {(searchTerm || statusFilter !== 'all') && (
              <button
                onClick={() => { setSearchTerm(''); setStatusFilter('all'); }}
                className="mt-4 text-agrivibe-green font-medium hover:underline"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left text-sm font-semibold text-gray-600 px-6 py-4">Order ID</th>
                    <th className="text-left text-sm font-semibold text-gray-600 px-6 py-4">Customer</th>
                    <th className="text-left text-sm font-semibold text-gray-600 px-6 py-4">Date</th>
                    <th className="text-left text-sm font-semibold text-gray-600 px-6 py-4">Total</th>
                    <th className="text-left text-sm font-semibold text-gray-600 px-6 py-4">Status</th>
                    <th className="text-right text-sm font-semibold text-gray-600 px-6 py-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {filteredOrders.map((order, index) => {
                      const StatusIcon = getStatusIcon(order.status);
                      const statusActions = getStatusActions(order.status);
                      return (
                        <motion.tr
                          key={order.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ delay: index * 0.05 }}
                          className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors group"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-900">
                                #{order.order_number || order.id.slice(0, 8)}
                              </span>
                              <button
                                onClick={() => setShowOrderModal(order.id)}
                                className="p-1 text-gray-400 hover:text-agrivibe-green transition-colors"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-medium text-gray-900">{order.customer?.name || 'Customer'}</p>
                              <p className="text-xs text-gray-500">{order.customer?.email || ''}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <p className="text-sm text-gray-900">
                                {new Date(order.created_at).toLocaleDateString()}
                              </p>
                              <p className="text-xs text-gray-400">
                                {new Date(order.created_at).toLocaleTimeString()}
                              </p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-bold text-agrivibe-green">
                              KES {order.total?.toLocaleString() || 0}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                              <StatusIcon className="w-3.5 h-3.5" />
                              {order.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-2">
                              {statusActions.length > 0 ? (
                                <div className="relative">
                                  <select
                                    value=""
                                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                    className="appearance-none px-3 py-1.5 pr-8 bg-gray-100 border border-gray-200 rounded-lg text-sm text-gray-700 focus:border-agrivibe-green focus:ring-2 focus:ring-agrivibe-green/20 outline-none transition-all cursor-pointer"
                                  >
                                    <option value="">Update Status</option>
                                    {statusActions.map((action) => (
                                      <option key={action} value={action}>
                                        {action.charAt(0).toUpperCase() + action.slice(1)}
                                      </option>
                                    ))}
                                  </select>
                                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                                </div>
                              ) : (
                                <span className="text-xs text-gray-400">No actions</span>
                              )}
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            {/* ====== ORDER COUNT ====== */}
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50">
              <p className="text-sm text-gray-500">
                Showing {filteredOrders.length} of {orders.length} orders
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ====== ORDER DETAILS MODAL ====== */}
      <AnimatePresence>
        {showOrderModal && (
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
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              {orders.find(o => o.id === showOrderModal) && (
                <div className="p-6">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        Order #{orders.find(o => o.id === showOrderModal)?.order_number || showOrderModal.slice(0, 8)}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Placed on {new Date(orders.find(o => o.id === showOrderModal)?.created_at).toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={() => setShowOrderModal(null)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <XCircle className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>

                  {/* Order Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Customer Information
                      </h4>
                      <p className="text-sm text-gray-900">
                        {orders.find(o => o.id === showOrderModal)?.customer?.name || 'Customer'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {orders.find(o => o.id === showOrderModal)?.customer?.email || ''}
                      </p>
                      <p className="text-sm text-gray-500">
                        {orders.find(o => o.id === showOrderModal)?.customer?.phone || ''}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Delivery Address
                      </h4>
                      <p className="text-sm text-gray-900">
                        {orders.find(o => o.id === showOrderModal)?.delivery_address || 'No address provided'}
                      </p>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Package className="w-4 h-4" />
                      Order Items
                    </h4>
                    <div className="bg-gray-50 rounded-xl overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="text-left text-xs font-medium text-gray-500 px-4 py-2">Product</th>
                            <th className="text-right text-xs font-medium text-gray-500 px-4 py-2">Qty</th>
                            <th className="text-right text-xs font-medium text-gray-500 px-4 py-2">Price</th>
                            <th className="text-right text-xs font-medium text-gray-500 px-4 py-2">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orders.find(o => o.id === showOrderModal)?.items?.map((item: any, i: number) => (
                            <tr key={i} className="border-b border-gray-200 last:border-0">
                              <td className="px-4 py-2 text-sm text-gray-900">{item.product?.name || 'Product'}</td>
                              <td className="px-4 py-2 text-sm text-gray-700 text-right">{item.quantity}</td>
                              <td className="px-4 py-2 text-sm text-gray-700 text-right">KES {item.price}</td>
                              <td className="px-4 py-2 text-sm font-medium text-gray-900 text-right">KES {item.price * item.quantity}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="flex justify-between items-center border-t border-gray-200 pt-4">
                    <div>
                      <p className="text-sm text-gray-500">Order Status</p>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(orders.find(o => o.id === showOrderModal)?.status)}`}>
                        {orders.find(o => o.id === showOrderModal)?.status}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Total</p>
                      <p className="text-2xl font-bold text-agrivibe-green">
                        KES {orders.find(o => o.id === showOrderModal)?.total?.toLocaleString() || 0}
                      </p>
                    </div>
                  </div>

                  {/* Close Button */}
                  <button
                    onClick={() => setShowOrderModal(null)}
                    className="w-full mt-6 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                  >
                    Close
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </VendorLayout>
  );
}