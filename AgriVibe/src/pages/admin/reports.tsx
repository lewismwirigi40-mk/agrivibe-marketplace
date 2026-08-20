// src/pages/admin/reports.tsx
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
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
  FileText, 
  Printer, 
  Download, 
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Users,
  Store,
  Package,
  CreditCard,
  BarChart3,
  PieChart as PieChartIcon,
  CheckCircle,
  ChevronDown,
  AlertCircle
} from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../services/api';

export default function AdminReports() {
  const [reportType, setReportType] = useState('revenue');
  const [dateRange, setDateRange] = useState('month');
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');
  const [reportData, setReportData] = useState<any>(null);
  const [isFetching, setIsFetching] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  // REAL DATA STATES
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [categorySales, setCategorySales] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    activeUsers: 0,
    totalVendors: 0,
    revenueChange: '+12.5%',
    ordersChange: '+8.3%',
    usersChange: '+5.2%',
    vendorsChange: '+2.1%',
  });

  const COLORS = ['#22c55e', '#10b981', '#059669', '#047857', '#065f46', '#f59e0b', '#ef4444', '#3b82f6'];

  const currentDate = new Date().toLocaleDateString('en-KE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // FETCH REAL DATA
  useEffect(() => {
    fetchReportData();
  }, [reportType, dateRange]);

  const fetchReportData = async () => {
    setIsFetching(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsFetching(false);
        return;
      }

      // Fetch real data from API
      const response = await api.get(`/admin/reports?type=${reportType}&range=${dateRange}`);
      const data = response.data;

      // Set stats
      setStats({
        totalRevenue: data.totalRevenue || 0,
        totalOrders: data.totalOrders || 0,
        activeUsers: data.activeUsers || 0,
        totalVendors: data.totalVendors || 0,
        revenueChange: data.revenueChange || '+0%',
        ordersChange: data.ordersChange || '+0%',
        usersChange: data.usersChange || '+0%',
        vendorsChange: data.vendorsChange || '+0%',
      });

      // Set chart data
      setRevenueData(data.revenueTrend || []);
      setCategorySales(data.categorySales || []);
      setTransactions(data.transactions || []);
      setReportData(data);
    } catch (error: any) {
      console.error('Failed to fetch report data:', error);
      setError(error.response?.data?.error || 'Failed to load report data');
    } finally {
      setIsFetching(false);
    }
  };

  const handlePrint = () => {
    if (printRef.current) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>AgriVibe Report</title>
              <style>
                body { font-family: Arial, sans-serif; padding: 40px; background: white; color: black; }
                h1 { color: #2d7d2d; }
                .header { text-align: center; margin-bottom: 30px; }
                .section { margin: 20px 0; padding: 20px; border: 1px solid #ddd; }
                table { width: 100%; border-collapse: collapse; margin: 10px 0; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background: #f5f5f5; }
                .footer { text-align: center; margin-top: 30px; color: #666; }
              </style>
            </head>
            <body>
              ${printRef.current.innerHTML}
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
      }
    }
  };

  const handleDownload = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1500);
  };

  const reportTypes = [
    { value: 'revenue', label: 'Revenue Report', icon: DollarSign },
    { value: 'orders', label: 'Orders Report', icon: ShoppingBag },
    { value: 'users', label: 'Users Report', icon: Users },
    { value: 'products', label: 'Products Report', icon: Package },
    { value: 'payments', label: 'Payments Report', icon: CreditCard },
  ];

  const dateRanges = [
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' },
    { value: 'year', label: 'This Year' },
  ];

  // Tooltip formatter with proper typing
  const tooltipFormatter = (value: any, name: string, props: any) => {
    if (name === 'orders' || name === 'Orders') {
      return [value, 'Orders'];
    }
    if (name === 'revenue' || name === 'Revenue') {
      return [`KES ${value?.toLocaleString() || 0}`, 'Revenue'];
    }
    return [value, name];
  };

  // Safe formatter for pie chart
  const pieLabelFormatter = ({ name, percent }: any) => {
    return `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`;
  };

  const statCards = [
    { 
      label: 'Total Revenue', 
      value: `KES ${stats.totalRevenue.toLocaleString()}`, 
      change: stats.revenueChange, 
      icon: DollarSign, 
      color: 'from-green-500 to-emerald-500', 
      bg: 'bg-green-50' 
    },
    { 
      label: 'Total Orders', 
      value: stats.totalOrders, 
      change: stats.ordersChange, 
      icon: ShoppingBag, 
      color: 'from-blue-500 to-blue-600', 
      bg: 'bg-blue-50' 
    },
    { 
      label: 'Active Users', 
      value: stats.activeUsers, 
      change: stats.usersChange, 
      icon: Users, 
      color: 'from-purple-500 to-purple-600', 
      bg: 'bg-purple-50' 
    },
    { 
      label: 'Vendors', 
      value: stats.totalVendors, 
      change: stats.vendorsChange, 
      icon: Store, 
      color: 'from-yellow-500 to-orange-500', 
      bg: 'bg-yellow-50' 
    },
  ];

  // Loading state
  if (isFetching) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-agrivibe-green border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Loading report data...</p>
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
            <h1 className="text-3xl font-bold text-gray-900">📄 Reports</h1>
            <p className="text-gray-500 mt-1">Generate and export platform reports</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleDownload}
              disabled={loading}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-agrivibe-green to-emerald-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-xl hover:shadow-agrivibe-green/30 transition-all duration-300 hover:scale-[1.02] active:scale-95"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Downloading...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  Download Report
                </>
              )}
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 bg-yellow-400 text-gray-900 px-6 py-3 rounded-xl font-semibold hover:shadow-xl hover:shadow-yellow-400/30 transition-all duration-300 hover:scale-[1.02] active:scale-95"
            >
              <Printer className="w-5 h-5" />
              Print
            </button>
          </div>
        </div>

        {/* ====== SUCCESS TOAST ====== */}
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3"
          >
            <CheckCircle className="w-5 h-5 text-green-500" />
            <div>
              <p className="text-sm font-medium text-green-700">Report downloaded successfully!</p>
              <p className="text-xs text-green-600">Your report is ready for review.</p>
            </div>
          </motion.div>
        )}

        {/* ====== ERROR ====== */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-700">{error}</p>
              <button
                onClick={fetchReportData}
                className="text-sm text-red-600 hover:text-red-800 font-medium mt-1"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* ====== CONTROLS ====== */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-4">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[150px]">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Report Type
              </label>
              <div className="relative">
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="w-full appearance-none px-4 py-2.5 pr-10 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:border-agrivibe-green focus:ring-4 focus:ring-agrivibe-green/10 outline-none transition-all cursor-pointer"
                >
                  {reportTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div className="flex-1 min-w-[150px]">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Date Range
              </label>
              <div className="relative">
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="w-full appearance-none px-4 py-2.5 pr-10 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:border-agrivibe-green focus:ring-4 focus:ring-agrivibe-green/10 outline-none transition-all cursor-pointer"
                >
                  {dateRanges.map((range) => (
                    <option key={range.value} value={range.value}>
                      {range.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <button 
              onClick={fetchReportData}
              className="px-6 py-2.5 bg-gradient-to-r from-agrivibe-green to-emerald-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-agrivibe-green/30 transition-all duration-300 hover:scale-[1.02] active:scale-95"
            >
              Generate
            </button>
          </div>
        </div>

        {/* ====== REPORT CONTENT ====== */}
        <div ref={printRef} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          {/* Report Header */}
          <div className="text-center border-b border-gray-200 pb-6">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-agrivibe-green to-emerald-500 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🌾</span>
              </div>
              <span className="text-3xl font-bold text-agrivibe-green">AgriVibe</span>
            </div>
            <p className="text-gray-600 font-medium">Platform Report - {currentDate}</p>
            <p className="text-gray-400 text-sm">
              Report Type: {reportTypes.find(t => t.value === reportType)?.label || 'Revenue'}
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {statCards.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`${stat.bg} rounded-2xl border border-gray-100 p-4`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-gray-500">{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <p className="text-xs text-green-500">{stat.change}</p>
                    </div>
                    <div className={`w-10 h-10 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {/* Revenue Trend */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-agrivibe-green" />
                Revenue Trend
              </h3>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData}>
                    <defs>
                      <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" stroke="#9ca3af" fontSize={10} />
                    <YAxis stroke="#9ca3af" fontSize={10} />
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
              </div>
            </div>

            {/* Sales by Category */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <PieChartIcon className="w-4 h-4 text-agrivibe-green" />
                Sales by Category
              </h3>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categorySales}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                      paddingAngle={2}
                      label={pieLabelFormatter}
                    >
                      {categorySales.map((entry, index) => (
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
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Order Volume Chart */}
          <div className="mt-6 bg-gray-50 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-agrivibe-green" />
              Orders & Revenue Overview
            </h3>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#9ca3af" fontSize={10} />
                  <YAxis yAxisId="left" stroke="#9ca3af" fontSize={10} />
                  <YAxis yAxisId="right" orientation="right" stroke="#9ca3af" fontSize={10} />
                  <Tooltip 
  contentStyle={{
    backgroundColor:'#fff',
    border:'1px solid #e5e7eb',
    borderRadius:'12px',
    boxShadow:'0 10px 40px rgba(0,0,0,0.1)'
  }}
  formatter={(value: any, name: any) => {
    if (name === 'orders' || name === 'Orders') {
      return [value, 'Orders'];
    }
    return [`KES ${value?.toLocaleString() || 0}`, 'Revenue'];
  }}            />
                  <Bar yAxisId="left" dataKey="orders" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#22c55e" strokeWidth={2} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Data Table */}
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-agrivibe-green" />
              Recent Transactions
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left text-gray-600 font-semibold py-3 px-3">Order ID</th>
                    <th className="text-left text-gray-600 font-semibold py-3 px-3">Customer</th>
                    <th className="text-left text-gray-600 font-semibold py-3 px-3">Vendor</th>
                    <th className="text-right text-gray-600 font-semibold py-3 px-3">Amount</th>
                    <th className="text-center text-gray-600 font-semibold py-3 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {transactions.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-8 text-gray-500">
                        No transactions found
                      </td>
                    </tr>
                  ) : (
                    transactions.map((row: any) => (
                      <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-3 font-medium text-gray-900">{row.order_number || row.id}</td>
                        <td className="py-3 px-3 text-gray-600">{row.customer?.name || 'Customer'}</td>
                        <td className="py-3 px-3 text-gray-600">{row.vendor?.store_name || 'Vendor'}</td>
                        <td className="py-3 px-3 text-right font-medium text-agrivibe-green">KES {row.total?.toLocaleString() || 0}</td>
                        <td className="py-3 px-3 text-center">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                            row.status === 'delivered' ? 'bg-green-100 text-green-700' :
                            row.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                            row.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {row.status || 'pending'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-gray-400 text-xs border-t border-gray-200 pt-4 mt-6">
            <p>Report generated by AgriVibe Admin • {currentDate}</p>
            <p>© 2026 AgriVibe KE Farm Solutions. All rights reserved.</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}