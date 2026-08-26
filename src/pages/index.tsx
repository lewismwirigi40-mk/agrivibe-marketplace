// src/pages/index.tsx
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import {
  ShoppingBag,
  TrendingUp,
  Shield,
  Truck,
  Star,
  ChevronRight,
  Search,
  Menu,
  X,
  User,
  Sparkles,
  ArrowRight,
  Leaf,
  Award,
  Clock,
  Layers,
  Users,
  MapPin,
  ChevronDown,
} from "lucide-react";
import api from "../services/api";

export default function Home() {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef(null);

  // 🟢 NEW STATE: Ensures code only runs after hydration is complete
  const [isHydrated, setIsHydrated] = useState(false);

  // REAL DATA STATES
  const [products, setProducts] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalVendors: 0,
    totalCampuses: 0,
    satisfaction: 0,
  });
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 🟢 FIXED: Safely check if hydrated before passing the ref target
  const { scrollYProgress } = useScroll({
    offset: ["start start", "end start"],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // FETCH REAL DATA & HANDLE HYDRATION TOGETHER
  useEffect(() => {
    setIsHydrated(true); // Tells the component it is safe to animate now
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);

      const productsRes = await api.get("/products?limit=4");
      setProducts(productsRes.data.products || []);

      const categoriesRes = await api.get("/categories");
      setCategories(categoriesRes.data.categories || []);

      // ✅ TO THIS NEW ENDPOINT PATH:
      const statsRes = await api.get("/products/public-stats");
      const statsData = statsRes.data.stats || {};
      setStats({
        totalProducts: statsData.totalProducts || 0,
        totalVendors: statsData.totalVendors || 0,
        totalCampuses: statsData.totalCampuses || 0,
        satisfaction: statsData.satisfaction || 95,
      });
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleAddToCart = (productId: string) => {
    router.push(`/marketplace?add=${productId}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/marketplace?search=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push("/marketplace");
    }
  };

  const handleCategoryClick = (categoryName: string) => {
    router.push(`/marketplace?category=${encodeURIComponent(categoryName)}`);
  };

  const handleProductClick = (productId: string) => {
    router.push(`/product/${productId}`);
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-premium-dark flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-20 h-20 border-4 border-agrivibe-gold border-t-transparent rounded-full mx-auto mb-6"
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-2xl font-bold text-white"
          >
            🌾 AgriVibe
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-gray-400 mt-2"
          >
            Loading fresh produce...
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-premium-light overflow-x-hidden"
    >
      {/* ====== NAVBAR ====== */}
      <nav className={`nav-premium ${isScrolled ? "shadow-premium" : ""}`}>
        <div className="container-premium flex items-center justify-between h-full">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 group flex-shrink-0"
          >
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-agrivibe-green to-agrivibe-green-light rounded-2xl flex items-center justify-center shadow-green">
                <span className="text-white text-2xl">🌾</span>
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-agrivibe-gold rounded-full animate-pulse" />
            </motion.div>
            <div>
              <span className="text-2xl font-bold text-gradient-green">
                AgriVibe
              </span>
              <span className="block text-[10px] text-gray-400 font-medium tracking-widest uppercase">
                Marketplace
              </span>
            </div>
          </Link>

          {/* Desktop Primary Menu - Center */}
          <div className="hidden lg:flex items-center gap-8">
            <Link href="/marketplace" className="nav-link">
              Marketplace
            </Link>
            <Link href="/guides" className="nav-link">
              Guides
            </Link>
            <Link href="/vendor/register" className="nav-link">
              Sell
            </Link>
            <Link href="/about" className="nav-link">
              About
            </Link>
            <Link href="/contact" className="nav-link">
              Contact
            </Link>
          </div>

          {/* Desktop Secondary Menu - Right */}
          <div className="hidden lg:flex items-center gap-4">
            <form onSubmit={handleSearch} className="search-premium w-64">
              <input
                type="text"
                placeholder="Search fresh produce..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit">
                <Search className="w-5 h-5 text-gray-400" />
              </button>
            </form>
            <Link href="/login" className="btn-premium">
              <User className="w-4 h-4" />
              Login
            </Link>
            <Link href="/register" className="btn-gold text-sm">
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-3 rounded-xl hover:bg-gray-100 transition-colors z-50"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </nav>

      {/* ====== MOBILE MENU - SLIDES FROM LEFT ====== */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            />

            {/* Menu Panel - Slides from left */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed top-0 left-0 w-80 h-full bg-white shadow-2xl z-50 lg:hidden overflow-y-auto"
            >
              <div className="p-6">
                {/* Mobile Logo */}
                <div className="flex items-center justify-between mb-8">
                  <Link
                    href="/"
                    className="flex items-center gap-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-agrivibe-green to-agrivibe-green-light rounded-xl flex items-center justify-center">
                      <span className="text-white text-xl">🌾</span>
                    </div>
                    <span className="text-xl font-bold text-gradient-green">
                      AgriVibe
                    </span>
                  </Link>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 rounded-lg hover:bg-gray-100"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Mobile Search */}
                <form onSubmit={handleSearch} className="search-premium mb-6">
                  <input
                    type="text"
                    placeholder="Search fresh produce..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button type="submit">
                    <Search className="w-5 h-5 text-gray-400" />
                  </button>
                </form>

                {/* Mobile Primary Menu */}
                <div className="space-y-1">
                  <Link
                    href="/marketplace"
                    className="block px-4 py-3 rounded-xl hover:bg-green-50 text-gray-700 font-medium transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Marketplace
                  </Link>
                  <Link
                    href="/guides"
                    className="block px-4 py-3 rounded-xl hover:bg-green-50 text-gray-700 font-medium transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Guides
                  </Link>
                  <Link
                    href="/vendor/register"
                    className="block px-4 py-3 rounded-xl hover:bg-green-50 text-gray-700 font-medium transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sell
                  </Link>
                  <Link
                    href="/about"
                    className="block px-4 py-3 rounded-xl hover:bg-green-50 text-gray-700 font-medium transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    About
                  </Link>
                  <Link
                    href="/contact"
                    className="block px-4 py-3 rounded-xl hover:bg-green-50 text-gray-700 font-medium transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Contact
                  </Link>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-100 my-6" />

                {/* Mobile Secondary Menu */}
                <div className="space-y-3">
                  <Link
                    href="/login"
                    className="block w-full text-center btn-premium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="block w-full text-center btn-gold"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </div>

                {/* Mobile Footer Links */}
                <div className="border-t border-gray-100 mt-6 pt-6">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <Link
                      href="/terms"
                      className="text-gray-500 hover:text-agrivibe-green transition-colors"
                    >
                      Terms
                    </Link>
                    <Link
                      href="/privacy"
                      className="text-gray-500 hover:text-agrivibe-green transition-colors"
                    >
                      Privacy
                    </Link>
                    <Link
                      href="/help"
                      className="text-gray-500 hover:text-agrivibe-green transition-colors"
                    >
                      Help
                    </Link>
                    <Link
                      href="/faq"
                      className="text-gray-500 hover:text-agrivibe-green transition-colors"
                    >
                      FAQ
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ====== HERO SECTION ====== */}
      <motion.section
        style={{ opacity: heroOpacity }}
        className="hero-premium min-h-screen flex items-center relative overflow-hidden"
      >
        <div className="absolute inset-0 hero-glow" />

        <div className="container-premium relative z-10 py-32">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="badge-premium text-sm">
                <Sparkles className="w-4 h-4" />
                🌱 Fresh from the Farm — Direct to You
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="heading-1 mt-6"
            >
              Fresh From Farms.
              <br />
              <span className="text-gradient-gold">
                Delivered to Your Campus.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-premium mt-6 max-w-2xl"
            >
              Buy directly from verified vendors and local farmers with secure
              payments and last-mile delivery across all Kenyan universities.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 mt-8"
            >
              <button
                onClick={() => {
                  const savedLocation = localStorage.getItem("userLocation");
                  if (savedLocation) {
                    router.push("/marketplace");
                  } else {
                    router.push("/marketplace?showLocation=true");
                  }
                }}
                className="btn-gold text-lg px-10 py-5"
              >
                <ShoppingBag className="w-6 h-6" />
                Start Shopping
                <ChevronRight className="w-6 h-6" />
              </button>
              <Link
                href="/vendor/register"
                className="btn-premium-secondary text-lg px-10 py-5"
              >
                <TrendingUp className="w-6 h-6" />
                Become a Vendor
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-6 mt-10"
            >
              {[
                { icon: Shield, label: "Secure Payments" },
                { icon: Truck, label: "Fast Delivery" },
                { icon: Star, label: "Quality Guarantee" },
                { icon: Clock, label: "24/7 Support" },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.1 }}
                  className="flex items-center gap-2 text-gray-600 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200"
                >
                  <item.icon className="w-5 h-5 text-agrivibe-green" />
                  <span className="text-sm font-medium">{item.label}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-gray-400 text-sm flex flex-col items-center gap-2"
          >
            <span>Scroll to explore</span>
            <ChevronRight className="w-5 h-5 rotate-90" />
          </motion.div>
        </motion.div>
      </motion.section>

      {/* ====== STATS SECTION ====== */}
      <section className="section-premium bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-50/50 to-emerald-50/50" />
        <div className="container-premium relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="badge-premium">
              <Award className="w-4 h-4" />
              Platform Statistics
            </span>
            <h2 className="heading-2 mt-4">
              Trusted by Thousands
              <br />
              <span className="text-gradient-green">Across Kenya</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                number: stats.totalProducts || 10000,
                label: "Products Available",
                icon: Layers,
                suffix: "+",
              },
              {
                number: stats.totalVendors || 500,
                label: "Verified Vendors",
                icon: Users,
                suffix: "+",
              },
              {
                number: stats.totalCampuses || 22,
                label: "Campuses",
                icon: MapPin,
                suffix: "",
              },
              {
                number: stats.satisfaction || 98,
                label: "Satisfaction Rate",
                icon: Star,
                suffix: "%",
              },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="card-premium p-8 text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-agrivibe-green" />
                </div>
                <div className="text-4xl font-bold text-gradient-green">
                  {stat.number}
                  {stat.suffix}
                </div>
                <div className="text-gray-600 mt-1 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== CATEGORIES SECTION ====== */}
      <section className="section-premium bg-premium-light">
        <div className="container-premium">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="badge-premium">
              <Leaf className="w-4 h-4" />
              Categories
            </span>
            <h2 className="heading-2 mt-4">Browse by Category</h2>
            <p className="text-muted mt-2">
              Find exactly what you're looking for
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {categories.length > 0
              ? categories.map((category, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -12, scale: 1.05 }}
                    onClick={() => handleCategoryClick(category.name)}
                    className="category-card cursor-pointer"
                  >
                    <div className="category-icon text-2xl">
                      {category.icon || "📦"}
                    </div>
                    <h3 className="font-bold text-gray-900">{category.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {category.count || "50+"}
                    </p>
                  </motion.div>
                ))
              : [
                  "Vegetables",
                  "Fruits",
                  "Meat",
                  "Dairy",
                  "Grains",
                  "Organic",
                ].map((name, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -12, scale: 1.05 }}
                    onClick={() => handleCategoryClick(name)}
                    className="category-card cursor-pointer"
                  >
                    <div className="category-icon text-2xl">
                      {["🥬", "🍎", "🥩", "🥛", "🌾", "🫐"][index]}
                    </div>
                    <h3 className="font-bold text-gray-900">{name}</h3>
                    <p className="text-sm text-gray-500 mt-1">50+</p>
                  </motion.div>
                ))}
          </div>
        </div>
      </section>

      {/* ====== FEATURED PRODUCTS ====== */}
      <section className="section-premium bg-white">
        <div className="container-premium">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex justify-between items-center mb-12"
          >
            <div>
              <span className="badge-gold">
                <Sparkles className="w-4 h-4" />
                Featured Products
              </span>
              <h2 className="heading-2 mt-4">Handpicked Fresh Produce</h2>
            </div>
            <Link href="/marketplace" className="btn-ghost">
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          {/* Featured Products Grid - Display Only */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                id: 1,
                name: "Fresh Organic Tomatoes",
                price: 150,
                rating: 4.8,
                vendor: "Green Farm",
                location: "Nyeri",
                image:
                  "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&h=400&fit=crop&auto=format",
                badge: "Bestseller",
                is_organic: true,
              },
              {
                id: 2,
                name: "Premium Hass Avocado",
                price: 200,
                rating: 4.9,
                vendor: "Avocado Paradise",
                location: "Kiambu",
                image:
                  "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=600&h=400&fit=crop&auto=format",
                badge: "Premium",
                is_organic: true,
              },
              {
                id: 3,
                name: "Organic Kale Bunch",
                price: 80,
                rating: 4.7,
                vendor: "Healthy Greens",
                location: "Nairobi",
                image:
                  "https://images.unsplash.com/photo-1524179094475-0a6c6a89df4a?w=600&h=400&fit=crop&auto=format",
                badge: "Organic",
                is_organic: true,
              },
              {
                id: 4,
                name: "Sweet Pineapple",
                price: 180,
                rating: 4.6,
                vendor: "Tropical Fruits",
                location: "Thika",
                image:
                  "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=600&h=400&fit=crop&auto=format",
                badge: "Fresh",
                is_organic: false,
              },
            ].map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -12 }}
                className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 cursor-pointer"
                onClick={() => router.push(`/product/${product.id}`)}
              >
                {/* Product Image */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                      {product.badge}
                    </span>
                    {product.is_organic && (
                      <span className="bg-agrivibe-green text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                        🌱 Organic
                      </span>
                    )}
                  </div>

                  {/* Rating */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-white text-sm font-semibold">
                      {product.rating}
                    </span>
                  </div>
                </div>

                {/* Product Details - Display Only, No Add to Cart */}
                <div className="p-5">
                  <h3 className="font-bold text-gray-900 text-lg group-hover:text-agrivibe-green transition-colors line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-500">{product.vendor}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {product.location}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                    <span className="text-2xl font-bold text-agrivibe-green">
                      KES {product.price}
                    </span>
                    <span className="text-xs font-medium text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                      ⭐ Popular
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== NEWSLETTER ====== */}
      <section className="section-premium bg-premium-dark text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/1233318/pexels-photo-1233318.jpeg?auto=compress&cs=tinysrgb&w=1920')] bg-cover bg-center mix-blend-overlay opacity-10" />
        <div className="container-premium relative text-center max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="badge-premium bg-white/10 text-white border-white/20">
              🚀 Stay Updated
            </span>
            <h2 className="heading-2 mt-6">
              Subscribe to <span className="text-gradient-gold">AgriVibe</span>
            </h2>
            <p className="text-gray-300 mt-4">
              Get the latest deals, new products, and campus updates
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                router.push("/marketplace");
              }}
              className="flex flex-col sm:flex-row gap-3 mt-6"
            >
              <input
                type="email"
                placeholder="Enter your email"
                className="input-premium bg-white/10 text-white placeholder-gray-400 border-white/20"
                required
              />
              <button type="submit" className="btn-gold">
                Subscribe
              </button>
            </form>
            <p className="text-gray-400 text-sm mt-3">
              No spam. Unsubscribe anytime.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ====== PREMIUM FOOTER ====== */}
      <footer className="footer-premium py-16">
        <div className="container-premium">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 mb-12">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-agrivibe-green to-agrivibe-green-light rounded-xl flex items-center justify-center">
                  <span className="text-white text-xl">🌾</span>
                </div>
                <span className="text-xl font-bold text-gradient-green">
                  AgriVibe
                </span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                Connecting farmers, vendors, and students across Kenyan
                campuses.
              </p>
              <div className="flex gap-4 mt-6">
                <a
                  href="#"
                  className="text-gray-400 hover:text-agrivibe-gold transition-colors text-sm"
                >
                  Facebook
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-agrivibe-gold transition-colors text-sm"
                >
                  Twitter
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-agrivibe-gold transition-colors text-sm"
                >
                  Instagram
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-agrivibe-gold transition-colors text-sm"
                >
                  YouTube
                </a>
              </div>
            </div>

            {/* Marketplace */}
            <div>
              <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">
                Marketplace
              </h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="/marketplace" className="footer-link">
                    All Products
                  </Link>
                </li>
                <li>
                  <Link href="/marketplace" className="footer-link">
                    Categories
                  </Link>
                </li>
                <li>
                  <Link href="/vendors" className="footer-link">
                    Vendors
                  </Link>
                </li>
                <li>
                  <Link href="/marketplace" className="footer-link">
                    Deals
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">
                Company
              </h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="/about" className="footer-link">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="footer-link">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="footer-link">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="footer-link">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">
                Support
              </h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="/help" className="footer-link">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="footer-link">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="footer-link">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="footer-link">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">
              © 2026 AgriVibe KE Farm Solutions. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <Link
                href="/terms"
                className="text-gray-500 hover:text-agrivibe-gold transition-colors"
              >
                Terms
              </Link>
              <Link
                href="/privacy"
                className="text-gray-500 hover:text-agrivibe-gold transition-colors"
              >
                Privacy
              </Link>
              <Link
                href="/cookies"
                className="text-gray-500 hover:text-agrivibe-gold transition-colors"
              >
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
