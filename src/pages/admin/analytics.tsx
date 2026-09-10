// src/pages/admin/analytics.tsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AreaChart,
  Area,
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
  CartesianGrid,
  ComposedChart,
  Line,
  LineChart,
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
  Target,
  AlertCircle,
  RefreshCw,
  Download,
  Printer,
  Share2,
  Crown,
  Heart,
  XCircle,
  CreditCard,
  Loader2,
  Store,
  Eye,
  UserPlus,
  Zap,
  Shield,
  FileText,
} from "lucide-react";
import AdminLayout from "../../components/AdminLayout";
import api from "../../services/api";

export default function AdminAnalytics() {
  const [timeframe, setTimeframe] = useState("week");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [exporting, setExporting] = useState(false);
  const [sharing, setSharing] = useState(false);

  // ✅ REAL DATA STATES - From backend
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [userGrowthData, setUserGrowthData] = useState<any[]>([]);
  const [orderStatusData, setOrderStatusData] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);

  // ✅ REAL STATS
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalVendors: 0,
    totalDrivers: 0,
    conversionRate: 0,
    revenueChange: 0,
    ordersChange: 0,
    usersChange: 0,
    vendorsChange: 0,
    averageOrderValue: 0,
    pendingOrders: 0,
    activeUsers: 0,
    platformFee: 0,
  });

  // ✅ THEME-AWARE CHART COLORS
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    const checkDarkMode = () => {
      const isDark =
        document.documentElement.classList.contains("dark") ||
        localStorage.getItem("theme") === "dark";
      setIsDarkMode(isDark !== false);
    };
    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  const chartColors = {
    grid: isDarkMode ? "#374151" : "#f3f4f6",
    axis: isDarkMode ? "#9ca3af" : "#6b7280",
    axisLabel: isDarkMode ? "#9ca3af" : "#6b7280",
    tooltipBg: isDarkMode ? "#1f2937" : "#ffffff",
    tooltipBorder: isDarkMode ? "#374151" : "#e5e7eb",
    tooltipText: isDarkMode ? "#f9fafb" : "#1f2937",
    legendText: isDarkMode ? "#d1d5db" : "#374151",
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
    "#8b5cf6",
    "#ec4899",
  ];

  // ✅ FETCH ALL DATA
  useEffect(() => {
    fetchAnalytics();
  }, [timeframe]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      // ✅ Fetch order status
      const statusRes = await api.get(`/admin/order-status`);
      setOrderStatusData(statusRes.data.statuses || []);

      // ✅ Fetch revenue data
      const revenueRes = await api.get(`/admin/revenue?period=${timeframe}`);
      setRevenueData(revenueRes.data.data || []);

      // ✅ Fetch user growth
      const growthRes = await api.get(`/admin/user-growth?period=${timeframe}`);
      setUserGrowthData(growthRes.data.data || []);

      // ✅ Fetch dashboard stats
      const statsRes = await api.get("/dashboard/stats");
      const statsData = statsRes.data.stats || {};

      // Calculate platform fee (10% of revenue)
      const revenue = statsData.revenue || 0;
      const platformFee = revenue * 0.1;

      setStats({
        totalRevenue: revenue,
        totalOrders: statsData.orders?.total || 0,
        totalUsers: statsData.users?.total || 0,
        totalVendors: statsData.users?.vendors || 0,
        totalDrivers: statsData.users?.drivers || 0,
        conversionRate:
          statsData.orders?.total > 0 && statsData.users?.total > 0
            ? Math.round((statsData.orders.total / statsData.users.total) * 100)
            : 0,
        revenueChange: statsData.revenueChange || 0,
        ordersChange: statsData.ordersChange || 0,
        usersChange: statsData.usersChange || 0,
        vendorsChange: statsData.vendorsChange || 0,
        averageOrderValue:
          statsData.orders?.total > 0 ? revenue / statsData.orders.total : 0,
        pendingOrders: statsData.orders?.pending || 0,
        activeUsers: statsData.users?.total || 0,
        platformFee: platformFee,
      });

      setAnalytics({
        revenueTrend: revenueRes.data.data || [],
        userGrowth: growthRes.data.data || [],
        orderStatus: statusRes.data.statuses || [],
      });
    } catch (error: any) {
      console.error("Failed to fetch analytics:", error);
      setError(error.response?.data?.error || "Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  // ✅ SHARE FUNCTION
  const handleShare = async () => {
    if (!analytics) {
      alert("No data to share. Load analytics first.");
      return;
    }
    setSharing(true);
    const shareText = `🌾 AgriVibe Platform Analytics
━━━━━━━━━━━━━━━━━━━━
📊 Period: ${timeframe}
💰 Total Revenue: KES ${stats.totalRevenue.toLocaleString()}
📦 Total Orders: ${stats.totalOrders}
👥 Total Users: ${stats.totalUsers}
🏪 Total Vendors: ${stats.totalVendors}
🚚 Total Drivers: ${stats.totalDrivers}
📈 Conversion Rate: ${stats.conversionRate}%
━━━━━━━━━━━━━━━━━━━━
Powered by AgriVibe 🌱`;

    try {
      if (navigator.share) {
        try {
          await navigator.share({
            title: "AgriVibe Platform Analytics",
            text: shareText,
            url: window.location.href,
          });
        } catch (shareError: any) {
          if (
            shareError.name === "AbortError" ||
            shareError.message?.includes("cancel")
          ) {
            console.log("Share cancelled");
          } else {
            await navigator.clipboard.writeText(shareText);
            alert("✅ Analytics summary copied to clipboard!");
          }
        }
      } else {
        await navigator.clipboard.writeText(shareText);
        alert("✅ Analytics summary copied to clipboard!");
      }
    } catch (error) {
      console.error("Share failed:", error);
      alert("📋 Copy this summary:\n\n" + shareText);
    } finally {
      setSharing(false);
    }
  };

  // ✅ EXPORT CSV
  const handleExportCSV = () => {
    if (!analytics) {
      alert("No data to export. Load analytics first.");
      return;
    }
    setExporting(true);
    try {
      const rows = [
        ["AgriVibe Platform Analytics"],
        [`Period: ${timeframe}`],
        [`Generated: ${new Date().toLocaleString()}`],
        [],
        ["Metric", "Value"],
        ["Total Revenue", `KES ${stats.totalRevenue.toLocaleString()}`],
        ["Total Orders", stats.totalOrders],
        ["Total Users", stats.totalUsers],
        ["Total Vendors", stats.totalVendors],
        ["Total Drivers", stats.totalDrivers],
        ["Conversion Rate", `${stats.conversionRate}%`],
        ["Platform Fee (10%)", `KES ${stats.platformFee.toLocaleString()}`],
        [],
        ["Revenue Trend"],
        ["Date", "Revenue (KES)"],
        ...revenueData.map((item: any) => [item.label, item.revenue || 0]),
        [],
        ["User Growth"],
        ["Date", "Users"],
        ...userGrowthData.map((item: any) => [item.label, item.users || 0]),
      ];

      const csvContent = rows.map((row) => row.join(",")).join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `AgriVibe_Analytics_${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      alert("✅ CSV exported successfully!");
    } catch (error) {
      console.error("Export failed:", error);
      alert("Failed to export CSV");
    } finally {
      setExporting(false);
    }
  };

  // ✅ PRINT
  const handlePrint = () => {
    window.print();
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) return `KES ${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `KES ${(amount / 1000).toFixed(1)}K`;
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

  const hasData =
    revenueData.length > 0 ||
    userGrowthData.length > 0 ||
    orderStatusData.length > 0;

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="w-16 h-16 text-agrivibe-green animate-spin mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              Loading analytics...
            </p>
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
              Platform performance overview
              <span className="w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
              <span className="text-xs text-gray-400">
                {hasData
                  ? `Last updated: ${new Date().toLocaleTimeString()}`
                  : "No data available"}
              </span>
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
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
            <button
              onClick={handleExportCSV}
              disabled={exporting || !hasData}
              className="p-2.5 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              {exporting ? (
                <Loader2 className="w-5 h-5 text-gray-600 dark:text-gray-400 animate-spin" />
              ) : (
                <Download className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              )}
            </button>
            <button
              onClick={handlePrint}
              className="p-2.5 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <Printer className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <button
              onClick={handleShare}
              disabled={sharing || !hasData}
              className="p-2.5 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              {sharing ? (
                <Loader2 className="w-5 h-5 text-gray-600 dark:text-gray-400 animate-spin" />
              ) : (
                <Share2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              )}
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
          {[
            {
              label: "Total Revenue",
              value: formatCurrency(stats.totalRevenue),
              change: stats.revenueChange,
              icon: DollarSign,
              color: "from-green-500 to-emerald-500",
              bg: "bg-green-50 dark:bg-green-500/10",
            },
            {
              label: "Total Orders",
              value: stats.totalOrders,
              change: stats.ordersChange,
              icon: ShoppingBag,
              color: "from-blue-500 to-blue-600",
              bg: "bg-blue-50 dark:bg-blue-500/10",
            },
            {
              label: "Total Users",
              value: stats.totalUsers,
              change: stats.usersChange,
              icon: Users,
              color: "from-purple-500 to-purple-600",
              bg: "bg-purple-50 dark:bg-purple-500/10",
            },
            {
              label: "Platform Fee (10%)",
              value: formatCurrency(stats.platformFee),
              change: stats.revenueChange,
              icon: Shield,
              color: "from-yellow-500 to-orange-500",
              bg: "bg-yellow-50 dark:bg-yellow-500/10",
            },
          ].map((stat, index) => {
            const Icon = stat.icon;
            const isPositive = stat.change > 0;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`${stat.bg} rounded-2xl border border-gray-100 dark:border-gray-800 p-5`}
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
          {[
            {
              label: "Avg Order Value",
              value: formatCurrency(stats.averageOrderValue),
              icon: CreditCard,
              color: "text-indigo-600 dark:text-indigo-400",
            },
            {
              label: "Pending Orders",
              value: stats.pendingOrders,
              icon: Clock,
              color: "text-yellow-500 dark:text-yellow-400",
            },
            {
              label: "Total Drivers",
              value: stats.totalDrivers,
              icon: Users,
              color: "text-pink-500 dark:text-pink-400",
            },
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + index * 0.05 }}
                className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 flex items-center gap-4"
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

        {/* ====== NO DATA STATE ====== */}
        {!hasData ? (
          <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800">
            <Package className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
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
              {/* Revenue Trend */}
              {revenueData.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 p-6"
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
                      <AreaChart data={revenueData}>
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
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke={chartColors.grid}
                        />
                        <XAxis
                          dataKey="label"
                          stroke={chartColors.axis}
                          fontSize={12}
                          tick={{ fill: chartColors.axisLabel }}
                        />
                        <YAxis
                          stroke={chartColors.axis}
                          fontSize={12}
                          tick={{ fill: chartColors.axisLabel }}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: chartColors.tooltipBg,
                            border: `1px solid ${chartColors.tooltipBorder}`,
                            borderRadius: "12px",
                            color: chartColors.tooltipText,
                          }}
                          formatter={(value: any) => [
                            `KES ${value?.toLocaleString() || 0}`,
                            "Revenue",
                          ]}
                          labelStyle={{ color: chartColors.tooltipText }}
                        />
                        <Area
                          type="monotone"
                          dataKey="revenue"
                          stroke="#22c55e"
                          strokeWidth={2}
                          fill="url(#revenueGradient)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>
              )}

              {/* User Growth */}
              {userGrowthData.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        User Growth
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        New users over time
                      </p>
                    </div>
                    <UserPlus className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={userGrowthData}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke={chartColors.grid}
                        />
                        <XAxis
                          dataKey="label"
                          stroke={chartColors.axis}
                          fontSize={12}
                          tick={{ fill: chartColors.axisLabel }}
                        />
                        <YAxis
                          stroke={chartColors.axis}
                          fontSize={12}
                          tick={{ fill: chartColors.axisLabel }}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: chartColors.tooltipBg,
                            border: `1px solid ${chartColors.tooltipBorder}`,
                            borderRadius: "12px",
                            color: chartColors.tooltipText,
                          }}
                          formatter={(value: any) => [value, "New Users"]}
                          labelStyle={{ color: chartColors.tooltipText }}
                        />
                        <Bar
                          dataKey="users"
                          fill="#8b5cf6"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>
              )}

              {/* Order Status */}
              {orderStatusData.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 p-6"
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
                    <PieChartIcon className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="h-64">
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
                          paddingAngle={3}
                          label={({ name, percent }: any) => {
                            const pct = percent
                              ? parseFloat((percent * 100).toFixed(0))
                              : 0;
                            return pct > 5 ? `${name} ${pct}%` : "";
                          }}
                        >
                          {orderStatusData.map((entry: any, index: number) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: chartColors.tooltipBg,
                            border: `1px solid ${chartColors.tooltipBorder}`,
                            borderRadius: "12px",
                            color: chartColors.tooltipText,
                          }}
                          formatter={(value: any) => [value, "Orders"]}
                          labelStyle={{ color: chartColors.tooltipText }}
                        />
                        <Legend
                          wrapperStyle={{ color: chartColors.legendText }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>
              )}
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
