// src/components/DriverLayout.tsx
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactNode, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  User,
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
  Truck,
  MapPin,
  Clock,
  CheckCircle,
  DollarSign,
  Star,
  TrendingUp,
  Navigation,
  Phone,
  MessageCircle,
  Award,
  Crown,
  Settings,
  HelpCircle,
} from "lucide-react";
import api from "../services/api";
import Notifications from "./Notifications"; // ✅ Use the real notification component

interface DriverLayoutProps {
  children: ReactNode;
}

export default function DriverLayout({ children }: DriverLayoutProps) {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ REAL DATA from backend
  const [stats, setStats] = useState({
    todayDeliveries: 0,
    completed: 0,
    earnings: 0,
    online: true,
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ✅ FETCH REAL DRIVER STATS
  useEffect(() => {
    fetchDriverStats();
  }, []);

  const fetchDriverStats = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      // Fetch driver deliveries
      const response = await api.get("/deliveries/my-deliveries");
      const deliveries = response.data.deliveries || [];

      // Calculate today's deliveries
      const today = new Date().toISOString().split("T")[0];
      const todayDel = deliveries.filter((d: any) =>
        d.created_at?.startsWith(today),
      );

      // Calculate completed
      const completed = deliveries.filter(
        (d: any) => d.status === "delivered",
      ).length;

      // Calculate earnings (delivery fees)
      const earnings = deliveries
        .filter((d: any) => d.status === "delivered")
        .reduce(
          (sum: number, d: any) => sum + parseFloat(d.delivery_fee || 0),
          0,
        );

      setStats({
        todayDeliveries: todayDel.length,
        completed: completed,
        earnings: earnings,
        online: true,
      });
    } catch (error) {
      console.error("Failed to fetch driver stats:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ GET UNREAD COUNT FROM NOTIFICATIONS COMPONENT
  // The Notifications component handles this internally

  const navItems = [
    {
      name: "Dashboard",
      href: "/driver/dashboard",
      icon: LayoutDashboard,
      badge: null,
    },
    {
      name: "My Deliveries",
      href: "/driver/deliveries",
      icon: Package,
      badge: null,
    },
    { name: "Profile", href: "/driver/profile", icon: User, badge: null },
  ];

  // ✅ REAL QUICK STATS (not dummy)
  const quickStats = [
    {
      label: "Today's Deliveries",
      value: stats.todayDeliveries,
      icon: Truck,
      color: "text-blue-500",
    },
    {
      label: "Completed",
      value: stats.completed,
      icon: CheckCircle,
      color: "text-green-500",
    },
    {
      label: "Earnings",
      value: `KES ${stats.earnings}`,
      icon: DollarSign,
      color: "text-yellow-500",
    },
  ];

  return (
    <div
      className={`min-h-screen ${isDarkMode ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" : "bg-gray-50"}`}
    >
      {/* ====== TOP NAVBAR ====== */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-2xl"
            : "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md"
        } border-b border-gray-200/20 dark:border-white/10`}
      >
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
              <Link
                href="/driver/dashboard"
                className="flex items-center gap-3 group"
              >
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="relative"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                    <span className="text-white text-xl">🚚</span>
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                </motion.div>
                <div className="hidden sm:block">
                  <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-600">
                    AgriVibe
                  </span>
                  <span className="block text-[10px] text-gray-400 font-medium tracking-widest uppercase">
                    Driver Portal
                  </span>
                </div>
              </Link>
            </div>

            {/* Center - Status */}
            <div className="hidden lg:flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-xl">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm text-green-400 font-medium">
                  {stats.online ? "Online" : "Offline"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Navigation className="w-4 h-4 text-blue-400" />
                <span>{stats.todayDeliveries} active deliveries</span>
              </div>
            </div>

            {/* Right - Actions */}
            <div className="flex items-center gap-2">
              {/* ✅ REAL NOTIFICATIONS COMPONENT */}
              <Notifications />

              {/* Theme Toggle */}
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
              >
                {isDarkMode ? (
                  <Sun className="w-5 h-5 text-gray-300" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-700" />
                )}
              </button>

              {/* Profile */}
              <button
                onClick={() =>
                  setActiveDropdown(
                    activeDropdown === "profile" ? null : "profile",
                  )
                }
                className="flex items-center gap-2 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  D
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Driver
                  </p>
                  <p className="text-xs text-gray-400">Delivery Partner</p>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400 hidden sm:block" />
              </button>

              <AnimatePresence>
                {activeDropdown === "profile" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-4 top-16 mt-2 w-56 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-white/10 overflow-hidden"
                  >
                    <div className="p-4 border-b border-gray-100 dark:border-white/10">
                      <p className="font-bold text-gray-900 dark:text-white">
                        Driver
                      </p>
                      <p className="text-xs text-gray-400">
                        driver@agrivibe.com
                      </p>
                    </div>
                    <div className="p-2">
                      <Link
                        href="/driver/profile"
                        className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-gray-700 dark:text-gray-300"
                      >
                        <User className="w-4 h-4" />
                        <span>Profile</span>
                      </Link>
                      <Link
                        href="/driver/settings"
                        className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-gray-700 dark:text-gray-300"
                      >
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
      <aside
        className={`fixed left-0 top-16 lg:top-20 h-full w-64 lg:w-72 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-r border-gray-200/20 dark:border-white/10 transform transition-all duration-500 z-40 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-64 lg:translate-x-0"
        }`}
      >
        <div className="h-full flex flex-col overflow-y-auto">
          {/* Quick Stats - REAL DATA */}
          <div className="p-4 border-b border-gray-100 dark:border-white/10">
            <div className="space-y-2">
              {quickStats.map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={i}
                    className="flex items-center justify-between p-2 bg-gray-50 dark:bg-white/5 rounded-xl"
                  >
                    <div className="flex items-center gap-2">
                      <Icon className={`w-4 h-4 ${stat.color}`} />
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        {stat.label}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">
                      {stat.value}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                router.pathname === item.href ||
                router.pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative ${
                    isActive
                      ? "bg-gradient-to-r from-blue-500/20 to-blue-600/20 text-blue-500 border border-blue-500/20 shadow-lg shadow-blue-500/5"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 ${isActive ? "text-blue-500" : "group-hover:text-gray-900 dark:group-hover:text-white"}`}
                  />
                  <span className="flex-1 text-sm font-medium">
                    {item.name}
                  </span>
                  {item.badge && (
                    <span
                      className={`px-2 py-0.5 text-xs font-bold rounded-full ${
                        isActive
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 dark:bg-white/10 text-gray-600 dark:text-gray-400"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-blue-500 to-blue-600 rounded-r-full"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Driver Card */}
          <div className="p-4 border-t border-gray-100 dark:border-white/10">
            <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-2xl p-4 border border-blue-500/20">
              <div className="flex items-center gap-3 mb-2">
                <Award className="w-5 h-5 text-yellow-400" />
                <span className="text-sm font-bold text-gray-900 dark:text-white">
                  Top Driver
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                You've completed {stats.completed} deliveries
              </p>
              <button className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all">
                View Statistics
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
      <main
        className={`pt-16 lg:top-20 transition-all duration-300 ${isSidebarOpen ? "lg:ml-72" : "lg:ml-72"}`}
      >
        <div className="min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8">
          {children}
        </div>

        {/* ====== FOOTER ====== */}
        <footer className="border-t border-gray-200/20 dark:border-white/10 px-6 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                © 2026 AgriVibe Delivery Services. All rights reserved.
              </span>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
              <Link
                href="/driver/dashboard"
                className="hover:text-blue-500 transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/driver/deliveries"
                className="hover:text-blue-500 transition-colors"
              >
                Deliveries
              </Link>
              <Link
                href="/driver/profile"
                className="hover:text-blue-500 transition-colors"
              >
                Profile
              </Link>
              <span className="text-xs text-gray-400">v2.0.0</span>
            </div>
          </div>
        </footer>
      </main>

      {/* ====== FLOATING ACTION BUTTON ====== */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-6 right-6 z-50 p-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full shadow-2xl shadow-blue-500/30 hover:scale-110 transition-all duration-300 lg:hidden"
      >
        <ChevronRight className="w-5 h-5 -rotate-90" />
      </button>
    </div>
  );
}
