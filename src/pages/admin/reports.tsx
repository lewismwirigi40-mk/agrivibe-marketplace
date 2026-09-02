// src/pages/admin/reports.tsx
import { useState, useRef, useEffect } from "react";
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
  const [exportFormat, setExportFormat] = useState<"csv" | "pdf" | "json">(
    "csv",
  );
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
    revenueChange: "+12.5%",
    ordersChange: "+8.3%",
    usersChange: "+5.2%",
    vendorsChange: "+2.1%",
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

  const handlePrint = () => {
    if (printRef.current) {
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>AgriVibe Report</title>
              <style>
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 40px; background: white; color: #1a1a2e; }
                h1 { color: #2d7d2d; font-size: 28px; }
                .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #2d7d2d; padding-bottom: 20px; }
                .report-title { font-size: 24px; font-weight: 700; color: #1a1a2e; }
                .report-meta { color: #666; font-size: 14px; margin-top: 5px; }
                .section { margin: 20px 0; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px; }
                .section-title { font-size: 18px; font-weight: 600; color: #1a1a2e; margin-bottom: 15px; }
                .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin: 15px 0; }
                .stat-card { padding: 15px; background: #f8fafc; border-radius: 10px; text-align: center; }
                .stat-value { font-size: 24px; font-weight: 700; color: #2d7d2d; }
                .stat-label { font-size: 12px; color: #666; margin-top: 5px; }
                table { width: 100%; border-collapse: collapse; margin: 10px 0; }
                th, td { border: 1px solid #e5e7eb; padding: 10px; text-align: left; font-size: 14px; }
                th { background: #f1f5f9; font-weight: 600; color: #1a1a2e; }
                .footer { text-align: center; margin-top: 30px; color: #94a3b8; font-size: 12px; border-top: 1px solid #e5e7eb; padding-top: 20px; }
                .badge { display: inline-block; padding: 2px 10px; border-radius: 20px; font-size: 12px; font-weight: 500; }
                .badge-success { background: #dcfce7; color: #166534; }
                .badge-warning { background: #fef3c7; color: #92400e; }
                .badge-info { background: #dbeafe; color: #1e40af; }
                .badge-danger { background: #fee2e2; color: #991b1b; }
              </style>
            </head>
            <body>
              <div class="header">
                <h1>🌾 AgriVibe</h1>
                <div class="report-title">Platform Report</div>
                <div class="report-meta">${currentDate} • ${reportTypes.find((t) => t.value === reportType)?.label || "Revenue"} Report</div>
              </div>
              <div class="stats-grid">
                <div class="stat-card"><div class="stat-value">KES ${stats.totalRevenue.toLocaleString()}</div><div class="stat-label">Total Revenue</div></div>
                <div class="stat-card"><div class="stat-value">${stats.totalOrders}</div><div class="stat-label">Total Orders</div></div>
                <div class="stat-card"><div class="stat-value">${stats.activeUsers}</div><div class="stat-label">Active Users</div></div>
                <div class="stat-card"><div class="stat-value">${stats.totalVendors}</div><div class="stat-label">Total Vendors</div></div>
              </div>
              ${printRef.current ? printRef.current.innerHTML : ""}
              <div class="footer">© 2026 AgriVibe KE Farm Solutions. All rights reserved.</div>
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
      }
    }
  };

  // ============================================
  // ============================================
  // ✅ UPDATED: PREMIUM DOWNLOAD FUNCTION
  // ============================================
  const handleDownload = () => {
    setLoading(true);
    setError("");

    try {
      const data = reportData;
      if (!data) {
        setError("No data to download. Generate a report first.");
        setLoading(false);
        return;
      }

      const reportLabel =
        reportTypes.find((t) => t.value === reportType)?.label || "Revenue";
      const dateLabel =
        dateRanges.find((r) => r.value === dateRange)?.label || "Month";
      const timestamp = new Date().toISOString().split("T")[0];
      const fileName = `AgriVibe_Report_${reportType}_${timestamp}`;

      // ============================================
      // BUILD DATA STRUCTURES
      // ============================================

      // 1. Executive Summary Data
      const summaryData = [
        ["Metric", "Value"],
        ["Total Revenue", `KES ${data.totalRevenue?.toLocaleString() || 0}`],
        ["Total Orders", data.totalOrders || 0],
        ["Active Users", data.activeUsers || 0],
        ["Total Vendors", data.totalVendors || 0],
        ["Revenue Change", data.revenueChange || "+0%"],
        ["Orders Change", data.ordersChange || "+0%"],
        ["Users Change", data.usersChange || "+0%"],
        ["Vendors Change", data.vendorsChange || "+0%"],
      ];

      // 2. Revenue Trend Data
      const trendData =
        data.revenueTrend && data.revenueTrend.length > 0
          ? [
              ["Date", "Revenue (KES)", "Orders"],
              ...data.revenueTrend.map((item: any) => [
                item.month,
                item.revenue || 0,
                item.orders || 0,
              ]),
            ]
          : [
              ["Date", "Revenue (KES)", "Orders"],
              ["No Data", 0, 0],
            ];

      // 3. Category Sales Data
      const categoryData =
        data.categorySales && data.categorySales.length > 0
          ? [
              ["Category", "Amount (KES)"],
              ...data.categorySales
                .filter(
                  (item: any) =>
                    item.name &&
                    item.name !== "No Sales Yet" &&
                    item.name !== "Categories Not Assigned" &&
                    item.name !== "Data Unavailable",
                )
                .map((item: any) => [item.name, item.value || 0]),
            ]
          : [
              ["Category", "Amount (KES)"],
              ["No Sales Data", 0],
            ];

      // 4. Transactions Data
      const transactionsData =
        data.transactions && data.transactions.length > 0
          ? [
              [
                "Order ID",
                "Customer",
                "Vendor",
                "Amount (KES)",
                "Status",
                "Date",
              ],
              ...data.transactions.map((item: any) => [
                item.order_number || item.id,
                item.customer?.name || "Customer",
                item.vendor?.store_name || "Vendor",
                item.total || 0,
                item.status || "pending",
                item.created_at
                  ? new Date(item.created_at).toLocaleDateString()
                  : "",
              ]),
            ]
          : [
              [
                "Order ID",
                "Customer",
                "Vendor",
                "Amount (KES)",
                "Status",
                "Date",
              ],
              ["No Transactions", "", "", 0, "", ""],
            ];

      // ============================================
      // BUILD EXCEL WORKBOOK (if xlsx is available)
      // ============================================
      let excelData: any = null;
      try {
        const XLSX = require("xlsx");

        // Create workbook
        const wb = XLSX.utils.book_new();

        // Summary Sheet
        const summaryWs = XLSX.utils.aoa_to_sheet(summaryData);
        XLSX.utils.book_append_sheet(wb, summaryWs, "Executive Summary");

        // Revenue Trend Sheet
        const trendWs = XLSX.utils.aoa_to_sheet(trendData);
        XLSX.utils.book_append_sheet(wb, trendWs, "Revenue Trend");

        // Category Sales Sheet
        const categoryWs = XLSX.utils.aoa_to_sheet(categoryData);
        XLSX.utils.book_append_sheet(wb, categoryWs, "Category Sales");

        // Transactions Sheet
        const transactionsWs = XLSX.utils.aoa_to_sheet(transactionsData);
        XLSX.utils.book_append_sheet(wb, transactionsWs, "Transactions");

        // Generate Excel file
        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        excelData = new Blob([excelBuffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
      } catch (xlsxError) {
        console.log("Excel export not available, falling back to CSV");
        excelData = null;
      }

      // ============================================
      // BUILD CSV DATA (Fallback)
      // ============================================
      let csvContent = "AgriVibe Platform Report\n";
      csvContent += `Generated: ${new Date().toLocaleString()}\n`;
      csvContent += `Report Type: ${reportLabel}\n`;
      csvContent += `Date Range: ${dateLabel}\n`;
      csvContent += "=".repeat(60) + "\n\n";

      // Executive Summary
      csvContent += "EXECUTIVE SUMMARY\n";
      csvContent += "-----------------\n";
      summaryData.slice(1).forEach((row: any[]) => {
        csvContent += `${row[0]},${row[1]}\n`;
      });
      csvContent += "\n";

      // Revenue Trend
      if (data.revenueTrend && data.revenueTrend.length > 0) {
        csvContent += "REVENUE TREND\n";
        csvContent += "-------------\n";
        csvContent += "Date,Revenue (KES),Orders\n";
        data.revenueTrend.forEach((item: any) => {
          csvContent += `${item.month},${item.revenue || 0},${item.orders || 0}\n`;
        });
        csvContent += "\n";
      }

      // Category Sales
      if (data.categorySales && data.categorySales.length > 0) {
        csvContent += "SALES BY CATEGORY\n";
        csvContent += "-----------------\n";
        csvContent += "Category,Amount (KES)\n";
        data.categorySales.forEach((item: any) => {
          if (
            item.name &&
            item.name !== "No Sales Yet" &&
            item.name !== "Categories Not Assigned" &&
            item.name !== "Data Unavailable"
          ) {
            csvContent += `${item.name},${item.value || 0}\n`;
          }
        });
        csvContent += "\n";
      }

      // Recent Transactions
      if (data.transactions && data.transactions.length > 0) {
        csvContent += "RECENT TRANSACTIONS\n";
        csvContent += "-------------------\n";
        csvContent += "Order ID,Customer,Vendor,Amount (KES),Status,Date\n";
        data.transactions.forEach((item: any) => {
          csvContent += `${item.order_number || item.id},${item.customer?.name || "Customer"},${item.vendor?.store_name || "Vendor"},${item.total || 0},${item.status || "pending"},${item.created_at ? new Date(item.created_at).toLocaleDateString() : ""}\n`;
        });
      }

      // ============================================
      // DOWNLOAD FILE
      // ============================================

      // Prefer Excel if available
      if (excelData) {
        const url = window.URL.createObjectURL(excelData);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${fileName}.xlsx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        setSuccessMessage("Excel report downloaded successfully!");
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      } else {
        // Fallback to CSV
        const blob = new Blob([csvContent], {
          type: "text/csv;charset=utf-8;",
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${fileName}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        setSuccessMessage("CSV report downloaded successfully!");
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      }
    } catch (error) {
      console.error("Download error:", error);
      setError("Failed to download report. Please try again.");
    } finally {
      setLoading(false);
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

  const tooltipFormatter = (value: any, name: string, props: any) => {
    if (name === "orders" || name === "Orders") {
      return [value, "Orders"];
    }
    if (name === "revenue" || name === "Revenue") {
      return [`KES ${value?.toLocaleString() || 0}`, "Revenue"];
    }
    return [value, name];
  };

  const pieLabelFormatter = ({ name, percent }: any) => {
    if (
      name === "No Sales Yet" ||
      name === "Categories Not Assigned" ||
      name === "Data Unavailable"
    ) {
      return "";
    }
    return `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`;
  };

  const statCards = [
    {
      label: "Total Revenue",
      value: `KES ${stats.totalRevenue.toLocaleString()}`,
      change: stats.revenueChange,
      icon: DollarSign,
      color: "from-emerald-500 to-green-500",
      bg: "bg-emerald-50 dark:bg-emerald-500/10",
      border: "border-emerald-200 dark:border-emerald-500/20",
    },
    {
      label: "Total Orders",
      value: stats.totalOrders,
      change: stats.ordersChange,
      icon: ShoppingBag,
      color: "from-blue-500 to-indigo-500",
      bg: "bg-blue-50 dark:bg-blue-500/10",
      border: "border-blue-200 dark:border-blue-500/20",
    },
    {
      label: "Active Users",
      value: stats.activeUsers,
      change: stats.usersChange,
      icon: Users,
      color: "from-purple-500 to-pink-500",
      bg: "bg-purple-50 dark:bg-purple-500/10",
      border: "border-purple-200 dark:border-purple-500/20",
    },
    {
      label: "Vendors",
      value: stats.totalVendors,
      change: stats.vendorsChange,
      icon: Store,
      color: "from-orange-500 to-amber-500",
      bg: "bg-orange-50 dark:bg-orange-500/10",
      border: "border-orange-200 dark:border-orange-500/20",
    },
  ];

  // Premium KPI Cards
  const kpiCards = [
    {
      label: "Avg Order Value",
      value:
        stats.totalOrders > 0
          ? `KES ${(stats.totalRevenue / stats.totalOrders).toFixed(2)}`
          : "KES 0",
      icon: TrendingUp,
      color: "text-emerald-500",
      bg: "bg-emerald-50 dark:bg-emerald-500/10",
    },
    {
      label: "Conversion Rate",
      value:
        stats.activeUsers > 0
          ? `${((stats.totalOrders / stats.activeUsers) * 100).toFixed(1)}%`
          : "0%",
      icon: Target,
      color: "text-blue-500",
      bg: "bg-blue-50 dark:bg-blue-500/10",
    },
    {
      label: "Revenue Growth",
      value: stats.revenueChange || "+0%",
      icon: TrendingUp,
      color: stats.revenueChange?.startsWith("+")
        ? "text-emerald-500"
        : "text-red-500",
      bg: stats.revenueChange?.startsWith("+")
        ? "bg-emerald-50 dark:bg-emerald-500/10"
        : "bg-red-50 dark:bg-red-500/10",
    },
    {
      label: "Customer Retention",
      value: "85%",
      icon: Heart,
      color: "text-pink-500",
      bg: "bg-pink-50 dark:bg-pink-500/10",
    },
  ];

  if (isFetching) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-agrivibe-green/20 border-t-agrivibe-green rounded-full animate-spin mx-auto" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-agrivibe-green animate-pulse" />
              </div>
            </div>
            <p className="text-gray-500 mt-4 font-medium">
              Loading premium analytics...
            </p>
            <p className="text-gray-400 text-sm">Preparing your report data</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* ====== PREMIUM HEADER ====== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden bg-gradient-to-br from-agrivibe-green via-emerald-600 to-teal-700 rounded-2xl p-8 text-white"
        >
          {/* Animated Background */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 animate-pulse" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 animate-pulse delay-1000" />
            <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 animate-pulse delay-2000" />
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
                onClick={handleDownload}
                disabled={loading}
                className="flex items-center gap-2 px-5 py-2.5 bg-white text-agrivibe-green rounded-xl font-semibold hover:shadow-xl hover:scale-[1.02] transition-all duration-300 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-agrivibe-green border-t-transparent rounded-full animate-spin" />{" "}
                    Downloading...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" /> Export
                  </>
                )}
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2.5 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-xl transition-all duration-300 text-white font-medium text-sm"
              >
                <Printer className="w-4 h-4" />
                Print
              </button>
            </div>
          </div>
        </motion.div>

        {/* ====== SUCCESS TOAST ====== */}
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 rounded-2xl p-4 flex items-center gap-3"
          >
            <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                {successMessage || "Report downloaded successfully!"}
              </p>
              <p className="text-xs text-emerald-600 dark:text-emerald-500">
                Your file has been exported.
              </p>
            </div>
          </motion.div>
        )}

        {/* ====== PREMIUM CONTROLS ====== */}
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

        {/* ====== PREMIUM STATS CARDS ====== */}
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
                className={`${stat.bg} ${stat.border} rounded-2xl border p-5 hover:shadow-xl transition-all duration-300 group`}
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
                    className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* ====== KPI CARDS ====== */}
        {viewMode === "detailed" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {kpiCards.map((kpi, index) => {
              const Icon = kpi.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * index + 0.2 }}
                  className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-white/10 p-4 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 ${kpi.bg} rounded-xl flex items-center justify-center`}
                    >
                      <Icon className={`w-5 h-5 ${kpi.color}`} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {kpi.label}
                      </p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        {kpi.value}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* ====== PREMIUM CHARTS ====== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Trend - Premium */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-white/10 p-6 hover:shadow-2xl transition-shadow duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-500/20 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Revenue Trend
                  </h3>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Daily revenue performance over selected period
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full text-xs font-medium border border-emerald-200 dark:border-emerald-500/30">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                Live
              </span>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient
                      id="premiumRevenueGrad"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient
                      id="premiumOrdersGrad"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis
                    dataKey="month"
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "16px",
                      boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
                      padding: "12px 16px",
                    }}
                    formatter={tooltipFormatter}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#22c55e"
                    strokeWidth={3}
                    fill="url(#premiumRevenueGrad)"
                    name="Revenue"
                  />
                  <Area
                    type="monotone"
                    dataKey="orders"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    fill="url(#premiumOrdersGrad)"
                    name="Orders"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Sales by Category - Premium */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-white/10 p-6 hover:shadow-2xl transition-shadow duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <PieChartIcon className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Category Distribution
                  </h3>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Sales breakdown by product category
                </p>
              </div>
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
                    label={pieLabelFormatter}
                    labelLine={false}
                  >
                    {categorySales.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={PREMIUM_COLORS[index % PREMIUM_COLORS.length]}
                        stroke="#fff"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "16px",
                      boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
                      padding: "12px 16px",
                    }}
                    formatter={(value: any) => [
                      `KES ${value?.toLocaleString() || 0}`,
                      "Sales",
                    ]}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    iconType="circle"
                    iconSize={8}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* ====== ORDER VOLUME CHART ====== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-white/10 p-6 hover:shadow-2xl transition-shadow duration-300"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-500/20 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Orders & Revenue Overview
                </h3>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Combined view of order volume and revenue generation
              </p>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={revenueData}>
                <defs>
                  <linearGradient
                    id="composedRevenueGrad"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="month"
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  yAxisId="left"
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "16px",
                    boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
                    padding: "12px 16px",
                  }}
                  formatter={tooltipFormatter}
                />
                <Legend />
                <Bar
                  yAxisId="left"
                  dataKey="orders"
                  fill="#3b82f6"
                  radius={[6, 6, 0, 0]}
                  name="Orders"
                />
                <Area
                  yAxisId="right"
                  type="monotone"
                  dataKey="revenue"
                  stroke="#22c55e"
                  strokeWidth={3}
                  fill="url(#composedRevenueGrad)"
                  name="Revenue"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* ====== RECENT TRANSACTIONS ====== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-white/10 p-6 hover:shadow-2xl transition-shadow duration-300"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-cyan-100 dark:bg-cyan-500/20 rounded-lg flex items-center justify-center">
                  <FileText className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Recent Transactions
                </h3>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Latest order activity on the platform
              </p>
            </div>
            <span className="text-xs text-gray-400">
              {transactions.length} transactions
            </span>
          </div>
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
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-12 text-gray-500">
                      <div className="flex flex-col items-center gap-2">
                        <Package className="w-8 h-8 text-gray-300" />
                        <p>No transactions found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  transactions.map((row: any, index: number) => (
                    <motion.tr
                      key={row.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.02 * index }}
                      className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                    >
                      <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">
                        {row.order_number || row.id?.slice(0, 8)}
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
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* ====== PREMIUM FOOTER ====== */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
          className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-100 dark:border-white/5"
        >
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <span>© 2026 AgriVibe KE Farm Solutions</span>
            <span className="w-px h-4 bg-gray-200 dark:bg-white/10" />
            <span>All rights reserved</span>
            <span className="w-px h-4 bg-gray-200 dark:bg-white/10" />
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
