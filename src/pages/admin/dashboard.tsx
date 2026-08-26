// src/pages/admin/dashboard.tsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
  CartesianGrid,
  ComposedChart
} from 'recharts';
import {
  Users,
  Store,
  Truck,
  User,
  Package,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Sparkles,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowRight,
  Shield,
  Award,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  Zap,
  Eye,
  ShoppingBag,
  CreditCard,
  Calendar,
  ChevronRight,
  Wallet,
  Building,
  Star,
  Crown,
  Bell,
  Settings,
  FileText
} from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../services/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [userGrowthData, setUserGrowthData] = useState<any[]>([]);
  const [orderStatusData, setOrderStatusData] = useState<any[]>([]);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      // Fetch dashboard stats
      const statsResponse = await api.get('/admin/dashboard');
      const statsData = statsResponse.data.stats || {};
      setStats(statsData);

      // Fetch analytics data
      const analyticsResponse = await api.get('/admin/analytics');
      const data = analyticsResponse.data || {};

      // Set chart data with real or empty arrays
      setRevenueData(data.revenue || []);
      setUserGrowthData(data.userGrowth || []);
      setOrderStatusData(data.orderStatus || []);

      // ✅ Fetch real recent activities from backend
      try {
        const activitiesResponse = await api.get('/admin/recent-activities');
        setRecentActivities(activitiesResponse.data.activities || []);
      } catch (err) {
        console.error('Failed to fetch recent activities:', err);
        setRecentActivities([]);
      }

    } catch (error: any) {
      console.error('Failed to fetch dashboard data:', error);
      setError(error.response?.data?.error || 'Failed to load dashboard');
      // Set empty data on error
      setRevenueData([]);
      setUserGrowthData([]);
      setOrderStatusData([]);
      setRecentActivities([]);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#22c55e', '#10b981', '#059669', '#047857', '#f59e0b', '#ef4444', '#3b82f6'];

  const formatCurrency = (amount: number) => {
    return `KES ${amount?.toLocaleString() || 0}`;
  };

  const getActivityIcon = (type: string) => {
    const icons: Record<string, any> = {
      'vendor_registered': Store,
      'order_delivered': CheckCircle,
      'customer_joined': User,
      'product_approved': Package,
      'order_placed': ShoppingBag,
      'payment_received': CreditCard,
      'vendor_approved': Award,
    };
    return icons[type] || Activity;
  };

  const getActivityColor = (type: string) => {
    const colors: Record<string, string> = {
      'vendor_registered': 'text-green-500 bg-green-50',
      'order_delivered': 'text-blue-500 bg-blue-50',
      'customer_joined': 'text-purple-500 bg-purple-50',
      'product_approved': 'text-yellow-500 bg-yellow-50',
      'order_placed': 'text-orange-500 bg-orange-50',
      'payment_received': 'text-emerald-500 bg-emerald-50',
      'vendor_approved': 'text-indigo-500 bg-indigo-50',
    };
    return colors[type] || 'text-gray-500 bg-gray-50';
  };

  const formatTimeAgo = (dateString: string) => {
    if (!dateString) return 'Just now';
    const now = new Date();
    const past = new Date(dateString);
    const diffMinutes = Math.floor((now.getTime() - past.getTime()) / 60000);

    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes} min ago`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)} hours ago`;
    return `${Math.floor(diffMinutes / 1440)} days ago`;
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-agrivibe-green border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Loading dashboard...</p>
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
              onClick={fetchDashboardData}
              className="mt-4 bg-agrivibe-green text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              Try Again
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!stats) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center text-gray-500">
            <Package className="w-12 h-12 mx-auto mb-4" />
            <p className="text-lg font-medium">No data available</p>
            <p className="text-sm mt-1">Start your platform to see analytics</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const statCards = [
    { label: 'Total Users', value: stats.totalUsers || 0, icon: Users, color: 'from-blue-500 to-blue-600', bg: 'bg-blue-50' },
    { label: 'Vendors', value: stats.totalVendors || 0, icon: Store, color: 'from-green-500 to-emerald-500', bg: 'bg-green-50' },
    { label: 'Drivers', value: stats.totalDrivers || 0, icon: Truck, color: 'from-purple-500 to-purple-600', bg: 'bg-purple-50' },
    { label: 'Customers', value: stats.totalCustomers || 0, icon: User, color: 'from-yellow-500 to-orange-500', bg: 'bg-yellow-50' },
    { label: 'Total Orders', value: stats.totalOrders || 0, icon: Package, color: 'from-indigo-500 to-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Total Revenue', value: formatCurrency(stats.totalRevenue || 0), icon: DollarSign, color: 'from-emerald-500 to-green-500', bg: 'bg-emerald-50' },
    { label: 'Platform Wallet', value: formatCurrency(stats.platformWallet || 0), icon: Wallet, color: 'from-yellow-500 to-orange-500', bg: 'bg-yellow-50' },
    { label: 'Pending Approvals', value: (stats.pendingVendors || 0) + (stats.pendingProducts || 0), icon: Clock, color: 'from-red-500 to-red-600', bg: 'bg-red-50' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* ====== HEADER ====== */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-500 mt-1">Platform overview and key metrics</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm">
              {['day', 'week', 'month', 'year'].map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedPeriod(t)}
                  className={`px-4 py-2 text-sm font-medium transition-all duration-200 ${
                    selectedPeriod === t
                      ? 'bg-agrivibe-green text-white'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-yellow-50 text-yellow-700 rounded-full text-sm font-medium border border-yellow-200">
                <Clock className="w-4 h-4" />
                {stats.pendingVendors || 0} Pending Vendors
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-200">
                <Package className="w-4 h-4" />
                {stats.pendingProducts || 0} Pending Products
              </span>
            </div>
          </div>
        </div>

        {/* ====== STATS CARDS ====== */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
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

        {/* ====== CHARTS ROW ====== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Revenue Trend</h3>
                <p className="text-sm text-gray-500">Monthly revenue performance</p>
              </div>
              <Activity className="w-5 h-5 text-gray-400" />
            </div>
            <div className="h-64">
              {revenueData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData}>
                    <defs>
                      <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis dataKey="label" stroke="#9ca3af" fontSize={12} />
                    <YAxis stroke="#9ca3af" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '12px',
                        boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
                      }}
                      formatter={(value: any) => [`KES ${value?.toLocaleString() || 0}`, 'Revenue']}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#22c55e"
                      fill="url(#revenueGrad)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  No revenue data available
                </div>
              )}
            </div>
          </motion.div>

          {/* User Growth */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">User Growth</h3>
                <p className="text-sm text-gray-500">Monthly user acquisition</p>
              </div>
              <Users className="w-5 h-5 text-gray-400" />
            </div>
            <div className="h-64">
              {userGrowthData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={userGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis dataKey="label" stroke="#9ca3af" fontSize={12} />
                    <YAxis stroke="#9ca3af" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '12px',
                        boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
                      }}
                      formatter={(value: any) => [value, 'New Users']}
                    />
                    <Bar dataKey="users" fill="#10b981" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  No user growth data available
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* ====== SECOND ROW ====== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Order Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Order Status Distribution</h3>
                <p className="text-sm text-gray-500">Current order breakdown</p>
              </div>
              <PieChartIcon className="w-5 h-5 text-gray-400" />
            </div>
            <div className="h-64">
              {orderStatusData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={orderStatusData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={2}
                      label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {orderStatusData.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '12px',
                        boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
                      }}
                      formatter={(value: any) => [value, 'Orders']}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  No order status data available
                </div>
              )}
            </div>
          </motion.div>

          {/* Quick Actions - REAL DATA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-xl flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Quick Actions</h3>
            </div>
            <div className="space-y-3">
              {[
                {
                  label: 'Review Pending Vendors',
                  icon: Store,
                  count: stats.pendingVendors || 0,
                  color: 'text-yellow-500',
                  bg: 'bg-yellow-50',
                  href: '/admin/vendors?filter=pending'
                },
                {
                  label: 'Approve Pending Products',
                  icon: Package,
                  count: stats.pendingProducts || 0,
                  color: 'text-blue-500',
                  bg: 'bg-blue-50',
                  href: '/admin/products?filter=pending'
                },
                {
                  label: 'View Platform Wallet',
                  icon: Wallet,
                  count: formatCurrency(stats.platformWallet || 0),
                  color: 'text-green-500',
                  bg: 'bg-green-50',
                  href: '/admin/payments'
                },
                {
                  label: 'Generate Full Report',
                  icon: FileText,
                  count: 'Export',
                  color: 'text-purple-500',
                  bg: 'bg-purple-50',
                  href: '/admin/reports'
                },
              ].map((action, index) => {
                const Icon = action.icon;
                return (
                  <button
                    key={index}
                    onClick={() => router.push(action.href)}
                    className={`w-full ${action.bg} rounded-xl p-3 flex items-center justify-between hover:shadow-md transition-all duration-300 group`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 ${action.bg} rounded-lg flex items-center justify-center`}>
                        <Icon className={`w-4 h-4 ${action.color}`} />
                      </div>
                      <span className="text-sm font-medium text-gray-700">{action.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-bold ${action.color}`}>{action.count}</span>
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 group-hover:translate-x-1 transition-all" />
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* ====== RECENT ACTIVITY - REAL DATA FROM BACKEND ====== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
              <p className="text-sm text-gray-500">Latest platform events</p>
            </div>
            <Bell className="w-5 h-5 text-gray-400" />
          </div>
          {recentActivities.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Activity className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No recent activities</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentActivities.slice(0, 5).map((activity, index) => {
                const Icon = getActivityIcon(activity.type);
                const colorClass = getActivityColor(activity.type);
                return (
                  <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className={`w-10 h-10 ${colorClass} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                      <p className="text-xs text-gray-500">{activity.user}</p>
                    </div>
                    <span className="text-xs text-gray-400">{formatTimeAgo(activity.created_at)}</span>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </AdminLayout>
  );
}

// Add missing imports
import { useRouter } from 'next/router';
import { Package } from 'lucide-react';