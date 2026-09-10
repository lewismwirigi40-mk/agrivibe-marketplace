// src/pages/admin/reports.tsx
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  ComposedChart,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
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
  AlertCircle,
  Calendar,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Crown,
  Sparkles,
  Grid,
  LayoutGrid,
  Eye,
  Share2,
  Copy,
  ExternalLink,
  Settings,
  HelpCircle,
  Maximize2,
  Minimize2,
  RefreshCw,
  Clock,
  Award,
  Target,
  Compass,
  Activity,
  Layers,
  Globe,
  Mail,
  Phone,
  MapPin,
  Star,
  Heart,
  Shield,
  Lock,
  UserCheck,
  Briefcase,
  Server,
  Database,
  Cpu,
  Cloud,
  GitBranch,
  Terminal,
  Code,
} from "lucide-react";
import AdminLayout from "../../components/AdminLayout";
import api from "../../services/api";

export default function AdminReports() {
  const [reportType, setReportType] = useState("revenue");
  const [dateRange, setDateRange] = useState("month");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState("");
  const [reportData, setReportData] = useState<any>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [viewMode, setViewMode] = useState<"detailed" | "summary">("detailed");
  const [sharing, setSharing] = useState(false);
  const [exporting, setExporting] = useState(false);
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
    revenueChange: "+0%",
    ordersChange: "+0%",
    usersChange: "+0%",
    vendorsChange: "+0%",
  });

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
  const PREMIUM_COLORS = [
    "#6366f1",
    "#8b5cf6",
    "#a855f7",
    "#d946ef",
    "#ec4899",
    "#f43f5e",
    "#f97316",
    "#eab308",
  ];

  const currentDate = new Date().toLocaleDateString("en-KE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // ✅ THEME-AWARE COLORS
  const [isDarkMode, setIsDarkMode] = useState(false);
  useEffect(() => {
    const checkDarkMode = () => {
      const isDark =
        document.documentElement.classList.contains("dark") ||
        localStorage.getItem("theme") === "dark";
      setIsDarkMode(isDark);
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

  // FETCH REAL DATA
  useEffect(() => {
    fetchReportData();
  }, [reportType, dateRange]);

  const fetchReportData = async () => {
    setIsFetching(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsFetching(false);
        return;
      }

      const response = await api.get(
        `/admin/reports?type=${reportType}&range=${dateRange}`,
      );
      const data = response.data;

      setStats({
        totalRevenue: data.totalRevenue || 0,
        totalOrders: data.totalOrders || 0,
        activeUsers: data.activeUsers || 0,
        totalVendors: data.totalVendors || 0,
        revenueChange: data.revenueChange || "+0%",
        ordersChange: data.ordersChange || "+0%",
        usersChange: data.usersChange || "+0%",
        vendorsChange: data.vendorsChange || "+0%",
      });

      setRevenueData(data.revenueTrend || []);
      setCategorySales(data.categorySales || []);
      setTransactions(data.transactions || []);
      setReportData(data);
    } catch (error: any) {
      console.error("Failed to fetch report data:", error);
      setError(error.response?.data?.error || "Failed to load report data");
    } finally {
      setIsFetching(false);
    }
  };

  // ✅ PRINT FUNCTION
  const handlePrint = () => {
    window.print();
  };

  // ✅ SHARE FUNCTION - FIXED
  const handleShare = async () => {
    if (!reportData) {
      alert("No data to share. Generate a report first.");
      return;
    }

    setSharing(true);
    // ✅ Define shareText OUTSIDE try block so it's accessible in catch
    const shareText = `🌾 AgriVibe Platform Report
━━━━━━━━━━━━━━━━━━━━
📊 Report: ${reportTypes.find((t) => t.value === reportType)?.label || "Revenue"}
📅 Period: ${dateRanges.find((r) => r.value === dateRange)?.label || "Month"}
💰 Total Revenue: KES ${stats.totalRevenue.toLocaleString()}
📦 Total Orders: ${stats.totalOrders}
👥 Active Users: ${stats.activeUsers}
🏪 Total Vendors: ${stats.totalVendors}
📈 Revenue Change: ${stats.revenueChange}
━━━━━━━━━━━━━━━━━━━━
Powered by AgriVibe 🌱`;

    try {
      if (navigator.share) {
        try {
          await navigator.share({
            title: "AgriVibe Platform Report",
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
            alert("✅ Report summary copied to clipboard!");
          }
        }
      } else {
        await navigator.clipboard.writeText(shareText);
        alert("✅ Report summary copied to clipboard!");
      }
    } catch (error) {
      console.error("Share failed:", error);
      alert("📋 Copy this summary:\n\n" + shareText);
    } finally {
      setSharing(false);
    }
  };

  // ✅ EXPORT CSV FUNCTION
  const handleExportCSV = () => {
    if (!reportData) {
      alert("No data to export. Generate a report first.");
      return;
    }

    setExporting(true);
    try {
      const rows = [
        ["AgriVibe Platform Report"],
        [
          `Report Type: ${reportTypes.find((t) => t.value === reportType)?.label || "Revenue"}`,
        ],
        [
          `Date Range: ${dateRanges.find((r) => r.value === dateRange)?.label || "Month"}`,
        ],
        [`Generated: ${new Date().toLocaleString()}`],
        [],
        ["Metric", "Value"],
        ["Total Revenue", `KES ${stats.totalRevenue.toLocaleString()}`],
        ["Total Orders", stats.totalOrders],
        ["Active Users", stats.activeUsers],
        ["Total Vendors", stats.totalVendors],
        ["Revenue Change", stats.revenueChange],
        ["Orders Change", stats.ordersChange],
        ["Users Change", stats.usersChange],
        ["Vendors Change", stats.vendorsChange],
      ];

      if (revenueData.length > 0) {
        rows.push([]);
        rows.push(["Revenue Trend"]);
        rows.push(["Date", "Revenue (KES)", "Orders"]);
        revenueData.forEach((item: any) => {
          rows.push([item.month, item.revenue || 0, item.orders || 0]);
        });
      }

      if (categorySales.length > 0) {
        rows.push([]);
        rows.push(["Category Sales"]);
        rows.push(["Category", "Amount (KES)"]);
        categorySales.forEach((item: any) => {
          if (item.name && item.name !== "No Sales Yet") {
            rows.push([item.name, item.value || 0]);
          }
        });
      }

      if (transactions.length > 0) {
        rows.push([]);
        rows.push(["Recent Transactions"]);
        rows.push([
          "Order ID",
          "Customer",
          "Vendor",
          "Amount (KES)",
          "Status",
          "Date",
        ]);
        transactions.slice(0, 10).forEach((item: any) => {
          rows.push([
            item.order_number || item.id?.slice(0, 8) || "",
            item.customer?.name || "Customer",
            item.vendor?.store_name || "Vendor",
            item.total || 0,
            item.status || "pending",
            item.created_at
              ? new Date(item.created_at).toLocaleDateString()
              : "",
          ]);
        });
      }

      const csvContent = rows.map((row) => row.join(",")).join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `AgriVibe_Report_${reportType}_${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setSuccessMessage("CSV report downloaded successfully!");
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error("Export failed:", error);
      setError("Failed to export report. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  const reportTypes = [
    {
      value: "revenue",
      label: "Revenue Report",
      icon: DollarSign,
      color: "from-emerald-500 to-green-500",
    },
    {
      value: "orders",
      label: "Orders Report",
      icon: ShoppingBag,
      color: "from-blue-500 to-indigo-500",
    },
    {
      value: "users",
      label: "Users Report",
      icon: Users,
      color: "from-purple-500 to-pink-500",
    },
    {
      value: "products",
      label: "Products Report",
      icon: Package,
      color: "from-orange-500 to-amber-500",
    },
    {
      value: "payments",
      label: "Payments Report",
      icon: CreditCard,
      color: "from-cyan-500 to-teal-500",
    },
  ];

  const dateRanges = [
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" },
    { value: "quarter", label: "This Quarter" },
    { value: "year", label: "This Year" },
  ];

  const tooltipFormatter = (value: any, name: string) => {
    if (name === "orders" || name === "Orders") return [value, "Orders"];
    if (name === "revenue" || name === "Revenue")
      return [`KES ${value?.toLocaleString() || 0}`, "Revenue"];
    return [value, name];
  };

  const statCards = [
    {
      label: "Total Revenue",
      value: `KES ${stats.totalRevenue.toLocaleString()}`,
      change: stats.revenueChange,
      icon: DollarSign,
      color: "from-emerald-500 to-green-500",
      bg: "bg-emerald-50 dark:bg-emerald-500/10",
    },
    {
      label: "Total Orders",
      value: stats.totalOrders,
      change: stats.ordersChange,
      icon: ShoppingBag,
      color: "from-blue-500 to-indigo-500",
      bg: "bg-blue-50 dark:bg-blue-500/10",
    },
    {
      label: "Active Users",
      value: stats.activeUsers,
      change: stats.usersChange,
      icon: Users,
      color: "from-purple-500 to-pink-500",
      bg: "bg-purple-50 dark:bg-purple-500/10",
    },
    {
      label: "Vendors",
      value: stats.totalVendors,
      change: stats.vendorsChange,
      icon: Store,
      color: "from-orange-500 to-amber-500",
      bg: "bg-orange-50 dark:bg-orange-500/10",
    },
  ];

  if (isFetching) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-agrivibe-green/20 border-t-agrivibe-green rounded-full animate-spin mx-auto" />
            <p className="text-gray-500 dark:text-gray-400 mt-4 font-medium">
              Loading premium analytics...
            </p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const hasData = revenueData.length > 0 || categorySales.length > 0;

  return (
    <AdminLayout>
      <div className="space-y-6" ref={printRef}>
        {/* ====== HEADER ====== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden bg-gradient-to-br from-agrivibe-green via-emerald-600 to-teal-700 rounded-2xl p-8 text-white"
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 animate-pulse" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 animate-pulse delay-1000" />
          </div>

          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">Reports & Analytics</h1>
                  <p className="text-white/80 text-sm">
                    Enterprise-grade reporting and insights
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-4 mt-2">
                <div className="flex items-center gap-2 text-white/70 text-sm">
                  <Calendar className="w-4 h-4" />
                  <span>{currentDate}</span>
                </div>
                <div className="flex items-center gap-2 text-white/70 text-sm">
                  <Clock className="w-4 h-4" />
                  <span>Updated: {new Date().toLocaleTimeString()}</span>
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  Live
                </span>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() =>
                  setViewMode(viewMode === "detailed" ? "summary" : "detailed")
                }
                className="flex items-center gap-2 px-4 py-2.5 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-xl transition-all duration-300 text-white font-medium text-sm"
              >
                {viewMode === "detailed" ? (
                  <>
                    <Minimize2 className="w-4 h-4" /> Summary View
                  </>
                ) : (
                  <>
                    <Maximize2 className="w-4 h-4" /> Detailed View
                  </>
                )}
              </button>
              <button
                onClick={handleExportCSV}
                disabled={exporting || !hasData}
                className="flex items-center gap-2 px-5 py-2.5 bg-white text-agrivibe-green rounded-xl font-semibold hover:shadow-xl hover:scale-[1.02] transition-all duration-300 disabled:opacity-50"
              >
                {exporting ? (
                  <div className="w-4 h-4 border-2 border-agrivibe-green border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                {exporting ? "Exporting..." : "Export"}
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2.5 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-xl transition-all duration-300 text-white font-medium text-sm"
              >
                <Printer className="w-4 h-4" />
                Print
              </button>
              <button
                onClick={handleShare}
                disabled={sharing || !hasData}
                className="flex items-center gap-2 px-4 py-2.5 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-xl transition-all duration-300 text-white font-medium text-sm disabled:opacity-50"
              >
                {sharing ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Share2 className="w-4 h-4" />
                )}
                {sharing ? "Sharing..." : "Share"}
              </button>
            </div>
          </div>
        </motion.div>

        {/* ====== SUCCESS/ERROR ====== */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 rounded-2xl p-4 flex items-center gap-3"
            >
              <CheckCircle className="w-5 h-5 text-emerald-500" />
              <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                {successMessage}
              </p>
            </motion.div>
          )}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-2xl p-4 flex items-center gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-500" />
              <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ====== CONTROLS ====== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-white/10 p-6"
        >
          <div className="flex flex-wrap gap-6 items-end">
            <div className="flex-1 min-w-[180px]">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-400" />
                Report Type
              </label>
              <div className="relative">
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="w-full appearance-none px-5 py-3 pr-12 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white font-medium focus:border-agrivibe-green focus:ring-4 focus:ring-agrivibe-green/10 outline-none transition-all duration-300 cursor-pointer"
                >
                  {reportTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div className="flex-1 min-w-[180px]">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                Date Range
              </label>
              <div className="relative">
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="w-full appearance-none px-5 py-3 pr-12 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white font-medium focus:border-agrivibe-green focus:ring-4 focus:ring-agrivibe-green/10 outline-none transition-all duration-300 cursor-pointer"
                >
                  {dateRanges.map((range) => (
                    <option key={range.value} value={range.value}>
                      {range.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <button
              onClick={fetchReportData}
              className="px-8 py-3 bg-gradient-to-r from-agrivibe-green to-emerald-500 text-white rounded-xl font-semibold hover:shadow-xl hover:shadow-agrivibe-green/30 transition-all duration-300 hover:scale-[1.02] active:scale-95 flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Generate Report
            </button>
          </div>
        </motion.div>

        {/* ====== STATS CARDS ====== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            const isPositive = stat.change?.startsWith("+");
            const TrendIcon = isPositive ? ArrowUpRight : ArrowDownRight;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.05 * index }}
                whileHover={{ y: -4, scale: 1.02 }}
                className={`${stat.bg} rounded-2xl border border-gray-100 dark:border-white/10 p-5 hover:shadow-xl transition-all duration-300`}
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
                      className={`flex items-center gap-1 mt-1.5 ${isPositive ? "text-emerald-500" : "text-red-500"}`}
                    >
                      <TrendIcon className="w-4 h-4" />
                      <span className="text-sm font-semibold">
                        {stat.change}
                      </span>
                      <span className="text-xs text-gray-400">vs previous</span>
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
        </motion.div>

        {/* ====== CHARTS ====== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Trend */}
          {revenueData.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-white/10 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Revenue Trend
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Revenue performance over selected period
                  </p>
                </div>
                <Activity className="w-5 h-5 text-gray-400" />
              </div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData}>
                    <defs>
                      <linearGradient
                        id="revenueGrad"
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
                      dataKey="month"
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
                      formatter={tooltipFormatter}
                      labelStyle={{ color: chartColors.tooltipText }}
                    />
                    <Legend wrapperStyle={{ color: chartColors.legendText }} />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#22c55e"
                      strokeWidth={3}
                      fill="url(#revenueGrad)"
                      name="Revenue"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          )}

          {/* Category Sales - FIXED LABEL FUNCTION */}
          {categorySales.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-white/10 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Category Distribution
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Sales breakdown by product category
                  </p>
                </div>
                <PieChartIcon className="w-5 h-5 text-gray-400" />
              </div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categorySales}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={90}
                      paddingAngle={3}
                      label={({ name, percent }: any) => {
                        // ✅ FIXED: Ensure percent is a number
                        const pct = percent
                          ? parseFloat((percent * 100).toFixed(0))
                          : 0;
                        return pct > 5 ? `${name} ${pct}%` : "";
                      }}
                    >
                      {categorySales.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={PREMIUM_COLORS[index % PREMIUM_COLORS.length]}
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
                      formatter={(value: any) => [
                        `KES ${value?.toLocaleString() || 0}`,
                        "Sales",
                      ]}
                      labelStyle={{ color: chartColors.tooltipText }}
                    />
                    <Legend wrapperStyle={{ color: chartColors.legendText }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          )}
        </div>

        {/* ====== TRANSACTIONS ====== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-white/10 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Recent Transactions
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Latest order activity on the platform
              </p>
            </div>
            <span className="text-xs text-gray-400">
              {transactions.length} transactions
            </span>
          </div>
          {transactions.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p>No transactions found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-white/5">
                    <th className="text-left text-gray-500 dark:text-gray-400 font-medium py-3 px-4 text-xs uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="text-left text-gray-500 dark:text-gray-400 font-medium py-3 px-4 text-xs uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="text-left text-gray-500 dark:text-gray-400 font-medium py-3 px-4 text-xs uppercase tracking-wider">
                      Vendor
                    </th>
                    <th className="text-right text-gray-500 dark:text-gray-400 font-medium py-3 px-4 text-xs uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="text-center text-gray-500 dark:text-gray-400 font-medium py-3 px-4 text-xs uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-white/5">
                  {transactions.slice(0, 10).map((row: any, index: number) => (
                    <motion.tr
                      key={row.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.02 * index }}
                      className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                    >
                      <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">
                        {row.order_number || row.id?.slice(0, 8) || "N/A"}
                      </td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                        {row.customer?.name || "Customer"}
                      </td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                        {row.vendor?.store_name || "Vendor"}
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-agrivibe-green">
                        KES {row.total?.toLocaleString() || 0}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                            row.status === "delivered"
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400"
                              : row.status === "pending"
                                ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400"
                                : row.status === "processing"
                                  ? "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400"
                                  : "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              row.status === "delivered"
                                ? "bg-emerald-500"
                                : row.status === "pending"
                                  ? "bg-yellow-500"
                                  : row.status === "processing"
                                    ? "bg-blue-500"
                                    : "bg-red-500"
                            }`}
                          />
                          {row.status || "pending"}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* ====== FOOTER ====== */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-100 dark:border-white/5"
        >
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <span>© 2026 AgriVibe KE Farm Solutions</span>
            <span className="w-px h-4 bg-gray-200 dark:bg-white/10" />
            <span>All rights reserved</span>
            <span className="flex items-center gap-1">
              <Shield className="w-3 h-3" />
              Secure Report
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-agrivibe-green" />
              Powered by AgriVibe Analytics
            </span>
            <span className="w-px h-4 bg-gray-200 dark:bg-white/10" />
            <span>Version 2.0</span>
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  );
}
