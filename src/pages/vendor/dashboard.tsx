// src/pages/vendor/dashboard.tsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  Wallet,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Sparkles,
  Store,
  Calendar,
  Award,
  Shield,
  Star,
  Eye,
  BarChart3,
  PieChart,
  LineChart,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  ChevronRight,
  MoreVertical,
  Download,
  Printer,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Copy,
  Share2,
  ExternalLink,
  MessageCircle,
  Bell,
  Settings,
  HelpCircle,
  Zap,
  Crown,
  Gift,
  Heart,
  ThumbsUp,
  Users as UsersIcon,
  DollarSign,
  Percent,
  Target,
  Compass,
  MapPin,
  Phone,
  Mail,
  Globe,
  Building,
  User,
  CalendarDays,
  Clock as ClockIcon,
  Activity,
  Layers,
  Grid,
  List,
  Maximize2,
  Minimize2,
} from "lucide-react";
import VendorLayout from "../../components/VendorLayout";
import api from "../../services/api";

export default function VendorDashboard() {
  const router = useRouter();
  // ====== AUTHORIZATION STATE ======
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    pendingOrders: 0,
    completedOrders: 0,
    averageRating: 0,
    totalSales: 0,
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [recentProducts, setRecentProducts] = useState<any[]>([]);
  const [vendorData, setVendorData] = useState<any>(null);
  const [showWelcome, setShowWelcome] = useState(true);

  // ====== AUTHORIZATION CHECK (RUNS FIRST) ======
  const [redirecting, setRedirecting] = useState(false); // ✅ Add this with other states

  useEffect(() => {
    // ✅ Prevent multiple redirects
    if (redirecting) return;

    const rawUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    const vendorStatus = localStorage.getItem("vendorStatus");
    const isRedirecting = localStorage.getItem("isRedirecting");

    // 🛑 Check if user is logged in
    if (!token || !rawUser) {
      setRedirecting(true);
      router.push("/login");
      return;
    }

    try {
      const user = JSON.parse(rawUser);

      // 🛑 Check if user has vendor role
      if (user.role !== "vendor") {
        setRedirecting(true);
        router.push("/");
        return;
      }

      // 🛑 Check if vendor is approved
      if (vendorStatus !== "approved") {
        // ✅ Prevent infinite loop: only redirect if not already redirecting
        if (!isRedirecting) {
          setRedirecting(true);
          localStorage.setItem("isRedirecting", "true");
          router.push("/vendor/pending-approval");
        }
        return;
      }

      // ✅ Clear redirecting flag if we're on dashboard
      localStorage.removeItem("isRedirecting");
      setRedirecting(false);

      // ✅ All checks passed
      setAuthorized(true);
    } catch (err) {
      console.error("Authorization error:", err);
      setRedirecting(true);
      router.push("/login");
    }
  }, [router, redirecting]); // ✅ Add redirecting to dependency array
  // ====== FETCH DATA (ONLY IF AUTHORIZED) ======
  useEffect(() => {
    if (!authorized) return;

    fetchDashboardData();
    fetchVendorProfile();

    // Hide welcome after 5 seconds
    const timer = setTimeout(() => setShowWelcome(false), 5000);
    return () => clearTimeout(timer);
  }, [authorized]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) return;

      // Fetch vendor stats
      const statsResponse = await api.get("/vendor/stats");
      const statsData = statsResponse.data || {};

      setStats({
        totalProducts: statsData.totalProducts || 0,
        totalOrders: statsData.totalOrders || 0,
        totalRevenue: statsData.totalRevenue || 0,
        totalCustomers: statsData.totalCustomers || 0,
        pendingOrders: statsData.pendingOrders || 0,
        completedOrders: statsData.completedOrders || 0,
        averageRating: statsData.averageRating || 0,
        totalSales: statsData.totalSales || 0,
      });

      // Fetch recent orders
      const ordersResponse = await api.get("/vendor/orders?limit=5");
      setRecentOrders(ordersResponse.data.orders || []);

      // Fetch recent products
      const productsResponse = await api.get("/vendor/products?limit=5");
      setRecentProducts(productsResponse.data.products || []);
    } catch (error: any) {
      console.error("Failed to fetch dashboard data:", error);
      setError(error.response?.data?.error || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const fetchVendorProfile = async () => {
    try {
      const response = await api.get("/vendor/profile");
      setVendorData(response.data.vendor || response.data);
    } catch (error) {
      console.error("Failed to fetch vendor profile:", error);
    }
  };

  const formatCurrency = (amount: number) => {
    return `KES ${amount?.toLocaleString() || 0}`;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-KE", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
      completed: "bg-green-100 text-green-700 border-green-200",
      cancelled: "bg-red-100 text-red-700 border-red-200",
      processing: "bg-blue-100 text-blue-700 border-blue-200",
      shipped: "bg-purple-100 text-purple-700 border-purple-200",
    };
    return colors[status] || "bg-gray-100 text-gray-700 border-gray-200";
  };

  const getStatusIcon = (status: string) => {
    const icons: Record<string, any> = {
      pending: Clock,
      completed: CheckCircle,
      cancelled: XCircle,
      processing: RefreshCw,
      shipped: Package,
    };
    return icons[status] || AlertCircle;
  };

  // ====== LOADING / AUTHORIZATION CHECK ======
  if (!authorized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-agrivibe-green border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Verifying dashboard credentials...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <VendorLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-agrivibe-green border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Loading dashboard...</p>
          </div>
        </div>
      </VendorLayout>
    );
  }

  return (
    <VendorLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
      >
        {/* ====== WELCOME BANNER ====== */}
        <AnimatePresence>
          {showWelcome && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="relative overflow-hidden bg-gradient-to-r from-agrivibe-green to-emerald-600 rounded-2xl p-6 text-white"
            >
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
              </div>
              <div className="relative flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-yellow-300" />
                    <span className="text-sm font-medium text-white/80">
                      Welcome back!
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold mt-1">
                    {vendorData?.business_name || "Vendor Dashboard"}
                  </h2>
                  <p className="text-white/80 text-sm">
                    Here's what's happening with your business today
                  </p>
                </div>
                <div className="hidden md:flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-white/20 rounded-full text-xs">
                    <CheckCircle className="w-3 h-3" />
                    Verified
                  </span>
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-white/20 rounded-full text-xs">
                    <Star className="w-3 h-3" />
                    {stats.averageRating || 0}★
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ====== HEADER ====== */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500 mt-1 flex items-center gap-2">
              Overview of your vendor business
              <span className="w-1 h-1 bg-gray-300 rounded-full" />
              <span className="text-xs text-gray-400">
                Last updated: {formatDate(new Date().toISOString())}
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
              onClick={() => router.push("/vendor/products/new")}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-agrivibe-green to-emerald-500 text-white rounded-xl hover:shadow-xl hover:shadow-agrivibe-green/30 transition-all duration-300 font-medium"
            >
              <Plus className="w-4 h-4" />
              Add Product
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
              className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ====== STATS CARDS ====== */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: "Total Revenue",
              value: formatCurrency(stats.totalRevenue),
              icon: Wallet,
              color: "from-green-500 to-emerald-500",
              bgColor: "bg-green-50",
              change: "+12%",
              trend: "up",
            },
            {
              label: "Total Orders",
              value: stats.totalOrders,
              icon: ShoppingBag,
              color: "from-blue-500 to-blue-600",
              bgColor: "bg-blue-50",
              change: `${stats.pendingOrders} pending`,
              trend: "neutral",
            },
            {
              label: "Products",
              value: stats.totalProducts,
              icon: Package,
              color: "from-purple-500 to-purple-600",
              bgColor: "bg-purple-50",
              change: "+5 this month",
              trend: "up",
            },
            {
              label: "Customers",
              value: stats.totalCustomers,
              icon: UsersIcon,
              color: "from-yellow-500 to-orange-500",
              bgColor: "bg-yellow-50",
              change: "+8%",
              trend: "up",
            },
          ].map((stat, index) => {
            const Icon = stat.icon;
            const TrendIcon =
              stat.trend === "up"
                ? TrendingUp
                : stat.trend === "down"
                  ? TrendingDown
                  : Activity;
            const trendColor =
              stat.trend === "up"
                ? "text-green-500"
                : stat.trend === "down"
                  ? "text-red-500"
                  : "text-gray-400";

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                className="bg-white rounded-2xl shadow-md border border-gray-100 p-5 cursor-pointer hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {stat.value}
                    </p>
                    <div className="flex items-center gap-1.5 mt-2">
                      <TrendIcon className={`w-3.5 h-3.5 ${trendColor}`} />
                      <span className={`text-xs font-medium ${trendColor}`}>
                        {stat.change}
                      </span>
                    </div>
                  </div>
                  <div
                    className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ====== SECONDARY STATS ====== */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: "Pending Orders",
              value: stats.pendingOrders,
              icon: Clock,
              color: "from-yellow-400 to-yellow-500",
            },
            {
              label: "Completed Orders",
              value: stats.completedOrders,
              icon: CheckCircle,
              color: "from-green-400 to-green-500",
            },
            {
              label: "Total Sales",
              value: stats.totalSales,
              icon: DollarSign,
              color: "from-blue-400 to-blue-500",
            },
            {
              label: "Avg Rating",
              value: `${stats.averageRating || 0}★`,
              icon: Star,
              color: "from-yellow-400 to-orange-500",
            },
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{stat.label}</p>
                    <p className="text-lg font-bold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ====== RECENT ACTIVITY ====== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Recent Orders
                </h3>
              </div>
              <button
                onClick={() => router.push("/vendor/orders")}
                className="text-sm text-agrivibe-green hover:underline font-medium flex items-center gap-1"
              >
                View All
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            {recentOrders.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No recent orders</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentOrders.map((order, index) => {
                  const StatusIcon = getStatusIcon(order.status);
                  const statusColor = getStatusColor(order.status);
                  return (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                      onClick={() => router.push(`/vendor/orders/${order.id}`)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-agrivibe-green/10 rounded-full flex items-center justify-center">
                          <ShoppingBag className="w-5 h-5 text-agrivibe-green" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            #{order.id?.slice(0, 8) || "N/A"}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatDate(order.created_at)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          {formatCurrency(order.total_amount)}
                        </p>
                        <span
                          className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full border ${statusColor}`}
                        >
                          <StatusIcon className="w-3 h-3" />
                          {order.status}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Recent Products */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Recent Products
                </h3>
              </div>
              <button
                onClick={() => router.push("/vendor/products")}
                className="text-sm text-agrivibe-green hover:underline font-medium flex items-center gap-1"
              >
                View All
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            {recentProducts.length === 0 ? (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No products yet</p>
                <button
                  onClick={() => router.push("/vendor/products/new")}
                  className="mt-2 text-sm text-agrivibe-green font-medium hover:underline"
                >
                  Add your first product
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {recentProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                    onClick={() =>
                      router.push(`/vendor/products/${product.id}`)
                    }
                  >
                    <div className="w-14 h-14 bg-gray-200 rounded-xl flex items-center justify-center overflow-hidden">
                      {product.images?.[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Package className="w-6 h-6 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">
                        {product.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatCurrency(product.price)}
                      </p>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        product.stock > 10
                          ? "bg-green-100 text-green-700"
                          : product.stock > 0
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                      }`}
                    >
                      {product.stock > 0
                        ? `${product.stock} in stock`
                        : "Out of stock"}
                    </span>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ====== QUICK ACTIONS ====== */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: "Add Product",
              icon: Plus,
              onClick: () => router.push("/vendor/products/new"),
              color:
                "bg-gradient-to-br from-green-50 to-green-100 text-green-600 hover:from-green-100 hover:to-green-200",
              description: "List new product",
            },
            {
              label: "View Orders",
              icon: ShoppingBag,
              onClick: () => router.push("/vendor/orders"),
              color:
                "bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 hover:from-blue-100 hover:to-blue-200",
              description: "Manage orders",
            },
            {
              label: "Analytics",
              icon: BarChart3,
              onClick: () => router.push("/vendor/analytics"),
              color:
                "bg-gradient-to-br from-purple-50 to-purple-100 text-purple-600 hover:from-purple-100 hover:to-purple-200",
              description: "View insights",
            },
            {
              label: "Profile",
              icon: Store,
              onClick: () => router.push("/vendor/settings"),
              color:
                "bg-gradient-to-br from-yellow-50 to-yellow-100 text-yellow-600 hover:from-yellow-100 hover:to-yellow-200",
              description: "Manage store",
            },
          ].map((action, index) => {
            const Icon = action.icon;
            return (
              <motion.button
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.05 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={action.onClick}
                className={`${action.color} border border-white/20 rounded-2xl p-5 text-center transition-all duration-300 shadow-sm hover:shadow-lg group`}
              >
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mx-auto mb-2 shadow-sm group-hover:shadow-md transition-all">
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-sm font-semibold block">
                  {action.label}
                </span>
                <span className="text-xs text-gray-400">
                  {action.description}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* ====== VENDOR BADGE ====== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="relative overflow-hidden bg-gradient-to-r from-agrivibe-green via-emerald-500 to-green-600 rounded-2xl p-6 text-white"
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
          </div>
          <div className="relative flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-300" />
                <span className="text-sm font-medium text-white/80">
                  Verified Vendor
                </span>
                <span className="text-xs px-2 py-0.5 bg-white/20 rounded-full flex items-center gap-1">
                  <Crown className="w-3 h-3" />
                  Pro
                </span>
              </div>
              <h3 className="text-2xl font-bold mt-1">
                {vendorData?.business_name || "Your Store"}
              </h3>
              <p className="text-white/80 text-sm">
                {vendorData?.business_email || "vendor@agrivibe.com"}
              </p>
              <div className="flex items-center gap-3 mt-2">
                <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 bg-white/20 rounded-full">
                  <CheckCircle className="w-3 h-3" />
                  Verified
                </span>
                <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 bg-white/20 rounded-full">
                  <Star className="w-3 h-3" />
                  {stats.averageRating || 0}★ ({stats.totalSales || 0} sales)
                </span>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <Store className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </VendorLayout>
  );
}
