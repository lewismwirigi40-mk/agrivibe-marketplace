// src/pages/admin/live.tsx
import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingBag,
  Users,
  Store,
  Package,
  Truck,
  Shield,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Zap,
  Sparkles,
  Crown,
  Lock,
  Star,
  UserPlus,
  ArrowUp,
  ArrowDown,
  Activity,
  Loader2,
  Bell,
  ChevronRight,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
} from "lucide-react";
import AdminLayout from "../../components/AdminLayout";
import MatrixBackground from "../../components/MatrixBackground";
import api from "../../services/api";

interface LiveStats {
  stats: {
    totalRevenue: number;
    totalOrders: number;
    totalUsers: number;
    totalVendors: number;
    totalDrivers: number;
    activeUsers: number;
    pendingOrders: number;
    pendingVendors: number;
    pendingProducts: number;
    platformFee: number;
    escrowHeld: number;
    escrowReleased: number;
  };
  today: {
    revenue: number;
    orders: number;
    newUsers: number;
    newVendors: number;
  };
  deliveries: {
    inTransit: number;
    delivered: number;
    failed: number;
  };
  revenueTrend: Array<{ label: string; revenue: number }>;
  recentOrders: Array<{
    id: string;
    order_number: string;
    customer_name: string;
    store_name: string;
    total: number;
    status: string;
    created_at: string;
  }>;
  topVendors: Array<{
    store_name: string;
    total_revenue: number;
    order_count: number;
  }>;
  timestamp: string;
}

export default function AdminLiveDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<LiveStats | null>(null);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [refreshing, setRefreshing] = useState(false);
  const [isLive, setIsLive] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  const [orderCount, setOrderCount] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // ✅ FIX: Track interval and fetching state
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isFetchingRef = useRef(false);

  const playNotificationSound = useCallback(() => {
    if (!soundEnabled) return;
    try {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
      }
    } catch (e) {
      // Silently fail
    }
  }, [soundEnabled]);

  useEffect(() => {
    audioRef.current = new Audio("/sounds/notification.mp3");
    audioRef.current.volume = 0.3;
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // ✅ FIXED: fetchLiveData with static identity (no 'data' dependency loop)
  const fetchLiveData = useCallback(
    async (showSpinner = true) => {
      // ✅ Prevent multiple simultaneous calls
      if (isFetchingRef.current) {
        console.log("⚠️ Skipping fetch - already in progress");
        return;
      }
      isFetchingRef.current = true;

      if (showSpinner) {
        setRefreshing(true);
      }

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          isFetchingRef.current = false;
          return;
        }

        const response = await api.get("/admin/live/stats");
        if (response.data.success) {
          const newData = response.data;

          // ✅ FIXED: Use functional state update to compare old and new data
          setData((prevData) => {
            if (
              prevData &&
              newData.recentOrders.length > prevData.recentOrders.length
            ) {
              const newOrders =
                newData.recentOrders.length - prevData.recentOrders.length;
              if (newOrders > 0) {
                playNotificationSound();
              }
            }
            return newData;
          });

          setOrderCount(newData.recentOrders.length);
          setLastUpdated(new Date().toISOString());
          setError("");
        }
      } catch (error: any) {
        console.error("Failed to fetch live data:", error);
        setError(error.response?.data?.error || "Failed to load live data");
      } finally {
        setLoading(false);
        setRefreshing(false);
        isFetchingRef.current = false;
      }
    },
    [playNotificationSound], // ✅ FIXED: 'data' removed!
  );

  // ✅ FIXED: Polling Logic runs cleanly without resetting every fetch cycle
  useEffect(() => {
    // ✅ Clean up any existing interval first
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // --- Initial Fetch ---
    fetchLiveData(false);

    // --- Only start interval if Live is enabled ---
    if (isLive) {
      intervalRef.current = setInterval(() => {
        // ✅ Added isLive check here too
        if (!document.hidden && !isFetchingRef.current && isLive) {
          fetchLiveData(false);
        }
      }, 60000); // ✅ 60 seconds
    }

    // --- Handle Tab Visibility Change ---
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Tab hidden → stop polling
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      } else {
        // Tab visible → restart polling if Live is enabled
        if (isLive && !intervalRef.current) {
          intervalRef.current = setInterval(() => {
            if (!document.hidden && !isFetchingRef.current && isLive) {
              fetchLiveData(false);
            }
          }, 60000);
          // ✅ Immediately fetch fresh data when tab becomes visible
          fetchLiveData(false);
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // --- Cleanup on component unmount ---
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isLive, fetchLiveData]); // ✅ Works perfectly now because fetchLiveData doesn't change
  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) return `KES ${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `KES ${(amount / 1000).toFixed(1)}K`;
    return `KES ${amount?.toLocaleString() || 0}`;
  };

  const formatTime = (timestamp: string) => {
    if (!timestamp) return "N/A";
    return new Date(timestamp).toLocaleTimeString();
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      delivered:
        "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400",
      pending:
        "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400",
      processing:
        "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400",
      shipped:
        "bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400",
      cancelled: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400",
    };
    return (
      colors[status?.toLowerCase()] ||
      "bg-gray-100 text-gray-700 dark:bg-gray-500/20 dark:text-gray-400"
    );
  };

  const getStatusIcon = (status: string) => {
    const icons: Record<string, any> = {
      delivered: CheckCircle,
      pending: Clock,
      processing: Loader2,
      shipped: Truck,
      cancelled: XCircle,
    };
    return icons[status?.toLowerCase()] || Clock;
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setFullscreen(true);
    } else {
      document.exitFullscreen();
      setFullscreen(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-agrivibe-green/20 border-t-agrivibe-green rounded-full animate-spin mx-auto" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Zap className="w-8 h-8 text-agrivibe-green animate-pulse" />
              </div>
            </div>
            <p className="text-gray-500 dark:text-gray-400 mt-4 font-medium">
              Initializing Live Monitor...
            </p>
            <p className="text-gray-400 text-sm">Connecting to data stream</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const hasData =
    data && (data.recentOrders.length > 0 || data.stats.totalOrders > 0);

  return (
    <AdminLayout>
      <MatrixBackground opacity={0.1} color="#22c55e" />
      <div className="relative z-10 space-y-6">
        {/* ====== HEADER ====== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden bg-gradient-to-br from-agrivibe-green via-emerald-600 to-teal-700 rounded-2xl p-6 md:p-8 text-white"
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 animate-pulse" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 animate-pulse delay-1000" />
          </div>

          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
                    Live Command Center
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full animate-pulse">
                      <span className="w-2 h-2 bg-white rounded-full animate-ping" />
                      LIVE
                    </span>
                  </h1>
                  <p className="text-white/80 text-sm flex items-center gap-2">
                    Real-time platform monitoring
                    <span className="w-1 h-1 bg-white/30 rounded-full" />
                    <span className="text-xs text-white/60">
                      Updated: {formatTime(lastUpdated)}
                    </span>
                    <span
                      className={`text-xs ${isLive ? "text-green-300" : "text-red-300"}`}
                    >
                      • {isLive ? "Auto-refresh on" : "Auto-refresh off"}
                    </span>
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-2.5 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-xl transition-all duration-300 text-white"
                title={soundEnabled ? "Sound on" : "Sound off"}
              >
                {soundEnabled ? (
                  <Volume2 className="w-5 h-5" />
                ) : (
                  <VolumeX className="w-5 h-5" />
                )}
              </button>
              <button
                onClick={toggleFullscreen}
                className="p-2.5 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-xl transition-all duration-300 text-white"
                title="Toggle Fullscreen"
              >
                {fullscreen ? (
                  <Minimize2 className="w-5 h-5" />
                ) : (
                  <Maximize2 className="w-5 h-5" />
                )}
              </button>
              <button
                onClick={() => setIsLive(!isLive)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                  isLive
                    ? "bg-green-500/30 text-white border border-green-400/30"
                    : "bg-white/10 text-white/60 border border-white/10"
                }`}
              >
                {isLive ? (
                  <Play className="w-4 h-4" />
                ) : (
                  <Pause className="w-4 h-4" />
                )}
                {isLive ? "Live" : "Paused"}
              </button>
              <button
                onClick={() => fetchLiveData(true)}
                disabled={refreshing}
                className="p-2.5 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-xl transition-all duration-300 text-white disabled:opacity-50"
              >
                <RefreshCw
                  className={`w-5 h-5 ${refreshing ? "animate-spin" : ""}`}
                />
              </button>
            </div>
          </div>

          {/* Live Status Bar */}
          <div className="relative mt-4 flex flex-wrap items-center gap-4 pt-4 border-t border-white/10">
            <div className="flex items-center gap-2 text-white/70 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span>System Online</span>
              </div>
              <span className="w-px h-4 bg-white/20" />
              <div className="flex items-center gap-1.5">
                <Bell className="w-3.5 h-3.5" />
                <span>{data?.recentOrders?.length || 0} new orders</span>
              </div>
              <span className="w-px h-4 bg-white/20" />
              <div className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                <span>{data?.stats?.activeUsers || 0} active users</span>
              </div>
              <span className="w-px h-4 bg-white/20" />
              <div className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5" />
                <span>{data?.deliveries?.inTransit || 0} in transit</span>
              </div>
            </div>
            <div className="flex-1" />
            <div className="flex items-center gap-2 text-white/50 text-[10px]">
              <Shield className="w-3 h-3" />
              <span>Encrypted • v2.0</span>
            </div>
          </div>
        </motion.div>

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
                  onClick={() => fetchLiveData(true)}
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
              value: formatCurrency(data?.stats?.totalRevenue || 0),
              change: "+12.5%",
              icon: DollarSign,
              color: "from-green-500 to-emerald-500",
              bg: "bg-green-50 dark:bg-green-500/10",
              border: "border-green-200 dark:border-green-500/20",
            },
            {
              label: "Total Orders",
              value: data?.stats?.totalOrders || 0,
              change: "+8.3%",
              icon: ShoppingBag,
              color: "from-blue-500 to-blue-600",
              bg: "bg-blue-50 dark:bg-blue-500/10",
              border: "border-blue-200 dark:border-blue-500/20",
            },
            {
              label: "Active Users",
              value: data?.stats?.activeUsers || 0,
              change: "+5.2%",
              icon: Users,
              color: "from-purple-500 to-purple-600",
              bg: "bg-purple-50 dark:bg-purple-500/10",
              border: "border-purple-200 dark:border-purple-500/20",
            },
            {
              label: "Platform Fee (10%)",
              value: formatCurrency(data?.stats?.platformFee || 0),
              change: "+12.5%",
              icon: Shield,
              color: "from-yellow-500 to-orange-500",
              bg: "bg-yellow-50 dark:bg-yellow-500/10",
              border: "border-yellow-200 dark:border-yellow-500/20",
            },
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -4, scale: 1.02 }}
                className={`${stat.bg} ${stat.border} rounded-2xl border p-5 hover:shadow-2xl transition-all duration-300`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                      {stat.value}
                    </p>
                    <div className="flex items-center gap-1 mt-1 text-green-500">
                      <TrendingUp className="w-4 h-4" />
                      <span className="text-sm font-semibold">
                        {stat.change}
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

        {/* ====== TODAY'S STATS ====== */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: "Today's Revenue",
              value: formatCurrency(data?.today?.revenue || 0),
              icon: TrendingUp,
              color: "text-green-500",
              bg: "bg-green-50 dark:bg-green-500/10",
            },
            {
              label: "Today's Orders",
              value: data?.today?.orders || 0,
              icon: ShoppingBag,
              color: "text-blue-500",
              bg: "bg-blue-50 dark:bg-blue-500/10",
            },
            {
              label: "New Users Today",
              value: data?.today?.newUsers || 0,
              icon: UserPlus,
              color: "text-purple-500",
              bg: "bg-purple-50 dark:bg-purple-500/10",
            },
            {
              label: "New Vendors Today",
              value: data?.today?.newVendors || 0,
              icon: Store,
              color: "text-orange-500",
              bg: "bg-orange-50 dark:bg-orange-500/10",
            },
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                className={`${stat.bg} rounded-2xl border border-gray-100 dark:border-gray-800 p-4 flex items-center gap-4`}
              >
                <div
                  className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center`}
                >
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {stat.label}
                  </p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ====== DELIVERY & ESCROW ====== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Delivery Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Truck className="w-5 h-5 text-agrivibe-green" /> Delivery
                  Status
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Live delivery tracking
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full text-xs font-medium border border-blue-200 dark:border-blue-500/30">
                <Activity className="w-3 h-3" /> Live
              </span>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-500/10 rounded-xl border border-yellow-100 dark:border-yellow-500/20">
                <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  {data?.deliveries?.inTransit || 0}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center justify-center gap-1">
                  <Truck className="w-3 h-3" /> In Transit
                </p>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-500/10 rounded-xl border border-green-100 dark:border-green-500/20">
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {data?.deliveries?.delivered || 0}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center justify-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Delivered
                </p>
              </div>
              <div className="text-center p-4 bg-red-50 dark:bg-red-500/10 rounded-xl border border-red-100 dark:border-red-500/20">
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {data?.deliveries?.failed || 0}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center justify-center gap-1">
                  <XCircle className="w-3 h-3" /> Failed
                </p>
              </div>
            </div>
          </motion.div>

          {/* Escrow Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Shield className="w-5 h-5 text-agrivibe-green" /> Escrow
                  Status
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Money held vs released
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full text-xs font-medium border border-emerald-200 dark:border-emerald-500/30">
                <Shield className="w-3 h-3" /> Protected
              </span>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-yellow-50 dark:bg-yellow-500/10 rounded-xl border border-yellow-100 dark:border-yellow-500/20">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Held in Escrow
                  </p>
                  <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                    {formatCurrency(data?.stats?.escrowHeld || 0)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-500/20 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-500" />
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-500/10 rounded-xl border border-green-100 dark:border-green-500/20">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Released to Vendors
                  </p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {formatCurrency(data?.stats?.escrowReleased || 0)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-500/20 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ====== RECENT ORDERS & TOP VENDORS ====== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-agrivibe-green" /> Recent
                  Orders
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Latest activity
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 rounded-full text-xs font-medium border border-green-200 dark:border-green-500/30">
                <Zap className="w-3 h-3" /> {data?.recentOrders?.length || 0}{" "}
                orders
              </span>
            </div>
            <div className="space-y-2 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
              {!data || data.recentOrders?.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Package className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                  <p className="font-medium">No recent orders</p>
                  <p className="text-sm">
                    Orders will appear here in real-time
                  </p>
                </div>
              ) : (
                data.recentOrders.map((order, index) => {
                  const StatusIcon = getStatusIcon(order.status);
                  return (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.02 }}
                      whileHover={{ scale: 1.01 }}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900 dark:text-white text-sm truncate">
                            {order.order_number}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {order.customer_name} • {order.store_name}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <p className="font-bold text-agrivibe-green text-sm">
                          {formatCurrency(order.total)}
                        </p>
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}
                        >
                          <StatusIcon className="w-3 h-3" /> {order.status}
                        </span>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </motion.div>

          {/* Top Vendors */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Crown className="w-5 h-5 text-yellow-400" /> Top Vendors
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Highest revenue
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-50 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 rounded-full text-xs font-medium border border-yellow-200 dark:border-yellow-500/30">
                <Star className="w-3 h-3" /> Leaders
              </span>
            </div>
            <div className="space-y-3">
              {!data || data.topVendors?.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Store className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                  <p className="font-medium">No vendor data</p>
                  <p className="text-sm">Vendor stats will appear here</p>
                </div>
              ) : (
                data.topVendors.map((vendor, index) => (
                  <motion.div
                    key={vendor.store_name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.01 }}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm ${index === 0 ? "bg-gradient-to-br from-yellow-400 to-yellow-500" : index === 1 ? "bg-gradient-to-br from-gray-400 to-gray-500" : index === 2 ? "bg-gradient-to-br from-amber-600 to-amber-700" : "bg-gray-400 dark:bg-gray-600"}`}
                      >
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white text-sm">
                          {vendor.store_name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {vendor.order_count} orders
                        </p>
                      </div>
                    </div>
                    <p className="font-bold text-agrivibe-green">
                      {formatCurrency(vendor.total_revenue)}
                    </p>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </div>

        {/* ====== PENDING ITEMS - WITH WORKING BUTTONS ====== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ y: -2, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push("/admin/orders")}
            className="bg-yellow-50 dark:bg-yellow-500/10 border border-yellow-200 dark:border-yellow-500/20 rounded-2xl p-4 flex items-center justify-between cursor-pointer hover:shadow-xl transition-all duration-300 group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-50 dark:bg-yellow-500/10 rounded-xl flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-500" />
              </div>
              <div className="text-left">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Pending Orders
                </p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {data?.stats?.pendingOrders || 0}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-yellow-500">
                {data?.stats?.pendingOrders > 0 ? "View orders" : "All clear"}
              </span>
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            whileHover={{ y: -2, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push("/admin/vendors/pending")}
            className="bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20 rounded-2xl p-4 flex items-center justify-between cursor-pointer hover:shadow-xl transition-all duration-300 group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-50 dark:bg-orange-500/10 rounded-xl flex items-center justify-center">
                <Store className="w-5 h-5 text-orange-500" />
              </div>
              <div className="text-left">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Pending Vendors
                </p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {data?.stats?.pendingVendors || 0}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-orange-500">
                {data?.stats?.pendingVendors > 0
                  ? "Review vendors"
                  : "All clear"}
              </span>
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            whileHover={{ y: -2, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push("/admin/products")}
            className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-2xl p-4 flex items-center justify-between cursor-pointer hover:shadow-xl transition-all duration-300 group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 dark:bg-blue-500/10 rounded-xl flex items-center justify-center">
                <Package className="w-5 h-5 text-blue-500" />
              </div>
              <div className="text-left">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Pending Products
                </p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {data?.stats?.pendingProducts || 0}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-blue-500">
                {data?.stats?.pendingProducts > 0
                  ? "Approve products"
                  : "All clear"}
              </span>
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.button>
        </motion.div>

        {/* ====== PREMIUM FOOTER ====== */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-100 dark:border-gray-800"
        >
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <span>© 2026 AgriVibe KE Farm Solutions</span>
            <span className="w-px h-4 bg-gray-200 dark:bg-gray-700" />
            <span>All rights reserved</span>
            <span className="flex items-center gap-1">
              <Shield className="w-3 h-3" /> Secure Monitor
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-agrivibe-green" /> Powered by
              AgriVibe Live
            </span>
            <span className="w-px h-4 bg-gray-200 dark:bg-gray-700" />
            <span>v2.0.0</span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />{" "}
              {isLive ? "Live" : "Paused"}
            </span>
          </div>
        </motion.div>

        {/* ====== FLOATING STATUS INDICATOR ====== */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="fixed bottom-6 left-6 z-50 bg-gray-900/90 backdrop-blur-xl text-white px-4 py-2.5 rounded-2xl border border-white/10 shadow-2xl flex items-center gap-3"
        >
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs font-medium">Live Monitor</span>
          </div>
          <span className="w-px h-6 bg-white/10" />
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Activity className="w-3.5 h-3.5" />
            <span>{data?.stats?.activeUsers || 0} active</span>
          </div>
          <span className="w-px h-6 bg-white/10" />
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Clock className="w-3.5 h-3.5" />
            <span>{formatTime(lastUpdated)}</span>
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  );
}
