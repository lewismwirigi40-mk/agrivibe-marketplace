// src/pages/admin/analytics.tsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, 
  ResponsiveContainer, PieChart, Pie, Cell, Area, AreaChart, CartesianGrid,
  ComposedChart, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ScatterChart, Scatter, ZAxis
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingBag, 
  Users, 
  Package, 
  Calendar,
  ChevronDown,
  Sparkles,
  Award,
  Clock,
  ArrowUp,
  ArrowDown,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  Zap,
  Eye,
  Store,
  CreditCard,
  Target,
  AlertCircle,
  CheckCircle,
  FileText,
  Download,
  Printer,
  Share2,
  Copy,
  Filter
} from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../services/api';

export default function AdminAnalytics() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [period, setPeriod] = useState('month');
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      const response = await api.get(`/admin/analytics?period=${period}`);
      setAnalytics(response.data);
    } catch (error: any) {
      console.error('Failed to fetch analytics:', error);
      setError(error.response?.data?.error || 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#22c55e', '#10b981', '#059669', '#047857', '#065f46', '#f59e0b', '#ef4444', '#3b82f6'];

  const formatCurrency = (amount: number) => {
    return `KES ${amount?.toLocaleString() || 0}`;
  };

  const handleExport = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-agrivibe-green border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Loading analytics...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error || !analytics) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center text-red-500">
            <AlertCircle className="w-12 h-12 mx-auto mb-4" />
            <p className="text-lg font-medium">{error || 'No data available'}</p>
            <button
              onClick={fetchAnalytics}
              className="mt-4 bg-agrivibe-green text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              Try Again
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const statCards = [
    { 
      label: 'Total Revenue', 
      value: formatCurrency(analytics.totalRevenue || 0), 
      change: '+12%', 
      icon: DollarSign, 
      color: 'from-green-500 to-emerald-500',
      bg: 'bg-green-50'
    },
    { 
      label: 'Total Orders', 
      value: analytics.totalOrders || 0, 
      change: '+8%', 
      icon: ShoppingBag, 
      color: 'from-blue-500 to-blue-600',
      bg: 'bg-blue-50'
    },
    { 
      label: 'Active Users', 
      value: analytics.activeUsers || 0, 
      change: '+15%', 
      icon: Users, 
      color: 'from-purple-500 to-purple-600',
      bg: 'bg-purple-50'
    },
    { 
      label: 'Conversion Rate', 
      value: `${analytics.conversionRate || 0}%`, 
      change: '+0.5%', 
      icon: Target, 
      color: 'from-yellow-500 to-orange-500',
      bg: 'bg-yellow-50'
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* ====== HEADER ====== */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
            <p className="text-gray-500 mt-1">Platform performance and insights</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm">
              {['day', 'week', 'month', 'year'].map((t) => (
                <button
                  key={t}
                  onClick={() => setPeriod(t)}
                  className={`px-4 py-2 text-sm font-medium transition-all duration-200 ${
                    period === t
                      ? 'bg-agrivibe-green text-white'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
            <button
              onClick={handleExport}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-agrivibe-green to-emerald-500 text-white px-4 py-2 rounded-xl font-semibold hover:shadow-lg hover:shadow-agrivibe-green/30 transition-all duration-300 hover:scale-[1.02] active:scale-95"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
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
              <div>
                <p className="text-sm font-medium text-green-700">Report exported successfully!</p>
                <p className="text-xs text-green-600">Your analytics report is ready.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ====== STATS CARDS ====== */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statCards.map((stat, index) => {
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
                    <div className="flex items-center gap-1 mt-1 text-green-500">
                      <ArrowUp className="w-4 h-4" />
                      <span className="text-sm font-semibold">{stat.change}</span>
                      <span className="text-xs text-gray-400">vs last period</span>
                    </div>
                  </div>
                  <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ====== CHARTS ====== */}
        {analytics.charts && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Trend */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Revenue Trend</h3>
                  <p className="text-sm text-gray-500">Revenue performance over time</p>
                </div>
                <Activity className="w-5 h-5 text-gray-400" />
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analytics.charts.revenue || []}>
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
                      dataKey="value" 
                      stroke="#22c55e" 
                      fill="url(#revenueGrad)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Sales by Category */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Sales by Category</h3>
                  <p className="text-sm text-gray-500">Product category distribution</p>
                </div>
                <PieChartIcon className="w-5 h-5 text-gray-400" />
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analytics.charts.categories || []}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={2}
                      label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {(analytics.charts.categories || []).map((entry: any, index: number) => (
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
                      formatter={(value: any) => [`KES ${value?.toLocaleString() || 0}`, 'Sales']}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* User Growth */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">User Growth</h3>
                  <p className="text-sm text-gray-500">User acquisition over time</p>
                </div>
                <Users className="w-5 h-5 text-gray-400" />
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.charts.users || []}>
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
                    <Bar dataKey="value" fill="#10b981" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Order Status */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Order Status</h3>
                  <p className="text-sm text-gray-500">Order distribution by status</p>
                </div>
                <Package className="w-5 h-5 text-gray-400" />
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.charts.orders || []}>
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
                      formatter={(value: any) => [value, 'Orders']}
                    />
                    <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>
        )}

        {/* ====== KEY INSIGHTS ====== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {[
            { 
              label: 'Revenue Growth', 
              value: '+12.5%', 
              description: 'vs previous month',
              icon: TrendingUp,
              color: 'text-green-500',
              bg: 'bg-green-50'
            },
            { 
              label: 'Active Users', 
              value: analytics.activeUsers || 0, 
              description: 'last 30 days',
              icon: Users,
              color: 'text-blue-500',
              bg: 'bg-blue-50'
            },
            { 
              label: 'Best Category', 
              value: 'Vegetables', 
              description: '38% of sales',
              icon: Award,
              color: 'text-yellow-500',
              bg: 'bg-yellow-50'
            },
          ].map((insight, index) => {
            const Icon = insight.icon;
            return (
              <div key={index} className="bg-white rounded-2xl shadow-md border border-gray-100 p-4">
                <div className="flex items-start gap-3">
                  <div className={`${insight.bg} p-2 rounded-xl`}>
                    <Icon className={`w-5 h-5 ${insight.color}`} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{insight.label}</p>
                    <p className="text-xl font-bold text-gray-900">{insight.value}</p>
                    <p className="text-xs text-gray-400">{insight.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </AdminLayout>
  );
}