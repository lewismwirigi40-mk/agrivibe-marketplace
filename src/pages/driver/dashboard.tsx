// src/pages/driver/dashboard.tsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Truck, 
  Package, 
  CheckCircle, 
  Clock, 
  DollarSign,
  TrendingUp,
  Calendar,
  MapPin,
  User,
  Phone,
  Navigation,
  Sparkles,
  Award,
  Star,
  Users,
  ArrowRight,
  Bell,
  Settings,
  CreditCard,
  Wallet,
  BarChart3,
  Activity,
  Zap,
  Eye,
  Gift
} from 'lucide-react';
import DriverLayout from '../../components/DriverLayout';
import Link from 'next/link';
import api from '../../services/api';

export default function DriverDashboard() {
  const [todayDeliveries, setTodayDeliveries] = useState<any[]>([]);
  const [completedToday, setCompletedToday] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    inProgress: 0,
    completed: 0,
    rating: 0,
  });

  useEffect(() => {
    fetchDriverData();
  }, []);

  const fetchDriverData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      // Fetch driver's deliveries
      const deliveriesRes = await api.get('/deliveries/my-deliveries');
      const deliveries = deliveriesRes.data.deliveries || [];
      
      // Calculate stats
      const today = new Date().toISOString().split('T')[0];
      const todayDel = deliveries.filter((d: any) => 
        d.created_at?.startsWith(today)
      );
      
      setTodayDeliveries(todayDel);
      const completed = deliveries.filter((d: any) => d.status === 'delivered').length;
      setCompletedToday(completed);
      
      // Calculate earnings (delivery fees)
      const earnings = deliveries
        .filter((d: any) => d.status === 'delivered')
        .reduce((sum: number, d: any) => sum + parseFloat(d.delivery_fee || 0), 0);
      setTotalEarnings(earnings);
      
      // Set stats
      setStats({
        total: deliveries.length,
        inProgress: deliveries.filter((d: any) => d.status !== 'delivered' && d.status !== 'failed').length,
        completed: completed,
        rating: 4.8,
      });
      
    } catch (error: any) {
      console.error('Failed to fetch driver data:', error);
      setError(error.response?.data?.error || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'assigned': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'picked_up': 'bg-blue-100 text-blue-700 border-blue-200',
      'in_transit': 'bg-purple-100 text-purple-700 border-purple-200',
      'delivered': 'bg-green-100 text-green-700 border-green-200',
      'failed': 'bg-red-100 text-red-700 border-red-200',
    };
    return colors[status?.toLowerCase()] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const getStatusIcon = (status: string) => {
    const icons: Record<string, any> = {
      'assigned': Clock,
      'picked_up': Package,
      'in_transit': Navigation,
      'delivered': CheckCircle,
      'failed': Clock,
    };
    return icons[status?.toLowerCase()] || Clock;
  };

  if (loading) {
    return (
      <DriverLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-agrivibe-green border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Loading dashboard...</p>
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
              onClick={fetchDriverData}
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
            <h1 className="text-3xl font-bold text-gray-900">Driver Dashboard</h1>
            <p className="text-gray-500 mt-1">Welcome back! Here's your delivery overview</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-medium">
              <CheckCircle className="w-4 h-4" />
              {completedToday} Completed Today
            </span>
          </div>
        </div>

        {/* ====== STATS CARDS ====== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Today\'s Deliveries', value: todayDeliveries.length, icon: Truck, color: 'from-blue-500 to-blue-600', bg: 'bg-blue-50' },
            { label: 'Completed', value: completedToday, icon: CheckCircle, color: 'from-green-500 to-emerald-500', bg: 'bg-green-50' },
            { label: 'Total Earnings', value: `KES ${totalEarnings.toLocaleString()}`, icon: DollarSign, color: 'from-yellow-500 to-orange-500', bg: 'bg-yellow-50' },
            { label: 'Rating', value: `${stats.rating} ⭐`, icon: Star, color: 'from-purple-500 to-purple-600', bg: 'bg-purple-50' },
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`${stat.bg} rounded-2xl border border-gray-100 p-5 hover:shadow-lg transition-all duration-300`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ====== QUICK ACTIONS ====== */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'View Deliveries', icon: Truck, href: '/driver/deliveries', color: 'bg-blue-50 text-blue-600' },
            { label: 'Earnings', icon: Wallet, href: '/driver/earnings', color: 'bg-green-50 text-green-600' },
            { label: 'Profile', icon: User, href: '/driver/profile', color: 'bg-purple-50 text-purple-600' },
            { label: 'Settings', icon: Settings, href: '/driver/settings', color: 'bg-yellow-50 text-yellow-600' },
          ].map((action, index) => {
            const Icon = action.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.05 }}
                whileHover={{ scale: 1.05, y: -2 }}
              >
                <Link
                  href={action.href}
                  className={`${action.color} rounded-2xl p-5 text-center block transition-all duration-300 shadow-sm hover:shadow-md`}
                >
                  <Icon className="w-8 h-8 mx-auto mb-2" />
                  <span className="text-sm font-medium">{action.label}</span>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* ====== TODAY'S DELIVERIES ====== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-agrivibe-green to-emerald-500 rounded-xl flex items-center justify-center">
                <Package className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">Today's Deliveries</h2>
            </div>
            <Link 
              href="/driver/deliveries" 
              className="text-sm text-agrivibe-green hover:text-emerald-600 font-medium transition-colors flex items-center gap-1"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {todayDeliveries.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📭</div>
              <p className="text-gray-500 font-medium">No deliveries assigned for today</p>
              <p className="text-sm text-gray-400 mt-1">Check back later for new deliveries</p>
            </div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
                {todayDeliveries.slice(0, 5).map((delivery, index) => {
                  const StatusIcon = getStatusIcon(delivery.status);
                  return (
                    <motion.div
                      key={delivery.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-agrivibe-green/20 to-emerald-500/20 rounded-lg flex items-center justify-center">
                          <Package className="w-5 h-5 text-agrivibe-green" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            #{delivery.id?.slice(0, 8) || 'DEL-001'}
                          </p>
                          <p className="text-sm text-gray-500 truncate max-w-[200px]">
                            {delivery.delivery_address || 'Address not set'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(delivery.status)}`}>
                          <StatusIcon className="w-3.5 h-3.5" />
                          {delivery.status || 'assigned'}
                        </span>
                        <Link
                          href={`/driver/deliveries/${delivery.id}`}
                          className="p-2 text-gray-400 hover:text-agrivibe-green transition-colors rounded-lg hover:bg-green-50"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
              {todayDeliveries.length > 5 && (
                <div className="text-center text-sm text-gray-500 pt-2">
                  +{todayDeliveries.length - 5} more deliveries
                </div>
              )}
            </div>
          )}
        </motion.div>

        {/* ====== QUICK STATS ====== */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Deliveries', value: stats.total, icon: Truck, change: '+12%' },
            { label: 'In Progress', value: stats.inProgress, icon: Activity, change: '3 active' },
            { label: 'Completion Rate', value: `${stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%`, icon: TrendingUp, change: '+5%' },
            { label: 'Customer Rating', value: `${stats.rating} ⭐`, icon: Star, change: 'Excellent' },
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.05 }}
                className="bg-white rounded-2xl shadow-md border border-gray-100 p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                    <Icon className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{stat.label}</p>
                    <div className="flex items-center gap-2">
                      <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                      <span className="text-xs text-green-500">{stat.change}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </DriverLayout>
  );
}

// Add missing import
import { AlertCircle } from 'lucide-react';