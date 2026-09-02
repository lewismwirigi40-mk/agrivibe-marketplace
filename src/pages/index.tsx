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
  Quote,
  Heart,
  Zap,
  Store,
  Crown,
  Gift,
  ThumbsUp,
  Globe,
  Phone,
  Mail,
} from "lucide-react";
import api from "../services/api";

export default function Home() {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // REAL DATA STATES
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const { scrollYProgress } = useScroll({
    offset: ["start start", "end start"],
  });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // ✅ Animated Counter Hook (defined once at top level)
  const useCounter = (target: number, duration = 2000) => {
    const [count, setCount] = useState(0);
    useEffect(() => {
      let startTime: number;
      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        setCount(Math.floor(progress * target));
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      requestAnimationFrame(animate);
    }, [target, duration]);
    return count;
  };

  // ✅ ALL COUNTERS CALLED AT TOP LEVEL (NOT INSIDE MAP)
  const studentsCount = useCounter(15000, 2500);
  const vendorsCount = useCounter(800, 2000);
  const productsCount = useCounter(5000, 2000);
  const satisfactionCount = useCounter(98, 1800);

  // FETCH REAL DATA
  useEffect(() => {
    setIsHydrated(true);
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);

      // Fetch products
      const productsRes = await api.get("/products?limit=4");
      const productsData = productsRes.data.products || [];
      setProducts(productsData);

      // Fetch categories
      const categoriesRes = await api.get("/categories");
      setCategories(categoriesRes.data.categories || []);
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

  // Testimonials
  const testimonials = [
    {
      id: 1,
      name: "James Mwangi",
      role: "Vendor, Kiambu",
      quote:
        "AgriVibe has transformed my agribusiness. I've increased my sales by 300% since joining the platform.",
      avatar: "🌾",
      rating: 5,
    },
    {
      id: 2,
      name: "Dr. Sarah Kariuki",
      role: "Student, JKUAT",
      quote:
        "I love the convenience of ordering fresh produce directly from campus. The quality is always top-notch!",
      avatar: "👩‍🎓",
      rating: 5,
    },
    {
      id: 3,
      name: "Peter Otieno",
      role: "Farmer, Nakuru",
      quote:
        "Before AgriVibe, I struggled to find markets for my produce. Now I have a steady income and happy customers.",
      avatar: "🚜",
      rating: 5,
    },
  ];

  const whatsappNumber = "254700000000";
  const preFilledMessage = encodeURIComponent(
    "Hello AgriVibe! I would like to make an inquiry.",
  );
  const targetUrl = `https://wa.me/${whatsappNumber}?text=${preFilledMessage}`;

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

      {/* ====== MOBILE MENU ====== */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed top-0 left-0 w-80 h-full bg-white shadow-2xl z-50 lg:hidden overflow-y-auto"
            >
              <div className="p-6">
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

                <div className="border-t border-gray-100 my-6" />
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
          {/* ✅ ADDED: mx-auto text-center to center everything */}
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="badge-premium text-sm inline-flex">
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
              className="text-premium mt-6 max-w-2xl mx-auto"
            >
              Buy directly from verified vendors and local farmers with secure
              payments and last-mile delivery across all Kenyan universities.
            </motion.p>

            {/* ✅ Center the buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 mt-8 justify-center"
            >
              <button
                onClick={() => router.push("/marketplace")}
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

            {/* ✅ Center the trust badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-6 mt-10 justify-center"
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

      {/* ====== STATS SECTION WITH ANIMATED COUNTERS (FIXED) ====== */}
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
            <p className="text-muted mt-2">
              🌍 Connecting farmers, vendors, and students nationwide
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              {
                count: studentsCount,
                label: "Students Served",
                icon: Users,
                suffix: "+",
                description: "Across 22 campuses",
                color: "from-blue-500 to-blue-600",
              },
              {
                count: vendorsCount,
                label: "Verified Vendors",
                icon: Store,
                suffix: "+",
                description: "Trusted sellers",
                color: "from-green-500 to-emerald-500",
              },
              {
                count: productsCount,
                label: "Fresh Products",
                icon: Layers,
                suffix: "+",
                description: "Daily listings",
                color: "from-purple-500 to-purple-600",
              },
              {
                count: satisfactionCount,
                label: "Satisfaction Rate",
                icon: Star,
                suffix: "%",
                description: "Happy customers",
                color: "from-yellow-500 to-orange-500",
              },
            ].map((stat, index) => {
              const Icon = stat.icon;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="card-premium p-8 text-center group"
                >
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all`}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-4xl font-bold text-gradient-green">
                    {stat.count}
                    {stat.suffix}
                  </div>
                  <div className="text-gray-800 mt-1 font-bold text-lg">
                    {stat.label}
                  </div>
                  <div className="text-gray-400 text-sm mt-1">
                    {stat.description}
                  </div>
                  <div className="w-full h-1 bg-gray-200 rounded-full mt-3 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: "100%" }}
                      transition={{ duration: 1.5, delay: 0.2 + index * 0.1 }}
                      className={`h-full bg-gradient-to-r ${stat.color} rounded-full`}
                    />
                  </div>
                </motion.div>
              );
            })}
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
                  { name: "Vegetables", icon: "🥬" },
                  { name: "Fruits", icon: "🍎" },
                  { name: "Meat", icon: "🥩" },
                  { name: "Dairy", icon: "🥛" },
                  { name: "Grains", icon: "🌾" },
                  { name: "Organic", icon: "🫐" },
                ].map((cat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -12, scale: 1.05 }}
                    onClick={() => handleCategoryClick(cat.name)}
                    className="category-card cursor-pointer"
                  >
                    <div className="category-icon text-2xl">{cat.icon}</div>
                    <h3 className="font-bold text-gray-900">{cat.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">50+</p>
                  </motion.div>
                ))}
          </div>
        </div>
      </section>

      {/* ====== FEATURED PRODUCTS - STATIC SHOWCASE ====== */}
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
              <p className="text-muted mt-2">
                Premium quality from our top vendors
              </p>
            </div>
            <Link
              href="/marketplace"
              className="btn-ghost hover:bg-agrivibe-green hover:text-white transition-all"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          {/* Premium Static Featured Products */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                id: 1,
                name: "Fresh Organic Tomatoes",
                price: 150,
                vendor: "Green Farm",
                location: "Nyeri",
                image:
                  "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&h=400&fit=crop&auto=format",
                badge: "🌱 Organic",
                badgeColor: "bg-agrivibe-green",
                is_organic: true,
              },
              {
                id: 2,
                name: "Premium Hass Avocado",
                price: 200,
                vendor: "Avocado Paradise",
                location: "Kiambu",
                image:
                  "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=600&h=400&fit=crop&auto=format",
                badge: "🌟 Premium",
                badgeColor: "bg-gradient-to-r from-yellow-400 to-orange-400",
                is_organic: true,
              },
              {
                id: 3,
                name: "Organic Kale Bunch",
                price: 80,
                vendor: "Healthy Greens",
                location: "Nairobi",
                image:
                  "https://images.unsplash.com/photo-1524179094475-0a6c6a89df4a?w=600&h=400&fit=crop&auto=format",
                badge: "🌱 Organic",
                badgeColor: "bg-agrivibe-green",
                is_organic: true,
              },
              {
                id: 4,
                name: "Sweet Pineapple",
                price: 180,
                vendor: "Tropical Fruits",
                location: "Thika",
                image:
                  "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=600&h=400&fit=crop&auto=format",
                badge: "🔥 Fresh",
                badgeColor: "bg-gradient-to-r from-red-400 to-orange-400",
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
                onClick={() => router.push("/marketplace")}
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Premium Badge */}
                  <div className="absolute top-3 left-3">
                    <span
                      className={`${product.badgeColor} text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg`}
                    >
                      {product.badge}
                    </span>
                  </div>

                  {/* Rating */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-white text-sm font-semibold">
                      4.8
                    </span>
                  </div>

                  {/* Quick View Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push("/marketplace");
                      }}
                      className="bg-white text-gray-900 px-6 py-3 rounded-xl font-bold hover:bg-agrivibe-green hover:text-white transition-all duration-300 transform -translate-y-4 group-hover:translate-y-0"
                    >
                      Shop Now →
                    </button>
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg group-hover:text-agrivibe-green transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-500">{product.vendor}</p>
                    </div>
                    {product.is_organic && (
                      <span className="text-xs font-medium text-agrivibe-green bg-green-50 px-2 py-1 rounded-full border border-green-200">
                        🌱 Organic
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                    <MapPin className="w-3 h-3" />
                    <span>{product.location}</span>
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

      {/* ====== TESTIMONIALS SECTION ====== */}
      <section className="section-premium bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="container-premium">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="badge-gold">
              <Quote className="w-4 h-4" />
              Testimonials
            </span>
            <h2 className="heading-2 mt-4">
              What Our{" "}
              <span className="text-gradient-green">Community Says</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-agrivibe-green to-emerald-500 flex items-center justify-center text-2xl">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex text-yellow-400 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  "{testimonial.quote}"
                </p>
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

      {/* ====== FOOTER ====== */}
      <footer className="footer-premium py-16">
        <div className="container-premium">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 mb-12">
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

      {/* ====== FLOATING WHATSAPP BUTTON - Bottom Right ====== */}
      <a
        href={targetUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl transition-all duration-300 hover:scale-110 hover:bg-[#20ba5a] active:scale-95"
        style={{
          boxShadow: "0 4px 14px 0 rgba(37, 211, 102, 0.4)",
        }}
        title="Chat with us on WhatsApp"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-7 w-7"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>

      {/* ====== FLOATING AI CHAT BUTTON - Bottom Left ====== */}
      <motion.button
        onClick={() => router.push("/ai-chat")}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 left-6 z-50 group"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative flex items-center gap-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-5 py-3 rounded-2xl shadow-2xl shadow-purple-500/40 hover:shadow-purple-500/60 transition-all duration-300">
            <div className="relative">
              <svg
                className="w-6 h-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z" />
                <path d="M9 15v1" strokeLinecap="round" />
                <path d="M15 15v1" strokeLinecap="round" />
                <path
                  d="M9 11a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1"
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse border-2 border-white" />
            </div>
            <span className="font-bold text-sm hidden sm:inline">
              AgriVibe AI
            </span>
            <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 bg-white/20 rounded-full text-xs">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              Online
            </div>
          </div>
        </div>
      </motion.button>
    </div>
  );
}
