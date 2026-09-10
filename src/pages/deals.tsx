// src/pages/deals.tsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  Tag,
  Clock,
  TrendingDown,
  Sparkles,
  ShoppingBag,
  ChevronRight,
  Percent,
  Flame,
  Zap,
  Gift,
  Star,
  Award,
  Shield,
  Truck,
  Leaf,
  Heart,
  Mail,
  Phone,
  MapPin,
  Globe,
  ArrowUp,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

export default function Deals() {
  const [timeLeft, setTimeLeft] = useState({
    days: 2,
    hours: 14,
    minutes: 32,
    seconds: 45,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { days, hours, minutes, seconds } = prev;
        seconds--;
        if (seconds < 0) {
          seconds = 59;
          minutes--;
          if (minutes < 0) {
            minutes = 59;
            hours--;
            if (hours < 0) {
              hours = 23;
              days--;
            }
          }
        }
        return { days, hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const deals = [
    // Flash Sales
    {
      id: 1,
      name: "Fresh Organic Tomatoes",
      originalPrice: 200,
      discountPrice: 130,
      discount: 35,
      vendor: "Green Farm Produce",
      expires: "2 days left",
      image: "🍅",
      category: "flash",
      badge: "🔥 Flash Sale",
      badgeColor: "from-red-500 to-orange-500",
      sold: 234,
      stock: 500,
      rating: 4.8,
    },
    {
      id: 2,
      name: "Premium Hass Avocado (6pc)",
      originalPrice: 450,
      discountPrice: 299,
      discount: 33,
      vendor: "Avocado Paradise",
      expires: "3 days left",
      image: "🥑",
      category: "flash",
      badge: "⚡ Limited Time",
      badgeColor: "from-purple-500 to-pink-500",
      sold: 189,
      stock: 300,
      rating: 4.9,
    },
    // Weekly Deals
    {
      id: 3,
      name: "Organic Kale Bunch (500g)",
      originalPrice: 150,
      discountPrice: 89,
      discount: 40,
      vendor: "Healthy Greens",
      expires: "1 day left",
      image: "🥬",
      category: "weekly",
      badge: "🌿 Weekly Special",
      badgeColor: "from-green-500 to-emerald-500",
      sold: 456,
      stock: 800,
      rating: 4.7,
    },
    {
      id: 4,
      name: "Sweet Pineapple (Large)",
      originalPrice: 350,
      discountPrice: 229,
      discount: 34,
      vendor: "Tropical Fruits Ltd",
      expires: "4 days left",
      image: "🍍",
      category: "weekly",
      badge: "🌟 Best Seller",
      badgeColor: "from-yellow-500 to-orange-500",
      sold: 312,
      stock: 450,
      rating: 4.8,
    },
    // Seasonal
    {
      id: 5,
      name: "Fresh Mangoes (12pc)",
      originalPrice: 600,
      discountPrice: 399,
      discount: 33,
      vendor: "Tropical Fruits Ltd",
      expires: "5 days left",
      image: "🥭",
      category: "seasonal",
      badge: "🌞 Seasonal",
      badgeColor: "from-orange-500 to-red-500",
      sold: 567,
      stock: 1000,
      rating: 4.9,
    },
    {
      id: 6,
      name: "Organic Spinach Bundle",
      originalPrice: 100,
      discountPrice: 59,
      discount: 41,
      vendor: "Healthy Greens",
      expires: "2 days left",
      image: "🌿",
      category: "seasonal",
      badge: "💚 Healthy Choice",
      badgeColor: "from-teal-500 to-green-500",
      sold: 234,
      stock: 600,
      rating: 4.6,
    },
    // Mega Deals
    {
      id: 7,
      name: "Mixed Fruit Box (10kg)",
      originalPrice: 2500,
      discountPrice: 1599,
      discount: 36,
      vendor: "Avocado Paradise",
      expires: "6 days left",
      image: "🍎",
      category: "mega",
      badge: "⭐ Mega Deal",
      badgeColor: "from-blue-500 to-purple-500",
      sold: 89,
      stock: 200,
      rating: 4.8,
    },
    {
      id: 8,
      name: "Farm Fresh Veggie Pack",
      originalPrice: 1200,
      discountPrice: 799,
      discount: 33,
      vendor: "Green Farm Produce",
      expires: "3 days left",
      image: "🥕",
      category: "mega",
      badge: "🎯 Value Pack",
      badgeColor: "from-indigo-500 to-blue-500",
      sold: 178,
      stock: 350,
      rating: 4.7,
    },
  ];

  const categories = [
    { id: "all", label: "All Deals", icon: Tag },
    { id: "flash", label: "Flash Sales", icon: Flame },
    { id: "weekly", label: "Weekly Deals", icon: Zap },
    { id: "seasonal", label: "Seasonal", icon: Leaf },
    { id: "mega", label: "Mega Deals", icon: Gift },
  ];

  const [activeCategory, setActiveCategory] = useState("all");

  const filteredDeals =
    activeCategory === "all"
      ? deals
      : deals.filter((deal) => deal.category === activeCategory);

  const stats = [
    { icon: Tag, label: "Active Deals", value: deals.length },
    { icon: Percent, label: "Avg. Discount", value: "34%" },
    { icon: Heart, label: "Customers Saving", value: "2,340+" },
    { icon: Award, label: "Customer Rating", value: "4.8 ⭐" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50/30">
      {/* ====== HEADER ====== */}
      <div className="relative overflow-hidden bg-gradient-to-br from-red-500 via-orange-500 to-yellow-500">
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
                <Percent className="w-4 h-4" />
                Hot Deals
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-orange-300 to-red-400">
                  Special Offers
                </span>
                <br />
                <span className="text-white">Just for You</span>
              </h1>
              <p className="text-white/80 text-lg max-w-2xl mx-auto">
                Don't miss out on these amazing discounts on fresh produce
              </p>

              {/* Countdown Timer */}
              <div className="flex justify-center gap-4 mt-8">
                {[
                  { label: "Days", value: timeLeft.days },
                  { label: "Hours", value: timeLeft.hours },
                  { label: "Minutes", value: timeLeft.minutes },
                  { label: "Seconds", value: timeLeft.seconds },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 min-w-[60px] text-center"
                  >
                    <div className="text-2xl md:text-3xl font-bold text-white tabular-nums">
                      {String(item.value).padStart(2, "0")}
                    </div>
                    <div className="text-[10px] text-white/60 uppercase tracking-wider">
                      {item.label}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Flash Sale Banner */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-6 inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20"
              >
                <Flame className="w-4 h-4 text-yellow-400" />
                <span className="text-white text-sm font-medium">
                  {deals.filter((d) => d.category === "flash").length} Flash
                  Sales Live!
                </span>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ====== STATS ====== */}
      <div className="py-10 bg-white/80 backdrop-blur-sm border-b border-gray-100">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center p-4 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-100"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-agrivibe-green/10 to-emerald-500/10 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <Icon className="w-6 h-6 text-agrivibe-green" />
                  </div>
                  <div className="text-xl font-bold text-gray-900">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ====== WHY WE OFFER DEALS ====== */}
      <div className="py-12 bg-gradient-to-r from-green-50/50 to-emerald-50/50">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="inline-flex items-center gap-2 bg-agrivibe-green/10 text-agrivibe-green px-4 py-2 rounded-full text-sm font-semibold">
              <Gift className="w-4 h-4" />
              Why We Offer Deals
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-3">
              Fresh Produce at{" "}
              <span className="text-gradient-green">Affordable Prices</span>
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto mt-2">
              We believe everyone deserves access to fresh, quality produce. Our
              deals connect farmers directly to you, cutting out middlemen and
              passing the savings to our community.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <Shield className="w-8 h-8 text-agrivibe-green mx-auto mb-2" />
                <h4 className="font-bold text-gray-900">Quality Guaranteed</h4>
                <p className="text-xs text-gray-500">Freshness you can trust</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <Truck className="w-8 h-8 text-agrivibe-green mx-auto mb-2" />
                <h4 className="font-bold text-gray-900">Fast Delivery</h4>
                <p className="text-xs text-gray-500">To your campus doorstep</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <CheckCircle className="w-8 h-8 text-agrivibe-green mx-auto mb-2" />
                <h4 className="font-bold text-gray-900">100% Secure</h4>
                <p className="text-xs text-gray-500">
                  Escrow protected payments
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ====== CATEGORY FILTERS ====== */}
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                  activeCategory === cat.id
                    ? "bg-gradient-to-r from-agrivibe-green to-emerald-500 text-white shadow-lg shadow-agrivibe-green/30"
                    : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                <Icon className="w-4 h-4" />
                {cat.label}
              </button>
            );
          })}
        </div>

        <p className="text-center text-sm text-gray-500 mt-4">
          Showing {filteredDeals.length} deals
        </p>
      </div>

      {/* ====== DEALS LIST ====== */}
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredDeals.map((deal, index) => (
              <motion.div
                key={deal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -8 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 group relative"
              >
                {/* Badge */}
                <div className="absolute top-4 left-4 z-10">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r ${deal.badgeColor} text-white text-xs font-bold rounded-full shadow-lg`}
                  >
                    <Sparkles className="w-3 h-3" />
                    {deal.badge}
                  </span>
                </div>

                {/* Discount Badge */}
                <div className="absolute top-4 right-4 z-10">
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-500 text-white text-sm font-bold rounded-full shadow-lg">
                    <Tag className="w-3.5 h-3.5" />-{deal.discount}%
                  </span>
                </div>

                <div className="p-5">
                  <div className="text-5xl mb-3">{deal.image}</div>

                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-agrivibe-green transition-colors line-clamp-1">
                    {deal.name}
                  </h3>
                  <p className="text-sm text-gray-500">{deal.vendor}</p>

                  <div className="flex items-center gap-1 mt-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-sm font-medium text-gray-700">
                      {deal.rating}
                    </span>
                    <span className="text-xs text-gray-400">
                      ({deal.sold} sold)
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mt-3">
                    <span className="text-2xl font-bold text-agrivibe-green">
                      KES {deal.discountPrice}
                    </span>
                    <span className="text-sm text-gray-400 line-through">
                      KES {deal.originalPrice}
                    </span>
                  </div>

                  <div className="mt-2">
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>Sold: {deal.sold}</span>
                      <span>Stock: {deal.stock}</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full mt-1 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-agrivibe-green to-emerald-500 rounded-full"
                        style={{
                          width: `${(deal.sold / deal.stock) * 100}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {deal.expires}
                    </span>
                    <button className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-agrivibe-green to-emerald-500 text-white rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-agrivibe-green/30 transition-all group-hover:scale-105">
                      <ShoppingBag className="w-4 h-4" />
                      Shop Now
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredDeals.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-gray-800">
              No deals in this category
            </h3>
            <p className="text-gray-500 mt-2">
              Try selecting a different category
            </p>
            <button
              onClick={() => setActiveCategory("all")}
              className="mt-4 text-agrivibe-green font-medium hover:underline"
            >
              View all deals
            </button>
          </div>
        )}
      </div>

      {/* ====== NEWSLETTER ====== */}
      <div className="py-16 bg-gradient-to-r from-agrivibe-green to-emerald-600">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium border border-white/20 mb-4">
              <Mail className="w-4 h-4" />
              Deal Alerts
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Never Miss a <span className="text-yellow-300">Great Deal</span>
            </h2>
            <p className="text-white/80 text-lg max-w-2xl mx-auto mt-3">
              Subscribe to get the best deals delivered to your inbox
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert("✅ Subscribed to deal alerts!");
              }}
              className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto mt-6"
            >
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/60 outline-none focus:ring-4 focus:ring-white/20 transition-all"
                required
              />
              <button
                type="submit"
                className="px-6 py-3.5 bg-white text-agrivibe-green rounded-xl font-bold hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                Subscribe
              </button>
            </form>
            <p className="text-white/50 text-sm mt-3">
              No spam. Unsubscribe anytime.
            </p>
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
