// src/pages/dashboard/index.tsx
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, 
  Package, 
  Clock, 
  CheckCircle, 
  Heart,
  Wallet,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Award,
  Calendar,
  MapPin,
  User,
  Settings,
  Bell,
  Gift,
  Star,
  Truck,
  CreditCard,
  Shield,
  Zap,
  Eye,
  MessageCircle,
  Users
} from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../services/api';

export default function CustomerDashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    walletBalance: 0,
    wishlistCount: 0,
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    fetchDashboardData();
    setGreeting(getGreeting());
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      
      // Fetch orders
      const ordersRes = await api.get('/orders/my-orders');
      const orders = ordersRes.data.orders || [];
      
      // Fetch wallet
      const walletRes = await api.get('/wallet/balance');
      const walletData = walletRes.data || {};
      
      // Fetch wishlist
      const wishlistRes = await api.get('/wishlist');
      const wishlist = wishlistRes.data.items || [];
      
      setStats({
        totalOrders: orders.length,
        pendingOrders: orders.filter((o: any) => o.status === 'pending' || o.status === 'processing').length,
        walletBalance: walletData.balance || 0,
        wishlistCount: wishlist.length,
      });
      
      // Recent orders (last 5)
      setRecentOrders(orders.slice(0, 5));
      
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      setError('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return `KES ${amount?.toLocaleString() || 0}`;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'delivered': 'bg-green-100 text-green-700 border-green-200',
      'pending': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'processing': 'bg-blue-100 text-blue-700 border-blue-200',
      'shipped': 'bg-purple-100 text-purple-700 border-purple-200',
      'cancelled': 'bg-red-100 text-red-700 border-red-200',
    };
    return colors[status?.toLowerCase()] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-agrivibe-green border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Loading dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* ====== WELCOME SECTION ====== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-agrivibe-green to-emerald-600 rounded-3xl p-8 text-white relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/10" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">👋</span>
              <span className="text-white/80 text-sm font-medium">{greeting}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold">Welcome back!</h1>
            <p className="text-white/80 mt-1">Here's your AgriVibe overview</p>
            
            <div className="flex flex-wrap gap-4 mt-4">
              <Link
                href="/marketplace"
                className="inline-flex items-center gap-2 bg-white text-agrivibe-green px-6 py-2.5 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
              >
                <ShoppingBag className="w-4 h-4" />
                Start Shopping
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/dashboard/orders"
                className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-white/30 transition-all duration-300 border border-white/20"
              >
                <Package className="w-4 h-4" />
                View Orders
              </Link>
            </div>
          </div>
        </motion.div>

        {/* ====== STATS CARDS ====== */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Orders', value: stats.totalOrders, icon: ShoppingBag, color: 'from-blue-500 to-blue-600', bg: 'bg-blue-50' },
            { label: 'Pending Orders', value: stats.pendingOrders, icon: Clock, color: 'from-yellow-500 to-orange-500', bg: 'bg-yellow-50' },
            { label: 'Wallet Balance', value: formatCurrency(stats.walletBalance), icon: Wallet, color: 'from-green-500 to-emerald-500', bg: 'bg-green-50' },
            { label: 'Wishlist', value: stats.wishlistCount, icon: Heart, color: 'from-red-500 to-red-600', bg: 'bg-red-50' },
          ].map((stat, index) => {
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
                  </div>
                  <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ====== QUICK ACTIONS ====== */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'My Orders', icon: Package, href: '/dashboard/orders', color: 'bg-blue-50 text-blue-600' },
            { label: 'Wishlist', icon: Heart, href: '/dashboard/wishlist', color: 'bg-red-50 text-red-600' },
            { label: 'Wallet', icon: Wallet, href: '/dashboard/wallet', color: 'bg-green-50 text-green-600' },
            { label: 'Profile', icon: User, href: '/dashboard/profile', color: 'bg-purple-50 text-purple-600' },
          ].map((action, index) => {
            const Icon = action.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.05 }}
                whileHover={{ scale: 1.05, y: -2 }}
              >
                <Link
                  href={action.href}
                  className={`${action.color} rounded-2xl p-5 text-center block transition-all duration-300 shadow-sm hover:shadow-md`}
                >
                  <Icon className="w-8 h-8 mx-auto mb-2" />
                  <span className="text-sm font-medium">{action.label}</span>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* ====== RECENT ORDERS ====== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-agrivibe-green to-emerald-500 rounded-xl flex items-center justify-center">
                <Package className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
            </div>
            <Link 
              href="/dashboard/orders" 
              className="text-sm text-agrivibe-green hover:text-emerald-600 font-medium transition-colors flex items-center gap-1"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📦</div>
              <p className="text-gray-500 font-medium">No orders yet</p>
              <p className="text-sm text-gray-400 mt-1">Start shopping to see your orders</p>
              <Link
                href="/marketplace"
                className="inline-block mt-4 bg-gradient-to-r from-agrivibe-green to-emerald-500 text-white px-6 py-2.5 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
                {recentOrders.map((order, index) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-agrivibe-green/20 to-emerald-500/20 rounded-lg flex items-center justify-center">
                        <Package className="w-5 h-5 text-agrivibe-green" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          #{order.order_number || order.id.slice(0, 8)}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-agrivibe-green">
                        {formatCurrency(order.total)}
                      </span>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                      <Link
                        href={`/dashboard/orders/${order.id}`}
                        className="p-2 text-gray-400 hover:text-agrivibe-green transition-colors rounded-lg hover:bg-green-50"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>

        {/* ====== QUICK STATS ====== */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Member Since', value: '2024', icon: Calendar, change: 'Active' },
            { label: 'Reviews', value: '12', icon: Star, change: '4.8 ⭐' },
            { label: 'Items Saved', value: stats.wishlistCount, icon: Heart, change: 'Wishlist' },
            { label: 'Support', value: '24/7', icon: MessageCircle, change: 'Available' },
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.05 }}
                className="bg-white rounded-2xl shadow-md border border-gray-100 p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                    <Icon className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{stat.label}</p>
                    <div className="flex items-center gap-2">
                      <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                      <span className="text-xs text-green-500">{stat.change}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ====== TRUST BADGE ====== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 p-4"
        >
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-blue-500" />
            <div>
              <p className="text-sm font-medium text-gray-700">Your account is secure</p>
              <p className="text-xs text-gray-500">2-Factor Authentication available</p>
            </div>
            <Link
              href="/dashboard/settings"
              className="ml-auto text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Security Settings →
            </Link>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}