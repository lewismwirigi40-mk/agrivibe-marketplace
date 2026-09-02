// src/components/Navbar.tsx
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  User,
  LogOut,
  ShoppingBag,
  BookOpen,
  Store,
  Info,
  Phone,
  Home,
  Sparkles,
  ChevronDown,
  Sun,
  Moon,
  Bell,
  Search,
  Shield,
  Award,
  Gift,
  Heart,
  Wallet,
  Package,
  Settings,
  HelpCircle,
  Users,
  Truck,
  Crown,
} from "lucide-react";
// ✅ ADD THIS IMPORT
import api from "../services/api";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userName, setUserName] = useState("");
  const router = useRouter();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    fetchCartCount();
  }, []);

  const fetchCartCount = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const response = await api.get("/cart");
      setCartCount(response.data.items?.length || 0);
    } catch (error) {
      console.error("Failed to fetch cart count:", error);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    setIsLoggedIn(!!token);
    if (user) {
      try {
        const parsed = JSON.parse(user);
        setUserRole(parsed.role || null);
        setUserName(parsed.first_name || parsed.name || "User");
      } catch {
        setUserName("User");
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    router.push("/");
  };

  const navItems = [
    { name: "Marketplace", href: "/marketplace", icon: ShoppingBag },
    { name: "Guides", href: "/guides", icon: BookOpen },
    { name: "Sell", href: "/vendor/register", icon: Store },
    { name: "About", href: "/about", icon: Info },
    { name: "Contact", href: "/contact", icon: Phone },
  ];

  const getDashboardLink = () => {
    if (!userRole) return "/dashboard";
    switch (userRole) {
      case "admin":
        return "/admin/dashboard";
      case "vendor":
        return "/vendor/dashboard";
      case "driver":
        return "/driver/dashboard";
      default:
        return "/dashboard";
    }
  };

  const getRoleBadge = () => {
    if (!userRole) return null;
    const badges: Record<string, { label: string; color: string }> = {
      admin: {
        label: "Admin",
        color: "bg-purple-500/20 text-purple-400 border-purple-500/30",
      },
      vendor: {
        label: "Vendor",
        color: "bg-green-500/20 text-green-400 border-green-500/30",
      },
      driver: {
        label: "Driver",
        color: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      },
    };
    return badges[userRole] || null;
  };

  const roleBadge = getRoleBadge();

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
        isScrolled
          ? "bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-2xl border-b border-gray-200/20 dark:border-white/10"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* ====== LOGO ====== */}
          <Link href="/" className="flex items-center gap-3 group">
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
              <span className="block text-[10px] text-gray-400 font-medium tracking-widest uppercase">
                Marketplace
              </span>
            </div>
          </Link>

          {/* ====== DESKTOP NAVIGATION ====== */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = router.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 group ${
                    isActive
                      ? "bg-agrivibe-green/20 text-agrivibe-green"
                      : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${isActive ? "text-agrivibe-green" : "group-hover:text-gray-900 dark:group-hover:text-white"}`}
                  />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* ====== DESKTOP RIGHT ====== */}
          <div className="hidden md:flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-gray-600 dark:text-gray-300"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            {/* Search */}
            <button className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-gray-600 dark:text-gray-300">
              <Search className="w-5 h-5" />
            </button>

            {isLoggedIn ? (
              <>
                {/* Role Badge */}
                {roleBadge && (
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full border ${roleBadge.color}`}
                  >
                    {roleBadge.label}
                  </span>
                )}

                {/* Dashboard Link */}
                <Link
                  href={getDashboardLink()}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-all duration-300"
                >
                  <User className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>

                {/* ✅ CART BUTTON WITH BADGE */}
                <Link
                  href="/cart"
                  className="relative p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-gray-600 dark:text-gray-300"
                >
                  <ShoppingBag className="w-5 h-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                      {cartCount > 9 ? "9+" : cartCount}
                    </span>
                  )}
                </Link>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-red-500 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-all duration-300"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="flex items-center gap-2 bg-gradient-to-r from-agrivibe-green to-emerald-500 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:shadow-xl hover:shadow-agrivibe-green/30 transition-all duration-300 hover:scale-105"
                >
                  <Sparkles className="w-4 h-4" />
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* ====== MOBILE MENU BUTTON ====== */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-gray-600 dark:text-gray-300"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* ====== MOBILE MENU ====== */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-t border-gray-200/20 dark:border-white/10 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = router.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                      isActive
                        ? "bg-agrivibe-green/20 text-agrivibe-green"
                        : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}

              <div className="h-px bg-gray-200/20 dark:bg-white/10 my-2" />

              {isLoggedIn ? (
                <>
                  {/* User Info */}
                  <div className="flex items-center gap-3 px-4 py-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-agrivibe-green to-emerald-500 rounded-full flex items-center justify-center text-white font-bold">
                      {userName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {userName}
                      </p>
                      {roleBadge && (
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full border ${roleBadge.color}`}
                        >
                          {roleBadge.label}
                        </span>
                      )}
                    </div>
                  </div>

                  <Link
                    href={getDashboardLink()}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-all duration-300"
                  >
                    <User className="w-5 h-5" />
                    <span>Dashboard</span>
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300 w-full text-left"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-all duration-300"
                  >
                    <User className="w-5 h-5" />
                    <span>Login</span>
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-agrivibe-green to-emerald-500 text-white px-4 py-3 rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-agrivibe-green/30 transition-all duration-300"
                  >
                    <Sparkles className="w-5 h-5" />
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
