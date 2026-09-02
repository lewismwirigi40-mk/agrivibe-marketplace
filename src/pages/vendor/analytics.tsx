// src/pages/vendor/analytics.tsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart,
  CartesianGrid,
  ComposedChart,
} from "recharts";
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
  RefreshCw,
  Download,
  Printer,
  Share2,
  Crown,
  Star,
  Zap as ZapIcon,
  Rocket,
  Gift,
  Heart,
  ThumbsUp,
  TrendingUp as TrendingUpIcon,
  FileText,
  CalendarDays,
  ChevronRight,
  MoreVertical,
  Loader2,
  CheckCircle,
  XCircle,
} from "lucide-react";
import VendorLayout from "../../components/VendorLayout";
import api from "../../services/api";
import { useRouter } from "next/router";

export default function VendorAnalytics() {
  const router = useRouter();
  const [timeframe, setTimeframe] = useState("week");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [analytics, setAnalytics] = useState<any>(null);

  // ✅ REAL DATA STATES - No default dummy data
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [salesData, setSalesData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [orderStatusData, setOrderStatusData] = useState<any[]>([]);
  const [customerData, setCustomerData] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    conversionRate: 0,
    revenueChange: 0,
    ordersChange: 0,
    customersChange: 0,
    conversionChange: 0,
    averageOrderValue: 0,
    returnRate: 0,
    customerRetention: 0,
  });

  useEffect(() => {
    fetchAnalytics();
  }, [timeframe]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      // ✅ ONLY fetch from backend - NO MOCK DATA
      const response = await api.get(
        `/vendor/analytics?timeframe=${timeframe}`,
      );
      const data = response.data;

      // ✅ Set stats from backend
      setStats({
        totalRevenue: data.totalRevenue || 0,
        totalOrders: data.totalOrders || 0,
        totalCustomers: data.totalCustomers || 0,
        conversionRate: data.conversionRate || 0,
        revenueChange: data.revenueChange || 0,
        ordersChange: data.ordersChange || 0,
        customersChange: data.customersChange || 0,
        conversionChange: data.conversionChange || 0,
        averageOrderValue: data.averageOrderValue || 0,
        returnRate: data.returnRate || 0,
        customerRetention: data.customerRetention || 0,
      });

      // ✅ Set chart data from backend
      setRevenueData(data.revenueTrend || []);
      setSalesData(data.dailySales || []);
      setCategoryData(data.salesByCategory || []);
      setTopProducts(data.topProducts || []);
      setOrderStatusData(data.orderStatus || []);
      setCustomerData(data.customerInsights || []);

      setAnalytics(data);
    } catch (error: any) {
      console.error("Failed to fetch analytics:", error);
      setError(
        error.response?.data?.error ||
          "Failed to load analytics. Please try again.",
      );

      // ✅ NO DUMMY DATA - Just empty arrays
      setRevenueData([]);
      setSalesData([]);
      setCategoryData([]);
      setTopProducts([]);
      setOrderStatusData([]);
      setCustomerData([]);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = [
    "#22c55e",
    "#10b981",
    "#059669",
    "#047857",
    "#065f46",
    "#f59e0b",
    "#ef4444",
    "#3b82f6",
  ];

  const formatCurrency = (amount: number) => {
    return `KES ${amount?.toLocaleString() || 0}`;
  };

  const formatChange = (change: number) => {
    return change > 0 ? `+${change}%` : `${change}%`;
  };

  const getChangeColor = (change: number) => {
    return change > 0
      ? "text-green-500"
      : change < 0
        ? "text-red-500"
        : "text-gray-400";
  };

  if (loading) {
    return (
      <VendorLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-agrivibe-green border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              Loading analytics...
            </p>
          </div>
        </div>
      </VendorLayout>
    );
  }

  const statCards = [
    {
      label: "Total Revenue",
      value: formatCurrency(stats.totalRevenue),
      change: stats.revenueChange,
      icon: DollarSign,
      color: "from-green-500 to-emerald-500",
      bg: "bg-green-50 dark:bg-green-500/10",
    },
    {
      label: "Orders",
      value: stats.totalOrders,
      change: stats.ordersChange,
      icon: ShoppingBag,
      color: "from-blue-500 to-blue-600",
      bg: "bg-blue-50 dark:bg-blue-500/10",
    },
    {
      label: "New Customers",
      value: stats.totalCustomers,
      change: stats.customersChange,
      icon: Users,
      color: "from-purple-500 to-purple-600",
      bg: "bg-purple-50 dark:bg-purple-500/10",
    },
    {
      label: "Conversion Rate",
      value: `${stats.conversionRate}%`,
      change: stats.conversionChange,
      icon: Target,
      color: "from-yellow-500 to-orange-500",
      bg: "bg-yellow-50 dark:bg-yellow-500/10",
    },
  ];

  const secondaryStats = [
    {
      label: "Avg Order Value",
      value: formatCurrency(stats.averageOrderValue),
      icon: CreditCard,
      color: "text-indigo-600",
    },
    {
      label: "Return Rate",
      value: `${stats.returnRate}%`,
      icon: XCircle,
      color: "text-red-500",
    },
    {
      label: "Customer Retention",
      value: `${stats.customerRetention}%`,
      icon: Heart,
      color: "text-pink-500",
    },
  ];

  const hasData =
    revenueData.length > 0 || salesData.length > 0 || topProducts.length > 0;

  return (
    <VendorLayout>
      <div className="space-y-6">
        {/* ====== HEADER ====== */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Analytics
              </h1>
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold rounded-full">
                <Sparkles className="w-3 h-3" />
                Live
              </span>
            </div>
            <p className="text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
              Track your store performance
              <span className="w-1 h-1 bg-gray-300 rounded-full" />
              <span className="text-xs text-gray-400">
                {hasData
                  ? `Last updated: ${new Date().toLocaleTimeString()}`
                  : "No data available"}
              </span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
              {["week", "month", "year"].map((t) => (
                <button
                  key={t}
                  onClick={() => setTimeframe(t)}
                  className={`px-4 py-2 text-sm font-medium transition-all duration-200 ${
                    timeframe === t
                      ? "bg-agrivibe-green text-white"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
            <button
              onClick={fetchAnalytics}
              className="p-2.5 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <RefreshCw className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>

        {/* ====== ERROR ====== */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-2xl p-4 flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-red-700 dark:text-red-400">
                  {error}
                </p>
                <button
                  onClick={fetchAnalytics}
                  className="text-sm text-red-600 dark:text-red-400 font-medium hover:underline mt-1"
                >
                  Try again
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ====== STATS CARDS ====== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            const isPositive = stat.change > 0;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`${stat.bg} rounded-2xl border border-gray-100 dark:border-white/10 p-5 hover:shadow-lg transition-all duration-300`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                      {stat.value}
                    </p>
                    <div
                      className={`flex items-center gap-1 mt-1 ${getChangeColor(stat.change)}`}
                    >
                      {isPositive ? (
                        <ArrowUp className="w-4 h-4" />
                      ) : (
                        <ArrowDown className="w-4 h-4" />
                      )}
                      <span className="text-sm font-semibold">
                        {formatChange(stat.change)}
                      </span>
                      <span className="text-xs text-gray-400">
                        vs last period
                      </span>
                    </div>
                  </div>
                  <div
                    className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ====== SECONDARY STATS ====== */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {secondaryStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + index * 0.05 }}
                className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-white/10 p-4 flex items-center gap-4"
              >
                <div
                  className={`w-12 h-12 ${stat.color} bg-opacity-10 rounded-xl flex items-center justify-center`}
                >
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-xs text-gray-400">{stat.label}</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ====== CHARTS GRID ====== */}
        {!hasData ? (
          <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-white/10">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
              No Analytics Data Yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Start selling to see your analytics here
            </p>
          </div>
        ) : (
          <>
            {/* ====== CHARTS ====== */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {revenueData.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-white/10 p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        Revenue Trend
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Revenue performance over time
                      </p>
                    </div>
                    <Activity className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={revenueData}>
                        <defs>
                          <linearGradient
                            id="revenueGradient"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="#22c55e"
                              stopOpacity={0.3}
                            />
                            <stop
                              offset="95%"
                              stopColor="#22c55e"
                              stopOpacity={0}
                            />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                        <XAxis dataKey="label" stroke="#9ca3af" fontSize={12} />
                        <YAxis stroke="#9ca3af" fontSize={12} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#fff",
                            border: "1px solid #e5e7eb",
                            borderRadius: "12px",
                            boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
                          }}
                          formatter={(value: any) => [
                            `KES ${value?.toLocaleString() || 0}`,
                            "Revenue",
                          ]}
                        />
                        <Legend />
                        <Area
                          type="monotone"
                          dataKey="revenue"
                          stroke="#22c55e"
                          strokeWidth={2}
                          fill="url(#revenueGradient)"
                          name="Revenue"
                        />
                        <Bar
                          dataKey="orders"
                          fill="#3b82f6"
                          radius={[4, 4, 0, 0]}
                          name="Orders"
                        />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>
              )}

              {categoryData.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-white/10 p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        Sales by Category
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Product category distribution
                      </p>
                    </div>
                    <PieChartIcon className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={80}
                          paddingAngle={3}
                          label={({ name, percent }: any) =>
                            `${name} ${(percent * 100).toFixed(0)}%`
                          }
                        >
                          {categoryData.map((entry: any, index: number) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#fff",
                            border: "1px solid #e5e7eb",
                            borderRadius: "12px",
                            boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
                          }}
                          formatter={(value: any) => [
                            `KES ${value?.toLocaleString() || 0}`,
                            "Sales",
                          ]}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>
              )}

              {salesData.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-white/10 p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        Daily Sales
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Sales performance by day
                      </p>
                    </div>
                    <BarChart3 className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={salesData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                        <XAxis dataKey="label" stroke="#9ca3af" fontSize={12} />
                        <YAxis stroke="#9ca3af" fontSize={12} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#fff",
                            border: "1px solid #e5e7eb",
                            borderRadius: "12px",
                            boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
                          }}
                          formatter={(value: any) => [
                            `KES ${value?.toLocaleString() || 0}`,
                            "Sales",
                          ]}
                        />
                        <Bar
                          dataKey="sales"
                          fill="#10b981"
                          radius={[8, 8, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>
              )}

              {customerData.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-white/10 p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        Customer Insights
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        New vs returning customers
                      </p>
                    </div>
                    <Users className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={customerData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                        <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
                        <YAxis stroke="#9ca3af" fontSize={12} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#fff",
                            border: "1px solid #e5e7eb",
                            borderRadius: "12px",
                            boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
                          }}
                        />
                        <Legend />
                        <Bar
                          dataKey="new"
                          fill="#22c55e"
                          radius={[4, 4, 0, 0]}
                          name="New Customers"
                        />
                        <Bar
                          dataKey="returning"
                          fill="#3b82f6"
                          radius={[4, 4, 0, 0]}
                          name="Returning Customers"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>
              )}
            </div>

            {/* ====== ORDER STATUS ====== */}
            {orderStatusData.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 }}
                className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-white/10 p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      Order Status Distribution
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Current order breakdown
                    </p>
                  </div>
                  <Clock className="w-5 h-5 text-gray-400" />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {orderStatusData.map((status, index) => (
                    <div
                      key={index}
                      className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl"
                    >
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {status.value}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {status.name}
                      </p>
                      <div className="w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-full mt-2 overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${(status.value / orderStatusData.reduce((sum: number, s: any) => sum + s.value, 0)) * 100}%`,
                            backgroundColor: COLORS[index % COLORS.length],
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ====== TOP SELLING PRODUCTS ====== */}
            {topProducts.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-white/10 p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      Top Selling Products
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Best performing products in your store
                    </p>
                  </div>
                  <Award className="w-5 h-5 text-yellow-400" />
                </div>

                <div className="space-y-3">
                  {topProducts.map((product: any, index: number) => {
                    const trend = product.trend || "up";
                    const TrendIcon =
                      trend === "up"
                        ? TrendingUp
                        : trend === "down"
                          ? TrendingDown
                          : Activity;
                    const trendColor =
                      trend === "up"
                        ? "text-green-500"
                        : trend === "down"
                          ? "text-red-500"
                          : "text-gray-400";
                    const isPositive = product.trend_percentage > 0;

                    return (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold text-white ${
                              index === 0
                                ? "bg-gradient-to-br from-yellow-400 to-yellow-500"
                                : index === 1
                                  ? "bg-gradient-to-br from-gray-400 to-gray-500"
                                  : index === 2
                                    ? "bg-gradient-to-br from-amber-600 to-amber-700"
                                    : "bg-gray-300 dark:bg-gray-600"
                            }`}
                          >
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {product.name}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {product.orders || 0} orders
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <p className="font-bold text-gray-900 dark:text-white">
                              {formatCurrency(product.revenue || 0)}
                            </p>
                            <div
                              className={`flex items-center gap-1 text-sm ${trendColor}`}
                            >
                              <TrendIcon className="w-3 h-3" />
                              <span>
                                {isPositive ? "+" : ""}
                                {product.trend_percentage || 0}%
                              </span>
                            </div>
                          </div>
                          <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-agrivibe-green rounded-full"
                              style={{
                                width: `${Math.min((product.revenue / topProducts[0]?.revenue) * 100, 100)}%`,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </>
        )}

        {/* ====== EXPORT BUTTONS ====== */}
        <div className="flex flex-wrap gap-3">
          <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors font-medium">
            <Download className="w-4 h-4" />
            Export Report
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors font-medium">
            <Printer className="w-4 h-4" />
            Print
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors font-medium">
            <Share2 className="w-4 h-4" />
            Share
          </button>
        </div>
      </div>
    </VendorLayout>
  );
}
