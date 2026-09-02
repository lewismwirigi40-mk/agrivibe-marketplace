// src/pages/driver/deliveries.tsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Truck,
  Package,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Search,
  Filter,
  ChevronDown,
  ArrowUpDown,
  Eye,
  Navigation,
  Calendar,
  DollarSign,
  User,
  Phone,
  Mail,
  Sparkles,
  Award,
  TrendingUp,
  Star,
  Users
} from 'lucide-react';
import DriverLayout from '../../components/DriverLayout';
import Link from 'next/link';
import api from '../../services/api';

export default function DriverDeliveries() {
  const [deliveries, setDeliveries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [stats, setStats] = useState({
    total: 0,
    assigned: 0,
    inTransit: 0,
    delivered: 0,
  });

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const fetchDeliveries = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      const response = await api.get('/deliveries/my-deliveries');
      const deliveriesData = response.data.deliveries || [];
      setDeliveries(deliveriesData);

      // Calculate stats
      setStats({
        total: deliveriesData.length,
        assigned: deliveriesData.filter((d: any) => d.status === 'assigned').length,
        inTransit: deliveriesData.filter((d: any) => d.status === 'in_transit' || d.status === 'picked_up').length,
        delivered: deliveriesData.filter((d: any) => d.status === 'delivered').length,
      });
    } catch (error: any) {
      console.error('Failed to fetch deliveries:', error);
      setError(error.response?.data?.error || 'Failed to load deliveries');
    } finally {
      setLoading(false);
    }
  };

  const updateDeliveryStatus = async (id: string, status: string) => {
    try {
      await api.put(`/deliveries/${id}/status`, { status });
      await fetchDeliveries();
    } catch (error) {
      alert('Failed to update delivery status');
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'assigned': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'picked_up': 'bg-blue-100 text-blue-700 border-blue-200',
      'in_transit': 'bg-purple-100 text-purple-700 border-purple-200',
      'delivered': 'bg-green-100 text-green-700 border-green-200',
      'failed': 'bg-red-100 text-red-700 border-red-200',
      'cancelled': 'bg-gray-100 text-gray-700 border-gray-200',
    };
    return colors[status?.toLowerCase()] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const getStatusIcon = (status: string) => {
    const icons: Record<string, any> = {
      'assigned': Clock,
      'picked_up': Package,
      'in_transit': Navigation,
      'delivered': CheckCircle,
      'failed': XCircle,
      'cancelled': XCircle,
    };
    return icons[status?.toLowerCase()] || Clock;
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      'assigned': 'Assigned',
      'picked_up': 'Picked Up',
      'in_transit': 'In Transit',
      'delivered': 'Delivered',
      'failed': 'Failed',
      'cancelled': 'Cancelled',
    };
    return labels[status?.toLowerCase()] || status;
  };

  // Filter and sort deliveries
  const filteredDeliveries = deliveries
    .filter(delivery => {
      const matchesSearch =
        delivery.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        delivery.delivery_address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        delivery.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filter === 'all' || delivery.status === filter;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime();
        case 'fee-high':
          return (b.delivery_fee || 0) - (a.delivery_fee || 0);
        case 'fee-low':
          return (a.delivery_fee || 0) - (b.delivery_fee || 0);
        case 'newest':
        default:
          return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
      }
    });

  if (loading) {
    return (
      <DriverLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-agrivibe-green border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Loading deliveries...</p>
          </div>
        </div>
      </DriverLayout>
    );
  }

  if (error) {
    return (
      <DriverLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center text-red-500">
            <AlertCircle className="w-12 h-12 mx-auto mb-4" />
            <p className="text-lg font-medium">{error}</p>
            <button
              onClick={fetchDeliveries}
              className="mt-4 bg-agrivibe-green text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              Try Again
            </button>
          </div>
        </div>
      </DriverLayout>
    );
  }

  return (
    <DriverLayout>
      <div className="space-y-6">
        {/* ====== HEADER ====== */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Deliveries</h1>
            <p className="text-gray-500 mt-1">View all your assigned deliveries</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-medium">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              {stats.total} Total
            </span>
          </div>
        </div>

        {/* ====== STATS CARDS ====== */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total', value: stats.total, icon: Truck, color: 'from-blue-500 to-blue-600', bg: 'bg-blue-50' },
            { label: 'Assigned', value: stats.assigned, icon: Clock, color: 'from-yellow-500 to-orange-500', bg: 'bg-yellow-50' },
            { label: 'In Transit', value: stats.inTransit, icon: Navigation, color: 'from-purple-500 to-purple-600', bg: 'bg-purple-50' },
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
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by order ID, address, or customer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-agrivibe-green focus:ring-4 focus:ring-agrivibe-green/10 outline-none transition-all"
              />
            </div>

            {/* Status Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
              {['all', 'assigned', 'picked_up', 'in_transit', 'delivered', 'failed'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                    filter === f
                      ? 'bg-agrivibe-green text-white shadow-lg shadow-agrivibe-green/30'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {f === 'all' ? 'All' : getStatusLabel(f)}
                </button>
              ))}
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
                <option value="fee-high">Fee: High to Low</option>
                <option value="fee-low">Fee: Low to High</option>
              </select>
              <ArrowUpDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* ====== DELIVERIES LIST ====== */}
        {filteredDeliveries.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16 bg-white rounded-2xl shadow-md border border-gray-100"
          >
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-semibold text-gray-800">No deliveries found</h3>
            <p className="text-gray-500 mt-2">
              {searchTerm || filter !== 'all' ? 'Try adjusting your filters' : 'No deliveries assigned yet'}
            </p>
            {(searchTerm || filter !== 'all') && (
              <button
                onClick={() => { setSearchTerm(''); setFilter('all'); }}
                className="mt-4 text-agrivibe-green font-medium hover:underline"
              >
                Clear Filters
              </button>
            )}
          </motion.div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {filteredDeliveries.map((delivery, index) => {
                const StatusIcon = getStatusIcon(delivery.status);
                const statusColor = getStatusColor(delivery.status);
                const isActive = delivery.status !== 'delivered' && delivery.status !== 'failed' && delivery.status !== 'cancelled';

                return (
                  <motion.div
                    key={delivery.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white rounded-2xl shadow-md border border-gray-100 p-5 hover:shadow-xl transition-all duration-300 group"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      {/* Left Section */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="font-bold text-gray-900">
                            #{delivery.id?.slice(0, 8)}
                          </span>
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${statusColor}`}>
                            <StatusIcon className="w-3.5 h-3.5" />
                            {getStatusLabel(delivery.status)}
                          </span>
                          {delivery.is_urgent && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-600 rounded-full text-xs font-medium">
                              🔴 Urgent
                            </span>
                          )}
                        </div>

                        <div className="mt-2 space-y-1">
                          <p className="text-sm text-gray-600 flex items-start gap-2">
                            <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                            <span className="break-words">{delivery.delivery_address || 'Address not set'}</span>
                          </p>
                          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              {delivery.customer?.name || 'Customer'}
                            </span>
                            <span className="flex items-center gap-1">
                              <DollarSign className="w-4 h-4 text-agrivibe-green" />
                              <span className="font-semibold text-agrivibe-green">KES {delivery.delivery_fee || 0}</span>
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(delivery.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right Section - Actions */}
                      <div className="flex items-center gap-2 flex-wrap">
                        {isActive && (
                          <div className="relative">
                            <select
                              value={delivery.status}
                              onChange={(e) => updateDeliveryStatus(delivery.id, e.target.value)}
                              className="appearance-none px-3 py-2 pr-8 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:border-agrivibe-green focus:ring-2 focus:ring-agrivibe-green/20 outline-none transition-all cursor-pointer"
                            >
                              <option value="assigned">Assigned</option>
                              <option value="picked_up">Picked Up</option>
                              <option value="in_transit">In Transit</option>
                              <option value="delivered">✅ Delivered</option>
                              <option value="failed">❌ Failed</option>
                            </select>
                            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                          </div>
                        )}

                        <Link
                          href={`/driver/deliveries/${delivery.id}`}
                          className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-agrivibe-green to-emerald-500 text-white rounded-lg text-sm font-semibold hover:shadow-lg hover:shadow-agrivibe-green/30 transition-all duration-300 group-hover:scale-105"
                        >
                          <Eye className="w-4 h-4" />
                          Details
                        </Link>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    {isActive && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>Progress:</span>
                          <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                delivery.status === 'assigned' ? 'w-1/4 bg-yellow-400' :
                                delivery.status === 'picked_up' ? 'w-1/2 bg-blue-400' :
                                delivery.status === 'in_transit' ? 'w-3/4 bg-purple-400' :
                                'w-full bg-green-400'
                              }`}
                            />
                          </div>
                          <span className="font-medium text-gray-700">
                            {delivery.status === 'assigned' ? '25%' :
                             delivery.status === 'picked_up' ? '50%' :
                             delivery.status === 'in_transit' ? '75%' :
                             '100%'}
                          </span>
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {/* ====== DELIVERY COUNT ====== */}
        {filteredDeliveries.length > 0 && (
          <div className="text-center text-sm text-gray-500">
            Showing {filteredDeliveries.length} of {deliveries.length} deliveries
          </div>
        )}
      </div>
    </DriverLayout>
  );
}
