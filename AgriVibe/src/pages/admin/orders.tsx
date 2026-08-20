// src/pages/admin/orders.tsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, 
  Package, 
  Clock, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  Search,
  Filter,
  ChevronDown,
  ArrowUpDown,
  Eye,
  User,
  Store,
  Calendar,
  DollarSign,
  Truck,
  Sparkles,
  Award,
  Shield,
  Users,
  Building,
  FileText,
  MapPin,
  Phone,
  Mail,
  Trash2,
  Printer,
  Download
} from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../services/api';

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

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
      const response = await api.get('/admin/orders');
      const ordersData = response.data.orders || [];
      setOrders(ordersData);
      setFilteredOrders(ordersData);
    } catch (error: any) {
      console.error('Failed to fetch orders:', error);
      setError(error.response?.data?.error || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (id: string, status: string) => {
    try {
      await api.put(`/admin/orders/${id}`, { status });
      setSuccessMessage(`✅ Order status updated to ${status}`);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      fetchOrders();
    } catch (error) {
      alert('Failed to update order status');
    }
  };

  const deleteOrder = async (id: string) => {
    try {
      await api.delete(`/admin/orders/${id}`);
      await fetchOrders();
      setShowDeleteModal(null);
      setSuccessMessage('🗑️ Order deleted successfully');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      alert('Failed to delete order');
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

  const formatCurrency = (amount: number) => {
    return `KES ${amount?.toLocaleString() || 0}`;
  };

  // Filter and sort orders
  useEffect(() => {
    let result = [...orders];

    if (search.trim()) {
      result = result.filter(order =>
        order.order_number?.toLowerCase().includes(search.toLowerCase()) ||
        order.customer?.first_name?.toLowerCase().includes(search.toLowerCase()) ||
        order.customer?.last_name?.toLowerCase().includes(search.toLowerCase()) ||
        order.store?.store_name?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (filter !== 'all') {
      result = result.filter(order => order.status === filter);
    }

    switch (sortBy) {
      case 'oldest':
        result.sort((a, b) => new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime());
        break;
      case 'amount-high':
        result.sort((a, b) => (b.total || 0) - (a.total || 0));
        break;
      case 'amount-low':
        result.sort((a, b) => (a.total || 0) - (b.total || 0));
        break;
      case 'newest':
      default:
        result.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
        break;
    }

    setFilteredOrders(result);
  }, [search, filter, sortBy, orders]);

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
  };

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-agrivibe-green border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Loading orders...</p>
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
              onClick={fetchOrders}
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
            <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
            <p className="text-gray-500 mt-1">View all platform orders</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-agrivibe-green/10 text-agrivibe-green rounded-full text-sm font-medium">
              <ShoppingBag className="w-4 h-4" />
              {stats.total} Total Orders
            </span>
          </div>
        </div>

        {/* ====== SUCCESS TOAST ====== */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3"
            >
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm font-medium text-green-700">{successMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ====== STATS CARDS ====== */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: 'Total', value: stats.total, icon: ShoppingBag, color: 'from-blue-500 to-blue-600', bg: 'bg-blue-50' },
            { label: 'Pending', value: stats.pending, icon: Clock, color: 'from-yellow-500 to-orange-500', bg: 'bg-yellow-50' },
            { label: 'Processing', value: stats.processing, icon: Package, color: 'from-purple-500 to-purple-600', bg: 'bg-purple-50' },
            { label: 'Shipped', value: stats.shipped, icon: Truck, color: 'from-indigo-500 to-indigo-600', bg: 'bg-indigo-50' },
            { label: 'Delivered', value: stats.delivered, icon: CheckCircle, color: 'from-green-500 to-emerald-500', bg: 'bg-green-50' },
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
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by order ID, customer or vendor..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-agrivibe-green focus:ring-4 focus:ring-agrivibe-green/10 outline-none transition-all"
              />
            </div>

            <div className="relative sm:w-48">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full appearance-none px-4 py-2.5 pr-10 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:border-agrivibe-green focus:ring-4 focus:ring-agrivibe-green/10 outline-none transition-all cursor-pointer"
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

            <div className="relative sm:w-48">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full appearance-none px-4 py-2.5 pr-10 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:border-agrivibe-green focus:ring-4 focus:ring-agrivibe-green/10 outline-none transition-all cursor-pointer"
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 bg-white rounded-2xl shadow-md border border-gray-100"
          >
            <div className="text-8xl mb-6">📋</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">No orders found</h3>
            <p className="text-gray-500 text-lg">
              {search || filter !== 'all' ? 'Try adjusting your filters' : 'No orders placed yet'}
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
                    <th className="text-left text-sm font-semibold text-gray-600 px-6 py-4">Order ID</th>
                    <th className="text-left text-sm font-semibold text-gray-600 px-6 py-4">Customer</th>
                    <th className="text-left text-sm font-semibold text-gray-600 px-6 py-4">Vendor</th>
                    <th className="text-left text-sm font-semibold text-gray-600 px-6 py-4">Total</th>
                    <th className="text-left text-sm font-semibold text-gray-600 px-6 py-4">Status</th>
                    <th className="text-left text-sm font-semibold text-gray-600 px-6 py-4">Date</th>
                    <th className="text-right text-sm font-semibold text-gray-600 px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {filteredOrders.map((order, index) => {
                      const StatusIcon = getStatusIcon(order.status);
                      const statusColor = getStatusColor(order.status);
                      
                      return (
                        <motion.tr
                          key={order.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ delay: index * 0.03 }}
                          className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors group"
                        >
                          <td className="px-6 py-4">
                            <span className="font-medium text-gray-900">#{order.order_number}</span>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm text-gray-900">
                              {order.customer?.first_name} {order.customer?.last_name}
                            </p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm text-gray-600">{order.store?.store_name || 'N/A'}</p>
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-bold text-agrivibe-green">{formatCurrency(order.total)}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${statusColor}`}>
                              <StatusIcon className="w-3.5 h-3.5" />
                              {order.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm text-gray-500">
                              {new Date(order.created_at).toLocaleDateString()}
                            </p>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <div className="relative">
                                <select
                                  value={order.status}
                                  onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                  className="appearance-none px-3 py-1.5 pr-8 bg-gray-100 border border-gray-200 rounded-lg text-sm text-gray-700 focus:border-agrivibe-green focus:ring-2 focus:ring-agrivibe-green/20 outline-none transition-all cursor-pointer"
                                >
                                  {statusOptions.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                      {opt.label}
                                    </option>
                                  ))}
                                </select>
                                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                              </div>
                              <button
                                onClick={() => {
                                  setSelectedOrder(order);
                                  setShowOrderModal(true);
                                }}
                                className="p-2 text-gray-400 hover:text-agrivibe-green transition-colors rounded-lg hover:bg-green-50"
                                title="View Details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setShowDeleteModal(order.id)}
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
        {showOrderModal && selectedOrder && (
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
                    <h3 className="text-xl font-bold text-gray-900">
                      Order #{selectedOrder.order_number}
                    </h3>
                    <p className="text-sm text-gray-500">Order Details</p>
                  </div>
                  <button
                    onClick={() => setShowOrderModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <XCircle className="w-5 h-5 text-gray-400" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Customer Information
                    </h4>
                    <p className="text-sm text-gray-900">
                      {selectedOrder.customer?.first_name} {selectedOrder.customer?.last_name}
                    </p>
                    <p className="text-sm text-gray-500">{selectedOrder.customer?.email}</p>
                    <p className="text-sm text-gray-500">{selectedOrder.customer?.phone}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Store className="w-4 h-4" />
                      Vendor Information
                    </h4>
                    <p className="text-sm text-gray-900">{selectedOrder.store?.store_name || 'N/A'}</p>
                    <p className="text-sm text-gray-500">{selectedOrder.store?.vendor?.email || ''}</p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Delivery Address
                  </h4>
                  <p className="text-sm text-gray-900">{selectedOrder.delivery_address || 'No address provided'}</p>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500">Order Status</p>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedOrder.status)}`}>
                        {selectedOrder.status}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total</p>
                      <p className="text-2xl font-bold text-agrivibe-green">
                        {formatCurrency(selectedOrder.total)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Date</p>
                      <p className="text-sm font-medium text-gray-900">
                        {new Date(selectedOrder.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setShowOrderModal(false)}
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
                <h3 className="text-xl font-bold text-gray-900">Delete Order?</h3>
                <p className="text-gray-500 mt-2 text-sm">
                  This will permanently delete this order and all its data. This action cannot be undone.
                </p>
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowDeleteModal(null)}
                    className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => deleteOrder(showDeleteModal)}
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