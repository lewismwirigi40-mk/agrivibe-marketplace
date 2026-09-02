// src/pages/admin/dashboard.tsx
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
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
} from "recharts";
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
  FileText,
  RefreshCw,
} from "lucide-react";
import AdminLayout from "../../components/AdminLayout";
import api from "../../services/api";

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [userGrowthData, setUserGrowthData] = useState<any[]>([]);
  const [orderStatusData, setOrderStatusData] = useState<any[]>([]);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState("week");
  const [pendingVendorsCount, setPendingVendorsCount] = useState(0);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        router.push("/login");
        return;
      }

      // ✅ Fetch dashboard stats from real endpoint
      const statsResponse = await api.get("/dashboard/stats");
      const statsData = statsResponse.data.stats || {};

      // ✅ Get real counts
      setPendingVendorsCount(statsData.pendingVendors || 0);

      setStats({
        totalUsers: statsData.totalUsers || 0,
        totalVendors: statsData.totalVendors || 0,
        totalOrders: statsData.totalOrders || 0,
        totalRevenue: statsData.totalRevenue || 0,
        pendingVendors: statsData.pendingVendors || 0,
        todayOrders: statsData.todayOrders || 0,
        todayUsers: statsData.todayUsers || 0,
        totalDrivers: statsData.totalDrivers || 0,
        totalCustomers: statsData.totalCustomers || statsData.totalUsers || 0,
        platformWallet: statsData.totalRevenue || 0,
        pendingProducts: statsData.pendingProducts || 0,
      });

      // ✅ Fetch real order status data from backend
      try {
        const orderStatusResponse = await api.get("/admin/order-status");
        if (orderStatusResponse.data && orderStatusResponse.data.statuses) {
          setOrderStatusData(orderStatusResponse.data.statuses);
        } else {
          // Fallback to real data from orders
          const ordersRes = await api.get("/admin/orders?limit=100");
          const orders = ordersRes.data.orders || [];
          const statusCounts: Record<string, number> = {};
          orders.forEach((order: any) => {
            const status = order.status || "pending";
            statusCounts[status] = (statusCounts[status] || 0) + 1;
          });
          const statusData = Object.keys(statusCounts).map((key) => ({
            name: key.charAt(0).toUpperCase() + key.slice(1),
            value: statusCounts[key],
          }));
          setOrderStatusData(
            statusData.length > 0
              ? statusData
              : [
                  { name: "Completed", value: 0 },
                  { name: "Pending", value: 0 },
                  { name: "Processing", value: 0 },
                ],
          );
        }
      } catch (err) {
        console.warn("Could not fetch order status, using empty data:", err);
        setOrderStatusData([]);
      }

      // ✅ Fetch real revenue data from backend
      try {
        const revenueRes = await api.get(
          `/admin/revenue?period=${selectedPeriod}`,
        );
        if (revenueRes.data && revenueRes.data.data) {
          setRevenueData(revenueRes.data.data);
        } else {
          setRevenueData([]);
        }
      } catch (err) {
        console.warn("Could not fetch revenue data:", err);
        setRevenueData([]);
      }

      // ✅ Fetch real user growth data
      try {
        const userGrowthRes = await api.get(
          `/admin/user-growth?period=${selectedPeriod}`,
        );
        if (userGrowthRes.data && userGrowthRes.data.data) {
          setUserGrowthData(userGrowthRes.data.data);
        } else {
          setUserGrowthData([]);
        }
      } catch (err) {
        console.warn("Could not fetch user growth data:", err);
        setUserGrowthData([]);
      }

      // ✅ Fetch real recent activities
      try {
        const activitiesRes = await api.get("/admin/recent-activities");
        setRecentActivities(activitiesRes.data.activities || []);
      } catch (err) {
        console.warn("Could not fetch recent activities:", err);
        setRecentActivities([]);
      }
    } catch (error: any) {
      console.error("Failed to fetch dashboard data:", error);
      setError(error.response?.data?.error || "Failed to load dashboard");
      setRevenueData([]);
      setUserGrowthData([]);
      setOrderStatusData([]);
      setRecentActivities([]);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = [
    "#22c55e",
    "#10b981",
    "#059669",
    "#047857",
    "#f59e0b",
    "#ef4444",
    "#3b82f6",
  ];

  const formatCurrency = (amount: number) => {
    return `KES ${amount?.toLocaleString() || 0}`;
  };

  const getActivityIcon = (type: string) => {
    const icons: Record<string, any> = {
      vendor_registered: Store,
      order_delivered: CheckCircle,
      customer_joined: User,
      product_approved: Package,
      order_placed: ShoppingBag,
      payment_received: CreditCard,
      vendor_approved: Award,
    };
    return icons[type] || Activity;
  };

  const getActivityColor = (type: string) => {
    const colors: Record<string, string> = {
      vendor_registered: "text-green-500 bg-green-50",
      order_delivered: "text-blue-500 bg-blue-50",
      customer_joined: "text-purple-500 bg-purple-50",
      product_approved: "text-yellow-500 bg-yellow-50",
      order_placed: "text-orange-500 bg-orange-50",
      payment_received: "text-emerald-500 bg-emerald-50",
      vendor_approved: "text-indigo-500 bg-indigo-50",
    };
    return colors[type] || "text-gray-500 bg-gray-50";
  };

  const formatTimeAgo = (dateString: string) => {
    if (!dateString) return "Just now";
    const now = new Date();
    const past = new Date(dateString);
    const diffMinutes = Math.floor((now.getTime() - past.getTime()) / 60000);

    if (diffMinutes < 1) return "Just now";
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
    {
      label: "Total Users",
      value: stats.totalUsers || 0,
      icon: Users,
      color: "from-blue-500 to-blue-600",
      bg: "bg-blue-50",
      link: "/admin/users",
    },
    {
      label: "Vendors",
      value: stats.totalVendors || 0,
      icon: Store,
      color: "from-green-500 to-emerald-500",
      bg: "bg-green-50",
      link: "/admin/vendors",
    },
    {
      label: "Total Orders",
      value: stats.totalOrders || 0,
      icon: Package,
      color: "from-indigo-500 to-indigo-600",
      bg: "bg-indigo-50",
      link: "/admin/orders",
    },
    {
      label: "Total Revenue",
      value: formatCurrency(stats.totalRevenue || 0),
      icon: DollarSign,
      color: "from-emerald-500 to-green-500",
      bg: "bg-emerald-50",
      link: "/admin/reports",
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* ====== HEADER ====== */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              {pendingVendorsCount > 0 && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium border border-yellow-200 animate-pulse">
                  <Clock className="w-3 h-3" />
                  {pendingVendorsCount} Pending Vendors
                </span>
              )}
            </div>
            <p className="text-gray-500 mt-1 flex items-center gap-2">
              Platform overview and key metrics
              <span className="w-1 h-1 bg-gray-300 rounded-full" />
              <span className="text-xs text-gray-400">
                {stats.todayOrders || 0} orders today
              </span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchDashboardData}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            <button
              onClick={() => router.push("/admin/vendors/pending")}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl hover:shadow-xl hover:shadow-yellow-500/30 transition-all duration-300 font-medium"
            >
              <Users className="w-4 h-4" />
              Pending Vendors
              {pendingVendorsCount > 0 && (
                <span className="ml-1 bg-white/20 px-2 py-0.5 rounded-full text-xs">
                  {pendingVendorsCount}
                </span>
              )}
            </button>
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
                whileHover={{ y: -4 }}
                onClick={() => stat.link && router.push(stat.link)}
                className={`${stat.bg} rounded-2xl border border-gray-100 p-5 hover:shadow-lg transition-all duration-300 cursor-pointer`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {stat.value}
                    </p>
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

        {/* ====== PENDING VENDORS ALERT ====== */}
        {pendingVendorsCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-yellow-800">
                  {pendingVendorsCount} vendor
                  {pendingVendorsCount > 1 ? "s" : ""} awaiting approval
                </p>
                <p className="text-sm text-yellow-600">
                  Review and approve vendor registrations
                </p>
              </div>
            </div>
            <button
              onClick={() => router.push("/admin/vendors/pending")}
              className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-xl hover:bg-yellow-600 transition-colors font-medium"
            >
              Review Now
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        {/* ====== CHARTS ROW ====== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Chart - REAL DATA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Revenue Trend
                </h3>
                <p className="text-sm text-gray-500">
                  {selectedPeriod === "week" ? "Weekly" : "Monthly"} revenue
                  performance
                </p>
              </div>
              <div className="flex gap-1">
                {["week", "month"].map((period) => (
                  <button
                    key={period}
                    onClick={() => setSelectedPeriod(period)}
                    className={`px-3 py-1 text-xs rounded-lg transition-all ${
                      selectedPeriod === period
                        ? "bg-agrivibe-green text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {period.charAt(0).toUpperCase() + period.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-64">
              {revenueData.length > 0 ? (
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

          {/* User Growth - REAL DATA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">User Growth</h3>
                <p className="text-sm text-gray-500">New user registrations</p>
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
                        backgroundColor: "#fff",
                        border: "1px solid #e5e7eb",
                        borderRadius: "12px",
                        boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
                      }}
                      formatter={(value: any) => [value, "New Users"]}
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
          {/* Order Status - REAL DATA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Order Status Distribution
                </h3>
                <p className="text-sm text-gray-500">Current order breakdown</p>
              </div>
              <PieChartIcon className="w-5 h-5 text-gray-400" />
            </div>
            <div className="h-64">
              {orderStatusData.length > 0 &&
              orderStatusData.some((d) => d.value > 0) ? (
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
                      label={({ name, percent }: any) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
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
                        backgroundColor: "#fff",
                        border: "1px solid #e5e7eb",
                        borderRadius: "12px",
                        boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
                      }}
                      formatter={(value: any) => [value, "Orders"]}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  No order data available
                </div>
              )}
            </div>
          </motion.div>

          {/* Quick Actions */}
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
              <button
                onClick={() => router.push("/admin/vendors/pending")}
                className="w-full bg-yellow-50 rounded-xl p-3 flex items-center justify-between hover:shadow-md transition-all duration-300 group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Store className="w-4 h-4 text-yellow-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    Review Pending Vendors
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-yellow-600">
                    {pendingVendorsCount}
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 group-hover:translate-x-1 transition-all" />
                </div>
              </button>

              <button
                onClick={() => router.push("/admin/users")}
                className="w-full bg-blue-50 rounded-xl p-3 flex items-center justify-between hover:shadow-md transition-all duration-300 group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    Manage Users
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-blue-600">
                    {stats.totalUsers}
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 group-hover:translate-x-1 transition-all" />
                </div>
              </button>

              <button
                onClick={() => router.push("/admin/orders")}
                className="w-full bg-green-50 rounded-xl p-3 flex items-center justify-between hover:shadow-md transition-all duration-300 group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <ShoppingBag className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    View All Orders
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-green-600">
                    {stats.totalOrders}
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 group-hover:translate-x-1 transition-all" />
                </div>
              </button>

              <button
                onClick={() => router.push("/admin/reports")}
                className="w-full bg-purple-50 rounded-xl p-3 flex items-center justify-between hover:shadow-md transition-all duration-300 group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-4 h-4 text-purple-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    Generate Reports
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 group-hover:translate-x-1 transition-all" />
              </button>
            </div>
          </motion.div>
        </div>

        {/* ====== RECENT ACTIVITY ====== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Recent Activity
              </h3>
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
                  <div
                    key={index}
                    className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div
                      className={`w-10 h-10 ${colorClass} rounded-xl flex items-center justify-center flex-shrink-0`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.action}
                      </p>
                      <p className="text-xs text-gray-500">{activity.user}</p>
                    </div>
                    <span className="text-xs text-gray-400">
                      {formatTimeAgo(activity.created_at)}
                    </span>
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
