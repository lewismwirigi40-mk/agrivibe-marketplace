// src/pages/help.tsx
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  Search,
  HelpCircle,
  ShoppingBag,
  CreditCard,
  Truck,
  Store,
  User,
  Shield,
  ChevronRight,
  Sparkles,
  Mail,
  Phone,
  MessageCircle,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  Award,
  Globe,
  Eye,
  MapPin,
  ArrowUp,
  LifeBuoy,
  BookOpen,
  Video,
  Headphones,
} from "lucide-react";

interface HelpArticle {
  id: number;
  title: string;
  description: string;
  category: string;
  views: number;
  popular: boolean;
}

interface HelpCategory {
  id: string;
  name: string;
  icon: any;
  description: string;
  color: string;
}

export default function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories: HelpCategory[] = [
    {
      id: "orders",
      name: "Orders & Shopping",
      icon: ShoppingBag,
      description: "Place orders, track deliveries, returns",
      color: "from-blue-500 to-blue-600",
    },
    {
      id: "payments",
      name: "Payments & Wallet",
      icon: CreditCard,
      description: "M-Pesa, cards, wallet, escrow",
      color: "from-green-500 to-emerald-500",
    },
    {
      id: "delivery",
      name: "Delivery & Tracking",
      icon: Truck,
      description: "Delivery codes, tracking, schedules",
      color: "from-orange-500 to-orange-600",
    },
    {
      id: "vendor",
      name: "Vendor Hub",
      icon: Store,
      description: "Selling, products, analytics",
      color: "from-purple-500 to-purple-600",
    },
    {
      id: "account",
      name: "Account & Profile",
      icon: User,
      description: "Login, settings, security",
      color: "from-pink-500 to-pink-600",
    },
    {
      id: "security",
      name: "Security & Trust",
      icon: Shield,
      description: "Escrow, fraud prevention, safety",
      color: "from-red-500 to-red-600",
    },
  ];

  const articles: HelpArticle[] = [
    // Orders
    {
      id: 1,
      title: "How to place an order",
      description: "Step-by-step guide to ordering fresh produce on AgriVibe",
      category: "orders",
      views: 1234,
      popular: true,
    },
    {
      id: 2,
      title: "How to track your order",
      description: "Track your order status in real-time",
      category: "orders",
      views: 987,
      popular: true,
    },
    {
      id: 3,
      title: "How to cancel an order",
      description: "Cancel orders within 30 minutes of placement",
      category: "orders",
      views: 654,
      popular: false,
    },
    {
      id: 4,
      title: "What is the delivery code?",
      description: "Understanding the 6-digit delivery verification code",
      category: "orders",
      views: 432,
      popular: false,
    },

    // Payments
    {
      id: 5,
      title: "How to add funds to wallet",
      description: "Deposit money into your AgriVibe wallet",
      category: "payments",
      views: 876,
      popular: true,
    },
    {
      id: 6,
      title: "How to withdraw from wallet",
      description: "Withdraw funds to M-Pesa or bank",
      category: "payments",
      views: 543,
      popular: false,
    },
    {
      id: 7,
      title: "Payment methods accepted",
      description: "M-Pesa, Credit/Debit Cards, Wallet Balance",
      category: "payments",
      views: 321,
      popular: false,
    },
    {
      id: 8,
      title: "How does escrow work?",
      description: "Understanding the escrow protection system",
      category: "payments",
      views: 765,
      popular: true,
    },

    // Delivery
    {
      id: 9,
      title: "Delivery timeframes",
      description: "When to expect your delivery",
      category: "delivery",
      views: 654,
      popular: true,
    },
    {
      id: 10,
      title: "What if I miss my delivery?",
      description: "Rescheduling and re-delivery options",
      category: "delivery",
      views: 432,
      popular: false,
    },
    {
      id: 11,
      title: "Delivery code verification",
      description: "How to verify delivery with the 6-digit code",
      category: "delivery",
      views: 321,
      popular: false,
    },

    // Vendor
    {
      id: 12,
      title: "How to become a vendor",
      description: "Register and start selling on AgriVibe",
      category: "vendor",
      views: 987,
      popular: true,
    },
    {
      id: 13,
      title: "Vendor fees and commission",
      description: "Understanding the 10% platform fee",
      category: "vendor",
      views: 654,
      popular: false,
    },
    {
      id: 14,
      title: "How to manage products",
      description: "Add, edit, and delete products",
      category: "vendor",
      views: 543,
      popular: false,
    },

    // Account
    {
      id: 15,
      title: "How to reset password",
      description: "Forgot your password? Reset it here",
      category: "account",
      views: 765,
      popular: true,
    },
    {
      id: 16,
      title: "How to update profile",
      description: "Update your personal information",
      category: "account",
      views: 432,
      popular: false,
    },
    {
      id: 17,
      title: "How to delete account",
      description: "Permanently delete your AgriVibe account",
      category: "account",
      views: 210,
      popular: false,
    },

    // Security
    {
      id: 18,
      title: "Is AgriVibe secure?",
      description: "Security measures protecting your data and payments",
      category: "security",
      views: 876,
      popular: true,
    },
    {
      id: 19,
      title: "How to report a problem",
      description: "Report suspicious activity or fraud",
      category: "security",
      views: 543,
      popular: false,
    },
    {
      id: 20,
      title: "Two-factor authentication",
      description: "Enable 2FA for extra security",
      category: "security",
      views: 321,
      popular: false,
    },
  ];

  const filteredArticles = useMemo(() => {
    let filtered = articles;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (article) =>
          article.title.toLowerCase().includes(query) ||
          article.description.toLowerCase().includes(query) ||
          article.category.toLowerCase().includes(query),
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(
        (article) => article.category === selectedCategory,
      );
    }

    return filtered;
  }, [searchQuery, selectedCategory]);

  const popularArticles = articles.filter((a) => a.popular);

  const getCategoryIcon = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    return category?.icon || HelpCircle;
  };

  const getCategoryColor = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    return category?.color || "from-gray-500 to-gray-600";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50/30">
      {/* ====== HERO SECTION ====== */}
      <div className="relative overflow-hidden bg-gradient-to-br from-agrivibe-green via-emerald-600 to-teal-700">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 animate-pulse" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 animate-pulse delay-1000" />
        </div>
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/1233318/pexels-photo-1233318.jpeg?auto=compress&cs=tinysrgb&w=1920')] bg-cover bg-center mix-blend-overlay opacity-10" />

        <div className="relative container mx-auto px-4 py-12 md:py-20">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>

          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium border border-white/20 mb-6">
                <LifeBuoy className="w-4 h-4" />
                Help Center
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                How can we{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-orange-300 to-red-400">
                  help you?
                </span>
              </h1>
              <p className="text-white/80 text-lg max-w-2xl mx-auto">
                Find answers, guides, and support for everything AgriVibe
              </p>

              {/* Search */}
              <div className="relative max-w-xl mx-auto mt-8">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for help articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/60 outline-none focus:ring-4 focus:ring-white/20 transition-all text-lg"
                />
                <kbd className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-white/40 bg-white/10 px-2 py-1 rounded-md">
                  ⌘K
                </kbd>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ====== CATEGORIES ====== */}
      <div className="py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center mb-10"
          >
            <span className="inline-flex items-center gap-2 bg-agrivibe-green/10 text-agrivibe-green px-4 py-2 rounded-full text-sm font-semibold">
              <BookOpen className="w-4 h-4" />
              Browse by Category
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-3">
              Find Help in Your{" "}
              <span className="text-gradient-green">Area</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, index) => {
              const Icon = category.icon;
              return (
                <motion.button
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() =>
                    setSelectedCategory(
                      selectedCategory === category.id ? null : category.id,
                    )
                  }
                  className={`relative p-4 rounded-2xl text-center transition-all duration-300 group ${
                    selectedCategory === category.id
                      ? "bg-gradient-to-br from-agrivibe-green to-emerald-500 text-white shadow-lg shadow-agrivibe-green/30"
                      : "bg-white border border-gray-100 hover:shadow-xl hover:-translate-y-1"
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-2 transition-all duration-300 ${
                      selectedCategory === category.id
                        ? "bg-white/20"
                        : `bg-gradient-to-br ${category.color} bg-opacity-10`
                    }`}
                  >
                    <Icon
                      className={`w-6 h-6 ${
                        selectedCategory === category.id
                          ? "text-white"
                          : "text-gray-700"
                      }`}
                    />
                  </div>
                  <h3
                    className={`text-sm font-bold ${
                      selectedCategory === category.id
                        ? "text-white"
                        : "text-gray-900"
                    }`}
                  >
                    {category.name}
                  </h3>
                  <p
                    className={`text-xs mt-0.5 ${
                      selectedCategory === category.id
                        ? "text-white/70"
                        : "text-gray-400"
                    }`}
                  >
                    {category.description.split(",")[0]}
                  </p>
                  {selectedCategory === category.id && (
                    <motion.div
                      layoutId="activeCategory"
                      className="absolute inset-0 rounded-2xl border-2 border-white/20"
                    />
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Clear Filter */}
          {selectedCategory && (
            <div className="text-center mt-6">
              <button
                onClick={() => setSelectedCategory(null)}
                className="text-agrivibe-green hover:text-emerald-600 font-medium text-sm transition-colors"
              >
                Clear filter
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ====== ARTICLES ====== */}
      <div className="py-12 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {searchQuery || selectedCategory
                  ? "Search Results"
                  : "Popular Articles"}
              </h2>
              <p className="text-gray-500 text-sm">
                {filteredArticles.length} articles found
              </p>
            </div>
            {!searchQuery && !selectedCategory && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 text-orange-600 rounded-full text-xs font-medium">
                <Sparkles className="w-3.5 h-3.5" />
                Most viewed
              </span>
            )}
          </div>

          {filteredArticles.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16 bg-white rounded-2xl border border-gray-100"
            >
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-gray-800">
                No articles found
              </h3>
              <p className="text-gray-500 mt-2">
                Try adjusting your search or filter
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory(null);
                }}
                className="mt-4 text-agrivibe-green font-medium hover:underline"
              >
                Clear all filters
              </button>
            </motion.div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
                {filteredArticles.map((article, index) => {
                  const Icon = getCategoryIcon(article.category);
                  const color = getCategoryColor(article.category);
                  const isPopular = article.popular;

                  return (
                    <motion.div
                      key={article.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: index * 0.03 }}
                      whileHover={{ x: 4 }}
                      className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-all duration-300 group cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-10 h-10 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center flex-shrink-0`}
                          >
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-gray-900 group-hover:text-agrivibe-green transition-colors">
                                {article.title}
                              </h3>
                              {isPopular && (
                                <span className="text-[10px] font-medium text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full">
                                  Popular
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-500">
                              {article.description}
                            </p>
                            <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400">
                              <span className="flex items-center gap-1">
                                <Eye className="w-3 h-3" />
                                {article.views.toLocaleString()} views
                              </span>
                              <span className="capitalize">
                                {article.category}
                              </span>
                            </div>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-agrivibe-green group-hover:translate-x-1 transition-all duration-300" />
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* ====== STILL NEED HELP? ====== */}
      <div className="py-16 bg-gradient-to-br from-green-50/50 to-emerald-50/50">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <span className="inline-flex items-center gap-2 bg-agrivibe-green/10 text-agrivibe-green px-4 py-2 rounded-full text-sm font-semibold">
              <Headphones className="w-4 h-4" />
              Still Need Help?
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-3">
              We're Here for You{" "}
              <span className="text-gradient-green">24/7</span>
            </h2>
            <p className="text-gray-500 mt-2">
              Choose how you want to reach us
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Email */}
            <motion.a
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              href="mailto:support@agrivibe.com"
              className="bg-white rounded-2xl p-6 text-center border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <Mail className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-bold text-gray-900">Email</h3>
              <p className="text-sm text-gray-500 mt-1">support@agrivibe.com</p>
              <p className="text-xs text-gray-400 mt-2">Reply within 24hrs</p>
            </motion.a>

            {/* Phone */}
            <motion.a
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              href="tel:+254769074319"
              className="bg-white rounded-2xl p-6 text-center border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <Phone className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-bold text-gray-900">Phone</h3>
              <p className="text-sm text-gray-500 mt-1">+254 769 074 319</p>
              <p className="text-xs text-gray-400 mt-2">Mon-Fri, 8AM-6PM</p>
            </motion.a>

            {/* WhatsApp */}
            <motion.a
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              href="https://wa.me/254769074319"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-2xl p-6 text-center border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="w-14 h-14 bg-[#25D366] rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <MessageCircle className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-bold text-gray-900">WhatsApp</h3>
              <p className="text-sm text-gray-500 mt-1">Chat with us</p>
              <p className="text-xs text-gray-400 mt-2">Instant response</p>
            </motion.a>

            {/* Live Chat */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.25 }}
              className="bg-white rounded-2xl p-6 text-center border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <MessageCircle className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-bold text-gray-900">Live Chat</h3>
              <p className="text-sm text-gray-500 mt-1">Chat in real-time</p>
              <p className="text-xs text-gray-400 mt-2">Available 24/7</p>
            </motion.button>
          </div>
        </div>
      </div>

      {/* ====== CTA SECTION ====== */}
      <div className="py-16 bg-gradient-to-r from-agrivibe-green to-emerald-600">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium border border-white/20 mb-4">
              <Clock className="w-4 h-4" />
              Quick Response
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Can't find what you're looking for?
            </h2>
            <p className="text-white/80 text-lg max-w-2xl mx-auto mt-3">
              Our support team is ready to help you with any questions or issues
            </p>
            <div className="flex flex-wrap gap-4 justify-center mt-6">
              <a
                href="mailto:support@agrivibe.com"
                className="inline-flex items-center gap-2 bg-white text-agrivibe-green px-8 py-4 rounded-xl font-bold hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                <Mail className="w-5 h-5" />
                Email Support
              </a>
              <a
                href="tel:+254769074319"
                className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-bold border border-white/20 hover:bg-white/30 transition-all duration-300"
              >
                <Phone className="w-5 h-5" />
                Call Us
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ====== FOOTER ====== */}
      <footer className="bg-gray-900 py-12 border-t border-white/10">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-agrivibe-green to-emerald-500 rounded-xl flex items-center justify-center">
                  <span className="text-white text-xl">🌾</span>
                </div>
                <span className="text-xl font-bold text-white">AgriVibe</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Connecting farmers, vendors, and students across Kenyan
                campuses.
              </p>
              <div className="mt-3 space-y-1 text-sm">
                <p className="text-gray-400 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-agrivibe-green" />
                  <a
                    href="tel:+254769074319"
                    className="hover:text-white transition-colors"
                  >
                    +254 769 074 319
                  </a>
                </p>
                <p className="text-gray-400 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-agrivibe-green" />
                  <span>657-10100, Nyeri, Kenya</span>
                </p>
              </div>
              <div className="flex gap-4 mt-4"></div>
            </div>

            <div>
              <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">
                Marketplace
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/marketplace"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    All Products
                  </Link>
                </li>
                <li>
                  <Link
                    href="/marketplace"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Categories
                  </Link>
                </li>
                <li>
                  <Link
                    href="/vendors"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Vendors
                  </Link>
                </li>
                <li>
                  <Link
                    href="/deals"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Deals
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">
                Company
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/about"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    href="/careers"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Careers
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Blog
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">
                Support
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/help"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/cookies"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Cookies
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-6 text-center">
            <p className="text-sm text-gray-500">
              © 2026 AgriVibe KE Farm Solutions. All rights reserved.
            </p>
            <p className="text-xs text-gray-600 mt-1">
              657-10100, Nyeri, Kenya | +254 769 074 319
            </p>
          </div>
        </div>
      </footer>

      {/* ====== BACK TO TOP ====== */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-6 right-6 bg-agrivibe-green text-white p-4 rounded-full shadow-2xl shadow-agrivibe-green/30 hover:scale-110 transition-all duration-300 z-40"
      >
        <ArrowUp className="w-5 h-5" />
      </button>
    </div>
  );
}
