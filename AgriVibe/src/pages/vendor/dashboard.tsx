// src/pages/admin/dashboard.tsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, 
  ResponsiveContainer, PieChart, Pie, Cell, Area, AreaChart, CartesianGrid,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
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
  ChevronRight
} from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../services/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      const response = await api.get('/admin/dashboard');
      setStats(response.data.stats);
    } catch (error: any) {
      console.error('Failed to fetch dashboard:', error);
      setError(error.response?.data?.error || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  // Sample chart data
  const revenueData = [
    { day: 'Mon', revenue: 12000, orders: 45 },
    { day: 'Tue', revenue: 18000, orders: 62 },
    { day: 'Wed', revenue: 15000, orders: 51 },
    { day: 'Thu', revenue: 22000, orders: 78 },
    { day: 'Fri', revenue: 28000, orders: 95 },
    { day: 'Sat', revenue: 20000, orders: 68 },
    { day: 'Sun', revenue: 16000, orders: 54 },
  ];

  const categoryData = [
    { name: 'Vegetables', value: 35 },
    { name: 'Fruits', value: 25 },
    { name: 'Meat', value: 20 },
    { name: 'Dairy', value: 12 },
    { name: 'Other', value: 8 },
  ];

  const COLORS = ['#22c55e', '#10b981', '#059669', '#047857', '#065f46'];

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
              onClick={fetchDashboard}
              className="mt-4 btn-premium"
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
    { label: 'Orders', value: stats.totalOrders || 0, icon: Package, color: 'from-indigo-500 to-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Revenue', value: `KES ${(stats.totalRevenue || 0).toLocaleString()}`, icon: DollarSign, color: 'from-emerald-500 to-green-500', bg: 'bg-emerald-50' },
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
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-medium">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Live
            </span>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:border-agrivibe-green outline-none"
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
          </div>
        </div>

        {/* ====== STATS CARDS ====== */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`${stat.bg} rounded-2xl border border-gray-100 p-4 hover:shadow-lg transition-all duration-300 group`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-500">{stat.label}</p>
                    <p className="text-xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  </div>
                  <div className={`w-10 h-10 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ====== CHARTS ROW ====== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
          >
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Revenue Overview</h3>
                <p className="text-sm text-gray-500">Daily revenue and orders</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  <span className="w-3 h-0.5 bg-agrivibe-green" />
                  Revenue
                </span>
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  <span className="w-3 h-0.5 bg-blue-400" />
                  Orders
                </span>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
                  <YAxis yAxisId="left" stroke="#94a3b8" fontSize={12} />
                  <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '12px',
                      boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Area 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#22c55e" 
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                  />
                  <Area 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="orders" 
                    stroke="#3b82f6" 
                    fillOpacity={1}
                    fill="url(#colorOrders)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Category Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
          >
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Categories</h3>
                <p className="text-sm text-gray-500">Product distribution</p>
              </div>
              <PieChartIcon className="w-5 h-5 text-gray-400" />
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
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
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-3 mt-2">
              {categoryData.map((item, index) => (
                <div key={index} className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                  <span className="text-xs text-gray-600">{item.name}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ====== QUICK ACTIONS & STATS ====== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
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
                { label: 'Review Pending Vendors', icon: Store, color: 'text-yellow-500', bg: 'bg-yellow-50', count: stats.pendingVendors || 0 },
                { label: 'Approve Pending Products', icon: Package, color: 'text-blue-500', bg: 'bg-blue-50', count: stats.pendingProducts || 0 },
                { label: 'View Platform Wallet', icon: DollarSign, color: 'text-green-500', bg: 'bg-green-50', count: `KES ${(stats.platformWallet || 0).toLocaleString()}` },
              ].map((action, index) => {
                const Icon = action.icon;
                return (
                  <button
                    key={index}
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

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Activity className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Platform Insights</h3>
            </div>
            <div className="space-y-4">
              {[
                { label: 'Pending Vendors', value: stats.pendingVendors || 0, icon: Store, color: 'text-yellow-500' },
                { label: 'Pending Products', value: stats.pendingProducts || 0, icon: Package, color: 'text-blue-500' },
                { label: 'Platform Wallet', value: `KES ${(stats.platformWallet || 0).toLocaleString()}`, icon: DollarSign, color: 'text-green-500' },
                { label: 'Total Revenue', value: `KES ${(stats.totalRevenue || 0).toLocaleString()}`, icon: TrendingUp, color: 'text-emerald-500' },
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                        <Icon className={`w-4 h-4 ${item.color}`} />
                      </div>
                      <span className="text-sm text-gray-600">{item.label}</span>
                    </div>
                    <span className={`text-sm font-bold ${item.color}`}>{item.value}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* ====== FOOTER ====== */}
        <div className="text-center text-sm text-gray-400 pt-4 border-t border-gray-100">
          <p>© 2026 AgriVibe KE Farm Solutions. All rights reserved.</p>
        </div>
      </div>
    </AdminLayout>
  );
}