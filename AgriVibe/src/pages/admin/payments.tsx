// src/pages/admin/payments.tsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CreditCard, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  Search,
  Filter,
  ChevronDown,
  ArrowUpDown,
  Eye,
  Building,
  Calendar,
  TrendingUp,
  Shield,
  Award,
  Sparkles,
  Users,
  Wallet,
  Banknote,
  Receipt,
  FileText,
  Check,
  X,
  Trash2
} from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../services/api';

export default function AdminPayments() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const [stats, setStats] = useState({
    totalRevenue: 0,
    platformCommission: 0,
    pendingPayments: 0,
    completedPayments: 0,
  });

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      const response = await api.get('/admin/payments');
      const paymentsData = response.data.payments || [];
      setPayments(paymentsData);
      
      // Calculate stats
      const total = paymentsData.reduce((sum: number, p: any) => sum + parseFloat(p.amount), 0);
      const pending = paymentsData.filter((p: any) => p.status === 'pending').length;
      const completed = paymentsData.filter((p: any) => p.status === 'completed').length;
      
      setStats({
        totalRevenue: total,
        platformCommission: total * 0.1,
        pendingPayments: pending,
        completedPayments: completed,
      });
    } catch (error: any) {
      console.error('Failed to fetch payments:', error);
      setError(error.response?.data?.error || 'Failed to load payments');
    } finally {
      setLoading(false);
    }
  };

  const approvePayment = async (id: string) => {
    if (!confirm('Approve this payment?')) return;
    try {
      await api.put(`/admin/payments/${id}/approve`);
      setSuccessMessage('✅ Payment approved successfully!');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      fetchPayments();
    } catch (error) {
      alert('Failed to approve payment');
    }
  };

  const rejectPayment = async (id: string) => {
    if (!confirm('Reject this payment?')) return;
    try {
      await api.put(`/admin/payments/${id}/reject`);
      setSuccessMessage('❌ Payment rejected');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      fetchPayments();
    } catch (error) {
      alert('Failed to reject payment');
    }
  };

  const deletePayment = async (id: string) => {
    try {
      await api.delete(`/admin/payments/${id}`);
      await fetchPayments();
      setShowDeleteModal(null);
      setSuccessMessage('🗑️ Payment deleted');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      alert('Failed to delete payment');
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'completed': 'bg-green-100 text-green-700 border-green-200',
      'pending': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'failed': 'bg-red-100 text-red-700 border-red-200',
    };
    return colors[status?.toLowerCase()] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const getStatusIcon = (status: string) => {
    const icons: Record<string, any> = {
      'completed': CheckCircle,
      'pending': Clock,
      'failed': XCircle,
    };
    return icons[status?.toLowerCase()] || Clock;
  };

  const formatCurrency = (amount: number) => {
    return `KES ${amount?.toLocaleString() || 0}`;
  };

  // Filter and sort payments
  const filteredPayments = payments
    .filter(payment => {
      const matchesSearch = 
        payment.id?.toLowerCase().includes(search.toLowerCase()) ||
        payment.vendor?.store_name?.toLowerCase().includes(search.toLowerCase()) ||
        payment.order_id?.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'amount-high':
          return (b.amount || 0) - (a.amount || 0);
        case 'amount-low':
          return (a.amount || 0) - (b.amount || 0);
        case 'oldest':
          return new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime();
        case 'newest':
        default:
          return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
      }
    });

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-agrivibe-green border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Loading payments...</p>
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
              onClick={fetchPayments}
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
            <h1 className="text-3xl font-bold text-gray-900">Payments</h1>
            <p className="text-gray-500 mt-1">View all platform payments and withdrawals</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-agrivibe-green/10 text-agrivibe-green rounded-full text-sm font-medium">
              <CreditCard className="w-4 h-4" />
              {payments.length} Total Payments
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Revenue', value: formatCurrency(stats.totalRevenue), icon: DollarSign, color: 'from-green-500 to-emerald-500', bg: 'bg-green-50' },
            { label: 'Platform Commission', value: formatCurrency(stats.platformCommission), icon: Banknote, color: 'from-blue-500 to-blue-600', bg: 'bg-blue-50' },
            { label: 'Pending', value: stats.pendingPayments, icon: Clock, color: 'from-yellow-500 to-orange-500', bg: 'bg-yellow-50' },
            { label: 'Completed', value: stats.completedPayments, icon: CheckCircle, color: 'from-purple-500 to-purple-600', bg: 'bg-purple-50' },
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
                placeholder="Search by payment ID, order ID or vendor..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-agrivibe-green focus:ring-4 focus:ring-agrivibe-green/10 outline-none transition-all"
              />
            </div>

            <div className="relative sm:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full appearance-none px-4 py-2.5 pr-10 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:border-agrivibe-green focus:ring-4 focus:ring-agrivibe-green/10 outline-none transition-all cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="pending">⏳ Pending</option>
                <option value="completed">✅ Completed</option>
                <option value="failed">❌ Failed</option>
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

        {/* ====== PAYMENTS TABLE ====== */}
        {filteredPayments.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 bg-white rounded-2xl shadow-md border border-gray-100"
          >
            <div className="text-8xl mb-6">💳</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">No payments found</h3>
            <p className="text-gray-500 text-lg">
              {search || statusFilter !== 'all' ? 'Try adjusting your filters' : 'Payments will appear here when orders are completed'}
            </p>
            {(search || statusFilter !== 'all') && (
              <button
                onClick={() => { setSearch(''); setStatusFilter('all'); }}
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
                    <th className="text-left text-sm font-semibold text-gray-600 px-6 py-4">Payment ID</th>
                    <th className="text-left text-sm font-semibold text-gray-600 px-6 py-4">Order ID</th>
                    <th className="text-left text-sm font-semibold text-gray-600 px-6 py-4">Vendor</th>
                    <th className="text-left text-sm font-semibold text-gray-600 px-6 py-4">Amount</th>
                    <th className="text-left text-sm font-semibold text-gray-600 px-6 py-4">Status</th>
                    <th className="text-left text-sm font-semibold text-gray-600 px-6 py-4">Date</th>
                    <th className="text-right text-sm font-semibold text-gray-600 px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {filteredPayments.map((payment, index) => {
                      const StatusIcon = getStatusIcon(payment.status);
                      const statusColor = getStatusColor(payment.status);
                      const isPending = payment.status === 'pending';
                      
                      return (
                        <motion.tr
                          key={payment.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ delay: index * 0.03 }}
                          className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors group"
                        >
                          <td className="px-6 py-4">
                            <span className="font-medium text-gray-900">
                              #{payment.id?.slice(0, 8) || 'N/A'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-600">{payment.order_id || 'N/A'}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-900">{payment.vendor?.store_name || 'N/A'}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-bold text-agrivibe-green">{formatCurrency(payment.amount)}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${statusColor}`}>
                              <StatusIcon className="w-3.5 h-3.5" />
                              {payment.status || 'pending'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm text-gray-500">
                              {new Date(payment.created_at).toLocaleDateString()}
                            </p>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              {isPending ? (
                                <>
                                  <button
                                    onClick={() => approvePayment(payment.id)}
                                    className="p-2 text-green-600 hover:text-green-700 transition-colors rounded-lg hover:bg-green-50"
                                    title="Approve"
                                  >
                                    <Check className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => rejectPayment(payment.id)}
                                    className="p-2 text-red-600 hover:text-red-700 transition-colors rounded-lg hover:bg-red-50"
                                    title="Reject"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </>
                              ) : (
                                <button
                                  onClick={() => {
                                    setSelectedPayment(payment);
                                    setShowPaymentModal(true);
                                  }}
                                  className="p-2 text-gray-400 hover:text-agrivibe-green transition-colors rounded-lg hover:bg-green-50"
                                  title="View Details"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                              )}
                              <button
                                onClick={() => setShowDeleteModal(payment.id)}
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
                Showing {filteredPayments.length} of {payments.length} payments
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ====== PAYMENT DETAILS MODAL ====== */}
      <AnimatePresence>
        {showPaymentModal && selectedPayment && (
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
                      Payment #{selectedPayment.id?.slice(0, 8)}
                    </h3>
                    <p className="text-sm text-gray-500">Payment Details</p>
                  </div>
                  <button
                    onClick={() => setShowPaymentModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <XCircle className="w-5 h-5 text-gray-400" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Payment Information
                    </h4>
                    <p className="text-sm text-gray-900">Amount: <span className="font-bold text-agrivibe-green">{formatCurrency(selectedPayment.amount)}</span></p>
                    <p className="text-sm text-gray-500">Order: {selectedPayment.order_id || 'N/A'}</p>
                    <p className="text-sm text-gray-500">Status: {selectedPayment.status}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Building className="w-4 h-4" />
                      Vendor Information
                    </h4>
                    <p className="text-sm text-gray-900">{selectedPayment.vendor?.store_name || 'N/A'}</p>
                    <p className="text-sm text-gray-500">{selectedPayment.vendor?.email || ''}</p>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500">Date</p>
                      <p className="text-sm font-medium text-gray-900">
                        {new Date(selectedPayment.created_at).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Type</p>
                      <p className="text-sm font-medium text-gray-900">{selectedPayment.type || 'Payment'}</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setShowPaymentModal(false)}
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
                <h3 className="text-xl font-bold text-gray-900">Delete Payment?</h3>
                <p className="text-gray-500 mt-2 text-sm">
                  This will permanently delete this payment record. This action cannot be undone.
                </p>
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowDeleteModal(null)}
                    className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => deletePayment(showDeleteModal)}
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