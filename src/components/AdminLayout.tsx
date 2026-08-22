// src/components/AdminLayout.tsx
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ReactNode, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Users, 
  Store, 
  Package, 
  ShoppingBag, 
  BookOpen, 
  User, 
  DollarSign, 
  HelpCircle, 
  BarChart3, 
  FileText, 
  Settings,
  Menu,
  X,
  LogOut,
  Bell,
  Search,
  Shield,
  Award,
  Sparkles,
  ChevronRight,
  ChevronDown,
  Sun,
  Moon,
  CreditCard,
  Truck,
  MessageCircle,
  Globe,
  Zap,
  Crown,
  Activity,
  TrendingUp,
  Wallet,
  Building,
  Star,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'New vendor registered', time: '2 min ago', read: false },
    { id: 2, title: 'Order #ORD-004 delivered', time: '15 min ago', read: false },
    { id: 3, title: '5 products pending approval', time: '1 hour ago', read: true },
  ]);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      const parsed = JSON.parse(user);
      if (parsed.role === 'admin') {
        setIsAdmin(true);
      } else {
        router.push('/');
      }
    } else {
      router.push('/login');
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-red-500/30">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">Access Denied</h1>
          <p className="text-gray-400 mt-2">You must be an admin to view this page.</p>
          <button
            onClick={() => router.push('/login')}
            className="mt-6 px-6 py-3 bg-gradient-to-r from-agrivibe-green to-emerald-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-agrivibe-green/30 transition-all"
          >
            Return to Login
          </button>
        </motion.div>
      </div>
    );
  }

  const navItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard, badge: null },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3, badge: null },
    { name: 'Users', href: '/admin/users', icon: Users, badge: null },
    { name: 'Vendors', href: '/admin/vendors', icon: Store, badge: null },
    { name: 'Products', href: '/admin/products', icon: Package, badge: '12' },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingBag, badge: '8' },
    { name: 'Payments', href: '/admin/payments', icon: DollarSign, badge: null },
    { name: 'Guides', href: '/admin/guides', icon: BookOpen, badge: null },
    { name: 'Unanswered', href: '/admin/unanswered', icon: HelpCircle, badge: '3' },
    { name: 'Reports', href: '/admin/reports', icon: FileText, badge: null },
    { name: 'Profile', href: '/admin/profile', icon: User, badge: null },
    { name: 'Settings', href: '/admin/settings', icon: Settings, badge: null },
  ];

  const quickStats = [
    { label: 'Total Revenue', value: 'KES 489K', change: '+12.5%', icon: TrendingUp, color: 'text-green-500' },
    { label: 'Active Users', value: '1,250', change: '+8.3%', icon: Users, color: 'text-blue-500' },
    { label: 'Pending Orders', value: '34', change: '+2.1%', icon: Clock, color: 'text-yellow-500' },
  ];

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gray-50'}`}>
      {/* ====== TOP NAVBAR ====== */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-2xl' 
          : 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md'
      } border-b border-gray-200/20 dark:border-white/10`}>
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
              >
                <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              </button>
              <Link href="/admin/dashboard" className="flex items-center gap-3 group">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="relative"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-agrivibe-green to-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-agrivibe-green/30">
                    <span className="text-white text-xl">🌾</span>
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse" />
                </motion.div>
                <div className="hidden sm:block">
                  <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-agrivibe-green to-emerald-500">
                    AgriVibe
                  </span>
                  <span className="block text-[10px] text-gray-400 font-medium tracking-widest uppercase">Admin Panel</span>
                </div>
              </Link>
            </div>

            {/* Center - Search */}
            <div className="hidden lg:flex items-center flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search admin panel..."
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:border-agrivibe-green focus:ring-4 focus:ring-agrivibe-green/10 outline-none transition-all"
                />
                <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 bg-gray-200 dark:bg-white/10 px-2 py-1 rounded-lg">⌘K</kbd>
              </div>
            </div>

            {/* Right - Actions */}
            <div className="flex items-center gap-2">
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setActiveDropdown(activeDropdown === 'notifications' ? null : 'notifications')}
                  className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition-colors relative"
                >
                  <Bell className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                  {notifications.filter(n => !n.read).length > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
                  )}
                </button>
                <AnimatePresence>
                  {activeDropdown === 'notifications' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-white/10 overflow-hidden"
                    >
                      <div className="p-4 border-b border-gray-100 dark:border-white/10">
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold text-gray-900 dark:text-white">Notifications</h3>
                          <button className="text-xs text-agrivibe-green hover:underline">Mark all read</button>
                        </div>
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                        {notifications.map((n) => (
                          <div key={n.id} className={`p-4 border-b border-gray-50 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors ${!n.read ? 'bg-agrivibe-green/5' : ''}`}>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{n.title}</p>
                            <p className="text-xs text-gray-400 mt-1">{n.time}</p>
                          </div>
                        ))}
                      </div>
                      <div className="p-3 border-t border-gray-100 dark:border-white/10 text-center">
                        <button className="text-sm text-agrivibe-green hover:underline">View all notifications</button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Theme Toggle */}
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
              >
                {isDarkMode ? <Sun className="w-5 h-5 text-gray-300" /> : <Moon className="w-5 h-5 text-gray-700" />}
              </button>

              {/* Profile */}
              <button
                onClick={() => setActiveDropdown(activeDropdown === 'profile' ? null : 'profile')}
                className="flex items-center gap-2 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-agrivibe-green to-emerald-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  A
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Admin</p>
                  <p className="text-xs text-gray-400">Administrator</p>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400 hidden sm:block" />
              </button>

              <AnimatePresence>
                {activeDropdown === 'profile' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-4 top-16 mt-2 w-56 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-white/10 overflow-hidden"
                  >
                    <div className="p-4 border-b border-gray-100 dark:border-white/10">
                      <p className="font-bold text-gray-900 dark:text-white">Admin User</p>
                      <p className="text-xs text-gray-400">admin@agrivibe.com</p>
                    </div>
                    <div className="p-2">
                      <Link href="/admin/profile" className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-gray-700 dark:text-gray-300">
                        <User className="w-4 h-4" />
                        <span>Profile</span>
                      </Link>
                      <Link href="/admin/settings" className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-gray-700 dark:text-gray-300">
                        <Settings className="w-4 h-4" />
                        <span>Settings</span>
                      </Link>
                      <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors text-red-500">
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>

      {/* ====== SIDEBAR ====== */}
      <aside className={`fixed left-0 top-16 lg:top-20 h-full w-64 lg:w-72 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-r border-gray-200/20 dark:border-white/10 transform transition-all duration-500 z-40 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-64 lg:translate-x-0'
      }`}>
        <div className="h-full flex flex-col overflow-y-auto">
          {/* Quick Stats */}
          <div className="p-4 border-b border-gray-100 dark:border-white/10">
            <div className="space-y-2">
              {quickStats.map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <div key={i} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-white/5 rounded-xl">
                    <div className="flex items-center gap-2">
                      <Icon className={`w-4 h-4 ${stat.color}`} />
                      <span className="text-xs text-gray-600 dark:text-gray-400">{stat.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-gray-900 dark:text-white">{stat.value}</span>
                      <span className="text-xs text-green-500">{stat.change}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = router.pathname === item.href || router.pathname.startsWith(item.href + '/');
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative ${
                    isActive
                      ? 'bg-gradient-to-r from-agrivibe-green/20 to-emerald-500/20 text-agrivibe-green border border-agrivibe-green/20 shadow-lg shadow-agrivibe-green/5'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-agrivibe-green' : 'group-hover:text-gray-900 dark:group-hover:text-white'}`} />
                  <span className="flex-1 text-sm font-medium">{item.name}</span>
                  {item.badge && (
                    <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${
                      isActive 
                        ? 'bg-agrivibe-green text-white' 
                        : 'bg-gray-200 dark:bg-white/10 text-gray-600 dark:text-gray-400'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-agrivibe-green to-emerald-500 rounded-r-full"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Upgrade Card */}
          <div className="p-4 border-t border-gray-100 dark:border-white/10">
            <div className="bg-gradient-to-br from-agrivibe-green/10 to-emerald-500/10 rounded-2xl p-4 border border-agrivibe-green/20">
              <div className="flex items-center gap-3 mb-2">
                <Crown className="w-5 h-5 text-yellow-400" />
                <span className="text-sm font-bold text-gray-900 dark:text-white">Admin Pro</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Get advanced analytics and priority support</p>
              <button className="w-full px-4 py-2 bg-gradient-to-r from-agrivibe-green to-emerald-500 text-white rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-agrivibe-green/30 transition-all">
                Upgrade Now
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* ====== OVERLAY ====== */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* ====== MAIN CONTENT ====== */}
      <main className={`pt-16 lg:pt-20 transition-all duration-300 ${isSidebarOpen ? 'lg:ml-72' : 'lg:ml-72'}`}>
        <div className="min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8">
          {children}
        </div>

        {/* ====== FOOTER ====== */}
        <footer className="border-t border-gray-200/20 dark:border-white/10 px-6 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                © 2026 AgriVibe KE Farm Solutions. All rights reserved.
              </span>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
              <Link href="/admin/dashboard" className="hover:text-agrivibe-green transition-colors">Dashboard</Link>
              <Link href="/admin/profile" className="hover:text-agrivibe-green transition-colors">Profile</Link>
              <Link href="/admin/settings" className="hover:text-agrivibe-green transition-colors">Settings</Link>
              <span className="text-xs text-gray-400">v2.0.0</span>
            </div>
          </div>
        </footer>
      </main>

      {/* ====== FLOATING ACTION BUTTON ====== */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 z-50 p-3 bg-gradient-to-r from-agrivibe-green to-emerald-500 text-white rounded-full shadow-2xl shadow-agrivibe-green/30 hover:scale-110 transition-all duration-300 lg:hidden"
      >
        <ChevronRight className="w-5 h-5 -rotate-90" />
      </button>
    </div>
  );
}