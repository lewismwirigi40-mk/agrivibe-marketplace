// src/components/VendorLayout.tsx
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ReactNode, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Plus, 
  BarChart3, 
  Wallet, 
  Settings,
  Menu,
  X,
  Bell,
  Search,
  LogOut,
  Shield,
  Sparkles,
  ChevronRight,
  ChevronDown,
  Sun,
  Moon,
  Store,
  Truck,
  Users,
  Star,
  TrendingUp,
  DollarSign,
  Clock,
  CheckCircle,
  Award,
  Crown,
  HelpCircle,
  FileText,
  Calendar
} from 'lucide-react';

interface VendorLayoutProps {
  children: ReactNode;
}

export default function VendorLayout({ children }: VendorLayoutProps) {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [storeName, setStoreName] = useState('My Store');
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'New order received #ORD-004', time: '5 min ago', read: false },
    { id: 2, title: 'Product "Organic Avocado" approved', time: '1 hour ago', read: false },
    { id: 3, title: 'Payment received KES 450', time: '3 hours ago', read: true },
  ]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const store = localStorage.getItem('store');
    if (store) {
      try {
        const parsed = JSON.parse(store);
        setStoreName(parsed.store_name || 'My Store');
      } catch {}
    }
  }, []);

  const navItems = [
    { name: 'Dashboard', href: '/vendor/dashboard', icon: LayoutDashboard, badge: null },
    { name: 'Products', href: '/vendor/products', icon: Package, badge: '12' },
    { name: 'Orders', href: '/vendor/orders', icon: ShoppingBag, badge: '5' },
    { name: 'Add Product', href: '/vendor/products/add', icon: Plus, badge: null },
    { name: 'Analytics', href: '/vendor/analytics', icon: BarChart3, badge: null },
    { name: 'Wallet', href: '/vendor/wallet', icon: Wallet, badge: null },
    { name: 'Store Settings', href: '/vendor/settings', icon: Settings, badge: null },
  ];

  const quickStats = [
    { label: 'Today\'s Sales', value: 'KES 12,450', icon: DollarSign, color: 'text-green-500' },
    { label: 'Total Orders', value: '45', icon: ShoppingBag, color: 'text-blue-500' },
    { label: 'Products', value: '128', icon: Package, color: 'text-yellow-500' },
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
              <Link href="/vendor/dashboard" className="flex items-center gap-3 group">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="relative"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-500/30">
                    <span className="text-white text-xl">🏪</span>
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                </motion.div>
                <div className="hidden sm:block">
                  <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-500">
                    {storeName}
                  </span>
                  <span className="block text-[10px] text-gray-400 font-medium tracking-widest uppercase">Vendor Portal</span>
                </div>
              </Link>
            </div>

            {/* Center - Store Stats */}
            <div className="hidden lg:flex items-center gap-4">
              <div className="flex items-center gap-3 px-4 py-2 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
                <span className="text-sm text-yellow-400 font-medium">Store Active</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400" />
                  4.8 Rating
                </span>
                <span className="text-gray-600 dark:text-gray-600">|</span>
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4 text-blue-400" />
                  156 Orders
                </span>
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
                          <button className="text-xs text-yellow-500 hover:underline">Mark all read</button>
                        </div>
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                        {notifications.map((n) => (
                          <div key={n.id} className={`p-4 border-b border-gray-50 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors ${!n.read ? 'bg-yellow-500/5' : ''}`}>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{n.title}</p>
                            <p className="text-xs text-gray-400 mt-1">{n.time}</p>
                          </div>
                        ))}
                      </div>
                      <div className="p-3 border-t border-gray-100 dark:border-white/10 text-center">
                        <button className="text-sm text-yellow-500 hover:underline">View all</button>
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
                <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  V
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Vendor</p>
                  <p className="text-xs text-gray-400">Store Owner</p>
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
                      <p className="font-bold text-gray-900 dark:text-white">Vendor</p>
                      <p className="text-xs text-gray-400">vendor@agrivibe.com</p>
                    </div>
                    <div className="p-2">
                      <Link href="/vendor/settings" className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-gray-700 dark:text-gray-300">
                        <Settings className="w-4 h-4" />
                        <span>Store Settings</span>
                      </Link>
                      <Link href="/vendor/wallet" className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-gray-700 dark:text-gray-300">
                        <Wallet className="w-4 h-4" />
                        <span>Wallet</span>
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
                    <span className="text-sm font-bold text-gray-900 dark:text-white">{stat.value}</span>
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
                      ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-500 border border-yellow-500/20 shadow-lg shadow-yellow-500/5'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-yellow-500' : 'group-hover:text-gray-900 dark:group-hover:text-white'}`} />
                  <span className="flex-1 text-sm font-medium">{item.name}</span>
                  {item.badge && (
                    <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${
                      isActive 
                        ? 'bg-yellow-500 text-white' 
                        : 'bg-gray-200 dark:bg-white/10 text-gray-600 dark:text-gray-400'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-yellow-500 to-orange-500 rounded-r-full"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Vendor Card */}
          <div className="p-4 border-t border-gray-100 dark:border-white/10">
            <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-2xl p-4 border border-yellow-500/20">
              <div className="flex items-center gap-3 mb-2">
                <Crown className="w-5 h-5 text-yellow-400" />
                <span className="text-sm font-bold text-gray-900 dark:text-white">Premium Vendor</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Unlock more features with Pro</p>
              <button className="w-full px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-yellow-500/30 transition-all">
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
      <main className={`pt-16 lg:top-20 transition-all duration-300 ${isSidebarOpen ? 'lg:ml-72' : 'lg:ml-72'}`}>
        <div className="min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8">
          {children}
        </div>

        {/* ====== FOOTER ====== */}
        <footer className="border-t border-gray-200/20 dark:border-white/10 px-6 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                © 2026 AgriVibe Marketplace. All rights reserved.
              </span>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
              <Link href="/vendor/dashboard" className="hover:text-yellow-500 transition-colors">Dashboard</Link>
              <Link href="/vendor/products" className="hover:text-yellow-500 transition-colors">Products</Link>
              <Link href="/vendor/orders" className="hover:text-yellow-500 transition-colors">Orders</Link>
              <Link href="/vendor/settings" className="hover:text-yellow-500 transition-colors">Settings</Link>
              <span className="text-xs text-gray-400">v2.0.0</span>
            </div>
          </div>
        </footer>
      </main>

      {/* ====== FLOATING ACTION BUTTON ====== */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 z-50 p-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-full shadow-2xl shadow-yellow-500/30 hover:scale-110 transition-all duration-300 lg:hidden"
      >
        <ChevronRight className="w-5 h-5 -rotate-90" />
      </button>
    </div>
  );
}